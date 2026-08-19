/**
 * Fleet Intelligence Smart AI - Deliveries Master Table View
 */

import React from 'react';
import { Delivery, DeliveryStatus, DeliveryPriority } from '../deliveryTypes';
import {
  Truck,
  UserCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ExternalLink,
  MapPin,
  Calendar,
  MoreVertical,
  QrCode,
  ShieldAlert,
} from 'lucide-react';

interface DeliveriesTableProps {
  deliveries: Delivery[];
  onViewDetail: (delivery: Delivery) => void;
  onOpenPodModal: (delivery: Delivery) => void;
  onOpenTrackingModal: (delivery: Delivery) => void;
  onOpenRescheduleModal: (delivery: Delivery) => void;
  onUpdateStatus: (deliveryId: string, newStatus: DeliveryStatus) => void;
}

export const DeliveriesTable: React.FC<DeliveriesTableProps> = ({
  deliveries,
  onViewDetail,
  onOpenPodModal,
  onOpenTrackingModal,
  onOpenRescheduleModal,
  onUpdateStatus,
}) => {
  const getStatusBadge = (status: DeliveryStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700 rounded-lg">
            Pending
          </span>
        );
      case 'ASSIGNED':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg">
            Assigned
          </span>
        );
      case 'OUT_FOR_DELIVERY':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-lg flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            Out For Delivery
          </span>
        );
      case 'ARRIVED':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg">
            Arrived / Tiba
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Delivered
          </span>
        );
      case 'FAILED':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            Gagal / Failed
          </span>
        );
      case 'RESCHEDULED':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg">
            Rescheduled
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold bg-slate-800 text-slate-400 rounded-lg">
            {status}
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: DeliveryPriority) => {
    switch (priority) {
      case 'CRITICAL':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-md uppercase">
            CRITICAL
          </span>
        );
      case 'URGENT':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-md uppercase">
            URGENT
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-500/10 text-amber-400 rounded-md uppercase">
            HIGH
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-800 text-slate-400 rounded-md uppercase">
            {priority}
          </span>
        );
    }
  };

  if (deliveries.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
        <div className="w-12 h-12 bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Truck className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-white">Tidak ada data pengiriman</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Tidak ditemukan pengiriman yang sesuai dengan kriteria pencarian atau filter yang Anda pilih.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <th className="py-3.5 px-4">No. Delivery & Order</th>
              <th className="py-3.5 px-4">Pelanggan & Alamat Tujuan</th>
              <th className="py-3.5 px-4">Pengemudi & Kendaraan</th>
              <th className="py-3.5 px-4">Jadwal & Jendela Waktu</th>
              <th className="py-3.5 px-4">Prioritas & Status</th>
              <th className="py-3.5 px-4 text-center">Status POD</th>
              <th className="py-3.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {deliveries.map((delivery) => (
              <tr
                key={delivery.id}
                className="hover:bg-slate-800/40 transition-colors group"
              >
                {/* No Delivery & Order */}
                <td className="py-3.5 px-4 align-top">
                  <div className="font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {delivery.deliveryNumber}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <FileText className="w-3 h-3 text-slate-500" />
                    {delivery.orderNumber}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {delivery.items.length} Barang ({delivery.items.reduce((a, b) => a + b.quantity, 0)} Pcs)
                  </div>
                </td>

                {/* Customer & Address */}
                <td className="py-3.5 px-4 align-top max-w-xs">
                  <div className="font-semibold text-slate-200 truncate">
                    {delivery.customerName}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 flex items-start gap-1">
                    <MapPin className="w-3 h-3 text-rose-400 flex-shrink-0 mt-0.5" />
                    <span>{delivery.deliveryAddress}</span>
                  </div>
                </td>

                {/* Driver & Vehicle */}
                <td className="py-3.5 px-4 align-top">
                  {delivery.driverName ? (
                    <div>
                      <div className="font-medium text-slate-200 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                        {delivery.driverName}
                      </div>
                      <div className="text-[11px] text-indigo-400 font-mono mt-0.5">
                        {delivery.vehiclePlate}
                      </div>
                    </div>
                  ) : (
                    <span className="text-[11px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Belum Ditugaskan
                    </span>
                  )}
                </td>

                {/* Schedule & Time Window */}
                <td className="py-3.5 px-4 align-top">
                  <div className="text-slate-300 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {delivery.scheduledDate}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {delivery.scheduledTimeStart} - {delivery.scheduledTimeEnd} WIB
                  </div>
                  {delivery.actualArrivalAt && (
                    <div className="text-[10px] text-emerald-400 mt-0.5">
                      Tiba: {new Date(delivery.actualArrivalAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </td>

                {/* Priority & Status */}
                <td className="py-3.5 px-4 align-top">
                  <div className="flex flex-col gap-1.5 items-start">
                    {getStatusBadge(delivery.status)}
                    {getPriorityBadge(delivery.priority)}
                  </div>
                </td>

                {/* POD Status */}
                <td className="py-3.5 px-4 align-top text-center">
                  {delivery.podId ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">
                      <CheckCircle2 className="w-3 h-3" />
                      POD Verified
                    </span>
                  ) : delivery.status === 'DELIVERED' ? (
                    <button
                      onClick={() => onOpenPodModal(delivery)}
                      className="px-2 py-1 text-[10px] font-semibold bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 rounded-md transition-all"
                    >
                      + Complete POD
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-500">Pending Arrival</span>
                  )}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 align-top text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* View Details */}
                    <button
                      onClick={() => onViewDetail(delivery)}
                      title="Lihat Detail Delivery"
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>

                    {/* Customer Public Live Tracking */}
                    <button
                      onClick={() => onOpenTrackingModal(delivery)}
                      title="Buka Customer Live Tracking"
                      className="p-1.5 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 border border-indigo-500/30 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    {/* Submit POD */}
                    <button
                      onClick={() => onOpenPodModal(delivery)}
                      title="Input Bukti POD"
                      className="p-1.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 rounded-lg transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Reschedule */}
                    <button
                      onClick={() => onOpenRescheduleModal(delivery)}
                      title="Reschedule Pengiriman"
                      className="p-1.5 bg-amber-600/20 hover:bg-amber-600/40 text-amber-400 border border-amber-500/30 rounded-lg transition-colors"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
