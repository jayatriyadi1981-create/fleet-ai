/**
 * Fleet Intelligence Smart AI - Source Citations Inspector Modal (Prompt 34 - Section 62)
 * Allows users to inspect verified telemetry sources, sensors, gateway timestamps,
 * and data confidence levels behind every AI assistant statement.
 */

import React from 'react';
import { X, Database, ShieldCheck, ExternalLink, Activity } from 'lucide-react';
import { AISourceCitation } from '../../../../types/ai';
import { useFleet, ActiveView } from '../../../../context/FleetContext';

interface AISourceInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  sources: AISourceCitation[];
  dataFreshness?: {
    lastUpdate: string;
    isStale: boolean;
    staleWarning?: string;
  };
}

export const AISourceInspectorModal: React.FC<AISourceInspectorModalProps> = ({
  isOpen,
  onClose,
  sources,
  dataFreshness,
}) => {
  const { setActiveView } = useFleet();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Sumber Data & Bukti Telemetri</h3>
            <p className="text-xs text-slate-400">
              Transparansi data telemetri yang digunakan AI untuk menghasilkan respon ini.
            </p>
          </div>
        </div>

        {/* Freshness Banner */}
        {dataFreshness && (
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-2.5 text-xs">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
              Status Data:
            </span>
            <span className="font-semibold text-emerald-400">
              Live Real-time ({new Date(dataFreshness.lastUpdate).toLocaleTimeString('id-ID')} WIB)
            </span>
          </div>
        )}

        {/* Sources List */}
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {sources.length === 0 ? (
            <p className="text-xs text-slate-500 italic text-center py-4">
              Tidak ada sumber eksternal khusus yang dicatat.
            </p>
          ) : (
            sources.map((src, idx) => (
              <div
                key={src.id || idx}
                className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-500/20">
                    {src.module}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified Telematics
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-200">{src.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{src.description}</p>
                </div>

                {src.routeLink && (
                  <button
                    onClick={() => {
                      setActiveView(src.routeLink as ActiveView);
                      onClose();
                    }}
                    className="flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <span>Buka modul sumber data</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
