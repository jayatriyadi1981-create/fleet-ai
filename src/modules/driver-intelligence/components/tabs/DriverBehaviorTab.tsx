/**
 * Driver Behavior Tab - Deep Telematics Behavioral Intelligence
 * PROMPT 29 - Overspeed, Harsh Braking, Acceleration, Sharp Turn, Deviation, Idling
 */

import React, { useState } from 'react';
import {
  Gauge,
  AlertTriangle,
  Flame,
  CornerUpRight,
  MapPin,
  Clock,
  Fuel,
  TrendingDown,
  TrendingUp,
  UserCheck,
  ChevronDown,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import { DriverIntelligenceFullProfile } from '../../engines/DriverIntelligenceService';
import { DriverIntelligencePeriod } from '../../types';

interface DriverBehaviorTabProps {
  selectedProfile: DriverIntelligenceFullProfile;
  allDrivers: { id: string; name: string; vehiclePlate: string }[];
  onSelectDriverId: (id: string) => void;
  period: DriverIntelligencePeriod;
  onOpenCoachingModal: (driverId: string, focusType?: string) => void;
}

export const DriverBehaviorTab: React.FC<DriverBehaviorTabProps> = ({
  selectedProfile,
  allDrivers,
  onSelectDriverId,
  period,
  onOpenCoachingModal,
}) => {
  const behavior = selectedProfile?.behaviorAnalysis;
  const [activeSubTab, setActiveSubTab] = useState<
    'ALL' | 'OVERSPEED' | 'BRAKING' | 'ACCEL' | 'TURNS' | 'IDLE' | 'ROUTE'
  >('ALL');

  if (!behavior) {
    return (
      <div className="p-8 text-center text-slate-400 bg-slate-900/90 rounded-2xl border border-slate-800">
        Data analisis perilaku pengemudi belum tersedia untuk periode ini.
      </div>
    );
  }

  const overspeedCorridors = behavior.overspeed?.topCorridors ?? behavior.overspeed?.primaryLocations ?? [];
  const overspeedSeverity = behavior.overspeed?.severity ?? (behavior.overspeed?.eventCount > 6 ? 'CRITICAL' : behavior.overspeed?.eventCount > 2 ? 'MODERATE' : 'LOW');
  const maxSpeed = behavior.overspeed?.maxSpeedRecorded ?? behavior.overspeed?.maxSpeedKmH ?? 0;
  const overspeedDuration = behavior.overspeed?.durationOverLimitMinutes ?? behavior.overspeed?.durationMinutes ?? 0;
  const avgDecel = behavior.harshBraking?.averageDeceleration ?? Math.abs(behavior.harshBraking?.avgDecelMs2 ?? 0);
  const rearEndRisk = behavior.harshBraking?.riskOfRearEndCollision ?? (behavior.harshBraking?.eventCount > 3 ? 'HIGH' : 'LOW');
  const accelFuelWaste = behavior.harshAcceleration?.fuelWastePercentageEstimate ?? (behavior.harshAcceleration?.eventCount > 0 ? Math.min(25, 4 + behavior.harshAcceleration.eventCount * 2) : 0);
  const maxG = behavior.sharpTurn?.maxLateralG ?? 0.42;
  const turnRolloverRisk = behavior.sharpTurn?.rolloverRisk ?? (behavior.sharpTurn?.cargoShiftRiskLevel === 'HIGH' ? 'HIGH' : 'LOW');
  const detourKm = behavior.routeDeviation?.totalDetourKm ?? Math.round((behavior.routeDeviation?.deviationCount ?? 0) * 4.2 * 10) / 10;
  const idleEfficiency = behavior.idleBehavior?.idleEfficiencyScore ?? 85;
  const idleMinutes = behavior.idleBehavior?.totalIdleMinutes ?? 0;
  const idleFuelWasted = behavior.idleBehavior?.estimatedFuelWastedLiters ?? 0;

  return (
    <div className="space-y-6">
      {/* Header with Driver Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight">
              Analisis Perilaku Mengemudi (Driver Behavior Telematics)
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Skor Perilaku: {behavior.overallBehaviorScore ?? 85}/100
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Deteksi sensorik presisi berbasis akselerometer IoT, GPS corridor snapping, dan pola throttle mesin.
          </p>
        </div>

        {/* Driver Selector Dropdown */}
        <div className="relative">
          <select
            value={selectedProfile.driverId}
            onChange={(e) => onSelectDriverId(e.target.value)}
            className="pl-3 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-semibold focus:outline-none focus:border-cyan-500/50 appearance-none cursor-pointer"
          >
            {allDrivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.vehiclePlate})
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Behavior Cards Grid (6 Dimensions) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Overspeed Behavior */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                  <Gauge className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Overspeed (Kecepatan)</h4>
              </div>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                  overspeedSeverity === 'CRITICAL'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    : overspeedSeverity === 'MODERATE'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}
              >
                {overspeedSeverity}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">TOTAL KEJADIAN</span>
                <span className="text-base font-bold font-mono text-white">
                  {behavior.overspeed?.eventCount ?? 0}x
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">TOP SPEED</span>
                <span className="text-base font-bold font-mono text-rose-400">
                  {maxSpeed} km/h
                </span>
              </div>
              <div className="col-span-2 pt-1 border-t border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">TOTAL DURASI</span>
                <span className="font-semibold text-slate-200">
                  {overspeedDuration} menit di atas batas jalan
                </span>
              </div>
            </div>

            {overspeedCorridors.length > 0 && (
              <div className="mt-2 text-[11px] text-slate-400">
                <span className="font-mono text-[10px] uppercase text-slate-400 font-bold block">
                  Koridor Utama:
                </span>
                <span className="text-slate-300">{overspeedCorridors.join(', ')}</span>
              </div>
            )}
          </div>

          <button
            onClick={() => onOpenCoachingModal(selectedProfile.driverId, 'SPEED_MANAGEMENT')}
            className="w-full py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200 text-xs font-semibold border border-slate-700 transition-all text-center"
          >
            Coaching Kecepatan
          </button>
        </div>

        {/* 2. Harsh Braking Behavior */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Flame className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Harsh Braking (Rem Mendadak)</h4>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {behavior.harshBraking?.eventCount ?? 0}x / {selectedProfile.totalDistanceKm}km
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">TOTAL REM MENDADAK</span>
                <span className="text-base font-bold font-mono text-white">
                  {behavior.harshBraking?.eventCount ?? 0}x
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">RATA-RATA DESELERASI</span>
                <span className="text-base font-bold font-mono text-amber-400">
                  {avgDecel} m/s²
                </span>
              </div>
              <div className="col-span-2 pt-1 border-t border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">RISIKO TABRAKAN BELAKANG</span>
                <span
                  className={`font-bold ${
                    rearEndRisk === 'HIGH'
                      ? 'text-rose-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {rearEndRisk}
                </span>
              </div>
            </div>

            <p className="mt-2 text-[11px] text-slate-400 leading-snug">
              Pola deselerasi {avgDecel} m/s² mengindikasikan perlunya antisipasi jarak aman (kurang dari 3 detik).
            </p>
          </div>

          <button
            onClick={() => onOpenCoachingModal(selectedProfile.driverId, 'BRAKING_TECHNIQUE')}
            className="w-full py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200 text-xs font-semibold border border-slate-700 transition-all text-center"
          >
            Coaching Jarak Aman
          </button>
        </div>

        {/* 3. Harsh Acceleration */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
                  <Activity className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Harsh Acceleration (Sentakan Gas)</h4>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {behavior.harshAcceleration?.eventCount ?? 0}x
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">TOTAL SENTAKAN</span>
                <span className="text-base font-bold font-mono text-white">
                  {behavior.harshAcceleration?.eventCount ?? 0}x
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">BOROS BBM</span>
                <span className="text-base font-bold font-mono text-orange-400">
                  {accelFuelWaste}%
                </span>
              </div>
            </div>

            <p className="mt-2 text-[11px] text-slate-400 leading-snug">
              Sentakan pedal gas mendadak memicu konsumsi BBM hingga{' '}
              {accelFuelWaste}% lebih boros pada start awal.
            </p>
          </div>

          <button
            onClick={() => onOpenCoachingModal(selectedProfile.driverId, 'DEFENSIVE_DRIVING')}
            className="w-full py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200 text-xs font-semibold border border-slate-700 transition-all text-center"
          >
            Coaching Eko-Driving
          </button>
        </div>

        {/* 4. Sharp Cornering / Turns */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <CornerUpRight className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Sharp Turn (Tikungan Tajam)</h4>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {behavior.sharpTurn?.eventCount ?? 0}x
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">PEAK LATERAL G</span>
                <span className="text-base font-bold font-mono text-white">
                  {maxG} G
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">RISIKO ROLL-OVER</span>
                <span
                  className={`text-xs font-bold ${
                    turnRolloverRisk === 'HIGH'
                      ? 'text-rose-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {turnRolloverRisk}
                </span>
              </div>
            </div>

            <p className="mt-2 text-[11px] text-slate-400 leading-snug">
              Gaya lateral &gt; 0.40G pada truk muatan berat berpotensi memicu ketidakstabilan kargo atau terguling.
            </p>
          </div>

          <button
            onClick={() => onOpenCoachingModal(selectedProfile.driverId, 'CORNERING_SAFETY')}
            className="w-full py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200 text-xs font-semibold border border-slate-700 transition-all text-center"
          >
            Coaching Manuver Tikungan
          </button>
        </div>

        {/* 5. Route Deviation */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Route Deviation (Deviasi Rute)</h4>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {behavior.routeDeviation?.deviationCount ?? 0}x
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">TOTAL DEVIASI</span>
                <span className="text-base font-bold font-mono text-white">
                  {behavior.routeDeviation?.deviationCount ?? 0} kejadian
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">JARAK DETOUR</span>
                <span className="text-base font-bold font-mono text-blue-400">
                  {detourKm} km
                </span>
              </div>
            </div>

            <p className="mt-2 text-[11px] text-slate-400 leading-snug">
              Deviasi di luar koridor rute yang ditugaskan dispatcher berpotensi menambah risiko keamanan dan konsumsi bahan bakar.
            </p>
          </div>

          <button
            onClick={() => onOpenCoachingModal(selectedProfile.driverId, 'ROUTE_COMPLIANCE')}
            className="w-full py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200 text-xs font-semibold border border-slate-700 transition-all text-center"
          >
            Coaching Kepatuhan Rute
          </button>
        </div>

        {/* 6. Excessive Idling */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Clock className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Idling Behavior (Mesin Hidup Diam)</h4>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                Skor {idleEfficiency}/100
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">DURASI IDLING</span>
                <span className="text-base font-bold font-mono text-white">
                  {idleMinutes} menit
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">ESTIMASI BBM TERBUANG</span>
                <span className="text-base font-bold font-mono text-emerald-400">
                  {idleFuelWasted} L
                </span>
              </div>
            </div>

            <p className="mt-2 text-[11px] text-slate-400 leading-snug">
              Idling berlebih saat parkir atau antrean gudang membuang sekitar {idleFuelWasted} liter BBM.
            </p>
          </div>

          <button
            onClick={() => onOpenCoachingModal(selectedProfile.driverId, 'IDLE_REDUCTION')}
            className="w-full py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200 text-xs font-semibold border border-slate-700 transition-all text-center"
          >
            Coaching Efisiensi Idle
          </button>
        </div>
      </div>
    </div>
  );
};
