import React, { useState } from 'react';
import {
  Activity,
  Truck,
  TrendingUp,
  AlertTriangle,
  Fuel,
  Compass,
  Layers,
  Sparkles,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  RotateCw,
  Gauge
} from 'lucide-react';
import { miningService } from '../../../modules/mining/services/miningService';
import { MiningEquipmentStatus } from '../../../modules/mining/types';

export const MiningDashboardTab: React.FC<{
  onNavigateTab: (tabId: any) => void;
}> = ({ onNavigateTab }) => {
  const [selectedSiteFilter, setSelectedSiteFilter] = useState<string>('ALL');

  const sites = miningService.getSites();
  const pits = miningService.getPits();
  const equipments = miningService.getEquipments();
  const dispatchCycles = miningService.getDispatchCycles();
  const briefing = miningService.getDailyMiningBriefing();

  const filteredEquipments = selectedSiteFilter === 'ALL'
    ? equipments
    : equipments.filter(e => e.currentSiteId === selectedSiteFilter);

  // Status counts
  const statusCounts: Record<MiningEquipmentStatus, number> = {
    AVAILABLE: 0,
    ASSIGNED: 0,
    WORKING: 0,
    LOADING: 0,
    HAULING: 0,
    RETURNING: 0,
    DUMPING: 0,
    WAITING: 0,
    QUEUE: 0,
    IDLE: 0,
    STANDBY: 0,
    MAINTENANCE: 0,
    BREAKDOWN: 0,
    FUELING: 0,
    INSPECTION: 0,
    OFFLINE: 0
  };

  filteredEquipments.forEach(e => {
    if (statusCounts[e.status] !== undefined) {
      statusCounts[e.status]++;
    }
  });

  const activeCount = filteredEquipments.filter(e => 
    ['WORKING', 'LOADING', 'HAULING', 'DUMPING', 'ASSIGNED'].includes(e.status)
  ).length;

  const totalPayloadActiveTon = dispatchCycles
    .filter(c => c.status !== 'COMPLETED')
    .reduce((acc, c) => acc + c.payloadTon, 0);

  return (
    <div className="space-y-6" id="mining-dashboard-container">
      {/* Site Selector and Quick Stats Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl" id="mining-header-banner">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Mining Operations Control Center
            </span>
            <span className="text-xs text-slate-400">Shift 1 (06:00 - 18:00 WIB)</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Fleet Intelligence Mining Command
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            Realtime Dispatch, Tonase Produksi, Cycle Time Shovel-Truck, K3 Fatigue DSS, & AI Telematika Tambang Terintegrasi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700">
            <Compass className="w-4 h-4 text-amber-400" />
            <select
              value={selectedSiteFilter}
              onChange={(e) => setSelectedSiteFilter(e.target.value)}
              className="bg-transparent text-sm text-white font-medium focus:outline-none cursor-pointer"
              id="select-mining-site"
            >
              <option value="ALL" className="bg-slate-900 text-white">Semua Site Tambang (KPC, Vale, FI, Quarry)</option>
              {sites.map(s => (
                <option key={s.id} value={s.id} className="bg-slate-900 text-white">{s.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => onNavigateTab('ai-copilot')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md shadow-amber-500/20"
            id="btn-ai-ktt-briefing"
          >
            <Sparkles className="w-4 h-4" />
            AI Briefing KTT
          </button>
        </div>
      </div>

      {/* Top 6 KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4" id="mining-kpi-metrics-grid">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Produksi Hari Ini</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">44,800 <span className="text-xs font-medium text-slate-500">Ton</span></div>
          <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> 72.2% Target Shift (62k)
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Volume OB Stripping</span>
            <Layers className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">238k <span className="text-xs font-medium text-slate-500">BCM</span></div>
          <div className="text-xs text-slate-500 mt-1">
            SR: <span className="font-bold text-slate-800">5.3 : 1</span> (Optimal)
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Fleet Utilization</span>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">87.1% <span className="text-xs font-medium text-slate-500">UA</span></div>
          <div className="text-xs text-slate-500 mt-1">
            PA: <span className="font-bold text-slate-800">93.4%</span> | MA: <span className="font-bold text-slate-800">95.2%</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Match Factor Avg</span>
            <Gauge className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">0.98 <span className="text-xs font-medium text-emerald-600">Optimal</span></div>
          <div className="text-xs text-slate-500 mt-1">
            Antrean Shovel: <span className="font-bold text-slate-800">0.8 mnt</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Fuel Burn Rate</span>
            <Fuel className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">64.2 <span className="text-xs font-medium text-slate-500">L/HM</span></div>
          <div className="text-xs text-slate-500 mt-1">
            Cost: <span className="font-bold text-slate-800">Rp 2.902/Ton</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Safety K3 & LTI</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">0 <span className="text-xs font-medium text-emerald-600">Zero Harm</span></div>
          <div className="text-xs text-slate-500 mt-1">
            Fatigue Score: <span className="font-bold text-emerald-600">24.5 (Bugar)</span>
          </div>
        </div>
      </div>

      {/* Equipment Status Breakdown Ribbon */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm" id="mining-status-ribbon">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-500" />
            Distribusi Status Armada Tambang ({filteredEquipments.length} Total Unit)
          </h2>
          <button
            onClick={() => onNavigateTab('equipment')}
            className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            Lihat Daftar Lengkap Alat Berat &rarr;
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          <div className="bg-emerald-50 border border-emerald-200/60 p-3 rounded-xl">
            <div className="text-xs text-emerald-700 font-medium">Loading & Hauling</div>
            <div className="text-xl font-black text-emerald-900 mt-1">{statusCounts.LOADING + statusCounts.HAULING}</div>
            <div className="text-[11px] text-emerald-600">Operasi Aktif</div>
          </div>

          <div className="bg-blue-50 border border-blue-200/60 p-3 rounded-xl">
            <div className="text-xs text-blue-700 font-medium">Working Support</div>
            <div className="text-xl font-black text-blue-900 mt-1">{statusCounts.WORKING}</div>
            <div className="text-[11px] text-blue-600">Dozer / Grader / WT</div>
          </div>

          <div className="bg-amber-50 border border-amber-200/60 p-3 rounded-xl">
            <div className="text-xs text-amber-700 font-medium">Queue & Waiting</div>
            <div className="text-xl font-black text-amber-900 mt-1">{statusCounts.QUEUE + statusCounts.WAITING}</div>
            <div className="text-[11px] text-amber-600">Antre Loading/Dumping</div>
          </div>

          <div className="bg-indigo-50 border border-indigo-200/60 p-3 rounded-xl">
            <div className="text-xs text-indigo-700 font-medium">Available & Standby</div>
            <div className="text-xl font-black text-indigo-900 mt-1">{statusCounts.AVAILABLE + statusCounts.STANDBY}</div>
            <div className="text-[11px] text-indigo-600">Siap Operasi</div>
          </div>

          <div className="bg-purple-50 border border-purple-200/60 p-3 rounded-xl">
            <div className="text-xs text-purple-700 font-medium">Fueling Pitstop</div>
            <div className="text-xl font-black text-purple-900 mt-1">{statusCounts.FUELING + statusCounts.INSPECTION}</div>
            <div className="text-[11px] text-purple-600">Bowser / P2H Check</div>
          </div>

          <div className="bg-rose-50 border border-rose-200/60 p-3 rounded-xl">
            <div className="text-xs text-rose-700 font-medium">Maintenance / PS</div>
            <div className="text-xl font-black text-rose-900 mt-1">{statusCounts.MAINTENANCE}</div>
            <div className="text-[11px] text-rose-600">Workshop Yard</div>
          </div>

          <div className="bg-slate-100 border border-slate-300 p-3 rounded-xl">
            <div className="text-xs text-slate-600 font-medium">Breakdown</div>
            <div className="text-xl font-black text-slate-900 mt-1">{statusCounts.BREAKDOWN}</div>
            <div className="text-[11px] text-slate-500">Perbaikan Kritis</div>
          </div>
        </div>
      </div>

      {/* Main 2 Column Grid: Live Hauling Cycles & Active Mining Pits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Dispatch Cycles Progress (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <RotateCw className="w-5 h-5 text-blue-600 animate-spin-slow" />
                  Live Dispatch Hauling Cycles Monitor
                </h2>
                <p className="text-xs text-slate-500">Monitoring real-time alur siklus muat-angkut-buang</p>
              </div>
              <button
                onClick={() => onNavigateTab('dispatch')}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-all"
              >
                Buka Dispatch Board &rarr;
              </button>
            </div>

            <div className="space-y-3">
              {dispatchCycles.map(cycle => (
                <div key={cycle.id} className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{cycle.dumpTruckCode}</span>
                      <span className="text-xs text-slate-500 font-mono">({cycle.cycleNumber})</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">
                        {cycle.materialName}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-medium text-slate-600">Muatan: <strong className="text-slate-900">{cycle.payloadTon} Ton</strong></span>
                      <span className={`px-2.5 py-0.5 rounded-full font-extrabold uppercase text-[10px] ${
                        cycle.status === 'LOADING' ? 'bg-amber-500 text-white' :
                        cycle.status === 'HAULING' ? 'bg-blue-600 text-white' :
                        cycle.status === 'DUMPING' ? 'bg-emerald-600 text-white' :
                        'bg-slate-700 text-white'
                      }`}>
                        {cycle.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Flow Stages Visualizer */}
                  <div className="grid grid-cols-5 gap-1 text-center text-[10px] font-bold pt-1">
                    <div className={`p-1 rounded ${
                      ['QUEUE_LOADING', 'LOADING', 'HAULING', 'DUMPING', 'RETURNING'].includes(cycle.status)
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      1. Shovel Loading
                    </div>
                    <div className={`p-1 rounded ${
                      ['HAULING', 'DUMPING', 'RETURNING'].includes(cycle.status)
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      2. Hauling ({cycle.haulingDistanceKm} KM)
                    </div>
                    <div className={`p-1 rounded ${
                      ['QUEUE_DUMPING', 'DUMPING', 'RETURNING'].includes(cycle.status)
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      3. Dumping
                    </div>
                    <div className={`p-1 rounded ${
                      ['RETURNING', 'COMPLETED'].includes(cycle.status)
                        ? 'bg-purple-100 text-purple-800 border border-purple-300'
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      4. Return Empty
                    </div>
                    <div className={`p-1 rounded ${
                      cycle.status === 'COMPLETED'
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      5. Complete ({cycle.totalCycleTimeMin} mnt)
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                    <span>Shovel Asal: <strong className="text-slate-700">{cycle.excavatorCode}</strong></span>
                    <span>Tujuan: <strong className="text-slate-700">{cycle.dumpingPoint}</strong></span>
                    <span>Operator: <strong className="text-slate-700">{cycle.operatorName}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>Total Muatan Aktif Bergerak di Jalur: <strong className="text-slate-900">{totalPayloadActiveTon.toFixed(1)} Ton</strong></span>
            <span>Rata-rata Kecepatan Haul Road: <strong className="text-slate-900">34.2 km/jam</strong></span>
          </div>
        </div>

        {/* Mining Pit Status & Highwall Risk (1 Col) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-500" />
                Daftar Pit & Elevasi (RL)
              </h2>
              <button
                onClick={() => onNavigateTab('pits')}
                className="text-xs font-semibold text-amber-600 hover:text-amber-700"
              >
                Kelola Pit &rarr;
              </button>
            </div>

            <div className="space-y-3">
              {pits.map(pit => (
                <div key={pit.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900">{pit.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      pit.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' :
                      pit.status === 'RESTRICTED' ? 'bg-rose-100 text-rose-800' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {pit.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 space-y-0.5 mt-1">
                    <div>Elevasi: <strong className="text-slate-800">RL {pit.elevationRlMeters > 0 ? `+${pit.elevationRlMeters}` : pit.elevationRlMeters}m</strong> ({pit.currentBench})</div>
                    <div>Target Harian: <strong className="text-slate-800">{pit.primaryTargetBcmDaily.toLocaleString()} BCM</strong> ({pit.materialType})</div>
                    <div>Excavator Bertugas: <strong className="text-slate-800">{pit.assignedExcavatorCodes.join(', ')}</strong></div>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200 text-[10px]">
                    <span className="text-slate-500">Risiko Highwall:</span>
                    <span className={`font-bold ${
                      pit.highwallRiskLevel === 'LOW' ? 'text-emerald-600' :
                      pit.highwallRiskLevel === 'MEDIUM' ? 'text-amber-600' : 'text-rose-600'
                    }`}>
                      {pit.highwallRiskLevel} RISK
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Weather & Blasting Alert */}
          <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Info Peledakan (Blasting) Hari Ini:</span>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Pit Bendili West jadwal blasting pukul 12:00 WIB. Clear zone radius 500m berlaku mulai 11:30 WIB.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">
          Akses Cepat Modul Operasional Tambang
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
          {[
            { id: 'dispatch', label: 'Dispatch Board', icon: RotateCw },
            { id: 'hauling', label: 'Weighbridge & Haul', icon: Truck },
            { id: 'sites', label: 'Site Tambang', icon: Compass },
            { id: 'pits', label: 'Pit & Bench', icon: Layers },
            { id: 'equipment', label: 'Alat Berat', icon: Activity },
            { id: 'operators', label: 'Operator & KIMPER', icon: ShieldCheck },
            { id: 'fuel', label: 'Fuel Bowser', icon: Fuel },
            { id: 'reports', label: 'Laporan LHT/LBT', icon: TrendingUp }
          ].map(btn => {
            const Icon = btn.icon;
            return (
              <button
                key={btn.id}
                onClick={() => onNavigateTab(btn.id)}
                className="flex flex-col items-center justify-center p-3 bg-slate-800 hover:bg-slate-700/80 rounded-xl border border-slate-700 transition-all text-center group"
                id={`btn-nav-quick-${btn.id}`}
              >
                <Icon className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-xs font-semibold text-slate-200">{btn.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
