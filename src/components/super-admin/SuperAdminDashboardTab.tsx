/**
 * Fleet Intelligence Smart AI - Super Admin Dashboard Tab (Prompt 42)
 * High-level Executive KPI Cards, Real-time Ingestion Throughput, Revenue Trends,
 * AI Compute Metrics, and Platform Status Overview.
 */

import React from 'react';
import {
  SuperAdminDashboardKpis,
  PlatformRevenueMetrics,
  PlatformAiApiMetrics,
  MicroserviceHealthItem,
} from '../../types/superAdmin';
import {
  Building2,
  Truck,
  Radio,
  Users,
  DollarSign,
  Sparkles,
  Activity,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Server,
  Zap,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface SuperAdminDashboardTabProps {
  kpis: SuperAdminDashboardKpis;
  revenueMetrics: PlatformRevenueMetrics;
  aiApiMetrics: PlatformAiApiMetrics;
  microservices: MicroserviceHealthItem[];
  onNavigateTab: (tabId: string) => void;
}

export const SuperAdminDashboardTab: React.FC<SuperAdminDashboardTabProps> = ({
  kpis,
  revenueMetrics,
  aiApiMetrics,
  microservices,
  onNavigateTab,
}) => {
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const operationalServices = microservices.filter((m) => m.status === 'operational').length;

  return (
    <div className="space-y-6">
      {/* Top Banner Notice: Platform Overview */}
      <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-slate-900 via-cyan-950/20 to-slate-900 p-4 sm:p-6 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-950 shrink-0">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">SaaS Ecosystem Health: Normal</h2>
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                99.98% SLA
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Melayani {kpis.totalCompanies} Perusahaan Tenant • {kpis.totalVehicles} Unit Armada • {kpis.ingestionThroughputMsgsSec} msgs/sec Ingestion IoT
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => onNavigateTab('companies')}
            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 rounded-xl bg-cyan-500/10 px-3.5 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all"
          >
            <Building2 className="h-4 w-4" />
            <span>Kelola Tenant</span>
          </button>
          <button
            onClick={() => onNavigateTab('incidents')}
            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 border border-slate-700 transition-all"
          >
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span>Pusat Insiden ({kpis.openIncidentsCount})</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Companies */}
        <div
          onClick={() => onNavigateTab('companies')}
          className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/70 p-5 hover:border-cyan-500/40 hover:bg-slate-900 transition-all shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Perusahaan SaaS</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white tracking-tight">{kpis.totalCompanies}</span>
            <span className="text-xs text-emerald-400 font-medium">({kpis.activeCompanies} Aktif)</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800/80">
            <span>{kpis.trialCompanies} Uji Coba (Trial)</span>
            <span className="text-rose-400">{kpis.suspendedCompanies} Suspended</span>
          </div>
        </div>

        {/* Card 2: Vehicles & Devices */}
        <div
          onClick={() => onNavigateTab('telematics')}
          className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/70 p-5 hover:border-cyan-500/40 hover:bg-slate-900 transition-all shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Armada & IoT Pool</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <Truck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white tracking-tight">{kpis.totalVehicles}</span>
            <span className="text-xs text-slate-400 font-medium">Kendaraan</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800/80">
            <span className="text-emerald-400 font-medium">{kpis.activeMovingVehicles} Bergerak Aktif</span>
            <span>{kpis.onlineDevices} GPS Online</span>
          </div>
        </div>

        {/* Card 3: MRR / Financial */}
        <div
          onClick={() => onNavigateTab('billing')}
          className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/70 p-5 hover:border-cyan-500/40 hover:bg-slate-900 transition-all shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Recurring (MRR)</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black text-white tracking-tight truncate">
              {formatRupiah(kpis.mrrTotal)}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800/80">
            <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> +{revenueMetrics.growthMoMPercent}% MoM
            </span>
            <span className="font-mono text-slate-400">ARR {formatRupiah(kpis.arrTotal)}</span>
          </div>
        </div>

        {/* Card 4: AI & Compute */}
        <div
          onClick={() => onNavigateTab('ai_api')}
          className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/70 p-5 hover:border-cyan-500/40 hover:bg-slate-900 transition-all shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Compute & Tokens</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white tracking-tight">
              {kpis.aiMonthlyTokens.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-purple-400 font-medium">tokens</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800/80">
            <span>Biaya: ${kpis.aiMonthlySpendUsd.toFixed(2)} USD</span>
            <span className="text-cyan-400">Gemini 1.5 Pro/Flash</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: MRR & Revenue Growth Trend */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Pertumbuhan Pendapatan Platform SaaS (12 Bulan)</h3>
              <p className="text-xs text-slate-400">MRR, Ekspansi & Net Recurring Revenue Lintas Tenant</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
                <span className="text-slate-300">MRR Total</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="text-slate-300">New MRR</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueMetrics.monthlyRevenueTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorNewMrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `Rp ${(val / 1000000).toFixed(0)}Jt`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(val: number) => [`Rp ${val.toLocaleString('id-ID')}`, '']}
                />
                <Area type="monotone" dataKey="mrr" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMrr)" name="MRR Total" />
                <Area type="monotone" dataKey="newMrr" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorNewMrr)" name="New MRR" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Plan Distribution */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white tracking-tight">Komposisi Paket Berlangganan</h3>
              <span className="text-xs font-semibold text-cyan-400">Total {kpis.totalCompanies} Tenant</span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueMetrics.revenueByPlan}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {revenueMetrics.revenueByPlan.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                    formatter={(val: number, name: string) => [`${val} Perusahaan`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 mt-2 pt-3 border-t border-slate-800/80">
            {revenueMetrics.revenueByPlan.map((p) => (
              <div key={p.planName} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="text-slate-300 font-medium">{p.planName}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-white font-bold">{p.count}</span>
                  <span className="text-slate-400 text-[11px]">({formatRupiah(p.revenue)})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Microservices & Operational Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Subsystem Health Highlights */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Status Microservice Cluster</h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              {operationalServices}/{microservices.length} Operasional
            </span>
          </div>

          <div className="space-y-2.5">
            {microservices.slice(0, 4).map((srv) => (
              <div key={srv.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                <div>
                  <span className="font-semibold text-slate-200 block truncate max-w-[180px]">{srv.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{srv.region}</span>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-400 font-bold">
                    <CheckCircle2 className="h-3 w-3" /> {srv.uptimePercent}%
                  </span>
                  <span className="block text-[10px] text-slate-400">{srv.latencyMs}ms</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigateTab('health')}
            className="w-full mt-3 py-1.5 text-xs text-center text-cyan-400 hover:text-cyan-300 font-medium hover:underline block"
          >
            Lihat Seluruh 8 Subsystem & Ingress Region →
          </button>
        </div>

        {/* AI & API Live Gateway */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">API Gateway & Rate Limits</h3>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 font-bold">
              {aiApiMetrics.apiGateway.avgRequestsPerSec} req/sec
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex justify-between text-slate-300">
                <span>Total Permintaan (24 Jam)</span>
                <span className="font-mono font-bold text-white">
                  {aiApiMetrics.apiGateway.totalRequests24h.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>P95 Response Latency</span>
                <span className="font-mono text-emerald-400 font-bold">{aiApiMetrics.apiGateway.p95LatencyMs} ms</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>HTTP 5xx Error Rate</span>
                <span className="font-mono text-slate-400">0.03% (Stabil)</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/40 text-purple-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Konsumsi Token Gemini 1.5</span>
                <span className="font-mono font-bold text-white">{kpis.aiMonthlyTokens.toLocaleString()}</span>
              </div>
              <p className="text-[11px] text-purple-300/80">
                Estimasi biaya komputasi AI bulanan: ${kpis.aiMonthlySpendUsd.toFixed(2)} USD (~Rp {aiApiMetrics.estimatedCostIdr.toLocaleString('id-ID')})
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('ai_api')}
            className="w-full mt-3 py-1.5 text-xs text-center text-cyan-400 hover:text-cyan-300 font-medium hover:underline block"
          >
            Buka Analitik AI & API Gateway →
          </button>
        </div>

        {/* SaaS Quick Security & Impersonation Access */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Otorisasi & Support Access</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">SUPER ADMIN TIER</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Super Admin memiliki wewenang platform tertinggi untuk melakukan troubleshooting teknis melalui Support Impersonation dengan pencatatan audit ketat.
            </p>

            <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Total Pengguna Lintas Tenant</span>
                <span className="font-bold text-white font-mono">{kpis.totalUsers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Sesi Aktif Bersamaan</span>
                <span className="font-bold text-emerald-400 font-mono">{kpis.activeSessions} Sesi</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">2FA Enforcement</span>
                <span className="font-bold text-cyan-400 font-mono">78% Terproteksi</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('users')}
              className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-all text-center"
            >
              Kelola Pengguna
            </button>
            <button
              onClick={() => onNavigateTab('audit')}
              className="flex-1 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-semibold text-cyan-300 transition-all text-center"
            >
              Audit Trail Global
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
