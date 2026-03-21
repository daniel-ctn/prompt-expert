import { neon } from '@neondatabase/serverless';
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schema';

export type Database = NeonHttpDatabase<typeof schema>;

const globalForDb = globalThis as unknown as {
  db: Database | undefined;
};

function createDb(): Database {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. Please configure your environment variables.',
    );
  }
  const sql = neon(url);
  return drizzle({ client: sql, schema });
}

export function getDb(): Database {
  if (!globalForDb.db) {
    globalForDb.db = createDb();
  }
  return globalForDb.db;
}
