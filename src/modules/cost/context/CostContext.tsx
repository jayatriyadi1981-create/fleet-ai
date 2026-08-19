/**
 * Fleet Intelligence Smart AI - Cost Analytics Global State Context
 * PROMPT 37 - Reactive State, Filters, Approvals, Simulation & Privacy Engine
 */

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useAuthorization } from '../../../hooks/useAuthorization';
import {
  CostRecord,
  CostCategoryConfig,
  FuelCostMetric,
  FuelPriceHistoryRecord,
  MaintenanceCostMetric,
  DriverCostMetric,
  CostPerKmMetric,
  CostPerTripMetric,
  BranchCostMetric,
  RouteCostMetric,
  VehicleCostProfile,
  CostBudgetVariance,
  CostForecastResult,
  AICostInsight,
  CostSavingOpportunity,
  CostReconciliationItem,
  CostAuditLog,
  GlobalCostFilter,
  WhatIfCostSimulationInput,
  WhatIfCostSimulationResult,
  CostCategoryKey,
  AllocationMethod,
} from '../types';
import {
  mockCostCategories,
  mockCostRecords,
  mockFuelPriceHistory,
  mockFuelCostMetrics,
  mockMaintenanceCostMetrics,
  mockDriverCostMetrics,
  mockCostPerKmMetrics,
  mockCostPerTripMetrics,
  mockBranchCostMetrics,
  mockRouteCostMetrics,
  mockVehicleCostProfiles,
  mockCostBudgetVariances,
  mockCostAuditLogs,
} from '../data/mockCostData';
import { CostCalculationEngine } from '../engines/CostCalculationEngine';
import { CostAllocationEngine, AllocationTarget } from '../engines/CostAllocationEngine';
import { CostForecastEngine } from '../engines/CostForecastEngine';
import { AICostIntelligenceEngine } from '../engines/AICostIntelligenceEngine';
import { CostReconciliationEngine } from '../engines/CostReconciliationEngine';
import { CostExportService } from '../engines/CostExportService';

export type CostTabKey =
  | 'dashboard'
  | 'fuel'
  | 'maintenance'
  | 'driver'
  | 'per_km'
  | 'per_trip'
  | 'operating'
  | 'vehicles'
  | 'branches'
  | 'routes'
  | 'trends'
  | 'allocation'
  | 'forecast'
  | 'ai_insights'
  | 'reports';

interface CostContextType {
  activeTab: CostTabKey;
  setActiveTab: (tab: CostTabKey) => void;
  filter: GlobalCostFilter;
  setFilter: React.Dispatch<React.SetStateAction<GlobalCostFilter>>;
  resetFilter: () => void;
  isFilterDrawerOpen: boolean;
  setIsFilterDrawerOpen: (open: boolean) => void;

  // Data Records & Configs
  costRecords: CostRecord[];
  categories: CostCategoryConfig[];
  fuelPriceHistory: FuelPriceHistoryRecord[];
  fuelCostMetrics: FuelCostMetric[];
  maintenanceCostMetrics: MaintenanceCostMetric[];
  driverCostMetrics: DriverCostMetric[];
  costPerKmMetrics: CostPerKmMetric[];
  costPerTripMetrics: CostPerTripMetric[];
  branchCostMetrics: BranchCostMetric[];
  routeCostMetrics: RouteCostMetric[];
  vehicleCostProfiles: VehicleCostProfile[];
  budgetVariances: CostBudgetVariance[];
  forecastResults: CostForecastResult[];
  aiInsights: AICostInsight[];
  savingOpportunities: CostSavingOpportunity[];
  reconciliationItems: CostReconciliationItem[];
  auditLogs: CostAuditLog[];

  // Computed Summaries
  totalOperatingCostSummary: {
    totalIdr: number;
    byCategory: Record<CostCategoryKey, number>;
    byType: Record<string, number>;
    fixedTotalIdr: number;
    variableTotalIdr: number;
    semiVariableTotalIdr: number;
  };
  fleetAverageCostPerKm: number;
  fleetAverageCostPerTrip: number;
  canViewDriverSensitiveCost: boolean;

  // Actions & Mutations
  addCostRecord: (record: Omit<CostRecord, 'id' | 'createdAt'>) => CostRecord;
  updateCostRecord: (id: string, updates: Partial<CostRecord>) => void;
  deleteCostRecord: (id: string) => void;
  approveCostRecord: (id: string) => void;
  rejectCostRecord: (id: string, reason: string) => void;
  allocateCostRecord: (parentCostId: string, method: AllocationMethod, targets: AllocationTarget[]) => void;
  reverseCostAllocation: (parentCostId: string) => void;
  addCustomCategory: (category: Omit<CostCategoryConfig, 'id'>) => void;
  updateCategoryConfig: (id: string, updates: Partial<CostCategoryConfig>) => void;

  // What-If & Reconciliation
  whatIfResult: WhatIfCostSimulationResult | null;
  runWhatIfSimulation: (input: WhatIfCostSimulationInput) => WhatIfCostSimulationResult;
  runReconciliationAudit: () => void;

  // Modals State
  isAddCostModalOpen: boolean;
  setIsAddCostModalOpen: (open: boolean) => void;
  isApprovalModalOpen: boolean;
  setIsApprovalModalOpen: (open: boolean) => void;
  selectedCostForApproval: CostRecord | null;
  setSelectedCostForApproval: (cost: CostRecord | null) => void;
  isSavingCalculatorModalOpen: boolean;
  setIsSavingCalculatorModalOpen: (open: boolean) => void;
  isReconciliationModalOpen: boolean;
  setIsReconciliationModalOpen: (open: boolean) => void;
  isAllocationModalOpen: boolean;
  setIsAllocationModalOpen: (open: boolean) => void;
  selectedCostForAllocation: CostRecord | null;
  setSelectedCostForAllocation: (cost: CostRecord | null) => void;
  isAutomationModalOpen: boolean;
  setIsAutomationModalOpen: (open: boolean) => void;
  selectedInsightForAutomation: AICostInsight | null;
  setSelectedInsightForAutomation: (insight: AICostInsight | null) => void;

  // Utilities
  logAuditEvent: (action: CostAuditLog['action'], details: string, costRecordId?: string, amountIdr?: number) => void;
  exportCurrentData: (format: 'CSV' | 'EXCEL' | 'PDF' | 'JSON') => void;
}

const defaultFilter: GlobalCostFilter = {
  dateRange: 'THIS_MONTH',
  comparisonPeriod: 'PREVIOUS_PERIOD',
  branchId: 'ALL',
  vehicleGroupId: 'ALL',
  vehicleId: 'ALL',
  driverId: 'ALL',
  costCategory: 'ALL',
  costType: 'ALL',
  currency: 'IDR',
};

const CostContext = createContext<CostContextType | undefined>(undefined);

export const CostProvider: React.FC<{
  children: React.ReactNode;
  initialTab?: CostTabKey;
}> = ({ children, initialTab = 'dashboard' }) => {
  const { user } = useAuth();
  const { can, hasPermission } = useAuthorization();

  // Tab & Filters
  const [activeTab, setActiveTab] = useState<CostTabKey>(initialTab);
  const [filter, setFilter] = useState<GlobalCostFilter>(defaultFilter);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Core Data Collections
  const [costRecords, setCostRecords] = useState<CostRecord[]>(mockCostRecords);
  const [categories, setCategories] = useState<CostCategoryConfig[]>(mockCostCategories);
  const [fuelPriceHistory] = useState<FuelPriceHistoryRecord[]>(mockFuelPriceHistory);
  const [fuelCostMetrics] = useState<FuelCostMetric[]>(mockFuelCostMetrics);
  const [maintenanceCostMetrics] = useState<MaintenanceCostMetric[]>(mockMaintenanceCostMetrics);
  const [driverCostMetrics] = useState<DriverCostMetric[]>(mockDriverCostMetrics);
  const [costPerKmMetrics] = useState<CostPerKmMetric[]>(mockCostPerKmMetrics);
  const [costPerTripMetrics] = useState<CostPerTripMetric[]>(mockCostPerTripMetrics);
  const [branchCostMetrics] = useState<BranchCostMetric[]>(mockBranchCostMetrics);
  const [routeCostMetrics] = useState<RouteCostMetric[]>(mockRouteCostMetrics);
  const [vehicleCostProfiles] = useState<VehicleCostProfile[]>(mockVehicleCostProfiles);
  const [budgetVariances] = useState<CostBudgetVariance[]>(mockCostBudgetVariances);
  const [forecastResults] = useState<CostForecastResult[]>(() => CostForecastEngine.generateMultiHorizonForecasts());
  const [aiInsights, setAiInsights] = useState<AICostInsight[]>(() => AICostIntelligenceEngine.generateInsights());
  const [savingOpportunities] = useState<CostSavingOpportunity[]>(() => AICostIntelligenceEngine.calculateSavingOpportunities());
  const [reconciliationItems, setReconciliationItems] = useState<CostReconciliationItem[]>(() =>
    CostReconciliationEngine.runReconciliationAudit()
  );
  const [auditLogs, setAuditLogs] = useState<CostAuditLog[]>(mockCostAuditLogs);

  // Simulation State
  const [whatIfResult, setWhatIfResult] = useState<WhatIfCostSimulationResult | null>(null);

  // Modals
  const [isAddCostModalOpen, setIsAddCostModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [selectedCostForApproval, setSelectedCostForApproval] = useState<CostRecord | null>(null);
  const [isSavingCalculatorModalOpen, setIsSavingCalculatorModalOpen] = useState(false);
  const [isReconciliationModalOpen, setIsReconciliationModalOpen] = useState(false);
  const [isAllocationModalOpen, setIsAllocationModalOpen] = useState(false);
  const [selectedCostForAllocation, setSelectedCostForAllocation] = useState<CostRecord | null>(null);
  const [isAutomationModalOpen, setIsAutomationModalOpen] = useState(false);
  const [selectedInsightForAutomation, setSelectedInsightForAutomation] = useState<AICostInsight | null>(null);

  // RBAC Permission Check for Sensitive Driver Cost (Salaries/Overtime)
  const canViewDriverSensitiveCost = useMemo(() => {
    return (
      user?.role === 'super_admin' ||
      user?.role === 'company_admin' ||
      user?.role === 'finance' ||
      hasPermission('finance.view_driver_cost') ||
      hasPermission('finance.view')
    );
  }, [user, hasPermission]);

  // Log Audit Helper
  const logAuditEvent = useCallback(
    (action: CostAuditLog['action'], details: string, costRecordId?: string, amountIdr?: number) => {
      const newLog: CostAuditLog = {
        id: `aud_cst_${Date.now()}`,
        timestamp: new Date().toISOString(),
        userId: user?.id || 'usr_01',
        userName: user?.name || 'Super Administrator',
        userRole: user?.role || 'super_admin',
        action,
        details,
        costRecordId,
        amountIdr,
        ipAddress: '180.252.12.98',
      };
      setAuditLogs((prev) => [newLog, ...prev]);
    },
    [user]
  );

  // Filtered Cost Records
  const filteredCostRecords = useMemo(() => {
    return costRecords.filter((rec) => {
      if (filter.branchId && filter.branchId !== 'ALL' && rec.branchId !== filter.branchId) {
        return false;
      }
      if (filter.vehicleId && filter.vehicleId !== 'ALL' && rec.vehicleId !== filter.vehicleId) {
        return false;
      }
      if (filter.driverId && filter.driverId !== 'ALL' && rec.driverId !== filter.driverId) {
        return false;
      }
      if (filter.costCategory && filter.costCategory !== 'ALL' && rec.category !== filter.costCategory) {
        return false;
      }
      if (filter.costType && filter.costType !== 'ALL' && rec.type !== filter.costType) {
        return false;
      }
      return true;
    });
  }, [costRecords, filter]);

  // Summaries
  const totalOperatingCostSummary = useMemo(() => {
    return CostCalculationEngine.calculateTotalOperatingCost(filteredCostRecords);
  }, [filteredCostRecords]);

  const fleetAverageCostPerKm = useMemo(() => {
    const totalMileage = 124500;
    return Math.round(totalOperatingCostSummary.totalIdr / totalMileage) || 7420;
  }, [totalOperatingCostSummary]);

  const fleetAverageCostPerTrip = useMemo(() => {
    const totalTrips = 840;
    return Math.round(totalOperatingCostSummary.totalIdr / totalTrips) || 2840000;
  }, [totalOperatingCostSummary]);

  // Actions
  const addCostRecord = useCallback(
    (recordData: Omit<CostRecord, 'id' | 'createdAt'>): CostRecord => {
      const categoryConfig = categories.find((c) => c.key === recordData.category);
      const threshold = categoryConfig?.requiresApprovalThreshold || 5000000;
      const requiresApproval = recordData.amount >= threshold;

      const newRecord: CostRecord = {
        ...recordData,
        id: `cst_${Date.now().toString(36)}`,
        status: requiresApproval ? 'PENDING_APPROVAL' : 'APPROVED',
        requiresApproval,
        createdAt: new Date().toISOString(),
      };

      setCostRecords((prev) => [newRecord, ...prev]);
      logAuditEvent(
        'COST_CREATED',
        `Membuat entri biaya baru [${newRecord.category}] senilai Rp ${newRecord.amount.toLocaleString('id-ID')} (${newRecord.status})`,
        newRecord.id,
        newRecord.amount
      );
      return newRecord;
    },
    [categories, logAuditEvent]
  );

  const updateCostRecord = useCallback(
    (id: string, updates: Partial<CostRecord>) => {
      setCostRecords((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
      logAuditEvent('COST_EDITED', `Mengubah rincian entri biaya #${id}`, id, updates.amount);
    },
    [logAuditEvent]
  );

  const deleteCostRecord = useCallback(
    (id: string) => {
      setCostRecords((prev) => prev.filter((r) => r.id !== id));
      logAuditEvent('COST_REVERSED', `Menghapus entri biaya #${id}`, id);
    },
    [logAuditEvent]
  );

  const approveCostRecord = useCallback(
    (id: string) => {
      setCostRecords((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status: 'APPROVED',
                approvedBy: user?.name || 'Super Administrator',
                approvedAt: new Date().toISOString(),
              }
            : r
        )
      );
      const target = costRecords.find((r) => r.id === id);
      logAuditEvent('COST_APPROVED', `Menyetujui pengeluaran biaya #${id} senilai Rp ${target?.amount.toLocaleString('id-ID')}`, id, target?.amount);
    },
    [costRecords, user, logAuditEvent]
  );

  const rejectCostRecord = useCallback(
    (id: string, reason: string) => {
      setCostRecords((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status: 'REJECTED',
                rejectedReason: reason,
              }
            : r
        )
      );
      const target = costRecords.find((r) => r.id === id);
      logAuditEvent('COST_REJECTED', `Menolak pengeluaran biaya #${id}: ${reason}`, id, target?.amount);
    },
    [costRecords, logAuditEvent]
  );

  const allocateCostRecord = useCallback(
    (parentCostId: string, method: AllocationMethod, targets: AllocationTarget[]) => {
      const parent = costRecords.find((r) => r.id === parentCostId);
      if (!parent) return;

      const { updatedParent, childRecords } = CostAllocationEngine.allocateCostRecord(
        parent,
        method,
        targets,
        user?.name || 'Super Administrator'
      );

      setCostRecords((prev) => [updatedParent, ...childRecords, ...prev.filter((r) => r.id !== parentCostId)]);
      logAuditEvent(
        'COST_ALLOCATED',
        `Mengalokasikan biaya #${parentCostId} (${method}) menjadi ${childRecords.length} entri turunan unit/trip`,
        parentCostId,
        parent.amount
      );
    },
    [costRecords, user, logAuditEvent]
  );

  const reverseCostAllocation = useCallback(
    (parentCostId: string) => {
      const parent = costRecords.find((r) => r.id === parentCostId);
      if (!parent) return;

      const { updatedParent, remainingRecords } = CostAllocationEngine.reverseAllocation(parent, costRecords);
      setCostRecords([updatedParent, ...remainingRecords.filter((r) => r.id !== parentCostId)]);
      logAuditEvent('COST_REVERSED', `Membatalkan alokasi biaya induk #${parentCostId}`, parentCostId);
    },
    [costRecords, logAuditEvent]
  );

  const addCustomCategory = useCallback((categoryData: Omit<CostCategoryConfig, 'id'>) => {
    const newCat: CostCategoryConfig = {
      ...categoryData,
      id: `cat_cust_${Date.now()}`,
      isCustom: true,
      isActive: true,
      isArchived: false,
    };
    setCategories((prev) => [...prev, newCat]);
  }, []);

  const updateCategoryConfig = useCallback((id: string, updates: Partial<CostCategoryConfig>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  const runWhatIfSimulation = useCallback(
    (input: WhatIfCostSimulationInput): WhatIfCostSimulationResult => {
      const result = CostForecastEngine.runWhatIfSimulation(input, totalOperatingCostSummary.totalIdr || 428500000);
      setWhatIfResult(result);
      logAuditEvent('RECONCILIATION_RUN', `Menjalankan simulasi What-If biaya: ${input.scenarioName}`);
      return result;
    },
    [totalOperatingCostSummary, logAuditEvent]
  );

  const runReconciliationAudit = useCallback(() => {
    const items = CostReconciliationEngine.runReconciliationAudit();
    setReconciliationItems(items);
    logAuditEvent('RECONCILIATION_RUN', `Menjalankan audit rekonsiliasi sensor telematika BBM vs kuitansi.`);
  }, [logAuditEvent]);

  const resetFilter = useCallback(() => {
    setFilter(defaultFilter);
  }, []);

  const exportCurrentData = useCallback(
    (format: 'CSV' | 'EXCEL' | 'PDF' | 'JSON') => {
      const filename = `Fleet_Cost_Analytics_${activeTab}_${new Date().toISOString().split('T')[0]}`;
      if (format === 'CSV') {
        CostExportService.exportToCsv(filteredCostRecords, filename);
      } else if (format === 'EXCEL') {
        CostExportService.exportToExcel(filteredCostRecords, filename);
      } else if (format === 'JSON') {
        CostExportService.exportToJson(
          {
            summary: totalOperatingCostSummary,
            records: filteredCostRecords,
            fleetAverageCostPerKm,
            fleetAverageCostPerTrip,
          },
          filename
        );
      } else if (format === 'PDF') {
        CostExportService.triggerPrintReport(filename);
      }
      logAuditEvent('COST_EXPORTED', `Mengekspor data biaya tab [${activeTab}] format ${format}`);
    },
    [activeTab, filteredCostRecords, totalOperatingCostSummary, fleetAverageCostPerKm, fleetAverageCostPerTrip, logAuditEvent]
  );

  const value = useMemo(
    () => ({
      activeTab,
      setActiveTab,
      filter,
      setFilter,
      resetFilter,
      isFilterDrawerOpen,
      setIsFilterDrawerOpen,
      costRecords: filteredCostRecords,
      categories,
      fuelPriceHistory,
      fuelCostMetrics,
      maintenanceCostMetrics,
      driverCostMetrics,
      costPerKmMetrics,
      costPerTripMetrics,
      branchCostMetrics,
      routeCostMetrics,
      vehicleCostProfiles,
      budgetVariances,
      forecastResults,
      aiInsights,
      savingOpportunities,
      reconciliationItems,
      auditLogs,
      totalOperatingCostSummary,
      fleetAverageCostPerKm,
      fleetAverageCostPerTrip,
      canViewDriverSensitiveCost,
      addCostRecord,
      updateCostRecord,
      deleteCostRecord,
      approveCostRecord,
      rejectCostRecord,
      allocateCostRecord,
      reverseCostAllocation,
      addCustomCategory,
      updateCategoryConfig,
      whatIfResult,
      runWhatIfSimulation,
      runReconciliationAudit,
      isAddCostModalOpen,
      setIsAddCostModalOpen,
      isApprovalModalOpen,
      setIsApprovalModalOpen,
      selectedCostForApproval,
      setSelectedCostForApproval,
      isSavingCalculatorModalOpen,
      setIsSavingCalculatorModalOpen,
      isReconciliationModalOpen,
      setIsReconciliationModalOpen,
      isAllocationModalOpen,
      setIsAllocationModalOpen,
      selectedCostForAllocation,
      setSelectedCostForAllocation,
      isAutomationModalOpen,
      setIsAutomationModalOpen,
      selectedInsightForAutomation,
      setSelectedInsightForAutomation,
      logAuditEvent,
      exportCurrentData,
    }),
    [
      activeTab,
      filter,
      resetFilter,
      isFilterDrawerOpen,
      filteredCostRecords,
      categories,
      fuelPriceHistory,
      fuelCostMetrics,
      maintenanceCostMetrics,
      driverCostMetrics,
      costPerKmMetrics,
      costPerTripMetrics,
      branchCostMetrics,
      routeCostMetrics,
      vehicleCostProfiles,
      budgetVariances,
      forecastResults,
      aiInsights,
      savingOpportunities,
      reconciliationItems,
      auditLogs,
      totalOperatingCostSummary,
      fleetAverageCostPerKm,
      fleetAverageCostPerTrip,
      canViewDriverSensitiveCost,
      addCostRecord,
      updateCostRecord,
      deleteCostRecord,
      approveCostRecord,
      rejectCostRecord,
      allocateCostRecord,
      reverseCostAllocation,
      addCustomCategory,
      updateCategoryConfig,
      whatIfResult,
      runWhatIfSimulation,
      runReconciliationAudit,
      isAddCostModalOpen,
      isApprovalModalOpen,
      selectedCostForApproval,
      isSavingCalculatorModalOpen,
      isReconciliationModalOpen,
      isAllocationModalOpen,
      selectedCostForAllocation,
      isAutomationModalOpen,
      selectedInsightForAutomation,
      logAuditEvent,
      exportCurrentData,
    ]
  );

  return <CostContext.Provider value={value}>{children}</CostContext.Provider>;
};

export const useCost = (): CostContextType => {
  const context = useContext(CostContext);
  if (!context) {
    throw new Error('useCost must be used within a CostProvider');
  }
  return context;
};
