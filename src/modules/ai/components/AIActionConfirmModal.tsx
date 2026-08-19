/**
 * Fleet Intelligence Smart AI - AI Action Confirmation Modal (Sections 37, 38, 76, 77)
 * Two-step confirmation for High-Risk actions with security preview and permission check.
 */

import React, { useState } from 'react';
import { AIActionProposal } from '../../../types/ai';
import { ShieldAlert, CheckCircle2, X, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import { useFleet } from '../../../context/FleetContext';
import { aiService } from '../../../services/ai/AIService';

interface AIActionConfirmModalProps {
  action: AIActionProposal;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (result: { success: boolean; message: string }) => void;
}

export const AIActionConfirmModal: React.FC<AIActionConfirmModalProps> = ({
  action,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { currentUser } = useFleet();
  const [loading, setLoading] = useState(false);
  const [executionResult, setExecutionResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await aiService.executeAction(action, {
        userId: currentUser?.id || 'usr-001',
        userName: currentUser?.name || 'Ahmad Fauzi',
        userRole: currentUser?.role || 'fleet_manager',
        permissions: currentUser?.permissions || ['ai.execute', 'vehicle.edit', 'maintenance.create'],
      });

      setExecutionResult(res);
      setTimeout(() => {
        onSuccess(res);
        onClose();
      }, 1400);
    } catch (err: any) {
      setExecutionResult({
        success: false,
        message: err.message || 'Gagal mengeksekusi tindakan operasional.',
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'MEDIUM':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Konfirmasi Tindakan AI (2-Step Verification)</h3>
              <p className="text-xs text-slate-400">Persetujuan Otorisasi Eksekusi Operasional Armada</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Warning Banner */}
        <div className="rounded-xl bg-amber-950/40 border border-amber-500/30 p-3.5 flex items-start gap-3 text-xs text-amber-200">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-300">Tindakan ini memerlukan verifikasi manusia:</p>
            <p className="text-slate-300 mt-0.5">{action.description}</p>
          </div>
        </div>

        {/* Action Payload Preview */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-slate-400">Nama Tindakan</span>
            <span className="font-bold text-white">{action.label}</span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-slate-400">Tingkat Risiko</span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getRiskColor(action.riskLevel)}`}>
              {action.riskLevel}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-slate-400">Izin RBAC Diperlukan</span>
            <code className="text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/20 font-mono">
              {action.requiredPermission}
            </code>
          </div>

          <div className="space-y-1.5 pt-1">
            <span className="text-slate-400 font-semibold">Parameter Muatan (Payload):</span>
            <pre className="rounded-lg bg-slate-900 p-2.5 text-[11px] text-emerald-400 border border-slate-800 overflow-x-auto font-mono">
              {JSON.stringify(action.payload, null, 2)}
            </pre>
          </div>
        </div>

        {/* Execution Result Banner */}
        {executionResult && (
          <div
            className={`rounded-xl p-3.5 text-xs flex items-center gap-3 border ${
              executionResult.success
                ? 'bg-emerald-950/40 text-emerald-200 border-emerald-500/30'
                : 'bg-rose-950/40 text-rose-200 border-rose-500/30'
            }`}
          >
            {executionResult.success ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />
            )}
            <p className="font-medium">{executionResult.message}</p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
          >
            Batal
          </button>

          <button
            onClick={handleConfirm}
            disabled={loading || Boolean(executionResult?.success)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-2 text-xs font-bold text-slate-950 hover:brightness-110 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Memproses Eksekusi...</span>
              </>
            ) : (
              <>
                <span>Setujui & Jalankan Tindakan</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
