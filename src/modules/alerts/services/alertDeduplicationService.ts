/**
 * Fleet Intelligence Smart AI - Alert Deduplication & Cooldown Service
 * Prevents alert spam and duplicate alerts from repeated GPS packets
 */

import { Alert, TelemetryEvent, AlertRule } from '../types';

class AlertDeduplicationService {
  // Map of fingerprint -> last triggered timestamp (ms)
  private cooldownTracker = new Map<string, number>();

  public generateFingerprint(
    tenantId: string,
    vehicleId: string,
    alertType: string,
    ruleId?: string
  ): string {
    return `${tenantId}:${ruleId || 'default'}:${vehicleId}:${alertType}`;
  }

  public isInCooldown(fingerprint: string, cooldownSeconds: number): boolean {
    if (cooldownSeconds <= 0) return false;

    const lastTime = this.cooldownTracker.get(fingerprint);
    if (!lastTime) return false;

    const elapsedSec = (Date.now() - lastTime) / 1000;
    return elapsedSec < cooldownSeconds;
  }

  public recordTrigger(fingerprint: string): void {
    this.cooldownTracker.set(fingerprint, Date.now());
  }

  public findActiveMatchingAlert(
    activeAlerts: Alert[],
    fingerprint: string
  ): Alert | undefined {
    return activeAlerts.find(
      (a) => a.fingerprint === fingerprint && (a.status === 'ACTIVE' || a.status === 'ACKNOWLEDGED')
    );
  }

  public clearCooldown(fingerprint: string): void {
    this.cooldownTracker.delete(fingerprint);
  }
}

export const alertDeduplicationService = new AlertDeduplicationService();
