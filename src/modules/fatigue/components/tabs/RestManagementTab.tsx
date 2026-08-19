/**
 * Fleet Intelligence Smart AI - Rest Management Tab
 * PROMPT 23 - Rest Management (/app/fatigue/rest)
 */

import React from 'react';
import { BedDouble, CheckCircle2, Clock, Plus, Info, AlertTriangle } from 'lucide-react';
import { RestSession, DriverFatigueProfile } from '../../types';
import { mockRestSessions } from '../../data/mockFatigueData';

interface RestManagementTabProps {
  profiles: DriverFatigueProfile[];
  onOpenRestModal: () => void;
  onOpenDriverModal: (profile: DriverFatigueProfile) => void;
}

export const RestManagementTab: React.FC<RestManagementTabProps> = ({
  profiles,
  onOpenRestModal,
  onOpenDriverModal,
}) => {
  return (
    <div className="space-y-6">
      {/* Header Cards & Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-2xl">
        <div>
          <h3 className="text-sm font-bold text-white">Manajemen & Kepatuhan Istirahat (Rest Management)</h3>
          <p className="text-xs text-slate-400 mt-0.5">Pemantauan kepatuhan durasi istirahat minimal 8 jam sebelum penugasan shift</p>
        </div>

        <button
          onClick={onOpenRestModal}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors"
        >
          <Plus className="w-4 h-4" />
          Input Log Istirahat
        </button>
      </div>

      {/* Rest Compliance Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-5 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Pengemudi (Driver)</th>
                <th className="p-3.5">Istirahat Terakhir</th>
                <th className="p-3.5">Durasi Istirahat</th>
                <th className="p-3.5">Syarat Kebijakan</th>
                <th className="p-3.5">Rest Compliance %</th>
                <th className="p-3.5">Sumber Data</th>
                <th className="p-3.5">Status Risiko</th>
                <th className="p-3.5">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {profiles.map((profile) => {
                const required = 8.0;
                const actual = profile.restHoursToday;
                const compliance = Math.min(100, Math.round((actual / required) * 100));

                return (
                  <tr key={profile.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-3.5">
                      <span className="font-bold text-white block">{profile.driverName}</span>
                      <span className="text-[11px] text-slate-500">{profile.branchName}</span>
                    </td>
                    <td className="p-3.5 text-slate-300">
                      {new Date(profile.lastRestAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3.5 font-bold text-emerald-400">
                      {actual.toFixed(1)} jam
                    </td>
                    <td className="p-3.5 text-slate-400">
                      {required.toFixed(1)} jam
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${compliance >= 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {compliance}%
                        </span>
                        <div className="w-16 bg-slate-950 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${compliance >= 100 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${Math.min(100, compliance)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-400">
                      <span className="px-2 py-0.5 text-[10px] bg-slate-950 border border-slate-800 rounded font-medium">
                        {profile.dataSource}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                        compliance >= 100 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {compliance >= 100 ? 'SUFFICIENT' : 'INSUFFICIENT'}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => onOpenDriverModal(profile)}
                        className="px-2.5 py-1 bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white rounded font-medium text-xs transition-colors"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
