import React from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Fuel, 
  Gauge, 
  HardHat, 
  Layers, 
  MapPin, 
  Radio, 
  ShieldCheck, 
  TrendingUp, 
  Truck, 
  Wrench,
  Sparkles
} from 'lucide-react';
import { HeavyEquipmentAsset, ConstructionProject, DailyTimesheet } from '../../../modules/heavy-equipment/types';

interface Props {
  equipments: HeavyEquipmentAsset[];
  projects: ConstructionProject[];
  timesheets: DailyTimesheet[];
  onNavigateTab: (tab: any) => void;
}

export const HeavyControlTowerTab: React.FC<Props> = ({
  equipments,
  projects,
  timesheets,
  onNavigateTab
}) => {
  const totalUnits = equipments.length;
  const operatingUnits = equipments.filter(e => e.status === 'OPERATING').length;
  const standbyUnits = equipments.filter(e => e.status === 'STANDBY').length;
  const breakdownUnits = equipments.filter(e => e.status === 'BREAKDOWN' || e.status === 'MAINTENANCE').length;
  
  const avgPA = (equipments.reduce((acc, curr) => acc + curr.physicalAvailabilityPct, 0) / (totalUnits || 1)).toFixed(1);
  const avgUA = (equipments.reduce((acc, curr) => acc + curr.utilizationAvailabilityPct, 0) / (totalUnits || 1)).toFixed(1);
  const totalFleetHM = equipments.reduce((acc, curr) => acc + curr.hourMeter, 0).toLocaleString('id-ID', { maximumFractionDigits: 1 });

  return (
    <div className="space-y-6">
      {/* Top Banner: Status Menara Kendali Alat Berat & Job Sites */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <HardHat className="w-3.5 h-3.5" />
              Heavy Equipment Fleet & Mining Job Site Control Tower
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Menara Kendali Operasional Alat Berat & Konstruksi
            </h2>
            <p className="text-xs md:text-sm text-slate-300">
              Monitoring real-time utilisasi Hour Meter (HM), telematika mesin, konsumsi solar fuel bowser, dan kepatuhan P2H K3 tambang/proyek.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigateTab('p2h-inspection')}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              Checklist P2H Harian
            </button>
            <button
              onClick={() => onNavigateTab('timesheets-hm')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <Clock className="w-4 h-4" />
              Input Timesheet HM
            </button>
            <button
              onClick={() => onNavigateTab('ai-copilot')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              AI Heavy Copilot
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Armada</span>
            <Truck className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{totalUnits} Unit</div>
          <div className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> {operatingUnits} Sedang Beroperasi
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Physical Avail (PA)</span>
            <Gauge className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{avgPA}%</div>
          <div className="text-[11px] text-slate-500">Target Tambang: ≥ 90%</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Util. Avail (UA)</span>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{avgUA}%</div>
          <div className="text-[11px] text-slate-500">Efisiensi Ritase & HM</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Akumulasi HM</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{totalFleetHM}</div>
          <div className="text-[11px] text-slate-500">Jam Kerja Total Mesin</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Proyek Aktif</span>
            <Layers className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400">{projects.length} Site</div>
          <div className="text-[11px] text-slate-500">IKN, Morowali, Jatim</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Breakdown / WO</span>
            <Wrench className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">{breakdownUnits} Unit</div>
          <div className="text-[11px] text-rose-500 font-medium">Dalam Perbaikan Mekanik</div>
        </div>
      </div>

      {/* Main Grid: Active Job Sites & Live Equipment Telematics Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active Job Sites Summary */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-500" />
              Job Site & Proyek Konstruksi
            </h3>
            <button
              onClick={() => onNavigateTab('projects-sites')}
              className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline"
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-3">
            {projects.map((p) => (
              <div 
                key={p.id}
                className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{p.code}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                    {p.progressPercent}% Selesai
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs line-clamp-1">{p.name}</h4>
                <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                  📍 {p.locationCity} • {p.allocatedEquipmentsCount} Unit Alat
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full rounded-full transition-all"
                    style={{ width: `${p.progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-700/50">
                  <span>PM: {p.projectManager.split(',')[0]}</span>
                  <span>Target BCM: {(p.targetVolumeBcm / 1000000).toFixed(1)}M m³</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Equipment Health & Telematics Telemetry */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
              Status Real-Time Alat Berat & Telemetri Sensor
            </h3>
            <button
              onClick={() => onNavigateTab('equipment-assets')}
              className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline"
            >
              Detail Master Alat ({equipments.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                  <th className="pb-3 px-2">Unit Alat & Model</th>
                  <th className="pb-3 px-2">Job Site / Lokasi</th>
                  <th className="pb-3 px-2">Status & RPM</th>
                  <th className="pb-3 px-2">Hour Meter</th>
                  <th className="pb-3 px-2">BBM & Suhu</th>
                  <th className="pb-3 px-2">PA (%)</th>
                  <th className="pb-3 px-2 text-right">P2H Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {equipments.map((eq) => (
                  <tr key={eq.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-2">
                      <div className="font-bold text-slate-900 dark:text-white font-mono">{eq.code}</div>
                      <div className="text-[11px] text-slate-500">{eq.name}</div>
                    </td>
                    <td className="py-3 px-2 text-slate-600 dark:text-slate-300 text-[11px]">
                      {eq.currentSiteName.split('(')[0]}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          eq.status === 'OPERATING' ? 'bg-emerald-500 animate-pulse' :
                          eq.status === 'STANDBY' ? 'bg-amber-500' :
                          'bg-rose-500'
                        }`} />
                        <span className="font-bold text-[11px] text-slate-800 dark:text-slate-200">
                          {eq.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {eq.engineStatus === 'RUNNING' ? `${eq.engineRpm} RPM` : 'Engine OFF'}
                      </div>
                    </td>
                    <td className="py-3 px-2 font-mono font-bold text-slate-900 dark:text-white">
                      {eq.hourMeter.toFixed(1)} HM
                    </td>
                    <td className="py-3 px-2">
                      <div className="text-[11px] font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Fuel className="w-3 h-3 text-amber-500" /> {eq.fuelLevelPct}% ({eq.fuelBurnRateLitersPerHM} L/HM)
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Suhu: {eq.coolantTempC}°C | Oli: {eq.oilPressureBar} Bar
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {eq.physicalAvailabilityPct}%
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        eq.lastP2hResult === 'FIT_TO_WORK'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                          : eq.lastP2hResult === 'FIT_WITH_NOTE'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                          : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                      }`}>
                        {eq.lastP2hResult === 'FIT_TO_WORK' ? 'FIT KERJA' :
                         eq.lastP2hResult === 'FIT_WITH_NOTE' ? 'FIT CATATAN' : 'STOP ALAT'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
