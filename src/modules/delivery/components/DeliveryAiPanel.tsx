/**
 * Fleet Intelligence Smart AI - Delivery AI Analytics & Prediction Dashboard Panel
 */

import React from 'react';
import { deliveryAIService } from '../services/deliveryAIService';
import {
  Sparkles,
  AlertTriangle,
  Clock,
  TrendingDown,
  Compass,
  FileSearch,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

export const DeliveryAiPanel: React.FC = () => {
  const latePredictions = deliveryAIService.getLateDeliveryPredictions();
  const failedPredictions = deliveryAIService.getFailedDeliveryPredictions();
  const seqOpt = deliveryAIService.getSequenceOptimization('trp-01');
  const anomalies = deliveryAIService.getAnomalies();
  const execSummary = deliveryAIService.getDailyExecutiveSummary();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Executive AI Summary Card */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 border border-purple-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-32 h-32 text-purple-400" />
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h2 className="text-base font-bold text-white tracking-tight">
            Ringkasan Eksekutif AI Smart Fleet Agent — {execSummary.date}
          </h2>
        </div>

        <p className="text-xs text-purple-200/90 leading-relaxed max-w-3xl">
          {execSummary.executiveInsight}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-purple-500/20 text-xs">
          <div>
            <span className="text-[10px] text-purple-300/70 block">Total Dikerjakan</span>
            <span className="text-lg font-bold text-white">{execSummary.totalCompleted} / {execSummary.totalPlanned}</span>
          </div>

          <div>
            <span className="text-[10px] text-purple-300/70 block">Pengiriman Berisiko</span>
            <span className="text-lg font-bold text-amber-400">{execSummary.atRiskCount} Titik</span>
          </div>

          <div>
            <span className="text-[10px] text-purple-300/70 block">Terlambat Jendela Waktu</span>
            <span className="text-lg font-bold text-emerald-400">{execSummary.missedWindowCount} (SLA Safe)</span>
          </div>

          <div>
            <span className="text-[10px] text-purple-300/70 block">Penyebab Utama Terhambat</span>
            <span className="text-xs font-semibold text-rose-300 truncate block mt-1">{execSummary.topFailureReason}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Late Delivery AI Predictions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Prediksi Keterlambatan Pengiriman (AI Late Risk)
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-500/10 text-amber-400 rounded">
              Real-Time Traffic & Weather
            </span>
          </div>

          <div className="space-y-3">
            {latePredictions.map((pred) => (
              <div
                key={pred.deliveryId}
                className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-400 font-mono text-xs">
                    {pred.deliveryNumber}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      pred.riskLevel === 'HIGH' || pred.riskLevel === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : pred.riskLevel === 'MEDIUM'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    Risiko {pred.riskLevel} ({pred.lateProbability}%)
                  </span>
                </div>

                <div className="text-xs text-white font-semibold">{pred.customerName}</div>

                <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                  <strong className="text-slate-300">Analisis AI:</strong> {pred.reasoning}
                </p>

                <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5 pt-1">
                  <ArrowRight className="w-3.5 h-3.5" />
                  Saran Tindakan: {pred.suggestedAction}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Failed Delivery Risk Analysis */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Mitigasi Risiko Gagal Kirim (Failed Delivery AI)
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-rose-500/10 text-rose-400 rounded">
              Predictive SLA Shield
            </span>
          </div>

          <div className="space-y-3">
            {failedPredictions.map((fail) => (
              <div
                key={fail.deliveryId}
                className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 text-xs">{fail.customerName}</span>
                  <span className="font-mono text-xs font-bold text-rose-400">
                    Probabilitas Gagal: {fail.failureProbability}%
                  </span>
                </div>

                <div className="text-[11px] text-slate-400">
                  Faktor Risiko: <strong className="text-slate-200">{fail.riskFactor}</strong>
                </div>

                <div className="text-[11px] text-indigo-300 bg-indigo-950/30 border border-indigo-500/20 p-2.5 rounded-lg">
                  <strong className="text-indigo-200 block mb-0.5">Strategi Mitigasi Otomatis AI:</strong>
                  {fail.aiMitigationStrategy}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Multi-Stop Sequence Optimization Advisor */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-400" />
            Rekomendasi Optimalisasi Urutan Stop (Multi-Stop Route AI)
          </h3>
          <div className="flex items-center gap-3 text-xs text-emerald-400 font-bold">
            <span>Hemat Jarak: +{seqOpt.estimatedDistanceSavingsKm} km</span>
            <span>Hemat Waktu: +{seqOpt.estimatedTimeSavingsMinutes} Menit</span>
          </div>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-xs space-y-3">
          <p className="text-slate-300 leading-relaxed">{seqOpt.rationale}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            <div>
              <span className="text-[10px] text-slate-500 block mb-1">Urutan Jadwal Saat Ini:</span>
              <div className="flex items-center gap-2 font-mono text-slate-400">
                {seqOpt.currentSequence.map((s, idx) => (
                  <span key={idx} className="bg-slate-900 px-2 py-1 rounded border border-slate-800">
                    {idx + 1}. {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] text-emerald-400 font-bold block mb-1">
                Urutan Optimal AI (Rekomendasi):
              </span>
              <div className="flex items-center gap-2 font-mono text-emerald-300 font-bold">
                {seqOpt.recommendedSequence.map((s, idx) => (
                  <span key={idx} className="bg-emerald-950/40 px-2 py-1 rounded border border-emerald-500/30">
                    {idx + 1}. {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
