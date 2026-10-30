import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { BookingModal } from './components/BookingModal.tsx';
import { AIChatAgent } from './components/AIChatAgent';import { HomePage } from './pages/HomePage.tsx';
import { VehiclesPage } from './pages/VehiclesPage.tsx';
import { VehicleDetailPage } from './pages/VehicleDetailPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { MyBookingsPage } from './pages/MyBookingsPage.tsx';
import { ProfilePage } from './pages/ProfilePage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { AdminLayout } from './pages/admin/AdminLayout.tsx';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.tsx';
import { AdminVehiclesPage } from './pages/admin/AdminVehiclesPage.tsx';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage.tsx';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage.tsx';
import { AdminPaymentsPage } from './pages/admin/AdminPaymentsPage.tsx';
import { AdminReportsPage } from './pages/admin/AdminReportsPage.tsx';
import { Vehicle, Booking } from './types.ts';

function AppContent() {
  const { user, isAdmin } = useAuth();

  // Simple client-side URL & query routing
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const [pathParams, setPathParams] = useState<Record<string, string>>({});
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  // Global Booking Modal State
  const [bookingVehicle, setBookingVehicle] = useState<Vehicle | null>(null);
  const [bookingDates, setBookingDates] = useState<{ pickupDate: string; returnDate: string } | undefined>(undefined);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Admin Tab State
  const [adminTab, setAdminTab] = useState('dashboard');

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname || '/';
      setCurrentPath(path);
      if (path.startsWith('/vehicles/') && path !== '/vehicles') {
        const id = path.replace('/vehicles/', '');
        setSelectedVehicleId(id);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string, params: Record<string, string> = {}) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setPathParams(params);

    if (path.startsWith('/vehicles/') && path !== '/vehicles') {
      const id = path.replace('/vehicles/', '');
      setSelectedVehicleId(id);
      setCurrentPath('/vehicles/detail');
      window.history.pushState({}, '', path);
      return;
    }

    setSelectedVehicleId(null);
    setCurrentPath(path);
    window.history.pushState({}, '', path);
  };

  const handleOpenBooking = (vehicle: Vehicle, dates?: { pickupDate: string; returnDate: string }) => {
    setBookingVehicle(vehicle);
    setBookingDates(dates);
    setIsBookingModalOpen(true);
  };

  const handleBookingSuccess = (_booking: Booking) => {
    setIsBookingModalOpen(false);
    navigate('/my-bookings');
  };

  // If in Admin Section and authorized
  if (currentPath.startsWith('/admin')) {
    if (!isAdmin) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Administrator Access Required</h2>
            <p className="text-xs text-slate-500">
              Please sign in with administrator credentials (e.g. <code>admin@velocita.com</code>) to access the management portal.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Sign In As Admin
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Return to Site
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <AdminLayout
        currentTab={adminTab}
        onSelectTab={setAdminTab}
        onNavigateHome={() => navigate('/')}
      >
        {adminTab === 'dashboard' && <AdminDashboardPage onNavigateTab={setAdminTab} />}
        {adminTab === 'vehicles' && <AdminVehiclesPage />}
        {adminTab === 'bookings' && <AdminBookingsPage />}
        {adminTab === 'customers' && <AdminCustomersPage />}
        {adminTab === 'payments' && <AdminPaymentsPage />}
        {adminTab === 'reports' && <AdminReportsPage />}
      </AdminLayout>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-900 selection:text-white relative">
      {/* Top Navbar */}
      <Navbar currentPath={currentPath} onNavigate={navigate} />

      {/* Main Page View */}
      <main className="flex-1">
        {currentPath === '/' && (
          <HomePage
            onNavigate={navigate}
            onOpenBooking={handleOpenBooking}
          />
        )}

        {currentPath === '/vehicles' && (
          <VehiclesPage
            initialFilters={pathParams}
            onViewDetails={(id) => navigate(`/vehicles/${id}`)}
            onBookNow={handleOpenBooking}
          />
        )}

        {currentPath === '/vehicles/detail' && selectedVehicleId && (
          <VehicleDetailPage
            vehicleId={selectedVehicleId}
            onBack={() => navigate('/vehicles')}
            onBookNow={handleOpenBooking}
          />
        )}

        {currentPath === '/login' && <LoginPage onNavigate={navigate} />}
        {currentPath === '/register' && <RegisterPage onNavigate={navigate} />}
        {currentPath === '/my-bookings' && <MyBookingsPage onNavigate={navigate} />}
        {currentPath === '/profile' && <ProfilePage onNavigate={navigate} />}
        {currentPath === '/contact' && <ContactPage />}
        {currentPath === '/about' && <AboutPage onNavigate={navigate} />}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigate} />

      {/* Booking Checkout Modal */}
      <BookingModal
        vehicle={bookingVehicle}
        initialDates={bookingDates}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSuccess={handleBookingSuccess}
        onNavigateLogin={() => {
          setIsBookingModalOpen(false);
          navigate('/login');
        }}
      />

      {/* 🤖 AI Customer Support Agent Floating Widget */}
      <AIChatAgent />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}