/**
 * Fleet Intelligence Smart AI - Fuel Event Map Tab
 * Interactive GIS representation of Fuel Theft, Drain, Anomaly, and Refueling locations.
 */

import React, { useState } from 'react';
import { FuelEventMapMarker } from '../../types';
import { MapPin, Fuel, ShieldAlert, Droplet, CheckCircle2, AlertOctagon, Sparkles, Navigation, Layers, Info } from 'lucide-react';

interface FuelMapTabProps {
  markers: FuelEventMapMarker[];
  onExplainWithAI: (topic: string, subject: string) => void;
}

export const FuelMapTab: React.FC<FuelMapTabProps> = ({
  markers,
  onExplainWithAI,
}) => {
  const [selectedMarker, setSelectedMarker] = useState<FuelEventMapMarker | null>(markers[0] || null);
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('ALL');

  const filteredMarkers = markers.filter((m) => {
    if (eventTypeFilter !== 'ALL' && m.eventType !== eventTypeFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <MapPin className="h-4 w-4 text-cyan-400" />
            Peta Geospasial Kejadian & Anomali BBM (Fuel Event GIS Map)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Visualisasi titik lokasi pengisian SPBU, kejadian drain/kebocoran, dan indikator penurunan bahan bakar.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
          {[
            { id: 'ALL', label: 'Semua Titik' },
            { id: 'THEFT_INDICATOR', label: 'Indikator Theft' },
            { id: 'FUEL_DRAIN', label: 'Fuel Drain' },
            { id: 'REFUELING', label: 'Pengisian SPBU' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setEventTypeFilter(type.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
                eventTypeFilter === type.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Interactive Map Container & Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Map Canvas / Stage */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-950 border border-slate-800 p-6 min-h-[460px] relative overflow-hidden flex flex-col justify-between shadow-2xl">
          {/* Map Background Grid & Radar FX */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-cyan-500/10 pointer-events-none" />

          {/* Map Top Bar */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-cyan-400">
              <Layers className="h-3.5 w-3.5" />
              <span>Layer: Satelit IoT & Geofence Wilayah Jawa Barat</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
              {filteredMarkers.length} Titik Kejadian Aktif
            </span>
          </div>

          {/* Interactive Marker Nodes */}
          <div className="relative z-10 my-auto grid grid-cols-2 sm:grid-cols-3 gap-4 py-8">
            {filteredMarkers.map((marker) => {
              const isSelected = selectedMarker?.id === marker.id;
              const isTheft = marker.eventType === 'THEFT_INDICATOR';
              const isDrain = marker.eventType === 'FUEL_DRAIN';
              const isRefuel = marker.eventType === 'REFUELING';

              return (
                <button
                  key={marker.id}
                  onClick={() => setSelectedMarker(marker)}
                  className={`p-3.5 rounded-2xl border transition-all text-left space-y-2 backdrop-blur-md ${
                    isSelected
                      ? 'bg-cyan-950/80 border-cyan-400 ring-2 ring-cyan-500/50 shadow-lg shadow-cyan-950'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`p-2 rounded-xl border ${
                        isTheft
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                          : isDrain
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {isTheft && <ShieldAlert className="h-4 w-4" />}
                      {isDrain && <Droplet className="h-4 w-4" />}
                      {isRefuel && <Fuel className="h-4 w-4" />}
                    </div>
                    <span className="text-[10px] font-mono font-bold text-white">
                      {marker.plateNumber}
                    </span>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-slate-200 line-clamp-1">{marker.title}</h5>
                    <span className="text-[10px] text-slate-400 block line-clamp-1">{marker.locationName}</span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono pt-1 border-t border-slate-800">
                    <span className={marker.fuelChangeLiters > 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {marker.fuelChangeLiters > 0 ? '+' : ''}{marker.fuelChangeLiters} L
                    </span>
                    <span className="text-slate-500">
                      {new Date(marker.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Map Footer status */}
          <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Koordinat Telemetri GPS Sinkron Real-time</span>
            <span>Radius Toleransi Geofence: 150m</span>
          </div>
        </div>

        {/* Selected Marker Detail Card */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-lg space-y-5 flex flex-col justify-between">
          {selectedMarker ? (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    Detail Lokasi Terpilih
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                    {selectedMarker.eventType}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white leading-snug">{selectedMarker.title}</h4>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <MapPin className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                    <span>{selectedMarker.locationName}</span>
                  </div>
                </div>

                {/* Telemetry Stats Grid */}
                <div className="grid grid-cols-2 gap-2 p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Nopol Armada</span>
                    <span className="font-bold text-white">{selectedMarker.plateNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Pengemudi</span>
                    <span className="font-bold text-slate-300">{selectedMarker.driverName || '-'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Status Mesin</span>
                    <span className={selectedMarker.ignitionStatus ? 'text-amber-400' : 'text-slate-400'}>
                      {selectedMarker.ignitionStatus ? 'Ignition ON' : 'Ignition OFF'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Perubahan Volume</span>
                    <span className={selectedMarker.fuelChangeLiters > 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {selectedMarker.fuelChangeLiters > 0 ? '+' : ''}{selectedMarker.fuelChangeLiters} Liter
                    </span>
                  </div>
                </div>

                {/* Summary Box */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1 text-xs">
                  <span className="font-mono font-bold text-[11px] text-slate-400 block uppercase">
                    Rangkuman Bukti:
                  </span>
                  <p className="text-slate-300 leading-snug">{selectedMarker.evidenceSummary}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <button
                  onClick={() => onExplainWithAI('THEFT', `Analisis Spasial ${selectedMarker.title}`)}
                  className="w-full py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-cyan-950"
                >
                  <Sparkles className="h-4 w-4" /> Explain Geo Incident With AI
                </button>
              </div>
            </>
          ) : (
            <div className="my-auto text-center text-slate-500 text-xs py-12">
              Pilih salah satu titik kejadian pada peta untuk melihat detail telemetri lengkap.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
