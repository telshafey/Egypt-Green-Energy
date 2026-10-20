/**
 * Security & Cryptography Utilities for Admin Portal
 * Uses native Web Crypto API (PBKDF2-SHA256, 100,000 iterations, 16-byte random salt)
 * No plain-text passwords stored anywhere.
 */

export interface PasswordHashResult {
  hash: string;
  salt: string;
  iterations: number;
}

// Convert ArrayBuffer to Hex String
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Convert Hex String to Uint8Array
function hexToBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/**
 * Generate a cryptographically secure random salt
 */
export function generateSalt(length = 16): string {
  const salt = new Uint8Array(length);
  crypto.getRandomValues(salt);
  return bufferToHex(salt.buffer);
}

/**
 * Hash password using PBKDF2 with SHA-256 and 100,000 iterations
 */
export async function hashPassword(password: string, customSalt?: string): Promise<PasswordHashResult> {
  const saltHex = customSalt || generateSalt(16);
  const saltBytes = hexToBuffer(saltHex);
  const enc = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const iterations = 100000;
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes as unknown as BufferSource,
      iterations,
      hash: 'SHA-256',
    },
    passwordKey,
    256
  );

  const hashHex = bufferToHex(derivedBits);
  return {
    hash: hashHex,
    salt: saltHex,
    iterations,
  };
}

/**
 * Verify password against stored hash and salt in constant time
 */
export async function verifyPassword(password: string, storedHash: string, salt: string): Promise<boolean> {
  try {
    const result = await hashPassword(password, salt);
    // Constant-time comparison
    if (result.hash.length !== storedHash.length) return false;
    let match = 0;
    for (let i = 0; i < storedHash.length; i++) {
      match |= result.hash.charCodeAt(i) ^ storedHash.charCodeAt(i);
    }
    return match === 0;
  } catch {
    return false;
  }
}

/**
 * Login Rate Limiting Guard
 * Max 5 failed attempts, locks for 15 minutes
 */
const RATE_LIMIT_KEY = 'ege_admin_login_rate_limit';
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

export interface RateLimitStatus {
  isLocked: boolean;
  remainingAttempts: number;
  lockoutRemainingSeconds: number;
}

export function checkLoginRateLimit(): RateLimitStatus {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    if (!raw) {
      return { isLocked: false, remainingAttempts: MAX_ATTEMPTS, lockoutRemainingSeconds: 0 };
    }
    const data = JSON.parse(raw);
    const now = Date.now();
    if (data.lockedUntil && data.lockedUntil > now) {
      const remainingSecs = Math.ceil((data.lockedUntil - now) / 1000);
      return { isLocked: true, remainingAttempts: 0, lockoutRemainingSeconds: remainingSecs };
    }
    // Expired lockout
    if (data.lockedUntil && data.lockedUntil <= now) {
      localStorage.removeItem(RATE_LIMIT_KEY);
      return { isLocked: false, remainingAttempts: MAX_ATTEMPTS, lockoutRemainingSeconds: 0 };
    }
    const attempts = data.attempts || 0;
    const remaining = Math.max(0, MAX_ATTEMPTS - attempts);
    return { isLocked: false, remainingAttempts: remaining, lockoutRemainingSeconds: 0 };
  } catch {
    return { isLocked: false, remainingAttempts: MAX_ATTEMPTS, lockoutRemainingSeconds: 0 };
  }
}

export function recordFailedLoginAttempt(): RateLimitStatus {
  try {
    const status = checkLoginRateLimit();
    if (status.isLocked) return status;

    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    const data = raw ? JSON.parse(raw) : { attempts: 0 };
    data.attempts = (data.attempts || 0) + 1;

    if (data.attempts >= MAX_ATTEMPTS) {
      data.lockedUntil = Date.now() + LOCKOUT_MS;
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
      return { isLocked: true, remainingAttempts: 0, lockoutRemainingSeconds: Math.ceil(LOCKOUT_MS / 1000) };
    }

    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
    return {
      isLocked: false,
      remainingAttempts: MAX_ATTEMPTS - data.attempts,
      lockoutRemainingSeconds: 0,
    };
  } catch {
    return { isLocked: false, remainingAttempts: 1, lockoutRemainingSeconds: 0 };
  }
}

export function resetLoginRateLimit(): void {
  try {
    localStorage.removeItem(RATE_LIMIT_KEY);
  } catch {
    // Ignore
  }
}

/**
 * SVG Sanitizer: Strips scripts, event handlers, and unsafe elements to prevent XSS
 */
export function sanitizeSvg(svgContent: string): { isValid: boolean; sanitized: string; error?: string } {
  if (!svgContent || typeof svgContent !== 'string') {
    return { isValid: false, sanitized: '', error: 'الملف غير صالح أو فارغ.' };
  }

  const clean = svgContent.trim();
  // Must start with SVG or XML tag
  if (!clean.includes('<svg') || !clean.includes('</svg>')) {
    return { isValid: false, sanitized: '', error: 'ملف SVG غير صالح (لا يحتوي على وسوم svg).' };
  }

  // Reject malicious payloads
  const dangerousPatterns = [
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /onload\s*=/gi,
    /onerror\s*=/gi,
    /onclick\s*=/gi,
    /onmouseover\s*=/gi,
    /<foreignObject[\s\S]*?>[\s\S]*?<\/foreignObject>/gi,
    /<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi,
    /<object[\s\S]*?>[\s\S]*?<\/object>/gi,
    /<embed[\s\S]*?>[\s\S]*?<\/embed>/gi,
  ];

  let sanitized = clean;
  for (const pattern of dangerousPatterns) {
    if (pattern.test(sanitized)) {
      sanitized = sanitized.replace(pattern, '');
    }
  }

  return { isValid: true, sanitized };
}
