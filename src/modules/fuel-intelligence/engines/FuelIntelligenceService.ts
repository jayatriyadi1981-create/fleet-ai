/**
 * Fleet Intelligence Smart AI - Central Fuel Intelligence Service
 * Orchestrates multi-dimensional fuel intelligence, filtering, tool execution,
 * and seamless integration across AI Copilot, Fleet Intelligence, and Alert Engines.
 */

import {
  FuelFilterState,
  FuelOverviewKPIs,
  VehicleFuelBaseline,
  FuelConsumptionMetric,
  FuelEfficiencyDetail,
  FuelAnomalyItem,
  FuelTheftIndicator,
  FuelDrainItem,
  RefuelingAuditItem,
  FuelCostBreakdown,
  VehicleFuelRankingItem,
  DriverFuelAnalysisItem,
  RouteFuelAnalysisItem,
  FuelTrendAnalysis,
  FuelEfficiencyPredictionResult,
  AIFuelRecommendationItem,
  FuelDataQualityMetrics,
  FuelEventMapMarker,
  FuelPeriodPreset,
} from '../types';

import { fuelAnalyticsEngine } from './FuelAnalyticsEngine';
import { fuelAnomalyEngine } from './FuelAnomalyEngine';
import { fuelPredictionEngine } from './FuelPredictionEngine';
import { aiFuelRecommendationEngine } from './AIFuelRecommendationEngine';

export class FuelIntelligenceService {
  private static instance: FuelIntelligenceService;

  private constructor() {}

  public static getInstance(): FuelIntelligenceService {
    if (!FuelIntelligenceService.instance) {
      FuelIntelligenceService.instance = new FuelIntelligenceService();
    }
    return FuelIntelligenceService.instance;
  }

  /**
   * Generates Executive Overview KPIs based on active filters
   */
  public getOverviewKPIs(filter: Partial<FuelFilterState> = {}): FuelOverviewKPIs {
    const period = filter.period || '30_DAYS';
    const anomalies = this.getAnomalies(filter);
    const theftIndicators = this.getTheftIndicators(filter);
    const drainEvents = this.getDrainEvents(filter);
    const refuelingEvents = this.getRefuelingAudits(filter);
    const dataQuality = this.getDataQuality(filter);

    return {
      avgConsumptionL100Km: 26.8, // 3.73 km/L for heavy fleet
      avgConsumptionKmL: 3.7,
      avgConsumptionLPerHour: 4.8,
      fuelEfficiencyScore: 84,
      totalFuelCostIdr: 48250000, // Rp 48.2 Jt
      costPerKmIdr: 1222,
      totalFuelConsumedLiters: 7095,
      totalDistanceKm: 39490,
      fuelRiskLevel: theftIndicators.some((t) => t.riskLevel === 'CRITICAL' || t.riskLevel === 'HIGH') ? 'MEDIUM' : 'LOW',
      totalAnomaliesCount: anomalies.length,
      potentialTheftIndicatorsCount: theftIndicators.length,
      drainEventsCount: drainEvents.length,
      refuelingEventsCount: refuelingEvents.length,
      estimatedFuelWasteLiters: 855,
      estimatedFuelWasteIdr: 5820000,
      dataQualityScore: dataQuality.overallQualityScore,
    };
  }

  public getBaselines(filter: Partial<FuelFilterState> = {}): VehicleFuelBaseline[] {
    let list = fuelAnalyticsEngine.getVehicleBaselines();
    if (filter.vehicleId && filter.vehicleId !== 'ALL') {
      list = list.filter((v) => v.vehicleId === filter.vehicleId);
    }
    if (filter.fuelType && filter.fuelType !== 'ALL') {
      list = list.filter((v) => v.fuelType === filter.fuelType);
    }
    return list;
  }

  public getEfficiencyDetail(filter: Partial<FuelFilterState> = {}): FuelEfficiencyDetail {
    return fuelAnalyticsEngine.computeFuelEfficiencyDetail(14.2, 28, 14, 8, true);
  }

  public getCostBreakdown(filter: Partial<FuelFilterState> = {}): FuelCostBreakdown {
    return fuelAnalyticsEngine.computeCostBreakdown(filter.period || '30_DAYS');
  }

  public getVehicleRankings(filter: Partial<FuelFilterState> = {}): VehicleFuelRankingItem[] {
    const minTrips = filter.minTripsThreshold ?? 5;
    let list = fuelAnalyticsEngine.getVehicleRankings(minTrips);
    if (filter.vehicleId && filter.vehicleId !== 'ALL') {
      list = list.filter((v) => v.vehicleId === filter.vehicleId);
    }
    return list;
  }

  public getDriverAnalysis(filter: Partial<FuelFilterState> = {}): DriverFuelAnalysisItem[] {
    let list = fuelAnalyticsEngine.getDriverFuelAnalysis();
    if (filter.driverId && filter.driverId !== 'ALL') {
      list = list.filter((d) => d.driverId === filter.driverId);
    }
    return list;
  }

  public getRouteAnalysis(filter: Partial<FuelFilterState> = {}): RouteFuelAnalysisItem[] {
    let list = fuelAnalyticsEngine.getRouteFuelAnalysis();
    if (filter.routeId && filter.routeId !== 'ALL') {
      list = list.filter((r) => r.routeId === filter.routeId);
    }
    return list;
  }

  public getTrends(filter: Partial<FuelFilterState> = {}): FuelTrendAnalysis {
    return fuelAnalyticsEngine.getFuelTrends(filter.period || '30_DAYS');
  }

  public getAnomalies(filter: Partial<FuelFilterState> = {}): FuelAnomalyItem[] {
    let list = fuelAnomalyEngine.getFuelAnomalies();
    if (filter.vehicleId && filter.vehicleId !== 'ALL') {
      list = list.filter((a) => a.vehicleId === filter.vehicleId);
    }
    if (filter.driverId && filter.driverId !== 'ALL') {
      list = list.filter((a) => a.driverId === filter.driverId);
    }
    return list;
  }

  public getTheftIndicators(filter: Partial<FuelFilterState> = {}): FuelTheftIndicator[] {
    let list = fuelAnomalyEngine.getTheftIndicators();
    if (filter.vehicleId && filter.vehicleId !== 'ALL') {
      list = list.filter((t) => t.vehicleId === filter.vehicleId);
    }
    if (filter.driverId && filter.driverId !== 'ALL') {
      list = list.filter((t) => t.driverId === filter.driverId);
    }
    return list;
  }

  public getDrainEvents(filter: Partial<FuelFilterState> = {}): FuelDrainItem[] {
    let list = fuelAnomalyEngine.getDrainEvents();
    if (filter.vehicleId && filter.vehicleId !== 'ALL') {
      list = list.filter((d) => d.vehicleId === filter.vehicleId);
    }
    return list;
  }

  public getRefuelingAudits(filter: Partial<FuelFilterState> = {}): RefuelingAuditItem[] {
    let list = fuelAnomalyEngine.getRefuelingAudits();
    if (filter.vehicleId && filter.vehicleId !== 'ALL') {
      list = list.filter((r) => r.vehicleId === filter.vehicleId);
    }
    if (filter.driverId && filter.driverId !== 'ALL') {
      list = list.filter((r) => r.driverId === filter.driverId);
    }
    return list;
  }

  public getPredictions(filter: Partial<FuelFilterState> = {}): FuelEfficiencyPredictionResult[] {
    let list = fuelPredictionEngine.getFleetPredictions();
    if (filter.vehicleId && filter.vehicleId !== 'ALL') {
      list = list.filter((p) => p.vehicleId === filter.vehicleId);
    }
    return list;
  }

  public getRecommendations(filter: Partial<FuelFilterState> = {}): AIFuelRecommendationItem[] {
    let list = aiFuelRecommendationEngine.generateRecommendations();
    if (filter.vehicleId && filter.vehicleId !== 'ALL') {
      list = list.filter((r) => !r.vehicleId || r.vehicleId === filter.vehicleId);
    }
    return list;
  }

  public getDataQuality(filter: Partial<FuelFilterState> = {}): FuelDataQualityMetrics {
    return fuelAnalyticsEngine.getDataQualityReport();
  }

  /**
   * Generates Interactive Map Markers for Events
   */
  public getMapEventMarkers(filter: Partial<FuelFilterState> = {}): FuelEventMapMarker[] {
    const markers: FuelEventMapMarker[] = [];

    // Theft indicators
    this.getTheftIndicators(filter).forEach((t) => {
      markers.push({
        id: `map-${t.id}`,
        eventType: 'THEFT_INDICATOR',
        title: `Indikator Potensi Pencurian BBM (-${t.fuelDropLiters} L)`,
        vehicleId: t.vehicleId,
        plateNumber: t.plateNumber,
        driverName: t.driverName,
        timestamp: t.timestamp,
        latitude: t.latitude,
        longitude: t.longitude,
        locationName: t.locationName,
        fuelChangeLiters: -t.fuelDropLiters,
        fuelLevelBefore: 74,
        fuelLevelAfter: 46,
        ignitionStatus: !t.ignitionOffConfirmed,
        speedKmH: 0,
        riskLevel: t.riskLevel,
        evidenceSummary: t.evidenceList[0] || 'Penurunan volume drastis mesin mati',
      });
    });

    // Drain events
    this.getDrainEvents(filter).forEach((d) => {
      markers.push({
        id: `map-${d.id}`,
        eventType: 'FUEL_DRAIN',
        title: `Kejadian Fuel Drain/Kebocoran (-${d.fuelLostLiters} L)`,
        vehicleId: d.vehicleId,
        plateNumber: d.plateNumber,
        driverName: d.driverName,
        timestamp: d.timestamp,
        latitude: d.latitude,
        longitude: d.longitude,
        locationName: d.locationName,
        fuelChangeLiters: -d.fuelLostLiters,
        fuelLevelBefore: 85,
        fuelLevelAfter: 52,
        ignitionStatus: d.ignitionState,
        speedKmH: d.speedKmH,
        riskLevel: 'HIGH',
        evidenceSummary: d.possibleCauses[0] || 'Penurunan laju bahan bakar abnormal',
      });
    });

    // Refuelings
    this.getRefuelingAudits(filter).forEach((r) => {
      markers.push({
        id: `map-${r.id}`,
        eventType: 'REFUELING',
        title: `Pengisian BBM (+${r.sensorIncreaseLiters} L) @ ${r.stationName}`,
        vehicleId: r.vehicleId,
        plateNumber: r.plateNumber,
        driverName: r.driverName,
        timestamp: r.timestamp,
        latitude: r.latitude,
        longitude: r.longitude,
        locationName: r.stationName,
        fuelChangeLiters: r.sensorIncreaseLiters,
        fuelLevelBefore: 20,
        fuelLevelAfter: 85,
        ignitionStatus: false,
        speedKmH: 0,
        riskLevel: r.reconciliationResult === 'MISMATCH_DETECTED' ? 'MEDIUM' : 'LOW',
        evidenceSummary: r.aiObservation,
      });
    });

    return markers;
  }
}

export const fuelIntelligenceService = FuelIntelligenceService.getInstance();
