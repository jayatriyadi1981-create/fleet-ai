/**
 * Fleet Intelligence Smart AI - Fatigue Rule Configuration Modal
 * PROMPT 23 - Rule Versioning & Policy Management
 */

import React, { useState } from 'react';
import { X, Sliders, Save, FileText, CheckCircle2 } from 'lucide-react';
import { FatigueRule } from '../../types';

interface RuleEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  rule: FatigueRule;
  onSaveRule: (updatedRule: FatigueRule) => void;
}

export const RuleEditModal: React.FC<RuleEditModalProps> = ({
  isOpen,
  onClose,
  rule,
  onSaveRule,
}) => {
  const [ruleName, setRuleName] = useState(rule.ruleName);
  const [description, setDescription] = useState(rule.description);
  const [maxContinuousDriving, setMaxContinuousDriving] = useState(rule.maxContinuousDrivingHours);
  const [minRequiredRest, setMinRequiredRest] = useState(rule.minRequiredRestHours);
  const [nightStart, setNightStart] = useState(rule.nightStart);
  const [nightEnd, setNightEnd] = useState(rule.nightEnd);
  const [policySource, setPolicySource] = useState(rule.policySource);
  const [policyName, setPolicyName] = useState(rule.policyName);
  const [changeReason, setChangeReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const verNum = (parseFloat(rule.version.replace('v', '')) + 0.1).toFixed(1);
    const updated: FatigueRule = {
      ...rule,
      ruleName,
      description,
      maxContinuousDrivingHours: maxContinuousDriving,
      minRequiredRestHours: minRequiredRest,
      nightStart,
      nightEnd,
      policySource,
      policyName,
      version: `v${verNum}`,
      effectiveDate: new Date().toISOString().split('T')[0],
      changedBy: 'Current User (Safety Officer)',
      changeReason: changeReason || 'Pembaruan ambang batas operasional K3',
    };
    onSaveRule(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 my-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Konfigurasi Fatigue Rule Engine</h2>
              <p className="text-xs text-slate-400">Rule Version {rule.version} • Effective: {rule.effectiveDate}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Nama Kebijakan Rule:</label>
            <input
              type="text"
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Max Continuous Driving (Jam):</label>
              <input
                type="number"
                step="0.1"
                value={maxContinuousDriving}
                onChange={(e) => setMaxContinuousDriving(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Syarat Min Istirahat (Jam):</label>
              <input
                type="number"
                step="0.5"
                value={minRequiredRest}
                onChange={(e) => setMinRequiredRest(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Awal Window Malam:</label>
              <input
                type="time"
                value={nightStart}
                onChange={(e) => setNightStart(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Akhir Window Malam:</label>
              <input
                type="time"
                value={nightEnd}
                onChange={(e) => setNightEnd(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Sumber Regulasi / Kebijakan (Policy Source):</label>
            <input
              type="text"
              value={policySource}
              onChange={(e) => setPolicySource(e.target.value)}
              placeholder="Misal: 'Permenhub PM 60 / Standard K3 Perusahaan'..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Alasan Perubahan Versi (Rule Version Audit):</label>
            <textarea
              rows={2}
              value={changeReason}
              onChange={(e) => setChangeReason(e.target.value)}
              placeholder="Jelaskan alasan perubahan versi ini untuk audit log..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400">
            Pembaruan aturan ini akan menaikkan versi menjadi <strong>v{(parseFloat(rule.version.replace('v', '')) + 0.1).toFixed(1)}</strong> dan secara otomatis dicatat dalam Audit Log Kebijakan Keselamatan.
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-colors"
            >
              <Save className="w-4 h-4" />
              Simpan & Terbitkan Versi Baru
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
