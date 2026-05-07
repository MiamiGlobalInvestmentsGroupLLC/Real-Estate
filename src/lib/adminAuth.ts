import { createHmac, timingSafeEqual } from 'crypto';

const TOKEN_TTL = 8 * 60 * 60 * 1000; // 8 hours

export function createAdminToken(): string {
  const payload = JSON.stringify({ admin: true, exp: Date.now() + TOKEN_TTL });
  const encoded = Buffer.from(payload).toString('base64url');
  const secret = process.env.ADMIN_JWT_SECRET!;
  const sig = createHmac('sha256', secret).update(encoded).digest('base64url');
  return `${encoded}.${sig}`;
}

export function verifyAdminToken(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return false;
    const [encoded, sig] = parts;
    const secret = process.env.ADMIN_JWT_SECRET!;
    const expected = createHmac('sha256', secret).update(encoded).digest('base64url');
    const a = Buffer.from(sig, 'base64url');
    const b = Buffer.from(expected, 'base64url');
    if (a.length !== b.length) return false;
    if (!timingSafeEqual(a, b)) return false;
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString());
    return typeof payload.exp === 'number' && Date.now() < payload.exp;
  } catch {
    return false;
  }
}
