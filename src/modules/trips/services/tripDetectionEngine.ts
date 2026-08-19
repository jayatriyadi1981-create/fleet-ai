/**
 * Fleet Intelligence Smart AI - Trip Detection Engine
 * PROMPT 14 — Telemetry Processing, Trip Detection, Segmenting & Anomaly Filtering
 */

import { TripPoint, TripRoute, TripSegment, TripEvent, TripStopDetail, TripIdleDetail, TripGapsDetail, DetailedTrip } from '../types';

export interface TripDetectionConfig {
  tripStartSpeedThresholdKmH: number; // default 5 km/h
  tripEndDelaySeconds: number; // default 300 s (5 min)
  stopSpeedThresholdKmH: number; // default 2 km/h
  idleDurationThresholdSeconds: number; // default 180 s (3 min)
  maxPlausibleSpeedKmH: number; // default 140 km/h
  maxPlausibleAccelerationMps2: number; // default 10 m/s^2
  gpsGapThresholdSeconds: number; // default 600 s (10 min)
}

const DEFAULT_CONFIG: TripDetectionConfig = {
  tripStartSpeedThresholdKmH: 5,
  tripEndDelaySeconds: 300,
  stopSpeedThresholdKmH: 2,
  idleDurationThresholdSeconds: 180,
  maxPlausibleSpeedKmH: 140,
  maxPlausibleAccelerationMps2: 10,
  gpsGapThresholdSeconds: 600,
};

export class TripDetectionEngine {
  private config: TripDetectionConfig;

  constructor(config: Partial<TripDetectionConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Calculate Haversine distance between two lat/lng coordinates in kilometers
   */
  public calculateHaversineDistanceKm(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Filter GPS anomalies / jumps
   */
  public filterGpsAnomalies(rawPoints: TripPoint[]): {
    validPoints: TripPoint[];
    suspiciousPoints: TripPoint[];
  } {
    if (rawPoints.length === 0) return { validPoints: [], suspiciousPoints: [] };

    const validPoints: TripPoint[] = [rawPoints[0]];
    const suspiciousPoints: TripPoint[] = [];

    for (let i = 1; i < rawPoints.length; i++) {
      const prev = validPoints[validPoints.length - 1];
      const curr = rawPoints[i];

      const dtSeconds = (new Date(curr.timestamp).getTime() - new Date(prev.timestamp).getTime()) / 1000;
      if (dtSeconds <= 0) {
        suspiciousPoints.push({ ...curr, isSuspicious: true });
        continue;
      }

      const distKm = this.calculateHaversineDistanceKm(
        prev.latitude,
        prev.longitude,
        curr.latitude,
        curr.longitude
      );

      const calculatedSpeedKmH = (distKm / dtSeconds) * 3600;

      // Check if speed exceeds max plausible speed or speed jump is unrealistic
      if (curr.speed > this.config.maxPlausibleSpeedKmH || calculatedSpeedKmH > this.config.maxPlausibleSpeedKmH) {
        suspiciousPoints.push({ ...curr, isSuspicious: true });
      } else {
        validPoints.push(curr);
      }
    }

    return { validPoints, suspiciousPoints };
  }

  /**
   * Process raw telemetry points into a TripRoute with detailed segments, stops, idles, events, and gaps
   */
  public processTelemetryIntoTripRoute(
    tripId: string,
    rawPoints: TripPoint[],
    events: TripEvent[] = []
  ): TripRoute {
    const { validPoints } = this.filterGpsAnomalies(rawPoints);

    if (validPoints.length === 0) {
      const dummyPoint: TripPoint = {
        id: 'p-0',
        tripId,
        timestamp: new Date().toISOString(),
        latitude: -6.2088,
        longitude: 106.8456,
        speed: 0,
        heading: 0,
        ignition: false,
        status: 'Stopped',
      };
      return {
        tripId,
        points: [dummyPoint],
        distanceKm: 0,
        startPoint: dummyPoint,
        endPoint: dummyPoint,
        segments: [],
        events: [],
        stops: [],
        idles: [],
        gaps: [],
      };
    }

    let totalDistanceKm = 0;
    const segments: TripSegment[] = [];
    const stops: TripStopDetail[] = [];
    const idles: TripIdleDetail[] = [];
    const gaps: TripGapsDetail[] = [];

    // Track state transitions
    let currentSegmentType: 'MOVING' | 'STOPPED' | 'IDLE' = validPoints[0].speed > this.config.tripStartSpeedThresholdKmH ? 'MOVING' : (validPoints[0].ignition ? 'IDLE' : 'STOPPED');
    let segmentStartPoint = validPoints[0];
    let segmentDistanceKm = 0;
    let stopOrIdleStartTime = validPoints[0].timestamp;

    for (let i = 1; i < validPoints.length; i++) {
      const prev = validPoints[i - 1];
      const curr = validPoints[i];

      const dtSeconds = (new Date(curr.timestamp).getTime() - new Date(prev.timestamp).getTime()) / 1000;
      const stepDistKm = this.calculateHaversineDistanceKm(
        prev.latitude,
        prev.longitude,
        curr.latitude,
        curr.longitude
      );

      // Detect GPS Gaps
      if (dtSeconds > this.config.gpsGapThresholdSeconds) {
        gaps.push({
          startTime: prev.timestamp,
          endTime: curr.timestamp,
          durationSeconds: dtSeconds,
        });
        curr.isGapPoint = true;
      } else {
        totalDistanceKm += stepDistKm;
        segmentDistanceKm += stepDistKm;
      }

      // Determine current point state
      let pointType: 'MOVING' | 'STOPPED' | 'IDLE';
      if (curr.speed > this.config.tripStartSpeedThresholdKmH) {
        pointType = 'MOVING';
      } else if (curr.ignition) {
        pointType = 'IDLE';
      } else {
        pointType = 'STOPPED';
      }

      // Check for state segment change
      if (pointType !== currentSegmentType) {
        const segDuration = (new Date(curr.timestamp).getTime() - new Date(segmentStartPoint.timestamp).getTime()) / 1000;

        segments.push({
          id: `seg-${segments.length + 1}`,
          tripId,
          sequence: segments.length + 1,
          startTime: segmentStartPoint.timestamp,
          endTime: curr.timestamp,
          distanceKm: parseFloat(segmentDistanceKm.toFixed(2)),
          durationSeconds: Math.round(segDuration),
          type: currentSegmentType,
          startLocation: { lat: segmentStartPoint.latitude, lng: segmentStartPoint.longitude },
          endLocation: { lat: curr.latitude, lng: curr.longitude },
        });

        // Record stops or idles
        if (currentSegmentType === 'STOPPED' && segDuration >= 60) {
          stops.push({
            id: `stop-${stops.length + 1}`,
            location: { lat: segmentStartPoint.latitude, lng: segmentStartPoint.longitude },
            stopStart: segmentStartPoint.timestamp,
            stopEnd: curr.timestamp,
            durationSeconds: Math.round(segDuration),
          });
        } else if (currentSegmentType === 'IDLE' && segDuration >= this.config.idleDurationThresholdSeconds) {
          idles.push({
            id: `idle-${idles.length + 1}`,
            location: { lat: segmentStartPoint.latitude, lng: segmentStartPoint.longitude },
            idleStart: segmentStartPoint.timestamp,
            idleEnd: curr.timestamp,
            durationSeconds: Math.round(segDuration),
          });
        }

        // Reset for next segment
        currentSegmentType = pointType;
        segmentStartPoint = curr;
        segmentDistanceKm = 0;
      }
    }

    // Push final segment
    const lastPoint = validPoints[validPoints.length - 1];
    const finalSegDuration = (new Date(lastPoint.timestamp).getTime() - new Date(segmentStartPoint.timestamp).getTime()) / 1000;
    segments.push({
      id: `seg-${segments.length + 1}`,
      tripId,
      sequence: segments.length + 1,
      startTime: segmentStartPoint.timestamp,
      endTime: lastPoint.timestamp,
      distanceKm: parseFloat(segmentDistanceKm.toFixed(2)),
      durationSeconds: Math.round(finalSegDuration),
      type: currentSegmentType,
      startLocation: { lat: segmentStartPoint.latitude, lng: segmentStartPoint.longitude },
      endLocation: { lat: lastPoint.latitude, lng: lastPoint.longitude },
    });

    return {
      tripId,
      points: validPoints,
      distanceKm: parseFloat(totalDistanceKm.toFixed(2)),
      startPoint: validPoints[0],
      endPoint: validPoints[validPoints.length - 1],
      segments,
      events,
      stops,
      idles,
      gaps,
    };
  }
}

export const tripDetectionEngine = new TripDetectionEngine();
