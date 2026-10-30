import React, { useState, useEffect } from 'react';
import { AdminMetrics } from '../../types.ts';
import { api } from '../../services/api.ts';
import {
  Car,
  Users,
  CalendarCheck,
  Banknote,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { ImageWithFallback } from '../../components/ImageWithFallback.tsx';
import { formatLKR, formatLKRWithDecimals } from '../../utils/currency.ts';

interface AdminDashboardPageProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigateTab }) => {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMetrics = () => {
    setIsLoading(true);
    api
      .getAdminOverview()
      .then((res) => {
        setMetrics(res.metrics);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch admin metrics.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-center gap-2">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <span>{error || 'Unable to display admin statistics.'}</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 block">
            Executive Control Tower
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
            Fleet Operations Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time telemetry and revenue calculated directly from confirmed database records.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onNavigateTab('vehicles')}
            className="px-3.5 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
          >
            Add New Vehicle
          </button>
          <button
            onClick={() => onNavigateTab('reports')}
            className="px-3.5 py-2 border border-slate-200 bg-white text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Export CSV Reports
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Confirmed Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
            <span>Confirmed Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {formatLKRWithDecimals(metrics.recordedRevenue)}
            </span>
            <span className="text-[11px] text-emerald-600 block mt-1 font-medium">
              Calculated from confirmed payment records
            </span>
          </div>
        </div>

        {/* Total Fleet & Utilization */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
            <span>Fleet Status</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                {metrics.totalVehicles}
              </span>
              <span className="text-xs text-slate-500">
                ({metrics.availableVehicles} available)
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-blue-900 h-full rounded-full"
                style={{ width: `${metrics.utilizationRate}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">
              Utilization Rate: <strong>{metrics.utilizationRate}%</strong>
            </span>
          </div>
        </div>

        {/* Total Bookings & Active */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
            <span>Total Bookings</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {metrics.totalBookings}
            </span>
            <span className="text-[11px] text-indigo-700 block mt-1 font-medium">
              {metrics.activeBookings} currently active or scheduled
            </span>
          </div>
        </div>

        {/* Registered Customers */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
            <span>Verified Customers</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {metrics.totalCustomers}
            </span>
            <span className="text-[11px] text-slate-500 block mt-1">
              With full driver licensing profiles
            </span>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Customer Bookings</h3>
            <p className="text-xs text-slate-500">Latest reservations registered in PostgreSQL</p>
          </div>
          <button
            onClick={() => onNavigateTab('bookings')}
            className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Bookings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="p-4">Reference</th>
                <th className="p-4">Vehicle</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Schedule</th>
                <th className="p-4 text-right">Amount (LKR)</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {metrics.recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400">
                    No booking records recorded yet.
                  </td>
                </tr>
              ) : (
                metrics.recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900">
                      {b.bookingReference}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-9 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          <ImageWithFallback
                            src={b.vehicleImage}
                            alt={b.vehicleName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-semibold text-slate-900 line-clamp-1">{b.vehicleName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-slate-900">{b.customerName}</p>
                      <p className="text-[11px] text-slate-400">{b.customerEmail}</p>
                    </td>
                    <td className="p-4 text-slate-600 font-mono">
                      {b.pickupDate} to {b.returnDate}
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {formatLKRWithDecimals(b.totalAmount)}
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
