/**
 * Fleet Intelligence Smart AI - Night Driving Intelligence Tab
 * PROMPT 23 - Night Driving (/app/fatigue/night-driving)
 */

import React from 'react';
import { Moon, Clock, ShieldAlert, AlertTriangle, Activity, Globe } from 'lucide-react';
import { DriverFatigueProfile } from '../../types';

interface NightDrivingTabProps {
  profiles: DriverFatigueProfile[];
  onOpenDriverModal: (profile: DriverFatigueProfile) => void;
}

export const NightDrivingTab: React.FC<NightDrivingTabProps> = ({ profiles, onOpenDriverModal }) => {
  const nightDrivers = profiles.filter((p) => p.nightDrivingHoursToday > 0);

  return (
    <div className="space-y-6">
      {/* Night Driving Config Banner */}
      <div className="p-5 bg-indigo-950/20 border border-indigo-800/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
            <Moon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Window Jam Biologis Malam Terkonfigurasi (Night Definition)</h3>
            <p className="text-xs text-indigo-300 mt-0.5">
              Didefinisikan pada jam <strong>22:00 - 06:00 (Timezone Asia/Jakarta)</strong>. Paparan pada jam ini memiliki bobot fatigue 1.5x lebih tinggi.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full flex items-center gap-1.5 flex-shrink-0">
          <Globe className="w-3.5 h-3.5" /> Asia/Jakarta (WIB)
        </span>
      </div>

      {/* Night Driving Drivers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white">Pengemudi dengan Paparan Mengemudi Malam (Night Exposure)</h3>
          <span className="text-xs text-indigo-400 font-semibold">{nightDrivers.length} Driver Terdeteksi Malam Ini</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Pengemudi (Driver)</th>
                <th className="p-3.5">Jam Mengemudi Malam</th>
                <th className="p-3.5">Total Mengemudi Hari Ini</th>
                <th className="p-3.5">Rasio Malam vs Siang</th>
                <th className="p-3.5">Kategori Risiko Malam</th>
                <th className="p-3.5">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {nightDrivers.map((profile) => {
                const ratio = Math.round((profile.nightDrivingHoursToday / (profile.drivingHoursToday || 1)) * 100);

                return (
                  <tr key={profile.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-3.5 font-bold text-white">
                      {profile.driverName}
                      <span className="block text-[11px] text-slate-500 font-normal">{profile.branchName}</span>
                    </td>
                    <td className="p-3.5 font-bold text-indigo-400">
                      {profile.nightDrivingHoursToday.toFixed(1)} jam
                    </td>
                    <td className="p-3.5 text-slate-300">
                      {profile.drivingHoursToday.toFixed(1)} jam
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{ratio}%</span>
                        <div className="w-16 bg-slate-950 h-1.5 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500" style={{ width: `${Math.min(100, ratio)}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                        profile.nightDrivingHoursToday >= 4.0 ? 'bg-rose-500/20 text-rose-400' :
                        profile.nightDrivingHoursToday >= 2.0 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {profile.nightDrivingHoursToday >= 4.0 ? 'HIGH NIGHT EXPOSURE' : 'MODERATE NIGHT EXPOSURE'}
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
