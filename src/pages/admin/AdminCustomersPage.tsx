import React, { useState, useEffect } from 'react';
import { User, Booking } from '../../types.ts';
import { api } from '../../services/api.ts';
import { Search, UserCheck, UserX, Shield, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { formatLKRWithDecimals } from '../../utils/currency.ts';

export const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Selected customer for history view
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [customerBookings, setCustomerBookings] = useState<Booking[]>([]);

  const fetchCustomers = () => {
    setIsLoading(true);
    api
      .getAdminCustomers()
      .then((res) => {
        setCustomers(res.customers);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch customers.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleToggleActive = async (c: User) => {
    try {
      await api.updateCustomerStatus(c.id, { isActive: !c.isActive });
      setSuccess(`Account status for ${c.name} updated to ${!c.isActive ? 'Active' : 'Deactivated'}.`);
      fetchCustomers();
    } catch (err: any) {
      setError(err.message || 'Failed to update customer status.');
    }
  };

  const handleViewHistory = async (c: User) => {
    setSelectedCustomer(c);
    try {
      const res = await api.getAdminBookings();
      const userBookings = res.bookings.filter((b) => b.userId === c.id);
      setCustomerBookings(userBookings);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 block">
          Client Directory & Accounts
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
          Manage Customer Accounts
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review customer profiles, check driver licensing records, and monitor lifetime booking values.
        </p>
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
            placeholder="Search by customer name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Driver License</th>
                <th className="p-4 text-center">Total Trips</th>
                <th className="p-4 text-right">Lifetime Spend</th>
                <th className="p-4">Account Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No customers found matching search.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{c.name}</p>
                          <span className="text-[10px] uppercase font-mono text-indigo-700 font-semibold">
                            {c.role}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-slate-900">{c.email}</p>
                      <p className="text-[11px] text-slate-400">{c.phone}</p>
                    </td>
                    <td className="p-4 font-mono font-medium text-slate-800">
                      {c.driverLicenseNumber || <span className="text-slate-400 font-sans italic">Not on file</span>}
                    </td>
                    <td className="p-4 text-center font-bold text-slate-900 font-mono">
                      {c.bookingsCount || 0}
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      ${(c.totalSpent || 0).toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          c.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {c.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewHistory(c)}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                        >
                          History
                        </button>
                        <button
                          onClick={() => handleToggleActive(c)}
                          title={c.isActive ? 'Suspend Customer Account' : 'Reactivate Account'}
                          className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                            c.isActive
                              ? 'text-rose-600 hover:bg-rose-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          {c.isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Booking History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-indigo-700 uppercase block">Customer Booking Records</span>
                <h3 className="text-base font-bold text-slate-900">{selectedCustomer.name}</h3>
                <p className="text-xs text-slate-500">{selectedCustomer.email} · {selectedCustomer.phone}</p>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {customerBookings.length === 0 ? (
                <p className="text-center py-6 text-slate-400">No bookings on record for this customer.</p>
              ) : (
                customerBookings.map((b) => (
                  <div key={b.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{b.vehicleName || 'Vehicle'}</span>
                      <span className="font-mono">{formatLKRWithDecimals(b.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Ref: {b.bookingReference} · {b.pickupDate} to {b.returnDate}</span>
                      <span className="uppercase text-[10px] font-bold text-slate-700">{b.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
