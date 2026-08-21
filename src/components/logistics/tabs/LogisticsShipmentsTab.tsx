import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Search, 
  Truck, 
  QrCode, 
  CheckCircle2, 
  MapPin, 
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { LogisticsOrder } from '../../../modules/logistics/types';

interface Props {
  orders: LogisticsOrder[];
  onSelectOrder: (order: LogisticsOrder) => void;
}

export const LogisticsShipmentsTab: React.FC<Props> = ({ orders, onSelectOrder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWaybill, setSelectedWaybill] = useState<LogisticsOrder | null>(null);

  const filteredOrders = orders.filter(
    (o) =>
      o.connoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.consigneeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-blue-600" />
            Surat Jalan Elektronik (e-Waybill / Resi Connote)
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Format Surat Jalan standar Kemenhub & Asperindo dengan QR Code verifikasi legalitas muatan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4" />
            Cetak Bulk Surat Jalan
          </button>
        </div>
      </div>

      {/* Grid of Waybills */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOrders.map((ord) => (
          <div 
            key={ord.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-bold text-xs">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-mono font-bold text-xs text-slate-900 dark:text-white">{ord.connoteNumber}</div>
                    <div className="text-[10px] text-slate-400">{ord.orderNumber}</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                  {ord.serviceType}
                </span>
              </div>

              {/* Waybill Route Card */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                  <div>
                    <div className="text-[10px] text-slate-400">PENGIRIM (ORIGIN)</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">{ord.shipperName}</div>
                    <div className="text-slate-500 text-[11px]">{ord.shipperCity}</div>
                  </div>
                </div>

                <div className="border-l-2 border-dashed border-slate-300 dark:border-slate-700 ml-1 pl-3 my-1">
                  <div className="text-[10px] text-slate-400">TRANSIT HUB</div>
                  <div className="font-semibold text-slate-600 dark:text-slate-300 text-[11px]">{ord.originHubName.split('(')[0]}</div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5" />
                  <div>
                    <div className="text-[10px] text-slate-400">PENERIMA (DESTINATION)</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">{ord.consigneeName}</div>
                    <div className="text-slate-500 text-[11px]">{ord.consigneeCity} ({ord.consigneePostalCode})</div>
                  </div>
                </div>
              </div>

              {/* Package specs */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs p-2 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800">
                <div>
                  <div className="text-[10px] text-slate-400">Total Koli</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{ord.items.length} Item</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Berat Aktual</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{ord.totalWeightKg} Kg</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Volume</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{ord.totalVolumeCbm} CBM</div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="text-xs">
                <span className="text-slate-400 block text-[10px]">Driver Bertugas</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{ord.assignedDriverName || 'Belum di-assign'}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedWaybill(ord)}
                  className="p-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 bg-slate-100 dark:bg-slate-800 rounded-lg transition-all"
                  title="Lihat Pratinjau Surat Jalan"
                >
                  <QrCode className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onSelectOrder(ord)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
                >
                  Buka Resi
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Waybill Print Preview Modal */}
      {selectedWaybill && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b-2 border-slate-900">
              <div>
                <div className="text-xl font-extrabold tracking-tight">SURAT JALAN & RESI PENGIRIMAN</div>
                <div className="text-xs text-slate-500 font-mono">STANDAR TMS LOGISTIK NUSANTARA • NOMOR: {selectedWaybill.connoteNumber}</div>
              </div>
              <button 
                onClick={() => setSelectedWaybill(null)}
                className="text-slate-500 hover:text-slate-800 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Top Bar Barcode */}
            <div className="flex items-center justify-between bg-slate-100 p-4 rounded-xl border border-slate-200">
              <div>
                <div className="text-xs font-bold uppercase text-slate-600">Barcode Resi / Tracking</div>
                <div className="text-2xl font-mono font-extrabold tracking-widest mt-1">{selectedWaybill.connoteNumber}</div>
                <div className="text-xs text-slate-500">Service: {selectedWaybill.serviceType} | Pay: {selectedWaybill.paymentMethod}</div>
              </div>
              <div className="w-20 h-20 bg-white p-1 rounded-lg border border-slate-300 flex items-center justify-center">
                <QrCode className="w-16 h-16 text-slate-800" />
              </div>
            </div>

            {/* Origin & Destination Grid */}
            <div className="grid grid-cols-2 gap-6 text-xs">
              <div className="border border-slate-200 p-4 rounded-xl space-y-2">
                <div className="font-bold text-slate-700 uppercase border-b pb-1">1. DATA PENGIRIM (SHIPPER)</div>
                <div className="font-bold text-sm">{selectedWaybill.shipperName}</div>
                <div>Telp: {selectedWaybill.shipperPhone}</div>
                <div className="text-slate-600">{selectedWaybill.shipperAddress}, {selectedWaybill.shipperCity}</div>
              </div>

              <div className="border border-slate-200 p-4 rounded-xl space-y-2">
                <div className="font-bold text-slate-700 uppercase border-b pb-1">2. DATA PENERIMA (CONSIGNEE)</div>
                <div className="font-bold text-sm">{selectedWaybill.consigneeName}</div>
                <div>Telp: {selectedWaybill.consigneePhone}</div>
                <div className="text-slate-600">{selectedWaybill.consigneeAddress}, {selectedWaybill.consigneeCity} ({selectedWaybill.consigneePostalCode})</div>
              </div>
            </div>

            {/* Items Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 border-b border-slate-200 font-bold">
                  <tr>
                    <th className="p-3">Deskripsi Barang</th>
                    <th className="p-3">Qty</th>
                    <th className="p-3">Berat (Kg)</th>
                    <th className="p-3">Dimensi (cm)</th>
                    <th className="p-3">Fragile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedWaybill.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-3 font-semibold">{it.name}</td>
                      <td className="p-3">{it.qty}</td>
                      <td className="p-3">{it.weightKg}</td>
                      <td className="p-3">{it.dimensions.lengthCm}x{it.dimensions.widthCm}x{it.dimensions.heightCm}</td>
                      <td className="p-3">{it.isFragile ? 'YA' : 'TIDAK'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Signature Area */}
            <div className="grid grid-cols-3 gap-4 text-center text-xs pt-4 border-t border-slate-200">
              <div className="space-y-12">
                <div className="font-bold">Pengirim (Shipper)</div>
                <div className="text-slate-400 font-mono">( ........................ )</div>
              </div>
              <div className="space-y-12">
                <div className="font-bold">Kurir / Driver</div>
                <div className="text-slate-700 font-semibold font-mono">( {selectedWaybill.assignedDriverName || 'Driver Ekspedisi'} )</div>
              </div>
              <div className="space-y-12">
                <div className="font-bold">Penerima Barang</div>
                <div className="text-slate-400 font-mono">( ........................ )</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button 
                onClick={() => setSelectedWaybill(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs"
              >
                Tutup
              </button>
              <button 
                onClick={() => window.print()}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Cetak Surat Jalan (PDF)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
