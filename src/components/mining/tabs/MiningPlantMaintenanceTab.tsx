import React, { useState } from 'react';
import {
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Truck,
  Layers,
  Activity,
  Calendar,
  Sparkles
} from 'lucide-react';
import { miningService } from '../../../modules/mining/services/miningService';
import { MiningOtrTyreLog } from '../../../modules/mining/types';

export const MiningPlantMaintenanceTab: React.FC = () => {
  const equipments = miningService.getEquipments();
  const [tyres, setTyres] = useState<MiningOtrTyreLog[]>(miningService.getOtrTyres());

  return (
    <div className="space-y-6" id="mining-plant-maintenance-container">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Wrench className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl font-bold text-slate-900">Plant Maintenance & OTR Tyre Management (Ban Raksasa)</h1>
          </div>
          <p className="text-xs text-slate-500">
            Jadwal Servis Berkala (PS 250 - PS 2000 HM), pemantauan keausan ban OTR Giant (Tread Depth & TKPH), & ketersediaan suku cadang workshop.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-mono font-bold text-xs">
            Mechanical Availability (MA): 95.2%
          </span>
        </div>
      </div>

      {/* Periodic Service Tracker Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Jadwal Servis Berkala Armada (Periodic Service PS 250 - 2000 HM)</h2>
          <span className="text-xs text-slate-500">Interval standar Komatsu & CAT</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Kode Unit (CN)</th>
                <th className="py-3.5 px-4">Model Alat Berat</th>
                <th className="py-3.5 px-4 font-mono">HM Saat Ini</th>
                <th className="py-3.5 px-4 font-mono">Servis Terakhir</th>
                <th className="py-3.5 px-4 font-mono">Servis Berikutnya (Due)</th>
                <th className="py-3.5 px-4 font-mono text-right">Sisa Jam (Remaining)</th>
                <th className="py-3.5 px-4 text-center">Status Pemeliharaan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {equipments.map(eq => {
                const remainingHM = eq.nextServiceDueHM - eq.hourMeter;
                const isUrgent = remainingHM < 100;
                return (
                  <tr key={eq.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{eq.code}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{eq.name}</td>
                    <td className="py-3 px-4 font-mono text-slate-800">{eq.hourMeter.toLocaleString()} HM</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{eq.lastServiceHM.toLocaleString()} HM</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{eq.nextServiceDueHM.toLocaleString()} HM</td>
                    <td className="py-3 px-4 font-mono font-bold text-right">
                      <span className={isUrgent ? 'text-amber-600' : 'text-slate-700'}>
                        {remainingHM.toFixed(1)} Jam
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        isUrgent ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isUrgent ? 'Mendekati PS' : 'Operasional Normal'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* OTR Tyre Management Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-500" />
              Manajemen Ban Raksasa OTR Giant Tyres (27.00R49 / 33.00R51)
            </h2>
            <p className="text-xs text-slate-500">Monitoring sisa kedalaman tapak (tread depth), tekanan angin PSI, & beban termal TKPH (Ton-KM/Jam)</p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
            TKPH Rating Optimal
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tyres.map(tyre => (
            <div key={tyre.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 text-amber-400 mr-2">
                      {tyre.equipmentCode}
                    </span>
                    <strong className="text-sm text-slate-900 font-mono">{tyre.tyreSerialNumber}</strong>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                    {tyre.conditionStatus}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1.5 mt-2">
                  <div className="flex justify-between">
                    <span>Merek & Ukuran:</span>
                    <strong className="text-slate-900">{tyre.brand} {tyre.size}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Posisi Roda:</span>
                    <strong className="text-slate-800 font-mono">{tyre.position.replace(/_/g, ' ')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Sisa Kedalaman Tapak:</span>
                    <strong className="text-slate-900 font-mono">{tyre.currentTreadDepthMm} mm / {tyre.initialTreadDepthMm} mm ({tyre.treadWearPct}% Aus)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Tekanan Angin:</span>
                    <strong className="text-slate-900 font-mono">{tyre.currentPressurePsi} PSI (Rekomendasi: {tyre.recommendedPressurePsi} PSI)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>TKPH Rating / Cost per HM:</span>
                    <strong className="text-slate-800 font-mono">{tyre.tkphRating} TKPH | Rp {tyre.estimatedCostPerOperatingHourIdr.toLocaleString()}/HM</strong>
                  </div>
                </div>
              </div>

              {/* Progress bar of tread wear */}
              <div className="mt-3 pt-3 border-t border-slate-200">
                <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                  <span>Keausan Ban OTR</span>
                  <span>Sisa Umur: {100 - tyre.treadWearPct}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{ width: `${100 - tyre.treadWearPct}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
