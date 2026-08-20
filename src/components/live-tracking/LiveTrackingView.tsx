/**
 * Fleet Intelligence Smart AI - Live Tracking Main View Orchestrator
 * Enterprise Full-Viewport Map Engine Container with Dual Engines (Google Maps & Leaflet)
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Plus, 
  Minus, 
  Crosshair, 
  Maximize, 
  Minimize, 
  Layers, 
  Map, 
  Sun, 
  Moon, 
  Globe, 
  Radio, 
  X,
  Compass,
  Sparkles,
  Activity,
  Ruler
} from 'lucide-react';
import { mapService } from '../../modules/maps/services/mapService';
import { liveTrackingService, RealtimeTransportState, LiveTrackingFilterState, LiveVehicleCounters } from '../../modules/maps/services/liveTrackingService';
import { MapVehicle, MapStyle } from '../../modules/maps/types';
import { LiveTrackingHeader } from './LiveTrackingHeader';
import { LiveTrackingFilterBar } from './LiveTrackingFilterBar';
import { LiveTrackingSidebar } from './LiveTrackingSidebar';
import { VehicleMapPopup } from './VehicleMapPopup';
import { GpsDeveloperSimulatorModal } from './GpsDeveloperSimulatorModal';
import { GoogleMapsFleetTracker, hasValidGoogleMapsKey } from '../maps/GoogleMapsFleetTracker';
import { useFleet } from '../../context/FleetContext';

export const LiveTrackingView: React.FC = () => {
  const { setActiveView, setSelectedVehicleId, setSelectedVehicle, vehicles: contextVehicles } = useFleet();

  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const [mapEngine, setMapEngine] = useState<'google_maps' | 'leaflet'>('google_maps');
  const [vehicles, setVehicles] = useState<MapVehicle[]>([]);
  const [selectedVehicle, setSelectedVehicleState] = useState<MapVehicle | null>(null);
  const [followingVehicleId, setFollowingVehicleId] = useState<string | null>(null);
  const [multiSelectedIds, setMultiSelectedIds] = useState<string[]>([]);
  const [transportState, setTransportState] = useState<RealtimeTransportState>('LIVE');
  const [filterState, setFilterState] = useState<LiveTrackingFilterState>(liveTrackingService.getFilterState());
  const [counters, setCounters] = useState<LiveVehicleCounters>(liveTrackingService.getCounters());

  const [isFilterBarOpen, setIsFilterBarOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [isStyleMenuOpen, setIsStyleMenuOpen] = useState<boolean>(false);
  const [mapStyle, setMapStyle] = useState<MapStyle>('dark');
  const [trafficEnabled, setTrafficEnabled] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Initialize Leaflet Map Engine when in Leaflet mode
  useEffect(() => {
    if (mapEngine !== 'leaflet' || !mapContainerRef.current) return;

    mapService.initialize(mapContainerRef.current, {
      center: [-6.200000, 106.816666],
      zoom: 12,
      style: 'dark',
      onMapClick: () => {
        liveTrackingService.setSelectedVehicle(null);
        setSelectedVehicleState(null);
      }
    });

    return () => {
      mapService.destroy();
    };
  }, [mapEngine]);

  // Handle Marker Selection Callback
  const handleMarkerClick = useCallback((vehicleId: string) => {
    liveTrackingService.setSelectedVehicle(vehicleId);
    const found = liveTrackingService.getAllVehicles().find((v) => v.vehicleId === vehicleId);
    if (found) {
      setSelectedVehicleState(found);
      mapService.setSelectedMarker(vehicleId);
      mapService.setCenter(found.latitude, found.longitude);
    }
  }, []);

  // Multi-Selection Handlers
  const handleToggleMultiSelect = useCallback((vehicleId: string) => {
    liveTrackingService.toggleVehicleSelection(vehicleId);
    const ids = liveTrackingService.getMultiSelectedVehicleIds();
    setMultiSelectedIds(ids);
    mapService.setSelectedMarkers(ids);
  }, []);

  const handleSelectAll = useCallback(() => {
    liveTrackingService.selectAllFiltered();
    const ids = liveTrackingService.getMultiSelectedVehicleIds();
    setMultiSelectedIds(ids);
    mapService.setSelectedMarkers(ids);
  }, []);

  const handleClearMultiSelect = useCallback(() => {
    liveTrackingService.clearMultiSelection();
    setMultiSelectedIds([]);
    mapService.setSelectedMarkers([]);
  }, []);

  // Subscribe to Live Telemetry Updates & Connection
  useEffect(() => {
    const unsubscribeVehicles = liveTrackingService.subscribe((updatedVehicles) => {
      setVehicles(updatedVehicles);
      setCounters(liveTrackingService.getCounters());
      setMultiSelectedIds(liveTrackingService.getMultiSelectedVehicleIds());

      // Sync markers with map engine
      updatedVehicles.forEach((v) => {
        mapService.updateMarker(v);
      });

      // Update active selection or camera follow
      const followId = liveTrackingService.getFollowingVehicleId();
      setFollowingVehicleId(followId);

      if (followId) {
        const followedVeh = updatedVehicles.find((v) => v.vehicleId === followId);
        if (followedVeh) {
          mapService.setCenter(followedVeh.latitude, followedVeh.longitude);
          setSelectedVehicleState(followedVeh);
        }
      } else {
        const selVeh = liveTrackingService.getSelectedVehicle();
        if (selVeh) {
          setSelectedVehicleState(selVeh);
        }
      }
    });

    const unsubscribeConnection = liveTrackingService.subscribeConnection((state) => {
      setTransportState(state);
    });

    return () => {
      unsubscribeVehicles();
      unsubscribeConnection();
    };
  }, []);

  // Handle Filter Change
  const handleFilterChange = (newState: Partial<LiveTrackingFilterState>) => {
    liveTrackingService.setFilterState(newState);
    setFilterState(liveTrackingService.getFilterState());
  };

  const handleResetFilters = () => {
    const defaultState: LiveTrackingFilterState = {
      searchQuery: '',
      searchType: 'ALL',
      status: 'ALL',
      group: 'ALL',
      branchId: 'ALL',
      driverAssignment: 'ALL',
      gpsStatus: 'ALL',
      ignition: 'ALL',
      speedRange: 'ALL',
      alertsOnly: false
    };
    liveTrackingService.setFilterState(defaultState);
    setFilterState(defaultState);
  };

  // Map Controls Handlers
  const [currentZoom, setCurrentZoom] = useState<number>(12);

  const handleZoomIn = () => {
    setCurrentZoom((prev) => {
      const next = Math.min(prev + 1, 19);
      mapService.setZoom(next);
      return next;
    });
  };

  const handleZoomOut = () => {
    setCurrentZoom((prev) => {
      const next = Math.max(prev - 1, 3);
      mapService.setZoom(next);
      return next;
    });
  };

  const handleFitFleet = () => {
    const currentVehicles = liveTrackingService.getFilteredVehicles();
    if (currentVehicles.length === 0) return;

    const points: Array<[number, number]> = currentVehicles.map((v) => [v.latitude, v.longitude]);
    mapService.fitBounds(points);
  };

  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          mapService.setCenter(pos.coords.latitude, pos.coords.longitude, 14);
        },
        () => {
          alert('Izin lokasi tidak tersedia di peramban ini.');
        }
      );
    }
  };

  const handleChangeMapStyle = (style: MapStyle) => {
    setMapStyle(style);
    mapService.setTileStyle(style);
    setIsStyleMenuOpen(false);
  };

  const handleToggleTraffic = () => {
    const next = !trafficEnabled;
    setTrafficEnabled(next);
    mapService.toggleTraffic(next);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // CTA Actions
  const handleNavigateVehicle = (vehicleId: string) => {
    const foundContextVeh = contextVehicles.find((v) => v.id === vehicleId);
    if (foundContextVeh) {
      setSelectedVehicle(foundContextVeh);
      setSelectedVehicleId(foundContextVeh.id);
    }
    setActiveView('vehicles');
  };

  const handleNavigateDriver = (driverId: string) => {
    setActiveView('drivers');
  };

  const handleNavigateHistory = (vehicleId: string) => {
    window.history.pushState({}, '', `/app/tracking/history?vehicleId=${vehicleId}`);
    setActiveView('trips');
  };

  return (
    <div className="-m-4 sm:-m-6 lg:-m-8 relative h-[calc(100vh-64px)] w-full overflow-hidden bg-slate-950 font-sans text-slate-100 select-none">
      {/* Map Engine Layer */}
      {mapEngine === 'google_maps' ? (
        <div className="absolute inset-0 w-full h-full z-0">
          <GoogleMapsFleetTracker
            vehicles={vehicles}
            selectedVehicleId={selectedVehicle?.vehicleId || null}
            onSelectVehicle={(vId) => handleMarkerClick(vId)}
            heightClassName="h-full w-full rounded-none border-none"
            showSearch={true}
            showControls={true}
            multiSelectedIds={multiSelectedIds}
            onToggleMultiSelect={handleToggleMultiSelect}
          />
        </div>
      ) : (
        /* Leaflet Map Canvas Container */
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />
      )}

      {/* Top Floating Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 space-y-2 max-w-full pointer-events-none">
        <div className="pointer-events-auto">
          <LiveTrackingHeader
            counters={counters}
            filterState={filterState}
            onFilterChange={handleFilterChange}
            transportState={transportState}
            onReconnect={() => liveTrackingService.reconnect()}
            isFilterBarOpen={isFilterBarOpen}
            onToggleFilterBar={() => setIsFilterBarOpen(!isFilterBarOpen)}
            onToggleSimulator={() => setIsSimulatorOpen(!isSimulatorOpen)}
            isSimulatorOpen={isSimulatorOpen}
          />
        </div>

        <div className="pointer-events-auto">
          <LiveTrackingFilterBar
            isOpen={isFilterBarOpen}
            onClose={() => setIsFilterBarOpen(false)}
            filterState={filterState}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />
        </div>
      </div>

      {/* Following Vehicle Lock Banner */}
      {followingVehicleId && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 bg-cyan-950/90 border border-cyan-500/60 text-cyan-300 font-mono text-xs font-bold px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Radio className="h-4 w-4 text-cyan-400 animate-pulse" />
          <span>FOLLOWING CAMERA LOCK ({selectedVehicle?.vehiclePlate})</span>
          <button
            onClick={() => liveTrackingService.stopFollowing()}
            className="ml-2 p-1 bg-cyan-900/80 hover:bg-cyan-800 rounded-lg text-cyan-200"
            title="Stop Camera Following"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Left Collapsible Vehicle Navigator Sidebar */}
      <div className="absolute top-20 left-3 bottom-3 z-20 pointer-events-auto">
        <LiveTrackingSidebar
          vehicles={vehicles}
          selectedVehicleId={selectedVehicle?.vehicleId || null}
          onSelectVehicle={(vId) => handleMarkerClick(vId)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          followingVehicleId={followingVehicleId}
          multiSelectedIds={multiSelectedIds}
          onToggleMultiSelect={handleToggleMultiSelect}
          onSelectAll={handleSelectAll}
          onClearMultiSelect={handleClearMultiSelect}
        />
      </div>

      {/* Right Floating Map Controls Toolbar (Leaflet Mode & Fallback) */}
      <div className="absolute bottom-20 md:bottom-6 right-3 md:right-6 z-20 flex flex-col gap-2">
        {/* Engine Switcher */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-1 shadow-2xl flex flex-col gap-1">
          <button
            onClick={() => setMapEngine(mapEngine === 'google_maps' ? 'leaflet' : 'google_maps')}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              mapEngine === 'google_maps'
                ? 'bg-cyan-600 text-white shadow-lg'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Ganti Engine Peta (Google Maps Platform vs Leaflet OSM)"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden md:inline">{mapEngine === 'google_maps' ? 'Google Maps' : 'Leaflet'}</span>
          </button>
        </div>

        {mapEngine === 'leaflet' && (
          <>
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
              <button
                onClick={handleZoomIn}
                className="p-2.5 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border-b border-slate-800/80"
                title="Zoom In (+)"
              >
                <Plus className="h-4 w-4" />
              </button>

              <button
                onClick={handleZoomOut}
                className="p-2.5 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Zoom Out (-)"
              >
                <Minus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleFitFleet}
              className="p-2.5 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition-colors shadow-2xl flex items-center justify-center"
              title="Fit Bounds seluruh Armada (⌖ Fit Fleet)"
            >
              <Crosshair className="h-4 w-4" />
            </button>

            <button
              onClick={handleToggleTraffic}
              className={`p-2.5 rounded-xl border transition-colors shadow-2xl flex items-center justify-center ${
                trafficEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-emerald-950'
                  : 'bg-slate-900/90 backdrop-blur-md border-slate-800 text-slate-300 hover:text-white'
              }`}
              title="Toggle Traffic Layer"
            >
              <Activity className="h-4 w-4" />
            </button>

            <button
              onClick={handleMyLocation}
              className="p-2.5 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl text-slate-300 hover:text-emerald-400 hover:bg-slate-800 transition-colors shadow-2xl flex items-center justify-center"
              title="Lokasi Peramban Saya"
            >
              <Compass className="h-4 w-4" />
            </button>

            {/* Map Style Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsStyleMenuOpen(!isStyleMenuOpen)}
                className="p-2.5 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow-2xl flex items-center justify-center w-full"
                title="Pilih Style Peta (Dark, Satelit, Light, OSM)"
              >
                <Layers className="h-4 w-4" />
              </button>

              {isStyleMenuOpen && (
                <div className="absolute right-12 bottom-0 w-36 bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-2xl space-y-1 text-xs">
                  <button
                    onClick={() => handleChangeMapStyle('dark')}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left ${
                      mapStyle === 'dark' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Moon className="h-3.5 w-3.5" /> Dark Mode
                  </button>
                  <button
                    onClick={() => handleChangeMapStyle('satellite')}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left ${
                      mapStyle === 'satellite' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Globe className="h-3.5 w-3.5" /> Satellite
                  </button>
                  <button
                    onClick={() => handleChangeMapStyle('default')}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left ${
                      mapStyle === 'default' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Map className="h-3.5 w-3.5" /> Street Map
                  </button>
                  <button
                    onClick={() => handleChangeMapStyle('light')}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left ${
                      mapStyle === 'light' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Sun className="h-3.5 w-3.5" /> Light Mode
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        <button
          onClick={handleToggleFullscreen}
          className="p-2.5 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow-2xl flex items-center justify-center"
          title="Mode Layar Penuh (Fullscreen)"
        >
          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </button>
      </div>

      {/* Selected Vehicle Telematics Floating Card / Mobile Bottom Sheet */}
      <VehicleMapPopup
        vehicle={selectedVehicle}
        onClose={() => {
          liveTrackingService.setSelectedVehicle(null);
          setSelectedVehicleState(null);
        }}
        isFollowing={followingVehicleId === selectedVehicle?.vehicleId}
        onToggleFollow={() => {
          if (selectedVehicle) {
            if (followingVehicleId === selectedVehicle.vehicleId) {
              liveTrackingService.stopFollowing();
              setFollowingVehicleId(null);
            } else {
              liveTrackingService.followVehicle(selectedVehicle.vehicleId);
              setFollowingVehicleId(selectedVehicle.vehicleId);
            }
          }
        }}
        onNavigateVehicle={handleNavigateVehicle}
        onNavigateDriver={handleNavigateDriver}
        onNavigateHistory={handleNavigateHistory}
      />

      {/* Developer Simulator Modal Console */}
      <GpsDeveloperSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        vehicles={vehicles}
      />
    </div>
  );
};
