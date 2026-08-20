/**
 * Fleet Intelligence Smart AI - Map Service Orchestrator
 * High-Level Map Engine Facade connecting UI with MapProvider implementation
 */

import { LeafletMapProvider } from '../providers/LeafletMapProvider';
import { 
  MapProvider, 
  MapVehicle, 
  MapStyle, 
  VehicleClusterData, 
  MapProviderOptions 
} from '../types';

export class MapService {
  private provider: MapProvider;

  constructor(provider?: MapProvider) {
    this.provider = provider || new LeafletMapProvider();
  }

  public initialize(container: HTMLElement, options?: MapProviderOptions): void {
    this.provider.initialize(container, options);
  }

  public setCenter(lat: number, lng: number, zoom?: number): void {
    this.provider.setCenter(lat, lng, zoom);
  }

  public setZoom(zoom: number): void {
    this.provider.setZoom(zoom);
  }

  public addMarker(vehicle: MapVehicle, onClick?: (vehicleId: string) => void): void {
    this.provider.addMarker(vehicle, onClick);
  }

  public removeMarker(vehicleId: string): void {
    this.provider.removeMarker(vehicleId);
  }

  public updateMarker(vehicle: MapVehicle): void {
    this.provider.updateMarker(vehicle);
  }

  public setSelectedMarker(vehicleId: string | null): void {
    this.provider.setSelectedMarker(vehicleId);
  }

  public setSelectedMarkers(vehicleIds: string[]): void {
    if (this.provider.setSelectedMarkers) {
      this.provider.setSelectedMarkers(vehicleIds);
    }
  }

  public fitBounds(points: Array<[number, number]>): void {
    this.provider.fitBounds(points);
  }

  public setClusters(clusters: VehicleClusterData[], onClusterClick?: (cluster: VehicleClusterData) => void): void {
    this.provider.setClusters(clusters, onClusterClick);
  }

  public setTileStyle(style: MapStyle): void {
    this.provider.setTileStyle(style);
  }

  public toggleTraffic(enable: boolean): void {
    if (this.provider.toggleTraffic) {
      this.provider.toggleTraffic(enable);
    }
  }

  public drawPolyline(id: string, coords: Array<[number, number]>, color?: string, dashed?: boolean): void {
    this.provider.drawPolyline(id, coords, color, dashed);
  }

  public clearPolyline(id: string): void {
    this.provider.clearPolyline(id);
  }

  public destroy(): void {
    this.provider.destroy();
  }
}

export const mapService = new MapService();
