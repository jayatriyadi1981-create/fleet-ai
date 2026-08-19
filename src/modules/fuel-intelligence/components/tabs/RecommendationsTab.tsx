/**
 * Fleet Intelligence Smart AI - AI Fuel Recommendations Tab
 * Displays prioritized, evidence-based, actionable fuel saving recommendations.
 */

import React, { useState } from 'react';
import { AIFuelRecommendationItem } from '../../types';
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight, DollarSign, Fuel, Filter, CheckSquare } from 'lucide-react';

interface RecommendationsTabProps {
  recommendations: AIFuelRecommendationItem[];
  onExplainWithAI: (topic: string, subject: string) => void;
}

export const RecommendationsTab: React.FC<RecommendationsTabProps> = ({
  recommendations,
  onExplainWithAI,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const totalPotentialSavingsIdr = recommendations.reduce((acc, r) => acc + r.potentialMonthlySavingsIdr, 0);
  const totalPotentialSavingsLiters = recommendations.reduce((acc, r) => acc + r.potentialMonthlySavingsLiters, 0);

  const filtered = recommendations.filter((r) => {
    if (categoryFilter !== 'ALL' && r.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. Potential Savings Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-inner">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Peluang Penghematan BBM Rekomendasi AI</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xl font-sans">
              AI menganalisis pola idle berlebih, gas mendadak, rute padat, dan keterlambatan servis untuk merumuskan langkah perbaikan non-punitif.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 shrink-0">
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Estimasi Penghematan</span>
            <span className="text-lg font-bold font-mono text-emerald-400">
              Rp {(totalPotentialSavingsIdr / 1000000).toFixed(2)} Juta / bln
            </span>
            <span className="text-[11px] font-mono text-cyan-400 block">
              (~{totalPotentialSavingsLiters} Liter Solar)
            </span>
          </div>
        </div>
      </div>

      {/* 2. Category Filter */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-slate-900 border border-slate-800">
        {[
          { id: 'ALL', label: 'Semua Kategori' },
          { id: 'IDLE_REDUCTION', label: 'Pengurangan Idle' },
          { id: 'MAINTENANCE_TRIGGER', label: 'Trigger Servis' },
          { id: 'ACCELERATION_COACHING', label: 'Driver Coaching' },
          { id: 'ROUTE_REPLANNING', label: 'Optimasi Rute' },
          { id: 'SENSOR_CALIBRATION', label: 'Audit Sensor' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-colors ${
              categoryFilter === cat.id
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 3. Recommendations List */}
      <div className="space-y-4">
        {filtered.map((rec) => {
          const isCritical = rec.priority === 'CRITICAL';
          const isHigh = rec.priority === 'HIGH';

          return (
            <div
              key={rec.id}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-lg"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                        isCritical
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : isHigh
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                      }`}
                    >
                      PRIORITAS: {rec.priority}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-slate-300">
                      {rec.category}
                    </span>
                    {rec.plateNumber && (
                      <span className="font-mono font-bold text-xs text-white">
                        {rec.plateNumber}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white leading-snug">{rec.title}</h4>
                </div>

                <div className="text-right font-mono shrink-0 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Potensi Hemat</span>
                  <span className="text-xs font-bold text-emerald-400">
                    Rp {rec.potentialMonthlySavingsIdr.toLocaleString()} / bln
                  </span>
                  <span className="text-[10px] text-slate-500 block">({rec.potentialMonthlySavingsLiters} L)</span>
                </div>
              </div>

              {/* Core Recommendation Text */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <span className="font-mono font-bold text-xs text-cyan-400 block uppercase">Rencana Aksi AI:</span>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">{rec.recommendation}</p>
                <p className="text-[11px] text-slate-400 italic font-sans">{rec.reason}</p>
              </div>

              {/* Evidence & Action Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Evidence */}
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-1.5">
                  <span className="font-mono font-bold text-slate-400 text-[11px] block uppercase">
                    Bukti Telemetri:
                  </span>
                  <ul className="space-y-1 text-slate-300">
                    {rec.evidence.map((ev, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                        <span>{ev}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Items */}
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-1.5">
                  <span className="font-mono font-bold text-emerald-400 text-[11px] block uppercase">
                    Langkah Operasional Disarankan:
                  </span>
                  <ul className="space-y-1 text-slate-300">
                    {rec.actionItems.map((act, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckSquare className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-[11px] font-mono text-slate-500">ID: {rec.id}</span>
                <button
                  onClick={() => onExplainWithAI('EFFICIENCY', `Rekomendasi AI ${rec.title}`)}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5" /> Explain Deep Evidence
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
