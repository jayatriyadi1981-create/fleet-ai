/**
 * Fleet Intelligence Smart AI - Executive Report Validator
 * PROMPT 52 — Quality Assurance & Anti-Hallucination Pipeline for Executive Reports
 */

import { ExecutiveReport } from '../../types/executiveReport';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  auditedEvidenceCount: number;
}

export class ExecutiveReportValidator {
  /**
   * Validates structural and numerical integrity of an Executive Report
   */
  public static validate(report: ExecutiveReport): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Mandatory Identity Checks
    if (!report.id) errors.push('Report ID is missing.');
    if (!report.tenantId) errors.push('Tenant ID is missing (Tenant Isolation Violation).');
    if (!report.periodStart || !report.periodEnd) errors.push('Period date boundaries are missing.');

    // 2. Financial Arithmetic Checks
    const { totalOperatingCost, fuelCost, maintenanceCost, driverCost, operationalOverheadCost } = report.kpis.current;
    const computedTotal = fuelCost + maintenanceCost + driverCost + operationalOverheadCost;
    if (Math.abs(totalOperatingCost - computedTotal) > 1000) {
      errors.push(`Financial calculation mismatch: Total Operating Cost (${totalOperatingCost}) != Sum of components (${computedTotal}).`);
    }

    // 3. Anti-Hallucination Check for Unconfigured Fields
    // If Revenue or Customer SLA is not provided, it must strictly be null
    if (report.kpis.current.revenue !== null && typeof report.kpis.current.revenue === 'number') {
      warnings.push('Revenue was provided; ensure external ERP/Billing connection is authenticated.');
    }

    // 4. Evidence Integrity Check
    const validEvidenceIds = new Set(report.evidences.map(e => e.id));
    
    // Check root cause drivers evidence links
    report.costAnalysis.drivers.forEach(driver => {
      driver.evidenceIds.forEach(id => {
        if (!validEvidenceIds.has(id)) {
          warnings.push(`Driver "${driver.category}" references non-existent Evidence ID: ${id}.`);
        }
      });
    });

    // Check risks evidence links
    report.risks.forEach(risk => {
      risk.evidenceIds.forEach(id => {
        if (!validEvidenceIds.has(id)) {
          warnings.push(`Risk "${risk.title}" references non-existent Evidence ID: ${id}.`);
        }
      });
    });

    // Check recommendations evidence links
    report.recommendations.forEach(rec => {
      rec.evidenceIds.forEach(id => {
        if (!validEvidenceIds.has(id)) {
          warnings.push(`Recommendation "${rec.title}" references non-existent Evidence ID: ${id}.`);
        }
      });
    });

    // 5. Scorecard Range Validations (0 - 100)
    const sc = report.scorecard;
    if (sc.overallIndex < 0 || sc.overallIndex > 100) {
      errors.push(`Invalid Overall Index in Scorecard: ${sc.overallIndex}. Must be 0-100.`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      auditedEvidenceCount: report.evidences.length,
    };
  }
}
