/**
 * Fleet Intelligence Smart AI - Alert Analytics & AI Intelligence Tab Component
 */

import React from 'react';
import { Alert, AlertKPIs } from '../types';
import { alertAnalyticsService } from '../services/alertAnalyticsService';
import { alertAIService } from '../services/alertAIService';
import {
  BarChart3,
  Sparkles,
  TrendingUp,
  MapPin,
  ShieldAlert,
  Bot,
  ArrowRight,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

interface AlertAnalyticsTabProps {
  alerts: Alert[];
  kpis: AlertKPIs;
  onApplyRecommendation?: (recId: string) => void;
}

export const AlertAnalyticsTab: React.FC<AlertAnalyticsTabProps> = ({
  alerts,
  kpis,
  onApplyRecommendation,
}) => {
  const topVehicles = alertAnalyticsService.getTopViolatingVehicles(alerts);
  const anomalies = alertAIService.detectAlertAnomalies(alerts);
  const recommendations = alertAIService.getRuleRecommendations();
  const aiSummary = alertAIService.summarizeAlerts(alerts);

  return (
    <div className="space-y-6">
      {/* AI Intelligence Summary Banner */}
      <div className="bg-gradient-to-r from-indigo-950/90 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-2xl">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-indigo-600 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI Alert Intelligence Engine
                </span>
                <span className="text-xs text-indigo-300 font-mono">Real-time Insights</span>
              </div>
              <h2 className="text-base font-bold text-white mt-1">{aiSummary.summaryText}</h2>
              <p className="text-xs text-slate-400 mt-1">
                Armada Berisiko Tinggi: <strong className="text-rose-400">{aiSummary.highRiskVehicle}</strong> • Jenis Pelanggaran Dominan: <strong className="text-indigo-300">{aiSummary.topViolationType}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Violating Vehicles Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-3xl p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              Peringkat Armada Pelanggaran Terbanyak (Top Violating Fleets)
            </h3>
            <span className="text-xs text-slate-400">Total Accumulation</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[10px] uppercase text-slate-400 font-semibold">
                <tr>
                  <th className="p-3">Plat Nomor</th>
                  <th className="p-3 text-center">Overspeed</th>
                  <th className="p-3 text-center">Idle</th>
                  <th className="p-3 text-center">Offline</th>
                  <th className="p-3 text-center">Geofence</th>
                  <th className="p-3 text-center font-bold text-indigo-400">Total Alert</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {topVehicles.slice(0, 5).map((v) => (
                  <tr key={v.vehiclePlate} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-mono font-bold text-white">{v.vehiclePlate}</td>
                    <td className="p-3 text-center font-mono text-rose-400">{v.overspeed}</td>
                    <td className="p-3 text-center font-mono text-amber-400">{v.idle}</td>
                    <td className="p-3 text-center font-mono text-slate-400">{v.offline}</td>
                    <td className="p-3 text-center font-mono text-indigo-400">{v.geofence}</td>
                    <td className="p-3 text-center font-mono font-bold text-indigo-300 bg-indigo-950/30">
                      {v.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Anomaly Insights Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-400" />
              Deteksi Anomali AI (Pattern Detection)
            </h3>
          </div>

          <div className="space-y-3">
            {anomalies.map((anom) => (
              <div key={anom.vehicleId} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-white text-xs">{anom.vehiclePlate}</span>
                  <span className="text-[10px] font-bold bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-md">
                    Match Confidence {anom.confidenceScore}%
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{anom.insight}</p>
                <div className="text-[11px] text-emerald-400 bg-emerald-950/30 p-2 rounded-xl border border-emerald-500/20">
                  💡 <strong>Saran Aksi AI:</strong> {anom.suggestedAction}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Rule Optimizations & Recommendations */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              Rekomendasi Optimalisasi Rule AI (False-Positive Reduction)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Analisis historis AI untuk mengurangi alarm palsu (alert fatigue) tanpa mengurangi aspek keselamatan.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-300 text-xs">{rec.targetGroup}</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Kurangi Alert Palsu -{rec.estimatedFalsePositiveReductionPct}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block">Aturan Saat Ini:</span>
                  <span className="font-mono text-rose-400">{rec.currentValue}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Saran Optimalisasi AI:</span>
                  <span className="font-mono text-emerald-400 font-bold">{rec.recommendedValue}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">{rec.rationale}</p>

              <button
                onClick={() => onApplyRecommendation && onApplyRecommendation(rec.id)}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Terapkan Penyesuaian Rule Ini
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
