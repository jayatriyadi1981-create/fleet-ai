/**
 * Driver Ranking & Leaderboard Tab
 * PROMPT 29 - Full Fleet Ranking, Top Performers & Attention Required
 */

import React, { useState } from 'react';
import {
  Award,
  AlertTriangle,
  Search,
  Filter,
  ArrowUpDown,
  TrendingDown,
  TrendingUp,
  UserCheck,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { DriverRankingItem, DriverRiskLevel, DriverIntelligencePeriod } from '../../types';

interface DriverRankingTabProps {
  rankings: DriverRankingItem[];
  topPerformers: DriverRankingItem[];
  attentionRequired: DriverRankingItem[];
  period: DriverIntelligencePeriod;
  onSelectDriver: (driverId: string) => void;
  onOpenCoachingModal: (driverId: string) => void;
  onCompareDrivers: (driverIds: string[]) => void;
}

export const DriverRankingTab: React.FC<DriverRankingTabProps> = ({
  rankings,
  topPerformers,
  attentionRequired,
  period,
  onSelectDriver,
  onOpenCoachingModal,
  onCompareDrivers,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'CRITICAL' | 'TOP'>('ALL');
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'SAFETY' | 'RISK' | 'PERFORMANCE' | 'DISTANCE'>('SAFETY');

  // Filter & Search
  let displayList = rankings.filter((r) => {
    const matchSearch =
      r.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.branchName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchType =
      filterType === 'ALL'
        ? true
        : filterType === 'CRITICAL'
        ? r.isAttentionRequired
        : r.isTopPerformer;

    return matchSearch && matchType;
  });

  // Sorting
  displayList = [...displayList].sort((a, b) => {
    switch (sortBy) {
      case 'RISK':
        return b.riskScore - a.riskScore;
      case 'PERFORMANCE':
        return b.performanceScore - a.performanceScore;
      case 'DISTANCE':
        return b.totalDistanceKm - a.totalDistanceKm;
      case 'SAFETY':
      default:
        return b.safetyScore - a.safetyScore;
    }
  });

  const toggleCompare = (driverId: string) => {
    if (selectedForCompare.includes(driverId)) {
      setSelectedForCompare(selectedForCompare.filter((id) => id !== driverId));
    } else {
      if (selectedForCompare.length < 4) {
        setSelectedForCompare([...selectedForCompare, driverId]);
      }
    }
  };

  const getRiskBadge = (level: DriverRiskLevel) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'MODERATE':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'LOW':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'VERY_LOW':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Compare Floating Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight">
              Leaderboard & Ranking Pengemudi
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Total {displayList.length} Pengemudi
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Daftar peringkat keselamatan armada berdasarkan evaluasi multi-faktor dan telematika sensorik.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama, nopol, cabang..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 w-52"
            />
          </div>

          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                filterType === 'ALL'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterType('CRITICAL')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                filterType === 'CRITICAL'
                  ? 'bg-rose-500 text-white font-bold'
                  : 'text-rose-400 hover:text-rose-300'
              }`}
            >
              Perlu Coaching ({attentionRequired.length})
            </button>
            <button
              onClick={() => setFilterType('TOP')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                filterType === 'TOP'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              Top Teladan ({topPerformers.length})
            </button>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="SAFETY">Urut: Safety Score</option>
            <option value="RISK">Urut: Risk Score</option>
            <option value="PERFORMANCE">Urut: Performa</option>
            <option value="DISTANCE">Urut: Jarak Tempuh</option>
          </select>
        </div>
      </div>

      {/* Compare Floating Bar (if >= 2 selected) */}
      {selectedForCompare.length >= 2 && (
        <div className="bg-cyan-950/80 border border-cyan-500/40 p-3 rounded-2xl flex items-center justify-between shadow-2xl animate-fade-in">
          <div className="flex items-center gap-2 text-xs text-cyan-200">
            <span className="font-bold">{selectedForCompare.length} Pengemudi Dipilih</span>
            <span>untuk Komparasi Head-to-Head</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedForCompare([])}
              className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white text-xs font-semibold"
            >
              Batal
            </button>
            <button
              onClick={() => onCompareDrivers(selectedForCompare)}
              className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20"
            >
              Bandingkan ({selectedForCompare.length})
            </button>
          </div>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 bg-slate-950/60">
                <th className="py-3 px-3 w-10 text-center">KOMPARASI</th>
                <th className="py-3 px-3 w-12 text-center">RANK</th>
                <th className="py-3 px-4">PENGEMUDI & KENDARAAN</th>
                <th className="py-3 px-3 text-center">SAFETY SCORE</th>
                <th className="py-3 px-3 text-center">RISK SCORE</th>
                <th className="py-3 px-3 text-center">PERFORMA</th>
                <th className="py-3 px-3 text-center">TRIPS / KM</th>
                <th className="py-3 px-3">TREN</th>
                <th className="py-3 px-4 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {displayList.map((item, idx) => {
                const isSelected = selectedForCompare.includes(item.driverId);
                return (
                  <tr
                    key={item.driverId}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => onSelectDriver(item.driverId)}
                  >
                    {/* Checkbox for Compare */}
                    <td
                      className="py-3 px-3 text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCompare(item.driverId);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500/30 cursor-pointer"
                      />
                    </td>

                    {/* Rank Number */}
                    <td className="py-3 px-3 text-center font-mono font-bold">
                      {idx === 0 ? (
                        <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 inline-flex items-center justify-center text-xs">
                          🥇
                        </span>
                      ) : idx === 1 ? (
                        <span className="w-6 h-6 rounded-full bg-slate-400/20 text-slate-200 inline-flex items-center justify-center text-xs">
                          🥈
                        </span>
                      ) : idx === 2 ? (
                        <span className="w-6 h-6 rounded-full bg-amber-700/20 text-amber-500 inline-flex items-center justify-center text-xs">
                          🥉
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono">#{idx + 1}</span>
                      )}
                    </td>

                    {/* Driver & Vehicle */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-white">
                          {item.driverName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white group-hover:text-cyan-400 transition-colors">
                              {item.driverName}
                            </span>
                            {item.isTopPerformer && (
                              <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            )}
                            {item.isAttentionRequired && (
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {item.vehiclePlate} • {item.branchName}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Safety Score */}
                    <td className="py-3 px-3 text-center font-mono">
                      <span className="text-sm font-bold text-emerald-400">
                        {item.safetyScore}
                      </span>
                      <span className="text-[10px] text-slate-500">/100</span>
                    </td>

                    {/* Risk Score */}
                    <td className="py-3 px-3 text-center font-mono">
                      <span
                        className={`text-sm font-bold ${
                          item.riskScore > 50 ? 'text-rose-400' : 'text-slate-300'
                        }`}
                      >
                        {item.riskScore}
                      </span>
                      <span className="text-[10px] text-slate-500">/100</span>
                    </td>

                    {/* Performance */}
                    <td className="py-3 px-3 text-center font-mono font-semibold text-cyan-400">
                      {item.performanceScore}/100
                    </td>

                    {/* Trips & Distance */}
                    <td className="py-3 px-3 text-center font-mono text-slate-300">
                      <div>{item.totalTrips} trips</div>
                      <div className="text-[10px] text-slate-500">
                        {item.totalDistanceKm.toLocaleString()} km
                      </div>
                    </td>

                    {/* Trend */}
                    <td className="py-3 px-3">
                      {item.trend === 'IMPROVING' ? (
                        <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                          <TrendingDown className="w-3 h-3" /> Membaik
                        </span>
                      ) : item.trend === 'DECLINING' ? (
                        <span className="text-[11px] text-rose-400 font-semibold flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> Waspada
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-semibold">Stabil</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {item.riskScore > 45 && (
                          <button
                            onClick={() => onOpenCoachingModal(item.driverId)}
                            className="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold"
                          >
                            Coach
                          </button>
                        )}
                        <button
                          onClick={() => onSelectDriver(item.driverId)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
