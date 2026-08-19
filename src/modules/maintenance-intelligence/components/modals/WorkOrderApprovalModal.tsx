/**
 * Fleet Intelligence Smart AI - Human-in-the-Loop Work Order Approval Modal
 * Allows Fleet Managers to review AI-generated maintenance recommendations,
 * select assigned technician team, add notes, and approve official Work Order creation.
 */

import React, { useState } from 'react';
import { MaintenanceRecommendationItem } from '../../types';
import { 
  X, 
  Wrench, 
  ShieldCheck, 
  DollarSign, 
  PackageCheck, 
  Calendar, 
  Sparkles, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface WorkOrderApprovalModalProps {
  recommendation: MaintenanceRecommendationItem;
  isOpen: boolean;
  onClose: () => void;
  onConfirmApproval: (recId: string, team: string, notes: string) => void;
}

export const WorkOrderApprovalModal: React.FC<WorkOrderApprovalModalProps> = ({
  recommendation,
  isOpen,
  onClose,
  onConfirmApproval,
}) => {
  const [assignedTeam, setAssignedTeam] = useState('Bengkel Depo Utama Cakung');
  const [scheduledDate, setScheduledDate] = useState(recommendation.recommendedDate);
  const [supervisorNotes, setSupervisorNotes] = useState('Disetujui untuk tindakan pemeliharaan preventif sesuai rekomendasi AI.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirmApproval(recommendation.id, assignedTeam, supervisorNotes);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Human-in-the-Loop — Persetujuan Work Order
              </h3>
              <p className="text-xs text-slate-400">
                Unit {recommendation.plateNumber} • {recommendation.componentName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* Summary Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400">{recommendation.serviceType}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                recommendation.priority === 'P1' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                recommendation.priority === 'P2' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                'bg-cyan-500/20 text-cyan-300'
              }`}>
                Prioritas: {recommendation.priority}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{recommendation.reason}</p>
          </div>

          {/* Parts Required & Estimated Cost */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-white block">Estimasi Suku Cadang & Biaya</span>
            <div className="space-y-1.5 text-xs text-slate-300">
              {recommendation.possibleParts.map((part, idx) => (
                <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400">•</span>
                    <span>{part.partName}</span>
                  </div>
                  <span className="font-mono text-slate-200">Rp {part.estimatedCost.toLocaleString('id-ID')}</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2 font-bold text-xs">
                <span className="text-white">Total Estimasi Anggaran:</span>
                <span className="font-mono text-emerald-400 text-sm">
                  Rp {recommendation.estimatedTotalCost.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Assignment Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">Tim Bengkel / Depo Pelaksana</label>
              <select
                value={assignedTeam}
                onChange={(e) => setAssignedTeam(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Bengkel Depo Utama Cakung">Bengkel Depo Utama Cakung</option>
                <option value="Bengkel Depo Daan Mogot">Bengkel Depo Daan Mogot</option>
                <option value="Bengkel Rekanan Resmi Hino / Isuzu">Bengkel Rekanan Resmi Hino / Isuzu</option>
                <option value="Tim Mobile Emergency Response">Tim Mobile Emergency Response</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">Jadwal Target Pengerjaan</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 block">Catatan Tambahan Supervisor</label>
            <textarea
              rows={3}
              value={supervisorNotes}
              onChange={(e) => setSupervisorNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          {/* Human approval safety assurance */}
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300/90 flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-cyan-400" />
            <span>
              Tindakan ini akan mengonversi rekomendasi AI menjadi <strong>Work Order resmi</strong> berstatus dijadwalkan dan mengirimkan notifikasi ke kepala bengkel.
            </span>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 rounded-xl shadow-md shadow-emerald-950 transition-all font-bold"
            >
              <CheckCircle2 className="h-4 w-4" />
              {isSubmitting ? 'Memproses...' : 'Setujui & Buat Work Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
