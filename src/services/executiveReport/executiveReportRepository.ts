/**
 * Fleet Intelligence Smart AI - Executive Report Repository
 * PROMPT 52 — Persistence, Versioning, History, and Sharing Storage
 */

import { ExecutiveReport, ExecutiveScheduleConfig, SharedReportToken } from '../../types/executiveReport';

const STORAGE_KEY_REPORTS = 'fleet_ai_executive_reports';
const STORAGE_KEY_SCHEDULES = 'fleet_ai_executive_schedules';
const STORAGE_KEY_SHARES = 'fleet_ai_executive_shares';

export class ExecutiveReportRepository {
  private static reportsCache: Map<string, ExecutiveReport> = new Map();
  private static schedulesCache: Map<string, ExecutiveScheduleConfig> = new Map();
  private static initialized = false;

  private static init() {
    if (this.initialized) return;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedReports = localStorage.getItem(STORAGE_KEY_REPORTS);
        if (savedReports) {
          const parsed = JSON.parse(savedReports) as ExecutiveReport[];
          parsed.forEach(r => this.reportsCache.set(r.id, r));
        }

        const savedSchedules = localStorage.getItem(STORAGE_KEY_SCHEDULES);
        if (savedSchedules) {
          const parsed = JSON.parse(savedSchedules) as ExecutiveScheduleConfig[];
          parsed.forEach(s => this.schedulesCache.set(s.tenantId, s));
        }
      }
    } catch (e) {
      console.warn('LocalStorage error in ExecutiveReportRepository:', e);
    }
    this.initialized = true;
  }

  private static persist() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const reportsArr = Array.from(this.reportsCache.values());
        localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reportsArr));

        const schedulesArr = Array.from(this.schedulesCache.values());
        localStorage.setItem(STORAGE_KEY_SCHEDULES, JSON.stringify(schedulesArr));
      }
    } catch (e) {
      console.warn('Failed to persist ExecutiveReportRepository:', e);
    }
  }

  public static getReportById(id: string): ExecutiveReport | null {
    this.init();
    return this.reportsCache.get(id) || null;
  }

  public static getReportByPeriod(tenantId: string, periodLabel: string): ExecutiveReport | null {
    this.init();
    const reports = Array.from(this.reportsCache.values())
      .filter(r => r.tenantId === tenantId && r.periodLabel === periodLabel)
      .sort((a, b) => b.version - a.version);

    return reports[0] || null;
  }

  public static getVersionsForPeriod(tenantId: string, periodLabel: string): ExecutiveReport[] {
    this.init();
    return Array.from(this.reportsCache.values())
      .filter(r => r.tenantId === tenantId && r.periodLabel === periodLabel)
      .sort((a, b) => b.version - a.version);
  }

  public static getAllReports(tenantId: string = 'tenant-1'): ExecutiveReport[] {
    this.init();
    return Array.from(this.reportsCache.values())
      .filter(r => r.tenantId === tenantId)
      .sort((a, b) => new Date(b.periodEnd).getTime() - new Date(a.periodEnd).getTime());
  }

  public static saveReport(report: ExecutiveReport): void {
    this.init();
    this.reportsCache.set(report.id, report);
    this.persist();
  }

  public static getSchedule(tenantId: string = 'tenant-1'): ExecutiveScheduleConfig {
    this.init();
    if (this.schedulesCache.has(tenantId)) {
      return this.schedulesCache.get(tenantId)!;
    }

    const defaultSchedule: ExecutiveScheduleConfig = {
      id: `SCHED-${tenantId}`,
      tenantId,
      frequency: 'monthly',
      dayOfMonth: 1,
      timeOfDay: '07:00',
      timezone: 'Asia/Jakarta (WIB)',
      recipientsEmail: ['director@translogistik.co.id', 'cfo@translogistik.co.id', 'ops.director@translogistik.co.id'],
      recipientsWhatsApp: ['+6281234567890', '+6281987654321'],
      rolesTargeted: ['director_owner', 'finance'],
      autoGeneratePdf: true,
      autoSendEmail: true,
      autoSendWhatsApp: true,
      isActive: true,
      nextRunAt: '2026-09-01T07:00:00+07:00',
    };

    this.schedulesCache.set(tenantId, defaultSchedule);
    this.persist();
    return defaultSchedule;
  }

  public static saveSchedule(schedule: ExecutiveScheduleConfig): void {
    this.init();
    this.schedulesCache.set(schedule.tenantId, schedule);
    this.persist();
  }

  public static createShareToken(reportId: string, recipientEmail: string): SharedReportToken {
    const token: SharedReportToken = {
      id: `SHARE-${Date.now().toString(36)}`,
      reportId,
      token: `sec_${Math.random().toString(36).substring(2, 12)}_${Date.now().toString(36)}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      recipientEmail,
      allowedRolePerspective: 'director_owner',
      hasPassword: false,
      accessLog: [],
    };
    return token;
  }
}
