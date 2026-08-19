/**
 * Fleet Intelligence Smart AI - Vehicle Health Engine
 * Evaluates composite vehicle health score (0-100) based on actual multi-source telemetry,
 * inspection reports, service schedule compliance, engine fault diagnostics, and anomaly metrics.
 */

import { VehicleHealthGrade, PredictionQuality } from '../types';

export interface HealthCalculationInput {
  hasSufficientData: boolean;
  telemetryOnline: boolean;
  activeDTCsCount: number;
  batteryVoltage?: number;
  coolantTempC?: number;
  oilPressureKpa?: number;
  isServiceOverdue: boolean;
  serviceOverdueKm?: number;
  failedInspectionItemsCount: number;
  attentionInspectionItemsCount: number;
  harshEventsPer100Km: number;
  fuelAnomalyCount: number;
  repeatedRepairsCount: number;
}

export class VehicleHealthEngine {
  /**
   * Calculates deterministic vehicle health score and grade
   */
  public static calculateHealthScore(input: HealthCalculationInput): {
    score: number;
    grade: VehicleHealthGrade;
    dataQuality: PredictionQuality;
    breakdown: {
      engineHealthDeduction: number;
      batteryHealthDeduction: number;
      serviceComplianceDeduction: number;
      inspectionDeduction: number;
      behaviorAnomalyDeduction: number;
    };
  } {
    if (!input.hasSufficientData) {
      return {
        score: 0,
        grade: 'INSUFFICIENT_DATA',
        dataQuality: 'INSUFFICIENT_DATA',
        breakdown: {
          engineHealthDeduction: 0,
          batteryHealthDeduction: 0,
          serviceComplianceDeduction: 0,
          inspectionDeduction: 0,
          behaviorAnomalyDeduction: 0,
        },
      };
    }

    let currentScore = 100;
    let engineDeduction = 0;
    let batteryDeduction = 0;
    let serviceDeduction = 0;
    let inspectionDeduction = 0;
    let anomalyDeduction = 0;

    // 1. Engine & Diagnostics DTC (up to 30 pts)
    if (input.activeDTCsCount > 0) {
      engineDeduction += Math.min(25, input.activeDTCsCount * 12);
    }
    if (input.coolantTempC && input.coolantTempC > 102) {
      engineDeduction += 15;
    } else if (input.coolantTempC && input.coolantTempC > 96) {
      engineDeduction += 6;
    }
    if (input.oilPressureKpa && input.oilPressureKpa < 150) {
      engineDeduction += 15;
    }

    // 2. Battery Telemetry (up to 20 pts)
    if (input.batteryVoltage !== undefined) {
      if (input.batteryVoltage < 23.8) {
        batteryDeduction += 20; // Critical for 24V commercial system or 12V under 11.8V
      } else if (input.batteryVoltage < 24.5) {
        batteryDeduction += 10;
      }
    }

    // 3. Service Compliance & Overdue (up to 25 pts)
    if (input.isServiceOverdue) {
      const overdueKm = input.serviceOverdueKm || 500;
      if (overdueKm > 2000) {
        serviceDeduction += 25;
      } else if (overdueKm > 1000) {
        serviceDeduction += 18;
      } else {
        serviceDeduction += 10;
      }
    }

    // 4. Inspection Findings (up to 20 pts)
    if (input.failedInspectionItemsCount > 0) {
      inspectionDeduction += Math.min(20, input.failedInspectionItemsCount * 10);
    }
    if (input.attentionInspectionItemsCount > 0) {
      inspectionDeduction += Math.min(10, input.attentionInspectionItemsCount * 3);
    }

    // 5. Driver Behavior & Fuel Anomaly Cross-Correlations (up to 15 pts)
    if (input.harshEventsPer100Km > 8) {
      anomalyDeduction += 8;
    } else if (input.harshEventsPer100Km > 4) {
      anomalyDeduction += 4;
    }
    if (input.fuelAnomalyCount > 0) {
      anomalyDeduction += Math.min(7, input.fuelAnomalyCount * 3);
    }
    if (input.repeatedRepairsCount > 1) {
      anomalyDeduction += Math.min(10, input.repeatedRepairsCount * 4);
    }

    const totalDeduction =
      Math.min(30, engineDeduction) +
      Math.min(20, batteryDeduction) +
      Math.min(25, serviceDeduction) +
      Math.min(20, inspectionDeduction) +
      Math.min(15, anomalyDeduction);

    currentScore = Math.max(0, Math.min(100, Math.round(100 - totalDeduction)));

    // Determine Grade
    let grade: VehicleHealthGrade = 'GOOD';
    if (currentScore >= 90) {
      grade = 'EXCELLENT';
    } else if (currentScore >= 75) {
      grade = 'GOOD';
    } else if (currentScore >= 60) {
      grade = 'ATTENTION';
    } else if (currentScore >= 40) {
      grade = 'POOR';
    } else {
      grade = 'CRITICAL';
    }

    // Determine Data Quality
    let dataQuality: PredictionQuality = 'HIGH';
    if (!input.telemetryOnline) {
      dataQuality = 'MEDIUM';
    }

    return {
      score: currentScore,
      grade,
      dataQuality,
      breakdown: {
        engineHealthDeduction: Math.min(30, engineDeduction),
        batteryHealthDeduction: Math.min(20, batteryDeduction),
        serviceComplianceDeduction: Math.min(25, serviceDeduction),
        inspectionDeduction: Math.min(20, inspectionDeduction),
        behaviorAnomalyDeduction: Math.min(15, anomalyDeduction),
      },
    };
  }
}
