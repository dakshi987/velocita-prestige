import React, { useState, useEffect } from 'react';
import { Booking } from '../../types.ts';
import { api } from '../../services/api.ts';
import {
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  X,
  FileCheck,
  RotateCcw,
} from 'lucide-react';
import { ImageWithFallback } from '../../components/ImageWithFallback.tsx';
import { formatLKRWithDecimals } from '../../utils/currency.ts';

export const AdminBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Status Change Modal
  const [statusModalBooking, setStatusModalBooking] = useState<Booking | null>(null);
  const [newStatus, setNewStatus] = useState<Booking['status']>('confirmed');
  const [statusNotes, setStatusNotes] = useState('');

  // Vehicle Return Modal
  const [returnModalBooking, setReturnModalBooking] = useState<Booking | null>(null);
  const [odometer, setOdometer] = useState('24500');
  const [fuelPercent, setFuelPercent] = useState('100');
  const [damageFee, setDamageFee] = useState('0');
  const [conditionNotes, setConditionNotes] = useState('Vehicle inspected. Pristine condition.');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBookings = () => {
    setIsLoading(true);
    api
      .getAdminBookings()
      .then((res) => {
        setBookings(res.bookings);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch bookings.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusModalBooking) return;
    setIsSubmitting(true);
    setError('');

    try {
      await api.updateBookingStatus(statusModalBooking.id, newStatus, statusNotes);
      setSuccess(`Booking ${statusModalBooking.bookingReference} status updated to ${newStatus}.`);
      setStatusModalBooking(null);
      fetchBookings();
    } catch (err: any) {
      setError(err.message || 'Failed to update booking status.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecordReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnModalBooking) return;
    setIsSubmitting(true);
    setError('');

    try {
      await api.recordVehicleReturn({
        bookingId: returnModalBooking.id,
        odometerReading: Number(odometer),
        fuelLevelPercent: Number(fuelPercent),
        damageFee: Number(damageFee),
        conditionNotes,
      });

      setSuccess(`Vehicle return logged for reservation ${returnModalBooking.bookingReference}. Vehicle status restored to available.`);
      setReturnModalBooking(null);
      fetchBookings();
    } catch (err: any) {
      setError(err.message || 'Failed to record return.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = bookings.filter((b) => {
    const term = search.toLowerCase();
    const matchesSearch =
      b.bookingReference.toLowerCase().includes(term) ||
      (b.customerName || '').toLowerCase().includes(term) ||
      (b.vehicleName || '').toLowerCase().includes(term);
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 block">
            Reservation Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
            Fleet Bookings & Dispatch
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review incoming reservations, update dispatch workflows, and process vehicle returns.
          </p>
        </div>

        <button
          onClick={fetchBookings}
          className="self-start sm:self-auto px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Refresh Bookings</span>
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess('')} className="font-bold">✕</button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="font-bold">✕</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search booking ref, customer, vehicle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="active">Active (On Road)</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="p-4">Ref Code</th>
                <th className="p-4">Vehicle</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Schedule</th>
                <th className="p-4 text-right">Amount (LKR)</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Workflow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No bookings found matching filters.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900">
                      {b.bookingReference}
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{b.vehicleName}</p>
                      <p className="text-[11px] font-mono text-slate-400">{b.vehicleRegistration}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-slate-900">{b.customerName}</p>
                      <p className="text-[11px] text-slate-400">{b.customerEmail}</p>
                    </td>
                    <td className="p-4 font-mono text-slate-600">
                      {b.pickupDate} to {b.returnDate}
                      <span className="block text-[10px] text-slate-400 font-sans">
                        {b.rentalDays} day{b.rentalDays > 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {formatLKRWithDecimals(b.totalAmount)}
                      <span className="block text-[10px] text-emerald-600 font-sans uppercase">
                        {b.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          b.status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : b.status === 'active'
                            ? 'bg-blue-50 text-blue-900'
                            : b.status === 'completed'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setStatusModalBooking(b);
                            setNewStatus(b.status);
                            setStatusNotes('');
                          }}
                          className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-100 rounded-md font-semibold text-slate-700 transition-colors cursor-pointer"
                        >
                          Status
                        </button>
                        {b.status === 'active' && (
                          <button
                            onClick={() => {
                              setReturnModalBooking(b);
                              setOdometer('24800');
                              setFuelPercent('100');
                              setDamageFee('0');
                              setConditionNotes('Vehicle returned. Clean inspection.');
                            }}
                            className="px-2.5 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-md font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <FileCheck className="w-3 h-3" />
                            <span>Return Check</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Booking Status Modal */}
      {statusModalBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Update Status: #{statusModalBooking.bookingReference}
              </h3>
              <button onClick={() => setStatusModalBooking(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">Select Workflow Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as Booking['status'])}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white font-medium"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="active">Active (Key Handed Over / Vehicle Picked Up)</option>
                  <option value="completed">Completed (Vehicle Returned)</option>
                  <option value="cancelled">Cancelled (Issue Refund)</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">Internal Note (Optional)</label>
                <textarea
                  rows={2}
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="Notes on client handover, VIP tags, or inspection status..."
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStatusModalBooking(null)}
                  className="px-4 py-2 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
                >
                  {isSubmitting ? 'Updating...' : 'Save Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Vehicle Return Inspection Modal */}
      {returnModalBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-indigo-700 uppercase block">Check-in Protocol</span>
                <h3 className="text-base font-bold text-slate-900">
                  Record Vehicle Return: #{returnModalBooking.bookingReference}
                </h3>
              </div>
              <button onClick={() => setReturnModalBooking(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordReturn} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">Odometer Reading (km)</label>
                  <input
                    type="number"
                    required
                    value={odometer}
                    onChange={(e) => setOdometer(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">Fuel / Battery Level (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={fuelPercent}
                    onChange={(e) => setFuelPercent(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">Damage Fee Surcharge (Rs. / LKR)</label>
                <input
                  type="number"
                  min="0"
                  value={damageFee}
                  onChange={(e) => setDamageFee(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Deducted from security deposit if damage is identified. Leave 0 for clean return.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">Condition Notes</label>
                <textarea
                  rows={2}
                  value={conditionNotes}
                  onChange={(e) => setConditionNotes(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReturnModalBooking(null)}
                  className="px-4 py-2 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold cursor-pointer"
                >
                  {isSubmitting ? 'Logging Return...' : 'Complete Return & Free Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
