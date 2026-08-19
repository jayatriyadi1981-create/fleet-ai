/**
 * Fleet Intelligence Smart AI - Fuel Drain & Leak Detection Tab
 * Evaluates fuel line leaks, bypass drainages, drop rate per hour,
 * and correlation with Maintenance Work Orders (PROMPT 25).
 */

import React from 'react';
import { FuelDrainItem } from '../../types';
import { Wrench, Droplet, AlertTriangle, CheckCircle2, Sparkles, Activity } from 'lucide-react';

interface DrainDetectionTabProps {
  drainEvents: FuelDrainItem[];
  onOpenReview: (item: any) => void;
  onExplainWithAI: (topic: string, subject: string) => void;
}

export const DrainDetectionTab: React.FC<DrainDetectionTabProps> = ({
  drainEvents,
  onOpenReview,
  onExplainWithAI,
}) => {
  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Droplet className="h-4 w-4 text-cyan-400" />
            Deteksi Kebocoran & Pengurasan BBM (Fuel Drain & Leak Detection)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Menganalisis kehilangan solar abnormal baik dalam laju cepat (penyedotan tangki) maupun laju lambat berkesinambungan (kebocoran selang/injektor).
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
            <span className="text-slate-400 block text-[10px]">Total Drain Terdeteksi</span>
            <span className="font-bold text-white text-sm">{drainEvents.length} Kejadian</span>
          </div>
        </div>
      </div>

      {/* Drain Events List */}
      <div className="space-y-4">
        {drainEvents.map((drain) => (
          <div
            key={drain.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition-all shadow-lg"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Droplet className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-white">{drain.plateNumber}</span>
                    <span className="text-xs text-slate-400">({drain.driverName})</span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {drain.locationName} • {new Date(drain.timestamp).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-400 block">Laju Penurunan</span>
                  <span className="text-xs font-bold text-rose-400">{drain.dropRateLitersPerHour} L/Jam</span>
                </div>
                <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Kehilangan: -{drain.fuelLostLiters} L
                </span>
              </div>
            </div>

            {/* Possible Causes & Maintenance Link */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
              <span className="font-mono font-bold text-slate-300 block">Kemungkinan Penyebab Utama (AI Diagnosis):</span>
              <ul className="space-y-1 text-slate-300">
                {drain.possibleCauses.map((cause, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    <span>{cause}</span>
                  </li>
                ))}
              </ul>
              {drain.maintenanceAlertLinked && (
                <div className="pt-2 flex items-center gap-2 text-amber-300 font-mono text-[11px]">
                  <Wrench className="h-3.5 w-3.5" />
                  <span>Terhubung dengan Perawatan: <strong>{drain.maintenanceAlertLinked}</strong></span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-[11px] font-mono text-slate-500">
                Status Sensor Tangki: <strong className="text-emerald-400">{drain.sensorHealthStatus}</strong>
              </span>
              <button
                onClick={() => onExplainWithAI('ANOMALY', `Analisis Drain BBM ${drain.plateNumber}`)}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" /> Explain Root Cause
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
