/**
 * Fleet Intelligence Smart AI - Explainable AI Route Transparency Modal
 * Shows deep model evidence, telematics features, confidence score,
 * data quality assessments, and trade-off considerations.
 */

import React from 'react';
import { AIRouteRecommendation } from '../../types';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Info, 
  Activity, 
  TrendingUp,
  Cpu
} from 'lucide-react';

interface ExplainRouteAIModalProps {
  recommendation: AIRouteRecommendation | null;
  onClose: () => void;
  onApprove?: (id: string) => void;
}

export const ExplainRouteAIModal: React.FC<ExplainRouteAIModalProps> = ({
  recommendation,
  onClose,
  onApprove,
}) => {
  if (!recommendation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 p-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                {recommendation.category}
              </span>
              <h3 className="text-base font-bold text-white mt-1 leading-snug">{recommendation.title}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Model Confidence & Quality Badge Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">CONFIDENCE AI</span>
            <span className="text-sm font-bold text-emerald-400">{recommendation.confidence}</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">KUALITAS DATA</span>
            <span className="text-sm font-bold text-cyan-400">{recommendation.dataQuality}</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">STATUS REVIEW</span>
            <span className="text-sm font-bold text-amber-300">{recommendation.status}</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">KENDARAAN</span>
            <span className="text-sm font-bold text-white font-mono">{recommendation.plateNumber || 'Armada Koridor'}</span>
          </div>
        </div>

        {/* Why Reason Detailed */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-cyan-400" /> Rationale & Justifikasi Keputusan AI
          </h4>
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed">
            {recommendation.why}
          </div>
        </div>

        {/* Telemetry Evidence List */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-emerald-400" /> Bukti Telemetri & Telematika Pendukung
          </h4>
          <div className="space-y-1.5">
            {recommendation.evidence.map((ev, idx) => (
              <div key={idx} className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{ev}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trade-offs & Risks */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-amber-400" /> Pertimbangan Kompromi (Trade-Offs)
          </h4>
          <div className="bg-amber-950/20 p-3.5 rounded-xl border border-amber-500/30 text-xs text-amber-200 leading-relaxed">
            {recommendation.tradeOffs}
          </div>
        </div>

        {/* Action Suggestion */}
        <div className="p-3.5 bg-cyan-950/30 rounded-xl border border-cyan-500/30 text-xs space-y-1">
          <span className="text-[10px] text-cyan-400 font-bold uppercase block">Tindakan Yang Direkomendasikan:</span>
          <p className="text-white font-medium">{recommendation.suggestedAction}</p>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
          >
            Tutup
          </button>
          {onApprove && recommendation.status === 'PENDING_REVIEW' && (
            <button
              onClick={() => {
                onApprove(recommendation.id);
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black shadow-lg transition-all"
            >
              Setujui & Terapkan Keputusan AI
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
