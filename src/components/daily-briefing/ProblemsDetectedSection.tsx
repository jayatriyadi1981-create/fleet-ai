/**
 * Fleet Intelligence Smart AI - Problems Detected Section
 */

import React, { useState } from 'react';
import { 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Radio, 
  Fuel, 
  Wrench, 
  UserCheck, 
  ArrowRight, 
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { BriefingProblem, ProblemSeverity } from '../../types/dailyBriefing';

interface ProblemsDetectedSectionProps {
  problems: BriefingProblem[];
  onUpdateStatus?: (problemId: string, status: 'detected' | 'in_progress' | 'mitigated' | 'dismissed') => void;
  onNavigateToModule?: (category: string, entityId: string) => void;
}

export const ProblemsDetectedSection: React.FC<ProblemsDetectedSectionProps> = ({
  problems,
  onUpdateStatus,
  onNavigateToModule,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filteredProblems = filterSeverity === 'ALL' 
    ? problems 
    : problems.filter(p => p.severity === filterSeverity);

  const getSeverityBadge = (sev: ProblemSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'HIGH':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'LOW':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'GPS': return <Radio className="w-4 h-4 text-indigo-600" />;
      case 'FUEL': return <Fuel className="w-4 h-4 text-amber-600" />;
      case 'MAINTENANCE': return <Wrench className="w-4 h-4 text-rose-600" />;
      case 'DRIVER': return <UserCheck className="w-4 h-4 text-emerald-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Section Header */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              Daftar Masalah Terdeteksi (Grounded AI Engine)
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-100 text-red-700">
                {problems.length} Isu
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Anomali operasional divalidasi dari telemetri real-time, log GPS Supabase, dan rekonsiliasi biaya
            </p>
          </div>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl text-xs font-medium">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map(s => (
            <button
              key={s}
              onClick={() => setFilterSeverity(s)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterSeverity === s 
                  ? 'bg-white text-slate-900 font-bold shadow-2xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Problems List Grid */}
      <div className="divide-y divide-slate-100">
        {filteredProblems.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            Tidak ada masalah pada filter tingkat keparahan ini.
          </div>
        ) : (
          filteredProblems.map(prob => (
            <div key={prob.id} className="p-5 sm:p-6 hover:bg-slate-50/60 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="space-y-2 flex-1">
                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${getSeverityBadge(prob.severity)}`}>
                      {prob.severity}
                    </span>
                    
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                      {getCategoryIcon(prob.category)}
                      {prob.category}
                    </span>

                    <span className="text-xs text-slate-500 font-mono">
                      {prob.id}
                    </span>

                    <span className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                      prob.status === 'mitigated' ? 'bg-emerald-100 text-emerald-800' :
                      prob.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      Status: {prob.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {prob.title}
                  </h3>

                  {/* Evidence Box */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-xs text-slate-600 flex items-start gap-2">
                    <span className="font-semibold text-slate-800 shrink-0">Bukti Telemetri:</span>
                    <span>{prob.evidence}</span>
                  </div>

                  {/* Affected Entity & Recommendation */}
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 pt-1">
                    <div>
                      <span className="font-medium text-slate-700">Entitas Terdampak: </span>
                      <span className="font-semibold text-indigo-700">{prob.entityName}</span>
                    </div>
                    <div>
                      <span className="font-medium text-slate-700">Rekomendasi Aksi: </span>
                      <span className="text-slate-800">{prob.recommendedAction}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex sm:flex-row lg:flex-col items-center sm:justify-end gap-2 shrink-0 pt-2 lg:pt-0">
                  <button
                    onClick={() => {
                      if (onUpdateStatus) {
                        onUpdateStatus(prob.id, prob.status === 'mitigated' ? 'detected' : 'mitigated');
                      }
                    }}
                    className={`w-full sm:w-auto px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                      prob.status === 'mitigated'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {prob.status === 'mitigated' ? 'Telah Dimitigasi' : 'Tandai Selesai'}
                  </button>

                  <button
                    onClick={() => {
                      if (onNavigateToModule) {
                        onNavigateToModule(prob.category.toLowerCase(), prob.entityId);
                      }
                    }}
                    className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    Tindak Lanjut
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
