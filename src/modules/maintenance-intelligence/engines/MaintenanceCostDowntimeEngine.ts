/**
 * Fleet Intelligence Smart AI - Maintenance Cost & Downtime Engine
 * Evaluates financial maintenance cost per KM, workshop duration, vehicle availability rates,
 * and component expense breakdown.
 */

import { MaintenanceCostAnalysis, ComponentCategory } from '../types';

export class MaintenanceCostDowntimeEngine {
  public static calculateCostIntelligence(params: {
    totalCost: number;
    previousCost: number;
    totalDistanceKm: number;
    vehicleCount: number;
    downtimeHours: number;
    costPerHourDowntime: number;
    componentCosts: { component: ComponentCategory; componentName: string; totalCost: number; repairCount: number }[];
    outliers: {
      vehicleId: string;
      plateNumber: string;
      branch: string;
      totalCost: number;
      mileageKm: number;
      primaryDriver: string;
    }[];
  }): MaintenanceCostAnalysis {
    const costTrendPercentage = params.previousCost > 0
      ? Math.round(((params.totalCost - params.previousCost) / params.previousCost) * 100)
      : 0;

    const averageCostPerVehicle = params.vehicleCount > 0
      ? Math.round(params.totalCost / params.vehicleCount)
      : 0;

    const averageCostPerKm = params.totalDistanceKm > 0
      ? Math.round(params.totalCost / params.totalDistanceKm)
      : 0;

    const downtimeCostEstimated = params.downtimeHours * (params.costPerHourDowntime || 150000);

    const sumComponentCosts = params.componentCosts.reduce((acc, c) => acc + c.totalCost, 0) || 1;
    const costByComponent = params.componentCosts.map(c => ({
      component: c.component,
      componentName: c.componentName,
      totalCost: c.totalCost,
      percentage: Math.round((c.totalCost / sumComponentCosts) * 100),
      repairCount: c.repairCount,
    }));

    const costByMaintenanceType = [
      { type: 'Preventif (Servis Berkala)', cost: Math.round(params.totalCost * 0.48), percentage: 48 },
      { type: 'Korektif (Perbaikan Kerusakan)', cost: Math.round(params.totalCost * 0.36), percentage: 36 },
      { type: 'Prediktif / Pergantian Awal', cost: Math.round(params.totalCost * 0.12), percentage: 12 },
      { type: 'Darurat (Breakdown)', cost: Math.round(params.totalCost * 0.04), percentage: 4 },
    ];

    const topCostOutlierVehicles = params.outliers.map(o => {
      const vCostPerKm = o.mileageKm > 0 ? Math.round(o.totalCost / o.mileageKm) : 0;
      const percentageAbove = averageCostPerVehicle > 0
        ? Math.round(((o.totalCost - averageCostPerVehicle) / averageCostPerVehicle) * 100)
        : 0;

      return {
        vehicleId: o.vehicleId,
        plateNumber: o.plateNumber,
        branch: o.branch,
        totalCost: o.totalCost,
        costPerKm: vCostPerKm,
        percentageAboveAverage: Math.max(0, percentageAbove),
        primaryCostDriver: o.primaryDriver,
      };
    });

    return {
      totalCostPeriod: params.totalCost,
      totalCostPreviousPeriod: params.previousCost,
      costTrendPercentage,
      averageCostPerVehicle,
      averageCostPerKm,
      totalDowntimeHours: params.downtimeHours,
      downtimeCostEstimated,
      costByComponent,
      costByMaintenanceType,
      topCostOutlierVehicles,
    };
  }
}
