/**
 * Fleet Intelligence Smart AI - Leaflet Route Visualizer Map Component
 * PROMPT 16 — Polylines, Waypoint Markers, Alternative Polylines & Off-Route Visuals
 */

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Route, AlternativeRoute, RouteWaypoint, RouteDeviation } from '../../modules/routes/routeTypes';

interface RouteMapComponentProps {
  route: Route;
  selectedAlternativeId?: string;
  activeDeviation?: RouteDeviation | null;
  className?: string;
  interactive?: boolean;
}

export const RouteMapComponent: React.FC<RouteMapComponentProps> = ({
  route,
  selectedAlternativeId,
  activeDeviation,
  className = 'h-96 w-full rounded-2xl overflow-hidden shadow-inner border border-gray-200',
  interactive = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy prior map instance if existing
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const defaultCenter: [number, number] = [
      route.origin?.latitude || -6.2088,
      route.origin?.longitude || 106.8456,
    ];

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 10,
      zoomControl: interactive,
      dragging: interactive,
      scrollWheelZoom: interactive,
    });

    mapRef.current = map;

    // High quality OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    const boundsGroup = L.featureGroup();

    // 1. Draw Primary Planned Polyline (Solid Vibrant Blue)
    if (route.plannedPolyline && route.plannedPolyline.length > 0) {
      const polyline = L.polyline(route.plannedPolyline, {
        color: '#2563EB', // Blue-600
        weight: 5,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      boundsGroup.addLayer(polyline);
    }

    // 2. Draw Alternative Polylines (Purple Dashed)
    if (route.alternativeRoutes && route.alternativeRoutes.length > 0) {
      route.alternativeRoutes.forEach((alt) => {
        const isSelected = alt.id === selectedAlternativeId;
        if (alt.polyline && alt.polyline.length > 0) {
          const altPoly = L.polyline(alt.polyline, {
            color: isSelected ? '#9333EA' : '#A855F7',
            weight: isSelected ? 5 : 3,
            dashArray: '6, 8',
            opacity: isSelected ? 0.95 : 0.6,
          }).addTo(map);

          altPoly.bindTooltip(`<b>${alt.name}</b><br/>${alt.keyDiff}`, { sticky: true });
        }
      });
    }

    // 3. Draw Origin Marker (A - Green Pill)
    if (route.origin) {
      const originIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `<div style="background-color:#10B981; color:white; border:2px solid white; border-radius:9999px; width:28px; height:28px; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:12px; shadow:0 2px 4px rgba(0,0,0,0.3)">A</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const originMarker = L.marker([route.origin.latitude, route.origin.longitude], {
        icon: originIcon,
      }).addTo(map);

      originMarker.bindPopup(
        `<div><strong style="color:#065F46">ORIGIN (A)</strong><br/><b>${route.origin.name}</b><br/><span style="font-size:11px; color:#4B5563">${route.origin.address}</span></div>`
      );

      boundsGroup.addLayer(originMarker);
    }

    // 4. Draw Waypoint Markers (1, 2, 3 - Indigo Pills)
    if (route.waypoints && route.waypoints.length > 0) {
      route.waypoints.forEach((wp) => {
        const wpIcon = L.divIcon({
          className: 'custom-map-marker',
          html: `<div style="background-color:#4F46E5; color:white; border:2px solid white; border-radius:9999px; width:24px; height:24px; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:11px;">${wp.sequence}</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const wpMarker = L.marker([wp.latitude, wp.longitude], { icon: wpIcon }).addTo(map);
        wpMarker.bindPopup(
          `<div><strong style="color:#3730A3">WAYPOINT #${wp.sequence} (${wp.type})</strong><br/><b>${wp.name}</b><br/><span style="font-size:11px; color:#4B5563">${wp.address}</span><br/><span style="font-size:10px; color:#6B7280">Durasi Stop: ${wp.stopDurationMinutes} mnt</span></div>`
        );

        boundsGroup.addLayer(wpMarker);
      });
    }

    // 5. Draw Destination Marker (B - Red Pill)
    if (route.destination) {
      const destIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `<div style="background-color:#EF4444; color:white; border:2px solid white; border-radius:9999px; width:28px; height:28px; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:12px;">B</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const destMarker = L.marker([route.destination.latitude, route.destination.longitude], {
        icon: destIcon,
      }).addTo(map);

      destMarker.bindPopup(
        `<div><strong style="color:#991B1B">DESTINATION (B)</strong><br/><b>${route.destination.name}</b><br/><span style="font-size:11px; color:#4B5563">${route.destination.address}</span></div>`
      );

      boundsGroup.addLayer(destMarker);
    }

    // 6. Active Deviation Visual Marker
    if (activeDeviation) {
      const devIcon = L.divIcon({
        className: 'custom-map-marker-dev',
        html: `<div style="background-color:#F59E0B; color:white; border:2px solid white; border-radius:9999px; width:30px; height:30px; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:14px; animation: pulse 1.5s infinite">⚠️</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      const devMarker = L.marker([activeDeviation.latitude, activeDeviation.longitude], {
        icon: devIcon,
      }).addTo(map);

      devMarker.bindPopup(
        `<div><strong style="color:#B45309">DEVIASI RUTE TERDETEKSI</strong><br/>Jarak keluar rute: <b>${activeDeviation.deviationDistanceMeters}m</b><br/><span style="font-size:11px; color:#4B5563">Severity: ${activeDeviation.severity}</span></div>`
      );

      boundsGroup.addLayer(devMarker);
    }

    // Auto fit map bounds if layers exist
    if (boundsGroup.getLayers().length > 0) {
      map.fitBounds(boundsGroup.getBounds(), { padding: [40, 40] });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [route, selectedAlternativeId, activeDeviation]);

  return <div ref={mapContainerRef} className={className} />;
};
