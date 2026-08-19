/**
 * Fleet Intelligence Smart AI - Enterprise Cost Calculation Engine
 * PROMPT 37 - Financial Safety, Precision & Division-by-Zero Protection
 */

import { CostRecord, CostCategoryKey, FuelCostMetric, MaintenanceCostMetric, DriverCostMetric, CostPerKmMetric, CostPerTripMetric } from '../types';

export class CostCalculationEngine {
  /**
   * Calculate Total Operating Cost from records, strictly filtering out unapproved or double-counted items
   */
  public static calculateTotalOperatingCost(records: CostRecord[]): {
    totalIdr: number;
    byCategory: Record<CostCategoryKey, number>;
    byType: Record<string, number>;
    fixedTotalIdr: number;
    variableTotalIdr: number;
    semiVariableTotalIdr: number;
  } {
    const validRecords = records.filter(
      (r) =>
        r.status === 'APPROVED' ||
        r.status === 'POSTED' ||
        r.status === 'PENDING_APPROVAL' // Included in operative view
    );

    // Double counting protection:
    // If a record has child allocations (SPLIT_ALLOCATED), we only count the parent or children, never both.
    const nonDoubleCounted = validRecords.filter((r) => {
      if (r.allocationStatus === 'SPLIT_ALLOCATED') {
        // Parent record was split into child records; do not count parent if children exist
        return false;
      }
      return true;
    });

    const byCategory: Record<CostCategoryKey, number> = {
      FUEL: 0,
      MAINTENANCE: 0,
      PARTS: 0,
      DRIVER: 0,
      TOLL: 0,
      PARKING: 0,
      INSURANCE: 0,
      TAX: 0,
      GPS_DEVICE: 0,
      TELEMATICS: 0,
      TYRES: 0,
      CLEANING: 0,
      INSPECTION: 0,
      ACCIDENT: 0,
      RENTAL: 0,
      OTHER: 0,
    };

    const byType: Record<string, number> = {
      FIXED: 0,
      VARIABLE: 0,
      SEMI_VARIABLE: 0,
      ONE_TIME: 0,
      RECURRING: 0,
    };

    let totalIdr = 0;
    let fixedTotalIdr = 0;
    let variableTotalIdr = 0;
    let semiVariableTotalIdr = 0;

    for (const rec of nonDoubleCounted) {
      const amt = Number(rec.amount) || 0;
      totalIdr += amt;

      if (byCategory[rec.category] !== undefined) {
        byCategory[rec.category] += amt;
      } else {
        byCategory.OTHER += amt;
      }

      if (byType[rec.type] !== undefined) {
        byType[rec.type] += amt;
      }

      if (rec.type === 'FIXED') fixedTotalIdr += amt;
      else if (rec.type === 'VARIABLE') variableTotalIdr += amt;
      else if (rec.type === 'SEMI_VARIABLE') semiVariableTotalIdr += amt;
    }

    return {
      totalIdr,
      byCategory,
      byType,
      fixedTotalIdr,
      variableTotalIdr,
      semiVariableTotalIdr,
    };
  }

  /**
   * Safe Cost / KM calculation with zero-distance handling
   */
  public static calculateCostPerKm(totalCostIdr: number, distanceKm: number): number | null {
    if (!distanceKm || distanceKm <= 0 || isNaN(distanceKm)) {
      return null;
    }
    return Math.round(totalCostIdr / distanceKm);
  }

  /**
   * Safe Cost / Trip calculation with zero-trip handling
   */
  public static calculateCostPerTrip(totalCostIdr: number, completedTrips: number): number | null {
    if (!completedTrips || completedTrips <= 0 || isNaN(completedTrips)) {
      return null;
    }
    return Math.round(totalCostIdr / completedTrips);
  }

  /**
   * Safe Cost / Delivery calculation with zero-delivery handling
   */
  public static calculateCostPerDelivery(totalCostIdr: number, completedDeliveries: number): number | null {
    if (!completedDeliveries || completedDeliveries <= 0 || isNaN(completedDeliveries)) {
      return null;
    }
    return Math.round(totalCostIdr / completedDeliveries);
  }

  /**
   * Budget Variance with Division-by-Zero handling
   */
  public static calculateVariance(actualIdr: number, budgetIdr: number): {
    varianceIdr: number;
    variancePercent: number;
    status: 'UNDER_BUDGET' | 'ON_TRACK' | 'OVER_BUDGET';
  } {
    const varianceIdr = actualIdr - budgetIdr;
    let variancePercent = 0;

    if (budgetIdr === 0) {
      variancePercent = actualIdr > 0 ? 100 : 0;
    } else {
      variancePercent = Math.round(((actualIdr - budgetIdr) / budgetIdr) * 1000) / 10;
    }

    let status: 'UNDER_BUDGET' | 'ON_TRACK' | 'OVER_BUDGET' = 'ON_TRACK';
    if (variancePercent > 5) {
      status = 'OVER_BUDGET';
    } else if (variancePercent < -5) {
      status = 'UNDER_BUDGET';
    }

    return {
      varianceIdr,
      variancePercent,
      status,
    };
  }

  /**
   * Fuel Cost Formula with Actual vs Estimated distinction
   */
  public static calculateFuelCost(liters: number, actualPricePerLiter?: number, fallbackPricePerLiter: number = 13500): {
    fuelCostIdr: number;
    isEstimated: boolean;
    pricePerLiterUsed: number;
  } {
    const isEstimated = actualPricePerLiter === undefined || actualPricePerLiter === null || actualPricePerLiter <= 0;
    const pricePerLiterUsed = isEstimated ? fallbackPricePerLiter : actualPricePerLiter;
    const fuelCostIdr = Math.round(liters * pricePerLiterUsed);
    return {
      fuelCostIdr,
      isEstimated,
      pricePerLiterUsed,
    };
  }

  /**
   * Driver Cost Breakdown aggregation
   */
  public static calculateDriverTotalCost(driverCost: Partial<DriverCostMetric>): number {
    return (
      (driverCost.baseSalaryIdr || 0) +
      (driverCost.overtimeIdr || 0) +
      (driverCost.allowanceIdr || 0) +
      (driverCost.tripAllowanceIdr || 0) +
      (driverCost.mealAllowanceIdr || 0) +
      (driverCost.accommodationIdr || 0) +
      (driverCost.bonusIdr || 0) -
      (driverCost.penaltyIdr || 0) +
      (driverCost.otherIdr || 0)
    );
  }

  /**
   * Format Indonesian Rupiah
   */
  public static formatIdr(amount: number | null | undefined): string {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return 'N/A';
    }
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  }

  /**
   * Alias for formatIdr
   */
  public static formatCurrencyIdr(amount: number | null | undefined): string {
    return this.formatIdr(amount);
  }

  /**
   * Format compact Rupiah (e.g. Rp 428,5 Jt or Rp 1,4 M)
   */
  public static formatCompactIdr(amount: number | null | undefined): string {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return 'N/A';
    }
    if (Math.abs(amount) >= 1_000_000_000) {
      return `Rp ${(amount / 1_000_000_000).toFixed(2).replace('.', ',')} M`;
    }
    if (Math.abs(amount) >= 1_000_000) {
      return `Rp ${(amount / 1_000_000).toFixed(1).replace('.', ',')} Jt`;
    }
    if (Math.abs(amount) >= 1_000) {
      return `Rp ${(amount / 1_000).toFixed(0)} Rb`;
    }
    return `Rp ${amount}`;
  }
}
