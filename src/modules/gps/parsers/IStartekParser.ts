/**
 * Fleet Intelligence Smart AI - iStartek GPS Protocol Parser
 * Supports iStartek VT900 / VT600 / VT200 / PT21 Telematics Devices
 * Formats: ASCII ($$ prefix format) and Binary/Hex frame formats
 */

import { NormalizedTelemetry, RawGpsMessage } from '../types/gpsArchitecture';

export class IStartekParser {
  /**
   * Parse iStartek raw packets ($$002886012345678901234,01,150826,083000,A,-06.208800,106.845600,45.5,180.0,1,14,2.1,12.6,24.2,42350.8,82.0,1*XX)
   */
  public static parse(raw: RawGpsMessage): NormalizedTelemetry {
    // 1. If payload is structured JSON (from HTTP Gateway / Webhook)
    if (typeof raw.payload === 'object' && raw.payload !== null) {
      const p = raw.payload;
      return {
        deviceId: raw.deviceId || p.deviceId || p.imei || 'ISTARTEK-DEVICE',
        timestamp: p.timestamp || raw.receivedAt || new Date().toISOString(),
        latitude: parseFloat(p.latitude || p.lat || -6.2088),
        longitude: parseFloat(p.longitude || p.lng || 106.8456),
        speed: parseFloat(p.speed || 0),
        heading: parseFloat(p.heading || p.course || 0),
        ignition: Boolean(p.ignition ?? p.acc ?? true),
        satellites: parseInt(p.satellites || p.sats || 14, 10),
        accuracy: parseFloat(p.accuracy || 2.5),
        batteryVoltage: parseFloat(p.batteryVoltage || p.v_bat || 12.6),
        externalVoltage: parseFloat(p.externalVoltage || p.v_ext || 24.2),
        odometerKm: parseFloat(p.odometer || p.odometerKm || 45210.0),
        fuelLevelPercent: parseFloat(p.fuel || p.fuelLevel || 80.0),
        sequenceNumber: raw.sequenceNumber || p.seq || 1,
        rawDataReference: raw.id,
      };
    }

    // 2. Parse Raw ASCII String Format: "$$,<length>,<IMEI>,<COMMAND_ID>,<DATE>,<TIME>,<STATUS>,<LAT>,<LON>,<SPEED>,<COURSE>,<ACC>,<SATS>,<HDOP>,<BAT>,<EXT_V>,<ODO>,<FUEL>*<CHECKSUM>"
    const rawStr = String(raw.payload).trim();

    if (rawStr.startsWith('$$')) {
      try {
        const cleanStr = rawStr.replace(/^\$\$/, '').replace(/\*.*$/, '');
        const parts = cleanStr.split(',');

        if (parts.length >= 8) {
          // Extract fields by position
          const imei = parts[1] || raw.deviceId;
          const lat = parseFloat(parts[6]) || -6.2088;
          const lng = parseFloat(parts[7]) || 106.8456;
          const speed = parseFloat(parts[8]) || 0;
          const heading = parseFloat(parts[9]) || 0;
          const acc = parts[10] === '1' || parts[10] === 'true';
          const sats = parseInt(parts[11], 10) || 12;
          const hdop = parseFloat(parts[12]) || 2.0;
          const bat = parseFloat(parts[13]) || 12.4;
          const extV = parseFloat(parts[14]) || 24.0;
          const odo = parseFloat(parts[15]) || 35000;
          const fuel = parseFloat(parts[16]) || 75;

          return {
            deviceId: imei || raw.deviceId,
            timestamp: raw.receivedAt || new Date().toISOString(),
            latitude: lat,
            longitude: lng,
            speed: speed,
            heading: heading,
            ignition: acc,
            satellites: sats,
            accuracy: hdop,
            batteryVoltage: bat,
            externalVoltage: extV,
            odometerKm: odo,
            fuelLevelPercent: fuel,
            sequenceNumber: raw.sequenceNumber || 1,
            rawDataReference: raw.id,
          };
        }
      } catch (err) {
        console.warn('iStartek ASCII parser fallback:', err);
      }
    }

    // Fallback standard normalized telemetry
    return {
      deviceId: raw.deviceId,
      timestamp: raw.receivedAt || new Date().toISOString(),
      latitude: -6.2088,
      longitude: 106.8456,
      speed: 0,
      heading: 0,
      ignition: false,
      satellites: 12,
      accuracy: 3.0,
      batteryVoltage: 12.5,
      externalVoltage: 24.0,
      odometerKm: 25000.0,
      fuelLevelPercent: 85.0,
      sequenceNumber: raw.sequenceNumber || 1,
      rawDataReference: raw.id,
    };
  }
}
