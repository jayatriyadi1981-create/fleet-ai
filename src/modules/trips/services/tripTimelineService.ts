/**
 * Fleet Intelligence Smart AI - Operational Trip Timeline Audit Service
 * PROMPT 15 — Audit Trail Engine for Operational Lifecycle Events
 */

import { TripAuditTimelineItem } from '../plannedTripTypes';

export class TripTimelineService {
  private static auditLogs: Record<string, TripAuditTimelineItem[]> = {};

  /**
   * Log an operational event to the trip lifecycle timeline
   */
  public static logEvent(
    tripId: string,
    action: string,
    userName: string,
    userRole: string = 'Dispatcher',
    beforeState?: string,
    afterState?: string,
    details?: string
  ): TripAuditTimelineItem {
    if (!this.auditLogs[tripId]) {
      this.auditLogs[tripId] = [];
    }

    const item: TripAuditTimelineItem = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      tripId,
      action,
      timestamp: new Date().toISOString(),
      userId: 'usr-admin-1',
      userName,
      userRole,
      beforeState,
      afterState,
      details,
    };

    this.auditLogs[tripId].unshift(item); // Chronological desc
    return item;
  }

  /**
   * Get audit timeline for a trip
   */
  public static getTimeline(tripId: string): TripAuditTimelineItem[] {
    return this.auditLogs[tripId] || [];
  }

  /**
   * Initialize default seed events for mock trips
   */
  public static seedTimeline(tripId: string, createdAt: string, createdBy: string) {
    if (!this.auditLogs[tripId]) {
      this.auditLogs[tripId] = [
        {
          id: `aud-seed-1-${tripId}`,
          tripId,
          action: 'trip.created',
          timestamp: createdAt,
          userId: 'usr-admin-1',
          userName: createdBy,
          userRole: 'Dispatcher',
          beforeState: 'NONE',
          afterState: 'PLANNED',
          details: 'Trip operasional dibuat oleh dispatcher.',
        },
      ];
    }
  }
}
