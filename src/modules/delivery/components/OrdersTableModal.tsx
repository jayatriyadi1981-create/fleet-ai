/**
 * Fleet Intelligence Smart AI - Orders Master Modal & Order Creator
 */

import React, { useState } from 'react';
import { Order, OrderItem, OrderPriority, Customer } from '../deliveryTypes';
import { orderService } from '../services/orderService';
import { customerService } from '../services/customerService';
import {
  X,
  ShoppingCart,
  Plus,
  Trash2,
  CheckCircle,
  FileText,
  Calendar,
  Package,
  Layers,
  MapPin,
} from 'lucide-react';

interface OrdersTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated?: () => void;
}

export const OrdersTableModal: React.FC<OrdersTableModalProps> = ({
  isOpen,
  onClose,
  onOrderCreated,
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [orders, setOrders] = useState<Order[]>(() => orderService.getOrders());
  const [customers] = useState<Customer[]>(() => customerService.getCustomers());

  // Form State for New Order
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [externalOrderNumber, setExternalOrderNumber] = useState('');
  const [priority, setPriority] = useState<OrderPriority>('NORMAL');
  const [requestedDeliveryDate, setRequestedDeliveryDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [originAddress, setOriginAddress] = useState('Depo Utama Cikarang Barat, Bekasi');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Form State for Order Items
  const [items, setItems] = useState<Omit<OrderItem, 'id' | 'orderId'>[]>([
    {
      sku: 'SKU-FMCG-10',
      productName: 'Kardus Biskuit Cokelat Premium',
      quantity: 50,
      unit: 'carton',
      weightKg: 500,
      volumeCbm: 2.5,
      fragile: false,
      temperatureControlled: false,
    },
  ]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        sku: `SKU-GEN-${items.length + 1}`,
        productName: 'Produk Tambahan FMCG',
        quantity: 10,
        unit: 'carton',
        weightKg: 100,
        volumeCbm: 0.5,
        fragile: false,
        temperatureControlled: false,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleCustomerChange = (cId: string) => {
    setCustomerId(cId);
    const selectedCust = customers.find((c) => c.id === cId);
    if (selectedCust) {
      setDestinationAddress(selectedCust.address);
    }
  };

  const handleSaveOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCust = customers.find((c) => c.id === customerId);
    if (!selectedCust) return;

    const totalItemsCount = items.reduce((acc, curr) => acc + curr.quantity, 0);
    const totalWeight = items.reduce((acc, curr) => acc + curr.weightKg, 0);
    const totalVolume = items.reduce((acc, curr) => acc + curr.volumeCbm, 0);

    const formattedItems: OrderItem[] = items.map((it, idx) => ({
      ...it,
      id: `ord-item-new-${idx}-${Date.now().toString(36)}`,
      orderId: 'pending',
    }));

    orderService.createOrder({
      tenantId: 'tenant-tln-01',
      externalOrderNumber: externalOrderNumber || undefined,
      customerId: selectedCust.id,
      customerName: selectedCust.companyName,
      orderDate: new Date().toISOString().split('T')[0],
      requestedDeliveryDate,
      priority,
      status: 'CONFIRMED',
      originAddress,
      destinationAddress: destinationAddress || selectedCust.address,
      totalItems: totalItemsCount,
      totalWeightKg: totalWeight,
      totalVolumeCbm: totalVolume,
      notes,
      items: formattedItems,
      createdBy: 'Operations Admin',
    });

    setOrders(orderService.getOrders());
    setActiveTab('list');
    onOrderCreated?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Manajemen Master Order / Pesanan</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Kelola berkas pesanan pelanggan, manifes barang SKU, dan status kargo sebelum penjadwalan armada.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Sub-Header Tabs */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-800 bg-slate-900/80">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'list'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800/60 text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Daftar Pesanan ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'create'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800/60 text-slate-400 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            + Tambah Order Baru
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'list' ? (
            <div className="space-y-3">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 rounded-xl p-4 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/60">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm text-indigo-400 font-mono">
                        {ord.orderNumber}
                      </span>
                      {ord.externalOrderNumber && (
                        <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-mono">
                          {ord.externalOrderNumber}
                        </span>
                      )}
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                        {ord.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      Tgl Pengiriman: <span className="text-slate-200 font-medium">{ord.requestedDeliveryDate}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-xs">
                    <div>
                      <div className="text-slate-400 font-medium mb-1">Pelanggan:</div>
                      <div className="text-slate-200 font-semibold">{ord.customerName}</div>
                      <div className="text-slate-400 text-[11px] mt-0.5 line-clamp-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-400" />
                        {ord.destinationAddress}
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-400 font-medium mb-1">Manifes Kargo:</div>
                      <div className="text-slate-200 flex items-center gap-3">
                        <span>
                          Total Item: <strong>{ord.totalItems} Pcs</strong>
                        </span>
                        <span>
                          Berat: <strong>{ord.totalWeightKg} kg</strong>
                        </span>
                        <span>
                          Volume: <strong>{ord.totalVolumeCbm} CBM</strong>
                        </span>
                      </div>
                      <div className="text-slate-500 text-[11px] mt-1">
                        Dibuat oleh: {ord.createdBy}
                      </div>
                    </div>
                  </div>

                  {/* Order Items Breakdown */}
                  <div className="mt-3 pt-3 border-t border-slate-800/40 bg-slate-900/50 rounded-lg p-2.5">
                    <div className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                      <Package className="w-3 h-3 text-indigo-400" />
                      Rincian Barang / SKU:
                    </div>
                    <div className="space-y-1">
                      {ord.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between text-[11px] text-slate-300 bg-slate-950/40 px-2.5 py-1 rounded border border-slate-800/40"
                        >
                          <span className="font-mono text-indigo-300">{item.sku}</span>
                          <span className="font-medium text-slate-200">{item.productName}</span>
                          <span>
                            {item.quantity} {item.unit} ({item.weightKg} kg)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSaveOrder} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Select Customer */}
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Pilih Pelanggan *
                  </label>
                  <select
                    value={customerId}
                    onChange={(e) => handleCustomerChange(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-slate-200 outline-none"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id} className="bg-slate-900">
                        {c.companyName} ({c.customerCode})
                      </option>
                    ))}
                  </select>
                </div>

                {/* External Order No */}
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    No. PO / Ref External
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: PO-ABC-99182"
                    value={externalOrderNumber}
                    onChange={(e) => setExternalOrderNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-slate-200 outline-none"
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Prioritas</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as OrderPriority)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-slate-200 outline-none"
                  >
                    <option value="LOW" className="bg-slate-900">Low</option>
                    <option value="NORMAL" className="bg-slate-900">Normal</option>
                    <option value="HIGH" className="bg-slate-900">High</option>
                    <option value="URGENT" className="bg-slate-900">Urgent</option>
                    <option value="CRITICAL" className="bg-slate-900">Critical</option>
                  </select>
                </div>

                {/* Requested Date */}
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Tanggal Pengiriman Diminta *
                  </label>
                  <input
                    type="date"
                    value={requestedDeliveryDate}
                    onChange={(e) => setRequestedDeliveryDate(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-slate-200 outline-none"
                  />
                </div>
              </div>

              {/* Addresses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Alamat Asal (Origin)</label>
                  <input
                    type="text"
                    value={originAddress}
                    onChange={(e) => setOriginAddress(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-slate-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Alamat Tujuan (Destination)</label>
                  <input
                    type="text"
                    value={destinationAddress}
                    onChange={(e) => setDestinationAddress(e.target.value)}
                    required
                    placeholder="Masukkan alamat lengkap tujuan pengiriman"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-slate-200 outline-none"
                  />
                </div>
              </div>

              {/* Order Items Builder */}
              <div className="border border-slate-800 rounded-xl p-4 bg-slate-950/60">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    Manifes Barang / Items ({items.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-lg hover:bg-indigo-600/30 transition-all flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Tambah Baris Barang
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-slate-900/90 border border-slate-800 rounded-xl p-3 items-center"
                    >
                      <div className="sm:col-span-3">
                        <label className="text-[10px] text-slate-400 block">Kode SKU</label>
                        <input
                          type="text"
                          value={item.sku}
                          onChange={(e) => {
                            const copy = [...items];
                            copy[index].sku = e.target.value;
                            setItems(copy);
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs outline-none"
                        />
                      </div>

                      <div className="sm:col-span-4">
                        <label className="text-[10px] text-slate-400 block">Nama Produk</label>
                        <input
                          type="text"
                          value={item.productName}
                          onChange={(e) => {
                            const copy = [...items];
                            copy[index].productName = e.target.value;
                            setItems(copy);
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-slate-400 block">Jumlah</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const copy = [...items];
                            copy[index].quantity = parseInt(e.target.value) || 1;
                            setItems(copy);
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-slate-400 block">Berat (kg)</label>
                        <input
                          type="number"
                          value={item.weightKg}
                          onChange={(e) => {
                            const copy = [...items];
                            copy[index].weightKg = parseFloat(e.target.value) || 0;
                            setItems(copy);
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs outline-none"
                        />
                      </div>

                      <div className="sm:col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors mt-3"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/30"
                >
                  <CheckCircle className="w-4 h-4" />
                  Simpan Pesanan Resmi
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
