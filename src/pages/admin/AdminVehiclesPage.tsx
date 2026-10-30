import React, { useState, useEffect } from 'react';
import { Vehicle } from '../../types.ts';
import { api } from '../../services/api.ts';
import { ImageWithFallback } from '../../components/ImageWithFallback.tsx';
import { formatLKRWithDecimals } from '../../utils/currency.ts';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  X,
  Car,
  Filter,
} from 'lucide-react';

export const AdminVehiclesPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State (Create or Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [modelYear, setModelYear] = useState('2025');
  const [category, setCategory] = useState<Vehicle['category']>('sedan');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [dailyRate, setDailyRate] = useState('150');
  const [seatingCapacity, setSeatingCapacity] = useState('5');
  const [transmission, setTransmission] = useState<Vehicle['transmission']>('automatic');
  const [fuelType, setFuelType] = useState<Vehicle['fuelType']>('hybrid');
  const [mileageLimit, setMileageLimit] = useState('350');
  const [location, setLocation] = useState('Downtown Center Terminal');
  const [status, setStatus] = useState<Vehicle['status']>('available');
  const [featuredImageUrl, setFeaturedImageUrl] = useState('https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80');
  const [description, setDescription] = useState('');
  const [featuresText, setFeaturesText] = useState('Adaptive Cruise Control, Leather Interior, Navigation System');
  const [insuranceFeePerDay, setInsuranceFeePerDay] = useState('20');
  const [depositAmount, setDepositAmount] = useState('400');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchVehicles = () => {
    setIsLoading(true);
    api
      .getAdminVehicles()
      .then((res) => {
        setVehicles(res.vehicles);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch vehicles.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const openAddModal = () => {
    setEditingVehicle(null);
    setName('');
    setBrand('');
    setModelYear('2025');
    setCategory('sedan');
    setRegistrationNumber(`VP-${Math.floor(100 + Math.random() * 900)}-FL`);
    setDailyRate('25000');
    setSeatingCapacity('5');
    setTransmission('automatic');
    setFuelType('hybrid');
    setMileageLimit('350');
    setLocation('Colombo Central Terminal (Galle Face)');
    setStatus('available');
    setFeaturedImageUrl('https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80');
    setDescription('Executive specification vehicle with comprehensive warranty and concierge readiness.');
    setFeaturesText('Apple CarPlay, 360-Degree Camera, Heated Seats, Lane Assist');
    setInsuranceFeePerDay('3500');
    setDepositAmount('50000');
    setIsModalOpen(true);
  };

  const openEditModal = (v: Vehicle) => {
    setEditingVehicle(v);
    setName(v.name);
    setBrand(v.brand);
    setModelYear(String(v.modelYear));
    setCategory(v.category);
    setRegistrationNumber(v.registrationNumber);
    setDailyRate(String(v.dailyRate));
    setSeatingCapacity(String(v.seatingCapacity));
    setTransmission(v.transmission);
    setFuelType(v.fuelType);
    setMileageLimit(String(v.mileageLimit));
    setLocation(v.location);
    setStatus(v.status);
    setFeaturedImageUrl(v.featuredImageUrl);
    setDescription(v.description);
    setFeaturesText(v.features.join(', '));
    setInsuranceFeePerDay(String(v.insuranceFeePerDay));
    setDepositAmount(String(v.depositAmount));
    setIsModalOpen(true);
  };

  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    const payload = {
      name,
      brand,
      modelYear: Number(modelYear),
      category,
      registrationNumber,
      dailyRate: Number(dailyRate),
      seatingCapacity: Number(seatingCapacity),
      transmission,
      fuelType,
      mileageLimit: Number(mileageLimit),
      location,
      status,
      featuredImageUrl,
      galleryImageUrls: [featuredImageUrl],
      description,
      features: featuresText.split(',').map((s) => s.trim()).filter(Boolean),
      insuranceFeePerDay: Number(insuranceFeePerDay),
      depositAmount: Number(depositAmount),
    };

    try {
      if (editingVehicle) {
        await api.updateAdminVehicle(editingVehicle.id, payload);
        setSuccess(`Vehicle ${name} updated successfully.`);
      } else {
        await api.createAdminVehicle(payload);
        setSuccess(`New vehicle ${name} registered into fleet.`);
      }
      setIsModalOpen(false);
      fetchVehicles();
    } catch (err: any) {
      console.error('[Admin Vehicles] Failed to save vehicle:', err);
      setError(err.message || 'Failed to save vehicle.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVehicle = async (v: Vehicle) => {
    if (!window.confirm(`Are you sure you want to delete or archive vehicle "${v.name}" (${v.registrationNumber})?`)) {
      return;
    }
    setError('');
    setSuccess('');

    try {
      const res = await api.deleteAdminVehicle(v.id);
      setSuccess(res.message);
      fetchVehicles();
    } catch (err: any) {
      setError(err.message || 'Failed to delete vehicle.');
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.brand.toLowerCase().includes(search.toLowerCase()) ||
      v.registrationNumber.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || v.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 block">
            Fleet Inventory Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
            Manage Vehicles
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Add, update specifications, assign station locations, and inspect fleet availability.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </button>
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

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search make, model, or plate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="sedan">Sedans</option>
            <option value="suv">SUVs</option>
            <option value="luxury">Luxury</option>
            <option value="van">Vans</option>
            <option value="economy">Economy</option>
          </select>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="p-4">Vehicle</th>
                <th className="p-4">Registration</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-right">Daily Rate (LKR)</th>
                <th className="p-4">Location</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No vehicles found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                          <ImageWithFallback
                            src={v.featuredImageUrl}
                            alt={v.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{v.name}</p>
                          <p className="text-[11px] text-slate-400">{v.brand} · {v.modelYear}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-800">
                      {v.registrationNumber}
                    </td>
                    <td className="p-4 capitalize text-slate-600">
                      {v.category}
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {formatLKRWithDecimals(v.dailyRate)}
                    </td>
                    <td className="p-4 text-slate-600 truncate max-w-[150px]">
                      {v.location}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          v.status === 'available'
                            ? 'bg-emerald-50 text-emerald-700'
                            : v.status === 'rented'
                            ? 'bg-blue-50 text-blue-900'
                            : v.status === 'maintenance'
                            ? 'bg-amber-50 text-amber-900'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(v)}
                          title="Edit vehicle"
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteVehicle(v)}
                          title="Delete or archive vehicle"
                          className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Add / Edit Vehicle Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {editingVehicle ? 'Edit Vehicle Specifications' : 'Add New Vehicle to Fleet'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVehicle} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">Vehicle Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Audi A6 Prestige"
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">Brand / Make *</label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Audi"
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">Registration Plate *</label>
                  <input
                    type="text"
                    required
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    placeholder="e.g. VP-882-EX"
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">Model Year</label>
                  <input
                    type="number"
                    value={modelYear}
                    onChange={(e) => setModelYear(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Vehicle['category'])}
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white"
                  >
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="luxury">Luxury</option>
                    <option value="van">Van</option>
                    <option value="economy">Economy</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">Daily Rate (Rs. / LKR) *</label>
                  <input
                    type="number"
                    required
                    value={dailyRate}
                    onChange={(e) => setDailyRate(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">Seating Capacity</label>
                  <input
                    type="number"
                    value={seatingCapacity}
                    onChange={(e) => setSeatingCapacity(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">Transmission</label>
                  <select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value as Vehicle['transmission'])}
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white"
                  >
                    <option value="automatic">Automatic</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">Fuel Type</label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value as Vehicle['fuelType'])}
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white"
                  >
                    <option value="hybrid">Hybrid</option>
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">Station Hub</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white"
                  >
                    <option value="Colombo Central Terminal (Galle Face)">Colombo Central Terminal (Galle Face)</option>
                    <option value="Bandaranaike International Airport (CMB VIP Hub)">Bandaranaike International Airport (CMB VIP Hub)</option>
                    <option value="Kandy Royal Pavilion Hub">Kandy Royal Pavilion Hub</option>
                    <option value="Galle Fort Coastal Hub">Galle Fort Coastal Hub</option>
                    <option value="Hambantota International Hub">Hambantota International Hub</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">Fleet Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Vehicle['status'])}
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white"
                  >
                    <option value="available">Available</option>
                    <option value="rented">Rented</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">Photograph Image URL *</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    value={featuredImageUrl}
                    onChange={(e) => setFeaturedImageUrl(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">
                    <span>Quick presets:</span>
                    <button
                      type="button"
                      onClick={() => setFeaturedImageUrl('https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80')}
                      className="text-blue-800 underline"
                    >
                      Executive Sedan
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeaturedImageUrl('https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80')}
                      className="text-blue-800 underline"
                    >
                      BMW Sedan
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeaturedImageUrl('https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80')}
                      className="text-blue-800 underline"
                    >
                      Camry Sedan
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeaturedImageUrl('https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80')}
                      className="text-blue-800 underline"
                    >
                      Range Rover SUV
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeaturedImageUrl('https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1200&q=80')}
                      className="text-blue-800 underline"
                    >
                      Prado SUV
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeaturedImageUrl('https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80')}
                      className="text-blue-800 underline"
                    >
                      BMW X5 SUV
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeaturedImageUrl('https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80')}
                      className="text-blue-800 underline"
                    >
                      Aston Martin GT
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeaturedImageUrl('https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80')}
                      className="text-blue-800 underline"
                    >
                      Mercedes S-Class
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeaturedImageUrl('https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80')}
                      className="text-blue-800 underline"
                    >
                      Porsche Panamera
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeaturedImageUrl('https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80')}
                      className="text-blue-800 underline"
                    >
                      V-Class VIP Van
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeaturedImageUrl('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80')}
                      className="text-blue-800 underline"
                    >
                      HiAce Van
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeaturedImageUrl('https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80')}
                      className="text-blue-800 underline"
                    >
                      Sprinter Shuttle
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeaturedImageUrl('https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=1200&q=80')}
                      className="text-blue-800 underline"
                    >
                      Transit Van
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeaturedImageUrl('https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80')}
                      className="text-blue-800 underline"
                    >
                      i20 Compact
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeaturedImageUrl('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80')}
                      className="text-blue-800 underline"
                    >
                      Swift Compact
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeaturedImageUrl('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80')}
                      className="text-blue-800 underline"
                    >
                      Aqua Hybrid
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">Features (Comma separated)</label>
                <input
                  type="text"
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 cursor-pointer"
                >
                  {isSubmitting ? 'Saving...' : editingVehicle ? 'Update Vehicle' : 'Register Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
