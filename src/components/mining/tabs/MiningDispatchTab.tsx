import React, { useState } from 'react';
import {
  RotateCw,
  Plus,
  Truck,
  Activity,
  ArrowRight,
  CheckCircle2,
  Gauge,
  Layers,
  Sparkles,
  MapPin,
  Play,
  Shuffle,
  Clock
} from 'lucide-react';
import { miningService } from '../../../modules/mining/services/miningService';
import { MiningDispatchCycle, MiningDispatchCycleStatus } from '../../../modules/mining/types';

export const MiningDispatchTab: React.FC = () => {
  const [cycles, setCycles] = useState<MiningDispatchCycle[]>(miningService.getDispatchCycles());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCycleForReassign, setSelectedCycleForReassign] = useState<MiningDispatchCycle | null>(null);

  const equipments = miningService.getEquipments();
  const excavators = equipments.filter(e => e.category === 'HYDRAULIC_EXCAVATOR' || e.category === 'EXCAVATOR');
  const trucks = equipments.filter(e => e.category === 'HAUL_TRUCK' || e.category === 'DUMP_TRUCK');
  const pits = miningService.getPits();
  const materials = miningService.getMaterials();

  const [newCycleData, setNewCycleData] = useState<Partial<MiningDispatchCycle>>({
    excavatorId: excavators[0]?.id || '',
    dumpTruckId: trucks[0]?.id || '',
    loadingPoint: 'Front Loading Alpha 1',
    dumpingPoint: 'ROM Stockpile Sangatta Port A',
    materialName: materials[0]?.name || 'Thermal Coal Seam Pinang',
    payloadTon: 88.5,
    haulingDistanceKm: 8.5
  });

  const handleAdvanceStatus = (cycleId: string) => {
    const updated = miningService.advanceDispatchCycle(cycleId);
    if (updated) {
      setCycles(miningService.getDispatchCycles());
    }
  };

  const handleCreateCycle = (e: React.FormEvent) => {
    e.preventDefault();
    const exc = excavators.find(x => x.id === newCycleData.excavatorId);
    const trk = trucks.find(t => t.id === newCycleData.dumpTruckId);

    miningService.createDispatchCycle({
      ...newCycleData,
      excavatorCode: exc?.code || 'EX-1201',
      dumpTruckCode: trk?.code || 'DT-785',
      operatorName: trk?.currentOperatorName || 'Operator Dispatch'
    });

    setCycles(miningService.getDispatchCycles());
    setShowCreateModal(false);
  };

  // Match Factor: (N_trucks * Loading_time) / (N_excavators * Total_cycle_time)
  const totalExcavatorCount = excavators.length || 1;
  const totalTruckCount = trucks.length || 1;
  const avgLoadingTime = 3.2;
  const avgCycleTime = 28.5;
  const calculatedMatchFactor = ((totalTruckCount * avgLoadingTime) / (totalExcavatorCount * avgCycleTime)).toFixed(2);

  return (
    <div className="space-y-6" id="mining-dispatch-container">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5" /> Fleet Dispatch & Cycle Automation Board
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Papan Kontrol Dispatch Hauling Terpadu
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Pantau pergerakan antrean Shovel & Dump Truck: Loading &rarr; Hauling &rarr; Dumping &rarr; Return &rarr; Queue. Reassign armada real-time & optimasi Match Factor.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-700 text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Rata-rata Match Factor</span>
            <span className="text-lg font-black text-amber-400 font-mono">{calculatedMatchFactor}</span>
            <span className="text-[10px] text-emerald-400 block font-semibold">Sangat Sinkron (0.95 - 1.05)</span>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md shadow-amber-500/20"
            id="btn-new-dispatch-cycle"
          >
            <Plus className="w-4 h-4" />
            Buka Siklus Hauling
          </button>
        </div>
      </div>

      {/* Cycle Stage Flow Visual Diagram Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm" id="mining-dispatch-flow-diagram">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Standar Alur Kerja Siklus Penambangan (Mining Cycle Pipeline)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-slate-400 text-[10px] font-bold block">TAHAP 1</span>
            <strong className="text-slate-900 block mt-1">Excavator Shovel</strong>
            <span className="text-[10px] text-slate-500">Front Pit RL +30</span>
          </div>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <span className="text-amber-600 text-[10px] font-bold block">TAHAP 2</span>
            <strong className="text-amber-900 block mt-1">Loading Face</strong>
            <span className="text-[10px] text-amber-700">± 3.2 Menit</span>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <span className="text-blue-600 text-[10px] font-bold block">TAHAP 3</span>
            <strong className="text-blue-900 block mt-1">Hauling Loaded</strong>
            <span className="text-[10px] text-blue-700">Avg 34.2 km/jam</span>
          </div>
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
            <span className="text-indigo-600 text-[10px] font-bold block">TAHAP 4</span>
            <strong className="text-indigo-900 block mt-1">Jembatan Timbang</strong>
            <span className="text-[10px] text-indigo-700">Weighbridge RFID</span>
          </div>
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <span className="text-emerald-600 text-[10px] font-bold block">TAHAP 5</span>
            <strong className="text-emerald-900 block mt-1">Dumping Point</strong>
            <span className="text-[10px] text-emerald-700">Stockpile / Disposal</span>
          </div>
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
            <span className="text-purple-600 text-[10px] font-bold block">TAHAP 6</span>
            <strong className="text-purple-900 block mt-1">Return Empty</strong>
            <span className="text-[10px] text-purple-700">± 10.0 Menit</span>
          </div>
          <div className="p-3 bg-slate-900 text-white rounded-xl">
            <span className="text-amber-400 text-[10px] font-bold block">TAHAP 7</span>
            <strong className="text-white block mt-1">Queue & Reload</strong>
            <span className="text-[10px] text-slate-300">Match Factor Balance</span>
          </div>
        </div>
      </div>

      {/* Active Cycles Interactive Board */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center justify-between">
          <span>Siklus Hauling Aktif ({cycles.length} Unit Bergerak)</span>
          <span className="text-xs font-normal text-slate-500">Klik "Lanjutkan Tahap" untuk memajukan status cycle secara real-time</span>
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {cycles.map(cycle => (
            <div key={cycle.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Unit & Operator Details */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-slate-900 text-amber-400 font-mono font-black text-sm rounded-xl">
                      {cycle.dumpTruckCode}
                    </span>
                    <span className="font-semibold text-slate-900 text-sm">
                      Muatan: {cycle.materialName} ({cycle.payloadTon} Ton)
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      #{cycle.cycleNumber}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3 mt-1">
                    <span>Shovel Pemuat: <strong className="text-slate-800">{cycle.excavatorCode}</strong></span>
                    <span>Front: <strong className="text-slate-800">{cycle.loadingPoint}</strong></span>
                    <span>Tujuan: <strong className="text-slate-800">{cycle.dumpingPoint}</strong></span>
                    <span>Operator: <strong className="text-slate-800">{cycle.operatorName}</strong></span>
                  </div>
                </div>

                {/* Status Badge & Advance Button */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Status Saat Ini</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase inline-block ${
                      cycle.status === 'LOADING' ? 'bg-amber-500 text-slate-950' :
                      cycle.status === 'HAULING' ? 'bg-blue-600 text-white' :
                      cycle.status === 'DUMPING' ? 'bg-emerald-600 text-white' :
                      cycle.status === 'RETURNING' ? 'bg-purple-600 text-white' :
                      cycle.status === 'COMPLETED' ? 'bg-slate-900 text-white' :
                      'bg-slate-200 text-slate-800'
                    }`}>
                      {cycle.status.replace('_', ' ')}
                    </span>
                  </div>

                  {cycle.status !== 'COMPLETED' ? (
                    <button
                      onClick={() => handleAdvanceStatus(cycle.id)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                      id={`btn-advance-cycle-${cycle.id}`}
                    >
                      <span>Lanjutkan Tahap</span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Siklus Selesai
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Stepper Bar */}
              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-5 gap-1.5 text-center text-[10px] font-bold">
                <div className={`p-1.5 rounded-lg transition-all ${
                  ['QUEUE_LOADING', 'LOADING', 'HAULING', 'DUMPING', 'RETURNING', 'COMPLETED'].includes(cycle.status)
                    ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-100 text-slate-400'
                }`}>
                  1. Loading ({cycle.loadingTimeMin}m)
                </div>
                <div className={`p-1.5 rounded-lg transition-all ${
                  ['HAULING', 'DUMPING', 'RETURNING', 'COMPLETED'].includes(cycle.status)
                    ? 'bg-blue-100 text-blue-900 border border-blue-300' : 'bg-slate-100 text-slate-400'
                }`}>
                  2. Haul ({cycle.haulingDistanceKm} KM)
                </div>
                <div className={`p-1.5 rounded-lg transition-all ${
                  ['DUMPING', 'RETURNING', 'COMPLETED'].includes(cycle.status)
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-slate-100 text-slate-400'
                }`}>
                  3. Dumping ({cycle.dumpingTimeMin}m)
                </div>
                <div className={`p-1.5 rounded-lg transition-all ${
                  ['RETURNING', 'COMPLETED'].includes(cycle.status)
                    ? 'bg-purple-100 text-purple-900 border border-purple-300' : 'bg-slate-100 text-slate-400'
                }`}>
                  4. Return Kosongan
                </div>
                <div className={`p-1.5 rounded-lg transition-all ${
                  cycle.status === 'COMPLETED'
                    ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  5. Total ({cycle.totalCycleTimeMin || 28.5} mnt)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Cycle Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Buka Siklus Hauling Baru (Dispatcher Assignment)</h2>

            <form onSubmit={handleCreateCycle} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Excavator Shovel Pemuat</label>
                  <select
                    value={newCycleData.excavatorId}
                    onChange={(e) => setNewCycleData({ ...newCycleData, excavatorId: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    {excavators.map(ex => (
                      <option key={ex.id} value={ex.id}>{ex.code} - {ex.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Dump Truck / Hauler</label>
                  <select
                    value={newCycleData.dumpTruckId}
                    onChange={(e) => setNewCycleData({ ...newCycleData, dumpTruckId: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    {trucks.map(tr => (
                      <option key={tr.id} value={tr.id}>{tr.code} - {tr.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Front Loading (Pit)</label>
                  <input
                    type="text"
                    value={newCycleData.loadingPoint}
                    onChange={(e) => setNewCycleData({ ...newCycleData, loadingPoint: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Dumping Point</label>
                  <input
                    type="text"
                    value={newCycleData.dumpingPoint}
                    onChange={(e) => setNewCycleData({ ...newCycleData, dumpingPoint: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Material Muatan</label>
                  <select
                    value={newCycleData.materialName}
                    onChange={(e) => setNewCycleData({ ...newCycleData, materialName: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    {materials.map(m => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Estimasi Tonase (Ton)</label>
                  <input
                    type="number"
                    value={newCycleData.payloadTon}
                    onChange={(e) => setNewCycleData({ ...newCycleData, payloadTon: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 mt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl"
                >
                  Jalankan Siklus Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
