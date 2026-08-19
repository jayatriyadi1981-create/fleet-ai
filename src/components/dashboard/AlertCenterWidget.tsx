/**
 * Fleet Intelligence Smart AI - Active Alert Center Widget
 * PROMPT 8 - Active Alerts KPI & Categorized Safety Feed
 */

import React from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  ChevronRight,
  Gauge,
  Fuel,
  Wrench,
  MapPin
} from 'lucide-react';
import { AlertKPISummary, DashboardAlertItem } from '../../types/dashboard';

interface AlertCenterWidgetProps {
  summary: { kpi: AlertKPISummary; recentAlerts: DashboardAlertItem[] } | null;
  isLoading: boolean;
  onOpenAlerts: (severityFilter?: string) => void;
}

export const AlertCenterWidget: React.FC<AlertCenterWidgetProps> = ({
  summary,
  isLoading,
  onOpenAlerts,
}) => {
  if (isLoading || !summary) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3 animate-pulse h-80">
        <div className="h-4 w-1/3 bg-slate-800 rounded" />
        <div className="grid grid-cols-4 gap-2 h-16 bg-slate-800 rounded-xl" />
        <div className="space-y-2">
          <div className="h-12 bg-slate-800 rounded-xl" />
          <div className="h-12 bg-slate-800 rounded-xl" />
        </div>
      </div>
    );
  }

  const kpis = summary.kpi;
  const recentAlerts = summary.recentAlerts;

  const severityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="flex items-center gap-1 rounded-md bg-rose-500/20 px-2 py-0.5 text-[10px] font-extrabold text-rose-400 border border-rose-500/30">
            <ShieldAlert className="h-3 w-3" /> CRITICAL
          </span>
        );
      case 'warning':
      case 'high':
        return (
          <span className="flex items-center gap-1 rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-extrabold text-amber-400 border border-amber-500/30">
            <AlertTriangle className="h-3 w-3" /> HIGH
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 rounded-md bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-500/30">
            <Info className="h-3 w-3" /> MEDIUM
          </span>
        );
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'speed':
      case 'harsh_brake':
        return <Gauge className="h-4 w-4 text-rose-400" />;
      case 'fuel_drop':
        return <Fuel className="h-4 w-4 text-amber-400" />;
      case 'maintenance':
        return <Wrench className="h-4 w-4 text-sky-400" />;
      default:
        return <MapPin className="h-4 w-4 text-cyan-400" />;
    }
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md shadow-xl h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Alert Center & Operational Hazards</h3>
            <p className="text-[11px] text-slate-400">Peringatan overspeed, geofence, dan anomaly telematika</p>
          </div>
        </div>

        <button
          onClick={() => onOpenAlerts()}
          className="flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 hover:underline"
        >
          <span>Buka Alert Log</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Alert Severity KPI Mini Cards */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => onOpenAlerts('critical')}
          className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-2.5 text-center transition-all hover:bg-rose-950/40 active:scale-95"
        >
          <div className="text-[10px] font-bold text-rose-400 uppercase">Critical</div>
          <div className="text-lg font-black text-white">{kpis.critical}</div>
        </button>

        <button
          onClick={() => onOpenAlerts('warning')}
          className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-2.5 text-center transition-all hover:bg-amber-950/40 active:scale-95"
        >
          <div className="text-[10px] font-bold text-amber-400 uppercase">High</div>
          <div className="text-lg font-black text-white">{kpis.high}</div>
        </button>

        <button
          onClick={() => onOpenAlerts('info')}
          className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-2.5 text-center transition-all hover:bg-cyan-950/40 active:scale-95"
        >
          <div className="text-[10px] font-bold text-cyan-400 uppercase">Medium</div>
          <div className="text-lg font-black text-white">{kpis.medium}</div>
        </button>

        <button
          onClick={() => onOpenAlerts('resolved')}
          className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-2.5 text-center transition-all hover:bg-emerald-950/40 active:scale-95"
        >
          <div className="text-[10px] font-bold text-emerald-400 uppercase">Resolved</div>
          <div className="text-lg font-black text-white">{kpis.resolvedToday}</div>
        </button>
      </div>

      {/* Alert Feed Items */}
      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {recentAlerts.slice(0, 4).map((alt) => (
          <div
            key={alt.id}
            onClick={() => onOpenAlerts(alt.severity)}
            className="group flex items-start justify-between gap-3 rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 text-xs transition-all hover:border-slate-700 hover:bg-slate-800/80 cursor-pointer"
          >
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 mt-0.5 shrink-0">
                {getCategoryIcon(alt.category)}
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-white">{alt.vehiclePlate}</span>
                  {severityBadge(alt.severity)}
                  <span className="text-[10px] text-slate-400 font-medium">({alt.driverName})</span>
                </div>
                <p className="text-slate-300 font-medium truncate">{alt.title}</p>
                <p className="text-[11px] text-slate-400 line-clamp-1">{alt.message}</p>
              </div>
            </div>

            <div className="flex flex-col items-end shrink-0 space-y-1">
              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                <Clock className="h-3 w-3 text-cyan-400" />
                {alt.timeAgo}
              </span>
              <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
