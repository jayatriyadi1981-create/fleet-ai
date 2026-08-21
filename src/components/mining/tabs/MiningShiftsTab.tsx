import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  Layers,
  Fuel,
  TrendingUp,
  AlertTriangle,
  UserCheck,
  CloudRain,
  Sun,
  ShieldAlert
} from 'lucide-react';
import { miningService } from '../../../modules/mining/services/miningService';
import { MiningShiftRecord } from '../../../modules/mining/types';

export const MiningShiftsTab: React.FC = () => {
  const [shifts, setShifts] = useState<MiningShiftRecord[]>(miningService.getShifts());

  return (
    <div className="space-y-6" id="mining-shifts-container">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl font-bold text-slate-900">Manajemen Shift Operasi & P5M (Mining Shift Roster)</h1>
          </div>
          <p className="text-xs text-slate-500">
            Monitoring pergantian shift (Day/Night Shift), rekapitulasi ritase & tonase, konsumsi BBM per shift, catatan Toolbox Meeting P5M, dan penundaan cuaca (Rain/Slippery Delay).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs">
            Shift 1 Sedang Berjalan (06:00 - 18:00 WIB)
          </span>
        </div>
      </div>

      {/* Shifts Cards */}
      <div className="space-y-6">
        {shifts.map(shift => (
          <div key={shift.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-black font-mono bg-slate-900 text-white">
                    {shift.shiftCode}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                    {shift.shiftType === 'DAY_SHIFT' ? 'Shift Siang (Day Shift)' : 'Shift Malam (Night Shift)'}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-1">{shift.siteName}</h2>
                <div className="text-xs text-slate-500">
                  Tanggal: <strong>{shift.shiftDate}</strong> ({shift.startTime} - {shift.endTime}) | Pengawas: <strong>{shift.supervisorName}</strong>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-full">
                  STATUS: {shift.status}
                </span>
              </div>
            </div>

            {/* Shift Achievement Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-5">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[11px] font-semibold block">Produksi Batu Bara</span>
                <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {shift.actualTon.toLocaleString()} <span className="text-xs font-normal text-slate-500">/ {shift.targetTon.toLocaleString()} Ton</span>
                </div>
                <div className="text-xs text-emerald-600 font-bold mt-1">
                  {((shift.actualTon / shift.targetTon) * 100).toFixed(1)}% Tercapai
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[11px] font-semibold block">Volume Overburden (OB)</span>
                <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {shift.actualBcm.toLocaleString()} <span className="text-xs font-normal text-slate-500">/ {shift.targetBcm.toLocaleString()} BCM</span>
                </div>
                <div className="text-xs text-emerald-600 font-bold mt-1">
                  {((shift.actualBcm / shift.targetBcm) * 100).toFixed(1)}% Tercapai
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[11px] font-semibold block">Total Ritase Hauler</span>
                <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {shift.totalTrips} <span className="text-xs font-normal text-slate-500">Trips</span>
                </div>
                <div className="text-xs text-slate-500 font-medium mt-1">
                  {shift.activeEquipmentCount} Unit Alat Beroperasi
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[11px] font-semibold block">Konsumsi BBM Solar B35</span>
                <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {shift.totalFuelConsumedLiters.toLocaleString()} <span className="text-xs font-normal text-slate-500">Liter</span>
                </div>
                <div className="text-xs text-slate-500 font-medium mt-1">
                  Rata-rata 64.2 L/HM
                </div>
              </div>
            </div>

            {/* Toolbox Meeting P5M & Weather */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200/80 text-xs">
                <div className="flex items-center gap-2 font-bold text-amber-900 mb-1">
                  <UserCheck className="w-4 h-4 text-amber-600" />
                  Topik P5M (Pembicaraan 5 Menit K3 Sebelum Kerja):
                </div>
                <p className="text-amber-800 leading-relaxed">
                  {shift.toolboxMeetingTopic}
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200/80 text-xs">
                <div className="flex items-center gap-2 font-bold text-blue-900 mb-1">
                  <Sun className="w-4 h-4 text-blue-600" />
                  Kondisi Cuaca & Delay Tambang:
                </div>
                <div className="space-y-1 text-blue-800 mt-1">
                  <div>Cuaca: <strong>{shift.weatherCondition} (Cerah Berawan)</strong></div>
                  <div>Penundaan Hujan (Rain Delay): <strong>{shift.rainDelayHours} Jam</strong></div>
                  <div>Penundaan Jalur Licin (Slippery Delay): <strong>{shift.slipperyDelayHours} Jam</strong></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
