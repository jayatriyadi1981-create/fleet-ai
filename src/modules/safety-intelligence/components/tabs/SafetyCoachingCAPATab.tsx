/**
 * Safety Coaching & CAPA Tab
 * PROMPT 33 Architecture
 */

import React, { useState } from 'react';
import { 
  UserCheck, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  BookOpen, 
  ShieldCheck,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { SafetyRecommendationEngine } from '../../engines/SafetyRecommendationEngine';
import { mockCorrectiveActions } from '../../../safety/data/mockSafetyData';

export const SafetyCoachingCAPATab: React.FC = () => {
  const coachingPlans = SafetyRecommendationEngine.getCoachingPlans();
  const capas = mockCorrectiveActions;
  const [activeSubTab, setActiveSubTab] = useState<'COACHING' | 'CAPA'>('COACHING');

  return (
    <div className="space-y-6">
      
      {/* Sub Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('COACHING')}
          className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all ${
            activeSubTab === 'COACHING'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Program Coaching Pengemudi Edukatif ({coachingPlans.length})
        </button>
        <button
          onClick={() => setActiveSubTab('CAPA')}
          className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all ${
            activeSubTab === 'CAPA'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Tindakan Korektif & Preventif (CAPA) ({capas.length})
        </button>
      </div>

      {activeSubTab === 'COACHING' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coachingPlans.map(plan => (
              <div
                key={plan.id}
                className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-white">{plan.driverName}</h4>
                    <span className="text-[11px] text-slate-400">Instruktur: {plan.assignedCoach}</span>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                    plan.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {plan.status}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 space-y-1 text-xs">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Tujuan Pembelajaran:</span>
                  <p className="text-slate-200">{plan.objective}</p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Topik Fokus:</span>
                  <ul className="space-y-1 pl-1">
                    {plan.recommendedTopics.map((top, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                        <span className="text-cyan-400">•</span> {top}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Target Evaluasi (30 Hari):</span>
                  <span className="text-emerald-300 font-mono font-medium">{plan.followUpMetric}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'CAPA' && (
        <div className="space-y-3">
          {capas.map(capa => (
            <div
              key={capa.id}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-white">{capa.actionNumber}</span>
                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase ${
                    capa.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    capa.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-slate-700 text-slate-300'
                  }`}>
                    {capa.priority}
                  </span>
                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase ${
                    capa.status === 'OVERDUE' ? 'bg-red-500/20 text-red-400' :
                    capa.status === 'IN_PROGRESS' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {capa.status}
                  </span>
                </div>
                <h5 className="font-bold text-xs text-slate-200">{capa.title}</h5>
                <p className="text-[11px] text-slate-400">{capa.description}</p>
                <div className="text-[10px] text-slate-500">
                  PIC: <strong className="text-slate-300">{capa.assignedToName}</strong> • Target Selesai: <strong className="text-slate-300">{capa.dueDate}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
