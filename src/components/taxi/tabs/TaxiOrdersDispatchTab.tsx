import React, { useState } from 'react';
import {
  Navigation,
  Search,
  Filter,
  Plus,
  PhoneCall,
  Smartphone,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Car,
  User
} from 'lucide-react';
import { taxiService } from '../../../modules/taxi/services/taxiService';
import { TaxiTripOrder } from '../../../modules/taxi/types';

export const TaxiOrdersDispatchTab: React.FC = () => {
  const [orders, setOrders] = useState<TaxiTripOrder[]>(taxiService.getOrders());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');

  // New Order Modal state
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPickup, setNewPickup] = useState('');
  const [newDropoff, setNewDropoff] = useState('');
  const [newSource, setNewSource] = useState<'CALL_CENTER' | 'MOBILE_APP' | 'HOTEL_CONCIERGE'>('CALL_CENTER');

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer || !newPickup || !newDropoff) return;

    const newOrder: TaxiTripOrder = {
      id: `ord-${Date.now()}`,
      bookingCode: `TX-BK-${Math.floor(1000 + Math.random() * 9000)}`,
      source: newSource,
      customerName: newCustomer,
      customerPhone: newPhone || '0812-xxxx-xxxx',
      pickupLocation: newPickup,
      dropoffLocation: newDropoff,
      assignedTaxiHull: 'TX-102',
      driverName: 'Dedi Kurniawan',
      fareAmountRp: 65000,
      tollFeeRp: 0,
      surchargeRp: 0,
      totalPaidRp: 65000,
      paymentMethod: 'QRIS',
      distanceKm: 7.2,
      durationMins: 24,
      startTime: 'Live Just Now',
      status: 'PICKING_UP',
    };

    setOrders([newOrder, ...orders]);
    setShowNewOrderModal(false);
    setNewCustomer('');
    setNewPhone('');
    setNewPickup('');
    setNewDropoff('');
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.dropoffLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.assignedTaxiHull.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    const matchesSource = sourceFilter === 'ALL' || o.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  return (
    <div id="taxi-orders-dispatch-tab" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 flex items-center space-x-2">
            <Navigation className="w-5 h-5 text-amber-400" />
            <span>Smart Dispatching, On-Demand Booking & Order Ritase</span>
          </h2>
          <p className="text-xs text-slate-400">Pusat penugasan pesanan taksi instan via Call Center, Aplikasi Mobile, Concierge Hotel & Street Hail</p>
        </div>

        <button
          onClick={() => setShowNewOrderModal(true)}
          className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Order Dispatch Baru</span>
        </button>
      </div>

      {/* Filter Controls */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kode booking, nama penumpang, lokasi jemput/tujuan, atau armada..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="p-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Semua Sumber Order</option>
            <option value="MOBILE_APP">Mobile App</option>
            <option value="CALL_CENTER">Call Center</option>
            <option value="HOTEL_CONCIERGE">Hotel Concierge</option>
            <option value="AIRPORT_STAGING">Pangkalan Bandara</option>
            <option value="STREET_HAIL">Street Hail</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Semua Status</option>
            <option value="IN_TRANSIT">In Transit (Jalan)</option>
            <option value="PICKING_UP">Picking Up (Jemput)</option>
            <option value="COMPLETED">Completed (Selesai)</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List Table */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Kode & Sumber</th>
                <th className="p-3.5">Penumpang</th>
                <th className="p-3.5">Rute Penjemputan & Tujuan</th>
                <th className="p-3.5">Armada & Driver</th>
                <th className="p-3.5">Jarak & Durasi</th>
                <th className="p-3.5">Tarif Argo</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3.5">
                    <div className="font-mono font-bold text-amber-400">{o.bookingCode}</div>
                    <div className="text-[10px] text-slate-400 uppercase mt-0.5">{o.source.replace('_', ' ')}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-slate-200">{o.customerName}</div>
                    {o.customerPhone && <div className="text-[11px] text-slate-400">{o.customerPhone}</div>}
                  </td>
                  <td className="p-3.5 max-w-xs">
                    <div className="text-slate-200 truncate flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                      <span className="truncate">{o.pickupLocation}</span>
                    </div>
                    <div className="text-slate-400 truncate flex items-center space-x-1 mt-1">
                      <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                      <span className="truncate">{o.dropoffLocation}</span>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-mono font-bold text-slate-200">{o.assignedTaxiHull}</div>
                    <div className="text-[11px] text-slate-400">{o.driverName}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-slate-200">{o.distanceKm} KM</div>
                    <div className="text-[11px] text-slate-400">~{o.durationMins} Menit</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-mono font-bold text-emerald-400">Rp {o.totalPaidRp.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-400 uppercase">{o.paymentMethod}</div>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        o.status === 'IN_TRANSIT'
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                          : o.status === 'PICKING_UP'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : o.status === 'COMPLETED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {o.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Order Modal */}
      {showNewOrderModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <Navigation className="w-4 h-4 text-amber-400" />
                <span>Buat Pesanan Dispatch Taksi Baru</span>
              </h3>
              <button
                onClick={() => setShowNewOrderModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Sumber Pemesanan</label>
                <select
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value as any)}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200"
                >
                  <option value="CALL_CENTER">Call Center 24/7 Hotline</option>
                  <option value="MOBILE_APP">Mobile App Booking</option>
                  <option value="HOTEL_CONCIERGE">Hotel Concierge</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Nama Penumpang *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bpk. Gunawan"
                    value={newCustomer}
                    onChange={(e) => setNewCustomer(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">No. Handphone / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="0812-xxxx-xxxx"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Titik Penjemputan (Pickup Address) *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Gedung Bursa Efek Indonesia Tower 2 Lobby"
                  value={newPickup}
                  onChange={(e) => setNewPickup(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Titik Tujuan (Destination) *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Terminal 3 Bandara Soekarno-Hatta"
                  value={newDropoff}
                  onChange={(e) => setNewDropoff(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400">
                Sistem Smart AI Dispatching akan otomatis mencocokkan armada terdekat dalam radius 2.5 KM (Unit Rekomendasi: TX-102 di Pangkalan Gambir, ETA 4 menit).
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewOrderModal(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded"
                >
                  Kirim Dispatch Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
