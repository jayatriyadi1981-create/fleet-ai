/**
 * Fleet Intelligence Smart AI - Vehicle Health Tab
 * Evaluates holistic vehicle health index (0-100), health grades,
 * sensor diagnostic indicators, and deterministic scoring telemetry weights.
 */

import React, { useState } from 'react';
import { VehicleMaintenanceProfile, VehicleHealthGrade } from '../../types';
import { 
  HeartHandshake, 
  Search, 
  Sparkles, 
  Gauge, 
  Battery, 
  Thermometer, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface VehicleHealthTabProps {
  profiles: VehicleMaintenanceProfile[];
  onSelectVehicle: (profile: VehicleMaintenanceProfile) => void;
  onExplainAI: (profile: VehicleMaintenanceProfile) => void;
}

export const VehicleHealthTab: React.FC<VehicleHealthTabProps> = ({
  profiles,
  onSelectVehicle,
  onExplainAI,
}) => {
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('ALL');

  const filtered = profiles.filter((p) => {
    const matchesSearch = p.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.driverName.toLowerCase().includes(search.toLowerCase()) ||
      p.brandModel.toLowerCase().includes(search.toLowerCase()) ||
      p.branch.toLowerCase().includes(search.toLowerCase());
    const matchesGrade = gradeFilter === 'ALL' || p.healthGrade === gradeFilter;
    return matchesSearch && matchesGrade;
  }).sort((a, b) => a.healthScore - b.healthScore); // Sort worst health first

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <HeartHandshake className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Vehicle Health Scoring & Diagnostics</h3>
            <p className="text-xs text-slate-400">
              Indeks kesehatan mekanis (0-100) dan grade keandalan unit operasional
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari plat nomor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">Semua Grade Kesehatan</option>
            <option value="EXCELLENT">Grade: Excellent (&gt;90)</option>
            <option value="GOOD">Grade: Good (75-89)</option>
            <option value="ATTENTION">Grade: Attention (60-74)</option>
            <option value="POOR">Grade: Poor (40-59)</option>
            <option value="CRITICAL">Grade: Critical (&lt;40)</option>
          </select>
        </div>
      </div>

      {/* Grid of Vehicles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((profile) => {
          const isCrit = profile.healthGrade === 'CRITICAL' || profile.healthGrade === 'POOR';
          const isAttn = profile.healthGrade === 'ATTENTION';

          return (
            <div
              key={profile.vehicleId}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-sm font-bold font-mono text-white">{profile.plateNumber}</span>
                    <p className="text-xs text-slate-400">{profile.brandModel}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-xl font-bold font-mono ${
                        isCrit ? 'text-rose-400' : isAttn ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {profile.healthScore}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">/100</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      isCrit ? 'bg-rose-500/20 text-rose-300' :
                      isAttn ? 'bg-amber-500/20 text-amber-300' :
                      'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {profile.healthGrade}
                    </span>
                  </div>
                </div>

                {/* Sensor Mini Bar */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px]">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 block">Baterai</span>
                    <span className="font-mono text-white font-semibold">
                      {profile.sensorReadings.batteryVoltage?.toFixed(1) || '24.5'} V
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 block">Coolant</span>
                    <span className="font-mono text-white font-semibold">
                      {profile.sensorReadings.coolantTempC || 88}°C
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 block">Tekanan Oli</span>
                    <span className="font-mono text-white font-semibold">
                      {profile.sensorReadings.oilPressureKpa || 280} kPa
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 space-y-1">
                  <div>Supir: <strong className="text-slate-300">{profile.driverName}</strong></div>
                  <div>Odometer: <strong className="text-cyan-300 font-mono">{profile.totalMileage.toLocaleString()} KM</strong></div>
                  <div>Kualitas Data: <span className="font-mono text-emerald-400">{profile.dataQuality}</span></div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => onExplainAI(profile)}
                  className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5" /> Explain AI
                </button>

                <button
                  onClick={() => onSelectVehicle(profile)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  Lihat Detail <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
