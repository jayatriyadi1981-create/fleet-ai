/**
 * Fleet Intelligence Smart AI - Telematics Reconciliation Audit Modal
 * PROMPT 37 - IoT Sensor vs Invoice Cross-Verification Modal
 */

import React from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, FileSpreadsheet, RefreshCw } from 'lucide-react';
import { useCost } from '../../context/CostContext';
import { CostCalculationEngine } from '../../engines/CostCalculationEngine';

export const ReconciliationModal: React.FC = () => {
  const {
    isReconciliationModalOpen,
    setIsReconciliationModalOpen,
    reconciliationItems,
    runReconciliationAudit,
    exportCurrentData,
  } = useCost();

  if (!isReconciliationModalOpen) return null;

  const totalAudited = reconciliationItems.length;
  const matchCount = reconciliationItems.filter((i) => i.status === 'MATCH').length;
  const minorCount = reconciliationItems.filter((i) => i.status === 'MINOR_VARIANCE').length;
  const flaggedCount = reconciliationItems.filter(
    (i) => i.status === 'SUSPICIOUS_SPIKE' || i.status === 'FLAGGED'
  ).length;

  const totalDiscrepancyIdr = reconciliationItems.reduce(
    (sum, i) => sum + i.discrepancyAmount,
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Hasil Audit Rekonsiliasi Telematika</h3>
              <p className="text-[11px] text-slate-400">Verifikasi silang otomatis sensor IoT vs kwitansi klaim</p>
            </div>
          </div>
          <button
            onClick={() => setIsReconciliationModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block">Cocok Sempurna</span>
              <span className="text-xl font-bold text-emerald-400">{matchCount}</span>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block">Variansi Wajar</span>
              <span className="text-xl font-bold text-blue-400">{minorCount}</span>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block">Spike / Flagged</span>
              <span className="text-xl font-bold text-rose-400">{flaggedCount}</span>
            </div>
          </div>

          <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Total Transaksi Diverifikasi:</span>
              <span className="font-semibold text-white font-mono">{totalAudited} Nota & Sensor</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Total Selisih Nominal Terdeteksi:</span>
              <span className="font-bold text-amber-400 font-mono">
                {CostCalculationEngine.formatCurrencyIdr(totalDiscrepancyIdr)}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-800/30 p-3 rounded-xl border border-slate-800 leading-relaxed">
            Audit telematika telah selesai mencocokkan pengisian BBM dengan sensor level tangki dan log rute GPS. Transaksi dengan status <span className="text-rose-400 font-semibold">SUSPICIOUS_SPIKE</span> disarankan untuk diklarifikasi ke SPBU rekanan atau driver terkait.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={() => exportCurrentData('CSV')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Unduh Laporan Audit</span>
          </button>
          <button
            onClick={() => setIsReconciliationModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
