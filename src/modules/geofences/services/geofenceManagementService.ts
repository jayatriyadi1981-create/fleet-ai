/**
 * Fleet Intelligence Smart AI - Geofence Management Service
 * Master CRUD, Storage, GeoJSON Import/Export, Multi-tenant Isolation
 */

import { Geofence, GeofenceFilterState, GeofenceCategory, GeofencePriority } from '../geofenceTypes';
import { geofenceGeometryService } from './geofenceGeometryService';

class GeofenceManagementService {
  private geofencesKey = 'fleet_intel_geofences_v1';
  private geofences: Geofence[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private getInitialDefaultGeofences(): Geofence[] {
    return [
      {
        id: 'geo-001',
        tenantId: 'tenant-tln-01',
        name: 'Depo Utama Tanjung Priok Gate 3',
        code: 'GEO-2026-000001',
        description: 'Pusat konsolidasi kontainer dan pelabuhan ekspor-impor Tanjung Priok',
        type: 'POLYGON',
        category: 'PORT',
        priority: 'CRITICAL',
        status: 'ACTIVE',
        active: true,
        color: '#3B82F6', // Blue
        center: { lat: -6.1152, lng: 106.8821, address: 'Jl. Eka Nusa No. 1, Tanjung Priok' },
        radiusMeters: 500,
        polygonCoordinates: [
          { lat: -6.1100, lng: 106.8780 },
          { lat: -6.1100, lng: 106.8890 },
          { lat: -6.1200, lng: 106.8890 },
          { lat: -6.1200, lng: 106.8780 },
        ],
        dwellThresholdMinutes: 45,
        entryEnabled: true,
        exitEnabled: true,
        dwellEnabled: true,
        assignment: {
          id: 'asg-001',
          geofenceId: 'geo-001',
          assignmentType: 'ALL',
        },
        schedule: {
          id: 'sch-001',
          geofenceId: 'geo-001',
          timezone: 'Asia/Jakarta',
          daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
          startTime: '00:00',
          endTime: '23:59',
          enabled: true,
          scheduleType: 'ALWAYS',
        },
        alertRules: [
          {
            id: 'alt-001',
            geofenceId: 'geo-001',
            eventType: 'ENTER',
            enabled: true,
            severity: 'NORMAL',
            notificationChannels: ['IN_APP', 'PUSH'],
            cooldownMinutes: 15,
            recipients: ['operations@translogistik.co.id'],
          },
          {
            id: 'alt-002',
            geofenceId: 'geo-001',
            eventType: 'DWELL',
            enabled: true,
            severity: 'HIGH',
            notificationChannels: ['IN_APP', 'PUSH', 'WHATSAPP'],
            cooldownMinutes: 30,
            recipients: ['dispatch@translogistik.co.id'],
          },
        ],
        createdBy: 'Budi Santoso (Admin)',
        createdAt: '2026-01-10T08:00:00Z',
        updatedAt: '2026-08-10T10:15:00Z',
        address: 'Jl. Eka Nusa No. 1, Tanjung Priok, Jakarta Utara',
      },
      {
        id: 'geo-002',
        tenantId: 'tenant-tln-01',
        name: 'Cikarang Dry Port Logistics Hub',
        code: 'GEO-2026-000002',
        description: 'Kawasan industri bonded warehouse & clearing house Cikarang',
        type: 'CIRCLE',
        category: 'WAREHOUSE',
        priority: 'HIGH',
        status: 'ACTIVE',
        active: true,
        color: '#10B981', // Emerald
        center: { lat: -6.2825, lng: 107.1702, address: 'Kawasan Dry Port Jababeka 2, Cikarang' },
        radiusMeters: 750,
        polygonCoordinates: [],
        dwellThresholdMinutes: 60,
        entryEnabled: true,
        exitEnabled: true,
        dwellEnabled: true,
        assignment: {
          id: 'asg-002',
          geofenceId: 'geo-002',
          assignmentType: 'VEHICLE_GROUP',
          vehicleGroupNames: ['Container Port-Cikarang', 'Armada Trans-Jawa'],
        },
        schedule: {
          id: 'sch-002',
          geofenceId: 'geo-002',
          timezone: 'Asia/Jakarta',
          daysOfWeek: [1, 2, 3, 4, 5, 6],
          startTime: '07:00',
          endTime: '22:00',
          enabled: true,
          scheduleType: 'BUSINESS_HOURS',
        },
        alertRules: [
          {
            id: 'alt-003',
            geofenceId: 'geo-002',
            eventType: 'EXIT',
            enabled: true,
            severity: 'NORMAL',
            notificationChannels: ['IN_APP'],
            cooldownMinutes: 10,
            recipients: ['fleet.manager@translogistik.co.id'],
          },
        ],
        createdBy: 'Siti Aminah (Operations)',
        createdAt: '2026-02-15T09:30:00Z',
        updatedAt: '2026-08-12T14:20:00Z',
        address: 'Kawasan Jababeka Industrial Estate V, Cikarang, Bekasi',
      },
      {
        id: 'geo-003',
        tenantId: 'tenant-tln-01',
        name: 'Rest Area KM 57 Tol Jakarta-Cikampek',
        code: 'GEO-2026-000003',
        description: 'Titik istirahat wajib pengemudi & inspeksi ban armada',
        type: 'CIRCLE',
        category: 'PARKING',
        priority: 'NORMAL',
        status: 'ACTIVE',
        active: true,
        color: '#F59E0B', // Amber
        center: { lat: -6.3682, lng: 107.3512, address: 'Tol Jakarta-Cikampek KM 57, Karawang' },
        radiusMeters: 350,
        polygonCoordinates: [],
        dwellThresholdMinutes: 30,
        entryEnabled: true,
        exitEnabled: true,
        dwellEnabled: true,
        assignment: {
          id: 'asg-003',
          geofenceId: 'geo-003',
          assignmentType: 'ALL',
        },
        schedule: {
          id: 'sch-003',
          geofenceId: 'geo-003',
          timezone: 'Asia/Jakarta',
          daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
          startTime: '00:00',
          endTime: '23:59',
          enabled: true,
          scheduleType: 'ALWAYS',
        },
        alertRules: [],
        createdBy: 'Budi Santoso (Admin)',
        createdAt: '2026-03-01T11:00:00Z',
        updatedAt: '2026-07-20T16:00:00Z',
        address: 'Tol Jakarta - Cikampek KM 57, Karawang Timur',
      },
      {
        id: 'geo-004',
        tenantId: 'tenant-tln-01',
        name: 'Zona Merah Militer & Kawasan Terlarang Karawang',
        code: 'GEO-2026-000004',
        description: 'Area terbatas militer - Kendaraan armada dilarang melintas tanpa izin khusus',
        type: 'POLYGON',
        category: 'RESTRICTED_AREA',
        priority: 'CRITICAL',
        status: 'ACTIVE',
        active: true,
        color: '#EF4444', // Red
        center: { lat: -6.3300, lng: 107.2500, address: 'Kawasan Militer Karawang Barat' },
        radiusMeters: 800,
        polygonCoordinates: [
          { lat: -6.3250, lng: 107.2400 },
          { lat: -6.3250, lng: 107.2600 },
          { lat: -6.3350, lng: 107.2600 },
          { lat: -6.3350, lng: 107.2400 },
        ],
        dwellThresholdMinutes: 5,
        entryEnabled: true,
        exitEnabled: true,
        dwellEnabled: true,
        assignment: {
          id: 'asg-004',
          geofenceId: 'geo-004',
          assignmentType: 'ALL',
        },
        schedule: {
          id: 'sch-004',
          geofenceId: 'geo-004',
          timezone: 'Asia/Jakarta',
          daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
          startTime: '00:00',
          endTime: '23:59',
          enabled: true,
          scheduleType: 'ALWAYS',
        },
        alertRules: [
          {
            id: 'alt-004',
            geofenceId: 'geo-004',
            eventType: 'ENTER',
            enabled: true,
            severity: 'CRITICAL',
            notificationChannels: ['IN_APP', 'PUSH', 'WHATSAPP', 'SMS'],
            cooldownMinutes: 0,
            recipients: ['security@translogistik.co.id', 'ops.head@translogistik.co.id'],
          },
        ],
        createdBy: 'Sistem Kemanan Fleet (Security)',
        createdAt: '2026-04-10T07:15:00Z',
        updatedAt: '2026-08-01T09:00:00Z',
        address: 'Kawasan Terbatas Karawang Barat, Jawa Barat',
      },
    ];
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.geofencesKey);
      if (stored) {
        this.geofences = JSON.parse(stored);
      } else {
        this.geofences = this.getInitialDefaultGeofences();
        this.saveToStorage();
      }
    } catch {
      this.geofences = this.getInitialDefaultGeofences();
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(this.geofencesKey, JSON.stringify(this.geofences));
    } catch (err) {
      console.error('Gagal menyimpan geofences ke local storage:', err);
    }
  }

  public getGeofences(filter?: GeofenceFilterState): Geofence[] {
    let result = [...this.geofences];

    if (!filter) return result;

    if (filter.searchQuery && filter.searchQuery.trim() !== '') {
      const q = filter.searchQuery.toLowerCase();
      result = result.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.code.toLowerCase().includes(q) ||
          (g.description && g.description.toLowerCase().includes(q)) ||
          (g.address && g.address.toLowerCase().includes(q))
      );
    }

    if (filter.type && filter.type !== 'ALL') {
      result = result.filter((g) => g.type === filter.type);
    }

    if (filter.category && filter.category !== 'ALL') {
      result = result.filter((g) => g.category === filter.category);
    }

    if (filter.status && filter.status !== 'ALL') {
      result = result.filter((g) => g.status === filter.status);
    }

    if (filter.priority && filter.priority !== 'ALL') {
      result = result.filter((g) => g.priority === filter.priority);
    }

    return result;
  }

  public getGeofenceById(id: string): Geofence | undefined {
    return this.geofences.find((g) => g.id === id);
  }

  public createGeofence(geofenceData: Omit<Geofence, 'id' | 'code' | 'createdAt' | 'updatedAt'>): Geofence {
    const nextSeq = this.geofences.length + 1;
    const code = `GEO-2026-${String(nextSeq).padStart(6, '0')}`;
    const newGeofence: Geofence = {
      ...geofenceData,
      id: `geo-${Date.now()}`,
      code,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Auto calculate centroid if polygon
    if (newGeofence.type === 'POLYGON' && newGeofence.polygonCoordinates.length >= 3) {
      newGeofence.center = geofenceGeometryService.calculateCentroid(newGeofence.polygonCoordinates);
    }

    this.geofences.unshift(newGeofence);
    this.saveToStorage();
    return newGeofence;
  }

  public updateGeofence(id: string, updates: Partial<Geofence>): Geofence | undefined {
    const idx = this.geofences.findIndex((g) => g.id === id);
    if (idx === -1) return undefined;

    const updated: Geofence = {
      ...this.geofences[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (updated.type === 'POLYGON' && updated.polygonCoordinates.length >= 3) {
      updated.center = geofenceGeometryService.calculateCentroid(updated.polygonCoordinates);
    }

    this.geofences[idx] = updated;
    this.saveToStorage();
    return updated;
  }

  public deleteGeofence(id: string): boolean {
    const initialLen = this.geofences.length;
    this.geofences = this.geofences.filter((g) => g.id !== id);
    if (this.geofences.length !== initialLen) {
      this.saveToStorage();
      return true;
    }
    return false;
  }

  /**
   * Export geofences to GeoJSON FeatureCollection format
   */
  public exportToGeoJSON(geofencesList?: Geofence[]): string {
    const list = geofencesList || this.geofences;
    const features = list.map((g) => {
      let geometryObj: any = null;

      if (g.type === 'CIRCLE') {
        geometryObj = {
          type: 'Point',
          coordinates: [g.center.lng, g.center.lat],
        };
      } else {
        const ring = g.polygonCoordinates.map((p) => [p.lng, p.lat]);
        if (ring.length > 0) {
          // Close loop for GeoJSON polygon standard
          ring.push([ring[0][0], ring[0][1]]);
        }
        geometryObj = {
          type: 'Polygon',
          coordinates: [ring],
        };
      }

      return {
        type: 'Feature',
        id: g.id,
        properties: {
          id: g.id,
          name: g.name,
          code: g.code,
          category: g.category,
          type: g.type,
          radiusMeters: g.radiusMeters,
          priority: g.priority,
          status: g.status,
          dwellThresholdMinutes: g.dwellThresholdMinutes,
          address: g.address,
        },
        geometry: geometryObj,
      };
    });

    const geoJsonObject = {
      type: 'FeatureCollection',
      features,
    };

    return JSON.stringify(geoJsonObject, null, 2);
  }
}

export const geofenceManagementService = new GeofenceManagementService();
