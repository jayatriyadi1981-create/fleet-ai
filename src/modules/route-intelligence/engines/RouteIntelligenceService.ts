/**
 * Fleet Intelligence Smart AI - Central Route Intelligence Service
 * Single source of truth for Route KPIs, Active Trips, Live ETA, Traffic Conditions,
 * Route Deviations, Historical Analytics, Delivery Plans, and Cross-Module Correlation.
 */

import { 
  ActiveTripRouteItem, 
  RouteIntelligenceKPIs, 
  RouteFilterState, 
  HistoricalRouteItem, 
  RouteDeviationEvent, 
  AIRouteRecommendation, 
  DeliveryOptimizationPlan,
  AlternativeRouteOption,
  OptimizationObjective,
  OptimizationWeights,
  VehicleRestrictionInfo,
  RouteCoordinates
} from '../types';

import { routeOptimizationEngine } from './RouteOptimizationEngine';
import { etaPredictionEngine } from './ETAPredictionEngine';
import { trafficIntelligenceEngine } from './TrafficIntelligenceEngine';
import { routeDeviationEngine } from './RouteDeviationEngine';
import { historicalRouteEngine } from './HistoricalRouteEngine';
import { routeRiskEngine } from './RouteRiskEngine';
import { deliveryOptimizationEngine } from './DeliveryOptimizationEngine';
import { routeCostEngine } from './RouteCostEngine';
import { aiRouteAdvisorEngine } from './AIRouteAdvisorEngine';

export class RouteIntelligenceService {
  private static instance: RouteIntelligenceService;

  private activeTrips: ActiveTripRouteItem[] = [
    {
      tripId: 'trip-1024',
      tripNumber: 'TRIP-JKT-BDG-1024',
      vehicleId: 'v-b1234xx',
      plateNumber: 'B 1234 XX',
      vehicleType: 'Wingbox Heavy Truck 20T',
      driverId: 'drv-001',
      driverName: 'Bambang Supriyanto',
      branch: 'Jakarta Timur (Cakung)',
      origin: 'DC Cakung, Jakarta Timur',
      destination: 'Hub Gedebage, Bandung',
      plannedDistanceKm: 148.5,
      actualDistanceKm: 42.1,
      remainingDistanceKm: 106.4,
      currentSpeedKmh: 22,
      heading: 115,
      currentLocation: { lat: -6.2280, lng: 106.9190, address: 'Jl. Inspeksi Kalimalang (Off-Corridor 420m)' },
      departureTime: '08:00',
      scheduledArrival: '11:15',
      predictedETA: '11:38',
      etaRange: '11:32 - 11:44',
      previousETA: '11:20',
      etaChangeMinutes: 18,
      etaChangeFactors: [
        'Kepadatan lalu lintas segmen Cikunir KM 14 (+14 mnt)',
        'Terdeteksi deviasi jalur aktif keluar tol Kalimalang (+6 mnt)',
      ],
      delayRisk: 'HIGH',
      trafficStatus: 'HEAVY',
      trafficDelayMinutes: 14,
      routeStatus: 'DEVIATED',
      routeComplianceScore: 84,
      currentWaypointIndex: 1,
      totalWaypoints: 3,
      waypoints: [
        { id: 'wp-1', order: 1, lat: -6.2340, lng: 106.9150, name: 'Check-point Gerbang Cikunir', reached: true, reachedAt: '08:20' },
        { id: 'wp-2', order: 2, lat: -6.4420, lng: 107.1850, name: 'Rest Area KM 57 (Refuel/Inspection)', reached: false, estimatedArrival: '09:45' },
        { id: 'wp-3', order: 3, lat: -6.8920, lng: 107.5620, name: 'Gerbang Tol Pasteur Exit', reached: false, estimatedArrival: '11:15' },
      ],
      activeDeviation: routeDeviationEngine.getAllDeviations()[0],
      dataQuality: 'HIGH',
      modelVersion: 'v2.4-gradient-boosted-eta',
      fuelEstimatedLiters: 32.8,
      fuelConsumedLiters: 9.4,
      plannedPath: [
        { lat: -6.1850, lng: 106.9450, name: 'DC Cakung' },
        { lat: -6.2340, lng: 106.9150, name: 'Tol Japek KM 12' },
        { lat: -6.3250, lng: 107.0520, name: 'Tol Cikarang Utama' },
        { lat: -6.4420, lng: 107.1850, name: 'KM 57' },
        { lat: -6.6450, lng: 107.4120, name: 'Cipularang KM 94' },
        { lat: -6.9420, lng: 107.6850, name: 'Hub Gedebage' },
      ],
      actualPath: [
        { lat: -6.1850, lng: 106.9450, name: 'DC Cakung' },
        { lat: -6.2180, lng: 106.9320, name: 'Pintu Tol Pulogebang' },
        { lat: -6.2340, lng: 106.9150, name: 'Cikunir Ramp' },
        { lat: -6.2280, lng: 106.9190, name: 'Arteri Kalimalang (Deviated)' },
      ],
      maintenanceRiskLevel: 'LOW',
    },
    {
      tripId: 'trip-1025',
      tripNumber: 'TRIP-JKT-SMG-1025',
      vehicleId: 'v-b5678cd',
      plateNumber: 'B 5678 CD',
      vehicleType: 'Box Truck Tronton 15T',
      driverId: 'drv-002',
      driverName: 'Suryo Nugroho',
      branch: 'Jakarta Utara (Marunda)',
      origin: 'DC Marunda, Jakarta Utara',
      destination: 'Hub Krapyak, Semarang',
      plannedDistanceKm: 438.0,
      actualDistanceKm: 215.0,
      remainingDistanceKm: 223.0,
      currentSpeedKmh: 72,
      heading: 95,
      currentLocation: { lat: -6.7450, lng: 108.5250, address: 'Tol Cipali KM 182 (Kanci - Pejagan)' },
      departureTime: '05:30',
      scheduledArrival: '12:00',
      predictedETA: '11:45',
      etaRange: '11:40 - 11:50',
      previousETA: '11:48',
      etaChangeMinutes: -3,
      etaChangeFactors: ['Kecepatan stabil di jalan tol trans jawa (72 km/jam).'],
      delayRisk: 'LOW',
      trafficStatus: 'LIGHT',
      trafficDelayMinutes: 2,
      routeStatus: 'ON_ROUTE',
      routeComplianceScore: 98,
      currentWaypointIndex: 2,
      totalWaypoints: 4,
      waypoints: [
        { id: 'wp-smg-1', order: 1, lat: -6.4420, lng: 107.1850, name: 'Rest Area KM 102 Cipali', reached: true, reachedAt: '07:15' },
        { id: 'wp-smg-2', order: 2, lat: -6.7450, lng: 108.5250, name: 'Rest Area KM 207 Cirebon', reached: true, reachedAt: '09:05' },
        { id: 'wp-smg-3', order: 3, lat: -6.8950, lng: 109.1240, name: 'Rest Area KM 379 Gringsing', reached: false, estimatedArrival: '10:45' },
        { id: 'wp-smg-4', order: 4, lat: -6.9850, lng: 110.3340, name: 'Gerbang Tol Kalikangkung', reached: false, estimatedArrival: '11:40' },
      ],
      dataQuality: 'HIGH',
      modelVersion: 'v2.4-gradient-boosted-eta',
      fuelEstimatedLiters: 96.4,
      fuelConsumedLiters: 48.1,
      plannedPath: [
        { lat: -6.1150, lng: 106.9450, name: 'DC Marunda' },
        { lat: -6.4420, lng: 107.1850, name: 'KM 102' },
        { lat: -6.7450, lng: 108.5250, name: 'KM 207 Cirebon' },
        { lat: -6.8950, lng: 109.6240, name: 'Pekalongan Batang' },
        { lat: -6.9850, lng: 110.3340, name: 'Hub Krapyak' },
      ],
      actualPath: [
        { lat: -6.1150, lng: 106.9450, name: 'DC Marunda' },
        { lat: -6.4420, lng: 107.1850, name: 'KM 102' },
        { lat: -6.7450, lng: 108.5250, name: 'KM 207 Cirebon' },
      ],
      maintenanceRiskLevel: 'LOW',
    },
    {
      tripId: 'trip-1026',
      tripNumber: 'TRIP-SBY-MLG-1026',
      vehicleId: 'v-l9876ab',
      plateNumber: 'L 9876 AB',
      vehicleType: 'Medium CDE Refrigerator 8T',
      driverId: 'drv-003',
      driverName: 'Heri Wicaksono',
      branch: 'Surabaya (Rungkut)',
      origin: 'Hub Rungkut, Surabaya',
      destination: 'Depot Kepanjen, Malang',
      plannedDistanceKm: 98.2,
      actualDistanceKm: 68.0,
      remainingDistanceKm: 30.2,
      currentSpeedKmh: 14,
      heading: 190,
      currentLocation: { lat: -7.8650, lng: 112.6780, address: 'Simpang Lawang - Singosari (Pasar Lawang)' },
      departureTime: '07:00',
      scheduledArrival: '09:00',
      predictedETA: '09:42',
      etaRange: '09:36 - 09:48',
      previousETA: '09:15',
      etaChangeMinutes: 27,
      etaChangeFactors: [
        'Kemacetan parah di Pasar Lawang & perlintasan KA Singosari (+24 mnt)',
        'Kecepatan telemetri merayap 14 km/jam',
      ],
      delayRisk: 'CRITICAL',
      trafficStatus: 'SEVERE',
      trafficDelayMinutes: 24,
      routeStatus: 'DELAYED',
      routeComplianceScore: 79,
      currentWaypointIndex: 2,
      totalWaypoints: 2,
      waypoints: [
        { id: 'wp-mlg-1', order: 1, lat: -7.5520, lng: 112.6840, name: 'Exit Tol Pandaan', reached: true, reachedAt: '07:55' },
        { id: 'wp-mlg-2', order: 2, lat: -7.9850, lng: 112.6340, name: 'Depot Kepanjen', reached: false, estimatedArrival: '09:42' },
      ],
      dataQuality: 'HIGH',
      modelVersion: 'v2.4-gradient-boosted-eta',
      fuelEstimatedLiters: 24.2,
      fuelConsumedLiters: 19.5,
      plannedPath: [
        { lat: -7.3250, lng: 112.7850, name: 'Hub Rungkut' },
        { lat: -7.5520, lng: 112.6840, name: 'Pandaan' },
        { lat: -7.8650, lng: 112.6780, name: 'Lawang' },
        { lat: -8.1250, lng: 112.5720, name: 'Depot Kepanjen' },
      ],
      actualPath: [
        { lat: -7.3250, lng: 112.7850, name: 'Hub Rungkut' },
        { lat: -7.5520, lng: 112.6840, name: 'Pandaan' },
        { lat: -7.8650, lng: 112.6780, name: 'Lawang' },
      ],
      maintenanceRiskLevel: 'HIGH',
    },
    {
      tripId: 'trip-1027',
      tripNumber: 'TRIP-JKT-BKS-1027',
      vehicleId: 'v-b9012gh',
      plateNumber: 'B 9012 GH',
      vehicleType: 'Box Truck CDD 10T',
      driverId: 'drv-004',
      driverName: 'Agus Pratama',
      branch: 'Jakarta Timur (Cakung)',
      origin: 'DC Cakung, Jakarta Timur',
      destination: 'PT. Cikarang Logistik Mega',
      plannedDistanceKm: 38.5,
      actualDistanceKm: 18.0,
      remainingDistanceKm: 20.5,
      currentSpeedKmh: 45,
      heading: 105,
      currentLocation: { lat: -6.2480, lng: 106.9850, address: 'Tol Jakarta-Cikampek KM 24 (Tambun)' },
      departureTime: '08:15',
      scheduledArrival: '09:30',
      predictedETA: '09:28',
      etaRange: '09:24 - 09:32',
      previousETA: '09:30',
      etaChangeMinutes: -2,
      etaChangeFactors: ['Kondisi arus lancar setelah melewati Cikunir.'],
      delayRisk: 'LOW',
      trafficStatus: 'LIGHT',
      trafficDelayMinutes: 0,
      routeStatus: 'ON_ROUTE',
      routeComplianceScore: 96,
      currentWaypointIndex: 1,
      totalWaypoints: 2,
      waypoints: [
        { id: 'wp-bks-1', order: 1, lat: -6.2410, lng: 106.9920, name: 'Drop 1: Bekasi Barat', reached: false, estimatedArrival: '08:50' },
        { id: 'wp-bks-2', order: 2, lat: -6.3120, lng: 107.1450, name: 'Drop 2: Cikarang Jababeka', reached: false, estimatedArrival: '09:28' },
      ],
      dataQuality: 'HIGH',
      modelVersion: 'v2.4-gradient-boosted-eta',
      fuelEstimatedLiters: 9.2,
      fuelConsumedLiters: 4.3,
      plannedPath: [
        { lat: -6.1850, lng: 106.9450, name: 'DC Cakung' },
        { lat: -6.2480, lng: 106.9850, name: 'KM 24' },
        { lat: -6.3120, lng: 107.1450, name: 'Cikarang' },
      ],
      actualPath: [
        { lat: -6.1850, lng: 106.9450, name: 'DC Cakung' },
        { lat: -6.2480, lng: 106.9850, name: 'KM 24' },
      ],
      maintenanceRiskLevel: 'HIGH',
    },
  ];

  private constructor() {}

  public static getInstance(): RouteIntelligenceService {
    if (!RouteIntelligenceService.instance) {
      RouteIntelligenceService.instance = new RouteIntelligenceService();
    }
    return RouteIntelligenceService.instance;
  }

  public getKPIs(filter?: Partial<RouteFilterState>): RouteIntelligenceKPIs {
    const trips = this.getActiveTrips(filter);
    const activeTripsCount = trips.length;
    const etaRiskCount = trips.filter((t) => t.delayRisk === 'HIGH' || t.delayRisk === 'CRITICAL').length;
    const activeDeviationsCount = trips.filter((t) => t.routeStatus === 'DEVIATED').length;
    const delayedTripsCount = trips.filter((t) => t.routeStatus === 'DELAYED' || t.etaChangeMinutes > 10).length;

    const totalCompliance = trips.reduce((acc, t) => acc + t.routeComplianceScore, 0);
    const routeComplianceScore = activeTripsCount > 0 ? Math.round(totalCompliance / activeTripsCount) : 95;

    const totalDelay = trips.reduce((acc, t) => acc + Math.max(0, t.etaChangeMinutes), 0);
    const averageDelayMinutes = activeTripsCount > 0 ? Number((totalDelay / activeTripsCount).toFixed(1)) : 8.5;

    return {
      activeTripsCount: 42, // Total across tenant fleet
      etaRiskCount: 8,
      activeDeviationsCount: 5,
      routeEfficiencyScore: 87,
      averageEtaAccuracy: 94.2,
      delayedTripsCount: 6,
      routeComplianceScore: 91,
      averageDelayMinutes: 7.8,
      onTimeRate: 91.4,
      trafficImpactMinutes: 16.5,
      fuelEfficiencyIndex: 92.0,
    };
  }

  public getActiveTrips(filter?: Partial<RouteFilterState>): ActiveTripRouteItem[] {
    let list = [...this.activeTrips];

    if (filter?.branch && filter.branch !== 'ALL') {
      list = list.filter((t) => t.branch.toLowerCase().includes(filter.branch!.toLowerCase()));
    }
    if (filter?.routeStatus && filter.routeStatus !== 'ALL') {
      list = list.filter((t) => t.routeStatus === filter.routeStatus);
    }
    if (filter?.etaRisk && filter.etaRisk !== 'ALL') {
      list = list.filter((t) => t.delayRisk === filter.etaRisk);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter((t) => 
        t.plateNumber.toLowerCase().includes(q) ||
        t.driverName.toLowerCase().includes(q) ||
        t.tripNumber.toLowerCase().includes(q) ||
        t.destination.toLowerCase().includes(q)
      );
    }

    return list;
  }

  public getTripById(tripId: string): ActiveTripRouteItem | undefined {
    return this.activeTrips.find((t) => t.tripId === tripId);
  }

  public getHistoricalRoutes(): HistoricalRouteItem[] {
    return historicalRouteEngine.getAllHistoricalRoutes();
  }

  public getDeviations(): RouteDeviationEvent[] {
    return routeDeviationEngine.getAllDeviations();
  }

  public getRecommendations(): AIRouteRecommendation[] {
    return aiRouteAdvisorEngine.getAllRecommendations();
  }

  public getDeliveryPlans(): DeliveryOptimizationPlan[] {
    return deliveryOptimizationEngine.getAllPlans();
  }

  public getTrafficSegments() {
    return trafficIntelligenceEngine.getAllSegments();
  }

  public optimizeRoute(params: {
    origin: RouteCoordinates;
    destination: RouteCoordinates;
    vehicleType: string;
    objective: OptimizationObjective;
    customWeights?: OptimizationWeights;
    restrictions?: VehicleRestrictionInfo;
  }) {
    return routeOptimizationEngine.generateRouteAlternatives(params);
  }

  public calculateRouteCost(distanceKm: number, durationMinutes: number) {
    return routeCostEngine.calculateRouteCost({ distanceKm, durationMinutes });
  }

  public assessRouteRisk(params: {
    trafficDelayMinutes: number;
    historicalDelayMinutes: number;
    deviationCount: number;
    driverSafetyScore?: number;
    vehicleMaintenanceRisk?: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  }) {
    return routeRiskEngine.assessRouteRisk(params);
  }
}

export const routeIntelligenceService = RouteIntelligenceService.getInstance();
