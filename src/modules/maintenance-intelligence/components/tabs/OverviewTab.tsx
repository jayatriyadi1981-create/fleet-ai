/**
 * Fleet Intelligence Smart AI - Maintenance Overview Tab
 * Comprehensive executive summary with core KPI cards, dynamic charts,
 * prioritized high-risk vehicle tables, and quick action drawers.
 */

import React from 'react';
import { 
  FleetMaintenanceKPIs, 
  VehicleMaintenanceProfile, 
  MaintenancePriorityItem, 
  MaintenanceRecommendationItem,
  MaintenanceTrendPoint 
} from '../../types';
import { 
  HeartHandshake, 
  AlertTriangle, 
  CalendarClock, 
  Cpu, 
  Sparkles, 
  TrendingUp, 
  ChevronRight, 
  Wrench, 
  ShieldAlert, 
  ArrowUpRight,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

interface OverviewTabProps {
  kpis: FleetMaintenanceKPIs;
  profiles: VehicleMaintenanceProfile[];
  priorityQueue: MaintenancePriorityItem[];
  recommendations: MaintenanceRecommendationItem[];
  trends: MaintenanceTrendPoint[];
  onSelectVehicle: (profile: VehicleMaintenanceProfile) => void;
  onExplainAI: (profile: VehicleMaintenanceProfile) => void;
  onReviewRecommendation: (rec: MaintenanceRecommendationItem) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  kpis,
  profiles,
  priorityQueue,
  recommendations,
  trends,
  onSelectVehicle,
  onExplainAI,
  onReviewRecommendation,
}) => {
  const highRiskVehicles = profiles.filter(p => p.riskLevel === 'HIGH' || p.riskLevel === 'CRITICAL');
  const topRecommendations = recommendations.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* 4 Core KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Fleet Health */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Fleet Health Score</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <HeartHandshake className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold font-mono text-white tracking-tight">
              {kpis.fleetHealthScore}
            </span>
            <span className="text-xs text-slate-500 font-mono">/100</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              kpis.fleetHealthGrade === 'EXCELLENT' ? 'bg-emerald-500/20 text-emerald-300' :
              kpis.fleetHealthGrade === 'GOOD' ? 'bg-cyan-500/20 text-cyan-300' :
              'bg-amber-500/20 text-amber-300'
            }`}>
              {kpis.fleetHealthGrade}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Rata-rata kesehatan mekanis armada aktif
          </p>
        </div>

        {/* High Risk Vehicles */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">High Risk Vehicles</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold font-mono text-rose-400 tracking-tight">
              {kpis.highRiskVehiclesCount}
            </span>
            <span className="text-xs text-slate-400">Armada</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Unit dengan potensi risiko kerusakan tinggi/kritis
          </p>
        </div>

        {/* Service Due */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Service Due Soon / Overdue</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <CalendarClock className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold font-mono text-amber-300 tracking-tight">
              {kpis.serviceDueSoonCount + kpis.serviceOverdueCount}
            </span>
            <span className="text-xs text-slate-400">
              ({kpis.serviceOverdueCount} Terlewat)
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Jadwal ganti oli & perawatan preventif berkala
          </p>
        </div>

        {/* Predicted Risk */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Predicted Failure Indicators</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <Cpu className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold font-mono text-indigo-300 tracking-tight">
              {kpis.predictedFailureCount}
            </span>
            <span className="text-xs text-slate-400">Komponen</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Deteksi dini AI berbasis telemetri 30 hari ke depan
          </p>
        </div>
      </div>

      {/* AI Maintenance Executive Summary Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-cyan-500/20 shadow-lg relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">
                AI Predictive Maintenance Summary
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Live Analysis
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Skor kesehatan armada saat ini berada di level <strong>{kpis.fleetHealthScore}/100 ({kpis.fleetHealthGrade})</strong>. Terdapat <strong>{kpis.highRiskVehiclesCount} unit</strong> dengan risiko tinggi yang memerlukan atensi segera (fokus utama unit <strong>B 9301 KLP</strong> dan <strong>B 9778 ZXC</strong> akibat voltase aki drop dan servis berkala terlewat &gt;1.400 KM). Terdeteksi <strong>{kpis.repeatedAnomaliesCount} pola kerusakan komponen berulang</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section: Fleet Health & Maintenance Risk Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Fleet Health Trend */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Tren Skor Kesehatan Armada (Health Score)
              </h4>
              <p className="text-[11px] text-slate-400">Historis 4 bulan terakhir & proyeksi bulan depan</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" /> +4.7% Proyeksi
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis domain={[50, 100]} stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="averageHealthScore" name="Health Score" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#healthGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Maintenance Risk Trend */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Tren Indeks Risiko Pemeliharaan (Risk Score)
              </h4>
              <p className="text-[11px] text-slate-400">Penurunan risiko seiring persetujuan rekomendasi AI</p>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400">
              Target: &lt;20 (Low Risk)
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis domain={[0, 50]} stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="averageRiskScore" name="Risk Score" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#riskGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* High Risk Vehicles & Top Priority Maintenance Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* High Risk Vehicles */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-400" />
                Kendaraan Berisiko Tinggi ({highRiskVehicles.length})
              </h4>
              <span className="text-[11px] text-slate-400">Prioritas Pemeriksaan</span>
            </div>

            <div className="space-y-2.5">
              {highRiskVehicles.map((vehicle) => (
                <div
                  key={vehicle.vehicleId}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white font-mono">{vehicle.plateNumber}</span>
                      <span className="text-[11px] text-slate-400">• {vehicle.vehicleType}</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      {vehicle.activePredictions[0]?.potentialFailureMode || 'Servis berkala terlewat'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-mono font-bold text-rose-400 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                      Risk: {vehicle.riskScore}/100
                    </span>
                    <button
                      onClick={() => onExplainAI(vehicle)}
                      className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
                      title="Explain with AI"
                    >
                      <Sparkles className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onSelectVehicle(vehicle)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                      title="Detail Kendaraan"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Priority Queue (P1-P4) */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Wrench className="h-4 w-4 text-cyan-400" />
                Antrean Prioritas Pemeliharaan (P1–P4)
              </h4>
              <span className="text-[11px] text-slate-400">Urutan Tindakan</span>
            </div>

            <div className="space-y-2.5">
              {priorityQueue.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                        item.priority === 'P1' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        item.priority === 'P2' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                        'bg-cyan-500/20 text-cyan-300'
                      }`}>
                        {item.priority}
                      </span>
                      <span className="text-xs font-bold text-white font-mono">{item.plateNumber}</span>
                      <span className="text-[11px] text-slate-400">• {item.componentName}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 truncate max-w-sm">{item.primaryIssue}</p>
                  </div>

                  <span className="text-[11px] font-semibold text-slate-400 text-right shrink-0">
                    Est. {item.estimatedDowntimeHours} Jam Downtime
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations Quick Action Banner */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Rekomendasi Pemeliharaan AI yang Perlu Ditinjau
            </h4>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {recommendations.filter(r => r.status === 'PENDING_REVIEW').length} Menunggu Persetujuan
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {topRecommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono">{rec.plateNumber}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    rec.priority === 'P1' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                    rec.priority === 'P2' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                    'bg-cyan-500/20 text-cyan-300'
                  }`}>
                    {rec.priority}
                  </span>
                </div>
                <p className="text-xs font-semibold text-cyan-300 leading-snug">{rec.serviceType}</p>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{rec.reason}</p>
                <div className="text-[11px] font-mono text-slate-300">
                  Estimasi Biaya: <strong className="text-white font-mono">Rp {rec.estimatedTotalCost.toLocaleString('id-ID')}</strong>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  Target: {rec.recommendedDate}
                </span>
                <button
                  onClick={() => onReviewRecommendation(rec)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-colors"
                >
                  Tinjau & Setujui
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
