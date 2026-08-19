/**
 * Fleet Intelligence Smart AI - Maintenance Overview Dashboard Tab
 * PROMPT 25 - Executive Predictive Maintenance KPI & Visual Overview
 */

import React from 'react';
import {
  Wrench,
  AlertTriangle,
  Clock,
  DollarSign,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Truck,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';
import {
  MOCK_OVERVIEW_KPIS,
  MOCK_VEHICLE_HEALTH,
  MOCK_WORK_ORDERS,
  MOCK_AI_INSIGHTS
} from '../../data/mockMaintenanceData';
import { VehicleHealth, WorkOrder } from '../../types';

interface OverviewTabProps {
  onSelectVehicle?: (vehicleId: string) => void;
  onSelectWorkOrder?: (workOrderId: string) => void;
  onNavigateTab: (tab: string) => void;
}

const COST_TREND_DATA = [
  { month: 'Mar 2026', preventive: 22, corrective: 14, total: 36 },
  { month: 'Apr 2026', preventive: 25, corrective: 18, total: 43 },
  { month: 'Mei 2026', preventive: 28, corrective: 12, total: 40 },
  { month: 'Jun 2026', preventive: 32, corrective: 21, total: 53 },
  { month: 'Jul 2026', preventive: 35, corrective: 16, total: 51 },
  { month: 'Agu 2026 (YTD)', preventive: 29, corrective: 19, total: 48 },
];

export const OverviewTab: React.FC<OverviewTabProps> = ({
  onSelectVehicle,
  onSelectWorkOrder,
  onNavigateTab
}) => {
  const kpi = MOCK_OVERVIEW_KPIS;
  const criticalVehicles = MOCK_VEHICLE_HEALTH.filter(
    (v) => v.status === 'CRITICAL' || v.status === 'AT_RISK'
  );
  const openWorkOrders = MOCK_WORK_ORDERS.filter(
    (wo) => wo.status !== 'CLOSED' && wo.status !== 'COMPLETED'
  );
  const aiInsights = MOCK_AI_INSIGHTS;

  return (
    <div className="space-y-6">
      {/* Top Executive KPI Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: Fleet Health */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Skor Kesehatan Armada
            </span>
            <div className="rounded-xl bg-emerald-950/80 p-2.5 text-emerald-400 border border-emerald-800/40">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-white">
              {kpi.fleetHealthScore}%
            </span>
            <span className="text-xs font-bold text-emerald-400 flex items-center">
              <ArrowUpRight className="h-3.5 w-3.5" /> +2.4% bln ini
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2.5">
            <span className="text-emerald-400 font-semibold">{kpi.vehiclesHealthy} Sehat</span>
            <span className="text-amber-400 font-semibold">{kpi.vehiclesAtRisk} At Risk</span>
            <span className="text-rose-400 font-bold">{kpi.vehiclesCritical} Kritis</span>
          </div>
        </div>

        {/* KPI 2: Due Soon & Overdue */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Jadwal Servis (Due / Overdue)
            </span>
            <div className="rounded-xl bg-amber-950/80 p-2.5 text-amber-400 border border-amber-800/40">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <div>
              <span className="text-2xl font-black text-amber-400">
                {kpi.maintenanceDueCount}
              </span>
              <span className="text-[10px] text-slate-400 block font-medium">Due Soon</span>
            </div>
            <div className="border-l border-slate-800 pl-3">
              <span className="text-2xl font-black text-rose-400">
                {kpi.maintenanceOverdueCount}
              </span>
              <span className="text-[10px] text-rose-300 block font-bold">Overdue Kritis</span>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('schedule')}
            className="mt-3 w-full text-left text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center justify-between border-t border-slate-800/80 pt-2.5"
          >
            <span>Lihat Jadwal Terperinci</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* KPI 3: Open Work Orders */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Work Orders Aktif
            </span>
            <div className="rounded-xl bg-cyan-950/80 p-2.5 text-cyan-400 border border-cyan-800/40">
              <Wrench className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-white">
              {kpi.openWorkOrdersCount}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              / {kpi.completedWorkOrdersCount} Selesai Bln Ini
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2.5">
            <span>Downtime Armada:</span>
            <span className="font-bold text-amber-300">{kpi.totalDowntimeHours} Jam</span>
          </div>
        </div>

        {/* KPI 4: Maintenance Cost */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Biaya Maintenance
            </span>
            <div className="rounded-xl bg-purple-950/80 p-2.5 text-purple-400 border border-purple-800/40">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Rp {(kpi.totalMaintenanceCost / 1000000).toFixed(0)} Juta
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2.5">
            <span>Rata-rata/KM:</span>
            <span className="font-bold text-emerald-400">Rp {kpi.avgCostPerKm.toLocaleString()}/KM</span>
          </div>
        </div>
      </div>

      {/* Main Visual Section: Cost Trend & AI Insights */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Cost Trend Chart (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-4 mb-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-cyan-400" />
                Tren Biaya Pemeliharaan Armada (6 Bulan Terakhir)
              </h2>
              <p className="text-xs text-slate-400">
                Perbandingan alokasi biaya Preventive vs Corrective Maintenance (dalam Juta Rupiah).
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
                <span className="text-slate-300">Preventive</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="text-slate-300">Corrective</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={COST_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPreventive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorCorrective" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                  formatter={(value: any) => [`Rp ${value} Juta`, '']}
                />
                <Area
                  type="monotone"
                  dataKey="preventive"
                  name="Preventive"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPreventive)"
                />
                <Area
                  type="monotone"
                  dataKey="corrective"
                  name="Corrective"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCorrective)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Predictive Insight Card */}
        <div className="rounded-2xl border border-cyan-800/40 bg-gradient-to-b from-slate-900 via-slate-900 to-cyan-950/30 p-5 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-800/30 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    AI Fleet Predictive Insight
                  </h3>
                  <span className="text-[10px] text-cyan-400 font-medium">
                    Analisis Realtime Telematika
                  </span>
                </div>
              </div>
              <span className="rounded-md bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/30">
                1 Kritis Terdeteksi
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{aiInsights[0].vehiclePlate}</span>
                <span className="text-rose-400 font-bold bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800/40 text-[10px]">
                  Skor Risiko: {aiInsights[0].riskScore}/100
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {aiInsights[0].finding}
              </p>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/80 flex flex-wrap gap-1">
                {aiInsights[0].potentialAreas.map((area, idx) => (
                  <span key={idx} className="bg-slate-900 px-1.5 py-0.5 rounded text-cyan-300 border border-slate-800">
                    {area}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic">
              "Korelasikan konsumsi BBM (+18%) dan kegagalan rem untuk mencegah breakdown sebelum jadwal dispatch."
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('ai')}
            className="mt-4 w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-600/20 transition-all"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Buka AI Maintenance Hub</span>
          </button>
        </div>
      </div>

      {/* Critical Vehicles & Open Work Orders Quick Tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Critical Vehicles Attention */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-400" />
              <h3 className="text-sm font-bold text-white">
                Kendaraan Membutuhkan Perhatian Khusus
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('health')}
              className="text-xs text-cyan-400 hover:underline font-semibold"
            >
              Lihat Semua ({MOCK_VEHICLE_HEALTH.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {criticalVehicles.map((veh) => (
              <div
                key={veh.vehicleId}
                onClick={() => onSelectVehicle && onSelectVehicle(veh.vehicleId)}
                className="p-3 bg-slate-950/60 hover:bg-slate-950 border border-slate-800/80 rounded-xl flex items-center justify-between cursor-pointer transition-all hover:border-slate-700"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg font-bold text-xs ${
                    veh.status === 'CRITICAL' ? 'bg-rose-950 text-rose-400 border border-rose-800/50' : 'bg-amber-950 text-amber-400 border border-amber-800/50'
                  }`}>
                    {veh.healthScore}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{veh.vehiclePlate}</h4>
                    <p className="text-[10px] text-slate-400">{veh.brand} {veh.model}</p>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    veh.status === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {veh.status}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">Servis: {veh.nextService}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Open Work Orders Quick View */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Work Orders Sedang Berjalan</h3>
            </div>
            <button
              onClick={() => onNavigateTab('work_orders')}
              className="text-xs text-cyan-400 hover:underline font-semibold"
            >
              Lihat Semua ({MOCK_WORK_ORDERS.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {openWorkOrders.map((wo) => (
              <div
                key={wo.id}
                onClick={() => onSelectWorkOrder && onSelectWorkOrder(wo.id)}
                className="p-3 bg-slate-950/60 hover:bg-slate-950 border border-slate-800/80 rounded-xl flex items-center justify-between cursor-pointer transition-all hover:border-slate-700"
              >
                <div className="space-y-0.5 max-w-[65%]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{wo.number}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      wo.priority === 'CRITICAL' || wo.priority === 'HIGH'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}>
                      {wo.priority}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 truncate">{wo.title}</p>
                  <p className="text-[10px] text-slate-500 truncate">Bengkel: {wo.workshopName}</p>
                </div>

                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50 text-[10px] font-bold">
                    {wo.status.replace('_', ' ')}
                  </span>
                  <p className="text-[10px] font-bold text-emerald-400 mt-1">
                    Rp {wo.estimatedCost.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
