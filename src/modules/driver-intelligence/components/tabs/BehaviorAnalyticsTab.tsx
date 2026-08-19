/**
 * Driver Intelligence - Behavior Analytics Tab
 * Multi-dimensional telematic analytics, time-based risk analysis, and risk hotspots
 * PROMPT 21 Architecture
 */

import React, { useState } from 'react';
import { behaviorStore } from '../../services/behaviorStore';
import {
  BarChart3,
  MapPin,
  Clock,
  Download,
  Calendar,
  Layers,
  ShieldAlert,
  Flame,
} from 'lucide-react';

export const BehaviorAnalyticsTab: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '90D' | '12M'>('30D');
  const events = behaviorStore.getEvents();
  const hotspots = behaviorStore.getHotspots();

  const timeBuckets = {
    morning: events.filter((e) => {
      const h = new Date(e.timestamp).getHours();
      return h >= 6 && h < 12;
    }).length,
    afternoon: events.filter((e) => {
      const h = new Date(e.timestamp).getHours();
      return h >= 12 && h < 18;
    }).length,
    evening: events.filter((e) => {
      const h = new Date(e.timestamp).getHours();
      return h >= 18 && h < 24;
    }).length,
    night: events.filter((e) => {
      const h = new Date(e.timestamp).getHours();
      return h >= 0 && h < 6;
    }).length,
  };

  const handleExportCSV = () => {
    const headers = 'ID,Driver,Vehicle,EventType,Severity,Speed,SpeedLimit,Location,Timestamp\n';
    const rows = events.map(e => `${e.id},"${e.driverName}","${e.vehiclePlate}",${e.eventType},${e.severity},${e.speed},${e.speedLimit},"${e.locationName}",${e.timestamp}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Driver_Behavior_Analytics_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-cyan-400" /> Behavior Analytics & Hotspot Intelligence
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Visualisasi tren temporal, analisis area berisiko tinggi (Hotspots), dan statistik agregat
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs font-semibold text-slate-400">
            {(['7D', '30D', '90D', '12M'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeframe === t ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800 text-xs font-bold transition-all"
          >
            <Download className="h-4 w-4 text-cyan-400" /> Export Analytics (CSV)
          </button>
        </div>
      </div>

      {/* Grid: Time of Day Distribution & Hotspots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time of Day Analysis */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-400" /> Analisis Distribusi Risiko Berdasarkan Waktu
            </h3>
            <span className="text-[10px] font-mono text-slate-400">TIME-BASED CLUSTER</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold block">PAGI (06:00 - 12:00)</span>
              <span className="text-2xl font-bold text-cyan-400">{timeBuckets.morning}</span>
              <span className="text-[10px] text-slate-500 block">events</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-1">
              <span className="text-[10px] text-amber-400 font-semibold block">SIANG-SORE (12:00 - 18:00)</span>
              <span className="text-2xl font-bold text-amber-300">{timeBuckets.afternoon}</span>
              <span className="text-[10px] text-amber-400/80 block font-semibold">★ Konsentrasi Tertinggi</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold block">MALAM (18:00 - 24:00)</span>
              <span className="text-2xl font-bold text-blue-400">{timeBuckets.evening}</span>
              <span className="text-[10px] text-slate-500 block">events</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold block">DINI HARI (00:00 - 06:00)</span>
              <span className="text-2xl font-bold text-rose-400">{timeBuckets.night}</span>
              <span className="text-[10px] text-slate-500 block">events</span>
            </div>
          </div>
        </div>

        {/* Hotspots Breakdown */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className="h-4 w-4 text-rose-400" /> Area Rawan Risiko (Risk Hotspots)
            </h3>
            <span className="text-[10px] font-mono text-rose-300 font-bold">HIGH INCIDENCE ZONES</span>
          </div>

          <div className="space-y-3">
            {hotspots.map((hs) => (
              <div key={hs.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-rose-400" /> {hs.locationName} ({hs.city})
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {hs.totalEvents} EVENTS
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Cabang: {hs.branchName}</span>
                  <span className="text-cyan-400 font-semibold">Dominan: {hs.primaryEventType}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
