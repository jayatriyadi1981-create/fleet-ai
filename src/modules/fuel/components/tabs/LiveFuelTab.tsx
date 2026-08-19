/**
 * Fleet Intelligence Smart AI - Live Fuel Tab
 * PROMPT 24 - Live Telematics Table & Interactive Map View with Fuel Level Gauges
 */

import React, { useState } from 'react';
import { Fuel, MapPin, Activity, ShieldCheck, AlertCircle, RefreshCw, Search } from 'lucide-react';
import { FuelReading } from '../../types';
import { FuelGauge } from '../widgets/FuelGauge';

interface LiveFuelTabProps {
  readings: FuelReading[];
  onOpenVehicleModal: (vehicleId: string) => void;
}

export const LiveFuelTab: React.FC<LiveFuelTabProps> = ({ readings, onOpenVehicleModal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'TABLE' | 'MAP'>('TABLE');

  const filtered = readings.filter(
    (r) =>
      r.vehiclePlate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari kendaraan atau sumber sensor..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('TABLE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'TABLE' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Tabel Telematika
          </button>
          <button
            onClick={() => setViewMode('MAP')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'MAP' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Peta Lokasi & Tangki
          </button>
        </div>
      </div>

      {viewMode === 'TABLE' ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Kendaraan</th>
                  <th className="p-4">Level Tangki BBM</th>
                  <th className="p-4">Volume (L)</th>
                  <th className="p-4">Sumber Sensor</th>
                  <th className="p-4">Confidence</th>
                  <th className="p-4">Odometer</th>
                  <th className="p-4">Update Terakhir</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((r) => {
                  const isStale = new Date().getTime() - new Date(r.timestamp).getTime() > 30 * 60 * 1000;
                  return (
                    <tr key={r.id} className="hover:bg-slate-800/40 transition-all">
                      <td className="p-4 font-bold text-white flex items-center gap-2">
                        <Fuel className="h-4 w-4 text-cyan-400" />
                        {r.vehiclePlate}
                      </td>
                      <td className="p-4 w-48">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-semibold">
                            <span className={r.fuelPercentage < 20 ? 'text-rose-400' : 'text-emerald-400'}>
                              {r.fuelPercentage}%
                            </span>
                            <span className="text-slate-400">{r.fuelLevel} L</span>
                          </div>
                          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${r.fuelPercentage}%` }}
                              className={`h-full ${
                                r.fuelPercentage < 20 ? 'bg-rose-500' : 'bg-emerald-500'
                              }`}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-white">{r.fuelLevel} Liter</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 text-[10px] font-medium">
                          {r.source}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            r.confidence === 'HIGH'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          {r.confidence}
                        </span>
                      </td>
                      <td className="p-4 font-medium">{r.odometer.toLocaleString('id-ID')} KM</td>
                      <td className="p-4">
                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                          {isStale && <AlertCircle className="h-3.5 w-3.5 text-amber-400" />}
                          {new Date(r.timestamp).toLocaleTimeString('id-ID')}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => onOpenVehicleModal(r.vehicleId)}
                          className="px-3 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 font-bold text-[11px]"
                        >
                          Detail Tangki
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Live Map View Simulation */
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="h-4 w-4 text-rose-400" /> Peta Posisi Armada & Level BBM Real-Time
            </h3>
            <span className="text-xs text-slate-400">Pembaruan Otomatis Tiap 30 Detik</span>
          </div>

          <div className="h-96 w-full rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

            {/* Simulated Vehicle Pin Popups */}
            <div className="absolute top-12 left-20 z-10">
              <FuelGauge percentage={72} liters={216} vehiclePlate="B 9876 XYZ" size="sm" />
            </div>

            <div className="absolute bottom-16 right-32 z-10">
              <FuelGauge percentage={18} liters={45} vehiclePlate="B 1234 ABC" size="sm" />
            </div>

            <p className="text-xs font-semibold text-slate-500 z-0">
              [ Simulasi Peta Telematika BBM Fleet - Cikarang / Tol Cipali / Batang ]
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
