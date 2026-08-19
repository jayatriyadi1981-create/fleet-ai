/**
 * Overview Tab - AI Driver Intelligence Hub
 * PROMPT 29 - Executive Telematics & Driver Risk Dashboard
 */

import React from 'react';
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  Award,
  TrendingDown,
  TrendingUp,
  Brain,
  Sparkles,
  ArrowRight,
  UserCheck,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { DriverIntelligenceFullProfile } from '../../engines/DriverIntelligenceService';
import { DriverRankingItem, DriverRiskMatrixNode, DriverIntelligencePeriod } from '../../types';
import { DriverRiskMatrixWidget } from '../widgets/DriverRiskMatrixWidget';
import { AIDriverInsightCard } from '../cards/AIDriverInsightCard';

interface OverviewTabProps {
  period: DriverIntelligencePeriod;
  onPeriodChange: (p: DriverIntelligencePeriod) => void;
  rankings: DriverRankingItem[];
  topPerformers: DriverRankingItem[];
  attentionRequired: DriverRankingItem[];
  matrixNodes: DriverRiskMatrixNode[];
  onSelectDriver: (driverId: string) => void;
  onNavigateTab: (tabId: string) => void;
  onOpenCoachingModal: (driverId?: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  period,
  onPeriodChange,
  rankings,
  topPerformers,
  attentionRequired,
  matrixNodes,
  onSelectDriver,
  onNavigateTab,
  onOpenCoachingModal,
}) => {
  // Aggregate Stats
  const totalDrivers = rankings.length;
  const avgSafetyScore = Math.round(
    rankings.reduce((acc, curr) => acc + curr.safetyScore, 0) / Math.max(totalDrivers, 1)
  );
  const avgRiskScore = Math.round(
    rankings.reduce((acc, curr) => acc + curr.riskScore, 0) / Math.max(totalDrivers, 1)
  );
  const criticalCount = attentionRequired.length;
  const championsCount = topPerformers.length;

  return (
    <div className="space-y-6">
      {/* Top Banner: Period Selector & Executive KPIs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Brain className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-white tracking-tight">
              AI Driver Intelligence Monitor
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Analisis telemetri real-time, evaluasi risiko berbasis 6 dimensi, dan pembinaan keselamatan terpadu.
          </p>
        </div>

        {/* Period Buttons */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => onPeriodChange('7_DAYS')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              period === '7_DAYS'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            7 Hari
          </button>
          <button
            onClick={() => onPeriodChange('30_DAYS')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              period === '30_DAYS'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            30 Hari
          </button>
          <button
            onClick={() => onPeriodChange('90_DAYS')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              period === '90_DAYS'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            90 Hari
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Fleet Safety Score */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
              Rata-Rata Safety Score
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white font-mono">{avgSafetyScore}</span>
              <span className="text-xs text-slate-400">/ 100</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5 ml-auto">
                <TrendingUp className="w-3.5 h-3.5" /> +2.4 poin
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Kategori: <strong className="text-emerald-300">Baik Sekali (Grade A)</strong>
            </p>
          </div>
        </div>

        {/* KPI 2: Fleet Risk Score */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 hover:border-rose-500/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
              Rata-Rata Risk Score
            </span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-rose-400 font-mono">{avgRiskScore}</span>
              <span className="text-xs text-slate-400">/ 100</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5 ml-auto">
                <TrendingDown className="w-3.5 h-3.5" /> -4.1 poin
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Tren membaik (penurunan overspeed tol)
            </p>
          </div>
        </div>

        {/* KPI 3: Critical Drivers for Coaching */}
        <div
          onClick={() => onNavigateTab('ranking')}
          className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
              Perlu Perhatian Kritis
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-400 font-mono">{criticalCount}</span>
              <span className="text-xs text-slate-400">/ {totalDrivers} Driver</span>
              <span className="text-[11px] text-cyan-400 font-semibold ml-auto flex items-center gap-0.5">
                Detail <ChevronRight className="w-3 h-3" />
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Prioritas masuk program pembinaan terpadu
            </p>
          </div>
        </div>

        {/* KPI 4: Top Safety Champions */}
        <div
          onClick={() => onNavigateTab('ranking')}
          className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
              Safety Champions
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-cyan-400 font-mono">{championsCount}</span>
              <span className="text-xs text-slate-400">Driver Teladan</span>
              <span className="text-[11px] text-cyan-400 font-semibold ml-auto flex items-center gap-0.5">
                Lihat <ChevronRight className="w-3 h-3" />
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Safety Score ≥ 85 tanpa insiden berbahaya
            </p>
          </div>
        </div>
      </div>

      {/* 4-Quadrant Driver Risk Matrix */}
      <DriverRiskMatrixWidget
        nodes={matrixNodes}
        onSelectDriver={onSelectDriver}
        onOpenCoaching={onOpenCoachingModal}
      />

      {/* 2-Column: Left Top Actionable AI Insights / Right High-Risk vs Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: AI Proactive Insights (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Rekomendasi Utama AI Copilot</h3>
            </div>
            <button
              onClick={() => onNavigateTab('recommendations')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            <AIDriverInsightCard
              category="RISK"
              title="Peringatan Overspeed Berulang di Tol Cipali"
              summary="Pengemudi Ahmad Fauzi mencatat 6x insiden kecepatan di atas 95 km/jam di segmen KM 102-140 dalam 7 hari terakhir."
              evidence={[
                'Kecepatan puncak terdeteksi 104.2 km/jam (Batas Tol: 80 km/jam)',
                'Kondisi jalan basah saat hujan malam hari',
                'Kategori risiko keselamatan: TINGGI',
              ]}
              actionLabel="Jadwalkan Sesi Coaching Kecepatan"
              onAction={() => onOpenCoachingModal('drv-01')}
              driverName="Ahmad Fauzi"
              score={74}
            />

            <AIDriverInsightCard
              category="COACHING"
              title="Efektivitas Program Coaching Pengereman +32%"
              summary="Sesi coaching 'Jarak Aman 3 Detik' untuk Budi Santoso menunjukkan penurunan pengereman mendadak dari 8 kali menjadi 1 kali per minggu."
              evidence={[
                'Insiden Harsh Braking turun -87.5%',
                'Safety Score naik dari 68 menjadi 84/100',
                'Pengemudi menandatangani komitmen perbaikan',
              ]}
              actionLabel="Lihat Log Evaluasi Coaching"
              onAction={() => onNavigateTab('coaching')}
              driverName="Budi Santoso"
              score={28}
            />
          </div>
        </div>

        {/* Right: Quick Spotlight Leaderboards (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-bold text-white">Prioritas Tindakan Pengemudi</h3>
            </div>
            <button
              onClick={() => onNavigateTab('ranking')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <span>Ranking Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Attention Required Mini List */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1.5 uppercase">
                <AlertTriangle className="w-3.5 h-3.5" />
                Driver Memerlukan Coaching Khusus
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Risk Score</span>
            </div>

            <div className="space-y-2">
              {attentionRequired.slice(0, 3).map((driver) => (
                <div
                  key={driver.driverId}
                  onClick={() => onSelectDriver(driver.driverId)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800/80 hover:border-rose-500/40 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-white">
                      {driver.driverName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{driver.driverName}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {driver.vehiclePlate} • {driver.branchName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-rose-400">
                        {driver.riskScore}/100
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        Safety {driver.safetyScore}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenCoachingModal(driver.driverId);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-[10px] font-bold"
                    >
                      Coach
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Top Performers Mini List */}
            <div className="pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
                  <Award className="w-3.5 h-3.5" />
                  Top Safety Performers (Bulan Ini)
                </span>
              </div>
              <div className="space-y-1.5">
                {topPerformers.slice(0, 2).map((driver, idx) => (
                  <div
                    key={driver.driverId}
                    onClick={() => onSelectDriver(driver.driverId)}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-950/40 hover:bg-slate-950 border border-slate-800/60 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono font-bold text-cyan-400">#{idx + 1}</span>
                      <span className="text-xs font-semibold text-slate-200">{driver.driverName}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {driver.safetyScore} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
