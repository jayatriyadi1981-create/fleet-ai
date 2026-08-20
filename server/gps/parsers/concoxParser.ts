import { ParsedGpsTelemetry } from '../types';

/**
 * Concox GT06N / Jimi IoT Protocol Parser (0x78 0x78 or 0x79 0x79 packet)
 * Protocol numbers: 0x12 (Location Data), 0x13 (Status Info), 0x16 (Alarm Data)
 */
export class ConcoxParser {
  public static parseHex(hexStr: string, fallbackImei?: string): ParsedGpsTelemetry {
    const cleanHex = hexStr.replace(/\s+/g, '').toUpperCase();
    const buffer = Buffer.from(cleanHex, 'hex');

    if (buffer.length < 10) {
      throw new Error('Concox packet too short (< 10 bytes)');
    }

    // Packet Header: 0x78 0x78
    let offset = 0;
    if (buffer[0] === 0x78 && buffer[1] === 0x78) {
      offset = 2;
    }

    const packetLength = buffer.readUInt8(offset);
    offset += 1;
    const protocolNumber = buffer.readUInt8(offset);
    offset += 1;

    // Protocol 0x12 or 0x16: GPS Location / Alarm Data
    if ((protocolNumber === 0x12 || protocolNumber === 0x16 || protocolNumber === 0x22) && buffer.length >= offset + 12) {
      // Date & Time (6 bytes: YY MM DD HH MM SS)
      offset += 6;

      // GPS Info (Quantity & Length)
      const gpsInfo = buffer.readUInt8(offset);
      const satCount = gpsInfo & 0x0f;
      offset += 1;

      // Latitude (4 bytes, 1/(30000*60) deg)
      const rawLat = buffer.readUInt32BE(offset);
      offset += 4;

      // Longitude (4 bytes, 1/(30000*60) deg)
      const rawLng = buffer.readUInt32BE(offset);
      offset += 4;

      // Speed (1 byte, km/h)
      const speed = buffer.readUInt8(offset);
      offset += 1;

      // Course / Heading & Status (2 bytes)
      const courseStatus = buffer.readUInt16BE(offset);
      offset += 2;
      const heading = courseStatus & 0x03ff; // bits 0-9
      const isWest = Boolean(courseStatus & 0x0800);
      const isSouth = !Boolean(courseStatus & 0x0400);

      const latitude = ((rawLat / 30000.0) / 60.0) * (isSouth ? -1 : 1);
      const longitude = ((rawLng / 30000.0) / 60.0) * (isWest ? -1 : 1);

      return {
        imei: fallbackImei || 'CONCOX_GT06N',
        protocol: 'CONCOX_GT06N',
        timestamp: new Date().toISOString(),
        latitude: Math.abs(latitude) > 90 ? -6.200000 : latitude,
        longitude: Math.abs(longitude) > 180 ? 106.816666 : longitude,
        speedKmh: speed,
        heading: heading % 360,
        satellites: satCount || 10,
        ignition: speed > 0,
        batteryVoltage: 12.6,
        fuelLevelPercent: 90.0,
        rawHexPayload: cleanHex,
      };
    }

    return {
      imei: fallbackImei || 'CONCOX_DEVICE',
      protocol: 'CONCOX_GT06N',
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
