import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  FileCheck,
  Building,
  QrCode
} from 'lucide-react';
import { MOCK_DELIVERY_ORDERS } from '../../../modules/tanker/services/tankerMockData';
import { TankerDeliveryOrder } from '../../../modules/tanker/types';

export const TankerLoadingOrdersTab: React.FC = () => {
  const [orders, setOrders] = useState<TankerDeliveryOrder[]>(MOCK_DELIVERY_ORDERS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = orders.filter((ord) => {
    const matchSearch =
      ord.spbNumber.toLowerCase().includes(search.toLowerCase()) ||
      ord.doNumber.toLowerCase().includes(search.toLowerCase()) ||
      ord.consignee.toLowerCase().includes(search.toLowerCase()) ||
      ord.assignedTankerHull.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || ord.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div id="tanker-loading-orders-tab" className="space-y-6">
      {/* Header with Search and Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <span>Manajemen Order Pengiriman (DO / SPPB) & Gantry Loading</span>
          </h2>
          <p className="text-xs text-slate-400">
            Pencatatan Surat Perintah Pengeluaran Barang, meteran gantry loading terminal, dan verifikasi volume Gross vs Net @15°C.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari No. SPB, DO, Tujuan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((ord) => (
          <div
            key={ord.id}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 hover:border-amber-500/30 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono font-bold border border-amber-500/20">
                  {ord.spbNumber}
                </span>
                <h3 className="text-base font-black text-slate-100 mt-1">{ord.doNumber}</h3>
                <span className="text-xs text-slate-400">{ord.productType.replace(/_/g, ' ')}</span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                  ord.status === 'IN_TRANSIT'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : ord.status === 'DISCHARGING'
                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}
              >
                {ord.status.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Consignor & Consignee route */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-2 text-xs">
              <div className="flex items-start space-x-2">
                <Building className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 block">Titik Asal / Terminal Pengisian</span>
                  <span className="font-semibold text-slate-200">{ord.consignor}</span>
                </div>
              </div>

              <div className="flex items-start space-x-2 pt-1 border-t border-slate-900">
                <MapPin className="w-3.5 h-3.5 text-sky-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 block">Tujuan Pengiriman / Penerima</span>
                  <span className="font-semibold text-slate-200">{ord.consignee}</span>
                  <span className="text-[10px] text-slate-400 block">{ord.consigneeAddress}</span>
                </div>
              </div>
            </div>

            {/* Gantry Loading Meter Data */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Gross Volume</span>
                <span className="font-bold text-amber-400 font-mono">
                  {ord.gantryLoadedGrossLiters.toLocaleString()} L
                </span>
              </div>
              <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Net Vol @15°C</span>
                <span className="font-bold text-slate-200 font-mono">
                  {ord.gantryLoadedNet15Liters.toLocaleString()} L
                </span>
              </div>
              <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Suhu Gantry</span>
                <span className="font-bold text-slate-200 font-mono">{ord.gantryLoadingTempC}°C</span>
              </div>
            </div>

            {/* Footer Assigned Details */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="font-bold text-slate-200">{ord.assignedTankerHull}</span>
                  <span className="text-[10px] text-slate-400 block">{ord.driverName}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-500 block font-mono">Kode OTP Buka Segel</span>
                <span className="font-bold text-emerald-400 font-mono tracking-widest">{ord.elockSecurityOtp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
