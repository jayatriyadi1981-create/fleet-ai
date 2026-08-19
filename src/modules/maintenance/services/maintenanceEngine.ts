/**
 * Fleet Intelligence Smart AI - Maintenance Engine Service
 * PROMPT 25 - Core Mathematical & Business Logic for Predictive Maintenance
 */

import {
  MaintenanceSchedule,
  VehicleHealth,
  WorkOrder,
  Part,
  PartTransaction,
  MaintenanceOverviewKPIs
} from '../types';

export class MaintenanceEngine {
  /**
   * Calculates schedule status based on remaining KM and Days
   */
  static calculateScheduleStatus(
    schedule: MaintenanceSchedule,
    currentOdometer: number,
    currentEngineHours: number,
    dueSoonKmThreshold: number = 1000,
    dueSoonDaysThreshold: number = 14
  ): {
    remainingKm: number;
    remainingDays: number;
    status: 'UPCOMING' | 'DUE_SOON' | 'DUE' | 'OVERDUE';
  } {
    const remainingKm = schedule.nextDueOdometer - currentOdometer;
    
    // Remaining days calculation
    const now = new Date();
    const dueDate = new Date(schedule.nextDueDate);
    const diffTime = dueDate.getTime() - now.getTime();
    const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let status: 'UPCOMING' | 'DUE_SOON' | 'DUE' | 'OVERDUE' = 'UPCOMING';

    if (remainingKm <= 0 || remainingDays <= 0) {
      status = 'OVERDUE';
    } else if (remainingKm <= 200 || remainingDays <= 2) {
      status = 'DUE';
    } else if (remainingKm <= dueSoonKmThreshold || remainingDays <= dueSoonDaysThreshold) {
      status = 'DUE_SOON';
    }

    return {
      remainingKm,
      remainingDays,
      status,
    };
  }

  /**
   * Calculates Vehicle Health Score (0 - 100) based on weighted parameters
   */
  static calculateVehicleHealthScore(params: {
    serviceCompliancePct: number; // weight 30%
    openCriticalIssues: number;   // -25 pts each
    openMinorIssues: number;      // -8 pts each
    breakdownCountLast90Days: number; // -15 pts each
    overdueDays: number;          // -2 pts per overdue day
    batteryVoltage?: number;      // <24.5V = -10 pts
    brakeWearPct?: number;        // >80% = -15 pts
  }): { score: number; status: 'HEALTHY' | 'GOOD' | 'ATTENTION' | 'AT_RISK' | 'CRITICAL' } {
    let score = 100;

    // Service compliance deduction
    const complianceDeduction = (100 - Math.min(100, params.serviceCompliancePct)) * 0.3;
    score -= complianceDeduction;

    // Issue deductions
    score -= params.openCriticalIssues * 25;
    score -= params.openMinorIssues * 8;
    score -= params.breakdownCountLast90Days * 15;

    // Overdue deductions
    if (params.overdueDays > 0) {
      score -= Math.min(30, params.overdueDays * 2);
    }

    // Telemetry deductions
    if (params.batteryVoltage && params.batteryVoltage < 24.5 && params.batteryVoltage > 18) {
      score -= 10;
    }
    if (params.brakeWearPct && params.brakeWearPct > 80) {
      score -= 15;
    }

    // Clamp score
    score = Math.max(0, Math.min(100, Math.round(score)));

    let status: 'HEALTHY' | 'GOOD' | 'ATTENTION' | 'AT_RISK' | 'CRITICAL' = 'HEALTHY';
    if (score >= 90) status = 'HEALTHY';
    else if (score >= 80) status = 'GOOD';
    else if (score >= 65) status = 'ATTENTION';
    else if (score >= 50) status = 'AT_RISK';
    else status = 'CRITICAL';

    return { score, status };
  }

  /**
   * Calculates Total Maintenance Cost & Operating Cost
   */
  static calculateOperatingCost(
    fuelCostIdr: number,
    maintenanceCostIdr: number,
    distanceKm: number
  ): {
    totalOperatingCostIdr: number;
    costPerKm: number;
  } {
    const totalOperatingCostIdr = fuelCostIdr + maintenanceCostIdr;
    const costPerKm = distanceKm > 0 ? Math.round(totalOperatingCostIdr / distanceKm) : 0;
    return {
      totalOperatingCostIdr,
      costPerKm,
    };
  }

  /**
   * Format Currency to Rupiah
   */
  static formatIdr(amount: number): string {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  }
}
