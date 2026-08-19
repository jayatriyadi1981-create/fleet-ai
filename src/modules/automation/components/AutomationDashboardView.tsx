/**
 * Fleet Intelligence Smart AI - Automation Dashboard Overview View
 * PROMPT 35 - Section 80
 */

import React, { useState } from 'react';
import {
  Zap,
  Play,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  Fuel,
  Wrench,
  Radio,
  Sliders,
  ChevronRight,
  TrendingUp,
  Activity,
  Layers,
} from 'lucide-react';
import { useAutomation } from '../context/AutomationContext';
import { AutomationStatsGrid } from './AutomationStatsGrid';
import { AutomationDryRunModal } from './AutomationDryRunModal';

export const AutomationDashboardView: React.FC = () => {
  const {
    workflows,
    executions,
    templates,
    setActiveTab,
    setSelectedWorkflow,
    setSelectedExecution,
    toggleWorkflowStatus,
    triggerManualEvent,
  } = useAutomation();

  const [showSimulator, setShowSimulator] = useState(false);
  const [triggeringEventType, setTriggeringEventType] = useState<string | null>(null);
  const [triggerSuccessMsg, setTriggerSuccessMsg] = useState<string | null>(null);

  const activeWorkflows = workflows.filter((w) => w.status === 'ACTIVE');
  const recentExecutions = executions.slice(0, 8);

  const handleQuickTrigger = async (eventType: any, entityName: string, payload: any) => {
    setTriggeringEventType(eventType);
    try {
      const res = await triggerManualEvent({
        eventType,
        entityName,
        payload,
      });
      if (res) {
        setTriggerSuccessMsg(`Event [${eventType}] terpicu untuk ${entityName}! Status: ${res.status}`);
        setTimeout(() => setTriggerSuccessMsg(null), 4000);
      }
    } finally {
      setTriggeringEventType(null);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'SAFETY':
        return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
      case 'MAINTENANCE':
        return <Wrench className="w-4 h-4 text-amber-500" />;
      case 'FUEL':
        return <Fuel className="w-4 h-4 text-orange-500" />;
      case 'TELEMATICS':
        return <Radio className="w-4 h-4 text-blue-500" />;
      default:
        return <Sliders className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div id="automation-dashboard-view" className="p-4 sm:p-6 space-y-6">
      {/* 1. Top KPI Summary */}
      <AutomationStatsGrid />

      {/* Trigger Notification Toast */}
      {triggerSuccessMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 p-3 rounded-xl flex items-center justify-between text-xs font-semibold animate-fade-in shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{triggerSuccessMsg}</span>
          </div>
          <button
            onClick={() => setActiveTab('logs')}
            className="underline hover:text-emerald-100 font-bold"
          >
            Lihat Execution Log →
          </button>
        </div>
      )}

      {/* 2. Interactive Testing & Real-Time Event Bus Simulator Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-4 sm:p-5 text-white border border-indigo-900/40 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-amber-400/20 text-amber-300">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-white tracking-tight">
                Live Telematics Event Bus & Simulator
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                READY TO TEST
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Picu pengujian event IoT/Telematika instan untuk menguji evaluasi AST aturan kondisi, inferensi AI, dan tindakan otomatis.
            </p>
          </div>

          {/* Quick Simulation Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() =>
                handleQuickTrigger('OVERSPEED', 'Truk Fuso (B-9981-TX)', {
                  speed: 96,
                  speedLimit: 80,
                  driverSafetyScore: 65,
                  roadType: 'Tol Cipali KM 95',
                })
              }
              disabled={triggeringEventType !== null}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-rose-300 border border-rose-500/30 transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 text-rose-400" />
              Test Overspeed 96 km/h
            </button>

            <button
              onClick={() =>
                handleQuickTrigger('MAINTENANCE_RISK_HIGH', 'Isuzu Giga (D-8821-XZ)', {
                  healthScore: 58,
                  daysOverdue: 12,
                  engineTemp: 104,
                  brakeWearPercent: 86,
                })
              }
              disabled={triggeringEventType !== null}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-300 border border-amber-500/30 transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <Wrench className="w-3.5 h-3.5 text-amber-400" />
              Test Maintenance High Risk
            </button>

            <button
              onClick={() =>
                handleQuickTrigger('FUEL_ANOMALY', 'Hino Ranger (L-9022-US)', {
                  dropPercent: 19,
                  isEngineOff: true,
                  locationType: 'Bahu Jalan Tol',
                })
              }
              disabled={triggeringEventType !== null}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-orange-300 border border-orange-500/30 transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <Fuel className="w-3.5 h-3.5 text-orange-400" />
              Test Fuel Drop 19%
            </button>

            <button
              onClick={() => setShowSimulator(true)}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              Simulator Lengkap
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Dashboard Layout (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 Cols): Active Workflows Management */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Active Automation Workflows
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                {activeWorkflows.length} Aktif
              </span>
            </div>
            <button
              onClick={() => setActiveTab('workflows')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              Lihat Semua ({workflows.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {activeWorkflows.slice(0, 4).map((wf) => (
              <div
                key={wf.id}
                id={`wf-card-${wf.id}`}
                className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-500 transition space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                      {getCategoryIcon(wf.category)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{wf.name}</h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.2 rounded-full uppercase ${
                            wf.priority === 'CRITICAL'
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                              : wf.priority === 'HIGH'
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {wf.priority}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">v{wf.version}.0</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {wf.description}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => toggleWorkflowStatus(wf.id, wf.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE')}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      wf.status === 'ACTIVE' ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                    title={wf.status === 'ACTIVE' ? 'Jeda workflow' : 'Aktifkan workflow'}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        wf.status === 'ACTIVE' ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Node Pipeline Preview Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                  {wf.nodes.slice(0, 5).map((node, nIdx) => (
                    <React.Fragment key={node.id}>
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                        {node.label}
                      </span>
                      {nIdx < Math.min(wf.nodes.length - 1, 4) && (
                        <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                  {wf.nodes.length > 5 && (
                    <span className="text-[10px] text-slate-400 shrink-0 font-bold">
                      +{wf.nodes.length - 5} steps
                    </span>
                  )}
                </div>

                {/* Performance Metrics Footer */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                      <b>{wf.metrics.totalExecutions}</b> runs
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <b>
                        {wf.metrics.totalExecutions > 0
                          ? `${Math.round((wf.metrics.successCount / wf.metrics.totalExecutions) * 100)}%`
                          : '100%'}
                      </b>{' '}
                      sukses
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-purple-500" />
                      <b>{wf.metrics.avgDurationMs}ms</b>
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedWorkflow(wf);
                      setActiveTab('builder');
                    }}
                    className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-0.5"
                  >
                    Edit Workflow <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Template Library Section */}
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Katalog Template Siap Pakai
                </h4>
              </div>
              <button
                onClick={() => setActiveTab('templates')}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                Lihat 10 Template →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {templates.slice(0, 4).map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => {
                    setActiveTab('templates');
                  }}
                  className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-indigo-400 cursor-pointer transition shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                      {tpl.category}
                    </span>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 mt-0.5">
                      {tpl.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                      {tpl.description}
                    </p>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                    <span>~{tpl.estimatedAITokens} tokens</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">Gunakan Template →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols): Real-time Execution Feed */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Live Execution Logs
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('logs')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Semua Log →
            </button>
          </div>

          <div className="space-y-2.5">
            {recentExecutions.map((exec) => (
              <div
                key={exec.id}
                id={`exec-feed-${exec.id}`}
                onClick={() => {
                  setSelectedExecution(exec);
                  setActiveTab('logs');
                }}
                className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 transition cursor-pointer shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        exec.status === 'SUCCESS'
                          ? 'bg-emerald-500'
                          : exec.status === 'FAILED'
                          ? 'bg-rose-500 animate-ping'
                          : 'bg-amber-500'
                      }`}
                    />
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {exec.automationName}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      exec.status === 'SUCCESS'
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : exec.status === 'FAILED'
                        ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {exec.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="truncate font-medium">{exec.entityLabel}</span>
                  <span className="font-mono text-[11px] text-slate-400">{exec.durationMs}ms</span>
                </div>

                {/* AI Reasoning Pill if present */}
                {exec.steps.some((s) => s.aiResult) && (
                  <div className="bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/60 rounded-lg p-2 text-[11px] text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-1.5 font-bold text-indigo-700 dark:text-indigo-300 mb-0.5">
                      <Sparkles className="w-3 h-3 text-indigo-500" />
                      AI Intelligence Evaluation ({exec.steps.find((s) => s.aiResult)?.aiResult?.risk} Risk)
                    </div>
                    <p className="line-clamp-2 text-slate-600 dark:text-slate-400">
                      {exec.steps.find((s) => s.aiResult)?.aiResult?.reason}
                    </p>
                  </div>
                )}

                {exec.error && (
                  <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-lg p-2 text-[11px] text-rose-700 dark:text-rose-300">
                    <b>Error:</b> {exec.error}
                  </div>
                )}

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>Pemicu: {exec.triggeredBy}</span>
                  <span>{new Date(exec.startedAt).toLocaleTimeString('id-ID')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showSimulator && <AutomationDryRunModal onClose={() => setShowSimulator(false)} />}
    </div>
  );
};
