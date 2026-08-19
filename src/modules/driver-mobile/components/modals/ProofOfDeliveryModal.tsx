import React, { useState, useRef, useEffect } from 'react';
import {
  PackageCheck,
  CheckCircle2,
  XCircle,
  Camera,
  Eraser,
  X,
  AlertTriangle,
  Send,
  MapPin,
  Clock,
  UserCheck,
} from 'lucide-react';
import { Delivery, DeliveryFailureReason } from '../../../delivery/deliveryTypes';
import { deliveryService } from '../../../delivery/services/deliveryService';
import { mobileSyncService } from '../../services/mobileSyncService';
import { driverSessionService } from '../../services/driverSessionService';

interface ProofOfDeliveryModalProps {
  delivery: Delivery | null;
  isOpen: boolean;
  onClose: () => void;
  onCompleted: () => void;
}

export const ProofOfDeliveryModal: React.FC<ProofOfDeliveryModalProps> = ({
  delivery,
  isOpen,
  onClose,
  onCompleted,
}) => {
  const [mode, setMode] = useState<'SUCCESS_POD' | 'FAILED_DELIVERY'>('SUCCESS_POD');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [failureReason, setFailureReason] = useState<DeliveryFailureReason>('CUSTOMER_NOT_AVAILABLE');
  const [hasSignature, setHasSignature] = useState(false);
  const [photosCount, setPhotosCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Canvas Signature Pad
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    if (isOpen && delivery) {
      setRecipientName(delivery.recipientName || delivery.customerName || '');
      setRecipientPhone(delivery.recipientPhone || '081298765432');
      setHasSignature(false);
      setMode('SUCCESS_POD');

      setTimeout(() => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = '#22d3ee';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
          }
        }
      }, 100);
    }
  }, [isOpen, delivery]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isDrawingRef.current = true;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const handleClearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);
      }
    }
  };

  const handleSubmitPOD = async () => {
    if (!delivery) return;
    setIsSubmitting(true);

    try {
      if (mode === 'SUCCESS_POD') {
        const canvas = canvasRef.current;
        const sigData = canvas ? canvas.toDataURL() : undefined;

        deliveryService.completePOD(delivery.id, {
          recipientName: recipientName || 'Staff Gudang Penerima',
          recipientPhone: recipientPhone || '-',
          signatureDataUrl: sigData,
          signedBy: recipientName || 'Penerima',
          signedAt: new Date().toISOString(),
          notes: notes || 'Barang diterima lengkap dan kondisi baik.',
          latitude: delivery.latitude,
          longitude: delivery.longitude,
          photos: [
            {
              id: `pod_p_${Date.now()}`,
              deliveryId: delivery.id,
              fileUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&auto=format&fit=crop',
              type: 'PACKAGE',
              capturedAt: new Date().toISOString(),
              uploadedBy: 'Budi Santoso (Driver)',
            },
          ],
        });

        driverSessionService.logActivity({
          title: `Delivery Selesai: ${delivery.deliveryNumber}`,
          description: `POD tanda tangan digital & foto paket sukses diterima oleh ${recipientName}.`,
          iconType: 'DELIVERY',
          badge: 'DELIVERED',
        });
      } else {
        // Record Failure
        deliveryService.recordFailure(delivery.id, failureReason, notes || 'Pengiriman gagal diantarkan ke penerima.');

        driverSessionService.logActivity({
          title: `Pengiriman Gagal: ${delivery.deliveryNumber}`,
          description: `Alasan: ${failureReason}. Diteruskan ke Dispatcher.`,
          iconType: 'DELIVERY',
          badge: 'FAILED',
        });
      }

      onCompleted();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !delivery) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 text-white shadow-2xl flex flex-col space-y-4 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Proof of Delivery (POD)</h2>
              <p className="text-[11px] text-slate-400 font-mono">{delivery.deliveryNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Toggle: Success vs Failed */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setMode('SUCCESS_POD')}
            className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              mode === 'SUCCESS_POD'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Berhasil Diterima</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('FAILED_DELIVERY')}
            className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              mode === 'FAILED_DELIVERY'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <XCircle className="w-4 h-4" />
            <span>Gagal Terkirim</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto space-y-4 pr-1 text-xs">
          {/* Customer & Destination Summary */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-[11px]">
            <div className="flex items-center justify-between text-slate-400">
              <span className="font-sans font-bold text-white text-xs">{delivery.customerName}</span>
              <span className="text-cyan-400">{delivery.items.length} Koli / Item</span>
            </div>
            <div className="text-slate-400 flex items-start gap-1 font-sans">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-cyan-400 mt-0.5" />
              <span className="line-clamp-2">{delivery.deliveryAddress}</span>
            </div>
          </div>

          {mode === 'SUCCESS_POD' ? (
            <>
              {/* Recipient Form */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">
                    Nama Lengkap Penerima:
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={e => setRecipientName(e.target.value)}
                    placeholder="Nama staf / penerima barang..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">
                    No. Handphone / WhatsApp Penerima:
                  </label>
                  <input
                    type="tel"
                    value={recipientPhone}
                    onChange={e => setRecipientPhone(e.target.value)}
                    placeholder="0812xxxx..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Digital Signature Pad */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <span>Tanda Tangan Digital (Recipient Signature)</span>
                    {hasSignature && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </label>
                  <button
                    type="button"
                    onClick={handleClearSignature}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <Eraser className="w-3 h-3" />
                    <span>Hapus / Ulangi</span>
                  </button>
                </div>

                <div className="bg-slate-950 border-2 border-dashed border-slate-700 rounded-2xl overflow-hidden relative touch-none">
                  <canvas
                    ref={canvasRef}
                    width={360}
                    height={140}
                    className="w-full h-32 cursor-crosshair block"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />
                  {!hasSignature && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-600 text-[11px]">
                      Goreskan tanda tangan penerima di sini
                    </div>
                  )}
                </div>
              </div>

              {/* Photo Evidence */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="font-bold text-white text-xs">Foto Bukti Serah Terima</div>
                    <div className="text-[10px] text-emerald-400 font-mono">1 Foto & Geotag Terlampir</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPhotosCount(prev => prev + 1)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-[10px] font-bold hover:border-cyan-500"
                >
                  Ambil Foto Tambahan
                </button>
              </div>

              {/* Delivery Notes */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">
                  Catatan Serah Terima (Opsional):
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Contoh: Diterima di pintu loading dock 2..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-500"
                />
              </div>
            </>
          ) : (
            /* Failed Delivery Mode */
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-rose-400">
                  Pilih Alasan Kegagalan Pengiriman:
                </label>
                <select
                  value={failureReason}
                  onChange={e => setFailureReason(e.target.value as DeliveryFailureReason)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-rose-500"
                >
                  <option value="CUSTOMER_NOT_AVAILABLE">Penerima Tidak di Lokasi / Toko Tutup</option>
                  <option value="WRONG_ADDRESS">Alamat Tidak Ditemukan / Salah Alamat</option>
                  <option value="CUSTOMER_REFUSED">Penerima Menolak Paket (Salah Order / Reject)</option>
                  <option value="DAMAGED_GOODS">Kemasan / Barang Rusak di Perjalanan</option>
                  <option value="ROAD_ACCESS">Akses Jalan Terhalang / Truk Tidak Muat</option>
                  <option value="SECURITY_RESTRICTION">Tidak Diizinkan Masuk oleh Keamanan</option>
                  <option value="OTHER">Alasan Lainnya</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">
                  Keterangan Rinci Kegagalan:
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Jelaskan alasan detail dan hasil kontak telepon dengan customer..."
                  rows={3}
                  className="w-full bg-slate-950 border border-rose-500/40 rounded-xl p-3 text-xs text-rose-200 outline-none focus:border-rose-400"
                />
              </div>

              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>Pengiriman gagal akan memicu notifikasi penjadwalan ulang ke Dispatcher.</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-800 pt-3 shrink-0 flex items-center gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
          >
            Batal
          </button>
          <button
            disabled={isSubmitting}
            onClick={handleSubmitPOD}
            className={`flex-1 py-3 rounded-2xl font-bold text-xs transition shadow-lg flex items-center justify-center gap-1.5 ${
              mode === 'SUCCESS_POD'
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Memproses...' : mode === 'SUCCESS_POD' ? 'Submit POD Sukses' : 'Konfirmasi Gagal'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
