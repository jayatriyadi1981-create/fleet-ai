import React, { useState } from 'react';
import { VehicleProfitabilityData } from '../../modules/rent-car/types';
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  BarChart3, 
  Car, 
  Fuel, 
  Wrench, 
  ShieldCheck, 
  ArrowUpRight, 
  Award,
  Filter
} from 'lucide-react';

interface RentalAnalyticsProfitabilityTabProps {
  profitabilityData: VehicleProfitabilityData[];
}

export const RentalAnalyticsProfitabilityTab: React.FC<RentalAnalyticsProfitabilityTabProps> = ({ profitabilityData }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filtered = profitabilityData.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  const totalGrossRevenue = filtered.reduce((sum, p) => sum + p.grossRevenueIdr, 0);
  const totalNetProfit = filtered.reduce((sum, p) => sum + p.netProfitIdr, 0);
  const totalFuelCost = filtered.reduce((sum, p) => sum + p.fuelCostIdr, 0);
  const totalMaintCost = filtered.reduce((sum, p) => sum + p.maintenanceCostIdr, 0);
  const avgMargin = totalGrossRevenue > 0 ? Math.round((totalNetProfit / totalGrossRevenue) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1 shadow-lg">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Gross Revenue
          </span>
          <p className="text-xl font-bold font-mono text-cyan-400">
            Rp {totalGrossRevenue.toLocaleString('id-ID')}
          </p>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +18.4% vs bulan lalu
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1 shadow-lg">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Net Profit Bersih (EBIT)
          </span>
          <p className="text-xl font-bold font-mono text-emerald-400">
            Rp {totalNetProfit.toLocaleString('id-ID')}
          </p>
          <span className="text-[10px] text-slate-400">
            Rata-rata Margin Bersih: <strong className="text-white">{avgMargin}%</strong>
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1 shadow-lg">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Biaya BBM (Fuel OpEx)
          </span>
          <p className="text-xl font-bold font-mono text-amber-400">
            Rp {totalFuelCost.toLocaleString('id-ID')}
          </p>
          <span className="text-[10px] text-slate-400">
            12% dari total omset kotor
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1 shadow-lg">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Biaya Servis & Pemeliharaan
          </span>
          <p className="text-xl font-bold font-mono text-rose-400">
            Rp {totalMaintCost.toLocaleString('id-ID')}
          </p>
          <span className="text-[10px] text-slate-400">
            Preventive & Corrective Maintenance
          </span>
        </div>
      </div>

      {/* Control filter */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Matriks Profitabilitas Unit Armada (P&L Per Vehicle)
          </h2>
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
        >
          <option value="all">Semua Kategori Armada</option>
          <option value="mpv">MPV Family</option>
          <option value="luxury">Luxury Executive</option>
          <option value="ev">Electric Vehicle (EV)</option>
          <option value="suv">SUV Tough</option>
        </select>
      </div>

      {/* Vehicle Profitability Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono text-[10px] border-b border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Unit Armada</th>
                <th className="p-3.5 text-center">Utilisasi</th>
                <th className="p-3.5 text-right">Pendapatan Kotor</th>
                <th className="p-3.5 text-right">Biaya BBM</th>
                <th className="p-3.5 text-right">Biaya Servis</th>
                <th className="p-3.5 text-right">Depresiasi & Asuransi</th>
                <th className="p-3.5 text-right font-bold text-emerald-400">Net Profit (Laba)</th>
                <th className="p-3.5 text-center">Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/30">
              {filtered.map((item) => (
                <tr key={item.vehicleId} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3.5">
                    <div>
                      <span className="font-bold text-white block">{item.model}</span>
                      <span className="font-mono text-cyan-400 font-semibold text-[11px]">{item.plateNumber}</span>
                    </div>
                  </td>
                  <td className="p-3.5 text-center">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-bold font-mono text-cyan-300">
                      {item.utilizationRate}%
                    </div>
                  </td>
                  <td className="p-3.5 text-right font-mono font-semibold text-white">
                    Rp {item.grossRevenueIdr.toLocaleString('id-ID')}
                  </td>
                  <td className="p-3.5 text-right font-mono text-amber-400">
                    -Rp {item.fuelCostIdr.toLocaleString('id-ID')}
                  </td>
                  <td className="p-3.5 text-right font-mono text-rose-400">
                    -Rp {item.maintenanceCostIdr.toLocaleString('id-ID')}
                  </td>
                  <td className="p-3.5 text-right font-mono text-slate-400">
                    -Rp {(item.depreciationCostIdr + item.insuranceCostIdr).toLocaleString('id-ID')}
                  </td>
                  <td className="p-3.5 text-right font-mono font-bold text-emerald-400">
                    Rp {item.netProfitIdr.toLocaleString('id-ID')}
                  </td>
                  <td className="p-3.5 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {item.profitMarginPercent}%
                    </span>
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
