/**
 * Fleet Intelligence Smart AI - Route Versioning Engine
 * PROMPT 16 — Non-Destructive Version History for Master Routes
 */

import { Route, RouteVersion } from '../routeTypes';

class RouteVersionService {
  private versionsMap: Map<string, RouteVersion[]> = new Map();

  createInitialVersion(route: Route, createdBy = 'System Admin'): RouteVersion {
    const v1: RouteVersion = {
      id: `ver-${route.id}-1`,
      routeId: route.id,
      version: 1,
      origin: route.origin,
      destination: route.destination,
      waypoints: route.waypoints,
      polyline: route.plannedPolyline,
      distanceKm: route.distanceKm,
      durationMinutes: route.estimatedDurationMinutes,
      createdBy,
      createdAt: route.createdAt || new Date().toISOString(),
      notes: 'Versi awal rute dipublikasikan.',
    };

    this.versionsMap.set(route.id, [v1]);
    return v1;
  }

  createNewVersion(
    route: Route,
    changeNotes: string,
    createdBy = 'Dispatcher / Operator'
  ): RouteVersion {
    const existing = this.versionsMap.get(route.id) || [];
    const newVersionNum = existing.length + 1;

    const newVer: RouteVersion = {
      id: `ver-${route.id}-${newVersionNum}`,
      routeId: route.id,
      version: newVersionNum,
      origin: route.origin,
      destination: route.destination,
      waypoints: route.waypoints,
      polyline: route.plannedPolyline,
      distanceKm: route.distanceKm,
      durationMinutes: route.estimatedDurationMinutes,
      createdBy,
      createdAt: new Date().toISOString(),
      notes: changeNotes,
    };

    existing.push(newVer);
    this.versionsMap.set(route.id, existing);
    return newVer;
  }

  getRouteVersions(routeId: string): RouteVersion[] {
    return this.versionsMap.get(routeId) || [];
  }

  getVersionById(routeId: string, versionNum: number): RouteVersion | null {
    const versions = this.getRouteVersions(routeId);
    return versions.find((v) => v.version === versionNum) || null;
  }
}

export const routeVersionService = new RouteVersionService();
