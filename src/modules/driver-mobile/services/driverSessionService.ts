/**
 * Fleet Intelligence Smart AI - Driver Session & Operations Service
 * PROMPT 46: Driver State, Vehicle Assignment, Active Trip, Delivery, & Emergency Panic
 */

import {
  DriverSessionState,
  DriverActiveTrip,
  PreTripInspectionRecord,
  IncidentReportPayload,
  PanicEventPayload,
  DriverActivityLogItem,
} from '../types/driverMobileTypes';
import { mockVehicles, mockDrivers, mockTenant } from '../../../constants/mockData';
import { notificationEngine } from '../../notifications/core/NotificationEngine';
import { mobileSyncService } from './mobileSyncService';
import { Delivery } from '../../delivery/deliveryTypes';
import { deliveryService } from '../../delivery/services/deliveryService';

const DRIVER_SESSION_KEY = 'fleet_driver_session_v1';
const ACTIVE_TRIP_KEY = 'fleet_driver_active_trip_v1';
const INSPECTION_RECORD_KEY = 'fleet_driver_inspection_record_v1';

class DriverSessionService {
  private session: DriverSessionState;
  private activeTrip: DriverActiveTrip | null = null;
  private lastInspection: PreTripInspectionRecord | null = null;
  private panicEvents: PanicEventPayload[] = [];
  private incidents: IncidentReportPayload[] = [];
  private activityLogs: DriverActivityLogItem[] = [];
  private listeners: Array<() => void> = [];

  constructor() {
    // Initialize default driver (Budi Santoso / Sutrisno)
    const initialVehicle = mockVehicles[0] || {
      id: 'veh-01',
      plateNumber: 'B 9128 UXT',
      brand: 'Isuzu',
      model: 'Giga FVR 34 P',
      type: 'Heavy Truck',
      status: 'active',
      odometerKm: 48920,
      fuelType: 'Solar / Dex',
      fuelCapacityLiters: 200,
      latestTelemetry: {
        speed: 0,
        fuelLevelPercent: 78,
        engineTemp: 84,
        batteryVoltage: 24.2,
        ignitionOn: false,
        gpsSignal: 95,
        latitude: -6.2088,
        longitude: 106.8456,
        timestamp: new Date().toISOString(),
      },
    };

    this.session = {
      driverId: 'drv-01',
      driverName: 'Budi Santoso',
      employeeId: 'EMP-DRV-8821',
      phone: '+62 812-3456-7890',
      simNumber: '9203182390123',
      simType: 'SIM B2 Umum',
      tenantId: mockTenant.id,
      tenantName: mockTenant.name,
      branchName: 'Depo Cikarang Logistics Hub',
      role: 'driver',
      assignedVehicleId: initialVehicle.id,
      assignedVehicle: initialVehicle as any,
      isOnline: true,
      lastSyncAt: new Date().toISOString(),
      shift: {
        start: '07:30 WIB',
        end: '17:30 WIB',
        drivingHoursToday: 3.4,
        restHoursToday: 0.8,
        nightDrivingHours: 0,
        maxAllowedHours: 8.0,
      },
      deviceInfo: {
        deviceId: 'SM-G998B-ANDROID-14',
        platform: 'android',
        appVersion: 'v2.4.0-build.46',
        osVersion: 'Android 14 (OneUI 6.1)',
        pushToken: 'fcm_token_driver_budi_9928192847192',
        batteryLevel: 86,
        isCharging: false,
      },
    };

    this.initDefaultTrip();
    this.initDefaultActivities();
  }

  private initDefaultTrip() {
    this.activeTrip = {
      id: 'TRP-20260818-091',
      tripNumber: 'TRP-2026-0818-01',
      origin: 'Cikarang Logistics Dry Port (Hub Utama)',
      destination: 'Distribution Center Indomarco Karawang Barat',
      originCoords: { lat: -6.2842, lng: 107.1472, address: 'Cikarang' },
      destinationCoords: { lat: -6.3129, lng: 107.2882, address: 'Karawang Barat' },
      estimatedDistanceKm: 38.5,
      estimatedDurationMins: 55,
      actualDistanceKm: 14.2,
      status: 'READY_TO_START',
      currentWaypointIndex: 0,
      speedLimit: 80,
      isHighContrastMode: false,
      waypoints: [
        {
          id: 'wp-01',
          sequence: 1,
          name: 'Gerbang Tol Cikarang Timur',
          address: 'KM 37 Tol Jakarta-Cikampek',
          location: { lat: -6.2911, lng: 107.1652 },
          type: 'WAYPOINT',
          status: 'COMPLETED',
          eta: '08:30 WIB',
          completedAt: '08:28 WIB',
        },
        {
          id: 'wp-02',
          sequence: 2,
          name: 'Rest Area KM 57 (Check Point & BBM)',
          address: 'Rest Area KM 57 Tol Japek',
          location: { lat: -6.3421, lng: 107.2411 },
          type: 'REST_STOP',
          status: 'UPCOMING',
          eta: '09:15 WIB',
        },
        {
          id: 'wp-03',
          sequence: 3,
          name: 'DC Karawang Barat (Unloading Drop 1)',
          address: 'Kawasan Industri KIIC Lot C-4',
          location: { lat: -6.3129, lng: 107.2882 },
          type: 'DELIVERY',
          status: 'UPCOMING',
          eta: '09:50 WIB',
          deliveryId: 'DEL-2026-000001',
        },
      ],
    };
  }

  private initDefaultActivities() {
    this.activityLogs = [
      {
        id: 'act-1',
        timestamp: '07:30 WIB',
        title: 'Driver Login & Device Session',
        description: 'Autentikasi berhasil pada Samsung Galaxy (Android 14). Session terdaftar.',
        iconType: 'LOGIN',
        badge: 'AUTH',
      },
      {
        id: 'act-2',
        timestamp: '07:45 WIB',
        title: 'Kendaraan Ditugaskan',
        description: 'Tersambung dengan Isuzu Giga FVR (B 9128 UXT) - GPS Teltonika Online.',
        iconType: 'VEHICLE',
        badge: 'ASSIGNED',
      },
      {
        id: 'act-3',
        timestamp: '08:00 WIB',
        title: 'Pre-Trip Inspection Selesai',
        description: 'Pemeriksaan 7 kategori (Ban, Rem, Oli, Lampu) lolos tanpa kendala (PASS).',
        iconType: 'INSPECTION',
        badge: 'READY',
      },
      {
        id: 'act-4',
        timestamp: '08:15 WIB',
        title: 'Trip Dimulai (TRP-20260818-01)',
        description: 'Rute Cikarang Dry Port &rarr; DC Karawang Barat (38.5 KM).',
        iconType: 'TRIP',
        badge: 'EN ROUTE',
      },
    ];
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  public getSession(): DriverSessionState {
    return this.session;
  }

  public getActiveTrip(): DriverActiveTrip | null {
    return this.activeTrip;
  }

  public getLastInspection(): PreTripInspectionRecord | null {
    return this.lastInspection;
  }

  public getDeliveries(): Delivery[] {
    return deliveryService.getDeliveries(this.session.tenantId).filter(d => {
      // Driver only sees own deliveries
      return !d.driverId || d.driverId === this.session.driverId || d.driverName?.includes('Budi');
    });
  }

  public getActivityLogs(): DriverActivityLogItem[] {
    return this.activityLogs;
  }

  public getPanicEvents(): PanicEventPayload[] {
    return this.panicEvents;
  }

  public getIncidents(): IncidentReportPayload[] {
    return this.incidents;
  }

  // Actions
  public submitPreTripInspection(record: Omit<PreTripInspectionRecord, 'id' | 'driverId' | 'completedAt' | 'synced'>): PreTripInspectionRecord {
    const fullRecord: PreTripInspectionRecord = {
      ...record,
      id: `insp_${Date.now()}`,
      driverId: this.session.driverId,
      completedAt: new Date().toISOString(),
      synced: mobileSyncService.getNetworkStatus(),
    };

    this.lastInspection = fullRecord;

    if (this.activeTrip && fullRecord.overallStatus === 'PASS') {
      this.activeTrip.status = 'READY_TO_START';
    }

    this.logActivity({
      title: `Pre-Trip Inspection: ${fullRecord.overallStatus}`,
      description: fullRecord.overallStatus === 'PASS' ? 'Kendaraan siap beroperasi (Vehicle Ready ✓)' : 'Kendala terdeteksi, diteruskan ke Maintenance Team.',
      iconType: 'INSPECTION',
      badge: fullRecord.overallStatus,
    });

    mobileSyncService.enqueueAction('SUBMIT_INSPECTION', fullRecord);
    this.notify();
    return fullRecord;
  }

  public startTrip(): boolean {
    if (!this.activeTrip) return false;
    this.activeTrip.status = 'IN_PROGRESS';
    this.activeTrip.startTime = new Date().toISOString();

    this.logActivity({
      title: 'Trip Resmi Dimulai',
      description: `Perjalanan menuju ${this.activeTrip.destination} aktif. GPS Tracking realtime.`,
      iconType: 'TRIP',
      badge: 'ACTIVE',
    });

    mobileSyncService.enqueueAction('START_TRIP', { tripId: this.activeTrip.id, startTime: this.activeTrip.startTime });
    this.notify();
    return true;
  }

  public advanceWaypoint(waypointId: string): boolean {
    if (!this.activeTrip) return false;
    const wp = this.activeTrip.waypoints.find(w => w.id === waypointId);
    if (!wp) return false;

    wp.status = 'COMPLETED';
    wp.completedAt = new Date().toLocaleTimeString('id-ID') + ' WIB';

    this.logActivity({
      title: `Waypoint Dilewati: ${wp.name}`,
      description: `Status checkpoint selesai pada ${wp.completedAt}. Melanjutkan ke titik berikutnya.`,
      iconType: 'TRIP',
      badge: 'WAYPOINT',
    });

    mobileSyncService.enqueueAction('UPDATE_WAYPOINT', { tripId: this.activeTrip.id, waypointId, status: 'COMPLETED' });
    this.notify();
    return true;
  }

  public endTrip(): { success: boolean; hasPendingDeliveries: boolean } {
    if (!this.activeTrip) return { success: false, hasPendingDeliveries: false };

    const pendingDeliveries = this.getDeliveries().filter(d => d.status === 'OUT_FOR_DELIVERY' || d.status === 'ARRIVED');
    if (pendingDeliveries.length > 0) {
      return { success: false, hasPendingDeliveries: true };
    }

    this.activeTrip.status = 'COMPLETED';
    this.activeTrip.endTime = new Date().toISOString();

    this.logActivity({
      title: 'Trip Selesai (Trip Completed ✓)',
      description: `Rute ke ${this.activeTrip.destination} berhasil diselesaikan. Total jarak: ${this.activeTrip.estimatedDistanceKm} KM.`,
      iconType: 'TRIP',
      badge: 'COMPLETED',
    });

    mobileSyncService.enqueueAction('END_TRIP', { tripId: this.activeTrip.id, endTime: this.activeTrip.endTime });
    this.notify();
    return { success: true, hasPendingDeliveries: false };
  }

  public async triggerPanic(): Promise<PanicEventPayload> {
    const lat = this.session.assignedVehicle?.latestTelemetry?.location?.lat || -6.2088;
    const lng = this.session.assignedVehicle?.latestTelemetry?.location?.lng || 106.8456;

    const payload: PanicEventPayload = {
      id: `panic_${Date.now()}`,
      driverId: this.session.driverId,
      driverName: this.session.driverName,
      vehicleId: this.session.assignedVehicleId || 'veh-01',
      vehiclePlate: this.session.assignedVehicle?.plateNumber || 'B 9128 UXT',
      tenantId: this.session.tenantId,
      timestamp: new Date().toISOString(),
      latitude: lat,
      longitude: lng,
      locationName: 'Pantura Subang KM 42 (Simpang Ciasem)',
      speed: 42,
      heading: 90,
      status: 'ACTIVE',
      escalationTier: 'DISPATCHER',
      notificationsDispatched: [
        { channel: 'PUSH', status: 'SENT', sentAt: new Date().toISOString() },
        { channel: 'WHATSAPP', status: 'SENT', sentAt: new Date().toISOString() },
        { channel: 'SMS', status: 'SENT', sentAt: new Date().toISOString() },
        { channel: 'EMAIL', status: 'SENT', sentAt: new Date().toISOString() },
      ],
    };

    this.panicEvents.unshift(payload);

    this.logActivity({
      title: '🚨 EMERGENCY PANIC DIKIRIM',
      description: `Tombol darurat ditekan pada ${new Date().toLocaleTimeString('id-ID')}. Multi-channel broadcast disiarkan.`,
      iconType: 'PANIC',
      badge: 'CRITICAL',
    });

    // Trigger PROMPT 45 Notification Engine & Webhook
    try {
      await notificationEngine.trigger(
        'safety.panic_sos',
        this.session.tenantId,
        {
          driverName: this.session.driverName,
          vehiclePlate: payload.vehiclePlate,
          location: payload.locationName,
          coordinates: `${lat}, ${lng}`,
          timestamp: new Date().toLocaleTimeString('id-ID') + ' WIB',
        },
        { priority: 'CRITICAL' }
      );
    } catch {
      // offline or simulated fallback
    }

    mobileSyncService.enqueueAction('TRIGGER_PANIC', payload);
    this.notify();
    return payload;
  }

  public reportIncident(incident: Omit<IncidentReportPayload, 'id' | 'driverId' | 'submittedAt'>): IncidentReportPayload {
    const fullIncident: IncidentReportPayload = {
      ...incident,
      id: `inc_${Date.now()}`,
      driverId: this.session.driverId,
      submittedAt: new Date().toISOString(),
      aiAnalysis: {
        category: incident.type,
        riskLevel: incident.severity,
        safetyRecommendation: 'Lakukan pengamanan lokasi armada, pasang segitiga pengaman, dan koordinasikan unit pengganti dengan Dispatcher.',
        preventativeActions: [
          'Evaluasi jarak pengereman aman minimal 50 meter pada kecepatan > 60 km/jam.',
          'Lakukan pemeriksaan rutin tekanan angin ban setiap sebelum memulai shift.',
        ],
      },
    };

    this.incidents.unshift(fullIncident);

    this.logActivity({
      title: `Laporan Insiden: ${incident.type}`,
      description: `${incident.description.substring(0, 80)}... Analisis AI telah diteruskan ke Safety Manager.`,
      iconType: 'INCIDENT',
      badge: incident.severity,
    });

    mobileSyncService.enqueueAction('REPORT_INCIDENT', fullIncident);
    this.notify();
    return fullIncident;
  }

  public logActivity(item: Omit<DriverActivityLogItem, 'id' | 'timestamp'>) {
    const entry: DriverActivityLogItem = {
      ...item,
      id: `act_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    };
    this.activityLogs.unshift(entry);
    this.notify();
  }
}

export const driverSessionService = new DriverSessionService();
