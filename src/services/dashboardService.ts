/**
 * Fleet Intelligence Smart AI - Centralized Dashboard Service Layer
 * PROMPT 8 - Smart Dashboard Data Aggregation & Business Intelligence Engine
 */

import {
  DashboardFilterState,
  FleetKPIs,
  VehicleStatusSummary,
  MapPreviewVehicle,
  AlertKPISummary,
  DashboardAlertItem,
  DriverScoreSummary,
  FuelSummary,
  MaintenanceHealthSummary,
  TripSummary,
  DashboardAIInsight,
} from '../types/dashboard';
import { mockVehicles, mockDrivers, mockTrips, mockAlerts, mockMaintenanceOrders, mockAIInsights } from '../constants/mockData';

// Indonesian Locale Utility Formatters
export const formatIdrCurrency = (amount: number): string => {
  if (amount >= 1_000_000_000) {
    return `Rp ${(amount / 1_000_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(1)}Jt`;
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumberIdr = (num: number): string => {
  return new Intl.NumberFormat('id-ID').format(num);
};

class DashboardService {
  /**
   * Filter vehicle list based on active branch and fleet group filter
   */
  private filterVehicles(filter: DashboardFilterState) {
    return mockVehicles.filter((v) => {
      if (filter.branchId !== 'all' && v.branchId !== filter.branchId) {
        return false;
      }
      if (filter.fleetGroup !== 'all' && v.groupName !== filter.fleetGroup) {
        return false;
      }
      return true;
    });
  }

  /**
   * Get Global & Fleet KPIs
   */
  async getFleetKPIs(filter: DashboardFilterState): Promise<FleetKPIs> {
    const vehicles = this.filterVehicles(filter);
    const totalVehicles = vehicles.length || 248;

    const moving = vehicles.filter((v) => v.status === 'moving').length;
    const idle = vehicles.filter((v) => v.status === 'idle').length;
    const parking = vehicles.filter((v) => v.status === 'parking').length;
    const emergency = vehicles.filter((v) => v.status === 'emergency').length;
    const maintenance = vehicles.filter((v) => v.status === 'maintenance').length;
    const offline = vehicles.filter((v) => v.status === 'offline').length;

    const activeVehicles = moving + idle + parking;
    const utilization = totalVehicles > 0 ? Math.round(((moving + idle) / totalVehicles) * 1000) / 10 : 78.6;

    return {
      totalVehicles: totalVehicles === mockVehicles.length ? 248 : totalVehicles,
      totalVehiclesTrend: '+12 bulan ini',
      activeVehicles: activeVehicles > 0 ? activeVehicles : 172,
      movingVehicles: moving > 0 ? moving : 124,
      idleVehicles: idle > 0 ? idle : 48,
      stoppedVehicles: parking > 0 ? parking : 36,
      offlineVehicles: offline > 0 ? offline : 40,
      tripsToday: 184,
      distanceTodayKm: 48294,
      fleetUtilizationPercent: utilization,
      fleetAvailabilityPercent: 92.4,
      averageSpeedKmH: 58,
      drivingHours: 1420,
      idleHours: 184,
    };
  }

  /**
   * Get Vehicle Status Distribution
   */
  async getVehicleStatusSummary(filter: DashboardFilterState): Promise<VehicleStatusSummary> {
    const vehicles = this.filterVehicles(filter);
    
    let moving = vehicles.filter((v) => v.status === 'moving').length;
    let idle = vehicles.filter((v) => v.status === 'idle').length;
    let stopped = vehicles.filter((v) => v.status === 'parking').length;
    let offline = vehicles.filter((v) => v.status === 'offline').length;
    let maintenance = vehicles.filter((v) => v.status === 'maintenance' || v.status === 'emergency').length;

    // Fallback baseline for prototype if mock count is small
    if (vehicles.length === mockVehicles.length) {
      moving = 124;
      idle = 48;
      stopped = 36;
      offline = 40;
      maintenance = 12;
    }

    const total = moving + idle + stopped + offline + maintenance;

    return {
      moving,
      idle,
      stopped,
      offline,
      maintenance,
      total,
    };
  }

  /**
   * Get Live Map Preview Vehicles
   */
  async getLiveMapPreview(filter: DashboardFilterState): Promise<MapPreviewVehicle[]> {
    const vehicles = this.filterVehicles(filter);

    return vehicles.map((v) => {
      const driver = mockDrivers.find((d) => d.id === v.currentDriverId);
      const lat = v.latestTelemetry?.location.lat || -6.2088;
      const lng = v.latestTelemetry?.location.lng || 106.8456;
      const speed = v.latestTelemetry?.location.speed || 0;

      return {
        id: v.id,
        plateNumber: v.plateNumber,
        driverName: driver ? driver.name : 'Unassigned',
        brandModel: `${v.brand} ${v.model}`,
        status: v.status,
        speedKmH: speed,
        locationName: v.latestTelemetry?.location.address || v.groupName,
        lat,
        lng,
        lastUpdatedText: '12 detik yang lalu',
        tripNumber: 'TRP-20260814-01',
      };
    });
  }

  /**
   * Get Active Alerts & Severity Breakdown
   */
  async getAlertsSummary(filter: DashboardFilterState): Promise<{ kpi: AlertKPISummary; recentAlerts: DashboardAlertItem[] }> {
    const recentAlerts: DashboardAlertItem[] = mockAlerts.map((alt) => ({
      id: alt.id,
      vehicleId: alt.vehicleId,
      vehiclePlate: alt.vehiclePlate,
      driverName: alt.driverName || 'Driver',
      title: alt.title,
      message: alt.message,
      severity: alt.severity,
      category: alt.category,
      timeAgo: alt.timestamp,
    }));

    return {
      kpi: {
        critical: 7,
        high: 12,
        medium: 18,
        resolvedToday: 45,
      },
      recentAlerts,
    };
  }

  /**
   * Get Driver Score Overview
   */
  async getDriverScores(filter: DashboardFilterState): Promise<DriverScoreSummary> {
    const topDrivers = mockDrivers.slice(0, 5).map((d) => ({
      id: d.id,
      name: d.name,
      avatarUrl: d.photoUrl,
      score: d.score.overallScore,
      tripsCompleted: d.totalTripsCompleted,
      assignedVehiclePlate: 'B 9821 UTX',
    }));

    const driversAtRisk = [
      {
        id: 'drv-risk-1',
        name: 'Rizky Pratama',
        score: 61,
        primaryRiskReason: 'Frekuensi overspeed & rem mendadak tinggi',
        assignedVehiclePlate: 'B 9123 CKR',
        recentIncidentCount: 8,
      },
      {
        id: 'drv-risk-2',
        name: 'Feri Gunawan',
        score: 65,
        primaryRiskReason: 'Indikasi kelelahan mengemudi > 4 jam',
        assignedVehiclePlate: 'B 9555 SBY',
        recentIncidentCount: 5,
      },
      {
        id: 'drv-risk-3',
        name: 'Doni Saputra',
        score: 68,
        primaryRiskReason: 'Idle berkepanjangan dengan AC menyala',
        assignedVehiclePlate: 'B 9001 JKT',
        recentIncidentCount: 4,
      },
    ];

    return {
      averageScore: 87,
      scoreTrendVsLastWeekPercent: 4.2,
      topDrivers,
      driversAtRisk,
      factorBreakdown: {
        speedingEvents: 14,
        harshBrakingEvents: 8,
        harshAccelerationEvents: 11,
        harshCorneringEvents: 3,
        seatbeltViolations: 1,
        excessiveIdleMinutes: 210,
        drivingHoursTotal: 1840,
      },
    };
  }

  /**
   * Get Fuel Performance Overview & Anomalies
   */
  async getFuelSummary(filter: DashboardFilterState): Promise<FuelSummary> {
    const trendChart = [
      { dateLabel: 'Senin', consumptionLiters: 4120, costIdr: 51500000, efficiencyKmL: 4.7 },
      { dateLabel: 'Selasa', consumptionLiters: 4350, costIdr: 54375000, efficiencyKmL: 4.8 },
      { dateLabel: 'Rabu', consumptionLiters: 3980, costIdr: 49750000, efficiencyKmL: 4.9 },
      { dateLabel: 'Kamis', consumptionLiters: 4520, costIdr: 56500000, efficiencyKmL: 4.6 },
      { dateLabel: 'Jumat', consumptionLiters: 4210, costIdr: 52625000, efficiencyKmL: 4.8 },
      { dateLabel: 'Sabtu', consumptionLiters: 3840, costIdr: 48000000, efficiencyKmL: 5.0 },
      { dateLabel: 'Minggu', consumptionLiters: 3400, costIdr: 42500000, efficiencyKmL: 5.1 },
    ];

    const anomalies = [
      {
        id: 'anom-1',
        vehicleId: 'veh-01',
        vehiclePlate: 'B 1234 ABC',
        driverName: 'Sutrisno Hartono',
        deviationPercent: 28,
        expectedLiters: 110,
        actualLiters: 140.8,
        spbuLocation: 'SPBU Rest Area KM 57 Tol Cikampek',
        timeAgo: '2 jam yang lalu',
        estimatedCostLossIdr: 431200,
      },
      {
        id: 'anom-2',
        vehicleId: 'veh-02',
        vehiclePlate: 'B 5678 DEF',
        driverName: 'Ahmad Dahlan',
        deviationPercent: 19,
        expectedLiters: 95,
        actualLiters: 113.0,
        spbuLocation: 'SPBU Shell KM 19 Tol Jakarta-Cikampek',
        timeAgo: '5 jam yang lalu',
        estimatedCostLossIdr: 252000,
      },
      {
        id: 'anom-3',
        vehicleId: 'veh-03',
        vehiclePlate: 'B 9101 GHI',
        driverName: 'Budi Santoso',
        deviationPercent: 22,
        expectedLiters: 120,
        actualLiters: 146.4,
        spbuLocation: 'SPBU Pertamina Pasti Pas KM 207 Cirebon',
        timeAgo: 'Yesterday',
        estimatedCostLossIdr: 369600,
      },
    ];

    return {
      totalConsumptionLiters: 28420,
      totalCostIdr: 356400000,
      averageEfficiencyKmL: 4.8,
      efficiencyTrendPercent: 3.5,
      anomalyCount: 3,
      trendChart,
      anomalies,
    };
  }

  /**
   * Get Maintenance Health & Mini Calendar
   */
  async getMaintenanceSummary(filter: DashboardFilterState): Promise<MaintenanceHealthSummary> {
    return {
      overallHealthPercent: 92,
      healthyVehicles: 142,
      dueSoon: 18,
      overdue: 4,
      inService: 7,
      breakdown: 2,
      healthBreakdown: {
        engine: 94,
        battery: 98,
        gpsDevice: 99,
        tires: 88,
        service: 90,
      },
      upcomingCalendarEvents: [
        {
          id: 'wo-101',
          vehiclePlate: 'B 9821 UTX',
          type: 'Servis Berkala 10.000 KM',
          dueDate: '15 Agt 2026',
          priority: 'medium',
          workshopName: 'Bengkel Resmi Hino Cikarang',
        },
        {
          id: 'wo-102',
          vehiclePlate: 'B 9123 CKR',
          type: 'Uji KIR Dishub (Expired)',
          dueDate: '18 Agt 2026',
          priority: 'urgent',
          workshopName: 'Gedung Pengujian KIR Dishub Bekasi',
        },
        {
          id: 'wo-103',
          vehiclePlate: 'B 9555 SBY',
          type: 'Penggantian Ban Depan',
          dueDate: '20 Agt 2026',
          priority: 'high',
          workshopName: 'Toko Ban Bridgestone Surabaya',
        },
      ],
    };
  }

  /**
   * Get Trip & Operational Performance
   */
  async getTripSummary(filter: DashboardFilterState): Promise<TripSummary> {
    return {
      scheduled: 184,
      inProgress: 32,
      completed: 121,
      delayed: 18,
      cancelled: 3,
      onTimePerformancePercent: 91.4,
      distanceTodayKm: 48294,
      fleetUtilizationPercent: 78.6,
      vehicleUtilizationPercent: 82.1,
    };
  }

  /**
   * Get AI Fleet Insights
   */
  async getAIInsights(filter: DashboardFilterState): Promise<DashboardAIInsight[]> {
    return [
      {
        id: 'ai-ins-1',
        title: 'Anomali Konsumsi BBM Fleet Trans-Jawa',
        priority: 'HIGH',
        category: 'fuel',
        finding: 'Konsumsi BBM Fleet A meningkat 12% dibandingkan rata-rata 30 hari terakhir.',
        evidence: 'Data telemetri menunjukkan 3 unit mengalami peningkatan fuel burn rate saat idle di SPBU KM 57.',
        potentialImpactText: 'Estimasi potensi pemborosan biaya BBM sebesar Rp 2.800.000 / bulan.',
        recommendation: 'Inspeksi sistem injeksi bahan bakar unit B 1234 ABC dan berikan edukasi eco-driving ke pengemudi.',
        confidencePercent: 89,
        actionLabel: 'Investigasi Kendaraan',
        actionRoute: '/app/fuel',
      },
      {
        id: 'ai-ins-2',
        title: 'Durasi Idle Berlebihan Saat Mesin Menyala',
        priority: 'MEDIUM',
        category: 'fleet',
        finding: '7 kendaraan menunjukkan pola idle lebih dari 45 menit per trip.',
        evidence: 'Sensor GPS mencatat durasi mesin hidup tanpa pergerakan (speed = 0) saat menunggu bongkar muat.',
        potentialImpactText: 'Pemborosan 140 Liter BBM B35 per minggu.',
        recommendation: 'Aktifkan aturan otomatis geofence auto-engine shutdown warning setelah 15 menit idle.',
        confidencePercent: 94,
        actionLabel: 'Atur Batas Idle',
        actionRoute: '/app/settings',
      },
      {
        id: 'ai-ins-3',
        title: 'Lonjakan Frekuensi Pengereman Mendadak',
        priority: 'MEDIUM',
        category: 'driver',
        finding: '3 driver mengalami peningkatan frekuensi harsh braking > 5 kali per 100 KM.',
        evidence: 'G-sensor accelerometer pada GPS Teltonika FMB920 mendeteksi deselerasi tajam > 0.4g.',
        potentialImpactText: 'Risiko kecelakaan meningkat 3.2x dan mempercepat aus kampas rem sebesar 25%.',
        recommendation: 'Jadwalkan sesi coaching pengemudi keselamatan (defensive driving).',
        confidencePercent: 91,
        actionLabel: 'Review Driver Safety',
        actionRoute: '/app/drivers',
      },
      {
        id: 'ai-ins-4',
        title: 'Lonjakan Workload Maintenance Minggu Depan',
        priority: 'OPPORTUNITY',
        category: 'maintenance',
        finding: 'Workload perawatan berkala diperkirakan meningkat 40% pada minggu depan.',
        evidence: 'Predictive algorithm mendeteksi 14 unit kendaraan mendekati threshold 10.000 KM bersamaan.',
        potentialImpactText: 'Risiko bottleneck antrean bengkel dan downtime kendaraan tak terencana.',
        recommendation: 'Lakukan staggered booking servis di bengkel mitra mulai hari ini.',
        confidencePercent: 88,
        actionLabel: 'Jadwalkan Maintenance',
        actionRoute: '/app/maintenance',
      },
    ];
  }
}

export const dashboardService = new DashboardService();
