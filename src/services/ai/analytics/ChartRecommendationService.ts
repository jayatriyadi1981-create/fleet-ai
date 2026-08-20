/**
 * Fleet Intelligence Smart AI - Chart Recommendation Service
 * PROMPT 53 — Section 24 & 25
 * Automatically selects the optimal visual archetype (Line, Bar, Donut, Horizontal Bar, Map) based on data characteristics.
 */

import { NLAnalyticsChartType, StructuredAnalyticsQuery } from '../../../types/nlAnalytics';

export class ChartRecommendationService {
  public static recommend(query: StructuredAnalyticsQuery, rowCount: number): NLAnalyticsChartType | 'map' | 'none' {
    const intent = query.intent;
    const hasTimeSeries = query.dimensions.includes('month') || query.dimensions.includes('week') || query.dimensions.includes('day') || query.dimensions.includes('date');
    const isOfflineVehiclesQuery = query.entities.statusFilter?.includes('offline') || query.metrics.includes('offline_vehicles');

    // 1. Map Recommendation (Prompt 53 - Section 26)
    if (isOfflineVehiclesQuery || intent === 'GEOFENCE_ANALYSIS' || intent === 'ROUTE_ANALYSIS') {
      return 'map';
    }

    // 2. Time Series -> Line Chart
    if (hasTimeSeries || intent === 'PREDICTIVE_ANALYSIS') {
      return 'line';
    }

    // 3. Composition / Breakdown -> Donut Chart
    if (
      intent === 'COST_ANALYSIS' &&
      query.metrics.length > 2 &&
      !query.entities.topNLimit
    ) {
      return 'donut';
    }

    // 4. Ranking / Top N -> Horizontal Bar
    if (
      query.entities.topNLimit ||
      query.sort ||
      intent === 'VEHICLE_ANALYSIS' ||
      intent === 'DRIVER_ANALYSIS'
    ) {
      return 'horizontal_bar';
    }

    // 5. Category / Branch / Department Comparison -> Bar Chart
    if (
      intent === 'BRANCH_COMPARISON' ||
      query.dimensions.includes('branch') ||
      query.dimensions.includes('department') ||
      intent === 'FLEET_PERFORMANCE'
    ) {
      return 'bar';
    }

    // If small row count or simple scalar
    if (rowCount <= 1) {
      return 'none';
    }

    return 'bar';
  }
}
