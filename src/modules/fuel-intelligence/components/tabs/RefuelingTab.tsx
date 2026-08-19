/**
 * Fleet Intelligence Smart AI - Refueling Analysis Tab
 * Reconciles fuel sensor volume increase against fuel receipts/transactions,
 * and validates SPBU station authorizations and geofences.
 */

import React, { useState } from 'react';
import { RefuelingAuditItem } from '../../types';
import { Fuel, CheckCircle2, AlertTriangle, Search, Sparkles, MapPin, Building, FileCheck } from 'lucide-react';

interface RefuelingTabProps {
  refuelingAudits: RefuelingAuditItem[];
  onExplainWithAI: (topic: string, subject: string) => void;
}

export const RefuelingTab: React.FC<RefuelingTabProps> = ({
  refuelingAudits,
  onExplainWithAI,
}) => {
  const [filterResult, setFilterResult] = useState<string>('ALL');

  const filtered = refuelingAudits.filter((r) => {
    if (filterResult !== 'ALL' && r.reconciliationResult !== filterResult) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filter & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Fuel className="h-4 w-4 text-cyan-400" />
            Audit & Rekonsiliasi Pengisian Bahan Bakar (Refueling Analysis)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Mencocokkan kenaikan volume sensor tangki vs volume struk pembelian BBM dan memeriksa kepatuhan SPBU rekanan resmi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'CONSISTENT', 'MISMATCH_DETECTED', 'UNREGISTERED_STATION'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterResult(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-colors ${
                filterResult === status
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {status === 'ALL' ? 'Semua' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Refueling Audit Cards */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const isConsistent = item.reconciliationResult === 'CONSISTENT';
          const isMismatch = item.reconciliationResult === 'MISMATCH_DETECTED';

          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3 shadow-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl border ${
                      isConsistent
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : isMismatch
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    <Fuel className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-white">{item.plateNumber}</span>
                      <span className="text-xs text-slate-400">({item.driverName})</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                      <MapPin className="h-3 w-3 text-cyan-400" />
                      <span>{item.stationName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <div className="text-right font-mono">
                    <span className="text-[10px] text-slate-400 block">Total Biaya Transaksi</span>
                    <span className="text-xs font-bold text-white">Rp {item.totalCostIdr.toLocaleString()}</span>
                  </div>
                  <span
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border ${
                      isConsistent
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : isMismatch
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {item.reconciliationResult}
                  </span>
                </div>
              </div>

              {/* Volume Audit Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800 font-mono text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">Volume Struk/Klaim</span>
                  <span className="font-bold text-white text-sm">{item.transactionVolumeLiters} Liter</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Sensor Tangki Naik</span>
                  <span className="font-bold text-cyan-400 text-sm">{item.sensorIncreaseLiters} Liter</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Selisih (Discrepancy)</span>
                  <span className={`font-bold text-sm ${isConsistent ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {item.differenceLiters} Liter ({item.differencePercentage}%)
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Status SPBU</span>
                  <span className={`font-bold text-xs ${item.stationAuthorized ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {item.stationAuthorized ? '✓ Rekanan Resmi' : '⚠ Non-Rekanan'}
                  </span>
                </div>
              </div>

              {/* AI Observation */}
              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs text-slate-300 flex items-center justify-between">
                <p className="leading-snug">{item.aiObservation}</p>
                <button
                  onClick={() => onExplainWithAI('THEFT', `Audit Pengisian BBM ${item.plateNumber}`)}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 text-[11px] font-semibold flex items-center gap-1 shrink-0 ml-2"
                >
                  <Sparkles className="h-3 w-3" /> Audit AI
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
