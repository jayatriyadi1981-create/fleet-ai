/**
 * Fleet Intelligence Smart AI - Automation Execution Orchestrator
 * PROMPT 35 - Section 2, 51, 52, 53, 54, 55, 65, 85
 */

import {
  AutomationWorkflow,
  AutomationEvent,
  AutomationExecution,
  AutomationExecutionStep,
  AutomationNode,
  ExecutionStatus,
} from '../types';
import { automationConditionEngine } from './AutomationConditionEngine';
import { automationAIAnalysisEngine, AIAnalysisOutput } from './AutomationAIAnalysisEngine';
import { automationDecisionEngine } from './AutomationDecisionEngine';
import { automationActionEngine } from './AutomationActionEngine';
import { automationNotificationEngine } from './AutomationNotificationEngine';
import { automationReportEngine } from './AutomationReportEngine';
import { automationEventEngine } from './AutomationEventEngine';

export class AutomationExecutionOrchestrator {
  private static instance: AutomationExecutionOrchestrator;
  private executionHistory: AutomationExecution[] = [];

  private constructor() {}

  public static getInstance(): AutomationExecutionOrchestrator {
    if (!AutomationExecutionOrchestrator.instance) {
      AutomationExecutionOrchestrator.instance = new AutomationExecutionOrchestrator();
    }
    return AutomationExecutionOrchestrator.instance;
  }

  /**
   * Executes a workflow DAG in production or dry-run simulation mode
   */
  public async executeWorkflow(
    workflow: AutomationWorkflow,
    event: AutomationEvent,
    options: { dryRun?: boolean; triggeredBy?: string } = {}
  ): Promise<AutomationExecution> {
    const startTime = Date.now();
    const executionId = `EXEC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    const correlationId = event.correlationId || automationEventEngine.generateCorrelationId();
    const dryRun = Boolean(options.dryRun);

    const steps: AutomationExecutionStep[] = [];
    let overallStatus: ExecutionStatus = 'RUNNING';
    let totalTokens = 0;
    let totalCostIdr = 0;
    let executionError: string | undefined = undefined;

    // Execution Context Store across nodes
    const contextStore: Record<string, any> = {
      ...event.payload,
      eventId: event.eventId,
      eventType: event.eventType,
      entityId: event.entityId,
      entityName: event.entityName,
      tenantId: workflow.tenantId,
      branchId: event.branchId,
      dryRun,
    };

    try {
      // Find start node (EVENT node or first node)
      const startNode = workflow.nodes.find((n) => n.type === 'EVENT') || workflow.nodes[0];
      if (!startNode) {
        throw new Error('Workflow tidak memiliki node awal yang valid');
      }

      let currentNode: AutomationNode | undefined = startNode;
      let iterations = 0;
      const MAX_ITERATIONS = 40; // Safety guard against infinite loops

      let lastAIResult: AIAnalysisOutput | undefined = undefined;
      let lastConditionResult: { passed: boolean; summary: string } | undefined = undefined;

      while (currentNode && iterations < MAX_ITERATIONS) {
        iterations++;
        const stepStartTime = Date.now();
        const stepId = `STEP-${iterations}-${Date.now().toString(36).toUpperCase()}`;
        const node: AutomationNode = currentNode;

        let stepStatus: 'SUCCESS' | 'FAILED' | 'SKIPPED' = 'SUCCESS';
        let stepError: string | undefined = undefined;
        let stepOutput: any = {};
        let aiResultData: AutomationExecutionStep['aiResult'] = undefined;

        try {
          switch (node.type) {
            case 'EVENT': {
              stepOutput = {
                eventType: event.eventType,
                source: event.source,
                entityId: event.entityId,
                severity: event.severity,
                payloadSummary: `${Object.keys(event.payload).length} parameter telematika diterima`,
              };
              break;
            }

            case 'CONDITION': {
              if (node.config.conditionGroup) {
                const evalResult = automationConditionEngine.evaluateGroup(
                  node.config.conditionGroup,
                  contextStore
                );
                lastConditionResult = {
                  passed: evalResult.passed,
                  summary: evalResult.summary,
                };
                stepOutput = evalResult;

                if (!evalResult.passed) {
                  // If condition failed and no explicit branching, mark skipped downstream
                  stepStatus = 'SUCCESS';
                }
              }
              break;
            }

            case 'AI_ANALYSIS': {
              if (node.config.aiConfig) {
                const aiAnalysis = await automationAIAnalysisEngine.analyze(
                  node.config.aiConfig,
                  event,
                  contextStore
                );
                lastAIResult = aiAnalysis;
                totalTokens += aiAnalysis.tokensUsed;
                totalCostIdr += aiAnalysis.estimatedCostIdr;

                aiResultData = {
                  risk: aiAnalysis.risk,
                  confidence: aiAnalysis.confidence,
                  reason: aiAnalysis.reason,
                  recommendations: aiAnalysis.recommendations,
                  evidence: aiAnalysis.evidence,
                  tokensUsed: aiAnalysis.tokensUsed,
                };

                contextStore.aiRisk = aiAnalysis.risk;
                contextStore.aiConfidence = aiAnalysis.confidence;
                contextStore.aiReason = aiAnalysis.reason;
                stepOutput = aiAnalysis;
              }
              break;
            }

            case 'DECISION': {
              const decision = automationDecisionEngine.resolveDecision(node, {
                aiResult: lastAIResult,
                conditionResult: lastConditionResult,
                eventPayload: contextStore,
              });
              stepOutput = decision;
              break;
            }

            case 'ACTION': {
              if (node.config.actionConfig) {
                const actionRes = await automationActionEngine.executeAction(
                  node.config.actionConfig,
                  event,
                  contextStore,
                  dryRun
                );
                stepOutput = actionRes;
                if (!actionRes.success) {
                  stepStatus = 'FAILED';
                }
              }
              break;
            }

            case 'NOTIFICATION': {
              if (node.config.notificationConfig) {
                const notifRes = await automationNotificationEngine.dispatch(
                  node.config.notificationConfig,
                  event,
                  contextStore,
                  dryRun
                );
                stepOutput = notifRes;
              }
              break;
            }

            case 'REPORT': {
              if (node.config.reportConfig) {
                const reportRes = await automationReportEngine.generateReport(
                  node.config.reportConfig,
                  event,
                  contextStore,
                  dryRun
                );
                stepOutput = reportRes;
              }
              break;
            }

            case 'DELAY': {
              stepOutput = {
                durationMinutes: node.config.delayConfig?.durationMinutes || 5,
                status: dryRun ? 'SIMULATED_ELAPSED' : 'STAGED_IN_QUEUE',
              };
              break;
            }

            case 'END': {
              stepOutput = { outcome: 'Workflow Execution Completed Gracefully' };
              break;
            }

            default:
              stepOutput = { note: `Node ${node.type} executed` };
          }
        } catch (nodeErr: any) {
          stepStatus = 'FAILED';
          stepError = nodeErr?.message || 'Gagal mengeksekusi node';
          executionError = stepError;
        }

        const stepDuration = Date.now() - stepStartTime;
        steps.push({
          id: stepId,
          executionId,
          nodeId: node.id,
          nodeType: node.type,
          nodeLabel: node.label,
          status: stepStatus,
          inputData: { ...contextStore },
          outputData: stepOutput,
          startedAt: new Date(stepStartTime).toISOString(),
          completedAt: new Date().toISOString(),
          durationMs: stepDuration,
          error: stepError,
          aiResult: aiResultData,
        });

        // Determine Next Node from DAG Edges
        const outgoingEdges = workflow.edges.filter((e) => e.sourceNodeId === node.id);

        if (outgoingEdges.length === 0 || node.type === 'END') {
          currentNode = undefined;
        } else if (outgoingEdges.length === 1) {
          const nextTargetId = outgoingEdges[0].targetNodeId;
          currentNode = workflow.nodes.find((n) => n.id === nextTargetId);
        } else {
          // Multi-branch selection (e.g. from Decision Node)
          if (node.type === 'DECISION' && stepOutput?.selectedBranchId) {
            // Find edge matching branch label or id
            const matchedEdge =
              outgoingEdges.find(
                (e) =>
                  e.sourceHandle?.toLowerCase() === stepOutput.selectedBranchId?.toLowerCase() ||
                  e.label?.toLowerCase() === stepOutput.selectedBranchLabel?.toLowerCase()
              ) || outgoingEdges[0];
            currentNode = workflow.nodes.find((n) => n.id === matchedEdge.targetNodeId);
          } else {
            currentNode = workflow.nodes.find((n) => n.id === outgoingEdges[0].targetNodeId);
          }
        }

        // If a step failed and not in tolerant mode, break
        if (stepStatus === 'FAILED') {
          overallStatus = 'FAILED';
          break;
        }
      }

      if (overallStatus !== 'FAILED') {
        overallStatus = steps.some((s) => s.status === 'FAILED') ? 'PARTIAL' : 'SUCCESS';
      }
    } catch (err: any) {
      overallStatus = 'FAILED';
      executionError = err?.message || 'Workflow runtime crash';
    }

    const totalDuration = Date.now() - startTime;

    const execution: AutomationExecution = {
      id: executionId,
      automationId: workflow.id,
      automationName: workflow.name,
      automationVersion: workflow.version,
      eventId: event.eventId,
      eventType: event.eventType,
      correlationId,
      tenantId: workflow.tenantId,
      entityType: event.entityType,
      entityId: event.entityId,
      entityLabel: event.entityName || event.entityId,
      branchId: event.branchId,
      status: overallStatus,
      startedAt: new Date(startTime).toISOString(),
      completedAt: new Date().toISOString(),
      durationMs: totalDuration,
      error: executionError,
      steps,
      aiTokensUsed: totalTokens,
      estimatedCostIdr: totalCostIdr,
      dryRun,
      triggeredBy: options.triggeredBy || (dryRun ? 'SIMULATION' : 'EVENT_BUS'),
      priority: workflow.priority,
    };

    // Record into in-memory execution store
    this.executionHistory.unshift(execution);
    if (this.executionHistory.length > 500) {
      this.executionHistory.pop();
    }

    // Update workflow metrics in-place
    workflow.metrics.totalExecutions += 1;
    if (overallStatus === 'SUCCESS') workflow.metrics.successCount += 1;
    if (overallStatus === 'FAILED') workflow.metrics.failureCount += 1;
    if (overallStatus === 'PARTIAL') workflow.metrics.partialCount += 1;
    workflow.metrics.lastExecutedAt = new Date().toISOString();
    workflow.metrics.aiTokensTotal += totalTokens;
    workflow.metrics.estimatedCostIdr += totalCostIdr;
    workflow.metrics.avgDurationMs = Math.round(
      (workflow.metrics.avgDurationMs * (workflow.metrics.totalExecutions - 1) + totalDuration) /
        workflow.metrics.totalExecutions
    );

    return execution;
  }

  public getExecutions(filter?: {
    automationId?: string;
    status?: ExecutionStatus;
    limit?: number;
  }): AutomationExecution[] {
    let result = [...this.executionHistory];
    if (filter?.automationId) {
      result = result.filter((e) => e.automationId === filter.automationId);
    }
    if (filter?.status) {
      result = result.filter((e) => e.status === filter.status);
    }
    return result.slice(0, filter?.limit || 100);
  }

  public getExecutionById(executionId: string): AutomationExecution | undefined {
    return this.executionHistory.find((e) => e.id === executionId);
  }
}

export const automationExecutionOrchestrator = AutomationExecutionOrchestrator.getInstance();
