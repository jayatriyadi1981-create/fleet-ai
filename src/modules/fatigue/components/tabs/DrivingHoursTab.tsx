/**
 * Fleet Intelligence Smart AI - Driving Hours Management Tab
 * PROMPT 23 - Driving Hours (/app/fatigue/driving-hours)
 */

import React from 'react';
import { Clock, Truck, Play, Pause, CheckCircle2, AlertTriangle, ShieldAlert, Activity } from 'lucide-react';
import { DrivingSession, DriverFatigueProfile } from '../../types';
import { mockDrivingSessions } from '../../data/mockFatigueData';

interface DrivingHoursTabProps {
  profiles: DriverFatigueProfile[];
  onOpenDriverModal: (profile: DriverFatigueProfile) => void;
}

export const DrivingHoursTab: React.FC<DrivingHoursTabProps> = ({ profiles, onOpenDriverModal }) => {
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-xs text-slate-400 font-medium">Rata-Rata Jam Mengemudi Harian</span>
          <p className="text-2xl font-black text-white">5.4 jam / driver</p>
          <span className="text-[11px] text-emerald-400 font-medium">Standar operasional: Max 8 jam</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-xs text-slate-400 font-medium">Driver Sedang Mengemudi (Live GPS)</span>
          <p className="text-2xl font-black text-cyan-400">48 Unit Aktiv</p>
          <span className="text-[11px] text-slate-500">Terhubung via IoT Gateway GPS</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-xs text-slate-400 font-medium">Continuous Driving Threshold Alert</span>
          <p className="text-2xl font-black text-orange-400">4 Driver</p>
          <span className="text-[11px] text-orange-400">Continuous &gt; 3.5 jam tanpa break</span>
        </div>
      </div>

      {/* Active Driving Sessions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden space-y-4 p-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white">Log Jam Mengemudi Real-Time (Active Sessions)</h3>
            <p className="text-xs text-slate-400">Data bersumber dari Telematika GPS, Kontak Mesin (Ignition), & Penugasan Trip</p>
          </div>
          <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
            GPS Ignition Verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Pengemudi (Driver)</th>
                <th className="p-3.5">Kendaraan</th>
                <th className="p-3.5">Hari Ini</th>
                <th className="p-3.5">7 Hari</th>
                <th className="p-3.5">Continuous Driving</th>
                <th className="p-3.5">Lokasi Perjalanan</th>
                <th className="p-3.5">Kepatuhan (Compliance)</th>
                <th className="p-3.5">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {profiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-3.5">
                    <span className="font-bold text-white block">{profile.driverName}</span>
                    <span className="text-[11px] text-slate-500">{profile.branchName}</span>
                  </td>
                  <td className="p-3.5 font-semibold text-cyan-400">
                    {profile.vehiclePlate || 'B 9876 XYZ'}
                  </td>
                  <td className="p-3.5 font-bold text-white">
                    {profile.drivingHoursToday.toFixed(1)} jam
                  </td>
                  <td className="p-3.5 text-slate-300">
                    {(profile.drivingHoursToday * 6.2).toFixed(1)} jam
                  </td>
                  <td className="p-3.5">
                    <span className={`font-bold ${
                      profile.consecutiveDrivingHours >= 4.0 ? 'text-rose-400' :
                      profile.consecutiveDrivingHours >= 3.5 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {profile.consecutiveDrivingHours.toFixed(1)} jam
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-400 max-w-[200px] truncate">
                    Pejagan Pejagan PEJAGAN Rest Area KM 228
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      profile.consecutiveDrivingHours < 4.0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {profile.consecutiveDrivingHours < 4.0 ? 'COMPLIANT' : 'OVER LIMIT'}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
