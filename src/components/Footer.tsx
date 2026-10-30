import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, Clock, Award } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Ethos */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white text-slate-950 flex items-center justify-center font-bold text-base">
                V
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                VELOCITA
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Executive mobility and prestige automotive rentals engineered for business leaders, travelers, and bespoke private events. Guaranteed vehicle matching with meticulous sanitization.
            </p>
            <div className="flex flex-col gap-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Full Comprehensive Insurance & 24/7 Roadside Assistance</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Express 3-Minute Priority Key Handover</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Pristine Multi-Point Certified Fleet</span>
              </div>
            </div>
          </div>

          {/* Quick Fleet Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Fleet Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('/vehicles?category=sedan')}
                  className="hover:text-white transition-colors"
                >
                  Executive Sedans
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/vehicles?category=suv')}
                  className="hover:text-white transition-colors"
                >
                  All-Terrain Premium SUVs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/vehicles?category=luxury')}
                  className="hover:text-white transition-colors"
                >
                  Grand Touring & Luxury Coupes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/vehicles?category=van')}
                  className="hover:text-white transition-colors"
                >
                  8-Passenger VIP Vans
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/vehicles?category=economy')}
                  className="hover:text-white transition-colors"
                >
                  City & Compact Editions
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Company & Services
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-white transition-colors"
                >
                  About Velocita
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-white transition-colors"
                >
                  Concierge & Inquiries
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/vehicles')}
                  className="hover:text-white transition-colors"
                >
                  Search Available Dates
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/my-bookings')}
                  className="hover:text-white transition-colors"
                >
                  Manage Reservation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-white transition-colors"
                >
                  Corporate Accounts
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Concierge Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Fleet Concierge
            </h4>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Downtown Center Terminal & Airport VIP Ground Pavilions
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-mono text-xs">+1 (800) 555-VELO</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-mono text-xs">concierge@velocita.com</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-900">
              <p className="text-xs text-slate-500">
                Operating 24 hours daily, 365 days a year with on-call airport delivery and recovery teams.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Velocita Prestige Rental Systems. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer" onClick={() => onNavigate('/about')}>Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer" onClick={() => onNavigate('/about')}>Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer" onClick={() => onNavigate('/contact')}>Roadside Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
