import React, { useState } from 'react';
import {
  Shield,
  Truck,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  Wrench,
  Radio,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { MOCK_ARMORED_FLEETS } from '../../../modules/securicor/services/securicorMockData';
import { SecuricorArmoredVehicle } from '../../../modules/securicor/types';

export const SecuricorArmoredFleetsTab: React.FC = () => {
  const [fleets, setFleets] = useState<SecuricorArmoredVehicle[]>(MOCK_ARMORED_FLEETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBallistic, setSelectedBallistic] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = fleets.filter(f => {
    const matchQuery = f.hullNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.assignedBankClient.toLowerCase().includes(searchQuery.toLowerCase());
    const matchBallistic = selectedBallistic === 'ALL' || f.ballisticLevel === selectedBallistic;
    return matchQuery && matchBallistic;
  });

  return (
    <div id="securicor-armored-fleets-tab" className="space-y-6">
      {/* Header with Search and Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[240px] flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari No Lambung, Plat Nomor, atau Klien Bank..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedBallistic}
              onChange={e => setSelectedBallistic(e.target.value)}
              className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none"
            >
              <option value="ALL">Semua Tingkat Balistik</option>
              <option value="CEN_B6_STANAG">CEN B6 STANAG (Assault Rifle 7.62mm)</option>
              <option value="CEN_B7_ARMOR_PIERCING">CEN B7 (Armor Piercing AP)</option>
              <option value="VPAM_VR9">VPAM VR9 (High Explosive / Blast)</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-amber-400" /> Registrasi Armada Lapis Baja
        </button>
      </div>

      {/* Fleets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(vehicle => (
          <div key={vehicle.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Header of Card */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white font-mono">{vehicle.hullNumber}</h4>
                  <p className="text-[11px] text-slate-400 font-mono">{vehicle.plateNumber}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-bold font-mono">
                {vehicle.ballisticLevel}
              </span>
            </div>

            {/* Content of Card */}
            <div className="p-4 space-y-3.5 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-slate-500">Tipe Kendaraan:</span>
                <span className="font-semibold text-slate-800">{vehicle.vehicleType.replace(/_/g, ' ')}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-slate-500">Klien Operasional:</span>
                <span className="font-semibold text-slate-900">{vehicle.assignedBankClient}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-slate-500">Ban Anti-Peluru (Run-Flat):</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {vehicle.runFlatTyreStatus}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-slate-500">Pintu Interlock & Vault:</span>
                <span className="font-semibold text-sky-700 flex items-center gap-1 font-mono text-[11px]">
                  <Lock className="w-3.5 h-3.5" /> {vehicle.interlockingDoors}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-slate-500">Masa Berlaku Izin KTA Senpi:</span>
                <span className="font-semibold text-slate-800">{vehicle.ktaSenpiExpiry}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
                <div className="text-[11px] text-slate-500">Pengawalan Bersenjata Resmi (Polri):</div>
                <div className="font-medium text-slate-900 text-xs">{vehicle.armedPoliceEscort}</div>
                <div className="text-[11px] text-slate-500 pt-1">Komandan Pengawal: <span className="font-semibold text-slate-800">{vehicle.chiefEscortOfficer}</span></div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => alert(`Detail Telemetri & Sertifikasi Balistik untuk ${vehicle.hullNumber}`)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-1"
                >
                  <FileCheck className="w-3.5 h-3.5" /> Sertifikat Balistik
                </button>
                <button
                  onClick={() => alert(`Status Pemeriksaan Rutin Solenoid Kunci & Kaca Anti-Peluru ${vehicle.hullNumber}`)}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-1"
                >
                  <Wrench className="w-3.5 h-3.5" /> Servis
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Fleet Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-600" /> Registrasi Kendaraan Lapis Baja Baru
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Nomor Lambung Kendaraan</label>
                <input type="text" placeholder="Contoh: ARMOR-CIT-06" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Nomor Polisi (Plat Hitam Khusus)</label>
                <input type="text" placeholder="Contoh: B 9550 SEC" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Tingkat Ketahanan Balistik</label>
                  <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <option>CEN B6 STANAG (7.62mm Rifle)</option>
                    <option>CEN B7 Armor Piercing</option>
                    <option>VPAM VR9 Blast Proof</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Tipe Kendaraan</label>
                  <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <option>ARMORED_CIT_VAN</option>
                    <option>HEAVY_ARMORED_TRUCK</option>
                    <option>TACTICAL_ESCORT_SUV</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Bank Klien Utama / Khazanah</label>
                <input type="text" placeholder="Contoh: Bank Central Asia (BCA) / Bank Indonesia" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  alert('Armada Lapis Baja baru berhasil didaftarkan dan terintegrasi dengan jaringan GPS Telematika Militer.');
                  setShowAddModal(false);
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-lg text-xs font-bold"
              >
                Simpan & Aktifkan GPS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
