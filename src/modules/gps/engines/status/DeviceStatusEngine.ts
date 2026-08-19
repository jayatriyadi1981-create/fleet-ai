/**
 * Fleet Intelligence Smart AI - Device Connectivity & Signal Health Engine
 */

import { GpsConnectionStatus, GpsSignalQuality } from '../../types/gpsArchitecture';

export class DeviceStatusEngine {
  public static calculateConnectionStatus(
    lastPingIso: string,
    offlineThresholdSeconds: number = 300
  ): GpsConnectionStatus {
    if (!lastPingIso) return 'Unknown';
    const lastPingMs = new Date(lastPingIso).getTime();
    const diffSec = (Date.now() - lastPingMs) / 1000;

    if (diffSec <= offlineThresholdSeconds) return 'Online';
    if (diffSec <= offlineThresholdSeconds * 3) return 'Connecting';
    return 'Offline';
  }

  public static classifyGpsSignal(satellites: number, hdop: number = 1.0): GpsSignalQuality {
    if (satellites >= 12 && hdop <= 1.2) return 'Excellent';
    if (satellites >= 8 && hdop <= 2.5) return 'Good';
    if (satellites >= 4) return 'Weak';
    return 'No Fix';
  }

  public static calculateHealthScore(
    connectionStatus: GpsConnectionStatus,
    satellites: number,
    batteryVoltage: number,
    externalVoltage: number
  ): number {
    let score = 100;

    if (connectionStatus === 'Offline') score -= 40;
    if (connectionStatus === 'Connecting') score -= 15;

    if (satellites < 4) score -= 30;
    else if (satellites < 8) score -= 15;

    if (externalVoltage > 0 && externalVoltage < 11.5) score -= 20;
    if (batteryVoltage > 0 && batteryVoltage < 3.6) score -= 10;

    return Math.max(0, Math.min(100, score));
  }
}
