/**
 * Fleet Intelligence Smart AI - Driver Management Service Layer
 * Enterprise CRUD, Vehicle Assignment Engine, License Verification, Shift Management & AI Intelligence Integration
 */

import {
  DriverExtended,
  DriverLicense,
  DriverAssignment,
  DriverShift,
  ShiftMaster,
  DriverDocument,
  DriverTraining,
  DriverSafetyEvent,
  DriverAIIntelligence,
  DriverActivityLog,
  DriverFilterParams,
} from '../types/driver';
import {
  mockDriversExtended,
  mockDriverLicenses,
  mockDriverAssignments,
  mockShiftMasters,
  mockDriverShifts,
  mockDriverDocuments,
  mockDriverTrainings,
  mockDriverSafetyEvents,
  mockDriverAIIntelligence,
  mockDriverActivityLogs,
} from '../constants/mockDriverData';

// In-memory data store for live state changes
let driversStore: DriverExtended[] = [...mockDriversExtended];
let licensesStore: DriverLicense[] = [...mockDriverLicenses];
let assignmentsStore: DriverAssignment[] = [...mockDriverAssignments];
let shiftsStore: DriverShift[] = [...mockDriverShifts];
let shiftMastersStore: ShiftMaster[] = [...mockShiftMasters];
let documentsStore: DriverDocument[] = [...mockDriverDocuments];
let trainingsStore: DriverTraining[] = [...mockDriverTrainings];
let safetyEventsStore: DriverSafetyEvent[] = [...mockDriverSafetyEvents];
let activityLogsStore: DriverActivityLog[] = [...mockDriverActivityLogs];

/**
 * Mask sensitive string numbers (e.g., SIM number, NIK, License number)
 * Format: "9203****90123" or "*****123"
 */
export function maskSensitiveData(value: string | undefined, showFull = false): string {
  if (!value) return '-';
  if (showFull) return value;
  if (value.length <= 4) return '****';
  const visiblePrefix = value.substring(0, 4);
  const visibleSuffix = value.substring(value.length - 4);
  return `${visiblePrefix}****${visibleSuffix}`;
}

export class DriverService {
  /**
   * Filter, search and paginate drivers list
   */
  public static async listDrivers(params: DriverFilterParams): Promise<{
    drivers: DriverExtended[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    let result = [...driversStore];

    if (params.tenantId) {
      result = result.filter((d) => d.tenantId === params.tenantId);
    }

    if (params.status && params.status !== 'all') {
      result = result.filter((d) => d.status === params.status);
    }

    if (params.availabilityStatus && params.availabilityStatus !== 'all') {
      result = result.filter((d) => d.availabilityStatus === params.availabilityStatus);
    }

    if (params.branchId && params.branchId !== 'all') {
      result = result.filter((d) => d.branchId === params.branchId);
    }

    if (params.employmentType && params.employmentType !== 'all') {
      result = result.filter((d) => d.employmentType === params.employmentType);
    }

    if (params.licenseStatus && params.licenseStatus !== 'all') {
      result = result.filter((d) => d.licenseStatus === params.licenseStatus);
    }

    if (params.licenseType && params.licenseType !== 'all') {
      result = result.filter((d) => d.primaryLicenseType === params.licenseType);
    }

    if (params.minPerformance !== undefined && params.minPerformance > 0) {
      result = result.filter((d) => d.safetyScore >= (params.minPerformance || 0));
    }

    if (params.search && params.search.trim()) {
      const query = params.search.trim().toLowerCase();
      result = result.filter((d) => {
        const nameMatch = d.fullName.toLowerCase().includes(query) || d.displayName.toLowerCase().includes(query);
        const codeMatch = d.driverCode.toLowerCase().includes(query) || d.employeeId.toLowerCase().includes(query);
        const phoneMatch = d.phone.includes(query);
        const vehicleMatch = d.currentVehiclePlate?.toLowerCase().includes(query) || false;
        const licenseMatch = d.primaryLicenseNumber?.toLowerCase().includes(query) || false;
        return nameMatch || codeMatch || phoneMatch || vehicleMatch || licenseMatch;
      });
    }

    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const total = result.length;
    const startIndex = (page - 1) * pageSize;
    const paginated = result.slice(startIndex, startIndex + pageSize);

    // Apply sensitive data masking if user lacks permission
    const showSensitive = params.hasSensitivePermission ?? true;
    const processed = paginated.map((d) => {
      if (!showSensitive) {
        return {
          ...d,
          phone: maskSensitiveData(d.phone, false),
          primaryLicenseNumber: maskSensitiveData(d.primaryLicenseNumber, false),
        };
      }
      return d;
    });

    return {
      drivers: processed,
      total,
      page,
      pageSize,
    };
  }

  /**
   * Get single driver by ID
   */
  public static async getDriverById(id: string): Promise<DriverExtended | null> {
    const driver = driversStore.find((d) => d.id === id || d.driverId === id);
    if (!driver) return null;

    // Attach updated licenses
    const licenses = licensesStore.filter((l) => l.driverId === driver.driverId);
    return {
      ...driver,
      licenses: licenses.length > 0 ? licenses : driver.licenses,
    };
  }

  /**
   * Generate next sequential Driver Code (DRV-00000X)
   */
  public static generateNextDriverCode(): string {
    const nextNumber = driversStore.length + 1;
    return `DRV-${String(nextNumber).padStart(6, '0')}`;
  }

  /**
   * Create new Driver record
   */
  public static async createDriver(data: Partial<DriverExtended>): Promise<DriverExtended> {
    const newId = `drv-${Date.now()}`;
    const code = data.driverCode || this.generateNextDriverCode();
    const now = new Date().toISOString();

    const newDriver: DriverExtended = {
      id: newId,
      driverId: newId,
      tenantId: data.tenantId || 'tenant-tln-01',
      employeeId: data.employeeId || `EMP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      driverCode: code,
      fullName: data.fullName || 'Driver Baru',
      displayName: data.displayName || data.fullName?.split(' ')[0] || 'Driver',
      photoUrl: data.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      gender: data.gender || 'male',
      dateOfBirth: data.dateOfBirth || '1990-01-01',
      phone: data.phone || '+62 812 0000 0000',
      email: data.email || 'driver@translogistik.co.id',
      address: data.address || 'Alamat Cabang Utama',
      branchId: data.branchId || 'br-jkt',
      branchName: data.branchName || 'HQ & Depo Jakarta (Tanjung Priok)',
      departmentId: data.departmentId || 'dept-logistics',
      departmentName: data.departmentName || 'Divisi Trans-Jawa Long Haul',
      position: data.position || 'Heavy Truck Driver',
      status: data.status || 'active',
      availabilityStatus: data.availabilityStatus || 'available',
      employmentType: data.employmentType || 'permanent',
      joinDate: data.joinDate || now.split('T')[0],
      emergencyContact: data.emergencyContact || {
        name: 'Kontak Darurat',
        relationship: 'Keluarga',
        phone: '+62 812 9999 8888',
      },
      currentVehicleId: data.currentVehicleId,
      currentVehiclePlate: data.currentVehiclePlate,
      licenses: data.licenses || [],
      primaryLicenseNumber: data.primaryLicenseNumber || '9203000000000',
      primaryLicenseType: data.primaryLicenseType || 'SIM B2 Umum',
      primaryLicenseExpiry: data.primaryLicenseExpiry || '2029-12-31',
      licenseStatus: 'valid',
      safetyScore: 100,
      totalTripsCompleted: 0,
      totalDistanceKm: 0,
      totalDriveTimeMinutes: 0,
      speedingEventsCount: 0,
      harshBrakingCount: 0,
      harshAccelCount: 0,
      idleExcessMinutes: 0,
      notes: data.notes || 'Pengemudi baru didaftarkan.',
      createdAt: now,
      updatedAt: now,
    };

    driversStore.unshift(newDriver);

    // Create primary license entry if provided
    if (data.primaryLicenseNumber) {
      const newLicense: DriverLicense = {
        licenseId: `lic-${Date.now()}`,
        driverId: newId,
        licenseNumber: data.primaryLicenseNumber,
        licenseType: data.primaryLicenseType || 'SIM B2 Umum',
        expiryDate: data.primaryLicenseExpiry || '2029-12-31',
        status: 'valid',
        verifiedAt: now,
        verifiedBy: 'System Initializer',
        createdAt: now,
      };
      licensesStore.push(newLicense);
      newDriver.licenses.push(newLicense);
    }

    // Add activity log
    this.addActivityLog(newId, 'driver_created', 'Pendaftaran Driver Baru', `Driver ${newDriver.fullName} (${code}) berhasil didaftarkan.`, 'Admin');

    return newDriver;
  }

  /**
   * Update existing Driver record
   */
  public static async updateDriver(id: string, updates: Partial<DriverExtended>): Promise<DriverExtended> {
    const index = driversStore.findIndex((d) => d.id === id || d.driverId === id);
    if (index === -1) throw new Error('Driver tidak ditemukan');

    const existing = driversStore[index];
    const now = new Date().toISOString();

    const updated: DriverExtended = {
      ...existing,
      ...updates,
      updatedAt: now,
    };

    driversStore[index] = updated;

    this.addActivityLog(updated.driverId, 'driver_updated', 'Pembaruan Data Driver', `Data driver ${updated.fullName} telah diperbarui.`, 'Admin');

    return updated;
  }

  /**
   * Vehicle Assignment Engine: Validate assignment parameters
   */
  public static validateVehicleAssignment(
    driver: DriverExtended,
    vehicleId: string,
    vehiclePlate: string
  ): { valid: boolean; warnings: string[]; errors: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Employment status check
    if (driver.status === 'suspended' || driver.status === 'inactive' || driver.status === 'terminated') {
      errors.push(`Driver dalam status ${driver.status.toUpperCase()} dan tidak dapat ditugaskan.`);
    }

    // 2. License expiry check
    if (driver.licenseStatus === 'expired') {
      errors.push('SIM/Lisensi mengemudi driver telah kedaluwarsa.');
    } else if (driver.licenseStatus === 'expiring_soon') {
      warnings.push('SIM driver akan kedaluwarsa dalam kurang dari 30 hari. Disarankan memperbarui lisensi.');
    }

    // 3. Current active assignment check
    if (driver.currentVehicleId && driver.currentVehicleId !== vehicleId) {
      warnings.push(`Driver saat ini masih terhubung dengan kendaraan ${driver.currentVehiclePlate}. Penugasan ini akan menggantikan kendaraan sebelumnya.`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Vehicle Assignment Engine: Assign vehicle to driver
   */
  public static async assignVehicle(
    driverId: string,
    vehicleId: string,
    vehiclePlate: string,
    vehicleName?: string,
    gpsDeviceId?: string,
    assignedBy: string = 'Fleet Manager',
    reason?: string
  ): Promise<DriverAssignment> {
    const driver = await this.getDriverById(driverId);
    if (!driver) throw new Error('Driver tidak ditemukan');

    const validation = this.validateVehicleAssignment(driver, vehicleId, vehiclePlate);
    if (!validation.valid) {
      throw new Error(`Gagal menugaskan kendaraan: ${validation.errors.join(' ')}`);
    }

    const now = new Date().toISOString();

    // Close any previous active assignment for this driver
    assignmentsStore = assignmentsStore.map((a) => {
      if (a.driverId === driverId && a.status === 'active') {
        return { ...a, status: 'completed', endAt: now };
      }
      return a;
    });

    const newAssignment: DriverAssignment = {
      assignmentId: `asgn-${Date.now()}`,
      tenantId: driver.tenantId,
      driverId,
      driverName: driver.fullName,
      vehicleId,
      vehiclePlate,
      vehicleName: vehicleName || vehiclePlate,
      gpsDeviceId: gpsDeviceId || driver.currentGpsDeviceId || 'dev-01',
      gpsStatus: 'online',
      startAt: now,
      assignmentType: 'primary',
      status: 'active',
      assignedBy,
      reason: reason || 'Penugasan kendaraan aktif baru',
      createdAt: now,
    };

    assignmentsStore.unshift(newAssignment);

    // Update driver state
    await this.updateDriver(driverId, {
      currentVehicleId: vehicleId,
      currentVehiclePlate: vehiclePlate,
      currentVehicleName: vehicleName,
      availabilityStatus: 'assigned',
    });

    this.addActivityLog(driverId, 'vehicle_assigned', 'Penugasan Kendaraan', `Kendaraan ${vehiclePlate} ditugaskan kepada ${driver.fullName}.`, assignedBy);

    return newAssignment;
  }

  /**
   * Unassign vehicle from driver
   */
  public static async unassignVehicle(driverId: string, unassignedBy: string = 'Fleet Manager'): Promise<void> {
    const driver = await this.getDriverById(driverId);
    if (!driver) return;

    const now = new Date().toISOString();

    assignmentsStore = assignmentsStore.map((a) => {
      if (a.driverId === driverId && a.status === 'active') {
        return { ...a, status: 'completed', endAt: now };
      }
      return a;
    });

    await this.updateDriver(driverId, {
      currentVehicleId: undefined,
      currentVehiclePlate: undefined,
      currentVehicleName: undefined,
      availabilityStatus: 'available',
    });

    this.addActivityLog(driverId, 'vehicle_unassigned', 'Pelepasan Kendaraan', `Kendaraan ${driver.currentVehiclePlate || ''} dilepas dari driver ${driver.fullName}.`, unassignedBy);
  }

  /**
   * License Management: Get driver licenses
   */
  public static async getLicensesByDriver(driverId: string): Promise<DriverLicense[]> {
    return licensesStore.filter((l) => l.driverId === driverId);
  }

  /**
   * License Management: Add new license
   */
  public static async addLicense(licenseData: Partial<DriverLicense>): Promise<DriverLicense> {
    const now = new Date().toISOString();
    const newLicense: DriverLicense = {
      licenseId: `lic-${Date.now()}`,
      driverId: licenseData.driverId || '',
      licenseNumber: licenseData.licenseNumber || '',
      licenseType: licenseData.licenseType || 'SIM B2 Umum',
      issuingAuthority: licenseData.issuingAuthority || 'Polda Metro Jaya',
      issuedDate: licenseData.issuedDate || now.split('T')[0],
      expiryDate: licenseData.expiryDate || '2030-01-01',
      status: licenseData.status || 'valid',
      verifiedAt: now,
      verifiedBy: 'HR Verification',
      createdAt: now,
    };

    licensesStore.push(newLicense);

    // Update driver primary license if needed
    const driver = await this.getDriverById(newLicense.driverId);
    if (driver) {
      await this.updateDriver(driver.driverId, {
        primaryLicenseNumber: newLicense.licenseNumber,
        primaryLicenseType: newLicense.licenseType,
        primaryLicenseExpiry: newLicense.expiryDate,
        licenseStatus: newLicense.status,
      });
    }

    this.addActivityLog(newLicense.driverId, 'license_added', 'Penambahan SIM / Lisensi', `SIM ${newLicense.licenseType} (${newLicense.licenseNumber}) ditambahkan.`, 'HR Officer');

    return newLicense;
  }

  /**
   * Shift Management: List all shift masters
   */
  public static async listShiftMasters(): Promise<ShiftMaster[]> {
    return [...shiftMastersStore];
  }

  /**
   * Shift Management: Get driver shifts
   */
  public static async getDriverShifts(driverId?: string, date?: string): Promise<DriverShift[]> {
    let result = [...shiftsStore];
    if (driverId) {
      result = result.filter((s) => s.driverId === driverId);
    }
    if (date) {
      result = result.filter((s) => s.date === date);
    }
    return result;
  }

  /**
   * Shift Management: Assign shift to driver
   */
  public static async assignShift(
    driverId: string,
    shiftId: string,
    date: string,
    assignedBy: string = 'Dispatcher'
  ): Promise<DriverShift> {
    const driver = await this.getDriverById(driverId);
    const master = shiftMastersStore.find((m) => m.id === shiftId);
    if (!driver || !master) throw new Error('Driver atau Master Shift tidak ditemukan');

    const newShift: DriverShift = {
      driverShiftId: `ds-${Date.now()}`,
      tenantId: driver.tenantId,
      driverId,
      driverName: driver.fullName,
      shiftId: master.id,
      shiftName: master.name,
      date,
      startAt: `${date}T${master.startTime}:00Z`,
      endAt: `${date}T${master.endTime}:00Z`,
      status: 'scheduled',
      assignedBy,
      notes: `Shift ${master.name} dijadwalkan.`,
    };

    shiftsStore.push(newShift);

    this.addActivityLog(driverId, 'shift_assigned', 'Penjadwalan Shift', `Shift ${master.name} dijadwalkan untuk tanggal ${date}.`, assignedBy);

    return newShift;
  }

  /**
   * Get Documents for Driver
   */
  public static async getDocumentsByDriver(driverId: string): Promise<DriverDocument[]> {
    return documentsStore.filter((d) => d.driverId === driverId);
  }

  /**
   * Get Trainings for Driver
   */
  public static async getTrainingsByDriver(driverId: string): Promise<DriverTraining[]> {
    return trainingsStore.filter((t) => t.driverId === driverId);
  }

  /**
   * Get Safety Events for Driver
   */
  public static async getSafetyEventsByDriver(driverId: string): Promise<DriverSafetyEvent[]> {
    return safetyEventsStore.filter((s) => s.driverId === driverId);
  }

  /**
   * Get AI Intelligence Insights for Driver
   */
  public static async getAIIntelligence(driverId: string): Promise<DriverAIIntelligence | null> {
    if (mockDriverAIIntelligence[driverId]) {
      return mockDriverAIIntelligence[driverId];
    }
    const driver = await this.getDriverById(driverId);
    if (!driver) return null;

    return {
      driverId,
      safetyScore: driver.safetyScore,
      overallRating: driver.safetyScore >= 90 ? 'Excellent' : driver.safetyScore >= 80 ? 'Good' : 'Fair',
      drivingBehaviorSummary: `Driver ${driver.fullName} menunjukkan performa mengemudi stabil dengan tingkat keselamatan ${driver.safetyScore}/100.`,
      positivePoints: ['Disiplin mematuhi jadwal shift.', 'Rata-rata waktu henti aman.'],
      attentionPoints: ['Pantau durasi mengemudi jarak jauh tanpa jeda.'],
      recommendations: ['Disarankan mengikuti sertifikasi berkala Defensive Driving.'],
      confidenceScore: 88,
      riskLevel: driver.safetyScore >= 90 ? 'LOW' : 'MEDIUM',
      anomalies: [],
      coaching: [
        {
          focusArea: 'Defensive Driving Refresher',
          suggestion: 'Ikuti sesi pelatihan ulang pra-keberangkatan.',
          priority: 'low',
        },
      ],
    };
  }

  /**
   * Get Activity Logs for Driver
   */
  public static async getActivityLogs(driverId: string): Promise<DriverActivityLog[]> {
    return activityLogsStore.filter((l) => l.driverId === driverId);
  }

  /**
   * Add internal activity log entry
   */
  private static addActivityLog(
    driverId: string,
    eventType: DriverActivityLog['eventType'],
    title: string,
    description: string,
    performedBy: string
  ) {
    const log: DriverActivityLog = {
      id: `log-${Date.now()}`,
      driverId,
      tenantId: 'tenant-tln-01',
      timestamp: new Date().toISOString(),
      eventType,
      title,
      description,
      performedBy,
    };
    activityLogsStore.unshift(log);
  }
}
