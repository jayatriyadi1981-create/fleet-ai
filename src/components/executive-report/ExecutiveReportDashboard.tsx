/**
 * Fleet Intelligence Smart AI - AI Executive Report Dashboard
 * PROMPT 52 — C-Level / Director / Owner Intelligence System
 */

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Sparkles, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Download, 
  SlidersHorizontal,
  TrendingUp,
  FileCheck,
  Zap,
  Layers,
  ArrowUpRight,
  Printer,
  Copy,
  MessageSquare
} from 'lucide-react';
import { 
  ExecutiveReport, 
  ExecutivePeriodType,
  ExecutiveRolePerspective,
  RootCauseDriver,
  EvidenceItem
} from '../../types/executiveReport';
import { AIExecutiveReportService } from '../../services/executiveReport/aiExecutiveReportService';
import { ExecutiveReportRepository } from '../../services/executiveReport/executiveReportRepository';
import { ExecutiveReportExportService } from '../../services/executiveReport/executiveReportExportService';

// UI Components
import { ExecutiveHeaderCard } from './ExecutiveHeaderCard';
import { ExecutiveSummaryCard } from './ExecutiveSummaryCard';
import { ExecutiveScorecardWidget } from './ExecutiveScorecardWidget';
import { ExecutiveKPICardsGrid } from './ExecutiveKPICardsGrid';
import { CostAnalysisSection } from './CostAnalysisSection';
import { HighCostVehiclesAndRoutesTable } from './HighCostVehiclesAndRoutesTable';
import { FleetOperationsSection } from './FleetOperationsSection';
import { SafetyAndDriverRiskSection } from './SafetyAndDriverRiskSection';
import { BranchDepartmentComparisonSection } from './BranchDepartmentComparisonSection';
import { ExecutiveRisksSection } from './ExecutiveRisksSection';
import { ExecutiveForecastSection } from './ExecutiveForecastSection';
import { ExecutiveRecommendationsSection } from './ExecutiveRecommendationsSection';

// Modals
import { RootCauseDrilldownModal } from './RootCauseDrilldownModal';
import { EvidenceViewerModal } from './EvidenceViewerModal';
import { ExecutiveExportModal } from './ExecutiveExportModal';

export const ExecutiveReportDashboard: React.FC = () => {
  // State
  const [loading, setLoading] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [report, setReport] = useState<ExecutiveReport | null>(null);

  // Filter & Perspective states
  const [selectedPerspective, setSelectedPerspective] = useState<ExecutiveRolePerspective>('director_owner');
  const [selectedPeriodLabel, setSelectedPeriodLabel] = useState<string>('Agustus 2026');
  const [selectedPeriodType, setSelectedPeriodType] = useState<ExecutivePeriodType>('monthly');
  const [comparisonMode, setComparisonMode] = useState<'previous' | 'last_year' | 'target'>('previous');

  // Modals state
  const [rootCauseModalOpen, setRootCauseModalOpen] = useState<boolean>(false);
  const [selectedRootCauseCategory, setSelectedRootCauseCategory] = useState<string>('Fuel Consumption');
  const [selectedRootCauseTitle, setSelectedRootCauseTitle] = useState<string>('Analisa Lonjakan Biaya');
  const [selectedRootCauseDriver, setSelectedRootCauseDriver] = useState<RootCauseDriver | null>(null);

  const [evidenceModalOpen, setEvidenceModalOpen] = useState<boolean>(false);
  const [evidenceModalTitle, setEvidenceModalTitle] = useState<string>('Audit Bukti Telematika');
  const [selectedEvidenceList, setSelectedEvidenceList] = useState<EvidenceItem[]>([]);

  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastNotification(msg);
    setTimeout(() => {
      setToastNotification(null);
    }, 3500);
  };

  // Load / Generate Report
  const loadOrGenerateReport = async (
    periodLabel: string = selectedPeriodLabel,
    periodType: ExecutivePeriodType = selectedPeriodType,
    forceRegenerate: boolean = false
  ) => {
    setLoading(true);
    try {
      if (forceRegenerate) {
        setIsGenerating(true);
      }

      const generated = await AIExecutiveReportService.generateReport({
        tenantId: 'tenant-1',
        periodLabel,
        periodType,
        userRole: selectedPerspective,
        forceRegenerate,
      });

      setReport(generated);
    } catch (err) {
      console.error('Error generating executive report:', err);
    } finally {
      setLoading(false);
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    loadOrGenerateReport();
  }, []);

  // Filter change handlers
  const handlePeriodChange = (label: string, type: ExecutivePeriodType) => {
    setSelectedPeriodLabel(label);
    setSelectedPeriodType(type);
    loadOrGenerateReport(label, type, false);
  };

  const handlePerspectiveChange = (p: ExecutiveRolePerspective) => {
    setSelectedPerspective(p);
  };

  const handleRegenerate = () => {
    loadOrGenerateReport(selectedPeriodLabel, selectedPeriodType, true);
    showToast('Laporan Eksekutif berhasil diregenerasi dengan data telematika & ledger terbaru.');
  };

  // Why / Root Cause Drilldown handler
  const handleWhyClick = (category: string, title?: string) => {
    if (!report) return;

    setSelectedRootCauseCategory(category);
    setSelectedRootCauseTitle(title || `Analisa Akar Masalah: ${category}`);

    const found = report.costAnalysis.drivers.find(d =>
      d.category.toLowerCase().includes(category.toLowerCase()) ||
      category.toLowerCase().includes(d.category.toLowerCase())
    ) || report.costAnalysis.drivers[0] || null;

    setSelectedRootCauseDriver(found);
    setRootCauseModalOpen(true);
  };

  // Evidence handler
  const handleViewEvidence = (evidenceIds: string[], title: string) => {
    if (!report) return;

    let matching = report.evidences.filter(ev => evidenceIds.includes(ev.id) || (ev.evidenceId && evidenceIds.includes(ev.evidenceId)));
    if (matching.length === 0) {
      matching = report.evidences.slice(0, 3);
    }

    setSelectedEvidenceList(matching);
    setEvidenceModalTitle(title);
    setEvidenceModalOpen(true);
  };

  // Recommendation actions
  const handleApproveRecommendation = (recId: string) => {
    if (!report) return;
    const updated = AIExecutiveReportService.updateRecommendationStatus(
      report.id,
      recId,
      'APPROVED',
      'Direktur Operasional (C-Level)'
    );
    if (updated) {
      setReport({ ...updated });
      showToast('Rekomendasi disetujui & ditugaskan ke Head of Department terkait.');
    }
  };

  const handleDismissRecommendation = (recId: string) => {
    if (!report) return;
    const updated = AIExecutiveReportService.updateRecommendationStatus(
      report.id,
      recId,
      'DISMISSED',
      'Direktur Operasional (C-Level)'
    );
    if (updated) {
      setReport({ ...updated });
      showToast('Rekomendasi diarsipkan.');
    }
  };

  const handleCreateTask = (recId: string) => {
    handleApproveRecommendation(recId);
  };

  // Quick Exports & Actions
  const handleDownloadCSV = () => {
    if (!report) return;
    ExecutiveReportExportService.downloadCSV(report);
    showToast('File CSV laporan eksekutif berhasil diunduh.');
  };

  const handleDownloadJSON = () => {
    if (!report) return;
    ExecutiveReportExportService.downloadJSON(report);
    showToast('File JSON audit data berhasil diunduh.');
  };

  const handlePrintPreview = () => {
    if (!report) return;
    ExecutiveReportExportService.exportToPrintablePDF(report);
  };

  const handleCopyWhatsApp = () => {
    if (!report) return;
    const text = ExecutiveReportExportService.generateWhatsAppSummary(report);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast('Ringkasan WhatsApp Memo berhasil disalin ke clipboard.');
    }
  };

  if (loading && !report) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 p-8">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center animate-pulse">
            <Sparkles className="w-8 h-8 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-base font-bold text-slate-100">
            Mengompilasi Laporan Intelijen Eksekutif (C-Level)...
          </h3>
          <p className="text-xs text-slate-400 max-w-md">
            Menganalisis ledger finansial, telematika GPS/IoT, kepatuhan HSE, serta kalkulasi deviasi budget periode {selectedPeriodLabel}
          </p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl max-w-xl mx-auto my-12">
        <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
        <h3 className="text-sm font-bold text-slate-200">Gagal Memuat Laporan Eksekutif</h3>
        <p className="text-xs text-slate-400 mt-1 mb-4">Terjadi kendala saat membaca agregasi data telematika.</p>
        <button
          onClick={() => loadOrGenerateReport(selectedPeriodLabel, selectedPeriodType, true)}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl transition-colors"
        >
          Coba Muat Ulang
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto relative">
      {/* Toast Notification */}
      {toastNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-cyan-950 border border-cyan-600 text-cyan-100 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
          <span className="text-xs font-medium">{toastNotification}</span>
        </div>
      )}

      {/* 1. Header Card & Control Panel */}
      <ExecutiveHeaderCard
        report={report}
        selectedPerspective={selectedPerspective}
        onPerspectiveChange={handlePerspectiveChange}
        selectedPeriodLabel={selectedPeriodLabel}
        onPeriodChange={handlePeriodChange}
        comparisonMode={comparisonMode}
        onComparisonModeChange={setComparisonMode}
        isGenerating={isGenerating}
        onRegenerate={handleRegenerate}
        onOpenHistory={() => showToast(`Versi laporan aktif: Versi ${report.version} (${report.periodLabel})`)}
        onOpenSchedule={() => setExportModalOpen(true)}
        onOpenShare={() => setExportModalOpen(true)}
        onOpenEmailModal={() => setExportModalOpen(true)}
        onDownloadCSV={handleDownloadCSV}
        onDownloadJSON={handleDownloadJSON}
        onPrintPreview={handlePrintPreview}
        onCopyWhatsApp={handleCopyWhatsApp}
      />

      {/* 2. Executive Summary AI Narrative & Audio Player */}
      <ExecutiveSummaryCard
        report={report}
        onAskAI={() => handleWhyClick('Total Operating Cost', 'Analisis Ringkasan Eksekutif AI')}
      />

      {/* 3. Corporate 7-Pillar Scorecard */}
      <ExecutiveScorecardWidget
        scorecard={report.scorecard}
      />

      {/* 4. Primary KPI Summary Cards */}
      <ExecutiveKPICardsGrid
        currentKPIs={report.kpis.current}
        previousKPIs={report.kpis.previous}
        targetKPIs={report.kpis.target}
        variances={report.kpis.varianceVsPreviousPercent}
        perspective={selectedPerspective}
        onWhyClick={handleWhyClick}
      />

      {/* 5. Financial & Cost Analysis (Trend, Breakdown, Cost/km) */}
      <CostAnalysisSection
        totalCost={report.costAnalysis.totalCost}
        costChangePercent={report.costAnalysis.changePercent}
        drivers={report.costAnalysis.drivers}
        costTrend={report.costAnalysis.costTrend}
        fleetAvgCostPerKm={report.costAnalysis.fleetAvgCostPerKm}
        bestCostPerKm={report.costAnalysis.bestCostPerKm}
        worstCostPerKm={report.costAnalysis.worstCostPerKm}
        onWhyClick={handleWhyClick}
      />

      {/* 6. Vehicle Level Drilldown & Route Logistics Efficiency */}
      <HighCostVehiclesAndRoutesTable
        vehicles={report.highCostVehicles}
        routes={report.highCostRoutes}
        onViewEvidence={handleViewEvidence}
      />

      {/* 7. Fleet Operations, SLA & Downtime */}
      <FleetOperationsSection
        kpis={report.kpis.current}
        onWhyClick={handleWhyClick}
      />

      {/* 8. Safety, HSE & Driver Risk Management */}
      <SafetyAndDriverRiskSection
        kpis={report.kpis.current}
        onViewEvidence={handleViewEvidence}
        onWhyClick={handleWhyClick}
      />

      {/* 9. Multi-Branch & Cost Center Benchmark */}
      <BranchDepartmentComparisonSection
        branches={report.branchComparisons}
        departments={report.departmentComparisons}
      />

      {/* 10. Items Requiring Management Attention (Risks) */}
      <ExecutiveRisksSection
        risks={report.risks}
        onViewEvidence={handleViewEvidence}
      />

      {/* 11. Predictive Forecasts & Confidence Intervals */}
      <ExecutiveForecastSection
        forecasts={report.forecasts}
      />

      {/* 12. Management Decision Board (Recommendations & Human-in-the-Loop Actions) */}
      <ExecutiveRecommendationsSection
        recommendations={report.recommendations}
        onApprove={handleApproveRecommendation}
        onDismiss={handleDismissRecommendation}
        onCreateTask={handleCreateTask}
        onViewEvidence={handleViewEvidence}
      />

      {/* MODALS */}
      {/* 5-Why Root Cause Modal */}
      <RootCauseDrilldownModal
        isOpen={rootCauseModalOpen}
        onClose={() => setRootCauseModalOpen(false)}
        title={selectedRootCauseTitle}
        category={selectedRootCauseCategory}
        driver={selectedRootCauseDriver}
        onViewEvidence={handleViewEvidence}
      />

      {/* Evidence Viewer Modal */}
      <EvidenceViewerModal
        isOpen={evidenceModalOpen}
        onClose={() => setEvidenceModalOpen(false)}
        title={evidenceModalTitle}
        evidenceList={selectedEvidenceList}
      />

      {/* Export Modal */}
      <ExecutiveExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        report={report}
      />
    </div>
  );
};
