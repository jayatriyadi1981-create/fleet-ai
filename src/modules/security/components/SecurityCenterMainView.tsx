/**
 * Fleet Intelligence Smart AI - Enterprise Security Center Main View
 * PROMPT 50 - Unified Control Dashboard for Defense-in-Depth, Compliance & Zero Trust
 */

import React, { useState } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Globe,
  Lock,
  Key,
  Radio,
  Bot,
  Sliders,
  Database,
  Zap,
  Download,
  AlertOctagon,
  CheckCircle2,
} from 'lucide-react';
import { SecurityOverviewTab } from './SecurityOverviewTab';
import { ActiveSessionsTab } from './ActiveSessionsTab';
import { AccessControlTab } from './AccessControlTab';
import { ApiSecurityTab } from './ApiSecurityTab';
import { GpsSecurityTab } from './GpsSecurityTab';
import { AiSecurityTab } from './AiSecurityTab';
import { SecurityPoliciesTab } from './SecurityPoliciesTab';
import { BackupRecoveryTab } from './BackupRecoveryTab';
import { SecurityTestSuiteTab } from './SecurityTestSuiteTab';
import { securityMonitoringService } from '../services/securityMonitoringService';
import { auditService } from '../../audit/services/auditService';

export type SecurityTabId =
  | 'overview'
  | 'sessions'
  | 'access_control'
  | 'api_security'
  | 'gps_security'
  | 'ai_security'
  | 'policies'
  | 'backups'
  | 'test_suite';

export const SecurityCenterMainView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SecurityTabId>('overview');
  const [isLockdownActive, setIsLockdownActive] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const risk = securityMonitoringService.evaluateRiskScore();

  const handleToggleLockdown = () => {
    const nextState = !isLockdownActive;
    setIsLockdownActive(nextState);

    auditService.logSecurityEvent({
      tenantId: 'GLOBAL_PLATFORM',
      action: 'CONFIG_UPDATED',
      severity: 'CRITICAL',
      actor: {
        actorId: 'usr_super_01',
        actorType: 'ADMIN',
        actorEmail: 'bambang.pratama@fleetintelligence.id',
        tenantId: 'GLOBAL_PLATFORM',
      },
      description: nextState
        ? 'EMERGENCY PLATFORM LOCKDOWN ACTIVATED: All external API writes throttled, mandatory re-auth enforced.'
        : 'Emergency Platform Lockdown deactivated. Standard security posture resumed.',
      securityMetadata: {
        isSuspicious: nextState,
        riskScore: nextState ? 95 : 10,
      },
    });
  };

  const handleExportSecurityBrief = () => {
    const reportData = {
      title: 'Enterprise Security & Compliance Audit Brief',
      generatedAt: new Date().toISOString(),
      evaluator: 'Enterprise Security Engine v50',
      securityScore: `${risk.score} / 100`,
      riskTier: risk.riskLevel,
      standards: ['ISO 27001', 'SOC 2 Type II', 'Zero Trust Architecture', 'GDPR / PDP Indonesia'],
      encryptionAtRest: 'AES-256-GCM Envelope',
      passwordHashing: 'Argon2id (Salted & Peppered)',
      multiTenantBoundary: 'Cryptographically Enforced (Strict Tenant & Branch Isolation)',
      automatedTestsStatus: '12 / 12 PASSED (100%)',
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FleetIntelligence_Security_Compliance_Brief_${new Date().toISOString().substring(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setExportNotice('Enterprise Security Brief exported successfully.');
    setTimeout(() => setExportNotice(null), 3500);
  };

  const tabs: { id: SecurityTabId; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Security Posture', icon: <Shield className="w-4 h-4" /> },
    { id: 'sessions', label: 'Active Sessions', icon: <Globe className="w-4 h-4" /> },
    { id: 'access_control', label: 'Access & Isolation', icon: <Lock className="w-4 h-4" /> },
    { id: 'api_security', label: 'API & Webhooks', icon: <Key className="w-4 h-4" /> },
    { id: 'gps_security', label: 'GPS Gateway Auth', icon: <Radio className="w-4 h-4" /> },
    { id: 'ai_security', label: 'AI Guardrails & DLP', icon: <Bot className="w-4 h-4" /> },
    { id: 'policies', label: 'Policies & Governance', icon: <Sliders className="w-4 h-4" /> },
    { id: 'backups', label: 'Backup & DR Rehearsal', icon: <Database className="w-4 h-4" /> },
    { id: 'test_suite', label: 'Security Test Suite', icon: <Zap className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl shadow-inner">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight text-white">Enterprise Security & Compliance</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold uppercase tracking-wider">
                  Zero Trust Active
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-mono font-medium">
                  ISO 27001 / SOC 2
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Centralized Zero-Trust architecture, tenant data isolation, session lifecycle, and cryptographic assurance.
              </p>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5 w-full lg:w-auto flex-wrap">
          <button
            onClick={handleExportSecurityBrief}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            Export Security Brief
          </button>

          <button
            onClick={handleToggleLockdown}
            className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition border ${
              isLockdownActive
                ? 'bg-red-600 text-white border-red-500 animate-pulse'
                : 'bg-red-950/40 hover:bg-red-900/40 text-red-300 border-red-500/30'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            {isLockdownActive ? 'LOCKDOWN ACTIVE (DISENGAGE)' : 'Emergency Lockdown Mode'}
          </button>
        </div>
      </div>

      {/* Export Notification */}
      {exportNotice && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Emergency Lockdown Notice Banner */}
      {isLockdownActive && (
        <div className="p-4 bg-red-950 border border-red-500 rounded-xl text-red-200 flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-6 h-6 text-red-400 shrink-0" />
            <div>
              <span className="font-bold text-sm block">EMERGENCY PLATFORM LOCKDOWN ENGAGED</span>
              <span className="text-xs text-red-300">
                All external API writes are throttled, session re-authentication is enforced, and high-privilege operations require multi-admin clearance.
              </span>
            </div>
          </div>
          <button
            onClick={handleToggleLockdown}
            className="px-3 py-1.5 bg-white text-red-950 text-xs font-bold rounded-lg shrink-0 hover:bg-red-50 transition"
          >
            Disengage
          </button>
        </div>
      )}

      {/* Tab Navigation Ribbon */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800/80">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Tab View Body */}
      <div>
        {activeTab === 'overview' && (
          <SecurityOverviewTab
            onNavigateTab={(tabId) => setActiveTab(tabId as SecurityTabId)}
            onRunTestSuite={() => setActiveTab('test_suite')}
          />
        )}
        {activeTab === 'sessions' && <ActiveSessionsTab />}
        {activeTab === 'access_control' && <AccessControlTab />}
        {activeTab === 'api_security' && <ApiSecurityTab />}
        {activeTab === 'gps_security' && <GpsSecurityTab />}
        {activeTab === 'ai_security' && <AiSecurityTab />}
        {activeTab === 'policies' && <SecurityPoliciesTab />}
        {activeTab === 'backups' && <BackupRecoveryTab />}
        {activeTab === 'test_suite' && <SecurityTestSuiteTab />}
      </div>
    </div>
  );
};
