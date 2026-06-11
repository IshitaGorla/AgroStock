import { createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } from 'node:crypto';

export type EmployeeRole = 'security' | 'quality_inspector' | 'weighbridge' | 'admin' | 'stock_manager';

export type SessionUser = {
  id: number;
  role: EmployeeRole;
};

const TOKEN_TTL_SECONDS = 60 * 60 * 12;
const PBKDF2_ITERATIONS = 120000;

function secret() {
  const value = process.env.AUTH_SECRET;

  if (!value) {
    throw new Error('AUTH_SECRET is not set');
  }

  return value;
}

function base64Url(value: Buffer | string) {
  return Buffer.from(value).toString('base64url');
}

function sign(value: string) {
  return createHmac('sha256', secret()).update(value).digest('base64url');
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('base64url');
  const hash = pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, 32, 'sha256').toString('base64url');

  return `pbkdf2_sha256$${PBKDF2_ITERATIONS}$${salt}$${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [algorithm, iterations, salt, hash] = storedHash.split('$');

  if (algorithm !== 'pbkdf2_sha256' || !iterations || !salt || !hash) {
    return false;
  }

  const computed = pbkdf2Sync(password, salt, Number(iterations), 32, 'sha256');
  const expected = Buffer.from(hash, 'base64url');

  return expected.length === computed.length && timingSafeEqual(expected, computed);
}

export function createToken(user: SessionUser) {
  const payload = base64Url(
    JSON.stringify({
      exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
      id: user.id,
      role: user.role,
    }),
  );
  const signature = sign(payload);

  return `${payload}.${signature}`;
}

export function verifyToken(token: string | null) {
  if (!token) {
    return null;
  }

  const [payload, signature] = token.split('.');

  if (!payload || !signature || sign(payload) !== signature) {
    return null;
  }

  const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString()) as SessionUser & { exp: number };

  if (!decoded.id || decoded.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return { id: decoded.id, role: decoded.role };
}

export function bearerToken(request: Request) {
  const authorization = request.headers.get('authorization') ?? '';

  return authorization.startsWith('Bearer ') ? authorization.slice('Bearer '.length) : null;
}
