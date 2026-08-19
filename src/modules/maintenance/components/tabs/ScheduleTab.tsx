/**
 * Fleet Intelligence Smart AI - Maintenance Schedule Tab
 * PROMPT 25 - Multi-Trigger Scheduling (KM, Days, Engine Hours)
 */

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  List,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Filter,
  Truck,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { MOCK_MAINTENANCE_SCHEDULES } from '../../data/mockMaintenanceData';
import { MaintenanceSchedule } from '../../types';

interface ScheduleTabProps {
  onSelectVehicle?: (vehicleId: string) => void;
  onCreateSchedule?: () => void;
}

export const ScheduleTab: React.FC<ScheduleTabProps> = ({
  onSelectVehicle,
  onCreateSchedule
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'timeline'>('list');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const schedules = MOCK_MAINTENANCE_SCHEDULES.filter((s) => {
    if (filterStatus === 'ALL') return true;
    return s.status === filterStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OVERDUE':
        return <span className="bg-rose-950 text-rose-300 border border-rose-800/50 px-2.5 py-0.5 rounded-full text-xs font-bold animate-pulse">OVERDUE</span>;
      case 'DUE':
        return <span className="bg-amber-950 text-amber-300 border border-amber-800/50 px-2.5 py-0.5 rounded-full text-xs font-bold">DUE</span>;
      case 'DUE_SOON':
        return <span className="bg-orange-950 text-orange-300 border border-orange-800/50 px-2.5 py-0.5 rounded-full text-xs font-bold">DUE SOON</span>;
      case 'UPCOMING':
        return <span className="bg-cyan-950 text-cyan-300 border border-cyan-800/50 px-2.5 py-0.5 rounded-full text-xs font-bold">UPCOMING</span>;
      default:
        return <span className="bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full text-xs">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-cyan-400" />
            Jadwal Servis Berkala & Multi-Trigger Engine
          </h2>
          <p className="text-xs text-slate-400">
            Penjadwalan otomatis berbasis multi-parameter (KM Odometer, Hari Operasi, atau Jam Kerja Mesin - <em>"Whichever comes first"</em>).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'list' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>Daftar</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'calendar' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>Kalender</span>
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'timeline' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>Timeline</span>
            </button>
          </div>

          <button
            onClick={onCreateSchedule}
            className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-600/30"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Jadwal</span>
          </button>
        </div>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {schedules.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 hover:bg-slate-900 transition-all shadow-xl space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{item.vehiclePlate}</h3>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                        {item.maintenanceType}
                      </span>
                    </div>
                    <p className="text-xs text-cyan-300 font-semibold">{item.serviceName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(item.status)}
                </div>
              </div>

              {/* Multi-Trigger Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* Distance Trigger */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-medium">Trigger Jarak (Odometer)</span>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold text-white">Target: {item.nextDueOdometer.toLocaleString()} KM</span>
                    <span className={`font-bold ${item.remainingKm <= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {item.remainingKm <= 0 ? `Overdue ${Math.abs(item.remainingKm)} KM` : `Sisa ${item.remainingKm} KM`}
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.remainingKm <= 0 ? 'bg-rose-500' : 'bg-cyan-500'}`}
                      style={{ width: `${Math.min(100, Math.max(10, 100 - (item.remainingKm / item.intervalKm) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Date Trigger */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-medium">Trigger Waktu (Kalender)</span>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold text-white">Jatuh Tempo: {item.nextDueDate}</span>
                    <span className={`font-bold ${item.remainingDays <= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {item.remainingDays <= 0 ? `Telat ${Math.abs(item.remainingDays)} Hari` : `Sisa ${item.remainingDays} Hari`}
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.remainingDays <= 0 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(100, Math.max(10, 100 - (item.remainingDays / item.intervalDays) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Engine Hours Trigger */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-medium">Trigger Jam Mesin (Engine Hours)</span>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold text-white">Target: {item.nextDueEngineHours} Jam</span>
                    <span className="text-cyan-300 font-bold">
                      Interval: {item.intervalEngineHours} Jam
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: '85%' }} />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                <span>Kondisi: <strong>{item.triggerCondition.replace('_', ' ')}</strong></span>
                <button
                  onClick={() => onSelectVehicle && onSelectVehicle(item.vehicleId)}
                  className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                >
                  <span>Lihat Histori Servis Kendaraan</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Calendar View Placeholder */}
      {viewMode === 'calendar' && (
        <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/80 text-center space-y-3">
          <CalendarIcon className="h-10 w-10 text-cyan-400 mx-auto" />
          <h3 className="text-sm font-bold text-white">Tampilan Kalender Pemeliharaan Terpadu</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Jadwal servis preventif, KIR Dishub, dan perbaikan terpetakan secara otomatis dalam grid bulanan/mingguan.
          </p>
          <div className="grid grid-cols-7 gap-2 max-w-2xl mx-auto pt-4 text-xs font-mono">
            {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day) => (
              <div key={day} className="p-2 bg-slate-950 rounded-lg text-slate-400 font-bold">{day}</div>
            ))}
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 text-left min-h-[60px]">
                <span className="text-[10px] text-slate-500 block">{i + 15} Agu</span>
                {i === 0 && <span className="bg-rose-950 text-rose-300 text-[9px] px-1 py-0.5 rounded block mt-1">B 9301 (Overdue)</span>}
                {i === 1 && <span className="bg-amber-950 text-amber-300 text-[9px] px-1 py-0.5 rounded block mt-1">B 9778 (Due)</span>}
                {i === 3 && <span className="bg-cyan-950 text-cyan-300 text-[9px] px-1 py-0.5 rounded block mt-1">B 9488 (10k)</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4">
          <h3 className="text-sm font-bold text-white">Timeline Alur Servis Mendatang</h3>
          <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {schedules.map((s, idx) => (
              <div key={idx} className="relative pl-8 space-y-1">
                <div className="absolute left-1.5 top-1.5 h-3.5 w-3.5 rounded-full bg-cyan-500 border-2 border-slate-900" />
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-white">{s.vehiclePlate}</span> - <span className="text-cyan-300">{s.serviceName}</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Jatuh Tempo: {s.nextDueDate} ({s.remainingKm} KM)</p>
                  </div>
                  {getStatusBadge(s.status)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
