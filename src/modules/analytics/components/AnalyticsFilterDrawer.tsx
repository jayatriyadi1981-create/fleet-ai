/**
 * Fleet Intelligence Smart AI - Global Analytics Filter Drawer
 * PROMPT 36
 */

import React, { useState } from 'react';
import { X, RotateCcw, Check, Bookmark, Calendar, Building2, Truck, Users, MapPin, Layers } from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';
import { DateRangePreset, PeriodComparisonMode } from '../types';

export const AnalyticsFilterDrawer: React.FC = () => {
  const {
    isFilterDrawerOpen,
    setIsFilterDrawerOpen,
    filter,
    setFilter,
    resetFilter,
    savedPresets,
    saveFilterPreset,
    applyPreset,
    branchMatrices,
    vehicles,
    driverProductivity,
  } = useAnalytics();

  const [presetNameInput, setPresetNameInput] = useState('');
  const [isSavingPreset, setIsSavingPreset] = useState(false);

  if (!isFilterDrawerOpen) return null;

  const handleBranchToggle = (branchId: string) => {
    setFilter((prev) => {
      const exists = prev.branchIds.includes(branchId);
      return {
        ...prev,
        branchIds: exists ? prev.branchIds.filter((id) => id !== branchId) : [...prev.branchIds, branchId],
      };
    });
  };

  const handleSavePreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!presetNameInput.trim()) return;
    saveFilterPreset(presetNameInput.trim());
    setPresetNameInput('');
    setIsSavingPreset(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm transition-opacity">
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 text-slate-200 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg bg-cyan-500/10 p-2 text-cyan-400 border border-cyan-500/20">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Filter Analitik Global</h2>
                <p className="text-xs text-slate-400">Sesuaikan dimensi data dan rentang komparasi</p>
              </div>
            </div>
            <button
              onClick={() => setIsFilterDrawerOpen(false)}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Presets */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Filter Tersimpan (Presets)</span>
                <button
                  onClick={() => setIsSavingPreset(!isSavingPreset)}
                  className="text-cyan-400 hover:underline text-[11px] font-normal flex items-center gap-1"
                >
                  <Bookmark className="h-3 w-3" />
                  <span>Simpan Saat Ini</span>
                </button>
              </label>

              {isSavingPreset && (
                <form onSubmit={handleSavePreset} className="flex gap-2 pt-1 pb-2">
                  <input
                    type="text"
                    value={presetNameInput}
                    onChange={(e) => setPresetNameInput(e.target.value)}
                    placeholder="Nama preset..."
                    className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-400"
                  >
                    Simpan
                  </button>
                </form>
              )}

              <div className="flex flex-wrap gap-1.5">
                {savedPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset.id)}
                    className="rounded-lg border border-slate-800 bg-slate-800/60 px-2.5 py-1 text-xs text-slate-300 hover:border-cyan-500/40 hover:text-white transition-all"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range & Period Comparison */}
            <div className="space-y-3 border-t border-slate-800/80 pt-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                <span>Rentang Waktu & Periode</span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Tanggal Mulai</span>
                  <input
                    type="date"
                    value={filter.startDate}
                    onChange={(e) => setFilter((prev) => ({ ...prev, startDate: e.target.value, datePreset: 'custom' }))}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Tanggal Akhir</span>
                  <input
                    type="date"
                    value={filter.endDate}
                    onChange={(e) => setFilter((prev) => ({ ...prev, endDate: e.target.value, datePreset: 'custom' }))}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block mb-1">Mode Komparasi Periode</span>
                <select
                  value={filter.comparisonMode}
                  onChange={(e) => setFilter((prev) => ({ ...prev, comparisonMode: e.target.value as PeriodComparisonMode }))}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="previous_period">Periode Sebelumnya (Previous Period)</option>
                  <option value="same_period_last_month">Periode Sama Bulan Lalu (Last Month)</option>
                  <option value="same_period_last_year">Periode Sama Tahun Lalu (Last Year)</option>
                </select>
              </div>
            </div>

            {/* Branch Multi-select */}
            <div className="space-y-3 border-t border-slate-800/80 pt-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Cabang / Depo Armada ({filter.branchIds.length || 'Semua'})</span>
                </span>
                {filter.branchIds.length > 0 && (
                  <button
                    onClick={() => setFilter((prev) => ({ ...prev, branchIds: [] }))}
                    className="text-[10px] text-slate-400 hover:text-cyan-400"
                  >
                    Reset Cabang
                  </button>
                )}
              </label>

              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {branchMatrices.map((branch) => {
                  const isChecked = filter.branchIds.includes(branch.branchId);
                  return (
                    <button
                      key={branch.branchId}
                      onClick={() => handleBranchToggle(branch.branchId)}
                      className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs transition-all ${
                        isChecked
                          ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                          : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="font-medium">{branch.branchName}</span>
                      <span className="text-[10px] text-slate-400">{branch.totalVehicles} Unit</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Vehicle Type Filter */}
            <div className="space-y-3 border-t border-slate-800/80 pt-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-cyan-400" />
                <span>Tipe Kendaraan</span>
              </label>

              <select
                value={filter.vehicleTypes[0] || ''}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    vehicleTypes: e.target.value ? [e.target.value] : [],
                  }))
                }
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="">Semua Tipe Kendaraan</option>
                <option value="Heavy Truck">Heavy Truck (Tronton / Wingbox / Dump)</option>
                <option value="Light Truck">Light Truck (Box / Bak Terbuka)</option>
                <option value="Tractor Head">Tractor Head (Trailer 40ft)</option>
                <option value="Pick Up">Light Commercial (Pick Up / Blind Van)</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-slate-800 p-4 bg-slate-950 flex items-center justify-between gap-3">
            <button
              onClick={resetFilter}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={() => setIsFilterDrawerOpen(false)}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20"
            >
              <Check className="h-4 w-4" />
              <span>Terapkan Filter</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
