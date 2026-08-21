import React, { useState } from 'react';
import { 
  Wrench, 
  Plus, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  DollarSign, 
  Layers 
} from 'lucide-react';
import { HeavyMaintenanceSchedule, HeavyEquipmentAsset } from '../../../modules/heavy-equipment/types';

interface Props {
  schedules: HeavyMaintenanceSchedule[];
  equipments: HeavyEquipmentAsset[];
}

export const HeavyMaintenancePsTab: React.FC<Props> = ({ schedules, equipments }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-500" />
            Pemeliharaan Berkala (Periodic Service PS 250-2000 HM) & Perbaikan Alat
          </h3>
          <p className="text-xs text-slate-500">
            Jadwal ganti oli mesin, oli hidrolik, filter solar, undercarriage overhaul, dan backlog mekanik site tambang.
          </p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Buat Work Order (WO) Servis
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {schedules.map((sc) => (
          <div 
            key={sc.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm">
                  {sc.workOrderNumber}
                </span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                  Unit {sc.equipmentCode} • {sc.serviceType.replace(/_/g, ' ')}
                </h4>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                sc.status === 'COMPLETED' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400' :
                sc.status === 'IN_PROGRESS' ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 animate-pulse' :
                'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400'
              }`}>
                {sc.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
              <div>
                <span className="text-slate-400 block text-[10px]">Target HM Servis:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {sc.targetServiceHM} HM
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Tersisa Menuju Servis:</span>
                <span className={`font-mono font-bold ${sc.remainingHM <= 80 ? 'text-amber-500' : 'text-slate-900 dark:text-white'}`}>
                  {sc.remainingHM.toFixed(1)} Jam
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Estimasi Down Time:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {sc.downTimeHours} Jam
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Estimasi Biaya:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  Rp {sc.estimatedCostIdr.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1.5">Suku Cadang & Pelumas:</span>
              <div className="flex flex-wrap gap-1">
                {sc.partsList.map((p, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px]">
                    📦 {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span>Mekanik: <strong>{sc.assignedMechanic.split('(')[0]}</strong></span>
              <span>📅 {sc.scheduledDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
