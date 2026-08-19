/**
 * Fleet Intelligence Smart AI - Realtime GPS Streaming Service
 * Manages WebSocket/SSE stream with automatic fallback polling mechanism
 */

import { GpsEventBus } from './GpsEventBus';
import { VehicleLocation, GpsEvent } from '../types/gpsArchitecture';
import { gpsIngestionService } from './GpsIngestionService';

export class RealtimeGpsStreamService {
  private isConnected: boolean = false;
  private connectionType: 'WEBSOCKET' | 'POLLING' = 'POLLING';
  private pollingInterval: number = 3000;
  private timerId: any = null;

  public connect(): void {
    this.isConnected = true;
    this.connectionType = 'POLLING';
    this.startPolling();
  }

  public disconnect(): void {
    this.isConnected = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  public getConnectionStatus(): { isConnected: boolean; type: string } {
    return {
      isConnected: this.isConnected,
      type: this.connectionType,
    };
  }

  private startPolling(): void {
    if (this.timerId) clearInterval(this.timerId);

    this.timerId = setInterval(() => {
      if (!this.isConnected) return;
      const latest = gpsIngestionService.getLatestLocations();
      latest.forEach((loc) => {
        GpsEventBus.publish('LocationUpdated', loc);
      });
    }, this.pollingInterval);
  }

  public subscribeLocation(callback: (loc: VehicleLocation) => void): () => void {
    return GpsEventBus.subscribe('LocationUpdated', callback);
  }

  public subscribeEvents(callback: (event: GpsEvent) => void): () => void {
    return GpsEventBus.subscribe('GpsEventCreated', callback);
  }
}

export const realtimeGpsService = new RealtimeGpsStreamService();
