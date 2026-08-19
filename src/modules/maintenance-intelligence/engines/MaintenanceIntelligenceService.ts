/**
 * Fleet Intelligence Smart AI - Central Maintenance Intelligence Service
 * Single source of truth coordinating Predictive Maintenance, Risk Scoring, Failure Detection,
 * Service Due Tracking, Priority Queue, AI Recommendations, and Financial Cost Analytics.
 */

import {
  VehicleMaintenanceProfile,
  FleetMaintenanceKPIs,
  MaintenanceFilterState,
  FailurePredictionItem,
  ServiceDueItem,
  MaintenancePriorityItem,
  MaintenanceRecommendationItem,
  MaintenanceAnomalyItem,
  MaintenanceCostAnalysis,
  MaintenanceTrendPoint,
  EvidenceItem,
  RecommendationStatus,
} from '../types';
import { VehicleHealthEngine } from './VehicleHealthEngine';
import { MaintenanceRiskEngine } from './MaintenanceRiskEngine';
import { FailurePredictionEngine } from './FailurePredictionEngine';
import { ComponentHealthEngine } from './ComponentHealthEngine';
import { ServiceDueEngine } from './ServiceDueEngine';
import { MaintenancePriorityEngine } from './MaintenancePriorityEngine';
import { AIMaintenanceRecommendationEngine } from './AIMaintenanceRecommendationEngine';
import { MaintenanceAnomalyEngine } from './MaintenanceAnomalyEngine';
import { MaintenanceCostDowntimeEngine } from './MaintenanceCostDowntimeEngine';

export class MaintenanceIntelligenceService {
  private static instance: MaintenanceIntelligenceService;

  private profiles: Map<string, VehicleMaintenanceProfile> = new Map();
  private recommendations: Map<string, MaintenanceRecommendationItem> = new Map();
  private isInitialized = false;

  private constructor() {
    this.initializeData();
  }

  public static getInstance(): MaintenanceIntelligenceService {
    if (!MaintenanceIntelligenceService.instance) {
      MaintenanceIntelligenceService.instance = new MaintenanceIntelligenceService();
    }
    return MaintenanceIntelligenceService.instance;
  }

  private initializeData(): void {
    if (this.isInitialized) return;

    const rawVehicles = [
      {
        vehicleId: 'v-01',
        plateNumber: 'B 9301 KLP',
        brandModel: 'Hino Ranger FL 235 JW',
        vehicleType: 'Heavy Truck (Tronton Box)',
        branch: 'Jakarta Barat (Depo Daan Mogot)',
        driverName: 'Bambang Supriyanto',
        yearOfManufacture: 2021,
        totalMileage: 148520,
        totalEngineHours: 4210,
        telemetryOnline: true,
        batteryVoltage: 23.4, // Low voltage anomaly
        coolantTempC: 99, // Elevated temp
        oilPressureKpa: 175,
        engineRpm: 840,
        activeDTCs: ['P0115', 'P0562'],
        lastOilServiceKm: 11400, // Overdue by 1400 km
        lastBrakeServiceKm: 28900,
        lastTireServiceKm: 42000,
        failedInspectionItems: ['Tekanan angin ban belakang kiri rendah (85 PSI vs 110 PSI)', 'Lampu rem belakang kanan redup'],
        attentionInspectionItems: ['Pedal rem agak dalam saat muatan penuh'],
        harshBrakingCount: 22,
        fuelAnomalyCount: 2,
        repeatRepairsCount: 3,
        totalCostYTD: 28450000,
        downtimeHours: 48,
        costPerKm: 191,
      },
      {
        vehicleId: 'v-02',
        plateNumber: 'B 9488 UIK',
        brandModel: 'Mitsubishi Fuso Fighter FN62F',
        vehicleType: 'Heavy Truck (Wingbox 6x2)',
        branch: 'Jakarta Timur (Depo Cakung)',
        driverName: 'Siti Rahmawati',
        yearOfManufacture: 2022,
        totalMileage: 98400,
        totalEngineHours: 2950,
        telemetryOnline: true,
        batteryVoltage: 24.2,
        coolantTempC: 91,
        oilPressureKpa: 270,
        engineRpm: 820,
        activeDTCs: [],
        lastOilServiceKm: 9800,
        lastBrakeServiceKm: 18000,
        lastTireServiceKm: 32000,
        failedInspectionItems: [],
        attentionInspectionItems: ['Filter solar separator kotor'],
        harshBrakingCount: 8,
        fuelAnomalyCount: 1,
        repeatRepairsCount: 1,
        totalCostYTD: 14200000,
        downtimeHours: 16,
        costPerKm: 144,
      },
      {
        vehicleId: 'v-03',
        plateNumber: 'B 9122 TYU',
        brandModel: 'Isuzu Giga FVR 34 P',
        vehicleType: 'Medium Truck (Box)',
        branch: 'Surabaya (Depo Rungkut)',
        driverName: 'Ahmad Fauzi',
        yearOfManufacture: 2023,
        totalMileage: 54100,
        totalEngineHours: 1620,
        telemetryOnline: true,
        batteryVoltage: 24.9,
        coolantTempC: 88,
        oilPressureKpa: 295,
        engineRpm: 810,
        activeDTCs: [],
        lastOilServiceKm: 4100,
        lastBrakeServiceKm: 9000,
        lastTireServiceKm: 15000,
        failedInspectionItems: [],
        attentionInspectionItems: [],
        harshBrakingCount: 3,
        fuelAnomalyCount: 0,
        repeatRepairsCount: 0,
        totalCostYTD: 7800000,
        downtimeHours: 8,
        costPerKm: 144,
      },
      {
        vehicleId: 'v-04',
        plateNumber: 'B 9778 ZXC',
        brandModel: 'Hino Dutro 130 HD',
        vehicleType: 'Light Truck (Engkel Box)',
        branch: 'Bandung (Depo Soekarno-Hatta)',
        driverName: 'Dedi Kurniawan',
        yearOfManufacture: 2020,
        totalMileage: 186300,
        totalEngineHours: 5890,
        telemetryOnline: true,
        batteryVoltage: 23.2, // Critical battery
        coolantTempC: 104, // Overheating
        oilPressureKpa: 145, // Low oil pressure
        engineRpm: 920,
        activeDTCs: ['P0217', 'P0524', 'P0300'],
        lastOilServiceKm: 12800, // Overdue 2800 km
        lastBrakeServiceKm: 34000,
        lastTireServiceKm: 58000,
        failedInspectionItems: ['Kampas rem depan tipis < 2mm', 'Air radiator berkurang drastis'],
        attentionInspectionItems: ['Suara mendecit dari fan belt'],
        harshBrakingCount: 26,
        fuelAnomalyCount: 3,
        repeatRepairsCount: 4,
        totalCostYTD: 34800000,
        downtimeHours: 76,
        costPerKm: 186,
      },
      {
        vehicleId: 'v-05',
        plateNumber: 'B 9044 QWE',
        brandModel: 'Toyota Hilux Single Cabin 4x4',
        vehicleType: 'Support Vehicle (Pickup)',
        branch: 'Jakarta Barat (Depo Daan Mogot)',
        driverName: 'Rudi Hermawan',
        yearOfManufacture: 2023,
        totalMileage: 38200,
        totalEngineHours: 1120,
        telemetryOnline: true,
        batteryVoltage: 12.6, // 12V system
        coolantTempC: 86,
        oilPressureKpa: 310,
        engineRpm: 780,
        activeDTCs: [],
        lastOilServiceKm: 3200,
        lastBrakeServiceKm: 8000,
        lastTireServiceKm: 12000,
        failedInspectionItems: [],
        attentionInspectionItems: [],
        harshBrakingCount: 2,
        fuelAnomalyCount: 0,
        repeatRepairsCount: 0,
        totalCostYTD: 4900000,
        downtimeHours: 4,
        costPerKm: 128,
      },
      {
        vehicleId: 'v-06',
        plateNumber: 'B 9555 MNO',
        brandModel: 'Mitsubishi Colt Diesel FE 74 HD',
        vehicleType: 'Light Truck (Double Box)',
        branch: 'Semarang (Depo Kaligawe)',
        driverName: 'Eko Prasetyo',
        yearOfManufacture: 2022,
        totalMileage: 112400,
        totalEngineHours: 3410,
        telemetryOnline: true,
        batteryVoltage: 24.1,
        coolantTempC: 92,
        oilPressureKpa: 265,
        engineRpm: 830,
        activeDTCs: [],
        lastOilServiceKm: 8900,
        lastBrakeServiceKm: 21000,
        lastTireServiceKm: 38000,
        failedInspectionItems: [],
        attentionInspectionItems: ['Tekanan ban depan kanan turun 10 PSI'],
        harshBrakingCount: 7,
        fuelAnomalyCount: 1,
        repeatRepairsCount: 1,
        totalCostYTD: 12600000,
        downtimeHours: 14,
        costPerKm: 112,
      },
      {
        vehicleId: 'v-07',
        plateNumber: 'B 9811 POI',
        brandModel: 'Isuzu Elf NMR 71 HD',
        vehicleType: 'Light Truck (Chiller Reefer)',
        branch: 'Jakarta Timur (Depo Cakung)',
        driverName: 'Hendra Gunawan',
        yearOfManufacture: 2021,
        totalMileage: 132000,
        totalEngineHours: 4100,
        telemetryOnline: true,
        batteryVoltage: 24.0,
        coolantTempC: 95,
        oilPressureKpa: 250,
        engineRpm: 850,
        activeDTCs: ['P0401'],
        lastOilServiceKm: 10500, // Due soon
        lastBrakeServiceKm: 26000,
        lastTireServiceKm: 44000,
        failedInspectionItems: ['Inspeksi kabel sensor chiller kendor'],
        attentionInspectionItems: [],
        harshBrakingCount: 14,
        fuelAnomalyCount: 2,
        repeatRepairsCount: 2,
        totalCostYTD: 19800000,
        downtimeHours: 28,
        costPerKm: 150,
      },
      {
        vehicleId: 'v-08',
        plateNumber: 'B 9633 LKJ',
        brandModel: 'Hino Ranger FM 260 JD',
        vehicleType: 'Heavy Dump Truck (6x4)',
        branch: 'Surabaya (Depo Rungkut)',
        driverName: 'Agus Setiawan',
        yearOfManufacture: 2022,
        totalMileage: 87500,
        totalEngineHours: 3200,
        telemetryOnline: true,
        batteryVoltage: 24.7,
        coolantTempC: 89,
        oilPressureKpa: 280,
        engineRpm: 810,
        activeDTCs: [],
        lastOilServiceKm: 5200,
        lastBrakeServiceKm: 14000,
        lastTireServiceKm: 29000,
        failedInspectionItems: [],
        attentionInspectionItems: [],
        harshBrakingCount: 5,
        fuelAnomalyCount: 0,
        repeatRepairsCount: 0,
        totalCostYTD: 11400000,
        downtimeHours: 12,
        costPerKm: 130,
      },
    ];

    rawVehicles.forEach((raw) => {
      const isServiceOverdue = raw.lastOilServiceKm > 10000;
      const serviceOverdueKm = isServiceOverdue ? raw.lastOilServiceKm - 10000 : 0;

      // 1. Health Score
      const healthResult = VehicleHealthEngine.calculateHealthScore({
        hasSufficientData: true,
        telemetryOnline: raw.telemetryOnline,
        activeDTCsCount: raw.activeDTCs.length,
        batteryVoltage: raw.batteryVoltage,
        coolantTempC: raw.coolantTempC,
        oilPressureKpa: raw.oilPressureKpa,
        isServiceOverdue,
        serviceOverdueKm,
        failedInspectionItemsCount: raw.failedInspectionItems.length,
        attentionInspectionItemsCount: raw.attentionInspectionItems.length,
        harshEventsPer100Km: Math.round(raw.harshBrakingCount / 3),
        fuelAnomalyCount: raw.fuelAnomalyCount,
        repeatedRepairsCount: raw.repeatRepairsCount,
      });

      // 2. Risk Score & Evidence
      const riskResult = MaintenanceRiskEngine.calculateRisk({
        vehicleId: raw.vehicleId,
        plateNumber: raw.plateNumber,
        totalMileage: raw.totalMileage,
        totalEngineHours: raw.totalEngineHours,
        vehicleAgeYears: 2026 - raw.yearOfManufacture,
        isServiceOverdue,
        serviceOverdueKm,
        activeDTCs: raw.activeDTCs,
        batteryVoltage: raw.batteryVoltage,
        coolantTempC: raw.coolantTempC,
        oilPressureKpa: raw.oilPressureKpa,
        tirePressureAbnormal: raw.failedInspectionItems.some(i => i.toLowerCase().includes('ban') || i.toLowerCase().includes('tire')),
        failedInspectionItems: raw.failedInspectionItems,
        attentionInspectionItems: raw.attentionInspectionItems,
        harshBrakingCountLast30Days: raw.harshBrakingCount,
        highIdleHoursLast30Days: 14,
        fuelAnomalyCountLast30Days: raw.fuelAnomalyCount,
        repeatRepairsCountLast90Days: raw.repeatRepairsCount,
        previousRiskScore: Math.max(10, riskResultFromPrevious(raw.plateNumber)),
      });

      // 3. Components Health (12 systems)
      const inspectionMap: Record<string, 'PASS' | 'WARN' | 'FAIL'> = {};
      if (raw.failedInspectionItems.some(i => i.toLowerCase().includes('rem'))) inspectionMap['BRAKE'] = 'FAIL';
      else if (raw.attentionInspectionItems.some(i => i.toLowerCase().includes('rem'))) inspectionMap['BRAKE'] = 'WARN';
      if (raw.failedInspectionItems.some(i => i.toLowerCase().includes('ban'))) inspectionMap['TIRE'] = 'FAIL';
      else if (raw.attentionInspectionItems.some(i => i.toLowerCase().includes('ban'))) inspectionMap['TIRE'] = 'WARN';

      const components = ComponentHealthEngine.evaluateAllComponents({
        hasTelemetry: raw.telemetryOnline,
        batteryVoltage: raw.batteryVoltage,
        coolantTempC: raw.coolantTempC,
        oilPressureKpa: raw.oilPressureKpa,
        engineRpm: raw.engineRpm,
        engineHours: raw.totalEngineHours,
        activeDTCs: raw.activeDTCs,
        lastOilServiceKm: raw.lastOilServiceKm,
        lastBrakeServiceKm: raw.lastBrakeServiceKm,
        lastTireServiceKm: raw.lastTireServiceKm,
        inspectionFindingsMap: inspectionMap,
        hasTPMSSensors: raw.vehicleId === 'v-01' || raw.vehicleId === 'v-04',
        tpmsPressure: raw.vehicleId === 'v-01' ? { fl: 110, fr: 110, rl: 85, rr: 108 } : undefined,
        hasGpsActive: raw.telemetryOnline,
        gpsSatelliteCount: 16,
      });

      // 4. Service Due Engine
      const serviceDueItem = ServiceDueEngine.evaluateServiceDue({
        id: `srv-${raw.vehicleId}-oil`,
        vehicleId: raw.vehicleId,
        plateNumber: raw.plateNumber,
        branch: raw.branch,
        serviceType: 'Servis Berkala Minor (Ganti Oli & Filter Mesin)',
        intervalMileageKm: 10000,
        intervalDays: 90,
        lastServiceMileage: raw.totalMileage - raw.lastOilServiceKm,
        lastServiceDate: new Date(Date.now() - (raw.lastOilServiceKm / 100) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        currentMileage: raw.totalMileage,
        currentEngineHours: raw.totalEngineHours,
        avgDailyMileageKm: 140,
        estimatedCost: 1850000,
        partsRequired: ['Oli Mesin 15W-40 Synthetic (20L)', 'Oil Filter HD', 'Fuel Filter Separator'],
      });

      // 5. Failure Predictions
      const predictions = FailurePredictionEngine.predictComponentFailures({
        vehicleId: raw.vehicleId,
        plateNumber: raw.plateNumber,
        vehicleType: raw.vehicleType,
        branch: raw.branch,
        batteryVoltage: raw.batteryVoltage,
        coolantTempC: raw.coolantTempC,
        oilPressureKpa: raw.oilPressureKpa,
        activeDTCs: raw.activeDTCs,
        mileageSinceLastBrakeService: raw.lastBrakeServiceKm,
        mileageSinceLastTireService: raw.lastTireServiceKm,
        harshBrakingCount: raw.harshBrakingCount,
        inspectionBrakeWarning: raw.failedInspectionItems.some(i => i.toLowerCase().includes('rem')),
        inspectionTireWarning: raw.failedInspectionItems.some(i => i.toLowerCase().includes('ban')),
        fuelConsumptionSpike: raw.fuelAnomalyCount > 0,
        repeatRepairCount: raw.repeatRepairsCount,
      });

      // 6. AI Recommendations
      const recommendationsList = AIMaintenanceRecommendationEngine.generateRecommendations({
        vehicleId: raw.vehicleId,
        plateNumber: raw.plateNumber,
        branch: raw.branch,
        currentMileage: raw.totalMileage,
        riskScore: riskResult.riskScore,
        batteryVoltage: raw.batteryVoltage,
        coolantTempC: raw.coolantTempC,
        activeDTCs: raw.activeDTCs,
        isServiceOverdue,
        serviceOverdueKm,
        inspectionFindings: [...raw.failedInspectionItems, ...raw.attentionInspectionItems],
        harshBrakingFrequency: raw.harshBrakingCount,
        evidence: riskResult.evidence,
      });

      recommendationsList.forEach(r => this.recommendations.set(r.id, r));

      const profile: VehicleMaintenanceProfile = {
        vehicleId: raw.vehicleId,
        plateNumber: raw.plateNumber,
        brandModel: raw.brandModel,
        vehicleType: raw.vehicleType,
        branch: raw.branch,
        driverName: raw.driverName,
        yearOfManufacture: raw.yearOfManufacture,
        vehicleAgeYears: 2026 - raw.yearOfManufacture,
        totalMileage: raw.totalMileage,
        totalEngineHours: raw.totalEngineHours,
        healthScore: healthResult.score,
        healthGrade: healthResult.grade,
        riskScore: riskResult.riskScore,
        riskLevel: riskResult.riskLevel,
        riskTrend: riskResult.riskTrend,
        dataQuality: healthResult.dataQuality,
        telemetryOnline: raw.telemetryOnline,
        lastTelemetryTimestamp: new Date().toISOString(),
        sensorReadings: {
          batteryVoltage: raw.batteryVoltage,
          coolantTempC: raw.coolantTempC,
          oilPressureKpa: raw.oilPressureKpa,
          engineRpm: raw.engineRpm,
          activeDTCs: raw.activeDTCs,
        },
        components,
        serviceDueItems: [serviceDueItem],
        activePredictions: predictions,
        activeRecommendations: recommendationsList,
        crossModuleSignals: {
          fuelEfficiencyImpact: raw.fuelAnomalyCount > 0 ? `Konsumsi BBM naik ~12% (Korelasi servis filter & busi/injektor).` : undefined,
          driverBehaviorImpact: raw.harshBrakingCount > 10 ? `Tercatat ${raw.harshBrakingCount}x pengereman mendadak yang memicu keausan kampas rem lebih cepat.` : undefined,
          inspectionFindings: [...raw.failedInspectionItems, ...raw.attentionInspectionItems],
          repeatedFailureCount: raw.repeatRepairsCount,
        },
        costMetrics: {
          totalMaintenanceCostYTD: raw.totalCostYTD,
          costPerKm: raw.costPerKm,
          fleetAverageCostPerKm: 145,
          isCostOutlier: raw.costPerKm > 175,
          downtimeDaysLast90Days: Math.round(raw.downtimeHours / 24),
          availabilityRisk: raw.downtimeHours > 40 ? 'HIGH' : raw.downtimeHours > 20 ? 'MODERATE' : 'LOW',
        },
      };

      this.profiles.set(profile.vehicleId, profile);
    });

    this.isInitialized = true;
  }

  // --- PUBLIC API QUERIES ---

  public getKPIs(filter?: Partial<MaintenanceFilterState>): FleetMaintenanceKPIs {
    const profiles = this.getAllVehicleProfiles(filter);
    if (profiles.length === 0) {
      return {
        fleetHealthScore: 0,
        fleetHealthGrade: 'INSUFFICIENT_DATA',
        highRiskVehiclesCount: 0,
        serviceDueSoonCount: 0,
        serviceOverdueCount: 0,
        predictedFailureCount: 0,
        repeatedAnomaliesCount: 0,
        averageCostPerKm: 0,
        fleetAvailabilityPercentage: 100,
        pendingRecommendationsCount: 0,
      };
    }

    const totalHealth = profiles.reduce((acc, p) => acc + p.healthScore, 0);
    const avgHealth = Math.round(totalHealth / profiles.length);

    let healthGrade: FleetMaintenanceKPIs['fleetHealthGrade'] = 'GOOD';
    if (avgHealth >= 90) healthGrade = 'EXCELLENT';
    else if (avgHealth >= 75) healthGrade = 'GOOD';
    else if (avgHealth >= 60) healthGrade = 'ATTENTION';
    else if (avgHealth >= 40) healthGrade = 'POOR';
    else healthGrade = 'CRITICAL';

    const highRiskVehiclesCount = profiles.filter(p => p.riskLevel === 'HIGH' || p.riskLevel === 'CRITICAL').length;
    const serviceOverdueCount = profiles.filter(p => p.serviceDueItems.some(s => s.status === 'OVERDUE' || s.status === 'CRITICAL_OVERDUE')).length;
    const serviceDueSoonCount = profiles.filter(p => p.serviceDueItems.some(s => s.status === 'DUE_SOON' || s.status === 'DUE')).length;
    const predictedFailureCount = profiles.reduce((acc, p) => acc + p.activePredictions.length, 0);
    const repeatedAnomaliesCount = profiles.filter(p => p.crossModuleSignals.repeatedFailureCount >= 2).length;

    const totalCost = profiles.reduce((acc, p) => acc + p.costMetrics.totalMaintenanceCostYTD, 0);
    const totalMileage = profiles.reduce((acc, p) => acc + p.totalMileage, 0);
    const averageCostPerKm = totalMileage > 0 ? Math.round(totalCost / totalMileage) : 145;

    const totalDowntimeDays = profiles.reduce((acc, p) => acc + p.costMetrics.downtimeDaysLast90Days, 0);
    const totalFleetDays = profiles.length * 90;
    const fleetAvailabilityPercentage = Math.round(((totalFleetDays - totalDowntimeDays) / totalFleetDays) * 100);

    const pendingRecommendationsCount = Array.from(this.recommendations.values()).filter(r => r.status === 'PENDING_REVIEW').length;

    return {
      fleetHealthScore: avgHealth,
      fleetHealthGrade: healthGrade,
      highRiskVehiclesCount,
      serviceDueSoonCount,
      serviceOverdueCount,
      predictedFailureCount,
      repeatedAnomaliesCount,
      averageCostPerKm,
      fleetAvailabilityPercentage,
      pendingRecommendationsCount,
    };
  }

  public getAllVehicleProfiles(filter?: Partial<MaintenanceFilterState>): VehicleMaintenanceProfile[] {
    this.initializeData();
    let list = Array.from(this.profiles.values());

    if (filter) {
      if (filter.branch && filter.branch !== 'ALL') {
        list = list.filter(p => p.branch.toLowerCase().includes(filter.branch!.toLowerCase()));
      }
      if (filter.vehicleType && filter.vehicleType !== 'ALL') {
        list = list.filter(p => p.vehicleType.toLowerCase().includes(filter.vehicleType!.toLowerCase()));
      }
      if (filter.riskLevel && filter.riskLevel !== 'ALL') {
        list = list.filter(p => p.riskLevel === filter.riskLevel);
      }
      if (filter.vehicleId && filter.vehicleId !== 'ALL') {
        list = list.filter(p => p.vehicleId === filter.vehicleId || p.plateNumber === filter.vehicleId);
      }
      if (filter.searchQuery) {
        const q = filter.searchQuery.toLowerCase();
        list = list.filter(p => p.plateNumber.toLowerCase().includes(q) || p.driverName.toLowerCase().includes(q) || p.brandModel.toLowerCase().includes(q));
      }
    }

    return list;
  }

  public getVehicleProfile(vehicleId: string): VehicleMaintenanceProfile | undefined {
    this.initializeData();
    return this.profiles.get(vehicleId) || Array.from(this.profiles.values()).find(p => p.plateNumber === vehicleId);
  }

  public getFailurePredictions(filter?: Partial<MaintenanceFilterState>): FailurePredictionItem[] {
    const profiles = this.getAllVehicleProfiles(filter);
    const predictions: FailurePredictionItem[] = [];
    profiles.forEach(p => predictions.push(...p.activePredictions));
    return predictions;
  }

  public getServiceDueList(filter?: Partial<MaintenanceFilterState>): ServiceDueItem[] {
    const profiles = this.getAllVehicleProfiles(filter);
    const items: ServiceDueItem[] = [];
    profiles.forEach(p => items.push(...p.serviceDueItems));
    return items.sort((a, b) => a.remainingMileage - b.remainingMileage);
  }

  public getMaintenancePriorityQueue(filter?: Partial<MaintenanceFilterState>): MaintenancePriorityItem[] {
    const profiles = this.getAllVehicleProfiles(filter);
    const queue: MaintenancePriorityItem[] = [];

    profiles.forEach((p) => {
      p.activePredictions.forEach((pred) => {
        const item = MaintenancePriorityEngine.calculatePriority({
          id: `queue-${pred.id}`,
          vehicleId: p.vehicleId,
          plateNumber: p.plateNumber,
          vehicleType: p.vehicleType,
          branch: p.branch,
          driverName: p.driverName,
          component: pred.component,
          componentName: pred.componentName,
          riskScore: p.riskScore,
          riskLevel: p.riskLevel,
          primaryIssue: pred.potentialFailureMode,
          dueStatus: p.serviceDueItems[0]?.status || 'NORMAL',
          isSafetyRelated: pred.component === 'BRAKES' || pred.component === 'TIRES' || pred.component === 'BATTERY' || pred.component === 'COOLING_SYSTEM',
          isMissionCriticalVehicle: p.vehicleType.includes('Heavy') || p.vehicleType.includes('Chiller'),
          estimatedDowntimeHours: pred.failureRisk === 'CRITICAL' ? 8 : 4,
        });
        queue.push(item);
      });
    });

    const rankMap: Record<string, number> = { P1: 1, P2: 2, P3: 3, P4: 4 };
    return queue.sort((a, b) => (rankMap[a.priority] || 4) - (rankMap[b.priority] || 4) || b.riskScore - a.riskScore);
  }

  public getRecommendations(filter?: Partial<MaintenanceFilterState>): MaintenanceRecommendationItem[] {
    this.initializeData();
    let list = Array.from(this.recommendations.values());

    if (filter) {
      if (filter.branch && filter.branch !== 'ALL') {
        list = list.filter(r => r.branch.toLowerCase().includes(filter.branch!.toLowerCase()));
      }
      if (filter.priorityLevel && filter.priorityLevel !== 'ALL') {
        list = list.filter(r => r.priority === filter.priorityLevel);
      }
      if (filter.status && filter.status !== 'ALL') {
        list = list.filter(r => r.status === filter.status);
      }
    }

    return list;
  }

  public approveRecommendation(recId: string, approverName: string, notes?: string): { success: boolean; workOrderId?: string } {
    const rec = this.recommendations.get(recId);
    if (!rec) return { success: false };

    const workOrderId = `WO-AI-${Date.now().toString().slice(-6)}`;
    rec.status = 'WORK_ORDER_CREATED';
    rec.approvalDetails = {
      approvedBy: approverName,
      approvedAt: new Date().toISOString(),
      workOrderId,
      notes: notes || 'Disetujui oleh Fleet Maintenance Manager via AI Predictive Maintenance.',
    };

    return { success: true, workOrderId };
  }

  public getAnomalies(filter?: Partial<MaintenanceFilterState>): MaintenanceAnomalyItem[] {
    const profiles = this.getAllVehicleProfiles(filter);
    const records = profiles.map(p => ({
      vehicleId: p.vehicleId,
      plateNumber: p.plateNumber,
      branch: p.branch,
      component: p.activePredictions[0]?.component || 'BATTERY',
      repairCount90Days: p.crossModuleSignals.repeatedFailureCount || (p.riskScore > 70 ? 3 : 1),
      totalCost90Days: p.costMetrics.totalMaintenanceCostYTD * 0.45,
      avgFleetCost90Days: 8500000,
      downtimeHours90Days: p.costMetrics.downtimeDaysLast90Days * 24,
      lastRepairsSummary: [
        'Pergantian aki & alternator pada servis 60 hari lalu',
        'Uji kabel starter & pembersihan klem korosi 30 hari lalu',
      ],
    }));

    return MaintenanceAnomalyEngine.detectAnomalies(records);
  }

  public getCostAnalysis(filter?: Partial<MaintenanceFilterState>): MaintenanceCostAnalysis {
    const profiles = this.getAllVehicleProfiles(filter);
    const totalCost = profiles.reduce((acc, p) => acc + p.costMetrics.totalMaintenanceCostYTD, 0);
    const totalMileage = profiles.reduce((acc, p) => acc + p.totalMileage, 0);
    const downtimeHours = profiles.reduce((acc, p) => acc + p.costMetrics.downtimeDaysLast90Days * 24, 0);

    return MaintenanceCostDowntimeEngine.calculateCostIntelligence({
      totalCost,
      previousCost: Math.round(totalCost * 0.92),
      totalDistanceKm: totalMileage,
      vehicleCount: profiles.length,
      downtimeHours,
      costPerHourDowntime: 150000,
      componentCosts: [
        { component: 'ENGINE', componentName: 'Mesin & Oli Pelumasan', totalCost: Math.round(totalCost * 0.32), repairCount: 14 },
        { component: 'TIRES', componentName: 'Ban & Velg', totalCost: Math.round(totalCost * 0.24), repairCount: 8 },
        { component: 'BRAKES', componentName: 'Sistem Pengereman', totalCost: Math.round(totalCost * 0.18), repairCount: 11 },
        { component: 'BATTERY', componentName: 'Aki & Kelistrikan', totalCost: Math.round(totalCost * 0.14), repairCount: 9 },
        { component: 'SUSPENSION', componentName: 'Suspensi & Kaki-kaki', totalCost: Math.round(totalCost * 0.08), repairCount: 4 },
        { component: 'AIR_CONDITIONING', componentName: 'AC & Kompresor', totalCost: Math.round(totalCost * 0.04), repairCount: 3 },
      ],
      outliers: profiles
        .filter(p => p.costMetrics.isCostOutlier)
        .map(p => ({
          vehicleId: p.vehicleId,
          plateNumber: p.plateNumber,
          branch: p.branch,
          totalCost: p.costMetrics.totalMaintenanceCostYTD,
          mileageKm: p.totalMileage,
          primaryDriver: p.activePredictions[0]?.componentName || 'Servis Mesin Terlewat & Aki Drop',
        })),
    });
  }

  public getTrends(): MaintenanceTrendPoint[] {
    return [
      { date: 'Mei 2026', averageHealthScore: 88, averageRiskScore: 24, openIssuesCount: 4, scheduledServicesCount: 12, unplannedBreakdownsCount: 1, maintenanceCost: 28400000 },
      { date: 'Jun 2026', averageHealthScore: 86, averageRiskScore: 28, openIssuesCount: 6, scheduledServicesCount: 14, unplannedBreakdownsCount: 2, maintenanceCost: 31200000 },
      { date: 'Jul 2026', averageHealthScore: 84, averageRiskScore: 34, openIssuesCount: 9, scheduledServicesCount: 16, unplannedBreakdownsCount: 3, maintenanceCost: 38900000 },
      { date: 'Ags 2026 (Aktual)', averageHealthScore: 85, averageRiskScore: 31, openIssuesCount: 7, scheduledServicesCount: 15, unplannedBreakdownsCount: 1, maintenanceCost: 34500000 },
      { date: 'Sep 2026 (Prediksi AI)', averageHealthScore: 89, averageRiskScore: 22, openIssuesCount: 3, scheduledServicesCount: 18, unplannedBreakdownsCount: 0, maintenanceCost: 29000000 },
    ];
  }

  public recordPredictionFeedback(predictionId: string, actualOutcome: 'CORRECT' | 'PARTIALLY_CORRECT' | 'FALSE_POSITIVE', technicianNotes: string): boolean {
    for (const profile of this.profiles.values()) {
      const pred = profile.activePredictions.find(p => p.id === predictionId);
      if (pred) {
        pred.feedback = {
          reviewedAt: new Date().toISOString(),
          reviewedBy: 'Teknisi Kepala Bengkel',
          actualOutcome,
          technicianNotes,
        };
        return true;
      }
    }
    return false;
  }
}

function riskResultFromPrevious(plateNumber: string): number {
  if (plateNumber.includes('9301') || plateNumber.includes('9778')) return 78;
  return 25;
}

export const maintenanceIntelligenceService = MaintenanceIntelligenceService.getInstance();
