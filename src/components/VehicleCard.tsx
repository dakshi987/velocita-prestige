import { Vehicle } from '../types.ts';
import { ImageWithFallback } from './ImageWithFallback.tsx';
import { Users, Fuel, Gauge, ArrowRight } from 'lucide-react';
import { formatLKR } from '../utils/currency.ts';

interface VehicleCardProps {
  vehicle: Vehicle;
  onViewDetails: (vehicleId: string) => void;
  onBookNow: (vehicle: Vehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onViewDetails,
  onBookNow,
}) => {
  const isAvailable = vehicle.status === 'available';

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col h-full">
      {/* Real photograph display */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
        <ImageWithFallback
          src={vehicle.featuredImageUrl}
          alt={`${vehicle.brand} ${vehicle.name}`}
          fallbackTitle={vehicle.name}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
        />

        {/* Quiet availability flag */}
        <div className="absolute top-3 right-3">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-md tracking-tight ${
              isAvailable
                ? 'bg-white/90 text-slate-800 shadow-xs backdrop-blur-xs'
                : 'bg-amber-100/90 text-amber-900'
            }`}
          >
            {isAvailable ? 'Available Now' : vehicle.status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata: Category & Brand */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium tracking-wider uppercase mb-1">
            <span>{vehicle.brand}</span>
            <span aria-hidden="true">·</span>
            <span>{vehicle.category}</span>
            <span aria-hidden="true">·</span>
            <span>{vehicle.modelYear}</span>
          </div>

          {/* Vehicle Name */}
          <h3
            onClick={() => onViewDetails(vehicle.id)}
            className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-1 cursor-pointer"
          >
            {vehicle.name}
          </h3>

          {/* Specifications Row */}
          <div className="grid grid-cols-3 gap-2 py-3.5 my-2 border-y border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-1.5" title="Seating Capacity">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>{vehicle.seatingCapacity} Seats</span>
            </div>
            <div className="flex items-center gap-1.5" title="Transmission">
              <Gauge className="w-3.5 h-3.5 text-slate-400" />
              <span className="capitalize">{vehicle.transmission}</span>
            </div>
            <div className="flex items-center gap-1.5" title="Fuel Engine">
              <Fuel className="w-3.5 h-3.5 text-slate-400" />
              <span className="capitalize">{vehicle.fuelType}</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
            {vehicle.description}
          </p>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Daily Rate</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">
                {formatLKR(vehicle.dailyRate)}
              </span>
              <span className="text-xs text-slate-500 font-normal">/ day</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewDetails(vehicle.id)}
              className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Details
            </button>
            <button
              onClick={() => onBookNow(vehicle)}
              disabled={!isAvailable}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                isAvailable
                  ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-xs'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Book</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
