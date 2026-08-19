/**
 * Fleet Intelligence Smart AI - Fuel Efficiency Prediction Engine
 * Advanced forecasting model calculating expected fuel consumption and efficiency
 * across next trip, next 7 days, and next 30 days based on multi-variable telematics.
 */

import { FuelEfficiencyPredictionResult, FuelPredictionQuality } from '../types';

export class FuelPredictionEngine {
  /**
   * Predicts future fuel efficiency and consumption for a specific vehicle or fleet
   */
  public predictVehicleEfficiency(
    vehicleId: string,
    plateNumber: string,
    currentConsumptionL100Km: number,
    totalTrips: number,
    idleTrendPct: number,
    harshAccelTrendPct: number,
    maintenanceOverdue: boolean
  ): FuelEfficiencyPredictionResult {
    // 1. Data Sufficiency Check (PROMPT 30 Mandate: Never fabricate fake predictions on insufficient data)
    if (totalTrips < 3) {
      return {
        vehicleId,
        plateNumber,
        currentConsumptionL100Km,
        predictedNextTripL100Km: currentConsumptionL100Km,
        predicted7DaysL100Km: currentConsumptionL100Km,
        predicted30DaysL100Km: currentConsumptionL100Km,
        expectedChangePercentage: 0,
        forecastTrend: 'STABLE',
        associatedContributors: ['Data historis perjalanan belum mencukupi untuk model prediksi prediktif (minimal 3 trip tuntas).'],
        predictionQuality: 'INSUFFICIENT_DATA',
        modelRationale: 'Model AI memerlukan data minimal 3 perjalanan dengan pembacaan sensor kontinu untuk menghasilkan proyeksi terkalibrasi.',
        isDataSufficient: false,
      };
    }

    // 2. Behavioral & Maintenance Impact Multipliers
    let expectedChangeMultiplier = 1.0;
    const associatedContributors: string[] = [];

    if (idleTrendPct > 15) {
      expectedChangeMultiplier += 0.035; // +3.5% fuel
      associatedContributors.push(`Kenaikan tren idling operasional sebesar +${idleTrendPct}% di area bongkar muat.`);
    }

    if (harshAccelTrendPct > 10) {
      expectedChangeMultiplier += 0.025; // +2.5% fuel
      associatedContributors.push(`Peningkatan frekuensi akselerasi mendadak (+${harshAccelTrendPct}%) saat start awal.`);
    }

    if (maintenanceOverdue) {
      expectedChangeMultiplier += 0.045; // +4.5% fuel
      associatedContributors.push('Keterlambatan servis pembersihan filter solar & kalibrasi nosel injektor.');
    }

    if (associatedContributors.length === 0) {
      expectedChangeMultiplier = 0.985; // -1.5% improving
      associatedContributors.push('Perilaku berkendara stabil dalam rentang ekonomis (Green Zone RPM).');
    }

    const predictedNextTripL100Km = Math.round(currentConsumptionL100Km * (1 + (expectedChangeMultiplier - 1) * 0.5) * 10) / 10;
    const predicted7DaysL100Km = Math.round(currentConsumptionL100Km * expectedChangeMultiplier * 10) / 10;
    const predicted30DaysL100Km = Math.round(currentConsumptionL100Km * (1 + (expectedChangeMultiplier - 1) * 1.2) * 10) / 10;
    const expectedChangePercentage = Math.round((expectedChangeMultiplier - 1) * 1000) / 10;

    const forecastTrend: 'IMPROVING' | 'STABLE' | 'DEGRADING' =
      expectedChangePercentage > 2.0 ? 'DEGRADING' : expectedChangePercentage < -1.0 ? 'IMPROVING' : 'STABLE';

    const predictionQuality: FuelPredictionQuality = totalTrips >= 20 ? 'HIGH' : totalTrips >= 8 ? 'MEDIUM' : 'LIMITED';
    const confidenceScorePercentage = predictionQuality === 'HIGH' ? 89 : predictionQuality === 'MEDIUM' ? 76 : 58;

    const modelRationale = `Proyeksi konsumsi ${plateNumber} diprediksi ${
      expectedChangePercentage > 0 ? `meningkat +${expectedChangePercentage}%` : `mengalami perbaikan ${expectedChangePercentage}%`
    } pada periode 30 hari ke depan, dipengaruhi oleh ${associatedContributors.join(' dan ')}`;

    return {
      vehicleId,
      plateNumber,
      currentConsumptionL100Km,
      predictedNextTripL100Km,
      predicted7DaysL100Km,
      predicted30DaysL100Km,
      expectedChangePercentage,
      forecastTrend,
      associatedContributors,
      predictionQuality,
      confidenceScorePercentage,
      modelRationale,
      isDataSufficient: true,
    };
  }

  /**
   * Generates fleet-wide predictions across all major fleet vehicles
   */
  public getFleetPredictions(): FuelEfficiencyPredictionResult[] {
    return [
      this.predictVehicleEfficiency('veh-001', 'B 9876 XYZ', 31.2, 42, 28, 17, false),
      this.predictVehicleEfficiency('veh-002', 'B 9123 KLR', 24.2, 48, -5, -8, false),
      this.predictVehicleEfficiency('veh-003', 'B 9555 TTT', 23.8, 36, 34, 22, true),
      this.predictVehicleEfficiency('veh-004', 'B 9345 AB', 13.8, 55, 4, 2, false),
      this.predictVehicleEfficiency('veh-005', 'B 9801 CD', 8.8, 62, -2, -4, false),
      this.predictVehicleEfficiency('veh-006', 'B 9202 EF', 42.1, 28, 20, 15, true),
    ];
  }
}

export const fuelPredictionEngine = new FuelPredictionEngine();
