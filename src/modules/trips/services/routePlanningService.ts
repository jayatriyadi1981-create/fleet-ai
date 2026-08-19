/**
 * Fleet Intelligence Smart AI - Route Planning Engine Service
 * PROMPT 15 — Origin, Destination & Multi-Waypoint Route Geometry, Distance & Duration Calculation
 */

import { LocationPoint, TripWaypoint, PlannedRoute } from '../plannedTripTypes';

export class RoutePlanningService {
  /**
   * Calculates Haversine distance between two lat/lng coordinates in KM
   */
  public static calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Generates route polyline and calculates cumulative distance & duration
   */
  public static calculatePlannedRoute(
    origin: LocationPoint,
    destination: LocationPoint,
    waypoints: TripWaypoint[] = []
  ): PlannedRoute {
    // Sort waypoints by sequence
    const sortedWaypoints = [...waypoints].sort((a, b) => a.sequence - b.sequence);

    // Build ordered list of points
    const points: Array<{ lat: number; lng: number }> = [
      { lat: origin.latitude, lng: origin.longitude },
      ...sortedWaypoints.map((w) => ({ lat: w.latitude, lng: w.longitude })),
      { lat: destination.latitude, lng: destination.longitude },
    ];

    let totalStraightDistanceKm = 0;
    const polyline: Array<[number, number]> = [];

    // Interpolate points for smooth polyline display
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];

      const segDist = this.calculateDistanceKm(p1.lat, p1.lng, p2.lat, p2.lng);
      totalStraightDistanceKm += segDist;

      // Add intermediate steps for road curves simulation
      const steps = Math.max(5, Math.floor(segDist / 2));
      for (let s = 0; s <= steps; s++) {
        const ratio = s / steps;
        // Subtle offset simulation for realistic roads
        const jitterLat = Math.sin(ratio * Math.PI) * 0.0015 * (i % 2 === 0 ? 1 : -1);
        const jitterLng = Math.cos(ratio * Math.PI) * 0.0015 * (i % 2 === 0 ? -1 : 1);
        polyline.push([
          p1.lat + (p2.lat - p1.lat) * ratio + jitterLat,
          p1.lng + (p2.lng - p1.lng) * ratio + jitterLng,
        ]);
      }
    }

    // Multiply straight line distance by 1.28 road winding factor
    const actualRoadDistanceKm = Math.round(totalStraightDistanceKm * 1.28 * 10) / 10;

    // Estimate duration assuming average speed of 48 km/h in urban/intercity + 15 mins per waypoint
    const drivingHours = actualRoadDistanceKm / 48;
    const waypointDelayMinutes = sortedWaypoints.length * 15;
    const estimatedDurationMinutes = Math.round(drivingHours * 60 + waypointDelayMinutes);

    return {
      polyline,
      distanceKm: actualRoadDistanceKm,
      estimatedDurationMinutes,
      routePoints: points,
    };
  }

  /**
   * Re-sequence waypoints after drag & drop or manual order change
   */
  public static resequenceWaypoints(waypoints: TripWaypoint[]): TripWaypoint[] {
    return waypoints.map((wp, idx) => ({
      ...wp,
      sequence: idx + 1,
    }));
  }
}
