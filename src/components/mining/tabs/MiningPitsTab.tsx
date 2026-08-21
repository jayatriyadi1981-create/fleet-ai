import React, { useState } from 'react';
import {
  Compass,
  Plus,
  Layers,
  AlertTriangle,
  MapPin,
  Calendar,
  CheckCircle2,
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import { miningService } from '../../../modules/mining/services/miningService';
import { MiningPit } from '../../../modules/mining/types';

export const MiningPitsTab: React.FC = () => {
  const [pits, setPits] = useState<MiningPit[]>(miningService.getPits());
  const [showAddModal, setShowAddModal] = useState(false);
  const sites = miningService.getSites();

  const [formData, setFormData] = useState<Partial<MiningPit>>({
    code: '',
    name: '',
    siteId: sites[0]?.id || '',
    miningArea: '',
    currentBench: 'Bench RL +50',
    elevationRlMeters: 50,
    materialType: 'COAL',
    primaryTargetBcmDaily: 25000,
    status: 'ACTIVE',
    highwallRiskLevel: 'LOW',
    assignedExcavatorCodes: ['EX-1201'],
    activeDumpTrucksCount: 8,
    notes: ''
  });

  const handleAddPit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const selectedSite = sites.find(s => s.id === formData.siteId);
    miningService.addPit({
      ...formData,
      siteName: selectedSite?.name || 'Site Utama'
    });
    setPits(miningService.getPits());
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6" id="mining-pits-container">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl font-bold text-slate-900">Manajemen Pit Tambang & Geofence (Open Pit Zones)</h1>
          </div>
          <p className="text-xs text-slate-500">
            Daftar pit aktif, zonasi geofence peledakan (blasting), elevasi Reduced Level (RL), alokasi shovel excavator, & pemantauan lereng highwall.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md shadow-amber-500/20"
          id="btn-add-pit"
        >
          <Plus className="w-4 h-4" />
          Buka Pit Baru
        </button>
      </div>

      {/* Pits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pits.map(pit => (
          <div key={pit.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="p-5">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 text-slate-700">
                    {pit.code}
                  </span>
                  <h2 className="text-base font-bold text-slate-900 mt-1">{pit.name}</h2>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {pit.siteName}
                  </div>
                </div>

                <span className={`px-2 py-1 rounded-full text-[11px] font-bold ${
                  pit.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' :
                  pit.status === 'RESTRICTED' ? 'bg-rose-100 text-rose-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {pit.status}
                </span>
              </div>

              {/* Specs & RL Elevation */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 mb-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Elevasi Pit:</span>
                  <strong className="text-slate-900 text-sm">RL {pit.elevationRlMeters > 0 ? `+${pit.elevationRlMeters}` : pit.elevationRlMeters} m</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Jenjang Aktif:</span>
                  <strong className="text-slate-900">{pit.currentBench}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Material Utama:</span>
                  <strong className="text-slate-900">{pit.materialType}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Target Harian:</span>
                  <strong className="text-slate-900">{pit.primaryTargetBcmDaily.toLocaleString()} BCM</strong>
                </div>
              </div>

              {/* Assigned Shovels & Highwall Risk */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Alat Muat (Excavator):</span>
                  <span className="font-bold text-slate-800">{pit.assignedExcavatorCodes.join(', ')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Dump Truck Aktif:</span>
                  <span className="font-bold text-slate-800">{pit.activeDumpTrucksCount} Unit Hauler</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Tingkat Risiko Highwall:</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                    pit.highwallRiskLevel === 'LOW' ? 'bg-emerald-100 text-emerald-800' :
                    pit.highwallRiskLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-800' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    {pit.highwallRiskLevel} RISK
                  </span>
                </div>

                {pit.nextBlastingScheduled && (
                  <div className="p-2 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 flex items-center gap-2 text-[11px]">
                    <Flame className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Jadwal Blasting: <strong>{pit.nextBlastingScheduled}</strong></span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Radius Geofence: {pit.geofenceRadiusMeters}m</span>
              <span className="font-medium text-slate-700">{pit.miningArea}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Pit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Buka Pit / Front Tambang Baru</h2>

            <form onSubmit={handleAddPit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kode Pit</label>
                  <input
                    type="text"
                    required
                    placeholder="misal: PIT-HATARI-NORTH"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Site Tambang</label>
                  <select
                    value={formData.siteId}
                    onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    {sites.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Pit</label>
                <input
                  type="text"
                  required
                  placeholder="misal: Pit Hatari North Highwall Cut"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Elevasi Awal (RL m)</label>
                  <input
                    type="number"
                    value={formData.elevationRlMeters}
                    onChange={(e) => setFormData({ ...formData, elevationRlMeters: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Material Utama</label>
                  <select
                    value={formData.materialType}
                    onChange={(e) => setFormData({ ...formData, materialType: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="COAL">Batu Bara (Coal)</option>
                    <option value="OVERBURDEN">Tanah Penutup (Overburden)</option>
                    <option value="NICKEL_ORE">Nikel Saprolite / Limonite</option>
                    <option value="GOLD_ORE">Bijih Emas / Tembaga</option>
                    <option value="LIMESTONE">Galian C / Andesite</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Harian (BCM)</label>
                  <input
                    type="number"
                    value={formData.primaryTargetBcmDaily}
                    onChange={(e) => setFormData({ ...formData, primaryTargetBcmDaily: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Risiko Highwall</label>
                  <select
                    value={formData.highwallRiskLevel}
                    onChange={(e) => setFormData({ ...formData, highwallRiskLevel: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="LOW">Low Risk (Stabil)</option>
                    <option value="MEDIUM">Medium Risk (Pengawasan Rutin)</option>
                    <option value="HIGH">High Risk (Radar SSR Aktif)</option>
                  </select>
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
                  Simpan Pit Tambang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
