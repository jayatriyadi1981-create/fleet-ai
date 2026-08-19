/**
 * Fleet Intelligence Smart AI - Executive Score Engine
 * Computes composite executive scores from operational, safety, fuel, maintenance, and cost domains
 */

import {
  ExecutiveScoreWeights,
  ExecutiveScoreResult,
  ExecutiveScoreItem,
  ExecutiveStatus,
  TrendDirection,
} from '../types';

export const DEFAULT_EXECUTIVE_WEIGHTS: ExecutiveScoreWeights = {
  efficiency: 20,
  productivity: 20,
  safety: 20,
  fuel: 15,
  maintenance: 15,
  cost: 10,
};

export class ExecutiveScoreEngine {
  /**
   * Calculates the status based on score threshold
   */
  public static getStatusFromScore(score: number): ExecutiveStatus {
    if (score >= 90) return 'EXCELLENT';
    if (score >= 80) return 'GOOD';
    if (score >= 70) return 'ATTENTION';
    if (score >= 60) return 'WARNING';
    return 'CRITICAL';
  }

  /**
   * Determine trend direction from delta
   */
  public static getTrendFromDelta(delta: number): TrendDirection {
    if (delta > 0.5) return 'UP';
    if (delta < -0.5) return 'DOWN';
    return 'STABLE';
  }

  /**
   * Compute comprehensive executive scorecard
   */
  public static computeScorecard(params: {
    efficiencyScore: number;
    prevEfficiencyScore: number;
    productivityScore: number;
    prevProductivityScore: number;
    safetyScore: number;
    prevSafetyScore: number;
    fuelScore: number;
    prevFuelScore: number;
    maintenanceScore: number;
    prevMaintenanceScore: number;
    costEfficiencyScore: number;
    prevCostEfficiencyScore: number;
    weights?: Partial<ExecutiveScoreWeights>;
  }): ExecutiveScoreResult {
    const weights: ExecutiveScoreWeights = {
      ...DEFAULT_EXECUTIVE_WEIGHTS,
      ...(params.weights || {}),
    };

    // Normalize weights to sum up to 100
    const totalWeight =
      weights.efficiency +
      weights.productivity +
      weights.safety +
      weights.fuel +
      weights.maintenance +
      weights.cost;

    const normalizedWeights: ExecutiveScoreWeights = {
      efficiency: (weights.efficiency / (totalWeight || 100)) * 100,
      productivity: (weights.productivity / (totalWeight || 100)) * 100,
      safety: (weights.safety / (totalWeight || 100)) * 100,
      fuel: (weights.fuel / (totalWeight || 100)) * 100,
      maintenance: (weights.maintenance / (totalWeight || 100)) * 100,
      cost: (weights.cost / (totalWeight || 100)) * 100,
    };

    const items: ExecutiveScoreItem[] = [
      {
        key: 'efficiency',
        label: 'Fleet Efficiency & Utilization',
        score: Math.min(100, Math.max(0, Math.round(params.efficiencyScore * 10) / 10)),
        weight: Math.round(normalizedWeights.efficiency),
        weightedScore: (params.efficiencyScore * normalizedWeights.efficiency) / 100,
        status: this.getStatusFromScore(params.efficiencyScore),
        trend: this.getTrendFromDelta(params.efficiencyScore - params.prevEfficiencyScore),
        delta: Math.round((params.efficiencyScore - params.prevEfficiencyScore) * 10) / 10,
        benchmarkScore: 85.0,
      },
      {
        key: 'productivity',
        label: 'Operational Productivity',
        score: Math.min(100, Math.max(0, Math.round(params.productivityScore * 10) / 10)),
        weight: Math.round(normalizedWeights.productivity),
        weightedScore: (params.productivityScore * normalizedWeights.productivity) / 100,
        status: this.getStatusFromScore(params.productivityScore),
        trend: this.getTrendFromDelta(params.productivityScore - params.prevProductivityScore),
        delta: Math.round((params.productivityScore - params.prevProductivityScore) * 10) / 10,
        benchmarkScore: 88.0,
      },
      {
        key: 'safety',
        label: 'Fleet Safety & Compliance',
        score: Math.min(100, Math.max(0, Math.round(params.safetyScore * 10) / 10)),
        weight: Math.round(normalizedWeights.safety),
        weightedScore: (params.safetyScore * normalizedWeights.safety) / 100,
        status: this.getStatusFromScore(params.safetyScore),
        trend: this.getTrendFromDelta(params.safetyScore - params.prevSafetyScore),
        delta: Math.round((params.safetyScore - params.prevSafetyScore) * 10) / 10,
        benchmarkScore: 90.0,
      },
      {
        key: 'fuel',
        label: 'Fuel Economy & Control',
        score: Math.min(100, Math.max(0, Math.round(params.fuelScore * 10) / 10)),
        weight: Math.round(normalizedWeights.fuel),
        weightedScore: (params.fuelScore * normalizedWeights.fuel) / 100,
        status: this.getStatusFromScore(params.fuelScore),
        trend: this.getTrendFromDelta(params.fuelScore - params.prevFuelScore),
        delta: Math.round((params.fuelScore - params.prevFuelScore) * 10) / 10,
        benchmarkScore: 82.0,
      },
      {
        key: 'maintenance',
        label: 'Maintenance & Asset Health',
        score: Math.min(100, Math.max(0, Math.round(params.maintenanceScore * 10) / 10)),
        weight: Math.round(normalizedWeights.maintenance),
        weightedScore: (params.maintenanceScore * normalizedWeights.maintenance) / 100,
        status: this.getStatusFromScore(params.maintenanceScore),
        trend: this.getTrendFromDelta(params.maintenanceScore - params.prevMaintenanceScore),
        delta: Math.round((params.maintenanceScore - params.prevMaintenanceScore) * 10) / 10,
        benchmarkScore: 85.0,
      },
      {
        key: 'cost',
        label: 'Cost Efficiency & Budget TOC',
        score: Math.min(100, Math.max(0, Math.round(params.costEfficiencyScore * 10) / 10)),
        weight: Math.round(normalizedWeights.cost),
        weightedScore: (params.costEfficiencyScore * normalizedWeights.cost) / 100,
        status: this.getStatusFromScore(params.costEfficiencyScore),
        trend: this.getTrendFromDelta(params.costEfficiencyScore - params.prevCostEfficiencyScore),
        delta: Math.round((params.costEfficiencyScore - params.prevCostEfficiencyScore) * 10) / 10,
        benchmarkScore: 80.0,
      },
    ];

    const overallScore = Math.round(items.reduce((sum, item) => sum + item.weightedScore, 0) * 10) / 10;
    
    // Calculate previous overall score
    const prevOverallScore =
      (params.prevEfficiencyScore * normalizedWeights.efficiency +
        params.prevProductivityScore * normalizedWeights.productivity +
        params.prevSafetyScore * normalizedWeights.safety +
        params.prevFuelScore * normalizedWeights.fuel +
        params.prevMaintenanceScore * normalizedWeights.maintenance +
        params.prevCostEfficiencyScore * normalizedWeights.cost) /
      100;

    const overallDelta = Math.round((overallScore - prevOverallScore) * 10) / 10;

    return {
      overallScore,
      status: this.getStatusFromScore(overallScore),
      trend: this.getTrendFromDelta(overallDelta),
      delta: overallDelta,
      items,
      generatedAt: new Date().toISOString(),
      isSufficientData: true,
    };
  }
}
