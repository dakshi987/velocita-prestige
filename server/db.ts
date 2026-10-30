import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  role: 'customer' | 'admin' | 'fleet_manager';
  address?: string;
  driverLicenseNumber?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  modelYear: number;
  category: 'economy' | 'sedan' | 'suv' | 'luxury' | 'van' | 'sports';
  registrationNumber: string;
  dailyRate: number; // in LKR
  currency: string;  // 'LKR'
  seatingCapacity: number;
  transmission: 'automatic' | 'manual';
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  mileageLimit: number;
  location: string;
  status: 'available' | 'rented' | 'maintenance' | 'archived';
  featuredImageUrl: string;
  galleryImageUrls: string[];
  features: string[];
  description: string;
  insuranceFeePerDay: number; // in LKR
  depositAmount: number;      // in LKR
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  bookingReference: string;
  userId: string;
  vehicleId: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  returnLocation: string;
  rentalDays: number;
  dailyRate: number;      // in LKR
  currency: string;       // 'LKR'
  rentalSubtotal: number; // in LKR
  insuranceTotal: number; // in LKR
  taxTotal: number;       // in LKR
  depositAmount: number;  // in LKR
  totalAmount: number;    // in LKR
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'rejected';
  specialRequests?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  transactionReference: string;
  amount: number;       // in LKR
  currency: string;     // 'LKR'
  paymentMethod: 'credit_card' | 'debit_card' | 'bank_transfer' | 'test_gateway' | 'cash';
  status: 'unpaid' | 'paid' | 'refunded' | 'failed';
  paidAt?: string;
  refundedAt?: string;
  refundAmount?: number;
  notes?: string;
  createdAt: string;
}

export interface VehicleReturn {
  id: string;
  bookingId: string;
  returnDate: string;
  odometerReading: number;
  fuelLevelPercent: number;
  conditionNotes?: string;
  damageFee: number;
  lateFee: number;
  depositRefunded: number;
  inspectedBy: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isResolved: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
}

interface DatabaseSchema {
  users: User[];
  vehicles: Vehicle[];
  bookings: Booking[];
  payments: Payment[];
  vehicleReturns: VehicleReturn[];
  contactMessages: ContactMessage[];
  auditLogs: AuditLog[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'velocita_db.json');

// Security: salt & hash password using standard scrypt
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, combinedHash: string): boolean {
  try {
    const [salt, key] = combinedHash.split(':');
    if (!salt || !key) return false;
    const derived = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(derived, 'hex'), Buffer.from(key, 'hex'));
  } catch {
    return false;
  }
}

// Fleet initialized with realistic Sri Lankan Rupee (LKR) daily rates and actual photographs
function getInitialVehicles(): Vehicle[] {
  return [
  {
    "id": "veh-001",
    "name": "Audi A6 Prestige S-Line",
    "brand": "Audi",
    "modelYear": 2025,
    "category": "sedan",
    "registrationNumber": "WP CAB-8822",
    "dailyRate": 28000,
    "currency": "LKR",
    "seatingCapacity": 5,
    "transmission": "automatic",
    "fuelType": "hybrid",
    "mileageLimit": 300,
    "location": "Colombo Central Terminal (Galle Face)",
    "status": "available",
    "featuredImageUrl": "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80",
    "galleryImageUrls": [
            "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80"
      
    ],
    "features": [
      "Matrix LED Lights",
      "Virtual Cockpit",
      "Bang & Olufsen 3D Sound",
      "Lane Assist",
      "Adaptive Cruise Control",
      "Heated Leather Seats"
    ],
    "description": "The Audi A6 Prestige blends sculpted elegance with advanced mild-hybrid performance. Whisper-quiet cruising on the Southern Expressway and Colombo city poise make it ideal for executive meetings and luxury airport transfers.",
    "insuranceFeePerDay": 3500,
    "depositAmount": 50000,
    "createdAt": "2026-10-14T07:24:44.951Z",
    "updatedAt": "2026-10-14T07:24:44.951Z"
  },
  {
    "id": "veh-007",
    "name": "BMW 5 Series 530e M Sport",
    "brand": "BMW",
    "modelYear": 2025,
    "category": "sedan",
    "registrationNumber": "WP CAC-5540",
    "dailyRate": 32000,
    "currency": "LKR",
    "seatingCapacity": 5,
    "transmission": "automatic",
    "fuelType": "hybrid",
    "mileageLimit": 300,
    "location": "Bandaranaike International Airport (CMB VIP Hub)",
    "status": "available",
    "featuredImageUrl": "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
    "galleryImageUrls": [
            "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80"
      
    ],
    "features": [
      "M Aerodynamics Package",
      "BMW Curved Display",
      "Harman Kardon Audio",
      "Wireless Apple CarPlay",
      "Parking Assistant Plus",
      "Panoramic Sunroof"
    ],
    "description": "Sporting agility meets corporate sophistication. The BMW 530e plug-in hybrid delivers effortless torque, premium leather upholstery, and pristine highway dynamics for business professionals.",
    "insuranceFeePerDay": 4000,
    "depositAmount": 60000,
    "createdAt": "2026-10-14T07:24:44.951Z",
    "updatedAt": "2026-10-14T07:24:44.951Z"
  },
  {
    "id": "veh-008",
    "name": "Toyota Camry Hybrid Premium Executive",
    "brand": "Toyota",
    "modelYear": 2025,
    "category": "sedan",
    "registrationNumber": "WP CAD-1904",
    "dailyRate": 22000,
    "currency": "LKR",
    "seatingCapacity": 5,
    "transmission": "automatic",
    "fuelType": "hybrid",
    "mileageLimit": 350,
    "location": "Kandy Royal Pavilion Hub",
    "status": "available",
    "featuredImageUrl": "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80",
    "galleryImageUrls": [
            "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80"
      
    ],
    "features": [
      "Toyota Safety Sense 3.0",
      "Rear Reclining Power Seats",
      "Dual-Zone Climate Control",
      "JBL 9-Speaker Audio",
      "Blind Spot Monitor",
      "Ultra-Quiet Cabin"
    ],
    "description": "Supreme reliability combined with executive rear seat comfort. Ideal for comfortable long-distance travel across Sri Lanka with exceptional fuel economy.",
    "insuranceFeePerDay": 3000,
    "depositAmount": 40000,
    "createdAt": "2026-10-14T07:24:44.951Z",
    "updatedAt": "2026-10-14T07:24:44.951Z"
  },
  {
    "id": "veh-002",
    "name": "Range Rover Velar P380 R-Dynamic",
    "brand": "Land Rover",
    "modelYear": 2025,
    "category": "suv",
    "registrationNumber": "WP CAD-4011",
    "dailyRate": 48000,
    "currency": "LKR",
    "seatingCapacity": 5,
    "transmission": "automatic",
    "fuelType": "petrol",
    "mileageLimit": 250,
    "location": "Bandaranaike International Airport (CMB VIP Hub)",
    "status": "available",
    "featuredImageUrl": "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80",
    "galleryImageUrls": [
            "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
      
    ],
    "features": [
      "All-Wheel Drive (AWD)",
      "Air Suspension",
      "Panoramic Glass Roof",
      "Meridian Surround Audio",
      "360° 3D Camera",
      "Terrain Response 2"
    ],
    "description": "Flush deployable handles and undeniable presence. The Velar provides peerless hill-country all-weather stability for trips to Nuwara Eliya, Kandy, or coastal tours along the Galle highway.",
    "insuranceFeePerDay": 5500,
    "depositAmount": 80000,
    "createdAt": "2026-10-14T07:24:44.951Z",
    "updatedAt": "2026-10-14T07:24:44.951Z"
  },
  {
    "id": "veh-009",
    "name": "Toyota Land Cruiser Prado TX-L 4WD",
    "brand": "Toyota",
    "modelYear": 2025,
    "category": "suv",
    "registrationNumber": "WP CBG-9231",
    "dailyRate": 42000,
    "currency": "LKR",
    "seatingCapacity": 7,
    "transmission": "automatic",
    "fuelType": "diesel",
    "mileageLimit": 300,
    "location": "Colombo Central Terminal (Galle Face)",
    "status": "available",
    "featuredImageUrl": "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1200&q=80",
    "galleryImageUrls": [
            "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80"
      
    ],
    "features": [
      "Full-Time 4WD with Low Range",
      "7 Comfortable Seats",
      "Triple-Zone Climate Control",
      "Cool Box Center Console",
      "Crawl Control",
      "Heavy-Duty Tow Bar"
    ],
    "description": "The undisputed king of Sri Lankan terrain. Effortlessly handles steep hill passes, wildlife safaris in Yala or Wilpattu, and executive convoys in pristine comfort.",
    "insuranceFeePerDay": 5000,
    "depositAmount": 75000,
    "createdAt": "2026-10-14T07:24:44.951Z",
    "updatedAt": "2026-10-14T07:24:44.951Z"
  },
  {
    "id": "veh-010",
    "name": "BMW X5 xDrive40i M Sport 7-Seater",
    "brand": "BMW",
    "modelYear": 2025,
    "category": "suv",
    "registrationNumber": "WP CAJ-7711",
    "dailyRate": 52000,
    "currency": "LKR",
    "seatingCapacity": 7,
    "transmission": "automatic",
    "fuelType": "petrol",
    "mileageLimit": 250,
    "location": "Galle Fort Coastal Hub",
    "status": "available",
    "featuredImageUrl": "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80",
    "galleryImageUrls": [
            "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=1200&q=80"
      
    ],
    "features": [
      "TwinPower Turbo 375 HP",
      "Adaptive 2-Axle Air Suspension",
      "Sky Lounge Panoramic Roof",
      "Bowers & Wilkins Sound",
      "Gesture Control",
      "M Sport Brakes"
    ],
    "description": "Commanding luxury and sports agility. Accommodates up to 7 passengers with supreme comfort, high highway cruising speed, and intuitive digital amenities.",
    "insuranceFeePerDay": 6000,
    "depositAmount": 90000,
    "createdAt": "2026-10-14T07:24:44.951Z",
    "updatedAt": "2026-10-14T07:24:44.951Z"
  },
  {
    "id": "veh-003",
    "name": "Aston Martin DBS Superleggera GT",
    "brand": "Aston Martin",
    "modelYear": 2025,
    "category": "luxury",
    "registrationNumber": "WP CBA-0007",
    "dailyRate": 125000,
    "currency": "LKR",
    "seatingCapacity": 2,
    "transmission": "automatic",
    "fuelType": "petrol",
    "mileageLimit": 200,
    "location": "Colombo Central Terminal (Galle Face)",
    "status": "available",
    "featuredImageUrl": "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
    "galleryImageUrls": [
            "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
      
    ],
    "features": [
      "Twin-Turbo V12 715 HP",
      "Carbon Ceramic Brakes",
      "Sport Exhaust with Active Valves",
      "Hand-stitched Alcantara",
      "Aeroblade II Downforce System"
    ],
    "description": "The pinnacle of Grand Touring. Clad in lightweight carbon composite, the DBS delivers breathless acceleration, symphonic exhaust acoustics, and magnetic presence for high-end weddings and VIP hospitality across Sri Lanka.",
    "insuranceFeePerDay": 15000,
    "depositAmount": 150000,
    "createdAt": "2026-10-14T07:24:44.951Z",
    "updatedAt": "2026-10-14T07:24:44.951Z"
  },
  {
    "id": "veh-005",
    "name": "Mercedes-Benz S-Class 580 4MATIC",
    "brand": "Mercedes-Benz",
    "modelYear": 2025,
    "category": "luxury",
    "registrationNumber": "WP CAG-7777",
    "dailyRate": 85000,
    "currency": "LKR",
    "seatingCapacity": 5,
    "transmission": "automatic",
    "fuelType": "hybrid",
    "mileageLimit": 250,
    "location": "Colombo Central Terminal (Galle Face)",
    "status": "available",
    "featuredImageUrl": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
    "galleryImageUrls": [
            "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80"
      
    ],
    "features": [
      "Executive Rear Lounge",
      "Active Ambient Lighting (64 Colors)",
      "Burmester 4D Sound",
      "Rear Axle Steering",
      "Heated & Cooled Massage Seats"
    ],
    "description": "The benchmark of luxury chauffeur driving in Sri Lanka. Effortless airmatic glide suspension, hot-stone massage chairs, and whisper-quiet cabin for diplomatic and executive travel.",
    "insuranceFeePerDay": 10000,
    "depositAmount": 120000,
    "createdAt": "2026-10-14T07:24:44.951Z",
    "updatedAt": "2026-10-14T07:24:44.951Z"
  },
  {
    "id": "veh-011",
    "name": "Porsche Panamera 4 E-Hybrid Executive",
    "brand": "Porsche",
    "modelYear": 2025,
    "category": "luxury",
    "registrationNumber": "WP CAK-9009",
    "dailyRate": 95000,
    "currency": "LKR",
    "seatingCapacity": 4,
    "transmission": "automatic",
    "fuelType": "hybrid",
    "mileageLimit": 220,
    "location": "Bandaranaike International Airport (CMB VIP Hub)",
    "status": "available",
    "featuredImageUrl": "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80",
    "galleryImageUrls": [
            "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80"
      
    ],
    "features": [
      "Porsche Active Suspension Management (PASM)",
      "Sport Chrono Package",
      "Rear Seat Entertainment Displays",
      "Soft-Close Doors",
      "BOSE Surround Sound"
    ],
    "description": "Combining iconic Porsche sports car DNA with four-door limousine luxury. Exceptional ride comfort, striking road stance, and seamless plug-in hybrid response.",
    "insuranceFeePerDay": 12000,
    "depositAmount": 130000,
    "createdAt": "2026-10-14T07:24:44.951Z",
    "updatedAt": "2026-10-14T07:24:44.951Z"
  },
  {
    "id": "veh-004",
    "name": "Mercedes-Benz V-Class Avantgarde VIP",
    "brand": "Mercedes-Benz",
    "modelYear": 2025,
    "category": "van",
    "registrationNumber": "WP ND-9102",
    "dailyRate": 32000,
    "currency": "LKR",
    "seatingCapacity": 8,
    "transmission": "automatic",
    "fuelType": "diesel",
    "mileageLimit": 350,
    "location": "Bandaranaike International Airport (CMB VIP Hub)",
    "status": "available",
    "featuredImageUrl": "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80",
    "galleryImageUrls": [
            "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80"
      
    ],
    "features": [
      "8 Luxury Captain Seats",
      "Dual Electric Sliding Doors",
      "Burmester High-End Audio",
      "Rear Climate Control Zone",
      "Huge Luggage Capacity",
      "Folding Conference Table"
    ],
    "description": "The gold standard of executive tourism in Sri Lanka. 8 sumptuous leather seats, conference layout, dual AC zones, and ample luggage space for island round-trips and corporate delegations.",
    "insuranceFeePerDay": 4000,
    "depositAmount": 60000,
    "createdAt": "2026-10-14T07:24:44.951Z",
    "updatedAt": "2026-10-14T07:24:44.951Z"
  },
  {
    "id": "veh-012",
    "name": "Toyota HiAce Super GL Commuter Luxury",
    "brand": "Toyota",
    "modelYear": 2025,
    "category": "van",
    "registrationNumber": "WP ND-4488",
    "dailyRate": 24000,
    "currency": "LKR",
    "seatingCapacity": 10,
    "transmission": "automatic",
    "fuelType": "diesel",
    "mileageLimit": 400,
    "location": "Colombo Central Terminal (Galle Face)",
    "status": "available",
    "featuredImageUrl": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
    "galleryImageUrls": [
            "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?auto=format&fit=crop&w=1200&q=80"
      
    ],
    "features": [
      "10 Plush Reclining High-Back Seats",
      "Roof-Mounted Dual Air Conditioning",
      "Automatic Side Step & Power Door",
      "HDMI Overhead Video Entertainment",
      "Generous Luggage Hold"
    ],
    "description": "Sri Lanka’s most trusted long-distance passenger van. Roomy 10-seater configuration with whisper-quiet diesel engine, ice-cold dual AC, and maximum touring reliability from Colombo to Sigiriya, Ella, and Yala.",
    "insuranceFeePerDay": 3200,
    "depositAmount": 45000,
    "createdAt": "2026-10-14T07:24:44.951Z",
    "updatedAt": "2026-10-14T07:24:44.951Z"
  },
  {
    "id": "veh-013",
    "name": "Mercedes-Benz Sprinter Executive Shuttle",
    "brand": "Mercedes-Benz",
    "modelYear": 2025,
    "category": "van",
    "registrationNumber": "WP NA-7120",
    "dailyRate": 38000,
    "currency": "LKR",
    "seatingCapacity": 12,
    "transmission": "automatic",
    "fuelType": "diesel",
    "mileageLimit": 350,
    "location": "Bandaranaike International Airport (CMB VIP Hub)",
    "status": "available",
    "featuredImageUrl": "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80",
    "galleryImageUrls": [
            "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80"
      
    ],
    "features": [
      "12 VIP Ergonomic Recliners",
      "High Roof Stand-Up Cabin",
      "Independent Individual Reading Lights",
      "High-Output Rear Chiller AC",
      "USB Ports for Every Row",
      "Extra-Large Luggage Bay"
    ],
    "description": "Spacious high-roof executive shuttle for airline crews, destination weddings, and large travel groups. Stand-up headroom, individual airflow vents, and smooth Mercedes road manner.",
    "insuranceFeePerDay": 4800,
    "depositAmount": 70000,
    "createdAt": "2026-10-14T07:24:44.951Z",
    "updatedAt": "2026-10-14T07:24:44.951Z"
  },
  {
    "id": "veh-014",
    "name": "Ford Transit Custom Tourneo Titanium",
    "brand": "Ford",
    "modelYear": 2025,
    "category": "van",
    "registrationNumber": "WP NC-3309",
    "dailyRate": 26000,
    "currency": "LKR",
    "seatingCapacity": 9,
    "transmission": "automatic",
    "fuelType": "diesel",
    "mileageLimit": 380,
    "location": "Kandy Royal Pavilion Hub",
    "status": "available",
    "featuredImageUrl": "https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=1200&q=80",
    "galleryImageUrls": [
            "https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?auto=format&fit=crop&w=1200&q=80"
      
    ],
    "features": [
      "9 Flexible Conference Seats",
      "SYNC 4 13-Inch Touchscreen",
      "Dual Side Loading Doors",
      "Ford Co-Pilot360 Driver Assist",
      "Integrated Sunblinds"
    ],
    "description": "Modern, highly versatile passenger van built for hill-country touring and family getaways. Features flexible seating arrangements and smooth EcoBlue turbo diesel performance.",
    "insuranceFeePerDay": 3500,
    "depositAmount": 50000,
    "createdAt": "2026-10-14T07:24:44.951Z",
    "updatedAt": "2026-10-14T07:24:44.951Z"
  },
  {
    "id": "veh-006",
    "name": "Hyundai i20 Premium Hatchback",
    "brand": "Hyundai",
    "modelYear": 2025,
    "category": "economy",
    "registrationNumber": "WP KX-1280",
    "dailyRate": 8500,
    "currency": "LKR",
    "seatingCapacity": 5,
    "transmission": "automatic",
    "fuelType": "petrol",
    "mileageLimit": 300,
    "location": "Kandy Royal Pavilion Hub",
    "status": "available",
    "featuredImageUrl": "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80",
    "galleryImageUrls": [
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80"
      
    ],
    "features": [
      "Apple CarPlay & Android Auto",
      "Reverse Camera & Sensors",
      "High Fuel Efficiency (18 km/L)",
      "Digital Instrument Cluster",
      "Keyless Push Start"
    ],
    "description": "Compact, agile, and fuel-efficient. Perfect for navigating Colombo and Kandy city traffic with hassle-free parking, cold AC, and low fuel consumption.",
    "insuranceFeePerDay": 1500,
    "depositAmount": 25000,
    "createdAt": "2026-10-14T07:24:45.077Z",
    "updatedAt": "2026-10-14T07:24:45.077Z"
  },
  {
    "id": "veh-015",
    "name": "Suzuki Swift GLX Dualjet Automatic",
    "brand": "Suzuki",
    "modelYear": 2025,
    "category": "economy",
    "registrationNumber": "WP KY-8910",
    "dailyRate": 7500,
    "currency": "LKR",
    "seatingCapacity": 5,
    "transmission": "automatic",
    "fuelType": "petrol",
    "mileageLimit": 350,
    "location": "Colombo Central Terminal (Galle Face)",
    "status": "available",
    "featuredImageUrl": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
    "galleryImageUrls": [
            "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80"
      
    ],
    "features": [
      "Superb 20 km/L Mileage",
      "Touchscreen Infotainment",
      "Reverse Camera",
      "LED Projector Headlamps",
      "Automatic Climate Control"
    ],
    "description": "Sri Lanka’s favorite nimble city runner. Easy steering, excellent fuel economy, and zippy acceleration for urban commuting and coastal drives.",
    "insuranceFeePerDay": 1200,
    "depositAmount": 20000,
    "createdAt": "2026-10-14T07:24:44.951Z",
    "updatedAt": "2026-10-14T07:24:44.951Z"
  },
  {
    "id": "veh-016",
    "name": "Toyota Aqua Hybrid Smart Drive",
    "brand": "Toyota",
    "modelYear": 2025,
    "category": "economy",
    "registrationNumber": "WP KZ-3342",
    "dailyRate": 9200,
    "currency": "LKR",
    "seatingCapacity": 5,
    "transmission": "automatic",
    "fuelType": "hybrid",
    "mileageLimit": 350,
    "location": "Galle Fort Coastal Hub",
    "status": "available",
    "featuredImageUrl": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
    "galleryImageUrls": [
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80"
      
    ],
    "features": [
      "Toyota Synergy Hybrid (26 km/L)",
      "EV Mode Quiet Driving",
      "Pre-Crash Safety System",
      "Smart Keyless Entry",
      "Bluetooth Audio"
    ],
    "description": "Ultra-fuel-efficient hybrid technology. Whisper quiet at low speeds in city congestion, with world-renowned Toyota durability for cost-effective island tours.",
    "insuranceFeePerDay": 1500,
    "depositAmount": 25000,
    "createdAt": "2026-10-14T07:24:44.951Z",
    "updatedAt": "2026-10-14T07:24:44.951Z"
  }
];
}

class PersistentDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Verify currency is LKR and full fleet is populated
        if (parsed.vehicles && parsed.vehicles[0]?.currency === 'LKR' && parsed.vehicles.length >= 15) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Failed to read database file, initializing fresh LKR database:', err);
    }

    const initial = this.createInitialData();
    this.persist(initial);
    return initial;
  }

  private createInitialData(): DatabaseSchema {
    const now = new Date().toISOString();
    const adminPasswordHash = hashPassword('admin123');
    const customerPasswordHash = hashPassword('customer123');

    const adminUser: User = {
      id: 'usr-admin-01',
      name: 'Chaminda Senanayake',
      email: 'admin@velocita.com',
      passwordHash: adminPasswordHash,
      phone: '+94 11 234 8900',
      role: 'admin',
      address: 'No. 45, Galle Face Terrace, Colombo 03',
      driverLicenseNumber: 'B-8829103-LK',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    const customerUser: User = {
      id: 'usr-cust-01',
      name: 'Kavinda Perera',
      email: 'customer@velocita.com',
      passwordHash: customerPasswordHash,
      phone: '+94 77 482 9112',
      role: 'customer',
      address: 'No. 12, Dharmapala Mawatha, Colombo 07',
      driverLicenseNumber: 'B-4481023-LK',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    const sampleVehicles = getInitialVehicles();

    // Sample booking in LKR
    const sampleBooking: Booking = {
      id: 'bk-2026-1001',
      bookingReference: 'VEL-89412',
      userId: customerUser.id,
      vehicleId: sampleVehicles[0].id,
      pickupDate: '2026-10-25',
      returnDate: '2026-10-28',
      pickupLocation: 'Colombo Central Terminal (Galle Face)',
      returnLocation: 'Colombo Central Terminal (Galle Face)',
      rentalDays: 3,
      dailyRate: sampleVehicles[0].dailyRate,
      currency: 'LKR',
      rentalSubtotal: sampleVehicles[0].dailyRate * 3,
      insuranceTotal: sampleVehicles[0].insuranceFeePerDay * 3,
      taxTotal: Math.round(sampleVehicles[0].dailyRate * 3 * 0.08),
      depositAmount: sampleVehicles[0].depositAmount,
      totalAmount:
        sampleVehicles[0].dailyRate * 3 +
        sampleVehicles[0].insuranceFeePerDay * 3 +
        Math.round(sampleVehicles[0].dailyRate * 3 * 0.08) +
        sampleVehicles[0].depositAmount,
      status: 'confirmed',
      specialRequests: 'VIP airport pickup at Katunayake VIP Lounge with name board.',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    };

    const samplePayment: Payment = {
      id: 'pay-2026-1001',
      bookingId: sampleBooking.id,
      transactionReference: 'TXN-9842109',
      amount: sampleBooking.totalAmount,
      currency: 'LKR',
      paymentMethod: 'credit_card',
      status: 'paid',
      paidAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      notes: 'Authorized via Commercial Bank IPG Gateway #4242',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    };

    const sampleContactMessage: ContactMessage = {
      id: 'msg-001',
      name: 'Dinesh Wickramasinghe',
      email: 'dinesh.w@example.com',
      phone: '+94 71 888 2233',
      subject: 'Corporate Fleet for Colombo Investment Forum',
      message: 'Ayubowan Velocita team, We require 3 executive Audi and Mercedes sedans for foreign delegates arriving next week at Katunayake. Please send your corporate quote.',
      isResolved: false,
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    };

    const sampleAudit: AuditLog = {
      id: 'aud-001',
      userId: adminUser.id,
      action: 'SYSTEM_INITIALIZATION',
      resourceType: 'system',
      resourceId: 'fleet_init',
      details: { fleetCount: sampleVehicles.length, currency: 'LKR', region: 'Sri Lanka' },
      createdAt: now,
    };

    return {
      users: [adminUser, customerUser],
      vehicles: sampleVehicles,
      bookings: [sampleBooking],
      payments: [samplePayment],
      vehicleReturns: [],
      contactMessages: [sampleContactMessage],
      auditLogs: [sampleAudit],
    };
  }

  private persist(data: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const tmpFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch (err) {
      console.error('Error writing database to disk:', err);
    }
  }

  private save() {
    this.persist(this.data);
  }

  // --- Users Operations ---
  getUsers(): User[] {
    return [...this.data.users];
  }

  getUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const newUser = this.prepareUser(user);
    this.saveUser(newUser);
    return newUser;
  }

  prepareUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const existing = this.getUserByEmail(user.email);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }
    const now = new Date().toISOString();
    const newUser: User = {
      ...user,
      id: `usr-${crypto.randomBytes(6).toString('hex')}`,
      createdAt: now,
      updatedAt: now,
    };
    return newUser;
  }

  saveUser(newUser: User): void {
    this.data.users.push(newUser);
    this.save();
  }

  updateUser(id: string, updates: Partial<Omit<User, 'id' | 'email' | 'createdAt'>>): User {
    const userIndex = this.data.users.findIndex((u) => u.id === id);
    if (userIndex === -1) throw new Error('User not found.');

    const updated: User = {
      ...this.data.users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.data.users[userIndex] = updated;
    this.save();
    return updated;
  }

  // --- Vehicles Operations ---
  getVehicles(): Vehicle[] {
    return [...this.data.vehicles];
  }

  getVehicleById(id: string): Vehicle | undefined {
    return this.data.vehicles.find((v) => v.id === id);
  }

  createVehicle(vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Vehicle {
    const newVehicle = this.prepareVehicle(vehicleData);
    this.saveVehicle(newVehicle);
    return newVehicle;
  }

  prepareVehicle(vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Vehicle {
    const existingReg = this.data.vehicles.find(
      (v) => v.registrationNumber.toUpperCase() === vehicleData.registrationNumber.toUpperCase()
    );
    if (existingReg) {
      throw new Error(`Registration number ${vehicleData.registrationNumber} is already in use.`);
    }

    const now = new Date().toISOString();
    const newVehicle: Vehicle = {
      ...vehicleData,
      currency: 'LKR',
      id: `veh-${crypto.randomBytes(6).toString('hex')}`,
      createdAt: now,
      updatedAt: now,
    };
    return newVehicle;
  }

  saveVehicle(newVehicle: Vehicle): void {
    this.data.vehicles.unshift(newVehicle);
    this.save();
  }

  updateVehicle(id: string, updates: Partial<Omit<Vehicle, 'id' | 'createdAt'>>): Vehicle {
    const idx = this.data.vehicles.findIndex((v) => v.id === id);
    if (idx === -1) throw new Error('Vehicle not found.');

    if (updates.registrationNumber) {
      const duplicate = this.data.vehicles.find(
        (v) => v.id !== id && v.registrationNumber.toUpperCase() === updates.registrationNumber?.toUpperCase()
      );
      if (duplicate) {
        throw new Error(`Registration number ${updates.registrationNumber} is already in use by another vehicle.`);
      }
    }

    const updated: Vehicle = {
      ...this.data.vehicles[idx],
      ...updates,
      currency: 'LKR',
      updatedAt: new Date().toISOString(),
    };
    this.data.vehicles[idx] = updated;
    this.save();
    return updated;
  }

  deleteVehicle(id: string): { success: boolean; message: string } {
    const idx = this.data.vehicles.findIndex((v) => v.id === id);
    if (idx === -1) throw new Error('Vehicle not found.');

    const activeBookings = this.data.bookings.filter(
      (b) => b.vehicleId === id && ['pending', 'confirmed', 'active'].includes(b.status)
    );

    if (activeBookings.length > 0) {
      throw new Error(
        `Cannot delete vehicle: It has ${activeBookings.length} active or pending booking(s). Please archive the vehicle instead.`
      );
    }

    const historicalBookings = this.data.bookings.filter((b) => b.vehicleId === id);
    if (historicalBookings.length > 0) {
      this.data.vehicles[idx].status = 'archived';
      this.data.vehicles[idx].updatedAt = new Date().toISOString();
      this.save();
      return { success: true, message: 'Vehicle has past booking records and has been moved to archived status.' };
    }

    this.data.vehicles.splice(idx, 1);
    this.save();
    return { success: true, message: 'Vehicle deleted successfully.' };
  }

  // --- Strict Overlap & Availability Checks ---
  isVehicleAvailable(vehicleId: string, pickupDate: string, returnDate: string, excludeBookingId?: string): boolean {
    const vehicle = this.getVehicleById(vehicleId);
    if (!vehicle || vehicle.status === 'archived' || vehicle.status === 'maintenance') {
      return false;
    }

    const reqStart = new Date(pickupDate).getTime();
    const reqEnd = new Date(returnDate).getTime();

    if (isNaN(reqStart) || isNaN(reqEnd) || reqEnd <= reqStart) {
      return false;
    }

    const conflict = this.data.bookings.find((b) => {
      if (b.vehicleId !== vehicleId) return false;
      if (excludeBookingId && b.id === excludeBookingId) return false;
      if (b.status === 'cancelled' || b.status === 'rejected') return false;

      const existingStart = new Date(b.pickupDate).getTime();
      const existingEnd = new Date(b.returnDate).getTime();

      return reqStart < existingEnd && reqEnd > existingStart;
    });

    return !conflict;
  }

  // --- Bookings Operations ---
  getBookings(): Booking[] {
    return [...this.data.bookings];
  }

  getBookingById(id: string): Booking | undefined {
    return this.data.bookings.find((b) => b.id === id);
  }

  getBookingsByUserId(userId: string): Booking[] {
    return this.data.bookings
      .filter((b) => b.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createBooking(params: {
    userId: string;
    vehicleId: string;
    pickupDate: string;
    returnDate: string;
    pickupLocation: string;
    returnLocation: string;
    specialRequests?: string;
  }): { booking: Booking; payment: Payment } {
    const result = this.prepareBooking(params);
    this.commitBooking(result);
    return result;
  }

  prepareBooking(params: {
    userId: string;
    vehicleId: string;
    pickupDate: string;
    returnDate: string;
    pickupLocation: string;
    returnLocation: string;
    specialRequests?: string;
  }): { booking: Booking; payment: Payment } {
    const user = this.getUserById(params.userId);
    if (!user) throw new Error('Customer account not found.');

    const vehicle = this.getVehicleById(params.vehicleId);
    if (!vehicle) throw new Error('Selected vehicle not found.');

    if (vehicle.status === 'archived' || vehicle.status === 'maintenance') {
      throw new Error(`This vehicle is currently ${vehicle.status} and cannot be reserved.`);
    }

    const start = new Date(params.pickupDate);
    const end = new Date(params.returnDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Invalid dates provided.');
    }

    if (end.getTime() <= start.getTime()) {
      throw new Error('Return date must be strictly after the pickup date.');
    }

    if (!this.isVehicleAvailable(params.vehicleId, params.pickupDate, params.returnDate)) {
      throw new Error('This vehicle is already reserved for the selected dates. Please choose another date range or vehicle.');
    }

    const rentalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    const dailyRate = vehicle.dailyRate;
    const rentalSubtotal = dailyRate * rentalDays;
    const insuranceTotal = vehicle.insuranceFeePerDay * rentalDays;
    const taxTotal = Math.round(rentalSubtotal * 0.08);
    const depositAmount = vehicle.depositAmount;
    const totalAmount = rentalSubtotal + insuranceTotal + taxTotal + depositAmount;

    const now = new Date().toISOString();
    const bookingRef = `VEL-${Math.floor(10000 + Math.random() * 90000)}`;

    const newBooking: Booking = {
      id: `bk-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      bookingReference: bookingRef,
      userId: params.userId,
      vehicleId: params.vehicleId,
      pickupDate: params.pickupDate,
      returnDate: params.returnDate,
      pickupLocation: params.pickupLocation,
      returnLocation: params.returnLocation,
      rentalDays,
      dailyRate,
      currency: 'LKR',
      rentalSubtotal,
      insuranceTotal,
      taxTotal,
      depositAmount,
      totalAmount,
      status: 'pending',
      specialRequests: params.specialRequests,
      createdAt: now,
      updatedAt: now,
    };

    const newPayment: Payment = {
      id: `pay-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      bookingId: newBooking.id,
      transactionReference: `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`,
      amount: totalAmount,
      currency: 'LKR',
      paymentMethod: 'credit_card',
      status: 'unpaid',
      notes: 'Awaiting payment.',
      createdAt: now,
    };

    return { booking: newBooking, payment: newPayment };
  }

  commitBooking({ booking: newBooking, payment }: { booking: Booking; payment: Payment }): void {
    const bookingRef = newBooking.bookingReference;
    this.data.bookings.unshift(newBooking);
    this.data.payments.unshift(payment);

    this.addAuditLog({
      userId: newBooking.userId,
      action: 'BOOKING_CREATED',
      resourceType: 'booking',
      resourceId: newBooking.id,
      details: {
        bookingRef,
        vehicleId: newBooking.vehicleId,
        totalAmountLKR: newBooking.totalAmount,
        rentalDays: newBooking.rentalDays,
      },
    });

    this.save();
  }

  cancelBooking(bookingId: string, userId: string, reason: string, isAdmin = false): Booking {
    const booking = this.getBookingById(bookingId);
    if (!booking) throw new Error('Booking not found.');

    if (!isAdmin && booking.userId !== userId) {
      throw new Error('Unauthorized to cancel this booking.');
    }

    if (booking.status === 'cancelled') {
      throw new Error('This booking is already cancelled.');
    }

    if (booking.status === 'completed') {
      throw new Error('Completed rentals cannot be cancelled.');
    }

    booking.status = 'cancelled';
    booking.cancellationReason = reason;
    booking.cancelledAt = new Date().toISOString();
    booking.updatedAt = new Date().toISOString();

    const payment = this.data.payments.find((p) => p.bookingId === bookingId && p.status === 'paid');
    if (payment) {
      payment.status = 'refunded';
      payment.refundedAt = new Date().toISOString();
      payment.refundAmount = payment.amount;
      payment.notes = `Refunded in LKR due to cancellation: ${reason}`;
    }

    this.addAuditLog({
      userId,
      action: 'BOOKING_CANCELLED',
      resourceType: 'booking',
      resourceId: booking.id,
      details: { reason, refundedAmountLKR: payment?.amount || 0 },
    });

    this.save();
    return booking;
  }

  updateBookingStatus(
    bookingId: string,
    newStatus: Booking['status'],
    adminUserId: string,
    notes?: string
  ): Booking {
    const booking = this.getBookingById(bookingId);
    if (!booking) throw new Error('Booking not found.');

    const oldStatus = booking.status;
    booking.status = newStatus;
    booking.updatedAt = new Date().toISOString();

    this.addAuditLog({
      userId: adminUserId,
      action: 'BOOKING_STATUS_UPDATED',
      resourceType: 'booking',
      resourceId: bookingId,
      details: { oldStatus, newStatus, notes },
    });

    this.save();
    return booking;
  }

  // --- Payments Operations ---
  getPayments(): Payment[] {
    return [...this.data.payments];
  }

  getPaymentByBookingId(bookingId: string): Payment | undefined {
    return this.data.payments.find((p) => p.bookingId === bookingId);
  }

  processDummyPayment(
    bookingId: string,
    userId: string,
    paymentMethod: 'credit_card' | 'debit_card',
  ): { booking: Booking; payment: Payment } {
    const booking = this.getBookingById(bookingId);
    if (!booking) throw new Error('Booking not found.');
    if (booking.userId !== userId) throw new Error('Unauthorized to pay for this booking.');

    const payment = this.getPaymentByBookingId(bookingId);
    if (!payment) throw new Error('Payment record not found.');
    if (booking.status === 'cancelled' || booking.status === 'rejected') {
      throw new Error('This booking cannot be paid.');
    }

    if (payment.status !== 'paid') {
      const now = new Date().toISOString();
      payment.status = 'paid';
      payment.paymentMethod = paymentMethod;
      payment.paidAt = now;
      payment.notes = 'Dummy card payment processed; no card details were collected.';
      booking.status = 'confirmed';
      booking.updatedAt = now;

      this.addAuditLog({
        userId,
        action: 'DUMMY_PAYMENT_PROCESSED',
        resourceType: 'payment',
        resourceId: payment.id,
        details: { bookingId, paymentMethod, amountLKR: payment.amount },
      });

      this.save();
    }

    return { booking, payment };
  }

  // --- Vehicle Returns Operations ---
  getVehicleReturns(): VehicleReturn[] {
    return [...this.data.vehicleReturns];
  }

  recordVehicleReturn(params: Omit<VehicleReturn, 'id' | 'createdAt'>): VehicleReturn {
    const booking = this.getBookingById(params.bookingId);
    if (!booking) throw new Error('Booking record not found.');

    const now = new Date().toISOString();
    const returnRecord: VehicleReturn = {
      ...params,
      id: `ret-${Date.now()}`,
      createdAt: now,
    };

    this.data.vehicleReturns.unshift(returnRecord);
    booking.status = 'completed';
    booking.updatedAt = now;

    const vehicle = this.getVehicleById(booking.vehicleId);
    if (vehicle && vehicle.status === 'rented') {
      vehicle.status = 'available';
      vehicle.updatedAt = now;
    }

    this.addAuditLog({
      userId: params.inspectedBy,
      action: 'VEHICLE_RETURN_RECORDED',
      resourceType: 'vehicle_return',
      resourceId: returnRecord.id,
      details: {
        bookingId: params.bookingId,
        odometer: params.odometerReading,
        fuel: params.fuelLevelPercent,
        damageFeeLKR: params.damageFee,
        lateFeeLKR: params.lateFee,
      },
    });

    this.save();
    return returnRecord;
  }

  // --- Contact Messages ---
  getContactMessages(): ContactMessage[] {
    return [...this.data.contactMessages].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  createContactMessage(msg: Omit<ContactMessage, 'id' | 'isResolved' | 'createdAt'>): ContactMessage {
    const now = new Date().toISOString();
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      isResolved: false,
      createdAt: now,
    };
    this.saveContactMessage(newMsg);
    return newMsg;
  }

  saveContactMessage(newMsg: ContactMessage): void {
    this.data.contactMessages.unshift(newMsg);
    this.save();
  }

  resolveContactMessage(id: string): ContactMessage {
    const msg = this.data.contactMessages.find((m) => m.id === id);
    if (!msg) throw new Error('Message not found.');
    msg.isResolved = true;
    this.save();
    return msg;
  }

  // --- Audit Logs ---
  getAuditLogs(): AuditLog[] {
    return [...this.data.auditLogs].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  addAuditLog(entry: Omit<AuditLog, 'id' | 'createdAt'>): AuditLog {
    const log: AuditLog = {
      ...entry,
      id: `aud-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`,
      createdAt: new Date().toISOString(),
    };
    this.data.auditLogs.unshift(log);
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs.pop();
    }
    return log;
  }

  // --- Analytics & Reports ---
  getAdminMetrics() {
    const totalVehicles = this.data.vehicles.filter((v) => v.status !== 'archived').length;
    const availableVehicles = this.data.vehicles.filter((v) => v.status === 'available').length;
    const totalCustomers = this.data.users.filter((u) => u.role === 'customer').length;
    const totalBookings = this.data.bookings.length;
    const pendingBookings = this.data.bookings.filter((b) => b.status === 'pending').length;
    const activeBookings = this.data.bookings.filter((b) => b.status === 'active' || b.status === 'confirmed').length;

    const recordedRevenue = this.data.payments
      .filter((p) => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);

    const utilizationRate = totalVehicles > 0 ? Math.round(((totalVehicles - availableVehicles) / totalVehicles) * 100) : 0;

    const recentBookings = this.data.bookings.slice(0, 5).map((b) => {
      const user = this.getUserById(b.userId);
      const vehicle = this.getVehicleById(b.vehicleId);
      return {
        ...b,
        customerName: user?.name || 'Unknown Customer',
        customerEmail: user?.email || '',
        vehicleName: vehicle?.name || 'Unknown Vehicle',
        vehicleImage: vehicle?.featuredImageUrl || '',
      };
    });

    return {
      currency: 'LKR',
      totalVehicles,
      availableVehicles,
      totalCustomers,
      totalBookings,
      pendingBookings,
      activeBookings,
      recordedRevenue,
      utilizationRate,
      recentBookings,
    };
  }

  resetSeed() {
    this.data = this.createInitialData();
    this.save();
    return { success: true };
  }
}

export const db = new PersistentDatabase();
