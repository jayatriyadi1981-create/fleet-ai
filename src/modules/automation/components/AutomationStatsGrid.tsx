/**
 * Fleet Intelligence Smart AI - Automation Statistics KPI Grid
 * PROMPT 35 - Section 80, 81
 */

import React from 'react';
import {
  Workflow,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { useAutomation } from '../context/AutomationContext';

export const AutomationStatsGrid: React.FC = () => {
  const { healthStats, workflows, setActiveTab } = useAutomation();

  const totalWorkflows = workflows.length;

  return (
    <div id="automation-stats-grid" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
      {/* 1. Active Workflows */}
      <div
        id="stat-active-workflows"
        onClick={() => setActiveTab('workflows')}
        className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-400 transition cursor-pointer"
      >
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider">Active Workflows</span>
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Workflow className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-slate-900 dark:text-white">{healthStats.totalActive}</span>
          <span className="text-xs text-slate-400">/ {totalWorkflows} total</span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{healthStats.healthyCount} Sehat • {healthStats.disabledCount} Terjeda</span>
        </div>
      </div>

      {/* 2. Executions Today */}
      <div
        id="stat-executions-today"
        onClick={() => setActiveTab('logs')}
        className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-400 transition cursor-pointer"
      >
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider">Executions Today</span>
          <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Zap className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            {healthStats.totalExecutionsToday.toLocaleString()}
          </span>
          <span className="text-xs text-slate-400">runs</span>
        </div>
        <div className="mt-1 text-[11px] text-blue-600 dark:text-blue-400 font-medium">
          Rata-rata ~1.4 event / menit
        </div>
      </div>

      {/* 3. Success Rate */}
      <div
        id="stat-success-rate"
        className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
      >
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider">Success Rate</span>
          <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {healthStats.successRatePercent}%
          </span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400">
          Toleransi SLA Enterprise 99.5%
        </div>
      </div>

      {/* 4. Avg Latency */}
      <div
        id="stat-avg-latency"
        className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
      >
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider">Avg Latency</span>
          <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            {healthStats.avgExecutionTimeMs}
          </span>
          <span className="text-xs text-slate-400">ms / run</span>
        </div>
        <div className="mt-1 text-[11px] text-purple-600 dark:text-purple-400 font-medium">
          Rule First Heuristic Optimasi
        </div>
      </div>

      {/* 5. AI Token Usage & Cost */}
      <div
        id="stat-ai-tokens"
        className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
      >
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider">AI Tokens & Cost</span>
          <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            {(healthStats.aiTokensUsedToday / 1000).toFixed(1)}k
          </span>
          <span className="text-xs text-slate-400">tokens</span>
        </div>
        <div className="mt-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
          ~Rp {healthStats.estimatedAICostTodayIdr.toLocaleString('id-ID')} hari ini
        </div>
      </div>

      {/* 6. Failed Automations */}
      <div
        id="stat-failed-automations"
        onClick={() => setActiveTab('failed')}
        className={`p-3.5 rounded-xl border shadow-sm transition cursor-pointer ${
          healthStats.failingCount > 0
            ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 hover:border-rose-400'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
        }`}
      >
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider">Failed Errors</span>
          <div
            className={`p-1.5 rounded-lg ${
              healthStats.failingCount > 0
                ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span
            className={`text-2xl font-bold ${
              healthStats.failingCount > 0
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            {healthStats.failingCount}
          </span>
          <span className="text-xs text-slate-400">cases</span>
        </div>
        <div className="mt-1 text-[11px] font-medium text-rose-600 dark:text-rose-400">
          {healthStats.failingCount > 0 ? 'Buka triage perbaikan →' : 'Sistem beroperasi normal'}
        </div>
      </div>
    </div>
  );
};
