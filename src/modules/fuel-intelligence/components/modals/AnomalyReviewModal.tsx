/**
 * Fleet Intelligence Smart AI - Anomaly Investigation & Review Modal
 * Allows fleet managers/investigators to record audit conclusions, verify telemetry,
 * mark false positives, or initiate physical inspection work orders.
 */

import React, { useState } from 'react';
import { FuelAnomalyItem, FuelTheftIndicator, AnomalyInvestigationStatus } from '../../types';
import { ShieldAlert, X, CheckCircle, AlertOctagon, HelpCircle, Save, FileText, Check } from 'lucide-react';

interface AnomalyReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  anomaly: FuelAnomalyItem | FuelTheftIndicator | null;
  onSaveReview: (id: string, status: AnomalyInvestigationStatus, notes: string) => void;
}

export const AnomalyReviewModal: React.FC<AnomalyReviewModalProps> = ({
  isOpen,
  onClose,
  anomaly,
  onSaveReview,
}) => {
  if (!isOpen || !anomaly) return null;

  const [status, setStatus] = useState<AnomalyInvestigationStatus>(anomaly.status || 'UNDER_REVIEW');
  const [notes, setNotes] = useState<string>(
    ('investigationNotes' in anomaly ? anomaly.investigationNotes : ('operatorNotes' in anomaly ? anomaly.operatorNotes : '')) || ''
  );
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onSaveReview(anomaly.id, status, notes);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Investigasi & Audit Anomali BBM</h3>
              <span className="text-[11px] font-mono text-slate-400">
                {anomaly.plateNumber} • ID: {anomaly.id}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Summary Box */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Lokasi:</span>
              <span className="font-semibold text-slate-200">{anomaly.locationName}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Waktu Terdeteksi:</span>
              <span className="font-mono text-slate-300">{new Date(anomaly.timestamp).toLocaleString('id-ID')}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Pengemudi:</span>
              <span className="font-semibold text-slate-200">{anomaly.driverName || 'Belum Teridentifikasi'}</span>
            </div>
          </div>

          {/* Status Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider block">
              Status Kesimpulan Investigasi
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'UNDER_REVIEW', label: 'Dalam Investigasi', color: 'border-amber-500/40 text-amber-300' },
                { id: 'VERIFIED', label: 'Terverifikasi Valid', color: 'border-rose-500/40 text-rose-300' },
                { id: 'FALSE_POSITIVE', label: 'False Positive (Sensor)', color: 'border-blue-500/40 text-blue-300' },
                { id: 'RESOLVED', label: 'Selesai / Ditutup', color: 'border-emerald-500/40 text-emerald-300' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStatus(s.id as AnomalyInvestigationStatus)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between ${
                    status === s.id
                      ? `bg-slate-800 ${s.color} ring-1 ring-cyan-500/50`
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span>{s.label}</span>
                  {status === s.id && <Check className="h-3.5 w-3.5 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Investigation Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider block">
              Catatan Tindak Lanjut & Klarifikasi Operator
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Telah dikonfirmasi ke pengemudi dan rekaman CCTV rest area; ditemukan kebocoran selang solar..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={isSaved}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors shadow-md shadow-cyan-950 disabled:opacity-50"
          >
            {isSaved ? (
              <>
                <Check className="h-4 w-4" />
                <span>Tersimpan!</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Simpan Hasil Audit</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
