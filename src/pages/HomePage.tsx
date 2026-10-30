import React, { useState, useEffect } from 'react';
import { Vehicle } from '../types.ts';
import { api } from '../services/api.ts';
import { VehicleCard } from '../components/VehicleCard.tsx';
import { ImageWithFallback } from '../components/ImageWithFallback.tsx';
import {
  Search,
  Calendar,
  MapPin,
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowRight,
  Star,
  Clock,
  Car,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string, params?: Record<string, string>) => void;
  onOpenBooking: (vehicle: Vehicle) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenBooking }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Quick Search Form State
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 5);

  const [pickupLocation, setPickupLocation] = useState('Colombo Central Terminal (Galle Face)');
  const [pickupDate, setPickupDate] = useState(tomorrow.toISOString().split('T')[0]);
  const [returnDate, setReturnDate] = useState(nextWeek.toISOString().split('T')[0]);

  useEffect(() => {
    api
      .getVehicles()
      .then((res) => {
        setVehicles(res.vehicles);
      })
      .catch((err) => {
        console.error('Failed to load fleet:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('/vehicles', {
      location: pickupLocation,
      pickupDate,
      returnDate,
    });
  };

  const categories = [
    { id: 'sedan', name: 'Executive Sedans', count: 'Midsize & Full-Size Luxury', icon: Car },
    { id: 'suv', name: 'Premium SUVs', count: 'AWD & 7-Seater Comfort', icon: Car },
    { id: 'luxury', name: 'Grand Touring', count: 'High-Performance Exotics', icon: Sparkles },
    { id: 'van', name: 'VIP Passenger Vans', count: '8-Passenger Shuttles', icon: Car },
    { id: 'economy', name: 'City Compact', count: 'Efficient Urban Mobility', icon: Zap },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-blue-300">
                <span>Verified Direct Fleet</span>
                <span aria-hidden="true">·</span>
                <span>Zero Hidden Surcharges</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-balance">
                Precision luxury. Uncompromised mobility.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                Experience high-performance executive sedans, grand touring exotics, and bespoke all-terrain SUVs delivered pristine to your private terminal or residence.
              </p>

              {/* Trust proof inline */}
              <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Guaranteed Specific Make & Model</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>24/7 Roadside VIP Concierge</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 aspect-16/10">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80"
                  fallbackSrc="/images/hero_rental_fleet_1791960939766.jpg"
                  alt="Velocita Executive Fleet Lineup"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs font-semibold tracking-wider uppercase text-blue-300">Featured Flagship</p>
                  <p className="text-sm font-bold truncate">Mercedes-Benz S 580 4MATIC & Audi A6 Prestige</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Quick Search Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mb-10 relative z-20">
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4 items-end text-slate-900"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Pickup Location
              </label>
              <div className="relative">
                <select
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                >
                  <option value="Colombo Central Terminal (Galle Face)">Colombo Central Terminal (Galle Face)</option>
                  <option value="Bandaranaike International Airport (CMB VIP Hub)">Bandaranaike International Airport (CMB VIP Hub)</option>
                  <option value="Kandy Royal Pavilion Hub">Kandy Royal Pavilion Hub</option>
                  <option value="Galle Fort Coastal Hub">Galle Fort Coastal Hub</option>
                  <option value="Hambantota International Hub">Hambantota International Hub</option>
                </select>
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Rental Start
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={pickupDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Return Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={returnDate}
                  min={pickupDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-slate-900 text-white font-medium text-sm rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer h-[42px]"
              >
                <Search className="w-4 h-4" />
                <span>Search Vehicles</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Categories Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-semibold text-blue-900 uppercase tracking-wider">
              Explore By Class
            </span>
            <h2 className="text-2xl font-bold text-slate-900">Featured Fleet Categories</h2>
          </div>
          <button
            onClick={() => onNavigate('/vehicles')}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 group"
          >
            <span>View All Fleet</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const catCount = vehicles.filter((v) => v.category === cat.id && v.status === 'available').length;
            return (
              <button
                key={cat.id}
                onClick={() => onNavigate('/vehicles', { category: cat.id })}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-400 hover:shadow-xs transition-all text-left flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <span className="text-sm font-bold text-slate-900 group-hover:text-blue-900 transition-colors block">
                    {cat.name}
                  </span>
                  <span className="text-xs text-slate-500 mt-1 block">{cat.count}</span>
                </div>
                <span className="text-[11px] font-semibold text-blue-900 mt-2 block">
                  {catCount > 0 ? `${catCount} Available` : 'Browse Models'} →
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Popular Vehicles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-semibold text-blue-900 uppercase tracking-wider">
              Handpicked Selection
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Popular Vehicles Ready for Immediate Reservation
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/vehicles')}
            className="hidden sm:flex text-xs font-semibold text-slate-700 hover:text-slate-900 items-center gap-1 group"
          >
            <span>Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.slice(0, 6).map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onViewDetails={(id) => onNavigate(`/vehicles/${id}`)}
                onBookNow={onOpenBooking}
              />
            ))}
          </div>
        )}
      </section>

      {/* How It Works */}
      <section className="bg-slate-100/70 border-y border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold text-blue-900 uppercase tracking-wider">
              Seamless Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              How Velocita Works
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              From reservation to priority key handover in three frictionless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs">
              <span className="text-xs font-mono text-slate-400 font-bold block mb-2">STEP 01</span>
              <h3 className="text-base font-bold text-slate-900 mb-2">Select Exact Vehicle & Schedule</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Browse our real-photograph certified fleet. Pick your exact preferred make, model, transmission, and rental duration with live calendar availability.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs">
              <span className="text-xs font-mono text-slate-400 font-bold block mb-2">STEP 02</span>
              <h3 className="text-base font-bold text-slate-900 mb-2">Instant Transparent Confirmation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive an itemized transparent price with insurance and zero surprise counter fees. Instantly secure your reservation with a unique reference code.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs">
              <span className="text-xs font-mono text-slate-400 font-bold block mb-2">STEP 03</span>
              <h3 className="text-base font-bold text-slate-900 mb-2">Priority Handover & Return</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pick up at our terminal concierge or request airport delivery. Return quickly with streamlined digital inspection and immediate deposit settlement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Genuine Testimonials / Quality Standards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold text-blue-900 uppercase tracking-wider">
            Verified Experiences
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Endorsed by Discerning Travelers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-700 italic leading-relaxed">
                "The Audi A6 was immaculate, literally showroom condition. The airport terminal pickup took less than four minutes. Velocita is now my sole vehicle rental partner."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-900">Marcus Sterling</p>
              <p className="text-xs text-slate-500">Managing Partner, Sterling Global Advisory</p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-700 italic leading-relaxed">
                "Rented the Mercedes V-Class for our board delegation. The vehicle was equipped with conference seating and USB-C everywhere. Professionalism from start to finish."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-900">Dr. Elena Rostova</p>
              <p className="text-xs text-slate-500">VP Corporate Affairs, BioHealth Alliance</p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-700 italic leading-relaxed">
                "Transparent billing with zero bait-and-switch insurance pressure. The Range Rover Velar handled our coastal trip flawlessly. Deposit was settled promptly upon return."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-900">Julian Vance</p>
              <p className="text-xs text-slate-500">Architect & Product Designer</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
