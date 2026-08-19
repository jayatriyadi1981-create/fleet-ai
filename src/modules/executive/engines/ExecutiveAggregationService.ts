/**
 * Fleet Intelligence Smart AI - Executive Aggregation Service
 * Consolidates multi-domain operational telematics, financial cost records, maintenance health,
 * safety telemetry, and branch metrics into executive decision-grade indicators.
 */

import { Vehicle, Driver, Trip, Branch, MaintenanceWorkOrder, AlertNotification } from '../../../types';
import { mockCostRecords, mockCostBudgetVariances } from '../../cost/data/mockCostData';
import {
  ExecutivePeriod,
  FleetEfficiencyMetrics,
  ExecutiveCostMetrics,
  ExecutiveProductivityMetrics,
  ExecutiveSafetyMetrics,
  ExecutiveFuelMetrics,
  ExecutiveMaintenanceMetrics,
  BranchExecutivePerformance,
  HighRiskVehicleItem,
  TopVehicleCostItem,
  TopDriverRiskItem,
  TopEfficientVehicleItem,
  TopProductiveVehicleItem,
  ExecutiveKpiCardData,
  SafetyCriticalAlertItem,
  FuelAnomalyItem,
} from '../types';

export class ExecutiveAggregationService {
  /**
   * Helper to format Indonesian Rupiah
   */
  public static formatIdr(amount: number): string {
    return 'Rp ' + Math.round(amount).toLocaleString('id-ID');
  }

  /**
   * Aggregate Fleet Efficiency & Health Metrics
   */
  public static aggregateEfficiency(
    vehicles: Vehicle[],
    trips: Trip[],
    selectedBranchId?: string,
    period: ExecutivePeriod = 'THIS_MONTH'
  ): FleetEfficiencyMetrics {
    const filteredVehicles = selectedBranchId && selectedBranchId !== 'all'
      ? vehicles.filter((v) => v.branchId === selectedBranchId)
      : vehicles;

    const total = filteredVehicles.length || 1;
    const movingCount = filteredVehicles.filter((v) => v.status === 'moving').length;
    const idleCount = filteredVehicles.filter((v) => v.status === 'idle').length;
    const stoppedCount = filteredVehicles.filter((v) => v.status === 'parking' || v.status === 'offline').length;
    const maintenanceCount = filteredVehicles.filter((v) => v.status === 'maintenance' || v.status === 'under_maintenance').length;

    const activeCount = movingCount + idleCount;
    const vehicleActivePct = Math.round((activeCount / total) * 1000) / 10;
    const idlePct = Math.round((idleCount / total) * 1000) / 10;
    const downtimePct = Math.round(((maintenanceCount + (stoppedCount * 0.2)) / total) * 1000) / 10;

    const fleetUtilizationRate = Math.min(98, Math.max(45, Math.round(((movingCount * 1.0 + idleCount * 0.3) / total) * 1000) / 10 + 12));
    const vehicleAvailabilityRate = Math.round(((total - maintenanceCount) / total) * 1000) / 10;

    // Mileage & Trips calculation
    const totalMileageKm = filteredVehicles.reduce((sum, v) => sum + (v.odometerKm ? v.odometerKm % 4500 + 1200 : 2800), 0);
    const totalTrips = Math.round(filteredVehicles.length * 18.5);

    // Health categorization
    let healthy = 0;
    let attention = 0;
    let warning = 0;
    let critical = 0;

    filteredVehicles.forEach((v) => {
      const fuelLevel = v.latestTelemetry?.fuelLevelPercent ?? 80;
      const speed = v.latestTelemetry?.location?.speed ?? 0;
      const isMaint = v.status === 'maintenance' || v.status === 'under_maintenance';

      if (isMaint || fuelLevel < 15) {
        critical++;
      } else if (fuelLevel < 30 || speed > 85) {
        warning++;
      } else if (v.status === 'idle' || fuelLevel < 45) {
        attention++;
      } else {
        healthy++;
      }
    });

    const efficiencyScore = Math.min(100, Math.max(50, Math.round((fleetUtilizationRate * 0.5 + vehicleAvailabilityRate * 0.4 - (idlePct * 0.2)) * 10) / 10));
    const prevEfficiencyScore = Math.max(50, Math.round((efficiencyScore - 2.8) * 10) / 10);

    return {
      fleetUtilizationRate,
      vehicleAvailabilityRate,
      vehicleActivePct,
      idlePct,
      downtimePct,
      totalMileageKm,
      totalTrips,
      efficiencyScore,
      prevEfficiencyScore,
      healthCounts: {
        healthy,
        attention,
        warning,
        critical,
        total,
      },
    };
  }

  /**
   * Aggregate Operating Cost Metrics (TOC/TCO)
   */
  public static aggregateCost(
    vehicles: Vehicle[],
    selectedBranchId?: string,
    period: ExecutivePeriod = 'THIS_MONTH'
  ): ExecutiveCostMetrics {
    const records = mockCostRecords;
    const budgets = mockCostBudgetVariances;

    const filteredRecords = selectedBranchId && selectedBranchId !== 'all'
      ? records.filter((r) => !r.branchId || r.branchId === selectedBranchId)
      : records;

    const totalOperatingCost = filteredRecords.reduce((sum, r) => sum + r.amount, 0) || 482500000;
    const prevTotalCost = Math.round(totalOperatingCost * 1.042); // 4.2% higher in previous period

    const totalMileageKm = vehicles.length * 3420 || 85000;
    const costPerKm = Math.round(totalOperatingCost / (totalMileageKm || 1));
    const totalTrips = vehicles.length * 19 || 475;
    const costPerTrip = Math.round(totalOperatingCost / (totalTrips || 1));
    const costPerVehicle = Math.round(totalOperatingCost / (vehicles.length || 1));

    // Category breakdown
    const costBreakdown = {
      fuel: 0,
      maintenance: 0,
      driver: 0,
      toll: 0,
      insurance: 0,
      tax: 0,
      gps: 0,
      other: 0,
    };

    filteredRecords.forEach((r) => {
      if (r.category === 'FUEL') costBreakdown.fuel += r.amount;
      else if (r.category === 'MAINTENANCE' || r.category === 'PARTS' || r.category === 'TYRES') costBreakdown.maintenance += r.amount;
      else if (r.category === 'DRIVER') costBreakdown.driver += r.amount;
      else if (r.category === 'TOLL' || r.category === 'PARKING') costBreakdown.toll += r.amount;
      else if (r.category === 'INSURANCE') costBreakdown.insurance += r.amount;
      else if (r.category === 'TAX') costBreakdown.tax += r.amount;
      else if (r.category === 'GPS_DEVICE' || r.category === 'TELEMATICS') costBreakdown.gps += r.amount;
      else costBreakdown.other += r.amount;
    });

    if (costBreakdown.fuel === 0) costBreakdown.fuel = Math.round(totalOperatingCost * 0.42);
    if (costBreakdown.maintenance === 0) costBreakdown.maintenance = Math.round(totalOperatingCost * 0.22);
    if (costBreakdown.driver === 0) costBreakdown.driver = Math.round(totalOperatingCost * 0.18);
    if (costBreakdown.toll === 0) costBreakdown.toll = Math.round(totalOperatingCost * 0.08);
    if (costBreakdown.insurance === 0) costBreakdown.insurance = Math.round(totalOperatingCost * 0.04);
    if (costBreakdown.tax === 0) costBreakdown.tax = Math.round(totalOperatingCost * 0.03);
    if (costBreakdown.gps === 0) costBreakdown.gps = Math.round(totalOperatingCost * 0.02);
    if (costBreakdown.other === 0) costBreakdown.other = Math.round(totalOperatingCost * 0.01);

    const budgetTotal = budgets.reduce((sum, b) => sum + b.budgetIdr, 0) || 520000000;
    const budgetVariancePct = Math.round(((totalOperatingCost - budgetTotal) / budgetTotal) * 1000) / 10;

    const costAlerts = [
      'Biaya Bahan Bakar (BBM) naik 8.4% di koridor Tol Trans Jawa akibat kemacetan.',
      'Biaya Servis Tak Terduga (Corrective WO) naik 12.1% pada unit golongan berat > 5 tahun.',
      '6 kendaraan beroperasi dengan Cost/KM di atas Rp 4.200 (rata-rata armada: Rp 3.140/KM).',
    ];

    const trendData = [
      { label: 'Jan', current: 440000000, previous: 460000000, budget: 480000000 },
      { label: 'Feb', current: 455000000, previous: 445000000, budget: 480000000 },
      { label: 'Mar', current: 472000000, previous: 465000000, budget: 490000000 },
      { label: 'Apr', current: 468000000, previous: 478000000, budget: 500000000 },
      { label: 'Mei', current: 490000000, previous: 485000000, budget: 510000000 },
      { label: 'Jun', current: 512000000, previous: 498000000, budget: 520000000 },
      { label: 'Jul', current: 482500000, previous: 505000000, budget: 520000000 },
    ];

    return {
      totalOperatingCost,
      costPerKm,
      costPerTrip,
      costPerVehicle,
      budgetTotal,
      budgetVariancePct,
      costBreakdown,
      costAlerts,
      trendData,
      prevTotalCost,
    };
  }

  /**
   * Aggregate Operational Productivity Metrics
   */
  public static aggregateProductivity(
    vehicles: Vehicle[],
    drivers: Driver[],
    trips: Trip[],
    period: ExecutivePeriod = 'THIS_MONTH'
  ): ExecutiveProductivityMetrics {
    const totalTrips = 485;
    const completedTrips = 462;
    const tripCompletionRate = Math.round((completedTrips / totalTrips) * 1000) / 10;
    const completedDeliveries = 1420;
    const deliveriesPerDay = 47;
    const tripsPerVehicle = Math.round((completedTrips / (vehicles.length || 1)) * 10) / 10;
    const tripsPerDriver = Math.round((completedTrips / (drivers.length || 1)) * 10) / 10;
    const totalDistanceKm = 153840;
    const utilizationHours = 4820;

    const productivityScore = Math.min(100, Math.round((tripCompletionRate * 0.6 + 36.8) * 10) / 10);

    const trendData = [
      { period: 'W1', trips: 112, deliveries: 330, distanceKm: 36200, utilizationPct: 86.4 },
      { period: 'W2', trips: 124, deliveries: 365, distanceKm: 39400, utilizationPct: 88.2 },
      { period: 'W3', trips: 118, deliveries: 348, distanceKm: 37800, utilizationPct: 87.5 },
      { period: 'W4', trips: 131, deliveries: 377, distanceKm: 40440, utilizationPct: 91.2 },
    ];

    return {
      totalTrips,
      completedTrips,
      tripCompletionRate,
      completedDeliveries,
      deliveriesPerDay,
      tripsPerVehicle,
      tripsPerDriver,
      totalDistanceKm,
      utilizationHours,
      productivityScore,
      trendDirection: 'UP',
      trendData,
    };
  }

  /**
   * Aggregate Safety & Telematics Compliance
   */
  public static aggregateSafety(
    alerts: AlertNotification[],
    drivers: Driver[],
    period: ExecutivePeriod = 'THIS_MONTH'
  ): ExecutiveSafetyMetrics {
    const safetyScore = 93.8;
    const prevSafetyScore = 91.4;

    const criticalAlerts: SafetyCriticalAlertItem[] = [
      {
        id: 'crit-001',
        vehicleId: 'v-04',
        plateNumber: 'B 9812 UYT',
        driverName: 'Eko Prasetyo',
        location: 'Tol Cipali KM 102',
        event: 'Overspeed Terus Menerus (>105 km/jam) & Jarak Aman Kritis',
        timestamp: '2026-08-17 08:14 WIB',
        severity: 'CRITICAL',
        status: 'INVESTIGATING',
        speedKmh: 108,
        speedLimitKmh: 80,
      },
      {
        id: 'crit-002',
        vehicleId: 'v-08',
        plateNumber: 'D 8912 KL',
        driverName: 'Hendra Gunawan',
        location: 'Nagreg Lingkar Luar',
        event: 'Peringatan Kelelahan Pengemudi (Fatigue Alert: Microsleep)',
        timestamp: '2026-08-16 23:42 WIB',
        severity: 'HIGH',
        status: 'RESOLVED',
      },
    ];

    const trendData = [
      { period: 'W1', accidents: 0, incidents: 1, nearMiss: 2, behaviorEvents: 14, fatigueEvents: 3 },
      { period: 'W2', accidents: 0, incidents: 0, nearMiss: 1, behaviorEvents: 11, fatigueEvents: 2 },
      { period: 'W3', accidents: 0, incidents: 1, nearMiss: 0, behaviorEvents: 8, fatigueEvents: 1 },
      { period: 'W4', accidents: 0, incidents: 0, nearMiss: 1, behaviorEvents: 6, fatigueEvents: 1 },
    ];

    return {
      safetyScore,
      prevSafetyScore,
      status: 'GOOD',
      accidentsCount: 0,
      incidentsCount: 2,
      nearMissCount: 4,
      overspeedCount: 18,
      harshBrakingCount: 24,
      harshAccelerationCount: 16,
      fatigueAlertsCount: 7,
      safetyViolationsCount: 12,
      criticalAlerts,
      trendData,
    };
  }

  /**
   * Aggregate Fuel Telematics & Theft Risk
   */
  public static aggregateFuel(
    vehicles: Vehicle[],
    period: ExecutivePeriod = 'THIS_MONTH'
  ): ExecutiveFuelMetrics {
    const totalFuelCost = 188500000;
    const totalLiters = 28134;
    const avgKmLiter = 4.12;
    const avgCostPerKm = 1225;
    const fuelEfficiencyPct = 84.6;

    const anomaliesList: FuelAnomalyItem[] = [
      {
        id: 'anom-01',
        vehicleId: 'v-03',
        plateNumber: 'B 9234 TXR',
        type: 'DRAIN',
        label: 'Penurunan Drastis Sensor BBM saat Parkir Malam (Indikasi Drain)',
        litersEstimated: 42,
        costEstimatedIdr: 281400,
        timestamp: '2026-08-16 02:15 WIB',
        status: 'INVESTIGATING',
      },
      {
        id: 'anom-02',
        vehicleId: 'v-09',
        plateNumber: 'L 9988 AB',
        type: 'ABNORMAL_CONSUMPTION',
        label: 'Konsumsi BBM 2.4 KM/L (Deviasi 38% dari baseline 3.9 KM/L)',
        litersEstimated: 75,
        costEstimatedIdr: 502500,
        timestamp: '2026-08-15 16:30 WIB',
        status: 'UNRESOLVED',
      },
    ];

    const trendData = [
      { period: 'W1', liters: 7200, costIdr: 48240000, kmPerLiter: 3.98 },
      { period: 'W2', liters: 6950, costIdr: 46565000, kmPerLiter: 4.10 },
      { period: 'W3', liters: 7080, costIdr: 47436000, kmPerLiter: 4.15 },
      { period: 'W4', liters: 6904, costIdr: 46259000, kmPerLiter: 4.24 },
    ];

    return {
      totalFuelCost,
      totalLiters,
      avgKmLiter,
      avgCostPerKm,
      fuelEfficiencyPct,
      fuelAnomaliesCount: 4,
      theftRiskCount: 1,
      anomaliesList,
      trendData,
    };
  }

  /**
   * Aggregate Maintenance Health & Workshop Costs
   */
  public static aggregateMaintenance(
    vehicles: Vehicle[],
    workOrders: MaintenanceWorkOrder[],
    period: ExecutivePeriod = 'THIS_MONTH'
  ): ExecutiveMaintenanceMetrics {
    const totalMaintenanceCost = 84200000;
    const vehiclesDueSoonCount = 7;
    const vehiclesOverdueCount = 2;
    const criticalVehiclesCount = 2;
    const breakdownsCount = 1;
    const downtimeHours = 56;

    const costBreakdown = {
      preventive: 54730000,
      corrective: 22470000,
      emergency: 7000000,
    };

    const healthCounts = {
      healthy: Math.max(0, vehicles.length - 11),
      dueSoon: 7,
      overdue: 2,
      critical: 2,
    };

    const trendData = [
      { period: 'W1', preventive: 14200000, corrective: 4800000, emergency: 0 },
      { period: 'W2', preventive: 12500000, corrective: 6200000, emergency: 3500000 },
      { period: 'W3', preventive: 15100000, corrective: 5100000, emergency: 0 },
      { period: 'W4', preventive: 12930000, corrective: 6370000, emergency: 3500000 },
    ];

    return {
      totalMaintenanceCost,
      vehiclesDueSoonCount,
      vehiclesOverdueCount,
      criticalVehiclesCount,
      breakdownsCount,
      downtimeHours,
      costBreakdown,
      healthCounts,
      trendData,
    };
  }

  /**
   * Aggregate Branch Executive Performance Comparison Table
   */
  public static aggregateBranches(branches: Branch[], vehicles: Vehicle[]): BranchExecutivePerformance[] {
    const defaultBranches = branches.length > 0 ? branches : [
      { id: 'br-01', name: 'Cabang Jakarta (Utama)', code: 'JKT', city: 'Jakarta' } as Branch,
      { id: 'br-02', name: 'Cabang Surabaya (Depo Timur)', code: 'SBY', city: 'Surabaya' } as Branch,
      { id: 'br-03', name: 'Cabang Bandung (Jawa Barat)', code: 'BDG', city: 'Bandung' } as Branch,
      { id: 'br-04', name: 'Cabang Semarang (Jawa Tengah)', code: 'SMG', city: 'Semarang' } as Branch,
      { id: 'br-05', name: 'Cabang Medan (Sumatera Utara)', code: 'MDN', city: 'Medan' } as Branch,
    ];

    const branchPerformances: BranchExecutivePerformance[] = [
      {
        branchId: defaultBranches[0]?.id || 'br-01',
        branchName: defaultBranches[0]?.name || 'Cabang Jakarta (Utama)',
        fleetCount: 22,
        utilizationPct: 91.4,
        costPerKmIdr: 2980,
        productivityScore: 94.2,
        safetyScore: 96.0,
        fuelEfficiencyKmL: 4.35,
        maintenanceHealthPct: 92.0,
        overallScore: 93.5,
        rank: 1,
      },
      {
        branchId: defaultBranches[1]?.id || 'br-02',
        branchName: defaultBranches[1]?.name || 'Cabang Surabaya (Depo Timur)',
        fleetCount: 16,
        utilizationPct: 88.5,
        costPerKmIdr: 3120,
        productivityScore: 90.8,
        safetyScore: 93.4,
        fuelEfficiencyKmL: 4.18,
        maintenanceHealthPct: 89.5,
        overallScore: 90.2,
        rank: 2,
      },
      {
        branchId: defaultBranches[2]?.id || 'br-03',
        branchName: defaultBranches[2]?.name || 'Cabang Bandung (Jawa Barat)',
        fleetCount: 12,
        utilizationPct: 85.0,
        costPerKmIdr: 3340,
        productivityScore: 88.0,
        safetyScore: 92.5,
        fuelEfficiencyKmL: 3.95,
        maintenanceHealthPct: 86.0,
        overallScore: 87.4,
        rank: 3,
      },
      {
        branchId: defaultBranches[3]?.id || 'br-04',
        branchName: defaultBranches[3]?.name || 'Cabang Semarang (Jawa Tengah)',
        fleetCount: 10,
        utilizationPct: 83.2,
        costPerKmIdr: 3450,
        productivityScore: 86.4,
        safetyScore: 91.0,
        fuelEfficiencyKmL: 3.88,
        maintenanceHealthPct: 84.0,
        overallScore: 85.6,
        rank: 4,
      },
      {
        branchId: defaultBranches[4]?.id || 'br-05',
        branchName: defaultBranches[4]?.name || 'Cabang Medan (Sumatera Utara)',
        fleetCount: 8,
        utilizationPct: 78.4,
        costPerKmIdr: 3820,
        productivityScore: 81.5,
        safetyScore: 88.2,
        fuelEfficiencyKmL: 3.65,
        maintenanceHealthPct: 79.0,
        overallScore: 80.8,
        rank: 5,
      },
    ];

    return branchPerformances;
  }

  /**
   * Aggregate High-Risk Vehicles and Executive Top 10 lists
   */
  public static aggregateRankings(vehicles: Vehicle[], drivers: Driver[]): {
    highRiskVehicles: HighRiskVehicleItem[];
    topCostVehicles: TopVehicleCostItem[];
    topRiskDrivers: TopDriverRiskItem[];
    topEfficientVehicles: TopEfficientVehicleItem[];
    topProductiveVehicles: TopProductiveVehicleItem[];
  } {
    const highRiskVehicles: HighRiskVehicleItem[] = [
      {
        vehicleId: 'v-03',
        plateNumber: 'B 9234 TXR',
        model: 'Hino 500 FL260JW (Wingbox)',
        branchName: 'Cabang Jakarta',
        compositeRiskScore: 88,
        maintenanceRisk: 92,
        costPerKm: 4680,
        downtimeHours: 36,
        fuelAnomalyCount: 3,
        safetyRiskScore: 68,
        priority: 'CRITICAL',
        reason: 'Overdue service rem + Konsumsi boros 2.8 KM/L + 3 anomali sensor BBM',
        recommendedAction: 'Jadwalkan overhaul berkala & audit tangki bahan bakar segera',
      },
      {
        vehicleId: 'v-09',
        plateNumber: 'L 9988 AB',
        model: 'Mitsubishi Fuso Fighter FN62F',
        branchName: 'Cabang Surabaya',
        compositeRiskScore: 82,
        maintenanceRisk: 85,
        costPerKm: 4320,
        downtimeHours: 24,
        fuelAnomalyCount: 2,
        safetyRiskScore: 74,
        priority: 'HIGH',
        reason: 'Biaya corrective maintenance melonjak 45% dalam 60 hari terakhir',
        recommendedAction: 'Evaluasi kelayakan unit & pertimbangkan peremajaan (Fleet Replacement)',
      },
      {
        vehicleId: 'v-07',
        plateNumber: 'D 8812 KL',
        model: 'Isuzu Giga FVM 240',
        branchName: 'Cabang Bandung',
        compositeRiskScore: 78,
        maintenanceRisk: 76,
        costPerKm: 4100,
        downtimeHours: 18,
        fuelAnomalyCount: 1,
        safetyRiskScore: 82,
        priority: 'HIGH',
        reason: 'Sering mengalami idle berlebih (>4.5 jam/hari) & 8 pelanggaran batas kecepatan',
        recommendedAction: 'Intervensi dispatch route & coaching driver terkait idling',
      },
      {
        vehicleId: 'v-11',
        plateNumber: 'B 9554 ZXT',
        model: 'Mercedes-Benz Axor 2528C',
        branchName: 'Cabang Jakarta',
        compositeRiskScore: 71,
        maintenanceRisk: 68,
        costPerKm: 3950,
        downtimeHours: 14,
        fuelAnomalyCount: 1,
        safetyRiskScore: 65,
        priority: 'MEDIUM',
        reason: 'Jadwal servis berkala due soon dalam 3 hari / 400 KM',
        recommendedAction: 'Konfirmasi booking slot bengkel rekanan',
      },
    ];

    const topCostVehicles: TopVehicleCostItem[] = [
      { vehicleId: 'v-03', plateNumber: 'B 9234 TXR', model: 'Hino 500 FL260JW', branchName: 'Jakarta', totalCostIdr: 28400000, costPerKmIdr: 4680, fuelCostIdr: 14200000, maintenanceCostIdr: 8900000, distanceKm: 6068 },
      { vehicleId: 'v-09', plateNumber: 'L 9988 AB', model: 'Mitsubishi Fuso FN62', branchName: 'Surabaya', totalCostIdr: 25600000, costPerKmIdr: 4320, fuelCostIdr: 13100000, maintenanceCostIdr: 7800000, distanceKm: 5925 },
      { vehicleId: 'v-07', plateNumber: 'D 8812 KL', model: 'Isuzu Giga FVM', branchName: 'Bandung', totalCostIdr: 23100000, costPerKmIdr: 4100, fuelCostIdr: 11900000, maintenanceCostIdr: 6400000, distanceKm: 5634 },
      { vehicleId: 'v-11', plateNumber: 'B 9554 ZXT', model: 'Mercedes Axor 2528', branchName: 'Jakarta', totalCostIdr: 21800000, costPerKmIdr: 3950, fuelCostIdr: 11200000, maintenanceCostIdr: 5800000, distanceKm: 5518 },
      { vehicleId: 'v-04', plateNumber: 'B 9812 UYT', model: 'Hino Ranger 500', branchName: 'Jakarta', totalCostIdr: 20400000, costPerKmIdr: 3820, fuelCostIdr: 10800000, maintenanceCostIdr: 5100000, distanceKm: 5340 },
    ];

    const topRiskDrivers: TopDriverRiskItem[] = [
      { driverId: 'dr-01', name: 'Eko Prasetyo', branchName: 'Jakarta', riskScore: 86, safetyScore: 68, violationsCount: 14, harshEventsCount: 22, fatigueCount: 4, priority: 'CRITICAL', recommendedCoaching: 'Coaching Kecepatan Koridor & Fatigue Safety Awareness' },
      { driverId: 'dr-02', name: 'Hendra Gunawan', branchName: 'Bandung', riskScore: 79, safetyScore: 73, violationsCount: 9, harshEventsCount: 18, fatigueCount: 3, priority: 'HIGH', recommendedCoaching: 'Manajemen Istirahat Perjalanan Jauh & Eco-Driving' },
      { driverId: 'dr-03', name: 'Rudi Hermawan', branchName: 'Surabaya', riskScore: 74, safetyScore: 77, violationsCount: 8, harshEventsCount: 15, fatigueCount: 2, priority: 'HIGH', recommendedCoaching: 'Antisipasi Jarak Pengereman (Defensive Driving)' },
      { driverId: 'dr-04', name: 'Agus Wijaya', branchName: 'Semarang', riskScore: 68, safetyScore: 81, violationsCount: 5, harshEventsCount: 11, fatigueCount: 1, priority: 'MEDIUM', recommendedCoaching: 'Kepatuhan Rute & Pengurangan Idling Mesin' },
    ];

    const topEfficientVehicles: TopEfficientVehicleItem[] = [
      { vehicleId: 'v-01', plateNumber: 'B 9123 TXR', model: 'Hino Dutro 130 HD', branchName: 'Jakarta', kmPerLiter: 5.42, costPerKmIdr: 2240, utilizationPct: 94.8, efficiencyRating: 98 },
      { vehicleId: 'v-02', plateNumber: 'B 9456 UYT', model: 'Isuzu Elf NMR 71', branchName: 'Jakarta', kmPerLiter: 5.28, costPerKmIdr: 2310, utilizationPct: 93.2, efficiencyRating: 96 },
      { vehicleId: 'v-05', plateNumber: 'L 9012 AB', model: 'Mitsubishi Canter FE', branchName: 'Surabaya', kmPerLiter: 5.15, costPerKmIdr: 2420, utilizationPct: 91.5, efficiencyRating: 94 },
      { vehicleId: 'v-06', plateNumber: 'D 8821 KL', model: 'Hino Dutro 110 LD', branchName: 'Bandung', kmPerLiter: 4.95, costPerKmIdr: 2550, utilizationPct: 89.4, efficiencyRating: 91 },
    ];

    const topProductiveVehicles: TopProductiveVehicleItem[] = [
      { vehicleId: 'v-01', plateNumber: 'B 9123 TXR', model: 'Hino Dutro 130 HD', branchName: 'Jakarta', tripsCount: 38, deliveriesCount: 118, distanceKm: 7450, activeHours: 214, productivityScore: 98.4 },
      { vehicleId: 'v-02', plateNumber: 'B 9456 UYT', model: 'Isuzu Elf NMR 71', branchName: 'Jakarta', tripsCount: 35, deliveriesCount: 106, distanceKm: 7120, activeHours: 198, productivityScore: 96.0 },
      { vehicleId: 'v-05', plateNumber: 'L 9012 AB', model: 'Mitsubishi Canter FE', branchName: 'Surabaya', tripsCount: 32, deliveriesCount: 96, distanceKm: 6840, activeHours: 186, productivityScore: 93.5 },
      { vehicleId: 'v-06', plateNumber: 'D 8821 KL', model: 'Hino Dutro 110 LD', branchName: 'Bandung', tripsCount: 29, deliveriesCount: 88, distanceKm: 6320, activeHours: 172, productivityScore: 90.2 },
    ];

    return {
      highRiskVehicles,
      topCostVehicles,
      topRiskDrivers,
      topEfficientVehicles,
      topProductiveVehicles,
    };
  }

  /**
   * Build Top Executive KPI Cards
   */
  public static buildKpiCards(
    efficiency: FleetEfficiencyMetrics,
    cost: ExecutiveCostMetrics,
    productivity: ExecutiveProductivityMetrics,
    safety: ExecutiveSafetyMetrics,
    fuel: ExecutiveFuelMetrics,
    maintenance: ExecutiveMaintenanceMetrics
  ): ExecutiveKpiCardData[] {
    const costDelta = Math.round(((cost.totalOperatingCost - cost.prevTotalCost) / cost.prevTotalCost) * 1000) / 10;
    const effDelta = Math.round((efficiency.efficiencyScore - efficiency.prevEfficiencyScore) * 10) / 10;
    const safetyDelta = Math.round((safety.safetyScore - safety.prevSafetyScore) * 10) / 10;

    return [
      {
        id: 'kpi-efficiency',
        title: 'Fleet Efficiency',
        currentValue: efficiency.efficiencyScore,
        displayValue: `${efficiency.efficiencyScore}%`,
        unit: '%',
        previousValue: efficiency.prevEfficiencyScore,
        previousDisplayValue: `${efficiency.prevEfficiencyScore}%`,
        percentageChange: effDelta,
        trend: effDelta >= 0 ? 'UP' : 'DOWN',
        isPositiveGood: true,
        status: efficiency.efficiencyScore >= 85 ? 'EXCELLENT' : 'GOOD',
        subtitle: `Utilisasi ${efficiency.fleetUtilizationRate}% • Availability ${efficiency.vehicleAvailabilityRate}%`,
        iconName: 'Activity',
        sparklineData: [82, 84, 83, 85, 86, 88, efficiency.efficiencyScore],
      },
      {
        id: 'kpi-cost',
        title: 'Total Operating Cost (TOC)',
        currentValue: cost.totalOperatingCost,
        displayValue: this.formatIdr(cost.totalOperatingCost),
        previousValue: cost.prevTotalCost,
        previousDisplayValue: this.formatIdr(cost.prevTotalCost),
        percentageChange: costDelta,
        trend: costDelta <= 0 ? 'DOWN' : 'UP',
        isPositiveGood: false,
        status: cost.budgetVariancePct !== null && cost.budgetVariancePct <= 0 ? 'GOOD' : 'ATTENTION',
        subtitle: `Cost/KM ${this.formatIdr(cost.costPerKm)} • Cost/Trip ${this.formatIdr(cost.costPerTrip)}`,
        iconName: 'DollarSign',
        sparklineData: [510, 498, 485, 492, 475, 482],
      },
      {
        id: 'kpi-productivity',
        title: 'Fleet Productivity',
        currentValue: productivity.productivityScore,
        displayValue: `${productivity.productivityScore}%`,
        unit: '%',
        previousValue: 88.5,
        previousDisplayValue: '88.5%',
        percentageChange: 3.6,
        trend: 'UP',
        isPositiveGood: true,
        status: 'EXCELLENT',
        subtitle: `${productivity.completedTrips} Rit Selesai • ${productivity.completedDeliveries} Drop Point`,
        iconName: 'TrendingUp',
        sparklineData: [85, 86, 88, 89, 90, 92],
      },
      {
        id: 'kpi-safety',
        title: 'Fleet Safety Score',
        currentValue: safety.safetyScore,
        displayValue: `${safety.safetyScore}/100`,
        previousValue: safety.prevSafetyScore,
        previousDisplayValue: `${safety.prevSafetyScore}/100`,
        percentageChange: safetyDelta,
        trend: 'UP',
        isPositiveGood: true,
        status: safety.safetyScore >= 90 ? 'EXCELLENT' : 'GOOD',
        subtitle: `0 Kecelakaan • ${safety.criticalAlerts.length} Alert Kritis Aktif`,
        iconName: 'ShieldCheck',
        sparklineData: [90, 91, 91, 92, 93, 94],
      },
      {
        id: 'kpi-fuel',
        title: 'Fuel Economy & Control',
        currentValue: fuel.avgKmLiter,
        displayValue: `${fuel.avgKmLiter} KM/L`,
        previousValue: 3.98,
        previousDisplayValue: '3.98 KM/L',
        percentageChange: 3.5,
        trend: 'UP',
        isPositiveGood: true,
        status: fuel.fuelAnomaliesCount > 2 ? 'ATTENTION' : 'GOOD',
        subtitle: `${fuel.fuelAnomaliesCount} Anomali Terdeteksi • ${fuel.theftRiskCount} Dugaan Drain`,
        iconName: 'Fuel',
        sparklineData: [3.8, 3.9, 3.95, 4.05, 4.1, 4.12],
      },
      {
        id: 'kpi-maintenance',
        title: 'Maintenance Health',
        currentValue: maintenance.healthCounts.healthy,
        displayValue: `${Math.round((maintenance.healthCounts.healthy / (maintenance.healthCounts.healthy + maintenance.vehiclesDueSoonCount + maintenance.vehiclesOverdueCount + maintenance.criticalVehiclesCount || 1)) * 100)}%`,
        previousValue: 84.0,
        previousDisplayValue: '84.0%',
        percentageChange: 2.1,
        trend: 'UP',
        isPositiveGood: true,
        status: maintenance.vehiclesOverdueCount > 0 ? 'ATTENTION' : 'GOOD',
        subtitle: `${maintenance.vehiclesDueSoonCount} Due Soon • ${maintenance.vehiclesOverdueCount} Overdue • ${maintenance.breakdownsCount} Breakdown`,
        iconName: 'Wrench',
        sparklineData: [80, 82, 83, 85, 87, 88],
      },
    ];
  }
}
