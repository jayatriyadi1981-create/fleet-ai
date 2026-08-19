/**
 * Fleet Intelligence Smart AI - Telemetry Event Processor
 * Main pipeline entry point receiving real-time telemetry updates
 */

import { TelemetryEvent, Alert } from '../types';
import { alertEngine } from './alertEngine';

class TelemetryEventProcessor {
  public ingestTelemetry(event: TelemetryEvent): Alert | null {
    // 1. Validate Tenant
    if (!event.tenantId) {
      console.warn('[TelemetryProcessor] Event rejected: Missing tenantId');
      return null;
    }

    // 2. Normalize Event Defaults
    const normalized: TelemetryEvent = {
      ...event,
      speed: Number(event.speed) || 0,
      timestamp: event.timestamp || new Date().toISOString(),
    };

    // 3. Process through Alert Engine
    return alertEngine.processTelemetryEvent(normalized);
  }
}

export const telemetryEventProcessor = new TelemetryEventProcessor();
