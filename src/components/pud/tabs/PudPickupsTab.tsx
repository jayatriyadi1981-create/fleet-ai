import React, { useState } from 'react';
import {
  ArrowUpRight,
  Package,
  Plus,
  Search,
  Filter,
  MapPin,
  Clock,
  CheckCircle2,
  Calendar,
  Building2,
  Bike,
  QrCode,
  Check,
  AlertCircle
} from 'lucide-react';
import { pudService } from '../../../modules/pud/services/pudService';
import { PudOrder, PudServiceType, VehicleCategory } from '../../../modules/pud/types';

export const PudPickupsTab: React.FC = () => {
  const [orders, setOrders] = useState<PudOrder[]>(pudService.getOrders());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterService, setFilterService] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [scanSuccessMsg, setScanSuccessMsg] = useState<string | null>(null);

  // New Order State
  const [newOrder, setNewOrder] = useState({
    merchantName: '',
    serviceType: 'INSTANT' as PudServiceType,
    vehicleType: 'MOTORCYCLE' as VehicleCategory,
    senderName: '',
    senderPhone: '',
    senderAddress: '',
    senderDistrict: 'Setiabudi',
    recipientName: '',
    recipientPhone: '',
    recipientAddress: '',
    recipientDistrict: 'Kebayoran Baru',
    description: '',
    weightKg: 1.0,
    itemValue: 150000,
    deliveryFee: 25000,
    codAmount: 0
  });

  const pickupOrders = orders.filter(o => {
    const isPickupStage = 
      o.status === 'PENDING_PICKUP' || 
      o.status === 'ASSIGNED_PICKUP' || 
      o.status === 'PICKING_UP' ||
      o.status === 'PICKED_UP';
    const matchSearch = 
      o.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.sender.contactName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchService = filterService === 'ALL' || o.serviceType === filterService;
    return isPickupStage && matchSearch && matchService;
  });

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    pudService.createOrder({
      merchantName: newOrder.merchantName || 'Direct Customer',
      serviceType: newOrder.serviceType,
      vehicleType: newOrder.vehicleType,
      sender: {
        contactName: newOrder.senderName || 'Pengirim Toko',
        phone: newOrder.senderPhone || '0812-3344-5566',
        addressLine: newOrder.senderAddress || 'Jl. Jenderal Sudirman No. 10',
        district: newOrder.senderDistrict,
        city: 'Jakarta Selatan',
        postalCode: '12190',
        lat: -6.2088,
        lng: 106.8225
      },
      recipient: {
        contactName: newOrder.recipientName || 'Penerima Paket',
        phone: newOrder.recipientPhone || '0813-9988-7766',
        addressLine: newOrder.recipientAddress || 'Jl. Gatot Subroto No. 45',
        district: newOrder.recipientDistrict,
        city: 'Jakarta Selatan',
        postalCode: '12930',
        lat: -6.2388,
        lng: 106.8225
      },
      parcel: {
        id: `pcl-${Date.now()}`,
        trackingNumber: `JKT-EXP-${Math.floor(10000 + Math.random() * 90000)}`,
        description: newOrder.description || 'Paket Kiriman Express',
        category: 'GENERAL',
        weightKg: Number(newOrder.weightKg),
        volumeM3: 0.005,
        lengthCm: 25,
        widthCm: 20,
        heightCm: 10,
        itemValue: Number(newOrder.itemValue),
        insuranceRequired: false
      },
      deliveryFee: Number(newOrder.deliveryFee),
      codAmount: Number(newOrder.codAmount)
    });

    setOrders(pudService.getOrders());
    setShowCreateModal(false);
    setScanSuccessMsg('Permintaan pickup berhasil didaftarkan ke sistem.');
    setTimeout(() => setScanSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6" id="pud-pickups-tab">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5 text-indigo-600" />
            Permintaan Pickup & First-Mile
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola penjemputan paket terjadwal & on-demand dari merchant, warehouse, dan toko retail.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            id="pud-btn-new-pickup"
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Order Pickup Baru</span>
          </button>
        </div>
      </div>

      {scanSuccessMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{scanSuccessMsg}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari no. resi, merchant, pengirim..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">Semua Layanan</option>
            <option value="INSTANT">Instant (1-2 Jam)</option>
            <option value="SAME_DAY">Same-Day (4-6 Jam)</option>
            <option value="CARGO_BULKY">Cargo Bulky</option>
          </select>
        </div>
      </div>

      {/* Pickup Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pickupOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 hover:border-indigo-300 transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  {order.trackingNumber}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  order.serviceType === 'INSTANT'
                    ? 'bg-rose-100 text-rose-800'
                    : order.serviceType === 'SAME_DAY'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-indigo-100 text-indigo-800'
                }`}>
                  {order.serviceType}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Merchant / Pengirim</span>
                <h4 className="font-bold text-slate-900 text-sm">{order.merchantName}</h4>
                <p className="text-xs text-slate-600 flex items-start gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{order.sender.addressLine}, {order.sender.district}</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-1">Kontak: {order.sender.contactName} ({order.sender.phone})</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Paket:</span>
                  <span className="font-bold text-slate-800">{order.parcel.description}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Berat & Dimensi:</span>
                  <span className="font-bold text-slate-800">{order.parcel.weightKg} kg ({order.parcel.lengthCm}x{order.parcel.widthCm}x{order.parcel.heightCm} cm)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Jendela Pickup:</span>
                  <span className="font-bold text-indigo-700">{order.pickupTimeWindow.startTime} - {order.pickupTimeWindow.endTime} WIB</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                order.status === 'ASSIGNED_PICKUP'
                  ? 'bg-blue-100 text-blue-800'
                  : order.status === 'PENDING_PICKUP'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {order.status.replace(/_/g, ' ')}
              </span>

              {order.assignedCourierName ? (
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Bike className="w-3.5 h-3.5 text-indigo-600" />
                  {order.assignedCourierName}
                </span>
              ) : (
                <span className="text-xs font-bold text-rose-600">Belum Ada Kurir</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Buat Order Baru */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 overflow-y-auto max-h-[90vh]">
            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" />
              Formulir Permintaan Pickup Baru
            </h3>

            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Merchant / Toko</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Toko Buku Sentosa"
                  value={newOrder.merchantName}
                  onChange={(e) => setNewOrder({ ...newOrder, merchantName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Layanan</label>
                  <select
                    value={newOrder.serviceType}
                    onChange={(e) => setNewOrder({ ...newOrder, serviceType: e.target.value as PudServiceType })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="INSTANT">Instant (1-2 Jam)</option>
                    <option value="SAME_DAY">Same-Day (4-6 Jam)</option>
                    <option value="CARGO_BULKY">Cargo Bulky</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Armada Armada</label>
                  <select
                    value={newOrder.vehicleType}
                    onChange={(e) => setNewOrder({ ...newOrder, vehicleType: e.target.value as VehicleCategory })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="MOTORCYCLE">Motorcycle Rider</option>
                    <option value="BLIND_VAN">Blind Van (CDE/GranMax)</option>
                    <option value="PICKUP_BOX">Pickup Box</option>
                  </select>
                </div>
              </div>

              {/* Sender info */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Alamat Penjemputan (Pickup)</span>
                <input
                  type="text"
                  required
                  placeholder="Nama Kontak & No. HP Pengirim"
                  value={newOrder.senderName}
                  onChange={(e) => setNewOrder({ ...newOrder, senderName: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
                <input
                  type="text"
                  required
                  placeholder="Alamat Lengkap Pengirim (Jalan, No, RT/RW)"
                  value={newOrder.senderAddress}
                  onChange={(e) => setNewOrder({ ...newOrder, senderAddress: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              {/* Recipient info */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Alamat Tujuan Pengantaran (Delivery)</span>
                <input
                  type="text"
                  required
                  placeholder="Nama Penerima & No. HP"
                  value={newOrder.recipientName}
                  onChange={(e) => setNewOrder({ ...newOrder, recipientName: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
                <input
                  type="text"
                  required
                  placeholder="Alamat Lengkap Penerima"
                  value={newOrder.recipientAddress}
                  onChange={(e) => setNewOrder({ ...newOrder, recipientAddress: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Barang</label>
                  <input
                    type="text"
                    placeholder="e.g. Makanan / Dokumen"
                    value={newOrder.description}
                    onChange={(e) => setNewOrder({ ...newOrder, description: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Berat (Kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newOrder.weightKg}
                    onChange={(e) => setNewOrder({ ...newOrder, weightKg: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow transition"
                >
                  Simpan & Daftarkan Pickup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
