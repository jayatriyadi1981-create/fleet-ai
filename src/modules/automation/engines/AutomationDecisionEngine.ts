/**
 * Fleet Intelligence Smart AI - Automation Decision Engine & Human-In-The-Loop
 * PROMPT 35 - Section 19, 20, 39
 */

import { DecisionBranch, AutomationNode } from '../types';
import { AIAnalysisOutput } from './AutomationAIAnalysisEngine';

export interface DecisionResolution {
  selectedBranchId: string;
  selectedBranchLabel: string;
  targetNodeId?: string;
  explanation: string;
  requiresHumanApproval: boolean;
  approvalRole?: string;
  decisionData: Record<string, any>;
}

export class AutomationDecisionEngine {
  private static instance: AutomationDecisionEngine;

  private constructor() {}

  public static getInstance(): AutomationDecisionEngine {
    if (!AutomationDecisionEngine.instance) {
      AutomationDecisionEngine.instance = new AutomationDecisionEngine();
    }
    return AutomationDecisionEngine.instance;
  }

  /**
   * Resolves decision branch based on previous node outputs (AI Risk, Condition result, or Threshold)
   */
  public resolveDecision(
    node: AutomationNode,
    context: {
      aiResult?: AIAnalysisOutput;
      conditionResult?: { passed: boolean; summary: string };
      eventPayload?: Record<string, any>;
    }
  ): DecisionResolution {
    const branches: DecisionBranch[] = node.config.decisionBranches || [
      { id: 'branch_yes', label: 'YES / CRITICAL / HIGH', conditionType: 'AI_RISK', targetValue: 'HIGH' },
      { id: 'branch_no', label: 'NO / LOW / SAFE', conditionType: 'AI_RISK', targetValue: 'LOW' },
    ];

    // 1. Check AI Risk Branches if AI Result exists
    if (context.aiResult) {
      const risk = context.aiResult.risk;
      const matchedBranch = branches.find((b) => {
        if (b.conditionType === 'AI_RISK') {
          if (b.targetValue === 'CRITICAL' && risk === 'CRITICAL') return true;
          if (b.targetValue === 'HIGH' && (risk === 'HIGH' || risk === 'CRITICAL')) return true;
          if (b.targetValue === 'MEDIUM' && risk === 'MEDIUM') return true;
          if (b.targetValue === 'LOW' && risk === 'LOW') return true;
          if (b.targetValue === 'YES' && (risk === 'HIGH' || risk === 'CRITICAL')) return true;
          if (b.targetValue === 'NO' && (risk === 'LOW' || risk === 'MEDIUM')) return true;
        }
        return false;
      });

      if (matchedBranch) {
        const isCriticalAction = risk === 'CRITICAL';
        return {
          selectedBranchId: matchedBranch.id,
          selectedBranchLabel: matchedBranch.label,
          targetNodeId: matchedBranch.nextNodeId,
          explanation: `Keputusan dialirkan ke cabang [${matchedBranch.label}] karena AI Intelligence mendeteksi level risiko ${risk} (Tingkat Keyakinan ${(context.aiResult.confidence * 100).toFixed(0)}%).`,
          requiresHumanApproval: isCriticalAction,
          approvalRole: isCriticalAction ? 'fleet_manager' : undefined,
          decisionData: {
            riskEvaluated: risk,
            confidence: context.aiResult.confidence,
            aiReason: context.aiResult.reason,
          },
        };
      }
    }

    // 2. Check Condition Boolean Branches if Condition Result exists
    if (context.conditionResult) {
      const passed = context.conditionResult.passed;
      const matchedBranch = branches.find((b) => {
        const valStr = String(b.targetValue).toUpperCase();
        if (valStr === 'YES' || valStr === 'TRUE') return passed;
        if (valStr === 'NO' || valStr === 'FALSE') return !passed;
        return false;
      }) || branches[passed ? 0 : Math.min(1, branches.length - 1)];

      return {
        selectedBranchId: matchedBranch.id,
        selectedBranchLabel: matchedBranch.label,
        targetNodeId: matchedBranch.nextNodeId,
        explanation: `Keputusan dialirkan ke [${matchedBranch.label}] berdasarkan evaluasi aturan kondisi: ${context.conditionResult.summary}`,
        requiresHumanApproval: false,
        decisionData: {
          conditionPassed: passed,
          summary: context.conditionResult.summary,
        },
      };
    }

    // 3. Fallback to first branch
    const defaultBranch = branches[0];
    return {
      selectedBranchId: defaultBranch.id,
      selectedBranchLabel: defaultBranch.label,
      targetNodeId: defaultBranch.nextNodeId,
      explanation: `Dialirkan ke cabang default [${defaultBranch.label}].`,
      requiresHumanApproval: false,
      decisionData: {},
    };
  }

  /**
   * Identifies if a proposed action requires human-in-the-loop review
   */
  public isCriticalActionRequiringApproval(actionType: string, params: Record<string, any>): boolean {
    const criticalActions = [
      'SUSPEND_DRIVER',
      'TERMINATE_TRIP',
      'GROUND_VEHICLE',
      'HIGH_COST_WORK_ORDER',
      'DISCIPLINARY_ACTION',
    ];

    if (criticalActions.includes(actionType)) return true;
    if (actionType === 'CREATE_MAINTENANCE_WORK_ORDER' && Number(params.estimatedCostIdr || 0) > 5000000) {
      return true;
    }
    return false;
  }
}

export const automationDecisionEngine = AutomationDecisionEngine.getInstance();
