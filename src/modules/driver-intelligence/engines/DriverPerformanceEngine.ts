/**
 * Driver Performance Engine - Multi-Factor Performance & Safety Score Calculator
 * PROMPT 29 - Evaluates Safety (0-100) and Composite Performance (0-100)
 */

import {
  DriverPerformanceScore,
  DriverSafetyScore,
  DriverScoreTrend,
} from '../types';
import { DriverRawTelemetryContext } from './DriverRiskScoreEngine';

export class DriverPerformanceEngine {
  /**
   * Computes Driver Safety Score (0-100, where 100 is best)
   */
  public evaluateSafetyScore(
    context: DriverRawTelemetryContext,
    riskScore: number
  ): DriverSafetyScore {
    const safeDistance100km = Math.max(context.distanceKm / 100, 0.2);

    // Sub-scores (0-100, higher is better)
    const speedScore = Math.max(0, 100 - Math.round((context.overspeedEventsCount / safeDistance100km) * 12));
    const brakingScore = Math.max(0, 100 - Math.round((context.harshBrakingEventsCount / safeDistance100km) * 15));
    const accelerationScore = Math.max(0, 100 - Math.round((context.harshAccelEventsCount / safeDistance100km) * 10));
    const corneringScore = Math.max(0, 100 - Math.round((context.sharpTurnEventsCount / safeDistance100km) * 14));
    const routeScore = Math.max(0, 100 - Math.round((context.routeDeviationEventsCount / safeDistance100km) * 18));
    
    const avgIdleMins = context.idleDurationMinutes / Math.max(context.tripsCount, 1);
    const idleEfficiencyScore = Math.max(0, 100 - Math.round((avgIdleMins / 40) * 40));
    
    const fatigueComplianceScore = Math.max(0, 100 - context.fatigueRiskEventsCount * 20);
    const inspectionPassRate =
      context.totalInspectionsCount > 0
        ? ((context.totalInspectionsCount - context.failedInspectionCount) / context.totalInspectionsCount) * 100
        : 95;
    const inspectionAdherenceScore = Math.round(inspectionPassRate);

    // Weighted Safety Score calculation
    const weightedSafety =
      speedScore * 0.25 +
      brakingScore * 0.20 +
      accelerationScore * 0.12 +
      corneringScore * 0.10 +
      routeScore * 0.10 +
      idleEfficiencyScore * 0.08 +
      fatigueComplianceScore * 0.10 +
      inspectionAdherenceScore * 0.05;

    const finalScore = Math.max(10, Math.min(100, Math.round(weightedSafety)));

    // Assign Grade
    let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
    if (finalScore >= 93) grade = 'A+';
    else if (finalScore >= 85) grade = 'A';
    else if (finalScore >= 75) grade = 'B';
    else if (finalScore >= 65) grade = 'C';
    else if (finalScore >= 50) grade = 'D';

    const previousScore = Math.min(100, Math.max(10, finalScore + (riskScore > 50 ? 4 : -3)));
    const trend: DriverScoreTrend =
      finalScore > previousScore + 2 ? 'IMPROVING' : finalScore < previousScore - 2 ? 'DECLINING' : 'STABLE';

    const totalEvents =
      context.overspeedEventsCount +
      context.harshBrakingEventsCount +
      context.harshAccelEventsCount +
      context.sharpTurnEventsCount +
      context.routeDeviationEventsCount;

    return {
      score: finalScore,
      grade,
      previousScore,
      trend,
      subScores: {
        speedScore,
        brakingScore,
        accelerationScore,
        corneringScore,
        routeScore,
        idleEfficiencyScore,
        fatigueComplianceScore,
        inspectionAdherenceScore,
        speedCompliance: speedScore,
        brakingSmoothness: brakingScore,
        alertResponse: fatigueComplianceScore,
        inspectionCompliance: inspectionAdherenceScore,
      },
      eventsPer100Km: Math.round((totalEvents / safeDistance100km) * 10) / 10,
      eventsPer10Hours: Math.round((totalEvents / Math.max(context.drivingHours / 10, 0.5)) * 10) / 10,
      safeKilometersCount: Math.round(context.distanceKm * (finalScore / 100)),
    };
  }

  /**
   * Computes composite 8-factor Driver Performance Score (0-100)
   */
  public evaluatePerformanceScore(
    context: DriverRawTelemetryContext,
    safetyScore: number,
    ranking = 1,
    peerGroupRanking = 1
  ): DriverPerformanceScore {
    const safety = safetyScore;
    const behavior = Math.round(
      Math.max(
        0,
        100 -
          (context.overspeedEventsCount * 2.5 +
            context.harshBrakingEventsCount * 3 +
            context.harshAccelEventsCount * 1.5 +
            context.sharpTurnEventsCount * 2)
      )
    );

    const tripCompletion = Math.min(
      100,
      Math.max(60, 100 - Math.round((context.tripDeviationsOrLateCount / Math.max(context.tripsCount, 1)) * 50))
    );

    const routeCompliance = Math.min(
      100,
      Math.max(50, 100 - Math.round((context.routeDeviationEventsCount * 10) / Math.max(context.tripsCount, 1)))
    );

    const punctuality = Math.min(100, Math.max(65, 96 - context.tripDeviationsOrLateCount * 4));

    const inspectionCompliance =
      context.totalInspectionsCount > 0
        ? Math.round(
            ((context.totalInspectionsCount - context.failedInspectionCount) / context.totalInspectionsCount) * 100
          )
        : 90;

    // Fuel Efficiency based on idle & harsh events
    const fuelEfficiency = Math.max(
      45,
      Math.min(
        100,
        95 -
          Math.round((context.idleDurationMinutes / 60) * 5) -
          Math.round(context.harshAccelEventsCount * 1.8)
      )
    );

    // Vehicle Care based on maintenance feedback, harsh braking, and inspection
    const vehicleCare = Math.max(
      40,
      Math.min(100, 92 - context.harshBrakingEventsCount * 2.2 - context.failedInspectionCount * 8)
    );

    // Weighted composite
    const compositeScore = Math.round(
      safety * 0.25 +
      behavior * 0.20 +
      tripCompletion * 0.15 +
      routeCompliance * 0.10 +
      punctuality * 0.10 +
      inspectionCompliance * 0.08 +
      fuelEfficiency * 0.06 +
      vehicleCare * 0.06
    );

    return {
      compositeScore: Math.min(100, Math.max(0, compositeScore)),
      factors: {
        safety,
        behavior,
        tripCompletion,
        routeCompliance,
        punctuality,
        inspectionCompliance,
        fuelEfficiency,
        vehicleCare,
      },
      ranking,
      peerGroupRanking,
    };
  }
}

export const driverPerformanceEngine = new DriverPerformanceEngine();
