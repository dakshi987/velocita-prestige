import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.ts';
import { AuditLog } from '../../types.ts';
import { Download, FileSpreadsheet, ShieldAlert, CheckCircle2, Banknote, Calendar, Car, Users } from 'lucide-react';
import { formatLKRWithDecimals } from '../../utils/currency.ts';

export const AdminReportsPage: React.FC = () => {
  const [reportSummary, setReportSummary] = useState<{
    revenueSummary: { totalRevenue: number; paidTransactions: number; refundedTransactions: number };
    bookingsCount: number;
    vehiclesCount: number;
    customersCount: number;
  } | null>(null);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [activeTab, setActiveTab] = useState<'analytics' | 'audit'>('analytics');
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingType, setDownloadingType] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([api.getAdminReportsSummary(), api.getAdminAuditLogs()])
      .then(([summaryRes, logsRes]) => {
        setReportSummary(summaryRes);
        setAuditLogs(logsRes.logs || []);
      })
      .catch((err) => {
        console.error('Failed to load reports:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleExportCsv = async (type: 'bookings' | 'revenue' | 'vehicles') => {
    setDownloadingType(type);
    try {
      const csvData = await api.exportReportCsv(type);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `velocita_${type}_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to generate CSV export.');
    } finally {
      setDownloadingType(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 block">
          Audited Intelligence & Export
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
          Reports & System Governance
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Export full ledger records to CSV and review system audit trails.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          Analytics & CSV Exports
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'audit'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          System Audit Trail ({auditLogs.length})
        </button>
      </div>

      {activeTab === 'analytics' ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-28 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : reportSummary ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-400 font-semibold uppercase">Confirmed Revenue</span>
                <p className="text-2xl font-extrabold text-slate-900 mt-1 font-mono tabular-nums">
                  {formatLKRWithDecimals(reportSummary?.revenueSummary?.totalRevenue || 0)}
                </p>
                <span className="text-[11px] text-emerald-600 mt-1 block">
                  {reportSummary?.revenueSummary?.paidTransactions || 0} Paid Transactions
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-400 font-semibold uppercase">Total Fleet Size</span>
                <p className="text-2xl font-extrabold text-slate-900 mt-1 font-mono tabular-nums">
                  {reportSummary?.vehiclesCount || 0}
                </p>
                <span className="text-[11px] text-slate-500 mt-1 block">Active across primary hubs</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-400 font-semibold uppercase">Total Reservations</span>
                <p className="text-2xl font-extrabold text-slate-900 mt-1 font-mono tabular-nums">
                  {reportSummary?.bookingsCount || 0}
                </p>
                <span className="text-[11px] text-slate-500 mt-1 block">Lifetime customer bookings</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-400 font-semibold uppercase">Customer Accounts</span>
                <p className="text-2xl font-extrabold text-slate-900 mt-1 font-mono tabular-nums">
                  {reportSummary?.customersCount || 0}
                </p>
                <span className="text-[11px] text-slate-500 mt-1 block">Verified client profiles</span>
              </div>
            </div>
          ) : null}

          {/* Export Action Cards */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Direct CSV Dataset Exports</h3>
            <p className="text-xs text-slate-500">
              Download complete raw tabular datasets formatted for spreadsheet modeling, auditing, and corporate finance.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-4">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center mb-2">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Bookings Report</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Export all reservation lines including vehicle, dates, pricing subtotal, and status.
                  </p>
                </div>
                <button
                  onClick={() => handleExportCsv('bookings')}
                  disabled={downloadingType === 'bookings'}
                  className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloadingType === 'bookings' ? 'Exporting...' : 'Export Bookings CSV'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-4">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center mb-2">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Revenue & Payments (LKR)</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Export payment transactions, transaction IDs, payment methods, and timestamps.
                  </p>
                </div>
                <button
                  onClick={() => handleExportCsv('revenue')}
                  disabled={downloadingType === 'revenue'}
                  className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloadingType === 'revenue' ? 'Exporting...' : 'Export Payments CSV'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-4">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-900 flex items-center justify-center mb-2">
                    <Car className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Fleet Inventory</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Export all vehicles, license plate numbers, daily rental rates, and station locations.
                  </p>
                </div>
                <button
                  onClick={() => handleExportCsv('vehicles')}
                  disabled={downloadingType === 'vehicles'}
                  className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloadingType === 'vehicles' ? 'Exporting...' : 'Export Fleet CSV'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* System Audit Logs */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Security & Operational Audit Log</h3>
            <p className="text-xs text-slate-500">Immutable trace of all administrator changes, logins, and booking creations.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Resource</th>
                  <th className="p-4">User ID</th>
                  <th className="p-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      No audit events recorded yet.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-mono text-slate-500 text-[11px]">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-900">
                        {log.action}
                      </td>
                      <td className="p-4 capitalize text-slate-600">
                        {log.resourceType} {log.resourceId ? `(${log.resourceId})` : ''}
                      </td>
                      <td className="p-4 font-mono text-slate-400 text-[11px]">
                        {log.userId || 'system'}
                      </td>
                      <td className="p-4 font-mono text-slate-600 text-[11px] max-w-xs truncate">
                        {log.details ? JSON.stringify(log.details) : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};