/**
 * Fleet Intelligence Smart AI - Document Expiry Engine & Escalation Hub
 * PROMPT 48 - Dynamic Thresholding, Recurrence Protection, Severity Scoring & Escalation Dispatch
 */

import { DocumentItem, DocumentStatus, ExpirySeverity, ExpiryThresholdConfig, ExpiringGroupedSummary, ExpiredGroupedSummary } from '../types/documentTypes';

export interface ExpiryEvaluationResult {
  documentId: string;
  status: DocumentStatus;
  daysRemaining: number;
  severity: ExpirySeverity;
  shouldNotify: boolean;
  notificationThresholdTriggered?: number;
  escalationTarget: 'DRIVER' | 'FLEET_MANAGER' | 'COMPANY_ADMIN' | 'MAINTENANCE_SUPERVISOR';
  alertMessage: string;
}

export class DocumentExpiryEngine {
  private static instance: DocumentExpiryEngine;

  public static getInstance(): DocumentExpiryEngine {
    if (!DocumentExpiryEngine.instance) {
      DocumentExpiryEngine.instance = new DocumentExpiryEngine();
    }
    return DocumentExpiryEngine.instance;
  }

  private defaultConfig: ExpiryThresholdConfig = {
    infoDays: 90,
    mediumDays: 60,
    highDays: 30,
    urgentDays: 14,
    criticalDays: 7,
    finalWarningDays: 1,
  };

  /**
   * Calculates days remaining from today (local tenant time)
   */
  public calculateDaysRemaining(expiryDateStr: string, baseDate = new Date()): number {
    if (!expiryDateStr) return 999;
    const expiry = new Date(expiryDateStr);
    const today = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
    const target = new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate());
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Determine Document Status based on days remaining and current status
   */
  public determineStatus(daysRemaining: number, currentStatus: DocumentStatus, config = this.defaultConfig): DocumentStatus {
    if (currentStatus === 'ARCHIVED' || currentStatus === 'REJECTED' || currentStatus === 'PENDING_VERIFICATION') {
      return currentStatus;
    }

    if (daysRemaining < 0) {
      return 'EXPIRED';
    } else if (daysRemaining <= config.highDays) {
      return 'EXPIRING_SOON';
    } else {
      return 'VALID';
    }
  }

  /**
   * Determine Expiry Severity Level
   */
  public determineSeverity(daysRemaining: number, config = this.defaultConfig): ExpirySeverity {
    if (daysRemaining <= 0) return 'CRITICAL';
    if (daysRemaining <= config.criticalDays) return 'CRITICAL';
    if (daysRemaining <= config.highDays) return 'HIGH';
    if (daysRemaining <= config.infoDays) return 'MEDIUM';
    return 'INFO';
  }

  /**
   * Evaluate a document for expiry notifications with Recurrence Protection
   */
  public evaluateDocument(doc: DocumentItem, config = this.defaultConfig): ExpiryEvaluationResult {
    const days = this.calculateDaysRemaining(doc.expiryDate);
    const status = this.determineStatus(days, doc.status, config);
    const severity = this.determineSeverity(days, config);

    // Notification thresholds for recurrence protection: 90, 60, 30, 14, 7, 1, 0 (expired)
    const thresholdSteps = [config.infoDays, config.mediumDays, config.highDays, config.urgentDays, config.criticalDays, config.finalWarningDays, 0];

    // Find the closest active threshold step
    let matchedThreshold: number | undefined = undefined;
    for (const step of thresholdSteps) {
      if (days <= step) {
        matchedThreshold = step;
      }
    }

    // Recurrence protection check
    const lastSent = doc.lastNotificationSentThreshold;
    const shouldNotify = matchedThreshold !== undefined && (lastSent === undefined || lastSent > matchedThreshold);

    // Determine Escalation Level based on urgency and document type
    let escalationTarget: 'DRIVER' | 'FLEET_MANAGER' | 'COMPANY_ADMIN' | 'MAINTENANCE_SUPERVISOR' = 'FLEET_MANAGER';
    if (days <= 0 || days <= config.criticalDays) {
      escalationTarget = 'COMPANY_ADMIN';
    } else if (doc.documentType === 'KIR' || doc.documentType === 'GPS_CALIBRATION') {
      escalationTarget = 'MAINTENANCE_SUPERVISOR';
    } else if (doc.entityType === 'DRIVER') {
      escalationTarget = days <= config.urgentDays ? 'FLEET_MANAGER' : 'DRIVER';
    }

    const typeDisplay = doc.customTypeName || doc.documentType.replace('_', ' ');
    const alertMessage =
      days < 0
        ? `🚨 DOKUMEN TELAH KEDALUWARSA: ${typeDisplay} untuk ${doc.entityName} telah habis masa berlaku sejak ${Math.abs(days)} hari yang lalu (${doc.expiryDate}).`
        : days === 0
        ? `🚨 DOKUMEN KEDALUWARSA HARI INI: ${typeDisplay} untuk ${doc.entityName} berakhir hari ini!`
        : `⚠️ PERINGATAN KEDALUWARSA: ${typeDisplay} untuk ${doc.entityName} akan kedaluwarsa dalam ${days} hari (${doc.expiryDate}).`;

    return {
      documentId: doc.id,
      status,
      daysRemaining: days,
      severity,
      shouldNotify,
      notificationThresholdTriggered: matchedThreshold,
      escalationTarget,
      alertMessage,
    };
  }

  /**
   * Group expiring documents into standard operational windows
   */
  public groupExpiringDocuments(docs: DocumentItem[]): ExpiringGroupedSummary {
    const today: DocumentItem[] = [];
    const next1to7Days: DocumentItem[] = [];
    const next8to30Days: DocumentItem[] = [];
    const next31to60Days: DocumentItem[] = [];
    const next61to90Days: DocumentItem[] = [];

    docs
      .filter((d) => d.status !== 'ARCHIVED' && d.status !== 'REJECTED')
      .forEach((d) => {
        const days = this.calculateDaysRemaining(d.expiryDate);
        if (days === 0) {
          today.push(d);
        } else if (days > 0 && days <= 7) {
          next1to7Days.push(d);
        } else if (days > 7 && days <= 30) {
          next8to30Days.push(d);
        } else if (days > 30 && days <= 60) {
          next31to60Days.push(d);
        } else if (days > 60 && days <= 90) {
          next61to90Days.push(d);
        }
      });

    return { today, next1to7Days, next8to30Days, next31to60Days, next61to90Days };
  }

  /**
   * Group expired documents into overdue windows
   */
  public groupExpiredDocuments(docs: DocumentItem[]): ExpiredGroupedSummary {
    const expiredToday: DocumentItem[] = [];
    const overdue1to7Days: DocumentItem[] = [];
    const overdue8to30Days: DocumentItem[] = [];
    const overdue30PlusDays: DocumentItem[] = [];

    docs
      .filter((d) => d.status !== 'ARCHIVED' && d.status !== 'REJECTED')
      .forEach((d) => {
        const days = this.calculateDaysRemaining(d.expiryDate);
        if (days === 0) {
          expiredToday.push(d);
        } else if (days < 0 && days >= -7) {
          overdue1to7Days.push(d);
        } else if (days < -7 && days >= -30) {
          overdue8to30Days.push(d);
        } else if (days < -30) {
          overdue30PlusDays.push(d);
        }
      });

    return { expiredToday, overdue1to7Days, overdue8to30Days, overdue30PlusDays };
  }
}

export const documentExpiryEngine = DocumentExpiryEngine.getInstance();
