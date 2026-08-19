/**
 * Fleet Intelligence Smart AI - Fatigue Analytics Tab
 * PROMPT 23 - Fatigue Analytics (/app/fatigue/analytics)
 */

import React from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { BarChart3, TrendingUp, Users, Building2, Calendar } from 'lucide-react';

const fatigueTrendData = [
  { date: '1 Agu', fleetScore: 82, highRiskDrivers: 8, restCompliance: 94 },
  { date: '3 Agu', fleetScore: 80, highRiskDrivers: 9, restCompliance: 92 },
  { date: '5 Agu', fleetScore: 76, highRiskDrivers: 14, restCompliance: 89 },
  { date: '7 Agu', fleetScore: 74, highRiskDrivers: 15, restCompliance: 88 },
  { date: '9 Agu', fleetScore: 79, highRiskDrivers: 11, restCompliance: 91 },
  { date: '11 Agu', fleetScore: 81, highRiskDrivers: 9, restCompliance: 93 },
  { date: '13 Agu', fleetScore: 77, highRiskDrivers: 13, restCompliance: 90 },
  { date: '15 Agu', fleetScore: 78, highRiskDrivers: 12, restCompliance: 91.4 },
];

const branchFatigueData = [
  { branch: 'Jakarta HQ', avgScore: 76, highRisk: 6, nightHours: 85 },
  { branch: 'Surabaya Depot', avgScore: 82, highRisk: 3, nightHours: 42 },
  { branch: 'Semarang DC', avgScore: 79, highRisk: 4, nightHours: 58 },
  { branch: 'Bandung Hub', avgScore: 85, highRisk: 2, nightHours: 24 },
];

const shiftComparisonData = [
  { shift: 'Morning', avgRiskScore: 88, alerts: 2 },
  { shift: 'Afternoon', avgRiskScore: 80, alerts: 5 },
  { shift: 'Night', avgRiskScore: 68, alerts: 14 },
  { shift: 'Rotating', avgRiskScore: 72, alerts: 8 },
];

const heatmapMatrix = [
  { hour: '00:00 - 04:00', mon: 'CRITICAL', tue: 'HIGH', wed: 'CRITICAL', thu: 'HIGH', fri: 'CRITICAL', sat: 'HIGH', sun: 'MODERATE' },
  { hour: '04:00 - 08:00', mon: 'MODERATE', tue: 'LOW', wed: 'MODERATE', thu: 'LOW', fri: 'MODERATE', sat: 'LOW', sun: 'LOW' },
  { hour: '08:00 - 12:00', mon: 'LOW', tue: 'LOW', wed: 'LOW', thu: 'LOW', fri: 'LOW', sat: 'LOW', sun: 'LOW' },
  { hour: '12:00 - 16:00', mon: 'MODERATE', tue: 'MODERATE', wed: 'LOW', thu: 'MODERATE', fri: 'LOW', sat: 'LOW', sun: 'LOW' },
  { hour: '16:00 - 20:00', mon: 'LOW', tue: 'LOW', wed: 'MODERATE', thu: 'LOW', fri: 'MODERATE', sat: 'MODERATE', sun: 'LOW' },
  { hour: '20:00 - 24:00', mon: 'HIGH', tue: 'HIGH', wed: 'HIGH', thu: 'HIGH', fri: 'CRITICAL', sat: 'HIGH', sun: 'MODERATE' },
];

export const FatigueAnalyticsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Line Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fatigue Risk Score & Rest Compliance Trend */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Tren Skor Fatigue Fleet & Kepatuhan Istirahat</h3>
              <p className="text-xs text-slate-400">Proyeksi 15 Hari Terakhir</p>
            </div>
            <TrendingUp className="w-5 h-5 text-cyan-400" />
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fatigueTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[50, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} />
                <Legend />
                <Line type="monotone" dataKey="fleetScore" name="Fleet Fatigue Score (0-100)" stroke="#06b6d4" strokeWidth={2.5} dot />
                <Line type="monotone" dataKey="restCompliance" name="Rest Compliance (%)" stroke="#10b981" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Branch Fatigue Risk Comparison */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Perbandingan Risiko Kelelahan per Cabang</h3>
              <p className="text-xs text-slate-400">Rata-rata Skor Fatigue & Jumlah Driver High Risk</p>
            </div>
            <Building2 className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchFatigueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="branch" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} />
                <Legend />
                <Bar dataKey="avgScore" name="Rata-Rata Fatigue Score" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                <Bar dataKey="highRisk" name="High Risk Drivers" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Shift Comparison & Fatigue Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shift Comparison */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">Analisis Fatigue per Jenis Shift</h3>
          <div className="space-y-3">
            {shiftComparisonData.map((s, idx) => (
              <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="flex justify-between text-xs font-bold text-white">
                  <span>Shift {s.shift}</span>
                  <span className={s.avgRiskScore < 70 ? 'text-rose-400' : 'text-emerald-400'}>
                    Skor {s.avgRiskScore}/100
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Total Pemicu Alert:</span>
                  <span className="font-semibold text-rose-400">{s.alerts} Alert</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fatigue Risk Heatmap (Hour x Day) */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Fatigue Hour x Day Risk Heatmap</h3>
              <p className="text-xs text-slate-400">Identifikasi window waktu dengan tingkat kelelahan tertinggi</p>
            </div>
            <Calendar className="w-5 h-5 text-indigo-400" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400">
                  <th className="p-2.5 text-left border border-slate-800">Rentang Jam</th>
                  <th className="p-2.5 border border-slate-800">Sen</th>
                  <th className="p-2.5 border border-slate-800">Sel</th>
                  <th className="p-2.5 border border-slate-800">Rab</th>
                  <th className="p-2.5 border border-slate-800">Kam</th>
                  <th className="p-2.5 border border-slate-800">Jum</th>
                  <th className="p-2.5 border border-slate-800">Sab</th>
                  <th className="p-2.5 border border-slate-800">Ming</th>
                </tr>
              </thead>
              <tbody>
                {heatmapMatrix.map((row, idx) => (
                  <tr key={idx}>
                    <td className="p-2.5 font-bold text-white text-left border border-slate-800 bg-slate-950/60">
                      {row.hour}
                    </td>
                    {[row.mon, row.tue, row.wed, row.thu, row.fri, row.sat, row.sun].map((val, cellIdx) => (
                      <td
                        key={cellIdx}
                        className={`p-2.5 border border-slate-800 font-bold text-[10px] ${
                          val === 'CRITICAL' ? 'bg-rose-500/30 text-rose-300' :
                          val === 'HIGH' ? 'bg-orange-500/30 text-orange-300' :
                          val === 'MODERATE' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/10 text-emerald-400'
                        }`}
                      >
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
