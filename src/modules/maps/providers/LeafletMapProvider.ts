/**
 * Fleet Intelligence Smart AI - Leaflet Map Provider Implementation
 * Enterprise Provider-Agnostic Map Engine with Custom Markers & Smooth Movement
 */

import L from 'leaflet';
import { 
  MapProvider, 
  MapVehicle, 
  MapStyle, 
  VehicleClusterData, 
  MapProviderOptions,
  MapViewportBounds
} from '../types';

export class LeafletMapProvider implements MapProvider {
  private map: L.Map | null = null;
  private currentStyle: MapStyle = 'dark';
  private tileLayer: L.TileLayer | null = null;
  private trafficLayer: L.TileLayer | null = null;
  private markers: Map<string, L.Marker> = new Map();
  private clusterMarkers: L.Marker[] = [];
  private polylines: Map<string, L.Polyline> = new Map();
  private selectedVehicleId: string | null = null;
  private selectedVehicleIds: Set<string> = new Set();
  private onMarkerClickCallback: ((vehicleId: string) => void) | null = null;

  public initialize(container: HTMLElement, options?: MapProviderOptions): void {
    if (this.map) {
      this.destroy();
    }

    const defaultCenter: [number, number] = options?.center || [-6.200000, 106.816666]; // Jakarta Default
    const defaultZoom = options?.zoom || 12;

    this.map = L.map(container, {
      center: defaultCenter,
      zoom: defaultZoom,
      zoomControl: false, // We render custom enterprise zoom controls
      attributionControl: false
    });

    this.currentStyle = options?.style || 'dark';
    this.applyTileStyle(this.currentStyle);

    if (options?.showTraffic) {
      this.toggleTraffic(true);
    }

    // Map viewport movement events
    if (options?.onMapMove) {
      this.map.on('moveend zoomend', () => {
        if (!this.map) return;
        const bounds = this.map.getBounds();
        const viewport: MapViewportBounds = {
          northEast: [bounds.getNorthEast().lat, bounds.getNorthEast().lng],
          southWest: [bounds.getSouthWest().lat, bounds.getSouthWest().lng],
          zoom: this.map.getZoom()
        };
        options.onMapMove!(viewport);
      });
    }

    if (options?.onMapClick) {
      this.map.on('click', (e: L.LeafletMouseEvent) => {
        options.onMapClick!({ lat: e.latlng.lat, lng: e.latlng.lng });
      });
    }

    // Force tile recalculation after layout container is ready
    setTimeout(() => {
      this.map?.invalidateSize();
    }, 150);
  }

  public setCenter(lat: number, lng: number, zoom?: number): void {
    if (!this.map) return;
    if (zoom) {
      this.map.setView([lat, lng], zoom, { animate: true });
    } else {
      this.map.panTo([lat, lng], { animate: true });
    }
  }

  public setZoom(zoom: number): void {
    if (!this.map) return;
    this.map.setZoom(zoom);
  }

  public addMarker(vehicle: MapVehicle, onClick?: (vehicleId: string) => void): void {
    if (!this.map) return;
    if (onClick) {
      this.onMarkerClickCallback = onClick;
    }

    // Remove existing marker if present
    this.removeMarker(vehicle.vehicleId);

    const icon = this.createVehicleIcon(vehicle);
    const marker = L.marker([vehicle.latitude, vehicle.longitude], {
      icon,
      zIndexOffset: this.selectedVehicleId === vehicle.vehicleId || this.selectedVehicleIds.has(vehicle.vehicleId) ? 1000 : 100
    });

    marker.on('click', (e) => {
      L.DomEvent.stopPropagation(e);
      if (this.onMarkerClickCallback) {
        this.onMarkerClickCallback(vehicle.vehicleId);
      }
    });

    marker.addTo(this.map);
    this.markers.set(vehicle.vehicleId, marker);
  }

  public removeMarker(vehicleId: string): void {
    const marker = this.markers.get(vehicleId);
    if (marker && this.map) {
      this.map.removeLayer(marker);
      this.markers.delete(vehicleId);
    }
  }

  public updateMarker(vehicle: MapVehicle): void {
    const marker = this.markers.get(vehicle.vehicleId);
    if (!marker) {
      this.addMarker(vehicle, this.onMarkerClickCallback || undefined);
      return;
    }

    // Smooth position interpolation
    const currentLatLng = marker.getLatLng();
    const newLatLng = L.latLng(vehicle.latitude, vehicle.longitude);

    if (currentLatLng.lat !== newLatLng.lat || currentLatLng.lng !== newLatLng.lng) {
      this.animateMarkerPosition(marker, currentLatLng, newLatLng);
    }

    // Update icon appearance (heading, status, alert state, selection)
    const icon = this.createVehicleIcon(vehicle);
    marker.setIcon(icon);
    marker.setZIndexOffset(
      this.selectedVehicleId === vehicle.vehicleId || this.selectedVehicleIds.has(vehicle.vehicleId) ? 1000 : 100
    );
  }

  public setSelectedMarker(vehicleId: string | null): void {
    this.selectedVehicleId = vehicleId;
    if (vehicleId) {
      this.selectedVehicleIds.clear();
      this.selectedVehicleIds.add(vehicleId);
    } else {
      this.selectedVehicleIds.clear();
    }
    this.refreshAllMarkerIcons();
  }

  public setSelectedMarkers(vehicleIds: string[]): void {
    this.selectedVehicleIds = new Set(vehicleIds);
    this.selectedVehicleId = vehicleIds.length === 1 ? vehicleIds[0] : null;
    this.refreshAllMarkerIcons();
  }

  private refreshAllMarkerIcons(): void {
    this.markers.forEach((marker, vId) => {
      const isSel = this.selectedVehicleId === vId || this.selectedVehicleIds.has(vId);
      marker.setZIndexOffset(isSel ? 1000 : 100);
    });
  }

  public fitBounds(points: Array<[number, number]>): void {
    if (!this.map || points.length === 0) return;
    if (points.length === 1) {
      this.setCenter(points[0][0], points[0][1], 15);
      return;
    }
    const bounds = L.latLngBounds(points.map(([lat, lng]) => L.latLng(lat, lng)));
    this.map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16, animate: true });
  }

  public setClusters(clusters: VehicleClusterData[], onClusterClick?: (cluster: VehicleClusterData) => void): void {
    if (!this.map) return;

    this.clusterMarkers.forEach((m) => this.map?.removeLayer(m));
    this.clusterMarkers = [];

    clusters.forEach((cluster) => {
      const clusterIcon = L.divIcon({
        className: 'custom-cluster-marker',
        html: `
          <div class="relative flex items-center justify-center h-11 w-11 rounded-full bg-cyan-950/95 border-2 border-cyan-400 text-cyan-300 font-bold font-mono text-xs shadow-xl shadow-cyan-950/80 hover:scale-115 transition-transform cursor-pointer">
            <span class="animate-ping absolute inset-0 rounded-full bg-cyan-400 opacity-20 pointer-events-none"></span>
            ${cluster.count}
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      const clusterMarker = L.marker(cluster.center, { icon: clusterIcon });
      clusterMarker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        if (onClusterClick) {
          onClusterClick(cluster);
        } else if (this.map) {
          if (cluster.bounds) {
            this.map.fitBounds(cluster.bounds, { padding: [40, 40] });
          } else {
            this.map.setView(cluster.center, (this.map.getZoom() || 12) + 2);
          }
        }
      });

      clusterMarker.addTo(this.map);
      this.clusterMarkers.push(clusterMarker);
    });
  }

  public drawPolyline(id: string, coords: Array<[number, number]>, color = '#06b6d4', dashed = true): void {
    if (!this.map) return;
    this.clearPolyline(id);

    const polyline = L.polyline(coords, {
      color,
      weight: 4,
      opacity: 0.85,
      dashArray: dashed ? '8, 8' : undefined
    }).addTo(this.map);

    this.polylines.set(id, polyline);
  }

  public clearPolyline(id: string): void {
    const polyline = this.polylines.get(id);
    if (polyline && this.map) {
      this.map.removeLayer(polyline);
      this.polylines.delete(id);
    }
  }

  public setTileStyle(style: MapStyle): void {
    if (this.currentStyle === style) return;
    this.currentStyle = style;
    this.applyTileStyle(style);
  }

  public toggleTraffic(enable: boolean): void {
    if (!this.map) return;
    if (this.trafficLayer) {
      this.map.removeLayer(this.trafficLayer);
      this.trafficLayer = null;
    }

    if (enable) {
      // TomTom / OpenTransport / OpenStreetMap flow overlay tiles
      this.trafficLayer = L.tileLayer('https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=6170aad10cd942889deac8d3c16f7393', {
        maxZoom: 19,
        opacity: 0.7,
        attribution: '&copy; OpenStreetMap'
      }).addTo(this.map);
    }
  }

  public destroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    this.markers.clear();
    this.clusterMarkers = [];
    this.polylines.clear();
  }

  // Helper Methods
  private applyTileStyle(style: MapStyle): void {
    if (!this.map) return;
    if (this.tileLayer) {
      this.map.removeLayer(this.tileLayer);
    }

    let tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    let maxZoom = 19;

    switch (style) {
      case 'street':
      case 'default':
        tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        break;
      case 'light':
        tileUrl = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
        break;
      case 'satellite':
        tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        maxZoom = 18;
        break;
      case 'terrain':
        tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
        maxZoom = 17;
        break;
      case 'dark':
      default:
        tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
        break;
    }

    this.tileLayer = L.tileLayer(tileUrl, {
      maxZoom,
      subdomains: 'abcd',
      attribution: '&copy; OpenStreetMap &copy; CARTO'
    }).addTo(this.map);
  }

  private createVehicleIcon(vehicle: MapVehicle): L.DivIcon {
    const isSelected = this.selectedVehicleId === vehicle.vehicleId || this.selectedVehicleIds.has(vehicle.vehicleId);
    
    // Status color mapping adhering to exact user request
    let colorClass = 'bg-slate-600 border-slate-400 text-slate-100'; // Offline
    let glowClass = 'shadow-slate-900/50';
    let pulseHtml = '';

    if (vehicle.status === 'Moving') {
      colorClass = 'bg-emerald-500 border-emerald-300 text-emerald-950';
      glowClass = 'shadow-emerald-500/50';
      pulseHtml = '<span class="absolute -inset-1.5 rounded-full animate-ping bg-emerald-400 opacity-40 pointer-events-none"></span>';
    } else if (vehicle.status === 'Idle') {
      colorClass = 'bg-amber-500 border-amber-300 text-amber-950';
      glowClass = 'shadow-amber-500/50';
    } else if (vehicle.status === 'Parking' || vehicle.status === 'Stopped') {
      colorClass = 'bg-blue-600 border-blue-300 text-white';
      glowClass = 'shadow-blue-500/50';
    } else if (vehicle.status === 'Emergency') {
      colorClass = 'bg-rose-600 border-rose-300 text-white animate-pulse';
      glowClass = 'shadow-rose-600/80';
      pulseHtml = '<span class="absolute -inset-2 rounded-full animate-ping bg-rose-500 opacity-75 pointer-events-none"></span>';
    } else if (vehicle.status === 'Maintenance') {
      colorClass = 'bg-orange-500 border-orange-300 text-orange-950';
      glowClass = 'shadow-orange-500/50';
    }

    const headingRotation = vehicle.heading || 0;

    const html = `
      <div class="relative flex flex-col items-center group cursor-pointer select-none">
        ${pulseHtml}
        ${vehicle.hasActiveAlert || vehicle.status === 'Emergency' ? `
          <div class="absolute -top-2 -right-2 z-30 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-white font-bold text-[9px] animate-bounce shadow-md">
            !
          </div>
        ` : ''}

        <!-- Vehicle Marker Ring & Rotated Direction Pointer -->
        <div class="relative flex items-center justify-center h-9 w-9 rounded-full ${colorClass} border-2 shadow-xl ${glowClass} transition-transform ${isSelected ? 'scale-125 ring-4 ring-cyan-400 ring-offset-2 ring-offset-slate-950' : 'hover:scale-110'}">
          <!-- Rotated Direction Arrow -->
          <div style="transform: rotate(${headingRotation}deg);" class="transition-transform duration-300 flex items-center justify-center">
            <svg class="h-5 w-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
            </svg>
          </div>
        </div>

        <!-- Plate & Speed Badge Pill -->
        <div class="mt-1 px-1.5 py-0.5 rounded bg-slate-900/90 border border-slate-700/80 text-[10px] font-mono font-bold text-slate-100 whitespace-nowrap shadow-md pointer-events-none flex items-center gap-1">
          <span>${vehicle.vehiclePlate}</span>
          ${vehicle.speed > 0 ? `<span class="text-emerald-400 font-semibold">${Math.round(vehicle.speed)}k</span>` : ''}
        </div>
      </div>
    `;

    return L.divIcon({
      className: 'custom-vehicle-marker-container',
      html,
      iconSize: [60, 60],
      iconAnchor: [30, 30]
    });
  }

  private animateMarkerPosition(marker: L.Marker, startLatLng: L.LatLng, endLatLng: L.LatLng, durationMs = 800): void {
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      const lat = startLatLng.lat + (endLatLng.lat - startLatLng.lat) * progress;
      const lng = startLatLng.lng + (endLatLng.lng - startLatLng.lng) * progress;

      marker.setLatLng([lat, lng]);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }
}

