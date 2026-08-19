/**
 * Driver Intelligence - Behavior Events Tab
 * Real-time event detection log table, filters, review actions, and cluster timeline
 * PROMPT 21 Architecture
 */

import React, { useState } from 'react';
import { behaviorStore } from '../../services/behaviorStore';
import { DriverBehaviorEvent, ReviewStatus } from '../../types';
import {
  ShieldAlert,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  MapPin,
  Gauge,
  User,
  Truck,
  MessageSquare,
  ThumbsUp,
} from 'lucide-react';

interface BehaviorEventsTabProps {
  onSelectEvent: (event: DriverBehaviorEvent) => void;
  onCreateCoaching: (event: DriverBehaviorEvent) => void;
}

export const BehaviorEventsTab: React.FC<BehaviorEventsTabProps> = ({
  onSelectEvent,
  onCreateCoaching,
}) => {
  const [search, setSearch] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [reviewFilter, setReviewFilter] = useState('all');

  const events = behaviorStore.getEvents({
    eventType: eventTypeFilter,
    severity: severityFilter,
    reviewStatus: reviewFilter,
    search,
  });

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'MEDIUM':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      default:
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    }
  };

  const getReviewBadge = (st: ReviewStatus) => {
    switch (st) {
      case 'CONFIRMED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'FALSE_POSITIVE':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'DISMISSED':
        return 'bg-slate-800 text-slate-400 border-slate-700';
      default:
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30 animate-pulse';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white">Log Kejadian Perilaku (Behavior Events)</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftar insiden telemetri valid yang terdeteksi secara otomatis oleh Driver Behavior Engine
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:w-60">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari driver, plat, lokasi..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Type Filter */}
          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">Semua Jenis Event</option>
            <option value="OVERSPEED">Overspeed</option>
            <option value="HARSH_BRAKING">Harsh Braking</option>
            <option value="HARSH_ACCELERATION">Harsh Acceleration</option>
            <option value="SHARP_TURN">Sharp Turn</option>
            <option value="EXCESSIVE_IDLE">Excessive Idle</option>
            <option value="ROUTE_DEVIATION">Route Deviation</option>
          </select>

          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">Semua Severity</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>

          {/* Review Filter */}
          <select
            value={reviewFilter}
            onChange={(e) => setReviewFilter(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">Semua Status Review</option>
            <option value="UNREVIEWED">Unreviewed</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="FALSE_POSITIVE">False Positive</option>
            <option value="DISMISSED">Dismissed</option>
          </select>
        </div>
      </div>

      {/* Events Log Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5">Jenis Event / Severity</th>
                <th className="p-3.5">Pengemudi & Kendaraan</th>
                <th className="p-3.5">Waktu & Lokasi</th>
                <th className="p-3.5">Telemetri Real-time</th>
                <th className="p-3.5">Status Review</th>
                <th className="p-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {events.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl border ${getSeverityBadge(evt.severity)}`}>
                        <ShieldAlert className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-bold text-white block">{evt.eventType.replace('_', ' ')}</span>
                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold border mt-0.5 ${getSeverityBadge(evt.severity)}`}>
                          {evt.severity}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <div className="space-y-0.5">
                      <p className="font-bold text-white flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-cyan-400" /> {evt.driverName}
                      </p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                        <Truck className="h-3 w-3" /> {evt.vehiclePlate}
                      </p>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <div className="space-y-0.5 max-w-xs">
                      <p className="font-mono text-[11px] text-slate-300 flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-400" />
                        {new Date(evt.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                      </p>
                      <p className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-cyan-400 shrink-0" /> {evt.locationName}
                      </p>
                    </div>
                  </td>

                  <td className="p-3.5 font-mono">
                    <div className="space-y-0.5 text-[11px]">
                      <span className="text-white font-bold">{evt.speed} km/h</span>
                      {evt.speedLimit > 0 && <span className="text-slate-400 text-[10px] block">Limit: {evt.speedLimit} km/h</span>}
                      {evt.deceleration && <span className="text-rose-400 text-[10px] block">Decel: {evt.deceleration} m/s²</span>}
                    </div>
                  </td>

                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getReviewBadge(evt.reviewStatus)}`}>
                      {evt.reviewStatus}
                    </span>
                  </td>

                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onCreateCoaching(evt)}
                        title="Buat Coaching"
                        className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onSelectEvent(evt)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <Eye className="h-3.5 w-3.5" /> Detail
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {events.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500 font-semibold">
                    Tidak ada behavior event yang ditemukan sesuai filter
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
