import React, { useState } from 'react';
import {
  Package,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  DollarSign,
  ArrowUpRight,
  Sparkles,
  MapPin,
  Truck,
  ShieldCheck,
  Bike,
  RefreshCw,
  Search,
  Filter,
  Navigation
} from 'lucide-react';
import { pudService } from '../../../modules/pud/services/pudService';
import { PudOrder, PudCourier } from '../../../modules/pud/types';

interface PudControlTowerTabProps {
  onNavigateTab: (tabId: string) => void;
}

export const PudControlTowerTab: React.FC<PudControlTowerTabProps> = ({ onNavigateTab }) => {
  const [kpis, setKpis] = useState(pudService.getKpis());
  const [orders, setOrders] = useState<PudOrder[]>(pudService.getOrders());
  const [couriers, setCouriers] = useState<PudCourier[]>(pudService.getCouriers());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterService, setFilterService] = useState<string>('ALL');

  const filteredOrders = orders.filter(o => {
    const matchSearch = 
      o.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.recipient.contactName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchService = filterService === 'ALL' || o.serviceType === filterService;
    return matchSearch && matchService;
  });

  const handleRefresh = () => {
    setKpis(pudService.getKpis());
    setOrders(pudService.getOrders());
    setCouriers(pudService.getCouriers());
  };

  return (
    <div className="space-y-6" id="pud-control-tower-tab">
      {/* Top Banner & Action Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">
              Live Operations Control
            </span>
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              99.98% System Uptime
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            Menara Kendali Pickup & Delivery (PUD Tower)
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Monitoring real-time pergerakan kurir motor & van, pemenuhan SLA Instant/Same-day, dan rekonsiliasi COD kasir.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            id="pud-btn-refresh-tower"
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold border border-slate-700 transition"
          >
            <RefreshCw className="w-4 h-4 text-indigo-400" />
            <span>Segarkan Data</span>
          </button>
          <button
            onClick={() => onNavigateTab('dispatch')}
            id="pud-btn-quick-dispatch"
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/30 transition"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Auto-Dispatch AI</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-indigo-200 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Order Hari Ini</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{kpis.totalOrdersToday}</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +14.2%
            </span>
          </div>
          <span className="text-xs text-slate-400 mt-1 block">Termasuk Instant, Same-Day & Cargo</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-emerald-200 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">On-Time Delivery (SLA)</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">{kpis.onTimeDeliveryRatePct}%</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">Target &gt;96%</span>
          </div>
          <span className="text-xs text-slate-400 mt-1 block">Rata-rata Instant: {kpis.averageDeliveryDurationMins} Menit</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-amber-200 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kurir On-Duty</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{kpis.activeCouriersOnDuty}</span>
            <span className="text-xs font-medium text-slate-500">Riders & Drivers</span>
          </div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">Kepuasan CSAT: {kpis.customerSatisfactionScore} / 5.0 ⭐</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-blue-200 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">COD Terkumpul Hari Ini</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-black text-slate-900">Rp {(kpis.totalCodCollectedToday / 1000000).toFixed(1)} Jt</span>
            <span className="text-xs font-semibold text-indigo-600">Disetor: {(kpis.totalCodRemittedToday / 1000000).toFixed(1)} Jt</span>
          </div>
          <span className="text-xs text-slate-400 mt-1 block">32.8% Dibayar via QRIS on Delivery</span>
        </div>
      </div>

      {/* Interactive Operational Map & Active Couriers Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Active Live Operations Matrix */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Navigation className="w-4 h-4 text-indigo-600" />
                Live PUD Operations Matrix (Jabodetabek Hub)
              </h2>
              <p className="text-xs text-slate-500">Daftar paket aktif dalam status penjemputan & pengantaran</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari resi / merchant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 w-40 sm:w-52"
                />
              </div>
              <select
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-slate-700"
              >
                <option value="ALL">Semua Layanan</option>
                <option value="INSTANT">Instant</option>
                <option value="SAME_DAY">Same-Day</option>
                <option value="CARGO_BULKY">Cargo Bulky</option>
              </select>
            </div>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[420px]">
            {filteredOrders.map((order) => (
              <div key={order.id} className="p-4 hover:bg-slate-50/80 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
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
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      order.status === 'DELIVERED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.status === 'FAILED_DELIVERY'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-800">{order.merchantName} &rarr; {order.recipient.contactName}</p>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {order.recipient.addressLine}, {order.recipient.district}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1">
                  <div className="text-right">
                    <span className="text-xs font-black text-slate-900 block">Rp {order.deliveryFee.toLocaleString()}</span>
                    {order.codAmount ? (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 block mt-0.5">
                        COD: Rp {order.codAmount.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-600 font-semibold">Prepaid</span>
                    )}
                  </div>
                  {order.assignedCourierName && (
                    <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                      <Bike className="w-3 h-3 text-indigo-500" />
                      {order.assignedCourierName}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span>Menampilkan {filteredOrders.length} order aktif</span>
            <button
              onClick={() => onNavigateTab('deliveries')}
              className="text-indigo-600 font-bold hover:underline"
            >
              Lihat Semua Order Pengiriman &rarr;
            </button>
          </div>
        </div>

        {/* Right: Courier Live Fleet Status */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  Status Kurir Terdekat
                </h3>
                <p className="text-xs text-slate-500">Posisi GPS & kapasitas muatan</p>
              </div>
              <button
                onClick={() => onNavigateTab('live_couriers')}
                className="text-xs text-indigo-600 font-bold hover:underline"
              >
                Radar GPS
              </button>
            </div>

            <div className="space-y-3 mt-3">
              {couriers.map((c) => (
                <div key={c.id} className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition border border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden font-bold text-xs flex items-center justify-center text-slate-700">
                        {c.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-bold text-xs text-slate-800 block">{c.name}</span>
                        <span className="text-[10px] text-slate-500">{c.vehiclePlate} • {c.vehicleType}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      c.status === 'ONLINE_AVAILABLE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : c.status === 'ON_DELIVERY' || c.status === 'ON_PICKUP'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {c.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600">
                    <span>Muatan: <strong>{c.currentLoadedKg} / {c.maxCapacityKg} kg</strong></span>
                    <span>Selesai: <strong>{c.todayCompletedDeliveries} drop</strong></span>
                    <span>Baterai: <strong>{c.batteryLevelPct}%</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigateTab('ai_copilot')}
              className="w-full py-2.5 px-3 bg-gradient-to-r from-indigo-50 to-indigo-100/60 hover:from-indigo-100 hover:to-indigo-200 text-indigo-900 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-indigo-200 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Buka AI PUD Dispatcher Copilot</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
