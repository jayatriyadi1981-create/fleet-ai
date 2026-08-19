/**
 * Fleet Intelligence Smart AI - Command Center Main View
 * PROMPT 47 — 24/7 Mission-Critical Operational Command Center View
 */

import React, { useState } from 'react';
import { CommandCenterShell } from './components/CommandCenterShell';
import { useAuthorization } from '../../hooks/useAuthorization';
import { ShieldAlert, PhoneCall, X, User, Phone, Check } from 'lucide-react';

export const CommandCenterMainView: React.FC = () => {
  const { can, user } = useAuthorization();

  // Driver Phone Call Simulation Modal
  const [activeCall, setActiveCall] = useState<{ phone: string; name: string } | null>(null);
  const [callStatus, setCallStatus] = useState<'RINGING' | 'CONNECTED' | 'ENDED'>('RINGING');

  const handleCallDriver = (phone: string, name: string) => {
    setActiveCall({ phone, name });
    setCallStatus('RINGING');
    setTimeout(() => {
      setCallStatus('CONNECTED');
    }, 2000);
  };

  const handleHangup = () => {
    setCallStatus('ENDED');
    setTimeout(() => {
      setActiveCall(null);
    }, 800);
  };

  return (
    <div className="w-full h-full relative">
      <CommandCenterShell onCallDriver={handleCallDriver} />

      {/* Driver Cellular Call Simulation Overlay */}
      {activeCall && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm p-6 shadow-2xl text-slate-100 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-600/30 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <PhoneCall className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-white">{activeCall.name}</h3>
            <p className="text-xs text-amber-400 font-mono mt-1">{activeCall.phone}</p>

            <div className="my-6 py-2 px-4 rounded-full bg-slate-950 border border-slate-800 text-xs font-semibold inline-block">
              {callStatus === 'RINGING' && 'Memanggil Pengemudi (Ringing)...'}
              {callStatus === 'CONNECTED' && '🟢 Terhubung • Saluran Audio Terenkripsi'}
              {callStatus === 'ENDED' && 'Panggilan Berakhir'}
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={handleHangup}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg flex items-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4 rotate-[135deg]" />
                <span>Akhiri Panggilan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
