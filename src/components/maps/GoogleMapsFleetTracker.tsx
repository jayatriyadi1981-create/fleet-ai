import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
  useMapsLibrary,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import {
  Truck,
  Navigation,
  Fuel,
  Gauge,
  User,
  ShieldAlert,
  Radio,
  Search,
  Layers,
  Crosshair,
  Maximize2,
  Minimize2,
  Route as RouteIcon,
  Sparkles,
  MapPin,
  Clock,
  Compass,
  ChevronRight,
  RefreshCw,
  X,
  Ruler,
  Car,
  Activity,
  Layers2,
  CheckSquare
} from 'lucide-react';
import { MapVehicle } from '../../modules/maps/types';
import { GoogleMapsKeySplash } from './GoogleMapsKeySplash';
import { useFleet } from '../../context/FleetContext';

// API Key resolver adhering strictly to Constitution Rule 1
const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

export const hasValidGoogleMapsKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

interface GoogleMapsFleetTrackerProps {
  vehicles?: MapVehicle[];
  selectedVehicleId?: string | null;
  onSelectVehicle?: (vehicleId: string) => void;
  heightClassName?: string;
  showSearch?: boolean;
  showControls?: boolean;
  showTrafficOption?: boolean;
  activeRouteDestination?: { lat: number; lng: number; name: string } | null;
  onClearActiveRoute?: () => void;
  multiSelectedIds?: string[];
  onToggleMultiSelect?: (vehicleId: string) => void;
}

/**
 * Traffic Layer Component for Google Maps
 */
function TrafficLayerComponent({ enabled }: { enabled: boolean }) {
  const map = useMap();
  const trafficLayerRef = useRef<google.maps.TrafficLayer | null>(null);

  useEffect(() => {
    if (!map) return;

    if (!trafficLayerRef.current) {
      trafficLayerRef.current = new google.maps.TrafficLayer();
    }

    if (enabled) {
      trafficLayerRef.current.setMap(map);
    } else {
      trafficLayerRef.current.setMap(null);
    }

    return () => {
      if (trafficLayerRef.current) {
        trafficLayerRef.current.setMap(null);
      }
    };
  }, [map, enabled]);

  return null;
}

/**
 * Distance Measurement Tool Polyline & Markers
 */
function DistanceMeasurementTool({
  points,
  onAddPoint,
  active,
}: {
  points: Array<{ lat: number; lng: number }>;
  onAddPoint: (pt: { lat: number; lng: number }) => void;
  active: boolean;
}) {
  const map = useMap();
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map) return;

    const clickListener = map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (!active || !e.latLng) return;
      onAddPoint({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    });

    return () => {
      google.maps.event.removeListener(clickListener);
    };
  }, [map, active, onAddPoint]);

  useEffect(() => {
    if (!map) return;

    if (!polylineRef.current) {
      polylineRef.current = new google.maps.Polyline({
        strokeColor: '#06B6D4',
        strokeWeight: 4,
        strokeOpacity: 0.9,
        geodesic: true,
      });
    }

    if (points.length >= 2) {
      polylineRef.current.setPath(points);
      polylineRef.current.setMap(map);
    } else {
      polylineRef.current.setMap(null);
    }

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
    };
  }, [map, points]);

  return (
    <>
      {points.map((pt, idx) => (
        <AdvancedMarker key={idx} position={pt}>
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500 text-slate-950 font-mono font-bold text-xs shadow-lg border-2 border-white ring-2 ring-cyan-400/50">
            {idx + 1}
          </div>
        </AdvancedMarker>
      ))}
    </>
  );
}

/**
 * Places API (New) Search Component
 */
function PlacesSearchBar({
  onSelectPlace,
}: {
  onSelectPlace: (place: { name: string; address: string; lat: number; lng: number }) => void;
}) {
  const placesLib = useMapsLibrary('places');
  const map = useMap();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!placesLib || !query.trim()) return;

    setSearching(true);
    try {
      const response = await placesLib.Place.searchByText({
        textQuery: query,
        fields: ['displayName', 'location', 'formattedAddress'],
        locationBias: map?.getCenter(),
        maxResultCount: 6,
      });

      if (response.places && response.places.length > 0) {
        setResults(response.places);
        setIsOpen(true);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.warn('Places API search error:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleSelect = (p: any) => {
    const loc = p.location;
    if (loc && map) {
      const lat = typeof loc.lat === 'function' ? loc.lat() : loc.lat;
      const lng = typeof loc.lng === 'function' ? loc.lng() : loc.lng;

      map.panTo({ lat, lng });
      map.setZoom(15);

      onSelectPlace({
        name: p.displayName || query,
        address: p.formattedAddress || '',
        lat,
        lng,
      });
    }
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSearch} className="flex items-center">
        <div className="relative w-full">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari POI, Depo, Gudang, SPBU di Google Maps..."
            className="w-full pl-9 pr-20 py-2 rounded-xl bg-slate-900/95 border border-slate-700 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 backdrop-blur-md shadow-lg"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
              className="absolute right-12 top-2.5 text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="submit"
            disabled={searching || !query.trim()}
            className="absolute right-1.5 top-1 px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-[11px] font-medium transition flex items-center gap-1"
          >
            {searching ? <RefreshCw className="w-3 h-3 animate-spin" /> : 'Cari'}
          </button>
        </div>
      </form>

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800">
          <div className="p-2 bg-slate-850 flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
            <span>Hasil Lokasi Google Places</span>
            <button onClick={() => setIsOpen(false)} className="hover:text-slate-200">
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {results.map((p, idx) => (
              <button
                key={p.id || idx}
                onClick={() => handleSelect(p)}
                className="w-full text-left p-3 hover:bg-slate-800/80 transition flex items-start gap-2.5 group"
              >
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 truncate">
                    {p.displayName}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{p.formattedAddress}</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 shrink-0 my-auto" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Routes API Polyline Renderer Component
 */
function RoutesRenderer({
  origin,
  destination,
  onRouteCalculated,
}: {
  origin: google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;
  onRouteCalculated?: (metrics: { distanceKm: number; durationMin: number }) => void;
}) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!routesLib || !map || !origin || !destination) return;

    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];

    routesLib.Route.computeRoutes({
      origin,
      destination,
      travelMode: 'DRIVING',
      fields: ['path', 'distanceMeters', 'durationMillis', 'viewport'],
    })
      .then(({ routes }) => {
        if (routes && routes.length > 0) {
          const route = routes[0];
          const newPolylines = route.createPolylines();
          newPolylines.forEach((p) => {
            p.setOptions({
              strokeColor: '#06B6D4',
              strokeWeight: 5,
              strokeOpacity: 0.85,
            });
            p.setMap(map);
          });
          polylinesRef.current = newPolylines;

          if (route.viewport) {
            map.fitBounds(route.viewport);
          }

          if (onRouteCalculated && route.distanceMeters && route.durationMillis) {
            onRouteCalculated({
              distanceKm: Math.round((route.distanceMeters / 1000) * 10) / 10,
              durationMin: Math.round(Number(route.durationMillis) / 60000),
            });
          }
        }
      })
      .catch((err) => {
        console.warn('Google Maps computeRoutes error:', err);
      });

    return () => {
      polylinesRef.current.forEach((p) => p.setMap(null));
      polylinesRef.current = [];
    };
  }, [routesLib, map, origin.lat, origin.lng, destination.lat, destination.lng]);

  return null;
}

/**
 * Single Vehicle Advanced Marker with InfoWindow Anchor pattern
 */
function VehicleAdvancedMarkerItem({
  vehicle,
  isSelected,
  isMultiSelected,
  onSelect,
  onRequestRoute,
}: {
  vehicle: MapVehicle;
  isSelected: boolean;
  isMultiSelected?: boolean;
  onSelect: (id: string) => void;
  onRequestRoute?: (veh: MapVehicle) => void;
}) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoOpen, setInfoOpen] = useState(isSelected);

  useEffect(() => {
    setInfoOpen(isSelected);
  }, [isSelected]);

  const statusColor = useMemo(() => {
    switch (vehicle.status) {
      case 'Moving':
        return '#10B981'; // Green
      case 'Idle':
        return '#F59E0B'; // Amber
      case 'Parking':
      case 'Stopped':
        return '#3B82F6'; // Blue
      case 'Emergency':
        return '#EF4444'; // Red
      case 'Maintenance':
        return '#F97316'; // Orange
      case 'Offline':
      default:
        return '#64748B'; // Gray
    }
  }, [vehicle.status]);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: vehicle.latitude, lng: vehicle.longitude }}
        onClick={() => {
          onSelect(vehicle.vehicleId);
          setInfoOpen(true);
        }}
        title={`${vehicle.vehiclePlate} (${vehicle.vehicleName})`}
        zIndex={isSelected || isMultiSelected ? 100 : 10}
      >
        <div className="relative group cursor-pointer select-none">
          {/* Pulse ring when moving or emergency */}
          {(vehicle.status === 'Moving' || vehicle.status === 'Emergency') && (
            <span
              className="absolute -inset-1.5 rounded-full animate-ping opacity-40 pointer-events-none"
              style={{ backgroundColor: statusColor }}
            />
          )}

          {/* Marker Body */}
          <div
            className={`flex items-center gap-1.5 px-2 py-1 rounded-full shadow-lg border text-white font-medium text-[11px] transition-all transform hover:scale-110 ${
              isSelected || isMultiSelected
                ? 'ring-2 ring-cyan-400 scale-110 bg-slate-900 border-cyan-400'
                : 'bg-slate-900/95 border-slate-700'
            }`}
          >
            {/* Direction Arrow / Icon */}
            <div
              className="w-4 h-4 rounded-full flex items-center justify-center text-white"
              style={{
                backgroundColor: statusColor,
                transform: `rotate(${vehicle.heading || 0}deg)`,
              }}
            >
              <Navigation className="w-2.5 h-2.5 fill-current" />
            </div>

            {/* Plate Number */}
            <span className="font-bold tracking-tight text-white">{vehicle.vehiclePlate}</span>

            {/* Speed Badge */}
            {vehicle.speed > 0 && (
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-1 rounded">
                {Math.round(vehicle.speed)}k
              </span>
            )}

            {/* Alert Indicator */}
            {(vehicle.hasActiveAlert || vehicle.status === 'Emergency') && (
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
            )}
          </div>
        </div>
      </AdvancedMarker>

      {/* Info Window */}
      {infoOpen && (
        <InfoWindow
          anchor={marker}
          onCloseClick={() => setInfoOpen(false)}
          headerDisabled={false}
        >
          <div className="p-1 min-w-[240px] text-slate-800 font-sans space-y-2">
            <div className="flex items-center justify-between border-b pb-1.5">
              <div>
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  {vehicle.vehiclePlate}
                  <span
                    className="text-[10px] px-1.5 py-0.2 rounded font-semibold text-white"
                    style={{ backgroundColor: statusColor }}
                  >
                    {vehicle.status}
                  </span>
                </h4>
                <p className="text-[11px] text-slate-500">{vehicle.vehicleName} • {vehicle.groupCategory || vehicle.vehicleType}</p>
              </div>
            </div>

            {/* Driver & Status */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-600">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate font-medium">{vehicle.driverName || 'Driver Belum Ditugaskan'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <Gauge className="w-3.5 h-3.5 text-cyan-500" />
                <span className="font-mono font-semibold text-slate-900">{Math.round(vehicle.speed)} km/h</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <Fuel className="w-3.5 h-3.5 text-amber-500" />
                <span>{vehicle.fuelLevelPercent !== undefined ? `${vehicle.fuelLevelPercent}%` : '80%'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <Radio className="w-3.5 h-3.5 text-emerald-500" />
                <span>{vehicle.gpsSignal || '3D Fix (±3m)'}</span>
              </div>
            </div>

            {vehicle.address && (
              <div className="text-[11px] text-slate-500 bg-slate-50 p-1.5 rounded border border-slate-100 flex items-start gap-1">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{vehicle.address}</span>
              </div>
            )}

            {/* Quick Actions */}
            <div className="pt-1 flex items-center gap-1.5">
              {onRequestRoute && (
                <button
                  type="button"
                  onClick={() => onRequestRoute(vehicle)}
                  className="flex-1 py-1 px-2 rounded bg-cyan-600 hover:bg-cyan-700 text-white text-[11px] font-semibold flex items-center justify-center gap-1 shadow-sm transition"
                >
                  <RouteIcon className="w-3 h-3" />
                  Rute Visualisasi
                </button>
              )}
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

/**
 * Haversine Distance helper (km)
 */
function calculateDistanceBetweenPoints(pts: Array<{ lat: number; lng: number }>): number {
  if (pts.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const R = 6371; // Earth radius in km
    const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
    const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((p1.lat * Math.PI) / 180) *
        Math.cos((p2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    total += R * c;
  }
  return Math.round(total * 100) / 100;
}

/**
 * Main Google Maps Fleet Tracker Container
 */
export const GoogleMapsFleetTracker: React.FC<GoogleMapsFleetTrackerProps> = ({
  vehicles: propVehicles,
  selectedVehicleId,
  onSelectVehicle,
  heightClassName = 'h-full min-h-[600px]',
  showSearch = true,
  showControls = true,
  showTrafficOption = true,
  activeRouteDestination,
  onClearActiveRoute,
  multiSelectedIds = [],
  onToggleMultiSelect,
}) => {
  const { vehicles: contextVehicles } = useFleet();

  const vehicles: MapVehicle[] = useMemo(() => {
    if (propVehicles && propVehicles.length > 0) return propVehicles;
    return contextVehicles.map((v: any) => {
      const loc = v.latestTelemetry?.location || v.location || { lat: -6.200000, lng: 106.816666 };
      const speed = v.latestTelemetry?.location?.speed ?? v.speed ?? 0;
      const heading = v.latestTelemetry?.location?.heading ?? v.heading ?? 0;
      const rawStatus = (v.status || 'stopped').toLowerCase();
      const status = rawStatus === 'moving' ? 'Moving' : rawStatus === 'idle' ? 'Idle' : 'Stopped';

      return {
        vehicleId: v.id,
        vehiclePlate: v.plateNumber || v.licensePlate || v.id,
        vehicleName: `${v.brand || ''} ${v.model || ''}`.trim() || 'Armada Fleet',
        vehicleType: v.type || 'truck_box',
        driverName: v.currentDriverId || v.primaryDriverName || 'Driver Ditugaskan',
        driverScore: 92,
        latitude: loc.lat ?? -6.200000,
        longitude: loc.lng ?? 106.816666,
        speed: speed,
        heading: heading,
        status: status as any,
        ignition: rawStatus === 'moving' || rawStatus === 'idle',
        gpsSignal: 'Excellent',
        lastSeenAt: v.latestTelemetry?.timestamp || new Date().toISOString(),
        fuelLevelPercent: v.latestTelemetry?.fuelLevelPercent ?? 80,
        batteryLevel: 98,
        address: loc.address || 'DKI Jakarta, Indonesia',
        hasActiveAlert: false,
      };
    });
  }, [propVehicles, contextVehicles]);

  const [mapType, setMapType] = useState<google.maps.MapTypeId>(
    'roadmap' as unknown as google.maps.MapTypeId
  );
  const [showTraffic, setShowTraffic] = useState(false);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measurePoints, setMeasurePoints] = useState<Array<{ lat: number; lng: number }>>([]);
  const [routeMetrics, setRouteMetrics] = useState<{ distanceKm: number; durationMin: number } | null>(
    null
  );
  const [searchedDestination, setSearchedDestination] = useState<{
    name: string;
    address: string;
    lat: number;
    lng: number;
  } | null>(null);

  const selectedVehicle = useMemo(() => {
    return vehicles.find((v) => v.vehicleId === selectedVehicleId) || null;
  }, [vehicles, selectedVehicleId]);

  const defaultCenter = useMemo(() => {
    if (selectedVehicle) {
      return { lat: selectedVehicle.latitude, lng: selectedVehicle.longitude };
    }
    if (vehicles.length > 0) {
      const avgLat = vehicles.reduce((acc, v) => acc + v.latitude, 0) / vehicles.length;
      const avgLng = vehicles.reduce((acc, v) => acc + v.longitude, 0) / vehicles.length;
      return { lat: avgLat, lng: avgLng };
    }
    return { lat: -6.200000, lng: 106.816666 };
  }, [vehicles, selectedVehicle]);

  if (!hasValidGoogleMapsKey) {
    return <GoogleMapsKeySplash />;
  }

  const effectiveRouteDestination = activeRouteDestination || searchedDestination;
  const measuredDistanceKm = calculateDistanceBetweenPoints(measurePoints);

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl ${heightClassName}`}>
      <APIProvider apiKey={API_KEY} version="weekly">
        {/* Search Bar Floating Overlay */}
        {showSearch && (
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 max-w-lg w-full">
            <PlacesSearchBar
              onSelectPlace={(place) => {
                setSearchedDestination(place);
              }}
            />
          </div>
        )}

        {/* Map Tools Floating Bar */}
        {showControls && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-xl text-slate-200">
            {/* Map Type: Street (Roadmap), Satellite, Terrain */}
            <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setMapType('roadmap' as any)}
                className={`px-2.5 py-1 rounded-md transition text-[11px] font-medium ${
                  mapType === ('roadmap' as any)
                    ? 'bg-cyan-600 text-white shadow-sm font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Peta Jalan (Street / Roadmap)"
              >
                Street
              </button>
              <button
                type="button"
                onClick={() => setMapType('satellite' as any)}
                className={`px-2.5 py-1 rounded-md transition text-[11px] font-medium ${
                  mapType === ('satellite' as any)
                    ? 'bg-cyan-600 text-white shadow-sm font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Satelit (Aerial Imagery)"
              >
                Satelit
              </button>
              <button
                type="button"
                onClick={() => setMapType('terrain' as any)}
                className={`px-2.5 py-1 rounded-md transition text-[11px] font-medium ${
                  mapType === ('terrain' as any)
                    ? 'bg-cyan-600 text-white shadow-sm font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Terrain (Topografi & Kontur)"
              >
                Terrain
              </button>
            </div>

            {/* Traffic Overlay Toggle */}
            <button
              type="button"
              onClick={() => setShowTraffic(!showTraffic)}
              className={`p-1.5 px-2 rounded-lg border text-xs font-mono flex items-center gap-1 transition ${
                showTraffic
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-md shadow-emerald-950'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Google Real-Time Traffic Layer"
            >
              <Activity className="w-3.5 h-3.5" />
              <span className="text-[10px] hidden sm:inline">Trafik</span>
            </button>

            {/* Distance Measurement Tool */}
            <button
              type="button"
              onClick={() => {
                setIsMeasuring(!isMeasuring);
                if (isMeasuring) setMeasurePoints([]);
              }}
              className={`p-1.5 px-2 rounded-lg border text-xs font-mono flex items-center gap-1 transition ${
                isMeasuring
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-md shadow-cyan-950 ring-1 ring-cyan-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="Alat Ukur Jarak Peta (Klik titik untuk mengukur jarak)"
            >
              <Ruler className="w-3.5 h-3.5" />
              <span className="text-[10px] hidden sm:inline">Ukur Jarak</span>
            </button>
          </div>
        )}

        {/* Distance Measurement Active Banner HUD */}
        {isMeasuring && (
          <div className="absolute top-16 right-4 z-20 bg-slate-900/95 border border-cyan-500/60 rounded-xl p-3 shadow-2xl backdrop-blur-md max-w-xs text-xs text-slate-200 space-y-2 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                <Ruler className="w-4 h-4" /> Pengukur Jarak Aktif
              </span>
              <button
                onClick={() => {
                  setIsMeasuring(false);
                  setMeasurePoints([]);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Klik pada peta untuk menambahkan titik ukur jalur.
            </p>
            <div className="flex items-center justify-between pt-1 border-t border-slate-800 font-mono">
              <span className="text-slate-400">Total Jarak:</span>
              <span className="text-sm font-bold text-cyan-300">{measuredDistanceKm} KM</span>
            </div>
            {measurePoints.length > 0 && (
              <button
                onClick={() => setMeasurePoints([])}
                className="w-full py-1 text-[10px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                Hapus Titik ({measurePoints.length})
              </button>
            )}
          </div>
        )}

        {/* Active Route HUD Overlay */}
        {effectiveRouteDestination && selectedVehicle && (
          <div className="absolute bottom-4 left-4 z-20 bg-slate-900/95 border border-slate-700 rounded-xl p-3.5 shadow-2xl backdrop-blur-md max-w-sm w-full text-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                <RouteIcon className="w-4 h-4" />
                <span>Rute Cerdas Google Routes API</span>
              </div>
              <button
                onClick={() => {
                  setSearchedDestination(null);
                  if (onClearActiveRoute) onClearActiveRoute();
                }}
                className="text-slate-400 hover:text-slate-200 p-0.5 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-xs space-y-1">
              <p className="text-slate-300">
                <span className="text-slate-400">Asal:</span> {selectedVehicle.vehiclePlate} ({selectedVehicle.vehicleName})
              </p>
              <p className="text-slate-300 truncate">
                <span className="text-slate-400">Tujuan:</span> {effectiveRouteDestination.name}
              </p>
            </div>
            {routeMetrics && (
              <div className="flex items-center gap-4 pt-1 border-t border-slate-800 text-xs">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-mono">Jarak</p>
                  <p className="font-bold text-slate-100 font-mono">{routeMetrics.distanceKm} KM</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-mono">Estimasi ETA</p>
                  <p className="font-bold text-emerald-400 font-mono">{routeMetrics.durationMin} Menit</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Google Map Canvas */}
        <Map
          defaultCenter={defaultCenter}
          defaultZoom={12}
          mapTypeId={mapType}
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: '100%', height: '100%' }}
          disableDefaultUI={false}
        >
          {/* Traffic Layer */}
          <TrafficLayerComponent enabled={showTraffic} />

          {/* Distance Measurement Interactive Tool */}
          <DistanceMeasurementTool
            points={measurePoints}
            onAddPoint={(pt) => setMeasurePoints((prev) => [...prev, pt])}
            active={isMeasuring}
          />

          {/* Live Vehicle Advanced Markers */}
          {vehicles.map((v) => (
            <VehicleAdvancedMarkerItem
              key={v.vehicleId}
              vehicle={v}
              isSelected={v.vehicleId === selectedVehicleId}
              isMultiSelected={multiSelectedIds.includes(v.vehicleId)}
              onSelect={(id) => {
                if (onSelectVehicle) onSelectVehicle(id);
              }}
              onRequestRoute={(veh) => {
                if (effectiveRouteDestination) {
                  // Keep current destination
                } else {
                  setSearchedDestination({
                    name: 'Pelabuhan Tanjung Priok - Jakarta Container Terminal',
                    address: 'Jl. Raya Pelabuhan No. 9, Jakarta Utara',
                    lat: -6.1042,
                    lng: 106.8824,
                  });
                }
              }}
            />
          ))}

          {/* Searched / Route Destination Pin */}
          {effectiveRouteDestination && (
            <AdvancedMarker
              position={{
                lat: effectiveRouteDestination.lat,
                lng: effectiveRouteDestination.lng,
              }}
              title={effectiveRouteDestination.name}
            >
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-600 text-white font-bold text-xs shadow-xl border-2 border-white animate-bounce">
                <MapPin className="w-3.5 h-3.5 fill-current" />
                <span>{effectiveRouteDestination.name.slice(0, 20)}...</span>
              </div>
            </AdvancedMarker>
          )}

          {/* Intelligent Routes API Polyline */}
          {effectiveRouteDestination && selectedVehicle && (
            <RoutesRenderer
              origin={{ lat: selectedVehicle.latitude, lng: selectedVehicle.longitude }}
              destination={{
                lat: effectiveRouteDestination.lat,
                lng: effectiveRouteDestination.lng,
              }}
              onRouteCalculated={(m) => setRouteMetrics(m)}
            />
          )}
        </Map>
      </APIProvider>
    </div>
  );
};
