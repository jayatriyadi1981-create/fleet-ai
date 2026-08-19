/**
 * Fleet Intelligence Smart AI - GPS Event Engine
 * Evaluates state transitions & telemetry anomalies to create GpsEvent records
 */

import {
  GpsEvent,
  NormalizedTelemetry,
  VehicleLocation,
  GpsRule
} from '../../types/gpsArchitecture';

export class GpsEventEngine {
  private static SPEEDING_THRESHOLD_DEFAULT = 80; // km/h
  private static LOW_VOLTAGE_THRESHOLD_DEFAULT = 11.2; // Volts

  public static evaluateTelemetryEvents(
    current: NormalizedTelemetry,
    previous?: VehicleLocation | null,
    rules: GpsRule[] = []
  ): GpsEvent[] {
    const events: GpsEvent[] = [];
    const nowIso = new Date().toISOString();
    const eventTimeIso = current.timestamp || nowIso;

    // 1. Ignition State Transition Engine
    if (previous) {
      if (!previous.ignition && current.ignition) {
        events.push({
          id: `evt-ign-on-${current.deviceId}-${Date.now()}`,
          tenantId: 'tenant-1',
          deviceId: current.deviceId,
          vehicleId: current.vehicleId || previous.vehicleId || 'veh-unknown',
          driverId: current.driverId || previous.driverId,
          eventType: 'IGNITION_ON',
          severity: 'INFO',
          timestamp: eventTimeIso,
          latitude: current.latitude,
          longitude: current.longitude,
          metadata: { engineStatus: 'ON', previousIgnition: false },
          source: 'EventEngine:IgnitionDetector',
          status: 'NEW',
          createdAt: nowIso,
        });
      } else if (previous.ignition && !current.ignition) {
        events.push({
          id: `evt-ign-off-${current.deviceId}-${Date.now()}`,
          tenantId: 'tenant-1',
          deviceId: current.deviceId,
          vehicleId: current.vehicleId || previous.vehicleId || 'veh-unknown',
          driverId: current.driverId || previous.driverId,
          eventType: 'IGNITION_OFF',
          severity: 'INFO',
          timestamp: eventTimeIso,
          latitude: current.latitude,
          longitude: current.longitude,
          metadata: { engineStatus: 'OFF', previousIgnition: true },
          source: 'EventEngine:IgnitionDetector',
          status: 'NEW',
          createdAt: nowIso,
        });
      }

      // 2. Movement Transition Engine
      const prevWasMoving = previous.status === 'Moving';
      const currIsMoving = current.ignition && current.speed >= 3.0;

      if (!prevWasMoving && currIsMoving) {
        events.push({
          id: `evt-mov-start-${current.deviceId}-${Date.now()}`,
          tenantId: 'tenant-1',
          deviceId: current.deviceId,
          vehicleId: current.vehicleId || previous.vehicleId || 'veh-unknown',
          driverId: current.driverId || previous.driverId,
          eventType: 'MOVING_STARTED',
          severity: 'INFO',
          timestamp: eventTimeIso,
          latitude: current.latitude,
          longitude: current.longitude,
          metadata: { initialSpeed: current.speed },
          source: 'EventEngine:MovementDetector',
          status: 'NEW',
          createdAt: nowIso,
        });
      } else if (prevWasMoving && !currIsMoving) {
        events.push({
          id: `evt-mov-stop-${current.deviceId}-${Date.now()}`,
          tenantId: 'tenant-1',
          deviceId: current.deviceId,
          vehicleId: current.vehicleId || previous.vehicleId || 'veh-unknown',
          driverId: current.driverId || previous.driverId,
          eventType: 'MOVING_STOPPED',
          severity: 'INFO',
          timestamp: eventTimeIso,
          latitude: current.latitude,
          longitude: current.longitude,
          metadata: { finalSpeed: current.speed },
          source: 'EventEngine:MovementDetector',
          status: 'NEW',
          createdAt: nowIso,
        });
      }
    }

    // 3. Speeding Anomaly Engine
    const speedLimit = rules.find((r) => r.eventType === 'SPEEDING')?.conditions.speedThresholdKmH || this.SPEEDING_THRESHOLD_DEFAULT;
    if (current.speed > speedLimit) {
      events.push({
        id: `evt-spd-${current.deviceId}-${Date.now()}`,
        tenantId: 'tenant-1',
        deviceId: current.deviceId,
        vehicleId: current.vehicleId || 'veh-unknown',
        driverId: current.driverId,
        eventType: 'SPEEDING',
        severity: current.speed > speedLimit + 25 ? 'CRITICAL' : 'HIGH',
        timestamp: eventTimeIso,
        latitude: current.latitude,
        longitude: current.longitude,
        metadata: { speed: current.speed, threshold: speedLimit, excess: current.speed - speedLimit },
        source: 'EventEngine:SpeedingDetector',
        status: 'NEW',
        createdAt: nowIso,
      });
    }

    // 4. Low Voltage Anomaly Engine
    if (current.externalVoltage && current.externalVoltage < this.LOW_VOLTAGE_THRESHOLD_DEFAULT) {
      events.push({
        id: `evt-volt-${current.deviceId}-${Date.now()}`,
        tenantId: 'tenant-1',
        deviceId: current.deviceId,
        vehicleId: current.vehicleId || 'veh-unknown',
        driverId: current.driverId,
        eventType: 'LOW_VOLTAGE',
        severity: 'MEDIUM',
        timestamp: eventTimeIso,
        latitude: current.latitude,
        longitude: current.longitude,
        metadata: { voltage: current.externalVoltage, threshold: this.LOW_VOLTAGE_THRESHOLD_DEFAULT },
        source: 'EventEngine:PowerDetector',
        status: 'NEW',
        createdAt: nowIso,
      });
    }

    // 5. GPS Signal Loss Engine
    if (current.satellites < 3) {
      events.push({
        id: `evt-sigloss-${current.deviceId}-${Date.now()}`,
        tenantId: 'tenant-1',
        deviceId: current.deviceId,
        vehicleId: current.vehicleId || 'veh-unknown',
        driverId: current.driverId,
        eventType: 'GPS_SIGNAL_LOST',
        severity: 'MEDIUM',
        timestamp: eventTimeIso,
        latitude: current.latitude,
        longitude: current.longitude,
        metadata: { satellites: current.satellites, accuracy: current.accuracy },
        source: 'EventEngine:SignalDetector',
        status: 'NEW',
        createdAt: nowIso,
      });
    }

    return events;
  }
}
