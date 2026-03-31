import crypto from 'crypto';
import { cookies } from 'next/headers';

// -- Code hashing (SHA-256, sufficient for high-entropy random codes) --
export function hashCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex');
}

// -- Generate random member code (12 chars alphanumeric) --
export function generateCode(): string {
  return crypto.randomBytes(8).toString('base64url').slice(0, 12).toUpperCase();
}

// -- AES-256-GCM session encryption --
function getSessionKey(): Buffer {
  const secret = process.env.SESSION_SECRET || 'dev-secret-change-in-production-32c';
  return crypto.createHash('sha256').update(secret).digest();
}

export function encryptSession(payload: Record<string, unknown>): string {
  const key = getSessionKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const json = JSON.stringify(payload);
  const encrypted = Buffer.concat([cipher.update(json, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64url');
}

export function decryptSession(token: string): Record<string, unknown> | null {
  try {
    const key = getSessionKey();
    const data = Buffer.from(token, 'base64url');
    const iv = data.subarray(0, 12);
    const tag = data.subarray(12, 28);
    const encrypted = data.subarray(28);
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return JSON.parse(decrypted.toString('utf8'));
  } catch {
    return null;
  }
}

// -- Cookie helpers --
const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

export function setMemberSession(memberId: number, name: string, company: string | null) {
  const token = encryptSession({
    memberId,
    name,
    company,
    type: 'member',
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
  });
  cookies().set('aea_session', token, { ...COOKIE_OPTS, maxAge: 30 * 24 * 60 * 60 });
}

export function clearMemberSession() {
  cookies().set('aea_session', '', { ...COOKIE_OPTS, maxAge: 0 });
}

export function getMemberSession(): { memberId: number; name: string; company: string | null } | null {
  const cookie = cookies().get('aea_session');
  if (!cookie?.value) return null;
  const payload = decryptSession(cookie.value);
  if (!payload || payload.type !== 'member') return null;
  if (typeof payload.exp === 'number' && payload.exp < Date.now()) return null;
  return {
    memberId: payload.memberId as number,
    name: payload.name as string,
    company: (payload.company as string) || null,
  };
}

export function setAdminSession() {
  const token = encryptSession({
    type: 'admin',
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  });
  cookies().set('aea_admin', token, { ...COOKIE_OPTS, maxAge: 24 * 60 * 60 });
}

export function getAdminSession(): boolean {
  const cookie = cookies().get('aea_admin');
  if (!cookie?.value) return false;
  const payload = decryptSession(cookie.value);
  if (!payload || payload.type !== 'admin') return false;
  if (typeof payload.exp === 'number' && payload.exp < Date.now()) return false;
  return true;
}

export function verifyAdminSecret(secret: string): boolean {
  const expected = process.env.ADMIN_SECRET;
  if (!expected) return false;
  try {
    return crypto.timingSafeEqual(
      Buffer.from(secret),
      Buffer.from(expected)
    );
  } catch {
    return false;
  }
}

// -- Rate limiting (in-memory, single instance) --
const rateLimits = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, maxAttempts: number, windowMs: number): boolean {
  const now = Date.now();
  // Cleanup stale entries periodically
  if (rateLimits.size > 1000) {
    rateLimits.forEach((v, k) => {
      if (v.resetAt < now) rateLimits.delete(k);
    });
  }
  const entry = rateLimits.get(key);
  if (!entry || entry.resetAt < now) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= maxAttempts) return false;
  entry.count++;
  return true;
}

// -- Demo tracking via cookie --
export function getDemoCount(): { count: number; date: string } {
  const cookie = cookies().get('aea_rr_demo');
  if (!cookie?.value) return { count: 0, date: new Date().toISOString().split('T')[0] };
  const payload = decryptSession(cookie.value);
  if (!payload) return { count: 0, date: new Date().toISOString().split('T')[0] };
  const today = new Date().toISOString().split('T')[0];
  if (payload.date !== today) return { count: 0, date: today };
  return { count: (payload.count as number) || 0, date: today };
}

export function incrementDemoCount() {
  const { count } = getDemoCount();
  const today = new Date().toISOString().split('T')[0];
  const token = encryptSession({ count: count + 1, date: today, type: 'demo' });
  cookies().set('aea_rr_demo', token, { ...COOKIE_OPTS, maxAge: 24 * 60 * 60 });
}
