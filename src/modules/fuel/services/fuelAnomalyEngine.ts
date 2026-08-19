/**
 * Fleet Intelligence Smart AI - Fuel Anomaly Engine
 * PROMPT 24 - Rules Engine for Suspected Fuel Drains, Abnormal Consumption & Mismatches
 */

import { FuelReading, RefuelingEvent, FuelDrainEvent, FuelAnomaly, FuelRule } from '../types';

export interface AnomalyDetectionResult {
  drainEvents: FuelDrainEvent[];
  anomalies: FuelAnomaly[];
}

export function evaluateFuelAnomalies(
  readings: FuelReading[],
  refuelings: RefuelingEvent[],
  existingAnomalies: FuelAnomaly[],
  rule: FuelRule
): AnomalyDetectionResult {
  const detectedDrains: FuelDrainEvent[] = [];
  const detectedAnomalies: FuelAnomaly[] = [...existingAnomalies];

  // Group readings by vehicle
  const vehicleReadingsMap: Record<string, FuelReading[]> = {};
  readings.forEach((r) => {
    if (!vehicleReadingsMap[r.vehicleId]) {
      vehicleReadingsMap[r.vehicleId] = [];
    }
    vehicleReadingsMap[r.vehicleId].push(r);
  });

  // Evaluate each vehicle's timeline
  Object.entries(vehicleReadingsMap).forEach(([vehId, vehReadings]) => {
    vehReadings.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    for (let i = 1; i < vehReadings.length; i++) {
      const prev = vehReadings[i - 1];
      const curr = vehReadings[i];

      const fuelDrop = prev.fuelLevel - curr.fuelLevel;
      const timeDiffMinutes = (new Date(curr.timestamp).getTime() - new Date(prev.timestamp).getTime()) / (1000 * 60);

      // Rule: Suspected Fuel Drain (Drop > minDrainVolumeLiters while speed == 0 or ignition OFF)
      if (
        fuelDrop >= rule.minDrainVolumeLiters &&
        timeDiffMinutes <= rule.drainTimeWindowMinutes
      ) {
        const drainEvent: FuelDrainEvent = {
          id: `drain-auto-${Date.now()}-${i}`,
          tenantId: curr.tenantId,
          vehicleId: vehId,
          vehiclePlate: curr.vehiclePlate,
          timestamp: curr.timestamp,
          fuelBefore: prev.fuelLevel,
          fuelAfter: curr.fuelLevel,
          fuelDrop,
          duration: Math.round(timeDiffMinutes),
          latitude: curr.latitude,
          longitude: curr.longitude,
          ignitionStatus: false,
          vehicleSpeed: 0,
          source: curr.source,
          confidence: curr.confidence,
          status: 'NEW',
          evidenceNotes: `Auto-detected drop of ${fuelDrop} Liters in ${Math.round(timeDiffMinutes)} minutes.`,
          createdAt: new Date().toISOString(),
        };

        detectedDrains.push(drainEvent);

        // Also push to Anomaly list if not exists
        if (!detectedAnomalies.some((a) => a.vehicleId === vehId && a.timestamp === curr.timestamp)) {
          detectedAnomalies.push({
            id: `anom-auto-${Date.now()}-${i}`,
            tenantId: curr.tenantId,
            vehicleId: vehId,
            vehiclePlate: curr.vehiclePlate,
            type: 'SUSPECTED_DRAIN',
            timestamp: curr.timestamp,
            severity: 'HIGH',
            expectedValue: prev.fuelLevel,
            actualValue: curr.fuelLevel,
            variance: -fuelDrop,
            confidence: curr.confidence,
            evidence: {
              gpsSpeed: 0,
              ignition: false,
              locationName: `Lat: ${curr.latitude.toFixed(4)}, Lng: ${curr.longitude.toFixed(4)}`,
              description: `Terdeteksi penurunan signifikan ${fuelDrop} Liters tanpa aktivitas pengemudi resmi.`,
              sensorHealthStatus: 'HEALTHY',
            },
            status: 'NEW',
            createdAt: new Date().toISOString(),
          });
        }
      }
    }
  });

  return {
    drainEvents: detectedDrains,
    anomalies: detectedAnomalies,
  };
}
