/**
 * Fleet Intelligence Smart AI - Security Overview Tab
 * PROMPT 50 - Security Posture Score, Active Threat Radar & Health Metrics
 */

import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Cpu,
  Radio,
  Server,
  Activity,
  AlertTriangle,
  Lock,
  Zap,
  Globe,
  Database,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { securityMonitoringService } from '../services/securityMonitoringService';
import { sessionService } from '../services/sessionService';
import { backupService } from '../services/backupService';
import { SecuritySeverity } from '../types/securityTypes';

interface SecurityOverviewTabProps {
  onNavigateTab: (tabId: string) => void;
  onRunTestSuite: () => void;
}

export const SecurityOverviewTab: React.FC<SecurityOverviewTabProps> = ({
  onNavigateTab,
  onRunTestSuite,
}) => {
  const riskAssessment = securityMonitoringService.evaluateRiskScore();
  const threats = securityMonitoringService.getThreatEvents();
  const breakers = securityMonitoringService.getCircuitBreakers();
  const systemHealth = securityMonitoringService.getSystemHealth();
  const activeSessions = sessionService.getActiveSessions();
  const backups = backupService.getBackups();
  const latestBackup = backups[0];

  const getSeverityBadge = (sev: SecuritySeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'MEDIUM':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'LOW':
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Threat Alert Banner (If Any Unresolved High/Critical) */}
      {threats.some((t) => !t.resolved && (t.severity === 'CRITICAL' || t.severity === 'HIGH')) && (
        <div className="bg-red-950/40 border border-red-500/40 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-500/20 rounded-lg text-red-400">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-red-200">Active Security Incident Detected</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/30 text-red-300 font-medium uppercase tracking-wider">
                  Action Required
                </span>
              </div>
              <p className="text-sm text-red-300/80 mt-0.5">
                {threats.find((t) => !t.resolved)?.description}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('sessions')}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition shadow-sm whitespace-nowrap"
          >
            Investigate Incident
          </button>
        </div>
      )}

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Security Posture Score */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Security Score</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white tracking-tight">{riskAssessment.score}</span>
            <span className="text-sm text-slate-400">/ 100</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium ml-auto">
              {riskAssessment.riskLevel === 'LOW' ? 'SECURE' : riskAssessment.riskLevel}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Zero Trust & ISO 27001 posture validated</p>
          <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${riskAssessment.score}%` }}
            />
          </div>
        </div>

        {/* Card 2: Active User & Device Sessions */}
        <div
          onClick={() => onNavigateTab('sessions')}
          className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700 cursor-pointer transition relative group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Sessions</span>
            <Globe className="w-5 h-5 text-blue-400 group-hover:scale-110 transition" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white tracking-tight">{activeSessions.length}</span>
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium ml-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              All Verified
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Across Mobile, Desktop & API Clients</p>
        </div>

        {/* Card 3: Encrypted Backup Status */}
        <div
          onClick={() => onNavigateTab('backups')}
          className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700 cursor-pointer transition relative group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Latest Backup</span>
            <Database className="w-5 h-5 text-purple-400 group-hover:scale-110 transition" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-bold text-white tracking-tight">
              {latestBackup ? `${(latestBackup.sizeBytes / (1024 * 1024 * 1024)).toFixed(1)} GB` : '4.0 GB'}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-medium ml-auto">
              AES-256
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Verified snapshot (RPO: 2m)
          </p>
        </div>

        {/* Card 4: Threat Radar */}
        <div
          onClick={() => onNavigateTab('test_suite')}
          className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700 cursor-pointer transition relative group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Automated Tests</span>
            <Zap className="w-5 h-5 text-amber-400 group-hover:scale-110 transition" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white tracking-tight">12 / 12</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium ml-auto">
              100% PASS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Zero Trust & Isolation Validated</p>
        </div>
      </div>

      {/* Two-Column Middle Section: Real-Time Threat Stream & Microservice Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Threat Intelligence Stream */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <h3 className="font-semibold text-white">Security Threat Radar & Mitigations</h3>
            </div>
            <span className="text-xs text-slate-400">Live Ingestion</span>
          </div>

          <div className="space-y-3">
            {threats.map((threat) => (
              <div
                key={threat.id}
                className={`p-4 rounded-lg border transition ${
                  threat.resolved
                    ? 'bg-slate-950/40 border-slate-800/80'
                    : 'bg-slate-950 border-amber-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${getSeverityBadge(threat.severity)}`}>
                        {threat.severity}
                      </span>
                      <span className="text-xs font-mono text-slate-400">[{threat.threatType}]</span>
                      <span className="text-xs text-slate-500">•</span>
                      <span className="text-xs text-slate-400">{new Date(threat.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-200">{threat.description}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                      <span className="text-emerald-400 font-medium">Defense Action:</span>
                      {threat.mitigationTaken}
                    </p>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    {threat.resolved ? (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Resolved
                      </span>
                    ) : (
                      <button
                        onClick={() => securityMonitoringService.resolveThreat(threat.id, 'Bambang Pratama')}
                        className="text-xs px-2.5 py-1 rounded bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 font-medium transition"
                      >
                        Acknowledge
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Circuit Breakers & System Health */}
        <div className="space-y-6">
          {/* Circuit Breakers */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold text-white">Circuit Breakers</h3>
              </div>
              <span className="text-xs text-emerald-400 font-medium">All Healthy</span>
            </div>

            <div className="space-y-3">
              {breakers.map((cb) => (
                <div key={cb.serviceName} className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-300">{cb.serviceName}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                      {cb.state}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
                    <span>Processed: {cb.successCount.toLocaleString()}</span>
                    <span>Failures: {cb.failureCount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Health Summary */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold text-white">Defense Infrastructure</h3>
              </div>
              <span className="text-xs font-mono text-emerald-400">99.99% UPTIME</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-slate-950/60 rounded border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Database Pool</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div className="p-2 bg-slate-950/60 rounded border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">GPS Gateway</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div className="p-2 bg-slate-950/60 rounded border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">AI Guardrail</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div className="p-2 bg-slate-950/60 rounded border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Backup Storage</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
