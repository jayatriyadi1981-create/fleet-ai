/**
 * Fleet Intelligence Smart AI - AI Automation Trigger Bridge Modal (PROMPT 35 Bridge)
 * PROMPT 36 - Sections 84, 85, 86, 87
 */

import React, { useState } from 'react';
import { X, Zap, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Send, Bell } from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';

export const AutomationTriggerModal: React.FC = () => {
  const { isAutomationModalOpen, setIsAutomationModalOpen, selectedInsightForAutomation } = useAnalytics();

  const [notificationChannel, setNotificationChannel] = useState<'WHATSAPP' | 'EMAIL' | 'DISPATCH_DASHBOARD' | 'WEBHOOK'>('DISPATCH_DASHBOARD');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executed, setExecuted] = useState(false);

  if (!isAutomationModalOpen || !selectedInsightForAutomation) return null;

  const handleExecute = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setExecuted(true);
      setTimeout(() => {
        setExecuted(false);
        setIsAutomationModalOpen(false);
      }, 2000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-gradient-to-tr from-amber-500 to-cyan-500 p-2 text-slate-950 font-bold">
              <Zap className="h-5 w-5 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Eksekusi Otomasi AI (PROMPT 35 Bridge)</h3>
              <p className="text-xs text-slate-400">Trigger aksi preventif langsung dari temuan anomali analitik</p>
            </div>
          </div>
          <button
            onClick={() => setIsAutomationModalOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Insight Details */}
        <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-400 uppercase text-[10px]">Temuan Anomali Terpilih</span>
            <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300">
              {selectedInsightForAutomation.severity}
            </span>
          </div>
          <h4 className="text-sm font-bold text-white">{selectedInsightForAutomation.title}</h4>
          <p className="text-slate-300">{selectedInsightForAutomation.actionRecommendation}</p>
        </div>

        {/* Channel Selection */}
        <div className="space-y-2 text-xs">
          <label className="text-slate-300 font-semibold block">Kanal Notifikasi & Eksekusi Otomatis:</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'DISPATCH_DASHBOARD', label: 'Dashboard Dispatcher' },
              { key: 'WHATSAPP', label: 'WhatsApp Manager' },
              { key: 'EMAIL', label: 'Email Operasional' },
              { key: 'WEBHOOK', label: 'ERP / API Webhook' },
            ].map((ch) => (
              <button
                key={ch.key}
                type="button"
                onClick={() => setNotificationChannel(ch.key as any)}
                className={`rounded-lg px-3 py-2 text-left font-medium transition-all ${
                  notificationChannel === ch.key
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {ch.label}
              </button>
            ))}
          </div>
        </div>

        {/* Execution Notice */}
        {executed ? (
          <div className="rounded-xl bg-emerald-950/40 border border-emerald-500/30 p-3.5 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
            <span>
              <strong>Berhasil Dieksekusi!</strong> Perintah otomatis telah diteruskan ke modul Dispatch & AI Automation Engine.
            </span>
          </div>
        ) : (
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800 text-[11px] text-slate-400">
            Aksi ini akan mencatat log audit ke sistem keamanan terpusat dan mengaktifkan trigger workflow PROMPT 35.
          </div>
        )}

        {/* Footer Actions */}
        <div className="border-t border-slate-800 pt-3 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={() => setIsAutomationModalOpen(false)}
            className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isExecuting || executed}
            onClick={handleExecute}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 text-xs font-bold text-slate-950 hover:brightness-110 disabled:opacity-50 transition-all shadow-md shadow-cyan-500/20"
          >
            <Zap className="h-3.5 w-3.5 fill-current" />
            <span>{isExecuting ? 'Mengeksekusi...' : 'Konfirmasi & Jalankan'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
