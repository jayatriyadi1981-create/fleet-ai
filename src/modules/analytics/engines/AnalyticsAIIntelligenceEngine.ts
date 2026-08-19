/**
 * Fleet Intelligence Smart AI - AI Analytics & Intelligence Engine
 * PROMPT 36
 */

import {
  AnalyticsAIInsight,
  WhatIfScenarioInput,
  WhatIfScenarioResult,
  DailyBriefingData,
  VehicleUtilizationMetric,
  BranchPerformanceMatrix,
} from '../types';
import {
  MOCK_AI_ANALYTICS_INSIGHTS,
  MOCK_DAILY_BRIEFING,
  MOCK_VEHICLE_UTILIZATION,
  MOCK_BRANCH_MATRICES,
} from '../data/mockAnalyticsData';

export class AnalyticsAIIntelligenceEngine {
  private static instance: AnalyticsAIIntelligenceEngine;

  public static getInstance(): AnalyticsAIIntelligenceEngine {
    if (!AnalyticsAIIntelligenceEngine.instance) {
      AnalyticsAIIntelligenceEngine.instance = new AnalyticsAIIntelligenceEngine();
    }
    return AnalyticsAIIntelligenceEngine.instance;
  }

  /**
   * Generates or refreshes proactive AI Insights based on current metrics
   */
  public generateInsights(
    vehicles: VehicleUtilizationMetric[] = MOCK_VEHICLE_UTILIZATION,
    branches: BranchPerformanceMatrix[] = MOCK_BRANCH_MATRICES
  ): AnalyticsAIInsight[] {
    const dynamicInsights: AnalyticsAIInsight[] = [...MOCK_AI_ANALYTICS_INSIGHTS];

    // Detect critical underutilized vehicles dynamically
    const criticalUnderutilized = vehicles.filter((v) => v.status === 'CRITICAL_UNDERUTILIZED' || v.utilizationRate < 50);
    if (criticalUnderutilized.length > 0 && !dynamicInsights.some((i) => i.id === 'dyn_underutilized')) {
      dynamicInsights.push({
        id: 'dyn_underutilized',
        title: `Deteksi ${criticalUnderutilized.length} Kendaraan dengan Utilisasi Kritis (<50%)`,
        category: 'UTILIZATION',
        severity: 'HIGH',
        headline: `${criticalUnderutilized.map((v) => v.plateNumber).join(', ')} mengalami tingkat utilisasi di bawah standar target.`,
        evidence: criticalUnderutilized.map(
          (v) => `Unit ${v.plateNumber} (${v.branchName}) mencatat utilisasi ${v.utilizationRate}% dan idle ${v.idleHours} jam.`
        ),
        metricsInvolved: {
          affectedVehiclesCount: criticalUnderutilized.length,
          avgUtilization: `${Math.round(criticalUnderutilized.reduce((a, b) => a + b.utilizationRate, 0) / criticalUnderutilized.length)}%`,
        },
        possibleCause: 'Kemungkinan penyebab: Kurangnya jadwal penugasan trip di cabang terkait atau hambatan operasional penyerahan kargo.',
        recommendations: [
          {
            text: 'Jalankan simulasi What-If untuk relokasi unit ke cabang dengan backlog penugasan tinggi.',
            expectedImpact: 'Meningkatkan produktivitas keseluruhan armada hingga +4.5%.',
            actionType: 'RUN_WHAT_IF',
          },
          {
            text: 'Buat aturan automasi PROMPT 35 untuk notifikasi armada menganggur > 3 hari.',
            expectedImpact: 'Memangkas waktu idle terbuang dan biaya depresiasi unit.',
            actionType: 'CREATE_AUTOMATION',
          },
        ],
        confidenceScore: 0.95,
        generatedAt: new Date().toISOString(),
        acknowledged: false,
      });
    }

    return dynamicInsights;
  }

  /**
   * Executes What-If Fleet Scenario simulation
   */
  public runWhatIfScenario(
    input: WhatIfScenarioInput,
    branches: BranchPerformanceMatrix[] = MOCK_BRANCH_MATRICES,
    vehicles: VehicleUtilizationMetric[] = MOCK_VEHICLE_UTILIZATION
  ): WhatIfScenarioResult {
    const sourceBranch = branches.find((b) => b.branchId === input.sourceBranchId) || branches[2];
    const targetBranch = branches.find((b) => b.branchId === input.targetBranchId) || branches[0];

    const baselineUtilization = Math.round(((sourceBranch.utilizationRate + targetBranch.utilizationRate) / 2) * 10) / 10;
    const baselineTrips = sourceBranch.completedTrips + targetBranch.completedTrips;
    const baselineMileage = sourceBranch.totalMileageKm + targetBranch.totalMileageKm;
    const baselineDowntime = Math.round(((sourceBranch.downtimePercent + targetBranch.downtimePercent) / 2) * 24);

    // Projected calculations
    const reallocatedCount = input.vehiclesCountToReallocate || 2;
    const demandBonus = (input.expectedDemandIncreasePercent || 15) * 0.01;
    
    // Utilization increases because dormant units get assigned in high-demand hub
    const projectedUtilization = Math.min(94.5, Math.round((baselineUtilization + reallocatedCount * 1.8 + demandBonus * 5) * 10) / 10);
    const projectedTrips = Math.round(baselineTrips * (1 + demandBonus * 0.6) + reallocatedCount * 18);
    const projectedMileage = Math.round(baselineMileage * (1 + demandBonus * 0.5) + reallocatedCount * 2200);
    const projectedDowntime = Math.max(8, Math.round(baselineDowntime * (1 - (input.maintenanceCapacityAdjustmentPercent || 10) * 0.005)));

    const savingsPerTrip = 145000;
    const additionalTrips = projectedTrips - baselineTrips;
    const estimatedMonthlySavingsIdr = Math.round(additionalTrips * savingsPerTrip + reallocatedCount * 4500000);

    return {
      scenarioId: `scen_${Date.now()}`,
      scenarioName: input.scenarioName || 'Simulasi Optimalisasi Utilisasi Antar-Cabang',
      baselineUtilization,
      projectedUtilization,
      baselineTrips,
      projectedTrips,
      baselineMileageKm: baselineMileage,
      projectedMileageKm: projectedMileage,
      baselineDowntimeHours: baselineDowntime,
      projectedDowntimeHours: projectedDowntime,
      estimatedMonthlySavingsIdr,
      confidenceLevel: 0.89,
      simulationNotes: `Estimasi matematis berdasarkan model elastisitas armada dan profil historis muatan ${targetBranch.branchName}.`,
    };
  }

  /**
   * Generates dynamic Daily Fleet Briefing
   */
  public getDailyBriefing(
    vehicles: VehicleUtilizationMetric[] = MOCK_VEHICLE_UTILIZATION
  ): DailyBriefingData {
    const underutilized = vehicles.filter((v) => v.status === 'UNDERUTILIZED' || v.status === 'CRITICAL_UNDERUTILIZED');
    const overutilized = vehicles.filter((v) => v.status === 'OVERUTILIZED');

    return {
      ...MOCK_DAILY_BRIEFING,
      summaryMetrics: {
        activeVehicles: vehicles.filter((v) => v.status === 'HEALTHY' || v.status === 'OVERUTILIZED').length * 8 + 2,
        inMaintenanceVehicles: 6,
        highRiskDrivers: 4,
        unusualIdleVehicles: underutilized.length,
        maintenanceRisks: overutilized.length + 1,
        fleetUtilization: 78.4,
      },
    };
  }
}

export const analyticsAIIntelligenceEngine = AnalyticsAIIntelligenceEngine.getInstance();
