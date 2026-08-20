import { ParsedGpsTelemetry } from '../types';

/**
 * Generic REST / JSON Telematics Payload Normalizer
 */
export class JsonTelematicsParser {
  public static parse(payload: any): ParsedGpsTelemetry {
    if (!payload || typeof payload !== 'object') {
      throw new Error('Invalid JSON payload');
    }

    const imei = String(payload.imei || payload.deviceId || payload.id || 'GENERIC_IOT_TRACKER');
    const lat = Number(payload.lat ?? payload.latitude ?? -6.200000);
    const lng = Number(payload.lng ?? payload.longitude ?? 106.816666);
    const speed = Number(payload.speed ?? payload.speedKmh ?? payload.velocity ?? 0);
    const heading = Number(payload.heading ?? payload.course ?? payload.bearing ?? 0);
    const ignition = Boolean(
      payload.ignition ?? payload.acc ?? payload.engineOn ?? (speed > 3)
    );

    return {
      imei,
      protocol: 'GENERIC_JSON',
      timestamp: payload.timestamp ? new Date(payload.timestamp).toISOString() : new Date().toISOString(),
      latitude: isNaN(lat) || Math.abs(lat) > 90 ? -6.200000 : lat,
      longitude: isNaN(lng) || Math.abs(lng) > 180 ? 106.816666 : lng,
      altitudeMeters: Number(payload.altitude ?? payload.alt ?? 15),
      speedKmh: isNaN(speed) ? 0 : Math.round(speed * 10) / 10,
      heading: isNaN(heading) ? 0 : Math.round(heading) % 360,
      satellites: Number(payload.satellites ?? payload.sats ?? 14),
      ignition,
      batteryVoltage: Number(payload.batteryVoltage ?? payload.battery ?? 24.2),
      fuelLevelPercent: Number(payload.fuelLevelPercent ?? payload.fuelLevel ?? 85),
      fuelLiters: Number(payload.fuelLiters ?? 170),
      odometerKm: Number(payload.odometerKm ?? payload.odometer ?? 12450.5),
      engineRpm: Number(payload.engineRpm ?? payload.rpm ?? (ignition ? 1400 : 0)),
      engineTempCelsius: Number(payload.engineTempCelsius ?? payload.temp ?? 84.5),
      doorOpen: Boolean(payload.doorOpen),
      sosAlert: Boolean(payload.sosAlert || payload.sos),
      powerCutAlert: Boolean(payload.powerCutAlert || payload.powerCut),
      overspeedAlert: speed > 90 || Boolean(payload.overspeed),
      geofenceAlert: Boolean(payload.geofenceAlert),
    };
  }
}
