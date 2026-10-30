import React, { useState, useEffect } from 'react';
import { Payment } from '../../types.ts';
import { api } from '../../services/api.ts';
import { Search, CreditCard, RotateCcw, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { ImageWithFallback } from '../../components/ImageWithFallback.tsx';
import { formatLKR, formatLKRWithDecimals } from '../../utils/currency.ts';

export const AdminPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchPayments = () => {
    setIsLoading(true);
    api
      .getAdminPayments()
      .then((res) => {
        setPayments(res.payments);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch payment records.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filtered = payments.filter((p) => {
    const term = search.toLowerCase();
    return (
      p.transactionReference.toLowerCase().includes(term) ||
      (p.bookingRef || '').toLowerCase().includes(term) ||
      (p.customerName || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 block">
            Financial Ledger & Settlement
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
            Payments & Transactions
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete transaction history linked directly to verified booking references and payment gateways.
          </p>
        </div>

        <button
          onClick={fetchPayments}
          className="self-start sm:self-auto px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Refresh Ledger</span>
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

      {/* Search Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search transaction ref, booking ref, or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="p-4">Transaction Ref</th>
                <th className="p-4">Booking Ref</th>
                <th className="p-4">Vehicle</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4 text-right">Amount (LKR)</th>
                <th className="p-4">Status</th>
                <th className="p-4">Processed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No payment records found.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900">
                      {p.transactionReference}
                    </td>
                    <td className="p-4 font-mono font-semibold text-blue-900">
                      {p.bookingRef || 'N/A'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-9 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          <ImageWithFallback
                            src={p.vehicleImage || ''}
                            alt={p.vehicleName || 'Vehicle'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-semibold text-slate-900 line-clamp-1">{p.vehicleName || 'Fleet Vehicle'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-slate-900">{p.customerName}</p>
                      <p className="text-[11px] text-slate-400">{p.customerEmail}</p>
                    </td>
                    <td className="p-4 capitalize text-slate-600">
                      {p.paymentMethod.replace('_', ' ')}
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {formatLKRWithDecimals(p.amount)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          p.status === 'paid'
                            ? 'bg-emerald-50 text-emerald-700'
                            : p.status === 'refunded'
                            ? 'bg-amber-50 text-amber-900'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-slate-500 text-[11px]">
                      {p.paidAt ? new Date(p.paidAt).toLocaleDateString() : 'Pending'}
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
