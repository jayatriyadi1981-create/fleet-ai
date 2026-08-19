/**
 * Fleet Intelligence Smart AI - Location & Vehicle Status Engine
 * Derives Moving, Stopped, Idle, Offline, Unknown states
 */

import { LocationStatus, NormalizedTelemetry } from '../../types/gpsArchitecture';

export class LocationStatusEngine {
  private static MOVING_SPEED_THRESHOLD_KMH = 3.0;
  private static OFFLINE_THRESHOLD_SECONDS = 300; // 5 minutes

  public static determineStatus(
    telemetry: NormalizedTelemetry,
    nowMs: number = Date.now()
  ): LocationStatus {
    const packetTimeMs = new Date(telemetry.timestamp).getTime();
    const diffSeconds = (nowMs - packetTimeMs) / 1000;

    if (diffSeconds > this.OFFLINE_THRESHOLD_SECONDS) {
      return 'Offline';
    }

    if (telemetry.ignition && telemetry.speed >= this.MOVING_SPEED_THRESHOLD_KMH) {
      return 'Moving';
    }

    if (telemetry.ignition && telemetry.speed < this.MOVING_SPEED_THRESHOLD_KMH) {
      return 'Idle';
    }

    if (!telemetry.ignition && telemetry.speed < this.MOVING_SPEED_THRESHOLD_KMH) {
      return 'Stopped';
    }

    return 'Unknown';
  }
}
