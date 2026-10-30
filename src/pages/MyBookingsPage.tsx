import React, { useEffect, useState } from 'react';
import { Calendar, RefreshCw } from 'lucide-react';
import { ImageWithFallback } from '../components/ImageWithFallback.tsx';
import { api } from '../services/api.ts';
import { formatLKRWithDecimals } from '../utils/currency.ts';

interface MyBookingsPageProps {
  onNavigate: (path: string) => void;
}

export const MyBookingsPage: React.FC<MyBookingsPageProps> = ({ onNavigate }) => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = () => {
    setIsLoading(true);
    api.getMyBookings()
      .then((res: any) => {
        const data = Array.isArray(res) ? res : (res?.bookings || res?.data || []);
        setBookings(data);
      })
      .catch((err) => {
        console.error('Failed to fetch user bookings:', err);
        setBookings([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 block">
            Customer Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
            My Reservations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track active rentals, view itemized receipts, or manage your vehicle reservation schedule.
          </p>
        </div>
        <button
          onClick={fetchBookings}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Bookings</span>
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-44 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">You have no active or past reservations</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Ready to experience executive mobility? Browse our certified fleet and reserve your preferred vehicle today.
            </p>
          </div>
          <a
            href="/vehicles"
            onClick={(event) => {
              event.preventDefault();
              onNavigate('/vehicles');
            }}
            className="inline-block px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Explore Available Fleet
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 hover:border-slate-300 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200/60 font-mono text-xs font-bold rounded-lg">
                    {booking.bookingReference || `VEL-${booking.id?.substring(0, 6)}`}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                      booking.status === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : booking.status === 'cancelled'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {booking.status || 'Confirmed'}
                  </span>
                </div>
                <div className="text-left md:text-right">
                  <span className="text-[11px] text-slate-400 block font-semibold uppercase">Total Amount</span>
                  <span className="text-xl font-black text-slate-900 font-mono tabular-nums">
                    {formatLKRWithDecimals(booking.totalAmount || booking.totalAmountLKR || 0)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-24 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                    <ImageWithFallback
                      src={booking.vehicle?.featuredImageUrl || ''}
                      alt={booking.vehicle?.name || booking.vehicleName || 'Reserved Vehicle'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] font-medium block">Vehicle</span>
                    <p className="font-bold text-slate-800 mt-0.5">
                      {booking.vehicle?.name || booking.vehicleName || 'Reserved Vehicle'}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 text-[11px] font-medium block">Rental Dates</span>
                  <p className="font-semibold text-slate-700 mt-0.5">
                    {booking.pickupDate} → {booking.returnDate}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 text-[11px] font-medium block">Pickup Location</span>
                  <p className="font-semibold text-slate-700 mt-0.5">
                    {booking.pickupLocation || 'Main Hub'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
