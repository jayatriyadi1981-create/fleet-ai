import React, { useState } from 'react';
import {
  Navigation,
  MapPin,
  Clock,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  Play,
  Square,
  Shield,
  Layers,
  ArrowRight,
  Sparkles,
  Radio,
  Eye,
  Sun,
  Moon,
  ChevronRight,
  Package,
} from 'lucide-react';
import { DriverActiveTrip, DriverSessionState, DriverWaypoint } from '../../types/driverMobileTypes';
import { driverSessionService } from '../../services/driverSessionService';

interface DriverTripTabProps {
  session: DriverSessionState;
  activeTrip: DriverActiveTrip | null;
  hasInspectionPassed: boolean;
  onOpenInspectionModal: () => void;
  onRefresh: () => void;
}

export const DriverTripTab: React.FC<DriverTripTabProps> = ({
  session,
  activeTrip,
  hasInspectionPassed,
  onOpenInspectionModal,
  onRefresh,
}) => {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [showEndTripModal, setShowEndTripModal] = useState(false);
  const [endTripError, setEndTripError] = useState<string | null>(null);
  const [tripSummary, setTripSummary] = useState<any | null>(null);

  const isTripActive = activeTrip && activeTrip.status === 'IN_PROGRESS';

  const handleStartTrip = () => {
    if (!hasInspectionPassed) {
      onOpenInspectionModal();
      return;
    }
    driverSessionService.startTrip();
    onRefresh();
  };

  const handleAdvanceWaypoint = (wpId: string) => {
    driverSessionService.advanceWaypoint(wpId);
    onRefresh();
  };

  const handleConfirmEndTrip = () => {
    const result = driverSessionService.endTrip();
    if (result.hasPendingDeliveries) {
      setEndTripError('Masih ada 1 atau lebih pengiriman yang belum selesai (Pending POD). Selesaikan pengiriman terlebih dahulu atau hubungi Dispatcher.');
      return;
    }

    setShowEndTripModal(false);
    setTripSummary({
      distanceKm: activeTrip?.estimatedDistanceKm || 38.5,
      durationMins: 52,
      drivingTimeMins: 45,
      idleTimeMins: 7,
      stopsCount: 3,
      fuelUsedLiters: 9.4,
      avgSpeedKmH: 58,
      safetyEventsCount: 0,
      completedAt: new Date().toLocaleTimeString('id-ID') + ' WIB',
    });
    onRefresh();
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Trip Completed Summary Dialog */}
      {tripSummary && (
        <div className="p-5 rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-2xl space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>Trip Berhasil Diselesaikan!</span>
            </div>
            <span className="text-xs font-mono text-slate-400">{tripSummary.completedAt}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-sans">Jarak Tempuh</span>
              <div className="text-base font-bold text-white">{tripSummary.distanceKm} KM</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-sans">Waktu Kemudi</span>
              <div className="text-base font-bold text-cyan-400">{tripSummary.drivingTimeMins} Menit</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-sans">Konsumsi BBM</span>
              <div className="text-base font-bold text-amber-400">{tripSummary.fuelUsedLiters} Liter</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-sans">Insiden Safety</span>
              <div className="text-base font-bold text-emerald-400">0 (Nihil ✓)</div>
            </div>
          </div>

          <button
            onClick={() => setTripSummary(null)}
            className="w-full py-3 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition"
          >
            Tutup Ringkasan Trip
          </button>
        </div>
      )}

      {/* State 1: Active Trip Driving Mode */}
      {isTripActive ? (
        <div className={`space-y-4 ${isHighContrast ? 'contrast-125' : ''}`}>
          {/* Navigation HUD Header (Minimalist & High Contrast for Driving Safety) */}
          <div className="p-5 rounded-3xl bg-slate-950 border-2 border-cyan-500/50 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-black uppercase tracking-wider text-cyan-300 font-mono">
                  LIVE NAVIGATION ACTIVE
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsHighContrast(!isHighContrast)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1.5"
              >
                {isHighContrast ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
                <span>Kontras Tinggi</span>
              </button>
            </div>

            {/* Turn-by-Turn Instruction Banner */}
            <div className="p-4 rounded-2xl bg-cyan-500 text-slate-950 space-y-1">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900">
                Dalam 1.2 KM:
              </div>
              <div className="text-lg font-black leading-snug">
                Ambil lajur kiri menuju Pintu Keluar Tol Karawang Barat (KM 47)
              </div>
            </div>

            {/* Live Driving Telemetry HUD */}
            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] font-sans text-slate-400 font-bold uppercase">Kecepatan</div>
                <div className="text-2xl font-black text-white mt-0.5">
                  62 <span className="text-xs text-slate-400 font-normal">km/h</span>
                </div>
                <div className="text-[10px] text-emerald-400">Batas: 80</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] font-sans text-slate-400 font-bold uppercase">Sisa Jarak</div>
                <div className="text-2xl font-black text-cyan-400 mt-0.5">
                  24.3 <span className="text-xs text-slate-400 font-normal">KM</span>
                </div>
                <div className="text-[10px] text-slate-400">dari 38.5 KM</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] font-sans text-slate-400 font-bold uppercase">Estimasi Tiba</div>
                <div className="text-2xl font-black text-amber-400 mt-0.5">
                  09:50
                </div>
                <div className="text-[10px] text-slate-400">~28 Menit</div>
              </div>
            </div>
          </div>

          {/* Simulated Map View Container */}
          <div className="relative w-full h-56 rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner flex items-center justify-center">
            {/* Map Grid Graphic */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

            {/* Route Line SVG */}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M 40 180 Q 140 120, 240 140 T 360 40"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="8 8"
                className="animate-pulse"
              />
            </svg>

            {/* Vehicle Marker */}
            <div className="relative z-10 p-3 rounded-full bg-cyan-500 text-slate-950 font-bold shadow-xl shadow-cyan-500/50 flex items-center gap-1.5 animate-bounce">
              <Navigation className="w-5 h-5 fill-current" />
              <span className="text-[11px] font-mono">B 9128 UXT</span>
            </div>

            {/* Overlay Map Controls */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs pointer-events-none">
              <span className="px-2.5 py-1 rounded-xl bg-slate-900/90 text-white font-mono border border-slate-800 pointer-events-auto">
                Tol Jakarta-Cikampek KM 44
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 pointer-events-auto">
                GPS Akurasi: 3.2m
              </span>
            </div>
          </div>

          {/* Waypoints Sequence List */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Rute & Checkpoint Waypoints:
            </h3>

            <div className="space-y-2">
              {activeTrip?.waypoints.map((wp, idx) => (
                <div
                  key={wp.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                    wp.status === 'COMPLETED'
                      ? 'bg-slate-950 border-slate-800 text-slate-500'
                      : wp.status === 'ARRIVED'
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] font-mono ${
                        wp.status === 'COMPLETED'
                          ? 'bg-slate-800 text-slate-500'
                          : 'bg-cyan-500 text-slate-950'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-bold text-white">{wp.name}</div>
                      <div className="text-[11px] text-slate-400">{wp.address}</div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    {wp.status === 'COMPLETED' ? (
                      <span className="text-[10px] text-emerald-400 font-mono">✓ {wp.completedAt}</span>
                    ) : (
                      <button
                        onClick={() => handleAdvanceWaypoint(wp.id)}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[10px] transition"
                      >
                        Tandai Selesai
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* End Trip Action */}
          <button
            onClick={() => setShowEndTripModal(true)}
            className="w-full py-4 rounded-3xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm transition flex items-center justify-center gap-2 shadow-xl shadow-rose-900/40"
          >
            <Square className="w-5 h-5 fill-current" />
            <span>Akhiri Perjalanan (END TRIP)</span>
          </button>
        </div>
      ) : (
        /* State 2: Ready to Start / Pre-Trip Pending */
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider font-mono">
                  Penugasan Trip Hari Ini
                </span>
                <h2 className="text-base font-black text-white">{activeTrip?.tripNumber}</h2>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-bold font-mono">
                {activeTrip?.estimatedDistanceKm} KM
              </span>
            </div>

            {/* Origin & Destination Display */}
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-start gap-2.5">
                <div className="w-3 h-3 rounded-full bg-emerald-400 shrink-0 mt-1" />
                <div>
                  <div className="text-[10px] font-sans uppercase font-bold text-slate-400">Titik Awal (Origin):</div>
                  <div className="font-bold text-white font-sans">{activeTrip?.origin}</div>
                </div>
              </div>

              <div className="border-l-2 border-dashed border-slate-700 ml-1.5 pl-4 py-1 text-[11px] text-slate-500">
                Estimasi Waktu Tempuh: ~{activeTrip?.estimatedDurationMins} Menit
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-3 h-3 rounded-full bg-rose-500 shrink-0 mt-1" />
                <div>
                  <div className="text-[10px] font-sans uppercase font-bold text-slate-400">Destinasi Akhir:</div>
                  <div className="font-bold text-white font-sans">{activeTrip?.destination}</div>
                </div>
              </div>
            </div>

            {/* Validation Checklist before Start */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Status Kesiapan Berangkat:
              </span>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">Penugasan Kendaraan & Driver</span>
                <span className="text-emerald-400 font-bold">✓ Valid</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">Pre-Trip Physical Inspection</span>
                {hasInspectionPassed ? (
                  <span className="text-emerald-400 font-bold">✓ Selesai (PASS)</span>
                ) : (
                  <button
                    onClick={onOpenInspectionModal}
                    className="text-amber-400 underline font-bold"
                  >
                    Belum Dilakukan &rarr;
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">Konektivitas GPS Device</span>
                <span className="text-emerald-400 font-bold">✓ Terhubung</span>
              </div>
            </div>

            {/* Big Start Trip CTA Button */}
            <button
              onClick={handleStartTrip}
              className="w-full py-4 rounded-3xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 uppercase tracking-wider"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Mulai Perjalanan (START TRIP)</span>
            </button>
          </div>
        </div>
      )}

      {/* End Trip Confirmation Modal */}
      {showEndTripModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Square className="w-6 h-6 fill-current" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">Konfirmasi Akhiri Perjalanan?</h3>
              <p className="text-xs text-slate-400">
                Data telematika GPS, odometer, dan konsumsi BBM akan direkam secara otomatis ke log perjalanan server.
              </p>
            </div>

            {endTripError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {endTripError}
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  setShowEndTripModal(false);
                  setEndTripError(null);
                }}
                className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmEndTrip}
                className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition"
              >
                Ya, Selesaikan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
