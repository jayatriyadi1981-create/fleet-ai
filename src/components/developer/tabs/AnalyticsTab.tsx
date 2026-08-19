import React from 'react';
import {
  Activity,
  Zap,
  Clock,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Layers,
} from 'lucide-react';
import { ApiUsageMetrics } from '../../../types/externalApi';
import { useFleet } from '../../../context/FleetContext';

interface AnalyticsTabProps {
  metrics: ApiUsageMetrics;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ metrics }) => {
  const { currentTenant } = useFleet();

  const quotaLimit = 100000;
  const quotaUsed = metrics.totalRequests;
  const quotaPercent = Math.min(100, Math.round((quotaUsed / quotaLimit) * 100));
  const successRate = metrics.totalRequests > 0
    ? ((metrics.successfulRequests / metrics.totalRequests) * 100)
    : 100;

  const statusEntries = Object.entries(metrics.statusCodes || {});

  return (
    <div className="space-y-6">
      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total API Requests</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {metrics.totalRequests.toLocaleString('id-ID')}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.2% dari 7 hari lalu</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Success Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            {successRate.toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-400">
            {metrics.successfulRequests} sukses / {metrics.errorRequests} error
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Latency (RTT)</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {metrics.avgLatency} <span className="text-xs font-normal text-slate-400">ms</span>
          </div>
          <div className="text-[11px] text-slate-400">
            p95: {metrics.p95Latency}ms • p99: {metrics.p99Latency}ms
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Subscription Tier</span>
            <Zap className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            ENTERPRISE
          </div>
          <div className="text-[11px] text-cyan-400 truncate">
            Tenant: {currentTenant.name}
          </div>
        </div>
      </div>

      {/* Quota Consumption Bar Card */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Pemakaian Quota Bulanan (Enterprise Tier)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Reset billing cycle berikutnya pada tanggal 1 bulan depan.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-white font-mono">
              {quotaUsed.toLocaleString()} / {quotaLimit.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 ml-1.5">({quotaPercent}%)</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-3 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              quotaPercent > 90
                ? 'bg-rose-500'
                : quotaPercent > 70
                ? 'bg-amber-500'
                : 'bg-cyan-500'
            }`}
            style={{ width: `${quotaPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span>0 req</span>
          <span>50% Threshold</span>
          <span>{quotaLimit.toLocaleString()} Max</span>
        </div>
      </div>

      {/* Two Columns: Status Codes & Top Endpoints */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Codes Distribution */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>Distribusi HTTP Status Code</span>
          </h3>

          <div className="space-y-3">
            {statusEntries.map(([codeLabel, count]) => {
              const pct = metrics.totalRequests > 0 ? Math.round((count / metrics.totalRequests) * 100) : 0;
              return (
                <div key={codeLabel} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-white">{codeLabel}</span>
                    <span className="text-slate-400 font-mono">
                      {count.toLocaleString()} req ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        codeLabel.startsWith('2')
                          ? 'bg-emerald-500'
                          : codeLabel.startsWith('4')
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.max(3, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Endpoints by Request Count */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Top API Endpoints Terpopuler</span>
          </h3>

          <div className="space-y-2">
            {metrics.topEndpoints.map(ep => (
              <div
                key={ep.endpoint}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <span className="font-mono text-cyan-300 truncate">{ep.endpoint}</span>
                <span className="font-mono font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {ep.count.toLocaleString()} req
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
