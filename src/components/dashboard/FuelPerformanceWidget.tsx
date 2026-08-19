/**
 * Fleet Intelligence Smart AI - Fuel Performance & Anomaly Widget
 * PROMPT 8 - Fuel Consumption Trend, Cost in IDR, and AI Anomaly Detection
 */

import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Fuel, TrendingUp, AlertTriangle, ArrowRight, Zap, Search } from 'lucide-react';
import { FuelSummary } from '../../types/dashboard';
import { formatIdrCurrency, formatNumberIdr } from '../../services/dashboardService';

interface FuelPerformanceWidgetProps {
  summary: FuelSummary | null;
  isLoading: boolean;
  onOpenFuelPage: () => void;
  onInvestigateAnomaly: (vehicleId: string) => void;
}

export const FuelPerformanceWidget: React.FC<FuelPerformanceWidgetProps> = ({
  summary,
  isLoading,
  onOpenFuelPage,
  onInvestigateAnomaly,
}) => {
  const [timeFilter, setTimeFilter] = useState<'7d' | '30d' | '90d'>('7d');

  if (isLoading || !summary) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 animate-pulse h-80">
        <div className="h-4 w-1/3 bg-slate-800 rounded" />
        <div className="grid grid-cols-3 gap-3 h-16 bg-slate-800 rounded-xl" />
        <div className="h-40 bg-slate-800 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md shadow-xl h-full space-y-4">
      {/* Widget Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Fuel className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Fuel Intelligence & Performa BBM</h3>
            <p className="text-[11px] text-slate-400">Monitoring konsumsi BBM, efisiensi KM/L & deteksi anomali AI</p>
          </div>
        </div>

        <button
          onClick={onOpenFuelPage}
          className="flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 hover:underline"
        >
          <span>Buka Analisis BBM</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Top Fuel Metrics Banner */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3">
          <p className="text-[10px] font-bold uppercase text-slate-400">Total Konsumsi BBM</p>
          <p className="text-lg font-black text-white">{formatNumberIdr(summary.totalConsumptionLiters)} L</p>
          <p className="text-[10px] text-slate-400">BBM Biodiesel B35 & Pertamax</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3">
          <p className="text-[10px] font-bold uppercase text-slate-400">Total Biaya BBM</p>
          <p className="text-lg font-black text-amber-400">{formatIdrCurrency(summary.totalCostIdr)}</p>
          <p className="text-[10px] text-slate-400">IDR Indonesia Locale</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3">
          <p className="text-[10px] font-bold uppercase text-slate-400">Rata-rata Efisiensi</p>
          <p className="text-lg font-black text-emerald-400">{summary.averageEfficiencyKmL} KM/L</p>
          <p className="text-[10px] text-emerald-400 font-semibold">↑ {summary.efficiencyTrendPercent}% vs bulan lalu</p>
        </div>
      </div>

      {/* Recharts Area Chart for Fuel Consumption Trend */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300">Tren Konsumsi BBM (Liter)</span>
          <div className="flex items-center gap-1 rounded-lg bg-slate-950 p-1 border border-slate-800">
            {(['7d', '30d', '90d'] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setTimeFilter(opt)}
                className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase transition-colors ${
                  timeFilter === opt ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="h-36 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={summary.trendChart} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="fuelGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="dateLabel" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#090d16',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#f8fafc',
                }}
                formatter={(val: any) => [`${val} Liters`, 'Konsumsi']}
              />
              <Area type="monotone" dataKey="consumptionLiters" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#fuelGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Fuel Anomaly Sub-Widget */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
            <Zap className="h-3.5 w-3.5 animate-pulse text-amber-400" />
            <span>AI Fuel Anomaly ({summary.anomalyCount} Kendaraan Terdeteksi)</span>
          </div>
          <span className="text-[10px] text-amber-400 font-semibold">Potensi Penghematan: Rp 1.05 Jt</span>
        </div>

        <div className="space-y-1.5">
          {summary.anomalies.slice(0, 2).map((anom) => (
            <div
              key={anom.id}
              className="flex items-center justify-between rounded-lg bg-slate-950/80 p-2 border border-amber-500/20 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{anom.vehiclePlate}</span>
                  <span className="font-black text-rose-400 text-[11px]">+{anom.deviationPercent}% diatas estimasi</span>
                </div>
                <p className="text-[10px] text-slate-400">{anom.spbuLocation} • {anom.driverName}</p>
              </div>

              <button
                onClick={() => onInvestigateAnomaly(anom.vehicleId)}
                className="flex items-center gap-1 rounded bg-amber-500 hover:bg-amber-400 px-2.5 py-1 text-[11px] font-bold text-slate-950 transition-colors shrink-0"
              >
                <Search className="h-3 w-3" />
                <span>Investigate</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
