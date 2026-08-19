/**
 * Fleet Intelligence Smart AI - AI Activity & Agent Tool Execution Tab
 * PROMPT 49 - Autonomous Copilot Audit, Tool Execution Telemetry & Decision Tracking
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  BrainCircuit,
  Sliders,
  FileCode,
} from 'lucide-react';
import { AuditEvent } from '../types/auditTypes';

interface Props {
  events: AuditEvent[];
  onSelectEvent: (event: AuditEvent) => void;
}

export const AiActivityTab: React.FC<Props> = ({ events, onSelectEvent }) => {
  const aiEvents = events.filter(
    (e) => e.actor.type === 'AI' || e.actionCategory === 'AI' || e.module === 'ai'
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl border border-purple-900/40 bg-purple-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <span>AI Activity, Copilot Decisions & Tool Invocations</span>
          </h3>
          <p className="text-xs text-purple-200">
            Observability transparansi menyeluruh atas eksekusi agen AI Gemini, prediksi BBM, rekomendasi rute, dan tindakan manusia (Human-in-the-Loop).
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-purple-900/60 border border-purple-700/50 text-xs font-mono text-purple-300 font-bold shrink-0">
          Model: Gemini 2.5 Flash
        </div>
      </div>

      {/* AI Events List */}
      <div className="space-y-4">
        {aiEvents.length > 0 ? (
          aiEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => onSelectEvent(event)}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-xl hover:border-purple-500/40 transition cursor-pointer group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
                      AI ACTION
                    </span>
                    <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition">
                      {event.actionLabel || event.action}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Agen: <strong className="text-slate-200">{event.actor.name}</strong> • Target:{' '}
                    <span className="text-purple-300 font-mono">{event.entityName}</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-mono text-slate-400">
                    {new Date(event.timestamp).toLocaleString('id-ID')}
                  </span>
                  <div className="text-[10px] text-emerald-400 font-semibold flex items-center justify-end gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Sukses Dieksekusi</span>
                  </div>
                </div>
              </div>

              {/* AI Metadata & Parameters */}
              {event.metadata && (
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Parameter Eksekusi Agen
                  </span>
                  {Object.entries(event.metadata).map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-slate-900 pb-1">
                      <span className="text-purple-400">{k}:</span>
                      <span className="text-slate-200">{String(v)}</span>
                    </div>
                  ))}
                </div>
              )}

              {event.reason && (
                <div className="text-xs text-slate-300 italic p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
                  "{event.reason}"
                </div>
              )}

              <div className="flex justify-end">
                <span className="text-xs text-purple-400 font-semibold flex items-center gap-1">
                  <span>Inspeksi Trace AI & Hash</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-slate-500 text-xs rounded-2xl border border-dashed border-slate-800">
            Belum ada catatan aktivitas AI pada rentang waktu ini.
          </div>
        )}
      </div>
    </div>
  );
};
