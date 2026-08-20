/**
 * Fleet Intelligence Smart AI - Analytics Query Planner
 * PROMPT 53 — Section 12 & 13
 * Generates valid, structured analytical execution plans from natural language queries.
 */

import {
  StructuredAnalyticsQuery,
  NLAnalyticsIntent,
  NLExtractedEntities,
  NLTimeRange,
} from '../../../types/nlAnalytics';
import { FleetAnalyticsSemanticLayer } from './FleetAnalyticsSemanticLayer';

export class AnalyticsQueryPlanner {
  public static plan(
    intent: NLAnalyticsIntent,
    entities: NLExtractedEntities,
    timeRange: NLTimeRange,
    tenantId: string,
    userRole: string = 'user',
    userPermissions: string[] = []
  ): StructuredAnalyticsQuery {
    const metrics: string[] = [];
    const dimensions: StructuredAnalyticsQuery['dimensions'] = [];
    const filters: Record<string, any> = {};

    // 1. Determine Metrics based on intent and entities
    if (entities.targetMetric) {
      metrics.push(entities.targetMetric);
    } else {
      switch (intent) {
        case 'FUEL_ANALYSIS':
          metrics.push('fuel_consumption', 'fuel_cost', 'fuel_per_km');
          break;
        case 'MAINTENANCE_ANALYSIS':
          metrics.push('service_due', 'maintenance_cost', 'downtime');
          break;
        case 'DRIVER_ANALYSIS':
          metrics.push('driver_score', 'overspeed', 'harsh_braking');
          break;
        case 'SAFETY_ANALYSIS':
          metrics.push('safety_score', 'incidents', 'fatigue_risk');
          break;
        case 'COST_ANALYSIS':
          metrics.push('cost_per_km', 'operating_cost', 'fuel_cost', 'maintenance_cost');
          break;
        case 'BRANCH_COMPARISON':
          metrics.push('cost_per_km', 'utilization', 'fuel_efficiency');
          break;
        case 'UTILIZATION_ANALYSIS':
          metrics.push('utilization', 'active_vehicles', 'mileage');
          break;
        case 'DELIVERY_ANALYSIS':
          metrics.push('on_time_delivery', 'mileage');
          break;
        case 'EXECUTIVE_ANALYSIS':
          metrics.push('operating_cost', 'cost_per_km', 'utilization', 'safety_score');
          break;
        case 'PREDICTIVE_ANALYSIS':
          metrics.push('operating_cost', 'fuel_consumption');
          break;
        case 'VEHICLE_ANALYSIS':
        default:
          metrics.push('fuel_efficiency', 'mileage', 'utilization');
          break;
      }
    }

    // 2. Determine Dimensions
    if (intent === 'BRANCH_COMPARISON' || entities.branchNames?.length) {
      dimensions.push('branch');
    }
    if (intent === 'DRIVER_ANALYSIS' || entities.driverNames?.length) {
      dimensions.push('driver');
    }
    if (intent === 'VEHICLE_ANALYSIS' || entities.vehiclePlates?.length || entities.topNLimit) {
      dimensions.push('vehicle');
    }
    if (timeRange.periodType === 'quarter' || timeRange.periodType === 'year' || intent === 'PREDICTIVE_ANALYSIS') {
      dimensions.push('month');
    }

    // Fallback dimension
    if (dimensions.length === 0) {
      dimensions.push('vehicle');
    }

    // 3. Set Filters
    if (entities.branchNames && entities.branchNames.length > 0) {
      filters.branch = entities.branchNames[0];
    }
    if (entities.vehiclePlates && entities.vehiclePlates.length > 0) {
      filters.vehiclePlate = entities.vehiclePlates[0];
    }
    if (entities.driverNames && entities.driverNames.length > 0) {
      filters.driver = entities.driverNames[0];
    }
    if (entities.statusFilter && entities.statusFilter.length > 0) {
      filters.status = entities.statusFilter[0];
    }
    if (entities.departmentNames && entities.departmentNames.length > 0) {
      filters.department = entities.departmentNames[0];
    }

    // 4. Determine Sort and Limits
    const sortField = metrics[0] || 'fuel_consumption';
    const sortDirection = entities.sortOrder || 'DESC';
    const limit = entities.topNLimit || (intent === 'BRANCH_COMPARISON' ? 10 : 20);

    // 5. Determine Comparison Mode
    let comparison: StructuredAnalyticsQuery['comparison'] = 'previous_period';
    if (timeRange.periodType === 'year') {
      comparison = 'last_year';
    } else if (entities.comparisonTarget === 'fleet_average' || intent === 'BRANCH_COMPARISON') {
      comparison = 'fleet_average';
    }

    return {
      intent,
      tenantId,
      userRole,
      userPermissions,
      entities,
      metrics,
      dimensions,
      filters,
      dateRange: timeRange,
      comparison,
      sort: {
        field: sortField,
        direction: sortDirection,
      },
      limit,
      visualization: 'AUTO',
      confidence: 'Data-based',
      scope: {
        tenantId,
      },
    };
  }
}
