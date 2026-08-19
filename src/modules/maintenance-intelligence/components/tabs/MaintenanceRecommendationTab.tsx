/**
 * Fleet Intelligence Smart AI - Maintenance Recommendations Tab
 * Actionable AI recommendations for periodic maintenance, parts replacement,
 * inspection checklists, cost budgeting, and supervisor approval flow.
 */

import React, { useState } from 'react';
import { MaintenanceRecommendationItem, RecommendationStatus } from '../../types';
import { 
  Sparkles, 
  Search, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  DollarSign, 
  Package, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface MaintenanceRecommendationTabProps {
  recommendations: MaintenanceRecommendationItem[];
  onReviewRecommendation: (rec: MaintenanceRecommendationItem) => void;
}

export const MaintenanceRecommendationTab: React.FC<MaintenanceRecommendationTabProps> = ({
  recommendations,
  onReviewRecommendation,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filtered = recommendations.filter((r) => {
    const matchesSearch = r.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.serviceType.toLowerCase().includes(search.toLowerCase()) ||
      r.componentName.toLowerCase().includes(search.toLowerCase()) ||
      r.branch.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">AI Maintenance Recommendations</h3>
            <p className="text-xs text-slate-400">
              Rekomendasi tindakan preskriptif dengan estimasi biaya suku cadang dan validasi supervisor
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari rekomendasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">Semua Status</option>
            <option value="PENDING_REVIEW">Menunggu Persetujuan</option>
            <option value="WORK_ORDER_CREATED">Work Order Dibuat</option>
            <option value="APPROVED">Disetujui</option>
          </select>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((rec) => {
          const isPending = rec.status === 'PENDING_REVIEW';
          const isWO = rec.status === 'WORK_ORDER_CREATED';

          return (
            <div
              key={rec.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold font-mono text-white">{rec.plateNumber}</span>
                      <span className="text-xs text-slate-400">• {rec.branch}</span>
                    </div>
                    <h4 className="text-xs font-bold text-cyan-300 mt-1">{rec.serviceType}</h4>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      rec.priority === 'P1' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      rec.priority === 'P2' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                      'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}>
                      {rec.priority}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isWO ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      isPending ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {rec.status}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Alasan / Diagnosis AI</span>
                  <p className="leading-relaxed">{rec.reason}</p>
                </div>

                {/* Suku Cadang & Anggaran */}
                <div className="space-y-1.5 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Kebutuhan Suku Cadang Terestimasi:
                  </span>
                  <div className="space-y-1 text-slate-300 text-[11px]">
                    {rec.possibleParts.map((part, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span>• {part.partName}</span>
                        <span className="font-mono text-slate-400">Rp {part.estimatedCost.toLocaleString('id-ID')}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 font-semibold text-xs">
                      <span className="text-white">Total Estimasi:</span>
                      <span className="font-mono text-emerald-400">Rp {rec.estimatedTotalCost.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>

                {isWO && rec.approvalDetails && (
                  <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
                    <span>Work Order ID: <strong>{rec.approvalDetails.workOrderId}</strong></span>
                    <span className="text-[11px] text-emerald-400">Oleh: {rec.approvalDetails.approvedBy}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Target Jadwal: <strong className="text-slate-200">{rec.recommendedDate}</strong>
                </span>

                {isPending && (
                  <button
                    onClick={() => onReviewRecommendation(rec)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-colors"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Tinjau & Setujui
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
