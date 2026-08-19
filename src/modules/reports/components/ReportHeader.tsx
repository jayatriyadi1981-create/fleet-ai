/**
 * Fleet Intelligence Smart AI - Report Center Header Component
 * PROMPT 39 - Global Navigation, Quick Reports, One-Click Executive Action & Export Triggers
 */

import React, { useState } from 'react';
import { useReports, ReportTab } from '../context/ReportContext';
import {
  FileText,
  Sparkles,
  Zap,
  Download,
  Printer,
  Calendar,
  Share2,
  GitCompare,
  Plus,
  Layers,
  Clock,
  Archive,
  History,
  Settings,
  ChevronDown,
  LayoutDashboard,
  Eye,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { ReportDomainType, ReportSubType } from '../types';

export const ReportHeader: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    runQuickReport,
    runOneClickExecutiveReport,
    exportActiveReport,
    isExporting,
    exportProgress,
    setIsShareModalOpen,
    setIsCompareModalOpen,
    activeDataset,
  } = useReports();

  const [isQuickDropdownOpen, setIsQuickDropdownOpen] = useState(false);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);

  const navTabs: { id: ReportTab; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'all', label: 'All Reports', icon: Layers },
    { id: 'builder', label: 'Report Builder', icon: Sliders },
    { id: 'viewer', label: 'Report Viewer', icon: Eye },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'scheduled', label: 'Scheduled', icon: Clock },
    { id: 'generated', label: 'Generated Files', icon: Archive },
    { id: 'history', label: 'History & Audit', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const quickReportsList: { domain: ReportDomainType; subType: ReportSubType; label: string; desc: string }[] = [
    { domain: 'EXECUTIVE', subType: 'EXECUTIVE_MONTHLY', label: 'Executive Board Briefing', desc: 'Ringkasan bulanan TOC, utilisasi & AI' },
    { domain: 'COST', subType: 'COST_OPERATING', label: 'Total Operating Cost (TOC)', desc: 'Laporan biaya & Cost/KM seluruh armada' },
    { domain: 'FUEL', subType: 'FUEL_ANOMALY', label: 'Audit Anomali Solar & BBM', desc: 'Deteksi boros, idle berlebih & siphon' },
    { domain: 'DRIVER', subType: 'DRIVER_PERFORMANCE', label: 'Driver Scorecard & Safety', desc: 'Evaluasi perilaku & overspeed driver' },
    { domain: 'MAINTENANCE', subType: 'MAINTENANCE_COST', label: 'Biaya Servis & Work Order', desc: 'Rekap bengkel, sparepart & KIR STNK' },
    { domain: 'GPS', subType: 'GPS_MILEAGE', label: 'Jarak Tempuh & Odometer GPS', desc: 'Log kilometer, jam kerja & idle telemetri' },
    { domain: 'FLEET', subType: 'FLEET_SUMMARY', label: 'Ringkasan Kesiapan Armada', desc: 'Utilisasi, unit aktif & availability' },
    { domain: 'DELIVERY', subType: 'DELIVERY_SUMMARY', label: 'Distribusi & SLA Pengiriman', desc: 'Performa e-POD & ketepatan waktu' },
  ];

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl text-white shadow-lg shadow-cyan-500/20">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">Report Center & Enterprise Reporting Engine</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  PROMPT 39
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pusat pelaporan terpadu GPS, Armada, Driver, BBM, Servis, Safety, Biaya TOC/TCO & Intelijen AI
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Reports Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsQuickDropdownOpen(!isQuickDropdownOpen);
                setIsExportDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition"
            >
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              <span>Quick Reports</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {isQuickDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Laporan Instan 1-Klik</span>
                </div>
                {quickReportsList.map((qr, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      runQuickReport(qr.domain, qr.subType);
                      setIsQuickDropdownOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 transition flex flex-col gap-0.5 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white group-hover:text-cyan-400 transition">{qr.label}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">{qr.domain}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{qr.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* One-Click Executive Report Button */}
          <button
            onClick={runOneClickExecutiveReport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30 hover:from-amber-500/30 hover:to-orange-500/30 transition shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>1-Click Executive PDF</span>
          </button>

          {/* Compare Periods Button */}
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition"
          >
            <GitCompare className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Compare</span>
          </button>

          {/* Share Button */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition"
          >
            <Share2 className="h-3.5 w-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsExportDropdownOpen(!isExportDropdownOpen);
                setIsQuickDropdownOpen(false);
              }}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition shadow-lg shadow-cyan-600/20 disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Exporting ({exportProgress}%)...</span>
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5" />
                  <span>Export Report</span>
                  <ChevronDown className="h-3.5 w-3.5 text-cyan-200" />
                </>
              )}
            </button>

            {isExportDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 p-2 space-y-1">
                <button
                  onClick={() => {
                    exportActiveReport('PDF');
                    setIsExportDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-800 text-left transition"
                >
                  <Printer className="h-4 w-4 text-cyan-400" />
                  <div>
                    <div className="text-xs font-semibold text-white">Export PDF (Print Luxury)</div>
                    <div className="text-[10px] text-slate-400">Format resmi Direksi &amp; Auditor</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    exportActiveReport('EXCEL');
                    setIsExportDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-800 text-left transition"
                >
                  <Download className="h-4 w-4 text-emerald-400" />
                  <div>
                    <div className="text-xs font-semibold text-white">Export Excel (.XLS / XLSX)</div>
                    <div className="text-[10px] text-slate-400">Multi-sheet (KPI, Data, AI)</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    exportActiveReport('CSV');
                    setIsExportDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-800 text-left transition"
                >
                  <Download className="h-4 w-4 text-blue-400" />
                  <div>
                    <div className="text-xs font-semibold text-white">Export CSV (UTF-8)</div>
                    <div className="text-[10px] text-slate-400">Data mentah untuk BI &amp; database</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Create Report in Builder */}
          <button
            onClick={() => setActiveTab('builder')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-lg shadow-emerald-600/20"
          >
            <Plus className="h-4 w-4" />
            <span>Create Custom</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800 text-slate-400 text-xs no-scrollbar">
        {navTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold whitespace-nowrap transition ${
                isActive
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                  : 'hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.id === 'viewer' && activeDataset && (
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
