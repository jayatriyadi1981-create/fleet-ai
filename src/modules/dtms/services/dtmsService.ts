import {
  DumpTruckUnit,
  HaulCycleRecord,
  WeighbridgeRecord,
  HaulRoadSegment,
  TireRecord,
  DumpTruckDriver,
  MatchFactorExcavator,
  DtmsKpis,
  DumpTruckCategory,
  DumpTruckStatus,
  MaterialType,
  PayloadStatus
} from '../types';

class DtmsService {
  private trucks: DumpTruckUnit[] = [
    {
      id: 'dt-01',
      hullNumber: 'DT-101',
      plateNumber: 'KT 8102 BG',
      category: 'OFF_HIGHWAY_RIGID',
      model: 'Komatsu HD785-7',
      brand: 'Komatsu',
      vesselCapacityM3: 60,
      ratedPayloadTons: 91.0,
      currentPayloadTons: 88.5,
      tareWeightTons: 72.0,
      currentGrossWeightTons: 160.5,
      payloadStatus: 'OPTIMAL',
      status: 'HAULING_LOADED',
      currentMaterial: 'OVERBURDEN_OB',
      assignedExcavator: 'EX-101 (Hitachi EX1200)',
      assignedLoadingPoint: 'Pit Central - Bench 14',
      assignedDumpingPoint: 'Waste Dump North (Disposal 1)',
      currentDriverName: 'Bambang Sugianto',
      driverKimperNo: 'KIMP-DT-8821',
      fuelLevelPct: 78,
      fuelBurnRateLtrPerKm: 3.4,
      bodyHoistAngleDeg: 0,
      ptoActive: false,
      speedKmh: 28,
      speedLimitKmh: 35,
      tirePressureAvgPsi: 102,
      todayRits: 14,
      todayTonnage: 1239,
      targetDailyRits: 22,
      location: {
        lat: -1.2482,
        lng: 116.8921,
        zoneName: 'Haul Road Main Trunk KM 3.2'
      },
      lastUpdated: '1 Menit Lalu'
    },
    {
      id: 'dt-02',
      hullNumber: 'DT-102',
      plateNumber: 'KT 8103 BG',
      category: 'OFF_HIGHWAY_RIGID',
      model: 'Komatsu HD785-7',
      brand: 'Komatsu',
      vesselCapacityM3: 60,
      ratedPayloadTons: 91.0,
      currentPayloadTons: 97.8,
      tareWeightTons: 72.0,
      currentGrossWeightTons: 169.8,
      payloadStatus: 'OVERLOAD_WARNING',
      status: 'LOADING',
      currentMaterial: 'OVERBURDEN_OB',
      assignedExcavator: 'EX-101 (Hitachi EX1200)',
      assignedLoadingPoint: 'Pit Central - Bench 14',
      assignedDumpingPoint: 'Waste Dump North (Disposal 1)',
      currentDriverName: 'Agus Priyono',
      driverKimperNo: 'KIMP-DT-7712',
      fuelLevelPct: 65,
      fuelBurnRateLtrPerKm: 3.6,
      bodyHoistAngleDeg: 0,
      ptoActive: false,
      speedKmh: 0,
      speedLimitKmh: 20,
      tirePressureAvgPsi: 100,
      todayRits: 12,
      todayTonnage: 1140,
      targetDailyRits: 22,
      location: {
        lat: -1.2505,
        lng: 116.8874,
        zoneName: 'Pit Central Loading Pad EX-101'
      },
      lastUpdated: 'Baru saja'
    },
    {
      id: 'dt-03',
      hullNumber: 'DT-201',
      plateNumber: 'B 9482 SXA',
      category: 'HEAVY_DUMP_TRUCK_8X4',
      model: 'Scania P460 CB8x4EHZ',
      brand: 'Scania',
      vesselCapacityM3: 38,
      ratedPayloadTons: 48.0,
      currentPayloadTons: 46.2,
      tareWeightTons: 18.5,
      currentGrossWeightTons: 64.7,
      payloadStatus: 'OPTIMAL',
      status: 'DUMPING',
      currentMaterial: 'COAL_BATUBARA',
      assignedExcavator: 'EX-202 (CAT 390F)',
      assignedLoadingPoint: 'Pit Seam 40 - Coal Loading',
      assignedDumpingPoint: 'ROM Stockpile Crusher Hopper 1',
      currentDriverName: 'Hendra Setiawan',
      driverKimperNo: 'KIMP-DT-9942',
      fuelLevelPct: 82,
      fuelBurnRateLtrPerKm: 1.8,
      bodyHoistAngleDeg: 48,
      ptoActive: true,
      speedKmh: 0,
      speedLimitKmh: 10,
      tirePressureAvgPsi: 115,
      todayRits: 18,
      todayTonnage: 831,
      targetDailyRits: 26,
      location: {
        lat: -1.2391,
        lng: 116.9082,
        zoneName: 'ROM Stockpile Hopper #1'
      },
      lastUpdated: 'Baru saja'
    },
    {
      id: 'dt-04',
      hullNumber: 'DT-202',
      plateNumber: 'B 9483 SXA',
      category: 'HEAVY_DUMP_TRUCK_8X4',
      model: 'Volvo FMX 440 8x4R',
      brand: 'Volvo',
      vesselCapacityM3: 38,
      ratedPayloadTons: 48.0,
      currentPayloadTons: 0,
      tareWeightTons: 18.2,
      currentGrossWeightTons: 18.2,
      payloadStatus: 'OPTIMAL',
      status: 'RETURNING_EMPTY',
      currentMaterial: 'COAL_BATUBARA',
      assignedExcavator: 'EX-202 (CAT 390F)',
      assignedLoadingPoint: 'Pit Seam 40 - Coal Loading',
      assignedDumpingPoint: 'ROM Stockpile Crusher Hopper 1',
      currentDriverName: 'Dedi Kurniawan',
      driverKimperNo: 'KIMP-DT-6623',
      fuelLevelPct: 54,
      fuelBurnRateLtrPerKm: 1.2,
      bodyHoistAngleDeg: 0,
      ptoActive: false,
      speedKmh: 34,
      speedLimitKmh: 40,
      tirePressureAvgPsi: 116,
      todayRits: 17,
      todayTonnage: 785,
      targetDailyRits: 26,
      location: {
        lat: -1.2422,
        lng: 116.8995,
        zoneName: 'Haul Road Segment B (Empty Lane)'
      },
      lastUpdated: '3 Menit Lalu'
    },
    {
      id: 'dt-05',
      hullNumber: 'DT-301',
      plateNumber: 'KT 8722 LN',
      category: 'ARTICULATED_DUMP_TRUCK',
      model: 'Volvo A40G ADT 6x6',
      brand: 'Volvo',
      vesselCapacityM3: 24,
      ratedPayloadTons: 39.0,
      currentPayloadTons: 38.4,
      tareWeightTons: 31.2,
      currentGrossWeightTons: 69.6,
      payloadStatus: 'OPTIMAL',
      status: 'QUEUEING_LOAD',
      currentMaterial: 'TOPSOIL',
      assignedExcavator: 'EX-301 (Komatsu PC400)',
      assignedLoadingPoint: 'Pit North Pre-Stripping',
      assignedDumpingPoint: 'Topsoil Reclamation Bank A',
      currentDriverName: 'Joko Prabowo',
      driverKimperNo: 'KIMP-DT-5541',
      fuelLevelPct: 70,
      fuelBurnRateLtrPerKm: 2.2,
      bodyHoistAngleDeg: 0,
      ptoActive: false,
      speedKmh: 5,
      speedLimitKmh: 25,
      tirePressureAvgPsi: 78,
      todayRits: 15,
      todayTonnage: 576,
      targetDailyRits: 24,
      location: {
        lat: -1.2589,
        lng: 116.8812,
        zoneName: 'Pit North Loading Queue #2'
      },
      lastUpdated: '2 Menit Lalu'
    },
    {
      id: 'dt-06',
      hullNumber: 'DT-401',
      plateNumber: 'B 9112 TXY',
      category: 'HEAVY_DUMP_TRUCK_6X4',
      model: 'Hino 500 FM260JD Tipper',
      brand: 'Hino',
      vesselCapacityM3: 20,
      ratedPayloadTons: 26.0,
      currentPayloadTons: 25.5,
      tareWeightTons: 11.4,
      currentGrossWeightTons: 36.9,
      payloadStatus: 'OPTIMAL',
      status: 'HAULING_LOADED',
      currentMaterial: 'NICKEL_ORE',
      assignedExcavator: 'EX-401 (Kobelco SK330)',
      assignedLoadingPoint: 'Pit Limonite Block 3',
      assignedDumpingPoint: 'Port Ore Stockpile Jetty 2',
      currentDriverName: 'Rian Firmansyah',
      driverKimperNo: 'KIMP-DT-4428',
      fuelLevelPct: 88,
      fuelBurnRateLtrPerKm: 1.1,
      bodyHoistAngleDeg: 0,
      ptoActive: false,
      speedKmh: 31,
      speedLimitKmh: 35,
      tirePressureAvgPsi: 110,
      todayRits: 20,
      todayTonnage: 510,
      targetDailyRits: 28,
      location: {
        lat: -1.2315,
        lng: 116.9244,
        zoneName: 'Haul Road Main Jetty Line'
      },
      lastUpdated: 'Baru saja'
    },
    {
      id: 'dt-07',
      hullNumber: 'DT-402',
      plateNumber: 'B 9113 TXY',
      category: 'HEAVY_DUMP_TRUCK_6X4',
      model: 'Hino 500 FM260JD Tipper',
      brand: 'Hino',
      vesselCapacityM3: 20,
      ratedPayloadTons: 26.0,
      currentPayloadTons: 0,
      tareWeightTons: 11.4,
      currentGrossWeightTons: 11.4,
      payloadStatus: 'OPTIMAL',
      status: 'BREAKDOWN_MAINTENANCE',
      currentMaterial: 'NICKEL_ORE',
      assignedExcavator: 'EX-401 (Kobelco SK330)',
      assignedLoadingPoint: 'Pit Limonite Block 3',
      assignedDumpingPoint: 'Port Ore Stockpile Jetty 2',
      currentDriverName: 'M. Taufik',
      driverKimperNo: 'KIMP-DT-3319',
      fuelLevelPct: 40,
      fuelBurnRateLtrPerKm: 0,
      bodyHoistAngleDeg: 0,
      ptoActive: false,
      speedKmh: 0,
      speedLimitKmh: 0,
      tirePressureAvgPsi: 108,
      todayRits: 8,
      todayTonnage: 204,
      targetDailyRits: 28,
      location: {
        lat: -1.2401,
        lng: 116.8950,
        zoneName: 'Central Workshop Bay #4'
      },
      lastUpdated: '40 Menit Lalu'
    }
  ];

  private cycles: HaulCycleRecord[] = [
    {
      id: 'cyc-101',
      cycleCode: 'CYC-20260821-0081',
      truckHullNo: 'DT-101',
      driverName: 'Bambang Sugianto',
      excavatorHullNo: 'EX-101',
      material: 'OVERBURDEN_OB',
      loadingPoint: 'Pit Central - Bench 14',
      dumpingPoint: 'Waste Dump North (Disposal 1)',
      startTime: '09:15',
      endTime: '09:41',
      queueLoadTimeMins: 1.8,
      loadingTimeMins: 3.2,
      loadedHaulTimeMins: 10.5,
      queueDumpTimeMins: 1.2,
      dumpingTimeMins: 1.5,
      emptyReturnTimeMins: 7.8,
      totalCycleTimeMins: 26.0,
      distanceLoadedKm: 3.4,
      distanceEmptyKm: 3.4,
      grossWeightTon: 160.5,
      netPayloadTon: 88.5,
      fuelUsedLiters: 15.6,
      efficiencyScore: 94,
      status: 'COMPLETED'
    },
    {
      id: 'cyc-102',
      cycleCode: 'CYC-20260821-0082',
      truckHullNo: 'DT-201',
      driverName: 'Hendra Setiawan',
      excavatorHullNo: 'EX-202',
      material: 'COAL_BATUBARA',
      loadingPoint: 'Pit Seam 40 - Coal Loading',
      dumpingPoint: 'ROM Stockpile Crusher Hopper 1',
      startTime: '09:20',
      endTime: '09:39',
      queueLoadTimeMins: 0.8,
      loadingTimeMins: 2.4,
      loadedHaulTimeMins: 7.2,
      queueDumpTimeMins: 2.1,
      dumpingTimeMins: 1.1,
      emptyReturnTimeMins: 5.4,
      totalCycleTimeMins: 19.0,
      distanceLoadedKm: 2.6,
      distanceEmptyKm: 2.6,
      grossWeightTon: 64.7,
      netPayloadTon: 46.2,
      fuelUsedLiters: 7.8,
      efficiencyScore: 96,
      status: 'COMPLETED'
    },
    {
      id: 'cyc-103',
      cycleCode: 'CYC-20260821-0083',
      truckHullNo: 'DT-301',
      driverName: 'Joko Prabowo',
      excavatorHullNo: 'EX-301',
      material: 'TOPSOIL',
      loadingPoint: 'Pit North Pre-Stripping',
      dumpingPoint: 'Topsoil Reclamation Bank A',
      startTime: '09:28',
      endTime: '09:51',
      queueLoadTimeMins: 2.5,
      loadingTimeMins: 2.8,
      loadedHaulTimeMins: 8.5,
      queueDumpTimeMins: 0.5,
      dumpingTimeMins: 1.4,
      emptyReturnTimeMins: 7.3,
      totalCycleTimeMins: 23.0,
      distanceLoadedKm: 2.8,
      distanceEmptyKm: 2.8,
      grossWeightTon: 69.6,
      netPayloadTon: 38.4,
      fuelUsedLiters: 9.2,
      efficiencyScore: 91,
      status: 'COMPLETED'
    }
  ];

  private weighbridgeTickets: WeighbridgeRecord[] = [
    {
      id: 'wb-01',
      ticketNo: 'WBT-2026-0821-0491',
      truckHullNo: 'DT-201',
      driverName: 'Hendra Setiawan',
      material: 'COAL_BATUBARA',
      sourcePit: 'Pit Seam 40',
      destination: 'ROM Stockpile Hopper #1',
      firstWeightTon: 64.7,
      secondWeightTon: 18.5,
      netWeightTon: 46.2,
      ratedCapacityTon: 48.0,
      discrepancyTon: -1.8,
      payloadClassification: 'OPTIMAL',
      timestamp: '21 Agu 2026 - 09:35 WIB',
      operatorName: 'Siti Rahmawati',
      sealBarcode: 'SEAL-WB-88192'
    },
    {
      id: 'wb-02',
      ticketNo: 'WBT-2026-0821-0490',
      truckHullNo: 'DT-401',
      driverName: 'Rian Firmansyah',
      material: 'NICKEL_ORE',
      sourcePit: 'Pit Limonite Block 3',
      destination: 'Port Ore Stockpile Jetty 2',
      firstWeightTon: 36.9,
      secondWeightTon: 11.4,
      netWeightTon: 25.5,
      ratedCapacityTon: 26.0,
      discrepancyTon: -0.5,
      payloadClassification: 'OPTIMAL',
      timestamp: '21 Agu 2026 - 09:28 WIB',
      operatorName: 'Siti Rahmawati',
      sealBarcode: 'SEAL-WB-88191'
    },
    {
      id: 'wb-03',
      ticketNo: 'WBT-2026-0821-0489',
      truckHullNo: 'DT-102',
      driverName: 'Agus Priyono',
      material: 'OVERBURDEN_OB',
      sourcePit: 'Pit Central Bench 14',
      destination: 'Waste Dump North',
      firstWeightTon: 169.8,
      secondWeightTon: 72.0,
      netWeightTon: 97.8,
      ratedCapacityTon: 91.0,
      discrepancyTon: +6.8,
      payloadClassification: 'OVERLOAD_WARNING',
      timestamp: '21 Agu 2026 - 09:12 WIB',
      operatorName: 'Siti Rahmawati',
      sealBarcode: 'SEAL-WB-88190'
    }
  ];

  private haulRoads: HaulRoadSegment[] = [
    {
      id: 'hr-01',
      segmentCode: 'HR-SEG-01',
      segmentName: 'Main Trunk Pit Central to Disposal North',
      startPoint: 'Pit Central Exit (RL 45)',
      endPoint: 'Waste Dump North (RL 110)',
      lengthKm: 3.4,
      averageGradePct: 6.8, // 6.8% Incline
      maxSpeedKmh: 35,
      roadCondition: 'GOOD',
      waterTruckScheduled: true,
      activeTruckCount: 6,
      dustLevelPpm: 24
    },
    {
      id: 'hr-02',
      segmentCode: 'HR-SEG-02',
      segmentName: 'Coal Hauling Line to ROM Stockpile',
      startPoint: 'Pit Seam 40 (RL 30)',
      endPoint: 'ROM Stockpile Crusher (RL 55)',
      lengthKm: 2.6,
      averageGradePct: 3.2,
      maxSpeedKmh: 40,
      roadCondition: 'GOOD',
      waterTruckScheduled: false,
      activeTruckCount: 5,
      dustLevelPpm: 18
    },
    {
      id: 'hr-03',
      segmentCode: 'HR-SEG-03',
      segmentName: 'Limonite Haul Road to Port Jetty',
      startPoint: 'Pit Limonite (RL 80)',
      endPoint: 'Port Jetty Stockpile (RL 5)',
      lengthKm: 7.2,
      averageGradePct: -4.5, // 4.5% Decline
      maxSpeedKmh: 35,
      roadCondition: 'SLIPPERY_MUDDY',
      waterTruckScheduled: false,
      activeTruckCount: 4,
      dustLevelPpm: 12
    }
  ];

  private matchFactors: MatchFactorExcavator[] = [
    {
      id: 'mf-01',
      excavatorCode: 'EX-101',
      model: 'Hitachi EX1200 (Bucket 6.7 m³)',
      loadingPoint: 'Pit Central - Bench 14 (OB Stripping)',
      assignedTruckCount: 5,
      avgLoadingTimeMins: 3.2,
      avgTruckCycleTimeMins: 26.0,
      calculatedMatchFactor: 0.62, // (5 * 3.2) / (1 * 26.0) = 0.62 (Excavator waiting!)
      status: 'EXCAVATOR_WAITING',
      hourlyTargetBcm: 450,
      actualHourlyBcm: 360
    },
    {
      id: 'mf-02',
      excavatorCode: 'EX-202',
      model: 'CAT 390F (Bucket 5.2 m³)',
      loadingPoint: 'Pit Seam 40 (Coal Getting)',
      assignedTruckCount: 8,
      avgLoadingTimeMins: 2.4,
      avgTruckCycleTimeMins: 19.0,
      calculatedMatchFactor: 1.01, // (8 * 2.4) / (1 * 19.0) = 1.01 (Near perfect!)
      status: 'BALANCED',
      hourlyTargetBcm: 320,
      actualHourlyBcm: 325
    },
    {
      id: 'mf-03',
      excavatorCode: 'EX-301',
      model: 'Komatsu PC400 (Bucket 2.8 m³)',
      loadingPoint: 'Pit North Pre-Stripping',
      assignedTruckCount: 9,
      avgLoadingTimeMins: 2.8,
      avgTruckCycleTimeMins: 23.0,
      calculatedMatchFactor: 1.10, // (9 * 2.8) / (1 * 23.0) = 1.10 (Truck queuing slight)
      status: 'TRUCK_QUEUE',
      hourlyTargetBcm: 200,
      actualHourlyBcm: 205
    }
  ];

  private tires: TireRecord[] = [
    {
      id: 'tr-01',
      serialNumber: 'BS-49R-98412',
      truckHullNo: 'DT-101',
      wheelPosition: 'POS-1 (Front Left Steering)',
      brand: 'Bridgestone',
      size: '27.00R49',
      pattern: 'VRPS E4 Rock Radial',
      currentPressurePsi: 102,
      recommendedPressurePsi: 102,
      temperatureCelsius: 64,
      initialTreadDepthMm: 78,
      currentTreadDepthMm: 58,
      hoursRun: 2450,
      estimatedTkph: 310,
      status: 'HEALTHY'
    },
    {
      id: 'tr-02',
      serialNumber: 'BS-49R-98413',
      truckHullNo: 'DT-101',
      wheelPosition: 'POS-2 (Front Right Steering)',
      brand: 'Bridgestone',
      size: '27.00R49',
      pattern: 'VRPS E4 Rock Radial',
      currentPressurePsi: 100,
      recommendedPressurePsi: 102,
      temperatureCelsius: 67,
      initialTreadDepthMm: 78,
      currentTreadDepthMm: 56,
      hoursRun: 2450,
      estimatedTkph: 310,
      status: 'HEALTHY'
    },
    {
      id: 'tr-03',
      serialNumber: 'MC-24R-33120',
      truckHullNo: 'DT-201',
      wheelPosition: 'POS-3 (Drive 1 Left Outer)',
      brand: 'Michelin',
      size: '12.00R24',
      pattern: 'X-Works XZY Mining',
      currentPressurePsi: 115,
      recommendedPressurePsi: 115,
      temperatureCelsius: 72,
      initialTreadDepthMm: 31,
      currentTreadDepthMm: 24,
      hoursRun: 1820,
      estimatedTkph: 165,
      status: 'HEALTHY'
    },
    {
      id: 'tr-04',
      serialNumber: 'GT-24R-11029',
      truckHullNo: 'DT-102',
      wheelPosition: 'POS-6 (Drive 2 Right Inner)',
      brand: 'Gajah Tunggal',
      size: '27.00R49',
      pattern: 'Super Rock Grip E4',
      currentPressurePsi: 88,
      recommendedPressurePsi: 102,
      temperatureCelsius: 89,
      initialTreadDepthMm: 78,
      currentTreadDepthMm: 18,
      hoursRun: 4200,
      estimatedTkph: 340,
      status: 'LOW_PRESSURE'
    }
  ];

  private drivers: DumpTruckDriver[] = [
    {
      id: 'drv-01',
      badgeNumber: 'OPR-DT-0182',
      name: 'Bambang Sugianto',
      phone: '0812-3344-5501',
      simType: 'SIM B2 UMUM',
      kimperNo: 'KIMP-DT-8821',
      kimperExpiry: '15 Des 2027',
      assignedTruckHull: 'DT-101 (Komatsu HD785)',
      shift: 'SHIFT_1_DAY',
      todayRitsCompleted: 14,
      todayTonnageHauled: 1239,
      fatigueScorePct: 15,
      dssAlertsToday: 0,
      safetyScorePct: 98,
      overSpeedIncidents: 0,
      incentiveBonusRp: 210000
    },
    {
      id: 'drv-02',
      badgeNumber: 'OPR-DT-0185',
      name: 'Agus Priyono',
      phone: '0812-3344-5502',
      simType: 'SIM B2 UMUM',
      kimperNo: 'KIMP-DT-7712',
      kimperExpiry: '20 Okt 2026',
      assignedTruckHull: 'DT-102 (Komatsu HD785)',
      shift: 'SHIFT_1_DAY',
      todayRitsCompleted: 12,
      todayTonnageHauled: 1140,
      fatigueScorePct: 42,
      dssAlertsToday: 2,
      safetyScorePct: 89,
      overSpeedIncidents: 1,
      incentiveBonusRp: 180000
    },
    {
      id: 'drv-03',
      badgeNumber: 'OPR-DT-0199',
      name: 'Hendra Setiawan',
      phone: '0813-8877-6601',
      simType: 'SIM B2 UMUM',
      kimperNo: 'KIMP-DT-9942',
      kimperExpiry: '08 Mar 2028',
      assignedTruckHull: 'DT-201 (Scania P460)',
      shift: 'SHIFT_1_DAY',
      todayRitsCompleted: 18,
      todayTonnageHauled: 831,
      fatigueScorePct: 20,
      dssAlertsToday: 0,
      safetyScorePct: 99,
      overSpeedIncidents: 0,
      incentiveBonusRp: 270000
    },
    {
      id: 'drv-04',
      badgeNumber: 'OPR-DT-0205',
      name: 'Dedi Kurniawan',
      phone: '0812-7711-2299',
      simType: 'SIM B2 UMUM',
      kimperNo: 'KIMP-DT-6623',
      kimperExpiry: '14 Jan 2027',
      assignedTruckHull: 'DT-202 (Volvo FMX)',
      shift: 'SHIFT_1_DAY',
      todayRitsCompleted: 17,
      todayTonnageHauled: 785,
      fatigueScorePct: 25,
      dssAlertsToday: 0,
      safetyScorePct: 97,
      overSpeedIncidents: 0,
      incentiveBonusRp: 255000
    }
  ];

  // Getters
  public getTrucks(): DumpTruckUnit[] {
    return this.trucks;
  }

  public getCycles(): HaulCycleRecord[] {
    return this.cycles;
  }

  public getWeighbridgeTickets(): WeighbridgeRecord[] {
    return this.weighbridgeTickets;
  }

  public getHaulRoads(): HaulRoadSegment[] {
    return this.haulRoads;
  }

  public getMatchFactors(): MatchFactorExcavator[] {
    return this.matchFactors;
  }

  public getTires(): TireRecord[] {
    return this.tires;
  }

  public getDrivers(): DumpTruckDriver[] {
    return this.drivers;
  }

  public getKpis(): DtmsKpis {
    const active = this.trucks.filter(t => t.status !== 'BREAKDOWN_MAINTENANCE' && t.status !== 'STANDBY_IDLE').length;
    const standby = this.trucks.filter(t => t.status === 'STANDBY_IDLE').length;
    const breakdown = this.trucks.filter(t => t.status === 'BREAKDOWN_MAINTENANCE').length;
    const totalRits = this.trucks.reduce((acc, t) => acc + t.todayRits, 0);
    const targetRits = this.trucks.reduce((acc, t) => acc + t.targetDailyRits, 0);
    const totalTonnage = this.trucks.reduce((acc, t) => acc + t.todayTonnage, 0);
    const totalBcm = Math.round(totalTonnage / 1.8); // 1.8 ton/m3 density average
    const totalFuelBurned = Math.round(totalRits * 12.4);

    return {
      totalActiveTrucks: active,
      totalStandbyTrucks: standby,
      totalBreakdownTrucks: breakdown,
      totalRitsToday: totalRits,
      targetRitsToday: targetRits,
      targetDailyRits: targetRits,
      totalTonnageToday: totalTonnage,
      totalBcmToday: totalBcm,
      avgCycleTimeMins: 22.4,
      avgPayloadPerTruckTon: 58.2,
      overloadIncidentCount: 2,
      fleetAvailabilityPaPct: 92.5,
      fleetUtilizationUaPct: 88.4,
      fuelConsumptionLiterPerTon: 0.38,
      totalFuelBurnedLiters: totalFuelBurned,
      totalGrossRevenueRp: totalTonnage * 28500 // Rp 28.500/ton hauling fee
    };
  }

  // Action methods
  public recordWeighbridgeTicket(data: Partial<WeighbridgeRecord>): WeighbridgeRecord {
    const newTicket: WeighbridgeRecord = {
      id: `wb-${Date.now()}`,
      ticketNo: `WBT-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      truckHullNo: data.truckHullNo || 'DT-101',
      driverName: data.driverName || 'Operator DT',
      material: data.material || 'OVERBURDEN_OB',
      sourcePit: data.sourcePit || 'Pit Central',
      destination: data.destination || 'Waste Dump North',
      firstWeightTon: data.firstWeightTon || 160.0,
      secondWeightTon: data.secondWeightTon || 72.0,
      netWeightTon: (data.firstWeightTon || 160.0) - (data.secondWeightTon || 72.0),
      ratedCapacityTon: data.ratedCapacityTon || 91.0,
      discrepancyTon: ((data.firstWeightTon || 160.0) - (data.secondWeightTon || 72.0)) - (data.ratedCapacityTon || 91.0),
      payloadClassification: data.payloadClassification || 'OPTIMAL',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      operatorName: 'Siti Rahmawati',
      sealBarcode: `SEAL-WB-${Math.floor(10000 + Math.random() * 90000)}`
    };

    this.weighbridgeTickets.unshift(newTicket);
    return newTicket;
  }

  public rebalanceDispatch(excavatorId: string, addedTruckCount: number) {
    const mf = this.matchFactors.find(m => m.id === excavatorId);
    if (mf) {
      mf.assignedTruckCount += addedTruckCount;
      mf.calculatedMatchFactor = Number(((mf.assignedTruckCount * mf.avgLoadingTimeMins) / (1 * mf.avgTruckCycleTimeMins)).toFixed(2));
      if (mf.calculatedMatchFactor >= 0.95 && mf.calculatedMatchFactor <= 1.05) {
        mf.status = 'BALANCED';
      } else if (mf.calculatedMatchFactor > 1.05) {
        mf.status = 'TRUCK_QUEUE';
      } else {
        mf.status = 'EXCAVATOR_WAITING';
      }
    }
  }

  public generateAiDailyDtmsBriefing(): string {
    const kpis = this.getKpis();
    return `=== AI DUMP TRUCK FLEET OPERATIONAL BRIEFING ===
Tanggal: 21 Agustus 2026 | Shift: Siang (07:00 - 19:00 WIB)
Site: Konsesi Tambang & Hauling Batubara/Nikel Terpadu

1. RINGKASAN PRODUKSI & RITASE HAULING:
- Total Ritase Selesai: ${kpis.totalRitsToday} / ${kpis.targetDailyRits} Rits (${Math.round((kpis.totalRitsToday / kpis.targetDailyRits) * 100)}% Target Tercapai).
- Total Tonase Terangkut: ${kpis.totalTonnageToday.toLocaleString()} Ton (${kpis.totalBcmToday.toLocaleString()} BCM).
- Rata-rata Durasi Cycle Time: ${kpis.avgCycleTimeMins} Menit per ritase (Benchmark Standar: 23.5 Menit).
- Total Estimasi Pendapatan Hauling: Rp ${kpis.totalGrossRevenueRp.toLocaleString()}.

2. BOTTLENECK & MATCH FACTOR SHOVEL-TRUCK:
- Excavator EX-101 (Hitachi EX1200) di Pit Central Bench 14 terdeteksi Match Factor Rendah (MF: 0.62). Shovel sering idle menunggu dump truck tiba.
  --> Rekomendasi AI: Alokasikan 2 unit DT tambahan (OHT Komatsu HD785) ke EX-101 untuk meningkatkan Match Factor ke 0.98.
- Segmen Jalan HR-SEG-03 (Limonite Haul Road ke Port Jetty) dilaporkan licin & berlumpur pasca hujan semalam. Terpantau penurunan kecepatan rata-rata dari 35 km/jam menjadi 18 km/jam.
  --> Tindakan: Grader GD-02 dan Compactor CS-01 telah ditugaskan melakukan perataan jalan.

3. KEPATUHAN PAYLOAD & JEMBATAN TIMBANG (WEIGHBRIDGE):
- Overload Warning terdeteksi pada unit DT-102 (+6.8 Ton di atas batas toleransi 105%).
  --> Operator Shovel EX-101 telah dikirim peringatan auto-bucket limit untuk mencegah kerusakan suspensi OHT dan memperpanjang umur ban.

4. KESELAMATAN (SAFETY & FATIGUE RADAR):
- Driver Agus Priyono (DT-102) terdeteksi 2x Yawning/Fatigue Alert via kamera DSS pada pukul 08:45 WIB. Telah diarahkan menepi di Rest Area Pos 2 untuk istirahat 15 menit.`;
  }
}

export const dtmsService = new DtmsService();
