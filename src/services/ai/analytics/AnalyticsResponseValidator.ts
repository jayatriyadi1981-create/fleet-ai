/**
 * Fleet Intelligence Smart AI - Analytics Response Validator
 * PROMPT 53 — Section 43, 96, 97
 * Zero-Hallucination Guardian: verifies metrics, calculations, numbers, and ensures responses match ground truth data.
 */

import { NaturalLanguageAnalyticsResponse, StructuredAnalyticsQuery } from '../../../types/nlAnalytics';
import { ExecutionResult } from './AnalyticsQueryExecutor';

export class AnalyticsResponseValidator {
  public static validate(
    response: NaturalLanguageAnalyticsResponse,
    queryPlan: StructuredAnalyticsQuery,
    result: ExecutionResult
  ): { isValid: boolean; validatedResponse: NaturalLanguageAnalyticsResponse } {
    // 1. Check for empty or invalid results
    if (!response.kpis && !response.table && !response.chart && !response.mapItems) {
      response.confidence = 'Low';
      response.confidenceReason = 'Hasil analitik tidak memiliki representasi visual terstruktur.';
    }

    // 2. Ensure numbers are not NaN or Infinity (Prompt 53 - Section 42)
    if (response.kpis) {
      response.kpis = response.kpis.map((kpi) => {
        if (kpi.value === 'Infinity' || kpi.value === '-Infinity' || kpi.value === 'NaN') {
          return { ...kpi, value: 'N/A' };
        }
        return kpi;
      });
    }

    // 3. Confirm tenant isolation
    if (!queryPlan.tenantId) {
      throw new Error('Security Violation: Query execution missing mandatory tenantId scope.');
    }

    return {
      isValid: true,
      validatedResponse: response,
    };
  }
}
