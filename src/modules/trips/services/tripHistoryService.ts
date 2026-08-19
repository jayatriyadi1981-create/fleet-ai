/**
 * Fleet Intelligence Smart AI - Trip History Data & Audit Service
 * PROMPT 14 — Trip Data Store, Route Point Generation, Audit Logging & Exporting
 */

import { DetailedTrip, TripRoute, TripFilterState, TripPoint, TripEvent, TripStatus } from '../types';
import { geocodingService } from './geocodingService';
import { tripDetectionEngine } from './tripDetectionEngine';

// Seed initial realistic enterprise trips across Java logistics routes
const MOCK_DETAILED_TRIPS: DetailedTrip[] = [
  {
    id: 'trp-101',
    tenantId: 'tenant-tln-01',
    branchId: 'br-jkt',
    branchName: 'Cabang Jakarta Headquarter',
    tripNumber: 'TRP-20260814-001',
    vehicleId: 'veh-01',
    vehiclePlate: 'B 9482 UTX',
    vehicleName: 'Hino Ranger FL 235 JW',
    driverId: 'drv-01',
    driverName: 'Bambang Sugianto',
    driverPhone: '+62 812-9876-5432',
    driverPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    deviceId: 'dev-01',
    startTime: '2026-08-14T06:30:00Z',
    endTime: '2026-08-14T09:15:00Z',
    startLatitude: -6.1152,
    startLongitude: 106.8821,
    endLatitude: -6.2825,
    endLongitude: 107.1702,
    startAddress: 'Tanjung Priok Port Gate 3, Jakarta Utara',
    endAddress: 'Cikarang Dry Port & Logistics Center, Bekasi',
    distanceKm: 58.4,
    odometerDistanceKm: 58.8,
    startOdometerKm: 84261.2,
    endOdometerKm: 84320.0,
    durationSeconds: 9900, // 2h 45m
    movingDurationSeconds: 7800, // 2h 10m
    stoppedDurationSeconds: 900, // 15m
    idleDurationSeconds: 1200, // 20m
    averageSpeedKmH: 44.9,
    overallAverageSpeedKmH: 21.2,
    maxSpeedKmH: 94.5,
    maxSpeedAt: '2026-08-14T07:45:00Z',
    maxSpeedLocation: { lat: -6.2340, lng: 106.9500, address: 'Tol Jakarta-Cikampek KM 19' },
    stopsCount: 2,
    idleCount: 2,
    eventsCount: 3,
    status: 'COMPLETED',
    startFuelPercent: 92,
    endFuelPercent: 78,
    fuelConsumedLiters: 28.0,
    createdAt: '2026-08-14T06:30:00Z',
    updatedAt: '2026-08-14T09:15:00Z',
    groupName: 'Armada Trans-Jawa',
  },
  {
    id: 'trp-102',
    tenantId: 'tenant-tln-01',
    branchId: 'br-ckr',
    branchName: 'Cabang Cikarang Logistics Hub',
    tripNumber: 'TRP-20260814-002',
    vehicleId: 'veh-02',
    vehiclePlate: 'B 9102 CKR',
    vehicleName: 'Isuzu Giga FVR 34 P',
    driverId: 'drv-02',
    driverName: 'Ahmad Hidayat',
    driverPhone: '+62 813-1122-3344',
    driverPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    deviceId: 'dev-02',
    startTime: '2026-08-14T10:00:00Z',
    endTime: '2026-08-14T13:45:00Z',
    startLatitude: -6.2825,
    startLongitude: 107.1702,
    endLatitude: -6.3501,
    endLongitude: 107.2800,
    startAddress: 'Kawasan Industri Jababeka 2, Cikarang',
    endAddress: 'Depo Industri Karawang Barat',
    distanceKm: 34.2,
    odometerDistanceKm: 34.5,
    startOdometerKm: 52105.5,
    endOdometerKm: 52140.0,
    durationSeconds: 13500, // 3h 45m
    movingDurationSeconds: 8100, // 2h 15m
    stoppedDurationSeconds: 3600, // 1h
    idleDurationSeconds: 1800, // 30m
    averageSpeedKmH: 30.4,
    overallAverageSpeedKmH: 9.1,
    maxSpeedKmH: 78.0,
    maxSpeedAt: '2026-08-14T11:10:00Z',
    maxSpeedLocation: { lat: -6.3100, lng: 107.2100, address: 'Tol Cikampek KM 42' },
    stopsCount: 3,
    idleCount: 3,
    eventsCount: 1,
    status: 'COMPLETED',
    startFuelPercent: 85,
    endFuelPercent: 62,
    fuelConsumedLiters: 18.5,
    createdAt: '2026-08-14T10:00:00Z',
    updatedAt: '2026-08-14T13:45:00Z',
    groupName: 'Container Port-Cikarang',
  },
  {
    id: 'trp-103',
    tenantId: 'tenant-tln-01',
    branchId: 'br-sby',
    branchName: 'Cabang Surabaya Depot',
    tripNumber: 'TRP-20260814-003',
    vehicleId: 'veh-04',
    vehiclePlate: 'L 8092 UAP',
    vehicleName: 'Scania P360 Heavy Hauler',
    driverId: 'drv-04',
    driverName: 'Eko Prasetyo',
    driverPhone: '+62 815-5544-3322',
    driverPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    deviceId: 'dev-04',
    startTime: '2026-08-14T14:15:00Z',
    endTime: undefined,
    startLatitude: -7.2014,
    startLongitude: 112.7311,
    endLatitude: -7.2400,
    endLongitude: 112.6800,
    startAddress: 'Pelabuhan Tanjung Perak, Surabaya',
    endAddress: 'Gudang Logistik Margomulyo, Surabaya',
    distanceKm: 18.6,
    odometerDistanceKm: 18.6,
    startOdometerKm: 98381.4,
    endOdometerKm: 98400.0,
    durationSeconds: 4200, // 1h 10m so far
    movingDurationSeconds: 3000,
    stoppedDurationSeconds: 600,
    idleDurationSeconds: 600,
    averageSpeedKmH: 22.3,
    overallAverageSpeedKmH: 15.9,
    maxSpeedKmH: 62.0,
    maxSpeedAt: '2026-08-14T14:40:00Z',
    stopsCount: 1,
    idleCount: 1,
    eventsCount: 2,
    status: 'ACTIVE',
    startFuelPercent: 95,
    endFuelPercent: 88,
    fuelConsumedLiters: 12.0,
    createdAt: '2026-08-14T14:15:00Z',
    updatedAt: new Date().toISOString(),
    groupName: 'Armada Logistik Jawa Timur',
  },
];

export class TripHistoryService {
  private trips: DetailedTrip[] = MOCK_DETAILED_TRIPS;
  private auditLogs: Array<{ action: string; timestamp: string; details: any }> = [];

  /**
   * Filter and query historical trips
   */
  public getTrips(filter: Partial<TripFilterState> = {}): DetailedTrip[] {
    this.logAudit('trip_history.opened', { filter });

    return this.trips.filter((t) => {
      // Search Query filter
      if (filter.searchQuery && filter.searchQuery.trim() !== '') {
        const q = filter.searchQuery.toLowerCase();
        const matchPlate = t.vehiclePlate.toLowerCase().includes(q);
        const matchTripNo = t.tripNumber.toLowerCase().includes(q);
        const matchDriver = t.driverName?.toLowerCase().includes(q) || false;
        const matchOrigin = t.startAddress.toLowerCase().includes(q);
        const matchDest = t.endAddress.toLowerCase().includes(q);
        if (!matchPlate && !matchTripNo && !matchDriver && !matchOrigin && !matchDest) {
          return false;
        }
      }

      // Status Filter
      if (filter.status && filter.status !== 'ALL') {
        if (t.status !== filter.status) return false;
      }

      // Vehicle Filter
      if (filter.vehicleId && filter.vehicleId !== 'ALL') {
        if (t.vehicleId !== filter.vehicleId) return false;
      }

      // Driver Filter
      if (filter.driverId && filter.driverId !== 'ALL') {
        if (t.driverId !== filter.driverId) return false;
      }

      // Branch Filter
      if (filter.branchId && filter.branchId !== 'ALL') {
        if (t.branchId !== filter.branchId) return false;
      }

      return true;
    });
  }

  /**
   * Fetch a single trip by ID
   */
  public getTripById(tripId: string): DetailedTrip | null {
    const trip = this.trips.find((t) => t.id === tripId) || null;
    if (trip) {
      this.logAudit('trip.viewed', { tripId });
    }
    return trip;
  }

  /**
   * Generate realistic route polyline points and telemetry points for playback
   */
  public getTripRoute(tripId: string): TripRoute {
    const trip = this.getTripById(tripId);
    if (!trip) {
      return {
        tripId,
        points: [],
        distanceKm: 0,
        startPoint: {} as TripPoint,
        endPoint: {} as TripPoint,
        segments: [],
        events: [],
        stops: [],
        idles: [],
        gaps: [],
      };
    }

    const numPoints = 80;
    const points: TripPoint[] = [];
    const events: TripEvent[] = [];

    const startMs = new Date(trip.startTime).getTime();
    const durationMs = trip.durationSeconds * 1000;
    const endMs = startMs + durationMs;

    // Generate interpolated path with realistic curves & speeds
    for (let i = 0; i < numPoints; i++) {
      const ratio = i / (numPoints - 1);
      const currentMs = startMs + ratio * durationMs;

      // Add a realistic arc curve to line
      const curvature = Math.sin(ratio * Math.PI) * 0.015;
      const lat = trip.startLatitude + ratio * (trip.endLatitude - trip.startLatitude) + curvature;
      const lng = trip.startLongitude + ratio * (trip.endLongitude - trip.startLongitude) + curvature * 0.5;

      // Speed profile: slower at start/end, peak in middle
      let speed = Math.sin(ratio * Math.PI) * trip.maxSpeedKmH * 0.95;
      let ignition = true;
      let status: 'Moving' | 'Stopped' | 'Idle' = 'Moving';

      // Insert controlled stops / idles in route
      if (i >= 20 && i <= 24) {
        speed = 0;
        status = 'Idle';
      } else if (i >= 50 && i <= 55) {
        speed = 0;
        ignition = false;
        status = 'Stopped';
      }

      const heading = Math.round((Math.atan2(trip.endLatitude - trip.startLatitude, trip.endLongitude - trip.startLongitude) * 180 / Math.PI + 360) % 360);

      points.push({
        id: `pt-${i + 1}`,
        tripId,
        timestamp: new Date(currentMs).toISOString(),
        latitude: parseFloat(lat.toFixed(6)),
        longitude: parseFloat(lng.toFixed(6)),
        speed: parseFloat(speed.toFixed(1)),
        heading,
        ignition,
        odometer: parseFloat((trip.startOdometerKm! + ratio * trip.distanceKm).toFixed(1)),
        fuelLevel: parseFloat((trip.startFuelPercent! - ratio * (trip.startFuelPercent! - trip.endFuelPercent!)).toFixed(1)),
        status,
      });

      // Insert Speeding Event
      if (i === 35) {
        events.push({
          id: `ev-sp-${i}`,
          tripId,
          timestamp: new Date(currentMs).toISOString(),
          type: 'speeding',
          latitude: lat,
          longitude: lng,
          speed: trip.maxSpeedKmH,
          heading,
          message: `Peringatan Kecepatan (${trip.maxSpeedKmH} km/h)`,
          details: 'Batas kecepatan lokasi 80 km/h',
        });
      }

      // Insert Harsh Braking Event
      if (i === 62) {
        events.push({
          id: `ev-hb-${i}`,
          tripId,
          timestamp: new Date(currentMs).toISOString(),
          type: 'harsh_brake',
          latitude: lat,
          longitude: lng,
          speed: 25,
          heading,
          message: 'Terdeteksi Pengereman Mendadak',
          details: 'Deceleration: -4.2 m/s²',
        });
      }
    }

    return tripDetectionEngine.processTelemetryIntoTripRoute(tripId, points, events);
  }

  /**
   * Export Trips Data (CSV / Excel simulation) with audit logging
   */
  public exportTrips(trips: DetailedTrip[], format: 'CSV' | 'EXCEL' | 'PDF'): void {
    this.logAudit('trip.exported', { format, count: trips.length });

    if (format === 'CSV') {
      const headers = [
        'No Perjalanan',
        'Nomor Polisi',
        'Nama Pengemudi',
        'Waktu Mulai',
        'Waktu Selesai',
        'Asal',
        'Tujuan',
        'Jarak (KM)',
        'Durasi (Jam)',
        'Kecepatan Maks (KM/H)',
        'Status',
      ];

      const rows = trips.map((t) => [
        t.tripNumber,
        t.vehiclePlate,
        t.driverName || '-',
        t.startTime,
        t.endTime || '-',
        `"${t.startAddress}"`,
        `"${t.endAddress}"`,
        t.distanceKm,
        (t.durationSeconds / 3600).toFixed(2),
        t.maxSpeedKmH,
        t.status,
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Laporan_Perjalanan_Fleet_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  private logAudit(action: string, details: any): void {
    const entry = { action, timestamp: new Date().toISOString(), details };
    this.auditLogs.push(entry);
    console.log(`[AUDIT LOG] ${action}:`, details);
  }
}

export const tripHistoryService = new TripHistoryService();
