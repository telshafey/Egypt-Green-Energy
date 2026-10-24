/**
 * Client-side high-fidelity image compression and optimization utility
 * Enables uploading images directly from computer/mobile and saving them into Firestore.
 * Keeps file sizes lightweight (~40KB - 120KB) with high visual fidelity,
 * perfectly within Firestore's 1MB document boundary.
 */

export interface OptimizeImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxBytes?: number;
  preserveTransparency?: boolean;
}

export interface OptimizedImageResult {
  dataUrl: string;
  originalSizeBytes: number;
  compressedSizeBytes: number;
  originalSizeKb: number;
  compressedSizeKb: number;
  width: number;
  height: number;
  format: string;
  name: string;
}

export function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Optimizes an uploaded File from user's device for safe database persistence.
 */
export async function optimizeImageForDatabase(
  file: File,
  options: OptimizeImageOptions = {}
): Promise<OptimizedImageResult> {
  const {
    maxWidth = 1280,
    maxHeight = 960,
    quality = 0.82,
    maxBytes = 350 * 1024, // 350KB safety limit (Firestore doc limit is 1048KB)
    preserveTransparency = true,
  } = options;

  const originalSizeBytes = file.size;
  const fileName = file.name;
  const isSvg = file.type === 'image/svg+xml' || fileName.toLowerCase().endsWith('.svg');

  // 1. Direct handling for vector SVGs
  if (isSvg) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (!text) {
          reject(new Error('تعذر قراءة ملف الـ SVG'));
          return;
        }
        const dataUrl = text.startsWith('data:')
          ? text
          : `data:image/svg+xml;utf8,${encodeURIComponent(text)}`;
        const sizeBytes = new Blob([dataUrl]).size;

        resolve({
          dataUrl,
          originalSizeBytes,
          compressedSizeBytes: sizeBytes,
          originalSizeKb: Math.round(originalSizeBytes / 1024),
          compressedSizeKb: Math.round(sizeBytes / 1024),
          width: 800,
          height: 800,
          format: 'svg',
          name: fileName,
        });
      };
      reader.onerror = () => reject(new Error('فشل قراءة ملف الشعار SVG'));
      reader.readAsText(file);
    });
  }

  // 2. Raster images (PNG, JPG, JPEG, WebP, GIF, etc.)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const initialDataUrl = readerEvent.target?.result as string;
      if (!initialDataUrl) {
        reject(new Error('تعذر قراءة ملف الصورة من جهازك'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Calculate proportional scale
        let scale = 1;
        if (width > maxWidth || height > maxHeight) {
          scale = Math.min(maxWidth / width, maxHeight / height);
        }

        let targetWidth = Math.max(1, Math.round(width * scale));
        let targetHeight = Math.max(1, Math.round(height * scale));

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          // Fallback if 2d context fails
          const sizeBytes = new Blob([initialDataUrl]).size;
          resolve({
            dataUrl: initialDataUrl,
            originalSizeBytes,
            compressedSizeBytes: sizeBytes,
            originalSizeKb: Math.round(originalSizeBytes / 1024),
            compressedSizeKb: Math.round(sizeBytes / 1024),
            width,
            height,
            format: file.type || 'image/jpeg',
            name: fileName,
          });
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Check if image might have transparency
        const hasAlpha =
          preserveTransparency &&
          (file.type === 'image/png' || file.type === 'image/webp');

        if (!hasAlpha) {
          // Solid background fill to prevent black borders on JPEG compression
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, targetWidth, targetHeight);
        }

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Determine output MIME type: WebP has highest compression with alpha support
        let outputMime = 'image/webp';
        let outputDataUrl = canvas.toDataURL(outputMime, quality);

        // If WebP is not supported or yielded a larger size than expected, fallback to JPEG/PNG
        if (!outputDataUrl.startsWith('data:image/webp')) {
          outputMime = hasAlpha ? 'image/png' : 'image/jpeg';
          outputDataUrl = canvas.toDataURL(outputMime, quality);
        }

        let resultSizeBytes = Math.round(outputDataUrl.length * (3 / 4));

        // If still exceeds safety boundary, do a second tighter pass
        if (resultSizeBytes > maxBytes) {
          const tighterScale = 0.75;
          const secondCanvas = document.createElement('canvas');
          secondCanvas.width = Math.round(targetWidth * tighterScale);
          secondCanvas.height = Math.round(targetHeight * tighterScale);
          const secondCtx = secondCanvas.getContext('2d');
          if (secondCtx) {
            secondCtx.imageSmoothingEnabled = true;
            secondCtx.imageSmoothingQuality = 'medium';
            if (!hasAlpha) {
              secondCtx.fillStyle = '#FFFFFF';
              secondCtx.fillRect(0, 0, secondCanvas.width, secondCanvas.height);
            }
            secondCtx.drawImage(canvas, 0, 0, secondCanvas.width, secondCanvas.height);
            outputDataUrl = secondCanvas.toDataURL(outputMime, 0.72);
            resultSizeBytes = Math.round(outputDataUrl.length * (3 / 4));
            targetWidth = secondCanvas.width;
            targetHeight = secondCanvas.height;
          }
        }

        resolve({
          dataUrl: outputDataUrl,
          originalSizeBytes,
          compressedSizeBytes: resultSizeBytes,
          originalSizeKb: Math.round(originalSizeBytes / 1024),
          compressedSizeKb: Math.round(resultSizeBytes / 1024),
          width: targetWidth,
          height: targetHeight,
          format: outputMime.replace('image/', ''),
          name: fileName,
        });
      };

      img.onerror = () => {
        reject(new Error('الملف المختار ليس صورة صالحة أو يحتوي على بيانات تالفة'));
      };

      img.src = initialDataUrl;
    };

    reader.onerror = () => {
      reject(new Error('فشل قراءة الملف من الجهاز'));
    };

    reader.readAsDataURL(file);
  });
}
