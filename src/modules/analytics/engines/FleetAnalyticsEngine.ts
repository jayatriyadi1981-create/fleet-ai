/**
 * Fleet Intelligence Smart AI - Fleet Analytics Calculation Engine
 * PROMPT 36
 */

import {
  FleetKPIOverview,
  MetricDelta,
  VehicleUtilizationMetric,
  ProductivityWeightConfig,
  GlobalAnalyticsFilter,
  AnalyticsSnapshot,
  BranchPerformanceMatrix,
  DriverProductivityMetric,
  UtilizationFormulaType,
} from '../types';
import {
  MOCK_DAILY_SNAPSHOTS,
  MOCK_VEHICLE_UTILIZATION,
  MOCK_BRANCH_MATRICES,
  MOCK_DRIVER_PRODUCTIVITY,
} from '../data/mockAnalyticsData';

export class FleetAnalyticsEngine {
  private static instance: FleetAnalyticsEngine;

  public static getInstance(): FleetAnalyticsEngine {
    if (!FleetAnalyticsEngine.instance) {
      FleetAnalyticsEngine.instance = new FleetAnalyticsEngine();
    }
    return FleetAnalyticsEngine.instance;
  }

  /**
   * Computes the global Fleet KPI Overview with Period Comparisons
   */
  public computeKPIOverview(
    snapshots: AnalyticsSnapshot[] = MOCK_DAILY_SNAPSHOTS,
    filter?: Partial<GlobalAnalyticsFilter>
  ): FleetKPIOverview {
    const currentList = snapshots.slice(-15);
    const previousList = snapshots.slice(0, 15);

    const calcAverage = (arr: AnalyticsSnapshot[], key: keyof AnalyticsSnapshot) => {
      if (arr.length === 0) return 0;
      const sum = arr.reduce((acc, curr) => acc + (typeof curr[key] === 'number' ? (curr[key] as number) : 0), 0);
      return sum / arr.length;
    };

    const calcSum = (arr: AnalyticsSnapshot[], key: keyof AnalyticsSnapshot) => {
      return arr.reduce((acc, curr) => acc + (typeof curr[key] === 'number' ? (curr[key] as number) : 0), 0);
    };

    const createDelta = (curr: number, prev: number, isHigherBetter = true): MetricDelta => {
      const diff = Math.round((curr - prev) * 10) / 10;
      const pct = prev !== 0 ? Math.round(((curr - prev) / prev) * 1000) / 10 : 0;
      const trend = diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral';
      const isPositive = isHigherBetter ? diff >= 0 : diff <= 0;

      return {
        currentValue: Math.round(curr * 10) / 10,
        previousValue: Math.round(prev * 10) / 10,
        absoluteDiff: diff,
        percentChange: pct,
        trend,
        isPositive,
      };
    };

    const currUtil = calcAverage(currentList, 'utilizationRate');
    const prevUtil = calcAverage(previousList, 'utilizationRate');

    const currProd = calcAverage(currentList, 'productivityScore');
    const prevProd = calcAverage(previousList, 'productivityScore');

    const currMileage = calcSum(currentList, 'mileageKm');
    const prevMileage = calcSum(previousList, 'mileageKm');

    const currTrips = calcSum(currentList, 'tripsCount');
    const prevTrips = calcSum(previousList, 'tripsCount');

    const currActive = calcAverage(currentList, 'activeCount');
    const prevActive = calcAverage(previousList, 'activeCount');

    const currIdle = calcAverage(currentList, 'idlePercent');
    const prevIdle = calcAverage(previousList, 'idlePercent');

    const currDowntime = calcAverage(currentList, 'downtimePercent');
    const prevDowntime = calcAverage(previousList, 'downtimePercent');

    const currAvail = calcAverage(currentList, 'availabilityPercent');
    const prevAvail = calcAverage(previousList, 'availabilityPercent');

    const currCost = calcSum(currentList, 'totalCostIdr');
    const prevCost = calcSum(previousList, 'totalCostIdr');

    return {
      utilizationRate: createDelta(currUtil, prevUtil, true),
      productivityScore: createDelta(currProd, prevProd, true),
      totalMileageKm: createDelta(currMileage, prevMileage, true),
      completedTripsCount: createDelta(currTrips, prevTrips, true),
      activeVehiclesCount: createDelta(currActive, prevActive, true),
      idleTimePercent: createDelta(currIdle, prevIdle, false),
      downtimePercent: createDelta(currDowntime, prevDowntime, false),
      avgTripDurationMinutes: createDelta(204, 218, false),
      vehicleAvailabilityPercent: createDelta(currAvail, prevAvail, true),
      onTimeDeliveryRate: createDelta(94.6, 91.2, true),
      totalFuelLiters: createDelta(currMileage / 4.8, prevMileage / 4.7, false),
      totalEstimatedIdleCostIdr: createDelta(currCost * 0.12, prevCost * 0.14, false),
      mttrHours: createDelta(18.5, 24.0, false), // repair time
      mtbfHours: createDelta(280, 240, true), // between failures
    };
  }

  /**
   * Calculates custom utilization based on formula choice
   */
  public calculateUtilization(
    vehicle: VehicleUtilizationMetric,
    formula: UtilizationFormulaType,
    fleetAverages = { avgDistance: 5000, avgTrips: 45 }
  ): number {
    switch (formula) {
      case 'TIME_BASED':
        return vehicle.totalAvailableHours > 0
          ? Math.round((vehicle.operatingHours / vehicle.totalAvailableHours) * 1000) / 10
          : 0;

      case 'DISTANCE_BASED':
        // Normalized against baseline 5000km target
        return Math.min(100, Math.round((vehicle.mileageKm / fleetAverages.avgDistance) * 1000) / 10);

      case 'TRIP_BASED':
        // Normalized against baseline 45 trips target
        return Math.min(100, Math.round((vehicle.tripCount / fleetAverages.avgTrips) * 1000) / 10);

      default:
        return vehicle.utilizationRate;
    }
  }

  /**
   * Computes weighted productivity score for a vehicle
   */
  public computeWeightedProductivity(
    vehicle: VehicleUtilizationMetric,
    weights: ProductivityWeightConfig
  ): number {
    // Normalization scores 0-100
    const utilScore = Math.min(100, vehicle.utilizationRate);
    const tripScore = Math.min(100, (vehicle.tripCount / 50) * 100);
    const onTimeScore = 95.0; // standard sample baseline
    const idleScore = Math.max(0, 100 - (vehicle.idleHours / (vehicle.operatingHours || 1)) * 300);
    const downtimeScore = Math.max(0, 100 - (vehicle.downtimeHours / (vehicle.totalAvailableHours || 1)) * 500);
    const availScore = Math.max(0, 100 - (vehicle.downtimeHours + vehicle.offlineHours) * 0.5);

    const weightedTotal =
      utilScore * weights.utilizationWeight +
      tripScore * weights.tripCompletionWeight +
      onTimeScore * weights.onTimeWeight +
      idleScore * weights.idleWeight +
      downtimeScore * weights.downtimeWeight +
      availScore * weights.availabilityWeight;

    return Math.round(weightedTotal * 10) / 10;
  }

  /**
   * Computes MTTR (Mean Time to Repair)
   */
  public computeMTTR(totalRepairHours: number, repairEventsCount: number): number {
    if (repairEventsCount === 0) return 0;
    return Math.round((totalRepairHours / repairEventsCount) * 10) / 10;
  }

  /**
   * Computes MTBF (Mean Time Between Failures)
   */
  public computeMTBF(totalOperationalHours: number, failureEventsCount: number): number {
    if (failureEventsCount === 0) return totalOperationalHours;
    return Math.round((totalOperationalHours / failureEventsCount) * 10) / 10;
  }
}

export const fleetAnalyticsEngine = FleetAnalyticsEngine.getInstance();
