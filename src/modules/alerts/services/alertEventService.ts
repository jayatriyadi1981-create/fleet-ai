/**
 * Fleet Intelligence Smart AI - Alert Event Audit Service
 * Audit timeline tracking for all alert state transitions
 */

import { AlertEvent, AlertEventType, AlertStatus } from '../types';

class AlertEventService {
  private events: AlertEvent[] = [
    {
      id: 'ev-01',
      alertId: 'alt-01',
      eventType: 'TRIGGERED',
      newStatus: 'ACTIVE',
      actorType: 'SYSTEM',
      actorId: 'system-rule-engine',
      actorName: 'Rule Engine (Overspeed Critical)',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      metadata: { speed: 112, limit: 100 },
    },
    {
      id: 'ev-02',
      alertId: 'alt-02',
      eventType: 'TRIGGERED',
      newStatus: 'ACTIVE',
      actorType: 'SYSTEM',
      actorId: 'system-rule-engine',
      actorName: 'Rule Engine (SOS Panic)',
      timestamp: new Date(Date.now() - 1200000).toISOString(),
      metadata: { panicState: true },
    },
    {
      id: 'ev-03',
      alertId: 'alt-02',
      eventType: 'ACKNOWLEDGED',
      previousStatus: 'ACTIVE',
      newStatus: 'ACKNOWLEDGED',
      actorType: 'USER',
      actorId: 'usr-dispatch-01',
      actorName: 'Budi Dispatcher',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      metadata: { note: 'Sudah menghubungi driver via radio' },
    },
  ];

  public recordEvent(
    alertId: string,
    eventType: AlertEventType,
    newStatus: AlertStatus,
    actorType: 'SYSTEM' | 'USER' | 'ESCALATION_ENGINE',
    actorId: string,
    actorName: string,
    previousStatus?: AlertStatus,
    metadata?: Record<string, any>
  ): AlertEvent {
    const event: AlertEvent = {
      id: `ev-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`,
      alertId,
      eventType,
      previousStatus,
      newStatus,
      actorType,
      actorId,
      actorName,
      timestamp: new Date().toISOString(),
      metadata,
    };

    this.events.unshift(event);
    return event;
  }

  public getEventsForAlert(alertId: string): AlertEvent[] {
    return this.events.filter((e) => e.alertId === alertId);
  }

  public getAllEvents(): AlertEvent[] {
    return this.events;
  }
}

export const alertEventService = new AlertEventService();
