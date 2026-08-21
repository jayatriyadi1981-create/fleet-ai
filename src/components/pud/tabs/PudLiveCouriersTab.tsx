import React, { useState } from 'react';
import {
  MapPin,
  Bike,
  Truck,
  Battery,
  Phone,
  CheckCircle2,
  Navigation,
  RefreshCw,
  Search,
  Radio,
  Clock,
  Layers
} from 'lucide-react';
import { pudService } from '../../../modules/pud/services/pudService';
import { PudCourier } from '../../../modules/pud/types';

export const PudLiveCouriersTab: React.FC = () => {
  const [couriers, setCouriers] = useState<PudCourier[]>(pudService.getCouriers());
  const [selectedCourier, setSelectedCourier] = useState<PudCourier>(couriers[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCouriers = couriers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.assignedHubName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6" id="pud-live-couriers-tab">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Radio className="w-5 h-5 text-indigo-600 animate-pulse" />
            Live Tracking GPS Kurir & Armada PUD
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pelacakan posisi real-time GPS kurir motor, blind van, sisa baterai smartphone, dan status rute pengantaran.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            {couriers.filter(c => c.status !== 'OFFLINE').length} Kurir Terkoneksi Live
          </span>
        </div>
      </div>

      {/* Main Map & List View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Interactive Simulated Live Map View */}
        <div className="lg:col-span-2 bg-slate-950 rounded-2xl p-4 shadow-xl border border-slate-800 text-white flex flex-col justify-between min-h-[480px] relative overflow-hidden">
          {/* Simulated Map Background Grid */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>

          {/* Map Top Bar */}
          <div className="relative z-10 flex items-center justify-between bg-slate-900/90 backdrop-blur p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-xs">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-white">Area Radar: Jabodetabek Core (Jakarta - Tangerang - Bekasi)</span>
            </div>
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">
              Refresh Interval: 5s
            </span>
          </div>

          {/* Simulated Couriers Markers on Map */}
          <div className="relative z-10 my-auto py-12 flex flex-wrap items-center justify-center gap-8">
            {couriers.map((c) => {
              const isSelected = selectedCourier.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCourier(c)}
                  className={`cursor-pointer p-3 rounded-2xl transition-all duration-300 transform ${
                    isSelected
                      ? 'bg-indigo-600 scale-110 shadow-2xl shadow-indigo-500/50 border-2 border-amber-400'
                      : 'bg-slate-900/90 hover:bg-slate-800 border border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-amber-400">
                      {c.vehicleType === 'MOTORCYCLE' || c.vehicleType === 'ELECTRIC_BIKE' ? (
                        <Bike className="w-4 h-4" />
                      ) : (
                        <Truck className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-xs block text-white">{c.name}</span>
                      <span className="text-[10px] text-slate-300 font-mono">{c.vehiclePlate}</span>
                    </div>
                  </div>
                  <div className="mt-1.5 pt-1.5 border-t border-white/10 flex items-center justify-between text-[9px] text-slate-300">
                    <span>{c.status.replace(/_/g, ' ')}</span>
                    <span className="font-bold text-amber-300">{c.todayCompletedDeliveries} drop</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Bottom Status Bar */}
          <div className="relative z-10 bg-slate-900/90 backdrop-blur p-3 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-indigo-400" />
              <span>Target Terpilih: <strong>{selectedCourier.name}</strong> ({selectedCourier.vehiclePlate})</span>
            </div>
            <span className="text-slate-400 text-[11px]">
              Posisi Terakhir: {selectedCourier.currentLocation.addressDescription || 'Dalam Rute Perjalanan'}
            </span>
          </div>
        </div>

        {/* Right: Courier Detail Card & List */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Daftar Kurir On-Duty</h3>
                <p className="text-xs text-slate-500">Pilih kurir untuk fokus GPS radar</p>
              </div>
              <div className="relative w-36">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-7 pr-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto">
              {filteredCouriers.map((c) => {
                const isSelected = selectedCourier.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCourier(c)}
                    className={`p-3 rounded-xl border cursor-pointer transition ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/60 shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{c.name}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                        c.status === 'ONLINE_AVAILABLE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {c.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{c.vehiclePlate} • {c.assignedHubName}</p>
                    <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-600">
                      <span>Rating: ⭐ {c.rating}</span>
                      <span>Baterai: {c.batteryLevelPct}%</span>
                      <span>Selesai: {c.todayCompletedDeliveries} drop</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
