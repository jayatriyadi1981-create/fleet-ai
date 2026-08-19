/**
 * Fleet Intelligence Smart AI - Fuel Rules Tab
 * PROMPT 24 - Detection Policy Configuration, Thresholds & Audit History
 */

import React from 'react';
import { Settings, ShieldAlert, Edit, CheckCircle2 } from 'lucide-react';
import { FuelRule } from '../../types';

interface RulesTabProps {
  rules: FuelRule[];
  onOpenEditRuleModal: (rule: FuelRule) => void;
}

export const RulesTab: React.FC<RulesTabProps> = ({ rules, onOpenEditRuleModal }) => {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Settings className="h-4 w-4 text-cyan-400" /> Pengaturan Parameter & Ambang Batas Anomali BBM
            </h3>
            <p className="text-xs text-slate-400">
              Konfigurasi ambang batas alarm low fuel, kecurigaan fuel drain, dan histori versi kebijakan.
            </p>
          </div>
        </div>

        {rules.map((rule) => (
          <div key={rule.id} className="p-5 rounded-xl border border-slate-800 bg-slate-950 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <h4 className="font-bold text-white text-sm">{rule.ruleName}</h4>
                <p className="text-xs text-slate-400">{rule.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-bold">
                  Versi: {rule.version}
                </span>
                <button
                  onClick={() => onOpenEditRuleModal(rule)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1"
                >
                  <Edit className="h-3.5 w-3.5" /> Edit Rule
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Ambang Low Fuel</span>
                <span className="font-bold text-amber-400 text-sm">{rule.lowFuelThresholdPct}%</span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Ambang Critical Fuel</span>
                <span className="font-bold text-rose-400 text-sm">{rule.criticalFuelThresholdPct}%</span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Min. Volume Fuel Drain</span>
                <span className="font-bold text-white text-sm">{rule.minDrainVolumeLiters} Liter</span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Batas Cost/KM</span>
                <span className="font-bold text-cyan-300 text-sm">Rp {rule.costPerKmThreshold}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl text-[11px] text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Terakhir Diperbarui Oleh: <strong className="text-slate-200">{rule.changedBy}</strong></span>
                <span>Tanggal Berlaku: <strong className="text-slate-200">{rule.effectiveDate}</strong></span>
              </div>
              <p>Alasan Perubahan: {rule.changeReason}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
