import React, { useState } from 'react';
import {
  Users,
  Star,
  Phone,
  Clock,
  Car,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Plus,
  Search,
  Filter,
  Building
} from 'lucide-react';
import { MOCK_CORP_DRIVERS } from '../../../modules/corporate/mockData';

export const CorpDriversTab: React.FC = () => {
  const [drivers, setDrivers] = useState(MOCK_CORP_DRIVERS);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = drivers.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.assignedType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="corp-drivers-tab" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs text-blue-400 font-mono font-bold uppercase tracking-wider">
            CORPORATE DRIVER MANAGEMENT & EXECUTIVE CHAUFFEUR POOL
          </span>
          <h3 className="text-lg font-bold text-white mt-1">
            Manajemen Supir Pool Kantor, Driver Direksi (VIP) & Lembur Dinas
          </h3>
          <p className="text-xs text-slate-400">
            Penugasan pengemudi operasional, monitoring jam lembur (Overtime GA), sertifikasi SIM dinas, dan survei kepuasan bintang layanan karyawan.
          </p>
        </div>

        <button
          onClick={() => alert('Registrasi Driver Kantor Baru')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" /> Tambah Supir Pool / Chauffeur
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama supir, NIK pengemudi, atau tipe penugasan..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map(driver => (
          <div key={driver.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-blue-400 flex items-center justify-center font-bold text-sm">
                  {driver.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{driver.name}</h4>
                  <p className="text-[11px] text-slate-500 font-mono">{driver.employeeId}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                driver.currentDuty === 'ON_DUTY_TRIP' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                driver.currentDuty === 'IDLE_AVAILABLE' ? 'bg-emerald-100 text-emerald-800' :
                'bg-slate-100 text-slate-800'
              }`}>
                {driver.currentDuty.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Penugasan:</span>
                <span className="font-bold text-blue-700">{driver.assignedType.replace(/_/g, ' ')}</span>
              </div>
              {driver.assignedExecutive && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Khusus Pejabat:</span>
                  <span className="font-bold text-purple-700">{driver.assignedExecutive}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Telepon / WhatsApp:</span>
                <span className="font-mono text-slate-800">{driver.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Kualifikasi SIM:</span>
                <span className="font-semibold text-slate-800">{driver.simType} (Exp: {driver.simExpiryDate})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Rating Kepuasan:</span>
                <span className="font-bold text-amber-600 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {driver.ratingStars} / 5.0
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Trip Bulan Ini:</span>
                <span className="font-mono font-bold text-slate-800">{driver.monthlyTripsCount} Perjalanan</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Akumulasi Lembur GA:</span>
                <span className="font-mono font-bold text-indigo-600">{driver.overtimeHoursMonth} Jam</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => alert(`Detail Rekap Lembur & Riwayat Perjalanan untuk ${driver.name}`)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <Clock className="w-3.5 h-3.5 text-slate-500" /> Form Lembur & Profil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
