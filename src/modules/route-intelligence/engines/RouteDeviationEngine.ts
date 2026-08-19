/**
 * Fleet Intelligence Smart AI - Route Deviation Engine
 * Detects Off Route, Detours, Wrong Direction, Missed Waypoints, Unauthorized Stops,
 * evaluates Corridor Thresholds (default 300m), and infers AI root cause hypotheses.
 */

import { RouteDeviationEvent, DeviationStatus, DeviationReasonCategory, RouteCoordinates } from '../types';

export class RouteDeviationEngine {
  private static instance: RouteDeviationEngine;
  private corridorThresholdMeters = 300;

  private mockDeviations: RouteDeviationEvent[] = [
    {
      id: 'dev-001',
      tripId: 'trip-1024',
      tripNumber: 'TRIP-JKT-BDG-1024',
      vehicleId: 'v-b1234xx',
      plateNumber: 'B 1234 XX',
      driverName: 'Bambang Supriyanto',
      branch: 'Jakarta Timur (Cakung)',
      timestamp: '2026-08-16T08:24:00Z',
      plannedLocation: { lat: -6.2340, lng: 106.9150, address: 'Tol Jakarta-Cikampek KM 12' },
      actualLocation: { lat: -6.2280, lng: 106.9190, address: 'Jl. Inspeksi Kalimalang (420m off corridor)' },
      distanceFromRouteMeters: 420,
      corridorThresholdMeters: 300,
      durationMinutes: 6,
      status: 'ACTIVE',
      aiReasonCategory: 'TRAFFIC_AVOIDANCE',
      aiReasonExplanation: 'Kendaraan keluar ke arteri Kalimalang untuk menghindari antrean kecelakaan di Tol Cikunir.',
      evidence: [
        'GPS speed di tol sebelum keluar terdeteksi 4 km/jam selama 12 menit.',
        'Data traffic segment KM 14 menunjukkan antrean merah (Severe Congestion).',
        'Arah kendaraan menuju gerbang tol berikutnya (Tambun) untuk re-entry.',
      ],
    },
    {
      id: 'dev-002',
      tripId: 'trip-1028',
      tripNumber: 'TRIP-SBY-MLG-1028',
      vehicleId: 'v-l9876ab',
      plateNumber: 'L 9876 AB',
      driverName: 'Heri Wicaksono',
      branch: 'Surabaya (Rungkut)',
      timestamp: '2026-08-16T07:45:00Z',
      plannedLocation: { lat: -7.5520, lng: 112.6840, address: 'Tol Surabaya - Gempol KM 32' },
      actualLocation: { lat: -7.5480, lng: 112.6710, address: 'Rest Area & Warung Porong' },
      distanceFromRouteMeters: 750,
      corridorThresholdMeters: 300,
      durationMinutes: 24,
      status: 'RECOVERED',
      recoveryTime: '2026-08-16T08:09:00Z',
      aiReasonCategory: 'UNAUTHORIZED_STOP',
      aiReasonExplanation: 'Kendaraan berhenti di luar rest area resmi selama 24 menit tanpa status istirahat terdaftar.',
      evidence: [
        'Status mesin idle 18 menit, ignition OFF 6 menit di luar manifest.',
        'Jarak 750m dari koridor jalan tol yang ditugaskan.',
      ],
    },
    {
      id: 'dev-003',
      tripId: 'trip-1033',
      tripNumber: 'TRIP-SMG-SLO-1033',
      vehicleId: 'v-h4521kp',
      plateNumber: 'H 4521 KP',
      driverName: 'Suryo Nugroho',
      branch: 'Semarang (Krapyak)',
      timestamp: '2026-08-16T06:15:00Z',
      plannedLocation: { lat: -7.1850, lng: 110.4280, address: 'Tol Semarang - Solo KM 430' },
      actualLocation: { lat: -7.1990, lng: 110.4350, address: 'Jalur Arteri Bawen' },
      distanceFromRouteMeters: 510,
      corridorThresholdMeters: 300,
      durationMinutes: 12,
      status: 'ACKNOWLEDGED',
      aiReasonCategory: 'ROAD_CLOSURE',
      aiReasonExplanation: 'Pengalihan jalur resmi oleh kepolisian akibat perbaikan jembatan tol KM 432.',
      evidence: [
        'Pemberitahuan NOTAM/Jasa Marga perbaikan lajur jam 05:00-08:00 WIB.',
        '5 kendaraan armada lain di koridor serupa melakukan pengalihan seragam.',
      ],
    },
  ];

  private constructor() {}

  public static getInstance(): RouteDeviationEngine {
    if (!RouteDeviationEngine.instance) {
      RouteDeviationEngine.instance = new RouteDeviationEngine();
    }
    return RouteDeviationEngine.instance;
  }

  public getCorridorThreshold(): number {
    return this.corridorThresholdMeters;
  }

  public setCorridorThreshold(meters: number): void {
    this.corridorThresholdMeters = Math.max(50, meters);
  }

  public getAllDeviations(): RouteDeviationEvent[] {
    return this.mockDeviations;
  }

  public getActiveDeviations(): RouteDeviationEvent[] {
    return this.mockDeviations.filter((d) => d.status === 'ACTIVE');
  }

  public checkDeviation(currentPoint: RouteCoordinates, plannedCorridorPoints: RouteCoordinates[]): {
    isDeviated: boolean;
    distanceMeters: number;
  } {
    // Simple mock distance to nearest planned point
    const minDistanceMeters = 420; // Simulated
    return {
      isDeviated: minDistanceMeters > this.corridorThresholdMeters,
      distanceMeters: minDistanceMeters,
    };
  }

  public updateDeviationStatus(id: string, status: DeviationStatus): boolean {
    const dev = this.mockDeviations.find((d) => d.id === id);
    if (dev) {
      dev.status = status;
      return true;
    }
    return false;
  }
}

export const routeDeviationEngine = RouteDeviationEngine.getInstance();
