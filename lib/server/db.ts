import { Pool } from 'pg';

let pool: Pool | undefined;

export function db() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL is not set');
    }

    pool = new Pool({
      connectionString,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    });
  }

  return pool;
}

export function toNumber(value: unknown) {
  return Number(value ?? 0);
}
