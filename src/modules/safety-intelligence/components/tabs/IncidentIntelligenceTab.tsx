/**
 * Incident Intelligence Tab
 * PROMPT 33 Architecture
 */

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Sparkles, 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  User, 
  Truck, 
  ChevronRight, 
  AlertTriangle,
  HelpCircle,
  FileText
} from 'lucide-react';
import { mockIncidents } from '../../../safety/data/mockSafetyData';
import { Incident } from '../../../safety/types';

interface IncidentIntelligenceTabProps {
  onAnalyzeIncident: (incident: Incident) => void;
  onOpen5Why: (incidentId: string) => void;
}

export const IncidentIntelligenceTab: React.FC<IncidentIntelligenceTabProps> = ({
  onAnalyzeIncident,
  onOpen5Why,
}) => {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const filteredIncidents = mockIncidents.filter(inc => {
    const matchesSearch = inc.incidentNumber.toLowerCase().includes(search.toLowerCase()) ||
                          inc.description.toLowerCase().includes(search.toLowerCase()) ||
                          (inc.driverName && inc.driverName.toLowerCase().includes(search.toLowerCase())) ||
                          (inc.vehiclePlate && inc.vehiclePlate.toLowerCase().includes(search.toLowerCase()));
    const matchesSeverity = severityFilter === 'ALL' || inc.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-5">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            Incident Intelligence & Telematics Analyzer
            <span className="px-2 py-0.5 text-xs font-mono font-medium rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {filteredIncidents.length} Kasus
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Analisis telemetri insiden operasional, timeline detik-ke-detik, penguraian faktor kontribusi, dan deteksi missing evidence.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nomor insiden, supir, plat..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-hidden focus:border-emerald-500"
          >
            <option value="ALL">Semua Keparahan</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Incident Cards Table / List */}
      <div className="space-y-3">
        {filteredIncidents.map(inc => (
          <div
            key={inc.id}
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-800 text-amber-400 font-mono text-xs font-bold">
                  {inc.incidentNumber}
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">{inc.description}</h4>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-500" /> {new Date(inc.dateTime).toLocaleString('id-ID')}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-500" /> {inc.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                  inc.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  inc.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {inc.severity} Severity
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {inc.status}
                </span>
              </div>
            </div>

            {/* Middle: Driver, Vehicle, Impact */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pengemudi: <strong className="text-white">{inc.driverName || 'N/A'}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Armada: <strong className="text-white">{inc.vehiclePlate || 'N/A'}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Dampak: <strong className="text-slate-200">{inc.impact}</strong></span>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
              <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Data Telemetri GPS 10Hz Siap Dianalisis AI
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpen5Why(inc.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                  5-Why
                </button>
                <button
                  onClick={() => onAnalyzeIncident(inc)}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Buka AI Telemetry Analysis
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
