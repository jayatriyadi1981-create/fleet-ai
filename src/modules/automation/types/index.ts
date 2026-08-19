/**
 * Fleet Intelligence Smart AI - Automation Engine Types Architecture
 * PROMPT 35 - AI Automation Engine
 */

export type AutomationEventType =
  // GPS
  | 'GPS_ONLINE'
  | 'GPS_OFFLINE'
  | 'GPS_LOCATION_UPDATE'
  | 'GPS_SIGNAL_LOST'
  // Vehicle
  | 'VEHICLE_CREATED'
  | 'VEHICLE_UPDATED'
  | 'VEHICLE_STATUS_CHANGED'
  | 'VEHICLE_IDLE'
  | 'VEHICLE_MOVING'
  // Driver
  | 'DRIVER_ASSIGNED'
  | 'DRIVER_SHIFT_STARTED'
  | 'DRIVER_SHIFT_ENDED'
  | 'DRIVER_RISK_CHANGED'
  // Behavior
  | 'OVERSPEED'
  | 'HARSH_BRAKING'
  | 'HARSH_ACCELERATION'
  | 'SHARP_TURN'
  | 'ROUTE_DEVIATION'
  // Fuel
  | 'FUEL_LOW'
  | 'FUEL_DRAIN'
  | 'FUEL_ANOMALY'
  | 'REFUELING'
  // Maintenance
  | 'MAINTENANCE_DUE'
  | 'MAINTENANCE_OVERDUE'
  | 'MAINTENANCE_RISK_HIGH'
  | 'WORK_ORDER_CREATED'
  | 'WORK_ORDER_COMPLETED'
  // Trip
  | 'TRIP_STARTED'
  | 'TRIP_DELAYED'
  | 'TRIP_COMPLETED'
  | 'TRIP_CANCELLED'
  // Geofence
  | 'GEOFENCE_ENTER'
  | 'GEOFENCE_EXIT'
  | 'GEOFENCE_DWELL'
  | 'GEOFENCE_DEVIATION'
  // Safety
  | 'ACCIDENT'
  | 'INCIDENT'
  | 'NEAR_MISS'
  | 'SAFETY_RISK_HIGH'
  // Fatigue
  | 'FATIGUE_RISK_HIGH'
  | 'FATIGUE_CRITICAL'
  | 'DRIVING_HOURS_EXCEEDED'
  | 'REST_THRESHOLD_VIOLATED'
  // Temperature & Cargo
  | 'TEMPERATURE_ALERT'
  // Device
  | 'DEVICE_OFFLINE'
  | 'DEVICE_LOW_BATTERY'
  | 'DEVICE_ERROR'
  // Alert & Scheduler
  | 'ALERT_TRIGGERED'
  | 'ALERT_RESOLVED'
  | 'SCHEDULED_TRIGGER'
  | 'MANUAL_TRIGGER';

export type EventSource =
  | 'GPS'
  | 'Device'
  | 'Vehicle'
  | 'Driver'
  | 'Trip'
  | 'Fuel'
  | 'Maintenance'
  | 'Safety'
  | 'Fatigue'
  | 'Geofence'
  | 'System'
  | 'User'
  | 'Scheduler'
  | 'AI';

export interface AutomationEvent {
  eventId: string;
  eventType: AutomationEventType;
  tenantId: string;
  branchId?: string;
  timestamp: string;
  source: EventSource;
  entityType: 'vehicle' | 'driver' | 'trip' | 'device' | 'geofence' | 'system' | 'general';
  entityId: string;
  entityName?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  payload: Record<string, any>;
  metadata?: Record<string, any>;
  correlationId?: string;
}

export type AutomationNodeType =
  | 'EVENT'
  | 'CONDITION'
  | 'AI_ANALYSIS'
  | 'DECISION'
  | 'ACTION'
  | 'NOTIFICATION'
  | 'REPORT'
  | 'DELAY'
  | 'LOOP'
  | 'PARALLEL'
  | 'END';

export type ConditionOperator =
  | '='
  | '!='
  | '>'
  | '<'
  | '>='
  | '<='
  | 'IN'
  | 'NOT_IN'
  | 'CONTAINS'
  | 'NOT_CONTAINS'
  | 'BETWEEN'
  | 'EXISTS'
  | 'NOT_EXISTS';

export interface ConditionRule {
  id: string;
  field: string; // e.g. 'speed', 'driverRiskScore', 'fuelDrainLiters', 'offlineMinutes'
  fieldLabel?: string;
  operator: ConditionOperator;
  value: any;
  valueSecondary?: any; // For BETWEEN operator
}

export interface ConditionGroup {
  id: string;
  combinator: 'AND' | 'OR' | 'NOT';
  conditions: ConditionRule[];
  groups?: ConditionGroup[];
}

export type AICapabilityType =
  | 'driver_risk'
  | 'predictive_maintenance'
  | 'fuel_anomaly'
  | 'route_eta_delay'
  | 'safety_incident'
  | 'gps_diagnostics'
  | 'fatigue_risk'
  | 'general_fleet_reasoning';

export interface AIAnalysisNodeConfig {
  aiCapability: AICapabilityType;
  model: 'gemini-2.5-flash' | 'rule_heuristic' | 'smart_hybrid';
  contextFields: string[]; // e.g. ['driver_history', 'speed_telemetry', 'road_type', 'weather']
  promptTemplate?: string;
  confidenceThreshold?: number; // default 0.8
  costLimitToken?: number;
}

export interface DecisionBranch {
  id: string;
  label: string;
  conditionType: 'AI_RISK' | 'SEVERITY' | 'BOOLEAN' | 'THRESHOLD';
  targetValue: string | number; // 'HIGH' | 'CRITICAL' | 'YES' | 'NO' | '>80'
  nextNodeId?: string;
}

export type AutomationActionType =
  | 'CREATE_ALERT'
  | 'UPDATE_ALERT'
  | 'ASSIGN_ALERT'
  | 'UPDATE_DRIVER_SCORE'
  | 'UPDATE_VEHICLE_STATUS'
  | 'CREATE_MAINTENANCE_WORK_ORDER'
  | 'CREATE_SAFETY_ACTION'
  | 'CREATE_INCIDENT'
  | 'ASSIGN_DRIVER_COACHING'
  | 'CREATE_TASK'
  | 'UPDATE_TRIP'
  | 'UPDATE_ROUTE'
  | 'WHATSAPP_DRIVER'
  | 'TELEGRAM_SUPERVISOR'
  | 'CREATE_FLEET_TICKET'
  | 'CREATE_WORK_ORDER'
  | 'IMMOBILIZE_VEHICLE'
  | 'WEBHOOK_DISPATCH';

export type WorkflowPriority = AutomationPriority;
export type ASTCondition = ConditionRule;
export type ASTConditionGroup = ConditionGroup;

export interface ActionNodeConfig {
  actionType: AutomationActionType;
  parameters: Record<string, any>;
  requiresApproval: boolean; // Human in the loop for critical actions
  approvalRole?: string;
}

export type NotificationChannel =
  | 'IN_APP'
  | 'PUSH'
  | 'EMAIL'
  | 'WHATSAPP_READY'
  | 'SMS_READY';

export interface NotificationNodeConfig {
  channels: NotificationChannel[];
  targetRoles: string[]; // e.g. ['fleet_manager', 'operations', 'safety_manager']
  targetUserIds?: string[];
  dynamicRecipient?: 'driver' | 'vehicle_branch_manager' | 'assigned_dispatcher';
  titleTemplate: string;
  messageTemplate: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
  throttling: {
    cooldownSeconds: number; // e.g. 300 (5 mins)
    maxPerWindow: number;
  };
}

export interface ReportNodeConfig {
  reportType:
    | 'EVENT_INCIDENT'
    | 'DAILY_OVERSPEED'
    | 'DAILY_SUMMARY'
    | 'WEEKLY_FLEET_AUTOMATION'
    | 'DRIVER_SAFETY'
    | 'MAINTENANCE_SUMMARY'
    | 'FUEL_ANOMALY';
  format: 'PDF' | 'EXCEL' | 'IN_APP_DIGEST';
  autoDistribute: boolean;
  emailList?: string[];
}

export interface DelayNodeConfig {
  durationMinutes: number;
  conditionCheckBeforeResume?: boolean;
}

export interface LoopNodeConfig {
  targetCollection: 'VEHICLES' | 'DRIVERS' | 'TRIPS' | 'ALERTS';
  filterCriteria?: string;
  maxIterations: number; // Safety constraint against infinite loops (e.g. 50)
}

export interface AutomationNode {
  id: string;
  type: AutomationNodeType;
  label: string;
  description: string;
  position: { x: number; y: number };
  config: {
    eventType?: AutomationEventType;
    eventSource?: EventSource;
    deduplicationWindowSec?: number;
    conditionGroup?: ConditionGroup;
    aiConfig?: AIAnalysisNodeConfig;
    decisionBranches?: DecisionBranch[];
    actionConfig?: ActionNodeConfig;
    notificationConfig?: NotificationNodeConfig;
    reportConfig?: ReportNodeConfig;
    delayConfig?: DelayNodeConfig;
    loopConfig?: LoopNodeConfig;
    parallelBranches?: string[];
    [key: string]: any;
  };
}

export interface AutomationEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourceHandle?: 'default' | 'yes' | 'no' | 'high' | 'critical' | 'moderate' | 'low' | 'success' | 'failure';
  label?: string;
}

export type AutomationStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'DISABLED' | 'ARCHIVED';

export type AutomationPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';

export type WorkflowCategory =
  | 'SAFETY'
  | 'TELEMATICS'
  | 'MAINTENANCE'
  | 'FUEL'
  | 'OPERATIONS'
  | 'COMPLIANCE'
  | 'DISPATCH';

export interface ScheduleConfig {
  enabled: boolean;
  cronExpression: string; // e.g. '0 6 * * *' (Every day at 06:00)
  timezone: 'Asia/Jakarta' | 'Asia/Makassar' | 'Asia/Jayapura';
  nextRun?: string;
  lastRun?: string;
  startDate?: string;
  endDate?: string;
}

export interface AutomationWorkflow {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  category: WorkflowCategory;
  triggerType: 'EVENT_BASED' | 'SCHEDULED' | 'HYBRID';
  status: AutomationStatus;
  priority: AutomationPriority;
  version: number;
  branchScope: 'ALL' | string[]; // Branch IDs
  nodes: AutomationNode[];
  edges: AutomationEdge[];
  scheduleConfig?: ScheduleConfig;
  retryPolicy: {
    maxRetries: number;
    backoffStrategy: 'FIXED' | 'EXPONENTIAL';
    retryIntervalSec: number;
    timeoutSeconds: number;
  };
  idempotencyWindowSec: number; // e.g. 600s
  deduplicationEnabled: boolean;
  rateLimitPerEntityMinute: number;
  tags: string[];
  metrics: {
    totalExecutions: number;
    successCount: number;
    failureCount: number;
    partialCount: number;
    skippedCount: number;
    avgDurationMs: number;
    lastExecutedAt?: string;
    aiTokensTotal: number;
    estimatedCostIdr: number;
  };
  createdBy: {
    userId: string;
    userName: string;
    userRole: string;
  };
  updatedBy?: {
    userId: string;
    userName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type ExecutionStatus =
  | 'SUCCESS'
  | 'FAILED'
  | 'PARTIAL'
  | 'SKIPPED'
  | 'CANCELLED'
  | 'RUNNING';

export interface AutomationExecutionStep {
  id: string;
  executionId: string;
  nodeId: string;
  nodeType: AutomationNodeType;
  nodeLabel: string;
  status: 'SUCCESS' | 'FAILED' | 'SKIPPED' | 'RUNNING';
  inputData: any;
  outputData: any;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  error?: string;
  conditionResult?: {
    passed: boolean;
    evaluationDetails?: any[];
  };
  actionResult?: {
    actionType?: string;
    summary?: string;
    dispatchedTo?: string;
    status?: string;
    payload?: any;
  };
  aiResult?: {
    risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    confidence: number;
    reason: string;
    recommendations: string[];
    evidence: string[];
    tokensUsed: number;
    recommendedAction?: string;
  };
  approvalInfo?: {
    required: boolean;
    approvedBy?: string;
    approvedAt?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    notes?: string;
  };
}

export interface AutomationExecution {
  id: string;
  automationId: string;
  automationName: string;
  automationVersion: number;
  eventId?: string;
  eventType: AutomationEventType;
  correlationId: string;
  tenantId: string;
  entityType: string;
  entityId: string;
  entityLabel: string;
  branchId?: string;
  status: ExecutionStatus;
  startedAt: string;
  completedAt?: string;
  durationMs: number;
  error?: string;
  steps: AutomationExecutionStep[];
  aiTokensUsed: number;
  estimatedCostIdr: number;
  dryRun?: boolean;
  triggeredBy: string; // 'EVENT_BUS' | 'SIMULATION' | 'SCHEDULER' | 'MANUAL'
  priority: AutomationPriority;
}

export interface AutomationTemplate {
  id: string;
  title: string;
  description: string;
  category: WorkflowCategory;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  icon: string;
  eventTrigger: AutomationEventType;
  estimatedAITokens: number;
  tags: string[];
  workflowDraft: Partial<AutomationWorkflow>;
  explanation: {
    whatItDoes: string;
    whenItRuns: string;
    whatDataItUses: string;
    whatAIAnalyzes: string;
    whatActionsItPerforms: string;
    whoReceivesNotification: string;
  };
}

export interface AutomationAuditLog {
  id: string;
  timestamp: string;
  tenantId: string;
  userId: string;
  userName: string;
  userRole: string;
  action:
    | 'CREATED'
    | 'EDITED'
    | 'PUBLISHED'
    | 'PAUSED'
    | 'RESUMED'
    | 'TESTED'
    | 'DELETED'
    | 'EXPORTED'
    | 'RETRIED'
    | 'SETTINGS_CHANGED';
  workflowId: string;
  workflowName: string;
  changesSummary: string;
  ipAddress: string;
  details?: Record<string, any>;
}

export interface AutomationHealthStats {
  healthyCount: number;
  warningCount: number;
  failingCount: number;
  disabledCount: number;
  totalActive: number;
  totalExecutionsToday: number;
  successRatePercent: number;
  failureRatePercent: number;
  avgExecutionTimeMs: number;
  aiTokensUsedToday: number;
  estimatedAICostTodayIdr: number;
}
