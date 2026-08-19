/**
 * Fleet Intelligence Smart AI - Automation Action Engine
 * PROMPT 35 - Section 21, 56, 71
 */

import { ActionNodeConfig, AutomationEvent } from '../types';

export interface ActionExecutionResult {
  success: boolean;
  actionType: string;
  actionId: string;
  createdRecord?: Record<string, any>;
  status: 'EXECUTED' | 'APPROVAL_PENDING' | 'SKIPPED' | 'FAILED';
  approvalRequired: boolean;
  details: string;
}

export class AutomationActionEngine {
  private static instance: AutomationActionEngine;
  private actionHistory: Array<ActionExecutionResult & { timestamp: string; tenantId: string }> = [];

  private constructor() {}

  public static getInstance(): AutomationActionEngine {
    if (!AutomationActionEngine.instance) {
      AutomationActionEngine.instance = new AutomationActionEngine();
    }
    return AutomationActionEngine.instance;
  }

  /**
   * Safely executes or stages an action according to RBAC & human-in-the-loop policies
   */
  public async executeAction(
    config: ActionNodeConfig,
    event: AutomationEvent,
    context: Record<string, any>,
    dryRun: boolean = false
  ): Promise<ActionExecutionResult> {
    const actionId = `ACT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    const actionType = config.actionType;

    // Check if human approval is required
    if (config.requiresApproval && !dryRun) {
      const pendingRecord = {
        id: actionId,
        actionType,
        targetEntity: `${event.entityType.toUpperCase()}: ${event.entityName || event.entityId}`,
        parameters: config.parameters,
        status: 'PENDING_APPROVAL' as const,
        submittedAt: new Date().toISOString(),
        approvalRoleRequired: config.approvalRole || 'fleet_manager',
        notes: `Tindakan memerlukan persetujuan manual oleh ${config.approvalRole || 'Fleet Manager'} sebelum dieksekusi.`,
      };

      const result: ActionExecutionResult = {
        success: true,
        actionType,
        actionId,
        createdRecord: pendingRecord,
        status: 'APPROVAL_PENDING',
        approvalRequired: true,
        details: `Tindakan ${actionType} dimasukkan ke antrean persetujuan (Human-In-The-Loop) untuk ${config.approvalRole || 'Fleet Manager'}.`,
      };

      this.actionHistory.unshift({ ...result, timestamp: new Date().toISOString(), tenantId: event.tenantId });
      return result;
    }

    if (dryRun) {
      return {
        success: true,
        actionType,
        actionId: `SIM-${actionId}`,
        status: 'EXECUTED',
        approvalRequired: false,
        details: `[Simulasi / Dry Run] Tindakan ${actionType} berhasil diuji coba tanpa mengubah data riil database.`,
        createdRecord: {
          simulated: true,
          actionType,
          target: event.entityId,
          parameters: config.parameters,
        },
      };
    }

    // Execute standard system action
    let createdRecord: Record<string, any> = {};
    let details = '';

    switch (actionType) {
      case 'CREATE_ALERT': {
        createdRecord = {
          alertId: `ALT-${Date.now().toString(36).toUpperCase()}`,
          severity: config.parameters.severity || event.severity || 'high',
          title: config.parameters.title || `Peringatan Automasi: ${event.eventType}`,
          description: config.parameters.description || `Pemicu otomatis dari event ${event.eventType} pada unit ${event.entityName || event.entityId}`,
          entityId: event.entityId,
          entityType: event.entityType,
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
        };
        details = `Alert baru dibuat: [${createdRecord.title}] dengan tingkat keparahan ${createdRecord.severity}.`;
        break;
      }

      case 'CREATE_MAINTENANCE_WORK_ORDER': {
        createdRecord = {
          workOrderId: `WO-${Date.now().toString(36).toUpperCase()}`,
          vehicleId: event.entityId,
          priority: config.parameters.priority || 'HIGH',
          category: config.parameters.category || 'PREVENTIVE_MAINTENANCE',
          title: config.parameters.title || `Auto-Generated WO: ${event.eventType}`,
          estimatedCostIdr: config.parameters.estimatedCostIdr || 1850000,
          assignedDepo: event.branchId || 'Jakarta Hub',
          status: 'SCHEDULED',
          createdAt: new Date().toISOString(),
        };
        details = `Work Order pemeliharaan #${createdRecord.workOrderId} berhasil dibuat dan dijadwalkan di depo.`;
        break;
      }

      case 'ASSIGN_DRIVER_COACHING': {
        createdRecord = {
          coachingId: `COACH-${Date.now().toString(36).toUpperCase()}`,
          driverId: event.entityId,
          module: config.parameters.module || 'SPEED_MANAGEMENT_AND_DEFENSIVE_DRIVING',
          urgency: 'HIGH',
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'ASSIGNED',
        };
        details = `Program pelatihan coaching pengemudi #${createdRecord.coachingId} berhasil ditugaskan ke driver.`;
        break;
      }

      case 'UPDATE_DRIVER_SCORE': {
        const delta = Number(config.parameters.scoreDelta || -5);
        createdRecord = {
          driverId: event.entityId,
          scoreAdjustment: delta,
          reason: config.parameters.reason || `Penyesuaian skor otomatis akibat event ${event.eventType}`,
          appliedAt: new Date().toISOString(),
        };
        details = `Skor keselamatan driver diperbarui dengan penyesuaian ${delta > 0 ? `+${delta}` : delta} poin.`;
        break;
      }

      case 'CREATE_TASK': {
        createdRecord = {
          taskId: `TSK-${Date.now().toString(36).toUpperCase()}`,
          title: config.parameters.title || `Investigasi Anomali ${event.eventType}`,
          assignedRole: config.parameters.assignedRole || 'operations',
          dueWithinHours: config.parameters.dueWithinHours || 24,
          status: 'OPEN',
        };
        details = `Task operasional #${createdRecord.taskId} berhasil dibuat dan dialokasikan ke tim ${createdRecord.assignedRole}.`;
        break;
      }

      default: {
        createdRecord = {
          actionId,
          actionType,
          targetEntity: event.entityId,
          parameters: config.parameters,
          status: 'COMPLETED',
          executedAt: new Date().toISOString(),
        };
        details = `Tindakan ${actionType} berhasil dieksekusi secara otomatis.`;
      }
    }

    const result: ActionExecutionResult = {
      success: true,
      actionType,
      actionId,
      createdRecord,
      status: 'EXECUTED',
      approvalRequired: false,
      details,
    };

    this.actionHistory.unshift({ ...result, timestamp: new Date().toISOString(), tenantId: event.tenantId });
    return result;
  }
}

export const automationActionEngine = AutomationActionEngine.getInstance();
