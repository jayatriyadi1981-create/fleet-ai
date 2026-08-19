/**
 * Fleet Intelligence Smart AI - Generic Telematics JSON Parser
 * Converts incoming HTTP/REST/Webhook telematics payloads to NormalizedTelemetry
 */

import { NormalizedTelemetry, RawGpsMessage } from '../types/gpsArchitecture';

export class GenericJsonParser {
  public static parse(raw: RawGpsMessage): NormalizedTelemetry {
    let payloadObj: any = {};
    if (typeof raw.payload === 'string') {
      try {
        payloadObj = JSON.parse(raw.payload);
      } catch {
        payloadObj = {};
      }
    } else {
      payloadObj = raw.payload || {};
    }

    return {
      deviceId: raw.deviceId || payloadObj.deviceId || payloadObj.device_id || 'UNKNOWN_DEVICE',
      vehicleId: payloadObj.vehicleId || payloadObj.vehicle_id,
      driverId: payloadObj.driverId || payloadObj.driver_id,
      timestamp: payloadObj.timestamp || payloadObj.time || raw.receivedAt,
      latitude: parseFloat(payloadObj.latitude ?? payloadObj.lat ?? 0),
      longitude: parseFloat(payloadObj.longitude ?? payloadObj.lng ?? payloadObj.lon ?? 0),
      speed: parseFloat(payloadObj.speed ?? payloadObj.speed_kmh ?? 0),
      heading: parseFloat(payloadObj.heading ?? payloadObj.course ?? 0),
      ignition: Boolean(payloadObj.ignition ?? payloadObj.acc ?? payloadObj.engine_on ?? false),
      satellites: parseInt(payloadObj.satellites ?? payloadObj.sats ?? 10, 10),
      accuracy: parseFloat(payloadObj.accuracy ?? payloadObj.hdop ?? 5.0),
      batteryVoltage: parseFloat(payloadObj.batteryVoltage ?? payloadObj.v_bat ?? 12.0),
      externalVoltage: parseFloat(payloadObj.externalVoltage ?? payloadObj.v_ext ?? 24.0),
      odometerKm: parseFloat(payloadObj.odometerKm ?? payloadObj.odometer ?? 0),
      fuelLevelPercent: payloadObj.fuelLevelPercent ?? payloadObj.fuel,
      sequenceNumber: raw.sequenceNumber || payloadObj.sequenceNumber,
      rawDataReference: raw.id,
      sensorData: payloadObj.sensors || payloadObj.sensorData,
    };
  }
}
