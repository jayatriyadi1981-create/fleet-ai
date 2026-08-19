/**
 * Fleet Intelligence Smart AI - Alternative Route & Active Trip Revision Service
 * PROMPT 16 — Dynamic Alternative Route Application & Audit Log Revisions
 */

import { AlternativeRoute, TripRouteRevision, RouteChangeReason } from '../routeTypes';

class RouteAlternativeService {
  private revisionsMap: Map<string, TripRouteRevision[]> = new Map();

  applyAlternativeToActiveTrip(
    tripId: string,
    oldRouteVersionId: string,
    newRouteVersionId: string,
    reason: RouteChangeReason,
    changedBy = 'Dispatcher',
    customReasonDetails?: string
  ): TripRouteRevision {
    const revision: TripRouteRevision = {
      id: `rev-${Date.now()}`,
      tripId,
      oldRouteVersionId,
      newRouteVersionId,
      reason,
      customReasonDetails,
      changedBy,
      changedAt: new Date().toISOString(),
    };

    const existing = this.revisionsMap.get(tripId) || [];
    existing.push(revision);
    this.revisionsMap.set(tripId, existing);

    return revision;
  }

  getTripRouteRevisions(tripId: string): TripRouteRevision[] {
    return this.revisionsMap.get(tripId) || [];
  }
}

export const routeAlternativeService = new RouteAlternativeService();
