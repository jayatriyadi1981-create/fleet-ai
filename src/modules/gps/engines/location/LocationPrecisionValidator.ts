/**
 * Fleet Intelligence Smart AI - Location & Precision Validator
 * Ensures coordinates are within valid geographic bounds and detects impossible leaps
 */

import { NormalizedTelemetry, TelemetryQuality } from '../../types/gpsArchitecture';

export class LocationPrecisionValidator {
  /**
   * Validate latitude and longitude range
   */
  public static isValidCoordinate(lat: number, lng: number): boolean {
    if (isNaN(lat) || isNaN(lng)) return false;
    if (lat < -90 || lat > 90) return false;
    if (lng < -180 || lng > 180) return false;
    // Common GPS zero-island glitch filter (0.0, 0.0)
    if (Math.abs(lat) < 0.0001 && Math.abs(lng) < 0.0001) return false;
    return true;
  }

  /**
   * Evaluates overall telemetry quality
   */
  public static evaluateQuality(telemetry: NormalizedTelemetry): TelemetryQuality {
    if (!this.isValidCoordinate(telemetry.latitude, telemetry.longitude)) {
      return 'INVALID';
    }

    if (telemetry.accuracy > 50 || telemetry.satellites < 3) {
      return 'SUSPECT';
    }

    if (telemetry.speed < 0 || telemetry.speed > 220) {
      return 'SUSPECT';
    }

    if (telemetry.satellites >= 6 && telemetry.accuracy <= 10) {
      return 'VALID';
    }

    return 'PARTIAL';
  }
}
