/**
 * Fleet Intelligence Smart AI - Main Analytics Dashboard View
 * PROMPT 36 - Enterprise Executive Overview
 */

import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  PieChart,
  Award,
  Navigation,
  Truck,
  Clock,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';
import { MetricDelta } from '../../types';

interface MetricCardProps {
  title: string;
  value: string | number;
  delta: MetricDelta;
  unit?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  onClickTab?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, delta, unit, icon: Icon, iconColor, onClickTab }) => {
  const { setActiveTab } = useAnalytics();
  const isUp = delta.trend === 'up';

  return (
    <div
      onClick={() => onClickTab && setActiveTab(onClickTab as any)}
      className="group relative rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 backdrop-blur-md transition-all hover:border-slate-700 hover:bg-slate-850 cursor-pointer shadow-lg shadow-black/20"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        <div className={`rounded-xl p-2.5 ${iconColor} bg-slate-950 border border-slate-800/80 shadow-inner`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{value}</span>
        {unit && <span className="text-xs font-medium text-slate-400">{unit}</span>}
      </div>

      {/* Period Delta Comparison Badge */}
      <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-slate-800/80 text-[11px]">
        <div className="flex items-center gap-1">
          {isUp ? (
            <TrendingUp className={`h-3.5 w-3.5 ${delta.isPositive ? 'text-emerald-400' : 'text-rose-400'}`} />
          ) : (
            <TrendingDown className={`h-3.5 w-3.5 ${delta.isPositive ? 'text-emerald-400' : 'text-rose-400'}`} />
          )}
          <span
            className={`font-bold ${
              delta.isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {delta.percentChange > 0 ? `+${delta.percentChange}%` : `${delta.percentChange}%`}
          </span>
          <span className="text-slate-400">vs periode lalu</span>
        </div>
        {onClickTab && (
          <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
        )}
      </div>
    </div>
  );
};

export const AnalyticsDashboardView: React.FC = () => {
  const { kpiOverview, dailyBriefing, snapshots, vehicles, setActiveTab, setIsWhatIfModalOpen } = useAnalytics();

  const latestSnapshot = snapshots[snapshots.length - 1] || {
    activeCount: 82,
    idleCount: 14,
    maintenanceCount: 5,
    offlineCount: 3,
  };

  const topVehicle = vehicles[0];
  const underutilizedVehicle = vehicles.find((v) => v.status === 'UNDERUTILIZED' || v.status === 'CRITICAL_UNDERUTILIZED');
  const overutilizedVehicle = vehicles.find((v) => v.status === 'OVERUTILIZED');

  return (
    <div className="space-y-6">
      {/* AI Daily Intelligence Briefing Banner */}
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 p-5 backdrop-blur-md shadow-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <h2 className="text-sm font-bold tracking-wider uppercase text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" />
                <span>AI Fleet Daily Intelligence Briefing</span>
              </h2>
              <span className="text-[11px] text-slate-400 font-medium">• {dailyBriefing.date}</span>
            </div>
            <p className="text-base font-bold text-white sm:text-lg">{dailyBriefing.greetingTitle}</p>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              {dailyBriefing.operationalNotice}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('ai-insights')}
              className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Lihat Semua AI Insights</span>
            </button>
            <button
              onClick={() => setIsWhatIfModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-cyan-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20"
            >
              <span>Simulasi What-If</span>
            </button>
          </div>
        </div>

        {/* Quick Highlights Pills */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-3 border-t border-cyan-500/20">
          <div className="rounded-xl bg-slate-950/60 p-2.5 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Armada Aktif</span>
            <span className="text-sm font-extrabold text-emerald-400">{dailyBriefing.summaryMetrics.activeVehicles} Unit</span>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-2.5 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Sedang Servis</span>
            <span className="text-sm font-extrabold text-amber-400">{dailyBriefing.summaryMetrics.inMaintenanceVehicles} Unit</span>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-2.5 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Driver Berisiko</span>
            <span className="text-sm font-extrabold text-rose-400">{dailyBriefing.summaryMetrics.highRiskDrivers} Pengemudi</span>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-2.5 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Unusual Idle</span>
            <span className="text-sm font-extrabold text-yellow-400">{dailyBriefing.summaryMetrics.unusualIdleVehicles} Unit</span>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-2.5 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Risiko Servis</span>
            <span className="text-sm font-extrabold text-purple-400">{dailyBriefing.summaryMetrics.maintenanceRisks} Unit</span>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-2.5 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Utilisasi Rata-rata</span>
            <span className="text-sm font-extrabold text-cyan-400">{dailyBriefing.summaryMetrics.fleetUtilization}%</span>
          </div>
        </div>
      </div>

      {/* 8-Card Executive KPI Matrix */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Utilisasi Armada"
          value={`${kpiOverview.utilizationRate.currentValue}%`}
          delta={kpiOverview.utilizationRate}
          icon={PieChart}
          iconColor="text-cyan-400"
          onClickTab="utilization"
        />
        <MetricCard
          title="Skor Produktivitas"
          value={`${kpiOverview.productivityScore.currentValue}`}
          delta={kpiOverview.productivityScore}
          unit="/ 100"
          icon={Award}
          iconColor="text-emerald-400"
          onClickTab="productivity"
        />
        <MetricCard
          title="Total Jarak Tempuh"
          value={`${kpiOverview.totalMileageKm.currentValue.toLocaleString('id-ID')}`}
          delta={kpiOverview.totalMileageKm}
          unit="km"
          icon={Navigation}
          iconColor="text-blue-400"
          onClickTab="mileage"
        />
        <MetricCard
          title="Trip Terselesaikan"
          value={`${kpiOverview.completedTripsCount.currentValue.toLocaleString('id-ID')}`}
          delta={kpiOverview.completedTripsCount}
          unit="Trip"
          icon={Truck}
          iconColor="text-indigo-400"
          onClickTab="trips"
        />
        <MetricCard
          title="Armada Aktif Operasi"
          value={`${Math.round(kpiOverview.activeVehiclesCount.currentValue)}`}
          delta={kpiOverview.activeVehiclesCount}
          unit="Unit"
          icon={CheckCircle2}
          iconColor="text-teal-400"
          onClickTab="fleet"
        />
        <MetricCard
          title="Persentase Waktu Idle"
          value={`${kpiOverview.idleTimePercent.currentValue}%`}
          delta={kpiOverview.idleTimePercent}
          icon={Clock}
          iconColor="text-amber-400"
          onClickTab="idle"
        />
        <MetricCard
          title="Downtime Armada"
          value={`${kpiOverview.downtimePercent.currentValue}%`}
          delta={kpiOverview.downtimePercent}
          icon={AlertTriangle}
          iconColor="text-rose-400"
          onClickTab="downtime"
        />
        <MetricCard
          title="Rata-rata Durasi Trip"
          value={`${Math.floor(kpiOverview.avgTripDurationMinutes.currentValue / 60)}j ${kpiOverview.avgTripDurationMinutes.currentValue % 60}m`}
          delta={kpiOverview.avgTripDurationMinutes}
          icon={Calendar}
          iconColor="text-purple-400"
          onClickTab="trips"
        />
      </div>

      {/* Middle Section: Trend Charts & Fleet Status Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 30-Day Historical Trend Visualizer */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-cyan-400" />
                <span>Tren Utilisasi & Produktivitas 30 Hari Terakhir</span>
              </h3>
              <p className="text-xs text-slate-400">Pola fluktuasi harian operasional seluruh armada</p>
            </div>
            <button
              onClick={() => setActiveTab('trends')}
              className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Analisis Lengkap</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* Custom Responsive SVG Chart */}
          <div className="h-56 w-full pt-4">
            <div className="h-44 flex items-end justify-between gap-1.5 border-b border-slate-800 px-2">
              {snapshots.slice(-20).map((snap, idx) => (
                <div key={idx} className="group relative flex flex-col items-center flex-1 h-full justify-end">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 hidden group-hover:flex flex-col items-center bg-slate-950 border border-slate-700 px-2 py-1 rounded-lg text-[10px] text-white shadow-xl z-20 whitespace-nowrap pointer-events-none">
                    <span className="font-bold">{snap.date}</span>
                    <span>Util: {snap.utilizationRate}% | Prod: {snap.productivityScore}</span>
                  </div>

                  <div className="w-full flex items-end justify-center gap-0.5">
                    {/* Utilization Bar */}
                    <div
                      style={{ height: `${snap.utilizationRate * 0.9}%` }}
                      className="w-2 sm:w-3 rounded-t-sm bg-gradient-to-t from-cyan-600 to-cyan-400 group-hover:brightness-125 transition-all"
                    />
                    {/* Productivity Bar */}
                    <div
                      style={{ height: `${snap.productivityScore * 0.9}%` }}
                      className="w-1.5 sm:w-2 rounded-t-sm bg-gradient-to-t from-emerald-600 to-emerald-400 opacity-80 group-hover:opacity-100 transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 text-xs text-slate-400 px-2">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
                <span>Utilisasi (%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span>Produktivitas (Score)</span>
              </span>
              <span>Target: &gt;80%</span>
            </div>
          </div>
        </div>

        {/* Real-time Fleet Status Breakdown */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieChart className="h-4 w-4 text-cyan-400" />
              <span>Distribusi Status Armada Terkini</span>
            </h3>
            <p className="text-xs text-slate-400">Total 104 Kendaraan Terdaftar</p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span>Aktif Operasi (Moving & Working)</span>
                </span>
                <span className="text-white font-bold">{latestSnapshot.activeCount} Unit (78.8%)</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-400 w-[78.8%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  <span>Idle / Menunggu Penugasan</span>
                </span>
                <span className="text-white font-bold">{latestSnapshot.idleCount} Unit (13.5%)</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-amber-400 w-[13.5%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-400" />
                  <span>Maintenance / Downtime</span>
                </span>
                <span className="text-white font-bold">{latestSnapshot.maintenanceCount} Unit (4.8%)</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-rose-400 w-[4.8%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  <span>Offline / Standby Depo</span>
                </span>
                <span className="text-white font-bold">{latestSnapshot.offlineCount} Unit (2.9%)</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-slate-500 w-[2.9%]" />
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('fleet')}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 text-xs font-semibold text-slate-300 hover:border-cyan-500/40 hover:text-white transition-all text-center"
          >
            Buka Analisis Status Armada Lengkap
          </button>
        </div>
      </div>

      {/* Bottom Section: Spotlights */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Top Productive */}
        {topVehicle && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-4 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
              <span className="flex items-center gap-1">
                <Award className="h-4 w-4" />
                <span>#1 Kendaraan Paling Produktif</span>
              </span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5">{topVehicle.productivityScore} Pts</span>
            </div>
            <div className="mt-2">
              <h4 className="font-bold text-white text-base">{topVehicle.plateNumber}</h4>
              <p className="text-xs text-slate-300">{topVehicle.model}</p>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-emerald-500/20">
                <span>Utilisasi: <strong className="text-white">{topVehicle.utilizationRate}%</strong></span>
                <span>Jarak: <strong className="text-white">{topVehicle.mileageKm.toLocaleString()} km</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* Critical Underutilized */}
        {underutilizedVehicle && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-950/10 p-4 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs font-bold text-rose-400">
              <span className="flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                <span>Perlu Tindakan: Underutilized</span>
              </span>
              <span className="rounded-full bg-rose-500/20 px-2 py-0.5">{underutilizedVehicle.utilizationRate}%</span>
            </div>
            <div className="mt-2">
              <h4 className="font-bold text-white text-base">{underutilizedVehicle.plateNumber}</h4>
              <p className="text-xs text-slate-300">{underutilizedVehicle.branchName}</p>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-rose-500/20">
                <span>Idle: <strong className="text-rose-300">{underutilizedVehicle.idleHours} Jam</strong></span>
                <button
                  onClick={() => setActiveTab('utilization')}
                  className="text-xs font-bold text-rose-400 hover:underline"
                >
                  Evaluasi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Overutilized Alert */}
        {overutilizedVehicle && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-950/10 p-4 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs font-bold text-amber-400">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Peringatan: Overutilized</span>
              </span>
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5">{overutilizedVehicle.utilizationRate}%</span>
            </div>
            <div className="mt-2">
              <h4 className="font-bold text-white text-base">{overutilizedVehicle.plateNumber}</h4>
              <p className="text-xs text-slate-300">{overutilizedVehicle.department}</p>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-amber-500/20">
                <span>Jarak: <strong className="text-amber-300">{overutilizedVehicle.mileageKm.toLocaleString()} km</strong></span>
                <button
                  onClick={() => setActiveTab('ai-insights')}
                  className="text-xs font-bold text-amber-400 hover:underline"
                >
                  Rekomendasi AI
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
