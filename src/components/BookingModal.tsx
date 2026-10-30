import React, { useState, useEffect } from 'react';
import { Vehicle, Booking } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { ImageWithFallback } from './ImageWithFallback.tsx';
import { X, Calendar, MapPin, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { formatLKR } from '../utils/currency.ts';

interface BookingModalProps {
  vehicle: Vehicle | null;
  initialDates?: { pickupDate: string; returnDate: string };
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (booking: Booking) => void;
  onNavigateLogin: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  vehicle,
  initialDates,
  isOpen,
  onClose,
  onSuccess,
  onNavigateLogin,
}) => {
  const { user } = useAuth();

  // Tomorrow as default pickup, 4 days later as default return
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 5);

  const defaultStart = tomorrow.toISOString().split('T')[0];
  const defaultEnd = nextWeek.toISOString().split('T')[0];

  const [pickupDate, setPickupDate] = useState(initialDates?.pickupDate || defaultStart);
  const [returnDate, setReturnDate] = useState(initialDates?.returnDate || defaultEnd);
  const [pickupLocation, setPickupLocation] = useState(vehicle?.location || 'Colombo Central Terminal (Galle Face)');
  const [returnLocation, setReturnLocation] = useState(vehicle?.location || 'Colombo Central Terminal (Galle Face)');
  const [specialRequests, setSpecialRequests] = useState('');

  const [isLoadingCheck, setIsLoadingCheck] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [quote, setQuote] = useState<{
    isAvailable: boolean;
    rentalDays: number;
    dailyRate: number;
    rentalSubtotal: number;
    insuranceTotal: number;
    taxTotal: number;
    depositAmount: number;
    totalAmount: number;
  } | null>(null);

  // Check availability whenever dates change
  useEffect(() => {
    if (!vehicle || !isOpen) return;

    if (!pickupDate || !returnDate) {
      setQuote(null);
      return;
    }

    if (new Date(returnDate) <= new Date(pickupDate)) {
      setErrorMessage('Return date must be strictly after pickup date.');
      setQuote(null);
      return;
    }

    setErrorMessage('');
    setIsLoadingCheck(true);

    api
      .checkAvailability({
        vehicleId: vehicle.id,
        pickupDate,
        returnDate,
      })
      .then((res) => {
        setQuote(res);
        if (!res.isAvailable) {
          setErrorMessage('This vehicle is already reserved for these dates. Please adjust your schedule.');
        }
      })
      .catch((err) => {
        setErrorMessage(err.message || 'Failed to verify schedule availability.');
      })
      .finally(() => {
        setIsLoadingCheck(false);
      });
  }, [vehicle, pickupDate, returnDate, isOpen]);

  if (!isOpen || !vehicle) return null;

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onNavigateLogin();
      return;
    }

    if (!quote?.isAvailable) {
      setErrorMessage('Cannot complete reservation: Vehicle is not available for chosen dates.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await api.createBooking({
        vehicleId: vehicle.id,
        pickupDate,
        returnDate,
        pickupLocation,
        returnLocation,
        specialRequests: specialRequests.trim() || undefined,
      });

      onSuccess(res.booking);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to complete reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-900 block">
              Reservation Checkout
            </span>
            <h2 className="text-xl font-bold text-slate-900">{vehicle.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Selected Vehicle Snapshot */}
          <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 items-center">
            <div className="w-24 h-18 rounded-lg overflow-hidden bg-slate-200 shrink-0">
              <ImageWithFallback
                src={vehicle.featuredImageUrl}
                alt={vehicle.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                {vehicle.brand} · {vehicle.category}
              </p>
              <h4 className="text-sm font-bold text-slate-900 truncate">{vehicle.name}</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {vehicle.seatingCapacity} Passenger · {vehicle.transmission} · {vehicle.fuelType}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs text-slate-400 block font-medium">Daily Rate</span>
              <span className="text-base font-bold text-slate-900 font-mono tabular-nums">
                {formatLKR(vehicle.dailyRate)}
              </span>
            </div>
          </div>

          {/* Form */}
          <form id="booking-form" onSubmit={handleSubmitBooking} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Pickup Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 bg-white"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Return Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    min={pickupDate}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 bg-white"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Pickup Location
                </label>
                <div className="relative">
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                  >
                    <option value="Colombo Central Terminal (Galle Face)">Colombo Central Terminal (Galle Face)</option>
                    <option value="Bandaranaike International Airport (CMB VIP Hub)">Bandaranaike International Airport (CMB VIP Hub)</option>
                    <option value="Kandy Royal Pavilion Hub">Kandy Royal Pavilion Hub</option>
                    <option value="Galle Fort Coastal Hub">Galle Fort Coastal Hub</option>
                    <option value="Hambantota International Hub">Hambantota International Hub</option>
                  </select>
                  <MapPin className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Return Location
                </label>
                <div className="relative">
                  <select
                    value={returnLocation}
                    onChange={(e) => setReturnLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                  >
                    <option value="Colombo Central Terminal (Galle Face)">Colombo Central Terminal (Galle Face)</option>
                    <option value="Bandaranaike International Airport (CMB VIP Hub)">Bandaranaike International Airport (CMB VIP Hub)</option>
                    <option value="Kandy Royal Pavilion Hub">Kandy Royal Pavilion Hub</option>
                    <option value="Galle Fort Coastal Hub">Galle Fort Coastal Hub</option>
                    <option value="Hambantota International Hub">Hambantota International Hub</option>
                  </select>
                  <MapPin className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Special Requests or Concierge Instructions (Optional)
              </label>
              <textarea
                rows={2}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="E.g., child safety seat, Katunayake VIP gate delivery, chauffeur service..."
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </form>

          {/* Pricing Calculation Breakdown */}
          {isLoadingCheck && (
            <div className="p-4 bg-slate-50 rounded-xl text-center text-sm text-slate-500 animate-pulse">
              Verifying real-time calendar availability & calculating transparent rate...
            </div>
          )}

          {quote && !isLoadingCheck && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>
                  Rental Rate ({formatLKR(quote.dailyRate)} × {quote.rentalDays} day{quote.rentalDays > 1 ? 's' : ''})
                </span>
                <span className="font-mono tabular-nums font-semibold">{formatLKR(quote.rentalSubtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-800" />
                  Comprehensive Fleet Protection ({formatLKR(vehicle.insuranceFeePerDay)}/day)
                </span>
                <span className="font-mono tabular-nums font-semibold">{formatLKR(quote.insuranceTotal)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>State & Municipal Rental Taxes (8%)</span>
                <span className="font-mono tabular-nums font-semibold">{formatLKR(quote.taxTotal)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Refundable Security Deposit (Returned upon check-in)</span>
                <span className="font-mono tabular-nums font-semibold">{formatLKR(quote.depositAmount)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm">
                <span className="font-bold text-slate-900">Total Due Today</span>
                <span className="font-bold text-lg text-slate-900 font-mono tabular-nums">
                  {formatLKR(quote.totalAmount)}
                </span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {!user && (
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center justify-between">
              <span>You must be signed in to confirm this reservation.</span>
              <button
                type="button"
                onClick={onNavigateLogin}
                className="font-bold underline cursor-pointer"
              >
                Sign In Now
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>

          {user ? (
            <button
              type="submit"
              form="booking-form"
              disabled={isSubmitting || !quote?.isAvailable}
              className={`px-6 py-2.5 text-sm font-medium rounded-lg text-white transition-colors flex items-center gap-2 ${
                isSubmitting || !quote?.isAvailable
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-slate-900 hover:bg-slate-800 shadow-sm cursor-pointer'
              }`}
            >
              {isSubmitting ? 'Creating Reservation...' : 'Reserve Vehicle'}
            </button>
          ) : (
            <button
              type="button"
              onClick={onNavigateLogin}
              className="px-6 py-2.5 text-sm font-medium rounded-lg text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Sign In to Reserve
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
