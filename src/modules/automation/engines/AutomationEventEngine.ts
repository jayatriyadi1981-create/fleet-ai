/**
 * Fleet Intelligence Smart AI - Automation Event Engine & Event Bus
 * PROMPT 35 - Section 8, 9, 10, 24, 25, 56, 57
 */

import { AutomationEvent, AutomationEventType, EventSource } from '../types';

export interface EventDeduplicationRecord {
  lastEventId: string;
  lastTimestamp: number;
  occurrenceCount: number;
}

export class AutomationEventEngine {
  private static instance: AutomationEventEngine;
  private listeners: Map<string, Array<(event: AutomationEvent) => void>> = new Map();
  private deduplicationCache: Map<string, EventDeduplicationRecord> = new Map();
  private eventHistory: AutomationEvent[] = [];

  private constructor() {}

  public static getInstance(): AutomationEventEngine {
    if (!AutomationEventEngine.instance) {
      AutomationEventEngine.instance = new AutomationEventEngine();
    }
    return AutomationEventEngine.instance;
  }

  /**
   * Generates a correlation ID connecting related events, decisions, and notifications
   */
  public generateCorrelationId(prefix: string = 'CORR'): string {
    return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  }

  /**
   * Standardizes incoming event payload from various IoT, Driver, Fuel, Safety, and Trip sources
   */
  public createStandardizedEvent(params: {
    eventType: AutomationEventType;
    source: EventSource;
    tenantId: string;
    branchId?: string;
    entityType: 'vehicle' | 'driver' | 'trip' | 'device' | 'geofence' | 'system' | 'general';
    entityId: string;
    entityName?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    payload: Record<string, any>;
    metadata?: Record<string, any>;
    parentCorrelationId?: string;
  }): AutomationEvent {
    const eventId = `EVT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    const correlationId = params.parentCorrelationId || this.generateCorrelationId('CORR');

    const event: AutomationEvent = {
      eventId,
      eventType: params.eventType,
      tenantId: params.tenantId,
      branchId: params.branchId || 'BR-JKT-01',
      timestamp: new Date().toISOString(),
      source: params.source,
      entityType: params.entityType,
      entityId: params.entityId,
      entityName: params.entityName,
      severity: params.severity || 'medium',
      payload: {
        ...params.payload,
        receivedAt: new Date().toISOString(),
      },
      metadata: {
        ...params.metadata,
        engineVersion: '2.4.0',
        environment: 'production-secure',
      },
      correlationId,
    };

    return event;
  }

  /**
   * Checks if an event is duplicate or within the cooldown window for the given entity
   * Prevents alert storms (e.g. overspeed fluctuating 80 -> 81 -> 82 km/h)
   */
  public checkDeduplication(
    event: AutomationEvent,
    cooldownSeconds: number = 300
  ): { isDuplicate: boolean; reason?: string } {
    const deduplicationKey = `${event.tenantId}_${event.eventType}_${event.entityType}_${event.entityId}`;
    const now = Date.now();
    const existing = this.deduplicationCache.get(deduplicationKey);

    if (existing) {
      const elapsedSeconds = (now - existing.lastTimestamp) / 1000;
      if (elapsedSeconds < cooldownSeconds) {
        existing.occurrenceCount += 1;
        this.deduplicationCache.set(deduplicationKey, existing);
        return {
          isDuplicate: true,
          reason: `Event ditahan karena berada dalam cooldown window (${Math.round(elapsedSeconds)}s / ${cooldownSeconds}s) untuk entity ${event.entityId}`,
        };
      }
    }

    // Register / update cooldown timestamp
    this.deduplicationCache.set(deduplicationKey, {
      lastEventId: event.eventId,
      lastTimestamp: now,
      occurrenceCount: 1,
    });

    return { isDuplicate: false };
  }

  /**
   * Publishes an event to the internal bus and dispatches to registered workflow resolvers
   */
  public publishEvent(event: AutomationEvent): void {
    // Store in history (max 200 items in memory)
    this.eventHistory.unshift(event);
    if (this.eventHistory.length > 200) {
      this.eventHistory.pop();
    }

    // Notify listeners for this specific event type or ALL
    const typeListeners = this.listeners.get(event.eventType) || [];
    const globalListeners = this.listeners.get('*') || [];

    [...typeListeners, ...globalListeners].forEach((callback) => {
      try {
        callback(event);
      } catch (err) {
        console.error(`[AutomationEventEngine] Listener execution failed for event ${event.eventId}:`, err);
      }
    });
  }

  /**
   * Subscribes to events on the bus
   */
  public subscribe(
    eventType: AutomationEventType | '*',
    callback: (event: AutomationEvent) => void
  ): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(callback);

    // Return unsubscribe function
    return () => {
      const current = this.listeners.get(eventType) || [];
      this.listeners.set(
        eventType,
        current.filter((cb) => cb !== callback)
      );
    };
  }

  /**
   * Returns recent events recorded in the bus
   */
  public getRecentEvents(limit: number = 20): AutomationEvent[] {
    return this.eventHistory.slice(0, limit);
  }

  /**
   * Resets the deduplication cache (useful for simulation/testing)
   */
  public clearDeduplicationCache(): void {
    this.deduplicationCache.clear();
  }
}

export const automationEventEngine = AutomationEventEngine.getInstance();
