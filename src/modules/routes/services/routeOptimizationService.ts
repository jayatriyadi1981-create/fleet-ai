/**
 * Fleet Intelligence Smart AI - Route Optimization & Restrictive Rule Engine
 * PROMPT 16 — Waypoint Reordering, Multi-Objective Optimization & Vehicle Restrictions
 */

import { LocationPoint } from '../../trips/plannedTripTypes';
import {
  RouteWaypoint,
  OptimizationObjective,
  VehicleRestrictionConfig,
  RouteRestriction,
} from '../routeTypes';
import { routeCalculationService } from './routeCalculationService';

export interface OptimizationResult {
  optimizedWaypoints: RouteWaypoint[];
  polyline: Array<[number, number]>;
  distanceKm: number;
  estimatedDurationMinutes: number;
  savingsDistanceKm: number;
  savingsDurationMinutes: number;
  savingsCostIdr: number;
  objective: OptimizationObjective;
  warnings: string[];
}

class RouteOptimizationService {
  /**
   * Optimize waypoints sequence using Nearest Neighbor heuristic
   */
  async optimizeRoute(
    origin: LocationPoint,
    destination: LocationPoint,
    waypoints: RouteWaypoint[],
    objective: OptimizationObjective = 'Balanced',
    vehicleRestrictions?: VehicleRestrictionConfig,
    roadRestrictions: RouteRestriction[] = []
  ): Promise<OptimizationResult> {
    const warnings: string[] = [];

    // 1. Check Vehicle vs Road Restrictions
    if (vehicleRestrictions && roadRestrictions.length > 0) {
      roadRestrictions.forEach((res) => {
        if (!res.active) return;
        if (
          res.type === 'WEIGHT_LIMIT' &&
          vehicleRestrictions.maxWeightTon &&
          res.limitValue &&
          vehicleRestrictions.maxWeightTon > res.limitValue
        ) {
          warnings.push(
            `Peringatan Pembatasan: Kendaraan (${vehicleRestrictions.maxWeightTon} Ton) melebihi batas beban jalan ${res.name} (${res.limitValue} Ton).`
          );
        }
        if (
          res.type === 'HEIGHT_LIMIT' &&
          vehicleRestrictions.maxHeightMeters &&
          res.limitValue &&
          vehicleRestrictions.maxHeightMeters > res.limitValue
        ) {
          warnings.push(
            `Peringatan Pembatasan: Tinggi kendaraan (${vehicleRestrictions.maxHeightMeters}m) melebihi batas tinggi ${res.name} (${res.limitValue}m).`
          );
        }
        if (res.type === 'TIME_RESTRICTION' && res.timeWindow) {
          warnings.push(
            `Aturan Waktu: ${res.name} berlaku pembatasan jam operasional truk (${res.timeWindow.start} - ${res.timeWindow.end}).`
          );
        }
      });
    }

    // 2. Initial calculation
    const originalCalc = await routeCalculationService.calculateRoute(
      origin,
      destination,
      waypoints
    );

    // If 1 or no waypoints, ordering optimization isn't needed
    if (waypoints.length <= 1) {
      return {
        optimizedWaypoints: waypoints,
        polyline: originalCalc.polyline,
        distanceKm: originalCalc.distanceKm,
        estimatedDurationMinutes: originalCalc.estimatedDurationMinutes,
        savingsDistanceKm: 0,
        savingsDurationMinutes: 0,
        savingsCostIdr: 0,
        objective,
        warnings,
      };
    }

    // 3. Nearest Neighbor TSP Waypoint Reordering Algorithm
    const unvisited = [...waypoints];
    const reordered: RouteWaypoint[] = [];
    let currLat = origin.latitude;
    let currLng = origin.longitude;

    while (unvisited.length > 0) {
      let nearestIdx = 0;
      let minDistance = Infinity;

      for (let i = 0; i < unvisited.length; i++) {
        const wp = unvisited[i];
        const dist = Math.hypot(wp.latitude - currLat, wp.longitude - currLng);
        if (dist < minDistance) {
          minDistance = dist;
          nearestIdx = i;
        }
      }

      const nextWp = unvisited.splice(nearestIdx, 1)[0];
      currLat = nextWp.latitude;
      currLng = nextWp.longitude;
      reordered.push(nextWp);
    }

    // Update sequence numbers
    const finalWaypoints = reordered.map((wp, idx) => ({
      ...wp,
      sequence: idx + 1,
    }));

    // 4. Calculate route with reordered waypoints
    const optimizedCalc = await routeCalculationService.calculateRoute(
      origin,
      destination,
      finalWaypoints
    );

    // Calculate savings
    const savingsDist = Math.max(
      0,
      Math.round((originalCalc.distanceKm - optimizedCalc.distanceKm) * 10) / 10
    );
    const savingsDur = Math.max(
      0,
      originalCalc.estimatedDurationMinutes - optimizedCalc.estimatedDurationMinutes
    );

    // Estimated fuel savings (assume 1 liter = 3.5 km for heavy truck, Rp 13,500/liter)
    const fuelSavedLiters = savingsDist / 3.5;
    const savingsCost = Math.round(fuelSavedLiters * 13500);

    return {
      optimizedWaypoints: finalWaypoints,
      polyline: optimizedCalc.polyline,
      distanceKm: optimizedCalc.distanceKm,
      estimatedDurationMinutes: optimizedCalc.estimatedDurationMinutes,
      savingsDistanceKm: savingsDist,
      savingsDurationMinutes: savingsDur,
      savingsCostIdr: savingsCost,
      objective,
      warnings,
    };
  }
}

export const routeOptimizationService = new RouteOptimizationService();
