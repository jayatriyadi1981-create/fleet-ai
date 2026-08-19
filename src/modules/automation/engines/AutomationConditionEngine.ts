/**
 * Fleet Intelligence Smart AI - Automation Condition Engine (AST Evaluator)
 * PROMPT 35 - Section 11, 12, 13, 14
 */

import { ConditionGroup, ConditionRule, ConditionOperator } from '../types';

export interface ConditionEvaluationResult {
  passed: boolean;
  ruleResults: Array<{
    ruleId: string;
    field: string;
    operator: ConditionOperator;
    expectedValue: any;
    actualValue: any;
    passed: boolean;
    explanation: string;
  }>;
  summary: string;
}

export class AutomationConditionEngine {
  private static instance: AutomationConditionEngine;

  private constructor() {}

  public static getInstance(): AutomationConditionEngine {
    if (!AutomationConditionEngine.instance) {
      AutomationConditionEngine.instance = new AutomationConditionEngine();
    }
    return AutomationConditionEngine.instance;
  }

  /**
   * Safely retrieves nested value by key path (e.g. 'telemetry.speed' or 'driver.riskScore')
   */
  public extractFieldValue(context: Record<string, any>, path: string): any {
    if (!context || !path) return undefined;

    // Handle direct property
    if (path in context) {
      return context[path];
    }

    // Handle dot notation
    const segments = path.split('.');
    let current: any = context;

    for (const segment of segments) {
      if (current === null || current === undefined) {
        return undefined;
      }
      current = current[segment];
    }

    return current;
  }

  /**
   * Evaluates a single rule with type-safe comparative checks
   */
  public evaluateRule(rule: ConditionRule, context: Record<string, any>): {
    passed: boolean;
    actualValue: any;
    explanation: string;
  } {
    const actual = this.extractFieldValue(context, rule.field);
    const expected = rule.value;
    let passed = false;
    let explanation = '';

    switch (rule.operator) {
      case '=':
        // Loose comparison with string/number normalization
        if (typeof expected === 'number' && typeof actual === 'string') {
          passed = parseFloat(actual) === expected;
        } else if (typeof expected === 'string' && typeof actual === 'number') {
          passed = actual.toString() === expected;
        } else {
          passed = actual === expected;
        }
        explanation = `${rule.field} (${actual}) ${passed ? '==' : '!='} ${expected}`;
        break;

      case '!=':
        passed = actual !== expected;
        explanation = `${rule.field} (${actual}) ${passed ? '!=' : '=='} ${expected}`;
        break;

      case '>':
        passed = Number(actual) > Number(expected);
        explanation = `${rule.field} (${actual}) ${passed ? '>' : '<='} ${expected}`;
        break;

      case '<':
        passed = Number(actual) < Number(expected);
        explanation = `${rule.field} (${actual}) ${passed ? '<' : '>='} ${expected}`;
        break;

      case '>=':
        passed = Number(actual) >= Number(expected);
        explanation = `${rule.field} (${actual}) ${passed ? '>=' : '<'} ${expected}`;
        break;

      case '<=':
        passed = Number(actual) <= Number(expected);
        explanation = `${rule.field} (${actual}) ${passed ? '<=' : '>'} ${expected}`;
        break;

      case 'IN':
        if (Array.isArray(expected)) {
          passed = expected.includes(actual);
        } else if (typeof expected === 'string') {
          const list = expected.split(',').map((s) => s.trim().toLowerCase());
          passed = list.includes(String(actual).toLowerCase());
        }
        explanation = `${rule.field} (${actual}) ${passed ? 'termasuk dalam' : 'tidak termasuk dalam'} [${Array.isArray(expected) ? expected.join(', ') : expected}]`;
        break;

      case 'NOT_IN':
        if (Array.isArray(expected)) {
          passed = !expected.includes(actual);
        } else if (typeof expected === 'string') {
          const list = expected.split(',').map((s) => s.trim().toLowerCase());
          passed = !list.includes(String(actual).toLowerCase());
        }
        explanation = `${rule.field} (${actual}) ${passed ? 'tidak berada di' : 'berada di'} [${expected}]`;
        break;

      case 'CONTAINS':
        if (typeof actual === 'string') {
          passed = actual.toLowerCase().includes(String(expected).toLowerCase());
        } else if (Array.isArray(actual)) {
          passed = actual.includes(expected);
        }
        explanation = `${rule.field} (${actual}) ${passed ? 'mengandung' : 'tidak mengandung'} "${expected}"`;
        break;

      case 'NOT_CONTAINS':
        if (typeof actual === 'string') {
          passed = !actual.toLowerCase().includes(String(expected).toLowerCase());
        } else if (Array.isArray(actual)) {
          passed = !actual.includes(expected);
        }
        explanation = `${rule.field} (${actual}) ${passed ? 'tidak mengandung' : 'mengandung'} "${expected}"`;
        break;

      case 'BETWEEN':
        const numVal = Number(actual);
        const minVal = Number(expected);
        const maxVal = Number(rule.valueSecondary ?? expected);
        passed = !isNaN(numVal) && numVal >= minVal && numVal <= maxVal;
        explanation = `${rule.field} (${actual}) ${passed ? 'berada dalam rentang' : 'di luar rentang'} [${minVal} - ${maxVal}]`;
        break;

      case 'EXISTS':
        passed = actual !== undefined && actual !== null && actual !== '';
        explanation = `${rule.field} ${passed ? 'tersedia' : 'kosong / null'}`;
        break;

      case 'NOT_EXISTS':
        passed = actual === undefined || actual === null || actual === '';
        explanation = `${rule.field} ${passed ? 'tidak ditemukan / null' : 'tersedia'}`;
        break;

      default:
        passed = false;
        explanation = `Operator ${rule.operator} tidak dikenali`;
    }

    return { passed, actualValue: actual, explanation };
  }

  /**
   * Recursively evaluates a structured ConditionGroup tree (AST evaluation)
   */
  public evaluateGroup(group: ConditionGroup, context: Record<string, any>): ConditionEvaluationResult {
    const ruleResults: ConditionEvaluationResult['ruleResults'] = [];
    const conditionPasses: boolean[] = [];

    // 1. Evaluate Direct Conditions in this group
    if (group.conditions && group.conditions.length > 0) {
      for (const rule of group.conditions) {
        const evalResult = this.evaluateRule(rule, context);
        conditionPasses.push(evalResult.passed);
        ruleResults.push({
          ruleId: rule.id,
          field: rule.field,
          operator: rule.operator,
          expectedValue: rule.value,
          actualValue: evalResult.actualValue,
          passed: evalResult.passed,
          explanation: evalResult.explanation,
        });
      }
    }

    // 2. Evaluate Nested Subgroups
    if (group.groups && group.groups.length > 0) {
      for (const subGroup of group.groups) {
        const subResult = this.evaluateGroup(subGroup, context);
        conditionPasses.push(subResult.passed);
        ruleResults.push(...subResult.ruleResults);
      }
    }

    // Default if empty group
    if (conditionPasses.length === 0) {
      return {
        passed: true,
        ruleResults: [],
        summary: 'Tidak ada kondisi (Default Lolos)',
      };
    }

    // 3. Resolve Combinator
    let passed = false;
    if (group.combinator === 'AND') {
      passed = conditionPasses.every((p) => p === true);
    } else if (group.combinator === 'OR') {
      passed = conditionPasses.some((p) => p === true);
    } else if (group.combinator === 'NOT') {
      passed = !conditionPasses.every((p) => p === true);
    }

    const passedCount = ruleResults.filter((r) => r.passed).length;
    const summary = passed
      ? `Kondisi terpenuhi (${passedCount}/${ruleResults.length} aturan lolos dengan logika ${group.combinator})`
      : `Kondisi tidak terpenuhi (${passedCount}/${ruleResults.length} aturan lolos dengan logika ${group.combinator})`;

    return {
      passed,
      ruleResults,
      summary,
    };
  }
}

export const automationConditionEngine = AutomationConditionEngine.getInstance();
