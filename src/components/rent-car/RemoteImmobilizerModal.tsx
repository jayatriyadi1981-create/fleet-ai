/**
 * Fleet Intelligence Smart AI - Remote Immobilizer & Engine Starter Kill Modal
 */

import React, { useState } from 'react';
import { RentalVehicle } from '../../modules/rent-car/types';
import { rentCarService } from '../../modules/rent-car/services/rentCarService';
import { 
  X, 
  Lock, 
  Unlock, 
  ShieldAlert, 
  AlertTriangle, 
  KeyRound, 
  Check, 
  Gauge, 
  MapPin, 
  Zap 
} from 'lucide-react';

interface RemoteImmobilizerModalProps {
  vehicle: RentalVehicle;
  onClose: () => void;
  onSuccess: () => void;
}

export const RemoteImmobilizerModal: React.FC<RemoteImmobilizerModalProps> = ({
  vehicle,
  onClose,
  onSuccess
}) => {
  const isCurrentlyLocked = vehicle.remoteImmobilizerStatus === 'locked';
  const targetAction = isCurrentlyLocked ? 'unlock' : 'lock';

  const [reason, setReason] = useState<string>(
    isCurrentlyLocked 
      ? 'Verifikasi sewa selesai / pembayaran telah dikonfirmasi.' 
      : 'Penyewa terindikasi membawa unit ke luar koridor geofence tanpa izin.'
  );
  const [operatorPin, setOperatorPin] = useState<string>('8899');
  const [safetyCheckAccepted, setSafetyCheckAccepted] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const handleExecute = () => {
    if (!safetyCheckAccepted && targetAction === 'lock') {
      setStatusMessage('Anda wajib menyetujui protokol keselamatan laju kendaraan.');
      return;
    }

    setIsProcessing(true);
    setStatusMessage('Mengirimkan sinyal GSM/Satellite OTA ke relay ECU...');

    setTimeout(() => {
      rentCarService.toggleImmobilizer(vehicle.id, targetAction, reason);
      setIsProcessing(false);
      onSuccess();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className={`p-5 border-b border-slate-800 ${
          targetAction === 'lock' 
            ? 'bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-950' 
            : 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950'
        } flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${
              targetAction === 'lock' 
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' 
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
            }`}>
              {targetAction === 'lock' ? <Lock className="w-6 h-6 animate-pulse" /> : <Unlock className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {targetAction === 'lock' ? 'Remote Engine Starter Kill (Immobilizer)' : 'Pulihkan Starter Mesin (Unlock)'}
              </h2>
              <p className="text-xs text-slate-400">
                {vehicle.brand} {vehicle.model} • <span className="font-mono text-cyan-400">{vehicle.plateNumber}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Telematics Safety Status Gauge */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Telematika Live Unit
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-cyan-400" />
                <span>Kecepatan Saat Ini:</span>
              </span>
              <span className={`font-mono font-bold text-sm ${vehicle.location.speed > 20 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {vehicle.location.speed} km/h
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>Posisi:</span>
              </span>
              <span className="text-[11px] text-slate-400 truncate max-w-[240px]">
                {vehicle.location.address}
              </span>
            </div>
          </div>

          {/* Safety Interlock Notice for Starter Kill */}
          {targetAction === 'lock' && (
            <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/40 text-rose-300 space-y-2">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Protokol Keamanan Matikan Mesin:</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">
                Sistem ECU akan memutuskan suplai bahan bakar & starter secara bertahap saat kendaraan melambat di bawah 15 km/h atau saat kontak ACC dimatikan, demi mencegah kecelakaan fatal saat kecepatan tinggi.
              </p>
              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={safetyCheckAccepted}
                  onChange={(e) => setSafetyCheckAccepted(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-rose-500 focus:ring-0"
                />
                <span className="text-[11px] font-semibold text-rose-300">
                  Saya mengonfirmasi otorisasi darurat starter-kill ini.
                </span>
              </label>
            </div>
          )}

          {/* Reason Input */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Alasan Eksekusi Tindakan
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:border-cyan-500 focus:outline-none"
            >
              {targetAction === 'lock' ? (
                <>
                  <option value="Penyewa terindikasi membawa unit ke luar koridor geofence tanpa izin.">
                    Pelanggaran Batas Wilayah Geofence
                  </option>
                  <option value="Overdue sewa melewati 12 jam tanpa kontak & deposit habis.">
                    Overdue Batas Waktu Sewa (Lost Contact)
                  </option>
                  <option value="Indikasi upaya penggelapan unit / tampering modul GPS.">
                    Indikasi Penggelapan / Sabotase GPS
                  </option>
                  <option value="Permintaan penahanan dari pihak leasing / kepolisian.">
                    Otoritas Penegak Hukum / Pemilik Armada
                  </option>
                </>
              ) : (
                <>
                  <option value="Verifikasi sewa selesai / pembayaran telah dikonfirmasi.">
                    Pelunasan Pembayaran & Klarifikasi Selesai
                  </option>
                  <option value="Penyewa telah kembali ke jalur zona sewa yang disepakati.">
                    Unit Kembali ke Dalam Koridor Resmi
                  </option>
                  <option value="Pengecekan teknis servis berkala selesai di bengkel.">
                    Selesai Perawatan Bengkel
                  </option>
                </>
              )}
            </select>
          </div>

          {/* Security Operator PIN */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              PIN Otorisasi Dispatcher
            </label>
            <input
              type="password"
              value={operatorPin}
              onChange={(e) => setOperatorPin(e.target.value)}
              maxLength={4}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-cyan-400 font-mono text-center tracking-widest text-base font-bold focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {statusMessage && (
            <div className="text-xs text-cyan-400 font-mono text-center animate-pulse">
              {statusMessage}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
          >
            Batal
          </button>

          <button
            onClick={handleExecute}
            disabled={isProcessing}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 ${
              targetAction === 'lock'
                ? 'bg-rose-600 text-white hover:bg-rose-500 shadow-rose-950'
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-950'
            }`}
          >
            {targetAction === 'lock' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            <span>
              {isProcessing 
                ? 'Mengirim Komando...' 
                : targetAction === 'lock' 
                  ? 'Kunci Starter (Engine Kill)' 
                  : 'Aktifkan Kembali Starter'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
