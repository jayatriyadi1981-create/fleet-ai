/**
 * Fleet Intelligence Smart AI - Driver Pre-Trip Mobile Inspection Simulation Modal
 * PROMPT 25 - Driver Mobile Workflow & Inspection Failure Triggers
 */

import React, { useState } from 'react';
import {
  X,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Camera,
  Signature,
  Truck,
  ShieldCheck,
  Send
} from 'lucide-react';
import { MOCK_VEHICLE_HEALTH } from '../../data/mockMaintenanceData';

interface MobileInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInspectionSubmitted?: (result: any) => void;
}

export const MobileInspectionModal: React.FC<MobileInspectionModalProps> = ({
  isOpen,
  onClose,
  onInspectionSubmitted
}) => {
  if (!isOpen) return null;

  const [selectedVehicle, setSelectedVehicle] = useState(MOCK_VEHICLE_HEALTH[0].vehiclePlate);
  const [driverName, setDriverName] = useState('Bambang S.');
  const [odometer, setOdometer] = useState('128450');
  const [items, setItems] = useState([
    { name: 'Level & Kebocoran Oli Mesin', status: 'PASS' },
    { name: 'Tekanan & Kondisi Fisik Ban (10 Roda)', status: 'PASS' },
    { name: 'Lampu Utama, Sein & Hazard', status: 'PASS' },
    { name: 'Fungsi Pengereman & Angin Kompresor', status: 'FAIL' },
    { name: 'Klakson, Wiper & Air Wiper', status: 'PASS' },
    { name: 'Kaca Spion & Kaca Depan', status: 'PASS' },
  ]);
  const [notes, setNotes] = useState('Pedal rem terasa agak dalam saat ditekan dan terdengar desis angin halus pada roda kiri belakang.');
  const [submitted, setSubmitted] = useState(false);

  const handleStatusChange = (idx: number, newStatus: 'PASS' | 'FAIL' | 'ATTENTION') => {
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, status: newStatus } : it))
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hasFail = items.some((it) => it.status === 'FAIL');
    const result = {
      vehiclePlate: selectedVehicle,
      driverName,
      odometer: Number(odometer),
      result: hasFail ? 'FAIL' : 'PASS',
      items,
      notes,
    };
    setSubmitted(true);
    if (onInspectionSubmitted) {
      onInspectionSubmitted(result);
    }
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      {/* Smartphone Frame */}
      <div className="relative w-full max-w-sm bg-slate-950 border-4 border-slate-700 rounded-[3rem] p-4 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Phone Notch */}
        <div className="w-32 h-4 bg-slate-800 rounded-full mx-auto mb-2 shrink-0" />

        {/* Phone Content Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Smartphone className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] text-cyan-400 font-bold block uppercase tracking-wider">Driver Mobile App</span>
              <h3 className="text-xs font-black text-white">Pre-Trip Inspection</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        {submitted ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="p-4 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h4 className="text-sm font-bold text-white">Inspeksi Selesai Divalidasi</h4>
            <p className="text-xs text-rose-300">
              Status: <strong>FAILED</strong> (Isu Rem Ditemukan). Sistem otomatis menerbitkan Work Order darurat.
            </p>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto space-y-4 py-3 text-xs pr-1">
            <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-slate-400">Armada:</span>
                <span className="font-bold text-white">{selectedVehicle}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-slate-400">Pengemudi:</span>
                <span className="font-bold text-cyan-300">{driverName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-slate-400">Odometer:</span>
                <input
                  type="number"
                  value={odometer}
                  onChange={(e) => setOdometer(e.target.value)}
                  className="w-24 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-right text-white font-mono"
                />
              </div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Pemeriksaan Komponen Fisik (6/6):
              </span>

              {items.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border space-y-1.5 ${
                    item.status === 'FAIL'
                      ? 'bg-rose-950/30 border-rose-800/50'
                      : item.status === 'ATTENTION'
                      ? 'bg-amber-950/30 border-amber-800/50'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <span className="font-medium text-slate-200 block text-[11px]">{item.name}</span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(idx, 'PASS')}
                      className={`flex-1 py-1 rounded text-[10px] font-bold ${
                        item.status === 'PASS' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      PASS
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(idx, 'ATTENTION')}
                      className={`flex-1 py-1 rounded text-[10px] font-bold ${
                        item.status === 'ATTENTION' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      WARN
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(idx, 'FAIL')}
                      className={`flex-1 py-1 rounded text-[10px] font-bold ${
                        item.status === 'FAIL' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      FAIL
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Notes & Upload */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Catatan Driver:</span>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white text-[11px]"
              />
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Camera className="h-4 w-4 text-cyan-400" /> 1 Foto Dilampirkan
              </span>
              <span className="text-emerald-400 font-semibold">Tanda Tangan Digital OK</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 shrink-0"
            >
              <Send className="h-4 w-4" />
              <span>Kirim Hasil Inspeksi Harian</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
