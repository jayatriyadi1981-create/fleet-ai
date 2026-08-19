import React from 'react';
import {
  Truck,
  Navigation,
  PackageCheck,
  ShieldCheck,
  Clock,
  Fuel,
  Battery,
  Gauge,
  Radio,
  ArrowRight,
  ClipboardCheck,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Play,
  Zap,
} from 'lucide-react';
import { DriverSessionState, DriverActiveTrip, DriverMobileTab } from '../../types/driverMobileTypes';

interface DriverHomeTabProps {
  session: DriverSessionState;
  activeTrip: DriverActiveTrip | null;
  hasInspectionPassed: boolean;
  onNavigateTab: (tab: DriverMobileTab) => void;
  onOpenInspectionModal: () => void;
  onOpenPanicModal: () => void;
}

export const DriverHomeTab: React.FC<DriverHomeTabProps> = ({
  session,
  activeTrip,
  hasInspectionPassed,
  onNavigateTab,
  onOpenInspectionModal,
  onOpenPanicModal,
}) => {
  const vehicle = session.assignedVehicle;

  return (
    <div className="space-y-4 pb-20">
      {/* Driver Header Greeting Card */}
      <div className="relative overflow-hidden p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 shadow-xl">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Shift Aktif &bull; {session.branchName}</span>
            </div>
            <h1 className="text-lg font-black text-white">
              Selamat Pagi, {session.driverName} 👋
            </h1>
            <p className="text-xs text-slate-400">
              Siap untuk perjalanan hari ini? Pastikan inspeksi fisik selesai sebelum berangkat.
            </p>
          </div>
        </div>

        {/* Quick KPI Bar */}
        <div className="grid grid-cols-3 gap-2 pt-4 mt-2 border-t border-slate-800/80">
          <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Jam Kemudi</div>
            <div className="text-sm font-black text-white font-mono mt-0.5">
              {session.shift.drivingHoursToday} / {session.shift.maxAllowedHours}h
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Jarak Hari Ini</div>
            <div className="text-sm font-black text-cyan-400 font-mono mt-0.5">
              {activeTrip?.actualDistanceKm || 84.2} KM
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Safety Score</div>
            <div className="text-sm font-black text-emerald-400 font-mono mt-0.5">
              94<span className="text-[10px] text-slate-400 font-normal">/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Action Banner: Inspection & Active Trip */}
      {activeTrip && activeTrip.status === 'IN_PROGRESS' ? (
        <div className="p-4 rounded-3xl bg-cyan-500 text-slate-950 shadow-xl shadow-cyan-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-950 text-cyan-300 font-bold text-[10px] uppercase tracking-wider font-mono">
              Trip Sedang Berjalan
            </span>
            <span className="text-xs font-mono font-bold">ETA: 09:50 WIB</span>
          </div>

          <div>
            <div className="text-xs font-medium text-slate-900">Menuju Destinasi:</div>
            <div className="text-base font-black text-slate-950">{activeTrip.destination}</div>
            <div className="text-xs text-slate-800 mt-0.5">
              Sisa Jarak: ~{activeTrip.estimatedDistanceKm - activeTrip.actualDistanceKm} KM
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('TRIP')}
            className="w-full py-3 rounded-2xl bg-slate-950 text-white hover:bg-slate-900 font-bold text-xs transition flex items-center justify-center gap-2 shadow"
          >
            <Navigation className="w-4 h-4 text-cyan-400" />
            <span>Buka Layar Navigasi & Map Live</span>
          </button>
        </div>
      ) : (
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-cyan-400" />
              <span>Validasi Kesiapan Operasional</span>
            </span>
            {hasInspectionPassed ? (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                ✓ Siap Berangkat
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                Wajib Inspeksi
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400">
            {hasInspectionPassed
              ? 'Inspeksi 7 poin keselamatan telah lolos. Anda dapat langsung memulai trip.'
              : 'SOP perusahaan mewajibkan pengecekan 7 poin keselamatan (Ban, Rem, Oli, Lampu) sebelum menekan Start Trip.'}
          </p>

          <div className="flex items-center gap-2">
            {!hasInspectionPassed ? (
              <button
                onClick={onOpenInspectionModal}
                className="flex-1 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                <ClipboardCheck className="w-4 h-4" />
                <span>Mulai Pre-Trip Inspection</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigateTab('TRIP')}
                className="flex-1 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Buka Rute & Start Trip</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Assigned Vehicle Telematics Card */}
      {vehicle ? (
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white text-xs">{vehicle.brand} {vehicle.model}</div>
                <div className="text-[11px] font-mono text-cyan-300 font-bold">{vehicle.plateNumber}</div>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                <Radio className="w-3 h-3 animate-pulse" />
                <span>GPS Online</span>
              </span>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">Teltonika 4G IoT</div>
            </div>
          </div>

          {/* Telemetry Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-xs">
            <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-sans">
                <Fuel className="w-3.5 h-3.5 text-amber-400" />
                <span>BBM Solar</span>
              </div>
              <div className="font-bold text-white">78% (156L)</div>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-sans">
                <Battery className="w-3.5 h-3.5 text-emerald-400" />
                <span>Aki / Listrik</span>
              </div>
              <div className="font-bold text-white">24.2 Volt</div>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-sans">
                <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                <span>Odometer</span>
              </div>
              <div className="font-bold text-white">{vehicle.odometerKm.toLocaleString('id-ID')} KM</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
          Belum ada kendaraan yang ditugaskan. Silakan hubungi Fleet Manager.
        </div>
      )}

      {/* Quick Navigation Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigateTab('DELIVERY')}
          className="p-4 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-left transition space-y-2 group"
        >
          <div className="w-9 h-9 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
            <PackageCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white text-xs flex items-center justify-between">
              <span>Pengiriman & POD</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition" />
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">3 Drop Kiriman Hari Ini</p>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('SAFETY')}
          className="p-4 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-left transition space-y-2 group"
        >
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white text-xs flex items-center justify-between">
              <span>Safety & AI Coach</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition" />
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Skor 94 &bull; Bebas Insiden</p>
          </div>
        </button>
      </div>
    </div>
  );
};
