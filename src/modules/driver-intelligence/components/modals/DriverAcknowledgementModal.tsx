/**
 * Driver Acknowledgement Modal
 * PROMPT 29 - Driver role acknowledgement for coaching sessions & feedback
 */

import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, FileCheck, UserCheck } from 'lucide-react';
import { AIDriverCoachingSession } from '../../types';
import { aiDriverCoachingService } from '../../engines/AIDriverCoachingService';

interface DriverAcknowledgementModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: AIDriverCoachingSession | null;
  onAcknowledged: () => void;
}

export const DriverAcknowledgementModal: React.FC<DriverAcknowledgementModalProps> = ({
  isOpen,
  onClose,
  session,
  onAcknowledged,
}) => {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !session) return null;

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      aiDriverCoachingService.acknowledgeSession(session.id, notes);
      setIsSubmitting(false);
      onAcknowledged();
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Konfirmasi Pembinaan Driver
              </h3>
              <p className="text-xs text-slate-400">
                Persetujuan komitmen keselamatan berkendara.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Session Details */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
              JUDUL SESI
            </span>
            <h4 className="text-sm font-bold text-white mt-0.5">{session.title || session.coachingTopic}</h4>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Driver: {session.driverName} • Coach: {session.supervisorName || session.coachName}
            </p>
          </div>

          <div className="border-t border-slate-800 pt-2.5">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
              KOMITMEN TINDAK LANJUT:
            </span>
            <ul className="space-y-1 text-xs text-slate-300">
              {(Array.isArray(session.actionPlan)
                ? session.actionPlan
                : typeof session.actionPlan === 'string'
                ? session.actionPlan.split('; ')
                : []
              ).map((ap, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{ap}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Driver Notes Input */}
        <div>
          <label className="text-xs font-mono text-slate-400 uppercase font-semibold block mb-1">
            Tanggapan / Komentar Pengemudi (Opsional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Saya telah memahami materi coaching dan berkomitmen menjaga jarak aman..."
            rows={3}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Menyimpan...' : 'Saya Mengakui & Menyetujui'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
