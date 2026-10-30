import React, { useState, useEffect } from 'react';
import { Vehicle } from '../types.ts';
import { api } from '../services/api.ts';
import { VehicleCard } from '../components/VehicleCard.tsx';
import { Search, RotateCcw, Calendar } from 'lucide-react';

interface VehiclesPageProps {
  initialFilters?: {
    category?: string;
    location?: string;
    pickupDate?: string;
    returnDate?: string;
  };
  onViewDetails: (vehicleId: string) => void;
  onBookNow: (vehicle: Vehicle) => void;
}

export const VehiclesPage: React.FC<VehiclesPageProps> = ({
  initialFilters,
  onViewDetails,
  onBookNow,
}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialFilters?.category || 'all');
  const [location, setLocation] = useState(initialFilters?.location || 'all');
  const [transmission, setTransmission] = useState('all');
  const [seats, setSeats] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [pickupDate, setPickupDate] = useState(initialFilters?.pickupDate || '');
  const [returnDate, setReturnDate] = useState(initialFilters?.returnDate || '');
  const [sortBy, setSortBy] = useState('price_asc');

  const fetchVehicles = () => {
    setIsLoading(true);
    api
      .getVehicles({
        search: search.trim() || undefined,
        category: category !== 'all' ? category : undefined,
        location: location !== 'all' ? location : undefined,
        transmission: transmission !== 'all' ? transmission : undefined,
        seats: seats !== 'all' ? seats : undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        pickupDate: pickupDate || undefined,
        returnDate: returnDate || undefined,
        sortBy,
      })
      .then((res) => {
        setVehicles(res.vehicles);
      })
      .catch((err) => {
        console.error('Failed to query vehicles:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (initialFilters) {
      if (initialFilters.category !== undefined) setCategory(initialFilters.category || 'all');
      if (initialFilters.location !== undefined) setLocation(initialFilters.location || 'all');
      if (initialFilters.pickupDate !== undefined) setPickupDate(initialFilters.pickupDate || '');
      if (initialFilters.returnDate !== undefined) setReturnDate(initialFilters.returnDate || '');
    }
  }, [initialFilters]);

  useEffect(() => {
    fetchVehicles();
  }, [category, location, transmission, seats, sortBy, pickupDate, returnDate]);

  const handleApplySearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVehicles();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('all');
    setLocation('all');
    setTransmission('all');
    setSeats('all');
    setMinPrice('');
    setMaxPrice('');
    setPickupDate('');
    setReturnDate('');
    setSortBy('price_asc');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-blue-900 block">
          Fleet Inventory
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
          Explore Available Prestige Vehicles
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Filter by category, powertrain, seating, or search specific dates to view verified availability.
        </p>
      </div>

      {/* Main Filter Toolbar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
        {/* Top search & sort row */}
        <form onSubmit={handleApplySearch} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by vehicle name, model, or brand (e.g., Audi, Mercedes, SUV)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-xs cursor-pointer whitespace-nowrap"
            >
              Filter Fleet
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              title="Reset all filters"
              className="px-3 py-2.5 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-sm font-medium rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </form>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Category */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 font-medium"
            >
              <option value="all">All Categories</option>
              <option value="sedan">Sedans</option>
              <option value="suv">SUVs</option>
              <option value="luxury">Luxury & GT</option>
              <option value="van">Passenger Vans</option>
              <option value="economy">Economy</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1">Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 font-medium"
            >
              <option value="all">All Hubs</option>
              <option value="Colombo">Colombo Central</option>
              <option value="Airport">Airport VIP Hub (Katunayake)</option>
              <option value="Kandy">Kandy Royal Pavilion</option>
              <option value="Galle">Galle Fort Hub</option>
              <option value="Hambantota">Hambantota Hub</option>
            </select>
          </div>

          {/* Transmission */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1">Transmission</label>
            <select
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 font-medium"
            >
              <option value="all">All Transmissions</option>
              <option value="automatic">Automatic</option>
              <option value="manual">Manual</option>
            </select>
          </div>

          {/* Seats */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1">Min Capacity</label>
            <select
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 font-medium"
            >
              <option value="all">Any Capacity</option>
              <option value="2">2+ Seats</option>
              <option value="5">5+ Seats</option>
              <option value="7">7+ Seats</option>
              <option value="8">8 Seats</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1">Max Daily (LKR)</label>
            <input
              type="number"
              placeholder="e.g. 50000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              onBlur={fetchVehicles}
              className="w-full p-2 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 font-medium"
            />
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1">Sort Fleet</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 font-medium"
            >
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name">Vehicle Name</option>
            </select>
          </div>
        </div>

        {/* Date Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs border-t border-slate-100">
          <span className="text-slate-500 font-semibold flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Date Availability Filter:
          </span>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="p-1.5 rounded-lg border border-slate-200 text-xs bg-white"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={returnDate}
              min={pickupDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="p-1.5 rounded-lg border border-slate-200 text-xs bg-white"
            />
            {(pickupDate || returnDate) && (
              <button
                type="button"
                onClick={fetchVehicles}
                className="px-2.5 py-1.5 bg-blue-900 text-white font-medium rounded-md hover:bg-blue-800"
              >
                Apply Dates
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Showing {vehicles.length} matching vehicles</span>
        {pickupDate && returnDate && (
          <span className="font-medium text-blue-900">
            Filtered for dates: {pickupDate} to {returnDate}
          </span>
        )}
      </div>

      {/* Vehicles Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <p className="text-base font-bold text-slate-900">No vehicles match your current filter parameters</p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your dates, expanding your price boundary, or resetting all filters to see our full fleet.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onViewDetails={onViewDetails}
              onBookNow={onBookNow}
            />
          ))}
        </div>
      )}
    </div>
  );
};
