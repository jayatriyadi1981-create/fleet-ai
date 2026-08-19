/**
 * Fleet Intelligence Smart AI - Route Deviation Detection Tab
 * Tracks Off-Route events, Corridor Threshold breaches, AI root cause hypotheses,
 * recovery status, and enables dispatcher acknowledgement and resolution.
 */

import React, { useState } from 'react';
import { RouteDeviationEvent, DeviationStatus } from '../../types';
import { routeDeviationEngine } from '../../engines/RouteDeviationEngine';
import { 
  AlertTriangle, 
  Search, 
  Sliders, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  Sparkles, 
  CornerDownRight,
  Eye
} from 'lucide-react';

interface RouteDeviationTabProps {
  onSelectDeviation?: (dev: RouteDeviationEvent) => void;
}

export const RouteDeviationTab: React.FC<RouteDeviationTabProps> = ({ onSelectDeviation }) => {
  const [deviations, setDeviations] = useState<RouteDeviationEvent[]>(routeDeviationEngine.getAllDeviations());
  const [threshold, setThreshold] = useState<number>(routeDeviationEngine.getCorridorThreshold());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const handleUpdateThreshold = (val: number) => {
    setThreshold(val);
    routeDeviationEngine.setCorridorThreshold(val);
  };

  const handleStatusChange = (id: string, status: DeviationStatus) => {
    routeDeviationEngine.updateDeviationStatus(id, status);
    setDeviations([...routeDeviationEngine.getAllDeviations()]);
  };

  const filtered = deviations.filter((d) => {
    const matchesSearch = 
      d.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
      d.driverName.toLowerCase().includes(search.toLowerCase()) ||
      d.tripNumber.toLowerCase().includes(search.toLowerCase()) ||
      d.aiReasonExplanation.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Configuration & Filter Bar */}
      <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Engine Deteksi Deviasi Rute & Koridor</h3>
            <p className="text-xs text-slate-400">
              Mendeteksi penyimpangan lintasan telemetri, rute darurat, dan pemberhentian ilegal.
            </p>
          </div>
        </div>

        {/* Corridor threshold input */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
          <Sliders className="h-4 w-4 text-cyan-400" />
          <span className="text-slate-400 font-semibold">Toleransi Koridor:</span>
          <input
            type="number"
            value={threshold}
            onChange={(e) => handleUpdateThreshold(Number(e.target.value))}
            className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-0.5 text-xs text-white font-mono text-center font-bold"
            step="50"
            min="50"
          />
          <span className="text-slate-400">Meter</span>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari plat, pengemudi, trip..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-300"
        >
          <option value="ALL">Semua Status Deviasi</option>
          <option value="ACTIVE">Active Alert</option>
          <option value="RECOVERED">Recovered (Kembali ke Rute)</option>
          <option value="ACKNOWLEDGED">Acknowledged</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      {/* Deviations List Cards */}
      <div className="space-y-3">
        {filtered.map((dev) => {
          const isActive = dev.status === 'ACTIVE';

          return (
            <div
              key={dev.id}
              className={`rounded-2xl p-5 border transition-all space-y-3 ${
                isActive
                  ? 'bg-slate-900 border-rose-500/60 shadow-xl shadow-rose-950/20 ring-1 ring-rose-500/30'
                  : 'bg-slate-900/70 border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="font-bold font-mono text-white text-base">{dev.plateNumber}</div>
                  <span className="text-xs text-slate-400">• {dev.driverName} ({dev.branch})</span>
                  <span className="text-xs text-cyan-400 font-mono font-semibold">[{dev.tripNumber}]</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                    isActive ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse' :
                    dev.status === 'RECOVERED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {dev.status}
                  </span>
                  <span className="text-xs text-slate-400">{new Date(dev.timestamp).toLocaleTimeString()} WIB</span>
                </div>
              </div>

              {/* Locations Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">LOKASI RUTE RENCANA</span>
                  <div className="flex items-center gap-1.5 text-slate-300 mt-1">
                    <MapPin className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                    <span>{dev.plannedLocation.address}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">POSISI AKTUAL GPS (DEVIATED)</span>
                  <div className="flex items-center gap-1.5 text-rose-300 mt-1 font-semibold">
                    <AlertTriangle className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                    <span>{dev.actualLocation.address}</span>
                  </div>
                </div>
              </div>

              {/* AI Inferred Root Cause & Telemetry Evidence */}
              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                    <Sparkles className="h-4 w-4" />
                    <span>Hipotesis Akar Masalah AI: {dev.aiReasonCategory}</span>
                  </div>
                  <span className="text-[11px] text-amber-300 font-mono">
                    Deviasi: <strong>{dev.distanceFromRouteMeters}m</strong> (Batas: {dev.corridorThresholdMeters}m) • {dev.durationMinutes} mnt
                  </span>
                </div>

                <p className="text-slate-300 leading-relaxed">{dev.aiReasonExplanation}</p>

                {dev.evidence && dev.evidence.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-0.5">
                    <strong>Bukti Telemetri: </strong>
                    {dev.evidence.map((ev, i) => (
                      <div key={i} className="flex items-start gap-1">
                        <span>•</span> <span>{ev}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">
                  {dev.recoveryTime ? `Kembali ke koridor pada: ${new Date(dev.recoveryTime).toLocaleTimeString()} WIB` : 'Perjalanan masih berada di luar koridor'}
                </span>

                <div className="flex items-center gap-2">
                  {dev.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleStatusChange(dev.id, 'ACKNOWLEDGED')}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold transition-all"
                    >
                      Acknowledge
                    </button>
                  )}
                  {dev.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleStatusChange(dev.id, 'RESOLVED')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold transition-all"
                    >
                      Tandai Selesai (Resolve)
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
