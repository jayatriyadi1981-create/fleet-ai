/**
 * Fleet Intelligence Smart AI - AI Fleet Assistant Types & Contracts (Prompt 34)
 * Definisi tipe data komprehensif untuk Conversational AI Assistant, Intent Engine,
 * Tool Registry 27-tools, Permissions, RBAC Boundaries, Feedback, & Audit.
 */

import { AIRiskLevel, AIConfidenceLevel, AISourceCitation, AIActionProposal } from '../../../types/ai';

// 27 Standard Telematics Intents (Prompt 34 - Section 10)
export type FleetAssistantIntent =
  | 'FLEET_STATUS'
  | 'VEHICLE_STATUS'
  | 'VEHICLE_OFFLINE'
  | 'VEHICLE_LOCATION'
  | 'DRIVER_STATUS'
  | 'DRIVER_RISK'
  | 'DRIVER_BEHAVIOR'
  | 'FUEL_ANALYSIS'
  | 'FUEL_ANOMALY'
  | 'MAINTENANCE_STATUS'
  | 'MAINTENANCE_DUE'
  | 'MAINTENANCE_RISK'
  | 'TRIP_STATUS'
  | 'TRIP_DELAY'
  | 'ROUTE_STATUS'
  | 'ROUTE_RISK'
  | 'SAFETY_STATUS'
  | 'SAFETY_RISK'
  | 'FATIGUE_RISK'
  | 'INCIDENT_ANALYSIS'
  | 'ACCIDENT_ANALYSIS'
  | 'GPS_STATUS'
  | 'DEVICE_STATUS'
  | 'GEOFENCE_STATUS'
  | 'ALERT_STATUS'
  | 'AI_INSIGHT'
  | 'REPORT_REQUEST'
  | 'GENERAL_QUERY'
  | 'AMBIGUOUS_QUERY';

// 27 Telematics Tool IDs (Prompt 34 - Section 15)
export type FleetAssistantToolId =
  | 'getFleetSummary'
  | 'getVehicleSummary'
  | 'getVehicleStatus'
  | 'getOfflineVehicles'
  | 'getVehicleLocation'
  | 'getDriverSummary'
  | 'getDriverRisk'
  | 'getDriverBehavior'
  | 'getFuelSummary'
  | 'getFuelTrend'
  | 'getFuelAnomalies'
  | 'getMaintenanceSummary'
  | 'getMaintenanceDue'
  | 'getMaintenanceRisk'
  | 'getTripSummary'
  | 'getDelayedTrips'
  | 'getRouteSummary'
  | 'getRouteRisk'
  | 'getSafetySummary'
  | 'getSafetyRisk'
  | 'getFatigueRisk'
  | 'getIncidentSummary'
  | 'getAccidentSummary'
  | 'getGPSStatus'
  | 'getDeviceStatus'
  | 'getGeofenceStatus'
  | 'getActiveAlerts'
  | 'getFleetAIInsights';

export interface ExtractedIntentEntities {
  vehicleId?: string;
  plateNumber?: string;
  driverId?: string;
  driverName?: string;
  branchId?: string;
  branchName?: string;
  timeRange?: 'TODAY' | 'YESTERDAY' | 'LAST_7_DAYS' | 'LAST_30_DAYS' | 'LAST_90_DAYS' | 'CUSTOM';
  statusFilter?: 'ALL' | 'MOVING' | 'IDLE' | 'PARKED' | 'OFFLINE' | 'MAINTENANCE';
  limit?: number;
  priority?: 'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  routeId?: string;
  routeName?: string;
  geofenceId?: string;
}

export interface IntentAnalysisResult {
  intent: FleetAssistantIntent;
  confidence: number; // 0.0 - 1.0
  entities: ExtractedIntentEntities;
  isAmbiguous: boolean;
  clarificationPrompt?: string;
  suggestedTools: FleetAssistantToolId[];
  isActionable: boolean;
  sanitizedPrompt: string;
  injectionDetected: boolean;
  isSensitiveDisciplinary?: boolean;
}

export interface ToolExecutionResult<T = any> {
  toolName: FleetAssistantToolId;
  success: boolean;
  data: T;
  source: string;
  timestamp: string;
  dataQuality: 'EXCELLENT' | 'GOOD' | 'MEDIUM' | 'INSUFFICIENT';
  permission: string;
  permissionGranted: boolean;
  error?: string;
  executionTimeMs: number;
}

export interface AssistantChartData {
  chartType: 'bar' | 'line' | 'pie' | 'radar';
  title: string;
  labels: string[];
  datasets: Array<{
    name: string;
    data: number[];
    color?: string;
  }>;
}

export interface AssistantTableData {
  title: string;
  columns: Array<{ key: string; label: string }>;
  rows: Array<Record<string, any>>;
}

export interface AssistantMapMarker {
  id: string;
  title: string;
  plateNumber: string;
  lat: number;
  lng: number;
  status: string;
  driverName?: string;
  branch?: string;
  lastPing?: string;
  speed?: number;
}

export interface AssistantMapData {
  title: string;
  center: [number, number];
  zoom: number;
  markers: AssistantMapMarker[];
}

export interface AssistantMetricCard {
  label: string;
  value: string | number;
  unit?: string;
  statusColor?: 'emerald' | 'amber' | 'rose' | 'cyan' | 'slate';
  change?: string;
}

export interface AssistantInlineAction {
  id: string;
  label: string;
  icon?: string;
  viewTarget: string; // e.g. 'live_tracking', 'vehicles', 'drivers', 'maintenance', 'safety'
  params?: Record<string, any>;
}

export interface AssistantStructuredResponse {
  id: string;
  conversationId: string;
  intent: FleetAssistantIntent;
  confidence: AIConfidenceLevel;
  content: string; // Main structured markdown response
  summary: string;
  factors?: string[];
  recommendations?: string[];
  metrics?: AssistantMetricCard[];
  tableData?: AssistantTableData;
  chartData?: AssistantChartData;
  mapData?: AssistantMapData;
  sources: AISourceCitation[];
  actions: AIActionProposal[];
  inlineActions?: AssistantInlineAction[];
  warnings: string[];
  dataPeriod: string;
  dataFreshness: {
    lastUpdate: string;
    isStale: boolean;
    staleWarning?: string;
  };
  toolCalls: Array<{
    toolName: FleetAssistantToolId;
    status: 'SUCCESS' | 'PERMISSION_DENIED' | 'FAILED';
    durationMs: number;
    error?: string;
  }>;
  createdAt: string;
}

export interface FleetAssistantMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  structuredResponse?: AssistantStructuredResponse;
  intent?: FleetAssistantIntent;
  createdAt: string;
  feedback?: {
    isHelpful: boolean;
    reason?: 'wrong_data' | 'wrong_analysis' | 'not_relevant' | 'missing_information' | 'other';
    comment?: string;
    submittedAt: string;
  };
}

export interface FleetAssistantConversation {
  id: string;
  tenantId: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  isArchived?: boolean;
  messages: FleetAssistantMessage[];
  lastIntent?: FleetAssistantIntent;
  contextScope?: {
    lastVehicleId?: string;
    lastDriverId?: string;
    lastBranchId?: string;
    lastTimeRange?: string;
  };
}

export interface FleetDailyBriefingData {
  id: string;
  date: string;
  greeting: string;
  fleetSummary: {
    totalVehicles: number;
    online: number;
    moving: number;
    idle: number;
    offline: number;
    maintenance: number;
  };
  priorityHighlights: Array<{
    id: string;
    level: 'CRITICAL' | 'HIGH' | 'MEDIUM';
    title: string;
    description: string;
    actionLabel: string;
    targetView: string;
  }>;
  safetyScore: number;
  fuelEfficiencyStatus: string;
  maintenanceDueCount: number;
  fatigueRiskCount: number;
  recommendedFocus: string;
  generatedAt: string;
}

export interface SpeechInputProvider {
  isSupported: boolean;
  startListening: (onResult: (transcript: string) => void, onError?: (err: any) => void) => void;
  stopListening: () => void;
}

export interface SpeechOutputProvider {
  isSupported: boolean;
  speak: (text: string, onEnd?: () => void) => void;
  stop: () => void;
}
