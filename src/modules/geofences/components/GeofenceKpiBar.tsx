/**
 * Fleet Intelligence Smart AI - Geofencing KPI Bar
 * Displays live stats for Total Geofences, Active, Inactive, Vehicles Inside, Recent Entries, Exits & Dwell Alerts
 */

import React from 'react';
import { Geofence, GeofenceEvent, VehicleGeofenceState } from '../geofenceTypes';
import {
  Map,
  CheckCircle2,
  AlertTriangle,
  Truck,
  ArrowRightLeft,
  Clock,
  BellRing,
  XCircle
} from 'lucide-react';

interface GeofenceKpiBarProps {
  geofences: Geofence[];
  events: GeofenceEvent[];
  onFilterClick?: (filterType: string) => void;
}

export const GeofenceKpiBar: React.FC<GeofenceKpiBarProps> = ({
  geofences,
  events,
  onFilterClick
}) => {
  const totalCount = geofences.length;
  const activeCount = geofences.filter((g) => g.status === 'ACTIVE').length;
  const inactiveCount = geofences.filter((g) => g.status === 'INACTIVE').length;

  // Recent entries/exits/dwells in last 24h
  const now = new Date().getTime();
  const last24hEvents = events.filter((e) => now - new Date(e.timestamp).getTime() <= 24 * 3600 * 1000);
  const recentEntries = last24hEvents.filter((e) => e.eventType === 'ENTER').length;
  const recentExits = last24hEvents.filter((e) => e.eventType === 'EXIT').length;
  const dwellAlerts = last24hEvents.filter((e) => e.eventType === 'DWELL').length;
  const activeAlerts = last24hEvents.filter((e) => e.severity === 'HIGH' || e.severity === 'CRITICAL').length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {/* 1. Total Geofences */}
      <div
        onClick={() => onFilterClick && onFilterClick('ALL')}
        className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-3.5 rounded-2xl cursor-pointer transition-all shadow-md group"
      >
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider">Total Geofences</span>
          <Map className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="text-xl font-extrabold text-white">{totalCount}</div>
        <span className="text-[10px] text-slate-500 font-medium">Kawasan Terdaftar</span>
      </div>

      {/* 2. Active */}
      <div
        onClick={() => onFilterClick && onFilterClick('ACTIVE')}
        className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-3.5 rounded-2xl cursor-pointer transition-all shadow-md group"
      >
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider">Active</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="text-xl font-extrabold text-emerald-400">{activeCount}</div>
        <span className="text-[10px] text-emerald-500/80 font-medium">Monitoring Berjalan</span>
      </div>

      {/* 3. Inactive */}
      <div
        onClick={() => onFilterClick && onFilterClick('INACTIVE')}
        className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-3.5 rounded-2xl cursor-pointer transition-all shadow-md group"
      >
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider">Inactive</span>
          <XCircle className="w-4 h-4 text-slate-500 group-hover:scale-110 transition-transform" />
        </div>
        <div className="text-xl font-extrabold text-slate-400">{inactiveCount}</div>
        <span className="text-[10px] text-slate-500 font-medium">Non-Aktif</span>
      </div>

      {/* 4. Vehicles Inside */}
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl shadow-md group">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider">Vehicles Inside</span>
          <Truck className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="text-xl font-extrabold text-cyan-300">2 Armada</div>
        <span className="text-[10px] text-cyan-500/80 font-medium">Di Dalam Kawasan</span>
      </div>

      {/* 5. Recent Entries */}
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl shadow-md group">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider">Recent Entries</span>
          <ArrowRightLeft className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="text-xl font-extrabold text-indigo-300">{recentEntries}</div>
        <span className="text-[10px] text-indigo-500/80 font-medium">Masuk 24 Jam Terakhir</span>
      </div>

      {/* 6. Recent Exits */}
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl shadow-md group">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider">Recent Exits</span>
          <ArrowRightLeft className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="text-xl font-extrabold text-purple-300">{recentExits}</div>
        <span className="text-[10px] text-purple-500/80 font-medium">Keluar 24 Jam Terakhir</span>
      </div>

      {/* 7. Dwell Alerts */}
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl shadow-md group">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider">Dwell Alerts</span>
          <Clock className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="text-xl font-extrabold text-amber-400">{dwellAlerts}</div>
        <span className="text-[10px] text-amber-500/80 font-medium">Peringatan Overstay</span>
      </div>

      {/* 8. Active Alerts */}
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl shadow-md group">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider">Active Alerts</span>
          <BellRing className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="text-xl font-extrabold text-rose-400">{activeAlerts}</div>
        <span className="text-[10px] text-rose-500/80 font-medium">Alerts Kritis</span>
      </div>
    </div>
  );
};
