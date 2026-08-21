import React, { useState } from 'react';
import {
  Users,
  Search,
  ShieldCheck,
  HeartPulse,
  Activity,
  Award,
  CheckCircle,
  Clock
} from 'lucide-react';
import { MOCK_TANKER_DRIVERS } from '../../../modules/tanker/services/tankerMockData';
import { TankerDriver } from '../../../modules/tanker/types';

export const TankerDriversTab: React.FC = () => {
  const [drivers] = useState<TankerDriver[]>(MOCK_TANKER_DRIVERS);
  const [search, setSearch] = useState('');

  const filtered = drivers.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.simNumber.toLowerCase().includes(search.toLowerCase()) ||
      d.assignedTankerHull.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div id="tanker-drivers-tab" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <Users className="w-5 h-5 text-amber-400" />
            <span>Pengemudi Tangki B3, Roster Shift & DSS Kelelahan</span>
          </h2>
          <p className="text-xs text-slate-400">
            Database sertifikasi kompetensi pengemudi B3 BNSP, tes alkohol harian (Breathalyzer 0.00‰), skor kelelahan DMS, dan rasio zero-loss.
          </p>
        </div>

        <div className="relative flex-1 sm:w-64 max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari pengemudi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Drivers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((drv) => (
          <div
            key={drv.id}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 hover:border-amber-500/30 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono font-bold border border-amber-500/20">
                  {drv.assignedTankerHull}
                </span>
                <h3 className="text-base font-bold text-slate-100 mt-1">{drv.name}</h3>
                <span className="text-xs text-slate-400 font-mono">{drv.simNumber}</span>
              </div>

              <div className="text-right">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
                  DMS {drv.dmsScore}/100
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">Status: Fit Driving</span>
              </div>
            </div>

            {/* Competency and Medical Checks */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sertifikat Pengemudi B3</span>
                </span>
                <span className="font-semibold text-slate-200">{drv.b3CertNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center space-x-1">
                  <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
                  <span>Kadar Alkohol / Tensi</span>
                </span>
                <span className="font-bold text-emerald-400 font-mono">
                  0.00‰ (Nol) | {drv.bloodPressure}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-900">
                <span className="text-slate-400 flex items-center space-x-1">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Integritas Zero-Loss Ritase</span>
                </span>
                <span className="font-bold text-amber-400 font-mono">
                  {drv.zeroLossRatePct}% ({drv.totalLoadedTrips} Ritase Sukses)
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Depot Pangkalan: <strong className="text-slate-200">{drv.depotBase}</strong></span>
              <span className="font-mono text-emerald-400 flex items-center space-x-1">
                <CheckCircle className="w-3 h-3" />
                <span>Masa Berlaku B3 s/d {drv.b3CertExpiry}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
