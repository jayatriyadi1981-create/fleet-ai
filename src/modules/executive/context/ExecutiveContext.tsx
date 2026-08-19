/**
 * Fleet Intelligence Smart AI - Executive Context & State Management
 * Provides centralized C-Level aggregation, real-time recalculation, interactive filters,
 * and AI decision orchestration across the entire Executive Dashboard.
 */

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useFleet } from '../../../context/FleetContext';
import { useAuth } from '../../../context/AuthContext';
import {
  ExecutivePeriod,
  DateRange,
  ExecutiveScoreWeights,
  ExecutiveScoreResult,
  ExecutiveKpiCardData,
  FleetEfficiencyMetrics,
  ExecutiveCostMetrics,
  ExecutiveProductivityMetrics,
  ExecutiveSafetyMetrics,
  ExecutiveFuelMetrics,
  ExecutiveMaintenanceMetrics,
  BranchExecutivePerformance,
  HighRiskVehicleItem,
  TopVehicleCostItem,
  TopDriverRiskItem,
  TopEfficientVehicleItem,
  TopProductiveVehicleItem,
  AIExecutiveSummaryData,
  AIExecutiveInsight,
  ExecutiveSavingOpportunity,
  DailyBriefingData,
  ExecutiveDecisionItem,
  ExecutiveReportData,
} from '../types';
import { ExecutiveScoreEngine, DEFAULT_EXECUTIVE_WEIGHTS } from '../engines/ExecutiveScoreEngine';
import { ExecutiveAggregationService } from '../engines/ExecutiveAggregationService';
import { ExecutiveAIIntelligenceEngine } from '../engines/ExecutiveAIIntelligenceEngine';
import { ExecutiveExportService } from '../engines/ExecutiveExportService';

interface ExecutiveContextType {
  period: ExecutivePeriod;
  setPeriod: (period: ExecutivePeriod) => void;
  customDateRange: DateRange;
  setCustomDateRange: (range: DateRange) => void;
  selectedBranchId: string;
  setSelectedBranchId: (branchId: string) => void;
  selectedVehicleGroup: string;
  setSelectedVehicleGroup: (group: string) => void;
  weights: ExecutiveScoreWeights;
  setWeights: (weights: ExecutiveScoreWeights) => void;
  resetWeights: () => void;

  scoreResult: ExecutiveScoreResult;
  kpiCards: ExecutiveKpiCardData[];
  efficiency: FleetEfficiencyMetrics;
  cost: ExecutiveCostMetrics;
  productivity: ExecutiveProductivityMetrics;
  safety: ExecutiveSafetyMetrics;
  fuel: ExecutiveFuelMetrics;
  maintenance: ExecutiveMaintenanceMetrics;
  branchesPerformance: BranchExecutivePerformance[];

  highRiskVehicles: HighRiskVehicleItem[];
  topCostVehicles: TopVehicleCostItem[];
  topRiskDrivers: TopDriverRiskItem[];
  topEfficientVehicles: TopEfficientVehicleItem[];
  topProductiveVehicles: TopProductiveVehicleItem[];

  aiSummary: AIExecutiveSummaryData;
  insights: AIExecutiveInsight[];
  savingOpportunities: ExecutiveSavingOpportunity[];
  dailyBriefing: DailyBriefingData;
  decisionItems: ExecutiveDecisionItem[];

  isBriefingModalOpen: boolean;
  setIsBriefingModalOpen: (open: boolean) => void;
  isAskAiModalOpen: boolean;
  setIsAskAiModalOpen: (open: boolean) => void;
  isScoreConfigModalOpen: boolean;
  setIsScoreConfigModalOpen: (open: boolean) => void;
  selectedInsightForExplanation: AIExecutiveInsight | null;
  setSelectedInsightForExplanation: (insight: AIExecutiveInsight | null) => void;
  selectedDecisionForAction: ExecutiveDecisionItem | null;
  setSelectedDecisionForAction: (item: ExecutiveDecisionItem | null) => void;

  lastRefreshedAt: string;
  refreshData: () => void;
  handleExportCSV: () => void;
  handleExportExcel: () => void;
  handleCreateDecisionTask: (itemId: string, note?: string) => void;
  handleResolveDecision: (itemId: string) => void;
}

const ExecutiveContext = createContext<ExecutiveContextType | undefined>(undefined);

export const ExecutiveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { vehicles, drivers, trips, alerts, branches, maintenanceOrders, currentTenant } = useFleet();
  const { user } = useAuth();

  const [period, setPeriod] = useState<ExecutivePeriod>('THIS_MONTH');
  const [customDateRange, setCustomDateRange] = useState<DateRange>({
    startDate: '2026-08-01',
    endDate: '2026-08-17',
  });
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [selectedVehicleGroup, setSelectedVehicleGroup] = useState<string>('all');
  const [weights, setWeights] = useState<ExecutiveScoreWeights>(DEFAULT_EXECUTIVE_WEIGHTS);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>(new Date().toLocaleTimeString('id-ID'));

  // Modals state
  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState(false);
  const [isAskAiModalOpen, setIsAskAiModalOpen] = useState(false);
  const [isScoreConfigModalOpen, setIsScoreConfigModalOpen] = useState(false);
  const [selectedInsightForExplanation, setSelectedInsightForExplanation] = useState<AIExecutiveInsight | null>(null);
  const [selectedDecisionForAction, setSelectedDecisionForAction] = useState<ExecutiveDecisionItem | null>(null);

  // Decision center items state
  const [decisionItems, setDecisionItems] = useState<ExecutiveDecisionItem[]>(() =>
    ExecutiveAIIntelligenceEngine.generateDecisionItems()
  );

  const resetWeights = useCallback(() => {
    setWeights(DEFAULT_EXECUTIVE_WEIGHTS);
  }, []);

  const refreshData = useCallback(() => {
    setLastRefreshedAt(new Date().toLocaleTimeString('id-ID'));
  }, []);

  // Aggregated domain metrics
  const efficiency = useMemo(() => {
    return ExecutiveAggregationService.aggregateEfficiency(vehicles, trips, selectedBranchId, period);
  }, [vehicles, trips, selectedBranchId, period]);

  const cost = useMemo(() => {
    return ExecutiveAggregationService.aggregateCost(vehicles, selectedBranchId, period);
  }, [vehicles, selectedBranchId, period]);

  const productivity = useMemo(() => {
    return ExecutiveAggregationService.aggregateProductivity(vehicles, drivers, trips, period);
  }, [vehicles, drivers, trips, period]);

  const safety = useMemo(() => {
    return ExecutiveAggregationService.aggregateSafety(alerts, drivers, period);
  }, [alerts, drivers, period]);

  const fuel = useMemo(() => {
    return ExecutiveAggregationService.aggregateFuel(vehicles, period);
  }, [vehicles, period]);

  const maintenance = useMemo(() => {
    return ExecutiveAggregationService.aggregateMaintenance(vehicles, maintenanceOrders, period);
  }, [vehicles, maintenanceOrders, period]);

  const branchesPerformance = useMemo(() => {
    return ExecutiveAggregationService.aggregateBranches(branches, vehicles);
  }, [branches, vehicles]);

  const {
    highRiskVehicles,
    topCostVehicles,
    topRiskDrivers,
    topEfficientVehicles,
    topProductiveVehicles,
  } = useMemo(() => {
    return ExecutiveAggregationService.aggregateRankings(vehicles, drivers);
  }, [vehicles, drivers]);

  // Executive Scorecard calculation
  const scoreResult = useMemo(() => {
    const costScore = Math.max(
      50,
      Math.min(
        100,
        100 - (cost.budgetVariancePct && cost.budgetVariancePct > 0 ? cost.budgetVariancePct * 3 : 0)
      )
    );
    const prevCostScore = 82.0;

    return ExecutiveScoreEngine.computeScorecard({
      efficiencyScore: efficiency.efficiencyScore,
      prevEfficiencyScore: efficiency.prevEfficiencyScore,
      productivityScore: productivity.productivityScore,
      prevProductivityScore: 88.5,
      safetyScore: safety.safetyScore,
      prevSafetyScore: safety.prevSafetyScore,
      fuelScore: fuel.fuelEfficiencyPct,
      prevFuelScore: 81.2,
      maintenanceScore: Math.round(
        (maintenance.healthCounts.healthy /
          (maintenance.healthCounts.healthy +
            maintenance.vehiclesDueSoonCount +
            maintenance.vehiclesOverdueCount +
            maintenance.criticalVehiclesCount || 1)) *
          100
      ),
      prevMaintenanceScore: 84.0,
      costEfficiencyScore: costScore,
      prevCostEfficiencyScore: prevCostScore,
      weights,
    });
  }, [efficiency, productivity, safety, fuel, maintenance, cost, weights]);

  // Executive KPI Cards
  const kpiCards = useMemo(() => {
    return ExecutiveAggregationService.buildKpiCards(
      efficiency,
      cost,
      productivity,
      safety,
      fuel,
      maintenance
    );
  }, [efficiency, cost, productivity, safety, fuel, maintenance]);

  // AI Summaries & Insights
  const aiSummary = useMemo(() => {
    return ExecutiveAIIntelligenceEngine.generateExecutiveSummary({
      score: scoreResult,
      efficiency,
      cost,
      productivity,
      safety,
      fuel,
      maintenance,
    });
  }, [scoreResult, efficiency, cost, productivity, safety, fuel, maintenance]);

  const insights = useMemo(() => {
    return ExecutiveAIIntelligenceEngine.generateExecutiveInsights();
  }, []);

  const savingOpportunities = useMemo(() => {
    return ExecutiveAIIntelligenceEngine.generateSavingOpportunities();
  }, []);

  const dailyBriefing = useMemo(() => {
    return ExecutiveAIIntelligenceEngine.generateDailyBriefing({
      efficiency,
      cost,
      productivity,
      safety,
      fuel,
      maintenance,
    });
  }, [efficiency, cost, productivity, safety, fuel, maintenance]);

  // Decision Center Handlers
  const handleCreateDecisionTask = useCallback((itemId: string, note?: string) => {
    setDecisionItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: 'IN_PROGRESS',
              recommendation: note ? `${item.recommendation} (Catatan: ${note})` : item.recommendation,
            }
          : item
      )
    );
    setSelectedDecisionForAction(null);
  }, []);

  const handleResolveDecision = useCallback((itemId: string) => {
    setDecisionItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, status: 'RESOLVED' } : item))
    );
  }, []);

  // Export handlers
  const getFullReportData = useCallback((): ExecutiveReportData => {
    return {
      tenantId: currentTenant?.id || 'tenant-001',
      companyName: currentTenant?.name || 'PT Trans Nusantara Logistics',
      periodLabel: period.replace('_', ' '),
      dateRange: customDateRange,
      generatedAt: new Date().toLocaleString('id-ID'),
      generatedBy: user?.name || 'Director',
      overallScore: scoreResult,
      kpis: kpiCards,
      efficiency,
      cost,
      productivity,
      safety,
      fuel,
      maintenance,
      branches: branchesPerformance,
      aiSummary,
      insights,
      savingOpportunities,
      highRiskVehicles,
      topCostVehicles,
      topRiskDrivers,
    };
  }, [
    currentTenant,
    period,
    customDateRange,
    user,
    scoreResult,
    kpiCards,
    efficiency,
    cost,
    productivity,
    safety,
    fuel,
    maintenance,
    branchesPerformance,
    aiSummary,
    insights,
    savingOpportunities,
    highRiskVehicles,
    topCostVehicles,
    topRiskDrivers,
  ]);

  const handleExportCSV = useCallback(() => {
    const data = getFullReportData();
    ExecutiveExportService.exportToCSV(data);
  }, [getFullReportData]);

  const handleExportExcel = useCallback(() => {
    const data = getFullReportData();
    ExecutiveExportService.exportToExcel(data);
  }, [getFullReportData]);

  const value = {
    period,
    setPeriod,
    customDateRange,
    setCustomDateRange,
    selectedBranchId,
    setSelectedBranchId,
    selectedVehicleGroup,
    setSelectedVehicleGroup,
    weights,
    setWeights,
    resetWeights,

    scoreResult,
    kpiCards,
    efficiency,
    cost,
    productivity,
    safety,
    fuel,
    maintenance,
    branchesPerformance,

    highRiskVehicles,
    topCostVehicles,
    topRiskDrivers,
    topEfficientVehicles,
    topProductiveVehicles,

    aiSummary,
    insights,
    savingOpportunities,
    dailyBriefing,
    decisionItems,

    isBriefingModalOpen,
    setIsBriefingModalOpen,
    isAskAiModalOpen,
    setIsAskAiModalOpen,
    isScoreConfigModalOpen,
    setIsScoreConfigModalOpen,
    selectedInsightForExplanation,
    setSelectedInsightForExplanation,
    selectedDecisionForAction,
    setSelectedDecisionForAction,

    lastRefreshedAt,
    refreshData,
    handleExportCSV,
    handleExportExcel,
    handleCreateDecisionTask,
    handleResolveDecision,
  };

  return <ExecutiveContext.Provider value={value}>{children}</ExecutiveContext.Provider>;
};

export const useExecutive = (): ExecutiveContextType => {
  const context = useContext(ExecutiveContext);
  if (!context) {
    throw new Error('useExecutive must be used within an ExecutiveProvider');
  }
  return context;
};
