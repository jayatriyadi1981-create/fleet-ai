import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Compass,
  Route,
  Shield,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { miningService } from '../../../modules/mining/services/miningService';
import { MiningBench } from '../../../modules/mining/types';

export const MiningBenchesTab: React.FC = () => {
  const [benches, setBenches] = useState<MiningBench[]>(miningService.getBenches());
  const [showAddModal, setShowAddModal] = useState(false);
  const pits = miningService.getPits();
  const materials = miningService.getMaterials();

  const [formData, setFormData] = useState<Partial<MiningBench>>({
    benchNumber: '',
    pitId: pits[0]?.id || '',
    elevationRl: 45,
    materialId: materials[0]?.id || '',
    workingAreaStatus: 'STABLE',
    loadingZoneName: 'Front Loading Baru',
    haulingRouteName: 'Haul Road Utama (4.5 KM)',
    status: 'ACTIVE',
    widthMeters: 40,
    heightMeters: 10,
    safetyBermHeightMeters: 2.2
  });

  const handleAddBench = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.benchNumber) return;

    const selectedPit = pits.find(p => p.id === formData.pitId);
    const selectedMat = materials.find(m => m.id === formData.materialId);

    miningService.addBench({
      ...formData,
      pitName: selectedPit?.name || 'Pit Utama',
      materialName: selectedMat?.name || 'Material',
      materialCategory: selectedMat?.category || 'COAL'
    });
    setBenches(miningService.getBenches());
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6" id="mining-benches-container">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl font-bold text-slate-900">Manajemen Jenjang Tambang (Benches & Loading Zones)</h1>
          </div>
          <p className="text-xs text-slate-500">
            Pengelolaan jenjang kerja (bench), elevasi RL, lebar jenjang, tinggi safety berm penahan, dan jalur rute hauling terhubung.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md shadow-amber-500/20"
          id="btn-add-bench"
        >
          <Plus className="w-4 h-4" />
          Tambah Jenjang (Bench)
        </button>
      </div>

      {/* Benches Table View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Nama Jenjang (Bench)</th>
                <th className="py-3.5 px-4">Pit Tambang</th>
                <th className="py-3.5 px-4">Elevasi (RL)</th>
                <th className="py-3.5 px-4">Material & Kategori</th>
                <th className="py-3.5 px-4">Front Loading Zone</th>
                <th className="py-3.5 px-4">Dimensi (L x T x Safety Berm)</th>
                <th className="py-3.5 px-4">Status Kerja</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {benches.map(bench => (
                <tr key={bench.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {bench.benchNumber}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {bench.pitName}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    RL {bench.elevationRl > 0 ? `+${bench.elevationRl}` : bench.elevationRl} m
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-800 block">{bench.materialName}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">{bench.materialCategory}</span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">
                    {bench.loadingZoneName}
                  </td>
                  <td className="py-3 px-4 text-[11px]">
                    Lebar: <strong>{bench.widthMeters}m</strong> | Tinggi: <strong>{bench.heightMeters}m</strong>
                    <div className="text-amber-700 font-medium mt-0.5">Berm: {bench.safetyBermHeightMeters}m (K3 Sesuai)</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      bench.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' :
                      bench.status === 'BLASTING_SCHEDULED' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {bench.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Safety Berm Compliance Banner */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3 text-xs text-blue-950">
        <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Standar K3 SMKP ESDM untuk Tanggul Pengaman (Safety Berm):</span>
          <p className="text-[11px] text-blue-800 mt-0.5">
            Tinggi safety berm di tepi jalan tambang dan front loading minimal adalah <strong>3/4 x diameter roda unit terbesar</strong> yang melintas (contoh: untuk HD785 diameter roda ±2.7m, tinggi tanggul minimal 2.0 - 2.2 meter).
          </p>
        </div>
      </div>

      {/* Add Bench Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Tambah Jenjang (Bench) Baru</h2>

            <form onSubmit={handleAddBench} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama / Identitas Bench</label>
                <input
                  type="text"
                  required
                  placeholder="misal: Bench RL +60 (Coal Face 2)"
                  value={formData.benchNumber}
                  onChange={(e) => setFormData({ ...formData, benchNumber: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Pit Induk</label>
                  <select
                    value={formData.pitId}
                    onChange={(e) => setFormData({ ...formData, pitId: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    {pits.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Elevasi RL (meter)</label>
                  <input
                    type="number"
                    value={formData.elevationRl}
                    onChange={(e) => setFormData({ ...formData, elevationRl: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Material</label>
                  <select
                    value={formData.materialId}
                    onChange={(e) => setFormData({ ...formData, materialId: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    {materials.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama Front Loading</label>
                  <input
                    type="text"
                    value={formData.loadingZoneName}
                    onChange={(e) => setFormData({ ...formData, loadingZoneName: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Lebar (m)</label>
                  <input
                    type="number"
                    value={formData.widthMeters}
                    onChange={(e) => setFormData({ ...formData, widthMeters: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tinggi (m)</label>
                  <input
                    type="number"
                    value={formData.heightMeters}
                    onChange={(e) => setFormData({ ...formData, heightMeters: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Safety Berm (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.safetyBermHeightMeters}
                    onChange={(e) => setFormData({ ...formData, safetyBermHeightMeters: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl"
                >
                  Simpan Jenjang (Bench)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
