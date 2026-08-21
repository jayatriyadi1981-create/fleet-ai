import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Layers,
  Fuel,
  Wrench,
  Percent,
  CheckCircle2,
  BarChart3,
  Calendar
} from 'lucide-react';
import { miningService } from '../../../modules/mining/services/miningService';
import { MiningCostPnl } from '../../../modules/mining/types';

export const MiningProductivityPnlTab: React.FC = () => {
  const [pnlRecords, setPnlRecords] = useState<MiningCostPnl[]>(miningService.getCostPnlRecords());

  const totalRevenue = pnlRecords.reduce((acc, r) => acc + r.revenueIdr, 0);
  const totalCost = pnlRecords.reduce((acc, r) => acc + r.totalCostIdr, 0);
  const totalNetMargin = totalRevenue - totalCost;
  const avgMarginPct = ((totalNetMargin / totalRevenue) * 100).toFixed(1);

  return (
    <div className="space-y-6" id="mining-productivity-pnl-container">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl font-bold text-slate-900">Produktivitas, Biaya & P&L Unit Tambang (Cost per Ton & BCM)</h1>
          </div>
          <p className="text-xs text-slate-500">
            Analisis unit profit & loss per Code Number alat berat: Pendapatan ritase vs Biaya Solar B35, Servis Mekanik, Ban OTR, Upah Operator, & Depresiasi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 font-extrabold text-xs">
            Periode: Agustus 2026
          </span>
        </div>
      </div>

      {/* Top Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1">Total Pendapatan Unit</div>
          <div className="text-2xl font-black text-slate-900">Rp {(totalRevenue / 1000000000).toFixed(2)} Miliar</div>
          <div className="text-xs text-emerald-600 font-medium mt-1">Hasil Produksi Coal & OB</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1">Total Biaya Operasional</div>
          <div className="text-2xl font-black text-slate-900">Rp {(totalCost / 1000000000).toFixed(2)} Miliar</div>
          <div className="text-xs text-slate-500 mt-1">Solar + Parts + Ban + Gaji</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1">Laba Bersih Unit (Net Margin)</div>
          <div className="text-2xl font-black text-emerald-600">Rp {(totalNetMargin / 1000000000).toFixed(2)} Miliar</div>
          <div className="text-xs text-emerald-600 font-bold mt-1">Margin Sehat {avgMarginPct}%</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1">Rata-rata Biaya per Tonase</div>
          <div className="text-2xl font-black text-slate-900">Rp 2,902 <span className="text-xs font-medium text-slate-500">/ Ton</span></div>
          <div className="text-xs text-emerald-600 font-medium mt-1">Target Kontrak &lt; Rp 3.500/Ton</div>
        </div>
      </div>

      {/* Unit P&L Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Laporan Laba Rugi per Unit Alat Berat (P&L by Code Number)</h2>
          <span className="text-xs text-slate-500">Agustus 2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Kode Unit (CN)</th>
                <th className="py-3.5 px-4">Jenis Alat</th>
                <th className="py-3.5 px-4 font-mono">HM Operasi</th>
                <th className="py-3.5 px-4 font-mono">Produksi (Ton / BCM)</th>
                <th className="py-3.5 px-4 text-right">Pendapatan (IDR)</th>
                <th className="py-3.5 px-4 text-right">Total Biaya (IDR)</th>
                <th className="py-3.5 px-4 text-right">Net Margin (IDR)</th>
                <th className="py-3.5 px-4 text-center">Margin %</th>
                <th className="py-3.5 px-4 text-right">Cost/Ton</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {pnlRecords.map(pnl => (
                <tr key={pnl.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{pnl.equipmentCode}</td>
                  <td className="py-3 px-4 text-slate-800">{pnl.equipmentType.replace(/_/g, ' ')}</td>
                  <td className="py-3 px-4 font-mono text-slate-800">{pnl.operatingHoursHM.toLocaleString()} HM</td>
                  <td className="py-3 px-4 font-mono text-slate-700">
                    {pnl.productionTon.toLocaleString()} Ton / {pnl.productionBcm.toLocaleString()} BCM
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">
                    Rp {pnl.revenueIdr.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-600">
                    Rp {pnl.totalCostIdr.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">
                    Rp {pnl.netMarginIdr.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 text-[11px]">
                      {pnl.marginPct}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                    Rp {pnl.costPerTonIdr.toLocaleString()}
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
