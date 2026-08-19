/**
 * Fleet Intelligence Smart AI - Inspection Analytics & Fleet Health Visualizer
 * Interactive Recharts graphs for compliance, pass/fail trends, defect distributions, and driver patterns.
 */

import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ShieldAlert, 
  Users, 
  Truck 
} from 'lucide-react';
import { inspectionService } from '../services/inspectionService';

const COLORS = ['#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#06b6d4', '#64748b'];

export const InspectionAnalyticsView: React.FC = () => {
  const analytics = inspectionService.getAnalytics();

  const pieData = analytics.categoryFailureBreakdown.map((c) => ({
    name: c.label,
    value: c.count,
  }));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Analitik & Kepatuhan Inspeksi Armada
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Metrik kepatuhan pra-keberangkatan, tren kegagalan komponen, dan analisis durasi resolusi perbaikan.
          </p>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          <span className="text-slate-400">Kepatuhan Operasional:</span>
          <span className="font-bold text-emerald-400 text-sm">{analytics.complianceRatePercent}%</span>
        </div>
      </div>

      {/* Row 1: Trends & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inspection Result Trend */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Tren Hasil Inspeksi 7 Hari Terakhir</h2>
              <p className="text-xs text-slate-400">Volume pemeriksaan harian berdasarkan status</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.timelineTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPass" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAttention" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="pass" stroke="#10b981" fillOpacity={1} fill="url(#colorPass)" name="Lolos (Pass)" />
                <Area type="monotone" dataKey="attention" stroke="#f59e0b" fillOpacity={1} fill="url(#colorAttention)" name="Attention" />
                <Area type="monotone" dataKey="fail" stroke="#f43f5e" fill="#f43f5e" name="Gagal (Fail)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Pie */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Komposisi Kerusakan per Kategori</h2>
              <p className="text-xs text-slate-400">Distribusi bagian kendaraan yang paling sering bermasalah</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 text-xs">
              {analytics.categoryFailureBreakdown.map((cat, idx) => (
                <div key={cat.category} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    {cat.label}
                  </span>
                  <span className="font-mono text-slate-400">{cat.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Top Failing Vehicles & Top Reporting Drivers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Failing Vehicles */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-rose-400" />
              Kendaraan dengan Frekuensi Temuan Tertinggi
            </h2>
            <span className="text-xs text-slate-400">30 Hari</span>
          </div>

          <div className="divide-y divide-slate-800/80 text-xs">
            {analytics.topFailingVehicles.map((v) => (
              <div key={v.vehicleId} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">{v.vehiclePlate}</div>
                  <div className="text-slate-400 text-[11px]">{v.model} • Isu Utama: <strong className="text-rose-400 font-normal">{v.lastFailedCategory}</strong></div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-rose-400">{v.failCount}x Gagal Pre-Trip</div>
                  <div className="text-[11px] text-slate-500 font-mono">Health: {v.healthScore}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Reporting Drivers */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              Kepatuhan & Ketelitian Pelaporan Driver
            </h2>
            <span className="text-xs text-slate-400">Perilaku Pre-Trip</span>
          </div>

          <div className="divide-y divide-slate-800/80 text-xs">
            {analytics.topDriverReporting.map((d) => (
              <div key={d.driverId} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">{d.driverName}</div>
                  <div className="text-slate-400 text-[11px]">Selesai: {d.completedCount} inspeksi • {d.issuesReported} isu teridentifikasi</div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-400">{d.passRate}% Lolos</div>
                  <div className="text-[11px] text-slate-500">Skor Ketelitian Tinggi</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
