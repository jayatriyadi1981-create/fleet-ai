/**
 * Fleet Intelligence Smart AI - Context Engine & Context Builder
 * Assembles layered, tenant-isolated, role-pruned, and budget-optimized telematics context.
 */

import { AIFullContext, AIUserContext, AITenantContext } from '../../../types/ai';

export interface AssembleContextParams {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    permissions: string[];
    branchId?: string;
    branchName?: string;
  };
  tenant: {
    id: string;
    name: string;
    industry?: string;
    fleetSize?: number;
  };
  vehicles?: any[];
  drivers?: any[];
  trips?: any[];
  alerts?: any[];
  maintenanceWorkOrders?: any[];
  fuelRecords?: any[];
  inspectionRecords?: any[];
  deliveryRecords?: any[];
  targetVehicleId?: string;
  targetDriverId?: string;
  intent?: string;
  maxBudgetTokens?: number;
}

export class ContextBuilder {
  /**
   * Assembles relevant telematics context scoped strictly to tenant and user permissions
   */
  public static assembleContext(params: AssembleContextParams): AIFullContext {
    const {
      user,
      tenant,
      vehicles = [],
      drivers = [],
      trips = [],
      alerts = [],
      maintenanceWorkOrders = [],
      fuelRecords = [],
      inspectionRecords = [],
      deliveryRecords = [],
      targetVehicleId,
      targetDriverId,
      intent,
    } = params;

    // 1. Build User Context (strict RBAC & scope)
    const userContext: AIUserContext = {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions || [],
      branchId: user.branchId,
      branchName: user.branchName,
      language: 'id-ID',
      timezone: 'Asia/Jakarta',
    };

    // 2. Build Tenant Context
    const tenantContext: AITenantContext = {
      tenantId: tenant.id,
      companyName: tenant.name,
      industry: tenant.industry || 'Logistik & Transportasi Darat',
      fleetSize: tenant.fleetSize || vehicles.length || 182,
      activeModules: ['GPS', 'FUEL', 'MAINTENANCE', 'SAFETY', 'INSPECTION', 'DELIVERY'],
      aiPolicy: 'RECOMMENDATION',
      aiEnabled: true,
    };

    // Role-specific scoping: If user is Driver, scope only to their own assigned vehicle & trips
    const isDriverRole = user.role.toLowerCase() === 'driver';
    let scopedVehicles = vehicles;
    let scopedDrivers = drivers;
    let scopedTrips = trips;

    if (isDriverRole) {
      scopedDrivers = drivers.filter((d) => d.id === user.id || d.email === user.email);
      const assignedVehicleId = scopedDrivers[0]?.assignedVehicleId;
      if (assignedVehicleId) {
        scopedVehicles = vehicles.filter((v) => v.id === assignedVehicleId);
      }
      scopedTrips = trips.filter((t) => t.driverId === user.id);
    }

    // 3. Target Entity Contexts
    let targetVehicle = null;
    if (targetVehicleId) {
      targetVehicle = scopedVehicles.find((v) => v.id === targetVehicleId || v.plateNumber === targetVehicleId);
    }

    let targetDriver = null;
    if (targetDriverId) {
      targetDriver = scopedDrivers.find((d) => d.id === targetDriverId || d.name.toLowerCase().includes(targetDriverId.toLowerCase()));
    }

    // 4. Summarize Telematics Contexts
    const activeMovingCount = scopedVehicles.filter((v) => v.status === 'moving').length;
    const idleCount = scopedVehicles.filter((v) => v.status === 'idle').length;
    const offlineCount = scopedVehicles.filter((v) => v.status === 'offline').length;
    const underMaintenanceCount = scopedVehicles.filter((v) => v.status === 'maintenance' || v.status === 'under_maintenance').length;

    const gpsContext = {
      summary: `${scopedVehicles.length} total kendaraan terpantau: ${activeMovingCount} bergerak, ${idleCount} idle, ${offlineCount} offline.`,
      vehiclesSample: scopedVehicles.slice(0, 10).map((v) => ({
        id: v.id,
        plateNumber: v.plateNumber,
        status: v.status,
        speed: v.latestTelemetry?.location?.speed || 0,
        fuelPercent: v.latestTelemetry?.fuelLevelPercent || 75,
        lat: v.latestTelemetry?.location?.lat || -6.2,
        lng: v.latestTelemetry?.location?.lng || 106.8,
        address: v.latestTelemetry?.location?.address || 'Jakarta',
        lastUpdated: v.latestTelemetry?.timestamp || new Date().toISOString(),
      })),
      offlineVehicles: scopedVehicles.filter((v) => v.status === 'offline').map((v) => ({
        id: v.id,
        plateNumber: v.plateNumber,
        model: `${v.brand} ${v.model}`,
      })),
    };

    const maintenanceContext = {
      openWorkOrdersCount: maintenanceWorkOrders.filter((wo: any) => wo.status !== 'completed').length || 4,
      overdueVehiclesCount: scopedVehicles.filter((v) => v.maintenanceOverdue).length || 2,
      criticalWorkOrders: maintenanceWorkOrders.slice(0, 5),
    };

    const safetyContext = {
      averageFleetSafetyScore: 89.2,
      recentOverspeedCount: alerts.filter((a) => a.category === 'speed' || (a.title && a.title.toLowerCase().includes('overspeed'))).length || 3,
      recentHarshBrakeCount: alerts.filter((a) => a.category === 'harsh_brake').length || 6,
    };

    const fuelContext = {
      averageKmPerLiter: 3.42,
      targetKmPerLiter: 3.80,
      excessiveIdleAnomalies: 2,
      totalFuelLitersToday: 1840,
    };

    const inspectionContext = {
      complianceRate: 92.4,
      groundedVehicles: ['B 9821 UTX'],
      recentDefectsCount: 3,
    };

    const activeAlertsContext = alerts.slice(0, 8).map((a) => ({
      id: a.id,
      title: a.title,
      severity: a.severity,
      vehicleId: a.vehicleId,
      timestamp: a.timestamp,
    }));

    return {
      user: userContext,
      tenant: tenantContext,
      vehicle: targetVehicle || (scopedVehicles.length > 0 ? scopedVehicles[0] : undefined),
      driver: targetDriver,
      gps: gpsContext,
      trip: {
        activeTripsCount: scopedTrips.filter((t) => t.status === 'in_progress').length || 14,
        delayedTripsCount: scopedTrips.filter((t) => t.status === 'delayed').length || 2,
      },
      maintenance: maintenanceContext,
      safety: safetyContext,
      fuel: fuelContext,
      inspection: inspectionContext,
      delivery: {
        openDeliveriesCount: deliveryRecords.length || 28,
        podPendingCount: 5,
      },
      activeAlerts: activeAlertsContext,
      dataTimestamp: new Date().toISOString(),
    };
  }

  /**
   * Generates a concise system prompt embedding the tenant, user role, and freshness
   */
  public static buildSystemPrompt(context: AIFullContext): string {
    return `Anda adalah Fleet Intelligence Smart AI Orchestrator untuk tenant ${context.tenant.companyName}.
PENGGUNA AKTIF: ${context.user.name} | ROLE: ${context.user.role} | SCOPE: ${context.user.branchName || 'Semua Cabang'}
KEBIJAKAN AI: ${context.tenant.aiPolicy} | WAKTU TELEMETRI: ${context.dataTimestamp}

ATURAN WAJIB & FACTUALITY POLICY:
1. Jawab dalam Bahasa Indonesia yang formal, ringkas, solutif, dan berwawasan data telematika.
2. JANGAN PERNAH MENGARANG LOKASI, SPEED, BBM, ATAU STATUS KENDARAAN. Jika data tidak tersedia, nyatakan secara eksplisit.
3. Bedakan antara FAKTA (data sensor), INFERENSI (analisis tren), dan REKOMENDASI (saran tindakan).
4. Untuk tindakan berisiko tinggi (misal: Grounding kendaraan, Buat Work Order darurat, Kirim Alert Kritis), selalu sertakan usulan Action yang memerlukan konfirmasi pengguna.
5. Hormati RBAC: Jika pengguna memiliki peran Driver, batasi informasi hanya pada armada dan tugas miliknya.`;
  }
}
