/**
 * Fleet Intelligence Smart AI - Maintenance Health & Mini Calendar Widget
 * PROMPT 8 - Fleet Maintenance Metrics, Component Health Score & Schedule Preview
 */

import React, { useState } from 'react';
import { 
  Wrench, 
  Calendar as CalendarIcon, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  AlertOctagon,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { MaintenanceHealthSummary } from '../../types/dashboard';

interface MaintenanceHealthWidgetProps {
  summary: MaintenanceHealthSummary | null;
  isLoading: boolean;
  onOpenMaintenancePage: () => void;
}

export const MaintenanceHealthWidget: React.FC<MaintenanceHealthWidgetProps> = ({
  summary,
  isLoading,
  onOpenMaintenancePage,
}) => {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  if (isLoading || !summary) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 animate-pulse h-80">
        <div className="h-4 w-1/3 bg-slate-800 rounded" />
        <div className="grid grid-cols-4 gap-2 h-16 bg-slate-800 rounded-xl" />
        <div className="h-36 bg-slate-800 rounded-xl" />
      </div>
    );
  }

  const selectedEvent = summary.upcomingCalendarEvents.find((e) => e.id === selectedEventId) || summary.upcomingCalendarEvents[0];

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md shadow-xl h-full space-y-4">
      {/* Widget Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Wrench className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Maintenance & Vehicle Health</h3>
            <p className="text-[11px] text-slate-400">Status kelayakan armada, WO aktif, dan kalender perawatan</p>
          </div>
        </div>

        <button
          onClick={onOpenMaintenancePage}
          className="flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 hover:underline"
        >
          <span>Buka Work Orders</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Health Score & Status Counts Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <div className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-2 text-center">
          <span className="text-[10px] font-bold text-emerald-400 uppercase">Fleet Health</span>
          <span className="text-2xl font-black text-white">{summary.overallHealthPercent}%</span>
          <span className="text-[10px] text-emerald-400 font-semibold">Overall Healthy</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-2 text-center">
          <span className="text-[10px] font-bold text-amber-400 uppercase">Due Soon</span>
          <span className="text-lg font-black text-white">{summary.dueSoon}</span>
          <span className="text-[9px] text-slate-400">Unit Servis</span>
        </div>

        <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-2 text-center">
          <span className="text-[10px] font-bold text-rose-400 uppercase">Overdue</span>
          <span className="text-lg font-black text-rose-400">{summary.overdue}</span>
          <span className="text-[9px] text-rose-300">Terlambat</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-2 text-center">
          <span className="text-[10px] font-bold text-sky-400 uppercase">In Service</span>
          <span className="text-lg font-black text-white">{summary.inService}</span>
          <span className="text-[9px] text-slate-400">Di Bengkel</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-2 text-center hidden sm:block">
          <span className="text-[10px] font-bold text-rose-500 uppercase">Breakdown</span>
          <span className="text-lg font-black text-rose-500">{summary.breakdown}</span>
          <span className="text-[9px] text-slate-400">Mogok</span>
        </div>
      </div>

      {/* Mini Maintenance Calendar & Event Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300 flex items-center gap-1.5">
            <CalendarIcon className="h-3.5 w-3.5 text-cyan-400" />
            <span>Jadwal Perawatan - Agustus 2026</span>
          </span>
          <span className="text-[10px] text-slate-400">3 Jadwal Terdekat</span>
        </div>

        <div className="space-y-1.5">
          {summary.upcomingCalendarEvents.map((evt) => (
            <div
              key={evt.id}
              onClick={() => setSelectedEventId(evt.id)}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer text-xs ${
                evt.id === selectedEvent?.id
                  ? 'border-cyan-500 bg-cyan-500/10 text-white'
                  : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                  evt.priority === 'urgent' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                  evt.priority === 'high' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                }`}>
                  {evt.dueDate}
                </span>
                <div className="min-w-0">
                  <p className="font-bold text-white truncate">{evt.vehiclePlate} — {evt.type}</p>
                  <p className="text-[10px] text-slate-400 truncate">{evt.workshopName}</p>
                </div>
              </div>

              <ChevronRight className="h-4 w-4 text-slate-500 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* System Health Component Meter */}
      <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3 space-y-1.5 text-xs">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Indikator Komponen Armada</p>
        <div className="grid grid-cols-5 gap-2 text-center text-[10px]">
          <div>
            <span className="text-slate-400 block">Mesin</span>
            <span className="font-bold text-emerald-400">{summary.healthBreakdown.engine}%</span>
          </div>
          <div>
            <span className="text-slate-400 block">Aki</span>
            <span className="font-bold text-emerald-400">{summary.healthBreakdown.battery}%</span>
          </div>
          <div>
            <span className="text-slate-400 block">GPS</span>
            <span className="font-bold text-emerald-400">{summary.healthBreakdown.gpsDevice}%</span>
          </div>
          <div>
            <span className="text-slate-400 block">Ban</span>
            <span className="font-bold text-amber-400">{summary.healthBreakdown.tires}%</span>
          </div>
          <div>
            <span className="text-slate-400 block">Servis</span>
            <span className="font-bold text-emerald-400">{summary.healthBreakdown.service}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
