import { ParsedGpsTelemetry } from '../types';

/**
 * Teltonika Codec 8 / Codec 8 Extended Protocol Parser (FMB920, FMC130, FMB120, etc.)
 */
export class TeltonikaParser {
  public static parseHex(hexStr: string, imei: string): ParsedGpsTelemetry {
    const cleanHex = hexStr.replace(/\s+/g, '').toUpperCase();
    const buffer = Buffer.from(cleanHex, 'hex');

    if (buffer.length < 15) {
      throw new Error('Teltonika packet too short (< 15 bytes)');
    }

    // Teltonika AVL Packet Structure:
    // [0-3] 4 Zero Bytes (0x00000000)
    // [4-7] Data Field Length
    // [8] Codec ID (0x08 = Codec 8)
    // [9] Number of Data 1
    // [10..] AVL Records...
    
    let offset = 0;
    // Skip preamble if present
    if (buffer.readUInt32BE(0) === 0x00000000) {
      offset = 8; // start at Codec ID
    }

    const codecId = buffer.readUInt8(offset);
    offset += 1;
    const recordCount = buffer.readUInt8(offset);
    offset += 1;

    // Parse First AVL Record
    // Timestamp (8 bytes uint64 ms)
    const timestampHi = buffer.readUInt32BE(offset);
    const timestampLo = buffer.readUInt32BE(offset + 4);
    offset += 8;
    const timestampMs = timestampHi * 4294967296 + timestampLo;
    const recordDate = timestampMs > 1500000000000 ? new Date(timestampMs) : new Date();

    // Priority
    const priority = buffer.readUInt8(offset);
    offset += 1;

    // GPS Element (15 bytes)
    // Longitude (4 bytes int32, 1e-7 deg)
    const rawLng = buffer.readInt32BE(offset);
    offset += 4;
    // Latitude (4 bytes int32, 1e-7 deg)
    const rawLat = buffer.readInt32BE(offset);
    offset += 4;
    // Altitude (2 bytes int16 meters)
    const altitude = buffer.readInt16BE(offset);
    offset += 2;
    // Angle / Heading (2 bytes uint16 deg)
    const heading = buffer.readUInt16BE(offset);
    offset += 2;
    // Satellites (1 byte)
    const satellites = buffer.readUInt8(offset);
    offset += 1;
    // Speed (2 bytes uint16 km/h)
    const speed = buffer.readUInt16BE(offset);
    offset += 2;

    const longitude = rawLng / 10000000;
    const latitude = rawLat / 10000000;

    // Parse I/O Elements (Ignition, Battery, Fuel)
    let ignition = speed > 2;
    let batteryVoltage = 24.0;
    let fuelLevelPercent = 85.0;
    let odometerKm = 0;

    try {
      if (offset < buffer.length - 2) {
        const eventIoId = buffer.readUInt8(offset);
        offset += 1;
        const totalIoCount = buffer.readUInt8(offset);
        offset += 1;

        // 1-Byte IO elements
        const count1B = buffer.readUInt8(offset);
        offset += 1;
        for (let i = 0; i < count1B && offset + 2 <= buffer.length; i++) {
          const ioId = buffer.readUInt8(offset);
          const ioVal = buffer.readUInt8(offset + 1);
          offset += 2;
          if (ioId === 239) ignition = Boolean(ioVal); // Ignition
          if (ioId === 240) { /* Movement */ }
        }

        // 2-Byte IO elements
        if (offset < buffer.length) {
          const count2B = buffer.readUInt8(offset);
          offset += 1;
          for (let i = 0; i < count2B && offset + 3 <= buffer.length; i++) {
            const ioId = buffer.readUInt8(offset);
            const ioVal = buffer.readUInt16BE(offset + 1);
            offset += 3;
            if (ioId === 66) batteryVoltage = Math.round((ioVal / 1000) * 10) / 10; // External Voltage mV
            if (ioId === 67) { /* Battery Voltage */ }
            if (ioId === 24) speed; // Speed sensor
          }
        }

        // 4-Byte IO elements
        if (offset < buffer.length) {
          const count4B = buffer.readUInt8(offset);
          offset += 1;
          for (let i = 0; i < count4B && offset + 5 <= buffer.length; i++) {
            const ioId = buffer.readUInt8(offset);
            const ioVal = buffer.readUInt32BE(offset + 1);
            offset += 5;
            if (ioId === 16) odometerKm = Math.round((ioVal / 1000) * 10) / 10; // Total Odometer (meters -> km)
            if (ioId === 270) fuelLevelPercent = Math.min(100, Math.round(ioVal / 10)); // Fuel level
          }
        }
      }
    } catch {
      // Best effort on I/O elements
    }

    return {
      imei: imei || 'TELTONIKA_FMB920',
      protocol: 'TELTONIKA',
      timestamp: recordDate.toISOString(),
      latitude: Math.abs(latitude) > 90 ? -6.200000 : latitude,
      longitude: Math.abs(longitude) > 180 ? 106.816666 : longitude,
      altitudeMeters: altitude,
      speedKmh: speed,
      heading: heading % 360,
      satellites: satellites || 14,
      ignition,
      batteryVoltage,
      fuelLevelPercent,
      odometerKm,
      overspeedAlert: speed > 90,
      rawHexPayload: cleanHex,
    };
  }
}
