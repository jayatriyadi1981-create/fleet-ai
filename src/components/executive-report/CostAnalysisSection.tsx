/**
 * Fleet Intelligence Smart AI - Cost Analysis Section
 * PROMPT 52 — Detailed Cost Breakdown, 8-Month Trend, and Cost/km Benchmarking
 */

import React from 'react';
import { DollarSign, TrendingUp, PieChart as PieIcon, HelpCircle, ArrowUpRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { RootCauseDriver, ExecutiveCostTrendPoint } from '../../types/executiveReport';
import { ExecutiveKPIService } from '../../services/executiveReport/executiveKPIService';

interface CostAnalysisSectionProps {
  totalCost: number;
  costChangePercent: number;
  drivers: RootCauseDriver[];
  costTrend: ExecutiveCostTrendPoint[];
  fleetAvgCostPerKm: number;
  bestCostPerKm: number;
  worstCostPerKm: number;
  onWhyClick: (category: string, title: string) => void;
}

export const CostAnalysisSection: React.FC<CostAnalysisSectionProps> = ({
  totalCost,
  costChangePercent,
  drivers,
  costTrend,
  fleetAvgCostPerKm,
  bestCostPerKm,
  worstCostPerKm,
  onWhyClick,
}) => {
  const chartData = costTrend.map(pt => ({
    name: pt.periodMonth,
    'Fuel (Solar)': Math.round(pt.fuelCost / 1000000), // in Millions
    'Maintenance': Math.round(pt.maintenanceCost / 1000000),
    'Driver & Ops': Math.round(pt.driverAndOpsCost / 1000000),
    'Total Cost': Math.round(pt.totalCost / 1000000),
    'Cost/km (Rp)': pt.costPerKm,
  }));

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-700/60 text-amber-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>Analisis Biaya & Komposisi Beban Operasional</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-950/80 border border-rose-800 text-rose-300">
                +{costChangePercent}% MoM
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Dekomposisi struktur pengeluaran, perbandingan cost/km, dan tren historis 8 bulan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Total Realisasi:</span>
          <span className="text-base font-extrabold text-cyan-400">
            {ExecutiveKPIService.formatRupiah(totalCost)}
          </span>
        </div>
      </div>

      {/* Cost/km Benchmarking Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Rata-Rata Cost/km Armada</span>
          <div className="text-2xl font-bold text-slate-100">{ExecutiveKPIService.formatCostPerKm(fleetAvgCostPerKm)}</div>
          <p className="text-[11px] text-slate-400">Baseline efisiensi seluruh unit aktif</p>
        </div>

        <div className="bg-slate-950/60 border border-emerald-900/30 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">Best Performing Cost/km</span>
          <div className="text-2xl font-bold text-emerald-400">{ExecutiveKPIService.formatCostPerKm(bestCostPerKm)}</div>
          <p className="text-[11px] text-slate-400">Unit Fuso Canter FE 74 (Cabang Semarang)</p>
        </div>

        <div className="bg-slate-950/60 border border-rose-900/30 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-400">Highest Cost/km (Inefficient)</span>
          <div className="text-2xl font-bold text-rose-400">{ExecutiveKPIService.formatCostPerKm(worstCostPerKm)}</div>
          <p className="text-[11px] text-slate-400">Unit Mitsubishi Fuso B 9655 UTZ (Rasio idle 28%)</p>
        </div>
      </div>

      {/* 8-Month Historical Cost Trend Chart */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <span>Tren Biaya Operasional & Cost/km (Januari - Agustus 2026)</span>
          <span className="text-slate-400">Satuan: Juta Rupiah (Batang) / Rupiah per Km (Garis)</span>
        </div>
        <div className="h-72 w-full bg-slate-950/80 p-4 rounded-xl border border-slate-800">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `Rp ${val}J`} />
              <YAxis yAxisId="right" orientation="right" stroke="#38bdf8" fontSize={11} tickFormatter={(val) => `${val}/km`} domain={[8000, 11000]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                formatter={(value: any, name: any) => {
                  if (name === 'Cost/km (Rp)') return [`Rp ${Number(value).toLocaleString('id-ID')}/km`, name];
                  return [`Rp ${Number(value).toLocaleString('id-ID')} Juta`, name];
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar yAxisId="left" dataKey="Fuel (Solar)" stackId="a" fill="#0284c7" />
              <Bar yAxisId="left" dataKey="Maintenance" stackId="a" fill="#f59e0b" />
              <Bar yAxisId="left" dataKey="Driver & Ops" stackId="a" fill="#64748b" />
              <Line yAxisId="right" type="monotone" dataKey="Cost/km (Rp)" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Cost Drivers Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Dekomposisi Faktor Penggerak Biaya (Top Cost Drivers):
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {drivers.map((driver, idx) => (
            <div
              key={idx}
              className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-bold text-slate-200">
                    {idx + 1}. {driver.category}
                  </span>
                  <button
                    onClick={() => onWhyClick(driver.category, `Akar Masalah: ${driver.category}`)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40"
                  >
                    <HelpCircle className="w-3 h-3" />
                    <span>WHY?</span>
                  </button>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <div className="text-xl font-bold text-slate-100">
                    {ExecutiveKPIService.formatRupiah(driver.costAmount)}
                  </div>
                  <span className="text-xs font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
                    {driver.sharePercent}% Beban
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{driver.explanation}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>{driver.affectedVehiclesCount} Unit Terdampak</span>
                <span className="text-emerald-400 font-medium">{driver.confidence} Confidence</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
