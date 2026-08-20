/**
 * Fleet Intelligence Smart AI - Daily Briefing Archive & History Modal
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  History, 
  Calendar, 
  Search, 
  Filter, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Gauge,
  ShieldAlert,
  Download
} from 'lucide-react';
import { FleetDailyBriefing, DailyBriefingHistoryFilter } from '../../types/dailyBriefing';
import { DailyBriefingRepository } from '../../services/dailyBriefing/dailyBriefingRepository';

interface BriefingHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId?: string;
  onSelectBriefing: (briefing: FleetDailyBriefing) => void;
}

export const BriefingHistoryModal: React.FC<BriefingHistoryModalProps> = ({
  isOpen,
  onClose,
  tenantId = 'tenant-1',
  onSelectBriefing,
}) => {
  const [history, setHistory] = useState<FleetDailyBriefing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen, tenantId]);

  const loadHistory = async () => {
    setIsLoading(true);
    const filter: DailyBriefingHistoryFilter = {};
    if (searchQuery.trim()) {
      filter.searchQuery = searchQuery.trim();
    }
    const results = await DailyBriefingRepository.getHistory(tenantId, filter);
    setHistory(results);
    setIsLoading(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadHistory();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Arsip & Riwayat Laporan Harian AI
              </h3>
              <p className="text-xs text-slate-500">
                Akses kembali rekam jejak kecerdasan armada harian dan tren historis
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter / Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/40">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari berdasarkan tanggal (YYYY-MM-DD), judul isu, atau narasi eksekutif..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-2xs"
            >
              Cari
            </button>
          </form>
        </div>

        {/* Modal Body - History List */}
        <div className="p-5 space-y-3 overflow-y-auto flex-1 divide-y divide-slate-100">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-slate-500">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Memuat arsip laporan harian...
            </div>
          ) : history.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              Tidak ada arsip laporan yang cocok dengan pencarian.
            </div>
          ) : (
            history.map(item => (
              <div
                key={item.id}
                className="pt-3 pb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-slate-50/80 p-3 rounded-xl transition-colors"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                      {item.reportDate}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Health: {item.fleetHealth.overallScore}/100 (Grade {item.fleetHealth.grade})
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      Risk: {item.fleetRisk.riskScore}/100 [{item.fleetRisk.riskLevel}]
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 font-medium line-clamp-2">
                    {item.executiveSummary}
                  </p>

                  <div className="text-[11px] text-slate-400 flex items-center gap-3">
                    <span>Generated: {new Date(item.generatedAt).toLocaleTimeString('id-ID')}</span>
                    <span>•</span>
                    <span>Versi {item.version}</span>
                    <span>•</span>
                    <span>{item.problems.length} Masalah Terdeteksi</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectBriefing(item);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-indigo-600 transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-2xs"
                >
                  Buka Laporan
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
