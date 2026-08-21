import React, { useState } from 'react';
import {
  Share2,
  Copy,
  ExternalLink,
  MessageSquare,
  Smartphone,
  CheckCircle2,
  MapPin,
  Clock,
  Package,
  Bike,
  Check
} from 'lucide-react';
import { pudService } from '../../../modules/pud/services/pudService';
import { PudOrder } from '../../../modules/pud/types';

export const PudTrackingLinkTab: React.FC = () => {
  const [orders] = useState<PudOrder[]>(pudService.getOrders());
  const [selectedOrder, setSelectedOrder] = useState<PudOrder>(orders[0]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [waSentNotice, setWaSentNotice] = useState(false);

  const publicLink = `https://track.fleetintelligence.id/pud/${selectedOrder.publicTrackingCode}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(publicLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleSendWa = () => {
    setWaSentNotice(true);
    setTimeout(() => setWaSentNotice(false), 4000);
  };

  return (
    <div className="space-y-6" id="pud-tracking-link-tab">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-600" />
            Tautan Pelacakan Publik & Notifikasi Pelanggan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kirimkan link tracking live GPS ke WhatsApp/SMS pembeli untuk memantau posisi kurir secara transparan.
          </p>
        </div>
      </div>

      {/* Main Grid: Selector & Live Customer View Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Select Order */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
          <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
            Pilih Paket Kiriman
          </h3>

          <div className="space-y-2 max-h-[420px] overflow-y-auto">
            {orders.map((o) => {
              const isSelected = selectedOrder.id === o.id;
              return (
                <div
                  key={o.id}
                  onClick={() => setSelectedOrder(o)}
                  className={`p-3 rounded-xl border cursor-pointer transition ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/60 shadow-sm'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-indigo-700">{o.trackingNumber}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {o.serviceType}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 mt-1">{o.recipient.contactName}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{o.recipient.addressLine}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Public Customer Screen Simulator */}
        <div className="lg:col-span-2 space-y-4">
          {/* Share Actions Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <span className="text-xs font-bold text-slate-700 block">Tautan Pelacakan Publik (Shareable URL)</span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={publicLink}
                className="flex-1 px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Tersalin' : 'Salin'}</span>
              </button>
              <button
                onClick={handleSendWa}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Kirim WhatsApp</span>
              </button>
            </div>

            {waSentNotice && (
              <p className="text-xs font-bold text-emerald-700 bg-emerald-50 p-2 rounded-lg">
                Notifikasi pesan WhatsApp berisi link tracking berhasil dikirim ke {selectedOrder.recipient.phone}.
              </p>
            )}
          </div>

          {/* Customer Mobile Mockup Preview */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-white space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <span className="text-slate-400 font-mono">TAMPILAN DI SMARTPHONE PELANGGAN</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Kurir Menuju Lokasi Anda
              </span>
            </div>

            <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs text-indigo-400 font-mono font-bold block">{selectedOrder.trackingNumber}</span>
              <h3 className="text-base font-black">{selectedOrder.parcel.description}</h3>
              <p className="text-xs text-slate-300">Pengirim: {selectedOrder.merchantName}</p>
              <p className="text-xs text-slate-300">Tujuan: {selectedOrder.recipient.addressLine}</p>
            </div>

            <div className="p-4 bg-indigo-950/60 rounded-xl border border-indigo-900 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                  <Bike className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-white block">{selectedOrder.assignedCourierName || 'Budi Santoso'}</span>
                  <span className="text-indigo-300 text-[11px]">Kurir Pengantar • {selectedOrder.vehiclePlate || 'B 4120 TXY'}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-indigo-300 uppercase block">Estimasi Tiba</span>
                <span className="font-black text-amber-400 text-sm">15 - 20 Menit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
