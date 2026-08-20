import React from 'react';
import { VehicleAIInsightDetail } from '../../../types/vehicle';
import { Sparkles, Zap, AlertTriangle, CheckCircle2, Shield, Activity, Gauge, Flame } from 'lucide-react';

interface AiHealthTabProps {
  aiInsight: VehicleAIInsightDetail | null;
}

export const AiHealthTab: React.FC<AiHealthTabProps> = ({ aiInsight }) => {
  if (!aiInsight) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
        <Sparkles className="mx-auto h-8 w-8 text-purple-400 animate-pulse mb-2" />
        <p className="text-xs">Menganalisis data telematika & telemetri AI...</p>
      </div>
    );
  }

  const breakdown = aiInsight.healthBreakdown || {
    engine: 91,
    transmission: 88,
    brakingSystem: 86,
    battery: 94,
    gpsSensor: 99,
    tires: 79,
    fuelSystem: 85,
    coolingSystem: 92,
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 75) return 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30';
    if (score >= 60) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  return (
    <div className="space-y-6">
      {/* Top AI Overall Banner */}
      <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <h3 className="text-base font-bold text-white">AI Fleet Intelligence Diagnostic Engine</h3>
            </div>
            <p className="text-xs text-purple-300">
              Analisis prediktif berbasis machine learning dari sensor CAN bus, getaran akselerometer, dan konsumsi BBM.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-purple-900/40 border border-purple-500/40 rounded-2xl px-5 py-3 shrink-0">
            <div>
              <p className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">Overall Health Score</p>
              <p className="text-3xl font-mono font-black text-white">{aiInsight.healthScore}<span className="text-sm font-normal text-purple-300">/100</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Component Health Breakdown Grid */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Activity className="h-4 w-4 text-cyan-400" />
          Kesehatan Subsistem & Komponen Kritis
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { name: 'Mesin & Engine Core', score: breakdown.engine, desc: 'Tekanan oli & kompresi silinder optimal' },
            { name: 'Transmisi & Kopling', score: breakdown.transmission, desc: 'Penyaluran torsi roda halus tanpa slip' },
            { name: 'Sistem Pengereman', score: breakdown.brakingSystem, desc: 'Kampas & tekanan hidrolik stabil' },
            { name: 'Kelistrikan & Aki', score: breakdown.battery, desc: 'Tegangan alternator 24.2V stabil' },
            { name: 'Sensor IoT & GPS', score: breakdown.gpsSensor, desc: 'Sinyal GNSS / GSM 100% online' },
            { name: 'Kondisi Ban (Tires)', score: breakdown.tires, desc: 'Tekanan 110 PSI, tapak ban 7.2mm' },
            { name: 'Sistem BBM & Injeksi', score: breakdown.fuelSystem, desc: 'Aliran debit nozzle teratur' },
            { name: 'Sistem Pendingin', score: breakdown.coolingSystem, desc: 'Suhu radiator kerja 86°C' },
          ].map((item, idx) => (
            <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">{item.name}</span>
                <span className={`rounded-lg px-2 py-0.5 text-xs font-mono font-bold border ${getScoreColor(item.score)}`}>
                  {item.score}%
                </span>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.score >= 90 ? 'bg-emerald-400' : item.score >= 75 ? 'bg-cyan-400' : 'bg-amber-400'}`}
                  style={{ width: `${item.score}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Predictive Maintenance & Anomalies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Predictive Component Forecast */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Gauge className="h-4 w-4 text-purple-400" />
            Prediksi Waktu Penggantian Sparepart (Forecast)
          </h3>

          <div className="space-y-3">
            {aiInsight.predictedMaintenance.map((pred, idx) => (
              <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{pred.component}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                      pred.urgency === 'high'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : pred.urgency === 'medium'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {pred.urgency} Urgency
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-cyan-300 font-semibold">Estimasi: ~{pred.estimatedDaysRemaining} Hari lagi</span>
                  <span className="text-slate-400">(~{pred.estimatedKmRemaining} KM)</span>
                </div>

                <p className="text-[11px] text-slate-400 bg-slate-900/80 rounded-lg p-2 border border-slate-800">
                  Saran Tindakan: {pred.action}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Anomalies Detected */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            Anomali Pola Telemetri & Rekomendasi
          </h3>

          <div className="space-y-3">
            {aiInsight.anomalies.map((anom) => (
              <div key={anom.id} className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-200">{anom.title}</span>
                  <span className="font-mono text-[10px] text-purple-400">Confidence: {anom.confidencePercent}%</span>
                </div>
                <p className="text-xs text-slate-300">{anom.description}</p>
                <div className="pt-2 border-t border-purple-900/50">
                  <p className="text-xs text-cyan-300 font-semibold flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                    Rekomendasi AI: {anom.recommendation}
                  </p>
                </div>
              </div>
            ))}

            {aiInsight.fuelOptimizationTips && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2">
                <p className="text-xs font-bold text-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Tips Eco-Driving & Penghematan BBM:
                </p>
                <ul className="text-xs text-slate-300 space-y-1 pl-4 list-disc">
                  {aiInsight.fuelOptimizationTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
