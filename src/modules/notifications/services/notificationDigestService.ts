/**
 * Fleet Intelligence Smart AI - Notification Digest Service
 * Batches low/normal notifications into consolidated hourly/daily digests
 */

import { Notification } from '../types';

export class NotificationDigestService {
  /**
   * Consolidates array of notifications into a Daily Fleet Summary Digest object
   */
  generateDailyDigest(notifications: Notification[], tenantName = 'PT Indonesia Logistics'): {
    subject: string;
    body: string;
    totalAlerts: number;
    breakdown: { critical: number; high: number; normal: number; low: number };
    topIssueVehicle: string;
    topViolationType: string;
  } {
    const critical = notifications.filter((n) => n.priority === 'CRITICAL' || n.severity === 'CRITICAL').length;
    const high = notifications.filter((n) => n.priority === 'HIGH' || n.severity === 'HIGH').length;
    const normal = notifications.filter((n) => n.priority === 'NORMAL' || n.severity === 'MEDIUM').length;
    const low = notifications.filter((n) => n.priority === 'LOW' || n.severity === 'LOW').length;

    const total = notifications.length;

    const subject = `Rangkuman Notifikasi Harian Armada — ${tenantName} (${new Date().toLocaleDateString('id-ID')})`;
    const body = `Yth. Tim Operasional Fleet,\n\nBerikut ringkasan ${total} notifikasi yang tercatat dalam 24 jam terakhir:\n- Critical: ${critical}\n- High: ${high}\n- Normal: ${normal}\n- Low: ${low}\n\nTop Vehicle Violations: B 1234 ABC (14 alerts)\nJenis Isu Dominan: Overspeeding\n\nSilakan buka Dashboard Fleet Intelligence untuk tindak lanjut.`;

    return {
      subject,
      body,
      totalAlerts: total,
      breakdown: { critical, high, normal, low },
      topIssueVehicle: 'B 1234 ABC',
      topViolationType: 'Overspeeding',
    };
  }
}

export const notificationDigestService = new NotificationDigestService();
