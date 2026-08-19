/**
 * Safety Score Calculation & Normalization Engine
 * PROMPT 22 Architecture
 */

import { SafetyScoreConfig, FleetSafetyScoreMetrics, Accident, Incident, NearMiss, CorrectiveAction } from '../types';

export const DEFAULT_SAFETY_SCORE_CONFIG: SafetyScoreConfig = {
  accidentWeight: 35,
  incidentWeight: 25,
  nearMissWeight: 10,
  driverBehaviorWeight: 20,
  capaWeight: 10,
};

export class SafetyScoreService {
  /**
   * Calculates Normalized Fleet Safety Score (0 - 100)
   * Considers Accidents, Incidents, Near Misses, CAPAs, and Exposure (Distance per 100,000 km)
   */
  public static calculateFleetSafetyScore(
    accidents: Accident[],
    incidents: Incident[],
    nearMisses: NearMiss[],
    capas: CorrectiveAction[],
    totalDistanceKm: number = 185000,
    config: SafetyScoreConfig = DEFAULT_SAFETY_SCORE_CONFIG
  ): FleetSafetyScoreMetrics {
    const exposureFactor = Math.max(1, totalDistanceKm / 100000); // normalized per 100,000 km

    // Deductions calculation per 100k km
    const criticalAccidents = accidents.filter(a => a.severity === 'HIGH' || a.severity === 'CRITICAL' || a.severity === 'FATAL').length;
    const minorAccidents = accidents.filter(a => a.severity === 'LOW' || a.severity === 'MEDIUM').length;
    const accidentDeduction = Math.min(35, ((criticalAccidents * 12 + minorAccidents * 6) / exposureFactor) * (config.accidentWeight / 35));

    const highIncidents = incidents.filter(i => i.severity === 'HIGH' || i.severity === 'CRITICAL').length;
    const minorIncidents = incidents.filter(i => i.severity === 'LOW' || i.severity === 'MEDIUM').length;
    const incidentDeduction = Math.min(25, ((highIncidents * 8 + minorIncidents * 3) / exposureFactor) * (config.incidentWeight / 25));

    const nearMissDeduction = Math.min(10, ((nearMisses.length * 2) / exposureFactor) * (config.nearMissWeight / 10));

    // Driver Behavior deduction (e.g. overspeed/harsh brake events simulated)
    const behaviorDeduction = 4.5; // Base driver behavior deduction

    // CAPA Overdue penalty
    const overdueCapas = capas.filter(c => c.status === 'OVERDUE').length;
    const openCapas = capas.filter(c => c.status === 'OPEN' || c.status === 'ASSIGNED' || c.status === 'IN_PROGRESS').length;
    const capaDeduction = Math.min(10, overdueCapas * 4 + openCapas * 1);

    const totalDeduction = accidentDeduction + incidentDeduction + nearMissDeduction + behaviorDeduction + capaDeduction;
    const score = Math.max(0, Math.round(100 - totalDeduction));

    const totalEvents = accidents.length + incidents.length;
    const frequencyRate = Number(((totalEvents / totalDistanceKm) * 100000).toFixed(2));
    const severityRate = Number((((accidents.length * 3 + incidents.length) / totalDistanceKm) * 100000).toFixed(2));

    return {
      score,
      previousPeriodScore: 82.8,
      changePercent: Number(((score - 82.8) / 82.8 * 100).toFixed(1)),
      totalDistanceKm,
      totalTrips: 1240,
      accidentsCount: accidents.length,
      incidentsCount: incidents.length,
      nearMissCount: nearMisses.length,
      openCapasCount: capas.filter(c => c.status !== 'CLOSED' && c.status !== 'VERIFIED').length,
      overdueCapasCount: overdueCapas,
      lostTimeIncidents: accidents.reduce((acc, curr) => acc + curr.injuries + curr.fatalities, 0),
      severityRate,
      frequencyRate,
    };
  }

  /**
   * Helper to check if score dropped significantly and requires a degradation alert
   */
  public static checkScoreDegradationAlert(currentScore: number, previousScore: number, threshold: number = 5): boolean {
    return (previousScore - currentScore) >= threshold;
  }
}
