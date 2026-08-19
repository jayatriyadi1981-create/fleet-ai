/**
 * Fleet Intelligence Smart AI - Automation Central State & Provider
 * PROMPT 35 - State Management
 */

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  AutomationWorkflow,
  AutomationExecution,
  AutomationTemplate,
  AutomationAuditLog,
  AutomationHealthStats,
  AutomationEvent,
  AutomationStatus,
} from '../types';
import { INITIAL_WORKFLOWS, INITIAL_EXECUTIONS, INITIAL_AUDIT_LOGS } from '../data/mockWorkflows';
import { ENTERPRISE_AUTOMATION_TEMPLATES } from '../data/automationTemplates';
import { automationExecutionOrchestrator } from '../engines/AutomationExecutionOrchestrator';
import { automationEventEngine } from '../engines/AutomationEventEngine';

export interface AutomationSettingsState {
  globalCooldownSeconds: number;
  maxExecutionsPerMinute: number;
  aiTokenMonthlyBudget: number;
  aiTokenUsedThisMonth: number;
  maintenanceMode: boolean;
  dryRunStrictValidation: boolean;
  webhookEndpointUrl: string;
  slackWebhookUrl: string;
  telegramBotToken: string;
}

interface AutomationContextType {
  workflows: AutomationWorkflow[];
  executions: AutomationExecution[];
  templates: AutomationTemplate[];
  auditLogs: AutomationAuditLog[];
  settings: AutomationSettingsState;
  healthStats: AutomationHealthStats;
  selectedWorkflow: AutomationWorkflow | null;
  selectedExecution: AutomationExecution | null;
  activeTab: 'dashboard' | 'workflows' | 'builder' | 'templates' | 'logs' | 'failed' | 'settings';

  // Navigation / Selection
  setActiveTab: (tab: 'dashboard' | 'workflows' | 'builder' | 'templates' | 'logs' | 'failed' | 'settings') => void;
  setSelectedWorkflow: (wf: AutomationWorkflow | null) => void;
  setSelectedExecution: (exec: AutomationExecution | null) => void;

  // Workflow Operations
  createWorkflow: (draft: Partial<AutomationWorkflow>) => AutomationWorkflow;
  updateWorkflow: (id: string, updates: Partial<AutomationWorkflow>) => void;
  deleteWorkflow: (id: string) => void;
  duplicateWorkflow: (id: string) => AutomationWorkflow;
  toggleWorkflowStatus: (id: string, newStatus: AutomationStatus) => void;
  publishWorkflow: (id: string) => void;
  createFromTemplate: (templateId: string) => AutomationWorkflow;

  // Execution & Simulation
  runDryRunSimulation: (
    workflowId: string,
    simulatedEvent: Partial<AutomationEvent>
  ) => Promise<AutomationExecution>;
  retryFailedExecution: (executionId: string) => Promise<AutomationExecution>;
  triggerManualEvent: (event: Partial<AutomationEvent>) => Promise<AutomationExecution | null>;

  // Settings & Audit
  updateSettings: (newSettings: Partial<AutomationSettingsState>) => void;
  recordAuditLog: (action: AutomationAuditLog['action'], workflowId: string, workflowName: string, summary: string) => void;
  exportWorkflowsJson: () => void;
  importWorkflowsJson: (jsonStr: string) => boolean;
}

const AutomationContext = createContext<AutomationContextType | undefined>(undefined);

export const AutomationProvider: React.FC<{
  children: React.ReactNode;
  initialTab?: 'dashboard' | 'workflows' | 'builder' | 'templates' | 'logs' | 'failed' | 'settings';
}> = ({ children, initialTab = 'dashboard' }) => {
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>(() => {
    const saved = localStorage.getItem('fleet_automation_workflows');
    return saved ? JSON.parse(saved) : INITIAL_WORKFLOWS;
  });

  const [executions, setExecutions] = useState<AutomationExecution[]>(() => {
    const saved = localStorage.getItem('fleet_automation_executions');
    return saved ? JSON.parse(saved) : INITIAL_EXECUTIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AutomationAuditLog[]>(() => {
    const saved = localStorage.getItem('fleet_automation_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [templates] = useState<AutomationTemplate[]>(ENTERPRISE_AUTOMATION_TEMPLATES);

  const [settings, setSettings] = useState<AutomationSettingsState>(() => {
    const saved = localStorage.getItem('fleet_automation_settings');
    return saved
      ? JSON.parse(saved)
      : {
          globalCooldownSeconds: 300,
          maxExecutionsPerMinute: 60,
          aiTokenMonthlyBudget: 500000,
          aiTokenUsedThisMonth: 142800,
          maintenanceMode: false,
          dryRunStrictValidation: true,
          webhookEndpointUrl: 'https://api.perusahaan-logistik.co.id/v1/telematics/events',
          slackWebhookUrl: 'https://hooks.slack.com/services/T00/B00/XXXX',
          telegramBotToken: '',
        };
  });

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'workflows' | 'builder' | 'templates' | 'logs' | 'failed' | 'settings'
  >(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const [selectedWorkflow, setSelectedWorkflow] = useState<AutomationWorkflow | null>(null);
  const [selectedExecution, setSelectedExecution] = useState<AutomationExecution | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('fleet_automation_workflows', JSON.stringify(workflows));
  }, [workflows]);

  useEffect(() => {
    localStorage.setItem('fleet_automation_executions', JSON.stringify(executions));
  }, [executions]);

  useEffect(() => {
    localStorage.setItem('fleet_automation_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('fleet_automation_settings', JSON.stringify(settings));
  }, [settings]);

  // Compute Health & Overview Statistics
  const healthStats = useMemo<AutomationHealthStats>(() => {
    const totalActive = workflows.filter((w) => w.status === 'ACTIVE').length;
    const disabledCount = workflows.filter((w) => w.status === 'DISABLED' || w.status === 'PAUSED').length;

    let totalExecToday = 0;
    let totalSuccess = 0;
    let totalFailure = 0;
    let totalDurationMs = 0;
    let totalTokensToday = 0;
    let totalCostToday = 0;

    executions.forEach((e) => {
      totalExecToday++;
      if (e.status === 'SUCCESS') totalSuccess++;
      if (e.status === 'FAILED') totalFailure++;
      totalDurationMs += e.durationMs;
      totalTokensToday += e.aiTokensUsed || 0;
      totalCostToday += e.estimatedCostIdr || 0;
    });

    const successRate = totalExecToday > 0 ? (totalSuccess / totalExecToday) * 100 : 98.4;
    const failureRate = totalExecToday > 0 ? (totalFailure / totalExecToday) * 100 : 1.6;
    const avgDuration = totalExecToday > 0 ? Math.round(totalDurationMs / totalExecToday) : 210;

    const failingCount = executions.filter((e) => e.status === 'FAILED').length;
    const warningCount = executions.filter((e) => e.status === 'PARTIAL').length;
    const healthyCount = Math.max(0, totalActive - (failingCount > 0 ? 1 : 0));

    return {
      healthyCount,
      warningCount,
      failingCount,
      disabledCount,
      totalActive,
      totalExecutionsToday: totalExecToday,
      successRatePercent: Math.round(successRate * 10) / 10,
      failureRatePercent: Math.round(failureRate * 10) / 10,
      avgExecutionTimeMs: avgDuration,
      aiTokensUsedToday: totalTokensToday,
      estimatedAICostTodayIdr: totalCostToday,
    };
  }, [workflows, executions]);

  const recordAuditLog = useCallback(
    (action: AutomationAuditLog['action'], workflowId: string, workflowName: string, summary: string) => {
      const newLog: AutomationAuditLog = {
        id: `AUD-${Date.now().toString(36).toUpperCase()}`,
        timestamp: new Date().toISOString(),
        tenantId: 'TENANT-DEMO-01',
        userId: 'usr_admin_01',
        userName: 'Pratama Wicaksono',
        userRole: 'Super Admin',
        action,
        workflowId,
        workflowName,
        changesSummary: summary,
        ipAddress: '182.253.14.92',
      };
      setAuditLogs((prev) => [newLog, ...prev]);
    },
    []
  );

  const createWorkflow = useCallback(
    (draft: Partial<AutomationWorkflow>): AutomationWorkflow => {
      const newWf: AutomationWorkflow = {
        id: draft.id || `wf_${Date.now().toString(36)}`,
        tenantId: 'TENANT-DEMO-01',
        name: draft.name || 'Workflow Automasi Baru',
        description: draft.description || 'Deskripsi alur automasi cerdas...',
        category: draft.category || 'OPERATIONS',
        triggerType: draft.triggerType || 'EVENT_BASED',
        status: draft.status || 'DRAFT',
        priority: draft.priority || 'NORMAL',
        version: 1,
        branchScope: draft.branchScope || 'ALL',
        nodes: draft.nodes || [],
        edges: draft.edges || [],
        scheduleConfig: draft.scheduleConfig,
        retryPolicy: draft.retryPolicy || {
          maxRetries: 2,
          backoffStrategy: 'EXPONENTIAL',
          retryIntervalSec: 30,
          timeoutSeconds: 45,
        },
        idempotencyWindowSec: draft.idempotencyWindowSec || 300,
        deduplicationEnabled: draft.deduplicationEnabled ?? true,
        rateLimitPerEntityMinute: draft.rateLimitPerEntityMinute || 1,
        tags: draft.tags || ['Custom'],
        metrics: {
          totalExecutions: 0,
          successCount: 0,
          failureCount: 0,
          partialCount: 0,
          skippedCount: 0,
          avgDurationMs: 0,
          aiTokensTotal: 0,
          estimatedCostIdr: 0,
        },
        createdBy: {
          userId: 'usr_admin_01',
          userName: 'Pratama Wicaksono',
          userRole: 'Super Admin',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setWorkflows((prev) => [newWf, ...prev]);
      recordAuditLog('CREATED', newWf.id, newWf.name, 'Membuat workflow baru dari antarmuka visual / NLP');
      return newWf;
    },
    [recordAuditLog]
  );

  const updateWorkflow = useCallback(
    (id: string, updates: Partial<AutomationWorkflow>) => {
      setWorkflows((prev) =>
        prev.map((w) => {
          if (w.id === id) {
            const updated = {
              ...w,
              ...updates,
              version: updates.nodes || updates.edges ? w.version + 1 : w.version,
              updatedAt: new Date().toISOString(),
            };
            return updated;
          }
          return w;
        })
      );
      const target = workflows.find((w) => w.id === id);
      recordAuditLog('EDITED', id, target?.name || id, 'Memperbarui konfigurasi workflow');
    },
    [workflows, recordAuditLog]
  );

  const deleteWorkflow = useCallback(
    (id: string) => {
      const target = workflows.find((w) => w.id === id);
      setWorkflows((prev) => prev.filter((w) => w.id !== id));
      if (target) {
        recordAuditLog('DELETED', id, target.name, 'Menghapus workflow dari sistem');
      }
    },
    [workflows, recordAuditLog]
  );

  const duplicateWorkflow = useCallback(
    (id: string): AutomationWorkflow => {
      const source = workflows.find((w) => w.id === id);
      if (!source) throw new Error('Source workflow not found');

      const cloned = createWorkflow({
        ...source,
        id: `wf_${Date.now().toString(36)}`,
        name: `${source.name} (Salinan)`,
        status: 'DRAFT',
      });
      return cloned;
    },
    [workflows, createWorkflow]
  );

  const toggleWorkflowStatus = useCallback(
    (id: string, newStatus: AutomationStatus) => {
      const target = workflows.find((w) => w.id === id);
      if (!target) return;

      updateWorkflow(id, { status: newStatus });
      const actionName = newStatus === 'ACTIVE' ? 'RESUMED' : newStatus === 'PAUSED' ? 'PAUSED' : 'EDITED';
      recordAuditLog(
        actionName,
        id,
        target.name,
        `Mengubah status workflow menjadi ${newStatus}`
      );
    },
    [workflows, updateWorkflow, recordAuditLog]
  );

  const publishWorkflow = useCallback(
    (id: string) => {
      const target = workflows.find((w) => w.id === id);
      if (!target) return;

      updateWorkflow(id, { status: 'ACTIVE' });
      recordAuditLog('PUBLISHED', id, target.name, 'Mempublikasikan workflow ke status produksi aktif');
    },
    [workflows, updateWorkflow, recordAuditLog]
  );

  const createFromTemplate = useCallback(
    (templateId: string): AutomationWorkflow => {
      const tpl = templates.find((t) => t.id === templateId);
      if (!tpl) throw new Error('Template not found');

      const created = createWorkflow({
        ...tpl.workflowDraft,
        name: tpl.title,
        description: tpl.description,
        category: tpl.category,
        tags: tpl.tags,
        status: 'DRAFT',
      });
      return created;
    },
    [templates, createWorkflow]
  );

  const runDryRunSimulation = useCallback(
    async (workflowId: string, simulatedEvent: Partial<AutomationEvent>): Promise<AutomationExecution> => {
      const wf = workflows.find((w) => w.id === workflowId);
      if (!wf) throw new Error('Workflow not found');

      const stdEvent = automationEventEngine.createStandardizedEvent({
        eventType: simulatedEvent.eventType || (wf.nodes.find((n) => n.type === 'EVENT')?.config.eventType as any) || 'OVERSPEED',
        source: simulatedEvent.source || 'GPS',
        tenantId: 'TENANT-DEMO-01',
        branchId: simulatedEvent.branchId || 'Depo Cakung Barat',
        entityType: simulatedEvent.entityType || 'vehicle',
        entityId: simulatedEvent.entityId || 'B-9872-TKU',
        entityName: simulatedEvent.entityName || 'Truk Hino 500 (B-9872-TKU)',
        severity: simulatedEvent.severity || 'high',
        payload: simulatedEvent.payload || {
          speed: 94,
          speedLimit: 80,
          driverSafetyScore: 68,
          roadType: 'Tol Cipali KM 102',
          healthScore: 64,
          daysOverdue: 9,
          dropPercent: 18,
          continuousHours: 4.8,
          deviationKm: 7.2,
        },
      });

      const execResult = await automationExecutionOrchestrator.executeWorkflow(wf, stdEvent, {
        dryRun: true,
        triggeredBy: 'SIMULATION',
      });

      setExecutions((prev) => [execResult, ...prev]);
      recordAuditLog('TESTED', wf.id, wf.name, `Menjalankan simulasi dry-run test mode (${execResult.status})`);
      return execResult;
    },
    [workflows, recordAuditLog]
  );

  const retryFailedExecution = useCallback(
    async (executionId: string): Promise<AutomationExecution> => {
      const oldExec = executions.find((e) => e.id === executionId);
      if (!oldExec) throw new Error('Execution not found');

      const wf = workflows.find((w) => w.id === oldExec.automationId);
      if (!wf) throw new Error('Target workflow no longer exists');

      const reEvent = automationEventEngine.createStandardizedEvent({
        eventType: oldExec.eventType,
        source: 'System',
        tenantId: oldExec.tenantId,
        branchId: oldExec.branchId,
        entityType: oldExec.entityType as any,
        entityId: oldExec.entityId,
        entityName: oldExec.entityLabel,
        payload: { ...oldExec.steps[0]?.inputData, retryOriginalExecutionId: oldExec.id },
      });

      const newExec = await automationExecutionOrchestrator.executeWorkflow(wf, reEvent, {
        dryRun: false,
        triggeredBy: 'MANUAL_RETRY',
      });

      setExecutions((prev) => [newExec, ...prev]);
      recordAuditLog('RETRIED', wf.id, wf.name, `Menjalankan retry manual untuk execution ID #${executionId}`);
      return newExec;
    },
    [executions, workflows, recordAuditLog]
  );

  const triggerManualEvent = useCallback(
    async (eventPayload: Partial<AutomationEvent>): Promise<AutomationExecution | null> => {
      const eventType = eventPayload.eventType || 'OVERSPEED';
      const matchingWorkflow = workflows.find(
        (w) =>
          w.status === 'ACTIVE' &&
          w.nodes.some((n) => n.type === 'EVENT' && n.config.eventType === eventType)
      );

      if (!matchingWorkflow) {
        return null;
      }

      const event = automationEventEngine.createStandardizedEvent({
        eventType,
        source: eventPayload.source || 'GPS',
        tenantId: 'TENANT-DEMO-01',
        branchId: eventPayload.branchId || 'Depo Jakarta',
        entityType: eventPayload.entityType || 'vehicle',
        entityId: eventPayload.entityId || 'B-9120-XKA',
        entityName: eventPayload.entityName || 'Unit B-9120-XKA',
        severity: eventPayload.severity || 'high',
        payload: eventPayload.payload || {},
      });

      const execResult = await automationExecutionOrchestrator.executeWorkflow(matchingWorkflow, event, {
        dryRun: false,
        triggeredBy: 'MANUAL_TRIGGER',
      });

      setExecutions((prev) => [execResult, ...prev]);
      return execResult;
    },
    [workflows]
  );

  const updateSettings = useCallback((newSettings: Partial<AutomationSettingsState>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const exportWorkflowsJson = useCallback(() => {
    const dataStr = JSON.stringify({ workflows, exportedAt: new Date().toISOString(), version: '2.4.0' }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fleet_automation_workflows_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [workflows]);

  const importWorkflowsJson = useCallback(
    (jsonStr: string): boolean => {
      try {
        const parsed = JSON.parse(jsonStr);
        if (Array.isArray(parsed.workflows)) {
          setWorkflows(parsed.workflows);
          recordAuditLog('SETTINGS_CHANGED', 'SYSTEM', 'All Workflows', 'Mengimpor konfigurasi workflow dari file JSON');
          return true;
        }
        return false;
      } catch (err) {
        console.error('Import workflows JSON failed:', err);
        return false;
      }
    },
    [recordAuditLog]
  );

  return (
    <AutomationContext.Provider
      value={{
        workflows,
        executions,
        templates,
        auditLogs,
        settings,
        healthStats,
        selectedWorkflow,
        selectedExecution,
        activeTab,
        setActiveTab,
        setSelectedWorkflow,
        setSelectedExecution,
        createWorkflow,
        updateWorkflow,
        deleteWorkflow,
        duplicateWorkflow,
        toggleWorkflowStatus,
        publishWorkflow,
        createFromTemplate,
        runDryRunSimulation,
        retryFailedExecution,
        triggerManualEvent,
        updateSettings,
        recordAuditLog,
        exportWorkflowsJson,
        importWorkflowsJson,
      }}
    >
      {children}
    </AutomationContext.Provider>
  );
};

export const useAutomation = () => {
  const context = useContext(AutomationContext);
  if (!context) {
    throw new Error('useAutomation must be used within an AutomationProvider');
  }
  return context;
};
