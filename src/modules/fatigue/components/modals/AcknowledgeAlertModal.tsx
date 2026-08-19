/**
 * Fleet Intelligence Smart AI - Acknowledge Fatigue Alert Modal
 * PROMPT 23 - Supervisor Action & Alert Flow
 */

import React, { useState } from 'react';
import { X, Bell, CheckCircle2, ShieldAlert, Send, PhoneCall, BedDouble, PauseCircle } from 'lucide-react';
import { FatigueAlert } from '../../types';

interface AcknowledgeAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  alert: FatigueAlert | null;
  onConfirmAcknowledge: (alertId: string, actionTaken: string, notes: string) => void;
}

export const AcknowledgeAlertModal: React.FC<AcknowledgeAlertModalProps> = ({
  isOpen,
  onClose,
  alert,
  onConfirmAcknowledge,
}) => {
  const [actionType, setActionType] = useState('Recommended Rest Break');
  const [notes, setNotes] = useState('');

  if (!isOpen || !alert) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmAcknowledge(alert.id, actionType, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Acknowledge Fatigue Alert</h2>
              <p className="text-xs text-slate-400">Driver: {alert.driverName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <span className="text-xs font-semibold text-rose-400">{alert.title}</span>
            <p className="text-xs text-slate-300">{alert.message}</p>
            <div className="text-[11px] text-slate-500 pt-1">
              Lokasi: {alert.currentLocation} • Waktu: {new Date(alert.triggeredAt).toLocaleTimeString('id-ID')}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Pilih Tindakan Supervisor (Operational Action):</label>
            <select
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="Recommended Rest Break">Instruksi Jeda Istirahat di Rest Area (Recommended Rest)</option>
              <option value="Contact Driver via Call">Hubungi Driver via Telepon / Radio Telematika</option>
              <option value="Pause Assignment">Hentikan Sementara Penugasan (Pause Assignment)</option>
              <option value="Driver Swap At Checkpoint">Siapkan Pertukaran Driver di Checkpoint Depot</option>
              <option value="Escalated to Safety Manager">Eskalasi ke K3 Safety Manager</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Catatan Tindakan Supervisor:</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Jelaskan tindakan yang telah diambil (misal: 'Driver dikontak pkl 04:20 WIB, diinstruksikan rehat di KM 228')..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              Acknowledge Alert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
