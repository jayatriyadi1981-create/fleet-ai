import React, { useState } from 'react';
import {
  Compass,
  Plus,
  Building,
  MapPin,
  Clock,
  Shield,
  Phone,
  User,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { miningService } from '../../../modules/mining/services/miningService';
import { MiningSite } from '../../../modules/mining/types';

export const MiningSitesTab: React.FC = () => {
  const [sites, setSites] = useState<MiningSite[]>(miningService.getSites());
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<Partial<MiningSite>>({
    code: '',
    name: '',
    miningCompany: '',
    contractor: '',
    commodityType: 'COAL',
    location: '',
    operatingHours: '24 Jam Non-Stop (2 Shifts)',
    status: 'ACTIVE',
    productionTargetMonthlyTon: 1500000,
    productionTargetMonthlyBcm: 7000000,
    kttName: '',
    kttPhone: '',
    concessionAreaHa: 10000
  });

  const handleAddSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.miningCompany) return;

    const newSite = miningService.addSite(formData);
    setSites(miningService.getSites());
    setShowAddModal(false);
    setFormData({
      code: '',
      name: '',
      miningCompany: '',
      contractor: '',
      commodityType: 'COAL',
      location: '',
      operatingHours: '24 Jam Non-Stop (2 Shifts)',
      status: 'ACTIVE',
      productionTargetMonthlyTon: 1500000,
      productionTargetMonthlyBcm: 7000000,
      kttName: '',
      kttPhone: '',
      concessionAreaHa: 10000
    });
  };

  return (
    <div className="space-y-6" id="mining-sites-container">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl font-bold text-slate-900">Manajemen Site Tambang (Mining Sites & IUP)</h1>
          </div>
          <p className="text-xs text-slate-500">
            Daftar konsesi tambang, pemegang IUP/PKP2B, kontraktor pelaksana, Kepala Teknik Tambang (KTT), dan target bulanan.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md shadow-amber-500/20"
          id="btn-add-mining-site"
        >
          <Plus className="w-4 h-4" />
          Tambah Site Tambang
        </button>
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sites.map(site => (
          <div key={site.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="p-6">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-slate-100 text-slate-700 border border-slate-200">
                      {site.code}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      site.commodityType === 'COAL' ? 'bg-slate-800 text-white' :
                      site.commodityType === 'NICKEL' ? 'bg-emerald-600 text-white' :
                      site.commodityType === 'COPPER' || site.commodityType === 'GOLD' ? 'bg-amber-500 text-slate-950' :
                      'bg-blue-600 text-white'
                    }`}>
                      {site.commodityType} MINING
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">{site.name}</h2>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  site.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' :
                  site.status === 'MAINTENANCE' ? 'bg-amber-100 text-amber-800' :
                  'bg-rose-100 text-rose-800'
                }`}>
                  {site.status}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600 mb-4">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>IUP Holder: <strong className="text-slate-800">{site.miningCompany}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Kontraktor: <strong className="text-slate-800">{site.contractor}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Lokasi: <strong className="text-slate-800">{site.location}</strong> ({site.concessionAreaHa.toLocaleString()} Ha)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Jam Operasi: <strong className="text-slate-800">{site.operatingHours}</strong></span>
                </div>
              </div>

              {/* Target & Achievement Progress Bar */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700">Pencapaian Bulan Berjalan:</span>
                  <span className="font-bold text-slate-900">
                    {(site.currentMonthActualTon / 1000).toLocaleString()}k / {(site.productionTargetMonthlyTon / 1000).toLocaleString()}k Ton
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-amber-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (site.currentMonthActualTon / site.productionTargetMonthlyTon) * 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                  <span>Target Bulanan OB: {(site.productionTargetMonthlyBcm / 1000000).toFixed(1)}M BCM</span>
                  <span className="font-bold text-amber-600">{((site.currentMonthActualTon / site.productionTargetMonthlyTon) * 100).toFixed(1)}% Tercapai</span>
                </div>
              </div>

              {/* KTT Info & Safety Rules */}
              <div className="border-t border-slate-100 pt-3 text-xs">
                <div className="flex items-center justify-between text-slate-700 mb-2">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Shield className="w-3.5 h-3.5 text-blue-600" />
                    KTT: {site.kttName}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500 font-mono text-[11px]">
                    <Phone className="w-3 h-3" /> {site.kttPhone}
                  </span>
                </div>

                <div className="bg-amber-50/60 p-2.5 rounded-lg border border-amber-100/80">
                  <span className="text-[11px] font-bold text-amber-900 block mb-1">K3 Golden Safety Rules:</span>
                  <ul className="text-[11px] text-amber-800 space-y-0.5 list-disc list-inside">
                    {site.safetyRules.slice(0, 2).map((rule, idx) => (
                      <li key={idx} className="truncate">{rule}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>{site.totalActivePits} Pit Aktif</span>
              <span>{site.totalAssignedFleets} Alat Berat Ditempatkan</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Site Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Tambah Site Konsesi Tambang Baru</h2>

            <form onSubmit={handleAddSite} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kode Site</label>
                  <input
                    type="text"
                    required
                    placeholder="misal: SITE-BERAU-LATI"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Komoditas</label>
                  <select
                    value={formData.commodityType}
                    onChange={(e) => setFormData({ ...formData, commodityType: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="COAL">Batu Bara (Coal)</option>
                    <option value="NICKEL">Nikel (Nickel Ore)</option>
                    <option value="GOLD">Emas (Gold Ore)</option>
                    <option value="COPPER">Tembaga (Copper)</option>
                    <option value="LIMESTONE">Galian C / Andesite</option>
                    <option value="BAUXITE">Bauksit (Bauxite)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Proyek / Site</label>
                <input
                  type="text"
                  required
                  placeholder="misal: Lati Coal Mining Block North"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Pemegang IUP / Perusahaan</label>
                  <input
                    type="text"
                    required
                    placeholder="misal: PT Berau Coal"
                    value={formData.miningCompany}
                    onChange={(e) => setFormData({ ...formData, miningCompany: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kontraktor Penambangan</label>
                  <input
                    type="text"
                    placeholder="misal: PT PAMA / BUMA"
                    value={formData.contractor}
                    onChange={(e) => setFormData({ ...formData, contractor: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Lokasi (Kabupaten / Provinsi)</label>
                <input
                  type="text"
                  placeholder="misal: Berau, Kalimantan Timur"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Bulanan (Ton)</label>
                  <input
                    type="number"
                    value={formData.productionTargetMonthlyTon}
                    onChange={(e) => setFormData({ ...formData, productionTargetMonthlyTon: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Luas Konsesi (Ha)</label>
                  <input
                    type="number"
                    value={formData.concessionAreaHa}
                    onChange={(e) => setFormData({ ...formData, concessionAreaHa: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama KTT (ESDM)</label>
                  <input
                    type="text"
                    placeholder="Nama Kepala Teknik Tambang"
                    value={formData.kttName}
                    onChange={(e) => setFormData({ ...formData, kttName: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kontak Darurat KTT</label>
                  <input
                    type="text"
                    placeholder="+62 811-..."
                    value={formData.kttPhone}
                    onChange={(e) => setFormData({ ...formData, kttPhone: e.target.value })}
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
                  Simpan Site Tambang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
