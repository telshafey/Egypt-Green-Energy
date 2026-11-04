import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Crop,
  Sliders,
  RotateCw,
  FlipHorizontal,
  Check,
  RefreshCw,
  Image as ImageIcon,
  Sparkles,
  Maximize2,
  FileImage,
  Zap,
} from 'lucide-react';
import { formatBytes } from '../utils/imageUploadHelper';

export interface ImageEditorResult {
  dataUrl: string;
  width: number;
  height: number;
  sizeKb: number;
  format: string;
  title: string;
}

interface ImageEditorModalProps {
  isOpen: boolean;
  imageUrl: string;
  imageTitle?: string;
  targetContext?: 'hero' | 'system' | 'project' | 'vendor' | 'logo' | 'general';
  onClose: () => void;
  onSave: (result: ImageEditorResult) => Promise<void> | void;
}

type AspectRatioType = '16:9' | '4:3' | '1:1' | 'free';

export const ImageEditorModal: React.FC<ImageEditorModalProps> = ({
  isOpen,
  imageUrl,
  imageTitle = 'صورة هندسية مخصصة',
  targetContext = 'general',
  onClose,
  onSave,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [title, setTitle] = useState<string>(imageTitle);

  // Default aspect ratio by context
  const defaultRatio: AspectRatioType =
    targetContext === 'logo' || targetContext === 'vendor'
      ? '1:1'
      : targetContext === 'hero' || targetContext === 'system' || targetContext === 'project'
      ? '16:9'
      : 'free';

  // Adjustments State
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>(defaultRatio);
  const [brightness, setBrightness] = useState<number>(0); // -50 to 50
  const [contrast, setContrast] = useState<number>(0); // -50 to 50
  const [saturation, setSaturation] = useState<number>(100); // 0 to 200
  const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270
  const [flipH, setFlipH] = useState<boolean>(false);
  const [outputFormat, setOutputFormat] = useState<'image/webp' | 'image/jpeg' | 'image/png'>('image/webp');
  const [quality, setQuality] = useState<number>(0.85);

  // Live Metric State
  const [previewSizeKb, setPreviewSizeKb] = useState<number>(0);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Load Image when imageUrl changes
  useEffect(() => {
    if (!isOpen || !imageUrl) return;

    setTitle(imageTitle);
    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      setSourceImage(img);
      setIsProcessing(false);
    };

    img.onerror = () => {
      setIsProcessing(false);
    };

    img.src = imageUrl;
  }, [isOpen, imageUrl, imageTitle]);

  // Render & process image on canvas whenever adjustment changes
  useEffect(() => {
    if (!sourceImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const originalW = sourceImage.naturalWidth || sourceImage.width;
    const originalH = sourceImage.naturalHeight || sourceImage.height;

    // 1. Calculate Crop Box based on Aspect Ratio
    let cropX = 0;
    let cropY = 0;
    let cropW = originalW;
    let cropH = originalH;

    if (aspectRatio === '16:9') {
      const targetRatio = 16 / 9;
      if (originalW / originalH > targetRatio) {
        cropW = originalH * targetRatio;
        cropX = (originalW - cropW) / 2;
      } else {
        cropH = originalW / targetRatio;
        cropY = (originalH - cropH) / 2;
      }
    } else if (aspectRatio === '4:3') {
      const targetRatio = 4 / 3;
      if (originalW / originalH > targetRatio) {
        cropW = originalH * targetRatio;
        cropX = (originalW - cropW) / 2;
      } else {
        cropH = originalW / targetRatio;
        cropY = (originalH - cropH) / 2;
      }
    } else if (aspectRatio === '1:1') {
      const size = Math.min(originalW, originalH);
      cropW = size;
      cropH = size;
      cropX = (originalW - size) / 2;
      cropY = (originalH - size) / 2;
    }

    // 2. Max Output Dimensions for High Fidelity & Lean Performance
    const maxDimension = targetContext === 'hero' ? 1600 : targetContext === 'logo' || targetContext === 'vendor' ? 800 : 1280;
    let finalW = Math.round(cropW);
    let finalH = Math.round(cropH);

    if (finalW > maxDimension || finalH > maxDimension) {
      const scale = Math.min(maxDimension / finalW, maxDimension / finalH);
      finalW = Math.max(1, Math.round(finalW * scale));
      finalH = Math.max(1, Math.round(finalH * scale));
    }

    // Handle rotation dimensions
    const isRotated90or270 = rotation % 180 !== 0;
    canvas.width = isRotated90or270 ? finalH : finalW;
    canvas.height = isRotated90or270 ? finalW : finalH;

    // Apply Filter String
    // brightness(1 + b/100), contrast(1 + c/100), saturate(s/100)
    const bVal = 1 + brightness / 100;
    const cVal = 1 + contrast / 100;
    const sVal = saturation / 100;
    ctx.filter = `brightness(${bVal}) contrast(${cVal}) saturate(${sVal})`;

    ctx.save();

    // Move to center of canvas for rotation and flip
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, 1);

    // Draw image centered
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      sourceImage,
      cropX,
      cropY,
      cropW,
      cropH,
      -finalW / 2,
      -finalH / 2,
      finalW,
      finalH
    );

    ctx.restore();

    // Update Dimensions and Estimated Size
    setDimensions({ width: canvas.width, height: canvas.height });

    try {
      const dataUrl = canvas.toDataURL(outputFormat, quality);
      const estBytes = Math.round(dataUrl.length * (3 / 4));
      setPreviewSizeKb(Math.round(estBytes / 1024));
    } catch {
      // fallback
    }
  }, [sourceImage, aspectRatio, brightness, contrast, saturation, rotation, flipH, outputFormat, quality, targetContext]);

  // Reset to original state
  const handleReset = () => {
    setAspectRatio(defaultRatio);
    setBrightness(0);
    setContrast(0);
    setSaturation(100);
    setRotation(0);
    setFlipH(false);
    setOutputFormat('image/webp');
    setQuality(0.85);
  };

  const handleApplyAndSave = async () => {
    if (!canvasRef.current) return;
    setIsSaving(true);
    try {
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL(outputFormat, quality);
      const estBytes = Math.round(dataUrl.length * (3 / 4));
      const sizeKb = Math.round(estBytes / 1024);

      await onSave({
        dataUrl,
        width: canvas.width,
        height: canvas.height,
        sizeKb,
        format: outputFormat.replace('image/', ''),
        title: title.trim() || 'صورة معدلة',
      });
      onClose();
    } catch (err: unknown) {
      console.error('Failed to export image from canvas', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>استوديو تعديل وضبط الصورة</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {dimensions.width}×{dimensions.height} px
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                قص ذكي بنسب معتمدة، ضبط السطوع والتشبع، تدوير، وضغط خفيف لقاعدة البيانات
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Canvas Preview (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-950/70 border border-slate-800 rounded-2xl p-4 min-h-[300px] relative">
            {isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 rounded-2xl z-10">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>جارِ تحميل وتحضير الصورة...</span>
                </div>
              </div>
            )}

            <div className="max-w-full max-h-[420px] overflow-hidden rounded-xl border border-slate-800 shadow-xl flex items-center justify-center">
              <canvas ref={canvasRef} className="max-w-full max-h-[400px] object-contain rounded-lg" />
            </div>

            {/* Live Size & Savings Strip */}
            <div className="mt-3 w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800/80 text-[11px] font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                <FileImage className="w-3.5 h-3.5 text-emerald-400" />
                <span>الحجم المتوقع:</span>
                <strong className="text-emerald-400">{previewSizeKb} KB</strong>
              </span>
              <span className="text-slate-400">
                صيغة الحفظ: <strong className="text-white uppercase">{outputFormat.replace('image/', '')}</strong>
              </span>
            </div>
          </div>

          {/* Right Tuning Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Image Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                اسم وعنوان الصورة
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="عنوان معبر للصورة..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Aspect Ratio Presets */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Crop className="w-3.5 h-3.5 text-emerald-400" />
                  <span>نسبة الأبعاد والقص (Aspect Ratio)</span>
                </label>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setAspectRatio('16:9')}
                  className={`px-2 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    aspectRatio === '16:9'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <span className="text-xs">16:9</span>
                  <span className="text-[9px] opacity-80">عريض / Hero</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAspectRatio('4:3')}
                  className={`px-2 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    aspectRatio === '4:3'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <span className="text-xs">4:3</span>
                  <span className="text-[9px] opacity-80">أنظمة فنية</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAspectRatio('1:1')}
                  className={`px-2 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    aspectRatio === '1:1'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <span className="text-xs">1:1</span>
                  <span className="text-[9px] opacity-80">مربع / شعار</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAspectRatio('free')}
                  className={`px-2 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    aspectRatio === 'free'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <span className="text-xs">حر</span>
                  <span className="text-[9px] opacity-80">الحجم الأصلي</span>
                </button>
              </div>
            </div>

            {/* Transform Controls (Rotate & Flip) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                التدوير والانعكاس
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5 text-emerald-400" />
                  <span>تدوير 90°</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFlipH((prev) => !prev)}
                  className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                    flipH
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200'
                  }`}
                >
                  <FlipHorizontal className="w-3.5 h-3.5 text-blue-400" />
                  <span>انعكاس أفقي</span>
                </button>
              </div>
            </div>

            {/* Sliders: Brightness, Contrast, Saturation */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3.5">
              {/* Brightness */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300 font-semibold">السطوع والإنارة</span>
                  <span className="text-emerald-400 font-mono text-[11px]">{brightness > 0 ? `+${brightness}` : brightness}%</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Contrast */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300 font-semibold">التباين والحدة</span>
                  <span className="text-emerald-400 font-mono text-[11px]">{contrast > 0 ? `+${contrast}` : contrast}%</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Saturation */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300 font-semibold">تشبع الألوان</span>
                  <span className="text-emerald-400 font-mono text-[11px]">{saturation}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={saturation}
                  onChange={(e) => setSaturation(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Format & Compression Quality */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">صيغة التصدير</label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="image/webp">WebP (موصى به - فائق الخفة)</option>
                  <option value="image/jpeg">JPEG (قياسي عالي الدقة)</option>
                  <option value="image/png">PNG (وضوح نقي للشعارات)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  جودة الضغط ({Math.round(quality * 100)}%)
                </label>
                <input
                  type="range"
                  min="0.6"
                  max="0.95"
                  step="0.05"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-emerald-500 mt-2 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>إعادة ضبط التعديلات</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              إلغاء
            </button>

            <button
              type="button"
              onClick={handleApplyAndSave}
              disabled={isSaving || isProcessing}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>جارِ المعالجة والحفظ...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>اعتماد وحفظ الصورة</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
