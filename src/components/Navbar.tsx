import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { Shield, User as UserIcon, LogOut, Menu, X, CalendarCheck, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const { user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Single text wordmark */}
          <button
            onClick={() => handleNav('/')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-navy-950 bg-slate-900 flex items-center justify-center text-white font-bold tracking-tight text-lg shadow-sm">
              V
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-blue-900 transition-colors">
                VELOCITA
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold -mt-1">
                Prestige Fleet
              </span>
            </div>
          </button>

          {/* Zone 2: 4-5 single-line clean nav links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              onClick={() => handleNav('/')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
                currentPath === '/' ? 'text-blue-900 font-semibold' : 'hover:text-slate-900'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('/vehicles')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
                currentPath === '/vehicles' ? 'text-blue-900 font-semibold' : 'hover:text-slate-900'
              }`}
            >
              Fleet Catalog
            </button>
            <button
              onClick={() => handleNav('/about')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
                currentPath === '/about' ? 'text-blue-900 font-semibold' : 'hover:text-slate-900'
              }`}
            >
              About Us
            </button>
            <button
              onClick={() => handleNav('/contact')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
                currentPath === '/contact' ? 'text-blue-900 font-semibold' : 'hover:text-slate-900'
              }`}
            >
              Contact & Concierge
            </button>
            {user && (
              <button
                onClick={() => handleNav('/my-bookings')}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
                  currentPath === '/my-bookings' ? 'text-blue-900 font-semibold' : 'hover:text-slate-900'
                }`}
              >
                <CalendarCheck className="w-4 h-4 text-blue-800" />
                <span>My Bookings</span>
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => handleNav('/admin/dashboard')}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
                  currentPath.startsWith('/admin') ? 'text-indigo-900 font-semibold' : 'text-slate-800 hover:text-indigo-900'
                }`}
              >
                <Shield className="w-4 h-4 text-indigo-700" />
                <span>Admin Console</span>
              </button>
            )}
          </nav>

          {/* Zone 3: 1 primary action or user account module */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-800 hover:bg-slate-50 transition-colors focus:outline-none"
                >
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <span className="max-w-[120px] truncate">{user.name}</span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-900 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[11px] font-medium text-blue-900 uppercase tracking-wider">
                        {user.role}
                      </span>
                    </div>

                    <button
                      onClick={() => handleNav('/profile')}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      Customer Profile
                    </button>

                    <button
                      onClick={() => handleNav('/my-bookings')}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <CalendarCheck className="w-4 h-4 text-slate-400" />
                      Rental History
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => handleNav('/admin/dashboard')}
                        className="w-full text-left px-4 py-2 text-sm text-indigo-700 hover:bg-indigo-50 flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                        Admin Dashboard
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={() => {
                        logout();
                        handleNav('/');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => handleNav('/login')}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNav('/register')}
                  className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm whitespace-nowrap"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => handleNav('/')}
              className="px-3 py-2 text-left text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              Home
            </button>
            <button
              onClick={() => handleNav('/vehicles')}
              className="px-3 py-2 text-left text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              Fleet Catalog
            </button>
            <button
              onClick={() => handleNav('/about')}
              className="px-3 py-2 text-left text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              About Us
            </button>
            <button
              onClick={() => handleNav('/contact')}
              className="px-3 py-2 text-left text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              Contact Concierge
            </button>

            {user ? (
              <>
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={() => handleNav('/my-bookings')}
                  className="px-3 py-2 text-left text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                >
                  <CalendarCheck className="w-4 h-4 text-blue-800" />
                  My Bookings
                </button>
                <button
                  onClick={() => handleNav('/profile')}
                  className="px-3 py-2 text-left text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                >
                  <UserIcon className="w-4 h-4 text-slate-600" />
                  My Profile
                </button>
                {isAdmin && (
                  <button
                    onClick={() => handleNav('/admin/dashboard')}
                    className="px-3 py-2 text-left text-sm font-medium text-indigo-700 hover:bg-indigo-50 rounded-lg flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4 text-indigo-600" />
                    Admin Dashboard
                  </button>
                )}
                <button
                  onClick={() => {
                    logout();
                    handleNav('/');
                  }}
                  className="px-3 py-2 text-left text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  Sign Out ({user.name})
                </button>
              </>
            ) : (
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => handleNav('/login')}
                  className="w-full text-center py-2 text-sm font-medium text-slate-800 border border-slate-200 rounded-lg"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNav('/register')}
                  className="w-full text-center py-2 text-sm font-medium text-white bg-slate-900 rounded-lg"
                >
                  Register Account
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
