/**
 * Fleet Intelligence Smart AI - Maintenance Analytics Tab
 * PROMPT 25 - Deep Statistical Analytics, Downtime & Workshop SLA
 */

import React from 'react';
import {
  BarChart2,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building,
  Wrench,
  Percent
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { MOCK_VENDORS } from '../../data/mockMaintenanceData';

const BREAKDOWN_TREND = [
  { month: 'Mar', count: 4, downtime: 32 },
  { month: 'Apr', count: 6, downtime: 48 },
  { month: 'Mei', count: 3, downtime: 20 },
  { month: 'Jun', count: 7, downtime: 58 },
  { month: 'Jul', count: 5, downtime: 36 },
  { month: 'Agu', count: 2, downtime: 14 },
];

const ROOT_CAUSE_PIE = [
  { name: 'Wear & Tear (Usia)', value: 45, color: '#06b6d4' },
  { name: 'Driver Behavior (Kasar)', value: 25, color: '#f43f5e' },
  { name: 'Kondisi Jalan Rusak', value: 18, color: '#f59e0b' },
  { name: 'Cacat Komponen/Part', value: 12, color: '#a855f7' },
];

export const AnalyticsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-cyan-400" />
          Analitik Lanjutan, Downtime & Performa Bengkel Mitra
        </h2>
        <p className="text-xs text-slate-400">
          Metrik operasional mendalam: Tren insiden breakdown di jalan, akar penyebab kerusakan armada, dan kepatuhan SLA bengkel.
        </p>
      </div>

      {/* Chart Row 1: Breakdown Trends & Root Cause Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Breakdown Trend */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-cyan-400" />
            Tren Kejadian Breakdown & Jam Downtime (6 Bulan)
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BREAKDOWN_TREND}>
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
                />
                <Bar dataKey="downtime" name="Jam Downtime" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="count" name="Jumlah Breakdown" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Root Cause Distribution */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Percent className="h-4 w-4 text-cyan-400" />
              Distribusi Faktor Penyebab Kerusakan (Root Cause)
            </h3>
            <p className="text-xs text-slate-400">
              Analisis proporsi penyebab kerusakan armada selama tahun 2026.
            </p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ROOT_CAUSE_PIE}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {ROOT_CAUSE_PIE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                  formatter={(value: any) => [`${value}%`, 'Proporsi']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {ROOT_CAUSE_PIE.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 bg-slate-950/60 rounded-lg border border-slate-800">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300 truncate">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Workshop Performance Metrics */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Building className="h-4 w-4 text-cyan-400" />
          Kinerja & Kepatuhan Service Level Agreement (SLA) Bengkel
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_VENDORS.map((ws) => (
            <div key={ws.id} className="p-4 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-bold text-white">{ws.name}</h4>
                  <span className="text-[10px] text-slate-400">{ws.address}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  ws.activeSlaStatus === 'ON_TIME'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                    : 'bg-amber-950 text-amber-300 border border-amber-800/50'
                }`}>
                  SLA: {ws.activeSlaStatus}
                </span>
              </div>

              <div className="space-y-1 text-xs border-t border-slate-800/80 pt-2 text-slate-300">
                <div className="flex justify-between">
                  <span>Rata-rata Waktu Servis:</span>
                  <strong className="text-cyan-300">{ws.avgRepairTimeHours} Jam / Unit</strong>
                </div>
                <div className="flex justify-between">
                  <span>Rata-rata Biaya / WO:</span>
                  <strong className="text-emerald-400">Rp {(ws.avgCostIdr / 1000000).toFixed(1)} Jt</strong>
                </div>
                <div className="flex justify-between">
                  <span>Rating Kualitas:</span>
                  <strong className="text-amber-400">★ {ws.rating}/5.0</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
