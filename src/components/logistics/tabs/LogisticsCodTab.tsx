import React, { useState } from 'react';
import { 
  DollarSign, 
  Wallet, 
  Search, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  ShieldCheck,
  FileSpreadsheet,
  Building2
} from 'lucide-react';
import { CodSettlement } from '../../../modules/logistics/types';

interface Props {
  settlements: CodSettlement[];
}

export const LogisticsCodTab: React.FC<Props> = ({ settlements: initialSettlements }) => {
  const [settlements, setSettlements] = useState<CodSettlement[]>(initialSettlements);

  const handleSettle = (id: string) => {
    setSettlements((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: 'SETTLED_VERIFIED',
              verifiedAt: new Date().toISOString(),
              totalCashDeposited: s.totalCodAmountExpected,
              variance: 0,
              cashierName: 'Kasir Utama Hub'
            }
          : s
      )
    );
  };

  const totalCollected = settlements.reduce((acc, s) => acc + s.totalCodAmountExpected, 0);
  const totalRemitted = settlements
    .filter((s) => s.status === 'SETTLED_VERIFIED')
    .reduce((acc, s) => acc + s.totalCashDeposited, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <DollarSign className="w-6 h-6 text-emerald-600" />
            Manajemen COD & Rekonsiliasi Kas Driver (Cash on Delivery)
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Validasi setoran uang tunai COD kurir, rekonsiliasi kasir hub, dan pencairan dana (remittance) ke rekening merchant B2B.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Total Tagihan COD Ditagihkan</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">Rp {totalCollected.toLocaleString()}</div>
          <p className="text-[11px] text-slate-400">Dari seluruh kurir bertugas</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Telah Terverifikasi Kasir</span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Rp {totalRemitted.toLocaleString()}</div>
          <p className="text-[11px] text-slate-400">Setoran kasir klir tanpa selisih</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Outstanding Kas Kurir</span>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            Rp {(totalCollected - totalRemitted).toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400">Menunggu serah terima kasir sore</p>
        </div>
      </div>

      {/* Settlements Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase">
            <tr>
              <th className="py-3 px-4">ID Settlement & Tanggal</th>
              <th className="py-3 px-4">Kurir / Driver</th>
              <th className="py-3 px-4">Jumlah Resi COD</th>
              <th className="py-3 px-4">Target Setoran</th>
              <th className="py-3 px-4">Uang Diterima & Selisih</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {settlements.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {s.id.toUpperCase()}
                  <div className="text-[10px] text-slate-400 font-normal">{s.date}</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-900 dark:text-slate-200">{s.driverName}</div>
                  <div className="text-[11px] text-slate-500">ID: {s.driverId}</div>
                </td>
                <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                  {s.totalDeliveredCodCount} Paket
                </td>
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                  Rp {s.totalCodAmountExpected.toLocaleString()}
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-900 dark:text-slate-200">
                    Rp {s.totalCashDeposited.toLocaleString()}
                  </div>
                  {s.variance !== 0 && (
                    <div className="text-[10px] font-bold text-rose-500">
                      Selisih: Rp {s.variance.toLocaleString()}
                    </div>
                  )}
                </td>
                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    s.status === 'SETTLED_VERIFIED'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : s.status === 'DISPUTED'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                  }`}>
                    {s.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  {s.status !== 'SETTLED_VERIFIED' ? (
                    <button 
                      onClick={() => handleSettle(s.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
                    >
                      Verifikasi Kasir
                    </button>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold">✓ Kas Selesai</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
