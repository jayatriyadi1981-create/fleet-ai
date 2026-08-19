/**
 * Fleet Intelligence Smart AI - Audit Event Processor & Security Anomaly Detection
 * PROMPT 49 - Real-time stream processing, anomaly detection, DLQ and Security Alerts
 */

import { AuditEvent, SecuritySeverity, SecurityAlertRule } from '../types/auditTypes';
import { AuditRedactionService } from './auditRedactionService';
import { AuditIntegrityEngine } from './auditIntegrityEngine';

export interface SecurityAlertNotification {
  id: string;
  ruleId: string;
  title: string;
  description: string;
  severity: SecuritySeverity;
  timestamp: string;
  targetUser?: string;
  ipAddress?: string;
  eventIds: string[];
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
}

export class AuditEventProcessor {
  private queue: Partial<AuditEvent>[] = [];
  private deadLetterQueue: { event: Partial<AuditEvent>; error: string; timestamp: string }[] = [];
  private isProcessing = false;
  private securityAlerts: SecurityAlertNotification[] = [];
  private alertSubscribers: ((alert: SecurityAlertNotification) => void)[] = [];

  // Security alert rules
  private alertRules: SecurityAlertRule[] = [
    {
      id: 'rule-failed-login',
      name: 'Peringatan Percobaan Login Gagal Beruntun',
      description: 'Mendeteksi 3+ percobaan login gagal dalam 5 menit',
      enabled: true,
      severity: 'HIGH',
      triggerType: 'MULTIPLE_LOGIN_FAILURES',
      threshold: 3,
      timeWindowMinutes: 5,
      notifyChannels: ['IN_APP', 'EMAIL'],
    },
    {
      id: 'rule-mass-delete',
      name: 'Pencegahan Penghapusan Massal (Mass Delete)',
      description: 'Mendeteksi penghapusan lebih dari 5 entitas dalam waktu 2 menit',
      enabled: true,
      severity: 'CRITICAL',
      triggerType: 'MASS_DELETE',
      threshold: 5,
      timeWindowMinutes: 2,
      notifyChannels: ['IN_APP', 'EMAIL', 'SMS'],
    },
    {
      id: 'rule-mass-permission',
      name: 'Perubahan Izin Massal / Privilege Escalation',
      description: 'Mendeteksi modifikasi hak akses role penting secara massal',
      enabled: true,
      severity: 'CRITICAL',
      triggerType: 'MASS_PERMISSION_CHANGE',
      threshold: 3,
      timeWindowMinutes: 5,
      notifyChannels: ['IN_APP', 'EMAIL'],
    },
    {
      id: 'rule-impossible-travel',
      name: 'Deteksi Perjalanan Mustahil (Impossible Travel)',
      description: 'Mendeteksi login dari 2 lokasi berbeda dengan jarak > 500km dalam < 15 menit',
      enabled: true,
      severity: 'HIGH',
      triggerType: 'IMPOSSIBLE_TRAVEL',
      threshold: 1,
      timeWindowMinutes: 15,
      notifyChannels: ['IN_APP'],
    },
  ];

  public enqueue(rawEvent: Partial<AuditEvent>, existingEvents: AuditEvent[]): AuditEvent {
    try {
      // 1. Sanitize payload & apply PII masking
      const safeMetadata = rawEvent.metadata ? AuditRedactionService.sanitizeData(rawEvent.metadata) : undefined;
      const safeBefore = rawEvent.before ? AuditRedactionService.sanitizeData(rawEvent.before) : undefined;
      const safeAfter = rawEvent.after ? AuditRedactionService.sanitizeData(rawEvent.after) : undefined;

      // 2. Compute diff if before & after provided
      let computedDiff = rawEvent.diff;
      if (!computedDiff && (rawEvent.before || rawEvent.after)) {
        computedDiff = AuditRedactionService.calculateFieldDiff(rawEvent.before, rawEvent.after);
      }

      // 3. Compute next sequence number and previous hash
      const sequenceNumber = existingEvents.length + 1;
      const previousHash =
        existingEvents.length > 0
          ? existingEvents[existingEvents.length - 1].eventHash
          : AuditIntegrityEngine.GENESIS_HASH;

      const timestamp = rawEvent.timestamp || new Date().toISOString();
      const payloadSnippet = JSON.stringify(computedDiff || safeMetadata || '');
      
      const eventHash = AuditIntegrityEngine.calculateEventHash(
        sequenceNumber,
        previousHash,
        timestamp,
        rawEvent.actor?.id || 'SYSTEM',
        rawEvent.action || 'READ',
        rawEvent.entityId || 'UNKNOWN',
        payloadSnippet
      );

      const finalizedEvent: AuditEvent = {
        id: rawEvent.id || `aud-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        tenantId: rawEvent.tenantId || 'tenant-1',
        tenantName: rawEvent.tenantName || 'PT Trans Logistik Nusantara',
        actor: {
          id: rawEvent.actor?.id || 'sys-auto',
          name: rawEvent.actor?.name || 'System Worker',
          email: AuditRedactionService.maskEmail(rawEvent.actor?.email),
          type: rawEvent.actor?.type || 'SYSTEM',
          role: rawEvent.actor?.role || 'SYSTEM',
          department: rawEvent.actor?.department,
          branchName: rawEvent.actor?.branchName,
          avatarUrl: rawEvent.actor?.avatarUrl,
        },
        action: rawEvent.action || 'READ',
        actionCategory: rawEvent.actionCategory || 'SYSTEM',
        actionLabel: rawEvent.actionLabel || this.generateActionLabel(rawEvent.action),
        module: rawEvent.module || 'system',
        entityType: rawEvent.entityType || 'General',
        entityId: rawEvent.entityId || 'none',
        entityName: rawEvent.entityName || 'General Entity',
        timestamp,
        status: rawEvent.status || 'SUCCESS',
        severity: rawEvent.severity || this.deduceSeverity(rawEvent.action, rawEvent.status),
        security: {
          ipAddress: rawEvent.security?.ipAddress || '127.0.0.1',
          userAgent: rawEvent.security?.userAgent || 'Internal Engine/1.0',
          deviceType: rawEvent.security?.deviceType || 'DESKTOP',
          browser: rawEvent.security?.browser || 'Chrome 128.0',
          os: rawEvent.security?.os || 'Windows 11',
          city: rawEvent.security?.city || 'Jakarta',
          country: rawEvent.security?.country || 'Indonesia',
          failureReason: rawEvent.security?.failureReason,
          riskScore: rawEvent.security?.riskScore || (rawEvent.status === 'FAILED' ? 45 : 5),
        },
        sessionId: rawEvent.sessionId || 'sess-' + Math.random().toString(36).substring(2, 8),
        requestId: rawEvent.requestId || 'req-' + Math.random().toString(36).substring(2, 10),
        correlationId: rawEvent.correlationId || 'corr-' + Math.random().toString(36).substring(2, 10),
        source: rawEvent.source || 'WEB_APP',
        diff: computedDiff,
        metadata: safeMetadata,
        before: safeBefore,
        after: safeAfter,
        reason: rawEvent.reason,
        eventHash,
        previousHash,
        sequenceNumber,
      };

      // 4. Run real-time security anomaly checks
      this.evaluateSecurityAnomalies(finalizedEvent, existingEvents);

      return finalizedEvent;
    } catch (err: any) {
      // Dead Letter Queue mechanism
      this.deadLetterQueue.push({
        event: rawEvent,
        error: err?.message || 'Unknown processing error',
        timestamp: new Date().toISOString(),
      });
      throw err;
    }
  }

  private deduceSeverity(action?: string, status?: string): SecuritySeverity {
    if (status === 'FAILED' || status === 'BLOCKED') {
      if (action?.includes('DELETE') || action?.includes('PERMISSION')) return 'CRITICAL';
      if (action?.includes('LOGIN') || action?.includes('AUTH')) return 'HIGH';
      return 'MEDIUM';
    }
    if (action?.includes('DELETE') || action?.includes('ROLE_DELETED') || action?.includes('IMPERSONATION')) {
      return 'CRITICAL';
    }
    if (action?.includes('PERMISSION') || action?.includes('EXPORT') || action?.includes('2FA')) {
      return 'MEDIUM';
    }
    return 'INFO';
  }

  private generateActionLabel(action?: string): string {
    if (!action) return 'Aktivitas Umum';
    return action
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase());
  }

  private evaluateSecurityAnomalies(newEvent: AuditEvent, history: AuditEvent[]) {
    const recent = [...history.slice(-100), newEvent];
    const nowTime = new Date(newEvent.timestamp).getTime();

    // 1. Check Multiple Failed Logins
    if (newEvent.action === 'LOGIN_FAILED') {
      const fiveMinAgo = nowTime - 5 * 60 * 1000;
      const failedLogins = recent.filter(
        (e) =>
          e.action === 'LOGIN_FAILED' &&
          new Date(e.timestamp).getTime() >= fiveMinAgo &&
          (e.actor.email === newEvent.actor.email || e.security.ipAddress === newEvent.security.ipAddress)
      );

      if (failedLogins.length >= 3) {
        this.raiseSecurityAlert({
          id: `alert-login-${Date.now()}`,
          ruleId: 'rule-failed-login',
          title: '🚨 Percobaan Login Gagal Berulang Terdeteksi',
          description: `Terdeteksi ${failedLogins.length} kali kegagalan login untuk target user (${newEvent.actor.email || newEvent.actor.name}) dari IP ${newEvent.security.ipAddress} dalam kurun waktu 5 menit.`,
          severity: 'HIGH',
          timestamp: newEvent.timestamp,
          targetUser: newEvent.actor.email || newEvent.actor.name,
          ipAddress: newEvent.security.ipAddress,
          eventIds: failedLogins.map((e) => e.id),
          resolved: false,
        });
      }
    }

    // 2. Check Mass Delete
    if (newEvent.action === 'DELETE' || newEvent.action === 'BATCH_DELETE') {
      const twoMinAgo = nowTime - 2 * 60 * 1000;
      const deletes = recent.filter(
        (e) =>
          (e.action === 'DELETE' || e.action === 'BATCH_DELETE') &&
          new Date(e.timestamp).getTime() >= twoMinAgo &&
          e.actor.id === newEvent.actor.id
      );

      if (deletes.length >= 5) {
        this.raiseSecurityAlert({
          id: `alert-mass-delete-${Date.now()}`,
          ruleId: 'rule-mass-delete',
          title: '🚨 Potensi Penghapusan Data Massal (Mass Deletion Hazard)',
          description: `Pengguna ${newEvent.actor.name} (${newEvent.actor.role}) melakukan ${deletes.length} operasi penghapusan data dalam durasi 2 menit di modul ${newEvent.module}.`,
          severity: 'CRITICAL',
          timestamp: newEvent.timestamp,
          targetUser: newEvent.actor.name,
          ipAddress: newEvent.security.ipAddress,
          eventIds: deletes.map((e) => e.id),
          resolved: false,
        });
      }
    }
  }

  private raiseSecurityAlert(alert: SecurityAlertNotification) {
    // Avoid duplicate open alerts for the same condition
    const existing = this.securityAlerts.find(
      (a) => !a.resolved && a.ruleId === alert.ruleId && a.targetUser === alert.targetUser
    );
    if (!existing) {
      this.securityAlerts.unshift(alert);
      this.alertSubscribers.forEach((fn) => fn(alert));
    }
  }

  public getSecurityAlerts(): SecurityAlertNotification[] {
    return this.securityAlerts;
  }

  public resolveAlert(alertId: string, resolvedBy: string) {
    const target = this.securityAlerts.find((a) => a.id === alertId);
    if (target) {
      target.resolved = true;
      target.resolvedBy = resolvedBy;
      target.resolvedAt = new Date().toISOString();
    }
  }

  public subscribeAlerts(callback: (alert: SecurityAlertNotification) => void): () => void {
    this.alertSubscribers.push(callback);
    return () => {
      this.alertSubscribers = this.alertSubscribers.filter((cb) => cb !== callback);
    };
  }

  public getDeadLetterQueue() {
    return this.deadLetterQueue;
  }
}
