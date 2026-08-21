import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Compass,
  Tag,
  CheckCircle2,
  Box,
  Scale
} from 'lucide-react';
import { miningService } from '../../../modules/mining/services/miningService';
import { MiningMaterial } from '../../../modules/mining/types';

export const MiningMaterialsTab: React.FC = () => {
  const [materials, setMaterials] = useState<MiningMaterial[]>(miningService.getMaterials());
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState<Partial<MiningMaterial>>({
    materialCode: '',
    name: '',
    category: 'COAL',
    densityTonPerM3: 1.3,
    gradeInfo: '',
    unit: 'TON',
    defaultDestination: 'STOCKPILE_ROM',
    stockpileName: 'ROM Stockpile Utama',
    colorHex: '#1e293b'
  });

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    miningService.addMaterial(formData);
    setMaterials(miningService.getMaterials());
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6" id="mining-materials-container">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Tag className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl font-bold text-slate-900">Klasifikasi Material Tambang & Kadar (Ore Grade & Density)</h1>
          </div>
          <p className="text-xs text-slate-500">
            Daftar material tambang: Batu Bara (GAR), Nikel (Saprolite / Limonite %Ni), Tembaga/Emas, Overburden (OB), densitas (Ton/m³), & lokasi stockpile tujuan.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md shadow-amber-500/20"
          id="btn-add-material"
        >
          <Plus className="w-4 h-4" />
          Tambah Material
        </button>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map(mat => (
          <div key={mat.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 text-slate-700">
                  {mat.materialCode}
                </span>
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase text-white"
                  style={{ backgroundColor: mat.colorHex }}
                >
                  {mat.category}
                </span>
              </div>

              <h2 className="text-base font-bold text-slate-900 mb-1">{mat.name}</h2>
              {mat.gradeInfo && (
                <div className="text-xs font-semibold text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200/60 mb-3">
                  {mat.gradeInfo}
                </div>
              )}

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Densitas Material:</span>
                  <strong className="text-slate-900 font-mono text-sm">{mat.densityTonPerM3} Ton/m³</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Satuan Pengukuran:</span>
                  <span className="font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono">{mat.unit}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Tujuan Default:</span>
                  <strong className="text-slate-800 text-[11px]">{mat.defaultDestination.replace('_', ' ')}</strong>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Stockpile: <strong className="text-slate-700">{mat.stockpileName}</strong></span>
              <div className="w-3.5 h-3.5 rounded-full border border-slate-300" style={{ backgroundColor: mat.colorHex }} />
            </div>
          </div>
        ))}
      </div>

      {/* Add Material Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Tambah Material Tambang Baru</h2>

            <form onSubmit={handleAddMaterial} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kode Material</label>
                  <input
                    type="text"
                    required
                    placeholder="misal: COAL-GAR4200"
                    value={formData.materialCode}
                    onChange={(e) => setFormData({ ...formData, materialCode: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="COAL">Batu Bara (Coal)</option>
                    <option value="NICKEL_ORE">Nikel (Nickel Ore)</option>
                    <option value="GOLD_ORE">Bijih Emas / Tembaga</option>
                    <option value="OVERBURDEN">Tanah Penutup (Overburden)</option>
                    <option value="LIMESTONE">Galian C / Andesite</option>
                    <option value="WASTE">Waste / Tailing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Material</label>
                <input
                  type="text"
                  required
                  placeholder="misal: Medium Grade Coal GAR 4200"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Densitas (Ton/m³)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.densityTonPerM3}
                    onChange={(e) => setFormData({ ...formData, densityTonPerM3: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Satuan</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="TON">TON</option>
                    <option value="BCM">BCM</option>
                    <option value="WMT">WMT (Wet Metric Ton)</option>
                    <option value="DMT">DMT (Dry Metric Ton)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Spesifikasi Kadar / Grade Info</label>
                <input
                  type="text"
                  placeholder="misal: GAR 4200 kcal/kg | TM 30% | Ash 5%"
                  value={formData.gradeInfo}
                  onChange={(e) => setFormData({ ...formData, gradeInfo: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tujuan Dumping Default</label>
                  <select
                    value={formData.defaultDestination}
                    onChange={(e) => setFormData({ ...formData, defaultDestination: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="STOCKPILE_ROM">ROM Stockpile</option>
                    <option value="DISPOSAL_DUMP">Disposal Dump Waste</option>
                    <option value="CRUSHER_PLANT">Crusher Plant Hopper</option>
                    <option value="SMELTER_FEED">Smelter Feed Pad</option>
                    <option value="PORT_JETTY">Pelabuhan / Jetty</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama Stockpile / Dump Point</label>
                  <input
                    type="text"
                    value={formData.stockpileName}
                    onChange={(e) => setFormData({ ...formData, stockpileName: e.target.value })}
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
                  Simpan Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
