/**
 * Driver Safety Score Service - Enterprise Weighted Scoring Engine
 * Computes exposure-normalized safety scores per driver, trip, fleet, and branch
 * PROMPT 21 Architecture
 */

import {
  DriverBehaviorEvent,
  DriverSafetyScoreConfig,
  DriverSafetySummary,
  RiskLevel,
  ScorePeriod,
  ScoreTrend,
} from '../types';

export const DEFAULT_SCORE_CONFIG: DriverSafetyScoreConfig = {
  tenantId: 'tenant-1',
  weights: {
    overspeed: 0.30,
    harshBraking: 0.20,
    harshAcceleration: 0.15,
    sharpTurn: 0.10,
    excessiveIdle: 0.10,
    routeDeviation: 0.15,
  },
  normalizationBasis: 'PER_100_KM',
  thresholds: {
    excellent: 90,
    good: 80,
    fair: 70,
    needsAttention: 60,
  },
};

export class DriverSafetyScoreService {
  private config: DriverSafetyScoreConfig = DEFAULT_SCORE_CONFIG;

  public setConfig(customConfig: Partial<DriverSafetyScoreConfig>): void {
    this.config = {
      ...this.config,
      ...customConfig,
      weights: {
        ...this.config.weights,
        ...(customConfig.weights || {}),
      },
    };
  }

  public getConfig(): DriverSafetyScoreConfig {
    return this.config;
  }

  /**
   * Calculate Safety Score (0-100) based on weighted event penalties normalized per 100 km
   */
  public calculateScore(
    events: DriverBehaviorEvent[],
    distanceKm: number,
    drivingHours: number
  ): {
    score: number;
    riskLevel: RiskLevel;
    eventsPer100Km: number;
    subScores: {
      overspeedScore: number;
      harshBrakingScore: number;
      harshAccelScore: number;
      sharpTurnScore: number;
      idleScore: number;
      routeDeviationScore: number;
    };
  } {
    // If no distance driven or 0 km, default to 100 base score
    const safeDistance = Math.max(distanceKm, 10); // Minimum 10 km to prevent division spike
    const multiplier = 100 / safeDistance;

    // Count occurrences by type weighted by severity
    let overspeedPenalties = 0;
    let harshBrakingPenalties = 0;
    let harshAccelPenalties = 0;
    let sharpTurnPenalties = 0;
    let idlePenalties = 0;
    let deviationPenalties = 0;

    const getSeverityFactor = (severity: string) => {
      switch (severity) {
        case 'CRITICAL': return 3.0;
        case 'HIGH': return 2.0;
        case 'MEDIUM': return 1.0;
        default: return 0.5;
      }
    };

    events.forEach((e) => {
      const factor = getSeverityFactor(e.severity);
      switch (e.eventType) {
        case 'OVERSPEED':
          overspeedPenalties += factor * 1.5;
          break;
        case 'HARSH_BRAKING':
          harshBrakingPenalties += factor * 1.8;
          break;
        case 'HARSH_ACCELERATION':
          harshAccelPenalties += factor * 1.2;
          break;
        case 'SHARP_TURN':
          sharpTurnPenalties += factor * 1.0;
          break;
        case 'EXCESSIVE_IDLE':
          idlePenalties += factor * 0.8;
          break;
        case 'ROUTE_DEVIATION':
          deviationPenalties += factor * 1.4;
          break;
      }
    });

    // Normalize per 100 km
    const normOverspeed = overspeedPenalties * multiplier;
    const normHarshBraking = harshBrakingPenalties * multiplier;
    const normHarshAccel = harshAccelPenalties * multiplier;
    const normSharpTurn = sharpTurnPenalties * multiplier;
    const normIdle = idlePenalties * multiplier;
    const normDeviation = deviationPenalties * multiplier;

    // Category sub-scores starting at 100
    const overspeedScore = Math.max(0, Math.round(100 - normOverspeed * 5));
    const harshBrakingScore = Math.max(0, Math.round(100 - normHarshBraking * 6));
    const harshAccelScore = Math.max(0, Math.round(100 - normHarshAccel * 4));
    const sharpTurnScore = Math.max(0, Math.round(100 - normSharpTurn * 3));
    const idleScore = Math.max(0, Math.round(100 - normIdle * 3));
    const routeDeviationScore = Math.max(0, Math.round(100 - normDeviation * 5));

    // Weighted final score
    const w = this.config.weights;
    const rawWeighted =
      overspeedScore * w.overspeed +
      harshBrakingScore * w.harshBraking +
      harshAccelScore * w.harshAcceleration +
      sharpTurnScore * w.sharpTurn +
      idleScore * w.excessiveIdle +
      routeDeviationScore * w.routeDeviation;

    const finalScore = Math.min(100, Math.max(0, Math.round(rawWeighted)));
    const eventsPer100Km = Number((events.length * multiplier).toFixed(1));

    return {
      score: finalScore,
      riskLevel: this.getRiskLevel(finalScore),
      eventsPer100Km,
      subScores: {
        overspeedScore,
        harshBrakingScore,
        harshAccelScore,
        sharpTurnScore,
        idleScore,
        routeDeviationScore,
      },
    };
  }

  /**
   * Map score (0-100) to Risk Level category
   */
  public getRiskLevel(score: number): RiskLevel {
    const t = this.config.thresholds;
    if (score >= t.excellent) return 'EXCELLENT';
    if (score >= t.good) return 'GOOD';
    if (score >= t.fair) return 'FAIR';
    if (score >= t.needsAttention) return 'NEEDS_ATTENTION';
    return 'HIGH_RISK';
  }

  /**
   * Derive Score Trend direction
   */
  public getScoreTrend(currentScore: number, previousScore: number): { trend: ScoreTrend; delta: number } {
    const delta = currentScore - previousScore;
    if (delta > 1) return { trend: 'IMPROVING', delta };
    if (delta < -1) return { trend: 'DECLINING', delta };
    return { trend: 'STABLE', delta: 0 };
  }
}

export const driverSafetyScoreService = new DriverSafetyScoreService();
