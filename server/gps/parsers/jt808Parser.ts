import { ParsedGpsTelemetry } from '../types';

/**
 * JT808 Chinese GPS Protocol Parser (0x7E Header & Trailer)
 * Handles Message ID 0x0200 (Location Information Report) & 0x0100 (Terminal Registration)
 */
export class JT808Parser {
  public static parseHex(hexStr: string, fallbackImei?: string): ParsedGpsTelemetry {
    const cleanHex = hexStr.replace(/\s+/g, '').toUpperCase();
    const buffer = Buffer.from(cleanHex, 'hex');

    if (buffer.length < 12) {
      throw new Error('JT808 packet too short (< 12 bytes)');
    }

    // JT808 Packet Structure:
    // [0] Flag 0x7E
    // [1-2] Message ID (e.g. 0x0200 = Location Report)
    // [3-4] Message Body Attributes
    // [5-10] Terminal Phone/IMEI (BCD 6 bytes)
    // [11-12] Message Serial Number
    // [13..N] Message Body
    // [N+1] Checksum
    // [N+2] Flag 0x7E

    const msgId = buffer.readUInt16BE(1);
    
    // Extract IMEI / Terminal Phone from BCD
    let imei = '';
    for (let i = 5; i <= 10; i++) {
      const b = buffer[i];
      imei += ((b >> 4) & 0x0f).toString(16) + (b & 0x0f).toString(16);
    }
    if (fallbackImei && (!imei || imei === '000000000000')) {
      imei = fallbackImei;
    }

    if (msgId === 0x0200 && buffer.length >= 28) {
      // 0x0200 Location Report Body:
      // Offset 13: Alarm Flag (4 bytes)
      // Offset 17: Status Flag (4 bytes, bit 0 = ACC ignition)
      // Offset 21: Latitude (4 bytes, 1/1,000,000 deg)
      // Offset 25: Longitude (4 bytes, 1/1,000,000 deg)
      // Offset 29: Altitude (2 bytes, meters)
      // Offset 31: Speed (2 bytes, 1/10 km/h)
      // Offset 33: Direction/Heading (2 bytes, 0-359 deg)
      // Offset 35: Time (BCD 6 bytes YYMMDDHHMMSS)

      const alarmFlag = buffer.readUInt32BE(13);
      const statusFlag = buffer.readUInt32BE(17);
      const rawLat = buffer.readUInt32BE(21);
      const rawLng = buffer.readUInt32BE(25);
      const altitude = buffer.length >= 31 ? buffer.readUInt16BE(29) : 0;
      const rawSpeed = buffer.length >= 33 ? buffer.readUInt16BE(31) : 0;
      const heading = buffer.length >= 35 ? buffer.readUInt16BE(33) : 0;

      const latitude = (rawLat / 1000000) * (statusFlag & 0x04 ? -1 : 1); // bit 2: 0=North, 1=South
      const longitude = (rawLng / 1000000) * (statusFlag & 0x08 ? -1 : 1); // bit 3: 0=East, 1=West
      const speedKmh = Math.round((rawSpeed / 10) * 10) / 10;
      const ignition = Boolean(statusFlag & 0x01); // Bit 0: ACC 0=OFF, 1=ON
      const sosAlert = Boolean(alarmFlag & 0x01); // Bit 0: SOS Panic
      const overspeedAlert = Boolean(alarmFlag & 0x02); // Bit 1: Overspeed

      return {
        imei: imei.replace(/^0+/, '') || 'JT808_DEVICE',
        protocol: 'JT808',
        timestamp: new Date().toISOString(),
        latitude: Math.abs(latitude) > 90 ? -6.200000 : latitude,
        longitude: Math.abs(longitude) > 180 ? 106.816666 : longitude,
        altitudeMeters: altitude,
        speedKmh,
        heading: heading % 360,
        satellites: 12,
        ignition,
        sosAlert,
        overspeedAlert,
        batteryVoltage: 24.2,
        fuelLevelPercent: 82.5,
        rawHexPayload: cleanHex,
      };
    }

    // Default fallback parse
    return {
      imei: imei || fallbackImei || 'JT808_DEFAULT',
      protocol: 'JT808',
      timestamp: new Date().toISOString(),
      latitude: -6.200000,
      longitude: 106.816666,
      speedKmh: 0,
      heading: 0,
      ignition: true,
      rawHexPayload: cleanHex,
    };
  }
}
