/**
 * Fleet Intelligence Smart AI - Downtime & Availability Intelligence Tab
 * Tracks workshop idle duration, fleet availability rate (%),
 * unplanned breakdowns vs scheduled preventive maintenance turnaround times.
 */

import React from 'react';
import { VehicleMaintenanceProfile, FleetMaintenanceKPIs } from '../../types';
import { 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Truck,
  TrendingUp
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface DowntimeIntelligenceTabProps {
  kpis: FleetMaintenanceKPIs;
  profiles: VehicleMaintenanceProfile[];
}

export const DowntimeIntelligenceTab: React.FC<DowntimeIntelligenceTabProps> = ({
  kpis,
  profiles,
}) => {
  const downtimeData = profiles.map(p => ({
    plateNumber: p.plateNumber,
    branch: p.branch,
    downtimeDays: p.costMetrics.downtimeDaysLast90Days,
    downtimeHours: p.costMetrics.downtimeDaysLast90Days * 24,
    availabilityRisk: p.costMetrics.availabilityRisk,
  })).sort((a, b) => b.downtimeHours - a.downtimeHours);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block">Fleet Availability Rate</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold font-mono text-emerald-400">
              {kpis.fleetAvailabilityPercentage}%
            </span>
            <span className="text-xs text-slate-400">Tersedia Operasi</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">
            Target SLA Kesiapan Armada: &gt;95%
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block">Total Jam di Bengkel (90 Hari)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold font-mono text-amber-300">
              {downtimeData.reduce((acc, d) => acc + d.downtimeHours, 0)}
            </span>
            <span className="text-xs text-slate-400">Jam Bengkel</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">
            Rata-rata 24.5 Jam per Kendaraan
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block">Kendaraan Risiko Ketersediaan Tinggi</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold font-mono text-rose-400">
              {downtimeData.filter(d => d.availabilityRisk === 'HIGH').length}
            </span>
            <span className="text-xs text-slate-400">Armada</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">
            Downtime &gt;40 Jam per kuartal
          </span>
        </div>
      </div>

      {/* Chart: Downtime per Vehicle */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 text-cyan-400" />
          Durasi Downtime Bengkel per Kendaraan (Jam)
        </h4>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={downtimeData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="plateNumber" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                formatter={(val: any) => [`${val} Jam`, 'Downtime']}
              />
              <Bar dataKey="downtimeHours" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Downtime Detail Table */}
      <div className="overflow-x-auto rounded-2xl bg-slate-900 border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4 font-semibold">Kendaraan</th>
              <th className="py-3 px-4 font-semibold">Cabang</th>
              <th className="py-3 px-4 font-semibold">Total Hari di Bengkel</th>
              <th className="py-3 px-4 font-semibold">Total Jam Downtime</th>
              <th className="py-3 px-4 font-semibold">Tingkat Risiko Ketersediaan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {downtimeData.map((d) => (
              <tr key={d.plateNumber} className="hover:bg-slate-800/40">
                <td className="py-3 px-4 font-mono font-bold text-white">{d.plateNumber}</td>
                <td className="py-3 px-4 text-slate-300">{d.branch}</td>
                <td className="py-3 px-4 font-mono text-white">{d.downtimeDays} Hari</td>
                <td className="py-3 px-4 font-mono text-amber-300 font-bold">{d.downtimeHours} Jam</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    d.availabilityRisk === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                    d.availabilityRisk === 'MODERATE' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {d.availabilityRisk} RISK
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
