/**
 * Fleet Intelligence Smart AI - Main Audit & Activity Log View
 * PROMPT 49 - Enterprise Security, Compliance & Observability Module Hub
 */

import React, { useState, useEffect } from 'react';
import {
  Activity,
  Shield,
  GitCommit,
  Sparkles,
  Cpu,
  FileSpreadsheet,
  Settings,
  RefreshCw,
  Download,
  Lock,
  CheckCircle2,
  Sliders,
  Eye,
  Layers,
} from 'lucide-react';
import { auditService } from '../services/auditService';
import { AuditEvent, AuditFilter, AuditStatsSummary, AuditViewTab } from '../types/auditTypes';
import { AuditOverviewTab } from './AuditOverviewTab';
import { ActivityLogsTab } from './ActivityLogsTab';
import { SecurityLogsTab } from './SecurityLogsTab';
import { DataChangesTab } from './DataChangesTab';
import { AiActivityTab } from './AiActivityTab';
import { ExportHistoryTab } from './ExportHistoryTab';
import { AuditDetailDrawer } from './AuditDetailDrawer';
import { AuditTraceModal } from './AuditTraceModal';
import { AuditSettingsModal } from './AuditSettingsModal';

export const AuditMainView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AuditViewTab>('overview');
  const [tenantId] = useState<string>('tenant-1');
  const [filter, setFilter] = useState<AuditFilter>({});
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [stats, setStats] = useState<AuditStatsSummary>(() => auditService.getStatsSummary(tenantId));
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const [activeTraceCorrelationId, setActiveTraceCorrelationId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notificationBanner, setNotificationBanner] = useState<string | null>(null);

  const refreshData = () => {
    setIsRefreshing(true);
    const evts = auditService.getEvents(filter, tenantId);
    setEvents(evts);
    setStats(auditService.getStatsSummary(tenantId));
    setTimeout(() => setIsRefreshing(false), 300);
  };

  useEffect(() => {
    refreshData();
    const unsubscribe = auditService.subscribe(() => {
      refreshData();
    });
    return () => unsubscribe();
  }, [filter, tenantId]);

  const handleFilterChange = (newFilter: Partial<AuditFilter>) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
  };

  const handleResetFilter = () => {
    setFilter({});
  };

  const handleSelectKpiFilter = (kpiKey: string) => {
    if (kpiKey === 'USER') {
      setFilter({ actorType: 'USER' });
      setActiveTab('activity_logs');
    } else if (kpiKey === 'SYSTEM') {
      setFilter({ actorType: 'SYSTEM' });
      setActiveTab('activity_logs');
    } else if (kpiKey === 'AI') {
      setActiveTab('ai_activity');
    } else if (kpiKey === 'SECURITY') {
      setActiveTab('security_logs');
    } else if (kpiKey === 'FAILED') {
      setFilter({ onlyFailures: true });
      setActiveTab('activity_logs');
    } else if (kpiKey === 'CRITICAL') {
      setFilter({ severity: 'CRITICAL' });
      setActiveTab('activity_logs');
    } else {
      setFilter({});
      setActiveTab('activity_logs');
    }
  };

  const handleExport = (format: 'CSV' | 'EXCEL' | 'PDF') => {
    const csvData = auditService.exportAuditCsv(filter, tenantId);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Audit_Log_${new Date().toISOString().slice(0, 10)}.${format.toLowerCase()}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Audit log this export itself!
    auditService.logExport(
      {
        id: 'usr-admin-01',
        name: 'Jaya Triyadi',
        role: 'Super Admin',
        type: 'ADMIN',
      },
      'Ekspor Audit Log Sistem',
      format,
      events.length,
      `Filters: ${JSON.stringify(filter)}`,
      'audit'
    );

    setNotificationBanner(`Berkas Audit Log ${format} berhasil diekspor dan dicatat ke ledger.`);
    setTimeout(() => setNotificationBanner(null), 4000);
  };

  const handleResolveAlert = (alertId: string) => {
    auditService.resolveSecurityAlert(alertId, 'Jaya Triyadi (Super Admin)');
    setNotificationBanner('Peringatan keamanan ditandai selesai (Resolved).');
    setTimeout(() => setNotificationBanner(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Notification Toast if any */}
      {notificationBanner && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/90 text-emerald-200 text-xs font-semibold shadow-2xl flex items-center gap-2 backdrop-blur-md">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{notificationBanner}</span>
        </div>
      )}

      {/* Main Page Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Audit Trail & Activity Log
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  ENTERPRISE OBSERVABILITY
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Pencatatan komprehensif, imutabel (append-only), dan isolasi tenant atas semua aktivitas sistem, keamanan, dan AI.
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={refreshData}
            className="px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
            title="Refresh Log Feed"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Segarkan</span>
          </button>

          <button
            onClick={() => handleExport('CSV')}
            className="px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-cyan-500/20"
          >
            <Settings className="h-3.5 w-3.5" />
            <span>Pengaturan Retensi</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="border-b border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Ringkasan Dashboard', icon: Activity },
          { id: 'activity_logs', label: 'Log Aktivitas Lengkap', icon: Layers },
          { id: 'security_logs', label: 'Security & Auth Failures', icon: Shield },
          { id: 'data_changes', label: 'Perubahan Data (Diff)', icon: GitCommit },
          { id: 'ai_activity', label: 'AI Copilot & Tool Calls', icon: Sparkles },
          { id: 'export_history', label: 'Riwayat Ekspor Laporan', icon: FileSpreadsheet },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AuditViewTab)}
              className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                isActive
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panes */}
      <div className="pt-2">
        {activeTab === 'overview' && (
          <AuditOverviewTab
            stats={stats}
            recentEvents={events}
            securityAlerts={auditService.getSecurityAlerts()}
            onSelectKpiFilter={handleSelectKpiFilter}
            onSelectEvent={setSelectedEvent}
            onResolveAlert={handleResolveAlert}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'activity_logs' && (
          <ActivityLogsTab
            events={events}
            filter={filter}
            onFilterChange={handleFilterChange}
            onResetFilter={handleResetFilter}
            onSelectEvent={setSelectedEvent}
            onExport={handleExport}
          />
        )}

        {activeTab === 'security_logs' && (
          <SecurityLogsTab
            events={events}
            securityAlerts={auditService.getSecurityAlerts()}
            onResolveAlert={handleResolveAlert}
            onSelectEvent={setSelectedEvent}
          />
        )}

        {activeTab === 'data_changes' && (
          <DataChangesTab events={events} onSelectEvent={setSelectedEvent} />
        )}

        {activeTab === 'ai_activity' && (
          <AiActivityTab events={events} onSelectEvent={setSelectedEvent} />
        )}

        {activeTab === 'export_history' && (
          <ExportHistoryTab events={events} onSelectEvent={setSelectedEvent} />
        )}
      </div>

      {/* Event Detail Drawer Inspector */}
      <AuditDetailDrawer
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onOpenTraceModal={(corrId) => setActiveTraceCorrelationId(corrId)}
      />

      {/* End-to-End Trace Modal */}
      <AuditTraceModal
        correlationId={activeTraceCorrelationId}
        onClose={() => setActiveTraceCorrelationId(null)}
      />

      {/* Audit Settings & Retention Policy Modal */}
      <AuditSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        tenantId={tenantId}
      />
    </div>
  );
};
