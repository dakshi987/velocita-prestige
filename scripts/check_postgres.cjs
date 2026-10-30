require('dotenv').config();

const { Client } = require('pg');

async function checkPostgresConnection() {
  const connectionString = process.env.DATABASE_URL;
  const hasDiscreteConfig = process.env.PGHOST && process.env.PGDATABASE && process.env.PGUSER;

  if (!connectionString && !hasDiscreteConfig) {
    throw new Error('PostgreSQL is not configured. Set DATABASE_URL or PGHOST, PGDATABASE, and PGUSER in .env.');
  }

  const client = new Client(connectionString
    ? {
        connectionString,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000,
      }
    : {
        host: process.env.PGHOST,
        port: Number(process.env.PGPORT || 5432),
        database: process.env.PGDATABASE,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000,
      });

  try {
    await client.connect();
    const result = await client.query('SELECT 1 AS connection_ok;');

    if (result.rows[0]?.connection_ok !== 1) {
      throw new Error('The test query returned an unexpected result.');
    }

    console.log('[PostgreSQL] Connection successful. SELECT 1 returned 1.');
  } finally {
    await client.end();
  }
}

checkPostgresConnection().catch((error) => {
  console.error(`[PostgreSQL] Connection check failed: ${error.message}`);
  process.exitCode = 1;
});