/**
 * Fleet Intelligence Smart AI - Central Report Center Context & State Engine
 * PROMPT 39 - Manages Live Dataset Aggregation, Builder Wizard, Exports, Schedules & Templates
 */

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  ReportDomainType,
  ReportSubType,
  ReportFilterCriteria,
  ReportDataset,
  ReportTemplate,
  ReportSchedule,
  GeneratedReport,
  ReportAuditLog,
  ReportBrandingSettings,
  ReportExportFormat,
  ReportGroupBy,
  ReportVisualizationType,
  ReportAIQAItem,
  ReportCenterKPIs,
} from '../types';
import { ReportDataSourceService } from '../services/ReportDataSourceService';
import { ReportAIIntelligenceService } from '../services/ReportAIIntelligenceService';
import { ReportExportEngine } from '../services/ReportExportEngine';
import { INITIAL_REPORT_TEMPLATES } from '../services/ReportTemplateService';
import { INITIAL_SCHEDULED_REPORTS } from '../services/ReportScheduleService';
import { useAuth } from '../../../context/AuthContext';

export type ReportTab =
  | 'dashboard'
  | 'all'
  | 'builder'
  | 'viewer'
  | 'gps'
  | 'vehicles'
  | 'drivers'
  | 'trips'
  | 'fuel'
  | 'maintenance'
  | 'safety'
  | 'cost'
  | 'fleet'
  | 'executive'
  | 'scheduled'
  | 'templates'
  | 'generated'
  | 'history'
  | 'settings'
  | 'print';

interface ReportContextType {
  activeTab: ReportTab;
  setActiveTab: (tab: ReportTab) => void;
  selectedDomain: ReportDomainType;
  setSelectedDomain: (domain: ReportDomainType) => void;
  selectedSubType: ReportSubType;
  setSelectedSubType: (subType: ReportSubType) => void;
  filters: ReportFilterCriteria;
  setFilters: React.Dispatch<React.SetStateAction<ReportFilterCriteria>>;
  selectedColumns: string[];
  setSelectedColumns: (cols: string[]) => void;
  groupBy: ReportGroupBy;
  setGroupBy: (groupBy: ReportGroupBy) => void;
  sortBy: string | undefined;
  setSortBy: (field: string | undefined) => void;
  sortAsc: boolean;
  setSortAsc: (asc: boolean) => void;
  visualization: ReportVisualizationType;
  setVisualization: (vis: ReportVisualizationType) => void;
  aiSummaryEnabled: boolean;
  setAiSummaryEnabled: (enabled: boolean) => void;

  // Active Loaded Dataset
  activeDataset: ReportDataset;
  generateReport: (domain?: ReportDomainType, subType?: ReportSubType, customFilters?: Partial<ReportFilterCriteria>) => void;
  loadTemplate: (template: ReportTemplate) => void;
  runQuickReport: (domain: ReportDomainType, subType: ReportSubType) => void;
  runOneClickExecutiveReport: () => void;

  // AI Q&A
  qaHistory: ReportAIQAItem[];
  askAIQuestion: (question: string) => void;
  isAiThinking: boolean;

  // Templates
  templates: ReportTemplate[];
  saveAsTemplate: (name: string, description: string, tags: string[]) => void;
  deleteTemplate: (id: string) => void;
  toggleFavoriteTemplate: (id: string) => void;

  // Schedules
  schedules: ReportSchedule[];
  toggleSchedule: (id: string) => void;
  runScheduleNow: (id: string) => void;
  deleteSchedule: (id: string) => void;
  createSchedule: (schedule: Omit<ReportSchedule, 'id' | 'createdAt' | 'tenantId'>) => void;

  // Generated Reports & Background Jobs
  generatedReports: GeneratedReport[];
  isExporting: boolean;
  exportProgress: number;
  exportActiveReport: (format: ReportExportFormat) => Promise<void>;
  deleteGeneratedReport: (id: string) => void;

  // Audit Logs / History
  auditLogs: ReportAuditLog[];

  // Settings & Branding
  branding: ReportBrandingSettings;
  updateBranding: (newBranding: Partial<ReportBrandingSettings>) => void;

  // Modals & UI Controls
  isShareModalOpen: boolean;
  setIsShareModalOpen: (open: boolean) => void;
  isCompareModalOpen: boolean;
  setIsCompareModalOpen: (open: boolean) => void;

  // KPIs
  kpiMetrics: ReportCenterKPIs;
}

const DEFAULT_FILTERS: ReportFilterCriteria = {
  periodPreset: 'THIS_MONTH',
  startDate: '2026-08-01',
  endDate: '2026-08-17',
  branchId: 'ALL',
};

const DEFAULT_BRANDING: ReportBrandingSettings = {
  companyName: 'PT Fleet Intelligence Indonesia Tbk',
  companyAddress: 'Cyber 2 Tower Lt. 28, Jl. HR Rasuna Said Blok X-5, Kuningan, Jakarta Selatan 12950',
  companyPhone: '+62 21 5289 8800',
  companyEmail: 'reports@fleet-smart.ai',
  companyWebsite: 'https://fleet-smart.ai',
  reportFooterText: 'Dokumen ini dibuat otomatis oleh Fleet Intelligence Enterprise AI Reporting Engine. Seluruh metrik telematika terverifikasi sensor IoT.',
  watermark: 'CONFIDENTIAL',
  defaultLocale: 'id-ID',
  currencyCode: 'IDR',
  timezone: 'Asia/Jakarta',
  defaultRetentionDays: 30,
  enableAutoAiSummary: true,
  enableNotificationEmail: true,
  enableNotificationPush: true,
  enableWhatsAppReady: true,
};

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider: React.FC<{ children: ReactNode; initialTab?: ReportTab }> = ({
  children,
  initialTab = 'dashboard',
}) => {
  const { user } = useAuth();
  const userName = user?.name || 'Executive User';

  const [activeTab, setActiveTab] = useState<ReportTab>(initialTab);
  const [selectedDomain, setSelectedDomain] = useState<ReportDomainType>('EXECUTIVE');
  const [selectedSubType, setSelectedSubType] = useState<ReportSubType>('EXECUTIVE_MONTHLY');
  const [filters, setFilters] = useState<ReportFilterCriteria>(DEFAULT_FILTERS);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [groupBy, setGroupBy] = useState<ReportGroupBy>('NONE');
  const [sortBy, setSortBy] = useState<string | undefined>('metricCategory');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [visualization, setVisualization] = useState<ReportVisualizationType>('TABLE');
  const [aiSummaryEnabled, setAiSummaryEnabled] = useState<boolean>(true);

  // Templates State
  const [templates, setTemplates] = useState<ReportTemplate[]>(INITIAL_REPORT_TEMPLATES);

  // Schedules State
  const [schedules, setSchedules] = useState<ReportSchedule[]>(INITIAL_SCHEDULED_REPORTS);

  // Generated Reports State
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([
    {
      id: 'GEN-01',
      jobId: 'JOB-9941',
      tenantId: 'tenant-default',
      reportId: 'REP-EXECUTIVE-AUG',
      name: 'Executive Board of Directors Monthly Briefing',
      type: 'EXECUTIVE',
      subType: 'EXECUTIVE_MONTHLY',
      format: 'PDF',
      periodStart: '2026-08-01',
      periodEnd: '2026-08-17',
      filters: DEFAULT_FILTERS,
      status: 'COMPLETED',
      progressPct: 100,
      fileSize: '3.4 MB',
      downloadToken: 'sig_exec_aug26_8849',
      downloadUrl: '#download-exec-pdf',
      expiresAt: '2026-09-17T00:00:00Z',
      generatedBy: 'usr-admin',
      generatedByName: 'Director of Operations',
      generatedAt: '2026-08-17T08:00:00Z',
      recordsCount: 48,
    },
    {
      id: 'GEN-02',
      jobId: 'JOB-9942',
      tenantId: 'tenant-default',
      reportId: 'REP-COST-JULY',
      name: 'Total Operating Cost (TOC) Statement - Juli 2026',
      type: 'COST',
      subType: 'COST_OPERATING',
      format: 'EXCEL',
      periodStart: '2026-07-01',
      periodEnd: '2026-07-31',
      filters: { ...DEFAULT_FILTERS, periodPreset: 'LAST_MONTH' },
      status: 'COMPLETED',
      progressPct: 100,
      fileSize: '1.2 MB',
      downloadToken: 'sig_cost_jul26_1102',
      downloadUrl: '#download-cost-xlsx',
      expiresAt: '2026-09-01T00:00:00Z',
      generatedBy: 'usr-fin',
      generatedByName: 'Finance Lead',
      generatedAt: '2026-08-01T09:15:00Z',
      recordsCount: 124,
    },
    {
      id: 'GEN-03',
      jobId: 'JOB-9943',
      tenantId: 'tenant-default',
      reportId: 'REP-FUEL-ANOMALY-W2',
      name: 'Audit Konsumsi BBM & Deteksi Siphon',
      type: 'FUEL',
      subType: 'FUEL_ANOMALY',
      format: 'CSV',
      periodStart: '2026-08-10',
      periodEnd: '2026-08-16',
      filters: { ...DEFAULT_FILTERS, periodPreset: 'LAST_WEEK' },
      status: 'COMPLETED',
      progressPct: 100,
      fileSize: '480 KB',
      downloadToken: 'sig_fuel_w2_9921',
      downloadUrl: '#download-fuel-csv',
      expiresAt: '2026-09-10T00:00:00Z',
      generatedBy: 'usr-ops',
      generatedByName: 'Fleet Fuel Lead',
      generatedAt: '2026-08-17T07:10:00Z',
      recordsCount: 48,
    },
  ]);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<ReportAuditLog[]>([
    {
      id: 'AUD-01',
      tenantId: 'tenant-default',
      userId: 'usr-admin',
      userName: 'Director of Operations',
      userEmail: 'director@fleet-smart.ai',
      reportId: 'REP-EXECUTIVE-AUG',
      reportName: 'Executive Board of Directors Monthly Briefing',
      reportType: 'EXECUTIVE',
      action: 'EXPORTED',
      format: 'PDF',
      timestamp: '2026-08-17T08:05:00Z',
      ipAddress: '180.252.164.21',
      filterSummary: 'Semua Cabang | Periode Agustus 2026',
      scope: 'COMPANY_WIDE',
      details: 'Exported Executive Briefing PDF for Board Review',
    },
    {
      id: 'AUD-02',
      tenantId: 'tenant-default',
      userId: 'usr-fin',
      userName: 'Finance Manager',
      userEmail: 'finance@fleet-smart.ai',
      reportId: 'REP-COST-JULY',
      reportName: 'Total Operating Cost (TOC) Statement',
      reportType: 'COST',
      action: 'DOWNLOADED',
      format: 'EXCEL',
      timestamp: '2026-08-17T08:30:00Z',
      ipAddress: '180.252.164.88',
      filterSummary: 'Semua Cabang | Periode Juli 2026',
      scope: 'COMPANY_WIDE',
      details: 'Downloaded Multi-Sheet Excel for GL Reconciliation',
    },
  ]);

  // Branding Settings
  const [branding, setBranding] = useState<ReportBrandingSettings>(DEFAULT_BRANDING);

  // Modals
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // AI Q&A State
  const [qaHistory, setQaHistory] = useState<ReportAIQAItem[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Export State
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Active Dataset Generation
  const [activeDataset, setActiveDataset] = useState<ReportDataset>(() => {
    const ds = ReportDataSourceService.generateReportDataset(
      'EXECUTIVE',
      'EXECUTIVE_MONTHLY',
      DEFAULT_FILTERS,
      undefined,
      'NONE',
      'metricCategory',
      true
    );
    ds.aiSummary = ReportAIIntelligenceService.generateAISynthesis(ds);
    return ds;
  });

  // KPI Calculations
  const kpiMetrics: ReportCenterKPIs = useMemo(() => {
    return {
      totalReports: 54,
      reportsGenerated: generatedReports.length + 182,
      reportsScheduled: schedules.filter(s => s.enabled).length,
      reportsFailed: 0,
      reportsExported: 164,
      reportsThisMonth: 86,
      lastGeneratedReportName: generatedReports[0]?.name || 'Executive Board Briefing',
      lastGeneratedReportTime: '17 Agustus 2026, 08:00 WIB',
      mostUsedReportName: 'Executive Board of Directors Monthly Briefing',
      mostExportedFormat: 'PDF & Excel (XLSX)',
    };
  }, [generatedReports, schedules]);

  /**
   * Main report generator function
   */
  const generateReport = (
    domain?: ReportDomainType,
    subType?: ReportSubType,
    customFilters?: Partial<ReportFilterCriteria>
  ) => {
    const dom = domain || selectedDomain;
    const sub = subType || selectedSubType;
    const flt = { ...filters, ...customFilters };

    const dataset = ReportDataSourceService.generateReportDataset(
      dom,
      sub,
      flt,
      selectedColumns.length > 0 ? selectedColumns : undefined,
      groupBy,
      sortBy,
      sortAsc
    );

    if (aiSummaryEnabled) {
      dataset.aiSummary = ReportAIIntelligenceService.generateAISynthesis(dataset);
    }

    setActiveDataset(dataset);
    setSelectedDomain(dom);
    setSelectedSubType(sub);
    setFilters(flt);

    // Audit log
    const log = ReportExportEngine.createAuditLog(dataset, 'VIEWED', userName);
    setAuditLogs(prev => [log, ...prev]);
  };

  /**
   * Quick Report trigger
   */
  const runQuickReport = (domain: ReportDomainType, subType: ReportSubType) => {
    setSelectedDomain(domain);
    setSelectedSubType(subType);
    setSelectedColumns([]);
    setGroupBy('NONE');
    generateReport(domain, subType);
    setActiveTab('viewer');
  };

  /**
   * One-Click Executive Report
   */
  const runOneClickExecutiveReport = () => {
    setSelectedDomain('EXECUTIVE');
    setSelectedSubType('EXECUTIVE_MONTHLY');
    setSelectedColumns([]);
    setGroupBy('NONE');
    setAiSummaryEnabled(true);
    generateReport('EXECUTIVE', 'EXECUTIVE_MONTHLY', { periodPreset: 'THIS_MONTH' });
    setActiveTab('viewer');
  };

  /**
   * Load Template
   */
  const loadTemplate = (template: ReportTemplate) => {
    setSelectedDomain(template.type);
    setSelectedSubType(template.subType);
    setSelectedColumns(template.columns);
    setFilters(template.filters);
    setGroupBy(template.grouping);
    setSortBy(template.sortBy);
    setSortAsc(template.sortDirection === 'ASC');
    setVisualization(template.visualization);
    setAiSummaryEnabled(template.aiSummaryEnabled);

    // Update template usage
    setTemplates(prev => prev.map(t => t.id === template.id ? { ...t, usageCount: t.usageCount + 1 } : t));

    // Generate & open viewer
    generateReport(template.type, template.subType, template.filters);
    setActiveTab('viewer');
  };

  /**
   * Save current configuration as Template
   */
  const saveAsTemplate = (name: string, description: string, tags: string[]) => {
    const newTemplate: ReportTemplate = {
      id: `TPL-${Date.now().toString(36).toUpperCase()}`,
      tenantId: 'tenant-default',
      name,
      type: selectedDomain,
      subType: selectedSubType,
      description,
      tags,
      columns: selectedColumns,
      filters,
      grouping: groupBy,
      sortBy,
      sortDirection: sortAsc ? 'ASC' : 'DESC',
      visualization,
      aiSummaryEnabled,
      isDefault: false,
      isFavorite: false,
      usageCount: 1,
      createdBy: userName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTemplates(prev => [newTemplate, ...prev]);
  };

  /**
   * Delete Template
   */
  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  /**
   * Toggle Template Favorite
   */
  const toggleFavoriteTemplate = (id: string) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, isFavorite: !t.isFavorite } : t));
  };

  /**
   * Toggle Schedule Active/Paused
   */
  const toggleSchedule = (id: string) => {
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  /**
   * Trigger instant run for a schedule
   */
  const runScheduleNow = (id: string) => {
    const sch = schedules.find(s => s.id === id);
    if (!sch) return;

    setSchedules(prev => prev.map(s => s.id === id ? { ...s, lastRunAt: new Date().toISOString(), lastStatus: 'SUCCESS' } : s));

    const gen: GeneratedReport = {
      id: `GEN-${Date.now().toString(36)}`,
      jobId: `JOB-${Date.now().toString(36).toUpperCase()}`,
      tenantId: 'tenant-default',
      reportId: sch.id,
      name: `${sch.name} (Instant Run)`,
      type: sch.reportType,
      subType: sch.subType,
      format: sch.formats[0] || 'PDF',
      periodStart: sch.filters.startDate,
      periodEnd: sch.filters.endDate,
      filters: sch.filters,
      status: 'COMPLETED',
      progressPct: 100,
      fileSize: '2.1 MB',
      downloadToken: `sig_${Date.now()}`,
      downloadUrl: `#download-${sch.id}`,
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      generatedBy: 'usr-scheduler',
      generatedByName: 'Automated Cron Engine',
      generatedAt: new Date().toISOString(),
      recordsCount: 48,
    };

    setGeneratedReports(prev => [gen, ...prev]);
  };

  /**
   * Delete Schedule
   */
  const deleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
  };

  /**
   * Create new Schedule
   */
  const createSchedule = (scheduleData: Omit<ReportSchedule, 'id' | 'createdAt' | 'tenantId'>) => {
    const newSchedule: ReportSchedule = {
      ...scheduleData,
      id: `SCH-${Date.now().toString(36).toUpperCase()}`,
      tenantId: 'tenant-default',
      createdAt: new Date().toISOString(),
    };
    setSchedules(prev => [newSchedule, ...prev]);
  };

  /**
   * Export Active Report (PDF, Excel XML, CSV)
   */
  const exportActiveReport = async (format: ReportExportFormat) => {
    setIsExporting(true);
    setExportProgress(15);

    try {
      const jobResult = await ReportExportEngine.simulateAsyncJob(
        activeDataset,
        format,
        userName,
        (pct) => setExportProgress(pct)
      );

      // Perform download
      if (format === 'CSV') {
        const csv = ReportExportEngine.exportToCSV(activeDataset, branding);
        ReportExportEngine.triggerDownload(
          csv,
          `${activeDataset.name.replace(/\s+/g, '_')}_${activeDataset.periodLabel.replace(/\s+/g, '_')}.csv`,
          'text/csv;charset=utf-8;'
        );
      } else if (format === 'EXCEL') {
        const xml = ReportExportEngine.exportToExcelXML(activeDataset, branding);
        ReportExportEngine.triggerDownload(
          xml,
          `${activeDataset.name.replace(/\s+/g, '_')}_${activeDataset.periodLabel.replace(/\s+/g, '_')}.xls`,
          'application/vnd.ms-excel'
        );
      } else if (format === 'PDF') {
        // Switch to print view for direct luxury print & PDF rendering
        setActiveTab('print');
      }

      setGeneratedReports(prev => [jobResult, ...prev]);

      const log = ReportExportEngine.createAuditLog(activeDataset, 'EXPORTED', userName, format);
      setAuditLogs(prev => [log, ...prev]);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  /**
   * Delete Generated Report
   */
  const deleteGeneratedReport = (id: string) => {
    setGeneratedReports(prev => prev.filter(g => g.id !== id));
  };

  /**
   * Ask AI question regarding active report
   */
  const askAIQuestion = (question: string) => {
    if (!question.trim()) return;
    setIsAiThinking(true);

    setTimeout(() => {
      const qa = ReportAIIntelligenceService.answerReportQuestion(activeDataset, question);
      setQaHistory(prev => [qa, ...prev]);
      setIsAiThinking(false);
    }, 600);
  };

  /**
   * Update Branding settings
   */
  const updateBranding = (newBranding: Partial<ReportBrandingSettings>) => {
    setBranding(prev => ({ ...prev, ...newBranding }));
  };

  return (
    <ReportContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedDomain,
        setSelectedDomain,
        selectedSubType,
        setSelectedSubType,
        filters,
        setFilters,
        selectedColumns,
        setSelectedColumns,
        groupBy,
        setGroupBy,
        sortBy,
        setSortBy,
        sortAsc,
        setSortAsc,
        visualization,
        setVisualization,
        aiSummaryEnabled,
        setAiSummaryEnabled,

        activeDataset,
        generateReport,
        loadTemplate,
        runQuickReport,
        runOneClickExecutiveReport,

        qaHistory,
        askAIQuestion,
        isAiThinking,

        templates,
        saveAsTemplate,
        deleteTemplate,
        toggleFavoriteTemplate,

        schedules,
        toggleSchedule,
        runScheduleNow,
        deleteSchedule,
        createSchedule,

        generatedReports,
        isExporting,
        exportProgress,
        exportActiveReport,
        deleteGeneratedReport,

        auditLogs,
        branding,
        updateBranding,

        isShareModalOpen,
        setIsShareModalOpen,
        isCompareModalOpen,
        setIsCompareModalOpen,

        kpiMetrics,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
};
