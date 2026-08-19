/**
 * Fleet Intelligence Smart AI - Trip AI Intelligence Drawer Modal
 * PROMPT 14 — AI Route Analysis, Driver Scoring & Anomaly Detection Display
 */

import React, { useEffect, useState } from 'react';
import { DetailedTrip, TripRoute, TripAISummary } from '../../modules/trips/types';
import { tripAIService } from '../../modules/trips/services/tripAiService';
import { Sparkles, X, ShieldAlert, Zap, Award, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

interface TripAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: DetailedTrip | null;
  route: TripRoute | null;
}

export const TripAiModal: React.FC<TripAiModalProps> = ({ isOpen, onClose, trip, route }) => {
  const [summary, setSummary] = useState<TripAISummary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && trip && route) {
      setLoading(true);
      tripAIService.analyzeTrip(trip, route).then((res) => {
        setSummary(res);
        setLoading(false);
      });
    }
  }, [isOpen, trip, route]);

  if (!isOpen || !trip) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/50 backdrop-blur-xs flex justify-end">
      <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-gray-200">
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-300 border border-indigo-400/30">
              <Sparkles className="w-5 h-5 text-indigo-300 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">AI Trip Intelligence & Anomaly</h2>
              <p className="text-xs text-indigo-200">{trip.tripNumber} ({trip.vehiclePlate})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-indigo-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
              <p className="text-xs text-gray-500 font-medium">Menganalisis telemetry & rute perjalanan...</p>
            </div>
          ) : summary ? (
            <>
              {/* Executive Summary */}
              <div className="bg-indigo-50/70 border border-indigo-100 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Ringkasan Eksekutif AI</span>
                </div>
                <p className="text-xs text-indigo-950 leading-relaxed">{summary.executiveSummary}</p>
              </div>

              {/* Scores Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Score 1: Efficiency */}
                <div className="bg-white border border-gray-200 p-4 rounded-xl text-center shadow-2xs">
                  <div className="text-xs font-semibold text-gray-500">Skor Efisiensi Rute</div>
                  <div className="text-3xl font-extrabold text-blue-600 mt-1">{summary.efficiencyScore}%</div>
                  <div className="text-[11px] text-gray-400 mt-1">Estimasi Rasio: {summary.fuelEfficiencyKmL} KM/L</div>
                </div>

                {/* Score 2: Driver Safety */}
                <div className="bg-white border border-gray-200 p-4 rounded-xl text-center shadow-2xs">
                  <div className="text-xs font-semibold text-gray-500">Skor Keselamatan Driver</div>
                  <div className="text-3xl font-extrabold text-emerald-600 mt-1">{summary.driverSafetyScore}/100</div>
                  <div className="text-[11px] text-gray-400 mt-1">Analisis Perilaku Pengemudi</div>
                </div>
              </div>

              {/* Detected Anomalies */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Terdeteksi Anomali Telemetry ({summary.detectedAnomalies.length})</span>
                  </h3>
                </div>

                {summary.detectedAnomalies.length === 0 ? (
                  <div className="p-4 bg-emerald-50 rounded-lg text-xs text-emerald-700 flex items-center gap-2 border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Tidak ada anomali atau ancaman keselamatan serius yang terdeteksi.</span>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {summary.detectedAnomalies.map((anom) => (
                      <div
                        key={anom.id}
                        className={`p-3 rounded-lg border text-xs space-y-1 ${
                          anom.severity === 'high'
                            ? 'bg-rose-50 border-rose-200'
                            : 'bg-amber-50 border-amber-200'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span className={anom.severity === 'high' ? 'text-rose-900' : 'text-amber-900'}>
                            {anom.title}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                              anom.severity === 'high'
                                ? 'bg-rose-200 text-rose-800'
                                : 'bg-amber-200 text-amber-800'
                            }`}
                          >
                            {anom.severity}
                          </span>
                        </div>
                        <p className="text-gray-700">{anom.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recommendations */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Rekomendasi Tindakan Fleet Manager
                </h3>
                <div className="space-y-2">
                  {summary.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                      <ArrowRight className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
