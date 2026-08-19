/**
 * Fleet Intelligence Smart AI - Map Data Service
 * Provides polyline historical routes, markers, and trip replay playback data
 */

import { GpsTelemetry, VehicleLocation } from '../types/gpsArchitecture';
import { gpsIngestionService } from './GpsIngestionService';

export interface RoutePolylinePoint {
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  timestamp: string;
  ignition: boolean;
}

export class MapDataService {
  /**
   * Get historical polyline points for vehicle playback
   */
  public getVehicleRouteHistory(vehicleId: string): RoutePolylinePoint[] {
    const history = gpsIngestionService.getTelemetryHistory(500);
    const filtered = history
      .filter((t) => t.vehicleId === vehicleId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    if (filtered.length > 0) {
      return filtered.map((t) => ({
        latitude: t.latitude,
        longitude: t.longitude,
        speed: t.speed,
        heading: t.heading,
        timestamp: t.timestamp,
        ignition: t.ignition,
      }));
    }

    // Default route simulation if no history recorded yet
    return [
      { latitude: -6.2088, longitude: 106.8456, speed: 45, heading: 120, timestamp: new Date(Date.now() - 3600000).toISOString(), ignition: true },
      { latitude: -6.2150, longitude: 106.8520, speed: 52, heading: 140, timestamp: new Date(Date.now() - 2400000).toISOString(), ignition: true },
      { latitude: -6.2220, longitude: 106.8600, speed: 60, heading: 160, timestamp: new Date(Date.now() - 1200000).toISOString(), ignition: true },
      { latitude: -6.2297, longitude: 106.8674, speed: 40, heading: 180, timestamp: new Date().toISOString(), ignition: true },
    ];
  }

  /**
   * Get active vehicle map markers
   */
  public getVehicleMarkers(): VehicleLocation[] {
    return gpsIngestionService.getLatestLocations();
  }
}

export const mapDataService = new MapDataService();
