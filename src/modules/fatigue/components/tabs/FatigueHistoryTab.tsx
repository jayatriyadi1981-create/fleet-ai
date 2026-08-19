/**
 * Fleet Intelligence Smart AI - Fatigue History Tab
 * PROMPT 23 - Fatigue History (/app/fatigue/history)
 */

import React, { useState } from 'react';
import { Calendar, Download, Search, FileSpreadsheet, FileText } from 'lucide-react';
import { FatigueHistoryRecord } from '../../types';
import { mockFatigueHistoryRecords } from '../../data/mockFatigueData';

export const FatigueHistoryTab: React.FC = () => {
  const [search, setSearch] = useState('');
  const [records] = useState<FatigueHistoryRecord[]>(mockFatigueHistoryRecords);

  const filtered = records.filter(
    (r) =>
      r.driverName.toLowerCase().includes(search.toLowerCase()) ||
      r.shiftName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Control & Export Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter riwayat driver atau shift..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export Excel
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors">
            <FileText className="w-4 h-4 text-rose-400" /> Export PDF
          </button>
        </div>
      </div>

      {/* History Records Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Tanggal</th>
                <th className="p-3.5">Pengemudi (Driver)</th>
                <th className="p-3.5">Shift</th>
                <th className="p-3.5">Mengemudi</th>
                <th className="p-3.5">Istirahat</th>
                <th className="p-3.5">Malam</th>
                <th className="p-3.5">Fatigue Score</th>
                <th className="p-3.5">Risiko</th>
                <th className="p-3.5">Alerts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map((record) => (
                <tr key={record.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-3.5 font-semibold text-white">{record.date}</td>
                  <td className="p-3.5 font-bold text-white">{record.driverName}</td>
                  <td className="p-3.5 text-slate-400">{record.shiftName}</td>
                  <td className="p-3.5 font-bold text-white">{record.drivingHours.toFixed(1)} jam</td>
                  <td className="p-3.5 font-bold text-emerald-400">{record.restHours.toFixed(1)} jam</td>
                  <td className="p-3.5 font-bold text-indigo-400">{record.nightHours.toFixed(1)} jam</td>
                  <td className="p-3.5 font-extrabold text-white">{record.fatigueScore}/100</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      record.riskLevel === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400' :
                      record.riskLevel === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                      record.riskLevel === 'MODERATE' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {record.riskLevel}
                    </span>
                  </td>
                  <td className="p-3.5 font-semibold text-rose-400">{record.alertsCount} Alert</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
