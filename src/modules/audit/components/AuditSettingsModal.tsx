/**
 * Fleet Intelligence Smart AI - Audit Settings & Retention Policy Modal
 * PROMPT 49 - Immutable Storage Rules, Retention Purge, and Cryptographic Verification
 */

import React, { useState } from 'react';
import {
  X,
  Settings,
  ShieldCheck,
  Lock,
  Clock,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Eye,
  Sliders,
  FileCheck,
} from 'lucide-react';
import { auditService } from '../services/auditService';
import { AuditRetentionPolicy } from '../types/auditTypes';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tenantId?: string;
}

export const AuditSettingsModal: React.FC<Props> = ({ isOpen, onClose, tenantId = 'tenant-1' }) => {
  const [retention, setRetention] = useState<AuditRetentionPolicy>(() =>
    auditService.getRetentionPolicy(tenantId)
  );
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<{
    isValid: boolean;
    totalVerified: number;
    details: string;
  } | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSavePolicy = () => {
    auditService.updateRetentionPolicy(tenantId, retention);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleVerifyChain = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const res = auditService.verifyIntegrity();
      setVerifyResult(res);
      setIsVerifying(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden text-slate-100 space-y-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Settings className="h-5 w-5 text-cyan-400" />
              <span>Pengaturan Kebijakan Retensi & Integritas Audit</span>
            </h3>
            <p className="text-xs text-slate-400">
              Konfigurasi siklus penyimpanan log, proteksi data PII, dan validasi rantai kriptografi imutabel.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[550px] overflow-y-auto">
          {savedSuccess && (
            <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/40 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Kebijakan retensi audit log berhasil diperbarui dan disimpan.</span>
            </div>
          )}

          {/* 1. Retention Period */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Clock className="h-4 w-4 text-cyan-400" />
                  <span>Periode Retensi Log Audit (Audit Retention)</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Lama waktu riwayat audit disimpan sebelum diarsipkan ke cold storage.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { days: 30, label: '30 Hari' },
                { days: 90, label: '90 Hari' },
                { days: 180, label: '180 Hari' },
                { days: 365, label: '1 Tahun (Default)' },
                { days: 1095, label: '3 Tahun (Kepatuhan)' },
              ].map((opt) => (
                <button
                  key={opt.days}
                  onClick={() => setRetention({ ...retention, retentionDays: opt.days })}
                  className={`p-3 rounded-xl border text-xs font-bold text-center transition ${
                    retention.retentionDays === opt.days
                      ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300 shadow-md shadow-cyan-500/10'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={retention.immutableLock}
                  onChange={(e) => setRetention({ ...retention, immutableLock: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0 h-4 w-4"
                />
                <span className="text-xs text-slate-300 font-medium">
                  <strong className="text-white">Immutable Lock Mode:</strong> Larang penghapusan manual oleh siapapun hingga masa retensi usai.
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={retention.archiveToColdStorage}
                  onChange={(e) =>
                    setRetention({ ...retention, archiveToColdStorage: e.target.checked })
                  }
                  className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0 h-4 w-4"
                />
                <span className="text-xs text-slate-300 font-medium">
                  <strong className="text-white">Cold Storage Archiving:</strong> Backup log kadaluwarsa ke bucket cloud terenkripsi (AES-256).
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={retention.legalHoldActive}
                  onChange={(e) =>
                    setRetention({ ...retention, legalHoldActive: e.target.checked })
                  }
                  className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0 h-4 w-4"
                />
                <span className="text-xs text-slate-300 font-medium">
                  <strong className="text-amber-400">Legal Hold Active:</strong> Bekukan semua penghapusan otomatis untuk keperluan investigasi hukum.
                </span>
              </label>
            </div>
          </div>

          {/* 2. Cryptographic Integrity Verification Tool */}
          <div className="p-4 rounded-xl border border-cyan-900/40 bg-cyan-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                  <Lock className="h-4 w-4 text-cyan-400" />
                  <span>Audit Trail Immutability Verification Tool</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Periksa integritas seluruh tanda tangan hash ledger untuk memastikan data tidak dimanipulasi.
                </p>
              </div>

              <button
                onClick={handleVerifyChain}
                disabled={isVerifying}
                className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                <span>{isVerifying ? 'Memvalidasi...' : 'Verifikasi Ledger'}</span>
              </button>
            </div>

            {verifyResult && (
              <div
                className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                  verifyResult.isValid
                    ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-200'
                    : 'border-rose-500/40 bg-rose-950/40 text-rose-200'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  {verifyResult.isValid ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span>Ledger Kriptografis Sah (100% Verified)</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 text-rose-400" />
                      <span>Terdeteksi Anomali Integritas Rantai Hash!</span>
                    </>
                  )}
                </div>
                <p className="text-[11px] text-slate-300 font-mono">{verifyResult.details}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
          >
            Tutup
          </button>
          <button
            onClick={handleSavePolicy}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-cyan-500/20"
          >
            Simpan Konfigurasi Retensi
          </button>
        </div>
      </div>
    </div>
  );
};
