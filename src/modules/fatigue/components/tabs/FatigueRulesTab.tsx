/**
 * Fleet Intelligence Smart AI - Fatigue Rules & Policy Management Tab
 * PROMPT 23 - Fatigue Rules (/app/fatigue/rules)
 */

import React from 'react';
import { Sliders, FileText, Edit, ShieldCheck, Clock, CheckCircle2, History } from 'lucide-react';
import { FatigueRule } from '../../types';

interface FatigueRulesTabProps {
  rules: FatigueRule[];
  onOpenRuleModal: (rule: FatigueRule) => void;
}

export const FatigueRulesTab: React.FC<FatigueRulesTabProps> = ({ rules, onOpenRuleModal }) => {
  const activeRule = rules.find((r) => r.active) || rules[0];

  const auditLogs = [
    { action: 'fatigue.rule.updated', version: 'v1.4', changedBy: activeRule.changedBy, date: '15 Agu 2026', reason: activeRule.changeReason },
    { action: 'fatigue.rule.activated', version: 'v1.4', changedBy: 'System Engine', date: '01 Agu 2026', reason: 'Aktivasi kebijakan keselamatan resmi PM 60' },
    { action: 'fatigue.rule.created', version: 'v1.0', changedBy: 'Super Admin', date: '10 Jan 2026', reason: 'Inisialisasi modul fatigue management' },
  ];

  return (
    <div className="space-y-6">
      {/* Active Rule Configuration Banner */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{activeRule.ruleName}</h3>
                <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                  {activeRule.version} ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{activeRule.description}</p>
            </div>
          </div>

          <button
            onClick={() => onOpenRuleModal(activeRule)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-colors flex-shrink-0"
          >
            <Edit className="w-4 h-4" />
            Edit Rule Thresholds
          </button>
        </div>

        {/* Threshold Parameters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[11px] text-slate-400 block">Max Continuous Driving</span>
            <span className="text-base font-bold text-white">{activeRule.maxContinuousDrivingHours} jam</span>
            <span className="text-[10px] text-slate-500 block">Critical Threshold: {activeRule.criticalDrivingThresholdHours}h</span>
          </div>

          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[11px] text-slate-400 block">Min Required Rest</span>
            <span className="text-base font-bold text-emerald-400">{activeRule.minRequiredRestHours} jam</span>
            <span className="text-[10px] text-slate-500 block">Sebelum penugasan shift</span>
          </div>

          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[11px] text-slate-400 block">Window Jam Malam</span>
            <span className="text-base font-bold text-indigo-400">{activeRule.nightStart} - {activeRule.nightEnd} WIB</span>
            <span className="text-[10px] text-slate-500 block">Timezone: {activeRule.timezone}</span>
          </div>

          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[11px] text-slate-400 block">Max Shift Duration</span>
            <span className="text-base font-bold text-amber-400">{activeRule.maxShiftHours} jam</span>
            <span className="text-[10px] text-slate-500 block">Jam kerja shift maksimal</span>
          </div>
        </div>

        <div className="pt-2 text-xs text-slate-400 flex items-center justify-between">
          <span>Policy Source: <strong>{activeRule.policySource}</strong></span>
          <span>Jurisdiction: <strong>{activeRule.jurisdiction}</strong></span>
        </div>
      </div>

      {/* Rule Version Audit Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <History className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">Rule Versioning & Audit Log</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Aksi Audit Log</th>
                <th className="p-3">Versi</th>
                <th className="p-3">Tanggal Efektif</th>
                <th className="p-3">Diubah Oleh</th>
                <th className="p-3">Alasan Perubahan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {auditLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-800/50">
                  <td className="p-3 font-semibold text-cyan-400">{log.action}</td>
                  <td className="p-3 font-bold text-white">{log.version}</td>
                  <td className="p-3 text-slate-400">{log.date}</td>
                  <td className="p-3 text-slate-300">{log.changedBy}</td>
                  <td className="p-3 text-slate-400">{log.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
