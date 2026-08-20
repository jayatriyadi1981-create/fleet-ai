import React, { useState, useEffect } from 'react';
import {
  Code2,
  KeyRound,
  BookOpen,
  Webhook,
  BarChart3,
  Radio,
  Sparkles,
  ShieldCheck,
  Zap,
  Globe,
  ExternalLink,
  Layers,
  Terminal,
  Lock,
} from 'lucide-react';
import { APIKeyRecord, WebhookSubscription, WebhookDeliveryLog, ApiUsageRecord, ApiUsageMetrics } from '../../types/externalApi';
import { apiKeyService } from '../../services/api/apiKeyService';
import { webhookService } from '../../services/api/webhookService';
import { apiUsageService } from '../../services/api/apiUsageService';
import { useFleet } from '../../context/FleetContext';

import { OverviewTab } from './tabs/OverviewTab';
import { ApiKeysTab } from './tabs/ApiKeysTab';
import { ApiExplorerTab } from './tabs/ApiExplorerTab';
import { WebhooksTab } from './tabs/WebhooksTab';
import { AnalyticsTab } from './tabs/AnalyticsTab';
import { LiveLogsTab } from './tabs/LiveLogsTab';
import { SandboxTab } from './tabs/SandboxTab';
import { AutomatedTestsTab } from './tabs/AutomatedTestsTab';
import { IntegrationTestingTab } from './tabs/IntegrationTestingTab';
import { SecurityAuditTab } from './tabs/SecurityAuditTab';
import { ProductionReadinessTab } from './tabs/ProductionReadinessTab';
import { FinalMasterAuditTab } from './tabs/FinalMasterAuditTab';

export const DeveloperPortalMainView: React.FC = () => {
  const { currentTenant } = useFleet();
  const [activeTab, setActiveTab] = useState<string>('master_audit');

  // State data
  const [apiKeys, setApiKeys] = useState<APIKeyRecord[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookSubscription[]>([]);
  const [deliveryLogs, setDeliveryLogs] = useState<WebhookDeliveryLog[]>([]);
  const [liveLogs, setLiveLogs] = useState<ApiUsageRecord[]>([]);
  const [metrics, setMetrics] = useState<ApiUsageMetrics>(apiUsageService.getUsageMetrics(currentTenant.id));

  const refreshData = () => {
    setApiKeys(apiKeyService.getKeys(currentTenant.id));
    setWebhooks(webhookService.getSubscriptions(currentTenant.id));
    setDeliveryLogs(webhookService.getDeliveryLogs(currentTenant.id));
    setLiveLogs(apiUsageService.getLogs(currentTenant.id));
    setMetrics(apiUsageService.getUsageMetrics(currentTenant.id));
  };

  useEffect(() => {
    refreshData();
  }, [currentTenant.id]);

  const navTabs = [
    { id: 'master_audit', label: 'Master System QA (PROMPT 60)', icon: ShieldCheck, badge: '100%' },
    { id: 'production_readiness', label: 'Production Readiness & Health', icon: ShieldCheck, badge: 'PROD' },
    { id: 'overview', label: 'Overview & Quickstart', icon: Sparkles },
    { id: 'api_keys', label: 'API Keys', icon: KeyRound, badge: apiKeys.filter(k => k.status === 'ACTIVE').length },
    { id: 'api_explorer', label: 'API Explorer (OpenAPI 3.0)', icon: BookOpen },
    { id: 'webhooks', label: 'Webhooks', icon: Webhook, badge: webhooks.length },
    { id: 'analytics', label: 'Usage & Quotas', icon: BarChart3 },
    { id: 'logs', label: 'Live Logs', icon: Radio },
    { id: 'sandbox', label: 'Sandbox (ERP Sim)', icon: Zap },
    { id: 'tests', label: 'API Unit Tests', icon: ShieldCheck },
    { id: 'integration', label: 'Cross-Module Tests', icon: Layers },
    { id: 'security', label: 'Security & Pen-Audit', icon: Lock },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Code2 className="w-6 h-6" />
              </div>
              <span>External API & Developer Platform</span>
            </h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm">
            Gateway integrasi enterprise untuk sistem ERP, TMS, WMS, HRIS, IoT, dan Mobile Apps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/api/docs"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-all"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>OpenAPI Spec (JSON)</span>
            <ExternalLink className="w-3 h-3 text-slate-500 ml-0.5" />
          </a>
        </div>
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-900/90 border border-slate-800 overflow-x-auto shadow-lg">
        {navTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isActive ? 'bg-slate-950 text-cyan-400' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      <div>
        {activeTab === 'master_audit' && (
          <FinalMasterAuditTab />
        )}
        {activeTab === 'production_readiness' && (
          <ProductionReadinessTab />
        )}
        {activeTab === 'overview' && (
          <OverviewTab apiKeys={apiKeys} onNavigateTab={setActiveTab} />
        )}
        {activeTab === 'api_keys' && (
          <ApiKeysTab apiKeys={apiKeys} onRefresh={refreshData} />
        )}
        {activeTab === 'api_explorer' && (
          <ApiExplorerTab apiKeys={apiKeys} />
        )}
        {activeTab === 'webhooks' && (
          <WebhooksTab
            webhooks={webhooks}
            deliveryLogs={deliveryLogs}
            onRefresh={refreshData}
          />
        )}
        {activeTab === 'analytics' && (
          <AnalyticsTab metrics={metrics} />
        )}
        {activeTab === 'logs' && (
          <LiveLogsTab logs={liveLogs} />
        )}
        {activeTab === 'sandbox' && (
          <SandboxTab />
        )}
        {activeTab === 'tests' && (
          <AutomatedTestsTab />
        )}
        {activeTab === 'integration' && (
          <IntegrationTestingTab />
        )}
        {activeTab === 'security' && (
          <SecurityAuditTab />
        )}
      </div>
    </div>
  );
};
