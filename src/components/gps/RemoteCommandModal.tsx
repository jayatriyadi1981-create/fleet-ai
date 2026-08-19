/**
 * Fleet Intelligence Smart AI - Remote Command Execution Modal
 * PROMPT 10 - Enterprise Command Foundation with Double-Confirmation Security
 */

import React, { useState } from 'react';
import { GPSDeviceExtended, CommandType } from '../../types/gps';
import { gpsDeviceService } from '../../services/gpsDeviceService';
import { useToast } from '../ui/Toast';
import {
  X,
  ShieldAlert,
  Send,
  Lock,
  Unlock,
  RotateCcw,
  MapPin,
  Settings,
  DownloadCloud,
  CheckCircle2,
  AlertOctagon
} from 'lucide-react';

interface RemoteCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  device: GPSDeviceExtended;
  sentBy: string;
}

export const RemoteCommandModal: React.FC<RemoteCommandModalProps> = ({
  isOpen,
  onClose,
  device,
  sentBy
}) => {
  const { showSuccess, showError } = useToast();
  const [selectedCommand, setSelectedCommand] = useState<CommandType>('REQUEST_POSITION');
  const [confirmationInput, setConfirmationInput] = useState<string>('');
  const [apn, setApn] = useState<string>('m2m.telkomsel.id');
  const [interval, setIntervalVal] = useState<number>(10);
  const [serverHost, setServerHost] = useState<string>('gateway.fleet-ai.id:5027');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const isHighRisk = ['RESTART_DEVICE', 'LOCK_VEHICLE', 'UNLOCK_VEHICLE', 'FIRMWARE_UPDATE'].includes(
    selectedCommand
  );

  const targetConfirmKey = (device.vehiclePlate || device.deviceCode).toUpperCase();

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let params: Record<string, any> = {};
      if (selectedCommand === 'SET_APN') params = { apn };
      if (selectedCommand === 'SET_INTERVAL') params = { intervalSeconds: interval };
      if (selectedCommand === 'SET_SERVER') params = { serverHost };

      gpsDeviceService.sendCommand(
        device.id,
        selectedCommand,
        params,
        sentBy,
        isHighRisk ? confirmationInput : undefined
      );

      showSuccess(
        'Perintah Terkirim',
        `Perintah ${selectedCommand} berhasil diproses oleh gateway ke perangkat ${device.deviceCode}.`
      );
      onClose();
    } catch (err: any) {
      showError('Gagal Mengirim Perintah', err.message || 'Gagal mengeksekusi perintah.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const commandsList: { type: CommandType; label: string; desc: string; icon: any; danger?: boolean }[] = [
    {
      type: 'REQUEST_POSITION',
      label: 'Request Position Instant',
      desc: 'Minta lokasi GPS langsung tanpa menunggu interval pingsat.',
      icon: MapPin
    },
    {
      type: 'SET_INTERVAL',
      label: 'Atur Interval Ping',
      desc: 'Ubah frekuensi pengiriman data lokasi telemetri.',
      icon: Settings
    },
    {
      type: 'SET_APN',
      label: 'Atur APN Kartu SIM',
      desc: 'Perbarui konfigurasi APN seluler M2M.',
      icon: Settings
    },
    {
      type: 'SET_SERVER',
      label: 'Atur Host Gateway',
      desc: 'Alihkan koneksi TCP socket ke server cadangan.',
      icon: Settings
    },
    {
      type: 'RESTART_DEVICE',
      label: 'Reboot / Restart Device',
      desc: 'Lakukan soft reboot pada modem seluler & GPS tracker.',
      icon: RotateCcw,
      danger: true
    },
    {
      type: 'LOCK_VEHICLE',
      label: 'Matikan Mesin / Immobilizer (Lock)',
      desc: 'Aktifkan relay pembatas pengapian mesin kendaraan.',
      icon: Lock,
      danger: true
    },
    {
      type: 'UNLOCK_VEHICLE',
      label: 'Lepas Pembatas Mesin (Unlock)',
      desc: 'Normalisasi sambungan relay starter mesin.',
      icon: Unlock,
      danger: true
    },
    {
      type: 'FIRMWARE_UPDATE',
      label: 'Trigger OTA Firmware Update',
      desc: 'Unduh paket firmware terbaru dari repository server.',
      icon: DownloadCloud,
      danger: true
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-500/10 p-2.5 text-amber-400 border border-amber-500/20">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Pusat Perintah Remote GPS
                <span className="text-xs font-mono text-slate-400">({device.deviceCode})</span>
              </h2>
              <p className="text-xs text-slate-400">
                Unit {device.vehiclePlate || 'Tanpa Kendaraan'} • Protocol {device.protocolName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleExecute} className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Command Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Pilih Jenis Perintah Remote
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {commandsList.map((cmd) => {
                const Icon = cmd.icon;
                const isSelected = selectedCommand === cmd.type;
                return (
                  <button
                    type="button"
                    key={cmd.type}
                    onClick={() => {
                      setSelectedCommand(cmd.type);
                      setConfirmationInput('');
                    }}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? cmd.danger
                          ? 'border-rose-500 bg-rose-500/10 text-rose-200'
                          : 'border-cyan-500 bg-cyan-500/10 text-cyan-200'
                        : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${cmd.danger ? 'text-rose-400' : 'text-cyan-400'}`} />
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold flex items-center gap-1.5">
                        <span>{cmd.label}</span>
                        {cmd.danger && (
                          <span className="text-[9px] px-1 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">
                            HIGH RISK
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] opacity-75 line-clamp-2">{cmd.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Parameters Inputs */}
          {selectedCommand === 'SET_APN' && (
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
              <label className="text-xs font-semibold text-slate-300">Nama APN Seluler</label>
              <input
                type="text"
                value={apn}
                onChange={(e) => setApn(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                placeholder="m2m.telkomsel.id"
                required
              />
            </div>
          )}

          {selectedCommand === 'SET_INTERVAL' && (
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                Interval Pengiriman Laporan (Detik)
              </label>
              <input
                type="number"
                min={5}
                max={3600}
                value={interval}
                onChange={(e) => setIntervalVal(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                required
              />
              <p className="text-[11px] text-slate-500">Rekomendasi armada aktif: 10 - 30 detik.</p>
            </div>
          )}

          {selectedCommand === 'SET_SERVER' && (
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
              <label className="text-xs font-semibold text-slate-300">Host & Port Gateway</label>
              <input
                type="text"
                value={serverHost}
                onChange={(e) => setServerHost(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                placeholder="gateway.fleet-ai.id:5027"
                required
              />
            </div>
          )}

          {/* High-Risk Safety Confirmation */}
          {isHighRisk && (
            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 space-y-3">
              <div className="flex items-center gap-2 text-rose-300 text-xs font-bold">
                <AlertOctagon className="h-4 w-4" />
                <span>Konfirmasi Otentikasi Eksekusi Berisiko Tinggi</span>
              </div>
              <p className="text-xs text-rose-200/90 leading-relaxed">
                Perintah ini berdampak langsung pada kelistrikan kendaraan atau status modem tracker. Silakan ketik{' '}
                <strong className="text-white font-mono bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-500/40">
                  {targetConfirmKey}
                </strong>{' '}
                untuk mengonfirmasi otorisasi.
              </p>
              <input
                type="text"
                value={confirmationInput}
                onChange={(e) => setConfirmationInput(e.target.value)}
                placeholder={`Ketik ${targetConfirmKey}`}
                className="w-full rounded-xl border border-rose-500/40 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder:text-rose-300/40 focus:border-rose-400 focus:outline-none font-mono"
                required
              />
            </div>
          )}

          {/* Audit Info Footer */}
          <div className="text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-800 pt-3">
            <span>Operator Otorisasi: {sentBy}</span>
            <span>Audit Ref: AUD-CMD-LIVE</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (isHighRisk && confirmationInput.trim().toUpperCase() !== targetConfirmKey)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                isHighRisk
                  ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-lg shadow-rose-500/20'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20'
              }`}
            >
              <Send className="h-3.5 w-3.5" />
              Kirim Perintah Gateway
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
