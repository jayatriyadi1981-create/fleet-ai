/**
 * Safety & Performance Tab - Dual Evaluation Model
 * PROMPT 29 - Safety Score (0-100) & 8-Factor Composite Performance
 */

import React from 'react';
import {
  ShieldCheck,
  Award,
  Zap,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Sliders,
  ChevronDown,
  BarChart3,
  Compass,
  Clock,
  ClipboardCheck,
  Fuel,
  Wrench,
} from 'lucide-react';
import { DriverIntelligenceFullProfile } from '../../engines/DriverIntelligenceService';
import { DriverIntelligencePeriod } from '../../types';

interface SafetyPerformanceTabProps {
  selectedProfile: DriverIntelligenceFullProfile;
  allDrivers: { id: string; name: string; vehiclePlate: string }[];
  onSelectDriverId: (id: string) => void;
  period: DriverIntelligencePeriod;
}

export const SafetyPerformanceTab: React.FC<SafetyPerformanceTabProps> = ({
  selectedProfile,
  allDrivers,
  onSelectDriverId,
  period,
}) => {
  const safety = selectedProfile.safetyScore;
  const perf = selectedProfile.performanceScore;

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
      case 'B':
        return 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10';
      case 'C':
        return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
      default:
        return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
    }
  };

  const factorItems = [
    {
      name: 'Safety Score (Keselamatan)',
      weight: 25,
      score: perf.factors.safety,
      icon: ShieldCheck,
      color: 'text-emerald-400',
    },
    {
      name: 'Driver Behavior (Perilaku)',
      weight: 20,
      score: perf.factors.behavior,
      icon: Zap,
      color: 'text-cyan-400',
    },
    {
      name: 'Trip Completion (Penyelesaian Tugas)',
      weight: 15,
      score: perf.factors.tripCompletion,
      icon: Compass,
      color: 'text-blue-400',
    },
    {
      name: 'Route Compliance (Kepatuhan Rute)',
      weight: 10,
      score: perf.factors.routeCompliance,
      icon: Compass,
      color: 'text-purple-400',
    },
    {
      name: 'Punctuality (Ketepatan Waktu)',
      weight: 10,
      score: perf.factors.punctuality,
      icon: Clock,
      color: 'text-amber-400',
    },
    {
      name: 'Inspection Compliance (Kepatuhan Cek Fisik)',
      weight: 10,
      score: perf.factors.inspectionCompliance,
      icon: ClipboardCheck,
      color: 'text-emerald-400',
    },
    {
      name: 'Fuel Efficiency (Efisiensi BBM)',
      weight: 5,
      score: perf.factors.fuelEfficiency,
      icon: Fuel,
      color: 'text-teal-400',
    },
    {
      name: 'Vehicle Care (Perawatan Unit)',
      weight: 5,
      score: perf.factors.vehicleCare,
      icon: Wrench,
      color: 'text-slate-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Driver Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight">
              Skor Keselamatan & Performa Komposit 8-Faktor
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Grade: {safety.grade}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Perhitungan transparan memadukan telemetri keamanan dan efektivitas operasional pengantaran.
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

      {/* 2-Column: Left Safety Score Box / Right 8-Factor Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Safety Score (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                Safety Scorecard
              </span>
              <span
                className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${getGradeColor(
                  safety.grade
                )}`}
              >
                Grade {safety.grade}
              </span>
            </div>

            <div className="text-center py-2">
              <div className="flex items-baseline justify-center gap-1 font-mono">
                <span className="text-6xl font-black text-emerald-400">{safety.score}</span>
                <span className="text-base text-slate-400">/ 100</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 font-mono">
                {safety.safeKilometersCount.toLocaleString()} KM berkendara aman tanpa insiden fatal
              </p>
            </div>

            {/* 4 Safety Sub-Scores */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block">
                Sub-Skor Dimensi Keselamatan:
              </span>

              <div className="space-y-2.5">
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">Kepatuhan Kecepatan (40%)</span>
                    <span className="font-mono text-cyan-400">{safety.subScores.speedCompliance}/100</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${safety.subScores.speedCompliance}%` }}
                      className="h-full bg-cyan-400 rounded-full"
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">Kehalusan Pengereman (25%)</span>
                    <span className="font-mono text-cyan-400">
                      {safety.subScores.brakingSmoothness}/100
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${safety.subScores.brakingSmoothness}%` }}
                      className="h-full bg-cyan-400 rounded-full"
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">Respons Alert & Kelelahan (20%)</span>
                    <span className="font-mono text-cyan-400">
                      {safety.subScores.alertResponse}/100
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${safety.subScores.alertResponse}%` }}
                      className="h-full bg-cyan-400 rounded-full"
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">Kepatuhan Pre-Trip Inspection (15%)</span>
                    <span className="font-mono text-cyan-400">
                      {safety.subScores.inspectionCompliance}/100
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${safety.subScores.inspectionCompliance}%` }}
                      className="h-full bg-cyan-400 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 8-Factor Composite Performance (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Performa Komposit 8-Faktor (Composite Performance)
                </h3>
                <p className="text-xs text-slate-400">
                  Ranking #{perf.ranking} dari {allDrivers.length} Driver Armada
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-slate-400 block">TOTAL SKOR</span>
                <span className="text-2xl font-black font-mono text-cyan-400">
                  {perf.compositeScore}
                  <span className="text-xs text-slate-400 font-normal">/100</span>
                </span>
              </div>
            </div>

            {/* 8 Factor Bars */}
            <div className="space-y-2.5">
              {factorItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.name}
                    className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                        <span className="font-semibold text-slate-200">{item.name}</span>
                        <span className="text-[10px] font-mono text-slate-500">
                          ({item.weight}%)
                        </span>
                      </div>
                      <span className="font-mono font-bold text-white">{item.score}/100</span>
                    </div>

                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${item.score}%` }}
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.score >= 85
                            ? 'bg-emerald-400'
                            : item.score >= 70
                            ? 'bg-cyan-400'
                            : item.score >= 50
                            ? 'bg-amber-400'
                            : 'bg-rose-400'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
