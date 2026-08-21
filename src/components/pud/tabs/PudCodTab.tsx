import React, { useState } from 'react';
import {
  DollarSign,
  Search,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  CreditCard,
  Building2,
  Calendar,
  UserCheck,
  Receipt,
  Download
} from 'lucide-react';
import { pudService } from '../../../modules/pud/services/pudService';
import { PudCodSettlement } from '../../../modules/pud/types';

export const PudCodTab: React.FC = () => {
  const [settlements, setSettlements] = useState<PudCodSettlement[]>(pudService.getCodSettlements());
  const [selectedSettlement, setSelectedSettlement] = useState<PudCodSettlement>(settlements[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSettlements = settlements.filter(s => 
    s.courierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.settlementNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6" id="pud-cod-tab">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            COD & Rekonsiliasi Kasir Kurir
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pencatatan kas *Cash-on-Delivery*, setoran tunai ke kasir hub (*Remittance*), dan integrasi pembayaran nontunai QRIS.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Total COD Hari Ini</span>
            <span className="text-base font-black text-slate-900">Rp 18.450.000</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Settlement List vs Settlement Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Courier Settlement Roster */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Buku Kas Harian Kurir</h3>
            <span className="text-xs text-slate-500 font-mono">21 Agustus 2026</span>
          </div>

          <div className="space-y-2 max-h-[420px] overflow-y-auto">
            {filteredSettlements.map((s) => {
              const isSelected = selectedSettlement.id === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedSettlement(s)}
                  className={`p-3 rounded-xl border cursor-pointer transition ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{s.courierName}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                      s.status === 'VERIFIED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {s.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p className="text-[11px] font-mono text-slate-500 mt-0.5">{s.settlementNumber}</p>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Terkumpul:</span>
                    <span className="font-bold text-slate-900">Rp {(s.totalCashAmount + s.totalQrisAmount).toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Orders in Settlement */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {selectedSettlement.settlementNumber}
              </span>
              <h3 className="font-black text-slate-900 text-base mt-1">
                Rincian Setoran COD: {selectedSettlement.courierName}
              </h3>
            </div>
            <span className="text-xs text-slate-500">Verifikator: {selectedSettlement.verifiedByHubStaff || 'Kasir Hub'}</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Tunai (Cash Fisik)</span>
              <span className="text-base font-black text-slate-900 mt-0.5 block">
                Rp {selectedSettlement.totalCashAmount.toLocaleString()}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Digital (QRIS on Delivery)</span>
              <span className="text-base font-black text-indigo-700 mt-0.5 block">
                Rp {selectedSettlement.totalQrisAmount.toLocaleString()}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Telah Disetor ke Kasir</span>
              <span className="text-base font-black text-emerald-700 mt-0.5 block">
                Rp {selectedSettlement.remittedToHubAmount.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2.5">No. Resi</th>
                  <th className="px-3 py-2.5">Nama Pelanggan</th>
                  <th className="px-3 py-2.5">Metode Bayar</th>
                  <th className="px-3 py-2.5">Waktu Terima</th>
                  <th className="px-3 py-2.5 text-right">Nominal COD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {selectedSettlement.orders.map((ord, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="px-3 py-2.5 font-mono font-bold text-indigo-700">{ord.trackingNumber}</td>
                    <td className="px-3 py-2.5 font-bold text-slate-900">{ord.customerName}</td>
                    <td className="px-3 py-2.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        ord.paymentMode === 'QRIS' ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {ord.paymentMode}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-slate-500">{ord.collectedAt}</td>
                    <td className="px-3 py-2.5 text-right font-black text-slate-900">
                      Rp {ord.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
