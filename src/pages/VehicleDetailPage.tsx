import React, { useState, useEffect } from 'react';
import { Vehicle } from '../types.ts';
import { api } from '../services/api.ts';
import { ImageWithFallback } from '../components/ImageWithFallback.tsx';
import {
  Users,
  Fuel,
  Gauge,
  MapPin,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  ArrowLeft,
  Share2,
  AlertCircle,
} from 'lucide-react';
import { formatLKR } from '../utils/currency.ts';

interface VehicleDetailPageProps {
  vehicleId: string;
  onBack: () => void;
  onBookNow: (vehicle: Vehicle, dates?: { pickupDate: string; returnDate: string }) => void;
}

export const VehicleDetailPage: React.FC<VehicleDetailPageProps> = ({
  vehicleId,
  onBack,
  onBookNow,
}) => {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Date selection for live quote
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 5);

  const [pickupDate, setPickupDate] = useState(tomorrow.toISOString().split('T')[0]);
  const [returnDate, setReturnDate] = useState(nextWeek.toISOString().split('T')[0]);
  const [isChecking, setIsChecking] = useState(false);
  const [quote, setQuote] = useState<{
    isAvailable: boolean;
    rentalDays: number;
    rentalSubtotal: number;
    insuranceTotal: number;
    taxTotal: number;
    depositAmount: number;
    totalAmount: number;
  } | null>(null);

  useEffect(() => {
    setIsLoading(true);
    api
      .getVehicleById(vehicleId)
      .then((res) => {
        setVehicle(res.vehicle);
        setSelectedImage(res.vehicle.featuredImageUrl);
      })
      .catch((err) => {
        setError(err.message || 'Vehicle not found.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [vehicleId]);

  useEffect(() => {
    if (!vehicle || !pickupDate || !returnDate) return;
    if (new Date(returnDate) <= new Date(pickupDate)) {
      setQuote(null);
      return;
    }

    setIsChecking(true);
    api
      .checkAvailability({
        vehicleId: vehicle.id,
        pickupDate,
        returnDate,
      })
      .then((res) => {
        setQuote(res);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsChecking(false);
      });
  }, [vehicle, pickupDate, returnDate]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="h-96 rounded-2xl bg-slate-100 animate-pulse" />
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Vehicle Not Found</h2>
        <p className="text-sm text-slate-600">{error || 'The requested vehicle could not be loaded.'}</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
        >
          Return to Fleet Catalog
        </button>
      </div>
    );
  }

  const isAvailable = vehicle.status === 'available';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Fleet Catalog</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Registration:</span>
          <span className="font-mono text-xs font-bold bg-slate-100 px-2.5 py-1 rounded-md text-slate-800 border border-slate-200">
            {vehicle.registrationNumber}
          </span>
        </div>
      </div>

      {/* Main Grid: Gallery & Contiguous Purchase Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Image Gallery & Details */}
        <div className="lg:col-span-7 space-y-8">
          {/* Main Large Image */}
          <div className="aspect-16/10 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative shadow-xs">
            <ImageWithFallback
              src={selectedImage || vehicle.featuredImageUrl}
              alt={vehicle.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/90 text-slate-900 backdrop-blur-xs shadow-xs uppercase tracking-wider">
                {vehicle.category}
              </span>
            </div>
          </div>

          {/* Thumbnail Strip */}
          {vehicle.galleryImageUrls && vehicle.galleryImageUrls.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {vehicle.galleryImageUrls.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(url)}
                  className={`w-24 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === url ? 'border-slate-900 shadow-xs' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <ImageWithFallback src={url} alt={`${vehicle.name} thumbnail`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Vehicle Specifications Table */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Vehicle Specifications</h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1">Make & Model</span>
                <span className="font-bold text-slate-900 text-sm">{vehicle.brand} {vehicle.name}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1">Model Year</span>
                <span className="font-bold text-slate-900 text-sm">{vehicle.modelYear}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1">Passenger Capacity</span>
                <span className="font-bold text-slate-900 text-sm">{vehicle.seatingCapacity} Adult Seats</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1">Transmission</span>
                <span className="font-bold text-slate-900 text-sm capitalize">{vehicle.transmission}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1">Fuel / Propulsion</span>
                <span className="font-bold text-slate-900 text-sm capitalize">{vehicle.fuelType}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1">Daily Mileage Limit</span>
                <span className="font-bold text-slate-900 text-sm font-mono">{vehicle.mileageLimit} km / day</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1">Assigned Station</span>
                <span className="font-bold text-slate-900 text-sm truncate">{vehicle.location}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1">Security Deposit</span>
                <span className="font-bold text-slate-900 text-sm font-mono">{formatLKR(vehicle.depositAmount)}</span>
              </div>
            </div>

            {/* Description */}
            <div className="pt-2">
              <h4 className="text-sm font-bold text-slate-900 mb-2">Vehicle Overview</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{vehicle.description}</p>
            </div>

            {/* Features */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 mb-3">Standard Equipment & Comfort Features</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {vehicle.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Reservation & Quote Module */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-md space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Daily Rental Base
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                    isAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {isAvailable ? 'Instant Confirmation' : vehicle.status.toUpperCase()}
                </span>
              </div>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                  {formatLKR(vehicle.dailyRate)}
                </span>
                <span className="text-sm text-slate-500">/ 24-hour cycle</span>
              </div>
            </div>

            {/* Schedule Selector */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Select Rental Period
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    min={pickupDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Itemized Live Estimate */}
            {isChecking && (
              <div className="text-xs text-slate-400 animate-pulse text-center py-2">
                Calculating live quote...
              </div>
            )}

            {quote && !isChecking && (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>
                    Subtotal ({quote.rentalDays} day{quote.rentalDays > 1 ? 's' : ''} × {formatLKR(vehicle.dailyRate)})
                  </span>
                  <span className="font-mono tabular-nums font-semibold">{formatLKR(quote.rentalSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Insurance & Roadside Protection</span>
                  <span className="font-mono tabular-nums font-semibold">{formatLKR(quote.insuranceTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>State Taxes & Concession Fee (8%)</span>
                  <span className="font-mono tabular-nums font-semibold">{formatLKR(quote.taxTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Refundable Security Deposit</span>
                  <span className="font-mono tabular-nums font-semibold">{formatLKR(quote.depositAmount)}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                  <span>Total Due</span>
                  <span className="font-mono tabular-nums">{formatLKR(quote.totalAmount)}</span>
                </div>
              </div>
            )}

            {quote && !quote.isAvailable && (
              <div className="p-3 bg-amber-50 rounded-lg text-amber-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>This vehicle is already reserved for these dates. Please choose another date range.</span>
              </div>
            )}

            {/* Book Now Button */}
            <button
              onClick={() => onBookNow(vehicle, { pickupDate, returnDate })}
              disabled={!isAvailable || (quote !== null && !quote.isAvailable)}
              className={`w-full py-3.5 px-4 rounded-xl text-sm font-medium text-white transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                isAvailable && (!quote || quote.isAvailable)
                  ? 'bg-slate-900 hover:bg-slate-800'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Proceed to Booking</span>
            </button>

            {/* Reassurance points */}
            <div className="space-y-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero cancellation penalty up to 24h before pickup</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-800" />
                <span>Available at {vehicle.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
