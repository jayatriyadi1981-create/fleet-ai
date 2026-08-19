/**
 * Fleet Intelligence Smart AI - Maintenance Anomaly Tab
 * Detects repeat component failures, unusual workshop downtime,
 * cost spikes, and post-service recurrent breakdowns.
 */

import React, { useState } from 'react';
import { MaintenanceAnomalyItem, AnomalyPatternType } from '../../types';
import { 
  AlertOctagon, 
  Search, 
  Sparkles, 
  RotateCcw, 
  DollarSign, 
  Clock, 
  Wrench, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

interface MaintenanceAnomalyTabProps {
  anomalies: MaintenanceAnomalyItem[];
  onRequestWorkOrder?: (vehicleId: string) => void;
}

export const MaintenanceAnomalyTab: React.FC<MaintenanceAnomalyTabProps> = ({
  anomalies,
  onRequestWorkOrder,
}) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const filtered = anomalies.filter((a) => {
    const matchesSearch = a.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.component.toLowerCase().includes(search.toLowerCase()) ||
      a.branch.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || a.patternType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <AlertOctagon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Maintenance Anomaly & Repeat Failure Detection</h3>
            <p className="text-xs text-slate-400">
              Analisis cerdas untuk mendeteksi perbaikan berulang, lonjakan biaya bengkel, dan downtime ekstrem
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari plat atau pola..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">Semua Pola Anomali</option>
            <option value="REPEAT_COMPONENT_FAILURE">Kerusakan Komponen Berulang (Repeat)</option>
            <option value="COST_OUTLIER">Lonjakan Biaya Pemeliharaan</option>
            <option value="ABNORMAL_DOWNTIME">Downtime Bengkel Ekstrem</option>
          </select>
        </div>
      </div>

      {/* Anomalies List */}
      <div className="space-y-3">
        {filtered.map((anomaly) => {
          const isCritical = anomaly.severity === 'CRITICAL';

          return (
            <div
              key={anomaly.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold font-mono text-white">{anomaly.plateNumber}</span>
                    <span className="text-xs text-slate-400">• {anomaly.branch}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isCritical ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {anomaly.severity}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-cyan-300 mt-1">{anomaly.title}</h4>
                </div>

                <div className="text-right text-xs">
                  <span className="text-slate-400 block">Frekuensi Kejadian</span>
                  <span className="font-mono font-bold text-amber-300">{anomaly.frequencyCount}x dalam {anomaly.periodDays} Hari</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                <p className="text-slate-300 leading-relaxed">{anomaly.description}</p>
                {anomaly.evidence && anomaly.evidence.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/60 text-slate-300">
                    <strong className="text-cyan-400">Bukti Telemetri & Histori: </strong>
                    {anomaly.evidence.join('; ')}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="text-xs text-slate-300">
                  <strong>Rekomendasi Solusi: </strong>
                  <span className="text-slate-400">{anomaly.suggestedAction}</span>
                </div>

                {onRequestWorkOrder && (
                  <button
                    onClick={() => onRequestWorkOrder(anomaly.vehicleId)}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold shrink-0 transition-colors"
                  >
                    Buka Work Order Investigasi
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
