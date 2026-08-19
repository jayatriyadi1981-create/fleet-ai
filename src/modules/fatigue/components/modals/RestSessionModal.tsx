/**
 * Fleet Intelligence Smart AI - Log / Edit Rest Session Modal
 * PROMPT 23 - Rest Management
 */

import React, { useState } from 'react';
import { X, BedDouble, Save } from 'lucide-react';
import { RestSession, RestSessionType, RestSessionSource } from '../../types';

interface RestSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRest: (session: Partial<RestSession>) => void;
}

export const RestSessionModal: React.FC<RestSessionModalProps> = ({
  isOpen,
  onClose,
  onSaveRest,
}) => {
  const [driverName, setDriverName] = useState('Budi Santoso');
  const [type, setType] = useState<RestSessionType>('REST');
  const [source, setSource] = useState<RestSessionSource>('ADMIN');
  const [durationHours, setDurationHours] = useState(7.5);
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveRest({
      id: `rs-${Date.now()}`,
      driverName,
      type,
      source,
      durationMinutes: Math.round(durationHours * 60),
      verified: true,
      note: note || 'Input Manual Admin / Supervisor',
      startTime: new Date(Date.now() - durationHours * 3600 * 1000).toISOString(),
      endTime: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
              <BedDouble className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Input Log Sesi Istirahat (Rest)</h2>
              <p className="text-xs text-slate-400">Verifikasi Catatan Istirahat Pengemudi</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Pengemudi (Driver):</label>
            <input
              type="text"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Jenis Istirahat:</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as RestSessionType)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="REST">REST (Istirahat Penuh)</option>
                <option value="BREAK">BREAK (Jeda Singkat)</option>
                <option value="SLEEP">SLEEP (Tidur Mess/Rest Area)</option>
                <option value="OFF_DUTY">OFF_DUTY (Bebas Tugas)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Durasi (Jam):</label>
              <input
                type="number"
                step="0.5"
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Sumber Data Laporan:</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as RestSessionSource)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="ADMIN">ADMIN / Supervisor Verified</option>
              <option value="MANUAL">MANUAL Entry</option>
              <option value="DRIVER_APP">DRIVER_APP Self-Report</option>
              <option value="GPS_INFERRED">GPS_INFERRED (Aktivitas Parkir Telematika)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Catatan Verifikasi:</label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Keterangan tambahan (misal: 'Verifikasi absen mess Depo Cikarang')..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
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
              <Save className="w-4 h-4" />
              Simpan Rest Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
