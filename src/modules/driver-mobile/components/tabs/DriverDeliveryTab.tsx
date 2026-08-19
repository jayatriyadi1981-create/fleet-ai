import React, { useState } from 'react';
import {
  Package,
  PackageCheck,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  User,
  AlertCircle,
  FileSignature,
  Navigation,
} from 'lucide-react';
import { Delivery } from '../../../delivery/deliveryTypes';
import { ProofOfDeliveryModal } from '../modals/ProofOfDeliveryModal';
import { driverSessionService } from '../../services/driverSessionService';
import { deliveryService } from '../../../delivery/services/deliveryService';

interface DriverDeliveryTabProps {
  onRefresh: () => void;
}

export const DriverDeliveryTab: React.FC<DriverDeliveryTabProps> = ({ onRefresh }) => {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'DELIVERED' | 'FAILED'>('ALL');
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [isPodOpen, setIsPodOpen] = useState(false);

  const deliveries = driverSessionService.getDeliveries();

  const filteredDeliveries = deliveries.filter(d => {
    if (filter === 'PENDING') return d.status === 'OUT_FOR_DELIVERY' || d.status === 'ARRIVED';
    if (filter === 'DELIVERED') return d.status === 'DELIVERED';
    if (filter === 'FAILED') return d.status === 'FAILED';
    return true;
  });

  const handleOpenPOD = (d: Delivery) => {
    setSelectedDelivery(d);
    setIsPodOpen(true);
  };

  const handleMarkArrived = (d: Delivery) => {
    deliveryService.markArrived(d.id);
    driverSessionService.logActivity({
      title: `Tiba di Lokasi: ${d.customerName}`,
      description: `Armada telah sampai di alamat tujuan pengiriman ${d.deliveryNumber}.`,
      iconType: 'DELIVERY',
      badge: 'ARRIVED',
    });
    onRefresh();
  };

  const completedCount = deliveries.filter(d => d.status === 'DELIVERED').length;
  const pendingCount = deliveries.filter(d => d.status === 'OUT_FOR_DELIVERY' || d.status === 'ARRIVED').length;

  return (
    <div className="space-y-4 pb-24">
      {/* Header Summary Banner */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white">Daftar Pengiriman (Deliveries)</h2>
          <p className="text-[11px] text-slate-400">Total {deliveries.length} Pengiriman Hari Ini</p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
            {completedCount} Selesai
          </span>
          <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-bold">
            {pendingCount} Pending
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
        {(['ALL', 'PENDING', 'DELIVERED', 'FAILED'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`py-1.5 rounded-xl font-bold transition text-[11px] ${
              filter === tab
                ? 'bg-cyan-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab === 'ALL' ? 'Semua' : tab === 'PENDING' ? 'Pending' : tab === 'DELIVERED' ? 'Sukses' : 'Gagal'}
          </button>
        ))}
      </div>

      {/* Delivery Cards List */}
      <div className="space-y-3">
        {filteredDeliveries.length === 0 ? (
          <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl text-slate-500 space-y-2">
            <Package className="w-8 h-8 mx-auto opacity-40" />
            <p className="text-xs">Tidak ada pengiriman dalam kategori ini.</p>
          </div>
        ) : (
          filteredDeliveries.map(d => (
            <div
              key={d.id}
              className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold text-cyan-400">{d.deliveryNumber}</span>
                  <h3 className="text-sm font-bold text-white mt-0.5">{d.customerName}</h3>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                    d.status === 'DELIVERED'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : d.status === 'FAILED'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      : d.status === 'ARRIVED'
                      ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                      : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                  }`}
                >
                  {d.status}
                </span>
              </div>

              {/* Address */}
              <div className="flex items-start gap-2 text-xs text-slate-300">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <p className="line-clamp-2 leading-relaxed">{d.deliveryAddress}</p>
              </div>

              {/* Items summary */}
              <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Total Barang: <b className="text-white">{d.items.length} Macam</b></span>
                <span>Penerima: <b className="text-white">{d.recipientName || '-'}</b></span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                {d.status === 'OUT_FOR_DELIVERY' && (
                  <button
                    onClick={() => handleMarkArrived(d)}
                    className="flex-1 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Tiba di Lokasi</span>
                  </button>
                )}

                {(d.status === 'OUT_FOR_DELIVERY' || d.status === 'ARRIVED') && (
                  <button
                    onClick={() => handleOpenPOD(d)}
                    className="flex-1 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
                  >
                    <FileSignature className="w-4 h-4" />
                    <span>Proses POD (TTD & Foto)</span>
                  </button>
                )}

                {d.status === 'DELIVERED' && (
                  <div className="w-full py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center font-bold text-xs flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>POD Terverifikasi & Selesai</span>
                  </div>
                )}

                {d.status === 'FAILED' && (
                  <div className="w-full py-2 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-center font-bold text-xs flex items-center justify-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>Pengiriman Gagal: {d.failureReason || 'Alasan Tercatat'}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Proof of Delivery Modal */}
      <ProofOfDeliveryModal
        delivery={selectedDelivery}
        isOpen={isPodOpen}
        onClose={() => setIsPodOpen(false)}
        onCompleted={() => {
          onRefresh();
        }}
      />
    </div>
  );
};
