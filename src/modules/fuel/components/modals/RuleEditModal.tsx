/**
 * Fleet Intelligence Smart AI - Fuel Rule Edit Modal
 * PROMPT 24 - Configure Fuel Detection Rules & Thresholds
 */

import React, { useState } from 'react';
import { X, Settings, ShieldAlert } from 'lucide-react';
import { FuelRule } from '../../types';

interface RuleEditModalProps {
  rule: FuelRule;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedRule: FuelRule) => void;
}

export const RuleEditModal: React.FC<RuleEditModalProps> = ({
  rule,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<FuelRule>({ ...rule });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      version: `v${(parseFloat(formData.version.replace('v', '')) + 0.1).toFixed(1)}`,
      effectiveDate: new Date().toISOString().split('T')[0],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 text-slate-100 p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Edit Aturan Deteksi BBM & Fuel Drain</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Nama Aturan / Policy</label>
            <input
              type="text"
              value={formData.ruleName}
              onChange={(e) => setFormData({ ...formData, ruleName: e.target.value })}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Ambang Low Fuel (%)</label>
              <input
                type="number"
                value={formData.lowFuelThresholdPct}
                onChange={(e) => setFormData({ ...formData, lowFuelThresholdPct: parseInt(e.target.value) })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-amber-400 font-bold focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Ambang Critical Fuel (%)</label>
              <input
                type="number"
                value={formData.criticalFuelThresholdPct}
                onChange={(e) => setFormData({ ...formData, criticalFuelThresholdPct: parseInt(e.target.value) })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-rose-400 font-bold focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Minimal Volume Drain (Liter)</label>
              <input
                type="number"
                value={formData.minDrainVolumeLiters}
                onChange={(e) => setFormData({ ...formData, minDrainVolumeLiters: parseFloat(e.target.value) })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Jendela Waktu Penurunan (Menit)</label>
              <input
                type="number"
                value={formData.drainTimeWindowMinutes}
                onChange={(e) => setFormData({ ...formData, drainTimeWindowMinutes: parseInt(e.target.value) })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Toleransi Boros Konsumsi (%)</label>
              <input
                type="number"
                value={formData.consumptionTolerancePct}
                onChange={(e) => setFormData({ ...formData, consumptionTolerancePct: parseInt(e.target.value) })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Ambang Biaya Maks/KM (IDR)</label>
              <input
                type="number"
                value={formData.costPerKmThreshold}
                onChange={(e) => setFormData({ ...formData, costPerKmThreshold: parseInt(e.target.value) })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-cyan-300 font-bold focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Alasan Perubahan Kriteria</label>
            <input
              type="text"
              value={formData.changeReason}
              onChange={(e) => setFormData({ ...formData, changeReason: e.target.value })}
              placeholder="e.g. Penyesuaian musim puncaknya angkutan logistik"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
            >
              Simpan Rule Baru
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
