/**
 * Fleet Intelligence Smart AI - Fuel Trends Tab
 * Visualizes multi-week and monthly consumption, expenditure, and efficiency trajectories.
 */

import React, { useState } from 'react';
import { FuelTrendAnalysis } from '../../types';
import { TrendingUp, Calendar, Sparkles, Activity, Layers } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

interface FuelTrendsTabProps {
  trends: FuelTrendAnalysis;
  onExplainWithAI: (topic: string, subject: string) => void;
}

export const FuelTrendsTab: React.FC<FuelTrendsTabProps> = ({
  trends,
  onExplainWithAI,
}) => {
  const [periodPreset, setPeriodPreset] = useState<'30_DAYS' | '90_DAYS' | 'THIS_MONTH'>('30_DAYS');

  return (
    <div className="space-y-6">
      {/* Header & Direction Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Analisis Tren & Volatilitas Bahan Bakar</h3>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
                trends.direction === 'INCREASING'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  : trends.direction === 'IMPROVING'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
              }`}
            >
              Arah Tren: {trends.direction} (+{trends.changePercentage}%)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{trends.trendDescription}</p>
        </div>

        <button
          onClick={() => onExplainWithAI('CONSUMPTION', 'Analisis Tren Konsumsi BBM Armada')}
          className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Sparkles className="h-3.5 w-3.5" /> Explain Trend With AI
        </button>
      </div>

      {/* Main Chart: Multi-week Comparison */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white">Perbandingan Konsumsi vs Periode Sebelumnya</h4>
          <span className="text-xs font-mono text-slate-400">Skala L/100km</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trends.dataPoints}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} domain={[20, 35]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="currentConsumptionL100Km" name="Konsumsi Aktual (L/100km)" stroke="#06b6d4" strokeWidth={2.5} />
              <Line type="monotone" dataKey="previousConsumptionL100Km" name="Periode Sebelumnya" stroke="#64748b" strokeDasharray="4 4" strokeWidth={1.5} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="border-b border-slate-800 bg-slate-950 text-slate-400 font-mono">
            <tr>
              <th className="py-3 px-4">PERIODE PEKAN</th>
              <th className="py-3 px-3 text-right">KONSUMSI AKTUAL</th>
              <th className="py-3 px-3 text-right">SKOR EFISIENSI</th>
              <th className="py-3 px-3 text-right">TOTAL VOLUME (L)</th>
              <th className="py-3 px-3 text-right">TOTAL BIAYA (IDR)</th>
              <th className="py-3 px-4 text-center">ANOMALI TERCATAT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {trends.dataPoints.map((pt, idx) => (
              <tr key={idx} className="hover:bg-slate-800/40">
                <td className="py-3 px-4 font-mono font-bold text-white">{pt.label} ({pt.date})</td>
                <td className="py-3 px-3 text-right font-mono font-bold text-cyan-400">
                  {pt.currentConsumptionL100Km} L/100km
                </td>
                <td className="py-3 px-3 text-right font-mono text-emerald-400 font-bold">
                  {pt.efficiencyScore}/100
                </td>
                <td className="py-3 px-3 text-right font-mono text-slate-300">
                  {pt.totalLiters.toLocaleString()} L
                </td>
                <td className="py-3 px-3 text-right font-mono text-white">
                  Rp {pt.totalCostIdr.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-center font-mono">
                  {pt.anomalyEventsCount > 0 ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500/20 text-rose-300 font-bold">
                      {pt.anomalyEventsCount} Anomali
                    </span>
                  ) : (
                    <span className="text-slate-500">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
