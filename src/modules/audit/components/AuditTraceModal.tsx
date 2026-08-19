/**
 * Fleet Intelligence Smart AI - Audit Trace & Execution Path Modal
 * PROMPT 49 - Microservice & Correlation ID System Trace View
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Share2,
  CheckCircle2,
  Clock,
  Layers,
  ArrowDown,
  Sparkles,
  Database,
  Cpu,
  ShieldCheck,
  Server,
  Zap,
} from 'lucide-react';
import { auditService } from '../services/auditService';
import { AuditTraceGraph } from '../types/auditTypes';

interface Props {
  correlationId: string | null;
  onClose: () => void;
}

export const AuditTraceModal: React.FC<Props> = ({ correlationId, onClose }) => {
  const [trace, setTrace] = useState<AuditTraceGraph | null>(null);

  useEffect(() => {
    if (correlationId) {
      const result = auditService.getCorrelationTrace(correlationId);
      setTrace(result);
    }
  }, [correlationId]);

  if (!correlationId || !trace) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                TRACE CORRELATION
              </span>
              <span className="text-xs font-mono text-slate-400">ID: {trace.correlationId}</span>
            </div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Share2 className="h-4 w-4 text-cyan-400" />
              <span>{trace.rootAction}</span>
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Trace KPI Bar */}
        <div className="p-4 bg-slate-950/30 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-400 text-[11px] block">Inisiator:</span>
            <span className="text-white font-bold">{trace.initiator.name}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Total Durasi:</span>
            <span className="text-cyan-400 font-bold font-mono">{trace.totalDurationMs} ms</span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Status Akhir:</span>
            <span
              className={`font-bold ${
                trace.status === 'SUCCESS' ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {trace.status}
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Jumlah Span:</span>
            <span className="text-slate-200 font-bold">{trace.spans.length} Node Microservice</span>
          </div>
        </div>

        {/* Spans Timeline Flow */}
        <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
          <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {trace.spans.map((span, idx) => (
              <div key={span.id} className="relative group">
                {/* Node Pin */}
                <div className="absolute -left-6 top-1.5 h-6 w-6 rounded-full bg-slate-900 border-2 border-cyan-500 flex items-center justify-center text-[10px] font-bold text-cyan-400 shadow-md shadow-cyan-500/20">
                  {idx + 1}
                </div>

                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 hover:border-slate-700 transition space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{span.name}</span>
                      </h4>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <Server className="h-3 w-3 text-slate-500" />
                        <span>{span.component}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 text-[11px] font-semibold">
                        {span.durationMs} ms
                      </span>
                      <span className="text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                      </span>
                    </div>
                  </div>

                  {span.metadata && (
                    <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800/80 font-mono text-[11px] text-slate-300 space-y-0.5">
                      {Object.entries(span.metadata).map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                          <span className="text-slate-500">{k}:</span>
                          <span className="text-slate-300 font-medium">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition"
          >
            Tutup Trace
          </button>
        </div>
      </div>
    </div>
  );
};
