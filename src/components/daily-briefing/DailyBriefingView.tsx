/**
 * Fleet Intelligence Smart AI - Main Daily Briefing View Component (PROMPT 51)
 * Complete multi-role, AI-grounded daily fleet intelligence view
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Calendar, 
  RotateCw, 
  Download, 
  Share2, 
  Settings, 
  History, 
  FileSpreadsheet, 
  FileText, 
  Code, 
  MessageSquare, 
  Check, 
  ChevronDown,
  Building2,
  Clock,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { FleetDailyBriefing, BriefingViewMode } from '../../types/dailyBriefing';
import { AIDailyBriefingService } from '../../services/dailyBriefing/aiDailyBriefingService';
import { DailyBriefingRepository } from '../../services/dailyBriefing/dailyBriefingRepository';
import { DailyBriefingExportService } from '../../services/dailyBriefing/dailyBriefingExportService';

import { ExecutiveSummaryCard } from './ExecutiveSummaryCard';
import { ProblemsDetectedSection } from './ProblemsDetectedSection';
import { DomainIntelligenceTabs } from './DomainIntelligenceTabs';
import { ActionableRecommendationsSection } from './ActionableRecommendationsSection';
import { ComparisonTrendsWidget } from './ComparisonTrendsWidget';
import { BriefingScheduleConfigModal } from './BriefingScheduleConfigModal';
import { BriefingHistoryModal } from './BriefingHistoryModal';

interface DailyBriefingViewProps {
  tenantId?: string;
  onNavigateToModule?: (moduleKey: string) => void;
}

export const DailyBriefingView: React.FC<DailyBriefingViewProps> = ({
  tenantId = 'tenant-1',
  onNavigateToModule,
}) => {
  const [briefing, setBriefing] = useState<FleetDailyBriefing | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // Default to yesterday's date
    const d = new Date(Date.now() - 86400000);
    return d.toISOString().split('T')[0];
  });
  const [viewMode, setViewMode] = useState<BriefingViewMode>('all');
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);
  const [isCopiedWhatsApp, setIsCopiedWhatsApp] = useState<boolean>(false);

  // Modals
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);

  // Load briefing on mount or date change
  useEffect(() => {
    loadBriefingForDate(selectedDate);
  }, [selectedDate, tenantId]);

  const loadBriefingForDate = async (dateStr: string) => {
    setIsLoading(true);
    try {
      const data = await DailyBriefingRepository.getBriefingByDate(dateStr, tenantId);
      setBriefing(data);
    } catch (err) {
      console.error('Failed to load daily briefing:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!briefing) return;
    setIsRegenerating(true);
    try {
      const updated = await DailyBriefingRepository.regenerateBriefing(briefing.id, tenantId);
      setBriefing(updated);
    } catch (err) {
      console.error('Failed to regenerate briefing:', err);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleUpdateRecommendationStatus = (
    recId: string,
    newStatus: 'pending' | 'task_created' | 'scheduled' | 'dismissed' | 'approved'
  ) => {
    if (!briefing) return;
    DailyBriefingRepository.updateRecommendationStatus(briefing.id, recId, newStatus);
    setBriefing({
      ...briefing,
      recommendations: briefing.recommendations.map(r => 
        r.id === recId ? { ...r, actionStatus: newStatus } : r
      ),
    });
  };

  const handleUpdateProblemStatus = (
    probId: string,
    newStatus: 'detected' | 'in_progress' | 'mitigated' | 'dismissed'
  ) => {
    if (!briefing) return;
    DailyBriefingRepository.updateProblemStatus(briefing.id, probId, newStatus);
    setBriefing({
      ...briefing,
      problems: briefing.problems.map(p => 
        p.id === probId ? { ...p, status: newStatus } : p
      ),
    });
  };

  const handleCopyWhatsApp = async () => {
    if (!briefing) return;
    const ok = await DailyBriefingExportService.copyWhatsAppSummary(briefing);
    if (ok) {
      setIsCopiedWhatsApp(true);
      setTimeout(() => setIsCopiedWhatsApp(false), 2000);
    }
  };

  if (isLoading && !briefing) {
    return (
      <div className="p-8 sm:p-12 text-center text-slate-500 space-y-4">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <div className="text-sm font-bold text-slate-800">Menghasilkan AI Daily Briefing...</div>
        <p className="text-xs text-slate-400">
          Mengagregasi metrik telematika, postGIS GPS logs, efisiensi bahan bakar & estimasi risiko proaktif
        </p>
      </div>
    );
  }

  if (!briefing) return null;

  return (
    <div id="ai-daily-briefing-view" className="space-y-6 pb-12">
      {/* Top Action & Navigation Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
          {/* Left Title & Tenant Context */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                  AI Fleet Daily Briefing
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    {briefing.status}
                  </span>
                </h1>
                <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-1 font-medium text-slate-700">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {briefing.tenantName}
                  </span>
                  <span>•</span>
                  <span>Disusun pukul 06:00 WIB oleh Gemini AI Engine</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Controls: Date Picker, Regenerate, Export, Config, History */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Quick Date Presets */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 text-xs font-semibold">
              <button
                onClick={() => {
                  const y = new Date(Date.now() - 86400000).toISOString().split('T')[0];
                  setSelectedDate(y);
                }}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedDate === new Date(Date.now() - 86400000).toISOString().split('T')[0]
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Kemarin
              </button>

              <button
                onClick={() => {
                  const t = new Date().toISOString().split('T')[0];
                  setSelectedDate(t);
                }}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedDate === new Date().toISOString().split('T')[0]
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Hari Ini (Live)
              </button>
            </div>

            {/* Custom Date Input */}
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Regenerate Button */}
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
              title="Kalkulasi ulang metrik dan analisis AI"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
              {isRegenerating ? 'Menghitung...' : 'Regenerate'}
            </button>

            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                Ekspor
                <ChevronDown className="w-3 h-3" />
              </button>

              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150 text-xs">
                  <button
                    onClick={() => {
                      setShowExportMenu(false);
                      DailyBriefingExportService.printExecutiveReport();
                    }}
                    className="w-full px-3.5 py-2 text-left font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-rose-500" />
                    Cetak / Simpan PDF Eksekutif
                  </button>

                  <button
                    onClick={() => {
                      setShowExportMenu(false);
                      DailyBriefingExportService.exportToCsv(briefing);
                    }}
                    className="w-full px-3.5 py-2 text-left font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    Download CSV (Excel Ready)
                  </button>

                  <button
                    onClick={() => {
                      setShowExportMenu(false);
                      DailyBriefingExportService.exportToJson(briefing);
                    }}
                    className="w-full px-3.5 py-2 text-left font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Code className="w-4 h-4 text-blue-600" />
                    Download JSON Data
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={() => {
                      setShowExportMenu(false);
                      handleCopyWhatsApp();
                    }}
                    className="w-full px-3.5 py-2 text-left font-medium text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 font-bold"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    {isCopiedWhatsApp ? 'Tersalin ke Clipboard!' : 'Salin Format WhatsApp'}
                  </button>
                </div>
              )}
            </div>

            {/* Schedule Config */}
            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              title="Konfigurasi Jadwal 06:00 & Notifikasi"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* History */}
            <button
              onClick={() => setIsHistoryModalOpen(true)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              title="Arsip Riwayat Laporan Harian"
            >
              <History className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Role View Mode Filters */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <span className="text-slate-400 font-normal mr-1">Perspektif Peran:</span>
            {[
              { key: 'all', label: 'Semua Modul' },
              { key: 'executive', label: 'Eksekutif (C-Level)' },
              { key: 'fleet_manager', label: 'Fleet Manager' },
              { key: 'maintenance', label: 'Maintenance Lead' },
              { key: 'safety', label: 'Safety Officer' },
              { key: 'finance', label: 'Finance & BBM' },
            ].map(r => (
              <button
                key={r.key}
                onClick={() => setViewMode(r.key as BriefingViewMode)}
                className={`px-3 py-1 rounded-lg transition-all whitespace-nowrap ${
                  viewMode === r.key
                    ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400 font-mono shrink-0 hidden sm:block">
            Model: {briefing.aiModel} | Tokens: {briefing.aiTokensUsed}
          </div>
        </div>
      </div>

      {/* 1. Executive Summary & Health / Risk Scorecard */}
      <ExecutiveSummaryCard
        briefing={briefing}
        onNavigateToModule={onNavigateToModule}
      />

      {/* 2. Problems Detected (Grounded AI Engine) */}
      {(viewMode === 'all' || viewMode === 'fleet_manager' || viewMode === 'maintenance' || viewMode === 'safety') && (
        <ProblemsDetectedSection
          problems={briefing.problems}
          onUpdateStatus={handleUpdateProblemStatus}
          onNavigateToModule={(cat, entityId) => onNavigateToModule?.(cat)}
        />
      )}

      {/* 3. Deep Domain Intelligence Modules */}
      <DomainIntelligenceTabs
        briefing={briefing}
        onNavigateToModule={onNavigateToModule}
      />

      {/* 4. Actionable AI Recommendations */}
      <ActionableRecommendationsSection
        recommendations={briefing.recommendations}
        onUpdateStatus={handleUpdateRecommendationStatus}
        onNavigateToModule={onNavigateToModule}
      />

      {/* 5. Comparative Trends & Multi-Horizon Benchmarks */}
      <ComparisonTrendsWidget
        comparisons={briefing.comparisons}
        aiInsights={briefing.aiInsights}
      />

      {/* Modals */}
      <BriefingScheduleConfigModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        tenantId={tenantId}
      />

      <BriefingHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        tenantId={tenantId}
        onSelectBriefing={selected => {
          setBriefing(selected);
          setSelectedDate(selected.reportDate);
        }}
      />
    </div>
  );
};
