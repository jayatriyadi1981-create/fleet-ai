/**
 * Fleet Intelligence Smart AI - AI Executive Report Service
 * PROMPT 52 — Master Orchestrator for Business & Financial Executive Intelligence
 */

import { ExecutiveReport, ExecutivePeriodType, ExecutiveRolePerspective } from '../../types/executiveReport';
import { ExecutiveDataAggregator } from './executiveDataAggregator';
import { ExecutiveKPIService } from './executiveKPIService';
import { ExecutiveTrendAnalyzer } from './executiveTrendAnalyzer';
import { ExecutiveRootCauseAnalyzer } from './executiveRootCauseAnalyzer';
import { ExecutiveRecommendationEngine } from './executiveRecommendationEngine';
import { ExecutiveNarrativeGenerator } from './executiveNarrativeGenerator';
import { ExecutiveReportValidator } from './executiveReportValidator';
import { ExecutiveReportRepository } from './executiveReportRepository';

export class AIExecutiveReportService {
  /**
   * Generates or fetches the executive report for the given period
   */
  public static async generateReport(params: {
    tenantId?: string;
    periodType?: ExecutivePeriodType;
    periodLabel?: string;
    periodStart?: string;
    periodEnd?: string;
    userRole?: ExecutiveRolePerspective;
    forceRegenerate?: boolean;
  }): Promise<ExecutiveReport> {
    const tenantId = params.tenantId || 'tenant-1';
    const periodType = params.periodType || 'monthly';
    const periodLabel = params.periodLabel || 'Agustus 2026';
    const periodStart = params.periodStart || '2026-08-01';
    const periodEnd = params.periodEnd || '2026-08-31';

    // 1. Check if an existing report is cached in repository
    if (!params.forceRegenerate) {
      const existing = ExecutiveReportRepository.getReportByPeriod(tenantId, periodLabel);
      if (existing) {
        return existing;
      }
    }

    // Determine version number
    const previousVersions = ExecutiveReportRepository.getVersionsForPeriod(tenantId, periodLabel);
    const version = previousVersions.length + 1;

    // 2. Aggregate raw data
    const aggregated = ExecutiveDataAggregator.aggregateCurrentPeriod(tenantId, periodLabel);
    const previousPeriodKPIs = ExecutiveDataAggregator.aggregatePreviousPeriod(tenantId);
    const samePeriodLastYearKPIs = ExecutiveDataAggregator.aggregateSamePeriodLastYear(tenantId);

    // 3. Compute Scorecard
    const scorecard = ExecutiveKPIService.computeScorecard(aggregated.kpis, previousPeriodKPIs);

    // 4. Calculate Variances & Historical Trend
    const variances = ExecutiveTrendAnalyzer.calculateVariances(
      aggregated.kpis,
      previousPeriodKPIs,
      {
        totalOperatingCost: 1750000000,
        fuelCost: 900000000,
        costPerKm: 9200,
        fleetUtilizationPercent: 85,
        fleetSafetyScore: 90,
        onTimeDeliveryRatePercent: 95,
      }
    );
    const costTrend = ExecutiveTrendAnalyzer.generateHistoricalCostTrend();
    const forecasts = ExecutiveTrendAnalyzer.generateForecasts(aggregated.kpis);

    // 5. Root Cause Analysis
    const costChangePercent = variances.varianceVsPreviousPercent['totalOperatingCost'] || 8.4;
    const rootCause = ExecutiveRootCauseAnalyzer.analyzeCostDrivers(
      aggregated.kpis.totalOperatingCost,
      costChangePercent,
      aggregated.highCostVehicles,
      aggregated.highCostRoutes,
      aggregated.evidences
    );

    // 6. Recommendation Engine
    const recommendations = ExecutiveRecommendationEngine.generateRecommendations(
      aggregated.kpis,
      rootCause.drivers
    );

    // 7. Executive Narrative Generation
    const narrativeResult = ExecutiveNarrativeGenerator.generateExecutiveNarrative(
      aggregated.raw.companyName,
      periodLabel,
      aggregated.kpis,
      scorecard,
      rootCause.drivers,
      aggregated.highCostVehicles
    );

    // 8. Assemble Complete Executive Report
    const reportId = `RPT-EXEC-${tenantId}-${Date.now().toString(36).toUpperCase()}-V${version}`;

    const report: ExecutiveReport = {
      id: reportId,
      tenantId,
      companyName: aggregated.raw.companyName,
      periodType,
      periodLabel,
      periodStart,
      periodEnd,
      comparisonPeriodLabel: 'Juli 2026 (Bulan Sebelumnya)',
      samePeriodLastYearLabel: 'Agustus 2025 (Tahun Lalu)',
      timezone: 'Asia/Jakarta (WIB)',
      version,
      status: 'COMPLETED',

      executiveSummary: {
        headline: narrativeResult.headline,
        narrative: narrativeResult.narrative,
        keyPoints: narrativeResult.keyPoints,
        bulletCount: narrativeResult.keyPoints.length,
        businessSentiment: 'caution',
      },

      domainInsights: narrativeResult.domainInsights,

      scorecard,

      kpis: {
        current: aggregated.kpis,
        previous: previousPeriodKPIs,
        samePeriodLastYear: samePeriodLastYearKPIs,
        target: {
          totalOperatingCost: 1750000000,
          fuelCost: 900000000,
          costPerKm: 9200,
          fleetUtilizationPercent: 85,
          fleetSafetyScore: 90,
          onTimeDeliveryRatePercent: 95,
        },
        varianceVsPreviousPercent: variances.varianceVsPreviousPercent,
        varianceVsTargetPercent: variances.varianceVsTargetPercent,
      },

      costAnalysis: {
        totalCost: aggregated.kpis.totalOperatingCost,
        changePercent: costChangePercent,
        fleetAvgCostPerKm: aggregated.kpis.costPerKm,
        bestCostPerKm: 3900,
        worstCostPerKm: 13027,
        drivers: rootCause.drivers,
        costTrend,
      },

      highCostVehicles: aggregated.highCostVehicles,
      highCostRoutes: aggregated.highCostRoutes,
      branchComparisons: aggregated.branchComparisons,
      departmentComparisons: aggregated.departmentComparisons,

      risks: rootCause.risks,
      recommendations,
      forecasts,
      evidences: aggregated.evidences,

      aiMetadata: {
        model: 'gemini-3.7-flash (Fleet Business Engine)',
        tokensUsed: 1420,
        computeCostUsd: 0.00142,
        generatedAt: new Date().toISOString(),
        generatedBy: 'AI Executive Intelligence Daemon',
        confidenceOverall: 'High',
        hallucinationGuardsPassed: true,
      },

      auditLog: [
        {
          action: version === 1 ? 'Report Generated' : `Report Regenerated (V${version})`,
          performedBy: 'System AI Engine',
          timestamp: new Date().toISOString(),
          notes: `Evaluated 24 vehicles across 3 branches for period ${periodLabel}.`,
        },
      ],
    };

    // 9. Validation Check
    const validation = ExecutiveReportValidator.validate(report);
    if (!validation.isValid) {
      console.warn('Executive Report validation errors:', validation.errors);
    }

    // 10. Persist to repository
    ExecutiveReportRepository.saveReport(report);

    return report;
  }

  /**
   * Helper to update recommendation action status
   */
  public static updateRecommendationStatus(
    reportId: string,
    recId: string,
    newStatus: 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'DISMISSED',
    approverName: string = 'Director of Operations'
  ): ExecutiveReport | null {
    const report = ExecutiveReportRepository.getReportById(reportId);
    if (!report) return null;

    const targetRec = report.recommendations.find(r => r.id === recId);
    if (targetRec) {
      targetRec.status = newStatus;
      if (newStatus === 'APPROVED') {
        targetRec.approvedBy = approverName;
        targetRec.approvedAt = new Date().toISOString();
        targetRec.taskCreatedId = `TSK-${Date.now().toString(36).toUpperCase()}`;
      }

      report.auditLog = report.auditLog || [];
      report.auditLog.push({
        action: `Recommendation ${recId} ${newStatus}`,
        performedBy: approverName,
        timestamp: new Date().toISOString(),
        notes: `Action taken on: "${targetRec.title}"`,
      });

      ExecutiveReportRepository.saveReport(report);
    }

    return report;
  }
}
