/**
 * Risk Score Tab - Deep-Dive Telematics Risk Evaluation
 * PROMPT 29 - Full Mathematical & Telematics Breakdown
 */

import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldCheck,
  Zap,
  Sliders,
  Info,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  UserCheck,
  ChevronDown,
  Sparkles,
  Search,
} from 'lucide-react';
import { DriverIntelligenceFullProfile } from '../../engines/DriverIntelligenceService';
import { DriverRiskLevel, DriverIntelligencePeriod } from '../../types';

interface RiskScoreTabProps {
  selectedProfile: DriverIntelligenceFullProfile;
  allDrivers: { id: string; name: string; vehiclePlate: string }[];
  onSelectDriverId: (id: string) => void;
  period: DriverIntelligencePeriod;
  onOpenExplainModal: () => void;
  onOpenWeightConfigModal: () => void;
  onOpenCoachingModal: (driverId: string) => void;
}

export const RiskScoreTab: React.FC<RiskScoreTabProps> = ({
  selectedProfile,
  allDrivers,
  onSelectDriverId,
  period,
  onOpenExplainModal,
  onOpenWeightConfigModal,
  onOpenCoachingModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const risk = selectedProfile.riskScore;

  const getRiskLevelBadge = (level: DriverRiskLevel) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'MODERATE':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'LOW':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'VERY_LOW':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    }
  };

  const filteredDrivers = allDrivers.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header with Driver Selector & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-lg text-cyan-400">
            {selectedProfile.driverName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                {selectedProfile.driverName}
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${getRiskLevelBadge(
                  risk.level
                )}`}
              >
                {risk.level} RISK
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {selectedProfile.assignedVehiclePlate} • {selectedProfile.simType} • {selectedProfile.branchName}
            </p>
          </div>
        </div>

        {/* Controls: Driver Switcher & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Driver Switch Dropdown */}
          <div className="relative">
            <select
              value={selectedProfile.driverId}
              onChange={(e) => onSelectDriverId(e.target.value)}
              className="pl-3 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-semibold focus:outline-none focus:border-cyan-500/50 appearance-none cursor-pointer"
            >
              {filteredDrivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.vehiclePlate})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={onOpenExplainModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>Transparansi Skor</span>
          </button>

          <button
            onClick={onOpenWeightConfigModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Bobot Model</span>
          </button>

          {risk.score > 45 && (
            <button
              onClick={() => onOpenCoachingModal(selectedProfile.driverId)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-cyan-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Jadwalkan Coaching</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Breakdown: 2 Columns (Score Summary & Detailed Factor Matrix) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Big Risk Score Meter & Narrative (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
            <div className="text-center pb-3 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Evaluasi Skor Risiko AI (0 - 100)
              </span>
              <div className="my-3">
                <span
                  className={`text-6xl font-black font-mono tracking-tight ${
                    risk.score > 60
                      ? 'text-rose-400'
                      : risk.score > 35
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {risk.score}
                </span>
                <span className="text-sm text-slate-400 font-mono ml-1">/100</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-950 border border-slate-800">
                {risk.trend === 'IMPROVING' ? (
                  <>
                    <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Risiko Turun (Membaik)</span>
                  </>
                ) : risk.trend === 'DECLINING' ? (
                  <>
                    <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
                    <span className="text-rose-300">Risiko Naik (Perlu Atensi)</span>
                  </>
                ) : (
                  <span className="text-slate-300">Risiko Stabil</span>
                )}
              </div>
            </div>

            {/* Factor Utama Pemicu Risiko */}
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block mb-1">
                Pemicu Risiko Dominan:
              </span>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-semibold text-amber-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{risk.primaryRiskFactor}</span>
              </div>
            </div>

            {/* Narasi Penjelasan AI */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block">
                Penjelasan Analitik AI:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                {risk.explanation}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: 6-Dimension Contributor Breakdown Table & Evidence (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Contributor Dimension Bars */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Komposisi 6 Dimensi Risiko Telematika
                </h3>
                <p className="text-xs text-slate-400">
                  Normalisasi berbasis jarak tempuh (per 100 km) dan durasi operasional.
                </p>
              </div>
              <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                Total Bobot: 100%
              </span>
            </div>

            <div className="space-y-3.5">
              {risk.contributors.map((c) => (
                <div
                  key={c.factor || c.category}
                  className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{c.name || c.label}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        Bobot {typeof c.weight === 'number' && c.weight <= 1 ? Math.round(c.weight * 100) : c.weight}%
                      </span>
                    </div>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-slate-400 text-[11px]">{c.rawMetricDisplay}</span>
                      <span className="font-bold text-cyan-400">
                        Poin: +{c.contributionToTotalRisk}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar with Color Indicator */}
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${Math.min(100, c.normalizedScore)}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        c.normalizedScore > 65
                          ? 'bg-rose-500'
                          : c.normalizedScore > 35
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Non-Hallucinated Telemetry Evidence Log */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                Bukti Kejadian Telemetri Terverifikasi (Telemetry Log)
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Setiap poin risiko didukung oleh log telemetri GPS, sensor akselerometer, dan log operasional langsung:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {risk.evidence.map((ev, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                  <span className="leading-snug">{ev}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
