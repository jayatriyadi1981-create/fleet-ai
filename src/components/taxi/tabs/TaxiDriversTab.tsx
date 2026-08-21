import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Award,
  ShieldCheck,
  Star,
  Clock,
  Phone,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { taxiService } from '../../../modules/taxi/services/taxiService';
import { TaxiDriver } from '../../../modules/taxi/types';

export const TaxiDriversTab: React.FC = () => {
  const [drivers, setDrivers] = useState<TaxiDriver[]>(taxiService.getDrivers());
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDrivers = drivers.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.ktaNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.assignedTaxiHull.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="taxi-drivers-tab" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 flex items-center space-x-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <span>Manajemen Pengemudi Taksi, KTA & Roster Shift Operasional</span>
          </h2>
          <p className="text-xs text-slate-400">Database lisensi KTA Dishub, SIM A Umum, rating kepuasan penumpang, dan jam kerja pengemudi</p>
        </div>

        <button
          onClick={() => alert('Buka form pendaftaran pengemudi baru')}
          className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pengemudi Baru</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama pengemudi, nomor KTA Dishub, atau nomor lambung taksi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Driver Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDrivers.map((d) => (
          <div key={d.id} className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-200 text-sm">
                  {d.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">{d.name}</h3>
                  <div className="text-[11px] text-slate-400 font-mono">{d.ktaNumber} | {d.simNumber}</div>
                  <div className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                    <Phone className="w-3 h-3 text-slate-500" />
                    <span>{d.phone}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center space-x-1 text-amber-400 font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{d.ratingAverage} / 5.0</span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold mt-1 inline-block">
                  FIT BEKERJA
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-400">Armada Ditugaskan</span>
                <p className="font-bold text-amber-400 font-mono">{d.assignedTaxiHull}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Pangkalan / Pool</span>
                <p className="font-semibold text-slate-200 truncate">{d.assignedPool}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Skema Kontrak</span>
                <p className="font-semibold text-slate-200">
                  {d.employmentScheme === 'SETORAN_MURNI' ? 'Setoran' : 'Bagi Hasil'}
                </p>
              </div>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-400 text-[10px]">Total Ritase Bulan Ini</span>
                <p className="font-bold text-slate-200 font-mono">{d.totalTripsMonth} Perjalanan</p>
              </div>
              <div className="text-right">
                <span className="text-slate-400 text-[10px]">Status Setoran Hari Ini</span>
                <p className="font-bold text-emerald-400 font-mono">Rp {d.actualDepositTodayRp.toLocaleString()} (Lunas)</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
