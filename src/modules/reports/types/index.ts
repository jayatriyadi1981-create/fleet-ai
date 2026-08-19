/**
 * Fleet Intelligence Smart AI - Report Center Types & Schema Definition
 * PROMPT 39 - Centralized Fleet Reporting & Enterprise Export Engine
 */

export type ReportDomainType =
  | 'GPS'
  | 'VEHICLE'
  | 'DRIVER'
  | 'TRIP'
  | 'FUEL'
  | 'MAINTENANCE'
  | 'SAFETY'
  | 'COST'
  | 'FLEET'
  | 'EXECUTIVE'
  | 'DELIVERY';

export type ReportSubType =
  // GPS
  | 'GPS_ACTIVITY'
  | 'GPS_LOCATION'
  | 'GPS_EVENT'
  | 'GPS_MILEAGE'
  | 'GPS_STOP'
  | 'GPS_IDLE'
  | 'GPS_OFFLINE'
  | 'GPS_DEVICE_HEALTH'
  // Vehicle
  | 'VEHICLE_MASTER'
  | 'VEHICLE_STATUS'
  | 'VEHICLE_UTILIZATION'
  | 'VEHICLE_MILEAGE'
  | 'VEHICLE_COST'
  | 'VEHICLE_PERFORMANCE'
  | 'VEHICLE_HEALTH'
  // Driver
  | 'DRIVER_MASTER'
  | 'DRIVER_ACTIVITY'
  | 'DRIVER_BEHAVIOR'
  | 'DRIVER_SAFETY'
  | 'DRIVER_FATIGUE'
  | 'DRIVER_PERFORMANCE'
  | 'DRIVER_COST'
  // Trip
  | 'TRIP_SUMMARY'
  | 'TRIP_DETAIL'
  | 'TRIP_PERFORMANCE'
  | 'TRIP_DELAY'
  | 'TRIP_ROUTE'
  | 'TRIP_COST'
  | 'TRIP_DRIVER'
  | 'TRIP_VEHICLE'
  // Fuel
  | 'FUEL_CONSUMPTION'
  | 'FUEL_COST'
  | 'FUEL_EFFICIENCY'
  | 'FUEL_REFUELING'
  | 'FUEL_ANOMALY'
  | 'FUEL_THEFT_RISK'
  // Maintenance
  | 'MAINTENANCE_SUMMARY'
  | 'MAINTENANCE_HISTORY'
  | 'MAINTENANCE_COST'
  | 'MAINTENANCE_SERVICE_DUE'
  | 'MAINTENANCE_OVERDUE'
  | 'MAINTENANCE_BREAKDOWN'
  | 'MAINTENANCE_REPAIR'
  | 'MAINTENANCE_PARTS'
  | 'MAINTENANCE_PREDICTIVE'
  // Safety
  | 'SAFETY_SUMMARY'
  | 'SAFETY_ACCIDENT'
  | 'SAFETY_INCIDENT'
  | 'SAFETY_NEAR_MISS'
  | 'SAFETY_DRIVER_SAFETY'
  | 'SAFETY_EVENT'
  | 'SAFETY_FATIGUE'
  | 'SAFETY_CORRECTIVE_ACTION'
  // Cost
  | 'COST_OPERATING'
  | 'COST_FUEL'
  | 'COST_MAINTENANCE'
  | 'COST_DRIVER'
  | 'COST_PER_KM'
  | 'COST_PER_TRIP'
  | 'COST_VEHICLE'
  | 'COST_BRANCH'
  | 'COST_VARIANCE'
  | 'COST_SAVING'
  // Fleet
  | 'FLEET_SUMMARY'
  | 'FLEET_UTILIZATION'
  | 'FLEET_PRODUCTIVITY'
  | 'FLEET_AVAILABILITY'
  | 'FLEET_MILEAGE'
  | 'FLEET_DOWNTIME'
  | 'FLEET_IDLE'
  | 'FLEET_EFFICIENCY'
  | 'FLEET_PERFORMANCE'
  | 'FLEET_HEALTH'
  // Executive
  | 'EXECUTIVE_MONTHLY'
  | 'EXECUTIVE_WEEKLY'
  | 'EXECUTIVE_FLEET'
  | 'EXECUTIVE_COST'
  | 'EXECUTIVE_SAFETY'
  | 'EXECUTIVE_PERFORMANCE'
  // Delivery
  | 'DELIVERY_SUMMARY'
  | 'DELIVERY_POD'
  | 'DELIVERY_CUSTOMER'
  | 'DELIVERY_ON_TIME';

export type ReportPeriodPreset =
  | 'TODAY'
  | 'YESTERDAY'
  | 'THIS_WEEK'
  | 'LAST_WEEK'
  | 'THIS_MONTH'
  | 'LAST_MONTH'
  | 'THIS_QUARTER'
  | 'LAST_QUARTER'
  | 'THIS_YEAR'
  | 'LAST_YEAR'
  | 'CUSTOM';

export type ReportDatePreset = ReportPeriodPreset;

export type ReportExportFormat = 'PDF' | 'EXCEL' | 'CSV';

export type ReportJobStatus =
  | 'QUEUED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'EXPIRED'
  | 'CANCELLED';

export type ReportVisualizationType =
  | 'TABLE'
  | 'LINE_CHART'
  | 'BAR_CHART'
  | 'AREA_CHART'
  | 'PIE_DONUT'
  | 'KPI'
  | 'HEATMAP'
  | 'MAP';

export type ReportGroupBy =
  | 'NONE'
  | 'VEHICLE'
  | 'DRIVER'
  | 'BRANCH'
  | 'DATE'
  | 'MONTH'
  | 'TRIP'
  | 'ROUTE'
  | 'CUSTOMER'
  | 'CATEGORY';

export type ReportSortDirection = 'ASC' | 'DESC';

export interface ReportColumnDefinition {
  id: string;
  label: string;
  dataType: 'string' | 'number' | 'currency' | 'date' | 'badge' | 'percentage' | 'rating';
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  visible: boolean;
  summaryType?: 'SUM' | 'AVG' | 'MIN' | 'MAX' | 'COUNT' | 'NONE';
  description?: string;
}

export interface ReportFilterCriteria {
  periodPreset: ReportPeriodPreset;
  startDate: string;
  endDate: string;
  companyId?: string;
  branchId?: string;
  departmentId?: string;
  vehicleGroupId?: string;
  vehicleId?: string;
  driverId?: string;
  driverGroupId?: string;
  routeId?: string;
  tripId?: string;
  customer?: string;
  status?: string;
  severity?: string;
  costCategory?: string;
  minAmount?: number;
  maxAmount?: number;
  searchQuery?: string;
}

export interface ReportSummaryValue {
  columnId: string;
  type: 'SUM' | 'AVG' | 'MIN' | 'MAX' | 'COUNT';
  value: number | string;
  formatted: string;
}

export interface ReportKPIItem {
  label: string;
  value: string | number;
  subtext?: string;
  variance?: number;
  isPositiveGood?: boolean;
  trend?: { value: number; isPositive: boolean };
}

export interface ReportChartConfig {
  title?: string;
  description?: string;
  data: any[];
}

export interface ReportDataset {
  reportId: string;
  name: string;
  type: ReportDomainType;
  subType: ReportSubType;
  generatedAt: string;
  periodLabel: string;
  filterSummary: string;
  columns: ReportColumnDefinition[];
  rows: Record<string, any>[];
  summaryRows: ReportSummaryValue[];
  totalRecords: number;
  kpis: ReportKPIItem[];
  chartData?: ReportChartConfig | any;
  groupBy?: ReportGroupBy;
  groupedData?: {
    groupKey: string;
    groupLabel: string;
    count: number;
    subTotal?: Record<string, number | string>;
    items: Record<string, any>[];
  }[];
  aiSummary?: ReportAISynthesis;
}

export interface ReportAISynthesis {
  executiveSummary: string;
  keyFindings: string[];
  positiveTrends: string[];
  negativeTrends: string[];
  criticalIssues: string[];
  potentialImpact: string;
  recommendations: {
    title: string;
    action: string;
    targetEntity?: string;
    expectedOutcome: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    metricEvidence: string;
  }[];
  costSavingEstimateIdr?: number;
  safetyRiskReductionPct?: number;
}

export interface ReportAIQAItem {
  id: string;
  question: string;
  answer: string;
  metricEvidence: string[];
  timestamp: string;
}

export interface ReportTemplate {
  id: string;
  tenantId: string;
  name: string;
  type: ReportDomainType;
  subType: ReportSubType;
  description: string;
  tags: string[];
  columns: string[]; // selected column IDs
  filters: ReportFilterCriteria;
  grouping: ReportGroupBy;
  sortBy?: string;
  sortDirection?: ReportSortDirection;
  visualization: ReportVisualizationType;
  aiSummaryEnabled: boolean;
  isDefault: boolean;
  isFavorite?: boolean;
  usageCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type ScheduleFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM_CRON';
export type ReportScheduleFrequency = ScheduleFrequency;

export type DeliveryChannel = 'EMAIL' | 'IN_APP' | 'PUSH' | 'WHATSAPP';
export type ReportDeliveryChannel = DeliveryChannel;

export interface ReportSchedule {
  id: string;
  tenantId: string;
  name: string;
  templateId: string;
  reportType: ReportDomainType;
  subType: ReportSubType;
  frequency: ScheduleFrequency;
  cronExpression?: string;
  timeOfDay: string; // e.g. "08:00"
  dayOfWeek?: number; // 1 (Mon) - 7 (Sun)
  dayOfMonth?: number; // 1 - 31
  timezone: string; // "Asia/Jakarta"
  recipients: string[]; // emails / userIds / phone numbers
  formats: ReportExportFormat[];
  channels: DeliveryChannel[];
  filters: ReportFilterCriteria;
  aiSummaryEnabled: boolean;
  enabled: boolean;
  lastRunAt?: string;
  lastStatus?: 'SUCCESS' | 'FAILED';
  nextRunAt: string;
  createdBy: string;
  createdAt: string;
}

export interface GeneratedReport {
  id: string;
  jobId: string;
  tenantId: string;
  reportId: string;
  name: string;
  type: ReportDomainType;
  subType: ReportSubType;
  format: ReportExportFormat;
  periodStart: string;
  periodEnd: string;
  filters: ReportFilterCriteria;
  status: ReportJobStatus;
  progressPct: number;
  fileReference?: string;
  fileSize?: string;
  downloadToken?: string;
  downloadUrl?: string;
  expiresAt: string;
  generatedBy: string;
  generatedByName?: string;
  generatedAt: string;
  recordsCount: number;
  errorReason?: string;
}

export interface ReportAuditLog {
  id: string;
  tenantId: string;
  userId: string;
  userName: string;
  userEmail: string;
  reportId: string;
  reportName: string;
  reportType: ReportDomainType;
  action: 'VIEWED' | 'CREATED' | 'GENERATED' | 'EXPORTED' | 'DOWNLOADED' | 'SHARED' | 'DELETED' | 'SCHEDULED';
  format?: ReportExportFormat;
  timestamp: string;
  ipAddress: string;
  filterSummary: string;
  scope: string;
  details?: string;
}

export interface ReportComparisonPeriod {
  periodA: {
    label: string;
    startDate: string;
    endDate: string;
  };
  periodB: {
    label: string;
    startDate: string;
    endDate: string;
  };
  metrics: {
    key: string;
    label: string;
    valueA: number;
    valueB: number;
    variance: number;
    variancePct: number;
    trend: 'UP' | 'DOWN' | 'STABLE';
    isPositiveGood: boolean;
    format: 'number' | 'currency' | 'percentage';
  }[];
  aiComparisonInsight: string;
}

export interface ReportBrandingSettings {
  companyName: string;
  companyLogoUrl?: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyWebsite: string;
  reportFooterText: string;
  watermark: 'CONFIDENTIAL' | 'INTERNAL_USE_ONLY' | 'STRICTLY_CONFIDENTIAL' | 'NONE';
  defaultLocale: string;
  currencyCode: 'IDR' | 'USD';
  timezone: string;
  defaultRetentionDays: number;
  enableAutoAiSummary: boolean;
  enableNotificationEmail: boolean;
  enableNotificationPush: boolean;
  enableWhatsAppReady: boolean;
}

export interface ReportCenterKPIs {
  totalReports: number;
  reportsGenerated: number;
  reportsScheduled: number;
  reportsFailed: number;
  reportsExported: number;
  reportsThisMonth: number;
  lastGeneratedReportName: string;
  lastGeneratedReportTime: string;
  mostUsedReportName: string;
  mostExportedFormat: string;
}
