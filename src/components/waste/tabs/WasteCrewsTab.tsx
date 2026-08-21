import React, { useState } from 'react';
import {
  Users,
  Award,
  CheckCircle,
  Clock,
  HeartPulse,
  Search,
  Plus,
  ShieldCheck,
  TrendingUp,
  Scale
} from 'lucide-react';
import { MOCK_WASTE_CREWS } from '../../../modules/waste/services/wasteMockData';
import { WasteCrewMember } from '../../../modules/waste/types';

export const WasteCrewsTab: React.FC = () => {
  const [crews] = useState<WasteCrewMember[]>(MOCK_WASTE_CREWS);
  const [search, setSearch] = useState('');

  const filtered = crews.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.nik.toLowerCase().includes(search.toLowerCase()) ||
      c.assignedHull.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div id="waste-crews-tab" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <span>Kinerja Petugas / Kru Pengangkut & Insentif Ritase (Crew Operations)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Database supir truk, operator hidrolik compactor, kru loader, pencatatan absensi shift subuh/malam, dan perhitungan insentif tonase terangkut.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama, NIK, truk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            onClick={() => alert('Data Kru Baru Berhasil Ditambahkan!')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Kru</span>
          </button>
        </div>
      </div>

      {/* Crews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((crew) => (
          <div
            key={crew.id}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 hover:border-emerald-500/30 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold border border-emerald-500/20">
                    {crew.role.replace(/_/g, ' ')}
                  </span>
                  <h3 className="text-base font-bold text-slate-100 mt-1">{crew.name}</h3>
                  <span className="text-xs text-slate-400 font-mono">{crew.nik}</span>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {crew.attendanceStatus.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Tonase and Trips */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Tonase Hari Ini</span>
                  <span className="font-bold text-emerald-400 font-mono">{crew.dailyPayloadTonsCollected} Ton</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Ritase Selesai</span>
                  <span className="font-bold text-sky-400 font-mono">{crew.dailyTripsCompleted} Rit</span>
                </div>
              </div>

              {/* Health & Depot */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Armada Ditugaskan:</span>
                  <span className="font-bold text-slate-200 font-mono">{crew.assignedHull}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Shift Kerja:</span>
                  <span className="font-semibold text-slate-200">{crew.shift.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Kesehatan Fisik:</span>
                  <span className="text-emerald-400 font-bold font-mono">SEHAT &amp; FIT</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Kepatuhan APD:</span>
                  <span className="text-emerald-400 font-bold font-mono">{crew.safetyPpeCompliancePct}%</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="text-[10px]">{crew.depotBase}</span>
              <span className="text-emerald-400 font-bold font-mono text-[11px]">+Insentif Rit</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
