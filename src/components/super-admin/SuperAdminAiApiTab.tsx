/**
 * Fleet Intelligence Smart AI - Super Admin AI & API Gateway Tab (Prompt 42)
 * Monitoring of Google Gemini AI Token Usage, LLM Compute Cost (USD/IDR),
 * Sub-Module AI Attribution, and API Gateway Performance Telemetry.
 */

import React from 'react';
import { PlatformAiApiMetrics } from '../../types/superAdmin';
import {
  Sparkles,
  Zap,
  Activity,
  DollarSign,
  TrendingUp,
  Cpu,
  Server,
  Layers,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface SuperAdminAiApiTabProps {
  aiApiMetrics: PlatformAiApiMetrics;
}

export const SuperAdminAiApiTab: React.FC<SuperAdminAiApiTabProps> = ({
  aiApiMetrics,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight">Monitoring Komputasi AI & Gateway API</h2>
        <p className="text-xs text-slate-400">
          Metrik konsumsi token Gemini 1.5 Pro & Flash, biaya inferensi AI, atribusi per modul armada, dan throughput API Gateway.
        </p>
      </div>

      {/* High-Level AI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-slate-900 to-purple-950/20 p-5 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Total AI Tokens (Bulan Ini)</span>
            <Sparkles className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white tracking-tight font-mono">
            {aiApiMetrics.totalTokensMonthly.toLocaleString('id-ID')}
          </div>
          <div className="mt-2 text-[11px] text-purple-300">
            Gemini 1.5 Pro & Flash Multimodal
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Biaya Inferensi AI (USD)</span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-400 tracking-tight font-mono">
            ${aiApiMetrics.estimatedCostUsd.toFixed(2)} USD
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            ~Rp {aiApiMetrics.estimatedCostIdr.toLocaleString('id-ID')}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">API Gateway Throughput</span>
            <Zap className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-cyan-400 tracking-tight font-mono">
            {aiApiMetrics.apiGateway.avgRequestsPerSec} req/s
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Puncak: {aiApiMetrics.apiGateway.peakRequestsPerSec} req/s
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">P95 / P99 Latency</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white tracking-tight font-mono">
            {aiApiMetrics.apiGateway.p95LatencyMs} ms
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            P99 Latency: {aiApiMetrics.apiGateway.p99LatencyMs} ms
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: AI Token Trend Chart */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Tren Konsumsi Token AI Harian</h3>
            <span className="text-xs text-purple-400 font-medium">Gemini Pro vs Flash</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={aiApiMetrics.tokensTrend}>
                <defs>
                  <linearGradient id="colorPro" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorFlash" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(val: number) => [`${val.toLocaleString()} tokens`, '']}
                />
                <Area type="monotone" dataKey="geminiProTokens" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorPro)" name="Gemini Pro" />
                <Area type="monotone" dataKey="geminiFlashTokens" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#colorFlash)" name="Gemini Flash" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: AI Module Breakdown */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Atribusi AI Berdasarkan Modul</h3>
              <span className="text-xs text-slate-400">Distribusi Biaya Inferensi</span>
            </div>

            <div className="space-y-3 mt-4">
              {aiApiMetrics.aiModulesBreakdown.map((m) => (
                <div key={m.module} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="font-semibold">{m.module}</span>
                    <span className="font-mono text-purple-300 font-bold">{m.tokens.toLocaleString()} tokens ({m.percentage}%)</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full" style={{ width: `${m.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-purple-950/20 border border-purple-800/40 text-purple-200 text-xs flex items-center justify-between">
            <span className="text-[11px]">Semua panggilan AI di-proxy secara aman melalui backend tanpa mengekspos API Key ke client.</span>
          </div>
        </div>
      </div>

      {/* Top AI Tenants & API Endpoints Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top AI Tenants */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Penggunaan AI Terbanyak per Tenant</h3>
            <span className="text-xs text-slate-400">Credits vs Quota Limit</span>
          </div>

          <div className="space-y-3">
            {aiApiMetrics.topAiTenants.map((t) => (
              <div key={t.tenantId} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{t.tenantName}</span>
                  <span className="font-mono text-cyan-400 font-bold">{t.creditsUsed.toLocaleString()} / {t.creditsLimit.toLocaleString()} credits</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      t.quotaPercentage > 85 ? 'bg-rose-500' : t.quotaPercentage > 65 ? 'bg-amber-400' : 'bg-cyan-400'
                    }`}
                    style={{ width: `${Math.min(100, t.quotaPercentage)}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 block text-right font-mono">
                  {t.quotaPercentage}% Utilisasi Kuota
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* API Gateway Endpoints */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Telemetri Endpoint API Gateway (24 Jam)</h3>
            <span className="text-xs text-emerald-400 font-bold">99.9% Uptime</span>
          </div>

          <div className="space-y-2">
            {aiApiMetrics.apiGateway.endpoints.map((ep) => (
              <div key={ep.path} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="font-bold text-slate-200 block text-[11px]">{ep.path}</span>
                  <span className="text-[10px] text-slate-400">{ep.calls24h.toLocaleString()} calls / 24h</span>
                </div>
                <div className="text-right">
                  <span className="text-cyan-400 font-bold block">{ep.avgLatencyMs} ms</span>
                  <span className="text-[10px] text-slate-500">Error: {ep.errorRate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
