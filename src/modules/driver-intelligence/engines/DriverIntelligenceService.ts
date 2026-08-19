/**
 * Driver Intelligence Service - Master Telematics & AI Orchestration Facade
 * PROMPT 29 - Aggregates Telemetry, Trips, Behavior, Safety, Fatigue, Coaching & Reports
 */

import {
  DriverAIReport,
  DriverBehaviorAnalysis,
  DriverComparisonResult,
  DriverFilterState,
  DriverGoal,
  DriverIntelligencePeriod,
  DriverRankingItem,
  DriverRiskLevel,
  DriverRiskMatrixNode,
  DriverRiskScore,
  DriverRiskScoreWeights,
  DriverSafetyRecommendation,
  DriverSafetyScore,
  DriverScorecard,
  DriverScoreTrend,
  DriverTrend,
} from '../types';
import { driverRiskScoreEngine, DriverRawTelemetryContext } from './DriverRiskScoreEngine';
import { driverPerformanceEngine } from './DriverPerformanceEngine';
import { driverBehaviorAnalyticsEngine } from './DriverBehaviorAnalyticsEngine';
import { driverSafetyRecommendationEngine } from './DriverSafetyRecommendationEngine';
import { aiDriverCoachingService } from './AIDriverCoachingService';
import { MOCK_DRIVERS } from '../../../constants/mockDriverData';

export interface DriverIntelligenceFullProfile {
  driverId: string;
  driverName: string;
  driverPhone: string;
  driverPhotoUrl?: string;
  simType: string;
  branchId: string;
  branchName: string;
  assignedVehiclePlate: string;
  assignedVehicleType: string;
  totalTrips: number;
  totalDistanceKm: number;
  totalDrivingHours: number;
  riskScore: DriverRiskScore;
  safetyScore: DriverSafetyScore;
  performanceScore: {
    compositeScore: number;
    factors: {
      safety: number;
      behavior: number;
      tripCompletion: number;
      routeCompliance: number;
      punctuality: number;
      inspectionCompliance: number;
      fuelEfficiency: number;
      vehicleCare: number;
    };
    ranking: number;
    peerGroupRanking: number;
  };
  behaviorAnalysis: DriverBehaviorAnalysis;
  recommendations: DriverSafetyRecommendation[];
  coachingSessions: ReturnType<typeof aiDriverCoachingService.getSessionsByDriver>;
  trend: DriverTrend;
  goals: DriverGoal[];
}

export class DriverIntelligenceService {
  private cache: Map<string, DriverIntelligenceFullProfile> = new Map();

  /**
   * Generates mock/real telemetry context for a specific driver
   */
  public getDriverTelemetryContext(
    driverId: string,
    period: DriverIntelligencePeriod = '30_DAYS'
  ): DriverRawTelemetryContext {
    const driver = MOCK_DRIVERS.find((d) => d.id === driverId) || MOCK_DRIVERS[0];

    // Multipliers based on period
    const periodMult = period === '7_DAYS' ? 0.25 : period === '90_DAYS' ? 3.0 : 1.0;

    // Deterministic simulation based on driverId
    const isHighRisk = driverId === 'drv-01' || driverId === 'drv-04';
    const isMediumRisk = driverId === 'drv-02' || driverId === 'drv-05';
    const isExemplary = driverId === 'drv-03' || driverId === 'drv-06';

    const baseDistance = Math.round((isHighRisk ? 2850 : isExemplary ? 3400 : 3100) * periodMult);
    const baseHours = Math.round((baseDistance / 45) * 10) / 10;
    const baseTrips = Math.round((baseDistance / 240) * 10) / 10;

    const driverName = (driver as any).fullName || (driver as any).displayName || (driver as any).name || 'Pengemudi';

    return {
      driverId: driver.id,
      driverName,
      distanceKm: baseDistance,
      drivingHours: baseHours,
      tripsCount: Math.max(1, Math.round(baseTrips)),
      overspeedEventsCount: Math.round((isHighRisk ? 12 : isMediumRisk ? 5 : 1) * periodMult),
      harshBrakingEventsCount: Math.round((isHighRisk ? 8 : isMediumRisk ? 4 : 0) * periodMult),
      harshAccelEventsCount: Math.round((isHighRisk ? 6 : isMediumRisk ? 3 : 1) * periodMult),
      sharpTurnEventsCount: Math.round((isHighRisk ? 5 : isMediumRisk ? 2 : 0) * periodMult),
      routeDeviationEventsCount: Math.round((isHighRisk ? 4 : isMediumRisk ? 2 : 0) * periodMult),
      idleDurationMinutes: Math.round((isHighRisk ? 180 : isMediumRisk ? 95 : 35) * periodMult),
      safetyIncidentsCount: isHighRisk ? Math.round(2 * periodMult) : 0,
      fatigueRiskEventsCount: isHighRisk ? Math.round(3 * periodMult) : isMediumRisk ? 1 : 0,
      tripDeviationsOrLateCount: Math.round((isHighRisk ? 3 : isMediumRisk ? 1 : 0) * periodMult),
      failedInspectionCount: isHighRisk ? 1 : 0,
      totalInspectionsCount: Math.max(1, Math.round(baseTrips)),
      previousRiskScore: isHighRisk ? 68 : isMediumRisk ? 42 : 18,
    };
  }

  /**
   * Builds the complete deep intelligence profile for a driver
   */
  public getDriverProfile(
    driverId: string,
    period: DriverIntelligencePeriod = '30_DAYS'
  ): DriverIntelligenceFullProfile {
    const cacheKey = `${driverId}-${period}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const driver = MOCK_DRIVERS.find((d) => d.id === driverId) || MOCK_DRIVERS[0];
    const context = this.getDriverTelemetryContext(driverId, period);

    // 1. Calculate Risk Score
    const riskScore = driverRiskScoreEngine.evaluateDriverRisk(context);

    // 2. Calculate Safety Score
    const safetyScore = driverPerformanceEngine.evaluateSafetyScore(context, riskScore.score);

    // 3. Calculate 8-Factor Performance Score
    const performanceScore = driverPerformanceEngine.evaluatePerformanceScore(
      context,
      safetyScore.score,
      riskScore.score > 60 ? 14 : riskScore.score < 30 ? 2 : 7,
      riskScore.score > 60 ? 8 : 2
    );

    // 4. Detailed Behavior Breakdown
    const behaviorAnalysis = driverBehaviorAnalyticsEngine.analyzeBehavior(context);

    // 5. Actionable Recommendations
    const recommendations = driverSafetyRecommendationEngine.generateRecommendationsForDriver(
      context,
      riskScore,
      driver.branchId || 'branch-1',
      driver.branchName || 'Cabang Jakarta Pusat'
    );

    // 6. Coaching Sessions
    const coachingSessions = aiDriverCoachingService.getSessionsByDriver(driverId);

    // 7. Trend History (7/30/90 days)
    const historyPoints = this.buildTrendHistory(context, riskScore.score, safetyScore.score);
    const score30DaysAgo = historyPoints[0]?.riskScore ?? Math.max(0, riskScore.score - 8);
    const scoreChange = riskScore.score - score30DaysAgo;
    const trendDirection: DriverScoreTrend =
      scoreChange > 3 ? 'DECLINING' : scoreChange < -3 ? 'IMPROVING' : 'STABLE';

    const trend: DriverTrend = {
      period,
      score30DaysAgo,
      scoreToday: riskScore.score,
      scoreChange,
      direction: trendDirection,
      riskChangeSummary:
        scoreChange > 0
          ? `Risiko operasional meningkat +${scoreChange} poin dibandingkan 30 hari lalu, dipicu peningkatan insiden overspeed dan pengereman mendadak.`
          : scoreChange < 0
          ? `Perbaikan signifikan: Risiko berkurang ${Math.abs(scoreChange)} poin sejalan dengan kepatuhan batas kecepatan.`
          : 'Profil risiko terpantau stabil dalam rentang aman.',
      evidence: riskScore.evidence,
      history: historyPoints,
    };

    // 8. Driver Goals
    const goals = this.getDriverGoals(driverId);

    const fullProfile: DriverIntelligenceFullProfile = {
      driverId: driver.id,
      driverName: (driver as any).fullName || (driver as any).displayName || (driver as any).name || 'Pengemudi',
      driverPhone: driver.phone || '0812-3456-7890',
      driverPhotoUrl: (driver as any).photoUrl || (driver as any).avatar,
      simType: (driver as any).primaryLicenseType || (driver as any).simType || ((driver as any).licenses?.[0]?.licenseType) || 'SIM B2 Umum',
      branchId: driver.branchId || 'branch-1',
      branchName: driver.branchName || 'Cabang Jakarta Pusat',
      assignedVehiclePlate: (driver as any).currentVehiclePlate || (driver as any).assignedVehiclePlate || 'B 9281 KXA',
      assignedVehicleType: 'Heavy Truck Wingbox (24T)',
      totalTrips: context.tripsCount,
      totalDistanceKm: context.distanceKm,
      totalDrivingHours: context.drivingHours,
      riskScore,
      safetyScore,
      performanceScore,
      behaviorAnalysis,
      recommendations,
      coachingSessions,
      trend,
      goals,
    };

    this.cache.set(cacheKey, fullProfile);
    return fullProfile;
  }

  public getDriverList(): { id: string; name: string; vehiclePlate: string; branch: string; photoUrl?: string }[] {
    return MOCK_DRIVERS.map((d) => ({
      id: d.id || d.driverId,
      name: d.fullName || d.displayName || 'Driver TLN',
      vehiclePlate: d.currentVehiclePlate || 'B 9102 TLN',
      branch: d.branchName || 'Cikarang Hub',
      photoUrl: d.photoUrl,
    }));
  }

  public getDriverRankings(period: DriverIntelligencePeriod = '30_DAYS', filter?: DriverFilterState): DriverRankingItem[] {
    return this.getAllDriverRankings(period, filter).rankings;
  }

  public getTopPerformers(limit: number = 5, period: DriverIntelligencePeriod = '30_DAYS'): DriverRankingItem[] {
    return this.getAllDriverRankings(period).topPerformers.slice(0, limit);
  }

  public getAttentionRequiredDrivers(period: DriverIntelligencePeriod = '30_DAYS'): DriverRankingItem[] {
    return this.getAllDriverRankings(period).attentionRequired;
  }

  public getFleetExecutiveSummary(period: DriverIntelligencePeriod = '30_DAYS'): DriverAIReport {
    return this.generateDriverAIReport(period);
  }

  public getSafetyRecommendations(period: DriverIntelligencePeriod = '30_DAYS'): DriverSafetyRecommendation[] {
    const report = this.generateDriverAIReport(period);
    return report.highPriorityRecommendations;
  }

  /**
   * Generates all driver ranking items for leaderboards & lists
   */
  public getAllDriverRankings(
    period: DriverIntelligencePeriod = '30_DAYS',
    filter?: DriverFilterState
  ): {
    rankings: DriverRankingItem[];
    topPerformers: DriverRankingItem[];
    attentionRequired: DriverRankingItem[];
  } {
    const allProfiles = MOCK_DRIVERS.map((d) => this.getDriverProfile(d.id, period));

    // Filter by branch / vehicleType / search
    let filtered = allProfiles;
    if (filter?.branchId && filter.branchId !== 'all') {
      filtered = filtered.filter((p) => p.branchId === filter.branchId);
    }
    if (filter?.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.driverName.toLowerCase().includes(q) ||
          p.assignedVehiclePlate.toLowerCase().includes(q) ||
          p.branchName.toLowerCase().includes(q)
      );
    }

    // Sort by Safety / Performance descending for overall rank
    const sorted = [...filtered].sort(
      (a, b) => b.safetyScore.score - a.safetyScore.score || a.riskScore.score - b.riskScore.score
    );

    const rankings: DriverRankingItem[] = sorted.map((p, idx) => ({
      rank: idx + 1,
      driverId: p.driverId,
      driverName: p.driverName,
      driverPhone: p.driverPhone,
      driverPhotoUrl: p.driverPhotoUrl,
      branchId: p.branchId,
      branchName: p.branchName,
      vehiclePlate: p.assignedVehiclePlate,
      vehicleType: p.assignedVehicleType,
      riskScore: p.riskScore.score,
      riskLevel: p.riskScore.level,
      safetyScore: p.safetyScore.score,
      performanceScore: p.performanceScore.compositeScore,
      totalTrips: p.totalTrips,
      totalDistanceKm: p.totalDistanceKm,
      trend: p.trend.direction,
      trendDelta: p.trend.scoreChange,
      isTopPerformer: p.safetyScore.score >= 85 && p.riskScore.score <= 35,
      isAttentionRequired: p.riskScore.score >= 60,
      primaryRiskIssue: p.riskScore.primaryRiskFactor,
    }));

    const topPerformers = rankings.filter((r) => r.isTopPerformer).slice(0, 5);
    const attentionRequired = rankings
      .filter((r) => r.isAttentionRequired)
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 5);

    return {
      rankings,
      topPerformers,
      attentionRequired,
    };
  }

  /**
   * Generates Driver 4-Quadrant Risk Matrix nodes
   */
  public getDriverRiskMatrix(
    period: DriverIntelligencePeriod = '30_DAYS',
    filter?: DriverFilterState
  ): {
    nodes: DriverRiskMatrixNode[];
    quadrantCounts: Record<DriverRiskMatrixNode['quadrant'], number>;
  } {
    const { rankings } = this.getAllDriverRankings(period, filter);

    const nodes: DriverRiskMatrixNode[] = rankings.map((r) => {
      // Quadrant determination:
      // X = Performance Score (Threshold 70)
      // Y = Risk Score (Threshold 50)
      let quadrant: DriverRiskMatrixNode['quadrant'];
      if (r.riskScore > 50 && r.performanceScore < 70) {
        quadrant = 'CRITICAL_ATTENTION'; // High Risk, Low Performance
      } else if (r.riskScore > 50 && r.performanceScore >= 70) {
        quadrant = 'COACHING_OPPORTUNITY'; // High Risk, High Performance (Fast but aggressive)
      } else if (r.riskScore <= 50 && r.performanceScore < 70) {
        quadrant = 'LOW_RISK_DEV'; // Low Risk, Low Performance (Safe but slow/idle)
      } else {
        quadrant = 'EXEMPLARY_BENCHMARK'; // Low Risk, High Performance (Role model)
      }

      return {
        driverId: r.driverId,
        driverName: r.driverName,
        photoUrl: r.driverPhotoUrl,
        branchId: r.branchId,
        branchName: r.branchName,
        vehiclePlate: r.vehiclePlate,
        vehicleType: r.vehicleType,
        riskScore: r.riskScore,
        performanceScore: r.performanceScore,
        safetyScore: r.safetyScore,
        quadrant,
        trend: r.trend,
        primaryRiskFactor: r.primaryRiskIssue || 'Batas Wajar',
      };
    });

    const quadrantCounts: Record<DriverRiskMatrixNode['quadrant'], number> = {
      CRITICAL_ATTENTION: nodes.filter((n) => n.quadrant === 'CRITICAL_ATTENTION').length,
      COACHING_OPPORTUNITY: nodes.filter((n) => n.quadrant === 'COACHING_OPPORTUNITY').length,
      LOW_RISK_DEV: nodes.filter((n) => n.quadrant === 'LOW_RISK_DEV').length,
      EXEMPLARY_BENCHMARK: nodes.filter((n) => n.quadrant === 'EXEMPLARY_BENCHMARK').length,
    };

    return {
      nodes,
      quadrantCounts,
    };
  }

  /**
   * Compares 2 to 4 drivers side by side with peer benchmarks
   */
  public compareDrivers(
    driverIds: string[],
    period: DriverIntelligencePeriod = '30_DAYS'
  ): DriverComparisonResult {
    const profiles = driverIds.map((id) => this.getDriverProfile(id, period));

    let totalRisk = 0;
    let totalSafety = 0;
    let totalPerf = 0;
    let totalSpd = 0;
    let totalBrk = 0;
    let totalAcc = 0;
    let totalDist = 0;

    const drivers = profiles.map((p) => {
      totalRisk += p.riskScore.score;
      totalSafety += p.safetyScore.score;
      totalPerf += p.performanceScore.compositeScore;
      totalSpd += p.behaviorAnalysis.overspeed.eventCount;
      totalBrk += p.behaviorAnalysis.harshBraking.eventCount;
      totalAcc += p.behaviorAnalysis.harshAcceleration.eventCount;
      totalDist += p.totalDistanceKm;

      return {
        driverId: p.driverId,
        driverName: p.driverName,
        branchName: p.branchName,
        vehicleType: p.assignedVehicleType,
        riskScore: p.riskScore.score,
        safetyScore: p.safetyScore.score,
        performanceScore: p.performanceScore.compositeScore,
        overspeedCount: p.behaviorAnalysis.overspeed.eventCount,
        harshBrakingCount: p.behaviorAnalysis.harshBraking.eventCount,
        harshAccelCount: p.behaviorAnalysis.harshAcceleration.eventCount,
        sharpTurnCount: p.behaviorAnalysis.sharpTurn.eventCount,
        routeDeviationCount: p.behaviorAnalysis.routeDeviation.deviationCount,
        idleEfficiency: p.behaviorAnalysis.idleBehavior.idleEfficiencyScore,
        distanceKm: p.totalDistanceKm,
        tripsCount: p.totalTrips,
        trend: p.trend.direction,
      };
    });

    const count = Math.max(profiles.length, 1);
    const peerGroupAverages = {
      riskScore: Math.round(totalRisk / count),
      safetyScore: Math.round(totalSafety / count),
      performanceScore: Math.round(totalPerf / count),
      overspeedCount: Math.round((totalSpd / count) * 10) / 10,
      harshBrakingCount: Math.round((totalBrk / count) * 10) / 10,
      harshAccelCount: Math.round((totalAcc / count) * 10) / 10,
      distanceKm: Math.round(totalDist / count),
    };

    const bestDriver = [...drivers].sort((a, b) => b.safetyScore - a.safetyScore)[0];
    const highestRiskDriver = [...drivers].sort((a, b) => b.riskScore - a.riskScore)[0];

    const comparisonNarrative = `Dari ${drivers.length} driver yang dikomparasi, ${bestDriver?.driverName} memiliki profil keselamatan tertinggi (Safety Score ${bestDriver?.safetyScore}/100), sedangkan ${highestRiskDriver?.driverName} memerlukan perhatian khusus dengan Risk Score ${highestRiskDriver?.riskScore}/100 yang didominasi oleh ${highestRiskDriver?.overspeedCount} insiden overspeed.`;

    return {
      drivers,
      peerGroupAverages,
      comparisonNarrative,
    };
  }

  /**
   * Generates formal Safety Scorecard for printing or export
   */
  public getDriverSafetyScorecard(
    driverId: string,
    period: DriverIntelligencePeriod = '30_DAYS'
  ): DriverScorecard {
    const profile = this.getDriverProfile(driverId, period);

    return {
      driverId: profile.driverId,
      driverName: profile.driverName,
      employeeId: `EMP-${profile.driverId.replace('drv-', '100')}`,
      branchName: profile.branchName,
      period,
      riskScore: profile.riskScore.score,
      riskLevel: profile.riskScore.level,
      safetyScore: profile.safetyScore.score,
      safetyGrade: profile.safetyScore.grade,
      performanceScore: profile.performanceScore.compositeScore,
      totalTrips: profile.totalTrips,
      distanceKm: profile.totalDistanceKm,
      drivingHours: profile.totalDrivingHours,
      eventsSummary: {
        overspeed: profile.behaviorAnalysis.overspeed.eventCount,
        harshBraking: profile.behaviorAnalysis.harshBraking.eventCount,
        harshAccel: profile.behaviorAnalysis.harshAcceleration.eventCount,
        sharpTurn: profile.behaviorAnalysis.sharpTurn.eventCount,
        routeDeviation: profile.behaviorAnalysis.routeDeviation.deviationCount,
        excessiveIdle: profile.behaviorAnalysis.idleBehavior.totalIdleMinutes,
        safetyIncidents: profile.riskScore.score > 60 ? 2 : 0,
        fatigueRiskAlerts: profile.riskScore.score > 60 ? 3 : 0,
        inspectionPassRate: profile.performanceScore.factors.inspectionCompliance,
      },
      benchmarks: {
        fleetAvgRisk: 41,
        fleetAvgSafety: 79,
        fleetAvgPerformance: 82,
        branchAvgRisk: 39,
        branchAvgSafety: 81,
      },
      aiAssessmentSummary: profile.riskScore.explanation,
      keyStrengths: [
        'Kepatuhan checklist Pre-Trip Inspection 100%.',
        'Penyelesaian jadwal pengantaran tepat waktu.',
      ],
      keyImprovementAreas: profile.recommendations.map((r) => r.title),
      activeRecommendationsCount: profile.recommendations.length,
      completedCoachingCount: profile.coachingSessions.filter((s) => s.status === 'COMPLETED').length,
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Generates Comprehensive AI Driver Intelligence Report
   */
  public generateDriverAIReport(
    period: DriverIntelligencePeriod = '30_DAYS',
    filter?: DriverFilterState
  ): DriverAIReport {
    const { rankings, topPerformers, attentionRequired } = this.getAllDriverRankings(period, filter);

    const totalDrivers = rankings.length;
    let sumRisk = 0;
    let sumSafety = 0;
    let sumPerf = 0;

    const riskDistribution: Record<DriverRiskLevel, number> = {
      VERY_LOW: 0,
      LOW: 0,
      MODERATE: 0,
      HIGH: 0,
      CRITICAL: 0,
    };

    rankings.forEach((r) => {
      sumRisk += r.riskScore;
      sumSafety += r.safetyScore;
      sumPerf += r.performanceScore;
      riskDistribution[r.riskLevel] = (riskDistribution[r.riskLevel] || 0) + 1;
    });

    const fleetAvgRiskScore = Math.round(sumRisk / Math.max(totalDrivers, 1));
    const fleetAvgSafetyScore = Math.round(sumSafety / Math.max(totalDrivers, 1));
    const fleetAvgPerformanceScore = Math.round(sumPerf / Math.max(totalDrivers, 1));

    // High priority recommendations across fleet
    const highPriorityRecommendations: DriverSafetyRecommendation[] = [];
    rankings.slice(0, 5).forEach((r) => {
      const p = this.getDriverProfile(r.driverId, period);
      p.recommendations.forEach((rec) => {
        if (rec.priority === 'CRITICAL' || rec.priority === 'HIGH') {
          highPriorityRecommendations.push(rec);
        }
      });
    });

    const activeCoachingQueueCount = aiDriverCoachingService
      .getAllSessions()
      .filter((s) => s.status === 'SCHEDULED' || s.status === 'IN_PROGRESS').length;

    const executiveSummaryText = `Laporan AI Driver Intelligence periode ${period.replace('_', ' ')}: Terpantau ${totalDrivers} pengemudi aktif dengan rata-rata Safety Score armada ${fleetAvgSafetyScore}/100 dan Risk Score rata-rata ${fleetAvgRiskScore}/100. Terdapat ${attentionRequired.length} pengemudi berisiko tinggi yang diprioritaskan masuk program coaching terstruktur non-punitif, dengan fokus utama pada mitigasi overspeed koridor tol dan antisipasi pengereman mendadak.`;

    return {
      reportId: `REP-DRV-${Date.now()}`,
      tenantId: 'tenant-tln-01',
      period,
      generatedAt: new Date().toISOString(),
      generatedBy: 'AI Driver Intelligence Engine',
      totalDriversMonitored: totalDrivers,
      fleetAvgRiskScore,
      fleetAvgSafetyScore,
      fleetAvgPerformanceScore,
      riskDistribution,
      topRiskDrivers: attentionRequired,
      topPerformingDrivers: topPerformers,
      highPriorityRecommendations: highPriorityRecommendations.slice(0, 6),
      activeCoachingQueueCount,
      executiveSummaryText,
    };
  }

  /**
   * Driver Goals Tracker (Self-Coaching)
   */
  public getDriverGoals(driverId: string): DriverGoal[] {
    const isHighRisk = driverId === 'drv-01' || driverId === 'drv-04';

    return [
      {
        id: `goal-1-${driverId}`,
        driverId,
        type: 'REDUCE_OVERSPEED',
        title: 'Kurangi Insiden Overspeed Tol',
        description: 'Maksimal 2 insiden kecepatan berlebih per 1000 km jarak tempuh',
        baselineValue: isHighRisk ? 12 : 3,
        targetValue: 2,
        currentValue: isHighRisk ? 6 : 1,
        unit: 'insiden/1000km',
        progressPercentage: isHighRisk ? 60 : 100,
        trend: 'IMPROVING',
        startDate: '2026-08-01',
        deadline: '2026-08-31',
        status: isHighRisk ? 'ACTIVE' : 'ACHIEVED',
      },
      {
        id: `goal-2-${driverId}`,
        driverId,
        type: 'REDUCE_HARSH_BRAKING',
        title: 'Praktekkan Jarak Aman 3 Detik',
        description: 'Menurunkan pengereman mendadak di area persimpangan & exit tol',
        baselineValue: isHighRisk ? 8 : 2,
        targetValue: 1,
        currentValue: isHighRisk ? 4 : 0,
        unit: 'kejadian/minggu',
        progressPercentage: isHighRisk ? 55 : 100,
        trend: 'IMPROVING',
        startDate: '2026-08-01',
        deadline: '2026-08-31',
        status: 'ACTIVE',
      },
      {
        id: `goal-3-${driverId}`,
        driverId,
        type: 'REDUCE_IDLE',
        title: 'Efisiensi BBM: Matikan Mesin Saat Antre',
        description: 'Batasi waktu idling maksimal 5 menit saat antrean bongkar muat',
        baselineValue: isHighRisk ? 180 : 45,
        targetValue: 40,
        currentValue: isHighRisk ? 90 : 30,
        unit: 'menit/minggu',
        progressPercentage: isHighRisk ? 64 : 95,
        trend: 'IMPROVING',
        startDate: '2026-08-01',
        deadline: '2026-08-31',
        status: 'ACTIVE',
      },
      {
        id: `goal-4-${driverId}`,
        driverId,
        type: 'MAINTAIN_SAFETY_SCORE',
        title: 'Pertahankan Safety Score di atas 85',
        description: 'Mencapai predikat Safety Champion dan bonus insentif keselamatan',
        baselineValue: 70,
        targetValue: 85,
        currentValue: isHighRisk ? 68 : 92,
        unit: 'poin',
        progressPercentage: isHighRisk ? 75 : 100,
        trend: isHighRisk ? 'STABLE' : 'IMPROVING',
        startDate: '2026-08-01',
        deadline: '2026-08-31',
        status: isHighRisk ? 'ACTIVE' : 'ACHIEVED',
      },
    ];
  }

  private buildTrendHistory(
    context: DriverRawTelemetryContext,
    currentRisk: number,
    currentSafety: number
  ) {
    const points = [];
    const now = new Date();

    for (let i = 28; i >= 0; i -= 4) {
      const d = new Date(now.getTime() - i * 86400000);
      const noise = (Math.sin(i) * 6);
      const isDeclining = context.overspeedEventsCount > 6;
      const histRisk = Math.max(10, Math.min(100, Math.round(currentRisk - (isDeclining ? (28 - i) * 0.7 : -(28 - i) * 0.4) + noise)));
      const histSafety = Math.max(15, Math.min(100, 100 - histRisk + 8));

      points.push({
        date: d.toISOString().substring(5, 10),
        riskScore: histRisk,
        safetyScore: histSafety,
        performanceScore: Math.round(histSafety * 0.9 + 5),
        eventCount: Math.max(0, Math.round((histRisk / 15) + (i % 2))),
        distanceKm: Math.round(context.distanceKm / 8 + (i * 12)),
      });
    }

    return points;
  }

  public getRiskModelWeights(): DriverRiskScoreWeights {
    return driverRiskScoreEngine.getWeights();
  }

  public updateRiskModelWeights(newWeights: Partial<DriverRiskScoreWeights>): void {
    driverRiskScoreEngine.updateWeights(newWeights);
    this.cache.clear();
  }
}

export const driverIntelligenceService = new DriverIntelligenceService();
