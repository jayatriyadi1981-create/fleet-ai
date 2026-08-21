import React, { useState } from 'react';
import { 
  RotateCcw, 
  Search, 
  AlertCircle, 
  PackageX, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw,
  FileText
} from 'lucide-react';
import { LogisticsOrder } from '../../../modules/logistics/types';

interface Props {
  orders: LogisticsOrder[];
  onSelectOrder: (order: LogisticsOrder) => void;
}

export const LogisticsReturnsTab: React.FC<Props> = ({ orders, onSelectOrder }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const rtsOrders = orders.filter(
    (o) => o.status === 'FAILED_DELIVERY' || o.status === 'RETURN_TO_SHIPPER' || o.status === 'RETURNED_TO_HUB'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <RotateCcw className="w-6 h-6 text-amber-600" />
            Reverse Logistics & Retur Pengirim (RTS - Return to Shipper)
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Kelola barang gagal kirim (alamat tidak ditemukan, penerima menolak COD) dan alur pengembalian ke gudang asal merchant.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-full text-xs font-semibold">
            {rtsOrders.length} Paket Dalam Proses Retur
          </span>
        </div>
      </div>

      {/* RTS Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase">
            <tr>
              <th className="py-3 px-4">No. Resi & Tanggal</th>
              <th className="py-3 px-4">Pengirim (Merchant)</th>
              <th className="py-3 px-4">Penerima Awal</th>
              <th className="py-3 px-4">Alasan Retur (RTS Reason)</th>
              <th className="py-3 px-4">Hub Penyimpanan Retur</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {rtsOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  Tidak ada paket retur saat ini. Semua pengiriman berjalan lancar!
                </td>
              </tr>
            ) : (
              rtsOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-600 dark:text-amber-400">
                    {ord.connoteNumber}
                    <div className="text-[10px] text-slate-400 font-normal">{new Date(ord.createdAt).toLocaleDateString('id-ID')}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-200">{ord.shipperName}</div>
                    <div className="text-[11px] text-slate-500">{ord.shipperCity}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-200">{ord.consigneeName}</div>
                    <div className="text-[11px] text-slate-500">{ord.consigneeCity}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 block w-max">
                      Penerima Menolak Bayar COD / Rumah Kosong
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{ord.destinationHubName.split('(')[0]}</div>
                    <div className="text-[10px] text-slate-400">Siap Manifest Balik ke {ord.originHubName.split('(')[0]}</div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button 
                      onClick={() => onSelectOrder(ord)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold"
                    >
                      Proses Retur
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
