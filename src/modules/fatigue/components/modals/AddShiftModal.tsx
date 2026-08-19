/**
 * Fleet Intelligence Smart AI - Add / Edit Shift Modal
 * PROMPT 23 - Shift Management Configuration
 */

import React, { useState } from 'react';
import { X, Calendar, Clock, Plus, Save } from 'lucide-react';
import { Shift, ShiftType } from '../../types';

interface AddShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveShift: (shift: Partial<Shift>) => void;
  editShift?: Shift | null;
}

export const AddShiftModal: React.FC<AddShiftModalProps> = ({
  isOpen,
  onClose,
  onSaveShift,
  editShift,
}) => {
  const [name, setName] = useState(editShift?.name || '');
  const [startTime, setStartTime] = useState(editShift?.startTime || '08:00');
  const [endTime, setEndTime] = useState(editShift?.endTime || '17:00');
  const [type, setType] = useState<ShiftType>(editShift?.type || 'Morning');
  const [maxDrivingHours, setMaxDrivingHours] = useState(editShift?.maxDrivingHours || 7);
  const [requiredRestHours, setRequiredRestHours] = useState(editShift?.requiredRestHours || 8);
  const [branchName, setBranchName] = useState(editShift?.branchName || 'Cabang Jakarta (Headquarters)');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveShift({
      id: editShift?.id || `shift-${Date.now()}`,
      name,
      startTime,
      endTime,
      durationHours: 8,
      type,
      maxDrivingHours,
      requiredRestHours,
      branchName,
      active: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{editShift ? 'Edit Master Shift' : 'Tambah Shift Operasional'}</h2>
              <p className="text-xs text-slate-400">Konfigurasi Jam Kerja & Batas Mengemudi</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Nama Shift Operasional:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Misal: 'Shift Malam Overnight Trunk Line'..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Jam Mulai:</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Jam Selesai:</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Tipe Shift:</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ShiftType)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Morning">Morning (Pagi)</option>
                <option value="Afternoon">Afternoon (Siang/Sore)</option>
                <option value="Night">Night (Malam)</option>
                <option value="Rotating">Rotating (Rotasi)</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Max Driving (Jam):</label>
              <input
                type="number"
                step="0.5"
                value={maxDrivingHours}
                onChange={(e) => setMaxDrivingHours(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Waktu Istirahat Wajib Sebelum Shift (Jam):</label>
            <input
              type="number"
              step="0.5"
              value={requiredRestHours}
              onChange={(e) => setRequiredRestHours(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
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
              className="flex items-center gap-2 px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-colors"
            >
              <Save className="w-4 h-4" />
              Simpan Master Shift
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
