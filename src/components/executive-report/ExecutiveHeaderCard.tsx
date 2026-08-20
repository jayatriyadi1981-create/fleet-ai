/**
 * Fleet Intelligence Smart AI - Executive Header Card
 * PROMPT 52 — Executive Header with Multi-Period, Role Perspective, and Export Actions
 */

import React from 'react';
import { 
  Crown, 
  Calendar, 
  Filter, 
  RefreshCw, 
  Download, 
  Share2, 
  Clock, 
  Mail, 
  MessageSquare, 
  FileText, 
  Printer, 
  ShieldCheck, 
  Sparkles,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { ExecutiveReport, ExecutiveRolePerspective, ExecutivePeriodType } from '../../types/executiveReport';

interface ExecutiveHeaderCardProps {
  report: ExecutiveReport;
  selectedPerspective: ExecutiveRolePerspective;
  onPerspectiveChange: (p: ExecutiveRolePerspective) => void;
  selectedPeriodLabel: string;
  onPeriodChange: (label: string, type: ExecutivePeriodType) => void;
  comparisonMode: 'previous' | 'last_year' | 'target';
  onComparisonModeChange: (mode: 'previous' | 'last_year' | 'target') => void;
  isGenerating: boolean;
  onRegenerate: () => void;
  onOpenHistory: () => void;
  onOpenSchedule: () => void;
  onOpenShare: () => void;
  onOpenEmailModal: () => void;
  onDownloadCSV: () => void;
  onDownloadJSON: () => void;
  onPrintPreview: () => void;
  onCopyWhatsApp: () => void;
}

export const ExecutiveHeaderCard: React.FC<ExecutiveHeaderCardProps> = ({
  report,
  selectedPerspective,
  onPerspectiveChange,
  selectedPeriodLabel,
  onPeriodChange,
  comparisonMode,
  onComparisonModeChange,
  isGenerating,
  onRegenerate,
  onOpenHistory,
  onOpenSchedule,
  onOpenShare,
  onOpenEmailModal,
  onDownloadCSV,
  onDownloadJSON,
  onPrintPreview,
  onCopyWhatsApp,
}) => {
  const periodOptions = [
    { label: 'Agustus 2026 (Bulan Ini)', value: 'Agustus 2026', type: 'monthly' as ExecutivePeriodType },
    { label: 'Juli 2026', value: 'Juli 2026', type: 'monthly' as ExecutivePeriodType },
    { label: 'Juni 2026', value: 'Juni 2026', type: 'monthly' as ExecutivePeriodType },
    { label: 'Q3 2026 (Kuartal 3)', value: 'Q3 2026', type: 'quarterly' as ExecutivePeriodType },
    { label: 'Q2 2026 (Kuartal 2)', value: 'Q2 2026', type: 'quarterly' as ExecutivePeriodType },
    { label: 'Tahun 2026 (YTD)', value: 'Tahun 2026', type: 'yearly' as ExecutivePeriodType },
  ];

  const perspectiveOptions: { key: ExecutiveRolePerspective; label: string }[] = [
    { key: 'director_owner', label: 'Director / Owner (Overview Bisnis)' },
    { key: 'finance', label: 'Finance (Cost & Budget)' },
    { key: 'fleet_manager', label: 'Fleet & Operations' },
    { key: 'safety', label: 'Safety & Risk HSE' },
  ];

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/70 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-6">
      {/* Top Banner & Title */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              BOARD & DIRECTOR INTELLIGENCE
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-950/80 border border-cyan-800/40 text-cyan-300">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              AI Grounded (Zero Hallucination)
            </span>
            <span className="text-xs text-slate-400 font-mono bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
              Versi {report.version}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3">
            <span>AI Executive Fleet Report</span>
            <span className="text-slate-500 font-normal text-xl">|</span>
            <span className="text-xl sm:text-2xl font-semibold text-cyan-400">{report.companyName}</span>
          </h1>

          <p className="text-sm text-slate-400 max-w-3xl">
            Laporan strategis tingkat direksi yang mentranslasikan data telematika operasional menjadi evaluasi biaya, akar masalah (root cause), mitigasi risiko, dan proyeksi bisnis.
          </p>
        </div>

        {/* Executive Scorecard Score Pill */}
        <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800 p-4 rounded-xl shrink-0">
          <div className="text-right">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Fleet Health Index</div>
            <div className="text-2xl font-bold text-slate-100 mt-0.5">
              {report.scorecard.overallIndex} <span className="text-xs text-slate-400 font-normal">/ 100</span>
            </div>
            <div className="text-[11px] text-emerald-400 font-medium mt-0.5">Grade {report.scorecard.overallGrade} (Operasional Sehat)</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-cyan-900/30">
            {report.scorecard.overallGrade}
          </div>
        </div>
      </div>

      {/* Control Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
        {/* 1. Period Selector */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            Periode Laporan
          </label>
          <select
            value={selectedPeriodLabel}
            onChange={(e) => {
              const selected = periodOptions.find(p => p.value === e.target.value);
              if (selected) onPeriodChange(selected.value, selected.type);
            }}
            className="w-full bg-slate-950/90 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none cursor-pointer"
          >
            {periodOptions.map(p => (
              <option key={p.value} value={p.value} className="bg-slate-900 text-slate-200">
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Role Perspective */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            Perspektif Tampilan (RBAC)
          </label>
          <select
            value={selectedPerspective}
            onChange={(e) => onPerspectiveChange(e.target.value as ExecutiveRolePerspective)}
            className="w-full bg-slate-950/90 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none cursor-pointer"
          >
            {perspectiveOptions.map(opt => (
              <option key={opt.key} value={opt.key} className="bg-slate-900 text-slate-200">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Comparison Mode */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
            Pembanding Data
          </label>
          <div className="grid grid-cols-3 gap-1 bg-slate-950/90 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => onComparisonModeChange('previous')}
              className={`text-xs py-1.5 px-2 rounded font-medium transition-all ${
                comparisonMode === 'previous'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              MoM Lalu
            </button>
            <button
              onClick={() => onComparisonModeChange('last_year')}
              className={`text-xs py-1.5 px-2 rounded font-medium transition-all ${
                comparisonMode === 'last_year'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              YoY Tahun
            </button>
            <button
              onClick={() => onComparisonModeChange('target')}
              className={`text-xs py-1.5 px-2 rounded font-medium transition-all ${
                comparisonMode === 'target'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Target/Pagu
            </button>
          </div>
        </div>

        {/* 4. Action Buttons */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            Aksi AI Engine
          </label>
          <button
            onClick={onRegenerate}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-sm py-2 px-3 rounded-lg shadow-md transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Menganalisis...' : 'Regenerate Analysis'}</span>
          </button>
        </div>
      </div>

      {/* Export & Sharing Quick Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Tenant Isolation: <strong className="text-slate-200 font-medium">{report.tenantId}</strong></span>
          <span className="text-slate-600">•</span>
          <span>Timezone: <strong className="text-slate-200 font-medium">{report.timezone}</strong></span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onPrintPreview}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-all"
            title="Cetak format laporan resmi Board of Directors"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span>PDF Print Sheet</span>
          </button>

          <button
            onClick={onDownloadCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-all"
            title="Download Spreadsheet CSV/Excel"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Excel / CSV</span>
          </button>

          <button
            onClick={onCopyWhatsApp}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 rounded-lg transition-all"
            title="Salin ringkasan format WhatsApp untuk Direksi"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp Copy</span>
          </button>

          <button
            onClick={onOpenEmailModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-300 rounded-lg transition-all"
            title="Kirim template email eksekutif"
          >
            <Mail className="w-3.5 h-3.5 text-indigo-400" />
            <span>Email Report</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-all"
            title="Arsip riwayat laporan dan multi-versi"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Arsip Versi</span>
          </button>

          <button
            onClick={onOpenSchedule}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-all"
            title="Atur jadwal pengiriman otomatis bulanan"
          >
            <Calendar className="w-3.5 h-3.5 text-purple-400" />
            <span>Jadwal Dispatch</span>
          </button>

          <button
            onClick={onOpenShare}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 rounded-lg transition-all"
            title="Bagikan link laporan terenkripsi"
          >
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Share Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
