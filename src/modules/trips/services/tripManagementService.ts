/**
 * Fleet Intelligence Smart AI - Central Trip Management Service
 * PROMPT 15 — Planned Trips CRUD, State Lifecycle Actions, Filtering & Trip History Linking
 */

import {
  PlannedTrip,
  PlannedTripStatus,
  TripFilterState,
  TripWaypoint,
  TripPriority,
  EtaSource,
} from '../plannedTripTypes';
import { TripStatusTransitionService } from './tripStatusService';
import { RoutePlanningService } from './routePlanningService';
import { EtaService } from './etaService';
import { TripTimelineService } from './tripTimelineService';

class TripManagementService {
  private trips: PlannedTrip[] = [];
  private sequenceCounter: number = 1001;

  constructor() {
    this.seedMockData();
  }

  /**
   * Seed realistic mock planned trips
   */
  private seedMockData() {
    const todayStr = new Date().toISOString().split('T')[0];
    const nowIso = new Date().toISOString();

    const mockPlanned1: PlannedTrip = {
      id: 'pl-trip-1001',
      tenantId: 'tenant-001',
      tripNumber: 'TRP-2026-001001',
      referenceNumber: 'DO-2026-9921',
      customerName: 'PT Wings Surya Logistics',
      cargoDescription: 'Produk Konsumen / Fast Moving Consumer Goods',
      cargoWeightKg: 8500,
      vehicleId: 'veh-1',
      vehiclePlate: 'B 9482 UTX',
      vehicleName: 'Hino Ranger Wingbox #01',
      driverId: 'drv-1',
      driverName: 'Sutrisno Hartono',
      driverPhone: '+6281234567801',
      dispatcherId: 'disp-01',
      dispatcherName: 'Budi Santoso',
      origin: {
        name: 'Gudang Pusat Jakarta DC',
        address: 'Kawasan Industri Pulogadung, Jakarta Timur',
        latitude: -6.182,
        longitude: 106.912,
        contactPerson: 'Pak Hendra (Kepala Gudang)',
        contactPhone: '+628112233441',
      },
      destination: {
        name: 'Depo Distribusi Bandung',
        address: 'Jl. Soekarno Hatta No. 450, Bandung',
        latitude: -6.938,
        longitude: 107.655,
        contactPerson: 'Ibu Rina (Logistik Bandung)',
        contactPhone: '+628112233442',
      },
      waypoints: [
        {
          id: 'wp-101',
          tripId: 'pl-trip-1001',
          sequence: 1,
          name: 'Hub Transito Karawang Depot',
          address: 'Kawasan Industri KIIC, Karawang Barat',
          latitude: -6.321,
          longitude: 107.289,
          status: 'COMPLETED',
          actualArrival: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
          actualDeparture: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
          notes: 'Bongkar muat 200 karton snack selesai',
        },
        {
          id: 'wp-102',
          tripId: 'pl-trip-1001',
          sequence: 2,
          name: 'Check Point Purwakarta',
          address: 'Rest Area KM 88 Tol Purbaleunyi',
          latitude: -6.612,
          longitude: 107.421,
          status: 'ARRIVING',
          plannedArrival: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
          notes: 'Pemeriksaan tekanan ban & istirahat driver',
        },
      ],
      plannedRoute: {
        polyline: [],
        distanceKm: 152.4,
        estimatedDurationMinutes: 195,
      },
      scheduledDate: todayStr,
      plannedEtd: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
      plannedEta: new Date(Date.now() + 75 * 60 * 1000).toISOString(),
      currentEta: new Date(Date.now() + 92 * 60 * 1000).toISOString(), // 17 mins delay
      etaSource: 'LIVE_TRAFFIC',
      actualStartTime: new Date(Date.now() - 118 * 60 * 1000).toISOString(),
      status: 'IN_TRANSIT',
      priority: 'HIGH',
      distanceKm: 152.4,
      estimatedDurationMinutes: 195,
      actualDistanceKm: 78.5,
      notes: 'Prioritas tinggi delivery bahan pokok sebelum jam 17:00.',
      actualTripId: 'trp-001', // Linked to Trip History
      createdBy: 'Budi Santoso',
      createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      updatedAt: nowIso,
    };

    const mockPlanned2: PlannedTrip = {
      id: 'pl-trip-1002',
      tenantId: 'tenant-001',
      tripNumber: 'TRP-2026-001002',
      referenceNumber: 'PO-88210-SBY',
      customerName: 'PT Indofood Sukses Makmur',
      cargoDescription: 'Bahan Baku Gandum & Tepung Terigu',
      cargoWeightKg: 12000,
      vehicleId: 'veh-2',
      vehiclePlate: 'B 9201 FTR',
      vehicleName: 'Isuzu Giga Heavy Truck #02',
      driverId: 'drv-2',
      driverName: 'Ahmad Dahlan',
      driverPhone: '+6281234567802',
      dispatcherId: 'disp-01',
      dispatcherName: 'Budi Santoso',
      origin: {
        name: 'Pelabuhan Tanjung Priok Pier 3',
        address: 'Jl. Raya Pelabuhan No. 1, Jakarta Utara',
        latitude: -6.102,
        longitude: 106.885,
      },
      destination: {
        name: 'Pabrik Semarang Terboyo',
        address: 'Kawasan Industri Terboyo Blok A5, Semarang',
        latitude: -6.955,
        longitude: 110.455,
      },
      waypoints: [],
      plannedRoute: {
        polyline: [],
        distanceKm: 440.0,
        estimatedDurationMinutes: 420,
      },
      scheduledDate: todayStr,
      plannedEtd: new Date(Date.now() + 180 * 60 * 1000).toISOString(),
      plannedEta: new Date(Date.now() + 600 * 60 * 1000).toISOString(),
      currentEta: new Date(Date.now() + 600 * 60 * 1000).toISOString(),
      etaSource: 'CALCULATED',
      status: 'READY',
      priority: 'NORMAL',
      distanceKm: 440.0,
      estimatedDurationMinutes: 420,
      notes: 'Gunakan Tol Trans Jawa penuh. Surat Jalan & KIR sudah lengkap.',
      createdBy: 'Budi Santoso',
      createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      updatedAt: nowIso,
    };

    const mockPlanned3: PlannedTrip = {
      id: 'pl-trip-1003',
      tenantId: 'tenant-001',
      tripNumber: 'TRP-2026-001003',
      referenceNumber: 'SHIP-9912-SBY',
      customerName: 'Unilever Indonesia Depot',
      cargoDescription: 'Personal Care Products',
      cargoWeightKg: 6200,
      vehicleId: 'veh-3',
      vehiclePlate: 'B 9112 PKO',
      vehicleName: 'Mitsubishi Fuso CDE #03',
      driverId: 'drv-3',
      driverName: 'Rudi Hermawan',
      driverPhone: '+6281234567803',
      dispatcherId: 'disp-02',
      dispatcherName: 'Anita Wijaya',
      origin: {
        name: 'Gudang Cikarang Dry Port',
        address: 'Kawasan Jababeka V, Cikarang',
        latitude: -6.289,
        longitude: 107.168,
      },
      destination: {
        name: 'Depo Surabaya Rungkut',
        address: 'Kawasan Industri SIER, Rungkut, Surabaya',
        latitude: -7.332,
        longitude: 112.765,
      },
      waypoints: [],
      plannedRoute: {
        polyline: [],
        distanceKm: 680.0,
        estimatedDurationMinutes: 580,
      },
      scheduledDate: todayStr,
      plannedEtd: new Date(Date.now() - 300 * 60 * 1000).toISOString(),
      plannedEta: new Date(Date.now() + 280 * 60 * 1000).toISOString(),
      currentEta: new Date(Date.now() + 280 * 60 * 1000).toISOString(),
      etaSource: 'CALCULATED',
      actualStartTime: new Date(Date.now() - 295 * 60 * 1000).toISOString(),
      actualEndTime: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      status: 'COMPLETED',
      priority: 'NORMAL',
      distanceKm: 680.0,
      estimatedDurationMinutes: 580,
      actualDistanceKm: 685.2,
      actualDurationMinutes: 575,
      notes: 'Selesai tepat waktu. Tanda terima digital POD sudah diunggah.',
      actualTripId: 'trp-003',
      createdBy: 'Anita Wijaya',
      createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      updatedAt: nowIso,
    };

    const mockPlanned4: PlannedTrip = {
      id: 'pl-trip-1004',
      tenantId: 'tenant-001',
      tripNumber: 'TRP-2026-001004',
      referenceNumber: 'WO-DRAFT-04',
      customerName: 'Gojek Logistics Hub',
      cargoDescription: 'Paket E-Commerce Batch B',
      cargoWeightKg: 3200,
      vehicleId: '',
      driverId: '',
      origin: {
        name: 'Sorting Center Tangerang',
        address: 'Jl. Daan Mogot KM 19, Tangerang',
        latitude: -6.165,
        longitude: 106.654,
      },
      destination: {
        name: 'Hub Distribusi Bogor',
        address: 'Jl. Raya Pajajaran No. 88, Bogor',
        latitude: -6.598,
        longitude: 106.805,
      },
      waypoints: [],
      plannedRoute: {
        polyline: [],
        distanceKm: 72.0,
        estimatedDurationMinutes: 110,
      },
      scheduledDate: todayStr,
      plannedEtd: new Date(Date.now() + 360 * 60 * 1000).toISOString(),
      plannedEta: new Date(Date.now() + 470 * 60 * 1000).toISOString(),
      currentEta: new Date(Date.now() + 470 * 60 * 1000).toISOString(),
      etaSource: 'CALCULATED',
      status: 'DRAFT',
      priority: 'LOW',
      distanceKm: 72.0,
      estimatedDurationMinutes: 110,
      notes: 'Draft rencana trip sore. Menunggu konfirmasi ketersediaan armada.',
      createdBy: 'Budi Santoso',
      createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      updatedAt: nowIso,
    };

    // Calculate polylines for routes
    [mockPlanned1, mockPlanned2, mockPlanned3, mockPlanned4].forEach((t) => {
      const route = RoutePlanningService.calculatePlannedRoute(t.origin, t.destination, t.waypoints);
      t.plannedRoute = route;
      t.distanceKm = route.distanceKm;
      t.estimatedDurationMinutes = route.estimatedDurationMinutes;
      TripTimelineService.seedTimeline(t.id, t.createdAt, t.createdBy);
    });

    this.trips = [mockPlanned1, mockPlanned2, mockPlanned3, mockPlanned4];
  }

  /**
   * Get filtered list of planned trips
   */
  public getTrips(filter: TripFilterState): PlannedTrip[] {
    return this.trips.filter((t) => {
      // Search query
      if (filter.searchQuery.trim()) {
        const q = filter.searchQuery.toLowerCase();
        const matchNum = t.tripNumber.toLowerCase().includes(q);
        const matchRef = (t.referenceNumber || '').toLowerCase().includes(q);
        const matchCust = (t.customerName || '').toLowerCase().includes(q);
        const matchPlate = (t.vehiclePlate || '').toLowerCase().includes(q);
        const matchDriver = (t.driverName || '').toLowerCase().includes(q);
        const matchOrig = t.origin.name.toLowerCase().includes(q);
        const matchDest = t.destination.name.toLowerCase().includes(q);
        if (!(matchNum || matchRef || matchCust || matchPlate || matchDriver || matchOrig || matchDest)) {
          return false;
        }
      }

      // Status
      if (filter.status !== 'ALL' && t.status !== filter.status) {
        return false;
      }

      // Priority
      if (filter.priority !== 'ALL' && t.priority !== filter.priority) {
        return false;
      }

      // Vehicle
      if (filter.vehicleId && filter.vehicleId !== 'ALL' && t.vehicleId !== filter.vehicleId) {
        return false;
      }

      // Driver
      if (filter.driverId && filter.driverId !== 'ALL' && t.driverId !== filter.driverId) {
        return false;
      }

      return true;
    });
  }

  public getTripById(id: string): PlannedTrip | null {
    return this.trips.find((t) => t.id === id) || null;
  }

  /**
   * Generate Next Trip Number e.g. TRP-2026-001005
   */
  public generateTripNumber(): string {
    const year = new Date().getFullYear();
    const num = this.sequenceCounter++;
    return `TRP-${year}-${num.toString().padStart(6, '0')}`;
  }

  /**
   * Create new Planned Trip or Draft
   */
  public createTrip(tripData: Partial<PlannedTrip>, isDraft: boolean = false): PlannedTrip {
    const route = RoutePlanningService.calculatePlannedRoute(
      tripData.origin!,
      tripData.destination!,
      tripData.waypoints || []
    );

    const tripNum = tripData.tripNumber || this.generateTripNumber();
    const plannedEtd = tripData.plannedEtd || new Date().toISOString();
    const plannedEta =
      tripData.plannedEta || EtaService.calculatePlannedEta(plannedEtd, route.estimatedDurationMinutes);

    let initialStatus: PlannedTripStatus = 'PLANNED';
    if (isDraft) {
      initialStatus = 'DRAFT';
    } else if (tripData.vehicleId && tripData.driverId) {
      initialStatus = 'ASSIGNED';
    }

    const newTrip: PlannedTrip = {
      id: `pl-trip-${Date.now()}`,
      tenantId: 'tenant-001',
      tripNumber: tripNum,
      referenceNumber: tripData.referenceNumber || '',
      customerName: tripData.customerName || '',
      cargoDescription: tripData.cargoDescription || '',
      cargoWeightKg: tripData.cargoWeightKg || 0,
      vehicleId: tripData.vehicleId || '',
      vehiclePlate: tripData.vehiclePlate || '',
      vehicleName: tripData.vehicleName || '',
      driverId: tripData.driverId || '',
      driverName: tripData.driverName || '',
      driverPhone: tripData.driverPhone || '',
      dispatcherId: 'disp-01',
      dispatcherName: 'Budi Santoso',
      origin: tripData.origin!,
      destination: tripData.destination!,
      waypoints: tripData.waypoints || [],
      plannedRoute: route,
      scheduledDate: tripData.scheduledDate || new Date().toISOString().split('T')[0],
      plannedEtd,
      plannedEta,
      currentEta: plannedEta,
      etaSource: tripData.etaSource || 'CALCULATED',
      status: initialStatus,
      priority: tripData.priority || 'NORMAL',
      distanceKm: route.distanceKm,
      estimatedDurationMinutes: route.estimatedDurationMinutes,
      notes: tripData.notes || '',
      createdBy: 'Budi Santoso',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.trips.unshift(newTrip);

    TripTimelineService.logEvent(
      newTrip.id,
      'trip.created',
      'Budi Santoso',
      'Dispatcher',
      'NONE',
      newTrip.status,
      `Trip ${newTrip.tripNumber} berhasil dibuat dengan status ${newTrip.status}.`
    );

    return newTrip;
  }

  /**
   * Update existing trip
   */
  public updateTrip(id: string, updates: Partial<PlannedTrip>): PlannedTrip | null {
    const index = this.trips.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const existing = this.trips[index];

    // Re-calculate route if origin, destination, or waypoints changed
    let route = existing.plannedRoute;
    if (updates.origin || updates.destination || updates.waypoints) {
      const orig = updates.origin || existing.origin;
      const dest = updates.destination || existing.destination;
      const wps = updates.waypoints || existing.waypoints;
      route = RoutePlanningService.calculatePlannedRoute(orig, dest, wps);
    }

    const updatedTrip: PlannedTrip = {
      ...existing,
      ...updates,
      plannedRoute: route,
      distanceKm: route.distanceKm,
      estimatedDurationMinutes: route.estimatedDurationMinutes,
      updatedAt: new Date().toISOString(),
    };

    this.trips[index] = updatedTrip;

    TripTimelineService.logEvent(
      id,
      'trip.updated',
      'Budi Santoso',
      'Dispatcher',
      existing.status,
      updatedTrip.status,
      `Informasi trip ${updatedTrip.tripNumber} telah diperbarui.`
    );

    return updatedTrip;
  }

  /**
   * Dispatch Trip
   */
  public dispatchTrip(id: string): PlannedTrip | null {
    const trip = this.getTripById(id);
    if (!trip) return null;

    if (!TripStatusTransitionService.canTransition(trip.status, 'DISPATCHED')) {
      throw new Error(`Perubahan status dari ${trip.status} ke DISPATCHED tidak diizinkan.`);
    }

    return this.updateTrip(id, {
      status: 'DISPATCHED',
    });
  }

  /**
   * Start Trip (Driver / GPS movement)
   */
  public startTrip(id: string): PlannedTrip | null {
    const trip = this.getTripById(id);
    if (!trip) return null;

    return this.updateTrip(id, {
      status: 'IN_TRANSIT',
      actualStartTime: new Date().toISOString(),
    });
  }

  /**
   * Complete Trip
   */
  public completeTrip(id: string): PlannedTrip | null {
    const trip = this.getTripById(id);
    if (!trip) return null;

    return this.updateTrip(id, {
      status: 'COMPLETED',
      actualEndTime: new Date().toISOString(),
      actualDistanceKm: trip.distanceKm + Math.round((Math.random() * 5 - 2) * 10) / 10,
      actualDurationMinutes: trip.estimatedDurationMinutes + Math.floor(Math.random() * 20 - 5),
    });
  }

  /**
   * Cancel Trip with reason
   */
  public cancelTrip(id: string, reason: string): PlannedTrip | null {
    const trip = this.getTripById(id);
    if (!trip) return null;

    const updated = this.updateTrip(id, {
      status: 'CANCELLED',
      notes: `[DIBATALKAN]: ${reason} | ${trip.notes || ''}`,
    });

    TripTimelineService.logEvent(
      id,
      'trip.cancelled',
      'Budi Santoso',
      'Dispatcher',
      trip.status,
      'CANCELLED',
      `Trip dibatalkan dengan alasan: ${reason}`
    );

    return updated;
  }

  /**
   * Export Trips to CSV
   */
  public exportTrips(trips: PlannedTrip[]) {
    const headers = [
      'Trip Number',
      'Reference No',
      'Customer',
      'Status',
      'Priority',
      'Vehicle Plate',
      'Driver Name',
      'Origin',
      'Destination',
      'Scheduled Date',
      'Planned ETD',
      'Planned ETA',
      'Current ETA',
      'Distance (KM)',
    ];

    const rows = trips.map((t) => [
      t.tripNumber,
      t.referenceNumber || '-',
      t.customerName || '-',
      t.status,
      t.priority,
      t.vehiclePlate || '-',
      t.driverName || '-',
      t.origin.name,
      t.destination.name,
      t.scheduledDate,
      t.plannedEtd ? new Date(t.plannedEtd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
      t.plannedEta ? new Date(t.plannedEta).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
      t.currentEta ? new Date(t.currentEta).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
      t.distanceKm,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Fleet_Trip_Management_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const tripManagementService = new TripManagementService();
