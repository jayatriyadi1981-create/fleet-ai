import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Radio,
  X,
  CheckCircle2,
  ShieldAlert,
  Send,
  MapPin,
  Clock,
  PhoneCall,
  Flame,
} from 'lucide-react';
import { PanicEventPayload } from '../../types/driverMobileTypes';
import { driverSessionService } from '../../services/driverSessionService';

interface PanicEmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PanicEmergencyModal: React.FC<PanicEmergencyModalProps> = ({ isOpen, onClose }) => {
  const [countdown, setCountdown] = useState<number | null>(5);
  const [isDispatched, setIsDispatched] = useState(false);
  const [panicEvent, setPanicEvent] = useState<PanicEventPayload | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      setIsDispatched(false);
      setPanicEvent(null);
      return;
    }

    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => (prev !== null ? prev - 1 : null));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isDispatched) {
      handleExecutePanic();
    }
  }, [isOpen, countdown, isDispatched]);

  const handleExecutePanic = async () => {
    setCountdown(null);
    setIsDispatched(true);
    const event = await driverSessionService.triggerPanic();
    setPanicEvent(event);
  };

  const handleCancelCountdown = () => {
    setCountdown(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm bg-slate-900 border-2 border-rose-500/60 rounded-3xl p-6 text-white shadow-2xl shadow-rose-900/50 space-y-6 relative overflow-hidden">
        {/* Glowing emergency accent */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-rose-600/30 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-400">
            <Flame className="w-6 h-6 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest">Emergency SOS</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* State 1: 5-Second Countdown */}
        {countdown !== null && (
          <div className="text-center space-y-4 py-2">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border-4 border-rose-500/30 border-t-rose-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center font-mono text-4xl font-black text-rose-400">
                {countdown}
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">Mengirim Sinyal Darurat...</h3>
              <p className="text-xs text-slate-300">
                Koordinat GPS & data armada akan disiarkan ke Dispatcher, Safety Officer, WhatsApp, dan SMS.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleExecutePanic}
                className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm transition shadow-lg shadow-rose-600/40 uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Radio className="w-4 h-4 animate-ping" />
                <span>Kirim Sekarang Tanpa Menunggu</span>
              </button>

              <button
                onClick={handleCancelCountdown}
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
              >
                Batal (Salah Tekan)
              </button>
            </div>
          </div>
        )}

        {/* State 2: Dispatched & Escalation Tracking */}
        {isDispatched && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-rose-400 mx-auto animate-bounce" />
              <h3 className="text-base font-black text-white">Sinyal SOS Aktif Disiarkan!</h3>
              <p className="text-xs text-rose-200">
                Tim Command Center telah menerima koordinat darurat Anda. Tetap tenang dan amankan posisi.
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs space-y-2 font-mono">
              <div className="flex items-center justify-between text-slate-400">
                <span>Lokasi Terakhir:</span>
                <span className="text-rose-300 font-bold">Pantura Subang KM 42</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Armada / Driver:</span>
                <span className="text-white">B 9128 UXT / Budi S.</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Status Multi-Channel:</span>
                <span className="text-emerald-400 font-bold">4 Kanal Terkirim (WA/SMS/Push/Mail)</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Eskalasi Penanganan:
              </span>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Tier 1: Dispatcher On-Duty (Tersambung)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Tier 2: Safety Manager (Auto 3 menit)</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
            >
              Tutup & Kembali ke Navigasi
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
