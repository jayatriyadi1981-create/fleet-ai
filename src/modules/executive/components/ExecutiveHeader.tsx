/**
 * Fleet Intelligence Smart AI - Executive Header Component
 * Multi-tenant selector, branch filtering, period picker, refresh, quick briefing, and Ask AI
 */

import React from 'react';
import { useExecutive } from '../context/ExecutiveContext';
import { useFleet } from '../../../context/FleetContext';
import { useAuth } from '../../../context/AuthContext';
import {
  Crown,
  Sparkles,
  Calendar,
  Building2,
  RefreshCw,
  Download,
  Printer,
  FileSpreadsheet,
  FileText,
  Sun,
  ShieldCheck,
} from 'lucide-react';
import { ExecutivePeriod } from '../types';

export const ExecutiveHeader: React.FC = () => {
  const {
    period,
    setPeriod,
    selectedBranchId,
    setSelectedBranchId,
    lastRefreshedAt,
    refreshData,
    setIsBriefingModalOpen,
    setIsAskAiModalOpen,
    handleExportCSV,
    handleExportExcel,
    setIsScoreConfigModalOpen,
  } = useExecutive();

  const { branches, currentTenant, setActiveView } = useFleet();
  const { user } = useAuth();

  const periodOptions: { id: ExecutivePeriod; label: string }[] = [
    { id: 'TODAY', label: 'Hari Ini' },
    { id: 'YESTERDAY', label: 'Kemarin' },
    { id: 'THIS_WEEK', label: 'Minggu Ini' },
    { id: 'THIS_MONTH', label: 'Bulan Ini' },
    { id: 'LAST_MONTH', label: 'Bulan Lalu' },
    { id: 'QUARTER', label: 'Kuartal Ini' },
    { id: 'YEAR', label: 'Tahun 2026' },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white px-4 lg:px-6 py-4 shadow-xl">
      {/* Top Banner with Company, Role, and Action Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-500/20 to-amber-600/30 border border-amber-500/40 rounded-xl shadow-inner">
              <Crown className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
                  Executive Dashboard
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 tracking-normal">
                    Owner & Director Intelligence
                  </span>
                </h1>
              </div>
              <p className="text-xs lg:text-sm text-slate-400 mt-0.5">
                Fleet business overview and AI-powered decision intelligence • <span className="text-slate-300 font-medium">{currentTenant?.name || 'PT Trans Nusantara Logistics'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Executive Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Morning Briefing Trigger */}
          <button
            id="exec-morning-briefing-btn"
            onClick={() => setIsBriefingModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition-all shadow-sm active:scale-95"
            title="Buka Briefing Pagi Eksekutif"
          >
            <Sun className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Daily Briefing</span>
          </button>

          {/* Ask AI Assistant Trigger */}
          <button
            id="exec-ask-ai-btn"
            onClick={() => setIsAskAiModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md transition-all active:scale-95 border border-blue-400/30"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Ask AI</span>
          </button>

          {/* Weight Config Button */}
          <button
            id="exec-weight-config-btn"
            onClick={() => setIsScoreConfigModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Atur Bobot Formula Skor Eksekutif"
          >
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span className="hidden md:inline">Bobot Skor</span>
          </button>

          {/* Export Dropdown / Buttons */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
            <button
              id="exec-export-csv-btn"
              onClick={handleExportCSV}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
              title="Ekspor CSV"
            >
              <FileText className="w-4 h-4 text-blue-400" />
            </button>
            <button
              id="exec-export-excel-btn"
              onClick={handleExportExcel}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
              title="Ekspor Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            </button>
            <button
              id="exec-print-preview-btn"
              onClick={() => setActiveView('executive_print')}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
              title="Cetak Laporan Resmi (Print Preview)"
            >
              <Printer className="w-4 h-4 text-purple-400" />
            </button>
          </div>

          {/* Refresh Data */}
          <button
            id="exec-refresh-btn"
            onClick={refreshData}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors"
            title={`Refresh Data (Terakhir: ${lastRefreshedAt})`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Toolbar: Branch Selector & Period Filter */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Branch Filter */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-700">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400 font-medium">Cabang:</span>
            <select
              id="exec-branch-select"
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-white">Semua Cabang (Nasional)</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id} className="bg-slate-900 text-white">
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Period Selector Tabs */}
          <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-lg border border-slate-700 overflow-x-auto">
            <Calendar className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
            {periodOptions.map((opt) => (
              <button
                key={opt.id}
                id={`exec-period-${opt.id.toLowerCase()}`}
                onClick={() => setPeriod(opt.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                  period === opt.id
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* User Scope and Last Refresh Indicator */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Data Real-Time Aggregated • Refreshed: <strong className="text-slate-300 font-semibold">{lastRefreshedAt} WIB</strong></span>
        </div>
      </div>
    </header>
  );
};
