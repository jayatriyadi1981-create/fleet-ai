/**
 * Fleet Intelligence Smart AI - Fuel Overview Tab
 * Executive summary, KPI cards (Consumption, Efficiency, Cost, Risk),
 * AI Summary briefing, Quick Trend charts, and Top Opportunities.
 */

import React from 'react';
import {
  FuelOverviewKPIs,
  FuelTrendAnalysis,
  FuelAnomalyItem,
  FuelTheftIndicator,
  VehicleFuelRankingItem,
  AIFuelRecommendationItem,
  FuelFilterState,
} from '../../types';
import {
  Fuel,
  Gauge,
  DollarSign,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Clock,
  Layers
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from 'recharts';

interface OverviewTabProps {
  kpis: FuelOverviewKPIs;
  trends: FuelTrendAnalysis;
  anomalies: FuelAnomalyItem[];
  theftIndicators: FuelTheftIndicator[];
  rankings: VehicleFuelRankingItem[];
  recommendations: AIFuelRecommendationItem[];
  onSelectTab: (tabId: string) => void;
  onExplainWithAI: (topic: string, subject: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  kpis,
  trends,
  anomalies,
  theftIndicators,
  rankings,
  recommendations,
  onSelectTab,
  onExplainWithAI,
}) => {
  const topEfficient = rankings.slice(0, 3);
  const leastEfficient = [...rankings].reverse().slice(0, 3);

  return (
    <div className="space-y-6">
      {/* 1. Executive 4-KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Average Consumption */}
        <div className="relative overflow-hidden rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Konsumsi Rata-rata
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Fuel className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">
              {kpis.avgConsumptionL100Km}
            </span>
            <span className="text-xs font-mono text-slate-400">L/100km</span>
            <span className="text-[11px] font-mono text-slate-500">
              ({kpis.avgConsumptionKmL} km/L)
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
            <span className="text-amber-400 flex items-center gap-1 font-semibold">
              <ArrowUpRight className="h-3.5 w-3.5" /> +7.2% vs baseline
            </span>
            <button
              onClick={() => onExplainWithAI('CONSUMPTION', 'Konsumsi Rata-rata Armada')}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <Sparkles className="h-3 w-3" /> Explain
            </button>
          </div>
        </div>

        {/* Card 2: Fuel Efficiency Score */}
        <div className="relative overflow-hidden rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Skor Efisiensi BBM
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Gauge className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">
              {kpis.fuelEfficiencyScore}
            </span>
            <span className="text-xs font-mono text-slate-400">/100</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              Optimal
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
            <span className="text-slate-400 font-medium">
              Target armada: ≥ 80
            </span>
            <button
              onClick={() => onSelectTab('EFFICIENCY')}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              Faktor <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Card 3: Total Fuel Cost */}
        <div className="relative overflow-hidden rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Total Biaya BBM
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">
              Rp {(kpis.totalFuelCostIdr / 1000000).toFixed(1)} Jt
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              (Rp {kpis.costPerKmIdr}/km)
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
            <span className="text-slate-400">
              Vol: {kpis.totalFuelConsumedLiters.toLocaleString()} L
            </span>
            <button
              onClick={() => onSelectTab('COST')}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              Detail <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Card 4: Fuel Risk Level */}
        <div className="relative overflow-hidden rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Tingkat Risiko BBM
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-400">
              {kpis.fuelRiskLevel}
            </span>
            <span className="text-xs font-mono text-slate-400">
              ({kpis.potentialTheftIndicatorsCount} indikator)
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
            <span className="text-rose-400 font-semibold">
              {kpis.totalAnomaliesCount} Anomali Terdeteksi
            </span>
            <button
              onClick={() => onSelectTab('THEFT')}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              Audit <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. AI Fuel Summary Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 p-5 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-inner">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">
                AI Fuel Intelligence Executive Briefing
              </h3>
              <span className="text-[11px] font-mono text-cyan-400">
                Akurasi Telemetri: {kpis.dataQualityScore}/100
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Efisiensi BBM armada 30 hari terakhir tercatat <strong>{kpis.fuelEfficiencyScore}/100</strong>.
              Terdeteksi peningkatan konsumsi <strong>+7.2%</strong> selama 3 pekan berturut-turut yang berkaitan dengan kenaikan durasi idle di Pelabuhan Tanjung Priok.
              Terdapat <strong>1 indikator penurunan volume tinggi saat mesin mati</strong> pada unit <strong>B 9876 XYZ</strong> yang memerlukan klarifikasi operasional.
            </p>
            <div className="pt-2 flex flex-wrap gap-3 text-xs">
              <span className="text-slate-400 font-mono">
                Potensi Pemborosan BBM: <strong className="text-amber-400 font-bold">~{kpis.estimatedFuelWasteLiters} L (Rp {(kpis.estimatedFuelWasteIdr / 1000000).toFixed(1)} Jt)</strong>
              </span>
              <span className="text-slate-400 font-mono">
                Status SPBU Rekanan: <strong className="text-emerald-400 font-bold">96.8% Valid</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Trends Split View (Consumption & Efficiency) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Chart: Consumption Trend */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              <h4 className="text-sm font-bold text-white">Tren Konsumsi BBM (L/100km)</h4>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              5 Pekan Terakhir
            </span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends.dataPoints}>
                <defs>
                  <linearGradient id="consumptionGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[20, 35]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  formatter={(val: number) => [`${val} L/100km`, 'Konsumsi']}
                />
                <Area type="monotone" dataKey="currentConsumptionL100Km" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#consumptionGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-400 italic">
            *Tren menunjukkan kenaikan dari 26.2 L/100km (W1) ke 28.7 L/100km (W5).
          </p>
        </div>

        {/* Right Chart: Efficiency Score Trend */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-emerald-400" />
              <h4 className="text-sm font-bold text-white">Indeks Skor Efisiensi (0-100)</h4>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              Benchmark Target: 80
            </span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends.dataPoints}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[50, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  formatter={(val: number) => [`${val} / 100`, 'Skor Efisiensi']}
                />
                <Bar dataKey="efficiencyScore" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-400 italic">
            *Rata-rata armada tetap berada di atas target ambang batas 80/100.
          </p>
        </div>
      </div>

      {/* 4. Most vs Least Efficient Vehicles & Theft Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Box 1: Most Efficient Vehicles */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Kendaraan Paling Efisien
            </h4>
            <span className="text-[10px] font-mono text-slate-400">Top 3</span>
          </div>
          <div className="space-y-2.5">
            {topEfficient.map((v) => (
              <div key={v.vehicleId} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div>
                  <span className="font-mono font-bold text-xs text-white block">{v.plateNumber}</span>
                  <span className="text-[10px] text-slate-400">{v.vehicleType}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-xs text-emerald-400 block">{v.avgConsumptionL100Km} L/100km</span>
                  <span className="text-[10px] font-mono text-emerald-500">Skor: {v.efficiencyScore}/100</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Box 2: Least Efficient Vehicles */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-400" />
              Kendaraan Paling Boros
            </h4>
            <span className="text-[10px] font-mono text-slate-400">Perlu Perhatian</span>
          </div>
          <div className="space-y-2.5">
            {leastEfficient.map((v) => (
              <div key={v.vehicleId} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div>
                  <span className="font-mono font-bold text-xs text-white block">{v.plateNumber}</span>
                  <span className="text-[10px] text-slate-400">{v.vehicleType}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-xs text-rose-400 block">{v.avgConsumptionL100Km} L/100km</span>
                  <span className="text-[10px] font-mono text-rose-400">+{v.deviationPercentage}% vs normal</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Box 3: Potential Theft & Drain Indicators */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-400" />
              Indikator Anomali & Theft
            </h4>
            <button
              onClick={() => onSelectTab('THEFT')}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Lihat Semua
            </button>
          </div>
          <div className="space-y-2.5">
            {theftIndicators.map((t) => (
              <div key={t.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-white">{t.plateNumber}</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {t.riskLevel} RISK
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-tight">
                  Penurunan {t.fuelDropLiters} L saat mesin MATI di {t.locationName}.
                </p>
                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 font-mono">
                  <span>{new Date(t.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</span>
                  <button
                    onClick={() => onExplainWithAI('THEFT', `Indikator Pencurian BBM ${t.plateNumber}`)}
                    className="text-cyan-400 hover:underline"
                  >
                    Investigasi AI
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Top AI Fuel Saving Recommendations */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white">Rekomendasi Penghematan BBM Prioritas AI</h4>
          </div>
          <button
            onClick={() => onSelectTab('RECOMMENDATIONS')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
          >
            Buka Seluruh Rekomendasi ({recommendations.length}) <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.slice(0, 2).map((rec) => (
            <div key={rec.id} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {rec.category}
                </span>
                <span className="text-[11px] font-mono font-bold text-emerald-400">
                  Hemat ~Rp {(rec.potentialMonthlySavingsIdr / 1000).toLocaleString()}/bln
                </span>
              </div>
              <h5 className="text-xs font-bold text-white">{rec.title}</h5>
              <p className="text-[11px] text-slate-400 leading-snug">{rec.recommendation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
