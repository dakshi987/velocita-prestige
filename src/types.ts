export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin' | 'fleet_manager';
  address?: string;
  driverLicenseNumber?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  bookingsCount?: number;
  totalSpent?: number;
}

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  modelYear: number;
  category: 'economy' | 'sedan' | 'suv' | 'luxury' | 'van' | 'sports';
  registrationNumber: string;
  dailyRate: number;
  currency?: string;
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
  insuranceFeePerDay: number;
  depositAmount: number;
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
  dailyRate: number;
  rentalSubtotal: number;
  insuranceTotal: number;
  taxTotal: number;
  depositAmount: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'rejected';
  specialRequests?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
  // Enriched fields
  vehicle?: Vehicle;
  payment?: Payment;
  vehicleName?: string;
  vehicleRegistration?: string;
  vehicleImage?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  paymentStatus?: 'unpaid' | 'paid' | 'refunded' | 'failed';
  paymentAmount?: number;
}

export interface Payment {
  id: string;
  bookingId: string;
  transactionReference: string;
  amount: number;
  paymentMethod: 'credit_card' | 'debit_card' | 'bank_transfer' | 'test_gateway' | 'cash';
  status: 'unpaid' | 'paid' | 'refunded' | 'failed';
  paidAt?: string;
  refundedAt?: string;
  refundAmount?: number;
  notes?: string;
  createdAt: string;
  bookingRef?: string;
  customerName?: string;
  customerEmail?: string;
  vehicleName?: string;
  vehicleImage?: string;
  vehicleRegistration?: string;
  currency?: string;
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

export interface AdminMetrics {
  totalVehicles: number;
  availableVehicles: number;
  totalCustomers: number;
  totalBookings: number;
  pendingBookings: number;
  activeBookings: number;
  recordedRevenue: number;
  utilizationRate: number;
  recentBookings: (Booking & {
    customerName: string;
    customerEmail: string;
    vehicleName: string;
    vehicleImage: string;
  })[];
}
