/**
 * Fleet Intelligence Smart AI - ETA & Delay Detection Engine Service
 * PROMPT 15 — Live ETA Calculation, Traffic Delay Monitoring & ETA Comparison
 */

import { PlannedTrip, PlannedVsActualComparison } from '../plannedTripTypes';
import { RoutePlanningService } from './routePlanningService';

export class EtaService {
  /**
   * Calculate planned ETA from ETD (ISO timestamp) and duration in minutes
   */
  public static calculatePlannedEta(etdIso: string, durationMinutes: number): string {
    const etdDate = new Date(etdIso);
    if (isNaN(etdDate.getTime())) {
      return new Date().toISOString();
    }
    const etaDate = new Date(etdDate.getTime() + durationMinutes * 60 * 1000);
    return etaDate.toISOString();
  }

  /**
   * Compute Live ETA based on current GPS position, destination, current speed, and traffic delay
   */
  public static calculateLiveEta(
    trip: PlannedTrip,
    currentLat: number,
    currentLng: number,
    currentSpeedKmh: number,
    trafficDelayMinutes: number = 0
  ): { currentEta: string; delayMinutes: number; remainingKm: number } {
    // Distance remaining to destination
    const straightKm = RoutePlanningService.calculateDistanceKm(
      currentLat,
      currentLng,
      trip.destination.latitude,
      trip.destination.longitude
    );
    const remainingRoadKm = Math.round(straightKm * 1.25 * 10) / 10;

    // Effective speed (minimum 15 km/h to avoid divide by zero)
    const speed = Math.max(15, currentSpeedKmh || 40);
    const remainingHours = remainingRoadKm / speed;
    const remainingMinutes = Math.round(remainingHours * 60) + trafficDelayMinutes;

    const now = new Date();
    const liveEtaDate = new Date(now.getTime() + remainingMinutes * 60 * 1000);
    const currentEtaIso = liveEtaDate.toISOString();

    // Delay calculation relative to planned ETA
    const plannedEtaDate = new Date(trip.plannedEta);
    const delayMs = liveEtaDate.getTime() - plannedEtaDate.getTime();
    const delayMinutes = Math.round(delayMs / (60 * 1000));

    return {
      currentEta: currentEtaIso,
      delayMinutes,
      remainingKm: remainingRoadKm,
    };
  }

  /**
   * Compare Planned vs Actual performance upon trip completion
   */
  public static comparePlannedVsActual(trip: PlannedTrip): PlannedVsActualComparison {
    const plannedDist = trip.distanceKm || 100;
    const actualDist = trip.actualDistanceKm || plannedDist + 3.5;

    const plannedDur = trip.estimatedDurationMinutes || 120;
    const actualDur = trip.actualDurationMinutes || plannedDur + 18;

    const plannedEtaDate = new Date(trip.plannedEta);
    const actualArrivalDate = trip.actualEndTime ? new Date(trip.actualEndTime) : new Date();

    const delayMinutes = Math.round(
      (actualArrivalDate.getTime() - plannedEtaDate.getTime()) / (60 * 1000)
    );

    let onTimeStatus: 'ON_TIME' | 'SLIGHT_DELAY' | 'SEVERE_DELAY' | 'EARLY' = 'ON_TIME';
    if (delayMinutes < -10) onTimeStatus = 'EARLY';
    else if (delayMinutes <= 15) onTimeStatus = 'ON_TIME';
    else if (delayMinutes <= 45) onTimeStatus = 'SLIGHT_DELAY';
    else onTimeStatus = 'SEVERE_DELAY';

    return {
      tripId: trip.id,
      plannedDistanceKm: plannedDist,
      actualDistanceKm: actualDist,
      distanceVarianceKm: Math.round((actualDist - plannedDist) * 10) / 10,
      plannedDurationMinutes: plannedDur,
      actualDurationMinutes: actualDur,
      durationVarianceMinutes: actualDur - plannedDur,
      plannedEta: trip.plannedEta,
      actualArrival: actualArrivalDate.toISOString(),
      etaDelayMinutes: delayMinutes,
      onTimeStatus,
    };
  }
}
