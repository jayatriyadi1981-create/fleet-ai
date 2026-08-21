import React, { useState } from 'react';
import {
  DollarSign,
  Receipt,
  TrendingDown,
  FileSpreadsheet,
  CheckCircle,
  Percent,
  Calculator
} from 'lucide-react';

interface BillingRecord {
  id: string;
  invoiceNo: string;
  customerName: string;
  productType: string;
  totalVolumeLiters: number;
  distanceKm: number;
  ratePerLiterKmRp: number;
  totalFreightRp: number;
  volumeLossLiters: number;
  lossToleratedPct: number;
  actualLossPct: number;
  penaltyDeductionRp: number;
  netPayoutRp: number;
  status: 'PAID' | 'PENDING_APPROVAL' | 'RECONCILED';
}

const MOCK_BILLINGS: BillingRecord[] = [
  {
    id: 'bill-01',
    invoiceNo: 'INV/TTMS/2026/08/091',
    customerName: 'PT Pertamina Patra Niaga Regional JBB',
    productType: 'BBM Pertalite / Pertamax',
    totalVolumeLiters: 24000,
    distanceKm: 85,
    ratePerLiterKmRp: 8.5,
    totalFreightRp: 17340000,
    volumeLossLiters: 12,
    lossToleratedPct: 0.15,
    actualLossPct: 0.05,
    penaltyDeductionRp: 0,
    netPayoutRp: 17340000,
    status: 'PAID'
  },
  {
    id: 'bill-02',
    invoiceNo: 'INV/TTMS/2026/08/092',
    customerName: 'PT Wilmar Nabati Indonesia - Dumai',
    productType: 'CPO (Crude Palm Oil)',
    totalVolumeLiters: 32000,
    distanceKm: 140,
    ratePerLiterKmRp: 6.8,
    totalFreightRp: 30464000,
    volumeLossLiters: 25,
    lossToleratedPct: 0.15,
    actualLossPct: 0.08,
    penaltyDeductionRp: 0,
    netPayoutRp: 30464000,
    status: 'RECONCILED'
  },
  {
    id: 'bill-03',
    invoiceNo: 'INV/TTMS/2026/08/093',
    customerName: 'PT Chandra Asri Petrochemical Tbk',
    productType: 'Chemical Acid (H2SO4)',
    totalVolumeLiters: 16000,
    distanceKm: 65,
    ratePerLiterKmRp: 14.5,
    totalFreightRp: 15080000,
    volumeLossLiters: 8,
    lossToleratedPct: 0.10,
    actualLossPct: 0.05,
    penaltyDeductionRp: 0,
    netPayoutRp: 15080000,
    status: 'PENDING_APPROVAL'
  }
];

export const TankerBillingTab: React.FC = () => {
  const [billings] = useState<BillingRecord[]>(MOCK_BILLINGS);

  const totalRevenue = billings.reduce((a, b) => a + b.netPayoutRp, 0);

  return (
    <div id="tanker-billing-tab" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-amber-400" />
            <span>Tarif Angkutan Cairan (Freight Tariff) & Klaim Susut Losses</span>
          </h2>
          <p className="text-xs text-slate-400">
            Perhitungan ongkos angkut (Rp/Liter/KM atau Kontrak Ritase) dan rekonsiliasi klaim penyusutan cairan (Losses tolerance threshold &lt;0.15%).
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-right">
          <span className="text-[10px] text-slate-400 block font-mono">TOTAL PENDAPATAN BULAN INI</span>
          <span className="text-base font-black text-amber-400 font-mono">
            Rp {totalRevenue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Freight Billings Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
          <Receipt className="w-4 h-4 text-amber-400" />
          <span>Daftar Faktur Tagihan & Rekonsiliasi Ongkos Angkut</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/50">
                <th className="py-2.5 px-3">Nomor Faktur</th>
                <th className="py-2.5 px-3">Klien / Penerima</th>
                <th className="py-2.5 px-3">Muatan & Volume</th>
                <th className="py-2.5 px-3">Jarak & Tarif</th>
                <th className="py-2.5 px-3">Susut (Losses)</th>
                <th className="py-2.5 px-3">Total Bersih (Rp)</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {billings.map((bill) => (
                <tr key={bill.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-mono font-bold text-amber-400">{bill.invoiceNo}</td>
                  <td className="py-3 px-3 font-semibold text-slate-200">{bill.customerName}</td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-100">{bill.productType}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {bill.totalVolumeLiters.toLocaleString()} Liter
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-slate-200">{bill.distanceKm} KM</div>
                    <div className="text-[11px] text-slate-400">Rp {bill.ratePerLiterKmRp} /L/KM</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono text-emerald-400 font-bold">
                      -{bill.volumeLossLiters} L ({bill.actualLossPct}%)
                    </span>
                    <div className="text-[10px] text-slate-500">Toleransi 0.15%</div>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-100">
                    Rp {bill.netPayoutRp.toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                      {bill.status}
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
