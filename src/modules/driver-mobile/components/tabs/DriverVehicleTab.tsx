import React from 'react';
import {
  Truck,
  Gauge,
  Fuel,
  Battery,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  ClipboardCheck,
  CheckCircle2,
  Camera,
  Layers,
  Wrench,
} from 'lucide-react';
import { DriverSessionState, PreTripInspectionRecord } from '../../types/driverMobileTypes';

interface DriverVehicleTabProps {
  session: DriverSessionState;
  lastInspection: PreTripInspectionRecord | null;
  onOpenInspectionModal: () => void;
}

export const DriverVehicleTab: React.FC<DriverVehicleTabProps> = ({
  session,
  lastInspection,
  onOpenInspectionModal,
}) => {
  const vehicle = session.assignedVehicle;

  return (
    <div className="space-y-4 pb-24">
      {/* Vehicle Hero Card */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
              Kendaraan Ditugaskan
            </span>
            <h2 className="text-base font-black text-white">{vehicle?.brand} {vehicle?.model}</h2>
            <div className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-xl inline-block">
              {vehicle?.plateNumber}
            </div>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-sans">Tipe Kendaraan</span>
            <div className="font-bold text-white font-sans">{vehicle?.type || 'Heavy Duty Truck'}</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-sans">Bahan Bakar</span>
            <div className="font-bold text-white font-sans">{vehicle?.fuelType || 'Solar Dex'} (200L)</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-sans">Uji KIR Dishub</span>
            <div className="font-bold text-emerald-400">Aktif s/d 2027</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-sans">Masa Berlaku STNK</span>
            <div className="font-bold text-emerald-400">Aktif s/d 2028</div>
          </div>
        </div>
      </div>

      {/* Real-time Telemetry & Health */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Telemetri & Diagnostik IoT:
        </h3>

        <div className="grid grid-cols-3 gap-2 font-mono text-xs text-center">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] font-sans">
              <Fuel className="w-3.5 h-3.5 text-amber-400" />
              <span>BBM</span>
            </div>
            <div className="text-sm font-bold text-white">78%</div>
            <div className="text-[10px] text-slate-500 font-sans">~156 Liter</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] font-sans">
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
              <span>Aki (24V)</span>
            </div>
            <div className="text-sm font-bold text-white">24.2 V</div>
            <div className="text-[10px] text-emerald-400 font-sans">Normal</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] font-sans">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              <span>Odometer</span>
            </div>
            <div className="text-sm font-bold text-cyan-300">48.920</div>
            <div className="text-[10px] text-slate-500 font-sans">KM</div>
          </div>
        </div>
      </div>

      {/* Pre-Trip Inspection Card */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white">Pre-Trip Physical Inspection</h3>
          </div>

          {lastInspection ? (
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                lastInspection.overallStatus === 'PASS'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              {lastInspection.overallStatus === 'PASS' ? '✓ LOLOS (PASS)' : '✕ ADA KENDALA (FAIL)'}
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
              Belum Diinspeksi
            </span>
          )}
        </div>

        <p className="text-xs text-slate-400">
          Pemeriksaan rutin 7 poin keselamatan (Ban, Rem, Oli, Lampu, Aki, Bodi, APAR) sebelum menjalankan armada.
        </p>

        {lastInspection && (
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Waktu Selesai:</span>
              <span className="text-white font-mono">{new Date(lastInspection.completedAt).toLocaleTimeString('id-ID')} WIB</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Item Diperiksa:</span>
              <span className="text-emerald-400 font-bold">{lastInspection.items.length} Poin Standar Dishub</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Foto Terlampir:</span>
              <span className="text-cyan-300 font-mono">{lastInspection.photos.length} Foto Geotag</span>
            </div>
          </div>
        )}

        <button
          onClick={onOpenInspectionModal}
          className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
        >
          <ClipboardCheck className="w-4 h-4" />
          <span>{lastInspection ? 'Ulangi / Update Pre-Trip Inspection' : 'Mulai Pengecekan Fisik Sekarang'}</span>
        </button>
      </div>
    </div>
  );
};
