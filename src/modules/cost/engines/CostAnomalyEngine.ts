/**
 * Fleet Intelligence Smart AI - Cost Anomaly Detection Engine
 * PROMPT 37 - Multi-metric Cost Deviation & Fleet Threshold Analyzer
 */

import { CostPerKmMetric, VehicleCostProfile } from '../types';

export class CostAnomalyEngine {
  /**
   * Evaluates cost per KM against fleet average
   */
  public static evaluateCostPerKmStatus(
    vehicleCostPerKm: number,
    fleetAverageCostPerKm: number
  ): {
    status: 'NORMAL' | 'WARNING' | 'HIGH' | 'CRITICAL';
    variancePercent: number;
    description: string;
  } {
    if (!fleetAverageCostPerKm || fleetAverageCostPerKm <= 0) {
      return { status: 'NORMAL', variancePercent: 0, description: 'Rata-rata armada belum tersedia' };
    }

    const variancePercent = Math.round(((vehicleCostPerKm - fleetAverageCostPerKm) / fleetAverageCostPerKm) * 1000) / 10;

    let status: 'NORMAL' | 'WARNING' | 'HIGH' | 'CRITICAL' = 'NORMAL';
    let description = 'Biaya per KM berada dalam batas standar armada.';

    if (variancePercent > 40) {
      status = 'CRITICAL';
      description = `Biaya per KM melonjak kritis (+${variancePercent}%) di atas rata-rata armada. Perlu investigasi darurat komponen BBM & transmisi.`;
    } else if (variancePercent > 25) {
      status = 'HIGH';
      description = `Biaya per KM tinggi (+${variancePercent}%) di atas baseline. Efisiensi bahan bakar dan riwayat servis perlu diaudit.`;
    } else if (variancePercent > 10) {
      status = 'WARNING';
      description = `Biaya per KM sedikit di atas rata-rata armada (+${variancePercent}%). Perlu pemantauan gaya berkendara driver.`;
    } else if (variancePercent < -10) {
      description = `Sangat efisien (-${Math.abs(variancePercent)}% di bawah rata-rata armada).`;
    }

    return {
      status,
      variancePercent,
      description,
    };
  }

  /**
   * Detect recurring maintenance cost spikes
   */
  public static detectMaintenanceAnomalies(
    workOrdersCount: number,
    correctiveCostIdr: number,
    preventiveCostIdr: number
  ): {
    hasAnomaly: boolean;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    reason?: string;
  } {
    if (correctiveCostIdr > preventiveCostIdr * 3 && correctiveCostIdr > 15000000) {
      return {
        hasAnomaly: true,
        severity: 'HIGH',
        reason: 'Biaya perbaikan korektif darurat melebihi 3x lipat pemeliharaan preventif.',
      };
    }

    if (workOrdersCount >= 4 && correctiveCostIdr > 20000000) {
      return {
        hasAnomaly: true,
        severity: 'CRITICAL',
        reason: 'Unit mengalami 4+ kali perbaikan mendadak dalam 30 hari terakhir (potensi unit lemon/afkir).',
      };
    }

    return {
      hasAnomaly: false,
      severity: 'LOW',
    };
  }
}
