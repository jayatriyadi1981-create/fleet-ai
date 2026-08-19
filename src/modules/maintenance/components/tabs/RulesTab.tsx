/**
 * Fleet Intelligence Smart AI - Maintenance Rules & Triggers Tab
 * PROMPT 25 - Configurable Maintenance Rules, Alerts & Audit Logs
 */

import React, { useState } from 'react';
import {
  Sliders,
  Save,
  CheckCircle2,
  AlertTriangle,
  History,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { MOCK_MAINTENANCE_RULES } from '../../data/mockMaintenanceData';
import { MaintenanceRule } from '../../types';

export const RulesTab: React.FC = () => {
  const [rules, setRules] = useState<MaintenanceRule[]>(MOCK_MAINTENANCE_RULES);
  const [isSaved, setIsSaved] = useState(false);

  const handleToggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  };

  const handleSaveRules = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sliders className="h-5 w-5 text-cyan-400" />
            Konfigurasi Aturan Pemicu Pemeliharaan (Trigger Rules)
          </h2>
          <p className="text-xs text-slate-400">
            Kustomisasi parameter ambang batas peringatan dini, interval servis berkala, dan toleransi jatuh tempo armada.
          </p>
        </div>

        <button
          onClick={handleSaveRules}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition-all"
        >
          {isSaved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          <span>{isSaved ? 'Aturan Tersimpan!' : 'Simpan Konfigurasi'}</span>
        </button>
      </div>

      {/* Rules List */}
      <div className="space-y-3">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`p-5 rounded-2xl border transition-all ${
              rule.active
                ? 'bg-slate-900/80 border-slate-800 shadow-xl'
                : 'bg-slate-950/40 border-slate-800/40 opacity-60'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">{rule.ruleName}</h3>
                  <span className="text-[10px] bg-slate-950 text-cyan-400 border border-slate-800 px-2 py-0.5 rounded font-mono">
                    v{rule.version}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{rule.description}</p>
                <div className="flex flex-wrap gap-4 text-[11px] text-cyan-300 font-mono pt-1">
                  <span>Interval: <strong>{rule.intervalKm.toLocaleString()} KM</strong> / <strong>{rule.intervalMonths} Bln</strong></span>
                  <span>Due Soon: <strong>{rule.dueSoonThresholdKm} KM</strong></span>
                  <span>Ubah Terakhir: <strong>{rule.changedBy}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rule.active}
                    onChange={() => handleToggleRule(rule.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
