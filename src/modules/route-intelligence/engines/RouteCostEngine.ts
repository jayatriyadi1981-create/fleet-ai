/**
 * Fleet Intelligence Smart AI - Route Cost Intelligence Engine
 * Computes comprehensive financial breakdown: Fuel, Tolls, Driver Hours,
 * Vehicle Depreciation, Maintenance Allocation, and Total Cost per KM.
 */

export interface RouteCostBreakdown {
  distanceKm: number;
  estimatedFuelCostIdr: number;
  estimatedTollCostIdr: number;
  driverWageCostIdr: number;
  maintenanceAllocationIdr: number;
  depreciationAllocationIdr: number;
  totalEstimatedCostIdr: number;
  costPerKmIdr: number;
  isPartialData: boolean;
}

export class RouteCostEngine {
  private static instance: RouteCostEngine;

  private constructor() {}

  public static getInstance(): RouteCostEngine {
    if (!RouteCostEngine.instance) {
      RouteCostEngine.instance = new RouteCostEngine();
    }
    return RouteCostEngine.instance;
  }

  public calculateRouteCost(params: {
    distanceKm: number;
    durationMinutes: number;
    fuelPricePerLiter?: number;
    litersPer100Km?: number;
    tollCostIdr?: number;
    driverHourlyRateIdr?: number;
    maintenanceCostPerKmIdr?: number;
  }): RouteCostBreakdown {
    const {
      distanceKm,
      durationMinutes,
      fuelPricePerLiter = 14500, // Solar / Dexlite IDR
      litersPer100Km = 24.0,     // Average commercial truck
      tollCostIdr = 38500,
      driverHourlyRateIdr = 35000,
      maintenanceCostPerKmIdr = 850,
    } = params;

    const fuelLiters = (distanceKm / 100) * litersPer100Km;
    const estimatedFuelCostIdr = Math.round(fuelLiters * fuelPricePerLiter);
    const durationHours = durationMinutes / 60;
    const driverWageCostIdr = Math.round(durationHours * driverHourlyRateIdr);
    const maintenanceAllocationIdr = Math.round(distanceKm * maintenanceCostPerKmIdr);
    const depreciationAllocationIdr = Math.round(distanceKm * 450); // IDR 450/km depreciation

    const totalEstimatedCostIdr = 
      estimatedFuelCostIdr +
      tollCostIdr +
      driverWageCostIdr +
      maintenanceAllocationIdr +
      depreciationAllocationIdr;

    const costPerKmIdr = distanceKm > 0 ? Math.round(totalEstimatedCostIdr / distanceKm) : 0;

    return {
      distanceKm,
      estimatedFuelCostIdr,
      estimatedTollCostIdr: tollCostIdr,
      driverWageCostIdr,
      maintenanceAllocationIdr,
      depreciationAllocationIdr,
      totalEstimatedCostIdr,
      costPerKmIdr,
      isPartialData: false,
    };
  }
}

export const routeCostEngine = RouteCostEngine.getInstance();
