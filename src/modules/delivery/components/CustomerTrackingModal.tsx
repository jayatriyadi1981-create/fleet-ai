/**
 * Fleet Intelligence Smart AI - Customer Public Live Tracking Simulation Modal
 */

import React, { useState } from 'react';
import { Delivery } from '../deliveryTypes';
import { deliveryTrackingService } from '../services/deliveryTrackingService';
import {
  X,
  Truck,
  MapPin,
  Clock,
  User,
  PhoneCall,
  CheckCircle2,
  Copy,
  Check,
  Package,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

interface CustomerTrackingModalProps {
  delivery: Delivery | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerTrackingModal: React.FC<CustomerTrackingModalProps> = ({
  delivery,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !delivery) return null;

  const trackingToken = delivery.trackingToken || 'tr-token-default';
  const trackingPayload = deliveryTrackingService.getPublicTrackingPayload(trackingToken);
  const shareableUrl = deliveryTrackingService.generateTrackingUrl(trackingToken);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    { title: 'Pesanan Dikonfirmasi', done: true, time: '14 Ags 08:30 WIB' },
    { title: 'DiMuat & Berangkat', done: delivery.status !== 'PENDING' && delivery.status !== 'ASSIGNED', time: '15 Ags 08:00 WIB' },
    { title: 'Dalam Perjalanan', done: delivery.status === 'OUT_FOR_DELIVERY' || delivery.status === 'ARRIVED' || delivery.status === 'DELIVERED', time: '15 Ags 09:15 WIB' },
    { title: 'Tiba di Lokasi Tujuan', done: delivery.status === 'ARRIVED' || delivery.status === 'DELIVERED', time: delivery.actualArrivalAt ? new Date(delivery.actualArrivalAt).toLocaleTimeString('id-ID') : 'Estimasi 10:45 WIB' },
    { title: 'Selesai Terkirim (POD)', done: delivery.status === 'DELIVERED', time: delivery.podId ? 'Telah Diverifikasi' : '-' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Public Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-500/10 text-sky-400 rounded-xl">
              <Truck className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Public Customer Live Tracking</h2>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                  SSL Encrypted Link
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulasi halaman yang dilihat oleh pelanggan tanpa membuka data rahasia internal.
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

        {/* Shareable Link Bar */}
        <div className="bg-slate-950 px-5 py-3 border-b border-slate-800/80 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 overflow-hidden text-slate-400">
            <ExternalLink className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
            <span className="font-mono text-slate-300 truncate">{shareableUrl}</span>
          </div>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all flex-shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Tercopy!' : 'Salin Link Pelanggan'}
          </button>
        </div>

        {/* Live Public View Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-950/40">
          {/* Status Header Card */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Estimasi Tiba (ETA)</span>
                <h3 className="text-2xl font-black text-emerald-400 mt-0.5">
                  {trackingPayload?.eta || '10:45 WIB'}
                </h3>
                <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  Tujuan: <strong>{delivery.customerName}</strong> — {delivery.deliveryAddress}
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-right">
                <span className="text-[10px] text-slate-400 block">No. Pengiriman</span>
                <span className="text-sm font-bold text-white font-mono">{delivery.deliveryNumber}</span>
              </div>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h4 className="font-bold text-xs text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sky-400" />
              Progres Lacak Pengiriman Real-Time
            </h4>

            <div className="relative pl-6 border-l-2 border-slate-800 space-y-5 text-xs">
              {steps.map((st, idx) => (
                <div key={idx} className="relative group">
                  <div
                    className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      st.done
                        ? 'bg-emerald-500 text-slate-950 font-bold ring-4 ring-slate-900'
                        : 'bg-slate-800 text-slate-500 ring-4 ring-slate-900'
                    }`}
                  >
                    {st.done ? '✓' : idx + 1}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold ${st.done ? 'text-white' : 'text-slate-500'}`}>
                      {st.title}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{st.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Driver Info & Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Driver */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <h4 className="font-bold text-slate-300 flex items-center gap-1.5 pb-2 border-b border-slate-800">
                <User className="w-4 h-4 text-indigo-400" />
                Informasi Kurir / Pengemudi
              </h4>

              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Pengemudi:</span>
                  <span className="font-bold text-white">{delivery.driverName || 'Armada Logistik'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Plat Nomor Unit:</span>
                  <span className="font-mono text-indigo-400 font-bold">{delivery.vehiclePlate || 'B 9821 UTX'}</span>
                </div>
                {delivery.driverPhone && (
                  <div className="pt-2 border-t border-slate-800/60 flex items-center gap-2">
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">{delivery.driverPhone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <h4 className="font-bold text-slate-300 flex items-center gap-1.5 pb-2 border-b border-slate-800">
                <Package className="w-4 h-4 text-amber-400" />
                Daftar Barang Kargo ({delivery.items.length} Jenis)
              </h4>

              <div className="space-y-1">
                {delivery.items.map((it) => (
                  <div key={it.id} className="flex justify-between text-slate-300 py-0.5 border-b border-slate-800/40">
                    <span className="truncate pr-2">{it.productName}</span>
                    <span className="font-bold text-indigo-400">{it.quantity} Pcs</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
