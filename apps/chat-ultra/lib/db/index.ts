import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/db/schema';

// Lazy initialization to avoid requiring DATABASE_URL at build time
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

function initDb(): ReturnType<typeof drizzle<typeof schema>> {
  if (!_db) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    const connectionString = process.env.DATABASE_URL;
    const client = postgres(connectionString, { max: 1 });
    _db = drizzle(client, { schema });
  }
  return _db;
}

// Initialize on first access
export const db: ReturnType<typeof drizzle<typeof schema>> = initDb();

export type Database = typeof db;

