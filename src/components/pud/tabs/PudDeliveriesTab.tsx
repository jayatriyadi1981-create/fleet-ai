import React, { useState } from 'react';
import {
  PackageCheck,
  Search,
  Filter,
  MapPin,
  Clock,
  CheckCircle2,
  DollarSign,
  Phone,
  Bike,
  Truck,
  ExternalLink,
  ShieldCheck,
  Eye,
  X
} from 'lucide-react';
import { pudService } from '../../../modules/pud/services/pudService';
import { PudOrder } from '../../../modules/pud/types';

export const PudDeliveriesTab: React.FC = () => {
  const [orders, setOrders] = useState<PudOrder[]>(pudService.getOrders());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<PudOrder | null>(null);

  const deliveryOrders = orders.filter(o => {
    const matchSearch = 
      o.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.recipient.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.recipient.addressLine.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6" id="pud-deliveries-tab">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-emerald-600" />
            Pengiriman Drop-off (Last-Mile Deliveries)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar seluruh paket pengantaran aktif, verifikasi alamat penerima, status COD, dan bukti serah terima.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
            Total {deliveryOrders.length} Paket
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari resi, nama penerima, alamat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="ALL">Semua Status Pengantaran</option>
            <option value="OUT_FOR_DELIVERY">Sedang Dikirim (Out for Delivery)</option>
            <option value="DELIVERED">Selesai Terkirim (Delivered)</option>
            <option value="FAILED_DELIVERY">Gagal Antar (Exception)</option>
          </select>
        </div>
      </div>

      {/* Delivery Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">No. Resi & Layanan</th>
                <th className="px-4 py-3">Penerima & Alamat</th>
                <th className="px-4 py-3">Barang & Berat</th>
                <th className="px-4 py-3">Kurir & Armada</th>
                <th className="px-4 py-3">Metode & COD</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {deliveryOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      <span className="font-mono font-bold text-indigo-700 block">{order.trackingNumber}</span>
                      <span className="text-[10px] text-slate-400">{order.merchantName}</span>
                      <span className={`inline-block text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase ${
                        order.serviceType === 'INSTANT'
                          ? 'bg-rose-100 text-rose-800'
                          : order.serviceType === 'SAME_DAY'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {order.serviceType}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-900 block">{order.recipient.contactName}</span>
                      <p className="text-[11px] text-slate-500 line-clamp-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        {order.recipient.addressLine}, {order.recipient.district}
                      </p>
                      <span className="text-[10px] text-slate-400">{order.recipient.phone}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-800 block">{order.parcel.description}</span>
                    <span className="text-[10px] text-slate-500">{order.parcel.weightKg} kg</span>
                  </td>

                  <td className="px-4 py-3">
                    {order.assignedCourierName ? (
                      <div>
                        <span className="font-bold text-slate-900 block">{order.assignedCourierName}</span>
                        <span className="text-[10px] text-slate-500">{order.vehiclePlate} ({order.vehicleType})</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px] italic">Belum dialokasikan</span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {order.codAmount ? (
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                          COD
                        </span>
                        <span className="font-bold text-slate-900 text-xs block">Rp {order.codAmount.toLocaleString()}</span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-emerald-600 font-semibold">Prepaid</span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      order.status === 'DELIVERED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.status === 'FAILED_DELIVERY'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      title="Lihat Detail Paket"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Order */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  {selectedOrder.trackingNumber}
                </span>
                <h3 className="font-black text-slate-900 text-base mt-1">Detail Order Pengiriman</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-500 uppercase text-[10px]">Penerima & Alamat</span>
                <p className="font-bold text-slate-900 text-sm">{selectedOrder.recipient.contactName} ({selectedOrder.recipient.phone})</p>
                <p className="text-slate-600">{selectedOrder.recipient.addressLine}, {selectedOrder.recipient.district}, {selectedOrder.recipient.city}</p>
                {selectedOrder.recipient.notes && (
                  <p className="text-indigo-600 italic">Catatan: {selectedOrder.recipient.notes}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Ongkos Kirim</span>
                  <span className="font-bold text-slate-900 text-sm">Rp {selectedOrder.deliveryFee.toLocaleString()}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Nilai Barang / COD</span>
                  <span className="font-bold text-amber-700 text-sm">
                    {selectedOrder.codAmount ? `Rp ${selectedOrder.codAmount.toLocaleString()}` : 'Prepaid (Rp 0)'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-500 uppercase text-[10px]">Kurir Bertugas</span>
                <p className="font-bold text-slate-900">{selectedOrder.assignedCourierName || 'Belum ditugaskan'}</p>
                <p className="text-slate-500">{selectedOrder.vehiclePlate} • {selectedOrder.vehicleType}</p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
