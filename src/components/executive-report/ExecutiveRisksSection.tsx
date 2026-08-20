/**
 * Fleet Intelligence Smart AI - Executive Risks Section
 * PROMPT 52 — Items Requiring Management Attention & Corporate Risk Mitigation
 */

import React from 'react';
import { AlertOctagon, ShieldAlert, AlertTriangle, Clock, Calendar, Building, DollarSign, FileText, ChevronRight } from 'lucide-react';
import { ExecutiveRiskItem } from '../../types/executiveReport';

interface ExecutiveRisksSectionProps {
  risks: ExecutiveRiskItem[];
  onViewEvidence: (evidenceIds: string[], title: string) => void;
}

export const ExecutiveRisksSection: React.FC<ExecutiveRisksSectionProps> = ({
  risks,
  onViewEvidence,
}) => {
  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return {
          badge: 'bg-rose-950/80 border-rose-700 text-rose-300',
          border: 'border-rose-900/60 hover:border-rose-700',
          indicator: 'bg-rose-500',
        };
      case 'WARNING':
        return {
          badge: 'bg-amber-950/80 border-amber-700 text-amber-300',
          border: 'border-amber-900/60 hover:border-amber-700',
          indicator: 'bg-amber-500',
        };
      case 'WATCH':
        return {
          badge: 'bg-blue-950/80 border-blue-700 text-blue-300',
          border: 'border-blue-900/60 hover:border-blue-700',
          indicator: 'bg-blue-500',
        };
      default:
        return {
          badge: 'bg-slate-800 border-slate-700 text-slate-300',
          border: 'border-slate-800 hover:border-slate-700',
          indicator: 'bg-slate-500',
        };
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-700/60 text-rose-400">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>Items Requiring Management Attention (Risiko & Perhatian Manajemen)</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-950/80 border border-rose-800 text-rose-300">
                {risks.length} Isu Prioritas
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Identifikasi deviasi kritis yang berpotensi menimbulkan kerugian finansial atau disrupsi operasional
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {risks.map(risk => {
          const style = getSeverityStyle(risk.severity);

          return (
            <div
              key={risk.id}
              className={`bg-slate-950/60 border ${style.border} rounded-xl p-5 space-y-3.5 transition-all shadow-lg flex flex-col justify-between`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${style.indicator} animate-pulse`} />
                    <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                      {risk.category}
                    </span>
                  </div>
                  <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded border ${style.badge}`}>
                    {risk.severity}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-100">{risk.title}</h3>

                <p className="text-xs text-slate-300 leading-relaxed">{risk.businessImpact}</p>
              </div>

              {/* Exposure and Mitigation */}
              <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
                {risk.financialExposureEstimate && (
                  <div className="p-2.5 bg-rose-950/20 rounded-lg border border-rose-900/30 text-xs text-rose-200/90 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-rose-400 shrink-0" />
                    <span><strong>Potensi Eksposur Finansial:</strong> {risk.financialExposureEstimate}</span>
                  </div>
                )}

                <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 text-xs space-y-1">
                  <div className="font-semibold text-slate-300">Rencana Mitigasi (Mitigation Strategy):</div>
                  <p className="text-slate-400">{risk.mitigationStrategy}</p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-500" />
                    <span>PIC: {risk.ownerDepartment}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    <span>Target: {risk.targetResolutionDate}</span>
                  </div>
                </div>
              </div>

              {/* Evidence Trigger */}
              {risk.evidenceIds && risk.evidenceIds.length > 0 && (
                <div className="pt-2 border-t border-slate-800/60 flex justify-end">
                  <button
                    onClick={() => onViewEvidence(risk.evidenceIds, `Bukti Risiko: ${risk.title}`)}
                    className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Lihat Bukti Telematika ({risk.evidenceIds.length})</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
