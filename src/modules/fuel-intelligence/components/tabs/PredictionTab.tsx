/**
 * Fleet Intelligence Smart AI - Fuel Prediction Tab
 * Forward-looking predictive forecasting model for Next Trip, Next 7 Days, and Next 30 Days.
 */

import React from 'react';
import { FuelEfficiencyPredictionResult } from '../../types';
import { Sparkles, Calendar, TrendingUp, TrendingDown, ArrowRight, AlertTriangle, CheckCircle2, Cpu } from 'lucide-react';

interface PredictionTabProps {
  predictions: FuelEfficiencyPredictionResult[];
  onExplainWithAI: (topic: string, subject: string) => void;
}

export const PredictionTab: React.FC<PredictionTabProps> = ({
  predictions,
  onExplainWithAI,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-inner">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Model Proyeksi Prediktif Efisiensi BBM (AI Predictive Forecast)</h3>
            <p className="text-xs text-slate-300 mt-0.5 font-sans">
              Memproyeksikan konsumsi solar untuk <strong>Trip Berikutnya</strong>, <strong>7 Hari</strong>, dan <strong>30 Hari</strong> ke depan berdasarkan riwayat perawatan & kebiasaan berkendara.
            </p>
          </div>
        </div>
      </div>

      {/* Predictions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {predictions.map((pred) => {
          const isDegrading = pred.forecastTrend === 'DEGRADING';
          const isImproving = pred.forecastTrend === 'IMPROVING';

          return (
            <div
              key={pred.vehicleId}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-lg"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-white">{pred.plateNumber}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                      isDegrading
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : isImproving
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                    }`}
                  >
                    Tren: {pred.forecastTrend}
                  </span>
                </div>

                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                  Kualitas: {pred.predictionQuality} ({pred.confidenceScorePercentage}%)
                </span>
              </div>

              {/* Projections Matrix */}
              <div className="grid grid-cols-3 gap-2 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-center">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Next Trip</span>
                  <span className="font-bold text-xs text-white">{pred.predictedNextTripL100Km} L/100km</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">7 Hari Ke Depan</span>
                  <span className="font-bold text-xs text-cyan-400">{pred.predicted7DaysL100Km} L/100km</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">30 Hari Ke Depan</span>
                  <span className={`font-bold text-xs ${isDegrading ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {pred.predicted30DaysL100Km} L/100km
                  </span>
                </div>
              </div>

              {/* Rationale */}
              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs text-slate-300 space-y-1.5">
                <span className="font-mono font-bold text-[11px] text-slate-400 block">Dasar Rasionalisasi AI:</span>
                <p className="leading-relaxed">{pred.modelRationale}</p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-[11px] font-mono text-slate-500">
                  Konsumsi Saat Ini: {pred.currentConsumptionL100Km} L/100km
                </span>
                <button
                  onClick={() => onExplainWithAI('PREDICTION', `Proyeksi Efisiensi BBM ${pred.plateNumber}`)}
                  className="px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 text-xs font-semibold flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" /> AI Simulation Breakdown
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
