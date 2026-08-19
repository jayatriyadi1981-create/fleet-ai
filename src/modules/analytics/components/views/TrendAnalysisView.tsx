/**
 * Fleet Intelligence Smart AI - Multi-Period Trend Analysis View
 * PROMPT 36 - Sections 19, 32, 40
 */

import React, { useState } from 'react';
import { TrendingUp, Calendar, Layers, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';

export const TrendAnalysisView: React.FC = () => {
  const { snapshots } = useAnalytics();
  const [granularity, setGranularity] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('DAILY');
  const [selectedMetric, setSelectedMetric] = useState<'UTILIZATION' | 'PRODUCTIVITY' | 'MILEAGE' | 'IDLE_DOWNTIME'>('UTILIZATION');

  return (
    <div className="space-y-6">
      {/* Top Banner & Granularity Toggle */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
              <span>Multi-Period Historical Trend & Fluctuation Analytics</span>
            </h2>
            <p className="text-xs text-slate-400">
              Analisis deret waktu pola utilisasi, lonjakan jarak tempuh, serta tren penurunan rasio idle dan downtime.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Granularitas:</span>
            <div className="flex rounded-xl border border-slate-800 bg-slate-950 p-1 text-xs font-semibold">
              {(['DAILY', 'WEEKLY', 'MONTHLY'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGranularity(g)}
                  className={`rounded-lg px-3 py-1 transition-all ${
                    granularity === g ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {g === 'DAILY' && 'Harian (Daily)'}
                  {g === 'WEEKLY' && 'Mingguan (Weekly)'}
                  {g === 'MONTHLY' && 'Bulanan (Monthly)'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Metric Selector Buttons */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'UTILIZATION', label: 'Tingkat Utilisasi (%)' },
            { key: 'PRODUCTIVITY', label: 'Skor Produktivitas' },
            { key: 'MILEAGE', label: 'Jarak Tempuh (Km)' },
            { key: 'IDLE_DOWNTIME', label: 'Rasio Idle vs Downtime (%)' },
          ].map((m) => (
            <button
              key={m.key}
              onClick={() => setSelectedMetric(m.key as any)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                selectedMetric === m.key
                  ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Historical Chart Canvas */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">
            Grafik Deret Waktu 30 Hari: {selectedMetric}
          </h3>
          <span className="text-xs text-slate-400">Baseline Target: 80%</span>
        </div>

        <div className="h-64 flex items-end justify-between gap-1.5 border-b border-slate-800 px-2 pt-4">
          {snapshots.map((snap, idx) => {
            let heightPercent = snap.utilizationRate;
            let barColor = 'from-cyan-600 to-cyan-400';
            let labelVal = `${snap.utilizationRate}%`;

            if (selectedMetric === 'PRODUCTIVITY') {
              heightPercent = snap.productivityScore;
              barColor = 'from-emerald-600 to-emerald-400';
              labelVal = `${snap.productivityScore}`;
            } else if (selectedMetric === 'MILEAGE') {
              heightPercent = (snap.mileageKm / 6000) * 100;
              barColor = 'from-blue-600 to-blue-400';
              labelVal = `${snap.mileageKm} km`;
            } else if (selectedMetric === 'IDLE_DOWNTIME') {
              heightPercent = (snap.idleHours / 300) * 100;
              barColor = 'from-amber-600 to-rose-400';
              labelVal = `${snap.idleHours}j Idle`;
            }

            return (
              <div key={idx} className="group relative flex flex-col items-center flex-1 h-full justify-end">
                <div className="absolute -top-8 hidden group-hover:flex flex-col items-center bg-slate-950 border border-slate-700 px-2 py-0.5 rounded text-[10px] text-white shadow-xl z-20 whitespace-nowrap">
                  <span>{snap.date}: {labelVal}</span>
                </div>
                <div
                  style={{ height: `${Math.max(10, Math.min(100, heightPercent))}%` }}
                  className={`w-full max-w-[16px] rounded-t bg-gradient-to-t ${barColor} group-hover:brightness-125 transition-all`}
                />
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 px-2 pt-1">
          <span>{snapshots[0]?.date || '30 Hari Lalu'}</span>
          <span>Rata-rata Periode Stabil</span>
          <span>{snapshots[snapshots.length - 1]?.date || 'Hari Ini'}</span>
        </div>
      </div>
    </div>
  );
};
