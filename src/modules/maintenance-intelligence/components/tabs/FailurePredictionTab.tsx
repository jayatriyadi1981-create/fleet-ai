/**
 * Fleet Intelligence Smart AI - Failure Prediction Tab
 * Displays component failure forecasts with Horizon Mapping (7d/30d/90d),
 * evidence telemetry trace, failure probability, and technician feedback collection.
 */

import React, { useState } from 'react';
import { FailurePredictionItem, PredictionHorizon } from '../../types';
import { 
  Cpu, 
  Clock, 
  AlertTriangle, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  FileCheck, 
  ThumbsUp,
  Layers,
  ChevronRight
} from 'lucide-react';

interface FailurePredictionTabProps {
  predictions: FailurePredictionItem[];
  onOpenFeedback: (prediction: FailurePredictionItem) => void;
  onRequestWorkOrder?: (vehicleId: string) => void;
}

export const FailurePredictionTab: React.FC<FailurePredictionTabProps> = ({
  predictions,
  onOpenFeedback,
  onRequestWorkOrder,
}) => {
  const [search, setSearch] = useState('');
  const [selectedHorizon, setSelectedHorizon] = useState<string>('ALL');

  const filtered = predictions.filter((p) => {
    const matchesSearch = p.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.componentName.toLowerCase().includes(search.toLowerCase()) ||
      p.potentialFailureMode.toLowerCase().includes(search.toLowerCase());
    const matchesHorizon = selectedHorizon === 'ALL' || p.horizon === selectedHorizon;
    return matchesSearch && matchesHorizon;
  });

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Component Failure Forecasting & Horizons</h3>
            <p className="text-xs text-slate-400">
              Deteksi dini potensi kegagalan 12 sistem mekanis berdasarkan telemetri sensor dan tren run-rate
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari plat atau komponen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={selectedHorizon}
            onChange={(e) => setSelectedHorizon(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">Semua Horizon Waktu</option>
            <option value="DAYS_7">Horizon 7 Hari (Kritis)</option>
            <option value="DAYS_30">Horizon 30 Hari (Menengah)</option>
            <option value="DAYS_90">Horizon 90 Hari (Jangka Panjang)</option>
          </select>
        </div>
      </div>

      {/* Predictions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((pred) => {
          const isCrit = pred.failureRisk === 'CRITICAL';
          const isHigh = pred.failureRisk === 'HIGH';

          return (
            <div
              key={pred.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-3">
                {/* Header info */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold font-mono text-white">{pred.plateNumber}</span>
                      <span className="text-xs text-slate-400">• {pred.branch}</span>
                    </div>
                    <span className="text-xs font-bold text-cyan-300 mt-0.5 block">{pred.componentName}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isCrit ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      isHigh ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                      'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}>
                      {pred.failureRisk}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-amber-400" />
                      {pred.horizonLabel}
                    </span>
                  </div>
                </div>

                {/* Failure Mode & Probability */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Potensi Kerusakan:</span>
                    <span className="text-amber-400 font-mono font-bold">
                      Probabilitas: {Math.round((pred.failureProbabilityScore || 0.75) * 100)}%
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-200 leading-snug">
                    {pred.potentialFailureMode}
                  </p>
                </div>

                {/* Evidence Trace */}
                <div className="space-y-1.5 text-xs text-slate-400">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Bukti Telemetri & Histori Servis:
                  </span>
                  {pred.evidence.slice(0, 2).map((ev, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-slate-300 text-[11px]">
                      <span className="text-cyan-400 mt-0.5">•</span>
                      <span>
                        <strong className="text-slate-200">[{ev.source}]</strong> {ev.finding}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Recommended Action */}
                <div className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-200/90 leading-relaxed">
                  <strong>Tindakan AI:</strong> {pred.recommendedAction}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => onOpenFeedback(pred)}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  {pred.feedback ? (
                    <span className="text-emerald-400 font-medium">Feedback: {pred.feedback.actualOutcome}</span>
                  ) : (
                    <span>Evaluasi Akurasi AI</span>
                  )}
                </button>

                {onRequestWorkOrder && (
                  <button
                    onClick={() => onRequestWorkOrder(pred.vehicleId)}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-sm transition-all"
                  >
                    Buat Work Order
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
