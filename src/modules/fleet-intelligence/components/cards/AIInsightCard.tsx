/**
 * Fleet Intelligence Smart AI - AI Insight Card Component (Prompt 28)
 */

import React from 'react';
import { Sparkles, ArrowUpRight, ShieldAlert, CheckCircle2, Info } from 'lucide-react';

interface AIInsightCardProps {
  title: string;
  summary: string;
  severity?: 'critical' | 'high' | 'medium' | 'low';
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
  evidence?: string[];
  recommendation?: string;
  actionLabel?: string;
  onAction?: () => void;
  timestamp?: string;
  onExplain?: () => void;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  title,
  summary,
  severity = 'medium',
  confidence = 'HIGH',
  evidence = [],
  recommendation,
  actionLabel,
  onAction,
  timestamp,
  onExplain,
}) => {
  const getSeverityStyle = () => {
    switch (severity) {
      case 'critical':
        return 'border-rose-500/30 bg-rose-950/10 text-rose-300';
      case 'high':
        return 'border-amber-500/30 bg-amber-950/10 text-amber-300';
      case 'medium':
        return 'border-cyan-500/30 bg-cyan-950/10 text-cyan-300';
      default:
        return 'border-slate-700 bg-slate-900/40 text-slate-300';
    }
  };

  return (
    <div className={`rounded-xl border p-4.5 transition-all ${getSeverityStyle()}`}>
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white leading-tight">{title}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                Confidence: {confidence}
              </span>
              {timestamp && (
                <span className="text-[10px] text-slate-500">• {timestamp}</span>
              )}
            </div>
          </div>
        </div>

        {onExplain && (
          <button
            onClick={onExplain}
            className="flex items-center gap-1 px-2 py-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-[10px] font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-colors"
          >
            <Sparkles className="h-3 w-3" />
            <span>Explain</span>
          </button>
        )}
      </div>

      <p className="text-xs text-slate-300 leading-relaxed mb-3">{summary}</p>

      {evidence.length > 0 && (
        <div className="mb-3 rounded-lg border border-slate-800 bg-slate-950/60 p-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
            Bukti Telematika (Evidence):
          </span>
          <ul className="space-y-1">
            {evidence.map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {recommendation && (
        <div className="mb-3 text-[11px] text-slate-300 bg-cyan-950/20 border border-cyan-500/20 rounded-lg p-2 flex items-start gap-2">
          <Info className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-cyan-300 font-semibold">Rekomendasi AI: </strong>
            <span>{recommendation}</span>
          </div>
        </div>
      )}

      {actionLabel && (
        <div className="flex justify-end pt-1">
          <button
            onClick={onAction}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold transition-all shadow-sm shadow-cyan-950"
          >
            <span>{actionLabel}</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
