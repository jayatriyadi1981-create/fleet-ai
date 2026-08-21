import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Search,
  Filter,
  Layers,
  Scale,
  Calendar,
  CheckCircle,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
  Droplets,
  ThermometerSnowflake,
  Wrench
} from 'lucide-react';
import { MOCK_WASTE_FLEETS } from '../../../modules/waste/services/wasteMockData';
import { WasteFleetVehicle } from '../../../modules/waste/types';

export const WasteFleetsTab: React.FC = () => {
  const [fleets, setFleets] = useState<WasteFleetVehicle[]>(MOCK_WASTE_FLEETS);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = fleets.filter((f) => {
    const matchSearch =
      f.hullNumber.toLowerCase().includes(search.toLowerCase()) ||
      f.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
      f.currentDriver.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'ALL' || f.vehicleType === filterType;
    return matchSearch && matchType;
  });

  return (
    <div id="waste-fleets-tab" className="space-y-6">
      {/* Header with Search and Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <Truck className="w-5 h-5 text-emerald-400" />
            <span>Master Armada Pengangkut Sampah & Limbah (Waste Fleet Master)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Database spesifikasi truk compactor, arm roll, hook lift, vacuum sludge, dan cold box limbah medis B3 bersertifikasi KLHK.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari no lambung, plat, supir..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Registrasi Truk</span>
          </button>
        </div>
      </div>

      {/* Fleets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((veh) => (
          <div
            key={veh.id}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 hover:border-emerald-500/30 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold border border-emerald-500/20">
                    {veh.vehicleType.replace(/_/g, ' ')}
                  </span>
                  <h3 className="text-base font-black text-slate-100 mt-1">{veh.hullNumber}</h3>
                  <span className="text-xs text-amber-400 font-mono font-bold">{veh.plateNumber}</span>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    veh.hydraulicStatus === 'OPTIMAL'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  HIDROLIK {veh.hydraulicStatus}
                </span>
              </div>

              {/* Capacity and Payload Info */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Kapasitas Bak</span>
                  <span className="font-bold text-slate-200 font-mono">{veh.capacityM3} m³</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Maksimal Payload</span>
                  <span className="font-bold text-emerald-400 font-mono">{veh.maxPayloadTons} Ton</span>
                </div>
              </div>

              {/* Status and Cargo Category */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Kategori Muatan:</span>
                  <span className="font-semibold text-slate-200">{veh.cargoCategory.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Supir Utama:</span>
                  <span className="font-bold text-slate-200">{veh.currentDriver}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Katup Lindi:</span>
                  <span className="text-emerald-400 font-mono font-bold">{veh.leachateDrainValve}</span>
                </div>
                {veh.coldBoxTempC !== undefined && (
                  <div className="flex items-center justify-between pt-1 border-t border-slate-900">
                    <span className="text-slate-400 flex items-center space-x-1">
                      <ThermometerSnowflake className="w-3.5 h-3.5 text-sky-400" />
                      <span>Suhu Pendingin:</span>
                    </span>
                    <span className="font-bold text-sky-300 font-mono">{veh.coldBoxTempC}°C</span>
                  </div>
                )}
              </div>
            </div>

            {/* Expiry and Compliance Footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center space-x-1 font-mono text-[11px]">
                <Calendar className="w-3 h-3 text-slate-500" />
                <span>KIR: {veh.kirExpiry}</span>
              </span>
              <span className="flex items-center space-x-1 text-emerald-400 font-bold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Izin KLHK Aktif</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Mockup */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-100">Registrasi Armada Truk Sampah Baru</h3>
            <p className="text-xs text-slate-400">
              Masukkan spesifikasi teknis kendaraan, tipe hidrolik compactor, dan nomor izin angkut limbah.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Nomor Lambung Truk</label>
                <input
                  type="text"
                  placeholder="misal COMP-JAK-106"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Tipe Kendaraan</label>
                <select className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200">
                  <option>Truk Compactor (12-18 m³)</option>
                  <option>Arm Roll Container (6-8 m³)</option>
                  <option>Hook Lift Truck (15-20 m³)</option>
                  <option>Vacuum Sludge / Truk Tinja (5 m³)</option>
                  <option>Medical B3 Cold Box</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  alert('Armada baru berhasil didaftarkan ke sistem TTMS!');
                  setShowAddModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
              >
                Simpan Armada
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
