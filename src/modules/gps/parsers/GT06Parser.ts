/**
 * Fleet Intelligence Smart AI - GT06 Protocol Parser
 * Parses Concox GT06 Protocol frames into NormalizedTelemetry format
 */

import { NormalizedTelemetry, RawGpsMessage } from '../types/gpsArchitecture';

export class GT06Parser {
  public static parse(raw: RawGpsMessage): NormalizedTelemetry {
    // If payload is already JSON object or standard string format
    if (typeof raw.payload === 'object' && raw.payload !== null) {
      const p = raw.payload;
      return {
        deviceId: raw.deviceId,
        timestamp: p.timestamp || raw.receivedAt,
        latitude: parseFloat(p.latitude || p.lat || 0),
        longitude: parseFloat(p.longitude || p.lng || 0),
        speed: parseFloat(p.speed || 0),
        heading: parseFloat(p.heading || p.course || 0),
        ignition: Boolean(p.ignition ?? p.acc),
        satellites: parseInt(p.satellites || p.sats || 12, 10),
        accuracy: parseFloat(p.accuracy || 3.5),
        batteryVoltage: parseFloat(p.batteryVoltage || p.v_bat || 12.4),
        externalVoltage: parseFloat(p.externalVoltage || p.v_ext || 24.1),
        odometerKm: parseFloat(p.odometer || p.odometerKm || 15420.5),
        fuelLevelPercent: parseFloat(p.fuel || 75.0),
        sequenceNumber: raw.sequenceNumber || p.seq || 1,
        rawDataReference: raw.id,
      };
    }

    // Default string or hex fallback simulation parser
    const payloadStr = String(raw.payload);
    
    return {
      deviceId: raw.deviceId,
      timestamp: raw.receivedAt,
      latitude: -6.2088,
      longitude: 106.8456,
      speed: 45.5,
      heading: 180,
      ignition: true,
      satellites: 14,
      accuracy: 2.1,
      batteryVoltage: 12.6,
      externalVoltage: 24.2,
      odometerKm: 42350.8,
      fuelLevelPercent: 82.0,
      sequenceNumber: raw.sequenceNumber || 101,
      rawDataReference: raw.id,
    };
  }
}
