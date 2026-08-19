/**
 * Driver Risk Matrix Widget (4-Quadrant Interactive Matrix)
 * PROMPT 29 - Visualizes drivers across Performance (X-axis) vs Risk Score (Y-axis)
 */

import React, { useState } from 'react';
import {
  AlertTriangle,
  Award,
  Zap,
  Clock,
  Search,
  Filter,
  UserCheck,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  Info,
} from 'lucide-react';
import { DriverRiskMatrixNode } from '../../types';

interface DriverRiskMatrixWidgetProps {
  nodes: DriverRiskMatrixNode[];
  onSelectDriver: (driverId: string) => void;
  onOpenCoaching?: (driverId: string) => void;
}

export const DriverRiskMatrixWidget: React.FC<DriverRiskMatrixWidgetProps> = ({
  nodes,
  onSelectDriver,
  onOpenCoaching,
}) => {
  const [selectedQuadrant, setSelectedQuadrant] = useState<
    DriverRiskMatrixNode['quadrant'] | 'ALL'
  >('ALL');
  const [hoveredNode, setHoveredNode] = useState<DriverRiskMatrixNode | null>(null);
  const [filterQuery, setFilterQuery] = useState('');

  const filteredNodes = nodes.filter((n) => {
    const matchQuadrant = selectedQuadrant === 'ALL' || n.quadrant === selectedQuadrant;
    const matchSearch =
      filterQuery === '' ||
      n.driverName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      n.vehiclePlate.toLowerCase().includes(filterQuery.toLowerCase());
    return matchQuadrant && matchSearch;
  });

  const getQuadrantInfo = (quadrant: DriverRiskMatrixNode['quadrant']) => {
    switch (quadrant) {
      case 'CRITICAL_ATTENTION':
        return {
          title: 'Perhatian Kritis (Prioritas Coaching)',
          desc: 'Risiko Tinggi (>50) & Performa Rendah (<70)',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          dotColor: '#f43f5e',
          icon: AlertTriangle,
          actionText: 'Jadwalkan Coaching Wajib',
        };
      case 'COACHING_OPPORTUNITY':
        return {
          title: 'Peluang Pembinaan (Agresif/Cepat)',
          desc: 'Risiko Tinggi (>50) & Performa Tinggi (≥70)',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          dotColor: '#f59e0b',
          icon: Zap,
          actionText: 'Refocusing Batas Kecepatan',
        };
      case 'LOW_RISK_DEV':
        return {
          title: 'Pengembangan Efisiensi (Lambat/Idle)',
          desc: 'Risiko Rendah (≤50) & Performa Rendah (<70)',
          badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          dotColor: '#3b82f6',
          icon: Clock,
          actionText: 'Optimasi Rute & Waktu Tempuh',
        };
      case 'EXEMPLARY_BENCHMARK':
        return {
          title: 'Pengemudi Teladan (Benchmark Armada)',
          desc: 'Risiko Rendah (≤50) & Performa Tinggi (≥70)',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          dotColor: '#10b981',
          icon: Award,
          actionText: 'Program Apresiasi & Reward',
        };
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800/90 p-5 shadow-2xl space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-wider">
              4-Quadrant Intelligence Matrix
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Total {nodes.length} Drivers Mapped
            </span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight mt-1">
            Matriks Risiko vs Performa Pengemudi
          </h3>
          <p className="text-xs text-slate-400">
            Pemetaan objektif telematika untuk mengidentifikasi pengemudi teladan dan prioritas program coaching non-punitif.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari driver / nopol..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 w-44 sm:w-56"
            />
          </div>

          <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedQuadrant('ALL')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                selectedQuadrant === 'ALL'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Semua ({nodes.length})
            </button>
            <button
              onClick={() => setSelectedQuadrant('CRITICAL_ATTENTION')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                selectedQuadrant === 'CRITICAL_ATTENTION'
                  ? 'bg-rose-500 text-white font-bold'
                  : 'text-rose-400/80 hover:text-rose-300'
              }`}
            >
              Kritis ({nodes.filter((n) => n.quadrant === 'CRITICAL_ATTENTION').length})
            </button>
            <button
              onClick={() => setSelectedQuadrant('EXEMPLARY_BENCHMARK')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                selectedQuadrant === 'EXEMPLARY_BENCHMARK'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-emerald-400/80 hover:text-emerald-300'
              }`}
            >
              Teladan ({nodes.filter((n) => n.quadrant === 'EXEMPLARY_BENCHMARK').length})
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column: Left Matrix Grid / Right Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Interactive 2D Coordinate Grid (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80 relative flex flex-col justify-between min-h-[360px]">
          {/* Axis Labels */}
          <div className="absolute top-2 left-4 flex items-center gap-1.5 text-[11px] font-mono text-rose-400 font-bold">
            <span>▲ Risk Score (Tinggi = Berisiko)</span>
          </div>
          <div className="absolute bottom-2 right-4 flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 font-bold">
            <span>Performa Score (Tinggi = Bagus) ►</span>
          </div>

          {/* 4 Quadrant Background Divisions */}
          <div className="w-full h-[280px] relative my-4 border border-dashed border-slate-700/60 rounded-xl overflow-hidden bg-slate-950/40">
            {/* Horizontal Risk Threshold (Y = 50) */}
            <div className="absolute left-0 right-0 top-1/2 border-b border-dashed border-slate-700 pointer-events-none" />
            {/* Vertical Performance Threshold (X = 70) */}
            <div className="absolute top-0 bottom-0 left-[70%] border-r border-dashed border-slate-700 pointer-events-none" />

            {/* Quadrant Watermark Backgrounds */}
            {/* Q1: Top-Left (Critical) */}
            <div className="absolute top-0 left-0 w-[70%] h-1/2 p-2 bg-rose-500/5 hover:bg-rose-500/10 transition-colors pointer-events-none flex flex-col justify-start">
              <span className="text-[10px] font-mono font-bold text-rose-400/60">
                KUADRAN 1: CRITICAL ATTENTION
              </span>
            </div>

            {/* Q2: Top-Right (Aggressive / High Risk & High Perf) */}
            <div className="absolute top-0 left-[70%] w-[30%] h-1/2 p-2 bg-amber-500/5 hover:bg-amber-500/10 transition-colors pointer-events-none flex flex-col justify-start">
              <span className="text-[10px] font-mono font-bold text-amber-400/60">
                KUADRAN 2: COACHING
              </span>
            </div>

            {/* Q3: Bottom-Left (Slow / Low Risk & Low Perf) */}
            <div className="absolute bottom-0 left-0 w-[70%] h-1/2 p-2 bg-blue-500/5 hover:bg-blue-500/10 transition-colors pointer-events-none flex flex-col justify-end">
              <span className="text-[10px] font-mono font-bold text-blue-400/60">
                KUADRAN 3: DEVELOPMENT
              </span>
            </div>

            {/* Q4: Bottom-Right (Exemplary / Low Risk & High Perf) */}
            <div className="absolute bottom-0 left-[70%] w-[30%] h-1/2 p-2 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors pointer-events-none flex flex-col justify-end">
              <span className="text-[10px] font-mono font-bold text-emerald-400/60">
                KUADRAN 4: BENCHMARK
              </span>
            </div>

            {/* Plot Driver Nodes */}
            {filteredNodes.map((n) => {
              // Map Performance (0-100) to X (4% - 94%)
              const leftPercent = Math.max(5, Math.min(93, n.performanceScore));
              // Map Risk (0-100) to Y (Inverted: 100 Risk is Top 5%, 0 Risk is Bottom 93%)
              const topPercent = Math.max(6, Math.min(92, 100 - n.riskScore));

              const isHovered = hoveredNode?.driverId === n.driverId;
              const qInfo = getQuadrantInfo(n.quadrant);

              return (
                <div
                  key={n.driverId}
                  style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 z-10`}
                  onMouseEnter={() => setHoveredNode(n)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => onSelectDriver(n.driverId)}
                >
                  <div
                    className={`relative flex items-center justify-center rounded-full transition-transform ${
                      isHovered ? 'scale-150 z-30 shadow-lg' : 'scale-100'
                    }`}
                  >
                    <div
                      style={{ backgroundColor: qInfo.dotColor }}
                      className="w-4 h-4 rounded-full border-2 border-slate-900 shadow-md flex items-center justify-center"
                    >
                      <span className="text-[7px] font-bold text-slate-950">
                        {n.driverName.charAt(0)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Axis Scale Markings */}
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800">
            <span>Performa: 0</span>
            <span>50</span>
            <span className="text-cyan-400 font-bold">70 (Target)</span>
            <span>85</span>
            <span>100</span>
          </div>
        </div>

        {/* Right: Focused Driver Telemetry Card / Quadrant Explanations (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
          {hoveredNode ? (
            <div className="bg-slate-950/90 p-4 rounded-2xl border border-cyan-500/40 shadow-xl space-y-3 animate-fade-in">
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                      getQuadrantInfo(hoveredNode.quadrant).badge
                    }`}
                  >
                    {getQuadrantInfo(hoveredNode.quadrant).title}
                  </span>
                  <h4 className="text-base font-bold text-white mt-1.5 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-cyan-400" />
                    {hoveredNode.driverName}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">
                    {hoveredNode.vehiclePlate} • {hoveredNode.branchName}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 block">RISK SCORE</span>
                  <span
                    className={`text-lg font-mono font-black ${
                      hoveredNode.riskScore > 50 ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {hoveredNode.riskScore}/100
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">SAFETY SCORE</span>
                  <span className="font-bold text-white">{hoveredNode.safetyScore}/100</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">PERFORMA</span>
                  <span className="font-bold text-white">{hoveredNode.performanceScore}/100</span>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">FAKTOR UTAMA</span>
                  <span className="font-semibold text-amber-300">{hoveredNode.primaryRiskFactor}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => onSelectDriver(hoveredNode.driverId)}
                  className="flex-1 py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 transition-all"
                >
                  <span>Lihat Profil AI</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                {onOpenCoaching && hoveredNode.riskScore > 40 && (
                  <button
                    onClick={() => onOpenCoaching(hoveredNode.driverId)}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs border border-slate-700"
                  >
                    Coaching
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-xs space-y-3">
              <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                <Info className="w-4 h-4" />
                <span>Panduan Kuadran AI Driver</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Arahkan kursor atau klik pada lingkaran driver di grid untuk menganalisis risiko telematika, faktor pemicu, dan program coaching yang direkomendasikan AI.
              </p>
              <div className="space-y-2 pt-1">
                {(
                  [
                    'CRITICAL_ATTENTION',
                    'COACHING_OPPORTUNITY',
                    'LOW_RISK_DEV',
                    'EXEMPLARY_BENCHMARK',
                  ] as const
                ).map((q) => {
                  const info = getQuadrantInfo(q);
                  const count = nodes.filter((n) => n.quadrant === q).length;
                  return (
                    <div
                      key={q}
                      onClick={() => setSelectedQuadrant(q)}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          style={{ backgroundColor: info.dotColor }}
                          className="w-2.5 h-2.5 rounded-full"
                        />
                        <span className="text-[11px] font-semibold text-slate-200">{info.title}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400">{count} driver</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Benchmark Summary */}
          <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/60 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>Benchmark Armada</span>
            <span className="text-slate-200">
              Avg Risk: <strong className="text-cyan-400">41</strong> | Avg Safety:{' '}
              <strong className="text-emerald-400">79</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
