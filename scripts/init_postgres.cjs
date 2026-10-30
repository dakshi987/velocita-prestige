const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function getPgClient() {
  const host = process.env.PGHOST;
  const port = Number(process.env.PGPORT || 5432);
  const user = process.env.PGUSER;
  const password = process.env.PGPASSWORD;
  const database = process.env.PGDATABASE || 'defaultdb';

  let connectionString = process.env.DATABASE_URL;
  if (connectionString && !connectionString.startsWith('postgres://') && !connectionString.startsWith('postgresql://')) {
    if (connectionString.startsWith('@')) {
      connectionString = `postgres://${user || 'avnadmin'}:${password ? encodeURIComponent(password) : ''}${connectionString}`;
    } else {
      connectionString = `postgres://${connectionString}`;
    }
  }

  // Attempt using discrete config first with SSL
  console.log(`[PostgreSQL] Attempting connection to ${host || 'host'}:${port}/${database}...`);
  const client = new Client({
    host,
    port,
    user,
    password,
    database,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  return client;
}

async function run() {
  const schemaPath = path.resolve(__dirname, '../schema.sql');
  if (!fs.existsSync(schemaPath)) {
    throw new Error(`schema.sql not found at ${schemaPath}`);
  }

  const rawSql = fs.readFileSync(schemaPath, 'utf8');

  // Convert CREATE TYPE to safe idempotent blocks
  const enums = [
    { name: 'user_role', values: "'customer', 'admin', 'fleet_manager'" },
    { name: 'vehicle_category', values: "'economy', 'sedan', 'suv', 'luxury', 'van', 'sports'" },
    { name: 'transmission_type', values: "'automatic', 'manual'" },
    { name: 'fuel_type', values: "'petrol', 'diesel', 'electric', 'hybrid'" },
    { name: 'vehicle_status', values: "'available', 'rented', 'maintenance', 'archived'" },
    { name: 'booking_status', values: "'pending', 'confirmed', 'active', 'completed', 'cancelled', 'rejected'" },
    { name: 'payment_status', values: "'unpaid', 'paid', 'refunded', 'failed'" },
    { name: 'payment_method', values: "'credit_card', 'debit_card', 'bank_transfer', 'test_gateway', 'cash'" },
  ];

  let client;
  try {
    client = await getPgClient();
    await client.connect();
    console.log('[PostgreSQL] Successfully connected to database!');
  } catch (connErr) {
    console.error('[PostgreSQL] Connection failed:', connErr.message);
    if (connErr.code === 'ENOTFOUND') {
      console.error('\n[DIAGNOSIS]');
      console.error(`Hostname "${process.env.PGHOST}" could not be resolved by DNS.`);
      console.error('If you are using Aiven Cloud:');
      console.error('1. Check if the Aiven service is currently "Power On" (services in idle/free tier may auto-sleep).');
      console.error('2. Check the Service URI in Aiven Console to ensure the hostname or port has not changed.');
      console.error('3. Ensure external connections are enabled in your Aiven service IP filter (allow all 0.0.0.0/0).');
    }
    process.exit(1);
  }

  try {
    console.log('[PostgreSQL] Ensuring extensions and enum types exist...');
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    for (const e of enums) {
      await client.query(`
        DO $$ BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = '${e.name}') THEN
            CREATE TYPE ${e.name} AS ENUM (${e.values});
          END IF;
        END $$;
      `);
    }

    console.log('[PostgreSQL] Creating tables from schema.sql...');
    // Clean rawSql by stripping out the raw CREATE TYPE statements since we executed them safely
    let modifiedSql = rawSql;
    for (const e of enums) {
      const regex = new RegExp(`CREATE\\s+TYPE\\s+${e.name}\\s+AS\\s+ENUM\\s*\\([^)]+\\);`, 'gi');
      modifiedSql = modifiedSql.replace(regex, `-- TYPE ${e.name} handled idempotently`);
    }

    await client.query(modifiedSql);
    console.log('[PostgreSQL] Successfully executed schema.sql!');

    // Query tables created
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    const tables = tablesRes.rows.map(r => r.table_name);
    console.log('\n[PostgreSQL] Verified tables in database:');
    tables.forEach(t => console.log(` - ${t}`));

    // Seed data from velocita_db.json if vehicles table is empty
    const countRes = await client.query('SELECT COUNT(*) as count FROM vehicles;');
    if (Number(countRes.rows[0].count) === 0) {
      const dbJsonPath = path.resolve(__dirname, '../data/velocita_db.json');
      if (fs.existsSync(dbJsonPath)) {
        console.log('\n[PostgreSQL] Seeding initial fleet and data from velocita_db.json...');
        const data = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));

        if (Array.isArray(data.users)) {
          for (const u of data.users) {
            await client.query(`
              INSERT INTO users (id, name, email, password_hash, phone, role, address, driver_license_number, is_active, created_at, updated_at)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
              ON CONFLICT (id) DO NOTHING;
            `, [
              u.id, u.name, u.email, u.passwordHash, u.phone || '',
              u.role || 'customer', u.address || null, u.driverLicenseNumber || null,
              u.isActive !== false, u.createdAt || new Date(), u.updatedAt || new Date()
            ]);
          }
          console.log(`[PostgreSQL] Seeded ${data.users.length} users.`);
        }

        if (Array.isArray(data.vehicles)) {
          for (const v of data.vehicles) {
            await client.query(`
              INSERT INTO vehicles (
                id, name, brand, model_year, category, registration_number, daily_rate,
                seating_capacity, transmission, fuel_type, mileage_limit, location,
                status, featured_image_url, gallery_image_urls, features, description,
                insurance_fee_per_day, deposit_amount, created_at, updated_at
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
              ON CONFLICT (id) DO NOTHING;
            `, [
              v.id, v.name, v.brand, v.modelYear, v.category, v.registrationNumber, v.dailyRate,
              v.seatingCapacity, v.transmission, v.fuelType, v.mileageLimit || 300, v.location,
              v.status, v.featuredImageUrl, v.galleryImageUrls || [], v.features || [], v.description,
              v.insuranceFeePerDay || 0, v.depositAmount || 0, v.createdAt || new Date(), v.updatedAt || new Date()
            ]);
          }
          console.log(`[PostgreSQL] Seeded ${data.vehicles.length} vehicles.`);
        }
      }
    }

    console.log('\n[PostgreSQL] All operations completed successfully.');
  } finally {
    await client.end();
  }
}

run().catch(err => {
  console.error('[PostgreSQL] Error:', err);
  process.exit(1);
});
