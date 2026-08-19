/**
 * Fleet Intelligence Smart AI - Realtime Alert Engine & Event Processor Core
 * Evaluates telemetry events against configured rules, handles state transitions,
 * deduplication, cooldowns, notifications, and audit logging.
 */

import {
  Alert,
  AlertStatus,
  AlertSeverity,
  ResolutionCode,
  TelemetryEvent,
  AlertRule,
  ConditionGroup,
  ConditionClause,
} from '../types';
import { alertRuleService } from './alertRuleService';
import { alertDeduplicationService } from './alertDeduplicationService';
import { alertNotificationService } from './alertNotificationService';
import { alertEscalationService } from './alertEscalationService';
import { alertEventService } from './alertEventService';
import { alertWebhookService } from './alertWebhookService';

class AlertEngine {
  private alerts: Alert[] = [
    {
      id: 'alt-01',
      tenantId: 'tenant-tln-01',
      ruleId: 'rule-01',
      ruleName: 'Overspeed Critical (>100 km/h)',
      type: 'OVERSPEED',
      severity: 'CRITICAL',
      priority: 1,
      status: 'ACTIVE',
      vehicleId: 'veh-01',
      vehiclePlate: 'B 9281 TKN',
      deviceId: 'dev-01',
      imeiMasked: '••••••••••9821',
      driverId: 'drv-01',
      driverName: 'Sugianto',
      tripId: 'trp-01',
      tripNumber: 'TRP-2026-0801',
      routeId: 'rt-01',
      routeName: 'Jakarta - Bandung Express',
      deliveryId: 'del-01',
      deliveryNumber: 'DEL-2026-00101',
      title: 'Pelanggaran Kecepatan Kritis (112 km/jam)',
      message: 'Kendaraan B 9281 TKN melaju 112 km/jam melebihi batas 100 km/jam selama 45 detik di Tol Cipularang KM 92.',
      triggeredAt: new Date(Date.now() - 1800000).toISOString(),
      latitude: -6.6432,
      longitude: 107.4521,
      locationName: 'Jalan Tol Cipularang KM 92, Purwakarta',
      triggerValue: 112,
      thresholdValue: 100,
      fingerprint: 'tenant-tln-01:rule-01:veh-01:OVERSPEED',
      metadata: { speed: 112, limit: 100, roadType: 'HIGHWAY' },
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      updatedAt: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: 'alt-02',
      tenantId: 'tenant-tln-01',
      ruleId: 'rule-08',
      ruleName: 'SOS Emergency Panic Button',
      type: 'PANIC',
      severity: 'CRITICAL',
      priority: 1,
      status: 'ACKNOWLEDGED',
      acknowledgedAt: new Date(Date.now() - 600000).toISOString(),
      acknowledgedBy: 'Budi Dispatcher',
      vehicleId: 'veh-02',
      vehiclePlate: 'B 9821 UTX',
      deviceId: 'dev-02',
      imeiMasked: '••••••••••8823',
      driverId: 'drv-02',
      driverName: 'Ahmad Subagja',
      tripId: 'trp-02',
      tripNumber: 'TRP-2026-0802',
      deliveryId: 'del-02',
      deliveryNumber: 'DEL-2026-00102',
      title: 'Tombol SOS Darurat Ditekan Driver',
      message: 'Driver Ahmad Subagja mengaktifkan sinyal SOS darurat dari dalam kabin kendaraan di Jalur Pantura.',
      triggeredAt: new Date(Date.now() - 1200000).toISOString(),
      latitude: -6.2146,
      longitude: 106.8451,
      locationName: 'Jl. Raya Bekasi KM 18, Cakung',
      triggerValue: true,
      thresholdValue: true,
      fingerprint: 'tenant-tln-01:rule-08:veh-02:PANIC',
      metadata: { panicState: true, battery: 98 },
      createdAt: new Date(Date.now() - 1200000).toISOString(),
      updatedAt: new Date(Date.now() - 600000).toISOString(),
    },
    {
      id: 'alt-03',
      tenantId: 'tenant-tln-01',
      ruleId: 'rule-05',
      ruleName: 'Route Deviation (>500 Meter)',
      type: 'ROUTE_DEVIATION',
      severity: 'HIGH',
      priority: 2,
      status: 'ACTIVE',
      vehicleId: 'veh-03',
      vehiclePlate: 'B 9112 PKO',
      deviceId: 'dev-03',
      imeiMasked: '••••••••••7721',
      driverId: 'drv-03',
      driverName: 'Eko Prasetyo',
      routeId: 'rt-02',
      routeName: 'Ring Road Barat Subang',
      title: 'Deviasi Rute Distribusi (742 Meter)',
      message: 'Kendaraan B 9112 PKO menyimpang sejauh 742 meter dari koridor rute resmi Jakarta - Semarang.',
      triggeredAt: new Date(Date.now() - 900000).toISOString(),
      latitude: -6.3421,
      longitude: 107.1245,
      locationName: 'Kawasan Industri Subang Barat',
      triggerValue: 742,
      thresholdValue: 500,
      fingerprint: 'tenant-tln-01:rule-05:veh-03:ROUTE_DEVIATION',
      metadata: { deviationDistanceMeters: 742 },
      createdAt: new Date(Date.now() - 900000).toISOString(),
      updatedAt: new Date(Date.now() - 900000).toISOString(),
    },
    {
      id: 'alt-04',
      tenantId: 'tenant-tln-01',
      ruleId: 'rule-07',
      ruleName: 'Cold-Chain Temperature Anomaly (>8°C)',
      type: 'TEMPERATURE',
      severity: 'CRITICAL',
      priority: 1,
      status: 'ACTIVE',
      vehicleId: 'veh-04',
      vehiclePlate: 'D 8812 BKN',
      deviceId: 'dev-04',
      driverId: 'drv-04',
      driverName: 'Rudi Hermawan',
      deliveryId: 'del-03',
      deliveryNumber: 'DEL-2026-00103',
      title: 'Anomali Suhu Kargo Pendingin (11.5°C)',
      message: 'Suhu boks kargo meningkat hingga 11.5°C melebihi batas aman cold-chain 8°C selama >5 menit.',
      triggeredAt: new Date(Date.now() - 2400000).toISOString(),
      latitude: -6.9175,
      longitude: 107.6191,
      locationName: 'Gudang Hub Distribusi Bandung Selatan',
      triggerValue: 11.5,
      thresholdValue: 8.0,
      fingerprint: 'tenant-tln-01:rule-07:veh-04:TEMPERATURE',
      metadata: { temperature: 11.5, unit: 'CELSIUS' },
      createdAt: new Date(Date.now() - 2400000).toISOString(),
      updatedAt: new Date(Date.now() - 2400000).toISOString(),
    },
    {
      id: 'alt-05',
      tenantId: 'tenant-tln-01',
      ruleId: 'rule-03',
      ruleName: 'GPS Device Offline (>10 Menit)',
      type: 'DEVICE_OFFLINE',
      severity: 'HIGH',
      priority: 2,
      status: 'ACTIVE',
      vehicleId: 'veh-05',
      vehiclePlate: 'B 9001 XTR',
      deviceId: 'dev-05',
      driverId: 'drv-05',
      driverName: 'Hendra Setiawan',
      title: 'Koneksi Perangkat GPS Terputus (Offline)',
      message: 'Tidak ada sinyal ping GPS dari armada B 9001 XTR selama 14 menit terakhir.',
      triggeredAt: new Date(Date.now() - 3000000).toISOString(),
      latitude: -6.1754,
      longitude: 106.8272,
      locationName: 'Area Pelabuhan Tanjung Priok Hub 3',
      triggerValue: 840, // 14 mins in sec
      thresholdValue: 600,
      fingerprint: 'tenant-tln-01:rule-03:veh-05:DEVICE_OFFLINE',
      metadata: { offlineSeconds: 840 },
      createdAt: new Date(Date.now() - 3000000).toISOString(),
      updatedAt: new Date(Date.now() - 3000000).toISOString(),
    },
  ];

  // Track violation timer starts for duration-based conditions
  private violationTimerMap = new Map<string, number>();

  public getAlerts(): Alert[] {
    return this.alerts;
  }

  public getActiveAlerts(): Alert[] {
    return this.alerts.filter((a) => a.status === 'ACTIVE' || a.status === 'ACKNOWLEDGED' || a.status === 'ESCALATED');
  }

  public getAlertById(id: string): Alert | undefined {
    return this.alerts.find((a) => a.id === id);
  }

  /**
   * Main Event Processor for incoming GPS & Telemetry Stream
   */
  public processTelemetryEvent(event: TelemetryEvent): Alert | null {
    // 1. Resolve applicable rules for this vehicle
    const rules = alertRuleService.resolveApplicableRulesForVehicle(event.vehicleId);

    for (const rule of rules) {
      const match = this.evaluateConditionGroup(rule.conditionGroup, event);

      const fingerprint = alertDeduplicationService.generateFingerprint(
        event.tenantId,
        event.vehicleId,
        rule.type,
        rule.id
      );

      if (match) {
        // Duration threshold check
        let violationStartTime = this.violationTimerMap.get(fingerprint);
        if (!violationStartTime) {
          violationStartTime = Date.now();
          this.violationTimerMap.set(fingerprint, violationStartTime);
        }

        const durationElapsedSec = (Date.now() - violationStartTime) / 1000;
        if (rule.durationSeconds > 0 && durationElapsedSec < rule.durationSeconds) {
          // Violation duration not reached yet -> PENDING
          continue;
        }

        // Check deduplication & cooldown
        if (alertDeduplicationService.isInCooldown(fingerprint, rule.cooldownSeconds)) {
          // Check if active alert already exists to update telemetry snapshot
          const existingAlert = alertDeduplicationService.findActiveMatchingAlert(this.alerts, fingerprint);
          if (existingAlert) {
            existingAlert.latitude = event.latitude;
            existingAlert.longitude = event.longitude;
            existingAlert.locationName = event.locationName || existingAlert.locationName;
            existingAlert.updatedAt = new Date().toISOString();
          }
          continue;
        }

        // Check if there is an existing active alert for this fingerprint
        const activeMatchingAlert = alertDeduplicationService.findActiveMatchingAlert(this.alerts, fingerprint);

        if (activeMatchingAlert) {
          // Update existing alert timestamp & trigger value
          activeMatchingAlert.latitude = event.latitude;
          activeMatchingAlert.longitude = event.longitude;
          activeMatchingAlert.triggerValue = this.extractTriggerValue(rule.type, event);
          activeMatchingAlert.updatedAt = new Date().toISOString();
          alertDeduplicationService.recordTrigger(fingerprint);
          return activeMatchingAlert;
        }

        // CREATE NEW ALERT
        const newAlert: Alert = {
          id: `alt-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`,
          tenantId: event.tenantId,
          ruleId: rule.id,
          ruleName: rule.name,
          type: rule.type,
          severity: rule.severity,
          priority: rule.priority,
          status: 'ACTIVE',
          vehicleId: event.vehicleId,
          vehiclePlate: event.vehiclePlate,
          deviceId: event.deviceId,
          driverId: event.driverId,
          driverName: event.driverName,
          tripId: event.tripId,
          deliveryId: event.deliveryId,
          geofenceId: event.geofenceId,
          geofenceName: event.geofenceName,
          title: this.buildAlertTitle(rule.type, event),
          message: this.buildAlertMessage(rule.type, event, rule),
          triggeredAt: new Date().toISOString(),
          latitude: event.latitude,
          longitude: event.longitude,
          locationName: event.locationName || 'Lokasi Terdeteksi GPS',
          triggerValue: this.extractTriggerValue(rule.type, event),
          thresholdValue: this.extractThresholdValue(rule.type, rule, event),
          fingerprint,
          metadata: {
            speed: event.speed,
            ignition: event.ignition,
            batteryVoltage: event.batteryVoltage,
            temperature: event.temperature,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        this.alerts.unshift(newAlert);
        alertDeduplicationService.recordTrigger(fingerprint);

        // Record Audit Event
        alertEventService.recordEvent(
          newAlert.id,
          'TRIGGERED',
          'ACTIVE',
          'SYSTEM',
          'rule-engine',
          `Rule Engine (${rule.name})`
        );

        // Execute Actions (Notifications & Webhooks)
        alertNotificationService.dispatchNotification(newAlert, rule.actions);
        if (rule.actions.includes('WEBHOOK')) {
          alertWebhookService.sendWebhookPayload(newAlert);
        }

        return newAlert;
      } else {
        // Condition no longer met -> reset violation timer
        this.violationTimerMap.delete(fingerprint);

        // Auto-resolution for DEVICE_OFFLINE when device pings back online
        if (rule.type === 'DEVICE_OFFLINE') {
          const activeOfflineAlert = alertDeduplicationService.findActiveMatchingAlert(this.alerts, fingerprint);
          if (activeOfflineAlert) {
            this.resolveAlert(
              activeOfflineAlert.id,
              'DEVICE_RECOVERED',
              'Sinyal GPS kembali ONLINE dan mengirim data telemetry normal.',
              'System Auto-Recover'
            );
          }
        }
      }
    }

    return null;
  }

  /**
   * Action: Acknowledge Alert
   */
  public acknowledgeAlert(alertId: string, acknowledgedBy: string = 'Operations Dispatcher'): Alert {
    const alert = this.getAlertById(alertId);
    if (!alert) throw new Error('Alert not found');

    const prevStatus = alert.status;
    alert.status = 'ACKNOWLEDGED';
    alert.acknowledgedAt = new Date().toISOString();
    alert.acknowledgedBy = acknowledgedBy;
    alert.updatedAt = new Date().toISOString();

    alertEventService.recordEvent(
      alert.id,
      'ACKNOWLEDGED',
      'ACKNOWLEDGED',
      'USER',
      'usr-current',
      acknowledgedBy,
      prevStatus
    );

    return alert;
  }

  /**
   * Action: Resolve Alert
   */
  public resolveAlert(
    alertId: string,
    code: ResolutionCode,
    note: string,
    resolvedBy: string = 'Operations Manager'
  ): Alert {
    const alert = this.getAlertById(alertId);
    if (!alert) throw new Error('Alert not found');

    const prevStatus = alert.status;
    alert.status = 'RESOLVED';
    alert.resolvedAt = new Date().toISOString();
    alert.resolvedBy = resolvedBy;
    alert.resolutionCode = code;
    alert.resolutionNote = note;
    alert.updatedAt = new Date().toISOString();

    if (code === 'FALSE_POSITIVE') {
      alert.isFalsePositive = true;
      alert.falsePositiveReason = note;
    }

    // Clear deduplication cooldown
    alertDeduplicationService.clearCooldown(alert.fingerprint);

    alertEventService.recordEvent(
      alert.id,
      'RESOLVED',
      'RESOLVED',
      'USER',
      'usr-current',
      resolvedBy,
      prevStatus,
      { resolutionCode: code, note }
    );

    return alert;
  }

  /**
   * Action: Dismiss Alert
   */
  public dismissAlert(alertId: string, dismissedBy: string = 'Fleet Supervisor'): Alert {
    const alert = this.getAlertById(alertId);
    if (!alert) throw new Error('Alert not found');

    const prevStatus = alert.status;
    alert.status = 'DISMISSED';
    alert.updatedAt = new Date().toISOString();

    alertEventService.recordEvent(
      alert.id,
      'DISMISSED',
      'DISMISSED',
      'USER',
      'usr-current',
      dismissedBy,
      prevStatus
    );

    return alert;
  }

  /**
   * Action: Manual / Auto Escalation
   */
  public escalateAlert(alertId: string, targetRecipient: string = 'Fleet VP'): Alert {
    const alert = this.getAlertById(alertId);
    if (!alert) throw new Error('Alert not found');

    const prevStatus = alert.status;
    alert.status = 'ESCALATED';
    alert.escalatedAt = new Date().toISOString();
    alert.escalationLevel = (alert.escalationLevel || 1) + 1;
    alert.updatedAt = new Date().toISOString();

    alertEventService.recordEvent(
      alert.id,
      'ESCALATED',
      'ESCALATED',
      'ESCALATION_ENGINE',
      'escalation-service',
      `Escalated to ${targetRecipient} (Level ${alert.escalationLevel})`,
      prevStatus
    );

    alertNotificationService.dispatchNotification(alert, ['PUSH', 'WHATSAPP', 'SMS']);
    return alert;
  }

  // --- Condition Evaluation Engine Helpers ---
  private evaluateConditionGroup(group: ConditionGroup, event: TelemetryEvent): boolean {
    if (!group || !group.clauses || group.clauses.length === 0) return false;

    if (group.logicalOperator === 'AND') {
      const clausesMatch = group.clauses.every((c) => this.evaluateClause(c, event));
      if (!clausesMatch) return false;

      if (group.nestedGroups && group.nestedGroups.length > 0) {
        return group.nestedGroups.every((g) => this.evaluateConditionGroup(g, event));
      }
      return true;
    } else {
      // OR operator
      const clauseMatch = group.clauses.some((c) => this.evaluateClause(c, event));
      if (clauseMatch) return true;

      if (group.nestedGroups && group.nestedGroups.length > 0) {
        return group.nestedGroups.some((g) => this.evaluateConditionGroup(g, event));
      }
      return false;
    }
  }

  private evaluateClause(clause: ConditionClause, event: TelemetryEvent): boolean {
    const val = (event as any)[clause.field];
    if (val === undefined || val === null) return false;

    switch (clause.operator) {
      case '>':
        return Number(val) > Number(clause.value);
      case '<':
        return Number(val) < Number(clause.value);
      case '>=':
        return Number(val) >= Number(clause.value);
      case '<=':
        return Number(val) <= Number(clause.value);
      case '=':
        return val === clause.value;
      case '!=':
        return val !== clause.value;
      case 'BETWEEN':
        return Number(val) >= Number(clause.value) && Number(val) <= Number(clause.secondaryValue);
      case 'IN':
        return Array.isArray(clause.value) && clause.value.includes(val);
      default:
        return false;
    }
  }

  private buildAlertTitle(type: string, event: TelemetryEvent): string {
    switch (type) {
      case 'OVERSPEED':
        return `Pelanggaran Kecepatan (${event.speed} km/jam)`;
      case 'IDLE':
        return `Mesin Idle Berkepanjangan`;
      case 'DEVICE_OFFLINE':
        return `Perangkat GPS Offline`;
      case 'GEOFENCE':
        return `Pelanggaran Zona Geofence (${event.geofenceName || 'Restricted'})`;
      case 'ROUTE_DEVIATION':
        return `Deviasi Rute (${event.routeDeviationDistMeters || 500} Meter)`;
      case 'IGNITION':
        return `Kontak Mesin Menyala di Luar Jam Operasional`;
      case 'TEMPERATURE':
        return `Anomali Suhu Cold-Chain (${event.temperature}°C)`;
      case 'PANIC':
        return `Sinyal Darurat SOS Panic Button`;
      default:
        return `Peringatan Telematika Armada`;
    }
  }

  private buildAlertMessage(type: string, event: TelemetryEvent, rule: AlertRule): string {
    return `Armada ${event.vehiclePlate} memicu ${rule.name} di lokasi ${event.locationName || 'GPS Location'}. Nilai terdeteksi: ${this.extractTriggerValue(type, event)}.`;
  }

  private extractTriggerValue(type: string, event: TelemetryEvent): any {
    switch (type) {
      case 'OVERSPEED':
        return event.speed;
      case 'TEMPERATURE':
        return event.temperature;
      case 'ROUTE_DEVIATION':
        return event.routeDeviationDistMeters;
      case 'PANIC':
        return true;
      case 'IGNITION':
        return event.ignition;
      default:
        return event.speed;
    }
  }

  private extractThresholdValue(type: string, rule: AlertRule, event: TelemetryEvent): any {
    if (type === 'OVERSPEED') return event.speedLimit || 100;
    if (type === 'TEMPERATURE') return 8.0;
    if (type === 'ROUTE_DEVIATION') return 500;
    return 0;
  }
}

export const alertEngine = new AlertEngine();
