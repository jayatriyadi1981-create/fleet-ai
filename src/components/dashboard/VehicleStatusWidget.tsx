/**
 * Fleet Intelligence Smart AI - Vehicle Status Distribution Widget
 * PROMPT 8 - Donut Chart, Status Distribution & Interactive Drill-down
 */

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Play, PauseCircle, Square, WifiOff, Wrench, ChevronRight } from 'lucide-react';
import { VehicleStatusSummary } from '../../types/dashboard';

interface VehicleStatusWidgetProps {
  summary: VehicleStatusSummary | null;
  isLoading: boolean;
  onStatusSelect: (status: string) => void;
}

export const VehicleStatusWidget: React.FC<VehicleStatusWidgetProps> = ({
  summary,
  isLoading,
  onStatusSelect,
}) => {
  if (isLoading || !summary) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 animate-pulse h-80">
        <div className="h-4 w-1/3 bg-slate-800 rounded" />
        <div className="h-44 w-44 mx-auto rounded-full bg-slate-800" />
      </div>
    );
  }

  const chartData = [
    { name: 'Moving (Bergerak)', value: summary.moving, color: '#10b981', key: 'moving' },
    { name: 'Idle (Mesin Nyala)', value: summary.idle, color: '#f59e0b', key: 'idle' },
    { name: 'Stopped (Parkir)', value: summary.stopped, color: '#38bdf8', key: 'parking' },
    { name: 'Offline (No Signal)', value: summary.offline, color: '#64748b', key: 'offline' },
    { name: 'Maintenance', value: summary.maintenance, color: '#f43f5e', key: 'maintenance' },
  ].filter((item) => item.value > 0);

  const statusList = [
    {
      key: 'moving',
      label: 'Moving (Bergerak)',
      count: summary.moving,
      percentage: summary.total > 0 ? Math.round((summary.moving / summary.total) * 100) : 0,
      icon: Play,
      iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      badgeClass: 'text-emerald-400',
      barColor: 'bg-emerald-500',
    },
    {
      key: 'idle',
      label: 'Idle (Mesin Nyala)',
      count: summary.idle,
      percentage: summary.total > 0 ? Math.round((summary.idle / summary.total) * 100) : 0,
      icon: PauseCircle,
      iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      badgeClass: 'text-amber-400',
      barColor: 'bg-amber-500',
    },
    {
      key: 'parking',
      label: 'Stopped (Parkir)',
      count: summary.stopped,
      percentage: summary.total > 0 ? Math.round((summary.stopped / summary.total) * 100) : 0,
      icon: Square,
      iconColor: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
      badgeClass: 'text-sky-400',
      barColor: 'bg-sky-500',
    },
    {
      key: 'offline',
      label: 'Offline / Disconnected',
      count: summary.offline,
      percentage: summary.total > 0 ? Math.round((summary.offline / summary.total) * 100) : 0,
      icon: WifiOff,
      iconColor: 'text-slate-400 bg-slate-800 border-slate-700',
      badgeClass: 'text-slate-400',
      barColor: 'bg-slate-500',
    },
    {
      key: 'maintenance',
      label: 'Dalam Perawatan / Servis',
      count: summary.maintenance,
      percentage: summary.total > 0 ? Math.round((summary.maintenance / summary.total) * 100) : 0,
      icon: Wrench,
      iconColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      badgeClass: 'text-rose-400',
      barColor: 'bg-rose-500',
    },
  ];

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md shadow-xl h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">Status Distribusi Kendaraan</h3>
          <p className="text-[11px] text-slate-400">Distribusi real-time kondisi {summary.total} armada active</p>
        </div>
        <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-300 border border-slate-700">
          Total: {summary.total} Unit
        </span>
      </div>

      {/* Main Grid: Recharts Donut & Detailed Status Progress Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        {/* Donut Chart Visualizer */}
        <div className="sm:col-span-5 h-44 w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#090d16',
                  borderColor: '#1e293b',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#f8fafc',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-2xl font-black text-white">{summary.total}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Armada</span>
          </div>
        </div>

        {/* Status Distribution List */}
        <div className="sm:col-span-7 space-y-2">
          {statusList.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => onStatusSelect(item.key)}
                className="group flex w-full flex-col gap-1 rounded-xl border border-slate-800/80 bg-slate-950/60 p-2.5 text-left transition-all hover:border-cyan-500/40 hover:bg-slate-800/80 active:scale-95"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 font-semibold text-slate-200">
                    <span className={`flex h-5 w-5 items-center justify-center rounded-md border ${item.iconColor}`}>
                      <Icon className="h-3 w-3" />
                    </span>
                    {item.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`font-black ${item.badgeClass}`}>{item.count} Unit</span>
                    <span className="text-[10px] text-slate-400">({item.percentage}%)</span>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full rounded-full ${item.barColor} transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
