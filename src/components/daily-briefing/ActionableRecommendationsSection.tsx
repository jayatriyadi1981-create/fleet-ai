/**
 * Fleet Intelligence Smart AI - Actionable AI Recommendations Section
 */

import React from 'react';
import { 
  Sparkles, 
  Check, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  XCircle,
  Wrench,
  Fuel,
  UserCheck,
  Radio,
  MapPin
} from 'lucide-react';
import { BriefingRecommendation, RecommendationPriority } from '../../types/dailyBriefing';

interface ActionableRecommendationsSectionProps {
  recommendations: BriefingRecommendation[];
  onUpdateStatus?: (recId: string, status: 'pending' | 'task_created' | 'scheduled' | 'dismissed' | 'approved') => void;
  onNavigateToModule?: (targetModule: string) => void;
}

export const ActionableRecommendationsSection: React.FC<ActionableRecommendationsSectionProps> = ({
  recommendations,
  onUpdateStatus,
  onNavigateToModule,
}) => {
  const getPriorityBadge = (prio: RecommendationPriority) => {
    switch (prio) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'LOW': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getModuleIcon = (mod: string) => {
    switch (mod) {
      case 'maintenance': return <Wrench className="w-3.5 h-3.5 text-rose-600" />;
      case 'fuel': return <Fuel className="w-3.5 h-3.5 text-amber-600" />;
      case 'driver':
      case 'safety': return <UserCheck className="w-3.5 h-3.5 text-emerald-600" />;
      case 'gps': return <Radio className="w-3.5 h-3.5 text-indigo-600" />;
      case 'route': return <MapPin className="w-3.5 h-3.5 text-blue-600" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-indigo-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Section Header */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              Rekomendasi Tindakan Proaktif AI (Actionable Insights)
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-indigo-100 text-indigo-700">
                {recommendations.length} Rekomendasi
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Dihasilkan otomatis berdasarkan mitigasi risiko, efisiensi operasional, dan kepatuhan armada
            </p>
          </div>
        </div>
      </div>

      {/* Recommendation Items */}
      <div className="divide-y divide-slate-100">
        {recommendations.map(rec => {
          const isDone = rec.actionStatus === 'approved' || rec.actionStatus === 'task_created';
          const isDismissed = rec.actionStatus === 'dismissed';

          return (
            <div key={rec.id} className={`p-5 sm:p-6 transition-colors ${isDone ? 'bg-emerald-50/20' : isDismissed ? 'bg-slate-50 opacity-60' : 'hover:bg-slate-50/50'}`}>
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                <div className="space-y-2.5 flex-1">
                  {/* Badges & Meta */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getPriorityBadge(rec.priority)}`}>
                      PRIORITAS {rec.priority}
                    </span>

                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 capitalize">
                      {getModuleIcon(rec.targetModule)}
                      Modul {rec.targetModule}
                    </span>

                    {rec.requiresHumanApproval && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <ShieldCheck className="w-3 h-3" />
                        Persetujuan Manajer Wajib
                      </span>
                    )}

                    <span className={`text-[11px] px-2 py-0.5 rounded-md font-bold ${
                      isDone ? 'bg-emerald-100 text-emerald-800' :
                      isDismissed ? 'bg-slate-200 text-slate-700' : 'bg-blue-100 text-blue-800'
                    }`}>
                      Status: {rec.actionStatus.toUpperCase()}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {rec.title}
                  </h3>

                  {/* Reason & Evidence */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                      <span className="font-semibold text-slate-800 block mb-0.5">Alasan Diagnostik:</span>
                      <span className="text-slate-600">{rec.reason}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                      <span className="font-semibold text-slate-800 block mb-0.5">Bukti Data:</span>
                      <span className="text-slate-600">{rec.evidence}</span>
                    </div>
                  </div>

                  {/* Impact & Action */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-y-1 gap-x-4 text-xs pt-1">
                    <div>
                      <span className="font-semibold text-emerald-700">Dampak Ekspektasi: </span>
                      <span className="text-slate-700 font-medium">{rec.expectedImpact}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-indigo-700">Aksi Disarankan: </span>
                      <span className="text-slate-700">{rec.suggestedAction}</span>
                    </div>
                  </div>
                </div>

                {/* Right Action Trigger Buttons */}
                <div className="flex sm:flex-row lg:flex-col items-center sm:justify-end gap-2 shrink-0 pt-2 lg:pt-0">
                  {/* Approve / Execute Task Button */}
                  {!isDone && !isDismissed && (
                    <button
                      onClick={() => onUpdateStatus?.(rec.id, 'approved')}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Setujui & Buat Tugas
                    </button>
                  )}

                  {/* Jump to Module */}
                  <button
                    onClick={() => onNavigateToModule?.(rec.targetModule)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-all flex items-center justify-center gap-1.5"
                  >
                    Buka Modul
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {/* Dismiss */}
                  {!isDone && !isDismissed && (
                    <button
                      onClick={() => onUpdateStatus?.(rec.id, 'dismissed')}
                      className="w-full sm:w-auto px-3 py-1.5 rounded-xl text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all"
                    >
                      Abaikan
                    </button>
                  )}

                  {isDone && (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Telah Dieksekusi
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
