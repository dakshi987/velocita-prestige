import {
  User,
  Vehicle,
  Booking,
  Payment,
  VehicleReturn,
  ContactMessage,
  AuditLog,
  AdminMetrics,
} from '../types.ts';

const TOKEN_KEY = 'velocita_auth_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('text/csv')) {
    const text = await response.text();
    return text as unknown as T;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth
  register: (body: { name: string; email: string; phone: string; password: string; confirmPassword: string }) =>
    request<{ user: User; token: string; message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  login: (body: { email: string; password: string }) =>
    request<{ user: User; token: string; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  getCurrentUser: () => request<{ user: User }>('/auth/me'),

  updateProfile: (body: { name: string; phone: string; address?: string; driverLicenseNumber?: string }) =>
    request<{ user: User; message: string }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  // Vehicles
  getVehicles: (params: Record<string, string | number | undefined> = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') query.append(k, String(v));
    });
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request<{ vehicles: Vehicle[]; total: number }>(`/vehicles${qs}`);
  },

  getVehicleById: (id: string) => request<{ vehicle: Vehicle }>(`/vehicles/${id}`),

  checkAvailability: (body: { vehicleId: string; pickupDate: string; returnDate: string }) =>
    request<{
      isAvailable: boolean;
      rentalDays: number;
      dailyRate: number;
      rentalSubtotal: number;
      insuranceTotal: number;
      taxTotal: number;
      depositAmount: number;
      totalAmount: number;
    }>('/vehicles/check-availability', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  // Bookings
  createBooking: (body: {
    vehicleId: string;
    pickupDate: string;
    returnDate: string;
    pickupLocation: string;
    returnLocation: string;
    specialRequests?: string;
  }) =>
    request<{ booking: Booking; payment: Payment; message: string; notificationsSent?: boolean }>('/bookings', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  getMyBookings: () => request<{ bookings: Booking[] }>('/my-bookings'),

  processDummyPayment: (bookingId: string, paymentMethod: 'credit_card' | 'debit_card') =>
    request<{ booking: Booking; payment: Payment; message: string }>(`/bookings/${bookingId}/pay`, {
      method: 'POST',
      body: JSON.stringify({ paymentMethod }),
    }),

  getBookingById: (id: string) => request<{ booking: Booking }>(`/bookings/${id}`),

  cancelBooking: (id: string, reason: string) =>
    request<{ booking: Booking; message: string }>(`/bookings/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  // Contact
  submitContact: (body: { name: string; email: string; phone?: string; subject: string; message: string }) =>
    request<{ message: string; contactMessage: ContactMessage }>('/contact', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  // Admin
  uploadVehicleImage: (body: { imageBase64: string; filename?: string }) =>
    request<{ imageUrl: string; message: string }>('/upload-image', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  getAdminOverview: () => request<{ metrics: AdminMetrics }>('/admin/overview'),

  getAdminVehicles: () => request<{ vehicles: Vehicle[] }>('/admin/vehicles'),

  createAdminVehicle: (body: Partial<Vehicle>) =>
    request<{ vehicle: Vehicle; message: string }>('/admin/vehicles', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  updateAdminVehicle: (id: string, body: Partial<Vehicle>) =>
    request<{ vehicle: Vehicle; message: string }>(`/admin/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  deleteAdminVehicle: (id: string) =>
    request<{ success: boolean; message: string }>(`/admin/vehicles/${id}`, {
      method: 'DELETE',
    }),

  getAdminBookings: () => request<{ bookings: Booking[] }>('/admin/bookings'),

  updateBookingStatus: (id: string, status: Booking['status'], notes?: string) =>
    request<{ booking: Booking; message: string }>(`/admin/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    }),

  getAdminCustomers: () => request<{ customers: User[] }>('/admin/customers'),

  updateCustomerStatus: (id: string, body: { isActive?: boolean; role?: User['role'] }) =>
    request<{ user: User; message: string }>(`/admin/customers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  getAdminPayments: () => request<{ payments: Payment[] }>('/admin/payments'),

  recordVehicleReturn: (body: {
    bookingId: string;
    odometerReading: number;
    fuelLevelPercent: number;
    conditionNotes?: string;
    damageFee?: number;
    lateFee?: number;
    depositRefunded?: number;
  }) =>
    request<{ returnRecord: VehicleReturn; message: string }>('/admin/returns', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  getAdminContactMessages: () => request<{ messages: ContactMessage[] }>('/admin/contact-messages'),

  resolveContactMessage: (id: string) =>
    request<{ contactMessage: ContactMessage; message: string }>(`/admin/contact-messages/${id}/resolve`, {
      method: 'PATCH',
    }),

  getAdminAuditLogs: () => request<{ logs: AuditLog[] }>('/admin/audit-logs'),

  getAdminReportsSummary: () =>
    request<{
      revenueSummary: { totalRevenue: number; paidTransactions: number; refundedTransactions: number };
      bookingsCount: number;
      vehiclesCount: number;
      customersCount: number;
    }>('/admin/reports'),

  exportReportCsv: (type: 'bookings' | 'revenue' | 'vehicles') =>
    request<string>(`/admin/reports?type=${type}&format=csv`),

  resetDatabaseSeed: () => request<{ message: string }>('/setup/seed', { method: 'POST' }),
};
