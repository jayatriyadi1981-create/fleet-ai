/**
 * Fleet Intelligence Smart AI - Cost Global Filter Drawer
 * PROMPT 37 - Multi-Dimension Filter Panel for Enterprise Cost Intelligence
 */

import React from 'react';
import { X, Filter, RotateCcw, Check } from 'lucide-react';
import { useCost } from '../../context/CostContext';
import { CostPeriodFilter, ComparisonPeriod, CostCategoryKey, CostType } from '../../types';

export const CostFilterDrawer: React.FC = () => {
  const {
    isFilterDrawerOpen,
    setIsFilterDrawerOpen,
    filter,
    setFilter,
    resetFilter,
    categories,
    branchCostMetrics,
  } = useCost();

  if (!isFilterDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Filter Analisis Biaya</h3>
          </div>
          <button
            onClick={() => setIsFilterDrawerOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Form Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Period Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Rentang Waktu</label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { key: 'TODAY', label: 'Hari Ini' },
                  { key: 'THIS_WEEK', label: 'Minggu Ini' },
                  { key: 'THIS_MONTH', label: 'Bulan Ini' },
                  { key: 'LAST_MONTH', label: 'Bulan Lalu' },
                  { key: 'QUARTER', label: 'Kuartal Ini' },
                  { key: 'YEAR', label: 'Tahun Ini' },
                ] as const
              ).map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setFilter((prev) => ({ ...prev, dateRange: p.key }))}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all text-left ${
                    filter.dateRange === p.key
                      ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400 font-semibold'
                      : 'bg-slate-800 border-slate-700/60 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Comparison Period */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Periode Pembanding</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFilter((prev) => ({ ...prev, comparisonPeriod: 'PREVIOUS_PERIOD' }))}
                className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                  filter.comparisonPeriod === 'PREVIOUS_PERIOD'
                    ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400 font-semibold'
                    : 'bg-slate-800 border-slate-700/60 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Periode Sebelumnya
              </button>
              <button
                type="button"
                onClick={() => setFilter((prev) => ({ ...prev, comparisonPeriod: 'SAME_PERIOD_LAST_YEAR' }))}
                className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                  filter.comparisonPeriod === 'SAME_PERIOD_LAST_YEAR'
                    ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400 font-semibold'
                    : 'bg-slate-800 border-slate-700/60 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Tahun Lalu (YoY)
              </button>
            </div>
          </div>

          {/* Branch Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Cabang / Depo</label>
            <select
              value={filter.branchId || 'ALL'}
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  branchId: e.target.value === 'ALL' ? undefined : e.target.value,
                }))
              }
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">Semua Cabang & Depo</option>
              {branchCostMetrics.map((b) => (
                <option key={b.branchId} value={b.branchId}>
                  {b.branchName}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Kategori Biaya</label>
            <select
              value={filter.costCategory || 'ALL'}
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  costCategory: e.target.value === 'ALL' ? undefined : (e.target.value as CostCategoryKey),
                }))
              }
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.key}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Cost Type Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Sifat Biaya (Cost Type)</label>
            <select
              value={filter.costType || 'ALL'}
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  costType: e.target.value === 'ALL' ? undefined : (e.target.value as CostType),
                }))
              }
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">Semua Sifat Biaya</option>
              <option value="FIXED">Fixed Costs (Biaya Tetap)</option>
              <option value="VARIABLE">Variable Costs (Biaya Variabel)</option>
              <option value="SEMI_VARIABLE">Semi-Variable Costs</option>
            </select>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={resetFilter}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            onClick={() => setIsFilterDrawerOpen(false)}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/20 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Terapkan Filter</span>
          </button>
        </div>
      </div>
    </div>
  );
};
