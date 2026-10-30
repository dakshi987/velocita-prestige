import 'dotenv/config';
import { Pool } from 'pg';
import type { Booking, ContactMessage, User, Vehicle } from './db.ts';

let pool: Pool | undefined;

function getPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set; booking cannot be saved to Supabase.');
  }

  pool ??= new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10_000,
  });
  return pool;
}

export async function insertSupabaseBooking(booking: Booking) {
  const result = await getPool().query(
    `INSERT INTO bookings (
      id, booking_reference, user_id, vehicle_id, pickup_date, return_date,
      pickup_location, return_location, rental_days, daily_rate, currency,
      rental_subtotal, insurance_total, tax_total, deposit_amount, total_amount,
      status, special_requests, cancellation_reason, cancelled_at, created_at, updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
      $13, $14, $15, $16, $17, $18, $19, $20, $21, $22
    )
    RETURNING *`,
    [
      booking.id,
      booking.bookingReference,
      booking.userId,
      booking.vehicleId,
      booking.pickupDate,
      booking.returnDate,
      booking.pickupLocation,
      booking.returnLocation,
      booking.rentalDays,
      booking.dailyRate,
      booking.currency,
      booking.rentalSubtotal,
      booking.insuranceTotal,
      booking.taxTotal,
      booking.depositAmount,
      booking.totalAmount,
      booking.status,
      booking.specialRequests ?? null,
      booking.cancellationReason ?? null,
      booking.cancelledAt ?? null,
      booking.createdAt,
      booking.updatedAt,
    ],
  );
  return result.rows[0];
}

export async function insertSupabaseContactMessage(contactMessage: ContactMessage) {
  const result = await getPool().query(
    `INSERT INTO contact_messages (
      id, name, email, phone, subject, message, is_resolved, created_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *`,
    [
      contactMessage.id,
      contactMessage.name,
      contactMessage.email,
      contactMessage.phone ?? null,
      contactMessage.subject,
      contactMessage.message,
      contactMessage.isResolved,
      contactMessage.createdAt,
    ],
  );
  return result.rows[0];
}

export async function insertSupabaseUser(user: User) {
  const result = await getPool().query(
    `INSERT INTO users (
      id, name, email, password_hash, phone, role, address,
      driver_license_number, is_active, created_at, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING id, name, email, phone, role, address, driver_license_number, is_active, created_at, updated_at`,
    [
      user.id,
      user.name,
      user.email,
      user.passwordHash,
      user.phone,
      user.role,
      user.address ?? null,
      user.driverLicenseNumber ?? null,
      user.isActive,
      user.createdAt,
      user.updatedAt,
    ],
  );
  return result.rows[0];
}

export async function insertSupabaseVehicle(vehicle: Vehicle) {
  const result = await getPool().query(
    `INSERT INTO vehicles (
      id, name, brand, model_year, category, registration_number, daily_rate,
      seating_capacity, transmission, fuel_type, mileage_limit, location,
      status, featured_image_url, gallery_image_urls, features, description,
      insurance_fee_per_day, deposit_amount, created_at, updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
      $13, $14, $15, $16, $17, $18, $19, $20, $21
    )
    RETURNING *`,
    [
      vehicle.id,
      vehicle.name,
      vehicle.brand,
      vehicle.modelYear,
      vehicle.category,
      vehicle.registrationNumber,
      vehicle.dailyRate,
      vehicle.seatingCapacity,
      vehicle.transmission,
      vehicle.fuelType,
      vehicle.mileageLimit,
      vehicle.location,
      vehicle.status,
      vehicle.featuredImageUrl,
      vehicle.galleryImageUrls,
      vehicle.features,
      vehicle.description,
      vehicle.insuranceFeePerDay,
      vehicle.depositAmount,
      vehicle.createdAt,
      vehicle.updatedAt,
    ],
  );
  return result.rows[0];
}
