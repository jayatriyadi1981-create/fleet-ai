import React, { useState } from 'react';
import {
  TrendingUp,
  RotateCw,
  Scale,
  Fuel,
  ShieldCheck,
  Zap,
  Activity,
  AlertTriangle,
  ArrowRight,
  Truck,
  Layers,
  MapPin,
  Clock,
  Gauge,
  Radio,
  CheckCircle2,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { dtmsService } from '../../../modules/dtms/services/dtmsService';
import { DumpTruckUnit, DumpTruckStatus } from '../../../modules/dtms/types';

interface Props {
  onNavigateTab: (tabId: string) => void;
}

export const DtmsControlTowerTab: React.FC<Props> = ({ onNavigateTab }) => {
  const kpis = dtmsService.getKpis();
  const [trucks] = useState<DumpTruckUnit[]>(dtmsService.getTrucks());
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const getStatusBadge = (status: DumpTruckStatus) => {
    switch (status) {
      case 'LOADING':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20"><RotateCw className="w-3 h-3 mr-1 animate-spin" /> Loading</span>;
      case 'HAULING_LOADED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"><Truck className="w-3 h-3 mr-1" /> Hauling Muatan</span>;
      case 'QUEUEING_DUMP':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20"><Clock className="w-3 h-3 mr-1" /> Antre Disposal</span>;
      case 'DUMPING':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-500 border border-purple-500/20"><ArrowRight className="w-3 h-3 mr-1 transform rotate-45" /> Tipping/Dumping</span>;
      case 'RETURNING_EMPTY kos' as any:
      case 'RETURNING_EMPTY':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-500 border border-cyan-500/20"><RotateCw className="w-3 h-3 mr-1" /> Return Kosong</span>;
      case 'QUEUEING_LOAD':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-500 border border-orange-500/20"><Clock className="w-3 h-3 mr-1" /> Antre Shovel</span>;
      case 'BREAKDOWN_MAINTENANCE':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20"><AlertTriangle className="w-3 h-3 mr-1" /> Breakdown</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">Standby Idle</span>;
    }
  };

  const filteredTrucks = selectedCategory === 'ALL'
    ? trucks
    : trucks.filter(t => t.category === selectedCategory);

  return (
    <div id="dtms-control-tower-tab" className="space-y-6">
      {/* Top Banner Alert / Live Dispatch Announcement */}
      <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-blue-500/10 border border-amber-500/30 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-500 bg-amber-500/20 px-2 py-0.5 rounded">Live Telemetri DTMS</span>
              <span className="text-xs text-slate-400">Shift Siang 07:00 - 19:00 WIB</span>
            </div>
            <p className="text-sm text-slate-200 font-medium mt-0.5">
              102 Unit Dump Truck Aktif di Haul Road. Total Produksi Real-Time: <span className="text-emerald-400 font-bold">{kpis.totalTonnageToday.toLocaleString()} Ton</span> ({kpis.totalBcmToday.toLocaleString()} BCM).
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigateTab('dtms_dispatch')}
            className="px-3.5 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center space-x-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Smart Dispatching</span>
          </button>
          <button
            onClick={() => onNavigateTab('dtms_ai')}
            className="px-3.5 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Operations Copilot</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Ritase Hari Ini</span>
            <RotateCw className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-100">{kpis.totalRitsToday}</span>
            <span className="text-xs text-slate-400">/ target {kpis.targetDailyRits} Rits</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-cyan-500 h-full rounded-full"
              style={{ width: `${Math.min(100, Math.round((kpis.totalRitsToday / kpis.targetDailyRits) * 100))}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 mt-1.5">
            <span>Progress {Math.round((kpis.totalRitsToday / kpis.targetDailyRits) * 100)}%</span>
            <span className="text-emerald-400 font-medium">On Track</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Tonnage (Ton)</span>
            <Scale className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-100">{kpis.totalTonnageToday.toLocaleString()}</span>
            <span className="text-xs text-emerald-400 font-medium">Tonase</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-400 mt-2">
            <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">OB: 2.379 Ton</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-amber-300">Coal: 1.616 Ton</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Setara {kpis.totalBcmToday.toLocaleString()} BCM Volume</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Rata-Rata Cycle Time</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-100">{kpis.avgCycleTimeMins}</span>
            <span className="text-xs text-slate-400">Menit / Rit</span>
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-emerald-400 mt-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>1.1 min lebih cepat dari target</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Spotting: 1.5m | Haul: 8.5m | Dump: 1.2m</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Kesiapan Armada (PA/UA)</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-100">{kpis.fleetAvailabilityPaPct}%</span>
            <span className="text-xs text-purple-400 font-medium">PA</span>
            <span className="text-xs text-slate-400 font-normal">| UA: {kpis.fleetUtilizationUaPct}%</span>
          </div>
          <div className="flex items-center space-x-3 text-xs text-slate-300 mt-2">
            <span className="text-emerald-400">{kpis.totalActiveTrucks} Operasi</span>
            <span className="text-amber-400">{kpis.totalStandbyTrucks} Standby</span>
            <span className="text-rose-400">{kpis.totalBreakdownTrucks} BD</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Solar: {kpis.fuelConsumptionLiterPerTon} Ltr/Ton</div>
        </div>
      </div>

      {/* Realtime Truck Status Grid / Matrix */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-100 flex items-center space-x-2">
              <Truck className="w-5 h-5 text-amber-500" />
              <span>Monitoring Real-Time Armada Dump Truck</span>
            </h3>
            <p className="text-xs text-slate-400">Status siklus hauling, payload, posisi GPS, dan penugasan excavator</p>
          </div>

          <div className="flex items-center space-x-2 flex-wrap">
            <span className="text-xs text-slate-400">Kategori:</span>
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                selectedCategory === 'ALL'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Semua ({trucks.length})
            </button>
            <button
              onClick={() => setSelectedCategory('OFF_HIGHWAY_RIGID')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                selectedCategory === 'OFF_HIGHWAY_RIGID'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              OHT Rigid (HD785/777)
            </button>
            <button
              onClick={() => setSelectedCategory('HEAVY_DUMP_TRUCK_8X4')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                selectedCategory === 'HEAVY_DUMP_TRUCK_8X4'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              HDT 8x4 (Scania/Volvo)
            </button>
            <button
              onClick={() => setSelectedCategory('ARTICULATED_DUMP_TRUCK')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                selectedCategory === 'ARTICULATED_DUMP_TRUCK'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              ADT 6x6 (A40G)
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
                <th className="py-3 px-3">No. Lambung & Tipe</th>
                <th className="py-3 px-3">Status Siklus</th>
                <th className="py-3 px-3">Material & Lokasi</th>
                <th className="py-3 px-3">Excavator / Loading</th>
                <th className="py-3 px-3">Payload (Ton)</th>
                <th className="py-3 px-3">Rits / Target</th>
                <th className="py-3 px-3">Driver & KIMPER</th>
                <th className="py-3 px-3">Telemetri (BBM/Kecepatan)</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filteredTrucks.map((truck) => (
                <tr key={truck.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-bold text-xs">
                        {truck.hullNumber}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-100">{truck.model}</div>
                        <div className="text-[11px] text-slate-400">{truck.plateNumber} | Vessel: {truck.vesselCapacityM3}m³</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    {getStatusBadge(truck.status)}
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>{truck.location.zoneName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-medium text-slate-200">{truck.currentMaterial.replace('_', ' ')}</span>
                    <div className="text-[11px] text-slate-400 mt-0.5">Dumping: {truck.assignedDumpingPoint}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-amber-300">{truck.assignedExcavator}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{truck.assignedLoadingPoint}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-baseline space-x-1">
                      <span className={`font-bold ${truck.currentPayloadTons > truck.ratedPayloadTons ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {truck.currentPayloadTons}
                      </span>
                      <span className="text-slate-400 text-[11px]">/ {truck.ratedPayloadTons} Ton</span>
                    </div>
                    {truck.currentPayloadTons > truck.ratedPayloadTons && (
                      <span className="text-[10px] text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 font-semibold">
                        Overload +{(truck.currentPayloadTons - truck.ratedPayloadTons).toFixed(1)}T
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-100">{truck.todayRits} / {truck.targetDailyRits}</div>
                    <div className="text-[11px] text-emerald-400 mt-0.5">{truck.todayTonnage} Ton</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-slate-200">{truck.currentDriverName}</div>
                    <div className="text-[11px] text-slate-400">{truck.driverKimperNo}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-2">
                      <div className="text-slate-300 text-xs flex items-center space-x-1">
                        <Fuel className="w-3.5 h-3.5 text-amber-400" />
                        <span>{truck.fuelLevelPct}%</span>
                      </div>
                      <div className="text-slate-300 text-xs flex items-center space-x-1">
                        <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{truck.speedKmh} km/h</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Tire: {truck.tirePressureAvgPsi} PSI</div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onNavigateTab('dtms_cycles')}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded border border-slate-700 transition-colors inline-flex items-center space-x-1"
                    >
                      <span>Detail</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between hover:border-slate-700 transition-colors cursor-pointer" onClick={() => onNavigateTab('dtms_dispatch')}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-slate-100 text-sm">Match Factor & Dispatch</div>
              <div className="text-xs text-slate-400">Optimasi antrean Shovel vs Truck</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between hover:border-slate-700 transition-colors cursor-pointer" onClick={() => onNavigateTab('dtms_payload')}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-slate-100 text-sm">Jembatan Timbang (Weighbridge)</div>
              <div className="text-xs text-slate-400">Tiket timbang & pencegahan overload</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between hover:border-slate-700 transition-colors cursor-pointer" onClick={() => onNavigateTab('dtms_haul_roads')}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-slate-100 text-sm">Haul Road & Segment Speed</div>
              <div className="text-xs text-slate-400">Grade kemiringan, debu & water truck</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>
      </div>
    </div>
  );
};
