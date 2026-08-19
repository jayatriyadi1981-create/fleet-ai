/**
 * Fleet Intelligence Smart AI - Two-Step Action Confirmation Modal (Prompt 34 - Section 64, 65)
 * Enforces Human-in-the-Loop approval for high-risk operations (e.g. Work Order Creation,
 * Driver Coaching Mandates, Safety Broadcasts) before executing state changes.
 */

import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import { AIActionProposal } from '../../../../types/ai';

interface AIActionConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: AIActionProposal | null;
  onConfirmSuccess?: (resultMsg: string) => void;
}

export const AIActionConfirmModal: React.FC<AIActionConfirmModalProps> = ({
  isOpen,
  onClose,
  action,
  onConfirmSuccess,
}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [resultMessage, setResultMessage] = useState('');

  if (!isOpen || !action) return null;

  const handleConfirm = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setIsDone(true);
      const msg = `Tindakan "${action.label}" berhasil dieksekusi dan dicatat ke audit log.`;
      setResultMessage(msg);
      if (onConfirmSuccess) onConfirmSuccess(msg);
      setTimeout(() => {
        setIsDone(false);
        onClose();
      }, 1400);
    }, 1000);
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'CRITICAL':
        return <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/30">RISIKO TINGGI (CRITICAL)</span>;
      case 'HIGH':
        return <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/30">RISIKO SEDANG (HIGH)</span>;
      default:
        return <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-500/30">RISIKO RENDAH (LOW)</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
        <button
          onClick={onClose}
          disabled={isExecuting}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Konfirmasi Tindakan AI</h3>
            <p className="text-xs text-slate-400">Persetujuan manual (Human-in-the-Loop) diperlukan.</p>
          </div>
        </div>

        {isDone ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-2 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-slate-100">Tindakan Berhasil Diterbitkan!</p>
            <p className="text-xs text-slate-400">{resultMessage}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Tingkat Risiko:</span>
              {getRiskBadge(action.riskLevel)}
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-200">{action.label}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{action.description}</p>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500">
                <span>Modul Target: </span>
                <span className="font-semibold text-cyan-400">{action.targetModule}</span>
              </div>
            </div>

            {/* Payload Preview */}
            {action.payload && Object.keys(action.payload).length > 0 && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500">Parameter Payload:</span>
                <pre className="text-[11px] text-slate-300 font-mono overflow-x-auto">
                  {JSON.stringify(action.payload, null, 2)}
                </pre>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                disabled={isExecuting}
                className="rounded-xl border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
              >
                Batalkan
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isExecuting}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
              >
                {isExecuting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Setujui & Eksekusi</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
