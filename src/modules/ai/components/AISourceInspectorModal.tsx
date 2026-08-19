/**
 * Fleet Intelligence Smart AI - AI Source Inspector Modal (Section 51 & 93)
 * Inspects telemetry data provenance, timestamps, freshness, and module source links.
 */

import React from 'react';
import { AISourceCitation } from '../../../types/ai';
import { Database, X, Clock, ShieldCheck, ExternalLink } from 'lucide-react';

interface AISourceInspectorModalProps {
  sources: AISourceCitation[];
  isOpen: boolean;
  onClose: () => void;
  onNavigateModule?: (routeId: string) => void;
}

export const AISourceInspectorModal: React.FC<AISourceInspectorModalProps> = ({
  sources,
  isOpen,
  onClose,
  onNavigateModule,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Inspektur Sumber Data AI (Factual Evidence)</h3>
              <p className="text-xs text-slate-400">Verifikasi Asal Data Telemetri & Timestamp Sensor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Source Items */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {sources.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">Tidak ada sumber khusus yang terikat.</p>
          ) : (
            sources.map((src) => (
              <div
                key={src.id}
                className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-2 text-xs hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 font-bold border border-cyan-500/30 text-[10px]">
                      {src.module}
                    </span>
                    {src.targetId && (
                      <span className="text-slate-300 font-semibold font-mono text-[11px]">
                        ID: {src.targetId}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Keyakinan: {src.confidence || 'HIGH'}</span>
                  </div>
                </div>

                <p className="font-bold text-white text-sm">{src.title}</p>
                <p className="text-slate-300 leading-relaxed">{src.description}</p>

                <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-500" />
                    <span>Waktu Data: {src.dataTimestamp ? new Date(src.dataTimestamp).toLocaleTimeString() : 'Real-time'}</span>
                  </div>

                  {src.routeLink && onNavigateModule && (
                    <button
                      onClick={() => {
                        onNavigateModule(src.routeLink!);
                        onClose();
                      }}
                      className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold"
                    >
                      <span>Buka Modul</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-slate-800 pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
