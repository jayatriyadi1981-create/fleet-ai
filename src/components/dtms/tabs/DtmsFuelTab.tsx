import React from 'react';
import {
  Fuel,
  Droplet,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Truck,
  Gauge,
  FileSpreadsheet
} from 'lucide-react';
import { dtmsService } from '../../../modules/dtms/services/dtmsService';

export const DtmsFuelTab: React.FC = () => {
  const trucks = dtmsService.getTrucks();
  const kpis = dtmsService.getKpis();

  return (
    <div id="dtms-fuel-tab" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 flex items-center space-x-2">
            <Fuel className="w-5 h-5 text-amber-500" />
            <span>Konsumsi Solar Biosolar B35 & Efisiensi Fuel Burn Dump Truck</span>
          </h2>
          <p className="text-xs text-slate-400">Monitoring rasio liter/ton, liter/km hauling muat vs kosong, dan pengisian Fuel Bowser</p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Total Konsumsi Shift Ini:</span>
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">{kpis.totalFuelBurnedLiters.toLocaleString()} Liter</span>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Rasio Bahan Bakar / Tonase</span>
            <Droplet className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-2">{kpis.fuelConsumptionLiterPerTon} <span className="text-xs font-normal text-slate-400">Ltr / Ton</span></div>
          <div className="text-xs text-emerald-400 mt-1">Efisiensi optimal (Benchmark &lt; 0.45 L/T)</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Fuel Bowser Mobile In-Pit</span>
            <Truck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-2">FB-01 & FB-02</div>
          <div className="text-xs text-slate-400 mt-1">Sisa Stok Bowser: 14.200 Liter (Pit Central & Seam 40)</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Deteksi Anomali Fuel Drain</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">0 Kasus</div>
          <div className="text-xs text-slate-400 mt-1">Sensor ultrasonik tangki 100% sinkron</div>
        </div>
      </div>

      {/* Fuel Level & Burn Rate Table */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-200">Level Tangki & Konsumsi Real-Time Unit Dump Truck</span>
          <button className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs border border-slate-700 flex items-center space-x-1">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Fuel Report</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
                <th className="py-3 px-3">No. Lambung</th>
                <th className="py-3 px-3">Tipe / Model</th>
                <th className="py-3 px-3">Level Tangki Solar (%)</th>
                <th className="py-3 px-3">Burn Rate (Ltr/KM)</th>
                <th className="py-3 px-3">Total Ritase Selesai</th>
                <th className="py-3 px-3">Estimasi Liter Terpakai</th>
                <th className="py-3 px-3">Status Pengisian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {trucks.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-amber-400">{t.hullNumber}</td>
                  <td className="py-3 px-3 font-semibold text-slate-100">{t.model}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${t.fuelLevelPct < 30 ? 'bg-rose-500' : t.fuelLevelPct < 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${t.fuelLevelPct}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-slate-200">{t.fuelLevelPct}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-cyan-400 font-bold">
                    {t.fuelBurnRateLtrPerKm} L/km
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-300">
                    {t.todayRits} Rits
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-200">
                    {(t.todayRits * 12.5).toFixed(1)} Liter
                  </td>
                  <td className="py-3 px-3">
                    {t.fuelLevelPct < 30 ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">Refuel Req Segera</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Aman</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
