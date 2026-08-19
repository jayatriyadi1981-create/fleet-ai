/**
 * Fleet Intelligence Smart AI - Trip Detail & Playback Map
 * PROMPT 14 — Canvas/Map Native Route Polyline, Start/End Markers & Animated Marker
 */

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TripRoute, TripPoint, DetailedTrip, TripEvent } from '../../modules/trips/types';
import { PlaybackFrameState } from '../../modules/trips/services/tripPlaybackEngine';
import { Layers, Maximize2, Navigation, MapPin, AlertCircle, ShieldAlert } from 'lucide-react';

interface TripDetailMapProps {
  trip: DetailedTrip;
  route: TripRoute;
  playbackState: PlaybackFrameState;
  selectedEventId?: string | null;
  onSelectEvent?: (event: TripEvent) => void;
}

export const TripDetailMap: React.FC<TripDetailMapProps> = ({
  trip,
  route,
  playbackState,
  selectedEventId,
  onSelectEvent,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const activeVehicleMarkerRef = useRef<L.Marker | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  const [mapStyle, setMapStyle] = useState<'light' | 'dark' | 'satellite'>('light');
  const [tileLayer, setTileLayer] = useState<L.TileLayer | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [trip.startLatitude, trip.startLongitude],
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
      });

      mapRef.current = map;
      markersGroupRef.current = L.layerGroup().addTo(map);

      // Force layout recalculation
      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [trip.id]);

  // Handle Tile Style
  useEffect(() => {
    if (!mapRef.current) return;

    if (tileLayer) {
      mapRef.current.removeLayer(tileLayer);
    }

    let url = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    if (mapStyle === 'dark') {
      url = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    } else if (mapStyle === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    }

    const newTile = L.tileLayer(url, { maxZoom: 19, subdomains: 'abcd' }).addTo(mapRef.current);
    setTileLayer(newTile);
  }, [mapStyle, trip.id]);

  // Render Route Polyline & Markers (Start, End, Stops, Idles, Events)
  useEffect(() => {
    if (!mapRef.current || !route.points.length) return;

    const map = mapRef.current;
    const markersGroup = markersGroupRef.current;
    if (markersGroup) markersGroup.clearLayers();

    // 1. Draw Route Polyline
    if (routePolylineRef.current) {
      map.removeLayer(routePolylineRef.current);
    }

    const coords: [number, number][] = route.points.map((pt) => [pt.latitude, pt.longitude]);
    const polyline = L.polyline(coords, {
      color: '#2563eb', // Blue
      weight: 5,
      opacity: 0.85,
    }).addTo(map);

    routePolylineRef.current = polyline;

    // Fit Bounds
    if (coords.length > 0) {
      map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
    }

    // 2. Start (A) Marker
    const startIcon = L.divIcon({
      className: 'custom-start-icon',
      html: `
        <div class="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 border-2 border-white text-white font-bold text-xs shadow-md">
          A
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
    L.marker([trip.startLatitude, trip.startLongitude], { icon: startIcon })
      .bindTooltip(`<b>Titik Mulai (A)</b><br/>${trip.startAddress}`, { direction: 'top' })
      .addTo(markersGroup!);

    // 3. End (B) Marker
    const endIcon = L.divIcon({
      className: 'custom-end-icon',
      html: `
        <div class="flex items-center justify-center w-8 h-8 rounded-full bg-rose-600 border-2 border-white text-white font-bold text-xs shadow-md">
          B
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
    L.marker([trip.endLatitude, trip.endLongitude], { icon: endIcon })
      .bindTooltip(`<b>Titik Tujuan (B)</b><br/>${trip.endAddress}`, { direction: 'top' })
      .addTo(markersGroup!);

    // 4. Stops Markers (S)
    route.stops.forEach((stop, idx) => {
      const stopIcon = L.divIcon({
        className: 'custom-stop-icon',
        html: `
          <div class="flex items-center justify-center w-7 h-7 rounded-full bg-amber-500 border-2 border-white text-white font-bold text-[11px] shadow-sm">
            S${idx + 1}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      L.marker([stop.location.lat, stop.location.lng], { icon: stopIcon })
        .bindTooltip(`<b>Pemberhentian S${idx + 1}</b><br/>Durasi: ${Math.round(stop.durationSeconds / 60)} menit`, { direction: 'top' })
        .addTo(markersGroup!);
    });

    // 5. Events Markers (Speeding / Harsh Braking)
    route.events.forEach((ev) => {
      const isSpeeding = ev.type === 'speeding';
      const evIcon = L.divIcon({
        className: 'custom-event-icon',
        html: `
          <div class="flex items-center justify-center w-7 h-7 rounded-full ${
            isSpeeding ? 'bg-rose-600' : 'bg-purple-600'
          } border-2 border-white text-white font-bold text-xs shadow-md animate-pulse">
            !
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      const m = L.marker([ev.latitude, ev.longitude], { icon: evIcon })
        .bindPopup(`
          <div style="font-size:12px;">
            <b style="color:${isSpeeding ? '#dc2626' : '#9333ea'}">${ev.message}</b><br/>
            Waktu: ${new Date(ev.timestamp).toLocaleTimeString()}<br/>
            Kecepatan: ${ev.speed} km/h<br/>
            <span style="color:#6b7280;">${ev.details || ''}</span>
          </div>
        `)
        .addTo(markersGroup!);

      if (selectedEventId === ev.id) {
        m.openPopup();
      }
    });

  }, [route, trip.id, selectedEventId]);

  // 6. Active Animated Vehicle Marker during Playback
  useEffect(() => {
    if (!mapRef.current) return;
    const pt = playbackState.currentPoint;
    if (!pt) return;

    const heading = pt.heading || 0;
    const iconHtml = `
      <div class="relative flex flex-col items-center">
        <!-- Directional vehicle ring -->
        <div class="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white border-2 border-white shadow-xl ring-4 ring-blue-300 ring-opacity-50">
          <div style="transform: rotate(${heading}deg);" class="transition-transform duration-200">
            <svg class="h-6 w-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
            </svg>
          </div>
        </div>
        <!-- Speed & Nopol Badge -->
        <div class="mt-1 px-2 py-0.5 rounded bg-gray-900/90 text-white font-mono text-[10px] font-bold shadow-lg">
          ${trip.vehiclePlate} (${pt.speed} km/h)
        </div>
      </div>
    `;

    const vehicleIcon = L.divIcon({
      className: 'playback-vehicle-marker',
      html: iconHtml,
      iconSize: [60, 60],
      iconAnchor: [30, 30],
    });

    if (!activeVehicleMarkerRef.current) {
      activeVehicleMarkerRef.current = L.marker([pt.latitude, pt.longitude], {
        icon: vehicleIcon,
        zIndexOffset: 2000,
      }).addTo(mapRef.current);
    } else {
      activeVehicleMarkerRef.current.setLatLng([pt.latitude, pt.longitude]);
      activeVehicleMarkerRef.current.setIcon(vehicleIcon);
    }

    // Auto pan if playing
    if (playbackState.status === 'PLAYING') {
      mapRef.current.panTo([pt.latitude, pt.longitude], { animate: true });
    }
  }, [playbackState.currentIndex, playbackState.status, trip.vehiclePlate]);

  return (
    <div className="relative w-full h-[450px] lg:h-[550px] rounded-xl overflow-hidden border border-gray-200 shadow-2xs">
      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-full bg-gray-100 z-0" />

      {/* Top Left Floating Legend */}
      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs p-2.5 rounded-lg border border-gray-200 shadow-md z-10 text-xs flex flex-col gap-1.5">
        <div className="font-semibold text-gray-900 border-b border-gray-100 pb-1">Keterangan Rute</div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">A</span>
          <span className="text-gray-700">Titik Keberangkatan</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold">B</span>
          <span className="text-gray-700">Titik Tujuan</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[9px] font-bold">S</span>
          <span className="text-gray-700">Lokasi Pemberhentian</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[9px] font-bold">!</span>
          <span className="text-gray-700">Anomali / Overspeed</span>
        </div>
      </div>

      {/* Top Right Controls (Style Switcher & Reset Center) */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-xs p-1 rounded-lg border border-gray-200 shadow-md z-10">
        {(['light', 'dark', 'satellite'] as const).map((style) => (
          <button
            key={style}
            onClick={() => setMapStyle(style)}
            className={`px-2.5 py-1 text-xs font-medium rounded-md capitalize transition-colors ${
              mapStyle === style ? 'bg-blue-600 text-white font-semibold' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {style}
          </button>
        ))}
      </div>
    </div>
  );
};
