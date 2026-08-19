/**
 * Fleet Intelligence Smart AI - Delivery Detail & Audit Timeline Modal
 */

import React from 'react';
import { Delivery } from '../deliveryTypes';
import { deliveryService } from '../services/deliveryService';
import { deliveryPODService } from '../services/deliveryPODService';
import {
  X,
  Truck,
  MapPin,
  Calendar,
  Clock,
  UserCheck,
  Package,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  History,
  FileCheck2,
  ShieldCheck,
} from 'lucide-react';

interface DeliveryDetailModalProps {
  delivery: Delivery | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenPodModal: (delivery: Delivery) => void;
  onOpenTrackingModal: (delivery: Delivery) => void;
}

export const DeliveryDetailModal: React.FC<DeliveryDetailModalProps> = ({
  delivery,
  isOpen,
  onClose,
  onOpenPodModal,
  onOpenTrackingModal,
}) => {
  if (!isOpen || !delivery) return null;

  const events = deliveryService.getEventsForDelivery(delivery.id);
  const pod = delivery.podId ? deliveryPODService.getPODByDeliveryId(delivery.podId) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{delivery.deliveryNumber}</h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                  Order: {delivery.orderNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Pelanggan: <strong className="text-slate-200">{delivery.customerName}</strong>
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Top Status & Quick Action Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Status Pengiriman</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-base font-bold text-emerald-400">{delivery.status}</span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono uppercase">
                  Prioritas: {delivery.priority}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenTrackingModal(delivery)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Live Customer Tracking
              </button>

              <button
                onClick={() => onOpenPodModal(delivery)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Input / Lihat POD
              </button>
            </div>
          </div>

          {/* Grid Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Driver & Vehicle */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
              <h3 className="font-bold text-slate-200 text-xs flex items-center gap-1.5 pb-2 border-b border-slate-800">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                Armada & Pengemudi Ditugaskan
              </h3>

              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div>
                  <span className="text-[10px] text-slate-500 block">Nama Driver:</span>
                  <span className="font-semibold text-slate-100">{delivery.driverName || 'Belum Ditugaskan'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Nomor Kontak:</span>
                  <span className="text-slate-300">{delivery.driverPhone || '-'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Plat Nomor Unit:</span>
                  <span className="font-mono text-indigo-400 font-bold">{delivery.vehiclePlate || '-'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Nomor Trip:</span>
                  <span className="font-mono text-slate-300">{delivery.tripNumber || '-'}</span>
                </div>
              </div>
            </div>

            {/* Schedule & Address */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
              <h3 className="font-bold text-slate-200 text-xs flex items-center gap-1.5 pb-2 border-b border-slate-800">
                <Calendar className="w-4 h-4 text-amber-400" />
                Jadwal & Lokasi Tujuan
              </h3>

              <div className="space-y-1.5 text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    Jendela Waktu: <strong>{delivery.scheduledDate} ({delivery.scheduledTimeStart} - {delivery.scheduledTimeEnd} WIB)</strong>
                  </span>
                </div>

                <div className="flex items-start gap-2 pt-1 border-t border-slate-800/40">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <span className="text-[11px] text-slate-300 leading-relaxed">{delivery.deliveryAddress}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Manifest Table */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <h3 className="font-bold text-slate-200 text-xs flex items-center gap-1.5 mb-3">
              <Package className="w-4 h-4 text-indigo-400" />
              Manifes Barang Pengiriman ({delivery.items.length} SKU)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 text-[10px] font-semibold uppercase">
                    <th className="py-2 px-3">Nama Produk</th>
                    <th className="py-2 px-3 text-center">Jumlah Dipesan</th>
                    <th className="py-2 px-3 text-center">Diterima (POD)</th>
                    <th className="py-2 px-3 text-center">Ditolak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {delivery.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2.5 px-3 font-semibold text-white">{item.productName}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-indigo-400">{item.quantity}</td>
                      <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">{item.receivedQuantity}</td>
                      <td className="py-2.5 px-3 text-center text-rose-400 font-bold">{item.rejectedQuantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Proof of Delivery (POD) Snapshot if available */}
          {pod && (
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
                <span className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4" />
                  Bukti Penyerahan Digital (POD Verified)
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  Diterima: {new Date(pod.deliveredAt).toLocaleString('id-ID')}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-slate-400">Penerima Resmi:</div>
                  <div className="font-bold text-white mt-0.5">{pod.recipientName} ({pod.recipientRole})</div>
                  <div className="text-slate-400 mt-1">Telp: {pod.recipientPhone}</div>
                  {pod.notes && <div className="text-slate-300 mt-1 italic bg-slate-900/60 p-2 rounded">"{pod.notes}"</div>}
                </div>

                {pod.photos && pod.photos.length > 0 && (
                  <div>
                    <div className="text-slate-400 mb-1.5">Foto Bukti Penyerahan ({pod.photos.length}):</div>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {pod.photos.map((ph) => (
                        <img
                          key={ph.id}
                          src={ph.fileUrl}
                          alt="POD Proof"
                          className="w-16 h-16 object-cover rounded-lg border border-slate-700"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Audit Trail Timeline */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <h3 className="font-bold text-slate-200 text-xs flex items-center gap-1.5 mb-3">
              <History className="w-4 h-4 text-amber-400" />
              Jejak Riwayat Aktivitas (Audit Timeline)
            </h3>

            <div className="relative pl-4 border-l-2 border-slate-800 space-y-4 text-xs">
              {events.map((evt) => (
                <div key={evt.id} className="relative group">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-slate-900" />
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 capitalize">{evt.eventType.replace(/_/g, ' ')}</span>
                    <span className="text-[10px] text-slate-500">{new Date(evt.timestamp).toLocaleString('id-ID')}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">{evt.details}</p>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Oleh: {evt.performedBy}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
