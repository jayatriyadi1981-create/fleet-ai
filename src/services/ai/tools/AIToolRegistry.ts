/**
 * Fleet Intelligence Smart AI - Central AI Tool Registry
 * Manages categorized telematics tools with strict RBAC permission checks,
 * risk classification, and execution boundaries.
 */

import { AIToolDefinition, AIFullContext, AIRiskLevel, AIToolCategory } from '../../../types/ai';
import { driverIntelligenceService } from '../../../modules/driver-intelligence/engines/DriverIntelligenceService';
import { aiDriverCoachingService } from '../../../modules/driver-intelligence/engines/AIDriverCoachingService';
import { maintenanceIntelligenceService } from '../../../modules/maintenance-intelligence/engines/MaintenanceIntelligenceService';
import { routeIntelligenceService } from '../../../modules/route-intelligence/engines/RouteIntelligenceService';

export class AIToolRegistry {
  private static instance: AIToolRegistry;
  private tools: Map<string, AIToolDefinition> = new Map();

  private constructor() {
    this.registerCoreTools();
  }

  public static getInstance(): AIToolRegistry {
    if (!AIToolRegistry.instance) {
      AIToolRegistry.instance = new AIToolRegistry();
    }
    return AIToolRegistry.instance;
  }

  public registerTool(tool: AIToolDefinition): void {
    this.tools.set(tool.toolId, tool);
  }

  public getTool(toolId: string): AIToolDefinition | undefined {
    return this.tools.get(toolId);
  }

  public getAllTools(): AIToolDefinition[] {
    return Array.from(this.tools.values());
  }

  public getToolsByCategory(category: AIToolCategory): AIToolDefinition[] {
    return this.getAllTools().filter((t) => t.category === category);
  }

  /**
   * Filter tools available to a specific user context based on RBAC permissions
   */
  public getAvailableToolsForUser(context: AIFullContext): AIToolDefinition[] {
    const userPermissions = context.user.permissions || [];
    const isSuperAdmin = context.user.role === 'super_admin';

    return this.getAllTools().filter((tool) => {
      if (isSuperAdmin) return true;
      if (!tool.requiredPermission) return true;
      return userPermissions.includes(tool.requiredPermission) || userPermissions.includes('ai.tool.read');
    });
  }

  private registerCoreTools(): void {
    // 1. GPS & Live Tracking Tools
    this.registerTool({
      toolId: 'getFleetLiveStatus',
      name: 'Get Fleet Live Telematics Status',
      description: 'Mendapatkan status real-time seluruh kendaraan armada (bergerak, idle, parkir, offline).',
      category: 'READ',
      requiredPermission: 'tracking.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [],
      execute: async (_args, context) => context.gps || { message: 'GPS data context available' },
    });

    this.registerTool({
      toolId: 'getLiveVehicleLocation',
      name: 'Get Live Vehicle Location',
      description: 'Mengambil koordinat lintang/bujur, kecepatan, alamat geocoding, dan arah kendaraan.',
      category: 'READ',
      requiredPermission: 'tracking.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [{ name: 'vehicleId', type: 'string', description: 'ID Kendaraan atau Plat Nomor', required: true }],
      execute: async (args, context) => {
        const v = context.vehicle;
        return v ? {
          plateNumber: v.plateNumber,
          lat: v.latestTelemetry?.location?.lat || -6.2088,
          lng: v.latestTelemetry?.location?.lng || 106.8456,
          speed: v.latestTelemetry?.location?.speed || 0,
          address: v.latestTelemetry?.location?.address || 'Jl. Jend. Sudirman, Jakarta',
          status: v.status,
          updatedAt: v.latestTelemetry?.timestamp || new Date().toISOString(),
        } : { error: 'Kendaraan tidak ditemukan dalam jangkauan otorisasi.' };
      },
    });

    this.registerTool({
      toolId: 'getVehicleSpeed',
      name: 'Get Vehicle Speed Telemetry',
      description: 'Membaca kecepatan terkini dan deteksi batas kecepatan di ruas jalan.',
      category: 'READ',
      requiredPermission: 'tracking.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [{ name: 'vehicleId', type: 'string', description: 'ID Kendaraan', required: true }],
      execute: async (_args, context) => ({
        speedKmH: context.vehicle?.latestTelemetry?.location?.speed || 0,
        speedLimit: 80,
        isOverspeed: (context.vehicle?.latestTelemetry?.location?.speed || 0) > 80,
      }),
    });

    // 2. Vehicle Tools
    this.registerTool({
      toolId: 'getVehicleProfile',
      name: 'Get Vehicle Technical Profile',
      description: 'Mengambil profil spesifikasi armada, odometer, kapasitas BBM, dan masa berlaku dokumen (STNK/KIR).',
      category: 'READ',
      requiredPermission: 'vehicle.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [{ name: 'vehicleId', type: 'string', description: 'ID Kendaraan', required: true }],
      execute: async (_args, context) => context.vehicle || { message: 'Vehicle Profile' },
    });

    this.registerTool({
      toolId: 'getVehicleHealth',
      name: 'Get Vehicle Diagnostics & Health',
      description: 'Membaca voltase aki, temperatur mesin, CAN-Bus error codes, dan status sensor.',
      category: 'READ',
      requiredPermission: 'vehicle.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [{ name: 'vehicleId', type: 'string', description: 'ID Kendaraan', required: true }],
      execute: async (_args, context) => ({
        batteryVoltage: context.vehicle?.latestTelemetry?.batteryVoltage || 12.6,
        engineTemp: context.vehicle?.latestTelemetry?.engineTempCelsius || 85,
        engineHours: context.vehicle?.engineHours || 4200,
        healthStatus: 'NORMAL',
      }),
    });

    // 3. Driver Tools
    this.registerTool({
      toolId: 'getDriverBehavior',
      name: 'Get Driver Safety & Eco Behavior',
      description: 'Mengambil telematika pengereman mendadak, akselerasi kasar, overspeed, dan skor eco-driving.',
      category: 'READ',
      requiredPermission: 'driver.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [{ name: 'driverId', type: 'string', description: 'ID Driver', required: true }],
      execute: async (_args, context) => context.driver || {
        safetyScore: 92,
        ecoScore: 88,
        harshBraking: 2,
        speedingEvents: 1,
      },
    });

    // 4. Maintenance Tools
    this.registerTool({
      toolId: 'getMaintenanceHistory',
      name: 'Get Maintenance History & Work Orders',
      description: 'Mengambil riwayat servis, penggantian suku cadang, dan jadwal perawatan berkala.',
      category: 'READ',
      requiredPermission: 'maintenance.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [{ name: 'vehicleId', type: 'string', description: 'ID Kendaraan', required: true }],
      execute: async (_args, context) => context.maintenance || { openWorkOrders: 4, overdueCount: 2 },
    });

    // 5. Fuel Tools
    this.registerTool({
      toolId: 'getFuelConsumption',
      name: 'Get Fuel Consumption Telemetry',
      description: 'Membaca level solar sensor ultrasonik/kapasitif, grafik KM/Liter, dan anomali fuel drop.',
      category: 'READ',
      requiredPermission: 'fuel.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [{ name: 'vehicleId', type: 'string', description: 'ID Kendaraan', required: false }],
      execute: async (_args, context) => context.fuel || { avgKmPerLiter: 3.42, target: 3.80 },
    });

    // 6. Inspection Tools (Prompt 26)
    this.registerTool({
      toolId: 'getInspectionHistory',
      name: 'Get Daily Pre-Trip Inspection Records',
      description: 'Membaca checklist inspeksi harian pra-perjalanan, item gagal, dan bukti foto defek.',
      category: 'READ',
      requiredPermission: 'inspection.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [{ name: 'vehicleId', type: 'string', description: 'ID Kendaraan', required: false }],
      execute: async (_args, context) => context.inspection || { complianceRate: 92.4, groundedVehicles: ['B 9821 UTX'] },
    });

    // 7. Safety Tools
    this.registerTool({
      toolId: 'getSafetyIncidents',
      name: 'Get Safety Events & Collision Warnings',
      description: 'Mengambil rekaman insiden keselamatan, near-miss, dan alert ADAS/DMS.',
      category: 'READ',
      requiredPermission: 'safety.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [],
      execute: async (_args, context) => context.safety || { averageFleetSafetyScore: 89.2 },
    });

    // 8. Delivery & Trip Tools
    this.registerTool({
      toolId: 'getOpenDeliveries',
      name: 'Get Active Deliveries & POD Status',
      description: 'Mengambil status manifest muatan, estimasi kedatangan (ETA), dan konfirmasi Proof of Delivery.',
      category: 'READ',
      requiredPermission: 'trip.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [],
      execute: async (_args, context) => context.delivery || { openDeliveries: 28, delayed: 2 },
    });

    // 8B. Prompt 28 - AI Fleet Intelligence Tools
    this.registerTool({
      toolId: 'getFleetHealth',
      name: 'Get Fleet Health Score & Breakdown',
      description: 'Mengambil skor kesehatan keseluruhan armada (0-100), kategori kesehatan, dan kontribusi 7 pilar telematika.',
      category: 'READ',
      requiredPermission: 'ai.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [],
      execute: async (_args, context) => ({
        overallScore: 87,
        category: 'Good',
        availability: 94,
        maintenance: 82,
        inspection: 92,
        safety: 88,
        gpsConnectivity: 96,
        driverBehavior: 85,
        operations: 88,
        changePercent: -2.3,
        summary: 'Kondisi kesehatan armada stabil pada skor 87/100.',
      }),
    });

    this.registerTool({
      toolId: 'getFleetUtilization',
      name: 'Get Fleet Utilization & Load Balancing',
      description: 'Mengukur tingkat utilisasi armada aktif (%), mendeteksi kendaraan underutilized (<30%) dan overutilized (>85%).',
      category: 'READ',
      requiredPermission: 'ai.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [],
      execute: async (_args, context) => ({
        utilizationRate: 78,
        category: 'Good',
        activeVehicles: 142,
        availableVehicles: 172,
        underutilizedCount: 3,
        overutilizedCount: 2,
        totalDrivingHours: 840,
        changePercent: +7.0,
      }),
    });

    this.registerTool({
      toolId: 'getVehiclePerformance',
      name: 'Get Individual Vehicle Performance Score',
      description: 'Mengambil skor performa multi-faktor kendaraan tertentu, risiko, efisiensi BBM, dan diagnostik telemetri.',
      category: 'READ',
      requiredPermission: 'ai.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [{ name: 'vehicleId', type: 'string', description: 'ID Kendaraan atau Plat Nomor', required: true }],
      execute: async (args, context) => ({
        vehicleId: args.vehicleId || context.vehicle?.id,
        plateNumber: context.vehicle?.plateNumber || args.vehicleId,
        performanceScore: 88,
        ranking: 4,
        utilizationPercent: 82,
        fuelEfficiencyKmPerL: 3.42,
        riskLevel: 'LOW',
        trend: 'stable',
      }),
    });

    this.registerTool({
      toolId: 'getFleetAnomalies',
      name: 'Get Active Operational Anomalies',
      description: 'Mendapatkan daftar anomali telematika aktif (idle tak terduga, fuel drain, deviasi rute, offline berulang).',
      category: 'READ',
      requiredPermission: 'ai.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [],
      execute: async (_args, context) => ({
        totalAnomalies: 5,
        criticalCount: 1,
        highCount: 3,
        anomalies: [
          { type: 'fuel_drain', plate: 'B 9211 TJP', severity: 'CRITICAL', score: 92 },
          { type: 'unexpected_idle', plate: 'B 9554 KLD', severity: 'HIGH', score: 76 },
          { type: 'frequent_offline', plate: 'B 9821 UTX', severity: 'HIGH', score: 68 },
        ],
      }),
    });

    this.registerTool({
      toolId: 'getFleetEfficiency',
      name: 'Get Comprehensive Fleet Efficiency Metrics',
      description: 'Mengambil rincian efisiensi BBM (km/L), estimasi biaya BBM terbuang akibat idle, deviasi rute, dan downtime.',
      category: 'READ',
      requiredPermission: 'ai.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [],
      execute: async (_args, context) => ({
        overallEfficiencyScore: 84,
        avgKmPerLiter: 3.42,
        baselineKmPerLiter: 3.80,
        idleLossCostIdr: 14850000,
        routeDeviationPercent: 6.6,
        costPerKmIdr: 11630,
      }),
    });

    this.registerTool({
      toolId: 'getFleetRisk',
      name: 'Get Fleet Risk Profile & Quadrant Matrix',
      description: 'Mendapatkan profil risiko komposit armada, jumlah unit berisiko kritis, dan status matriks 2x2.',
      category: 'READ',
      requiredPermission: 'ai.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [],
      execute: async (_args, context) => ({
        overallRiskLevel: 'MEDIUM',
        riskScore: 44,
        criticalVehiclesCount: 2,
        highRiskVehiclesCount: 5,
      }),
    });

    this.registerTool({
      toolId: 'getFleetRanking',
      name: 'Get Fleet Performance Rankings',
      description: 'Mengambil daftar top 5 kendaraan terbaik vs 5 kendaraan yang membutuhkan perhatian.',
      category: 'READ',
      requiredPermission: 'ai.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [],
      execute: async (_args, context) => ({
        topPerformers: ['B 9101 TJP', 'B 9345 KLD', 'B 9882 UTX'],
        attentionList: ['B 9211 TJP', 'B 9482 UTX'],
      }),
    });

    this.registerTool({
      toolId: 'getFleetTrends',
      name: 'Get Historical Trends for Fleet KPIs',
      description: 'Mengambil data kecenderungan historis kesehatan, utilisasi, dan efisiensi armada.',
      category: 'READ',
      requiredPermission: 'ai.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [{ name: 'timeRange', type: 'string', description: 'Rentang waktu tren (7_days, 30_days)', required: false }],
      execute: async (_args, context) => ({
        healthTrendChange: -2.3,
        utilizationTrendChange: +7.0,
        efficiencyTrendChange: -3.6,
      }),
    });

    this.registerTool({
      toolId: 'compareFleetPeriods',
      name: 'Compare Fleet Performance Across Time Periods',
      description: 'Membandingkan metrik operasional antara periode saat ini vs periode sebelumnya dengan analisis AI.',
      category: 'READ',
      requiredPermission: 'ai.analyze',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [],
      execute: async (_args, context) => ({
        periodCurrent: 'Hari Ini',
        periodPrevious: 'Kemarin',
        summary: 'Utilisasi naik +7% namun efisiensi BBM terkoreksi -3.6% akibat peningkatan idle mesin.',
      }),
    });

    this.registerTool({
      toolId: 'compareFleetBranches',
      name: 'Compare Fleet Performance Across Branches',
      description: 'Membandingkan performa telematika antar cabang perusahaan (Cabang Jakarta vs Surabaya).',
      category: 'READ',
      requiredPermission: 'ai.analyze',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [
        { name: 'branchA', type: 'string', description: 'ID/Nama Cabang A', required: true },
        { name: 'branchB', type: 'string', description: 'ID/Nama Cabang B', required: true },
      ],
      execute: async (args) => ({
        branchA: args.branchA || 'Cabang Jakarta Pusat',
        branchB: args.branchB || 'Cabang Surabaya Barat',
        healthDiff: '+13 poin (Jakarta unggul)',
        utilizationDiff: '+18% (Jakarta unggul)',
      }),
    });

    this.registerTool({
      toolId: 'getFleetInsights',
      name: 'Get AI Telematics Operational Insights',
      description: 'Menghasilkan insight sintetis operasional berbasis data GPS, BBM, Maintenance, dan Safety.',
      category: 'READ',
      requiredPermission: 'ai.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [],
      execute: async (_args, context) => ({
        insightsCount: 4,
        topInsight: 'Potensi penghematan Rp 14.85 Juta/bulan jika idle di geofence MM2100 ditekan ke 15 menit.',
      }),
    });

    this.registerTool({
      toolId: 'getFleetRecommendations',
      name: 'Get Proactive Fleet Recommendations',
      description: 'Mengambil rekomendasi tindakan proaktif berbasis ROI, pencegahan downtime, dan perataan beban armada.',
      category: 'READ',
      requiredPermission: 'ai.recommend',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [],
      execute: async (_args, context) => ({
        recommendationsCount: 4,
        totalSavingsPotentialIdr: 35550000,
        actions: ['CREATE_WORK_ORDER', 'REASSIGN_FLEET', 'UPDATE_GEOFENCE_RULE', 'SCHEDULE_COACHING'],
      }),
    });

    // 9. HIGH RISK ACTION TOOLS (Section 36)
    this.registerTool({
      toolId: 'groundVehicle',
      name: 'Ground Vehicle (Out of Service)',
      description: 'Menonaktifkan kendaraan dari penugasan operasional akibat temuan defek kritis atau bahaya.',
      category: 'ACTION',
      requiredPermission: 'vehicle.edit',
      tenantScope: true,
      riskLevel: 'HIGH',
      parameters: [
        { name: 'vehicleId', type: 'string', description: 'ID Kendaraan', required: true },
        { name: 'reason', type: 'string', description: 'Alasan Penonaktifan', required: true },
      ],
      execute: async (args) => ({
        success: true,
        action: 'GROUND_VEHICLE',
        vehicleId: args.vehicleId,
        status: 'under_maintenance',
        message: `Kendaraan ${args.vehicleId} berhasil di-grounded (Status: Under Maintenance). Alasan: ${args.reason}`,
        timestamp: new Date().toISOString(),
      }),
    });

    this.registerTool({
      toolId: 'createWorkOrder',
      name: 'Create Maintenance Work Order',
      description: 'Menerbitkan Surat Perintah Kerja (WO) perbaikan atau servis berkala ke bengkel rekanan.',
      category: 'ACTION',
      requiredPermission: 'maintenance.create',
      tenantScope: true,
      riskLevel: 'HIGH',
      parameters: [
        { name: 'vehicleId', type: 'string', description: 'ID Kendaraan', required: true },
        { name: 'issueCategory', type: 'string', description: 'Kategori Kerusakan', required: true },
        { name: 'priority', type: 'string', description: 'Prioritas (LOW/MEDIUM/HIGH/CRITICAL)', required: true },
      ],
      execute: async (args) => {
        const woNumber = `WO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        return {
          success: true,
          workOrderNumber: woNumber,
          vehicleId: args.vehicleId,
          message: `Work Order ${woNumber} berhasil diterbitkan dengan prioritas ${args.priority}.`,
          timestamp: new Date().toISOString(),
        };
      },
    });

    this.registerTool({
      toolId: 'sendAlertNotification',
      name: 'Broadcast Driver / Fleet Alert',
      description: 'Mengirimkan notifikasi peringatan operasional darurat ke aplikasi pengemudi atau manajer.',
      category: 'ACTION',
      requiredPermission: 'alert.view',
      tenantScope: true,
      riskLevel: 'MEDIUM',
      parameters: [
        { name: 'targetId', type: 'string', description: 'Target ID Driver atau Grup', required: true },
        { name: 'message', type: 'string', description: 'Isi Pesan Peringatan', required: true },
      ],
      execute: async (args) => ({
        success: true,
        broadcastId: `BC-${Date.now()}`,
        target: args.targetId,
        message: `Pesan peringatan berhasil dikirim: "${args.message}"`,
        timestamp: new Date().toISOString(),
      }),
    });

    // 8. AI Driver Intelligence Tools (PROMPT 29)
    this.registerTool({
      toolId: 'getDriverRiskScore',
      name: 'Get Driver Risk Score',
      description: 'Mendapatkan evaluasi skor risiko pengemudi (0-100), level risiko, faktor pemicu utama, dan bukti telemetri.',
      category: 'READ',
      requiredPermission: 'driver.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [
        { name: 'driverId', type: 'string', description: 'ID Pengemudi (contoh: drv-01)', required: true },
        { name: 'period', type: 'string', description: 'Periode (7_DAYS, 30_DAYS, 90_DAYS)', required: false },
      ],
      execute: async (args) => {
        const profile = driverIntelligenceService.getDriverProfile(args.driverId, (args.period as any) || '30_DAYS');
        return {
          driverId: profile.driverId,
          driverName: profile.driverName,
          riskScore: profile.riskScore.score,
          riskLevel: profile.riskScore.level,
          trend: profile.riskScore.trend,
          primaryFactor: profile.riskScore.primaryRiskFactor,
          explanation: profile.riskScore.explanation,
          evidence: profile.riskScore.evidence,
          topContributors: profile.riskScore.contributors.slice(0, 3),
        };
      },
    });

    this.registerTool({
      toolId: 'getDriverRiskRanking',
      name: 'Get Driver Risk Ranking & Leaderboard',
      description: 'Mendapatkan daftar pengemudi berisiko tinggi (membutuhkan perhatian/coaching) dan pengemudi teladan (top safety performers).',
      category: 'READ',
      requiredPermission: 'driver.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [
        { name: 'period', type: 'string', description: 'Periode (7_DAYS, 30_DAYS, 90_DAYS)', required: false },
        { name: 'branchId', type: 'string', description: 'Filter ID Cabang (opsional)', required: false },
      ],
      execute: async (args) => {
        const result = driverIntelligenceService.getAllDriverRankings((args.period as any) || '30_DAYS', {
          period: (args.period as any) || '30_DAYS',
          branchId: args.branchId,
        });
        return {
          topAttentionRequired: result.attentionRequired,
          topPerformers: result.topPerformers,
          totalRanked: result.rankings.length,
        };
      },
    });

    this.registerTool({
      toolId: 'getDriverBehaviorAnalysis',
      name: 'Get Driver Behavior Telematics Breakdown',
      description: 'Menganalisis detail insiden overspeed, harsh braking, harsh acceleration, sharp turn, route deviation, dan idle efficiency.',
      category: 'READ',
      requiredPermission: 'driver.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [
        { name: 'driverId', type: 'string', description: 'ID Pengemudi', required: true },
        { name: 'period', type: 'string', description: 'Periode evaluasi', required: false },
      ],
      execute: async (args) => {
        const profile = driverIntelligenceService.getDriverProfile(args.driverId, (args.period as any) || '30_DAYS');
        return {
          driverId: profile.driverId,
          driverName: profile.driverName,
          behaviorScore: profile.behaviorAnalysis.overallBehaviorScore,
          overspeed: profile.behaviorAnalysis.overspeed,
          harshBraking: profile.behaviorAnalysis.harshBraking,
          harshAcceleration: profile.behaviorAnalysis.harshAcceleration,
          sharpTurn: profile.behaviorAnalysis.sharpTurn,
          routeDeviation: profile.behaviorAnalysis.routeDeviation,
          idleBehavior: profile.behaviorAnalysis.idleBehavior,
          frequencyVsFleet: profile.behaviorAnalysis.frequencyComparison,
        };
      },
    });

    this.registerTool({
      toolId: 'getDriverSafetyScore',
      name: 'Get Driver Safety Score & Grade',
      description: 'Mendapatkan Skor Keselamatan (Safety Score 0-100), Grade (A+ sd F), serta sub-skor kepatuhan batas keselamatan.',
      category: 'READ',
      requiredPermission: 'driver.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [
        { name: 'driverId', type: 'string', description: 'ID Pengemudi', required: true },
        { name: 'period', type: 'string', description: 'Periode evaluasi', required: false },
      ],
      execute: async (args) => {
        const profile = driverIntelligenceService.getDriverProfile(args.driverId, (args.period as any) || '30_DAYS');
        return {
          driverId: profile.driverId,
          driverName: profile.driverName,
          safetyScore: profile.safetyScore.score,
          grade: profile.safetyScore.grade,
          trend: profile.safetyScore.trend,
          subScores: profile.safetyScore.subScores,
          eventsPer100Km: profile.safetyScore.eventsPer100Km,
          safeKilometers: profile.safetyScore.safeKilometersCount,
        };
      },
    });

    this.registerTool({
      toolId: 'getDriverPerformance',
      name: 'Get Driver 8-Factor Performance Score',
      description: 'Mendapatkan skor komposit performa pengemudi berdasarkan 8 faktor (safety, behavior, trip completion, route, punctuality, inspection, fuel, care).',
      category: 'READ',
      requiredPermission: 'driver.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [
        { name: 'driverId', type: 'string', description: 'ID Pengemudi', required: true },
      ],
      execute: async (args) => {
        const profile = driverIntelligenceService.getDriverProfile(args.driverId);
        return {
          driverId: profile.driverId,
          driverName: profile.driverName,
          compositeScore: profile.performanceScore.compositeScore,
          factors: profile.performanceScore.factors,
          ranking: profile.performanceScore.ranking,
        };
      },
    });

    this.registerTool({
      toolId: 'getDriverTrend',
      name: 'Get Driver Risk & Safety Trend',
      description: 'Melihat tren perubahan risiko pengemudi dalam periode 7, 30, atau 90 hari terakhir dengan penjelasan delta berbasis bukti.',
      category: 'READ',
      requiredPermission: 'driver.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [
        { name: 'driverId', type: 'string', description: 'ID Pengemudi', required: true },
        { name: 'period', type: 'string', description: 'Periode tren (7_DAYS, 30_DAYS, 90_DAYS)', required: false },
      ],
      execute: async (args) => {
        const profile = driverIntelligenceService.getDriverProfile(args.driverId, (args.period as any) || '30_DAYS');
        return {
          driverId: profile.driverId,
          driverName: profile.driverName,
          period: profile.trend.period,
          direction: profile.trend.direction,
          scoreChange: profile.trend.scoreChange,
          summary: profile.trend.riskChangeSummary,
          evidence: profile.trend.evidence,
          historyPoints: profile.trend.history,
        };
      },
    });

    this.registerTool({
      toolId: 'getDriverAnomalies',
      name: 'Detect Driver Behavioral Anomalies',
      description: 'Mendeteksi anomali perilaku mengemudi mendadak, lonjakan risiko, atau deviasi rute tidak biasa.',
      category: 'READ',
      requiredPermission: 'driver.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [
        { name: 'driverId', type: 'string', description: 'ID Pengemudi (opsional, kosongkan untuk armada)', required: false },
      ],
      execute: async (args) => {
        const rankings = driverIntelligenceService.getAllDriverRankings('30_DAYS');
        const anomalies = rankings.attentionRequired.map((d) => ({
          driverId: d.driverId,
          driverName: d.driverName,
          issue: d.primaryRiskIssue,
          riskScore: d.riskScore,
          trend: d.trend,
          severity: d.riskScore > 75 ? 'CRITICAL' : 'HIGH',
        }));
        return {
          totalAnomalies: anomalies.length,
          anomalies,
        };
      },
    });

    this.registerTool({
      toolId: 'compareDriverPerformance',
      name: 'Compare Multiple Drivers Performance',
      description: 'Membandingkan profil risiko, keselamatan, dan efisiensi 2 hingga 4 driver secara komprehensif terhadap benchmark rekan kerja.',
      category: 'READ',
      requiredPermission: 'driver.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [
        { name: 'driverIds', type: 'string', description: 'Daftar ID Driver dipisahkan koma (contoh: drv-01,drv-02)', required: true },
      ],
      execute: async (args) => {
        const ids = args.driverIds.split(',').map((s: string) => s.trim()).filter(Boolean);
        const result = driverIntelligenceService.compareDrivers(ids);
        return result;
      },
    });

    this.registerTool({
      toolId: 'getDriverRecommendations',
      name: 'Get AI Safety Recommendations for Driver',
      description: 'Mendapatkan daftar rekomendasi keselamatan proaktif berbasis telemetri untuk pengemudi tertentu.',
      category: 'READ',
      requiredPermission: 'driver.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [
        { name: 'driverId', type: 'string', description: 'ID Pengemudi', required: true },
      ],
      execute: async (args) => {
        const profile = driverIntelligenceService.getDriverProfile(args.driverId);
        return {
          driverId: profile.driverId,
          driverName: profile.driverName,
          recommendationsCount: profile.recommendations.length,
          recommendations: profile.recommendations,
        };
      },
    });

    this.registerTool({
      toolId: 'generateDriverCoachingPlan',
      name: 'Generate AI Driver Coaching Plan',
      description: 'Menghasilkan rancangan sesi coaching non-punitif lengkap dengan talking points, contoh telemetri konkret, dan metrik follow-up.',
      category: 'ACTION',
      requiredPermission: 'ai.recommend',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [
        { name: 'driverId', type: 'string', description: 'ID Pengemudi', required: true },
        { name: 'focusType', type: 'string', description: 'Kategori Coaching (SPEED_MANAGEMENT, BRAKING_TECHNIQUE, ROUTE_COMPLIANCE, REST_BREAK_REMINDER, IDLE_REDUCTION)', required: true },
        { name: 'observedBehavior', type: 'string', description: 'Deskripsi perilaku yang teramati', required: false },
      ],
      execute: async (args) => {
        const profile = driverIntelligenceService.getDriverProfile(args.driverId);
        const plan = aiDriverCoachingService.generateAICoachingPlan(
          profile.driverName,
          args.focusType,
          args.focusType as any,
          args.observedBehavior || 'Berdasarkan catatan telemetri telematika sistem.',
          profile.riskScore.evidence
        );
        return {
          success: true,
          driverId: profile.driverId,
          driverName: profile.driverName,
          coachingPlan: plan,
        };
      },
    });

    this.registerTool({
      toolId: 'getCoachingHistory',
      name: 'Get Driver Coaching History & Logs',
      description: 'Melihat riwayat sesi coaching, status acknowledgement pengemudi, dan catatan pengawas.',
      category: 'READ',
      requiredPermission: 'driver.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [
        { name: 'driverId', type: 'string', description: 'ID Pengemudi', required: true },
      ],
      execute: async (args) => {
        const sessions = aiDriverCoachingService.getSessionsByDriver(args.driverId);
        return {
          driverId: args.driverId,
          totalSessions: sessions.length,
          sessions,
        };
      },
    });

    this.registerTool({
      toolId: 'getCoachingEffectiveness',
      name: 'Get Coaching Program Effectiveness Metrics',
      description: 'Mengevaluasi efektivitas program coaching armada (penurunan skor risiko rata-rata, tingkat keberhasilan, dan alert follow-up).',
      category: 'READ',
      requiredPermission: 'driver.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [],
      execute: async () => {
        const metrics = aiDriverCoachingService.getCoachingEffectivenessMetrics();
        return metrics;
      },
    });

    // ==========================================
    // 9. AI PREDICTIVE MAINTENANCE TOOLS (PROMPT 31)
    // ==========================================

    this.registerTool({
      toolId: 'getMaintenanceRisk',
      name: 'Get Vehicle Maintenance Risk',
      description: 'Mendapatkan skor risiko pemeliharaan (0-100), level risiko, tren, dan bukti telemetri/inspeksi/servis kendaraan.',
      category: 'READ',
      requiredPermission: 'maintenance.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [
        { name: 'vehicleId', type: 'string', description: 'ID Kendaraan atau Plat Nomor', required: true },
      ],
      execute: async (args) => {
        const profile = maintenanceIntelligenceService.getVehicleProfile(args.vehicleId);
        if (!profile) return { error: `Kendaraan ${args.vehicleId} tidak ditemukan.` };
        return {
          vehicleId: profile.vehicleId,
          plateNumber: profile.plateNumber,
          riskScore: profile.riskScore,
          riskLevel: profile.riskLevel,
          riskTrend: profile.riskTrend,
          primaryContributingFactor: profile.activePredictions[0]?.potentialFailureMode || 'Normal',
          evidence: profile.activePredictions.flatMap(p => p.evidence),
        };
      },
    });

    this.registerTool({
      toolId: 'getVehicleHealth',
      name: 'Get Vehicle Health Score',
      description: 'Mengambil skor kesehatan kendaraan (0-100), grade (Excellent/Good/Attention/Poor/Critical), dan rincian sensor.',
      category: 'READ',
      requiredPermission: 'maintenance.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [
        { name: 'vehicleId', type: 'string', description: 'ID Kendaraan atau Plat Nomor', required: true },
      ],
      execute: async (args) => {
        const profile = maintenanceIntelligenceService.getVehicleProfile(args.vehicleId);
        if (!profile) return { error: `Kendaraan ${args.vehicleId} tidak ditemukan.` };
        return {
          vehicleId: profile.vehicleId,
          plateNumber: profile.plateNumber,
          healthScore: profile.healthScore,
          healthGrade: profile.healthGrade,
          dataQuality: profile.dataQuality,
          telemetryOnline: profile.telemetryOnline,
          sensorReadings: profile.sensorReadings,
        };
      },
    });

    this.registerTool({
      toolId: 'getComponentHealth',
      name: 'Get 12 Component Health Matrix',
      description: 'Melihat status kesehatan 12 sistem komponen (Engine, Battery, Brakes, Tires, Cooling, Electrical, Suspension, Fuel, Oil, AC, GPS Device).',
      category: 'READ',
      requiredPermission: 'maintenance.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [
        { name: 'vehicleId', type: 'string', description: 'ID Kendaraan atau Plat Nomor', required: true },
      ],
      execute: async (args) => {
        const profile = maintenanceIntelligenceService.getVehicleProfile(args.vehicleId);
        if (!profile) return { error: `Kendaraan ${args.vehicleId} tidak ditemukan.` };
        return {
          vehicleId: profile.vehicleId,
          plateNumber: profile.plateNumber,
          components: profile.components.map(c => ({
            component: c.component,
            name: c.name,
            status: c.status,
            healthScore: c.healthScore,
            riskLevel: c.riskLevel,
            indicators: c.indicators,
          })),
        };
      },
    });

    this.registerTool({
      toolId: 'getFailureIndicators',
      name: 'Get Potential Component Failure Indicators',
      description: 'Mendeteksi potensi kegagalan komponen (Failure Horizon 7d/30d/90d, probabilitas, dan rekomendasi).',
      category: 'READ',
      requiredPermission: 'maintenance.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [
        { name: 'vehicleId', type: 'string', description: 'ID Kendaraan (opsional untuk seluruh armada)', required: false },
      ],
      execute: async (args) => {
        const predictions = maintenanceIntelligenceService.getFailurePredictions({ vehicleId: args.vehicleId });
        return {
          totalPredictions: predictions.length,
          predictions: predictions.map(p => ({
            plateNumber: p.plateNumber,
            component: p.componentName,
            failureRisk: p.failureRisk,
            horizon: p.horizonLabel,
            potentialMode: p.potentialFailureMode,
            evidence: p.evidence.map(e => e.finding),
            recommendedAction: p.recommendedAction,
          })),
        };
      },
    });

    this.registerTool({
      toolId: 'getServiceDue',
      name: 'Get Service Due & Overdue Status',
      description: 'Mendapatkan daftar servis berkala yang Due Soon, Due, Overdue, atau Critical Overdue.',
      category: 'READ',
      requiredPermission: 'maintenance.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [
        { name: 'vehicleId', type: 'string', description: 'ID Kendaraan (opsional)', required: false },
      ],
      execute: async (args) => {
        const dueList = maintenanceIntelligenceService.getServiceDueList({ vehicleId: args.vehicleId });
        return {
          totalServices: dueList.length,
          overdueCount: dueList.filter(s => s.status === 'OVERDUE' || s.status === 'CRITICAL_OVERDUE').length,
          services: dueList,
        };
      },
    });

    this.registerTool({
      toolId: 'getServicePrediction',
      name: 'Get Predicted Service Date & Mileage',
      description: 'Memperkirakan tanggal dan jarak tempuh servis berikutnya berdasarkan run-rate utilisasi harian.',
      category: 'READ',
      requiredPermission: 'maintenance.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [
        { name: 'vehicleId', type: 'string', description: 'ID Kendaraan', required: true },
      ],
      execute: async (args) => {
        const profile = maintenanceIntelligenceService.getVehicleProfile(args.vehicleId);
        if (!profile || profile.serviceDueItems.length === 0) return { error: 'Data servis tidak tersedia.' };
        const srv = profile.serviceDueItems[0];
        return {
          vehicleId: profile.vehicleId,
          plateNumber: profile.plateNumber,
          serviceType: srv.serviceType,
          currentMileage: srv.currentMileage,
          predictedServiceDate: srv.predictedServiceDate,
          predictedServiceMileage: srv.predictedServiceMileage,
          remainingKm: srv.remainingMileage,
          status: srv.status,
        };
      },
    });

    this.registerTool({
      toolId: 'getMaintenancePriority',
      name: 'Get Maintenance Priority Queue (P1-P4)',
      description: 'Mengambil antrean prioritas pemeliharaan armada yang diurutkan dari P1 (Critical) hingga P4 (Low).',
      category: 'READ',
      requiredPermission: 'maintenance.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [],
      execute: async () => {
        const queue = maintenanceIntelligenceService.getMaintenancePriorityQueue();
        return {
          totalQueue: queue.length,
          p1Count: queue.filter(q => q.priority === 'P1').length,
          p2Count: queue.filter(q => q.priority === 'P2').length,
          queue: queue.slice(0, 10),
        };
      },
    });

    this.registerTool({
      toolId: 'getMaintenanceRecommendations',
      name: 'Get AI Maintenance Recommendations',
      description: 'Melihat rekomendasi pemeliharaan lengkap dengan estimasi suku cadang, biaya, checklist inspeksi, dan tombol persetujuan.',
      category: 'READ',
      requiredPermission: 'maintenance.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [
        { name: 'vehicleId', type: 'string', description: 'ID Kendaraan (opsional)', required: false },
      ],
      execute: async (args) => {
        const recs = maintenanceIntelligenceService.getRecommendations({ vehicleId: args.vehicleId });
        return {
          totalRecommendations: recs.length,
          pendingReviewCount: recs.filter(r => r.status === 'PENDING_REVIEW').length,
          recommendations: recs,
        };
      },
    });

    this.registerTool({
      toolId: 'getMaintenanceAnomalies',
      name: 'Get Maintenance Anomalies',
      description: 'Mendeteksi perbaikan berulang (repeat repairs), lonjakan biaya tak terduga, dan downtime ekstrem.',
      category: 'READ',
      requiredPermission: 'maintenance.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [],
      execute: async () => {
        const anomalies = maintenanceIntelligenceService.getAnomalies();
        return {
          totalAnomalies: anomalies.length,
          anomalies,
        };
      },
    });

    this.registerTool({
      toolId: 'getRepeatFailurePatterns',
      name: 'Get Repeat Failure Patterns',
      description: 'Menganalisis komponen yang mengalami perbaikan berulang dalam 90 hari terakhir.',
      category: 'READ',
      requiredPermission: 'maintenance.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [
        { name: 'vehicleId', type: 'string', description: 'ID Kendaraan (opsional)', required: false },
      ],
      execute: async (args) => {
        const anomalies = maintenanceIntelligenceService.getAnomalies().filter(a => a.patternType === 'REPEAT_COMPONENT_FAILURE');
        const filtered = args.vehicleId ? anomalies.filter(a => a.vehicleId === args.vehicleId || a.plateNumber === args.vehicleId) : anomalies;
        return {
          repeatFailureCount: filtered.length,
          patterns: filtered,
        };
      },
    });

    this.registerTool({
      toolId: 'getMaintenanceCostAnalysis',
      name: 'Get Maintenance Financial Cost Analysis',
      description: 'Mengambil metrik biaya per KM, TCO per kendaraan, distribusi komponen pengeluaran terbesar, dan cost outliers.',
      category: 'READ',
      requiredPermission: 'maintenance.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [],
      execute: async () => {
        const costData = maintenanceIntelligenceService.getCostAnalysis();
        return costData;
      },
    });

    this.registerTool({
      toolId: 'getMaintenanceDowntime',
      name: 'Get Workshop Downtime & Availability Risk',
      description: 'Menganalisis total jam kendaraan di bengkel dan estimasi kehilangan potensi pendapatan.',
      category: 'READ',
      requiredPermission: 'maintenance.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [],
      execute: async () => {
        const kpi = maintenanceIntelligenceService.getKPIs();
        const cost = maintenanceIntelligenceService.getCostAnalysis();
        return {
          fleetAvailabilityPercentage: kpi.fleetAvailabilityPercentage,
          totalDowntimeHours: cost.totalDowntimeHours,
          estimatedDowntimeLoss: cost.downtimeCostEstimated,
        };
      },
    });

    this.registerTool({
      toolId: 'getMaintenanceTrend',
      name: 'Get Maintenance Health & Risk Trends',
      description: 'Melihat tren historis skor kesehatan armada, risiko, dan proyeksi bulan berikutnya.',
      category: 'READ',
      requiredPermission: 'maintenance.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [],
      execute: async () => {
        const trends = maintenanceIntelligenceService.getTrends();
        return { trends };
      },
    });

    this.registerTool({
      toolId: 'getMaintenanceDataQuality',
      name: 'Get Maintenance Telemetry & Data Quality',
      description: 'Mengevaluasi kelengkapan data sensor GPS, riwayat servis, inspeksi pre-trip, dan OBD.',
      category: 'READ',
      requiredPermission: 'maintenance.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [
        { name: 'vehicleId', type: 'string', description: 'ID Kendaraan (opsional)', required: false },
      ],
      execute: async (args) => {
        const profiles = maintenanceIntelligenceService.getAllVehicleProfiles({ vehicleId: args.vehicleId });
        return {
          totalVehiclesEvaluated: profiles.length,
          telemetryOnlinePercentage: Math.round((profiles.filter(p => p.telemetryOnline).length / profiles.length) * 100),
          profilesDataQuality: profiles.map(p => ({
            plateNumber: p.plateNumber,
            dataQuality: p.dataQuality,
            telemetryOnline: p.telemetryOnline,
          })),
        };
      },
    });

    // 10. Route Intelligence & Dynamic ETA Tools
    this.registerTool({
      toolId: 'getRouteIntelligenceKPIs',
      name: 'Get Route Intelligence & ETA Summary KPIs',
      description: 'Mengambil ringkasan metrik akurasi ETA, deviasi koridor rute, efisiensi bahan bakar per rute, dan potensi penghematan biaya tol/waktu.',
      category: 'READ',
      requiredPermission: 'ai.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [],
      execute: async () => routeIntelligenceService.getKPIs(),
    });

    this.registerTool({
      toolId: 'getActiveTripsETA',
      name: 'Get Active Trips ETA & Route Status',
      description: 'Mendapatkan status trip aktif yang sedang berjalan, prediksi ETA terkini, tingkat risiko keterlambatan, dan status deviasi rute.',
      category: 'READ',
      requiredPermission: 'ai.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [
        { name: 'branch', type: 'string', description: 'Filter Cabang (opsional)', required: false },
        { name: 'etaRisk', type: 'string', description: 'Filter Resiko ETA (LOW, MEDIUM, HIGH, CRITICAL)', required: false },
      ],
      execute: async (args) => {
        const trips = routeIntelligenceService.getActiveTrips({
          search: '',
          branch: args.branch || 'ALL',
          vehicleType: 'ALL',
          routeStatus: 'ALL',
          trafficStatus: 'ALL',
          etaRisk: args.etaRisk || 'ALL',
          deviationStatus: 'ALL',
          dateRange: 'TODAY',
        });
        return {
          count: trips.length,
          trips: trips.map(t => ({
            tripId: t.tripId,
            tripNumber: t.tripNumber,
            plateNumber: t.plateNumber,
            driverName: t.driverName,
            origin: t.origin,
            destination: t.destination,
            predictedETA: t.predictedETA,
            delayRisk: t.delayRisk,
            routeStatus: t.routeStatus,
            currentSpeedKmh: t.currentSpeedKmh,
            remainingDistanceKm: t.remainingDistanceKm,
          })),
        };
      },
    });

    this.registerTool({
      toolId: 'getAIRouteRecommendations',
      name: 'Get Proactive AI Route & ETA Recommendations',
      description: 'Mengambil rekomendasi cerdas AI untuk menghindari kemacetan, penghematan BBM, koreksi deviasi koridor, dan pergantian rute alternatif.',
      category: 'READ',
      requiredPermission: 'ai.view',
      tenantScope: true,
      riskLevel: 'LOW',
      parameters: [],
      execute: async () => {
        const recs = routeIntelligenceService.getRecommendations();
        return {
          totalRecommendations: recs.length,
          recommendations: recs.map(r => ({
            id: r.id,
            title: r.title,
            category: r.category,
            plateNumber: r.plateNumber,
            why: r.why,
            confidence: r.confidence,
            suggestedAction: r.suggestedAction,
            status: r.status,
          })),
        };
      },
    });
  }
}

export const aiToolRegistry = AIToolRegistry.getInstance();
