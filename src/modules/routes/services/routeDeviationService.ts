/**
 * Fleet Intelligence Smart AI - Route Deviation Engine
 * PROMPT 16 — Off-Route Detection, Distance/Duration Calculation, Alert Thresholds & Rejoin Events
 */

import { RouteDeviation, DeviationSeverity } from '../routeTypes';

export interface DeviationConfig {
  warningThresholdMeters: number; // default 100m
  criticalThresholdMeters: number; // default 500m
}

export const DEFAULT_DEVIATION_CONFIG: DeviationConfig = {
  warningThresholdMeters: 100,
  criticalThresholdMeters: 500,
};

class RouteDeviationService {
  private activeDeviations: Map<string, RouteDeviation> = new Map();

  /**
   * Distance from point (lat, lng) to line segment (aLat, aLng) -> (bLat, bLng) in meters
   */
  private pointToSegmentDistanceMeters(
    lat: number,
    lng: number,
    aLat: number,
    aLng: number,
    bLat: number,
    bLng: number
  ): number {
    const pX = lng;
    const pY = lat;
    const aX = aLng;
    const aY = aLat;
    const bX = bLng;
    const bY = bLat;

    const abX = bX - aX;
    const abY = bY - aY;

    if (abX === 0 && abY === 0) {
      return this.haversineMeters(lat, lng, aLat, aLng);
    }

    let t = ((pX - aX) * abX + (pY - aY) * abY) / (abX * abX + abY * abY);
    t = Math.max(0, Math.min(1, t));

    const projLat = aY + t * abY;
    const projLng = aX + t * abX;

    return this.haversineMeters(lat, lng, projLat, projLng);
  }

  private haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // meters
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }

  /**
   * Minimum distance from GPS point to nearest polyline segment
   */
  calculateDeviationDistance(
    gpsLat: number,
    gpsLng: number,
    polyline: Array<[number, number]>
  ): number {
    if (!polyline || polyline.length < 2) return 0;

    let minDistance = Infinity;
    for (let i = 0; i < polyline.length - 1; i++) {
      const [aLat, aLng] = polyline[i];
      const [bLat, bLng] = polyline[i + 1];
      const dist = this.pointToSegmentDistanceMeters(gpsLat, gpsLng, aLat, aLng, bLat, bLng);
      if (dist < minDistance) {
        minDistance = dist;
      }
    }
    return minDistance === Infinity ? 0 : minDistance;
  }

  evaluateDeviationSeverity(
    distanceMeters: number,
    config: DeviationConfig = DEFAULT_DEVIATION_CONFIG
  ): DeviationSeverity {
    if (distanceMeters < config.warningThresholdMeters) return 'NORMAL';
    if (distanceMeters < config.criticalThresholdMeters) return 'WARNING';
    return 'CRITICAL';
  }

  /**
   * Monitor current GPS position against active trip planned polyline
   */
  checkDeviation(
    tripId: string,
    vehicleId: string,
    routeId: string,
    gpsLat: number,
    gpsLng: number,
    polyline: Array<[number, number]>,
    config: DeviationConfig = DEFAULT_DEVIATION_CONFIG
  ): RouteDeviation | null {
    const distanceMeters = this.calculateDeviationDistance(gpsLat, gpsLng, polyline);
    const severity = this.evaluateDeviationSeverity(distanceMeters, config);
    const existing = this.activeDeviations.get(tripId);

    const nowIso = new Date().toISOString();

    if (severity === 'WARNING' || severity === 'CRITICAL') {
      if (!existing) {
        const newDeviation: RouteDeviation = {
          id: `dev-${Date.now()}`,
          tripId,
          vehicleId,
          routeId,
          latitude: gpsLat,
          longitude: gpsLng,
          deviationDistanceMeters: distanceMeters,
          severity,
          timestamp: nowIso,
          deviationStart: nowIso,
          maxDeviationMeters: distanceMeters,
          status: 'ACTIVE',
        };
        this.activeDeviations.set(tripId, newDeviation);
        return newDeviation;
      } else {
        // Update existing deviation
        existing.maxDeviationMeters = Math.max(existing.maxDeviationMeters || 0, distanceMeters);
        existing.deviationDistanceMeters = distanceMeters;
        existing.severity = severity;
        existing.latitude = gpsLat;
        existing.longitude = gpsLng;
        return existing;
      }
    } else {
      // Vehicle has rejoined route -> resolve deviation
      if (existing && existing.status === 'ACTIVE') {
        existing.status = 'RESOLVED';
        existing.resolvedAt = nowIso;
        existing.deviationEnd = nowIso;

        if (existing.deviationStart) {
          const startMs = new Date(existing.deviationStart).getTime();
          const endMs = new Date(nowIso).getTime();
          existing.deviationDurationMinutes = Math.round((endMs - startMs) / 60000);
        }

        this.activeDeviations.delete(tripId);
        return existing;
      }
    }

    return null;
  }

  getActiveDeviations(): RouteDeviation[] {
    return Array.from(this.activeDeviations.values());
  }
}

export const routeDeviationService = new RouteDeviationService();
