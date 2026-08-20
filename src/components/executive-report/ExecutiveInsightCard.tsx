/**
 * Fleet Intelligence Smart AI - Executive Insight Card
 * PROMPT 52 — Reusable Card for Domain Business Insights
 */

import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { ConfidenceLevel, RiskSeverity } from '../../types/executiveReport';

interface ExecutiveInsightCardProps {
  id?: string;
  domain: string;
  title: string;
  metric?: string;
  change?: string;
  severity?: RiskSeverity;
  summary: string;
  rootCause?: string;
  businessImpact?: string;
  recommendation?: string;
  confidence?: ConfidenceLevel;
  evidenceCount?: number;
  onViewEvidence?: () => void;
}

export const ExecutiveInsightCard: React.FC<ExecutiveInsightCardProps> = ({
  id,
  domain,
  title,
  metric,
  change,
  severity = 'NORMAL',
  summary,
  rootCause,
  businessImpact,
  recommendation,
  confidence = 'High',
  evidenceCount = 0,
  onViewEvidence,
}) => {
  const getSeverityBadge = () => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-950/80 border-rose-700/60 text-rose-400';
      case 'WARNING':
        return 'bg-amber-950/80 border-amber-700/60 text-amber-400';
      case 'WATCH':
        return 'bg-blue-950/80 border-blue-700/60 text-blue-400';
      default:
        return 'bg-emerald-950/80 border-emerald-700/60 text-emerald-400';
    }
  };

  const getConfidenceBadge = () => {
    switch (confidence) {
      case 'High':
        return 'text-emerald-400 bg-emerald-950/50 border-emerald-800/40';
      case 'Medium':
        return 'text-amber-400 bg-amber-950/50 border-amber-800/40';
      case 'Low':
        return 'text-rose-400 bg-rose-950/50 border-rose-800/40';
    }
  };

  return (
    <div
      id={id}
      className="bg-slate-900/85 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-sm space-y-3.5 hover:border-slate-700/90 transition-all"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded">
              {domain}
            </span>
            <span className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded border ${getSeverityBadge()}`}>
              {severity}
            </span>
          </div>
          <h3 className="text-base font-semibold text-slate-100">{title}</h3>
        </div>

        {metric && (
          <div className="text-right shrink-0">
            <div className="text-lg font-bold text-slate-100">{metric}</div>
            {change && <div className="text-xs text-slate-400">{change}</div>}
          </div>
        )}
      </div>

      <p className="text-sm text-slate-300 leading-relaxed">{summary}</p>

      {rootCause && (
        <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/70 text-xs space-y-1">
          <span className="font-semibold text-slate-400 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-cyan-400" />
            Akar Masalah (Root Cause):
          </span>
          <p className="text-slate-300">{rootCause}</p>
        </div>
      )}

      {businessImpact && (
        <div className="p-3 bg-rose-950/20 rounded-lg border border-rose-900/30 text-xs space-y-1">
          <span className="font-semibold text-rose-300 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            Dampak Bisnis (Business Impact):
          </span>
          <p className="text-rose-200/90">{businessImpact}</p>
        </div>
      )}

      {recommendation && (
        <div className="p-3 bg-cyan-950/20 rounded-lg border border-cyan-900/30 text-xs space-y-1">
          <span className="font-semibold text-cyan-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            Rekomendasi AI:
          </span>
          <p className="text-cyan-100/90">{recommendation}</p>
        </div>
      )}

      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-medium ${getConfidenceBadge()}`}>
            <ShieldCheck className="w-3 h-3" />
            {confidence} Confidence
          </span>
        </div>

        {onViewEvidence && evidenceCount > 0 && (
          <button
            onClick={onViewEvidence}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium text-xs hover:underline"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Lihat Bukti ({evidenceCount} Evidence)</span>
          </button>
        )}
      </div>
    </div>
  );
};
