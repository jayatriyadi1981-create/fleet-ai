/**
 * Driver Behavior & Safety Intelligence Store & Mock Repository
 * Centralized data management, state management, and real-time triggers
 * PROMPT 21 Architecture
 */

import {
  BehaviorAIInsight,
  BehaviorEventType,
  BehaviorRiskHotspot,
  BehaviorSeverity,
  DriverBehaviorEvent,
  DriverBehaviorRule,
  DriverCoaching,
  DriverSafetyScoreConfig,
  DriverSafetySummary,
  ReviewStatus,
  ScorePeriod,
} from '../types';
import { driverSafetyScoreService } from './driverSafetyScoreService';
import { driverBehaviorAIService } from './driverBehaviorAIService';

// Initial Mock Rules
export const MOCK_BEHAVIOR_RULES: DriverBehaviorRule[] = [
  {
    id: 'rule-1',
    tenantId: 'tenant-1',
    eventType: 'OVERSPEED',
    threshold: 15, // km/h excess
    duration: 5, // minimum 5 seconds
    severity: 'HIGH',
    enabled: true,
    description: 'Peringatan melampaui batas kecepatan rute > 15 km/jam selama min 5 detik',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 'rule-2',
    tenantId: 'tenant-1',
    eventType: 'HARSH_BRAKING',
    threshold: -3.2, // m/s^2
    duration: 1,
    severity: 'HIGH',
    enabled: true,
    description: 'Pengereman mendadak dengan deselerasi tajam <= -3.2 m/s²',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 'rule-3',
    tenantId: 'tenant-1',
    eventType: 'HARSH_ACCELERATION',
    threshold: 2.5, // m/s^2
    duration: 1,
    severity: 'MEDIUM',
    enabled: true,
    description: 'Akselerasi mendadak / penekanan gas mendadak >= +2.5 m/s²',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 'rule-4',
    tenantId: 'tenant-1',
    eventType: 'SHARP_TURN',
    threshold: 45, // degrees
    duration: 2,
    severity: 'MEDIUM',
    enabled: true,
    description: 'Belokan tajam > 45 derajat pada kecepatan tinggi (> 35 km/jam)',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 'rule-5',
    tenantId: 'tenant-1',
    eventType: 'EXCESSIVE_IDLE',
    threshold: 300, // 5 minutes
    duration: 300,
    severity: 'LOW',
    enabled: true,
    description: 'Idling berlebih saat kontak ON & speed 0 > 5 menit',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 'rule-6',
    tenantId: 'tenant-1',
    eventType: 'ROUTE_DEVIATION',
    threshold: 200, // meters
    duration: 30,
    severity: 'HIGH',
    enabled: true,
    description: 'Keluar koridor rute master sejauh > 200 meter selama min 30 detik',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z',
  },
];

// Initial Mock Driver Summaries
export const MOCK_DRIVER_SUMMARIES: DriverSafetySummary[] = [
  {
    driverId: 'drv-1',
    driverName: 'Andi Pratama',
    driverPhone: '+62 812-3456-7890',
    simType: 'SIM BII Umum',
    branchId: 'br-1',
    branchName: 'Cabang Jakarta',
    vehicleId: 'veh-1',
    vehiclePlate: 'B 9821 UTX',
    vehicleType: 'truck_box',
    period: '30_DAYS',
    score: 88,
    previousScore: 82,
    trend: 'IMPROVING',
    trendDelta: 6,
    riskLevel: 'GOOD',
    totalEvents: 14,
    overspeedCount: 6,
    harshBrakingCount: 3,
    harshAccelCount: 2,
    sharpTurnCount: 1,
    idleCount: 1,
    routeDeviationCount: 1,
    distanceKm: 2450,
    drivingHours: 62,
    eventsPer100Km: 0.6,
    eventsPer10Hours: 2.3,
    rank: 3,
    updatedAt: '2026-08-15T04:00:00Z',
  },
  {
    driverId: 'drv-2',
    driverName: 'Budi Santoso',
    driverPhone: '+62 813-9876-5432',
    simType: 'SIM B1 Umum',
    branchId: 'br-2',
    branchName: 'Cabang Surabaya',
    vehicleId: 'veh-2',
    vehiclePlate: 'B 1234 ABC',
    vehicleType: 'truck_container',
    period: '30_DAYS',
    score: 94,
    previousScore: 92,
    trend: 'IMPROVING',
    trendDelta: 2,
    riskLevel: 'EXCELLENT',
    totalEvents: 6,
    overspeedCount: 2,
    harshBrakingCount: 1,
    harshAccelCount: 1,
    sharpTurnCount: 1,
    idleCount: 1,
    routeDeviationCount: 0,
    distanceKm: 3100,
    drivingHours: 74,
    eventsPer100Km: 0.2,
    eventsPer10Hours: 0.8,
    rank: 1,
    updatedAt: '2026-08-15T04:00:00Z',
  },
  {
    driverId: 'drv-3',
    driverName: 'Citra Dewi',
    driverPhone: '+62 811-2233-4455',
    simType: 'SIM A',
    branchId: 'br-1',
    branchName: 'Cabang Jakarta',
    vehicleId: 'veh-3',
    vehiclePlate: 'B 4567 DEF',
    vehicleType: 'van',
    period: '30_DAYS',
    score: 91,
    previousScore: 90,
    trend: 'IMPROVING',
    trendDelta: 1,
    riskLevel: 'EXCELLENT',
    totalEvents: 8,
    overspeedCount: 3,
    harshBrakingCount: 2,
    harshAccelCount: 1,
    sharpTurnCount: 1,
    idleCount: 1,
    routeDeviationCount: 0,
    distanceKm: 1890,
    drivingHours: 48,
    eventsPer100Km: 0.4,
    eventsPer10Hours: 1.7,
    rank: 2,
    updatedAt: '2026-08-15T04:00:00Z',
  },
  {
    driverId: 'drv-4',
    driverName: 'Doni Wijaya',
    driverPhone: '+62 856-7890-1234',
    simType: 'SIM BII Umum',
    branchId: 'br-3',
    branchName: 'Cabang Bandung',
    vehicleId: 'veh-4',
    vehiclePlate: 'B 7890 GHI',
    vehicleType: 'truck_dump',
    period: '30_DAYS',
    score: 74,
    previousScore: 81,
    trend: 'DECLINING',
    trendDelta: -7,
    riskLevel: 'FAIR',
    totalEvents: 32,
    overspeedCount: 14,
    harshBrakingCount: 8,
    harshAccelCount: 4,
    sharpTurnCount: 3,
    idleCount: 2,
    routeDeviationCount: 1,
    distanceKm: 2100,
    drivingHours: 58,
    eventsPer100Km: 1.5,
    eventsPer10Hours: 5.5,
    rank: 4,
    updatedAt: '2026-08-15T04:00:00Z',
  },
  {
    driverId: 'drv-5',
    driverName: 'Eko Prasetyo',
    driverPhone: '+62 878-1122-3344',
    simType: 'SIM B1',
    branchId: 'br-2',
    branchName: 'Cabang Surabaya',
    vehicleId: 'veh-5',
    vehiclePlate: 'B 9876 XYZ',
    vehicleType: 'truck_box',
    period: '30_DAYS',
    score: 58,
    previousScore: 65,
    trend: 'DECLINING',
    trendDelta: -7,
    riskLevel: 'HIGH_RISK',
    totalEvents: 48,
    overspeedCount: 22,
    harshBrakingCount: 12,
    harshAccelCount: 6,
    sharpTurnCount: 4,
    idleCount: 2,
    routeDeviationCount: 2,
    distanceKm: 1950,
    drivingHours: 52,
    eventsPer100Km: 2.5,
    eventsPer10Hours: 9.2,
    rank: 5,
    updatedAt: '2026-08-15T04:00:00Z',
  },
];

// Initial Mock Behavior Events
export const MOCK_BEHAVIOR_EVENTS: DriverBehaviorEvent[] = [
  {
    id: 'evt-101',
    tenantId: 'tenant-1',
    driverId: 'drv-1',
    driverName: 'Andi Pratama',
    vehicleId: 'veh-1',
    vehiclePlate: 'B 9821 UTX',
    deviceId: 'dev-101',
    tripId: 'trp-001',
    tripNumber: 'TRP-20260815-001',
    routeId: 'rt-1',
    routeName: 'Jakarta - Bandung Express',
    eventType: 'OVERSPEED',
    severity: 'HIGH',
    timestamp: '2026-08-15T03:45:12Z',
    latitude: -6.4025,
    longitude: 106.7942,
    locationName: 'Tol Jagorawi KM 28, Bogor',
    speed: 104,
    speedLimit: 80,
    heading: 142,
    duration: 18,
    distance: 520,
    riskScore: 78,
    confidenceScore: 95,
    reviewStatus: 'UNREVIEWED',
    metadata: {
      excessSpeed: 24,
      roadContext: 'Tol Bebas Hambatan',
      vehicleType: 'truck_box',
    },
    telemetryBefore: [
      { timestamp: '2026-08-15T03:45:02Z', speed: 82, speedLimit: 80, heading: 140, lat: -6.4010, lng: 106.7930, ignition: true },
      { timestamp: '2026-08-15T03:45:07Z', speed: 94, speedLimit: 80, heading: 141, lat: -6.4018, lng: 106.7936, ignition: true },
    ],
    telemetryAfter: [
      { timestamp: '2026-08-15T03:45:17Z', speed: 98, speedLimit: 80, heading: 143, lat: -6.4032, lng: 106.7948, ignition: true },
      { timestamp: '2026-08-15T03:45:22Z', speed: 84, speedLimit: 80, heading: 144, lat: -6.4040, lng: 106.7955, ignition: true },
    ],
    createdAt: '2026-08-15T03:45:12Z',
  },
  {
    id: 'evt-102',
    tenantId: 'tenant-1',
    driverId: 'drv-5',
    driverName: 'Eko Prasetyo',
    vehicleId: 'veh-5',
    vehiclePlate: 'B 9876 XYZ',
    deviceId: 'dev-105',
    tripId: 'trp-005',
    tripNumber: 'TRP-20260815-005',
    routeId: 'rt-2',
    routeName: 'Surabaya - Malang Cargo',
    eventType: 'HARSH_BRAKING',
    severity: 'CRITICAL',
    timestamp: '2026-08-15T02:15:30Z',
    latitude: -7.5361,
    longitude: 112.6881,
    locationName: 'Jl. Raya Porong, Sidoarjo',
    speed: 38,
    speedLimit: 60,
    deceleration: -4.8,
    heading: 210,
    duration: 2,
    riskScore: 92,
    confidenceScore: 98,
    reviewStatus: 'CONFIRMED',
    reviewNote: 'Dikonfirmasi tim patroli - pengereman mendadak menghindari sepeda motor',
    reviewedBy: 'Operational Lead (Dimas)',
    metadata: {
      speedBefore: 78,
      speedAfter: 38,
      roadContext: 'Jalur Arteri Perkotaan',
    },
    createdAt: '2026-08-15T02:15:30Z',
  },
  {
    id: 'evt-103',
    tenantId: 'tenant-1',
    driverId: 'drv-4',
    driverName: 'Doni Wijaya',
    vehicleId: 'veh-4',
    vehiclePlate: 'B 7890 GHI',
    deviceId: 'dev-104',
    tripId: 'trp-004',
    tripNumber: 'TRP-20260814-004',
    eventType: 'SHARP_TURN',
    severity: 'MEDIUM',
    timestamp: '2026-08-14T15:20:00Z',
    latitude: -6.9175,
    longitude: 107.6191,
    locationName: 'Pertigaan Soekarno Hatta, Bandung',
    speed: 48,
    speedLimit: 50,
    heading: 85,
    duration: 3,
    riskScore: 55,
    confidenceScore: 90,
    reviewStatus: 'UNREVIEWED',
    metadata: {
      turnAngle: 58,
      headingBefore: 27,
      headingAfter: 85,
    },
    createdAt: '2026-08-14T15:20:00Z',
  },
  {
    id: 'evt-104',
    tenantId: 'tenant-1',
    driverId: 'drv-5',
    driverName: 'Eko Prasetyo',
    vehicleId: 'veh-5',
    vehiclePlate: 'B 9876 XYZ',
    deviceId: 'dev-105',
    tripId: 'trp-005',
    eventType: 'ROUTE_DEVIATION',
    severity: 'HIGH',
    timestamp: '2026-08-14T11:10:00Z',
    latitude: -7.2575,
    longitude: 112.7521,
    locationName: 'Jalur Alternatif Krian, Sidoarjo',
    speed: 42,
    speedLimit: 50,
    heading: 180,
    duration: 420,
    distance: 850,
    riskScore: 75,
    confidenceScore: 92,
    reviewStatus: 'UNREVIEWED',
    metadata: {
      plannedRouteId: 'rt-2',
      deviationDistance: 850,
      deviationDuration: 420,
    },
    createdAt: '2026-08-14T11:10:00Z',
  },
  {
    id: 'evt-105',
    tenantId: 'tenant-1',
    driverId: 'drv-1',
    driverName: 'Andi Pratama',
    vehicleId: 'veh-1',
    vehiclePlate: 'B 9821 UTX',
    deviceId: 'dev-101',
    eventType: 'EXCESSIVE_IDLE',
    severity: 'LOW',
    timestamp: '2026-08-14T08:30:00Z',
    latitude: -6.1751,
    longitude: 106.8650,
    locationName: 'Rest Area KM 19 Tol Cikampek',
    speed: 0,
    speedLimit: 0,
    heading: 90,
    duration: 720, // 12 mins
    riskScore: 30,
    confidenceScore: 99,
    reviewStatus: 'CONFIRMED',
    reviewNote: 'Wajar: Menunggu antrean pengisian e-toll',
    reviewedBy: 'Fleet Admin',
    metadata: {
      fuelConsumptionEstimate: 0.4,
    },
    createdAt: '2026-08-14T08:30:00Z',
  },
];

// Initial Mock Coachings
export const MOCK_COACHINGS: DriverCoaching[] = [
  {
    id: 'ch-1',
    tenantId: 'tenant-1',
    driverId: 'drv-5',
    driverName: 'Eko Prasetyo',
    triggerEventId: 'evt-102',
    category: 'HARSH_DRIVING',
    priority: 'CRITICAL',
    recommendation: 'Pelatihan Defensive Driving & Pengendalian Jarak Pengereman Aman',
    assignedTo: 'usr-mgr-1',
    assignedToName: 'Bambang S. (Head of Safety)',
    scheduledAt: '2026-08-18T09:00:00Z',
    status: 'SCHEDULED',
    notes: 'Prioritas tinggi karena frekuensi harsh braking > 10 kali bulan ini.',
    beforeScore: 58,
    createdAt: '2026-08-15T02:30:00Z',
    updatedAt: '2026-08-15T02:30:00Z',
  },
  {
    id: 'ch-2',
    tenantId: 'tenant-1',
    driverId: 'drv-4',
    driverName: 'Doni Wijaya',
    triggerEventId: 'evt-103',
    category: 'SPEEDING',
    priority: 'HIGH',
    recommendation: 'Coaching Kesadaran Batas Kecepatan Tol Trans-Jawa',
    assignedTo: 'usr-mgr-2',
    assignedToName: 'Rina W. (Fleet Coordinator)',
    scheduledAt: '2026-08-12T14:00:00Z',
    status: 'COMPLETED',
    notes: 'Pengemudi telah mengikuti materi video & evaluasi simulasi. Hasil pemahaman memuaskan.',
    beforeScore: 74,
    afterScore: 82,
    completedAt: '2026-08-12T15:30:00Z',
    createdAt: '2026-08-10T10:00:00Z',
    updatedAt: '2026-08-12T15:30:00Z',
  },
];

// Initial Mock Hotspots
export const MOCK_HOTSPOTS: BehaviorRiskHotspot[] = [
  {
    id: 'hs-1',
    tenantId: 'tenant-1',
    locationName: 'Tol Cipali KM 102 - KM 108',
    city: 'Subang',
    branchName: 'Cabang Jakarta',
    latitude: -6.5201,
    longitude: 107.7402,
    radiusMeters: 3000,
    totalEvents: 42,
    primaryEventType: 'OVERSPEED',
    riskLevel: 'CRITICAL',
    speedLimitKmH: 100,
    avgExcessSpeed: 21.5,
  },
  {
    id: 'hs-2',
    tenantId: 'tenant-1',
    locationName: 'Simpang Porong - Sidoarjo',
    city: 'Sidoarjo',
    branchName: 'Cabang Surabaya',
    latitude: -7.5361,
    longitude: 112.6881,
    radiusMeters: 1500,
    totalEvents: 28,
    primaryEventType: 'HARSH_BRAKING',
    riskLevel: 'HIGH',
    speedLimitKmH: 60,
  },
  {
    id: 'hs-3',
    tenantId: 'tenant-1',
    locationName: 'Bunderan Cibiru Soekarno Hatta',
    city: 'Bandung',
    branchName: 'Cabang Bandung',
    latitude: -6.9380,
    longitude: 107.7120,
    radiusMeters: 800,
    totalEvents: 19,
    primaryEventType: 'SHARP_TURN',
    riskLevel: 'MEDIUM',
    speedLimitKmH: 50,
  },
];

export class BehaviorStoreService {
  private summaries: DriverSafetySummary[] = [...MOCK_DRIVER_SUMMARIES];
  private events: DriverBehaviorEvent[] = [...MOCK_BEHAVIOR_EVENTS];
  private rules: DriverBehaviorRule[] = [...MOCK_BEHAVIOR_RULES];
  private coachings: DriverCoaching[] = [...MOCK_COACHINGS];
  private hotspots: BehaviorRiskHotspot[] = [...MOCK_HOTSPOTS];

  // Summaries
  public getSummaries(branchId?: string, search?: string): DriverSafetySummary[] {
    return this.summaries.filter((s) => {
      if (branchId && branchId !== 'all' && s.branchId !== branchId) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          s.driverName.toLowerCase().includes(q) ||
          (s.vehiclePlate && s.vehiclePlate.toLowerCase().includes(q)) ||
          s.branchName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }

  public getSummaryByDriverId(driverId: string): DriverSafetySummary | undefined {
    return this.summaries.find((s) => s.driverId === driverId);
  }

  // Events
  public getEvents(filters?: {
    driverId?: string;
    vehicleId?: string;
    eventType?: string;
    severity?: string;
    reviewStatus?: string;
    search?: string;
  }): DriverBehaviorEvent[] {
    return this.events.filter((e) => {
      if (filters?.driverId && e.driverId !== filters.driverId) return false;
      if (filters?.vehicleId && e.vehicleId !== filters.vehicleId) return false;
      if (filters?.eventType && filters.eventType !== 'all' && e.eventType !== filters.eventType) return false;
      if (filters?.severity && filters.severity !== 'all' && e.severity !== filters.severity) return false;
      if (filters?.reviewStatus && filters.reviewStatus !== 'all' && e.reviewStatus !== filters.reviewStatus) return false;
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        return (
          e.driverName.toLowerCase().includes(q) ||
          e.vehiclePlate.toLowerCase().includes(q) ||
          e.locationName.toLowerCase().includes(q) ||
          e.eventType.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }

  public getEventById(id: string): DriverBehaviorEvent | undefined {
    return this.events.find((e) => e.id === id);
  }

  public reviewEvent(id: string, status: ReviewStatus, note?: string, reviewerName: string = 'Fleet Manager'): DriverBehaviorEvent | null {
    const idx = this.events.findIndex((e) => e.id === id);
    if (idx === -1) return null;

    const updated: DriverBehaviorEvent = {
      ...this.events[idx],
      reviewStatus: status,
      reviewNote: note || this.events[idx].reviewNote,
      reviewedBy: reviewerName,
    };
    this.events[idx] = updated;
    return updated;
  }

  // Rules
  public getRules(): DriverBehaviorRule[] {
    return this.rules;
  }

  public updateRule(ruleId: string, updates: Partial<DriverBehaviorRule>): DriverBehaviorRule | null {
    const idx = this.rules.findIndex((r) => r.id === ruleId);
    if (idx === -1) return null;

    const updated: DriverBehaviorRule = {
      ...this.rules[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.rules[idx] = updated;
    return updated;
  }

  // Coachings
  public getCoachings(): DriverCoaching[] {
    return this.coachings;
  }

  public createCoaching(data: Omit<DriverCoaching, 'id' | 'createdAt' | 'updatedAt'>): DriverCoaching {
    const newCoaching: DriverCoaching = {
      ...data,
      id: `ch-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.coachings.unshift(newCoaching);
    return newCoaching;
  }

  public updateCoachingStatus(
    id: string,
    status: DriverCoaching['status'],
    afterScore?: number,
    notes?: string
  ): DriverCoaching | null {
    const idx = this.coachings.findIndex((c) => c.id === id);
    if (idx === -1) return null;

    const current = this.coachings[idx];
    const updated: DriverCoaching = {
      ...current,
      status,
      afterScore: afterScore !== undefined ? afterScore : current.afterScore,
      notes: notes !== undefined ? notes : current.notes,
      completedAt: status === 'COMPLETED' ? new Date().toISOString() : current.completedAt,
      updatedAt: new Date().toISOString(),
    };

    // If completed and score improved, update driver summary score
    if (status === 'COMPLETED' && afterScore !== undefined) {
      const summaryIdx = this.summaries.findIndex((s) => s.driverId === current.driverId);
      if (summaryIdx !== -1) {
        const sum = this.summaries[summaryIdx];
        const newScore = Math.max(sum.score, afterScore);
        this.summaries[summaryIdx] = {
          ...sum,
          previousScore: sum.score,
          score: newScore,
          trendDelta: newScore - sum.score,
          trend: 'IMPROVING',
          updatedAt: new Date().toISOString(),
        };
      }
    }

    this.coachings[idx] = updated;
    return updated;
  }

  // Hotspots
  public getHotspots(): BehaviorRiskHotspot[] {
    return this.hotspots;
  }
}

export const behaviorStore = new BehaviorStoreService();
