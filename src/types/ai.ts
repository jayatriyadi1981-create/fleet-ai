/**
 * Fleet Intelligence Smart AI - Core AI Architecture Types (Prompt 27)
 * Definisi tipe data komprehensif untuk AI Core, Orchestrator, Context Engine, Tool Registry,
 * Multi-Provider Abstraction, Action Framework, Audit & Governance.
 */

export type AIProviderType = 'gemini' | 'openai' | 'anthropic' | 'rule_engine' | 'mock';

export type AIModelTier = 'lightweight' | 'advanced' | 'vision' | 'embedding';

export type AIResponseType = 
  | 'TEXT' 
  | 'TABLE' 
  | 'CHART' 
  | 'KPI' 
  | 'RECOMMENDATION' 
  | 'ACTION' 
  | 'WARNING' 
  | 'ERROR'
  | 'DAILY_BRIEFING'
  | 'CROSS_MODULE_ANALYSIS';

export type AIFactualityType = 'FACT' | 'INFERENCE' | 'RECOMMENDATION' | 'UNKNOWN';

export type AIConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';

export type AIRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type AIToolCategory = 'READ' | 'ANALYZE' | 'CALCULATE' | 'RECOMMEND' | 'ACTION';

export type AIIntentCategory =
  | 'FLEET'
  | 'VEHICLE'
  | 'GPS'
  | 'DRIVER'
  | 'TRIP'
  | 'ROUTE'
  | 'GEOFENCE'
  | 'DELIVERY'
  | 'MAINTENANCE'
  | 'FUEL'
  | 'SAFETY'
  | 'INSPECTION'
  | 'FATIGUE'
  | 'FINANCE'
  | 'ANALYTICS'
  | 'REPORT'
  | 'ACTION'
  | 'GENERAL';

export type AIPolicyMode = 'READ_ONLY' | 'RECOMMENDATION' | 'APPROVAL_REQUIRED' | 'FULL_ACTION';

export interface AIRequest {
  id: string;
  tenantId: string;
  userId: string;
  sessionId: string;
  capability?: string;
  intent?: string;
  message: string;
  contextScope?: {
    vehicleId?: string;
    driverId?: string;
    tripId?: string;
    branchId?: string;
    timeRange?: string;
    modules?: string[];
  };
  language?: string; // default: 'id-ID'
  timezone?: string; // default: 'Asia/Jakarta'
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface AISourceCitation {
  id: string;
  module: string; // e.g. 'GPS Telematics', 'Maintenance WO', 'Fuel Sensor', 'Vehicle Inspection'
  targetId?: string; // e.g. 'V-001' or 'WO-2026-0805'
  title: string;
  description: string;
  dataTimestamp?: string;
  confidence?: AIConfidenceLevel;
  routeLink?: string; // target UI route e.g. 'vehicles', 'maintenance', 'inspection'
}

export interface AIActionProposal {
  id: string;
  type: string; // e.g. 'GROUND_VEHICLE', 'CREATE_WORK_ORDER', 'ASSIGN_DRIVER', 'SEND_ALERT_NOTIFICATION'
  label: string;
  description: string;
  riskLevel: AIRiskLevel;
  requiredPermission: string;
  confirmationRequired: boolean;
  targetModule: string;
  payload: Record<string, any>;
  status?: 'PROPOSED' | 'CONFIRMED' | 'EXECUTING' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
  executionResult?: {
    success: boolean;
    message: string;
    timestamp: string;
  };
}

export interface AIStructuredChartData {
  chartType: 'bar' | 'line' | 'pie' | 'radar';
  title: string;
  labels: string[];
  datasets: Array<{
    name: string;
    data: number[];
    color?: string;
  }>;
}

export interface AIStructuredTableData {
  title: string;
  columns: Array<{ key: string; label: string }>;
  rows: Array<Record<string, any>>;
}

export interface AIStructuredKpiData {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendPercent?: number;
  statusColor?: 'emerald' | 'amber' | 'rose' | 'cyan';
}

export interface AIResponse {
  id: string;
  requestId: string;
  type: AIResponseType;
  content: string;
  summary: string;
  confidence: AIConfidenceLevel;
  factType?: AIFactualityType;
  sources: AISourceCitation[];
  actions: AIActionProposal[];
  warnings: string[];
  toolCalls?: Array<{
    toolId: string;
    name: string;
    category: AIToolCategory;
    arguments: Record<string, any>;
    executionTimeMs: number;
    status: 'SUCCESS' | 'PERMISSION_DENIED' | 'FAILED';
  }>;
  chartData?: AIStructuredChartData;
  tableData?: AIStructuredTableData;
  kpis?: AIStructuredKpiData[];
  dataFreshness?: {
    lastGpsUpdate?: string;
    isStale?: boolean;
    staleWarning?: string;
  };
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedCostIdr: number;
    provider: string;
    model: string;
    latencyMs: number;
  };
  createdAt: string;
}

export interface AIUserContext {
  userId: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  branchId?: string;
  branchName?: string;
  departmentId?: string;
  language: string;
  timezone: string;
}

export interface AITenantContext {
  tenantId: string;
  companyName: string;
  industry: string;
  fleetSize: number;
  activeModules: string[];
  aiPolicy: AIPolicyMode;
  aiEnabled: boolean;
}

export interface AIFullContext {
  user: AIUserContext;
  tenant: AITenantContext;
  vehicle?: any;
  driver?: any;
  gps?: any;
  trip?: any;
  maintenance?: any;
  safety?: any;
  fuel?: any;
  inspection?: any;
  delivery?: any;
  historicalAlerts?: any[];
  activeAlerts?: any[];
  memorySummary?: string;
  dataTimestamp: string;
}

export interface AIToolDefinition {
  toolId: string;
  name: string;
  description: string;
  category: AIToolCategory;
  requiredPermission: string;
  tenantScope: boolean;
  riskLevel: AIRiskLevel;
  parameters: Array<{
    name: string;
    type: 'string' | 'number' | 'boolean' | 'array' | 'object';
    description: string;
    required: boolean;
  }>;
  execute: (args: any, context: AIFullContext) => Promise<any> | any;
}

export interface AIAuditLog {
  id: string;
  tenantId: string;
  userId: string;
  userName: string;
  userRole: string;
  requestId: string;
  action: string;
  capability: string;
  inputSummary: string;
  toolsUsed: string[];
  model: string;
  provider: string;
  responseSummary: string;
  permissionDecision: 'ALLOWED' | 'DENIED' | 'RESTRICTED';
  executionStatus: 'SUCCESS' | 'FAILED' | 'FALLBACK';
  riskLevel: AIRiskLevel;
  latencyMs: number;
  tokensUsed: number;
  estimatedCostIdr: number;
  createdAt: string;
}

export interface AIUsageMetrics {
  totalRequests: number;
  totalTokens: number;
  totalEstimatedCostIdr: number;
  dailyRequests: Array<{ date: string; requests: number; tokens: number; costIdr: number }>;
  topUsers: Array<{ userId: string; name: string; requestsCount: number }>;
  topTools: Array<{ toolId: string; name: string; callsCount: number }>;
  topIntents: Array<{ intent: string; count: number }>;
  providerSuccessRate: {
    gemini: number;
    ruleEngineFallback: number;
    overall: number;
  };
}

export interface AIProviderHealth {
  provider: string;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  model: string;
  latencyAvgMs: number;
  successRate: number;
  lastChecked: string;
  errorCount: number;
}

export interface TenantAISettings {
  aiEnabled: boolean;
  aiChat: boolean;
  aiRecommendations: boolean;
  aiImageAnalysis: boolean;
  aiActions: boolean;
  aiNotifications: boolean;
  aiMemory: boolean;
  aiPolicy: AIPolicyMode;
  primaryModel: string;
  fallbackModel: string;
  maxTokens: number;
  temperature: number;
  rateLimitPerMinute: number;
  rateLimitPerUserPerDay: number;
}

export interface AIConversation {
  id: string;
  tenantId: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: AIMessage[];
}

export interface AIMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  responseObject?: AIResponse;
  toolCalls?: any[];
  toolResults?: any[];
  createdAt: string;
}

export interface VehicleRiskScore {
  vehicleId: string;
  plateNumber: string;
  brand: string;
  model: string;
  riskLevel: AIRiskLevel;
  riskScore: number; // 0 - 100
  factors: {
    gpsAnomalies: number;
    driverBehaviorRisk: number;
    maintenanceOverdue: number;
    inspectionDefects: number;
    fuelDrainRisk: number;
    safetyIncidents: number;
  };
  keyIssues: string[];
  recommendedAction: string;
}

export interface DailyBriefing {
  date: string;
  greeting: string;
  fleetStatus: {
    totalVehicles: number;
    activeMoving: number;
    idleExcess: number;
    offline: number;
    underMaintenance: number;
    grounded: number;
  };
  criticalPriorities: Array<{
    id: string;
    title: string;
    description: string;
    module: string;
    actionLabel: string;
    actionType: string;
    vehicleId?: string;
  }>;
  operationalHighlights: string[];
  weatherOrTrafficRiskSummary: string;
  costEfficiencySummary: string;
  generatedAt: string;
}
