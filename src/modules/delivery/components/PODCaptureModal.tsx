/**
 * Fleet Intelligence Smart AI - Proof of Delivery (POD) Capture Modal
 * Canvas Signature Pad, Photo Upload Gallery, Policy Checks & GPS Verification
 */

import React, { useState, useRef } from 'react';
import { Delivery, PODPhoto, PODPhotoType } from '../deliveryTypes';
import { deliveryPODService, DEFAULT_POD_POLICY } from '../services/deliveryPODService';
import {
  X,
  FileCheck2,
  Camera,
  PenTool,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Upload,
  Trash2,
  MapPin,
  ShieldCheck,
} from 'lucide-react';

interface PODCaptureModalProps {
  delivery: Delivery | null;
  isOpen: boolean;
  onClose: () => void;
  onPodSubmitted: () => void;
}

export const PODCaptureModal: React.FC<PODCaptureModalProps> = ({
  delivery,
  isOpen,
  onClose,
  onPodSubmitted,
}) => {
  if (!isOpen || !delivery) return null;

  const [recipientName, setRecipientName] = useState(delivery.recipientName || '');
  const [recipientPhone, setRecipientPhone] = useState(delivery.recipientPhone || '');
  const [recipientRole, setRecipientRole] = useState('Warehouse Manager / Penerima');
  const [notes, setNotes] = useState('');
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  // Signature canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  // Photos
  const [photos, setPhotos] = useState<Omit<PODPhoto, 'id' | 'deliveryId'>[]>([
    {
      fileUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&auto=format&fit=crop&q=80',
      type: 'PACKAGE',
      capturedAt: new Date().toISOString(),
      latitude: delivery.latitude,
      longitude: delivery.longitude,
      uploadedBy: 'Ahmad Subagja (Driver)',
    },
  ]);
  const [selectedPhotoType, setSelectedPhotoType] = useState<PODPhotoType>('PACKAGE');

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasSignature(true);
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#38bdf8'; // sky blue
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  // Add photo simulation
  const handleAddPhoto = () => {
    const sampleImages = [
      'https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=600&auto=format&fit=crop&q=80',
    ];
    const randomImg = sampleImages[Math.floor(Math.random() * sampleImages.length)];

    setPhotos([
      ...photos,
      {
        fileUrl: randomImg,
        thumbnailUrl: randomImg,
        type: selectedPhotoType,
        capturedAt: new Date().toISOString(),
        latitude: delivery.latitude,
        longitude: delivery.longitude,
        uploadedBy: 'Driver App (Live Camera)',
      },
    ]);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessages([]);

    let signatureDataUrl = '';
    if (canvasRef.current && hasSignature) {
      signatureDataUrl = canvasRef.current.toDataURL('image/png');
    }

    try {
      deliveryPODService.submitPOD({
        deliveryId: delivery.id,
        recipientName,
        recipientPhone,
        recipientRole,
        signatureDataUrl: signatureDataUrl || undefined,
        photos,
        notes,
        latitude: delivery.latitude,
        longitude: delivery.longitude,
        performedBy: 'Driver Ahmad Subagja',
        policy: DEFAULT_POD_POLICY,
      });

      onPodSubmitted();
      onClose();
    } catch (err: any) {
      setErrorMessages([err.message || 'Gagal menyimpan Bukti Penyerahan (POD).']);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Input Bukti Penyerahan Kargo (POD)</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Delivery #{delivery.deliveryNumber} — {delivery.customerName}
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

        {/* Errors Banner */}
        {errorMessages.length > 0 && (
          <div className="p-3 bg-rose-500/10 border-b border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessages.join(' ')}</span>
          </div>
        )}

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
          {/* Recipient Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Nama Penerima *</label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Agus Purnomo"
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-slate-200 outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">No. HP / WA Penerima *</label>
              <input
                type="text"
                required
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                placeholder="0813-8899-1021"
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-slate-200 outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Jabatan / Role Penerima</label>
              <input
                type="text"
                value={recipientRole}
                onChange={(e) => setRecipientRole(e.target.value)}
                placeholder="Supervisor Gudang"
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-slate-200 outline-none"
              />
            </div>
          </div>

          {/* Interactive Digital Signature Pad */}
          <div className="border border-slate-800 rounded-xl p-4 bg-slate-950/60">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <PenTool className="w-4 h-4 text-sky-400" />
                Tanda Tangan Digital Penerima *
              </span>
              <button
                type="button"
                onClick={clearSignature}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Bersihkan Pad
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden touch-none relative">
              <canvas
                ref={canvasRef}
                width={500}
                height={140}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-32 cursor-crosshair bg-slate-950"
              />
              {!hasSignature && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-600 text-xs italic">
                  Goreskan tanda tangan penerima di area ini...
                </div>
              )}
            </div>
          </div>

          {/* Photos Upload & Gallery */}
          <div className="border border-slate-800 rounded-xl p-4 bg-slate-950/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-400" />
                Foto Bukti Penyerahan Kargo ({photos.length}) *
              </span>

              <div className="flex items-center gap-2">
                <select
                  value={selectedPhotoType}
                  onChange={(e) => setSelectedPhotoType(e.target.value as PODPhotoType)}
                  className="bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1 text-[11px] outline-none"
                >
                  <option value="PACKAGE">Foto Kemasan Barang</option>
                  <option value="DELIVERY_LOCATION">Foto Plang Gudang</option>
                  <option value="DOCUMENT">Foto Surat Jalan Ttd</option>
                  <option value="DAMAGE">Foto Kerusakan (Jika Ada)</option>
                </select>

                <button
                  type="button"
                  onClick={handleAddPhoto}
                  className="px-3 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-1 transition-all"
                >
                  <Upload className="w-3 h-3" />
                  + Ambil Foto
                </button>
              </div>
            </div>

            {/* Photo Previews */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {photos.map((ph, index) => (
                <div
                  key={index}
                  className="relative group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
                >
                  <img src={ph.fileUrl} alt="POD" className="w-full h-24 object-cover" />
                  <div className="p-1.5 bg-slate-950/90 text-[10px] text-slate-300 font-medium truncate flex items-center justify-between">
                    <span className="uppercase text-[9px] text-emerald-400 font-bold">{ph.type}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="text-rose-400 hover:text-rose-300 p-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Notes & Location */}
          <div>
            <label className="block font-medium text-slate-300 mb-1">Catatan Tambahan Penerimaan Kargo</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Barang diterima 120 karton lengkap dalam kondisi segel rapat..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-slate-200 outline-none resize-none"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-400 text-[11px]">
            <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>
              Koordinat GPS Penyerahan:{' '}
              <strong className="text-slate-200 font-mono">
                {delivery.latitude}, {delivery.longitude}
              </strong>{' '}
              (Waktu: {new Date().toLocaleTimeString('id-ID')} WIB)
            </span>
          </div>

          {/* Submit Action */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl"
            >
              Batal
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-600/30 transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              Verifikasi & Selesaikan POD
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
