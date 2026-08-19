/**
 * Fleet Intelligence Smart AI - Shift Management Tab
 * PROMPT 23 - Shift Management (/app/fatigue/shifts)
 */

import React from 'react';
import { Calendar, Clock, Plus, Users, AlertTriangle, Building2, CheckCircle2 } from 'lucide-react';
import { Shift, DriverFatigueProfile } from '../../types';
import { mockShifts } from '../../data/mockFatigueData';

interface ShiftManagementTabProps {
  shifts: Shift[];
  profiles: DriverFatigueProfile[];
  onOpenAddShiftModal: () => void;
}

export const ShiftManagementTab: React.FC<ShiftManagementTabProps> = ({
  shifts,
  profiles,
  onOpenAddShiftModal,
}) => {
  return (
    <div className="space-y-6">
      {/* Header & Master Shifts Card */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-2xl">
        <div>
          <h3 className="text-sm font-bold text-white">Master Shift & Alokasi Penugasan (Shift Management)</h3>
          <p className="text-xs text-slate-400 mt-0.5">Konfigurasi jadwal kerja, batas jam mengemudi, & deteksi risiko rotasi cepat</p>
        </div>

        <button
          onClick={onOpenAddShiftModal}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Shift Baru
        </button>
      </div>

      {/* Shifts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {shifts.map((shift) => (
          <div key={shift.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                shift.type === 'Night' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
                shift.type === 'Morning' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                shift.type === 'Rotating' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              }`}>
                {shift.type} Shift
              </span>
              <span className="text-xs font-bold text-white">{shift.durationHours} Jam</span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white">{shift.name}</h4>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {shift.startTime} - {shift.endTime} WIB
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 space-y-1 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Max Driving:</span>
                <span className="font-semibold text-white">{shift.maxDrivingHours} jam</span>
              </div>
              <div className="flex justify-between">
                <span>Min Rest Req:</span>
                <span className="font-semibold text-emerald-400">{shift.requiredRestHours} jam</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Driver Shift Assignment Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white">Penugasan Shift Driver Aktif (Shift Assignments)</h3>
          <span className="text-xs text-slate-400">Terdaftar di Cabang Operasional</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Pengemudi (Driver)</th>
                <th className="p-3.5">Shift Berjalan</th>
                <th className="p-3.5">Durasi Shift</th>
                <th className="p-3.5">Hari Berturut</th>
                <th className="p-3.5">Rotasi Shift Risk</th>
                <th className="p-3.5">Cabang Operasional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {profiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-3.5 font-bold text-white">
                    {profile.driverName}
                  </td>
                  <td className="p-3.5 font-semibold text-cyan-400">
                    {profile.currentShiftName || 'Shift Malam'}
                  </td>
                  <td className="p-3.5 text-slate-300">
                    {profile.shiftHoursToday.toFixed(1)} jam
                  </td>
                  <td className="p-3.5 font-semibold text-amber-400">
                    {profile.consecutiveShiftDays} hari
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      profile.consecutiveShiftDays >= 6 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {profile.consecutiveShiftDays >= 6 ? 'ELEVATED ROTATION' : 'NORMAL ROTATION'}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-400">
                    {profile.branchName}
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
