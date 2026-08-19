/**
 * Fleet Intelligence Smart AI - Central AI Audit & Observability Service (Sections 57, 58, 63, 64)
 * Records and tracks AI requests, tool executions, latency, token usage, cost control,
 * without persisting secrets, keys, or raw confidential passwords.
 */

import { AIAuditLog, AIUsageMetrics, AIRiskLevel } from '../../../types/ai';

export class AIAuditService {
  private static instance: AIAuditService;
  private auditLogs: AIAuditLog[] = [];

  private constructor() {
    this.seedInitialLogs();
  }

  public static getInstance(): AIAuditService {
    if (!AIAuditService.instance) {
      AIAuditService.instance = new AIAuditService();
    }
    return AIAuditService.instance;
  }

  /**
   * Log an AI orchestration turn
   */
  public logExecution(entry: Omit<AIAuditLog, 'id' | 'createdAt'>): AIAuditLog {
    const log: AIAuditLog = {
      ...entry,
      id: `AUD-AI-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
    };

    this.auditLogs.unshift(log);
    // Keep in memory cap at 200 logs
    if (this.auditLogs.length > 200) {
      this.auditLogs.pop();
    }

    return log;
  }

  public getAuditLogs(tenantId?: string): AIAuditLog[] {
    if (!tenantId) return this.auditLogs;
    return this.auditLogs.filter((l) => l.tenantId === tenantId || l.tenantId === 't-001');
  }

  /**
   * Calculates aggregated usage metrics, cost, top users and top tools
   */
  public getUsageMetrics(tenantId?: string): AIUsageMetrics {
    const logs = this.getAuditLogs(tenantId);

    const totalRequests = logs.length;
    const totalTokens = logs.reduce((acc, l) => acc + (l.tokensUsed || 0), 0);
    const totalEstimatedCostIdr = logs.reduce((acc, l) => acc + (l.estimatedCostIdr || 0), 0);

    // Group by user
    const userMap: Record<string, { name: string; count: number }> = {};
    logs.forEach((l) => {
      if (!userMap[l.userId]) userMap[l.userId] = { name: l.userName, count: 0 };
      userMap[l.userId].count++;
    });

    const topUsers = Object.entries(userMap)
      .map(([userId, val]) => ({ userId, name: val.name, requestsCount: val.count }))
      .sort((a, b) => b.requestsCount - a.requestsCount)
      .slice(0, 5);

    // Group by tools used
    const toolMap: Record<string, number> = {};
    logs.forEach((l) => {
      (l.toolsUsed || []).forEach((t) => {
        toolMap[t] = (toolMap[t] || 0) + 1;
      });
    });

    const topTools = Object.entries(toolMap)
      .map(([toolId, count]) => ({ toolId, name: toolId, callsCount: count }))
      .sort((a, b) => b.callsCount - a.callsCount)
      .slice(0, 6);

    // Group by Intent
    const intentMap: Record<string, number> = {};
    logs.forEach((l) => {
      const act = l.action || 'General Query';
      intentMap[act] = (intentMap[act] || 0) + 1;
    });

    const topIntents = Object.entries(intentMap)
      .map(([intent, count]) => ({ intent, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    return {
      totalRequests,
      totalTokens,
      totalEstimatedCostIdr,
      dailyRequests: [
        { date: '10 Aug', requests: 42, tokens: 18500, costIdr: 4625 },
        { date: '11 Aug', requests: 58, tokens: 26400, costIdr: 6600 },
        { date: '12 Aug', requests: 64, tokens: 31200, costIdr: 7800 },
        { date: '13 Aug', requests: 51, tokens: 22800, costIdr: 5700 },
        { date: '14 Aug', requests: 79, tokens: 39500, costIdr: 9875 },
        { date: '15 Aug', requests: totalRequests || 65, tokens: totalTokens || 28400, costIdr: totalEstimatedCostIdr || 7100 },
      ],
      topUsers,
      topTools,
      topIntents,
      providerSuccessRate: {
        gemini: 0.98,
        ruleEngineFallback: 1.0,
        overall: 0.99,
      },
    };
  }

  private seedInitialLogs(): void {
    const initialSeed: Array<Omit<AIAuditLog, 'id' | 'createdAt'>> = [
      {
        tenantId: 't-001',
        userId: 'usr-001',
        userName: 'Ahmad Fauzi',
        userRole: 'fleet_manager',
        requestId: 'REQ-AI-101',
        action: 'FLEET_OFFLINE_VEHICLES',
        capability: 'GPS Intelligence',
        inputSummary: 'Kendaraan mana saja yang saat ini offline lebih dari 30 menit?',
        toolsUsed: ['getFleetLiveStatus', 'getLiveVehicleLocation'],
        model: 'gemini-2.5-flash',
        provider: 'Google Gemini 2.5 Flash Enterprise',
        responseSummary: '7 kendaraan offline terdeteksi, 3 unit prioritas tinggi di koridor Cipali & Pantura.',
        permissionDecision: 'ALLOWED',
        executionStatus: 'SUCCESS',
        riskLevel: 'LOW',
        latencyMs: 310,
        tokensUsed: 420,
        estimatedCostIdr: 105,
      },
      {
        tenantId: 't-001',
        userId: 'usr-002',
        userName: 'Siti Rahmawati',
        userRole: 'company_admin',
        requestId: 'REQ-AI-102',
        action: 'FUEL_CONSUMPTION_ANOMALY',
        capability: 'Fuel AI',
        inputSummary: 'Analisis pemborosan konsumsi BBM di depo Cikarang MM2100',
        toolsUsed: ['getFuelConsumption', 'getFleetLiveStatus'],
        model: 'gemini-2.5-flash',
        provider: 'Google Gemini 2.5 Flash Enterprise',
        responseSummary: 'Terdeteksi 14 unit mengalami excessive idle rata-rata 42 menit (potensi hemat Rp 14.8jt).',
        permissionDecision: 'ALLOWED',
        executionStatus: 'SUCCESS',
        riskLevel: 'LOW',
        latencyMs: 295,
        tokensUsed: 540,
        estimatedCostIdr: 135,
      },
      {
        tenantId: 't-001',
        userId: 'usr-003',
        userName: 'Budi Santoso',
        userRole: 'operations',
        requestId: 'REQ-AI-103',
        action: 'GROUND_VEHICLE_REQUEST',
        capability: 'Inspection & Safety AI',
        inputSummary: 'Kandangkan armada B 9821 UTX karena temuan defek rem pneumatik',
        toolsUsed: ['groundVehicle', 'getInspectionHistory'],
        model: 'deterministic-v2.5',
        provider: 'Telematics Smart Rule Engine (Built-in)',
        responseSummary: 'Usulan grounding disetujui setelah konfirmasi user dua langkah.',
        permissionDecision: 'ALLOWED',
        executionStatus: 'SUCCESS',
        riskLevel: 'HIGH',
        latencyMs: 45,
        tokensUsed: 210,
        estimatedCostIdr: 52,
      },
    ];

    initialSeed.forEach((item, idx) => {
      this.auditLogs.push({
        ...item,
        id: `AUD-SEED-${idx + 1}`,
        createdAt: new Date(Date.now() - (idx + 1) * 3600000).toISOString(),
      });
    });
  }
}

export const aiAuditService = AIAuditService.getInstance();
