import React from 'react';
import {
  CreditCard,
  QrCode,
  DollarSign,
  Receipt,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { taxiService } from '../../../modules/taxi/services/taxiService';

export const TaxiCashlessPaymentTab: React.FC = () => {
  const kpis = taxiService.getKpis();

  return (
    <div id="taxi-cashless-payment-tab" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            <span>Pembayaran Digital Cashless (QRIS & EDC) & Rekonsiliasi Kasir</span>
          </h2>
          <p className="text-xs text-slate-400">Penyelesaian transaksi non-tunai, auto-settlement bank H+0, dan rekapitulasi pendapatan bersih perusahaan</p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Rasio Cashless Penumpang:</span>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
            78.4% Non-Tunai
          </span>
        </div>
      </div>

      {/* Payment Channel Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">QRIS Dinamis Argo</span>
            <QrCode className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">Rp 1.480.000</div>
          <div className="text-[11px] text-slate-400">42% dari Total Transaksi</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Kartu Kredit / Debit EDC</span>
            <CreditCard className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold font-mono text-cyan-400">Rp 1.250.000</div>
          <div className="text-[11px] text-slate-400">36% dari Total Transaksi</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Tunai (Cash Pool Deposit)</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-400">Rp 780.000</div>
          <div className="text-[11px] text-slate-400">22% dari Total Transaksi</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Voucher Perusahaan B2B</span>
            <Receipt className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold font-mono text-purple-400">Rp 505.000</div>
          <div className="text-[11px] text-slate-400">Invoice Korporat Bulanan</div>
        </div>
      </div>
    </div>
  );
};
