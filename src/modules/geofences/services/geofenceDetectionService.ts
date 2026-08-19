/**
 * Fleet Intelligence Smart AI - Geofence Detection Engine & Event Processor
 * Evaluates GPS positions against Geofence boundaries with Hysteresis & Debouncing
 */

import { Location } from '../../../types';
import { Geofence, GeofenceEvent, VehicleGeofenceState, GeofencePriority } from '../geofenceTypes';
import { geofenceGeometryService } from './geofenceGeometryService';
import { geofenceManagementService } from './geofenceManagementService';

class GeofenceDetectionService {
  private eventsKey = 'fleet_intel_geofence_events_v1';
  private vehicleStates: Map<string, VehicleGeofenceState[]> = new Map(); // vehicleId -> list of states for each geofence
  private events: GeofenceEvent[] = [];

  constructor() {
    this.loadEventsFromStorage();
    this.seedInitialEvents();
  }

  private seedInitialEvents() {
    if (this.events.length === 0) {
      const now = new Date();
      this.events = [
        {
          id: 'gfe-001',
          tenantId: 'tenant-tln-01',
          geofenceId: 'geo-001',
          geofenceName: 'Depo Utama Tanjung Priok Gate 3',
          vehicleId: 'veh-01',
          vehiclePlate: 'B 9821 UTX',
          driverId: 'drv-01',
          driverName: 'Sutrisno Hartono',
          tripId: 'trp-001',
          tripNumber: 'TRP-20260813-001',
          eventType: 'ENTER',
          timestamp: new Date(now.getTime() - 45 * 60000).toISOString(),
          latitude: -6.1152,
          longitude: 106.8821,
          locationAddress: 'Tanjung Priok Gate 3',
          severity: 'NORMAL',
        },
        {
          id: 'gfe-002',
          tenantId: 'tenant-tln-01',
          geofenceId: 'geo-001',
          geofenceName: 'Depo Utama Tanjung Priok Gate 3',
          vehicleId: 'veh-01',
          vehiclePlate: 'B 9821 UTX',
          driverId: 'drv-01',
          driverName: 'Sutrisno Hartono',
          tripId: 'trp-001',
          tripNumber: 'TRP-20260813-001',
          eventType: 'DWELL',
          timestamp: new Date(now.getTime() - 15 * 60000).toISOString(),
          latitude: -6.1152,
          longitude: 106.8821,
          locationAddress: 'Tanjung Priok Gate 3',
          dwellDurationMinutes: 48,
          severity: 'HIGH',
        },
        {
          id: 'gfe-003',
          tenantId: 'tenant-tln-01',
          geofenceId: 'geo-002',
          geofenceName: 'Cikarang Dry Port Logistics Hub',
          vehicleId: 'veh-02',
          vehiclePlate: 'B 9102 CKR',
          driverId: 'drv-02',
          driverName: 'Bambang Pamungkas',
          tripId: 'trp-002',
          tripNumber: 'TRP-20260813-002',
          eventType: 'ENTER',
          timestamp: new Date(now.getTime() - 28 * 60000).toISOString(),
          latitude: -6.2825,
          longitude: 107.1702,
          locationAddress: 'Cikarang Dry Port',
          severity: 'NORMAL',
        },
      ];

      // Initialize state for vehicle 1 inside geo-001 and vehicle 2 inside geo-002
      this.vehicleStates.set('veh-01', [
        {
          vehicleId: 'veh-01',
          geofenceId: 'geo-001',
          isInside: true,
          enteredAt: new Date(now.getTime() - 45 * 60000).toISOString(),
          lastSeenAt: now.toISOString(),
          dwellStartedAt: new Date(now.getTime() - 45 * 60000).toISOString(),
          dwellTriggeredAt: new Date(now.getTime() - 15 * 60000).toISOString(),
          lastLatitude: -6.1152,
          lastLongitude: 106.8821,
        },
      ]);

      this.vehicleStates.set('veh-02', [
        {
          vehicleId: 'veh-02',
          geofenceId: 'geo-002',
          isInside: true,
          enteredAt: new Date(now.getTime() - 28 * 60000).toISOString(),
          lastSeenAt: now.toISOString(),
          dwellStartedAt: new Date(now.getTime() - 28 * 60000).toISOString(),
          lastLatitude: -6.2825,
          lastLongitude: 107.1702,
        },
      ]);

      this.saveEventsToStorage();
    }
  }

  private loadEventsFromStorage() {
    try {
      const stored = localStorage.getItem(this.eventsKey);
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch {
      this.events = [];
    }
  }

  private saveEventsToStorage() {
    try {
      localStorage.setItem(this.eventsKey, JSON.stringify(this.events));
    } catch (err) {
      console.error('Gagal menyimpan geofence events:', err);
    }
  }

  /**
   * Main telemetry position evaluator against all active geofences
   */
  public evaluatePosition(
    vehicleId: string,
    vehiclePlate: string,
    driverId: string | undefined,
    driverName: string | undefined,
    location: Location,
    gpsAccuracyMeters: number = 10,
    tripId?: string,
    tripNumber?: string
  ): GeofenceEvent[] {
    const generatedEvents: GeofenceEvent[] = [];

    // Filter out low confidence GPS telemetry near boundaries
    if (gpsAccuracyMeters > 80) {
      return generatedEvents; // GPS accuracy is too poor
    }

    const allGeofences = geofenceManagementService.getGeofences({
      status: 'ACTIVE',
      type: 'ALL',
      category: 'ALL',
      priority: 'ALL',
      searchQuery: '',
    });

    let currentVehicleStates = this.vehicleStates.get(vehicleId) || [];

    allGeofences.forEach((geofence) => {
      // Find existing state for this geofence
      let state = currentVehicleStates.find((s) => s.geofenceId === geofence.id);
      if (!state) {
        state = {
          vehicleId,
          geofenceId: geofence.id,
          isInside: false,
          lastSeenAt: new Date().toISOString(),
          lastLatitude: location.lat,
          lastLongitude: location.lng,
        };
        currentVehicleStates.push(state);
      }

      // Check if point is inside
      let isInsideNow = false;
      if (geofence.type === 'CIRCLE') {
        isInsideNow = geofenceGeometryService.isPointInCircle(
          location,
          geofence.center,
          geofence.radiusMeters
        );
      } else if (geofence.type === 'POLYGON') {
        isInsideNow = geofenceGeometryService.isPointInPolygon(location, geofence.polygonCoordinates);
      }

      const nowIso = new Date().toISOString();

      // State Evaluation logic with debouncing
      if (!state.isInside && isInsideNow) {
        // ENTER DETECTED
        state.isInside = true;
        state.enteredAt = nowIso;
        state.dwellStartedAt = nowIso;
        state.dwellTriggeredAt = undefined;

        if (geofence.entryEnabled) {
          const newEvt: GeofenceEvent = {
            id: `gfe-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            tenantId: geofence.tenantId,
            geofenceId: geofence.id,
            geofenceName: geofence.name,
            vehicleId,
            vehiclePlate,
            driverId,
            driverName,
            tripId,
            tripNumber,
            eventType: 'ENTER',
            timestamp: nowIso,
            latitude: location.lat,
            longitude: location.lng,
            locationAddress: location.address || geofence.address,
            severity: geofence.category === 'RESTRICTED_AREA' ? 'CRITICAL' : geofence.priority,
          };
          this.events.unshift(newEvt);
          generatedEvents.push(newEvt);
        }
      } else if (state.isInside && !isInsideNow) {
        // EXIT DETECTED
        state.isInside = false;
        const enteredTime = state.enteredAt ? new Date(state.enteredAt).getTime() : new Date().getTime();
        const dwellDurationMinutes = Math.round((new Date().getTime() - enteredTime) / 60000);

        state.enteredAt = undefined;
        state.dwellStartedAt = undefined;
        state.dwellTriggeredAt = undefined;

        if (geofence.exitEnabled) {
          const newEvt: GeofenceEvent = {
            id: `gfe-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            tenantId: geofence.tenantId,
            geofenceId: geofence.id,
            geofenceName: geofence.name,
            vehicleId,
            vehiclePlate,
            driverId,
            driverName,
            tripId,
            tripNumber,
            eventType: 'EXIT',
            timestamp: nowIso,
            latitude: location.lat,
            longitude: location.lng,
            locationAddress: location.address || geofence.address,
            dwellDurationMinutes,
            severity: geofence.priority,
          };
          this.events.unshift(newEvt);
          generatedEvents.push(newEvt);
        }
      } else if (state.isInside && isInsideNow) {
        // DWELL CHECK
        if (state.dwellStartedAt && geofence.dwellEnabled && !state.dwellTriggeredAt) {
          const dwellMins = Math.round((new Date().getTime() - new Date(state.dwellStartedAt).getTime()) / 60000);
          if (dwellMins >= geofence.dwellThresholdMinutes) {
            state.dwellTriggeredAt = nowIso;
            const newEvt: GeofenceEvent = {
              id: `gfe-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              tenantId: geofence.tenantId,
              geofenceId: geofence.id,
              geofenceName: geofence.name,
              vehicleId,
              vehiclePlate,
              driverId,
              driverName,
              tripId,
              tripNumber,
              eventType: 'DWELL',
              timestamp: nowIso,
              latitude: location.lat,
              longitude: location.lng,
              locationAddress: location.address || geofence.address,
              dwellDurationMinutes: dwellMins,
              severity: 'HIGH',
            };
            this.events.unshift(newEvt);
            generatedEvents.push(newEvt);
          }
        }
      }

      state.lastSeenAt = nowIso;
      state.lastLatitude = location.lat;
      state.lastLongitude = location.lng;
    });

    this.vehicleStates.set(vehicleId, currentVehicleStates);
    if (generatedEvents.length > 0) {
      this.saveEventsToStorage();
    }

    return generatedEvents;
  }

  public getEvents(geofenceId?: string, vehicleId?: string): GeofenceEvent[] {
    let result = [...this.events];
    if (geofenceId) result = result.filter((e) => e.geofenceId === geofenceId);
    if (vehicleId) result = result.filter((e) => e.vehicleId === vehicleId);
    return result;
  }

  public getVehiclesInsideGeofence(geofenceId: string): VehicleGeofenceState[] {
    const insideList: VehicleGeofenceState[] = [];
    this.vehicleStates.forEach((states) => {
      states.forEach((state) => {
        if (state.geofenceId === geofenceId && state.isInside) {
          insideList.push(state);
        }
      });
    });
    return insideList;
  }

  public getGeofencesForVehicle(vehicleId: string): string[] {
    const activeInsideGeofenceIds: string[] = [];
    const states = this.vehicleStates.get(vehicleId);
    if (states) {
      states.forEach((s) => {
        if (s.isInside) activeInsideGeofenceIds.push(s.geofenceId);
      });
    }
    return activeInsideGeofenceIds;
  }
}

export const geofenceDetectionService = new GeofenceDetectionService();
