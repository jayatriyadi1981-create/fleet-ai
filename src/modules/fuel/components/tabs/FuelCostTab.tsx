/**
 * Fleet Intelligence Smart AI - Fuel Cost Tab
 * PROMPT 24 - Financial Analysis, Cost/KM, Branch Budget vs Actual Breakdown
 */

import React from 'react';
import { DollarSign, TrendingDown, Building2, PieChart } from 'lucide-react';
import { FuelBudget, FuelOverviewKPIs } from '../../types';

interface FuelCostTabProps {
  kpis: FuelOverviewKPIs;
  budgets: FuelBudget[];
  onOpenPriceModal: () => void;
}

export const FuelCostTab: React.FC<FuelCostTabProps> = ({ kpis, budgets, onOpenPriceModal }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <span className="text-xs font-semibold text-slate-400">Total Biaya Operasional BBM</span>
          <p className="text-2xl font-black text-white mt-1">Rp {kpis.totalFuelCostIdr.toLocaleString('id-ID')}</p>
          <span className="text-[11px] text-emerald-400 font-medium">Berdasarkan Pembelian B35 Bulan Ini</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <span className="text-xs font-semibold text-slate-400">Rata-rata Biaya Per Kilometer (Cost / KM)</span>
          <p className="text-2xl font-black text-cyan-400 mt-1">Rp {kpis.avgCostPerKmIdr} / KM</p>
          <span className="text-[11px] text-slate-400">Baseline Target: Rp 2.000 / KM</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Harga Acuan BBM B35</span>
            <p className="text-xl font-bold text-emerald-400 mt-1">Rp 6.800 / Liter</p>
          </div>
          <button
            onClick={onOpenPriceModal}
            className="w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
          >
            Ubah Harga Acuan BBM
          </button>
        </div>
      </div>

      {/* Budget vs Actual per Branch */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Building2 className="h-4 w-4 text-cyan-400" /> Anggaran BBM Per Cabang (Budget vs Actual Variance)
        </h3>

        <div className="space-y-4">
          {budgets.map((b) => {
            const pct = Math.round((b.actualAmount / b.budgetAmount) * 100);
            return (
              <div key={b.branchId} className="space-y-2 text-xs">
                <div className="flex justify-between font-semibold">
                  <span className="text-white font-bold">{b.branchName}</span>
                  <span className="text-slate-300">
                    Rp {b.actualAmount.toLocaleString('id-ID')} / Rp {b.budgetAmount.toLocaleString('id-ID')} ({pct}%)
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    style={{ width: `${pct}%` }}
                    className={`h-full rounded-full transition-all ${
                      pct > 100 ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
