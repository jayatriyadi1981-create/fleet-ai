/**
 * Fleet Intelligence Smart AI - Repairs Management Tab
 * PROMPT 25 - Corrective Repair Logs & Root Cause Analysis
 */

import React from 'react';
import {
  Wrench,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  FileText,
  User,
  Plus,
  HelpCircle
} from 'lucide-react';
import { MOCK_REPAIR_RECORDS } from '../../data/mockMaintenanceData';
import { RootCause } from '../../types';

interface RepairsTabProps {
  onSelectRepair?: (repairId: string) => void;
}

export const RepairsTab: React.FC<RepairsTabProps> = () => {
  const getRootCauseBadge = (cause: RootCause) => {
    switch (cause) {
      case 'WEAR_AND_TEAR':
        return <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-bold">WEAR & TEAR (USIA KOMPONEN)</span>;
      case 'DRIVER_BEHAVIOR':
        return <span className="bg-rose-950 text-rose-300 border border-rose-800/50 px-2 py-0.5 rounded text-[10px] font-bold">DRIVER BEHAVIOR (PENGEMUDI)</span>;
      case 'ROAD_CONDITION':
        return <span className="bg-amber-950 text-amber-300 border border-amber-800/50 px-2 py-0.5 rounded text-[10px] font-bold">KONDISI JALAN</span>;
      case 'ELECTRICAL':
        return <span className="bg-purple-950 text-purple-300 border border-purple-800/50 px-2 py-0.5 rounded text-[10px] font-bold">ELECTRICAL (KELISTRIKAN)</span>;
      case 'PART_FAILURE':
        return <span className="bg-orange-950 text-orange-300 border border-orange-800/50 px-2 py-0.5 rounded text-[10px] font-bold">CACAT SPAREPART</span>;
      default:
        return <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">{cause}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Wrench className="h-5 w-5 text-cyan-400" />
            Riwayat Perbaikan & Analisis Akar Masalah (Root Cause)
          </h2>
          <p className="text-xs text-slate-400">
            Log tindakan perbaikan komponen rusak, analisis penyebab utama kerusakan, waktu downtime, dan status klaim garansi.
          </p>
        </div>
      </div>

      {/* Repairs List */}
      <div className="space-y-4">
        {MOCK_REPAIR_RECORDS.map((rep) => (
          <div
            key={rep.id}
            className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white">{rep.repairNumber}</span>
                    <span className="text-xs font-bold text-cyan-300">({rep.vehiclePlate})</span>
                    {getRootCauseBadge(rep.rootCause)}
                  </div>
                  <p className="text-xs text-slate-200 font-semibold mt-0.5">{rep.issue}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-bold text-emerald-400 text-sm">
                  Rp {rep.totalCost.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] text-slate-500 block">Downtime: {rep.downtimeHours} Jam</span>
              </div>
            </div>

            {/* Diagnosis & Action */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Diagnosis Kerusakan:</span>
                <p className="text-slate-300 leading-relaxed">{rep.diagnosis}</p>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Tindakan Perbaikan (Repair Action):</span>
                <p className="text-emerald-300 leading-relaxed">{rep.repairAction}</p>
              </div>
            </div>

            {/* Parts & Labor Breakdown */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <span>Teknisi: <strong className="text-white">{rep.technicianName}</strong></span>
                <span>Garansi: <strong className={rep.warranty ? 'text-emerald-400' : 'text-slate-500'}>{rep.warranty ? `Aktif s/d ${rep.warrantyExpiry}` : 'Tidak Ada'}</strong></span>
              </div>
              <div>
                <span>Suku Cadang Digunakan: <strong className="text-white">{rep.parts.map((p) => `${p.name} (${p.quantity})`).join(', ')}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
