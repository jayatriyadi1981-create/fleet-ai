/**
 * Fleet Intelligence Smart AI - Realtime GPS Event Bus (Pub/Sub)
 */

import {
  NormalizedTelemetry,
  VehicleLocation,
  GpsEvent,
  DeviceHealth
} from '../types/gpsArchitecture';

export type GpsBusTopic =
  | 'TelemetryReceived'
  | 'LocationUpdated'
  | 'DeviceOnline'
  | 'DeviceOffline'
  | 'IgnitionChanged'
  | 'VehicleMoving'
  | 'VehicleStopped'
  | 'IdleStarted'
  | 'IdleEnded'
  | 'GpsEventCreated';

export type GpsBusCallback = (data: any) => void;

class GpsEventBusService {
  private subscribers: Map<GpsBusTopic, Set<GpsBusCallback>> = new Map();

  public subscribe(topic: GpsBusTopic, callback: GpsBusCallback): () => void {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, new Set());
    }
    this.subscribers.get(topic)!.add(callback);

    return () => {
      const topicSubs = this.subscribers.get(topic);
      if (topicSubs) {
        topicSubs.delete(callback);
      }
    };
  }

  public publish(topic: GpsBusTopic, payload: any): void {
    const topicSubs = this.subscribers.get(topic);
    if (topicSubs) {
      topicSubs.forEach((cb) => {
        try {
          cb(payload);
        } catch (err) {
          console.error(`Error in GpsEventBus callback for topic ${topic}:`, err);
        }
      });
    }
  }
}

export const GpsEventBus = new GpsEventBusService();
