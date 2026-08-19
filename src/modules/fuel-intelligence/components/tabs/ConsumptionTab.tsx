/**
 * Fleet Intelligence Smart AI - Fuel Consumption Tab
 * Implements L/100km, km/L, L/hour metrics, trip-by-trip analytics, engine hour analysis,
 * unit switching, and formula validation transparent to operators.
 */

import React, { useState } from 'react';
import { VehicleFuelBaseline, FuelFilterState } from '../../types';
import { Fuel, Clock, Gauge, ArrowUpDown, Calculator, CheckCircle2, Search, Filter } from 'lucide-react';

interface ConsumptionTabProps {
  baselines: VehicleFuelBaseline[];
  onExplainWithAI: (topic: string, subject: string) => void;
}

export const ConsumptionTab: React.FC<ConsumptionTabProps> = ({
  baselines,
  onExplainWithAI,
}) => {
  const [unitMode, setUnitMode] = useState<'L_100KM' | 'KM_L'>('L_100KM');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = baselines.filter(
    (b) =>
      b.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.vehicleType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* 1. Header with Unit Switcher & Formula Explanation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Fuel className="h-4 w-4 text-cyan-400" />
            Matriks & Formula Konsumsi Bahan Bakar
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Standar pengukuran multi-dimensi berdasarkan jarak tempuh (km), durasi jam mesin (Engine Hours), dan volume solar (Liter).
          </p>
        </div>

        {/* Unit Switcher */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setUnitMode('L_100KM')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
              unitMode === 'L_100KM'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Liters / 100km (EU/Fleet)
          </button>
          <button
            onClick={() => setUnitMode('KM_L')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
              unitMode === 'KM_L'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Kilometer / Liter (km/L)
          </button>
        </div>
      </div>

      {/* 2. Formula Demonstration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
          <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase">Formula 1: Konsumsi Jarak</span>
          <div className="font-mono text-xs text-slate-200 bg-slate-900 p-2 rounded-lg border border-slate-800">
            L/100km = (Fuel Consumed [L] / Distance [km]) × 100
          </div>
          <p className="text-[11px] text-slate-400">Standar perbandingan efisiensi internasional logistik.</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
          <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase">Formula 2: Rasio Jarak Tempuh</span>
          <div className="font-mono text-xs text-slate-200 bg-slate-900 p-2 rounded-lg border border-slate-800">
            km/L = Total Distance [km] / Fuel Consumed [L]
          </div>
          <p className="text-[11px] text-slate-400">Metrik familiar bagi pengemudi dan manajemen operasional Indonesia.</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
          <span className="text-[11px] font-mono font-bold text-amber-400 uppercase">Formula 3: Laju Jam Mesin (Hourly)</span>
          <div className="font-mono text-xs text-slate-200 bg-slate-900 p-2 rounded-lg border border-slate-800">
            L/Hour = Fuel Consumed [L] / Engine Hours [h]
          </div>
          <p className="text-[11px] text-slate-400">Evaluasi pemborosan idle dan generator PTO genset pendingin.</p>
        </div>
      </div>

      {/* 3. Detailed Consumption Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h4 className="text-sm font-bold text-white">Baseline Konsumsi Per Kendaraan</h4>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nopol atau tipe..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950 text-slate-400 font-mono">
              <tr>
                <th className="py-3 px-4">KENDARAAN</th>
                <th className="py-3 px-3">TIPE & KELAS</th>
                <th className="py-3 px-3 text-right">KONSUMSI AKTUAL</th>
                <th className="py-3 px-3 text-right">BASELINE NORMAL</th>
                <th className="py-3 px-3 text-right">RENTANG WAJAR</th>
                <th className="py-3 px-3 text-right">DEVIASI (%)</th>
                <th className="py-3 px-3 text-center">TOTAL DISTANSI</th>
                <th className="py-3 px-4 text-center">AKSI AI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filtered.map((v) => {
                const isBad = v.deviationPercentage > 15;
                const isGood = v.deviationPercentage <= 0;

                const displayActual =
                  unitMode === 'L_100KM'
                    ? `${v.currentConsumptionL100Km} L/100km`
                    : `${(100 / v.currentConsumptionL100Km).toFixed(1)} km/L`;

                const displayBaseline =
                  unitMode === 'L_100KM'
                    ? `${v.normalConsumptionL100Km} L/100km`
                    : `${(100 / v.normalConsumptionL100Km).toFixed(1)} km/L`;

                const displayRange =
                  unitMode === 'L_100KM'
                    ? `${v.normalRangeMinL100Km} - ${v.normalRangeMaxL100Km} L`
                    : `${(100 / v.normalRangeMaxL100Km).toFixed(1)} - ${(100 / v.normalRangeMinL100Km).toFixed(1)} km/L`;

                return (
                  <tr key={v.vehicleId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-white block">{v.plateNumber}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{v.fuelType}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-slate-200 block">{v.vehicleType}</span>
                      <span className="text-[10px] font-mono text-slate-500">{v.vehicleClass}</span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-white">
                      {displayActual}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-400">
                      {displayBaseline}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-400">
                      {displayRange}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] ${
                          isBad
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : isGood
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {v.deviationPercentage > 0 ? '+' : ''}
                        {v.deviationPercentage}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-slate-300">
                      {v.totalDistanceKm.toLocaleString()} km
                      <span className="block text-[10px] text-slate-500">({v.totalTrips} trip)</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onExplainWithAI('CONSUMPTION', `Analisis Konsumsi ${v.plateNumber}`)}
                        className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 text-[11px] font-semibold transition-colors"
                      >
                        AI Rationale
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
