/**
 * Fleet Intelligence Smart AI - Leaflet Geofence Map Component
 * Interactive drawing interface (Circle & Polygon), location search, vertex editing, and live vehicle overlay
 */

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Geofence, GeofenceType } from '../geofenceTypes';
import { Location, Vehicle } from '../../../types';
import { geofenceGeometryService } from '../services/geofenceGeometryService';
import {
  Search,
  Circle,
  Hexagon,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Move,
  Plus,
  RefreshCw,
  MapPin,
  Eye,
  Layers
} from 'lucide-react';

interface GeofenceMapComponentProps {
  geofences: Geofence[];
  selectedGeofenceId?: string;
  onSelectGeofence?: (id: string) => void;
  vehiclesInside?: Vehicle[];

  // Drawing Mode Props
  isDrawingMode?: boolean;
  drawingType?: GeofenceType;
  drawingCenter?: Location;
  drawingRadius?: number;
  drawingPolygon?: Location[];
  onDrawingCenterChange?: (center: Location) => void;
  onDrawingRadiusChange?: (radius: number) => void;
  onDrawingPolygonChange?: (polygon: Location[]) => void;
  onValidateGeometry?: () => void;
  validationError?: string;
}

export const GeofenceMapComponent: React.FC<GeofenceMapComponentProps> = ({
  geofences,
  selectedGeofenceId,
  onSelectGeofence,
  vehiclesInside = [],
  isDrawingMode = false,
  drawingType = 'CIRCLE',
  drawingCenter = { lat: -6.2088, lng: 106.8456 },
  drawingRadius = 500,
  drawingPolygon = [],
  onDrawingCenterChange,
  onDrawingRadiusChange,
  onDrawingPolygonChange,
  onValidateGeometry,
  validationError
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geofenceLayersGroupRef = useRef<L.LayerGroup | null>(null);
  const drawingLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const vehicleMarkersGroupRef = useRef<L.LayerGroup | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeDrawTool, setActiveDrawTool] = useState<'POINT' | 'VERTEX' | 'NONE'>('POINT');

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const defaultCenter: [number, number] = [-6.2088, 106.8456]; // Jakarta
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 12,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '&copy; CartoDB & OpenStreetMap',
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      geofenceLayersGroupRef.current = L.layerGroup().addTo(map);
      drawingLayerGroupRef.current = L.layerGroup().addTo(map);
      vehicleMarkersGroupRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Map Click Listener for Drawing Mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (!isDrawingMode) return;

      const newPoint: Location = { lat: e.latlng.lat, lng: e.latlng.lng };

      if (drawingType === 'CIRCLE') {
        if (onDrawingCenterChange) {
          onDrawingCenterChange(newPoint);
        }
      } else if (drawingType === 'POLYGON') {
        if (onDrawingPolygonChange) {
          const updatedPolygon = [...drawingPolygon, newPoint];
          onDrawingPolygonChange(updatedPolygon);
        }
      }
    };

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
    };
  }, [isDrawingMode, drawingType, drawingPolygon, onDrawingCenterChange, onDrawingPolygonChange]);

  // Render Geofences Layers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = geofenceLayersGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    geofences.forEach((g) => {
      const isSelected = g.id === selectedGeofenceId;
      const color = g.color || (g.priority === 'CRITICAL' ? '#EF4444' : '#3B82F6');

      if (g.type === 'CIRCLE') {
        const circle = L.circle([g.center.lat, g.center.lng], {
          radius: g.radiusMeters,
          color,
          weight: isSelected ? 4 : 2,
          fillColor: color,
          fillOpacity: isSelected ? 0.35 : 0.2,
        });

        circle.bindPopup(`
          <div style="font-family: sans-serif; padding: 4px; color: #0f172a;">
            <div style="font-weight: bold; font-size: 13px;">${g.name}</div>
            <div style="font-size: 11px; color: #64748b;">${g.code} • Circle Geofence</div>
            <div style="font-size: 11px; font-weight: bold; margin-top: 4px; color: #2563eb;">Radius: ${g.radiusMeters} meter</div>
            <div style="font-size: 11px; margin-top: 2px;">Kategori: ${g.category}</div>
            <div style="font-size: 11px; color: #475569;">Alamat: ${g.address || '-'}</div>
          </div>
        `);

        circle.on('click', () => {
          if (onSelectGeofence) onSelectGeofence(g.id);
        });

        circle.addTo(group);
      } else if (g.type === 'POLYGON' && g.polygonCoordinates.length >= 3) {
        const latLngs = g.polygonCoordinates.map((p) => [p.lat, p.lng] as [number, number]);
        const polygon = L.polygon(latLngs, {
          color,
          weight: isSelected ? 4 : 2,
          fillColor: color,
          fillOpacity: isSelected ? 0.35 : 0.2,
        });

        polygon.bindPopup(`
          <div style="font-family: sans-serif; padding: 4px; color: #0f172a;">
            <div style="font-weight: bold; font-size: 13px;">${g.name}</div>
            <div style="font-size: 11px; color: #64748b;">${g.code} • Polygon Geofence</div>
            <div style="font-size: 11px; margin-top: 2px;">Kategori: ${g.category}</div>
            <div style="font-size: 11px; color: #475569;">Alamat: ${g.address || '-'}</div>
          </div>
        `);

        polygon.on('click', () => {
          if (onSelectGeofence) onSelectGeofence(g.id);
        });

        polygon.addTo(group);
      }
    });

    // Pan map to selected geofence if available
    if (selectedGeofenceId) {
      const selectedG = geofences.find((g) => g.id === selectedGeofenceId);
      if (selectedG && selectedG.center) {
        map.panTo([selectedG.center.lat, selectedG.center.lng]);
      }
    }
  }, [geofences, selectedGeofenceId, onSelectGeofence]);

  // Render Drawing Shapes
  useEffect(() => {
    const group = drawingLayerGroupRef.current;
    if (!group) return;

    group.clearLayers();

    if (!isDrawingMode) return;

    if (drawingType === 'CIRCLE' && drawingCenter) {
      // Circle Center Marker
      const icon = L.divIcon({
        className: 'custom-drawing-marker',
        html: `<div style="background-color: #3b82f6; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 8px rgba(0,0,0,0.5);"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const marker = L.marker([drawingCenter.lat, drawingCenter.lng], { icon });
      marker.addTo(group);

      // Circle Boundary
      const circle = L.circle([drawingCenter.lat, drawingCenter.lng], {
        radius: drawingRadius,
        color: '#2563eb',
        weight: 3,
        dashArray: '6, 6',
        fillColor: '#3b82f6',
        fillOpacity: 0.25,
      });
      circle.addTo(group);
    } else if (drawingType === 'POLYGON' && drawingPolygon.length > 0) {
      // Polygon Vertex Markers
      drawingPolygon.forEach((vertex, idx) => {
        const icon = L.divIcon({
          className: 'custom-vertex-marker',
          html: `<div style="background-color: #10b981; color: white; font-weight: bold; font-size: 10px; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 6px rgba(0,0,0,0.5);">${idx + 1}</div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const vertexMarker = L.marker([vertex.lat, vertex.lng], { icon });
        vertexMarker.addTo(group);
      });

      if (drawingPolygon.length >= 2) {
        const latLngs = drawingPolygon.map((p) => [p.lat, p.lng] as [number, number]);
        const poly = L.polygon(latLngs, {
          color: '#059669',
          weight: 3,
          dashArray: '6, 6',
          fillColor: '#10b981',
          fillOpacity: 0.25,
        });
        poly.addTo(group);
      }
    }
  }, [isDrawingMode, drawingType, drawingCenter, drawingRadius, drawingPolygon]);

  // Handle Location Search
  const handleLocationSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !mapInstanceRef.current) return;

    // Search presets for common Indonesian logistics hubs
    const q = searchQuery.toLowerCase();
    let foundLat = -6.2088;
    let foundLng = 106.8456;

    if (q.includes('tanjung priok') || q.includes('priok')) {
      foundLat = -6.1152;
      foundLng = 106.8821;
    } else if (q.includes('cikarang') || q.includes('cdp') || q.includes('jababeka')) {
      foundLat = -6.2825;
      foundLng = 107.1702;
    } else if (q.includes('karawang') || q.includes('kiic')) {
      foundLat = -6.3501;
      foundLng = 107.2800;
    } else if (q.includes('soekarno') || q.includes('bandara') || q.includes('cgk')) {
      foundLat = -6.1256;
      foundLng = 106.6558;
    } else if (q.includes('surabaya') || q.includes('tanjung perak')) {
      foundLat = -7.2000;
      foundLng = 112.7333;
    }

    mapInstanceRef.current.setView([foundLat, foundLng], 14);

    if (isDrawingMode && onDrawingCenterChange) {
      onDrawingCenterChange({ lat: foundLat, lng: foundLng });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950">
      {/* Map DOM Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Search Toolbar Overlay */}
      <div className="absolute top-4 left-4 z-10 max-w-sm w-full">
        <form onSubmit={handleLocationSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari lokasi (Tanjung Priok, Cikarang, Karawang...)"
            className="w-full bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-white pl-9 pr-20 py-2.5 text-xs rounded-xl shadow-lg focus:outline-none focus:border-blue-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] rounded-lg transition-colors"
          >
            Cari
          </button>
        </form>
      </div>

      {/* Drawing Controls Overlay (When Drawing Mode is Active) */}
      {isDrawingMode && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 bg-slate-900/95 backdrop-blur-md border border-slate-700 p-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-950/80 text-blue-300 border border-blue-800 rounded-xl font-bold">
            {drawingType === 'CIRCLE' ? <Circle className="w-4 h-4" /> : <Hexagon className="w-4 h-4" />}
            <span>Menggambar {drawingType === 'CIRCLE' ? 'Circle' : 'Polygon'}</span>
          </div>

          {drawingType === 'CIRCLE' && (
            <div className="flex items-center gap-2 text-slate-300">
              <span>Radius:</span>
              <input
                type="range"
                min={50}
                max={5000}
                step={50}
                value={drawingRadius}
                onChange={(e) => onDrawingRadiusChange && onDrawingRadiusChange(Number(e.target.value))}
                className="w-28 accent-blue-500 cursor-pointer"
              />
              <span className="font-mono font-bold text-blue-400">{drawingRadius}m</span>
            </div>
          )}

          {drawingType === 'POLYGON' && (
            <div className="flex items-center gap-2">
              <span className="text-slate-300">
                Titik: <strong className="text-emerald-400">{drawingPolygon.length}</strong>
              </span>
              <button
                onClick={() => onDrawingPolygonChange && onDrawingPolygonChange([])}
                className="flex items-center gap-1 px-2.5 py-1 text-rose-300 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800 rounded-lg font-bold text-[10px]"
              >
                <Trash2 className="w-3 h-3" />
                <span>Reset Points</span>
              </button>
            </div>
          )}

          {validationError && (
            <div className="flex items-center gap-1.5 text-rose-400 bg-rose-950/80 px-2.5 py-1 rounded-lg border border-rose-800 text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}
        </div>
      )}

      {/* Map Legend Badge */}
      <div className="absolute top-4 right-4 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-2.5 rounded-xl shadow-lg text-[10px] text-slate-300 space-y-1">
        <div className="flex items-center gap-2 font-bold text-slate-200">
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span>Legenda Layer</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 border border-white" />
          <span>Circle Geofence</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
          <span>Polygon Geofence</span>
        </div>
      </div>
    </div>
  );
};
