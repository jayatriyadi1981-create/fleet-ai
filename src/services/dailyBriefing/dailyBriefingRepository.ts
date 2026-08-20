/**
 * Fleet Intelligence Smart AI - Daily Briefing Repository & Cache (PROMPT 51)
 * Local cache, historical store, and mutation management
 */

import { FleetDailyBriefing, DailyBriefingScheduleConfig, DailyBriefingHistoryFilter, BriefingStatus } from '../../types/dailyBriefing';
import { AIDailyBriefingService } from './aiDailyBriefingService';

const STORAGE_KEY = 'fleet_daily_briefings_store_v1';
const CONFIG_KEY = 'fleet_daily_briefing_config_v1';

export class DailyBriefingRepository {
  private static cachedBriefings: FleetDailyBriefing[] = [];
  private static isInitialized = false;

  /**
   * Initialize and seed initial briefings if storage is empty
   */
  public static async init(tenantId: string = 'tenant-1'): Promise<void> {
    if (this.isInitialized && this.cachedBriefings.length > 0) return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.cachedBriefings = JSON.parse(stored);
        this.isInitialized = true;
        return;
      }
    } catch {
      // ignore storage parsing error
    }

    // Seed historical briefings for the past 5 days
    const seeded: FleetDailyBriefing[] = [];
    const today = new Date();

    for (let i = 1; i <= 5; i++) {
      const d = new Date(today.getTime() - i * 86400000);
      const dateStr = d.toISOString().split('T')[0];
      const briefing = await AIDailyBriefingService.generateBriefing(tenantId, dateStr, {
        generatedBy: 'AI_SCHEDULER_0600',
        version: 1,
      });
      seeded.push(briefing);
    }

    // Also generate today's briefing (today so far)
    const todayStr = today.toISOString().split('T')[0];
    const todayBriefing = await AIDailyBriefingService.generateBriefing(tenantId, todayStr, {
      generatedBy: 'SYSTEM_LIVE_SNAPSHOT',
      version: 1,
    });
    todayBriefing.status = 'COMPLETED';
    seeded.unshift(todayBriefing);

    this.cachedBriefings = seeded;
    this.saveToStorage();
    this.isInitialized = true;
  }

  /**
   * Get the latest briefing for a tenant
   */
  public static async getLatestBriefing(tenantId: string = 'tenant-1'): Promise<FleetDailyBriefing> {
    await this.init(tenantId);
    const tenantBriefings = this.cachedBriefings.filter(b => b.tenantId === tenantId);
    if (tenantBriefings.length > 0) {
      return tenantBriefings[0];
    }
    // Fallback: generate on the fly
    const fresh = await AIDailyBriefingService.generateBriefing(tenantId);
    this.cachedBriefings.unshift(fresh);
    this.saveToStorage();
    return fresh;
  }

  /**
   * Get briefing by ID or Date
   */
  public static async getBriefingByDate(dateStr: string, tenantId: string = 'tenant-1'): Promise<FleetDailyBriefing | null> {
    await this.init(tenantId);
    const found = this.cachedBriefings.find(b => b.tenantId === tenantId && b.reportDate === dateStr);
    if (found) return found;

    // Generate if not present
    const fresh = await AIDailyBriefingService.generateBriefing(tenantId, dateStr);
    this.cachedBriefings.push(fresh);
    this.cachedBriefings.sort((a, b) => b.reportDate.localeCompare(a.reportDate));
    this.saveToStorage();
    return fresh;
  }

  /**
   * Get filtered history
   */
  public static async getHistory(
    tenantId: string = 'tenant-1',
    filter?: DailyBriefingHistoryFilter
  ): Promise<FleetDailyBriefing[]> {
    await this.init(tenantId);
    let results = this.cachedBriefings.filter(b => b.tenantId === tenantId);

    if (filter) {
      if (filter.startDate) {
        results = results.filter(b => b.reportDate >= filter.startDate!);
      }
      if (filter.endDate) {
        results = results.filter(b => b.reportDate <= filter.endDate!);
      }
      if (filter.status) {
        results = results.filter(b => b.status === filter.status);
      }
      if (filter.minHealthScore !== undefined) {
        results = results.filter(b => b.fleetHealth.overallScore >= filter.minHealthScore!);
      }
      if (filter.maxRiskScore !== undefined) {
        results = results.filter(b => b.fleetRisk.riskScore <= filter.maxRiskScore!);
      }
      if (filter.searchQuery) {
        const q = filter.searchQuery.toLowerCase();
        results = results.filter(b => 
          b.reportDate.includes(q) ||
          b.executiveSummary.toLowerCase().includes(q) ||
          b.problems.some(p => p.title.toLowerCase().includes(q))
        );
      }
    }

    return results;
  }

  /**
   * Regenerate a briefing with version increment
   */
  public static async regenerateBriefing(
    briefingId: string,
    tenantId: string = 'tenant-1'
  ): Promise<FleetDailyBriefing> {
    await this.init(tenantId);
    const existingIndex = this.cachedBriefings.findIndex(b => b.id === briefingId);
    const dateStr = existingIndex >= 0 ? this.cachedBriefings[existingIndex].reportDate : new Date().toISOString().split('T')[0];
    const nextVersion = existingIndex >= 0 ? (this.cachedBriefings[existingIndex].version || 1) + 1 : 2;

    const regenerated = await AIDailyBriefingService.generateBriefing(tenantId, dateStr, {
      generatedBy: 'USER_REGENERATED',
      version: nextVersion,
      forceRegenerate: true,
    });
    regenerated.status = 'REGENERATED';

    if (existingIndex >= 0) {
      this.cachedBriefings[existingIndex] = regenerated;
    } else {
      this.cachedBriefings.unshift(regenerated);
    }

    this.saveToStorage();
    return regenerated;
  }

  /**
   * Update recommendation action status
   */
  public static updateRecommendationStatus(
    briefingId: string,
    recId: string,
    newStatus: 'pending' | 'task_created' | 'scheduled' | 'dismissed' | 'approved',
    taskRef?: string
  ): void {
    const briefing = this.cachedBriefings.find(b => b.id === briefingId);
    if (!briefing) return;

    const rec = briefing.recommendations.find(r => r.id === recId);
    if (rec) {
      rec.actionStatus = newStatus;
      if (taskRef) rec.taskReferenceId = taskRef;
      if (newStatus === 'approved') {
        rec.isApproved = true;
        rec.approvedAt = new Date().toISOString();
        rec.approvedBy = 'Fleet Manager (Current User)';
      }
      this.saveToStorage();
    }
  }

  /**
   * Update problem status
   */
  public static updateProblemStatus(
    briefingId: string,
    problemId: string,
    newStatus: 'detected' | 'in_progress' | 'mitigated' | 'dismissed'
  ): void {
    const briefing = this.cachedBriefings.find(b => b.id === briefingId);
    if (!briefing) return;

    const problem = briefing.problems.find(p => p.id === problemId);
    if (problem) {
      problem.status = newStatus;
      this.saveToStorage();
    }
  }

  /**
   * Schedule Configuration getter & updater
   */
  public static getScheduleConfig(tenantId: string = 'tenant-1'): DailyBriefingScheduleConfig {
    try {
      const stored = localStorage.getItem(CONFIG_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }

    return {
      tenantId,
      isEnabled: true,
      scheduledTime: '06:00',
      timezone: 'Asia/Jakarta',
      preferredLanguage: 'id',
      autoCreateTasksForCritical: true,
      channels: {
        inApp: true,
        email: true,
        whatsapp: true,
        push: true,
      },
      emailRecipients: ['fleet.manager@nusantaratrans.co.id', 'ops.lead@nusantaratrans.co.id'],
      whatsappRecipients: ['+6281298765432', '+6281311223344'],
      rolesWithAccess: ['FLEET_MANAGER', 'OPERATIONS_MANAGER', 'EXECUTIVE', 'SAFETY_OFFICER', 'MAINTENANCE_SUPERVISOR'],
      lastRunAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      nextRunAt: new Date(Date.now() + 3600000 * 21).toISOString(),
    };
  }

  public static saveScheduleConfig(config: DailyBriefingScheduleConfig): void {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  }

  private static saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cachedBriefings));
    } catch {
      // ignore localstorage overflow
    }
  }
}
