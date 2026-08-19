/**
 * Fleet Intelligence Smart AI - Alert & Event Engine Types
 * Realtime Event Processor, Rule Engine, Escalation, Deduplication & Analytics
 */

export type AlertType =
  | 'OVERSPEED'
  | 'IDLE'
  | 'DEVICE_OFFLINE'
  | 'GEOFENCE'
  | 'ROUTE_DEVIATION'
  | 'IGNITION'
  | 'BATTERY'
  | 'TEMPERATURE'
  | 'PANIC'
  | 'FUEL'
  | 'HARSH_BRAKING'
  | 'HARSH_ACCELERATION'
  | 'HARSH_CORNERING'
  | 'DRIVER_FATIGUE'
  | 'ACCIDENT'
  | 'MAINTENANCE'
  | 'TOWING'
  | 'JAMMING'
  | 'GPS_JAMMING';

export type AlertSeverity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type AlertPriority = 1 | 2 | 3 | 4 | 5;

export type AlertStatus =
  | 'ACTIVE'
  | 'ACKNOWLEDGED'
  | 'ESCALATED'
  | 'RESOLVED'
  | 'DISMISSED'
  | 'EXPIRED';

export type ResolutionCode =
  | 'NORMAL_OPERATION'
  | 'FALSE_POSITIVE'
  | 'DRIVER_CONTACTED'
  | 'ISSUE_FIXED'
  | 'DEVICE_RECOVERED'
  | 'ROUTE_CORRECTED'
  | 'OTHER';

export type Operator =
  | '>'
  | '<'
  | '>='
  | '<='
  | '='
  | '!='
  | 'BETWEEN'
  | 'NOT_BETWEEN'
  | 'IN'
  | 'NOT_IN';

export type LogicalOperator = 'AND' | 'OR';

export interface ConditionClause {
  id: string;
  field: string; // e.g., 'speed', 'idleMinutes', 'lastPingSec', 'geofenceId', 'batteryVolts', 'temperature', 'ignition'
  operator: Operator;
  value: any;
  secondaryValue?: any; // For BETWEEN / NOT_BETWEEN
}

export interface ConditionGroup {
  id: string;
  logicalOperator: LogicalOperator;
  clauses: ConditionClause[];
  nestedGroups?: ConditionGroup[];
}

export type ActionChannel =
  | 'CREATE_ALERT'
  | 'PUSH'
  | 'IN_APP'
  | 'EMAIL'
  | 'SMS'
  | 'WHATSAPP'
  | 'WEBHOOK';

export interface AlertSchedule {
  type: 'ALWAYS' | 'OPERATING_HOURS' | 'OUTSIDE_OPERATING_HOURS' | 'CUSTOM';
  startTime?: string; // HH:mm
  endTime?: string;   // HH:mm
  daysOfWeek?: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  excludeHolidays?: boolean;
}

export interface RuleScope {
  vehicleType?: 'ALL' | 'SPECIFIC_VEHICLE' | 'VEHICLE_GROUP' | 'BRANCH';
  vehicleIds?: string[];
  vehicleGroupIds?: string[];
  branchIds?: string[];
  driverIds?: string[];
  deviceTypes?: string[];
}

export interface AlertRule {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  type: AlertType;
  enabled: boolean;
  severity: AlertSeverity;
  priority: AlertPriority;
  
  // Rule Evaluation Engine fields
  conditionGroup: ConditionGroup;
  durationSeconds: number; // Duration violation must hold before triggering
  cooldownSeconds: number; // Suppression window
  repeatIntervalSeconds?: number;
  
  actions: ActionChannel[];
  escalationPolicyId?: string;
  
  schedule: AlertSchedule;
  scope: RuleScope;
  
  version: number;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AlertRuleVersion {
  id: string;
  ruleId: string;
  version: number;
  configuration: Partial<AlertRule>;
  createdBy: string;
  createdAt: string;
}

export interface EscalationLevel {
  level: number;
  recipientRoleOrUser: string;
  timeoutMinutes: number;
  channels: ActionChannel[];
}

export interface EscalationPolicy {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  levels: EscalationLevel[];
}

export interface Alert {
  id: string;
  tenantId: string;
  ruleId?: string;
  ruleName?: string;
  type: AlertType;
  severity: AlertSeverity;
  priority: AlertPriority;
  status: AlertStatus;
  
  // Entities related
  vehicleId: string;
  vehiclePlate: string;
  deviceId?: string;
  imeiMasked?: string;
  driverId?: string;
  driverName?: string;
  tripId?: string;
  tripNumber?: string;
  routeId?: string;
  routeName?: string;
  deliveryId?: string;
  deliveryNumber?: string;
  geofenceId?: string;
  geofenceName?: string;
  
  title: string;
  message: string;
  
  triggeredAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  escalatedAt?: string;
  escalationLevel?: number;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionCode?: ResolutionCode;
  resolutionNote?: string;
  
  latitude: number;
  longitude: number;
  locationName?: string;
  
  triggerValue: any;
  thresholdValue: any;
  
  isFalsePositive?: boolean;
  falsePositiveReason?: string;
  
  fingerprint: string;
  metadata?: Record<string, any>;
  
  createdAt: string;
  updatedAt: string;
}

export type AlertEventType =
  | 'TRIGGERED'
  | 'ACKNOWLEDGED'
  | 'ESCALATED'
  | 'RESOLVED'
  | 'DISMISSED'
  | 'REOPENED';

export interface AlertEvent {
  id: string;
  alertId: string;
  eventType: AlertEventType;
  previousStatus?: AlertStatus;
  newStatus: AlertStatus;
  actorType: 'SYSTEM' | 'USER' | 'ESCALATION_ENGINE';
  actorId: string;
  actorName: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface AlertKPIs {
  activeCount: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  acknowledgedCount: number;
  resolvedCount: number;
  escalatedCount: number;
  avgResponseTimeMinutes: number;
  avgResolutionTimeMinutes: number;
}

export interface TelemetryEvent {
  id: string;
  tenantId: string;
  vehicleId: string;
  vehiclePlate: string;
  deviceId: string;
  driverId?: string;
  driverName?: string;
  timestamp: string;
  eventType:
    | 'GPS_UPDATE'
    | 'IGNITION_CHANGE'
    | 'BATTERY_UPDATE'
    | 'TEMPERATURE_UPDATE'
    | 'PANIC_EVENT'
    | 'GEOFENCE_EVENT'
    | 'ROUTE_EVENT';
  
  speed: number;
  speedLimit?: number;
  ignition: boolean;
  batteryVoltage?: number;
  batteryPercentage?: number;
  temperature?: number; // In Celsius
  temperatureSensorId?: string;
  latitude: number;
  longitude: number;
  locationName?: string;
  
  geofenceId?: string;
  geofenceName?: string;
  geofenceEventType?: 'ENTER' | 'EXIT' | 'DWELL';
  
  routeId?: string;
  routeDeviationDistMeters?: number;
  
  tripId?: string;
  deliveryId?: string;
  
  panicButtonTriggered?: boolean;
}

export interface WebhookDeliveryLog {
  id: string;
  alertId: string;
  endpointUrl: string;
  status: 'SUCCESS' | 'FAILED' | 'RETRYING';
  httpStatus?: number;
  attempts: number;
  payload: any;
  responseBody?: string;
  deliveredAt?: string;
  nextRetryAt?: string;
}

export interface AlertAIAnomaly {
  vehicleId: string;
  vehiclePlate: string;
  alertType: AlertType;
  confidenceScore: number;
  insight: string;
  suggestedAction: string;
}

export interface AlertAIRuleRecommendation {
  id: string;
  targetGroup: string;
  currentValue: string;
  recommendedValue: string;
  rationale: string;
  estimatedFalsePositiveReductionPct: number;
}
