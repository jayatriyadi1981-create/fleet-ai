/**
 * Fleet Intelligence Smart AI - Vehicle Performance Table (Prompt 28)
 * Tabel performa armada interaktif dengan sorting, search, filter, pagination, dan drilldown AI.
 */

import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronLeft,
  ChevronRight,
  Download,
  AlertTriangle,
} from 'lucide-react';
import { VehiclePerformanceItem } from '../../types';

interface VehiclePerformanceTableProps {
  vehicles: VehiclePerformanceItem[];
  onSelectVehicle: (vehicleId: string) => void;
  onExportCsv?: () => void;
}

export const VehiclePerformanceTable: React.FC<VehiclePerformanceTableProps> = ({
  vehicles,
  onSelectVehicle,
  onExportCsv,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof VehiclePerformanceItem>('ranking');
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter
  const filtered = vehicles.filter((v) => {
    const matchSearch =
      v.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRisk = riskFilter === 'all' || v.riskLevel === riskFilter;
    return matchSearch && matchRisk;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (typeof valA === 'string') {
      return sortAsc
        ? (valA as string).localeCompare(valB as string)
        : (valB as string).localeCompare(valA as string);
    }
    return sortAsc
      ? (valA as number) - (valB as number)
      : (valB as number) - (valA as number);
  });

  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field: keyof VehiclePerformanceItem) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // default desc for scores
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />;
      case 'declining':
        return <TrendingDown className="h-3.5 w-3.5 text-rose-400" />;
      default:
        return <Minus className="h-3.5 w-3.5 text-slate-400" />;
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'MEDIUM':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-white">Ranking & Analisis Performa Kendaraan</h3>
          <p className="text-xs text-slate-400">
            Daftar komprehensif metrik telematika, efisiensi BBM, utilisasi, dan skor performa AI
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari Plat / Model..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-700 bg-slate-950 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Risk Filter */}
          <select
            value={riskFilter}
            onChange={(e) => {
              setRiskFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-950 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Semua Risiko</option>
            <option value="LOW">Low Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="CRITICAL">Critical Risk</option>
          </select>

          {/* Export CSV */}
          {onExportCsv && (
            <button
              onClick={onExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-slate-400" />
              <span>Ekspor</span>
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-3 cursor-pointer" onClick={() => handleSort('ranking')}>
                <div className="flex items-center gap-1">
                  <span># Rank</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-2.5 px-3">Kendaraan</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 cursor-pointer" onClick={() => handleSort('utilizationPercent')}>
                <div className="flex items-center gap-1">
                  <span>Utilisasi</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-2.5 px-3 cursor-pointer" onClick={() => handleSort('fuelEfficiencyKmPerL')}>
                <div className="flex items-center gap-1">
                  <span>BBM (km/L)</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-2.5 px-3 cursor-pointer" onClick={() => handleSort('idleHours')}>
                <div className="flex items-center gap-1">
                  <span>Idle (Jam)</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-2.5 px-3 cursor-pointer" onClick={() => handleSort('safetyScore')}>
                <div className="flex items-center gap-1">
                  <span>Safety</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-2.5 px-3 cursor-pointer" onClick={() => handleSort('performanceScore')}>
                <div className="flex items-center gap-1">
                  <span>Performa Score</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-2.5 px-3">Tren</th>
              <th className="py-2.5 px-3">Tingkat Risiko</th>
              <th className="py-2.5 px-3 text-right">Aksi AI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-6 text-center text-slate-500">
                  Tidak ada kendaraan yang sesuai dengan kriteria filter.
                </td>
              </tr>
            ) : (
              paginated.map((v) => (
                <tr key={v.vehicleId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-300">#{v.ranking}</td>
                  <td className="py-2.5 px-3">
                    <button
                      onClick={() => onSelectVehicle(v.vehicleId)}
                      className="font-mono font-bold text-cyan-400 hover:underline block text-left"
                    >
                      {v.plateNumber}
                    </button>
                    <span className="text-[11px] text-slate-400">{v.brand} {v.model}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      v.status === 'moving' ? 'bg-emerald-500/20 text-emerald-300' :
                      v.status === 'idle' ? 'bg-amber-500/20 text-amber-300' :
                      v.status === 'offline' ? 'bg-slate-700 text-slate-300' :
                      'bg-blue-500/20 text-blue-300'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-200">{v.utilizationPercent}%</td>
                  <td className="py-2.5 px-3 font-mono text-slate-200">{v.fuelEfficiencyKmPerL}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-200">{v.idleHours}j</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-400">{v.safetyScore}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-white text-xs">{v.performanceScore}</span>
                      <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            v.performanceScore >= 80 ? 'bg-emerald-500' :
                            v.performanceScore >= 60 ? 'bg-cyan-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${v.performanceScore}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1">
                      {getTrendIcon(v.trend)}
                      <span className="text-[11px] text-slate-400 capitalize">{v.trend}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRiskBadge(v.riskLevel)}`}>
                      {v.riskLevel}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onSelectVehicle(v.vehicleId)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 text-[11px] font-semibold transition-colors ml-auto"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>AI Drilldown</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
        <span>Menampilkan {paginated.length} dari {filtered.length} unit kendaraan</span>
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1 rounded bg-slate-800 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 text-slate-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-mono text-slate-200">
            Halaman {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1 rounded bg-slate-800 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 text-slate-200"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
