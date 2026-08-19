/**
 * Fleet Intelligence Smart AI - Fuel Analytics & Baselines Engine
 * Handles multi-dimensional fuel consumption formulas, vehicle type baselines,
 * route benchmarks, efficiency factor scoring, and cost calculations.
 */

import {
  VehicleFuelBaseline,
  FuelConsumptionMetric,
  FuelEfficiencyDetail,
  FuelCostBreakdown,
  VehicleFuelRankingItem,
  DriverFuelAnalysisItem,
  RouteFuelAnalysisItem,
  FuelTrendAnalysis,
  FuelTrendDataPoint,
  FuelPeriodPreset,
  FuelFilterState,
  FuelDataQualityMetrics,
} from '../types';

export class FuelAnalyticsEngine {
  /**
   * Calculates consumption in L/100km, km/L, L/hour from raw telemetry
   */
  public calculateConsumption(
    fuelConsumedLiters: number,
    distanceKm: number,
    engineHours: number
  ): {
    consumptionL100Km: number;
    consumptionKmL: number;
    consumptionLPerHour: number;
  } {
    if (distanceKm <= 0 || fuelConsumedLiters <= 0) {
      return {
        consumptionL100Km: 0,
        consumptionKmL: 0,
        consumptionLPerHour: engineHours > 0 ? Math.round((fuelConsumedLiters / engineHours) * 10) / 10 : 0,
      };
    }

    const consumptionL100Km = Math.round((fuelConsumedLiters / distanceKm) * 100 * 10) / 10;
    const consumptionKmL = Math.round((distanceKm / fuelConsumedLiters) * 10) / 10;
    const consumptionLPerHour = engineHours > 0 ? Math.round((fuelConsumedLiters / engineHours) * 10) / 10 : 0;

    return {
      consumptionL100Km,
      consumptionKmL,
      consumptionLPerHour,
    };
  }

  /**
   * Generates vehicle baseline benchmarks
   */
  public getVehicleBaselines(): VehicleFuelBaseline[] {
    return [
      {
        vehicleId: 'veh-001',
        plateNumber: 'B 9876 XYZ',
        vehicleType: 'Heavy Truck Wingbox (24T)',
        vehicleClass: 'HEAVY_DUTY_TRUCK',
        fuelType: 'BIODIESEL',
        normalConsumptionL100Km: 26.3, // 3.8 km/L
        normalRangeMinL100Km: 24.0,
        normalRangeMaxL100Km: 28.5,
        historicalAverageL100Km: 26.8,
        bestPerformanceL100Km: 23.5,
        worstPerformanceL100Km: 34.2,
        currentConsumptionL100Km: 31.2, // +18.6% deviation
        deviationPercentage: 18.6,
        typeBaselineL100Km: 25.5,
        efficiencyScore: 72,
        totalTrips: 42,
        totalDistanceKm: 7850,
      },
      {
        vehicleId: 'veh-002',
        plateNumber: 'B 9123 KLR',
        vehicleType: 'Heavy Truck Tronton (20T)',
        vehicleClass: 'HEAVY_DUTY_TRUCK',
        fuelType: 'BIODIESEL',
        normalConsumptionL100Km: 24.5,
        normalRangeMinL100Km: 22.0,
        normalRangeMaxL100Km: 27.0,
        historicalAverageL100Km: 24.8,
        bestPerformanceL100Km: 21.8,
        worstPerformanceL100Km: 29.5,
        currentConsumptionL100Km: 24.2, // -1.2% deviation (Good)
        deviationPercentage: -1.2,
        typeBaselineL100Km: 25.5,
        efficiencyScore: 89,
        totalTrips: 48,
        totalDistanceKm: 9240,
      },
      {
        vehicleId: 'veh-003',
        plateNumber: 'B 9555 TTT',
        vehicleType: 'Medium Truck Fuso (8T)',
        vehicleClass: 'MEDIUM_DUTY_TRUCK',
        fuelType: 'SOLAR',
        normalConsumptionL100Km: 18.2, // 5.5 km/L
        normalRangeMinL100Km: 16.5,
        normalRangeMaxL100Km: 20.0,
        historicalAverageL100Km: 18.5,
        bestPerformanceL100Km: 16.0,
        worstPerformanceL100Km: 25.4,
        currentConsumptionL100Km: 23.8, // +30.7% deviation
        deviationPercentage: 30.7,
        typeBaselineL100Km: 18.0,
        efficiencyScore: 61,
        totalTrips: 36,
        totalDistanceKm: 5620,
      },
      {
        vehicleId: 'veh-004',
        plateNumber: 'B 9345 AB',
        vehicleType: 'Light Truck Box CDD (4T)',
        vehicleClass: 'LIGHT_COMMERCIAL',
        fuelType: 'SOLAR',
        normalConsumptionL100Km: 13.5, // 7.4 km/L
        normalRangeMinL100Km: 12.0,
        normalRangeMaxL100Km: 15.0,
        historicalAverageL100Km: 13.6,
        bestPerformanceL100Km: 11.8,
        worstPerformanceL100Km: 17.2,
        currentConsumptionL100Km: 13.8,
        deviationPercentage: 2.2,
        typeBaselineL100Km: 13.5,
        efficiencyScore: 88,
        totalTrips: 55,
        totalDistanceKm: 6120,
      },
      {
        vehicleId: 'veh-005',
        plateNumber: 'B 9801 CD',
        vehicleType: 'Blind Van Delivery (1.5T)',
        vehicleClass: 'LIGHT_COMMERCIAL',
        fuelType: 'PERTALITE',
        normalConsumptionL100Km: 9.1, // 11.0 km/L
        normalRangeMinL100Km: 8.0,
        normalRangeMaxL100Km: 10.5,
        historicalAverageL100Km: 9.2,
        bestPerformanceL100Km: 7.9,
        worstPerformanceL100Km: 12.8,
        currentConsumptionL100Km: 8.8,
        deviationPercentage: -3.3,
        typeBaselineL100Km: 9.0,
        efficiencyScore: 92,
        totalTrips: 62,
        totalDistanceKm: 4890,
      },
      {
        vehicleId: 'veh-006',
        plateNumber: 'B 9202 EF',
        vehicleType: 'Prime Mover Trailer (40T)',
        vehicleClass: 'HEAVY_DUTY_TRUCK',
        fuelType: 'BIODIESEL',
        normalConsumptionL100Km: 34.5,
        normalRangeMinL100Km: 31.0,
        normalRangeMaxL100Km: 38.0,
        historicalAverageL100Km: 35.0,
        bestPerformanceL100Km: 29.8,
        worstPerformanceL100Km: 44.5,
        currentConsumptionL100Km: 42.1, // +22.0% deviation
        deviationPercentage: 22.0,
        typeBaselineL100Km: 34.0,
        efficiencyScore: 58,
        totalTrips: 28,
        totalDistanceKm: 6420,
      },
    ];
  }

  /**
   * Computes holistic Fuel Efficiency Score (0-100) decomposed into factor weights
   */
  public computeFuelEfficiencyDetail(
    consumptionDeviationPct: number,
    idleHoursSharePct: number,
    harshAccelEventsCount: number,
    overspeedHoursSharePct: number,
    maintenanceOverdue: boolean
  ): FuelEfficiencyDetail {
    // 1. Consumption Baseline Score (35% weight)
    const baseScore = Math.max(20, Math.min(100, 100 - (consumptionDeviationPct > 0 ? consumptionDeviationPct * 1.8 : -consumptionDeviationPct * 0.5)));
    
    // 2. Driving Behavior (Harsh Accel / Overspeed) (20% weight)
    const behaviorScore = Math.max(30, Math.min(100, 100 - (harshAccelEventsCount * 4 + overspeedHoursSharePct * 3)));

    // 3. Idling Impact (20% weight)
    const idleScore = Math.max(25, Math.min(100, 100 - (idleHoursSharePct * 2.2)));

    // 4. Route Profile (10% weight)
    const routeScore = 85;

    // 5. Vehicle Maintenance (10% weight)
    const maintScore = maintenanceOverdue ? 55 : 92;

    // 6. Load Utilization (5% weight)
    const loadScore = 88;

    const overallScore = Math.round(
      baseScore * 0.35 +
      behaviorScore * 0.20 +
      idleScore * 0.20 +
      routeScore * 0.10 +
      maintScore * 0.10 +
      loadScore * 0.05
    );

    let category: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'POOR' | 'CRITICAL' = 'GOOD';
    if (overallScore >= 88) category = 'EXCELLENT';
    else if (overallScore >= 75) category = 'GOOD';
    else if (overallScore >= 60) category = 'AVERAGE';
    else if (overallScore >= 45) category = 'POOR';
    else category = 'CRITICAL';

    return {
      overallScore,
      category,
      factors: {
        consumptionBaseline: {
          name: 'Penyimpangan Baseline Konsumsi',
          score: Math.round(baseScore),
          weight: 0.35,
          impact: consumptionDeviationPct > 10 ? 'NEGATIVE' : consumptionDeviationPct < 0 ? 'POSITIVE' : 'NEUTRAL',
          description: `Deviasi konsumsi aktual ${consumptionDeviationPct > 0 ? '+' : ''}${consumptionDeviationPct}% dibandingkan benchmark historis kendaraan.`,
        },
        drivingBehavior: {
          name: 'Perilaku Berkendara (Gas/Rem Mendadak)',
          score: Math.round(behaviorScore),
          weight: 0.20,
          impact: behaviorScore < 70 ? 'NEGATIVE' : 'POSITIVE',
          description: `Terdeteksi ${harshAccelEventsCount} kejadian sentakan gas mendadak yang membuang momentum BBM.`,
        },
        idlingImpact: {
          name: 'Eksposur Mesin Hidup Diam (Excessive Idling)',
          score: Math.round(idleScore),
          weight: 0.20,
          impact: idleScore < 70 ? 'NEGATIVE' : 'NEUTRAL',
          description: `Porsi waktu idle sebesar ${idleHoursSharePct}% dari total durasi mesin hidup.`,
        },
        routeProfile: {
          name: 'Profil & Topografi Rute',
          score: routeScore,
          weight: 0.10,
          impact: 'NEUTRAL',
          description: 'Penyesuaian terhadap kemacetan arteri Pantura dan kontur Tol Cipularang.',
        },
        vehicleMaintenance: {
          name: 'Kondisi Kesehatan Mesin & Filter',
          score: maintScore,
          weight: 0.10,
          impact: maintenanceOverdue ? 'NEGATIVE' : 'POSITIVE',
          description: maintenanceOverdue ? 'Jadwal servis injektor/filter solar terlambat 1,200 km.' : 'Kondisi ruang bakar dan tekanan ban optimal.',
        },
        loadUtilization: {
          name: 'Faktor Utilisasi Muatan Tonase',
          score: loadScore,
          weight: 0.05,
          impact: 'POSITIVE',
          description: 'Rasio muatan rata-rata 82% dari kapasitas angkut maksimal.',
        },
      },
      summary: `Skor efisiensi BBM armada berada pada indeks ${overallScore}/100 (${category}). ${
        idleScore < 70 ? 'Faktor pemborosan terbesar berasal dari durasi idling yang tinggi saat antrean depo.' : 'Konsumsi relatif stabil dalam batas toleransi normal.'
      }`,
    };
  }

  /**
   * Computes Comprehensive Fuel Cost Breakdown
   */
  public computeCostBreakdown(period: FuelPeriodPreset): FuelCostBreakdown {
    const totalCostIdr = 48250000;
    const previousPeriodCostIdr = 45100000;
    const changePercentage = Math.round(((totalCostIdr - previousPeriodCostIdr) / previousPeriodCostIdr) * 1000) / 10;
    const totalDistance = 39490;
    const costPerKmIdr = Math.round(totalCostIdr / totalDistance);
    const totalTrips = 279;
    const costPerTripIdr = Math.round(totalCostIdr / totalTrips);
    const activeVehicles = 6;
    const costPerVehicleIdr = Math.round(totalCostIdr / activeVehicles);
    const costPerEngineHourIdr = Math.round(totalCostIdr / 1480);
    const estimatedAvoidableWasteCostIdr = 5820000; // IDR 5.82 Juta (Idling + harsh accel + anomalies)

    return {
      totalCostIdr,
      previousPeriodCostIdr,
      changePercentage,
      costPerKmIdr,
      costPerTripIdr,
      costPerVehicleIdr,
      costPerEngineHourIdr,
      estimatedAvoidableWasteCostIdr,
      costByVehicleType: [
        { type: 'Heavy Duty Truck (Wingbox & Tronton)', totalCostIdr: 28450000, volumeLiters: 4180, avgCostPerKm: 1680 },
        { type: 'Prime Mover Trailer (40T)', totalCostIdr: 12200000, volumeLiters: 1794, avgCostPerKm: 1900 },
        { type: 'Medium Truck Fuso (8T)', totalCostIdr: 5100000, volumeLiters: 750, avgCostPerKm: 907 },
        { type: 'Light Commercial (Box CDD & Van)', totalCostIdr: 2500000, volumeLiters: 275, avgCostPerKm: 340 },
      ],
      costByBranch: [
        { branchName: 'HQ & Depo Jakarta (Tanjung Priok)', totalCostIdr: 21500000, volumeLiters: 3160 },
        { branchName: 'Hub Logistik Cikarang Dry Port', totalCostIdr: 16800000, volumeLiters: 2470 },
        { branchName: 'Depo Surabaya (Tanjung Perak)', totalCostIdr: 9950000, volumeLiters: 1460 },
      ],
      costByFuelType: [
        { fuelType: 'BIODIESEL', totalCostIdr: 40650000, volumeLiters: 5978, avgPricePerLiter: 6800 },
        { fuelType: 'SOLAR', totalCostIdr: 5100000, volumeLiters: 750, avgPricePerLiter: 6800 },
        { fuelType: 'PERTALITE', totalCostIdr: 2500000, volumeLiters: 250, avgPricePerLiter: 10000 },
      ],
      topCostliestVehicles: [
        { vehicleId: 'veh-001', plateNumber: 'B 9876 XYZ', totalCostIdr: 16640000, costPerKm: 2120, distanceKm: 7850 },
        { vehicleId: 'veh-006', plateNumber: 'B 9202 EF', totalCostIdr: 12200000, costPerKm: 1900, distanceKm: 6420 },
        { vehicleId: 'veh-002', plateNumber: 'B 9123 KLR', totalCostIdr: 11810000, costPerKm: 1278, distanceKm: 9240 },
        { vehicleId: 'veh-003', plateNumber: 'B 9555 TTT', totalCostIdr: 5100000, costPerKm: 907, distanceKm: 5620 },
      ],
    };
  }

  /**
   * Generates Vehicle Fuel Rankings with configurable minimum trips threshold
   */
  public getVehicleRankings(minTripsThreshold: number = 5): VehicleFuelRankingItem[] {
    const baselines = this.getVehicleBaselines().filter((v) => v.totalTrips >= minTripsThreshold);
    
    // Sort by efficiencyScore descending
    const sorted = [...baselines].sort((a, b) => b.efficiencyScore - a.efficiencyScore);

    return sorted.map((v, idx) => {
      let efficiencyStatus: 'HIGHLY_EFFICIENT' | 'NORMAL' | 'ELEVATED_CONSUMPTION' | 'SEVERELY_INEFFICIENT' = 'NORMAL';
      if (v.efficiencyScore >= 85) efficiencyStatus = 'HIGHLY_EFFICIENT';
      else if (v.efficiencyScore >= 70) efficiencyStatus = 'NORMAL';
      else if (v.efficiencyScore >= 55) efficiencyStatus = 'ELEVATED_CONSUMPTION';
      else efficiencyStatus = 'SEVERELY_INEFFICIENT';

      const totalLiters = Math.round((v.currentConsumptionL100Km * v.totalDistanceKm) / 100);
      const totalCostIdr = Math.round(totalLiters * (v.fuelType === 'PERTALITE' ? 10000 : 6800));

      const driversMap: Record<string, { driver: string; branch: string }> = {
        'veh-001': { driver: 'Ahmad Sudrajat', branch: 'HQ Jakarta' },
        'veh-002': { driver: 'Budi Santoso', branch: 'Cikarang Hub' },
        'veh-003': { driver: 'Eko Prasetyo', branch: 'HQ Jakarta' },
        'veh-004': { driver: 'Faisal Akbar', branch: 'Depo Surabaya' },
        'veh-005': { driver: 'Bambang Irawan', branch: 'Cikarang Hub' },
        'veh-006': { driver: 'Doni Firmansyah', branch: 'HQ Jakarta' },
      };

      const meta = driversMap[v.vehicleId] || { driver: 'Driver Armada', branch: 'Pusat' };

      return {
        rank: idx + 1,
        vehicleId: v.vehicleId,
        plateNumber: v.plateNumber,
        vehicleType: v.vehicleType,
        branchName: meta.branch,
        assignedDriverName: meta.driver,
        efficiencyScore: v.efficiencyScore,
        avgConsumptionL100Km: v.currentConsumptionL100Km,
        avgConsumptionKmL: Math.round((100 / v.currentConsumptionL100Km) * 10) / 10,
        baselineL100Km: v.normalConsumptionL100Km,
        deviationPercentage: v.deviationPercentage,
        totalFuelLiters: totalLiters,
        totalCostIdr,
        completedTripsCount: v.totalTrips,
        totalDistanceKm: v.totalDistanceKm,
        efficiencyStatus,
      };
    });
  }

  /**
   * Driver Fuel Analysis (Cross-Correlation with PROMPT 29 Driver Behavior)
   */
  public getDriverFuelAnalysis(): DriverFuelAnalysisItem[] {
    return [
      {
        driverId: 'drv-01',
        driverName: 'Ahmad Sudrajat',
        assignedPlate: 'B 9876 XYZ',
        branchName: 'HQ & Depo Jakarta',
        totalTrips: 42,
        totalDistanceKm: 7850,
        avgConsumptionL100Km: 31.2,
        avgConsumptionKmL: 3.2,
        peerGroupAvgL100Km: 26.5,
        peerComparisonPercentage: 17.7, // 17.7% more fuel consumed than peer average
        fuelEfficiencyScore: 72,
        idleDurationMinutes: 540,
        idleFuelWasteLiters: 162,
        harshAccelerationCount: 14,
        overspeedEventsCount: 6,
        associatedFactors: [
          'Idling berlebih saat antrean loading Tanjung Priok (rata-rata 77 menit/trip)',
          '14x sentakan gas mendadak saat keluar gerbang tol Cikampek',
          'Penyimpangan konsumsi +17.7% di atas rekan pengemudi rute sejenis',
        ],
      },
      {
        driverId: 'drv-02',
        driverName: 'Budi Santoso',
        assignedPlate: 'B 9123 KLR',
        branchName: 'Hub Logistik Cikarang',
        totalTrips: 48,
        totalDistanceKm: 9240,
        avgConsumptionL100Km: 24.2,
        avgConsumptionKmL: 4.1,
        peerGroupAvgL100Km: 25.8,
        peerComparisonPercentage: -6.2, // 6.2% more efficient
        fuelEfficiencyScore: 89,
        idleDurationMinutes: 180,
        idleFuelWasteLiters: 54,
        harshAccelerationCount: 2,
        overspeedEventsCount: 1,
        associatedFactors: [
          'Manajemen kecepatan konsisten pada rentang ekonomis (60-70 km/h)',
          'Disiplin mematikan mesin saat bongkar muat depo',
        ],
      },
      {
        driverId: 'drv-03',
        driverName: 'Eko Prasetyo',
        assignedPlate: 'B 9555 TTT',
        branchName: 'HQ & Depo Jakarta',
        totalTrips: 36,
        totalDistanceKm: 5620,
        avgConsumptionL100Km: 23.8,
        avgConsumptionKmL: 4.2,
        peerGroupAvgL100Km: 18.2,
        peerComparisonPercentage: 30.7, // +30.7% worse
        fuelEfficiencyScore: 61,
        idleDurationMinutes: 620,
        idleFuelWasteLiters: 186,
        harshAccelerationCount: 18,
        overspeedEventsCount: 9,
        associatedFactors: [
          'Durasi idle AC kabin aktif saat istirahat rest area',
          'Gaya berkendara agresif di jalan arteri Karawang Timur',
          'Terdapat anomali penurunan fuel level saat parkir malam hari',
        ],
      },
      {
        driverId: 'drv-04',
        driverName: 'Doni Firmansyah',
        assignedPlate: 'B 9202 EF',
        branchName: 'HQ & Depo Jakarta',
        totalTrips: 28,
        totalDistanceKm: 6420,
        avgConsumptionL100Km: 42.1,
        avgConsumptionKmL: 2.37,
        peerGroupAvgL100Km: 34.5,
        peerComparisonPercentage: 22.0,
        fuelEfficiencyScore: 58,
        idleDurationMinutes: 480,
        idleFuelWasteLiters: 144,
        harshAccelerationCount: 12,
        overspeedEventsCount: 4,
        associatedFactors: [
          'Penggunaan gigi rendah berkepanjangan pada kontur tanjakan Cipularang',
          'Kombinasi muatan penuh (40T) dan servis filter solar terlambat',
        ],
      },
    ];
  }

  /**
   * Route Fuel Analysis (Benchmark against route profile and fleet averages)
   */
  public getRouteFuelAnalysis(): RouteFuelAnalysisItem[] {
    return [
      {
        routeId: 'rt-01',
        routeName: 'Rute Koridor Utama: Jakarta (Tanjung Priok) - Cikarang Dry Port',
        origin: 'Tanjung Priok, Jakarta',
        destination: 'Cikarang Dry Port, Bekasi',
        distanceKm: 54.2,
        totalTripsRecorded: 114,
        avgConsumptionL100Km: 28.6,
        fleetBaselineL100Km: 25.2,
        deviationPercentage: 13.5,
        avgFuelCostPerTripIdr: 105400,
        avgIdleMinutesPerTrip: 38,
        terrainProfile: 'CONGESTED_URBAN',
        aiObservation: 'Konsumsi BBM meningkat 13.5% akibat bottleneck kemacetan di Cikunir & simpang susun Cibitung.',
      },
      {
        routeId: 'rt-02',
        routeName: 'Rute Antar Kota Trans-Jawa: Cikarang - Semarang Kaligawe',
        origin: 'Cikarang Hub, Bekasi',
        destination: 'Depo Kaligawe, Semarang',
        distanceKm: 412.0,
        totalTripsRecorded: 68,
        avgConsumptionL100Km: 24.8,
        fleetBaselineL100Km: 25.0,
        deviationPercentage: -0.8,
        avgFuelCostPerTripIdr: 694800,
        avgIdleMinutesPerTrip: 24,
        terrainProfile: 'FLAT_HIGHWAY',
        aiObservation: 'Efisiensi sangat baik pada koridor Tol Cipali dengan kecepatan konstan cruising 65-75 km/h.',
      },
      {
        routeId: 'rt-03',
        routeName: 'Rute Logistik Pegunungan: Jakarta - Bandung Gedebage via Cipularang',
        origin: 'Depo Tanjung Priok',
        destination: 'Terminal Gedebage, Bandung',
        distanceKm: 168.5,
        totalTripsRecorded: 52,
        avgConsumptionL100Km: 34.2,
        fleetBaselineL100Km: 28.0,
        deviationPercentage: 22.1,
        avgFuelCostPerTripIdr: 391800,
        avgIdleMinutesPerTrip: 18,
        terrainProfile: 'HILLY_ELEVATED',
        aiObservation: 'Elevasi tanjakan KM 90-105 Tol Purbaleunyi meningkatkan beban konsumsi rata-rata sebesar 22.1%.',
      },
      {
        routeId: 'rt-04',
        routeName: 'Rute Distribusi Pantura: Karawang - Cirebon Arteri',
        origin: 'Karawang Timur Hub',
        destination: 'Depo Weru, Cirebon',
        distanceKm: 182.0,
        totalTripsRecorded: 45,
        avgConsumptionL100Km: 27.4,
        fleetBaselineL100Km: 24.5,
        deviationPercentage: 11.8,
        avgFuelCostPerTripIdr: 339100,
        avgIdleMinutesPerTrip: 42,
        terrainProfile: 'MIXED_LOGISTICS',
        aiObservation: 'Pola stop-and-go di pasar tumpah dan persimpangan Pantura menyumbang 42 menit idle per trip.',
      },
    ];
  }

  /**
   * Generates Fuel Trend Analysis (30-day timeline)
   */
  public getFuelTrends(period: FuelPeriodPreset = '30_DAYS'): FuelTrendAnalysis {
    const dataPoints: FuelTrendDataPoint[] = [
      { date: '2026-07-18', label: 'W1', currentConsumptionL100Km: 26.2, previousConsumptionL100Km: 25.8, efficiencyScore: 86, totalLiters: 1820, totalCostIdr: 12376000, anomalyEventsCount: 0 },
      { date: '2026-07-25', label: 'W2', currentConsumptionL100Km: 26.9, previousConsumptionL100Km: 26.0, efficiencyScore: 84, totalLiters: 1910, totalCostIdr: 12988000, anomalyEventsCount: 1 },
      { date: '2026-08-01', label: 'W3', currentConsumptionL100Km: 28.1, previousConsumptionL100Km: 26.4, efficiencyScore: 79, totalLiters: 2040, totalCostIdr: 13872000, anomalyEventsCount: 2 },
      { date: '2026-08-08', label: 'W4', currentConsumptionL100Km: 29.4, previousConsumptionL100Km: 26.8, efficiencyScore: 74, totalLiters: 2160, totalCostIdr: 14688000, anomalyEventsCount: 3 },
      { date: '2026-08-15', label: 'W5 (Current)', currentConsumptionL100Km: 28.7, previousConsumptionL100Km: 27.0, efficiencyScore: 76, totalLiters: 1120, totalCostIdr: 7616000, anomalyEventsCount: 1 },
    ];

    return {
      direction: 'INCREASING',
      changePercentage: 7.2,
      trendDescription: 'Konsumsi BBM armada menunjukkan tren meningkat (+7.2%) selama 3 pekan berturut-turut.',
      consecutiveWeeksTrend: 'Peningkatan konsumsi 3 pekan berturut-turut terasosiasi dengan kenaikan durasi idle di Pelabuhan Priok dan lonjakan suhu operasional.',
      dataPoints,
    };
  }

  /**
   * Computes Fuel Data Quality Score & Sensor Health
   */
  public getDataQualityReport(): FuelDataQualityMetrics {
    return {
      overallQualityScore: 86,
      sensorCoveragePercentage: 92.5, // 92.5% unit equipped with Ultrasonic/CAN Bus sensors
      dataFrequencySeconds: 10,
      missingValuesPercentage: 2.1,
      gpsAvailabilityPercentage: 98.4,
      fuelSensorReliabilityScore: 88,
      transactionCompletenessPercentage: 94.0,
      vehiclesWithMissingSensor: ['B 9444 CD (Van Cadangan)'],
      calibratedSensorsCount: 121,
      uncalibratedSensorsCount: 7,
      warnings: [
        'Sensor tangki sekunder B 9876 XYZ memerlukan re-kalibrasi berkala (terakhir kalibrasi 180 hari lalu).',
        '1 unit cadangan (B 9444 CD) belum terpasang probe sensor digital; analisis menggunakan estimasi berbasis Odometer OBD.',
      ],
    };
  }
}

export const fuelAnalyticsEngine = new FuelAnalyticsEngine();
