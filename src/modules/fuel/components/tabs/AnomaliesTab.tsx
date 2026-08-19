/**
 * Fleet Intelligence Smart AI - Fuel Anomalies Tab
 * PROMPT 24 - Complete Anomaly Classification Log & Investigation Status
 */

import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, Filter, Search } from 'lucide-react';
import { FuelAnomaly } from '../../types';

interface AnomaliesTabProps {
  anomalies: FuelAnomaly[];
  onOpenEventModal: (anomaly: FuelAnomaly) => void;
}

export const AnomaliesTab: React.FC<AnomaliesTabProps> = ({ anomalies, onOpenEventModal }) => {
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const filtered = selectedType === 'ALL' ? anomalies : anomalies.filter((a) => a.type === selectedType);

  return (
    <div className="space-y-4">
      {/* Type Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
          <Filter className="h-3.5 w-3.5" /> Filter Tipe:
        </span>
        {['ALL', 'SUSPECTED_DRAIN', 'ABNORMAL_CONSUMPTION', 'SENSOR_NOISE', 'REFUELING_MISMATCH'].map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              selectedType === t ? 'bg-cyan-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Waktu</th>
                <th className="p-4">Kendaraan</th>
                <th className="p-4">Tipe Anomali</th>
                <th className="p-4">Tingkat Keparahan</th>
                <th className="p-4">Selisih</th>
                <th className="p-4">Confidence</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((anom) => (
                <tr key={anom.id} className="hover:bg-slate-800/40 transition-all">
                  <td className="p-4 text-slate-400">{new Date(anom.timestamp).toLocaleString('id-ID')}</td>
                  <td className="p-4 font-bold text-white">{anom.vehiclePlate}</td>
                  <td className="p-4 font-bold text-cyan-300">{anom.type}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        anom.severity === 'HIGH' || anom.severity === 'CRITICAL'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {anom.severity}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-rose-400">{anom.variance} L</td>
                  <td className="p-4 font-semibold text-slate-300">{anom.confidence}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-semibold">
                      {anom.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => onOpenEventModal(anom)}
                      className="px-3 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 font-bold text-[11px]"
                    >
                      Buka Investigasi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
