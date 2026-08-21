import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Star,
  DollarSign,
  CheckCircle2,
  Bike,
  Truck,
  Award,
  TrendingUp,
  Battery,
  Phone
} from 'lucide-react';
import { pudService } from '../../../modules/pud/services/pudService';
import { PudCourier } from '../../../modules/pud/types';

export const PudCouriersTab: React.FC = () => {
  const [couriers] = useState<PudCourier[]>(pudService.getCouriers());
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCouriers = couriers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.assignedHubName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6" id="pud-couriers-tab">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Roster Kurir & Kinerja Insentif Harian
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manajemen profil kurir motor & driver van, rating kepuasan pelanggan, pencapaian target drop, dan kalkulasi bonus insentif.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl">
            {couriers.length} Kurir Terdaftar
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama kurir, plat nomor, hub..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">Rata-rata Rating: 4.88 ⭐</span>
      </div>

      {/* Courier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCouriers.map((courier) => (
          <div key={courier.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 hover:border-indigo-300 transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-slate-100 overflow-hidden font-bold text-sm flex items-center justify-center text-indigo-700 border-2 border-indigo-100">
                  {courier.avatarUrl ? (
                    <img src={courier.avatarUrl} alt={courier.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    courier.name.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{courier.name}</h4>
                  <span className="text-[11px] text-slate-500">{courier.courierCode} • {courier.vehiclePlate}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="flex items-center gap-1 text-xs font-black text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {courier.rating}
                </span>
                <span className="text-[10px] text-slate-400">Rating</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Hub Penugasan:</span>
                <span className="font-bold text-slate-800">{courier.assignedHubName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Shift Jam Kerja:</span>
                <span className="font-mono text-slate-700">{courier.shiftStartTime} - {courier.shiftEndTime} WIB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Selesai Antar Hari Ini:</span>
                <span className="font-bold text-emerald-700">{courier.todayCompletedDeliveries} Paket</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Insentif Hari Ini</span>
                <span className="font-black text-indigo-700">Rp {courier.totalIncentiveToday.toLocaleString()}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Pendapatan</span>
                <span className="font-black text-slate-900">Rp {(courier.dailyEarnings + courier.totalIncentiveToday).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
