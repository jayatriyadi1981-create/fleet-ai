import React, { useState } from 'react';
import { BusTerminal, BusDepot } from '../../../modules/bus/types';
import { busService } from '../../../modules/bus/services/busService';
import { 
  Building2, 
  Warehouse, 
  MapPin, 
  Bus, 
  Fuel, 
  Wrench, 
  Layers, 
  Sparkles, 
  Phone,
  Search,
  CheckCircle2
} from 'lucide-react';

export const BusTerminalsDepotsTab: React.FC = () => {
  const [terminals] = useState<BusTerminal[]>(busService.getTerminals());
  const [depots] = useState<BusDepot[]>(busService.getDepots());
  const [activeSubTab, setActiveSubTab] = useState<'TERMINALS' | 'DEPOTS'>('TERMINALS');
  const [search, setSearch] = useState('');

  const filteredTerminals = terminals.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.city.toLowerCase().includes(search.toLowerCase())
  );

  const filteredDepots = depots.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.city.toLowerCase().includes(search.toLowerCase()) ||
    d.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            Manajemen Terminal Bus & Garasi Pool (Depots & Stations)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manajemen gate peron terminal tipe A/B, fasilitas pool garasi, dispenser solar PO, dan bay mekanik
          </p>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('TERMINALS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'TERMINALS'
                ? 'bg-emerald-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Terminal Penumpang ({terminals.length})
          </button>
          <button
            onClick={() => setActiveSubTab('DEPOTS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'DEPOTS'
                ? 'bg-emerald-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Warehouse className="w-3.5 h-3.5" />
            Garasi & Pool Armada ({depots.length})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          placeholder={activeSubTab === 'TERMINALS' ? "Cari nama terminal, kota..." : "Cari nama pool garasi, kota, kode..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Subtab 1: Terminals Grid */}
      {activeSubTab === 'TERMINALS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTerminals.map((term) => (
            <div
              key={term.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-all shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950 text-emerald-400 border border-emerald-500/40">
                      {term.terminalType.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {term.activeRoutesCount} Trayek Aktif
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-white mt-1">{term.name}</h3>
                  <div className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    {term.city} • {term.address}
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Kapasitas Peron Bus:</span>
                  <span className="font-bold text-white">{term.capacityBuses} Unit Bus</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Jumlah Peron Terdaftar:</span>
                  <span className="font-bold text-cyan-400">{term.platforms.length} Jalur</span>
                </div>
              </div>

              {/* Operating Platforms */}
              <div className="space-y-1.5 text-xs">
                <span className="text-slate-500 font-bold block text-[11px]">Jalur Peron Keberangkatan:</span>
                <div className="space-y-1">
                  {term.platforms.slice(0, 2).map((p, idx) => (
                    <div key={idx} className="p-2 bg-slate-950 rounded-lg border border-slate-800/80 flex justify-between items-center text-[11px]">
                      <span className="font-bold text-cyan-300 font-mono">Peron {p.platformNumber}</span>
                      <span className="text-slate-400 truncate max-w-[160px]">{p.routeDestinations.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                <span className="flex items-center gap-1 text-slate-500">
                  Operasional: {term.operatingHours}
                </span>
                <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Dishub Terkoneksi
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subtab 2: Depots Grid */}
      {activeSubTab === 'DEPOTS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredDepots.map((depot) => (
            <div
              key={depot.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-all shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
                      {depot.code}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-white mt-1">{depot.name}</h3>
                  <div className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    {depot.address}, {depot.city}
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Kapasitas: {depot.totalParkingCapacity} Bus
                </span>
              </div>

              {/* Facility Badges */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                  <span className="text-slate-500 text-[11px] block">Bus Terparkir</span>
                  <span className="font-mono font-bold text-white text-sm mt-0.5">{depot.busesParkedCount} Unit</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                  <span className="text-slate-500 text-[11px] block">Bay Bengkel</span>
                  <span className="font-mono font-bold text-amber-400 text-sm mt-0.5">{depot.maintenanceBaysCount} Bay</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                  <span className="text-slate-500 text-[11px] block">Tangki Solar PO</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm mt-0.5">{depot.fuelStockLiters.toLocaleString()} L</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                <span>Kepala Pool: <strong className="text-white">{depot.managerName}</strong></span>
                <span className="font-mono flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-500" />
                  {depot.contactPhone}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
