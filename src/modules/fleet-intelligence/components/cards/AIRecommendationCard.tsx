/**
 * Fleet Intelligence Smart AI - AI Recommendation Card Component (Prompt 28)
 */

import React from 'react';
import { Sparkles, CheckCircle2, TrendingUp, DollarSign, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { AIRecommendationItem } from '../../types';

interface AIRecommendationCardProps {
  recommendation: AIRecommendationItem;
  onApplyAction?: (rec: AIRecommendationItem) => void;
  onExplain?: (rec: AIRecommendationItem) => void;
}

export const AIRecommendationCard: React.FC<AIRecommendationCardProps> = ({
  recommendation,
  onApplyAction,
  onExplain,
}) => {
  const getPriorityBadge = () => {
    switch (recommendation.priority) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'MEDIUM':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-all hover:border-slate-700">
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-start gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getPriorityBadge()}`}>
                {recommendation.priority}
              </span>
              <span className="text-[10px] font-mono text-slate-400 uppercase">
                Modul: {recommendation.relatedModule}
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mt-1">{recommendation.title}</h4>
          </div>
        </div>

        {onExplain && (
          <button
            onClick={() => onExplain(recommendation)}
            className="flex items-center gap-1 px-2 py-1 rounded-md border border-cyan-500/30 bg-cyan-500/10 text-[10px] font-semibold text-cyan-300 hover:bg-cyan-500/20 shrink-0 transition-colors"
          >
            <Sparkles className="h-3 w-3" />
            <span>Explain</span>
          </button>
        )}
      </div>

      {/* Main Recommendation Text */}
      <p className="text-xs text-slate-200 leading-relaxed mb-3 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
        {recommendation.recommendation}
      </p>

      {/* Rationale & Benefit */}
      <div className="space-y-1.5 text-xs mb-3">
        <p className="text-slate-300">
          <strong className="text-slate-400 font-semibold">Alasan AI: </strong>
          {recommendation.reason}
        </p>
        <p className="text-slate-300">
          <strong className="text-emerald-400 font-semibold">Estimasi Manfaat: </strong>
          {recommendation.expectedBenefit}
        </p>
      </div>

      {/* ROI and Effort Badge */}
      <div className="flex items-center gap-2 mb-3.5 flex-wrap">
        {recommendation.potentialSavingsIdr && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <DollarSign className="h-3.5 w-3.5" />
            <span>Potensi Hemat: Rp {(recommendation.potentialSavingsIdr / 1000000).toFixed(1)} Juta/bln</span>
          </div>
        )}
        {recommendation.estimatedEffort && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>Effort: <strong>{recommendation.estimatedEffort}</strong></span>
          </div>
        )}
      </div>

      {/* Action CTA */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
        <span className="text-[11px] text-slate-400">
          Unit Terkait: <strong className="text-slate-200">{recommendation.relatedVehicles.join(', ')}</strong>
        </span>
        <button
          onClick={() => onApplyAction?.(recommendation)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold transition-all shadow-sm shadow-cyan-950"
        >
          <span>{recommendation.actionLabel}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
