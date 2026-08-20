/**
 * Fleet Intelligence Smart AI - AI Natural Language Analytics Type Definitions
 * PROMPT 53 — Enterprise Indonesian Natural Language Query & Analytics Engine
 */

import { ActiveView } from '../context/FleetContext';

// 1. Supported NL Analytics Intents (Prompt 53 - Section 6)
export type NLAnalyticsIntent =
  | 'FLEET_PERFORMANCE'
  | 'VEHICLE_ANALYSIS'
  | 'DRIVER_ANALYSIS'
  | 'FUEL_ANALYSIS'
  | 'MAINTENANCE_ANALYSIS'
  | 'SAFETY_ANALYSIS'
  | 'TRIP_ANALYSIS'
  | 'DELIVERY_ANALYSIS'
  | 'COST_ANALYSIS'
  | 'UTILIZATION_ANALYSIS'
  | 'BRANCH_COMPARISON'
  | 'ROUTE_ANALYSIS'
  | 'GEOFENCE_ANALYSIS'
  | 'ALERT_ANALYSIS'
  | 'EXECUTIVE_ANALYSIS'
  | 'PREDICTIVE_ANALYSIS';

// 2. Extracted Entities (Prompt 53 - Section 7)
export interface NLExtractedEntities {
  vehiclePlates?: string[];
  vehicleIds?: string[];
  vehicleTypes?: string[];
  driverNames?: string[];
  driverIds?: string[];
  branchNames?: string[];
  branchIds?: string[];
  departmentNames?: string[];
  departmentIds?: string[];
  fleetNames?: string[];
  routeNames?: string[];
  geofenceNames?: string[];
  statusFilter?: string[];
  targetMetric?: string;
  comparisonTarget?: string;
  topNLimit?: number;
  sortOrder?: 'ASC' | 'DESC';
  timeframeRaw?: string;
  isWhyQuestion?: boolean;
  isFollowUp?: boolean;
  ambiguityResolvedMetric?: string;
}

// 3. Resolved Time Range (Prompt 53 - Section 8 & 9)
export interface NLTimeRange {
  raw: string;
  label: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
  timezone: 'Asia/Jakarta' | 'Asia/Makassar' | 'Asia/Jayapura';
  periodType: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
  comparisonStartDate?: string;
  comparisonEndDate?: string;
  comparisonLabel?: string;
}

// 4. Structured Analytics Query (Prompt 53 - Section 13)
export interface StructuredAnalyticsQuery {
  intent: NLAnalyticsIntent;
  tenantId: string;
  userRole?: string;
  userPermissions?: string[];
  entities: NLExtractedEntities;
  metrics: string[];
  dimensions: ('vehicle' | 'driver' | 'branch' | 'department' | 'fleet' | 'route' | 'date' | 'month' | 'week' | 'day' | 'status')[];
  filters: Record<string, any>;
  dateRange: NLTimeRange;
  comparison?: 'previous_period' | 'last_year' | 'fleet_average' | 'target' | 'none';
  sort?: {
    field: string;
    direction: 'ASC' | 'DESC';
  };
  limit?: number;
  visualization?: 'AUTO' | 'KPI' | 'TABLE' | 'LINE_CHART' | 'BAR_CHART' | 'HORIZONTAL_BAR' | 'DONUT_CHART' | 'MAP' | 'COMPARISON_TABLE';
  confidence: 'High' | 'Medium' | 'Low' | 'Data-based';
  scope: {
    tenantId: string;
    branchId?: string;
    departmentId?: string;
  };
}

// 5. KPI Summary Card
export interface NLAnalyticsKPICard {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
  previousValue?: string | number;
  changePercent?: number;
  changeDirection?: 'UP' | 'DOWN' | 'NEUTRAL';
  isGoodChange?: boolean;
  subtitle?: string;
  targetValue?: string | number;
}

// 6. Interactive Table Definition
export interface NLAnalyticsTableColumn {
  key: string;
  label: string;
  type: 'text' | 'number' | 'currency' | 'percent' | 'badge' | 'link' | 'date';
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
}

export interface NLAnalyticsTable {
  title?: string;
  columns: NLAnalyticsTableColumn[];
  rows: Record<string, any>[];
  totalCount: number;
  summaryRow?: Record<string, any>;
}

// 7. Interactive Chart Definition (Prompt 53 - Section 24 & 25)
export type NLAnalyticsChartType = 'line' | 'bar' | 'horizontal_bar' | 'donut' | 'area';

export interface NLAnalyticsChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  target?: number;
  category?: string;
  color?: string;
  [key: string]: any;
}

export interface NLAnalyticsChart {
  type: NLAnalyticsChartType;
  title: string;
  subtitle?: string;
  xAxisKey: string;
  series: {
    key: string;
    label: string;
    color: string;
    unit?: string;
  }[];
  data: NLAnalyticsChartDataPoint[];
}

// 8. Map Data Points (Prompt 53 - Section 26)
export interface NLAnalyticsMapItem {
  id: string;
  plateNumber: string;
  driverName?: string;
  lat: number;
  lng: number;
  status: 'moving' | 'idling' | 'stopped' | 'offline';
  speed?: number;
  address?: string;
  lastUpdate: string;
  metricHighlight?: string;
}

// 9. Smart Links (Prompt 53 - Section 30)
export interface NLAnalyticsSmartLink {
  label: string;
  targetView: ActiveView;
  entityType: 'vehicle' | 'driver' | 'branch' | 'route' | 'trip' | 'fuel' | 'maintenance' | 'cost';
  entityId?: string;
  filterParams?: Record<string, any>;
}

// 10. Evidence & Calculation Transparency (Prompt 53 - Section 48 & 49)
export interface NLAnalyticsEvidence {
  metricName: string;
  formula: string;
  components: {
    label: string;
    value: string | number;
    source: string;
  }[];
  calculatedResult: string | number;
  dataFreshness: string;
  auditTrailId: string;
  sources: string[];
}

// 11. Ambiguity Options (Prompt 53 - Section 21)
export interface NLAnalyticsAmbiguityOption {
  metricKey: string;
  label: string;
  description: string;
  indicator: string;
}

// 12. Full NL Analytics Response (Prompt 53 - Section 62 & 64)
export interface NaturalLanguageAnalyticsResponse {
  queryId: string;
  question: string;
  answer: string;
  summaryHeadline?: string;
  intent: NLAnalyticsIntent;
  confidence: 'High' | 'Medium' | 'Low' | 'Data-based';
  confidenceReason?: string;
  kpis?: NLAnalyticsKPICard[];
  table?: NLAnalyticsTable;
  chart?: NLAnalyticsChart;
  mapItems?: NLAnalyticsMapItem[];
  appliedFilters: {
    key: string;
    label: string;
    value: string;
    removable?: boolean;
  }[];
  smartLinks?: NLAnalyticsSmartLink[];
  evidence?: NLAnalyticsEvidence;
  ambiguity?: {
    prompt: string;
    currentSelection: string;
    options: NLAnalyticsAmbiguityOption[];
  };
  suggestedFollowUps: string[];
  executionTimeMs: number;
  dataFreshness: string;
  sourceModules: string[];
  isPermissionDenied?: boolean;
  permissionDeniedMessage?: string;
  isInsufficientData?: boolean;
  insufficientDataReason?: string;
}

// 13. Conversation Context & History (Prompt 53 - Section 5)
export interface NLAnalyticsConversationContext {
  conversationId: string;
  tenantId: string;
  userId: string;
  userRole: string;
  userPermissions: string[];
  messages: {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    timestamp: string;
    response?: NaturalLanguageAnalyticsResponse;
  }[];
  previousIntent?: NLAnalyticsIntent;
  previousEntities?: NLExtractedEntities;
  previousFilters?: Record<string, any>;
  previousTimeRange?: NLTimeRange;
  previousResult?: NaturalLanguageAnalyticsResponse;
}

// 14. Saved Analysis & Schedule (Prompt 53 - Section 51, 52, 53)
export interface SavedAnalyticsItem {
  id: string;
  tenantId: string;
  ownerId: string;
  ownerName: string;
  title: string;
  question: string;
  intent: NLAnalyticsIntent;
  queryPlan: StructuredAnalyticsQuery;
  visualizationPreference: 'KPI' | 'TABLE' | 'CHART' | 'ALL';
  createdAt: string;
  lastExecutedAt?: string;
  sharingScope: 'Private' | 'Team' | 'Branch' | 'Company';
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    dayOfWeek?: number; // 1 = Monday
    timeOfDay: string; // '08:00'
    active: boolean;
    recipients: string[];
    channels: ('in_app' | 'email' | 'whatsapp')[];
  };
}

// 15. Analytics Execution Log (Prompt 53 - Section 56 & 57)
export interface AnalyticsExecutionLog {
  id: string;
  tenantId: string;
  userId: string;
  userName: string;
  question: string;
  intent: NLAnalyticsIntent;
  executionTimeMs: number;
  status: 'SUCCESS' | 'PERMISSION_DENIED' | 'ERROR';
  dataSourcesAccessed: string[];
  createdAt: string;
}
