/**
 * Fleet Intelligence Smart AI - Trip AI & Anomaly Service
 * PROMPT 14 — AI Route Intelligence, Efficiency Analysis & Anomaly Detection
 */

import { DetailedTrip, TripRoute, TripAISummary, TripAnomaly } from '../types';

export class TripAIService {
  public async analyzeTrip(trip: DetailedTrip, route: TripRoute): Promise<TripAISummary> {
    const anomalies: TripAnomaly[] = [];

    // 1. Check for Overspeed / Abnormal Speed
    if (trip.maxSpeedKmH > 100) {
      anomalies.push({
        id: `anom-${anomalies.length + 1}`,
        tripId: trip.id,
        type: 'abnormal_speed',
        severity: trip.maxSpeedKmH > 115 ? 'high' : 'medium',
        title: `Kecepatan Tinggi (${trip.maxSpeedKmH} km/h)`,
        description: `Terdeteksi lonjakan kecepatan hingga ${trip.maxSpeedKmH} km/jam melebihi batas regulasi jalan tol 100 km/jam.`,
        timestamp: trip.maxSpeedAt || trip.startTime,
        location: trip.maxSpeedLocation,
      });
    }

    // 2. Check for Excessive Idle
    if (trip.idleDurationSeconds > 900) { // > 15 mins
      const mins = Math.round(trip.idleDurationSeconds / 60);
      anomalies.push({
        id: `anom-${anomalies.length + 1}`,
        tripId: trip.id,
        type: 'excessive_idle',
        severity: mins > 30 ? 'high' : 'medium',
        title: `Lama Idle Berlebihan (${mins} Menit)`,
        description: `Mesin menyala saat posisi diam selama total ${mins} menit. Menyebabkan pemborosan solar sekitar ${(mins * 0.04).toFixed(1)} Liter.`,
        timestamp: trip.startTime,
      });
    }

    // 3. Check for GPS Gaps
    if (route.gaps.length > 0) {
      route.gaps.forEach((gap, idx) => {
        const gapMins = Math.round(gap.durationSeconds / 60);
        anomalies.push({
          id: `anom-gap-${idx + 1}`,
          tripId: trip.id,
          type: 'gps_gap',
          severity: gapMins > 30 ? 'high' : 'low',
          title: `Sinyal GPS Terputus (${gapMins} Menit)`,
          description: `Terjadi kendala penerimaan sinyal GPS / GSM antara pukul ${new Date(gap.startTime).toLocaleTimeString()} s/d ${new Date(gap.endTime).toLocaleTimeString()}.`,
          timestamp: gap.startTime,
        });
      });
    }

    // Calculate Efficiency Score (0-100)
    let efficiencyScore = 100;
    if (trip.idleDurationSeconds > 600) efficiencyScore -= 15;
    if (trip.maxSpeedKmH > 100) efficiencyScore -= 10;
    if (trip.eventsCount > 3) efficiencyScore -= 15;
    efficiencyScore = Math.max(50, Math.min(100, efficiencyScore));

    // Calculate Driver Safety Score
    let driverSafetyScore = 95;
    const speedingEvents = route.events.filter(e => e.type === 'speeding').length;
    const harshBrakeEvents = route.events.filter(e => e.type === 'harsh_brake').length;
    driverSafetyScore -= speedingEvents * 8;
    driverSafetyScore -= harshBrakeEvents * 6;
    driverSafetyScore = Math.max(40, Math.min(100, driverSafetyScore));

    // Estimated Fuel Efficiency (km/L)
    const fuelEfficiencyKmL = trip.fuelConsumedLiters && trip.fuelConsumedLiters > 0
      ? parseFloat((trip.distanceKm / trip.fuelConsumedLiters).toFixed(2))
      : parseFloat((3.8 - (trip.idleDurationSeconds / 3600) * 0.5).toFixed(2));

    const recommendations: string[] = [];
    if (trip.idleDurationSeconds > 600) {
      recommendations.push('Edukasi pengemudi untuk mematikan mesin saat bongkar muat > 5 menit.');
    }
    if (speedingEvents > 0) {
      recommendations.push('Berikan peringatan otomatis via buzzer IoT saat kecepatan menyentuh 90 km/h.');
    }
    if (fuelEfficiencyKmL < 3.2) {
      recommendations.push('Lakukan inspeksi injector solar & tekanan angin ban pada jadwal perawatan berikutnya.');
    }

    const executiveSummary = `Perjalanan ${trip.tripNumber} dari ${trip.startAddress.split(',')[0]} ke ${trip.endAddress.split(',')[0]} menempuh jarak ${trip.distanceKm} km dalam waktu ${(trip.durationSeconds / 3600).toFixed(1)} jam. Tingkat efisiensi mencapai ${efficiencyScore}% dengan skor keselamatan pengemudi ${driverSafetyScore}/100.`;

    return {
      tripId: trip.id,
      executiveSummary,
      efficiencyScore,
      driverSafetyScore,
      fuelEfficiencyKmL,
      detectedAnomalies: anomalies,
      recommendations,
    };
  }
}

export const tripAIService = new TripAIService();
