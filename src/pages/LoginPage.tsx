import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { Eye, EyeOff, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin' || user.role === 'fleet_manager') {
        onNavigate('/admin/dashboard');
      } else {
        onNavigate('/my-bookings');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (role: 'admin' | 'customer') => {
    if (role === 'admin') {
      setEmail('admin@velocita.com');
      setPassword('admin123');
    } else {
      setEmail('customer@velocita.com');
      setPassword('customer123');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/90 shadow-xl p-8 space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-10 h-10 rounded-xl bg-slate-900 text-white font-bold items-center justify-center text-xl">
            V
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sign In to Velocita</h1>
          <p className="text-xs text-slate-500">Access your luxury vehicle reservations and priority concierge</p>
        </div>

        {/* Demo Fast Logins for Testing */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Demo Credentials (1-Click Fill)
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className="flex-1 py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-lg text-xs font-semibold border border-indigo-200 transition-colors cursor-pointer"
            >
              Fill Administrator
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('customer')}
              className="flex-1 py-1.5 px-2 bg-slate-200/80 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold border border-slate-300 transition-colors cursor-pointer"
            >
              Fill Customer
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-400"
          >
            <span>{isSubmitting ? 'Verifying Account...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>Don't have an account yet? </span>
          <button
            onClick={() => onNavigate('/register')}
            className="font-bold text-slate-900 hover:underline cursor-pointer"
          >
            Register Here
          </button>
        </div>
      </div>
    </div>
  );
};
