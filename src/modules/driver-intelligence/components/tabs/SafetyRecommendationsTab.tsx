/**
 * Safety Recommendations Tab - Proactive AI Coaching Triggers
 * PROMPT 29 - Evidence-backed Interventions & 1-Click Coaching Plan Pre-fill
 */

import React, { useState } from 'react';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Filter,
  ArrowRight,
  TrendingDown,
  UserCheck,
  Brain,
  ShieldAlert,
  Search,
} from 'lucide-react';
import { DriverSafetyRecommendation, DriverIntelligencePeriod } from '../../types';

interface SafetyRecommendationsTabProps {
  recommendations: DriverSafetyRecommendation[];
  period: DriverIntelligencePeriod;
  onOpenCoachingModal: (driverId: string, focusType?: string) => void;
  onSelectDriver: (driverId: string) => void;
}

export const SafetyRecommendationsTab: React.FC<SafetyRecommendationsTabProps> = ({
  recommendations,
  period,
  onOpenCoachingModal,
  onSelectDriver,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = recommendations.filter((rec) => {
    const matchCat = selectedCategory === 'ALL' || rec.category === selectedCategory;
    const matchPri = selectedPriority === 'ALL' || rec.priority === selectedPriority;
    const matchSearch =
      searchQuery === '' ||
      rec.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchPri && matchSearch;
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Rekomendasi Keselamatan AI Proaktif
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {filtered.length} Tindakan Disarankan
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Pemicu intervensi preventif non-punitif berdasarkan pola telemetri terverifikasi sistem.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari rekomendasi / driver..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 w-48"
            />
          </div>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="ALL">Semua Prioritas</option>
            <option value="CRITICAL">Kritis</option>
            <option value="HIGH">Tinggi</option>
            <option value="MEDIUM">Menengah</option>
          </select>
        </div>
      </div>

      {/* Recommendations Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((rec) => (
          <div
            key={rec.id}
            className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-lg"
          >
            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${getPriorityBadge(
                      rec.priority
                    )}`}
                  >
                    {rec.priority}
                  </span>
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                    {rec.driverName}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Potensi Risiko: {rec.projectedRiskReduction}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-sm font-bold text-white leading-snug">{rec.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-1.5">{rec.description}</p>

              {/* Telemetry Evidence Box */}
              {rec.evidence.length > 0 && (
                <div className="mt-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                    Bukti Sensorik Terverifikasi:
                  </span>
                  {rec.evidence.map((ev, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="leading-tight">{ev}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => onSelectDriver(rec.driverId)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all text-center"
              >
                Lihat Profil Telematika
              </button>

              <button
                onClick={() => onOpenCoachingModal(rec.driverId, rec.suggestedCoachingType)}
                className="flex-1 py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-md shadow-cyan-500/20"
              >
                <Brain className="w-3.5 h-3.5" />
                <span>Buat Sesi Coaching</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
