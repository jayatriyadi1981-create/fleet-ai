/**
 * Fleet Intelligence Smart AI - Executive Data Aggregator
 * PROMPT 52 — Aggregates multi-source fleet operational and cost data for Executive Intelligence
 */

import { mockVehicles, mockDrivers, mockTrips, mockMaintenanceOrders, mockBranches, mockTenant } from '../../constants/mockData';
import { ExecutiveKPIs, HighCostVehicle, HighCostRoute, ExecutiveBranchComparison, ExecutiveDepartmentComparison, EvidenceItem } from '../../types/executiveReport';

export interface RawExecutivePeriodData {
  tenantId: string;
  companyName: string;
  periodLabel: string;
  periodStart: string;
  periodEnd: string;
  vehiclesCount: number;
  activeVehiclesCount: number;
  totalDistanceKm: number;
  totalTripsCount: number;
  fuelCost: number;
  fuelLiters: number;
  maintenanceCost: number;
  driverCost: number;
  overheadCost: number;
  totalOperatingCost: number;
  costPerKm: number;
  costPerTrip: number;
  fleetUtilizationPercent: number;
  vehicleAvailabilityPercent: number;
  fleetProductivityScore: number;
  downtimeHours: number;
  excessIdleHours: number;
  fleetSafetyScore: number;
  incidentCount: number;
  nearMissCount: number;
  highRiskDriversCount: number;
  fatigueAlertsCount: number;
  onTimeDeliveryPercent: number;
  totalDeliveries: number;
  failedDeliveries: number;
  delayedDeliveries: number;
  podCompletionPercent: number;
}

export class ExecutiveDataAggregator {
  /**
   * Aggregates raw fleet metrics for a specific tenant and date range
   */
  public static aggregateCurrentPeriod(tenantId: string = 'tenant-1', periodLabel: string = 'Agustus 2026'): {
    raw: RawExecutivePeriodData;
    kpis: ExecutiveKPIs;
    highCostVehicles: HighCostVehicle[];
    highCostRoutes: HighCostRoute[];
    branchComparisons: ExecutiveBranchComparison[];
    departmentComparisons: ExecutiveDepartmentComparison[];
    evidences: EvidenceItem[];
  } {
    const tenant = mockTenant.id === tenantId ? mockTenant : { ...mockTenant, id: tenantId };
    const vehicles = mockVehicles.filter(v => !v.tenantId || v.tenantId === tenantId);
    const drivers = mockDrivers.filter(d => !d.tenantId || d.tenantId === tenantId);
    const maintenance = mockMaintenanceOrders.filter(m => !m.tenantId || m.tenantId === tenantId);
    const branches = mockBranches.filter(b => !b.tenantId || b.tenantId === tenantId);

    // Operational distance & trips base calculation for full month
    const totalVehicles = vehicles.length || 24;
    const activeVehicles = vehicles.filter(v => v.status !== 'maintenance' && v.status !== 'offline').length || 21;
    const totalDistanceKm = 184500; // ~7,687 km/vehicle/month
    const totalTrips = 1420;

    // Cost Breakdown for Executive Level (Rp in Millions)
    const fuelCost = 956800000; // Rp 956.8 Juta (52%)
    const fuelLiters = 68340; // ~2.70 km/L fleet avg
    const maintenanceCost = 441600000; // Rp 441.6 Juta (24%)
    const driverCost = 276000000; // Rp 276 Juta (15%)
    const overheadCost = 165600000; // Rp 165.6 Juta (9%)
    const totalOperatingCost = fuelCost + maintenanceCost + driverCost + overheadCost; // Rp 1.84 Miliar

    const costPerKm = Math.round(totalOperatingCost / totalDistanceKm); // ~Rp 9.972/km (all-in) or ~Rp 5.185/km fuel+maint
    const costPerTrip = Math.round(totalOperatingCost / totalTrips);

    // Operational Efficiencies
    const fleetUtilizationPercent = 87.4; // 87.4%
    const vehicleAvailabilityPercent = 93.2; // 93.2%
    const fleetProductivityScore = 89; // 89/100
    const downtimeHours = 148;
    const excessIdleHours = 312;

    // Safety & Driver
    const avgSafetyScore = Math.round(drivers.reduce((acc, d) => acc + (d.score?.safetyScore || 88), 0) / (drivers.length || 1));
    const fleetSafetyScore = avgSafetyScore || 92;
    const incidentCount = 2;
    const nearMissCount = 7;
    const highRiskDriversCount = drivers.filter(d => (d.score?.safetyScore || 90) < 80).length || 3;
    const fatigueAlertsCount = 14;

    // Delivery & SLA
    const totalDeliveries = 1380;
    const delayedDeliveries = 52;
    const failedDeliveries = 8;
    const onTimeDeliveryPercent = Math.round(((totalDeliveries - delayedDeliveries - failedDeliveries) / totalDeliveries) * 1000) / 10; // ~95.6%
    const podCompletionPercent = 98.2;

    const raw: RawExecutivePeriodData = {
      tenantId,
      companyName: tenant.name || 'PT Trans Logistik Nusantara',
      periodLabel,
      periodStart: '2026-08-01',
      periodEnd: '2026-08-31',
      vehiclesCount: totalVehicles,
      activeVehiclesCount: activeVehicles,
      totalDistanceKm,
      totalTripsCount: totalTrips,
      fuelCost,
      fuelLiters,
      maintenanceCost,
      driverCost,
      overheadCost,
      totalOperatingCost,
      costPerKm,
      costPerTrip,
      fleetUtilizationPercent,
      vehicleAvailabilityPercent,
      fleetProductivityScore,
      downtimeHours,
      excessIdleHours,
      fleetSafetyScore,
      incidentCount,
      nearMissCount,
      highRiskDriversCount,
      fatigueAlertsCount,
      onTimeDeliveryPercent,
      totalDeliveries,
      failedDeliveries,
      delayedDeliveries,
      podCompletionPercent,
    };

    const kpis: ExecutiveKPIs = {
      totalOperatingCost,
      fuelCost,
      maintenanceCost,
      driverCost,
      operationalOverheadCost: overheadCost,
      costPerKm,
      costPerTrip,
      revenue: null, // As mandated: Do not invent revenue if external billing not configured
      revenuePerKm: null,
      profitabilityMargin: null,
      budgetAmount: 1750000000, // Budget Rp 1.75 Miliar
      budgetVariancePercent: 5.14, // +5.14% over budget
      budgetStatus: 'OVER_BUDGET',

      fleetUtilizationPercent,
      vehicleAvailabilityPercent,
      fleetProductivityScore,
      totalDistanceKm,
      totalTripsCompleted: totalTrips,
      activeVehiclesCount: activeVehicles,
      totalFleetCount: totalVehicles,
      totalDowntimeHours: downtimeHours,
      totalExcessIdleHours: excessIdleHours,

      fleetSafetyScore,
      incidentCount,
      accidentCount: 0,
      nearMissCount,
      highRiskDriversCount,
      fatigueAlertsCount,

      onTimeDeliveryRatePercent: onTimeDeliveryPercent,
      totalDeliveries,
      failedDeliveries,
      delayedDeliveries,
      podCompletionRatePercent: podCompletionPercent,
      customerSlaBreachCount: null, // As mandated: Not configured by default
    };

    // Evidences for AI Anti-Hallucination & Drill-down
    const evidences: EvidenceItem[] = [
      {
        id: 'EVD-FUEL-001',
        domain: 'fuel',
        title: 'Lonjakan Konsumsi Solar 12 Kendaraan Heavy Duty',
        description: 'Peningkatan konsumsi rata-rata dari 2.95 km/L menjadi 2.52 km/L pada armada koridor Trans-Jawa & Pantura akibat idling berlebih dan muatan puncak.',
        sourceModule: 'AI Fuel Intelligence (PROMPT 30)',
        vehiclePlate: 'B 9281 UTX',
        dataPoints: { totalVarianceLiters: 4820, excessCost: 48200000, avgKmPerL: 2.52, benchmarkKmPerL: 2.95 },
        timestamp: '2026-08-31T18:00:00Z',
      },
      {
        id: 'EVD-MAINT-002',
        domain: 'maintenance',
        title: 'Biaya Perbaikan Tak Terencana (Unscheduled Overhaul)',
        description: 'Penggantian injector common-rail dan transmisi kopling pada 3 unit Hino Ranger 500 dengan mileage di atas 280.000 km.',
        sourceModule: 'AI Predictive Maintenance (PROMPT 31)',
        vehiclePlate: 'B 9412 UTY',
        dataPoints: { workOrdersCount: 5, totalCostRp: 78500000, downtimeHours: 64 },
        timestamp: '2026-08-28T14:30:00Z',
      },
      {
        id: 'EVD-ROUTE-003',
        domain: 'logistics',
        title: 'Kemacetan Kronis & Deviasi Rute Cikarang - Tanjung Priok',
        description: 'Rata-rata keterlambatan 48 menit per trip dengan konsumsi idle engine mencapai 38 jam per bulan.',
        sourceModule: 'AI Route & ETA Intelligence (PROMPT 19)',
        routeName: 'Cikarang Dry Port - Tanjung Priok',
        dataPoints: { tripCount: 218, avgDelayMinutes: 48, idleFuelLiters: 1140 },
        timestamp: '2026-08-30T09:15:00Z',
      },
      {
        id: 'EVD-SAFETY-004',
        domain: 'safety',
        title: 'Klaster Overspeed Malam Hari di Tol Cipali KM 110-140',
        description: 'Terdeteksi 42 kejadian overspeed (>90 km/h) antara pukul 23:00 - 04:00 yang berkorelasi dengan pemborosan BBM 8%.',
        sourceModule: 'AI Safety & Driver Intelligence (PROMPT 33)',
        driverName: 'Rudi Hermawan & 4 Driver',
        dataPoints: { overspeedEvents: 42, avgSpeedKmh: 94.2, speedLimitKmh: 80 },
        timestamp: '2026-08-29T03:45:00Z',
      },
    ];

    // High Cost Vehicles List
    const highCostVehicles: HighCostVehicle[] = [
      {
        vehicleId: 'VH-001',
        plateNumber: 'B 9281 UTX',
        brandModel: 'Hino Ranger FL 235',
        groupName: 'Armada Trans-Jawa',
        branchName: 'Cabang Jakarta',
        totalCost: 114800000,
        mileageKm: 9850,
        costPerKm: 11654,
        fleetAvgCostPerKm: 9972,
        fuelCost: 68400000,
        maintenanceCost: 32000000,
        utilizationPercent: 94.2,
        aiExplanation: 'Tingginya mileage jarak jauh dipadukan dengan konsumsi BBM 2.45 km/L (di bawah standar 2.9 km/L) dan servis suspensi besar.',
        evidenceIds: ['EVD-FUEL-001', 'EVD-MAINT-002'],
      },
      {
        vehicleId: 'VH-004',
        plateNumber: 'B 9412 UTY',
        brandModel: 'Isuzu Giga FVR 34P',
        groupName: 'Armada Trans-Jawa',
        branchName: 'Cabang Jakarta',
        totalCost: 108200000,
        mileageKm: 9200,
        costPerKm: 11760,
        fleetAvgCostPerKm: 9972,
        fuelCost: 64200000,
        maintenanceCost: 31500000,
        utilizationPercent: 91.0,
        aiExplanation: 'Pergantian injector common rail dan ban vulkanisir menyebabkan spike biaya maintenance sebesar Rp 31,5 Juta.',
        evidenceIds: ['EVD-MAINT-002'],
      },
      {
        vehicleId: 'VH-007',
        plateNumber: 'B 9655 UTZ',
        brandModel: 'Mitsubishi Fuso Fighter',
        groupName: 'Armada Jabodetabek',
        branchName: 'Cabang Jakarta',
        totalCost: 96400000,
        mileageKm: 7400,
        costPerKm: 13027,
        fleetAvgCostPerKm: 9972,
        fuelCost: 58900000,
        maintenanceCost: 24500000,
        utilizationPercent: 88.5,
        aiExplanation: 'Cost/km tertinggi di armada perkotaan akibat rasio idle time mesin AC mencapai 28% dari total operating hours.',
        evidenceIds: ['EVD-FUEL-001', 'EVD-ROUTE-003'],
      },
      {
        vehicleId: 'VH-012',
        plateNumber: 'L 8102 UXA',
        brandModel: 'Hino Dutro 130 HD',
        groupName: 'Armada Distribusi Jatim',
        branchName: 'Cabang Surabaya',
        totalCost: 89300000,
        mileageKm: 8100,
        costPerKm: 11024,
        fleetAvgCostPerKm: 9972,
        fuelCost: 52400000,
        maintenanceCost: 22900000,
        utilizationPercent: 86.0,
        aiExplanation: 'Rute multi-drop pegunungan Malang-Pasuruan meningkatkan keausan kampas rem dan konsumsi solar.',
        evidenceIds: ['EVD-FUEL-001'],
      },
      {
        vehicleId: 'VH-015',
        plateNumber: 'L 8443 UXB',
        brandModel: 'Isuzu Elf NMR 71',
        groupName: 'Armada Distribusi Jatim',
        branchName: 'Cabang Surabaya',
        totalCost: 82100000,
        mileageKm: 7650,
        costPerKm: 10732,
        fleetAvgCostPerKm: 9972,
        fuelCost: 49100000,
        maintenanceCost: 19800000,
        utilizationPercent: 85.4,
        aiExplanation: 'Downtime perbaikan alternator 3 hari dan konsumsi BBM 5% di atas target rute Surabaya-Gresik.',
        evidenceIds: ['EVD-MAINT-002'],
      },
    ];

    // High Cost Routes
    const highCostRoutes: HighCostRoute[] = [
      {
        routeId: 'RT-001',
        routeName: 'Jakarta - Surabaya (Via Pantura & Tol Trans-Jawa)',
        distanceKm: 785,
        tripCount: 84,
        fuelLiters: 23550,
        totalCost: 342000000,
        costPerKm: 5186,
        delayMinutes: 35,
        onTimePercent: 94.0,
        aiInsight: 'Koridor utama logistik dengan efisiensi tinggi, namun terjadi pembengkakan biaya tol dan rest-area idling.',
        evidenceIds: ['EVD-FUEL-001', 'EVD-SAFETY-004'],
      },
      {
        routeId: 'RT-002',
        routeName: 'Cikarang Dry Port - Pelabuhan Tanjung Priok',
        distanceKm: 58,
        tripCount: 218,
        fuelLiters: 7420,
        totalCost: 118400000,
        costPerKm: 9364,
        delayMinutes: 48,
        onTimePercent: 87.6,
        aiInsight: 'Cost/km tertinggi akibat kemacetan parah di gerbang tol Semper & Cilincing dengan idle engine berjam-jam.',
        evidenceIds: ['EVD-ROUTE-003'],
      },
      {
        routeId: 'RT-003',
        routeName: 'Semarang - Solo - Yogyakarta (Kargo Segmen Tengah)',
        distanceKm: 135,
        tripCount: 112,
        fuelLiters: 5890,
        totalCost: 92100000,
        costPerKm: 6091,
        delayMinutes: 22,
        onTimePercent: 96.4,
        aiInsight: 'Performa rute stabil dengan tingkat ketepatan waktu baik, deviasi konsumsi solar terkendali.',
        evidenceIds: ['EVD-FUEL-001'],
      },
    ];

    // Branch Comparisons
    const branchComparisons: ExecutiveBranchComparison[] = [
      {
        branchId: 'BR-01',
        branchName: 'Cabang Jakarta (Headquarter & Main Hub)',
        totalVehicles: 14,
        totalCost: 1140800000,
        costPerKm: 10450,
        utilizationPercent: 89.2,
        safetyScore: 91,
        fuelEfficiencyKmPerL: 2.65,
        maintenanceCost: 284000000,
        productivityScore: 92,
        varianceVsCompanyAvgPercent: 4.8,
        status: 'attention_needed',
      },
      {
        branchId: 'BR-02',
        branchName: 'Cabang Surabaya (East Hub)',
        totalVehicles: 7,
        totalCost: 515200000,
        costPerKm: 9320,
        utilizationPercent: 86.5,
        safetyScore: 94,
        fuelEfficiencyKmPerL: 2.82,
        maintenanceCost: 118000000,
        productivityScore: 88,
        varianceVsCompanyAvgPercent: -6.5,
        status: 'optimal',
      },
      {
        branchId: 'BR-03',
        branchName: 'Cabang Semarang (Central Hub)',
        totalVehicles: 3,
        totalCost: 184000000,
        costPerKm: 9100,
        utilizationPercent: 84.0,
        safetyScore: 93,
        fuelEfficiencyKmPerL: 2.88,
        maintenanceCost: 39600000,
        productivityScore: 85,
        varianceVsCompanyAvgPercent: -8.7,
        status: 'optimal',
      },
    ];

    // Department Comparisons
    const departmentComparisons: ExecutiveDepartmentComparison[] = [
      {
        departmentName: 'Logistik & Distribusi Kargo',
        costCenterCode: 'CC-LOG-01',
        vehicleCount: 16,
        totalCost: 1288000000,
        costPerKm: 9850,
        utilizationPercent: 89.0,
        safetyScore: 91,
      },
      {
        departmentName: 'Supply Chain & Raw Materials',
        costCenterCode: 'CC-SCM-02',
        vehicleCount: 6,
        totalCost: 441600000,
        costPerKm: 10240,
        utilizationPercent: 85.5,
        safetyScore: 93,
      },
      {
        departmentName: 'Operational Support & Utility',
        costCenterCode: 'CC-OPS-03',
        vehicleCount: 2,
        totalCost: 110400000,
        costPerKm: 11100,
        utilizationPercent: 78.0,
        safetyScore: 96,
      },
    ];

    return {
      raw,
      kpis,
      highCostVehicles,
      highCostRoutes,
      branchComparisons,
      departmentComparisons,
      evidences,
    };
  }

  /**
   * Generates historical baseline period data (e.g. Juli 2026 for comparison)
   */
  public static aggregatePreviousPeriod(tenantId: string = 'tenant-1'): ExecutiveKPIs {
    const totalDistanceKm = 173800; // Previous distance
    const fuelCost = 882600000; // Rp 882.6 Juta
    const maintenanceCost = 397100000; // Rp 397.1 Juta
    const driverCost = 265000000; // Rp 265 Juta
    const overheadCost = 152500000; // Rp 152.5 Juta
    const totalOperatingCost = fuelCost + maintenanceCost + driverCost + overheadCost; // Rp 1.697 Miliar (+8.4% growth to current)

    return {
      totalOperatingCost,
      fuelCost,
      maintenanceCost,
      driverCost,
      operationalOverheadCost: overheadCost,
      costPerKm: Math.round(totalOperatingCost / totalDistanceKm), // ~Rp 9.764/km
      costPerTrip: Math.round(totalOperatingCost / 1340),
      revenue: null,
      revenuePerKm: null,
      profitabilityMargin: null,
      budgetAmount: 1700000000,
      budgetVariancePercent: -0.17,
      budgetStatus: 'ON_BUDGET',

      fleetUtilizationPercent: 82.3, // Current is 87.4% (+6.2% change)
      vehicleAvailabilityPercent: 95.1,
      fleetProductivityScore: 84,
      totalDistanceKm,
      totalTripsCompleted: 1340,
      activeVehiclesCount: 22,
      totalFleetCount: 24,
      totalDowntimeHours: 112,
      totalExcessIdleHours: 268,

      fleetSafetyScore: 88,
      incidentCount: 3,
      accidentCount: 0,
      nearMissCount: 9,
      highRiskDriversCount: 4,
      fatigueAlertsCount: 18,

      onTimeDeliveryRatePercent: 97.2,
      totalDeliveries: 1310,
      failedDeliveries: 5,
      delayedDeliveries: 31,
      podCompletionRatePercent: 98.8,
      customerSlaBreachCount: null,
    };
  }

  /**
   * Generates same period last year baseline data (e.g. Agustus 2025)
   */
  public static aggregateSamePeriodLastYear(tenantId: string = 'tenant-1'): ExecutiveKPIs {
    const totalDistanceKm = 152000;
    const fuelCost = 745000000;
    const maintenanceCost = 312000000;
    const driverCost = 230000000;
    const overheadCost = 135000000;
    const totalOperatingCost = fuelCost + maintenanceCost + driverCost + overheadCost; // Rp 1.422 Miliar

    return {
      totalOperatingCost,
      fuelCost,
      maintenanceCost,
      driverCost,
      operationalOverheadCost: overheadCost,
      costPerKm: Math.round(totalOperatingCost / totalDistanceKm), // ~Rp 9.355/km
      costPerTrip: Math.round(totalOperatingCost / 1150),
      revenue: null,
      revenuePerKm: null,
      profitabilityMargin: null,
      budgetAmount: 1450000000,
      budgetVariancePercent: -1.93,
      budgetStatus: 'UNDER_BUDGET',

      fleetUtilizationPercent: 79.5,
      vehicleAvailabilityPercent: 96.0,
      fleetProductivityScore: 80,
      totalDistanceKm,
      totalTripsCompleted: 1150,
      activeVehiclesCount: 19,
      totalFleetCount: 20,
      totalDowntimeHours: 95,
      totalExcessIdleHours: 220,

      fleetSafetyScore: 85,
      incidentCount: 5,
      accidentCount: 1,
      nearMissCount: 14,
      highRiskDriversCount: 6,
      fatigueAlertsCount: 24,

      onTimeDeliveryRatePercent: 94.1,
      totalDeliveries: 1120,
      failedDeliveries: 12,
      delayedDeliveries: 54,
      podCompletionRatePercent: 96.5,
      customerSlaBreachCount: null,
    };
  }
}
