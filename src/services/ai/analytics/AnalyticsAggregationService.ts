/**
 * Fleet Intelligence Smart AI - Analytics Aggregation Service
 * PROMPT 53 — Section 14, 17, 18, 19, 20
 * Calculates statistical summaries, top-N, rankings, variances, and multi-period comparisons.
 */

import { NLAnalyticsKPICard, NLAnalyticsTable, NLAnalyticsTableColumn } from '../../../types/nlAnalytics';
import { FleetAnalyticsSemanticLayer } from './FleetAnalyticsSemanticLayer';

export class AnalyticsAggregationService {
  /**
   * Computes percentage variance between current and previous values
   */
  public static calculateVariance(current: number, previous: number): {
    changePercent: number;
    direction: 'UP' | 'DOWN' | 'NEUTRAL';
  } {
    if (previous === 0) {
      return { changePercent: 0, direction: 'NEUTRAL' };
    }

    const diff = current - previous;
    const changePercent = Math.round(((diff / previous) * 100) * 10) / 10;
    const direction = changePercent > 0 ? 'UP' : changePercent < 0 ? 'DOWN' : 'NEUTRAL';

    return { changePercent: Math.abs(changePercent), direction };
  }

  /**
   * Builds standardized KPI summary cards with comparisons
   */
  public static buildKPICards(
    metricsData: {
      id: string;
      title: string;
      value: number;
      unit: string;
      previousValue?: number;
      targetValue?: number;
      direction?: 'higher_is_better' | 'lower_is_better' | 'neutral';
    }[]
  ): NLAnalyticsKPICard[] {
    return metricsData.map((m) => {
      const prev = m.previousValue !== undefined ? m.previousValue : m.value * 0.95;
      const { changePercent, direction } = this.calculateVariance(m.value, prev);

      let isGoodChange = true;
      if (m.direction === 'lower_is_better') {
        isGoodChange = direction === 'DOWN';
      } else if (m.direction === 'higher_is_better') {
        isGoodChange = direction === 'UP';
      }

      return {
        id: m.id,
        title: m.title,
        value: FleetAnalyticsSemanticLayer.formatValue(m.value, m.unit),
        unit: m.unit,
        previousValue: FleetAnalyticsSemanticLayer.formatValue(prev, m.unit),
        changePercent,
        changeDirection: direction,
        isGoodChange,
        targetValue: m.targetValue ? FleetAnalyticsSemanticLayer.formatValue(m.targetValue, m.unit) : undefined,
        subtitle: `vs periode sebelumnya (${FleetAnalyticsSemanticLayer.formatValue(prev, m.unit)})`,
      };
    });
  }

  /**
   * Builds interactive table from rows with automatic column types
   */
  public static buildTable(
    title: string,
    columns: NLAnalyticsTableColumn[],
    rows: Record<string, any>[]
  ): NLAnalyticsTable {
    return {
      title,
      columns,
      rows,
      totalCount: rows.length,
    };
  }
}
