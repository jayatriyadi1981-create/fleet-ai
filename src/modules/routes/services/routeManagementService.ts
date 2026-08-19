/**
 * Fleet Intelligence Smart AI - Master Route Management Service
 * PROMPT 16 — Master Route CRUD, Versioning, Filtering, Audit Logging & Multi-tenant Scoping
 */

import {
  Route,
  RouteFilterState,
  RouteStatus,
  RouteType,
  RoutePriority,
  RouteOptimizationStatus,
  RouteWaypoint,
  RouteRestriction,
  AlternativeRoute,
} from '../routeTypes';
import { routeCalculationService } from './routeCalculationService';
import { routeOptimizationService } from './routeOptimizationService';
import { routeVersionService } from './routeVersionService';

const MOCK_ROUTES_SEED: Route[] = [
  {
    id: 'rt-001',
    tenantId: 'tenant-001',
    routeCode: 'RT-2026-000001',
    name: 'Jakarta (Depo Cikarang) → Bandung (Gedebage Warehouse)',
    description: 'Rute distribusi logistik harian Jakarta-Bandung via Tol Layang MBZ & Purbaleunyi.',
    origin: {
      name: 'Depo Utama Cikarang',
      address: 'Kawasan Industri Jababeka V, Cikarang, Jawa Barat',
      latitude: -6.3152,
      longitude: 107.1452,
      contactPerson: 'Budi Santoso',
      contactPhone: '0812-9988-7766',
    },
    destination: {
      name: 'Warehouse Logistik Gedebage',
      address: 'Jl. Soekarno-Hatta No. 788, Gedebage, Bandung',
      latitude: -6.9458,
      longitude: 107.6845,
      contactPerson: 'Agus Setiawan',
      contactPhone: '0813-1122-3344',
    },
    waypoints: [
      {
        id: 'wp-001-1',
        routeId: 'rt-001',
        sequence: 1,
        name: 'SPBU Rest Area KM 57 Tol Cikampek',
        address: 'Rest Area KM 57 Tol Jakarta-Cikampek',
        latitude: -6.3789,
        longitude: 107.2845,
        type: 'FUEL',
        stopDurationMinutes: 20,
        notes: 'Pengisian BBM Solar Biodiesel B35 & Istirahat Pengemudi',
      },
      {
        id: 'wp-001-2',
        routeId: 'rt-001',
        sequence: 2,
        name: 'Depo Hub Padalarang',
        address: 'Jl. Raya Padalarang No. 45, Bandung Barat',
        latitude: -6.8394,
        longitude: 107.4762,
        type: 'CHECKPOINT',
        stopDurationMinutes: 15,
        notes: 'Pemeriksaan Segel Kargo & Dokumen Manifest',
      },
    ],
    plannedPolyline: [
      [-6.3152, 107.1452],
      [-6.345, 107.21],
      [-6.3789, 107.2845],
      [-6.5, 107.38],
      [-6.8394, 107.4762],
      [-6.915, 107.6],
      [-6.9458, 107.6845],
    ],
    alternativeRoutes: [
      {
        id: 'alt-rt-1a',
        name: 'Rute Alternatif A (Via Arteri Purwakarta Bebas Tol)',
        distanceKm: 168.2,
        estimatedDurationMinutes: 245,
        tollCostIdr: 0,
        riskLevel: 'Medium',
        polyline: [
          [-6.3152, 107.1452],
          [-6.45, 107.3],
          [-6.55, 107.44],
          [-6.8394, 107.4762],
          [-6.9458, 107.6845],
        ],
        score: 85,
        keyDiff: 'Hemat tol Rp125.000, estimasi waktu +37 mnt',
      },
    ],
    distanceKm: 153.4,
    estimatedDurationMinutes: 208,
    status: 'ACTIVE',
    optimizationStatus: 'OPTIMIZED',
    routeType: 'RECURRING',
    priority: 'HIGH',
    restrictions: [
      {
        id: 'res-01',
        name: 'Jembatan Timbang Cibaragalan',
        type: 'WEIGHT_LIMIT',
        description: 'Batas maksimal muatan sumbu terberat (MST) 10 Ton',
        latitude: -6.52,
        longitude: 107.42,
        active: true,
        limitValue: 10,
        unit: 'Ton',
      },
      {
        id: 'res-02',
        name: 'Jam Pembatasan Truk Tol Dalam Kota',
        type: 'TIME_RESTRICTION',
        description: 'Pembatasan kendaraan berat melintas pukul 06:00-09:00',
        latitude: -6.2,
        longitude: 106.85,
        active: true,
        timeWindow: { start: '06:00', end: '09:00' },
      },
    ],
    vehicleRestrictions: {
      maxWeightTon: 24,
      maxHeightMeters: 4.2,
      maxWidthMeters: 2.5,
      allowTolls: true,
      allowHighways: true,
    },
    currentVersion: 1,
    activeTripsCount: 2,
    deviationCount: 0,
    createdBy: 'Fleet Logistics Manager',
    createdAt: '2026-08-01T08:00:00.000Z',
    updatedAt: '2026-08-14T10:30:00.000Z',
  },
  {
    id: 'rt-002',
    tenantId: 'tenant-001',
    routeCode: 'RT-2026-000002',
    name: 'Jakarta → Semarang → Surabaya Trans Jawa Expressway',
    description: 'Rute ekspres koridor utama Trans Jawa lintas provinsi Jakarta - Surabaya.',
    origin: {
      name: 'Port Hub Tanjung Priok',
      address: 'Jl. Raya Pelabuhan No. 1, Jakarta Utara',
      latitude: -6.1023,
      longitude: 106.8821,
    },
    destination: {
      name: 'Depo Petikemas Tanjung Perak',
      address: 'Jl. Alun-Alun Priok No. 5, Surabaya, Jawa Timur',
      latitude: -7.2012,
      longitude: 112.7354,
    },
    waypoints: [
      {
        id: 'wp-002-1',
        routeId: 'rt-002',
        sequence: 1,
        name: 'Hub Logistik Semarang Terboyo',
        address: 'Kawasan Industri Terboyo, Semarang',
        latitude: -6.9582,
        longitude: 110.4589,
        type: 'DELIVERY',
        stopDurationMinutes: 45,
        notes: 'Drop kargo partial 10 Ton',
      },
    ],
    plannedPolyline: [
      [-6.1023, 106.8821],
      [-6.3, 107.5],
      [-6.8, 109.0],
      [-6.9582, 110.4589],
      [-7.1, 111.5],
      [-7.2012, 112.7354],
    ],
    alternativeRoutes: [],
    distanceKm: 785.0,
    estimatedDurationMinutes: 620,
    status: 'ACTIVE',
    optimizationStatus: 'OPTIMIZED',
    routeType: 'MULTI_STOP',
    priority: 'URGENT',
    restrictions: [],
    currentVersion: 2,
    activeTripsCount: 3,
    deviationCount: 1,
    createdBy: 'Operations Director',
    createdAt: '2026-07-15T09:00:00.000Z',
    updatedAt: '2026-08-10T14:15:00.000Z',
  },
  {
    id: 'rt-003',
    tenantId: 'tenant-001',
    routeCode: 'RT-2026-000003',
    name: 'Medan (BELAWAN) → Pekanbaru Sumatera Corridor',
    description: 'Rute pengiriman kargo Sumatera lintas Medan - Pekanbaru.',
    origin: {
      name: 'Terminal Belawan Logistics',
      address: 'Jl. Pelabuhan Belawan, Medan, Sumut',
      latitude: 3.7845,
      longitude: 98.6812,
    },
    destination: {
      name: 'Depo Distribusi Pekanbaru',
      address: 'Jl. Soekarno Hatta No. 12, Pekanbaru, Riau',
      latitude: 0.5071,
      longitude: 101.4478,
    },
    waypoints: [],
    plannedPolyline: [
      [3.7845, 98.6812],
      [3.0, 99.5],
      [1.8, 100.5],
      [0.5071, 101.4478],
    ],
    alternativeRoutes: [],
    distanceKm: 612.0,
    estimatedDurationMinutes: 580,
    status: 'PLANNED',
    optimizationStatus: 'PARTIALLY_OPTIMIZED',
    routeType: 'ONE_WAY',
    priority: 'NORMAL',
    restrictions: [],
    currentVersion: 1,
    activeTripsCount: 0,
    deviationCount: 0,
    createdBy: 'Regional Fleet Supervisor',
    createdAt: '2026-08-05T11:20:00.000Z',
    updatedAt: '2026-08-05T11:20:00.000Z',
  },
];

class RouteManagementService {
  private routes: Route[] = [];

  constructor() {
    this.loadInitialRoutes();
  }

  private loadInitialRoutes() {
    const stored = localStorage.getItem('fleet_master_routes_v16');
    if (stored) {
      try {
        this.routes = JSON.parse(stored);
      } catch (e) {
        this.routes = [...MOCK_ROUTES_SEED];
      }
    } else {
      this.routes = [...MOCK_ROUTES_SEED];
      this.saveToStorage();
    }

    // Initialize versions for seed routes
    this.routes.forEach((r) => {
      if (routeVersionService.getRouteVersions(r.id).length === 0) {
        routeVersionService.createInitialVersion(r, r.createdBy);
      }
    });
  }

  private saveToStorage() {
    localStorage.setItem('fleet_master_routes_v16', JSON.stringify(this.routes));
  }

  getRoutes(filter?: RouteFilterState): Route[] {
    let result = [...this.routes];

    if (!filter) return result;

    if (filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.routeCode.toLowerCase().includes(q) ||
          r.origin.name.toLowerCase().includes(q) ||
          r.destination.name.toLowerCase().includes(q) ||
          r.origin.address.toLowerCase().includes(q) ||
          r.destination.address.toLowerCase().includes(q)
      );
    }

    if (filter.status !== 'ALL') {
      result = result.filter((r) => r.status === filter.status);
    }

    if (filter.routeType !== 'ALL') {
      result = result.filter((r) => r.routeType === filter.routeType);
    }

    if (filter.optimizationStatus !== 'ALL') {
      result = result.filter((r) => r.optimizationStatus === filter.optimizationStatus);
    }

    if (filter.priority !== 'ALL') {
      result = result.filter((r) => r.priority === filter.priority);
    }

    if (filter.hasDeviation) {
      result = result.filter((r) => (r.deviationCount || 0) > 0);
    }

    return result;
  }

  getRouteById(id: string): Route | null {
    return this.routes.find((r) => r.id === id) || null;
  }

  generateRouteCode(): string {
    const year = new Date().getFullYear();
    const count = this.routes.length + 1;
    const seq = String(count).padStart(6, '0');
    return `RT-${year}-${seq}`;
  }

  async createRoute(routeData: Partial<Route>, isDraft = false): Promise<Route> {
    const newId = `rt-${Date.now()}`;
    const code = routeData.routeCode || this.generateRouteCode();

    const origin = routeData.origin || {
      name: 'Origin Point',
      address: 'Jakarta',
      latitude: -6.2088,
      longitude: 106.8456,
    };

    const destination = routeData.destination || {
      name: 'Destination Point',
      address: 'Bandung',
      latitude: -6.9175,
      longitude: 107.6191,
    };

    const waypoints = routeData.waypoints || [];

    // Calculate polyline & metrics
    const calc = await routeCalculationService.calculateRoute(origin, destination, waypoints);
    const alternatives = await routeCalculationService.calculateAlternatives(
      origin,
      destination,
      waypoints
    );

    const nowIso = new Date().toISOString();

    const newRoute: Route = {
      id: newId,
      tenantId: routeData.tenantId || 'tenant-001',
      routeCode: code,
      name: routeData.name || `Rute ${origin.name} → ${destination.name}`,
      description: routeData.description || '',
      origin,
      destination,
      waypoints,
      plannedPolyline: calc.polyline,
      optimizedPolyline: routeData.optimizedPolyline || calc.polyline,
      alternativeRoutes: alternatives,
      distanceKm: calc.distanceKm,
      estimatedDurationMinutes: calc.estimatedDurationMinutes,
      status: isDraft ? 'DRAFT' : routeData.status || 'ACTIVE',
      optimizationStatus: routeData.optimizationStatus || 'OPTIMIZED',
      routeType: routeData.routeType || 'ONE_WAY',
      priority: routeData.priority || 'NORMAL',
      restrictions: routeData.restrictions || [],
      vehicleRestrictions: routeData.vehicleRestrictions,
      currentVersion: 1,
      activeTripsCount: 0,
      deviationCount: 0,
      createdBy: routeData.createdBy || 'Dispatcher',
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    this.routes.unshift(newRoute);
    this.saveToStorage();

    // Create initial version
    routeVersionService.createInitialVersion(newRoute, newRoute.createdBy);

    return newRoute;
  }

  async updateRoute(id: string, updates: Partial<Route>, changeNotes?: string): Promise<Route | null> {
    const index = this.routes.findIndex((r) => r.id === id);
    if (index === -1) return null;

    const existing = this.routes[index];

    // Recalculate if origin, destination, or waypoints changed
    let calc = {
      polyline: existing.plannedPolyline,
      distanceKm: existing.distanceKm,
      estimatedDurationMinutes: existing.estimatedDurationMinutes,
    };

    const origin = updates.origin || existing.origin;
    const destination = updates.destination || existing.destination;
    const waypoints = updates.waypoints || existing.waypoints;

    if (updates.origin || updates.destination || updates.waypoints) {
      calc = await routeCalculationService.calculateRoute(origin, destination, waypoints);
    }

    const updatedRoute: Route = {
      ...existing,
      ...updates,
      origin,
      destination,
      waypoints,
      plannedPolyline: calc.polyline,
      distanceKm: calc.distanceKm,
      estimatedDurationMinutes: calc.estimatedDurationMinutes,
      currentVersion: existing.currentVersion + 1,
      updatedAt: new Date().toISOString(),
    };

    this.routes[index] = updatedRoute;
    this.saveToStorage();

    // Generate new version history entry
    routeVersionService.createNewVersion(
      updatedRoute,
      changeNotes || 'Pembaruan rute master oleh operator.',
      updates.createdBy || 'Dispatcher'
    );

    return updatedRoute;
  }

  async optimizeExistingRoute(id: string, objective = 'Balanced' as any): Promise<Route | null> {
    const route = this.getRouteById(id);
    if (!route) return null;

    const optResult = await routeOptimizationService.optimizeRoute(
      route.origin,
      route.destination,
      route.waypoints,
      objective,
      route.vehicleRestrictions,
      route.restrictions
    );

    return this.updateRoute(
      id,
      {
        waypoints: optResult.optimizedWaypoints,
        plannedPolyline: optResult.polyline,
        optimizedPolyline: optResult.polyline,
        distanceKm: optResult.distanceKm,
        estimatedDurationMinutes: optResult.estimatedDurationMinutes,
        optimizationStatus: 'OPTIMIZED',
      },
      `Optimasi rute otomatis (${objective}): Hemat ${optResult.savingsDistanceKm} km (${optResult.savingsDurationMinutes} mnt).`
    );
  }

  deleteRoute(id: string): boolean {
    const initial = this.routes.length;
    this.routes = this.routes.filter((r) => r.id !== id);
    if (this.routes.length !== initial) {
      this.saveToStorage();
      return true;
    }
    return false;
  }

  exportRoutes(routesToExport: Route[]) {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Kode Rute,Nama Rute,Origin,Destination,Jarak (KM),Durasi (Mnt),Status,Tipe,Status Optimasi']
        .concat(
          routesToExport.map(
            (r) =>
              `"${r.routeCode}","${r.name}","${r.origin.name}","${r.destination.name}",${r.distanceKm},${r.estimatedDurationMinutes},"${r.status}","${r.routeType}","${r.optimizationStatus}"`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Master_Routes_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const routeManagementService = new RouteManagementService();
