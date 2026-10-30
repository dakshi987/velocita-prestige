import React from 'react';
import { ShieldCheck, Award, Wrench, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from '../components/ImageWithFallback.tsx';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 py-12">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-900 block">
            Our Heritage & Standards
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Setting the standard for executive vehicle mobility.
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Velocita was founded to eliminate the friction, waiting times, and bait-and-switch vehicle substitutions typical of traditional car rental agencies. We guarantee the exact make, model, and trim chosen by our clients.
          </p>
        </div>
      </section>

      {/* Hero Showcase Photo */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden aspect-16/9 md:aspect-21/9 bg-slate-900 border border-slate-200 shadow-md">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=80"
            fallbackSrc="/images/luxury_showroom_hub_1791967685804.jpg"
            alt="Velocita Luxury Vehicle Showroom & Executive Hub"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white max-w-xl">
            <span className="text-xs uppercase font-semibold tracking-wider text-blue-300">Flagship Showroom & Operations Hub</span>
            <h3 className="text-xl sm:text-2xl font-bold mt-1">Galle Face Luxury Pavilion & VIP Mobility Center</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 hidden sm:block">
              State-of-the-art climate-controlled showroom staging certified executive sedans, grand tourers, and luxury passenger fleets.
            </p>
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Guaranteed Vehicle Model</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              When you reserve an Audi A6 Prestige or Aston Martin GT, that exact certified vehicle is detailed, staged, and waiting for you. No "or similar" excuses.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">120-Point Showroom Detailing</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every vehicle undergoes high-temperature steam sanitization, paint sealant inspection, and electronic diagnostic scan before each client deployment.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Upfront Transparent Rates</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Full breakdown including collision coverage, municipal taxes, and refundable security deposits shown clearly at time of reservation. Zero surprise counter add-ons.
            </p>
          </div>
        </div>
      </section>

      {/* Fleet Standards List */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-900 block">
              Operational Protocols
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Rigorous Fleet Maintenance & Hygiene
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700">
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200/80">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Full manufacturer scheduled servicing performed by authorized dealerships</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200/80">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Tire tread depth and brake pad thickness verified before every rental handover</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200/80">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Curbside delivery directly to private airport terminals, FBOs, and luxury hotels</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200/80">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Seamless automated digital check-in and check-out via our customer portal</span>
            </div>
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => onNavigate('/vehicles')}
              className="px-6 py-3 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
            >
              Browse Our Complete Fleet
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
