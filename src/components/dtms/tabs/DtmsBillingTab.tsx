import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Receipt,
  FileSpreadsheet,
  Calculator,
  Percent,
  Truck,
  CheckCircle2
} from 'lucide-react';
import { dtmsService } from '../../../modules/dtms/services/dtmsService';

export const DtmsBillingTab: React.FC = () => {
  const kpis = dtmsService.getKpis();

  // Rate Matrix State
  const [ratePerTonKm, setRatePerTonKm] = useState(3800); // Rp 3.800 / Ton / KM
  const [flatRatePerTon, setFlatRatePerTon] = useState(28500); // Rp 28.500 / Ton flat haul
  const [simulatedTon, setSimulatedTon] = useState(1000);
  const [simulatedKm, setSimulatedKm] = useState(5.5);

  const calculatedRevenue = simulatedTon * ratePerTonKm * (simulatedKm / 1.0);

  return (
    <div id="dtms-billing-tab" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span>Tarif Hauling, Pendapatan Ritase & Kalkulator P&L Dump Truck</span>
          </h2>
          <p className="text-xs text-slate-400">Kalkulasi pendapatan per ritase/tonase (Rp/Ton/KM), potongan solar/denda & faktur kontraktor</p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Total Pendapatan Hari Ini:</span>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">Rp {kpis.totalGrossRevenueRp.toLocaleString()}</span>
        </div>
      </div>

      {/* Financial Simulator & Tariff Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
            <Calculator className="w-4 h-4 text-amber-500" />
            <span>Simulator Tarif Hauling Kontrak (Rp/Ton/KM)</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Tarif Hauling Kontrak (Rp / Ton / KM)</label>
              <input
                type="number"
                value={ratePerTonKm}
                onChange={(e) => setRatePerTonKm(Number(e.target.value))}
                className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200 font-mono font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Simulasi Tonase (Ton)</label>
                <input
                  type="number"
                  value={simulatedTon}
                  onChange={(e) => setSimulatedTon(Number(e.target.value))}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Jarak Angkut (KM)</label>
                <input
                  type="number"
                  step="0.1"
                  value={simulatedKm}
                  onChange={(e) => setSimulatedKm(Number(e.target.value))}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200 font-mono"
                />
              </div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-lg border border-emerald-500/30 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Total Nilai Tagihan Bruto</span>
                <span className="text-lg font-extrabold text-emerald-400 font-mono">Rp {calculatedRevenue.toLocaleString()}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Formula: {simulatedTon.toLocaleString()} Ton × {simulatedKm} KM × Rp {ratePerTonKm.toLocaleString()} /Ton/KM
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
            <Receipt className="w-4 h-4 text-cyan-400" />
            <span>Rekapitulasi P&L Unit Dump Truck (Profit Margin)</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Pendapatan Hauling Kotor (Gross Revenue)</span>
              <span className="font-bold text-slate-200 font-mono">Rp {kpis.totalGrossRevenueRp.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Biaya Solar B35 (Fuel Expenses)</span>
              <span className="font-bold text-rose-400 font-mono">- Rp {(kpis.totalFuelBurnedLiters * 6800).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Insentif & Gaji Operator DT</span>
              <span className="font-bold text-rose-400 font-mono">- Rp {(kpis.totalRitsToday * 15000).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Alokasi Depresiasi Ban & Maintenance</span>
              <span className="font-bold text-rose-400 font-mono">- Rp {(kpis.totalTonnageToday * 2100).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 bg-emerald-500/10 px-3 rounded-lg border border-emerald-500/20">
              <span className="font-bold text-emerald-400">Estimasi Laba Bersih (Net Margin)</span>
              <span className="font-extrabold text-emerald-400 font-mono">
                Rp {(kpis.totalGrossRevenueRp - (kpis.totalFuelBurnedLiters * 6800) - (kpis.totalRitsToday * 15000) - (kpis.totalTonnageToday * 2100)).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
