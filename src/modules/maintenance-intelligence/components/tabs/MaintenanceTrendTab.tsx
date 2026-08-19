/**
 * Fleet Intelligence Smart AI - Maintenance Trend Tab
 * Historical evolution of fleet health score, risk scores,
 * unplanned breakdowns vs preventive maintenance, and total cost trends.
 */

import React from 'react';
import { MaintenanceTrendPoint } from '../../types';
import { TrendingUp, Activity, BarChart2, ShieldCheck, DollarSign } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

interface MaintenanceTrendTabProps {
  trends: MaintenanceTrendPoint[];
}

export const MaintenanceTrendTab: React.FC<MaintenanceTrendTabProps> = ({ trends }) => {
  return (
    <div className="space-y-6">
      {/* Overview Chart */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-400" />
              Evolusi Skor Kesehatan Armada vs Risiko Kerusakan
            </h4>
            <p className="text-[11px] text-slate-400">Korelasi peningkatan health score dengan penurunan risiko kerusakan</p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="healthGradT" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="riskGradT" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="averageHealthScore" name="Health Score (0-100)" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#healthGradT)" />
              <Area type="monotone" dataKey="averageRiskScore" name="Risk Score (0-100)" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#riskGradT)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Breakdowns vs Scheduled Maintenance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-emerald-400" />
            Servis Terjadwal vs Kerusakan Darurat (Breakdown)
          </h4>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="scheduledServicesCount" name="Servis Terjadwal" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="unplannedBreakdownsCount" name="Breakdown Darurat" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-cyan-400" />
            Tren Anggaran Biaya Pemeliharaan Bulanan
          </h4>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} tickFormatter={(v) => `Rp ${(v / 1000000).toFixed(0)}M`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(val: any) => [`Rp ${Number(val).toLocaleString('id-ID')}`, 'Total Biaya']}
                />
                <Bar dataKey="maintenanceCost" name="Biaya Pemeliharaan" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
