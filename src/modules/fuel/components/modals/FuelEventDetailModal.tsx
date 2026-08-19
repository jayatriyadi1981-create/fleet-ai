/**
 * Fleet Intelligence Smart AI - Fuel Event & Anomaly Detail Modal
 * PROMPT 24 - Detailed Anomaly Investigation (/app/fuel/events/:eventId)
 */

import React, { useState } from 'react';
import { X, AlertTriangle, MapPin, Clock, ShieldCheck, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { FuelAnomaly } from '../../types';

interface FuelEventDetailModalProps {
  anomaly: FuelAnomaly | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (id: string, newStatus: 'VERIFIED' | 'FALSE_POSITIVE' | 'RESOLVED', notes: string) => void;
}

export const FuelEventDetailModal: React.FC<FuelEventDetailModalProps> = ({
  anomaly,
  isOpen,
  onClose,
  onUpdateStatus,
}) => {
  const [reviewNotes, setReviewNotes] = useState('');

  if (!isOpen || !anomaly) return null;

  const handleAction = (status: 'VERIFIED' | 'FALSE_POSITIVE' | 'RESOLVED') => {
    if (onUpdateStatus) {
      onUpdateStatus(anomaly.id, status, reviewNotes || 'Diinvestigasi oleh Petugas Ops Fleet.');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 text-slate-100 p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-950 border border-rose-800/50 text-rose-400 rounded-xl">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Investigasi Anomali BBM: {anomaly.type}</h2>
              <p className="text-xs text-slate-400">ID Kejadian: {anomaly.id} | Kendaraan: {anomaly.vehiclePlate}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Waktu Kejadian</span>
            <span className="font-bold text-white flex items-center gap-1 mt-0.5">
              <Clock className="h-3.5 w-3.5 text-cyan-400" />
              {new Date(anomaly.timestamp).toLocaleString('id-ID')}
            </span>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Lokasi GPS</span>
            <span className="font-bold text-white flex items-center gap-1 mt-0.5">
              <MapPin className="h-3.5 w-3.5 text-rose-400" />
              {anomaly.evidence.locationName || `Lat: ${anomaly.evidence.gpsSpeed}`}
            </span>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Sensitivitas & Ketersediaan Data</span>
            <span className="font-bold text-emerald-400">Confidence: {anomaly.confidence}</span>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Selisih Volume Terdeteksi</span>
            <span className="font-bold text-rose-400 text-sm">{anomaly.variance} Liter</span>
          </div>
        </div>

        <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
          <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
            <FileText className="h-4 w-4" /> Bukti AI Telematics
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">{anomaly.evidence.description}</p>
          <div className="flex gap-4 text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
            <span>Kecepatan GPS: <strong>{anomaly.evidence.gpsSpeed} km/h</strong></span>
            <span>Status Kontak (Ignition): <strong>{anomaly.evidence.ignition ? 'ON' : 'OFF'}</strong></span>
            <span>Kesehatan Sensor: <strong>{anomaly.evidence.sensorHealthStatus || 'NORMAL'}</strong></span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Catatan Petugas Investigasi Ops</label>
          <textarea
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            placeholder="Tuliskan temuan fisik/klarifikasi pengemudi di sini..."
            className="w-full h-20 rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-slate-800">
          <button
            onClick={() => handleAction('FALSE_POSITIVE')}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
          >
            <XCircle className="h-4 w-4 text-amber-400" /> False Alarm (Abaikan)
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => handleAction('VERIFIED')}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <AlertTriangle className="h-4 w-4" /> Konfirmasi Terindikasi Drain
            </button>
            <button
              onClick={() => handleAction('RESOLVED')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" /> Selesai Investigasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
