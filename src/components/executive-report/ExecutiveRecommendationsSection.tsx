/**
 * Fleet Intelligence Smart AI - Executive Recommendations Section
 * PROMPT 52 — Management Decision Board (Human-in-the-Loop Actions & Approvals)
 */

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  User, 
  ArrowRight, 
  FileText, 
  Check, 
  X, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { ExecutiveRecommendation } from '../../types/executiveReport';

interface ExecutiveRecommendationsSectionProps {
  recommendations: ExecutiveRecommendation[];
  onApprove: (recId: string) => void;
  onDismiss: (recId: string) => void;
  onCreateTask: (recId: string) => void;
  onViewEvidence: (evidenceIds: string[], title: string) => void;
}

export const ExecutiveRecommendationsSection: React.FC<ExecutiveRecommendationsSectionProps> = ({
  recommendations,
  onApprove,
  onDismiss,
  onCreateTask,
  onViewEvidence,
}) => {
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-rose-950/80 border-rose-700 text-rose-300';
      case 'HIGH':
        return 'bg-amber-950/80 border-amber-700 text-amber-300';
      case 'MEDIUM':
        return 'bg-blue-950/80 border-blue-700 text-blue-300';
      default:
        return 'bg-slate-800 border-slate-700 text-slate-300';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-950/80 border-emerald-700 text-emerald-300';
      case 'IN_PROGRESS':
        return 'bg-cyan-950/80 border-cyan-700 text-cyan-300';
      case 'DISMISSED':
        return 'bg-slate-800 border-slate-700 text-slate-500 line-through';
      default:
        return 'bg-amber-950/80 border-amber-700 text-amber-300';
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-700/60 text-cyan-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>Management Decision Board (Rekomendasi Aksi Direksi)</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300">
                {recommendations.filter(r => r.status === 'PENDING').length} Menunggu Persetujuan
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Rencana aksi berbasis bukti telematika untuk disetujui, didelegasikan menjadi task operasional, atau diaudit
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map(rec => (
          <div
            key={rec.id}
            className={`bg-slate-950/70 border ${
              rec.status === 'APPROVED'
                ? 'border-emerald-700/60 bg-emerald-950/10'
                : rec.status === 'DISMISSED'
                ? 'border-slate-800/40 opacity-60'
                : 'border-slate-800 hover:border-slate-700'
            } rounded-xl p-5 space-y-4 transition-all shadow-md`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded border ${getPriorityStyle(rec.priority)}`}>
                    {rec.priority} PRIORITY
                  </span>
                  <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded">
                    {rec.category}
                  </span>
                  <span className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded border ${getStatusBadge(rec.status)}`}>
                    {rec.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-100">{rec.title}</h3>
              </div>

              <div className="text-right shrink-0 text-xs text-slate-400">
                <div className="flex items-center gap-1 sm:justify-end">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-semibold text-slate-200">{rec.ownerRole}</span>
                </div>
                <div className="flex items-center gap-1 sm:justify-end mt-0.5 text-[11px]">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>Timeline: {rec.suggestedTimeline}</span>
                </div>
              </div>
            </div>

            {/* Content Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1">
                <div className="font-semibold text-slate-300">Latar Belakang & Akar Masalah:</div>
                <p className="text-slate-400 leading-relaxed">{rec.reason}</p>
              </div>

              <div className="p-3 bg-emerald-950/20 rounded-lg border border-emerald-900/40 space-y-1">
                <div className="font-semibold text-emerald-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Estimasi Dampak Finansial & Operasional:</span>
                </div>
                <p className="text-emerald-200/90 leading-relaxed">{rec.expectedImpact}</p>
                {rec.calculationBasis && (
                  <p className="text-[11px] text-emerald-400/80 italic pt-1 border-t border-emerald-900/40">
                    Dasar Hitungan: {rec.calculationBasis}
                  </p>
                )}
              </div>
            </div>

            {/* Approval Info Banner */}
            {rec.status === 'APPROVED' && (
              <div className="p-3 bg-emerald-950/40 rounded-lg border border-emerald-700/60 flex items-center justify-between text-xs text-emerald-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>
                    Disetujui oleh <strong>{rec.approvedBy}</strong> pada {new Date(rec.approvedAt || '').toLocaleDateString('id-ID')}
                  </span>
                </div>
                {rec.taskCreatedId && (
                  <span className="font-mono bg-emerald-900/80 px-2 py-0.5 rounded text-[11px] border border-emerald-700">
                    Task ID: {rec.taskCreatedId}
                  </span>
                )}
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
              <button
                onClick={() => onViewEvidence(rec.evidenceIds, `Audit Bukti: ${rec.title}`)}
                className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Lihat Bukti Telematika ({rec.evidenceIds.length} Dokumen)</span>
              </button>

              <div className="flex items-center gap-2">
                {rec.status === 'PENDING' ? (
                  <>
                    <button
                      onClick={() => onDismiss(rec.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Abaikan (Dismiss)</span>
                    </button>

                    <button
                      onClick={() => onCreateTask(rec.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 text-xs font-medium rounded-lg border border-indigo-700/60 transition-all"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Buat Task PIC</span>
                    </button>

                    <button
                      onClick={() => onApprove(rec.id)}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-md transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Setujui (Approve)</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => onCreateTask(rec.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition-all"
                  >
                    <span>Lacak Status Task</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
