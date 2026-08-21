import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Layers, 
  HardHat, 
  Clock, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  TrendingUp, 
  Fuel, 
  DollarSign 
} from 'lucide-react';
import { ConstructionProject } from '../../../modules/heavy-equipment/types';

interface Props {
  projects: ConstructionProject[];
}

export const HeavyProjectsTab: React.FC<Props> = ({ projects }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-500" />
            Manajemen Job Site & Proyek Konstruksi / Tambang
          </h3>
          <p className="text-xs text-slate-500">
            Pemantauan alokasi armada per site proyek, progress galian/timbunan (BCM - Bank Cubic Meter), dan konsumsi solar akumulatif.
          </p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Tambah Job Site Baru
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div 
            key={p.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-mono font-bold text-xs">
                  {p.code}
                </span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1.5 line-clamp-2">{p.name}</h4>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                {p.status}
              </span>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <div>🏢 Klien/Owner: <strong>{p.clientName}</strong></div>
              <div>📍 Lokasi: <strong>{p.locationCity}</strong></div>
              <div>👷 Project Manager: <strong>{p.projectManager}</strong></div>
              <div>🛡️ HSE Officer: <strong>{p.hseOfficer}</strong></div>
            </div>

            {/* BCM Progress */}
            <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl text-xs">
              <div className="flex justify-between font-bold">
                <span className="text-slate-500">Progress Earthmoving:</span>
                <span className="text-amber-600 dark:text-amber-400">{p.progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all"
                  style={{ width: `${p.progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>Aktual: {(p.achievedVolumeBcm / 1000000).toFixed(2)}M m³</span>
                <span>Target: {(p.targetVolumeBcm / 1000000).toFixed(2)}M BCM</span>
              </div>
            </div>

            {/* Site Stats */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/30 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Alat Teralokasi:</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{p.allocatedEquipmentsCount} Unit</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/30 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Total Konsumsi BBM:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">{(p.totalFuelConsumedLiters / 1000).toFixed(0)}k Liter</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px] text-slate-500">
              <span>📅 {p.startDate} s/d {p.targetEndDate}</span>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                Rp {(p.budgetTotalIdr / 1000000000).toFixed(0)} Miliar
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
