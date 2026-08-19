/**
 * Fleet Intelligence Smart AI - GpsRule Engine & Event Audit Trail View
 */

import React, { useState, useEffect } from 'react';
import { gpsIngestionService } from '../services/GpsIngestionService';
import { defaultGpsRules } from '../repositories/MockGpsRepository';
import { GpsEvent, GpsRule } from '../types/gpsArchitecture';
import { GpsEventBus } from '../services/GpsEventBus';
import { 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Filter, 
  Layers, 
  Bell, 
  Clock,
  UserCheck
} from 'lucide-react';

export const GpsEventRulesView: React.FC = () => {
  const [events, setEvents] = useState<GpsEvent[]>([]);
  const [rules] = useState<GpsRule[]>(defaultGpsRules);
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const refreshEvents = () => {
    setEvents(gpsIngestionService.getEvents(50));
  };

  useEffect(() => {
    refreshEvents();
    const unsub = GpsEventBus.subscribe('GpsEventCreated', () => {
      refreshEvents();
    });
    return unsub;
  }, []);

  const handleAcknowledge = (eventId: string) => {
    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === eventId
          ? { ...evt, status: 'ACKNOWLEDGED', acknowledgedBy: 'Admin Operator', acknowledgedAt: new Date().toISOString() }
          : evt
      )
    );
  };

  const filteredEvents = events.filter((evt) => {
    return severityFilter === 'all' || evt.severity === severityFilter;
  });

  return (
    <div className="space-y-6">
      {/* Rules Engine Config Section */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Aturan Telematika &amp; Evaluator Anomali (Active GpsRules)
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            {rules.length} Aturan Aktif
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rules.map((rule) => (
            <div
              key={rule.ruleId}
              className="rounded-xl bg-slate-950/80 p-4 border border-slate-800 hover:border-cyan-500/30 transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded ${
                    rule.severity === 'CRITICAL'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : rule.severity === 'HIGH'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}
                >
                  {rule.severity}
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              </div>

              <div>
                <h4 className="text-xs font-bold text-white line-clamp-1">{rule.name}</h4>
                <p className="text-[10px] font-mono text-cyan-400 mt-0.5">{rule.eventType}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400 space-y-1">
                <div>Threshold: <span className="text-white">{JSON.stringify(rule.conditions)}</span></div>
                <div>Pembuat: <span className="text-slate-300">{rule.createdBy}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generated Events Log Table */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Log Event Engine Terdeteksi (GpsEvent Stream)
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {events.length} Event
            </span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
            >
              <option value="all">Semua Keparahan</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="INFO">INFO</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 max-h-[350px]">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-[10px] uppercase text-slate-400 sticky top-0">
                <th className="p-2.5">Waktu</th>
                <th className="p-2.5">Event Type</th>
                <th className="p-2.5">Device ID</th>
                <th className="p-2.5">Vehicle ID</th>
                <th className="p-2.5">Keparahan</th>
                <th className="p-2.5">Metadata</th>
                <th className="p-2.5 text-right">Status / Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-[11px]">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-500 italic">
                    Belum ada event anomali telematika terdeteksi.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-900/60">
                    <td className="p-2.5 text-slate-400">{new Date(evt.timestamp).toLocaleTimeString()}</td>
                    <td className="p-2.5 font-bold text-cyan-300">{evt.eventType}</td>
                    <td className="p-2.5 text-white">{evt.deviceId}</td>
                    <td className="p-2.5 text-slate-300">{evt.vehicleId}</td>
                    <td className="p-2.5">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          evt.severity === 'CRITICAL'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : evt.severity === 'HIGH'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        }`}
                      >
                        {evt.severity}
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-400 truncate max-w-[200px]">
                      {JSON.stringify(evt.metadata)}
                    </td>
                    <td className="p-2.5 text-right">
                      {evt.status === 'NEW' ? (
                        <button
                          onClick={() => handleAcknowledge(evt.id)}
                          className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 font-bold text-[10px]"
                        >
                          Acknowledge
                        </button>
                      ) : (
                        <span className="text-emerald-400 font-bold text-[10px] inline-flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> ACKNOWLEDGED
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
