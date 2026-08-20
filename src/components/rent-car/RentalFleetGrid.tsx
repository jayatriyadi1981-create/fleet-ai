/**
 * Fleet Intelligence Smart AI - Rental Fleet Grid & Inventory Explorer
 */

import React, { useState } from 'react';
import { RentalVehicle } from '../../modules/rent-car/types';
import { 
  Car, 
  Fuel, 
  Gauge, 
  MapPin, 
  Users, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Sparkles, 
  KeyRound, 
  AlertTriangle,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Layers,
  ArrowRight,
  BatteryCharging
} from 'lucide-react';

interface RentalFleetGridProps {
  vehicles: RentalVehicle[];
  onSelectVehicle: (vehicle: RentalVehicle) => void;
  onBookVehicle: (vehicle: RentalVehicle) => void;
  onOpenImmobilizerModal: (vehicle: RentalVehicle) => void;
}

export const RentalFleetGrid: React.FC<RentalFleetGridProps> = ({
  vehicles,
  onSelectVehicle,
  onBookVehicle,
  onOpenImmobilizerModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const categories = [
    { id: 'all', label: 'Semua Kategori' },
    { id: 'mpv', label: 'MPV Family' },
    { id: 'suv', label: 'SUV & 4x4' },
    { id: 'luxury', label: 'Luxury VIP' },
    { id: 'ev', label: 'Electric EV' },
    { id: 'minibus', label: 'HiAce / Minibus' }
  ];

  const statuses = [
    { id: 'all', label: 'Semua Status' },
    { id: 'available', label: 'Ready di Pool' },
    { id: 'rented', label: 'Sedang Disewa' },
    { id: 'reserved', label: 'Dipesan' },
    { id: 'overdue', label: 'Overdue' },
    { id: 'maintenance', label: 'Servis / Bengkel' },
    { id: 'cleaning', label: 'Pembersihan' }
  ];

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch = 
      v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.branchName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCat = selectedCategory === 'all' || v.category === selectedCategory;
    const matchesStat = selectedStatus === 'all' || v.status === selectedStatus;

    return matchesSearch && matchesCat && matchesStat;
  });

  const getStatusBadge = (status: RentalVehicle['status']) => {
    switch (status) {
      case 'available':
        return <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5"><CheckCircle className="w-3 h-3" /> Ready Sewa</span>;
      case 'rented':
        return <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5"><KeyRound className="w-3 h-3" /> Sedang Disewa</span>;
      case 'reserved':
        return <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center gap-1.5"><Clock className="w-3 h-3" /> Dipesan (Reserved)</span>;
      case 'overdue':
        return <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse flex items-center gap-1.5"><AlertTriangle className="w-3 h-3" /> Overdue Return</span>;
      case 'maintenance':
        return <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">Servis Bengkel</span>;
      case 'cleaning':
        return <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">Cuci / Detailing</span>;
      default:
        return <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-slate-800 text-slate-400">{status}</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex-1 flex flex-col sm:flex-row gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Cari plat nomor, tipe mobil (Innova, Alphard, EV), atau pool cabang..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            {statuses.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* View Switcher & Counter */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <span className="text-xs text-slate-400 font-mono">
            Menampilkan <strong className="text-white">{filteredVehicles.length}</strong> unit
          </span>
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                viewMode === 'grid' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Grid Kartu
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                viewMode === 'table' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tabel Matriks
            </button>
          </div>
        </div>
      </div>

      {/* Grid Mode */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredVehicles.map((vehicle) => {
            const isImmobilized = vehicle.remoteImmobilizerStatus === 'locked';

            return (
              <div
                key={vehicle.id}
                className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between group shadow-lg shadow-black/40"
              >
                {/* Card Header & Brand Image Placeholder */}
                <div>
                  <div className="p-4 border-b border-slate-800/80 bg-gradient-to-r from-slate-900 to-slate-950">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white tracking-wide">
                            {vehicle.brand} {vehicle.model}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 text-[11px] font-mono font-bold rounded bg-slate-800 text-cyan-300 border border-slate-700">
                            {vehicle.plateNumber}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {vehicle.year} • {vehicle.transmission.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div>{getStatusBadge(vehicle.status)}</div>
                    </div>
                  </div>

                  {/* Pricing Matrix Banner */}
                  <div className="px-4 py-3 bg-slate-950/70 border-b border-slate-800/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider block">
                        Lepas Kunci (24 Jam)
                      </span>
                      <span className="text-sm font-bold text-emerald-400">
                        Rp {vehicle.pricing.dailyRate.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[10px] text-slate-400"> /hari</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider block">
                        Dengan Driver
                      </span>
                      <span className="text-xs font-bold text-cyan-400">
                        Rp {vehicle.pricing.withDriverDailyRate.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[10px] text-slate-400"> /hari</span>
                    </div>
                  </div>

                  {/* Telematics & Specs Body */}
                  <div className="p-4 space-y-3 text-xs">
                    {/* Live Telematics & Location */}
                    <div className="space-y-1.5 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="truncate max-w-[190px]">{vehicle.location.address}</span>
                        </span>
                        <span className="font-mono text-cyan-400 font-semibold">{vehicle.location.speed} km/h</span>
                      </div>

                      {/* Gauges: Fuel & Odometer */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1">
                          {vehicle.fuelType === 'electric' ? (
                            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Fuel className="w-3.5 h-3.5 text-amber-400" />
                          )}
                          {vehicle.fuelLevelPercent}% {vehicle.fuelType === 'electric' ? 'Battery' : 'BBM'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Gauge className="w-3.5 h-3.5 text-blue-400" />
                          {vehicle.currentOdometerKm.toLocaleString('id-ID')} km
                        </span>
                      </div>
                    </div>

                    {/* Features Chips */}
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-400" /> {vehicle.seats} Kursi
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                        Deposit Rp {(vehicle.pricing.depositAmount / 1000).toFixed(0)}k
                      </span>
                      {vehicle.features.slice(0, 2).map((f, i) => (
                        <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-slate-800/60 text-slate-400 truncate max-w-[120px]">
                          {f}
                        </span>
                      ))}
                    </div>

                    {/* Assigned Driver / Active Booking Indicator */}
                    {vehicle.status === 'rented' && vehicle.assignedDriverName && (
                      <div className="text-[11px] text-cyan-300 bg-cyan-950/20 border border-cyan-800/40 rounded-lg p-2 flex items-center justify-between">
                        <span>Driver: <strong>{vehicle.assignedDriverName}</strong></span>
                        <span className="text-[10px] text-cyan-400">On Trip</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer & Action Buttons */}
                <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between gap-2">
                  {/* Remote Starter Kill Button */}
                  <button
                    onClick={() => onOpenImmobilizerModal(vehicle)}
                    title={isImmobilized ? 'Starter Terkunci - Klik untuk Membuka' : 'Matikan Mesin Jarak Jauh (Starter Kill)'}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isImmobilized
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                        : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {isImmobilized ? (
                      <>
                        <Lock className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                        <span>Locked</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[11px]">Immobilizer</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSelectVehicle(vehicle)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      Detail
                    </button>

                    {vehicle.status === 'available' ? (
                      <button
                        onClick={() => onBookVehicle(vehicle)}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all flex items-center gap-1"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Sewa</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onSelectVehicle(vehicle)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all flex items-center gap-1"
                      >
                        <span>Monitor</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table Mode */}
      {viewMode === 'table' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Plat & Unit</th>
                  <th className="p-3.5">Kategori</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Tarif 24 Jam</th>
                  <th className="p-3.5">Lokasi Real-Time & GPS</th>
                  <th className="p-3.5">Odometer & BBM</th>
                  <th className="p-3.5">Starter Security</th>
                  <th className="p-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-white">{vehicle.brand} {vehicle.model}</div>
                      <div className="text-[11px] font-mono text-cyan-400">{vehicle.plateNumber} • {vehicle.year}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="capitalize text-slate-300">{vehicle.category}</span>
                      <div className="text-[10px] text-slate-500">{vehicle.transmission.toUpperCase()} • {vehicle.seats} seats</div>
                    </td>
                    <td className="p-3.5">
                      {getStatusBadge(vehicle.status)}
                    </td>
                    <td className="p-3.5 font-mono">
                      <div className="font-bold text-emerald-400">Rp {vehicle.pricing.dailyRate.toLocaleString('id-ID')}</div>
                      <div className="text-[10px] text-slate-400">+Driver: Rp {vehicle.pricing.withDriverDailyRate.toLocaleString('id-ID')}</div>
                    </td>
                    <td className="p-3.5 max-w-[220px]">
                      <div className="truncate text-slate-300">{vehicle.location.address}</div>
                      <div className="text-[10px] text-slate-500">{vehicle.branchName}</div>
                    </td>
                    <td className="p-3.5 font-mono text-[11px]">
                      <div>{vehicle.currentOdometerKm.toLocaleString('id-ID')} km</div>
                      <div className="text-amber-400">{vehicle.fuelLevelPercent}% {vehicle.fuelType}</div>
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => onOpenImmobilizerModal(vehicle)}
                        className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 ${
                          vehicle.remoteImmobilizerStatus === 'locked'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {vehicle.remoteImmobilizerStatus === 'locked' ? <Lock className="w-3 h-3 text-rose-400" /> : <Unlock className="w-3 h-3 text-slate-400" />}
                        <span>{vehicle.remoteImmobilizerStatus === 'locked' ? 'Terkunci' : 'Aktif Ready'}</span>
                      </button>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => onSelectVehicle(vehicle)}
                        className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 hover:bg-slate-700"
                      >
                        Detail
                      </button>
                      {vehicle.status === 'available' && (
                        <button
                          onClick={() => onBookVehicle(vehicle)}
                          className="px-2.5 py-1 rounded bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400"
                        >
                          Sewa
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
