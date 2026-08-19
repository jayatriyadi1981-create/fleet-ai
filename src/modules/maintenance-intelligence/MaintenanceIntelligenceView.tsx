/**
 * Fleet Intelligence Smart AI - Predictive Maintenance Intelligence View
 * Master module uniting 15 specialized analytics tabs, explainable AI reasoning,
 * component failure forecasting, P1-P4 priority triage, and work order approval.
 */

import React, { useState, useMemo } from 'react';
import { 
  maintenanceIntelligenceService 
} from './engines/MaintenanceIntelligenceService';
import { 
  VehicleMaintenanceProfile, 
  MaintenanceFilterState, 
  MaintenanceRecommendationItem, 
  FailurePredictionItem 
} from './types';

// Modals
import { ExplainMaintenanceAIModal } from './components/modals/ExplainMaintenanceAIModal';
import { VehicleMaintenanceDrilldownModal } from './components/modals/VehicleMaintenanceDrilldownModal';
import { WorkOrderApprovalModal } from './components/modals/WorkOrderApprovalModal';
import { PredictionFeedbackModal } from './components/modals/PredictionFeedbackModal';

// Tabs
import { OverviewTab } from './components/tabs/OverviewTab';
import { MaintenanceRiskTab } from './components/tabs/MaintenanceRiskTab';
import { FailurePredictionTab } from './components/tabs/FailurePredictionTab';
import { ComponentHealthTab } from './components/tabs/ComponentHealthTab';
import { ServicePredictionTab } from './components/tabs/ServicePredictionTab';
import { MaintenancePriorityTab } from './components/tabs/MaintenancePriorityTab';
import { MaintenanceRecommendationTab } from './components/tabs/MaintenanceRecommendationTab';
import { VehicleHealthTab } from './components/tabs/VehicleHealthTab';
import { MaintenanceAnomalyTab } from './components/tabs/MaintenanceAnomalyTab';
import { MaintenanceCostTab } from './components/tabs/MaintenanceCostTab';
import { DowntimeIntelligenceTab } from './components/tabs/DowntimeIntelligenceTab';
import { MaintenanceTrendTab } from './components/tabs/MaintenanceTrendTab';
import { ComponentRiskMatrixTab } from './components/tabs/ComponentRiskMatrixTab';
import { AIMaintenanceAdvisorTab } from './components/tabs/AIMaintenanceAdvisorTab';
import { MaintenanceReportsTab } from './components/tabs/MaintenanceReportsTab';

// Icons
import { 
  Wrench, 
  ShieldAlert, 
  Cpu, 
  HeartHandshake, 
  CalendarClock, 
  Sparkles, 
  AlertOctagon, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  Layers, 
  Bot, 
  FileText,
  Filter,
  CheckCircle2
} from 'lucide-react';

export const MaintenanceIntelligenceView: React.FC = () => {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<
    | 'OVERVIEW'
    | 'RISK'
    | 'FAILURE_PREDICTION'
    | 'COMPONENT_HEALTH'
    | 'SERVICE_PREDICTION'
    | 'PRIORITY_QUEUE'
    | 'RECOMMENDATIONS'
    | 'VEHICLE_HEALTH'
    | 'ANOMALIES'
    | 'COST_ANALYSIS'
    | 'DOWNTIME'
    | 'TRENDS'
    | 'MATRIX'
    | 'ADVISOR'
    | 'REPORTS'
  >('OVERVIEW');

  // Filters
  const [filterBranch, setFilterBranch] = useState<string>('ALL');
  const [filterVehicleType, setFilterVehicleType] = useState<string>('ALL');
  const [filterRiskLevel, setFilterRiskLevel] = useState<string>('ALL');

  // Modals state
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleMaintenanceProfile | null>(null);
  const [explainProfile, setExplainProfile] = useState<VehicleMaintenanceProfile | null>(null);
  const [reviewingRec, setReviewingRec] = useState<MaintenanceRecommendationItem | null>(null);
  const [feedbackPred, setFeedbackPred] = useState<FailurePredictionItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filterState: Partial<MaintenanceFilterState> = useMemo(() => ({
    branch: filterBranch,
    vehicleType: filterVehicleType,
    riskLevel: filterRiskLevel,
  }), [filterBranch, filterVehicleType, filterRiskLevel]);

  // Data fetching from single source of truth
  const kpis = useMemo(() => maintenanceIntelligenceService.getKPIs(filterState), [filterState, toastMessage]);
  const profiles = useMemo(() => maintenanceIntelligenceService.getAllVehicleProfiles(filterState), [filterState]);
  const predictions = useMemo(() => maintenanceIntelligenceService.getFailurePredictions(filterState), [filterState]);
  const services = useMemo(() => maintenanceIntelligenceService.getServiceDueList(filterState), [filterState]);
  const priorityQueue = useMemo(() => maintenanceIntelligenceService.getMaintenancePriorityQueue(filterState), [filterState]);
  const recommendations = useMemo(() => maintenanceIntelligenceService.getRecommendations(filterState), [filterState, toastMessage]);
  const anomalies = useMemo(() => maintenanceIntelligenceService.getAnomalies(filterState), [filterState]);
  const costData = useMemo(() => maintenanceIntelligenceService.getCostAnalysis(filterState), [filterState]);
  const trends = useMemo(() => maintenanceIntelligenceService.getTrends(), []);

  // Handlers
  const handleApproveRecommendation = (recId: string, team: string, notes: string) => {
    const res = maintenanceIntelligenceService.approveRecommendation(recId, 'Fleet Maintenance Manager', notes);
    if (res.success) {
      setToastMessage(`Work Order ${res.workOrderId} berhasil dibuat dan dialokasikan ke ${team}!`);
      setTimeout(() => setToastMessage(null), 5000);
    }
  };

  const handleSubmitFeedback = (predId: string, outcome: 'CORRECT' | 'PARTIALLY_CORRECT' | 'FALSE_POSITIVE', notes: string) => {
    const success = maintenanceIntelligenceService.recordPredictionFeedback(predId, outcome, notes);
    if (success) {
      setToastMessage(`Feedback evaluasi model AI berhasil dicatat.`);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const handleRequestWorkOrder = (vehicleId: string) => {
    const rec = recommendations.find(r => r.vehicleId === vehicleId) || recommendations[0];
    if (rec) {
      setReviewingRec(rec);
    }
  };

  const navTabs = [
    { id: 'OVERVIEW', label: 'Ringkasan Eksekutif', icon: HeartHandshake },
    { id: 'RISK', label: 'Maintenance Risk', icon: ShieldAlert },
    { id: 'FAILURE_PREDICTION', label: 'Failure Predictions', icon: Cpu },
    { id: 'COMPONENT_HEALTH', label: '12-System Health', icon: Wrench },
    { id: 'SERVICE_PREDICTION', label: 'Service Due & Run-Rate', icon: CalendarClock },
    { id: 'PRIORITY_QUEUE', label: 'Priority Queue (P1–P4)', icon: Wrench },
    { id: 'RECOMMENDATIONS', label: 'AI Recommendations', icon: Sparkles },
    { id: 'VEHICLE_HEALTH', label: 'Vehicle Health Score', icon: HeartHandshake },
    { id: 'ANOMALIES', label: 'Pola Anomali & Repeat', icon: AlertOctagon },
    { id: 'COST_ANALYSIS', label: 'Financial Cost / KM', icon: DollarSign },
    { id: 'DOWNTIME', label: 'Downtime & Availability', icon: Clock },
    { id: 'TRENDS', label: 'Tren & Proyeksi', icon: TrendingUp },
    { id: 'MATRIX', label: 'Heatmap Matrix', icon: Layers },
    { id: 'ADVISOR', label: 'AI Maintenance Copilot', icon: Bot },
    { id: 'REPORTS', label: 'Laporan & Audit', icon: FileText },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 text-xs shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Module Title & Global Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-950">
              <Wrench className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">
                  Predictive Maintenance Intelligence
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  Prompt 31 • v2.4.2
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pusat Intelijen Pemeliharaan Kendaraan AI • Telemetri CAN-Bus, Deteksi Kerusakan Dini, Antrean P1-P4 & Optimasi Biaya
              </p>
            </div>
          </div>
        </div>

        {/* Global Filter Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none text-xs"
            >
              <option value="ALL" className="bg-slate-900">Semua Cabang / Depo</option>
              <option value="Jakarta" className="bg-slate-900">Jakarta (Cakung & Daan Mogot)</option>
              <option value="Surabaya" className="bg-slate-900">Surabaya (Rungkut)</option>
              <option value="Bandung" className="bg-slate-900">Bandung (Soekarno-Hatta)</option>
              <option value="Semarang" className="bg-slate-900">Semarang (Kaligawe)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <select
              value={filterVehicleType}
              onChange={(e) => setFilterVehicleType(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none text-xs"
            >
              <option value="ALL" className="bg-slate-900">Semua Tipe Kendaraan</option>
              <option value="Heavy" className="bg-slate-900">Heavy Truck (Tronton / Wingbox)</option>
              <option value="Light" className="bg-slate-900">Light Truck (Engkel / Colt Diesel)</option>
              <option value="Chiller" className="bg-slate-900">Chiller Reefer</option>
              <option value="Support" className="bg-slate-900">Support / Pickup</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <select
              value={filterRiskLevel}
              onChange={(e) => setFilterRiskLevel(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none text-xs"
            >
              <option value="ALL" className="bg-slate-900">Semua Tingkat Risiko</option>
              <option value="CRITICAL" className="bg-slate-900">Critical Risk</option>
              <option value="HIGH" className="bg-slate-900">High Risk</option>
              <option value="MODERATE" className="bg-slate-900">Moderate Risk</option>
              <option value="LOW" className="bg-slate-900">Low Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800/80 scrollbar-thin scrollbar-thumb-slate-800">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950 font-bold'
                  : 'bg-slate-900/60 hover:bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <div className="pt-2">
        {activeTab === 'OVERVIEW' && (
          <OverviewTab
            kpis={kpis}
            profiles={profiles}
            priorityQueue={priorityQueue}
            recommendations={recommendations}
            trends={trends}
            onSelectVehicle={(p) => setSelectedVehicle(p)}
            onExplainAI={(p) => setExplainProfile(p)}
            onReviewRecommendation={(r) => setReviewingRec(r)}
          />
        )}

        {activeTab === 'RISK' && (
          <MaintenanceRiskTab
            profiles={profiles}
            onSelectVehicle={(p) => setSelectedVehicle(p)}
            onExplainAI={(p) => setExplainProfile(p)}
          />
        )}

        {activeTab === 'FAILURE_PREDICTION' && (
          <FailurePredictionTab
            predictions={predictions}
            onOpenFeedback={(p) => setFeedbackPred(p)}
            onRequestWorkOrder={handleRequestWorkOrder}
          />
        )}

        {activeTab === 'COMPONENT_HEALTH' && (
          <ComponentHealthTab
            profiles={profiles}
            onSelectVehicle={(p) => setSelectedVehicle(p)}
            onExplainAI={(p) => setExplainProfile(p)}
          />
        )}

        {activeTab === 'SERVICE_PREDICTION' && (
          <ServicePredictionTab
            services={services}
            onRequestWorkOrder={handleRequestWorkOrder}
          />
        )}

        {activeTab === 'PRIORITY_QUEUE' && (
          <MaintenancePriorityTab
            queue={priorityQueue}
            onRequestWorkOrder={handleRequestWorkOrder}
          />
        )}

        {activeTab === 'RECOMMENDATIONS' && (
          <MaintenanceRecommendationTab
            recommendations={recommendations}
            onReviewRecommendation={(r) => setReviewingRec(r)}
          />
        )}

        {activeTab === 'VEHICLE_HEALTH' && (
          <VehicleHealthTab
            profiles={profiles}
            onSelectVehicle={(p) => setSelectedVehicle(p)}
            onExplainAI={(p) => setExplainProfile(p)}
          />
        )}

        {activeTab === 'ANOMALIES' && (
          <MaintenanceAnomalyTab
            anomalies={anomalies}
            onRequestWorkOrder={handleRequestWorkOrder}
          />
        )}

        {activeTab === 'COST_ANALYSIS' && (
          <MaintenanceCostTab costData={costData} />
        )}

        {activeTab === 'DOWNTIME' && (
          <DowntimeIntelligenceTab kpis={kpis} profiles={profiles} />
        )}

        {activeTab === 'TRENDS' && (
          <MaintenanceTrendTab trends={trends} />
        )}

        {activeTab === 'MATRIX' && (
          <ComponentRiskMatrixTab
            profiles={profiles}
            onSelectVehicle={(p) => setSelectedVehicle(p)}
          />
        )}

        {activeTab === 'ADVISOR' && (
          <AIMaintenanceAdvisorTab
            profiles={profiles}
            onSelectVehicle={(p) => setSelectedVehicle(p)}
          />
        )}

        {activeTab === 'REPORTS' && (
          <MaintenanceReportsTab kpis={kpis} />
        )}
      </div>

      {/* MODALS */}
      {selectedVehicle && (
        <VehicleMaintenanceDrilldownModal
          profile={selectedVehicle}
          isOpen={!!selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
          onExplainAI={(p) => {
            setSelectedVehicle(null);
            setExplainProfile(p);
          }}
          onApproveRecommendation={(recId) => {
            const rec = recommendations.find(r => r.id === recId);
            if (rec) {
              setSelectedVehicle(null);
              setReviewingRec(rec);
            }
          }}
        />
      )}

      {explainProfile && (
        <ExplainMaintenanceAIModal
          profile={explainProfile}
          isOpen={!!explainProfile}
          onClose={() => setExplainProfile(null)}
          onRequestWorkOrder={handleRequestWorkOrder}
        />
      )}

      {reviewingRec && (
        <WorkOrderApprovalModal
          recommendation={reviewingRec}
          isOpen={!!reviewingRec}
          onClose={() => setReviewingRec(null)}
          onConfirmApproval={handleApproveRecommendation}
        />
      )}

      {feedbackPred && (
        <PredictionFeedbackModal
          prediction={feedbackPred}
          isOpen={!!feedbackPred}
          onClose={() => setFeedbackPred(null)}
          onSubmitFeedback={handleSubmitFeedback}
        />
      )}
    </div>
  );
};
