/**
 * Safety Analytics & Risk Hotspot Tab
 * PROMPT 22 Section 63 - 70
 */

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import { BarChart3, MapPin, Clock, ShieldAlert } from 'lucide-react';

export const AnalyticsTab: React.FC = () => {
  const trendData = [
    { month: 'Jan', accidents: 2, incidents: 4, nearMiss: 6 },
    { month: 'Feb', accidents: 1, incidents: 5, nearMiss: 8 },
    { month: 'Mar', accidents: 3, incidents: 6, nearMiss: 10 },
    { month: 'Apr', accidents: 1, incidents: 3, nearMiss: 7 },
    { month: 'May', accidents: 0, incidents: 4, nearMiss: 9 },
    { month: 'Jun', accidents: 2, incidents: 3, nearMiss: 5 },
    { month: 'Jul', accidents: 1, incidents: 2, nearMiss: 4 },
  ];

  const severityData = [
    { name: 'Low', value: 12, color: '#38bdf8' },
    { name: 'Medium', value: 8, color: '#f59e0b' },
    { name: 'High', value: 4, color: '#f97316' },
    { name: 'Critical', value: 2, color: '#f43f5e' },
  ];

  const rootCauseData = [
    { category: 'Driver Behavior', percent: 38 },
    { category: 'Vehicle Condition', percent: 24 },
    { category: 'Road & Weather', percent: 18 },
    { category: 'Process & Schedule', percent: 14 },
    { category: 'Others', percent: 6 },
  ];

  const timeHotspotData = [
    { hour: '00:00 - 04:00', count: 9 },
    { hour: '04:00 - 08:00', count: 3 },
    { hour: '08:00 - 12:00', count: 5 },
    { hour: '12:00 - 16:00', count: 12 },
    { hour: '16:00 - 20:00', count: 7 },
    { hour: '20:00 - 24:00', count: 10 },
  ];

  return (
    <div className="space-y-6">
      {/* Charts Grid Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-cyan-400" /> Tren Kejadian Safety (Accident, Incident, Near Miss)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Bar dataKey="accidents" fill="#f43f5e" name="Accidents" radius={[4, 4, 0, 0]} />
                <Bar dataKey="incidents" fill="#f59e0b" name="Incidents" radius={[4, 4, 0, 0]} />
                <Bar dataKey="nearMiss" fill="#06b6d4" name="Near Miss" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-rose-400" /> Distribusi Tingkat Keparahan (Severity Rate)
          </h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Grid Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Root Cause Distribution */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white">Distribusi Akar Masalah (Root Cause Breakdown)</h3>
          <div className="space-y-3">
            {rootCauseData.map((rc) => (
              <div key={rc.category} className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-300 font-semibold">
                  <span>{rc.category}</span>
                  <span className="text-cyan-400 font-bold">{rc.percent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-cyan-500" style={{ width: `${rc.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time Hotspot Analysis */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-400" /> Analisis Jam Rawan Kejadian (Time Hotspot)
          </h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeHotspotData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
