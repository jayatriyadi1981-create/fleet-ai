/**
 * Fleet Intelligence Smart AI - Global Analytics Context Provider
 * PROMPT 36
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {
  AnalyticsTab,
  GlobalAnalyticsFilter,
  IndustryProfileType,
  UtilizationFormulaType,
  ProductivityWeightConfig,
  FleetKPIOverview,
  AnalyticsSnapshot,
  VehicleUtilizationMetric,
  MileageReconciliationRecord,
  TripPerformanceMetric,
  IdleEventMetric,
  DowntimeEventMetric,
  BranchPerformanceMatrix,
  DriverProductivityMetric,
  CustomKPIConfig,
  AnalyticsAIInsight,
  DailyBriefingData,
  WhatIfScenarioInput,
  WhatIfScenarioResult,
  AnalyticsAuditLog,
} from '../types';
import {
  MOCK_DAILY_SNAPSHOTS,
  MOCK_VEHICLE_UTILIZATION,
  MOCK_MILEAGE_RECONCILIATION,
  MOCK_TRIP_ANALYTICS,
  MOCK_IDLE_EVENTS,
  MOCK_DOWNTIME_EVENTS,
  MOCK_BRANCH_MATRICES,
  MOCK_DRIVER_PRODUCTIVITY,
  MOCK_CUSTOM_KPIS,
  MOCK_AI_ANALYTICS_INSIGHTS,
  MOCK_DAILY_BRIEFING,
} from '../data/mockAnalyticsData';
import { fleetAnalyticsEngine } from '../engines/FleetAnalyticsEngine';
import { analyticsAIIntelligenceEngine } from '../engines/AnalyticsAIIntelligenceEngine';
import { AnalyticsExportService } from '../engines/AnalyticsExportService';
import { useAuth } from '../../../context/AuthContext';

const DEFAULT_GLOBAL_FILTER: GlobalAnalyticsFilter = {
  datePreset: 'this_month',
  startDate: '2026-08-01',
  endDate: '2026-08-16',
  comparisonMode: 'previous_period',
  industryProfile: 'LOGISTICS',
  tenantId: 'TENANT-DEMO-01',
  branchIds: [],
  departmentIds: [],
  vehicleGroupIds: [],
  vehicleTypes: [],
  vehicleIds: [],
  driverIds: [],
  routeIds: [],
  customerIds: [],
};

const DEFAULT_PRODUCTIVITY_WEIGHTS: ProductivityWeightConfig = {
  utilizationWeight: 0.3,
  tripCompletionWeight: 0.2,
  onTimeWeight: 0.2,
  idleWeight: 0.1,
  downtimeWeight: 0.1,
  availabilityWeight: 0.1,
};

interface AnalyticsContextType {
  activeTab: AnalyticsTab;
  setActiveTab: (tab: AnalyticsTab) => void;
  filter: GlobalAnalyticsFilter;
  setFilter: React.Dispatch<React.SetStateAction<GlobalAnalyticsFilter>>;
  resetFilter: () => void;
  savedPresets: Array<{ id: string; name: string; filter: GlobalAnalyticsFilter }>;
  saveFilterPreset: (name: string) => void;
  applyPreset: (id: string) => void;
  industryProfile: IndustryProfileType;
  setIndustryProfile: (profile: IndustryProfileType) => void;
  utilizationFormula: UtilizationFormulaType;
  setUtilizationFormula: (formula: UtilizationFormulaType) => void;
  productivityWeights: ProductivityWeightConfig;
  setProductivityWeights: (weights: ProductivityWeightConfig) => void;
  underutilizedThreshold: number;
  setUnderutilizedThreshold: (val: number) => void;
  idleThresholdMinutes: number;
  setIdleThresholdMinutes: (val: number) => void;
  kpiOverview: FleetKPIOverview;
  snapshots: AnalyticsSnapshot[];
  vehicles: VehicleUtilizationMetric[];
  mileageReconciliations: MileageReconciliationRecord[];
  tripAnalytics: TripPerformanceMetric[];
  idleEvents: IdleEventMetric[];
  downtimeEvents: DowntimeEventMetric[];
  branchMatrices: BranchPerformanceMatrix[];
  driverProductivity: DriverProductivityMetric[];
  customKPIs: CustomKPIConfig[];
  customKpis: CustomKPIConfig[];
  addCustomKPI: (kpi: Omit<CustomKPIConfig, 'id' | 'createdAt'> | CustomKPIConfig) => void;
  addCustomKpi: (kpi: Omit<CustomKPIConfig, 'id' | 'createdAt'> | CustomKPIConfig) => void;
  updateCustomKPI: (id: string, kpi: Partial<CustomKPIConfig>) => void;
  deleteCustomKPI: (id: string) => void;
  aiInsights: AnalyticsAIInsight[];
  insights: AnalyticsAIInsight[];
  acknowledgeAIInsight: (id: string) => void;
  dailyBriefing: DailyBriefingData;
  isFilterDrawerOpen: boolean;
  setIsFilterDrawerOpen: (open: boolean) => void;
  isCustomKpiModalOpen: boolean;
  setIsCustomKpiModalOpen: (open: boolean) => void;
  isWhatIfModalOpen: boolean;
  setIsWhatIfModalOpen: (open: boolean) => void;
  isAutomationTriggerModalOpen: boolean;
  setIsAutomationTriggerModalOpen: (open: boolean) => void;
  isAutomationModalOpen: boolean;
  setIsAutomationModalOpen: (open: boolean) => void;
  selectedAutomationInsight: AnalyticsAIInsight | null;
  setSelectedAutomationInsight: (insight: AnalyticsAIInsight | null) => void;
  selectedInsightForAutomation: AnalyticsAIInsight | null;
  setSelectedInsightForAutomation: (insight: AnalyticsAIInsight | null) => void;
  whatIfResult: WhatIfScenarioResult | null;
  runWhatIf: (input: WhatIfScenarioInput) => WhatIfScenarioResult | void;
  currentScopeContext: Record<string, number>;
  auditLogs: AnalyticsAuditLog[];
  logAuditEvent: (action: AnalyticsAuditLog['action'], details: string) => void;
  exportCurrentData: (format: 'CSV' | 'EXCEL' | 'PDF' | 'JSON') => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export interface AnalyticsProviderProps {
  children: ReactNode;
  initialTab?: AnalyticsTab;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children, initialTab = 'dashboard' }) => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<AnalyticsTab>(() => {
    return initialTab;
  });

  useEffect(() => {
    if (initialTab && initialTab !== activeTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const [filter, setFilter] = useState<GlobalAnalyticsFilter>(() => {
    const saved = localStorage.getItem('fleet_analytics_global_filter');
    return saved ? JSON.parse(saved) : DEFAULT_GLOBAL_FILTER;
  });

  useEffect(() => {
    localStorage.setItem('fleet_analytics_global_filter', JSON.stringify(filter));
  }, [filter]);

  const [savedPresets, setSavedPresets] = useState<Array<{ id: string; name: string; filter: GlobalAnalyticsFilter }>>(() => {
    const saved = localStorage.getItem('fleet_analytics_presets');
    return saved ? JSON.parse(saved) : [
      { id: 'pres_01', name: 'Depo Jakarta & Truk Berat', filter: { ...DEFAULT_GLOBAL_FILTER, branchIds: ['br_jkt'] } },
      { id: 'pres_02', name: 'Operasional Minggu Ini (Semua Depo)', filter: { ...DEFAULT_GLOBAL_FILTER, datePreset: 'this_week' } },
    ];
  });

  const [industryProfile, setIndustryProfile] = useState<IndustryProfileType>(() => {
    const saved = localStorage.getItem('fleet_analytics_industry');
    return (saved as IndustryProfileType) || 'LOGISTICS';
  });

  useEffect(() => {
    localStorage.setItem('fleet_analytics_industry', industryProfile);
  }, [industryProfile]);

  const [utilizationFormula, setUtilizationFormula] = useState<UtilizationFormulaType>('TIME_BASED');
  const [productivityWeights, setProductivityWeights] = useState<ProductivityWeightConfig>(DEFAULT_PRODUCTIVITY_WEIGHTS);
  const [underutilizedThreshold, setUnderutilizedThreshold] = useState<number>(60.0);
  const [idleThresholdMinutes, setIdleThresholdMinutes] = useState<number>(5);

  const [snapshots] = useState<AnalyticsSnapshot[]>(MOCK_DAILY_SNAPSHOTS);
  const [vehicles, setVehicles] = useState<VehicleUtilizationMetric[]>(MOCK_VEHICLE_UTILIZATION);
  const [mileageReconciliations] = useState<MileageReconciliationRecord[]>(MOCK_MILEAGE_RECONCILIATION);
  const [tripAnalytics] = useState<TripPerformanceMetric[]>(MOCK_TRIP_ANALYTICS);
  const [idleEvents] = useState<IdleEventMetric[]>(MOCK_IDLE_EVENTS);
  const [downtimeEvents] = useState<DowntimeEventMetric[]>(MOCK_DOWNTIME_EVENTS);
  const [branchMatrices] = useState<BranchPerformanceMatrix[]>(MOCK_BRANCH_MATRICES);
  const [driverProductivity] = useState<DriverProductivityMetric[]>(MOCK_DRIVER_PRODUCTIVITY);

  const [customKPIs, setCustomKPIs] = useState<CustomKPIConfig[]>(() => {
    const saved = localStorage.getItem('fleet_analytics_custom_kpis');
    return saved ? JSON.parse(saved) : MOCK_CUSTOM_KPIS;
  });

  useEffect(() => {
    localStorage.setItem('fleet_analytics_custom_kpis', JSON.stringify(customKPIs));
  }, [customKPIs]);

  const [aiInsights, setAiInsights] = useState<AnalyticsAIInsight[]>(() => {
    return analyticsAIIntelligenceEngine.generateInsights(MOCK_VEHICLE_UTILIZATION, MOCK_BRANCH_MATRICES);
  });

  const [dailyBriefing] = useState<DailyBriefingData>(() => {
    return analyticsAIIntelligenceEngine.getDailyBriefing(MOCK_VEHICLE_UTILIZATION);
  });

  // Modal / Drawer States
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isCustomKpiModalOpen, setIsCustomKpiModalOpen] = useState(false);
  const [isWhatIfModalOpen, setIsWhatIfModalOpen] = useState(false);
  const [isAutomationTriggerModalOpen, setIsAutomationTriggerModalOpen] = useState(false);
  const [selectedAutomationInsight, setSelectedAutomationInsight] = useState<AnalyticsAIInsight | null>(null);
  const [whatIfResult, setWhatIfResult] = useState<WhatIfScenarioResult | null>(null);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AnalyticsAuditLog[]>(() => {
    const saved = localStorage.getItem('fleet_analytics_audit_logs');
    return saved ? JSON.parse(saved) : [
      {
        id: 'aud_01',
        timestamp: new Date().toISOString(),
        userId: user?.id || 'usr_01',
        userName: user?.name || 'Super Administrator',
        userRole: user?.role || 'super_admin',
        action: 'VIEWED',
        details: 'Membuka Dashboard Analitik Telematika Global',
      },
    ];
  });

  const logAuditEvent = (action: AnalyticsAuditLog['action'], details: string) => {
    const newLog: AnalyticsAuditLog = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: user?.id || 'usr_01',
      userName: user?.name || 'Operator',
      userRole: user?.role || 'operations',
      action,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  useEffect(() => {
    localStorage.setItem('fleet_analytics_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Recalculate KPIs whenever snapshots or filter change
  const kpiOverview = useMemo(() => {
    return fleetAnalyticsEngine.computeKPIOverview(snapshots, filter);
  }, [snapshots, filter]);

  // Recalculate Vehicle ranking dynamically when weights or formulas change
  useEffect(() => {
    setVehicles((prev) => {
      const updated = prev.map((v) => {
        const util = fleetAnalyticsEngine.calculateUtilization(v, utilizationFormula);
        const prod = fleetAnalyticsEngine.computeWeightedProductivity(v, productivityWeights);
        let status = v.status;
        if (util < underutilizedThreshold * 0.75) {
          status = 'CRITICAL_UNDERUTILIZED';
        } else if (util < underutilizedThreshold) {
          status = 'UNDERUTILIZED';
        } else if (util > 95) {
          status = 'OVERUTILIZED';
        } else {
          status = 'HEALTHY';
        }

        return {
          ...v,
          utilizationRate: util,
          productivityScore: prod,
          status,
        };
      });

      // Sort by productivity descending
      updated.sort((a, b) => b.productivityScore - a.productivityScore);
      return updated.map((item, idx) => ({ ...item, rank: idx + 1 }));
    });
  }, [utilizationFormula, productivityWeights, underutilizedThreshold]);

  const resetFilter = () => {
    setFilter(DEFAULT_GLOBAL_FILTER);
    logAuditEvent('FILTER_APPLIED', 'Mereset filter analitik ke pengaturan default');
  };

  const saveFilterPreset = (name: string) => {
    const newPreset = {
      id: `pres_${Date.now()}`,
      name,
      filter: { ...filter },
    };
    const updated = [newPreset, ...savedPresets];
    setSavedPresets(updated);
    localStorage.setItem('fleet_analytics_presets', JSON.stringify(updated));
    logAuditEvent('FILTER_APPLIED', `Menyimpan filter preset baru: ${name}`);
  };

  const applyPreset = (id: string) => {
    const p = savedPresets.find((item) => item.id === id);
    if (p) {
      setFilter(p.filter);
      logAuditEvent('FILTER_APPLIED', `Menerapkan filter preset: ${p.name}`);
    }
  };

  const addCustomKPI = (kpiData: Omit<CustomKPIConfig, 'id' | 'createdAt'>) => {
    const newKpi: CustomKPIConfig = {
      ...kpiData,
      id: `kpi_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setCustomKPIs((prev) => [...prev, newKpi]);
    logAuditEvent('CUSTOM_KPI_CREATED', `Membuat custom KPI: ${newKpi.name} (${newKpi.formulaExpression})`);
  };

  const updateCustomKPI = (id: string, kpiData: Partial<CustomKPIConfig>) => {
    setCustomKPIs((prev) => prev.map((k) => (k.id === id ? { ...k, ...kpiData } : k)));
    logAuditEvent('CUSTOM_KPI_UPDATED', `Mengubah formula/target KPI ID: ${id}`);
  };

  const deleteCustomKPI = (id: string) => {
    setCustomKPIs((prev) => prev.filter((k) => k.id !== id));
  };

  const acknowledgeAIInsight = (id: string) => {
    setAiInsights((prev) => prev.map((ins) => (ins.id === id ? { ...ins, acknowledged: true } : ins)));
    logAuditEvent('AI_INSIGHT_TRIGGERED', `Mengonfirmasi & meninjau AI Insight ID: ${id}`);
  };

  const runWhatIf = (input: WhatIfScenarioInput) => {
    const result = analyticsAIIntelligenceEngine.runWhatIfScenario(input, branchMatrices, vehicles);
    setWhatIfResult(result);
    logAuditEvent('WHAT_IF_EXECUTED', `Menjalankan skenario simulasi: ${input.scenarioName}`);
    return result;
  };

  const currentScopeContext = useMemo(() => ({
    totalMileageKm: 124500,
    completedTrips: 840,
    totalFuelLiters: 28400,
    totalCostIdr: 428500000,
    idleHours: 340,
    operatingHours: 4200,
    activeVehicles: 48,
    utilizationRate: 78.4,
  }), []);

  const exportCurrentData = (format: 'CSV' | 'EXCEL' | 'PDF' | 'JSON') => {
    const filename = `Fleet_Analytics_${activeTab}_${filter.industryProfile}`;
    logAuditEvent('REPORT_EXPORTED', `Mengekspor laporan tab [${activeTab}] format ${format}`);

    if (format === 'CSV' || format === 'EXCEL') {
      let rows: any[] = [];
      if (activeTab === 'vehicles' || activeTab === 'utilization' || activeTab === 'productivity') {
        rows = vehicles;
      } else if (activeTab === 'mileage') {
        rows = mileageReconciliations;
      } else if (activeTab === 'trips') {
        rows = tripAnalytics;
      } else if (activeTab === 'idle') {
        rows = idleEvents;
      } else if (activeTab === 'downtime') {
        rows = downtimeEvents;
      } else if (activeTab === 'branches') {
        rows = branchMatrices;
      } else if (activeTab === 'drivers') {
        rows = driverProductivity;
      } else {
        rows = snapshots;
      }
      AnalyticsExportService.exportToCsv(filename, rows);
    } else if (format === 'JSON') {
      AnalyticsExportService.exportToJson(filename, {
        kpiOverview,
        vehicles,
        branchMatrices,
        driverProductivity,
        snapshots,
      });
    } else if (format === 'PDF') {
      AnalyticsExportService.triggerPrintReport();
    }
  };

  return (
    <AnalyticsContext.Provider
      value={{
        activeTab,
        setActiveTab,
        filter,
        setFilter,
        resetFilter,
        savedPresets,
        saveFilterPreset,
        applyPreset,
        industryProfile,
        setIndustryProfile,
        utilizationFormula,
        setUtilizationFormula,
        productivityWeights,
        setProductivityWeights,
        underutilizedThreshold,
        setUnderutilizedThreshold,
        idleThresholdMinutes,
        setIdleThresholdMinutes,
        kpiOverview,
        snapshots,
        vehicles,
        mileageReconciliations,
        tripAnalytics,
        idleEvents,
        downtimeEvents,
        branchMatrices,
        driverProductivity,
        customKPIs,
        customKpis: customKPIs,
        addCustomKPI,
        addCustomKpi: addCustomKPI,
        updateCustomKPI,
        deleteCustomKPI,
        aiInsights,
        insights: aiInsights,
        acknowledgeAIInsight,
        dailyBriefing,
        isFilterDrawerOpen,
        setIsFilterDrawerOpen,
        isCustomKpiModalOpen,
        setIsCustomKpiModalOpen,
        isWhatIfModalOpen,
        setIsWhatIfModalOpen,
        isAutomationTriggerModalOpen,
        setIsAutomationTriggerModalOpen,
        isAutomationModalOpen: isAutomationTriggerModalOpen,
        setIsAutomationModalOpen: setIsAutomationTriggerModalOpen,
        selectedAutomationInsight,
        setSelectedAutomationInsight,
        selectedInsightForAutomation: selectedAutomationInsight,
        setSelectedInsightForAutomation: setSelectedAutomationInsight,
        whatIfResult,
        runWhatIf,
        currentScopeContext,
        auditLogs,
        logAuditEvent,
        exportCurrentData,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = (): AnalyticsContextType => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};
