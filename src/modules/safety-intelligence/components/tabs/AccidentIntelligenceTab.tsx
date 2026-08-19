/**
 * Accident Intelligence Tab
 * PROMPT 33 Architecture
 */

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Sparkles, 
  Search, 
  Clock, 
  MapPin, 
  User, 
  Truck, 
  ChevronRight, 
  AlertTriangle,
  HelpCircle,
  Activity,
  DollarSign
} from 'lucide-react';
import { mockAccidents } from '../../../safety/data/mockSafetyData';
import { Accident } from '../../../safety/types';

interface AccidentIntelligenceTabProps {
  onAnalyzeAccident: (accident: Accident) => void;
  onOpen5Why: (accidentId: string) => void;
}

export const AccidentIntelligenceTab: React.FC<AccidentIntelligenceTabProps> = ({
  onAnalyzeAccident,
  onOpen5Why,
}) => {
  const [search, setSearch] = useState('');

  const filteredAccidents = mockAccidents.filter(acc => {
    return acc.incidentNumber.toLowerCase().includes(search.toLowerCase()) ||
           acc.description.toLowerCase().includes(search.toLowerCase()) ||
           (acc.driverName && acc.driverName.toLowerCase().includes(search.toLowerCase())) ||
           (acc.vehiclePlate && acc.vehiclePlate.toLowerCase().includes(search.toLowerCase()));
  });

  return (
    <div className="space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            Accident Intelligence & Crash Reconstruction
            <span className="px-2 py-0.5 text-xs font-mono font-medium rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {filteredAccidents.length} Kasus
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Rekonstruksi impak akselerometer, kurva kecepatan pra-crash, korelasi bukti multi-sumber, dan hierarki akar masalah kecelakaan.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nomor kecelakaan, supir..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-red-500"
          />
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredAccidents.map(acc => (
          <div
            key={acc.id}
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-red-500/40 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-950/50 border border-red-500/30 text-red-400 font-mono text-xs font-bold">
                  {acc.incidentNumber}
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">{acc.description}</h4>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-500" /> {new Date(acc.dateTime).toLocaleString('id-ID')}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-500" /> {acc.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                  acc.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  acc.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}>
                  {acc.severity}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {acc.status}
                </span>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Driver: <strong className="text-white">{acc.driverName}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Armada: <strong className="text-white">{acc.vehiclePlate}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Korban: <strong className="text-white">{acc.injuries} Luka, {acc.fatalities} Fatal</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-red-400 shrink-0" />
                <span>Est. Loss: <strong className="text-white font-mono">Rp {acc.estimatedLossIdr?.toLocaleString('id-ID')}</strong></span>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
              <div className="text-[11px] text-red-400 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Sensor Impak Akselerometer & Deselerasi Siap Direkonstruksi
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpen5Why(acc.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-red-400" />
                  5-Why
                </button>
                <button
                  onClick={() => onAnalyzeAccident(acc)}
                  className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Buka AI Crash Reconstruction
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
