import React, { useState } from 'react';
import {
  Sparkles,
  RotateCw,
  Users,
  Package,
  Bike,
  Truck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Filter,
  Check
} from 'lucide-react';
import { pudService } from '../../../modules/pud/services/pudService';
import { PudOrder, PudCourier } from '../../../modules/pud/types';

export const PudDispatchTab: React.FC = () => {
  const [orders, setOrders] = useState<PudOrder[]>(pudService.getOrders());
  const [couriers, setCouriers] = useState<PudCourier[]>(pudService.getCouriers());
  const [dispatchLogs, setDispatchLogs] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCourierId, setSelectedCourierId] = useState<string>(couriers[0]?.id || '');
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');

  const pendingOrders = orders.filter(o => o.status === 'PENDING_PICKUP');

  const handleAutoDispatch = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const result = pudService.autoDispatchPendingOrders();
      setOrders(pudService.getOrders());
      setCouriers(pudService.getCouriers());
      setDispatchLogs(result.messages);
      setIsProcessing(false);
    }, 600);
  };

  const handleManualAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId || !selectedCourierId) return;

    pudService.assignCourierToOrder(selectedOrderId, selectedCourierId);
    setOrders(pudService.getOrders());
    setCouriers(pudService.getCouriers());
    setDispatchLogs([`Manual: Order ${selectedOrderId} berhasil dialokasikan.`]);
    setSelectedOrderId('');
  };

  return (
    <div className="space-y-6" id="pud-dispatch-tab">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-6 rounded-2xl text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-400 text-slate-950">
              AI Smart Dispatcher
            </span>
            <span className="text-xs text-indigo-300">Nearest Radius & Capacity Matching</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            Papan Kontrol Dispatch & Alokasi Kurir
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Algoritma otomatisasi penugasan kurir berbasis lokasi GPS terdekat, kapasitas sisa berat (kg/volume), dan jenis armada.
          </p>
        </div>

        <button
          onClick={handleAutoDispatch}
          disabled={isProcessing || pendingOrders.length === 0}
          id="pud-btn-trigger-autodispatch"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition disabled:opacity-50"
        >
          <Zap className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
          <span>{isProcessing ? 'Memproses Algoritma...' : `Eksekusi Auto-Dispatch (${pendingOrders.length} Pending)`}</span>
        </button>
      </div>

      {/* Dispatch Engine Logs */}
      {dispatchLogs.length > 0 && (
        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-1">
          <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            Hasil Log Alokasi Dispatcher:
          </span>
          {dispatchLogs.map((log, idx) => (
            <p key={idx} className="text-xs text-indigo-800 font-medium pl-5">• {log}</p>
          ))}
        </div>
      )}

      {/* Main Grid: Pending Queue vs Available Fleet */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Pending Pickup / Delivery Queue */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-500" />
                Antrean Order Menunggu Kurir ({pendingOrders.length})
              </h3>
              <p className="text-xs text-slate-500">Order yang belum dialokasikan ke rider/driver</p>
            </div>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto">
            {pendingOrders.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
                <Check className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                Semua order telah berhasil dialokasikan ke kurir.
              </div>
            ) : (
              pendingOrders.map((order) => (
                <div key={order.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {order.trackingNumber}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 uppercase">
                      {order.serviceType}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{order.merchantName}</h4>
                    <p className="text-[11px] text-slate-600">Alamat: {order.sender.addressLine}, {order.sender.district}</p>
                    <p className="text-[11px] text-slate-500">Barang: {order.parcel.description} ({order.parcel.weightKg} kg)</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Available Fleet & Manual Assignment Form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                Kapasitas Kurir Online & Manual Assignment
              </h3>
              <p className="text-xs text-slate-500">Pilih kurir secara manual jika diperlukan</p>
            </div>
          </div>

          <form onSubmit={handleManualAssign} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-700 block">Manual Dispatch Assignment</span>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Pilih Order Pending</label>
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">-- Pilih Paket --</option>
                {pendingOrders.map(o => (
                  <option key={o.id} value={o.id}>
                    {o.trackingNumber} - {o.merchantName} ({o.parcel.weightKg} kg)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Pilih Kurir Tujuan</label>
              <select
                value={selectedCourierId}
                onChange={(e) => setSelectedCourierId(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
              >
                {couriers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.vehiclePlate} - {c.vehicleType}) • Sisa Kapasitas: {c.maxCapacityKg - c.currentLoadedKg} kg
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={!selectedOrderId}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow transition disabled:opacity-50"
            >
              Tugaskan Kurir Manual
            </button>
          </form>

          {/* Courier Load Progress Bars */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-slate-600 block">Status Beban Muatan Armada:</span>
            {couriers.slice(0, 4).map(c => {
              const pct = Math.min(100, Math.round((c.currentLoadedKg / c.maxCapacityKg) * 100));
              return (
                <div key={c.id} className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-800">{c.name} ({c.vehiclePlate})</span>
                    <span className="font-bold text-slate-600">{c.currentLoadedKg} / {c.maxCapacityKg} kg ({pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${pct > 80 ? 'bg-rose-500' : pct > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
