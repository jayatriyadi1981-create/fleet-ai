import React, { useState } from 'react';
import {
  Car,
  Plus,
  Search,
  Filter,
  FileText,
  Shield,
  CreditCard,
  Zap,
  Building,
  Key,
  Wrench,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { MOCK_CORP_VEHICLES } from '../../../modules/corporate/mockData';

export const CorpVehiclesTab: React.FC = () => {
  const [vehicles, setVehicles] = useState(MOCK_CORP_VEHICLES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOwnership, setSelectedOwnership] = useState('ALL');

  const filtered = vehicles.filter(v => {
    const matchSearch =
      v.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.brandModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.assignedDivision.toLowerCase().includes(searchTerm.toLowerCase());
    const matchOwner = selectedOwnership === 'ALL' || v.ownership === selectedOwnership;
    return matchSearch && matchOwner;
  });

  return (
    <div id="corp-vehicles-tab" className="space-y-6">
      {/* Top Action & Summary Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs text-blue-400 font-mono font-bold uppercase tracking-wider">
            CORPORATE MASTER FLEET ASSET INVENTORY
          </span>
          <h3 className="text-lg font-bold text-white mt-1">
            Master Database Kendaraan Dinas, Pool Sharing & Mobil Jabatan
          </h3>
          <p className="text-xs text-slate-400">
            Pengelolaan spesifikasi armada, model kepemilikan (Owned / Operating Lease TRAC/MPM/ASSA / COP), alokasi divisi, dan telematika OBD-II.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Buka Formulir Registrasi Kendaraan Dinas / Kontrak Sewa Baru')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow"
          >
            <Plus className="w-4 h-4" /> Registrasi Kendaraan Baru
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari plat nomor, model kendaraan, divisi pengampu, atau kode aset..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedOwnership}
            onChange={e => setSelectedOwnership(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">Semua Model Kepemilikan</option>
            <option value="OPERATING_LEASE_TRAC">Operating Lease (TRAC Astra)</option>
            <option value="OPERATING_LEASE_MPM">Operating Lease (MPM Rent)</option>
            <option value="OPERATING_LEASE_ASSA">Operating Lease (ASSA Rent)</option>
            <option value="COMPANY_OWNED">Company Owned (Aset Milik Perusahaan)</option>
            <option value="CAR_OWNERSHIP_PROGRAM_COP">Car Ownership Program (COP)</option>
          </select>
        </div>
      </div>

      {/* Vehicles Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(v => (
          <div key={v.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-blue-400 flex items-center justify-center font-bold text-sm">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm font-mono">{v.plateNumber}</h4>
                  <p className="text-[11px] text-slate-500 font-mono">{v.assetCode}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                v.status === 'AVAILABLE_POOL' ? 'bg-emerald-100 text-emerald-800' :
                v.status === 'ON_TRIP_RESERVED' ? 'bg-amber-100 text-amber-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {v.status.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Tipe & Model:</span>
                <span className="font-bold text-slate-800 text-right">{v.brandModel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Kategori Armada:</span>
                <span className="font-semibold text-blue-700">{v.category.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Kepemilikan:</span>
                <span className="font-mono text-slate-700">{v.ownership.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Divisi Pengampu:</span>
                <span className="font-semibold text-slate-800">{v.assignedDivision}</span>
              </div>
              {v.assignedUser && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Pemakai Khusus:</span>
                  <span className="font-bold text-purple-700">{v.assignedUser}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Odometer Terakhir:</span>
                <span className="font-mono text-slate-800 font-bold">{v.currentOdometerKm.toLocaleString('id-ID')} KM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Jatuh Tempo STNK:</span>
                <span className="font-mono text-amber-700 font-medium">{v.stnkExpiryDate}</span>
              </div>
              {v.leaseMonthlyCostIdr && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Biaya Sewa / Bulan:</span>
                  <span className="font-mono text-slate-900 font-bold">Rp {v.leaseMonthlyCostIdr.toLocaleString('id-ID')}</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => alert(`Detail Telematika & Riwayat Servis Kendaraan ${v.plateNumber}`)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" /> Profil Lengkap
              </button>
              <button
                onClick={() => alert(`Buka Form Reservasi untuk ${v.plateNumber}`)}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow"
              >
                <Calendar className="w-3.5 h-3.5" /> Book
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
