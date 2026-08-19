/**
 * Fleet Intelligence Smart AI - Maintenance Priority Queue Tab
 * Triages vehicle maintenance into P1 (Critical), P2 (High), P3 (Moderate), and P4 (Low)
 * based on passenger/cargo safety risk, vehicle mission criticality, and breakdown impact.
 */

import React, { useState } from 'react';
import { MaintenancePriorityItem, MaintenancePriorityLevel } from '../../types';
import { 
  Wrench, 
  AlertOctagon, 
  AlertTriangle, 
  Clock, 
  Search, 
  ShieldAlert, 
  Calendar,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface MaintenancePriorityTabProps {
  queue: MaintenancePriorityItem[];
  onRequestWorkOrder?: (vehicleId: string) => void;
}

export const MaintenancePriorityTab: React.FC<MaintenancePriorityTabProps> = ({
  queue,
  onRequestWorkOrder,
}) => {
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  const filtered = queue.filter((item) => {
    const matchesSearch = item.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
      item.componentName.toLowerCase().includes(search.toLowerCase()) ||
      item.primaryIssue.toLowerCase().includes(search.toLowerCase()) ||
      item.branch.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = priorityFilter === 'ALL' || item.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Wrench className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">AI Maintenance Priority Queue (P1–P4)</h3>
            <p className="text-xs text-slate-400">
              Antrean otomatis terurut berdasarkan urgensi keselamatan berkendara dan ketersediaan armada
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari plat atau kendala..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">Semua Prioritas</option>
            <option value="P1">P1 — Critical (Segera Bengkel)</option>
            <option value="P2">P2 — High (Maks 3 Hari)</option>
            <option value="P3">P3 — Moderate (Servis Rutin)</option>
            <option value="P4">P4 — Low (Monitoring)</option>
          </select>
        </div>
      </div>

      {/* Priority Cards List */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const isP1 = item.priority === 'P1';
          const isP2 = item.priority === 'P2';
          const isP3 = item.priority === 'P3';

          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all ${
                isP1 ? 'bg-rose-950/20 border-rose-500/40' :
                isP2 ? 'bg-orange-950/20 border-orange-500/30' :
                'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                      isP1 ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40' :
                      isP2 ? 'bg-orange-500/30 text-orange-300 border border-orange-500/40' :
                      isP3 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {item.priority}
                    </span>
                    <span className="text-sm font-bold font-mono text-white">{item.plateNumber}</span>
                    <span className="text-xs text-slate-400">• {item.vehicleType}</span>
                    <span className="text-xs text-cyan-300 font-semibold">• {item.componentName}</span>
                  </div>

                  <p className="text-xs text-slate-200 font-medium">{item.primaryIssue}</p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                    <span>Cabang: <strong className="text-slate-300">{item.branch}</strong></span>
                    <span>Supir: <strong className="text-slate-300">{item.driverName}</strong></span>
                    <span>Downtime Est: <strong className="text-white font-mono">{item.estimatedDowntimeHours} Jam</strong></span>
                    <span>Risk Score: <strong className="text-rose-400 font-mono">{item.riskScore}/100</strong></span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 shrink-0">
                  <span className="text-[11px] font-bold text-slate-300 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                    {item.recommendedAction}
                  </span>
                  {onRequestWorkOrder && (
                    <button
                      onClick={() => onRequestWorkOrder(item.vehicleId)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-sm transition-all"
                    >
                      Proses Work Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
