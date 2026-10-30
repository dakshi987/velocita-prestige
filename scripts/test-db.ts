import 'dotenv/config';
import { Client } from 'pg';

async function testDatabaseConnection() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set.');
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10_000,
  });

  try {
    console.log('[Supabase] Connecting using DATABASE_URL...');
    await client.connect();
    const result = await client.query('SELECT 1 AS connection_ok');
    if (result.rows[0]?.connection_ok !== 1) {
      throw new Error('The connection test query returned an unexpected result.');
    }

    console.log('Connected successfully!');
  } finally {
    await client.end();
  }
}

testDatabaseConnection().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[Supabase] Connection/query failed: ${message}`);
  process.exitCode = 1;
});
