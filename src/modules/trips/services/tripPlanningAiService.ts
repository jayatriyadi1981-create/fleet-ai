/**
 * Fleet Intelligence Smart AI - Trip AI Intelligence & Predictive Service
 * PROMPT 15 — AI ETA Prediction, Route Risk Analysis & Delay Explanation
 */

import { PlannedTrip, TripAiEtaPrediction } from '../plannedTripTypes';

export class TripPlanningAiService {
  /**
   * Predict ETA using historical patterns, traffic conditions, vehicle/driver telemetry
   */
  public static async predictTripEta(trip: PlannedTrip): Promise<TripAiEtaPrediction> {
    // Simulate AI inference delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const plannedEtaDate = new Date(trip.plannedEta);
    // AI predicts a slight 12–22 minute delay based on traffic rush hour and historical driver pace
    const aiDelayMinutes = 18;
    const predictedEtaDate = new Date(plannedEtaDate.getTime() + aiDelayMinutes * 60 * 1000);

    const keyFactors = [
      'Pola kemacetan jam sibuk di area Tol Jakarta-Cikampek',
      'Kecepatan rata-rata histori driver Ahmad Santoso (46 km/jam pada rute ini)',
      'Estimasi durasi bongkar/muat 15 menit per waypoint',
      'Kondisi cuaca hujan ringan terdeteksi di koordinat km 42',
    ];

    return {
      predictedEta: predictedEtaDate.toISOString(),
      delayRiskMinutes: aiDelayMinutes,
      confidencePercent: 86,
      keyFactors,
      suggestedRouteDeviation: 'Disarankan mengambil Jalur Layang MBK untuk menghindari kepadatan di Cikarang Barat.',
    };
  }
}

export const tripPlanningAiService = TripPlanningAiService;
