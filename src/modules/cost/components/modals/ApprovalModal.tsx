/**
 * Fleet Intelligence Smart AI - Cost Approval Modal
 * PROMPT 37 - Financial Governance, Tiered Thresholds & Approval Audit Trail
 */

import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2, XCircle, DollarSign, Calendar, Truck, User, FileText } from 'lucide-react';
import { useCost } from '../../context/CostContext';
import { CostCalculationEngine } from '../../engines/CostCalculationEngine';

export const ApprovalModal: React.FC = () => {
  const {
    isApprovalModalOpen,
    setIsApprovalModalOpen,
    selectedCostForApproval,
    setSelectedCostForApproval,
    approveCostRecord,
    rejectCostRecord,
  } = useCost();

  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  if (!isApprovalModalOpen || !selectedCostForApproval) return null;

  const handleApprove = () => {
    approveCostRecord(selectedCostForApproval.id);
    setIsApprovalModalOpen(false);
    setSelectedCostForApproval(null);
  };

  const handleReject = () => {
    if (!rejectReason) return;
    rejectCostRecord(selectedCostForApproval.id, rejectReason);
    setIsApprovalModalOpen(false);
    setSelectedCostForApproval(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Review Otorisasi Pengeluaran</h3>
              <p className="text-[11px] text-slate-400">Persetujuan transaksi di atas ambang batas (threshold)</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsApprovalModalOpen(false);
              setSelectedCostForApproval(null);
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Details */}
        <div className="p-5 space-y-4">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-800 space-y-2.5 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-700">
              <span className="text-slate-400">Kategori Biaya:</span>
              <span className="font-semibold text-cyan-400">{selectedCostForApproval.category}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-700">
              <span className="text-slate-400">Nominal Pengeluaran:</span>
              <span className="text-base font-bold font-mono text-white">
                {CostCalculationEngine.formatCurrencyIdr(selectedCostForApproval.amount)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Tanggal Transaksi:</span>
              <span className="font-mono text-slate-300">{selectedCostForApproval.date}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Kendaraan Terkait:</span>
              <span className="font-semibold text-white">{selectedCostForApproval.vehiclePlate || '-'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Driver / PIC:</span>
              <span className="text-slate-300">{selectedCostForApproval.driverName || '-'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Diajukan Oleh:</span>
              <span className="text-slate-300">{selectedCostForApproval.createdBy}</span>
            </div>
            {selectedCostForApproval.notes && (
              <div className="pt-2 border-t border-slate-700">
                <span className="text-slate-400 block mb-1">Catatan:</span>
                <p className="text-slate-300 bg-slate-900/60 p-2 rounded-lg text-[11px]">
                  {selectedCostForApproval.notes}
                </p>
              </div>
            )}
          </div>

          {/* Rejection Form Input */}
          {isRejecting && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-rose-400">Alasan Penolakan (Wajib Diisi):</label>
              <textarea
                rows={2}
                required
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Tuliskan alasan penolakan atau revisi yang diperlukan..."
                className="w-full px-3 py-2 bg-slate-800 border border-rose-500/40 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-2">
            {!isRejecting ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsRejecting(true)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/30 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Tolak Biaya</span>
                </button>
                <button
                  type="button"
                  onClick={handleApprove}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Setujui (Approve)</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsRejecting(false)}
                  className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={!rejectReason.trim()}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold transition-all"
                >
                  Konfirmasi Penolakan
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
