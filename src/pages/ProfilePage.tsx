import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { User, Phone, MapPin, CreditCard, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

interface ProfilePageProps {
  onNavigate: (path: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [driverLicenseNumber, setDriverLicenseNumber] = useState(user?.driverLicenseNumber || '');

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Sign In Required</h2>
        <p className="text-xs text-slate-500">Please sign in to view your profile.</p>
        <button
          onClick={() => onNavigate('/login')}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
        >
          Sign In
        </button>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const res = await api.updateProfile({
        name,
        phone,
        address,
        driverLicenseNumber,
      });

      updateUser(res.user);
      setSuccessMessage('Profile information updated successfully.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-blue-900 block">
          Account Settings
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Customer Profile</h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Manage your verified driver credentials and contact information for expedited vehicle checkouts.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Account Badge Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center text-2xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{user.name}</h3>
            <p className="text-xs text-slate-500">{user.email}</p>
            <span className="inline-block mt-2 text-[11px] font-semibold text-blue-900 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
              Role: {user.role}
            </span>
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-2">
            <p className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Identity Verified</span>
            </p>
            <p className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-800" />
              <span>Priority Rental Privileges</span>
            </p>
          </div>
        </div>

        {/* Profile Edit Form */}
        <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Driver's License Number
              </label>
              <input
                type="text"
                value={driverLicenseNumber}
                onChange={(e) => setDriverLicenseNumber(e.target.value)}
                placeholder="e.g. DL-481920-CA"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Required for express vehicle checkout and key handover verification.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Billing / Residential Address
              </label>
              <textarea
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, Suite, City, State, ZIP code"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-xs cursor-pointer disabled:bg-slate-400"
              >
                {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
