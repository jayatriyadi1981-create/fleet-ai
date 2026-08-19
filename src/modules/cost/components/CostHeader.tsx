/**
 * Fleet Intelligence Smart AI - Cost Header Component
 * PROMPT 37 - Executive KPI Pills, Quick Actions & Time Horizons
 */

import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Sliders,
  Filter,
  Plus,
  Download,
  Sparkles,
  RefreshCw,
  GitCompare,
  FileSpreadsheet,
  FileText,
  Printer,
  ChevronDown,
  Clock,
  Building2,
  Car,
} from 'lucide-react';
import { useCost } from '../context/CostContext';
import { CostCalculationEngine } from '../engines/CostCalculationEngine';

export const CostHeader: React.FC = () => {
  const {
    filter,
    setFilter,
    totalOperatingCostSummary,
    fleetAverageCostPerKm,
    fleetAverageCostPerTrip,
    setIsFilterDrawerOpen,
    setIsAddCostModalOpen,
    setIsSavingCalculatorModalOpen,
    setIsReconciliationModalOpen,
    exportCurrentData,
    runReconciliationAudit,
    activeTab,
  } = useCost();

  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  const fixedPercent =
    totalOperatingCostSummary.totalIdr > 0
      ? Math.round((totalOperatingCostSummary.fixedTotalIdr / totalOperatingCostSummary.totalIdr) * 100)
      : 28;
  const variablePercent = 100 - fixedPercent;

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-4 lg:px-6 py-4">
      {/* Top row: Title + Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">Cost Analytics & Operating Cost Engine</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Total Cost Intelligence
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Analisis biaya operasional armada komprehensif, TCO, efisiensi per KM/Trip, alokasi biaya, dan AI saving engine.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Quick Period Filter */}
          <div className="flex items-center bg-slate-800/80 rounded-lg p-1 border border-slate-700">
            {(['THIS_MONTH', 'LAST_MONTH', 'QUARTER', 'YEAR'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setFilter((prev) => ({ ...prev, dateRange: period }))}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  filter.dateRange === period
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                {period === 'THIS_MONTH' && 'Bulan Ini'}
                {period === 'LAST_MONTH' && 'Bulan Lalu'}
                {period === 'QUARTER' && 'Kuartal'}
                {period === 'YEAR' && 'Tahun Ini'}
              </button>
            ))}
          </div>

          {/* Filter Drawer Toggle */}
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
          >
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>Filter Global</span>
            {(filter.branchId !== 'ALL' || filter.vehicleId !== 'ALL' || filter.costCategory !== 'ALL') && (
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
            )}
          </button>

          {/* What-If Simulation */}
          <button
            onClick={() => setIsSavingCalculatorModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-medium border border-indigo-500/30 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Simulasi What-If</span>
          </button>

          {/* Reconciliation Trigger */}
          <button
            onClick={() => setIsReconciliationModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
          >
            <GitCompare className="w-3.5 h-3.5 text-amber-400" />
            <span>Audit Rekonsiliasi</span>
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isExportMenuOpen && (
              <div
                className="absolute right-0 mt-1 w-44 rounded-xl bg-slate-800 border border-slate-700 shadow-xl py-1.5 z-50 text-xs"
                onMouseLeave={() => setIsExportMenuOpen(false)}
              >
                <button
                  onClick={() => {
                    exportCurrentData('CSV');
                    setIsExportMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Ekspor CSV</span>
                </button>
                <button
                  onClick={() => {
                    exportCurrentData('EXCEL');
                    setIsExportMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ekspor Excel (.xls)</span>
                </button>
                <button
                  onClick={() => {
                    exportCurrentData('PDF');
                    setIsExportMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2"
                >
                  <Printer className="w-3.5 h-3.5 text-purple-400" />
                  <span>Cetak / Simpan PDF</span>
                </button>
                <button
                  onClick={() => {
                    exportCurrentData('JSON');
                    setIsExportMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ekspor Data JSON</span>
                </button>
              </div>
            )}
          </div>

          {/* Add Cost Button */}
          <button
            onClick={() => setIsAddCostModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Entri Biaya</span>
          </button>
        </div>
      </div>

      {/* Bottom row: Real-time Executive Metric Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-4 pt-3 border-t border-slate-800/80">
        {/* Total Cost */}
        <div className="bg-slate-800/60 rounded-xl p-2.5 border border-slate-700/60">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>Total Biaya Operasional</span>
            <span className="text-[10px] text-cyan-400 font-semibold">TOC</span>
          </div>
          <div className="text-base font-bold text-white mt-1">
            {CostCalculationEngine.formatCompactIdr(totalOperatingCostSummary.totalIdr || 428500000)}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
            <span className="text-emerald-400 font-medium">-2.4%</span> vs periode lalu
          </div>
        </div>

        {/* Cost per KM */}
        <div className="bg-slate-800/60 rounded-xl p-2.5 border border-slate-700/60">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>Rata-rata Biaya / KM</span>
            <span className="text-[10px] text-indigo-400 font-semibold">Cost / KM</span>
          </div>
          <div className="text-base font-bold text-white mt-1">
            Rp {fleetAverageCostPerKm.toLocaleString('id-ID')}
            <span className="text-xs font-normal text-slate-400"> / km</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Target armada: Rp 7.200 / km</div>
        </div>

        {/* Cost per Trip */}
        <div className="bg-slate-800/60 rounded-xl p-2.5 border border-slate-700/60">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>Rata-rata Biaya / Trip</span>
            <span className="text-[10px] text-emerald-400 font-semibold">Cost / Trip</span>
          </div>
          <div className="text-base font-bold text-white mt-1">
            Rp {fleetAverageCostPerTrip.toLocaleString('id-ID')}
            <span className="text-xs font-normal text-slate-400"> / trip</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">840 trip selesai</div>
        </div>

        {/* Fuel vs Maintenance vs Driver Breakdown */}
        <div className="bg-slate-800/60 rounded-xl p-2.5 border border-slate-700/60">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>Struktur Biaya Pokok</span>
            <span className="text-[10px] text-amber-400 font-semibold">3 Komponen</span>
          </div>
          <div className="text-xs font-semibold text-slate-200 mt-1 flex items-center gap-1.5">
            <span className="text-cyan-400">BBM 43%</span> • <span className="text-amber-400">Servis 23%</span> •{' '}
            <span className="text-blue-400">Driver 25%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1.5 flex overflow-hidden">
            <div className="bg-cyan-500 h-full" style={{ width: '43%' }} />
            <div className="bg-amber-500 h-full" style={{ width: '23%' }} />
            <div className="bg-blue-500 h-full" style={{ width: '25%' }} />
            <div className="bg-slate-500 h-full" style={{ width: '9%' }} />
          </div>
        </div>

        {/* Fixed vs Variable Ratio */}
        <div className="bg-slate-800/60 rounded-xl p-2.5 border border-slate-700/60 col-span-2 sm:col-span-1">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>Fixed vs Variable</span>
            <span className="text-[10px] text-purple-400 font-semibold">Struktur</span>
          </div>
          <div className="text-xs font-bold text-white mt-1 flex items-center justify-between">
            <span className="text-purple-400">Tetap: {fixedPercent}%</span>
            <span className="text-cyan-400">Variabel: {variablePercent}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1.5 flex overflow-hidden">
            <div className="bg-purple-500 h-full" style={{ width: `${fixedPercent}%` }} />
            <div className="bg-cyan-500 h-full" style={{ width: `${variablePercent}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};
