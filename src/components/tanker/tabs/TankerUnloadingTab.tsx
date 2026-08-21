import React, { useState } from 'react';
import {
  DownloadCloud,
  CheckCircle,
  FileCheck2,
  AlertTriangle,
  Droplets,
  Clock,
  MapPin,
  Building,
  Gauge
} from 'lucide-react';
import { MOCK_DELIVERY_ORDERS } from '../../../modules/tanker/services/tankerMockData';

export const TankerUnloadingTab: React.FC = () => {
  const [activeOrders] = useState(MOCK_DELIVERY_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState(activeOrders[2]); // The discharging one

  return (
    <div id="tanker-unloading-tab" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <DownloadCloud className="w-5 h-5 text-amber-400" />
            <span>Bongkar Muatan (Discharge / Unloading) & Flowmeter SPBU/Pabrik</span>
          </h2>
          <p className="text-xs text-slate-400">
            Prosedur pembongkaran aman cairan BBM/CPO/Kimia: verifikasi sounding tangki timbun, flow rate, dan Berita Acara Penerimaan (BAP).
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-semibold">Pilih Order:</span>
          <select
            value={selectedOrder.id}
            onChange={(e) => {
              const found = activeOrders.find((o) => o.id === e.target.value);
              if (found) setSelectedOrder(found);
            }}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-500"
          >
            {activeOrders.map((o) => (
              <option key={o.id} value={o.id}>
                {o.doNumber} ({o.consignee})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Discharge Monitoring Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Discharge Status */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] text-amber-400 font-mono font-bold block">{selectedOrder.spbNumber}</span>
                <h3 className="text-base font-bold text-slate-100">{selectedOrder.consignee}</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-bold border border-sky-500/30">
                PROSES BONGKAR
              </span>
            </div>

            {/* Discharge Progress Bar */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Progres Pengaliran Cairan (Discharge)</span>
                <span className="font-bold text-amber-400 font-mono">
                  {selectedOrder.dischargedVolumeLiters?.toLocaleString() || '0'} /{' '}
                  {selectedOrder.orderedVolumeLiters.toLocaleString()} L (35%)
                </span>
              </div>
              <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-gradient-to-r from-amber-500 to-sky-400 h-full rounded-full w-[35%]" />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>Debit Pompa: 450 Liter / Menit</span>
                <span>Estimasi Selesai: 24 Menit Lagi</span>
              </div>
            </div>

            {/* Pre-Unloading Checklist */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                <span>Kepatuhan SOP Pra-Bongkar (Safety Checklist)</span>
              </h4>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-300">Grounding Kabel Statis Terpasang</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-300">APAR 9kg Siap di Samping Katup</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-300">Cek Water Paste Bebas Air (0 mm)</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-300">Segel E-Lock Terbuka Resmi (Valid)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Losses Variance & Digital BAP */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2 pb-3 border-b border-slate-800">
              <Gauge className="w-5 h-5 text-amber-400" />
              <span>Analisis Deviasi Selisih Muatan (Losses)</span>
            </h3>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Volume Muat Gantry (@15°C)</span>
                <span className="font-bold text-slate-200 font-mono">
                  {selectedOrder.gantryLoadedNet15Liters.toLocaleString()} L
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Volume Diterima Flowmeter</span>
                <span className="font-bold text-slate-200 font-mono">15.992 L</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                <span className="font-bold text-slate-300">Selisih Susut Transit</span>
                <span className="font-bold text-emerald-400 font-mono">-8 Liter (-0.05%)</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              ✓ Susut 0.05% berada jauh di bawah ambang batas toleransi resmi (Maks 0.15%). Tidak dikenakan klaim pemotongan ongkos angkut.
            </div>

            <button
              onClick={() => alert('Berita Acara Penerimaan (BAP) digital berhasil diunduh dalam format PDF!')}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg flex items-center justify-center space-x-2 transition-all"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Cetak Berita Acara Penerimaan (BAP)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
