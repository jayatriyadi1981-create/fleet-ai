/**
 * Fleet Intelligence Smart AI - Quick Assignment Modals
 * PROMPT 9 - Driver & GPS Device Binding Dialogs
 */

import React, { useState } from 'react';
import { useFleet } from '../../context/FleetContext';
import { vehicleService } from '../../services/vehicleService';
import { useToast } from '../ui/Toast';
import { User, Radio, X, Check, ShieldAlert } from 'lucide-react';

interface AssignDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: string;
  vehiclePlate: string;
  currentDriverId?: string;
  onSuccess: () => void;
}

export const AssignDriverModal: React.FC<AssignDriverModalProps> = ({
  isOpen,
  onClose,
  vehicleId,
  vehiclePlate,
  currentDriverId,
  onSuccess,
}) => {
  const { drivers } = useFleet();
  const { addToast } = useToast();
  const [selectedDriverId, setSelectedDriverId] = useState<string>(currentDriverId || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDriverId) {
      addToast({ type: 'warning', title: 'Pilih Pengemudi', message: 'Silakan pilih driver yang akan ditugaskan.' });
      return;
    }

    try {
      setIsSubmitting(true);
      await vehicleService.assignDriver(vehicleId, selectedDriverId);
      addToast({
        type: 'success',
        title: 'Pengemudi Ditugaskan',
        message: `Driver berhasil ditugaskan untuk membawa unit ${vehiclePlate}.`,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      addToast({ type: 'error', title: 'Gagal Menugaskan Driver', message: err.message || 'Terjadi kesalahan' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Tugaskan Pengemudi</h3>
              <p className="text-xs text-slate-400">Unit Kendaraan: <span className="font-mono text-cyan-300 font-bold">{vehiclePlate}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Pilih Pengemudi (Driver) <span className="text-rose-400">*</span>
            </label>
            <select
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              required
            >
              <option value="">-- Pilih Pengemudi --</option>
              {drivers.map((drv) => (
                <option key={drv.id} value={drv.id}>
                  {drv.name} ({drv.simType} - {drv.status.replace('_', ' ').toUpperCase()})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Hanya driver dengan SIM aktif yang memenuhi syarat operasional armada.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              {isSubmitting ? 'Menyimpan...' : 'Simpan Penugasan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface AssignGpsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: string;
  vehiclePlate: string;
  currentGpsId?: string;
  onSuccess: () => void;
}

export const AssignGpsModal: React.FC<AssignGpsModalProps> = ({
  isOpen,
  onClose,
  vehicleId,
  vehiclePlate,
  currentGpsId,
  onSuccess,
}) => {
  const { gpsDevices } = useFleet();
  const { addToast } = useToast();
  const [selectedGpsId, setSelectedGpsId] = useState<string>(currentGpsId || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGpsId) {
      addToast({ type: 'warning', title: 'Pilih GPS', message: 'Silakan pilih perangkat GPS telematika.' });
      return;
    }

    try {
      setIsSubmitting(true);
      await vehicleService.assignGpsDevice(vehicleId, selectedGpsId);
      addToast({
        type: 'success',
        title: 'Perangkat GPS Terhubung',
        message: `Sensors & Perangkat GPS berhasil dikaitkan ke unit ${vehiclePlate}.`,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      addToast({ type: 'error', title: 'Gagal Binding GPS', message: err.message || 'Terjadi kesalahan' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Radio className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Hubungkan Sensor GPS Telematika</h3>
              <p className="text-xs text-slate-400">Unit Kendaraan: <span className="font-mono text-purple-300 font-bold">{vehiclePlate}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Pilih Perangkat GPS Telematika <span className="text-rose-400">*</span>
            </label>
            <select
              value={selectedGpsId}
              onChange={(e) => setSelectedGpsId(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
              required
            >
              <option value="">-- Pilih Device GPS --</option>
              {gpsDevices.map((dev) => (
                <option key={dev.id} value={dev.id}>
                  {dev.model} - IMEI: {dev.imei} ({dev.provider})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Sistem akan memetakan aliran telemetry real-time (Speed, RPM, Fuel) secara langsung.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-purple-500 px-5 py-2 text-xs font-bold text-white hover:bg-purple-400 disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              {isSubmitting ? 'Menghubungkan...' : 'Hubungkan GPS'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
