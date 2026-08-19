/**
 * Fleet Intelligence Smart AI - Command Center Map Container
 * Leaflet-powered GIS Telemetry Map with Geofences, Emergency Pulsing Layers, and Vehicle Follow
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { 
  Navigation2, 
  Layers, 
  LocateFixed, 
  ZoomIn, 
  ZoomOut, 
  Compass, 
  ShieldAlert, 
  Fuel, 
  Battery, 
  Gauge, 
  User, 
  Truck, 
  X, 
  Activity, 
  ExternalLink 
} from 'lucide-react';
import { commandCenterService } from '../../services/commandCenterService';
import { liveTrackingService } from '../../../maps/services/liveTrackingService';
import { MapVehicle } from '../../../maps/types';
import { mockGeofences } from '../../../../constants/mockData';

interface CommandCenterMapContainerProps {
  onSelectVehicle?: (vehicleId: string) => void;
  onOpenEmergency?: (emergencyId: string) => void;
}

export const CommandCenterMapContainer: React.FC<CommandCenterMapContainerProps> = ({
  onSelectVehicle,
  onOpenEmergency,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const geofenceLayersRef = useRef<L.LayerGroup | null>(null);
  const emergencyCirclesRef = useRef<L.LayerGroup | null>(null);

  const [selectedVehicle, setSelectedVehicle] = useState<MapVehicle | null>(null);
  const [followingVehicleId, setFollowingVehicleId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState(commandCenterService.getActiveFilter());
  const [layerConfig, setLayerConfig] = useState(commandCenterService.getLayerConfig());

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [-6.2088, 106.8456], // Jakarta Center
      zoom: 11,
      zoomControl: false,
      attributionControl: false,
    });

    // Dark Matter Map Tiles for Tactical Command Center
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    geofenceLayersRef.current = L.layerGroup().addTo(map);
    emergencyCirclesRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    // Handle map click to deselect
    map.on('click', () => {
      setSelectedVehicle(null);
      commandCenterService.setSelectedVehicleId(null);
      commandCenterService.setFollowingVehicleId(null);
      setFollowingVehicleId(null);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Render Geofences
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = geofenceLayersRef.current;
    if (!map || !group) return;

    group.clearLayers();

    if (!layerConfig.showGeofences) return;

    mockGeofences.forEach((geo) => {
      if (geo.coordinates && geo.coordinates.length > 2) {
        const latLngs = geo.coordinates.map((c) => [c.lat, c.lng] as [number, number]);
        const polygon = L.polygon(latLngs, {
          color: geo.category === 'depot' ? '#3b82f6' : geo.category === 'customer_site' ? '#10b981' : '#f59e0b',
          weight: 2,
          opacity: 0.8,
          fillColor: geo.category === 'depot' ? '#3b82f6' : geo.category === 'customer_site' ? '#10b981' : '#f59e0b',
          fillOpacity: 0.15,
          dashArray: '4, 6',
        });

        polygon.bindTooltip(
          `<div class="font-bold text-xs">${geo.name}</div><div class="text-[10px] text-gray-500">${(geo.category || geo.type).toUpperCase()} • Radius Batas</div>`,
          { permanent: false, direction: 'top' }
        );
        group.addLayer(polygon);
      }
    });
  }, [layerConfig.showGeofences]);

  // Update Markers & Realtime Telemetry
  const updateMapMarkers = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const vehicles = liveTrackingService.getAllVehicles();
    const emergencies = commandCenterService.getEmergencies();
    const activeEmergencies = emergencies.filter((e) => e.status === 'ACTIVE' || e.status === 'INVESTIGATING');

    // Update Emergency Zones
    if (emergencyCirclesRef.current) {
      emergencyCirclesRef.current.clearLayers();
      if (layerConfig.showEmergencyZones) {
        activeEmergencies.forEach((emg) => {
          const circle = L.circle([emg.location.lat, emg.location.lng], {
            radius: 800,
            color: '#ef4444',
            weight: 2,
            fillColor: '#ef4444',
            fillOpacity: 0.25,
            className: 'animate-pulse',
          });
          circle.bindTooltip(
            `<div class="font-bold text-xs text-red-600">🚨 ZONA DARURAT: ${emg.plateNumber}</div><div class="text-[10px]">${emg.title}</div>`,
            { permanent: true, direction: 'center', className: 'bg-red-950 text-white border-red-500 text-xs px-2 py-1 rounded shadow-lg' }
          );
          emergencyCirclesRef.current?.addLayer(circle);
        });
      }
    }

    // Filter vehicles according to active filter
    let displayVehicles = vehicles;
    if (activeFilter === 'MOVING_ONLY') {
      displayVehicles = vehicles.filter((v) => v.status === 'Moving');
    } else if (activeFilter === 'OFFLINE_ONLY') {
      displayVehicles = vehicles.filter((v) => v.status === 'Offline');
    } else if (activeFilter === 'EMERGENCY_ONLY') {
      const emgVehicleIds = activeEmergencies.map((e) => e.vehicleId);
      displayVehicles = vehicles.filter((v) => emgVehicleIds.includes(v.vehicleId));
    }

    const currentMarkerIds = new Set<string>();

    displayVehicles.forEach((v) => {
      currentMarkerIds.add(v.vehicleId);
      const isEmergency = activeEmergencies.some((e) => e.vehicleId === v.vehicleId);
      const isSelected = selectedVehicle?.vehicleId === v.vehicleId;

      // Color mapping
      let colorClass = 'bg-emerald-500 text-white ring-2 ring-emerald-300';
      if (isEmergency) {
        colorClass = 'bg-rose-600 text-white ring-4 ring-rose-400 animate-bounce';
      } else if (v.status === 'Idle') {
        colorClass = 'bg-amber-500 text-white ring-2 ring-amber-300';
      } else if (v.status === 'Stopped') {
        colorClass = 'bg-sky-600 text-white ring-2 ring-sky-300';
      } else if (v.status === 'Offline') {
        colorClass = 'bg-slate-600 text-slate-200 ring-1 ring-slate-400';
      }

      // Custom HTML Marker with heading rotation
      const customIcon = L.divIcon({
        className: 'custom-fleet-marker',
        html: `
          <div class="relative flex items-center justify-center transition-transform" style="transform: translate(-50%, -50%);">
            ${isEmergency ? '<span class="absolute -top-3 -right-3 flex h-4 w-4"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span><span class="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[9px] text-white font-bold items-center justify-center">!</span></span>' : ''}
            <div class="w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white ${colorClass}">
              <svg style="transform: rotate(${v.heading || 0}deg);" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
              </svg>
            </div>
            <div class="absolute -bottom-5 bg-slate-900/90 text-slate-100 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded shadow border border-slate-700 whitespace-nowrap">
              ${v.vehiclePlate}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      let existingMarker = markersRef.current.get(v.vehicleId);

      if (existingMarker) {
        existingMarker.setLatLng([v.latitude, v.longitude]);
        existingMarker.setIcon(customIcon);
      } else {
        const marker = L.marker([v.latitude, v.longitude], { icon: customIcon }).addTo(map);
        marker.on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          setSelectedVehicle(v);
          commandCenterService.setSelectedVehicleId(v.vehicleId);
          if (onSelectVehicle) onSelectVehicle(v.vehicleId);
        });
        markersRef.current.set(v.vehicleId, marker);
      }

      // Camera follow active vehicle
      if (followingVehicleId === v.vehicleId) {
        map.panTo([v.latitude, v.longitude], { animate: true });
      }
    });

    // Clean up old markers
    markersRef.current.forEach((marker, id) => {
      if (!currentMarkerIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });
  }, [activeFilter, followingVehicleId, layerConfig.showEmergencyZones, onSelectVehicle, selectedVehicle]);

  // Subscribe to service updates
  useEffect(() => {
    const unsubscribe = commandCenterService.subscribe(() => {
      setActiveFilter(commandCenterService.getActiveFilter());
      setLayerConfig(commandCenterService.getLayerConfig());
      setFollowingVehicleId(commandCenterService.getFollowingVehicleId());

      const selectedId = commandCenterService.getSelectedVehicleId();
      if (selectedId) {
        const found = liveTrackingService.getAllVehicles().find((v) => v.vehicleId === selectedId);
        if (found) setSelectedVehicle(found);
      }
      updateMapMarkers();
    });

    updateMapMarkers();
    return unsubscribe;
  }, [updateMapMarkers]);

  // Zoom Helpers
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetView = () => {
    mapInstanceRef.current?.setView([-6.2088, 106.8456], 11, { animate: true });
  };
  const handleJavaOverview = () => {
    mapInstanceRef.current?.setView([-7.2504, 110.1500], 7, { animate: true });
  };

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden select-none">
      {/* Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Map Controls (Top Right) */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
        <button
          onClick={handleZoomIn}
          title="Perbesar Peta (+)"
          className="w-8 h-8 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center shadow-lg transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Perkecil Peta (-)"
          className="w-8 h-8 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center shadow-lg transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetView}
          title="Fokus Jabodetabek"
          className="w-8 h-8 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center shadow-lg transition-colors"
        >
          <LocateFixed className="w-4 h-4" />
        </button>
        <button
          onClick={handleJavaOverview}
          title="Overview Koridor Trans-Jawa"
          className="w-8 h-8 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center shadow-lg transition-colors"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Selected Vehicle Telemetry Card */}
      {selectedVehicle && (
        <div className="absolute top-3 left-3 w-80 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-3 text-slate-100 shadow-2xl z-20 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start justify-between pb-2 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-amber-400">
                  {selectedVehicle.vehiclePlate}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedVehicle.status === 'Moving'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : selectedVehicle.status === 'Idle'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {selectedVehicle.status.toUpperCase()}
                </span>
              </div>
              <div className="text-xs text-slate-400 font-medium">{selectedVehicle.vehicleName}</div>
            </div>
            <button
              onClick={() => {
                setSelectedVehicle(null);
                commandCenterService.setSelectedVehicleId(null);
              }}
              className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Telemetry Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 py-2.5 text-center">
            <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
              <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                <Gauge className="w-3 h-3 text-blue-400" />
                <span>Speed</span>
              </div>
              <div className="text-sm font-mono font-bold text-white mt-0.5">
                {selectedVehicle.speed} <span className="text-[10px] font-normal text-slate-400">km/h</span>
              </div>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
              <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                <Fuel className="w-3 h-3 text-amber-400" />
                <span>Solar</span>
              </div>
              <div className="text-sm font-mono font-bold text-white mt-0.5">
                {selectedVehicle.fuelLevelPercent}%
              </div>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
              <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                <Battery className="w-3 h-3 text-emerald-400" />
                <span>Aki</span>
              </div>
              <div className="text-sm font-mono font-bold text-white mt-0.5">
                {selectedVehicle.batteryLevel || 24.1}V
              </div>
            </div>
          </div>

          {/* Driver & Trip Info */}
          <div className="space-y-1.5 text-xs text-slate-300 py-1 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400" /> Driver:
              </span>
              <span className="font-semibold text-white">{selectedVehicle.driverName || 'Sutrisno Hartono'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Skor Safety:</span>
              <span className="font-mono font-bold text-emerald-400">{selectedVehicle.driverScore || 94}/100</span>
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              📍 {selectedVehicle.address || 'Tol Jakarta-Cikampek KM 28.5'}
            </div>
          </div>

          {/* Card Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                const nextFollow = followingVehicleId === selectedVehicle.vehicleId ? null : selectedVehicle.vehicleId;
                setFollowingVehicleId(nextFollow);
                commandCenterService.setFollowingVehicleId(nextFollow);
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold border transition-colors ${
                followingVehicleId === selectedVehicle.vehicleId
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Navigation2 className="w-3.5 h-3.5" />
              <span>{followingVehicleId === selectedVehicle.vehicleId ? 'Mengikuti Kamera' : 'Ikuti Unit'}</span>
            </button>
            <button
              onClick={() => {
                commandCenterService.triggerEmergencySOS({
                  vehicleId: selectedVehicle.vehicleId,
                  plateNumber: selectedVehicle.vehiclePlate,
                  driverId: selectedVehicle.driverId || 'drv-01',
                  driverName: selectedVehicle.driverName || 'Driver Aktif',
                  driverPhone: '+62 812-3456-7890',
                  type: 'PANIC',
                  description: `Panggilan darurat operator untuk unit ${selectedVehicle.vehiclePlate}`,
                  location: { lat: selectedVehicle.latitude, lng: selectedVehicle.longitude },
                });
              }}
              className="py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40"
              title="Kirim Peringatan Darurat SOS ke Unit Ini"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Map Legend (Bottom Left) */}
      <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-sm border border-slate-800 px-3 py-2 rounded-lg text-[11px] text-slate-300 flex items-center gap-3 shadow-lg z-10">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Moving</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>Idle</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
          <span>Stopped</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
          <span>Offline</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
          <span className="text-rose-400 font-bold">SOS</span>
        </div>
      </div>
    </div>
  );
};
