/**
 * Fleet Intelligence Smart AI - Daily Fleet Briefing Modal (Prompt 34 - Section 70, 71, 72)
 * Comprehensive operational morning/daily briefing highlighting status counts,
 * ranked priorities, safety score, and recommended supervisor actions.
 */

import React from 'react';
import { X, Sparkles, AlertTriangle, ShieldCheck, Clock, ArrowRight, CheckCircle2, Truck, Bell } from 'lucide-react';
import { FleetDailyBriefingData } from '../../types';
import { useFleet, ActiveView } from '../../../../context/FleetContext';

interface DailyBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  briefing: FleetDailyBriefingData;
}

export const DailyBriefingModal: React.FC<DailyBriefingModalProps> = ({
  isOpen,
  onClose,
  briefing,
}) => {
  const { setActiveView } = useFleet();

  if (!isOpen) return null;

  const handleNavigate = (viewTarget: string) => {
    setActiveView(viewTarget as ActiveView);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-cyan-500/30 bg-slate-900 shadow-2xl space-y-6 p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg bg-slate-800/80 p-1.5 text-slate-400 hover:text-slate-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Banner */}
        <div className="flex items-start gap-4 border-b border-slate-800 pb-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-500/10">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
                DAILY FLEET BRIEFING
              </span>
              <span className="text-xs text-slate-400">{briefing.date}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-100">
              Ringkasan Operasional & Prioritas AI Armada
            </h2>
            <p className="text-xs text-slate-400">{briefing.greeting}</p>
          </div>
        </div>

        {/* Fleet Status Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 text-center">
            <div className="text-[10px] font-semibold text-slate-400">Total Unit</div>
            <div className="text-lg font-black text-cyan-400">{briefing.fleetSummary.totalVehicles}</div>
          </div>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-2.5 text-center">
            <div className="text-[10px] font-semibold text-emerald-400">Online</div>
            <div className="text-lg font-black text-emerald-400">{briefing.fleetSummary.online}</div>
          </div>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-2.5 text-center">
            <div className="text-[10px] font-semibold text-emerald-400">Moving</div>
            <div className="text-lg font-black text-emerald-400">{briefing.fleetSummary.moving}</div>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-2.5 text-center">
            <div className="text-[10px] font-semibold text-amber-400">Idle</div>
            <div className="text-lg font-black text-amber-400">{briefing.fleetSummary.idle}</div>
          </div>
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-2.5 text-center">
            <div className="text-[10px] font-semibold text-rose-400">Offline</div>
            <div className="text-lg font-black text-rose-400">{briefing.fleetSummary.offline}</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 text-center">
            <div className="text-[10px] font-semibold text-slate-400">Maintenance</div>
            <div className="text-lg font-black text-slate-300">{briefing.fleetSummary.maintenance}</div>
          </div>
        </div>

        {/* Priority Highlights List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              Prioritas Utama Hari Ini
            </h3>
            <span className="text-[11px] text-slate-400">
              {briefing.priorityHighlights.length} Poin Perlu Tindakan
            </span>
          </div>

          <div className="space-y-2">
            {briefing.priorityHighlights.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 hover:border-cyan-500/40 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-black ${
                      item.level === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : item.level === 'HIGH'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-200">{item.title}</span>
                      <span
                        className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                          item.level === 'CRITICAL'
                            ? 'bg-rose-500/20 text-rose-400'
                            : item.level === 'HIGH'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-cyan-500/20 text-cyan-400'
                        }`}
                      >
                        {item.level}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleNavigate(item.targetView)}
                  className="shrink-0 flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-cyan-500 hover:text-cyan-300 transition-colors"
                >
                  <span>{item.actionLabel}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Intelligence Highlights Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-400">Skor Keselamatan Armada:</span>
            <span className="font-bold text-emerald-400">{briefing.safetyScore} / 100 (Optimal)</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-400">Status Konsumsi BBM:</span>
            <span className="font-medium text-slate-300">{briefing.fuelEfficiencyStatus}</span>
          </div>
          <div className="pt-2 border-t border-slate-800 text-xs text-cyan-300/90 font-medium">
            💡 <strong>Rekomendasi Supervisor:</strong> {briefing.recommendedFocus}
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <span className="text-[11px] text-slate-500">
            Dihasilkan secara otomatis oleh AI Telematics Intelligence
          </span>
          <button
            onClick={onClose}
            className="rounded-xl bg-cyan-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
          >
            Tutup & Lanjutkan Kerja
          </button>
        </div>
      </div>
    </div>
  );
};
