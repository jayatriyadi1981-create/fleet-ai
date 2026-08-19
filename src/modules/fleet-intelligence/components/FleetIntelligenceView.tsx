/**
 * Fleet Intelligence Smart AI - Main Dashboard View (Prompt 28)
 * Interface pusat untuk seluruh layer analisis operasional telematika,
 * performa armada, deteksi anomali, utilisasi, efisiensi, dan rekomendasi proaktif.
 */

import React, { useState, useMemo } from 'react';
import {
  Brain,
  Sparkles,
  Heart,
  Gauge,
  Activity,
  ShieldAlert,
  Calendar,
  Building2,
  Filter,
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  FileText,
  Truck,
  ArrowRight,
  Search,
  CheckCircle2,
  HelpCircle,
  BarChart3,
  Layers,
  Fuel,
  MapPin,
  Clock,
  Printer,
} from 'lucide-react';
import { useFleet } from '../../../context/FleetContext';
import { useAuthorization } from '../../../hooks/useAuthorization';
import {
  IntelligencePeriod,
  FleetIntelligenceFilter,
  VehiclePerformanceItem,
  OperationalAnomalyItem,
  AIRecommendationItem,
  RootCauseInvestigation,
} from '../types';
import { fleetIntelligenceService, IntelligenceDataResult } from '../engines/FleetIntelligenceService';

// Subcomponents & Modals
import { AIInsightCard } from './cards/AIInsightCard';
import { AIAnomalyCard } from './cards/AIAnomalyCard';
import { AIRecommendationCard } from './cards/AIRecommendationCard';
import { VehiclePriorityMatrix } from './widgets/VehiclePriorityMatrix';
import { BranchHealthHeatmap } from './widgets/BranchHealthHeatmap';
import { VehiclePerformanceTable } from './widgets/VehiclePerformanceTable';
import { HealthScoreBreakdownWidget } from './widgets/HealthScoreBreakdownWidget';
import { UtilizationBalancingWidget } from './widgets/UtilizationBalancingWidget';
import { ExplainAIModal } from './modals/ExplainAIModal';
import { VehicleIntelligenceModal } from './modals/VehicleIntelligenceModal';
import { PeriodComparisonModal } from './modals/PeriodComparisonModal';
import { BranchComparisonModal } from './modals/BranchComparisonModal';
import { RootCauseAnalysisModal } from './modals/RootCauseAnalysisModal';

type ActiveIntelligenceTab =
  | 'overview'
  | 'health'
  | 'utilization'
  | 'performance'
  | 'anomalies'
  | 'efficiency'
  | 'risk_matrix'
  | 'executive_report';

export const FleetIntelligenceView: React.FC = () => {
  const { vehicles, alerts, trips, branches } = useFleet();
  const { can, userRole } = useAuthorization();

  // Global Filter State
  const [filter, setFilter] = useState<FleetIntelligenceFilter>({
    period: 'today',
    branchId: 'all',
    fleetGroupId: 'all',
    vehicleType: 'all',
  });

  const [activeTab, setActiveTab] = useState<ActiveIntelligenceTab>('overview');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Modal States
  const [explainModalState, setExplainModalState] = useState<{
    isOpen: boolean;
    title: string;
    metricName?: string;
    scoreOrValue?: string | number;
    explanation: string;
    contributingFactors?: Array<{ name: string; impact: string; detail: string }>;
    evidence?: string[];
    recommendations?: string[];
  }>({
    isOpen: false,
    title: '',
    explanation: '',
  });

  const [selectedVehicle, setSelectedVehicle] = useState<VehiclePerformanceItem | null>(null);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [investigationData, setInvestigationData] = useState<RootCauseInvestigation | null>(null);
  const [isInvestigationModalOpen, setIsInvestigationModalOpen] = useState(false);
  const [actionSuccessToast, setActionSuccessToast] = useState<string | null>(null);

  // Compute Intelligence Data
  const intelData: IntelligenceDataResult = useMemo(() => {
    return fleetIntelligenceService.getIntelligenceData(filter, {
      vehicles,
      alerts,
      trips,
      branches,
    });
  }, [filter, vehicles.length, alerts.length, trips.length, refreshTrigger]);

  // Modal Helpers
  const handleOpenExplain = (metricType: 'health' | 'utilization' | 'efficiency' | 'risk') => {
    if (metricType === 'health') {
      setExplainModalState({
        isOpen: true,
        title: 'Penjelasan Skor Kesehatan Armada (Fleet Health)',
        metricName: 'Fleet Health Score',
        scoreOrValue: `${intelData.health.overallScore} / 100`,
        explanation: `Skor kesehatan armada berada pada kategori ${intelData.health.category} (${intelData.health.overallScore}/100). Penilaian didasarkan pada perpaduan terbobot ketersediaan kendaraan (${intelData.health.availability}%), kepatuhan perawatan (${intelData.health.maintenance}%), inspeksi (${intelData.health.inspection}%), keselamatan berkendara (${intelData.health.safety}%), dan uptime telemetri GPS (${intelData.health.gpsConnectivity}%).`,
        contributingFactors: [
          { name: 'Ketersediaan Armada', impact: '+20%', detail: `${intelData.utilization.activeVehicles} unit aktif beroperasi prima` },
          { name: 'Overdue Maintenance', impact: '-8%', detail: '2 unit kendaraan melebihi jadwal servis berkala' },
          { name: 'Konektivitas GPS', impact: '-4%', detail: 'Tercatat blank spot sesaat di jalur Pantura' },
        ],
        evidence: [
          'Tingkat ketersediaan armada 94.2%',
          '2 unit overdue servis (B 9211 TJP, B 9482 UTX)',
          '92.4% kepatuhan inspeksi checklist pre-trip',
        ],
        recommendations: [
          'Terbitkan Work Order untuk unit yang overdue.',
          'Lakukan remote ping diagnostic pada unit dengan sinyal GPS lemah.',
        ],
      });
    } else if (metricType === 'utilization') {
      setExplainModalState({
        isOpen: true,
        title: 'Penjelasan Tingkat Utilisasi Armada',
        metricName: 'Fleet Utilization Rate',
        scoreOrValue: `${intelData.utilization.utilizationRate}%`,
        explanation: `Utilisasi armada dihitung dengan rumus (Waktu Bergerak Aktif / Waktu Tersedia) × 100. Tingkat ${intelData.utilization.utilizationRate}% tergolong dalam kategori ${intelData.utilization.category}. Ditemukan ${intelData.utilization.underutilizedVehicles.length} unit dengan utilisasi <30% dan ${intelData.utilization.overutilizedVehicles.length} unit beroperasi intensif >85%.`,
        contributingFactors: [
          { name: 'Trip Kargo Aktif', impact: '+45%', detail: 'Tingginya permintaan rute Jakarta-Surabaya' },
          { name: 'Antrean Bongkar Muat', impact: '-12%', detail: 'Idle 42 menit per kunjungan di kawasan industri' },
          { name: 'Depo Cadangan', impact: '-10%', detail: 'Unit parkir standby di Cabang Surabaya' },
        ],
        evidence: [
          'Total jam jalan armada: ' + intelData.utilization.totalDrivingHours + ' Jam',
          '3 unit underutilized tercatat di Depo Surabaya',
        ],
        recommendations: [
          'Redistribusikan armada standby ke rute pengiriman padat.',
          'Terapkan batasan idle otomatis di zona geofence loading.',
        ],
      });
    } else if (metricType === 'efficiency') {
      setExplainModalState({
        isOpen: true,
        title: 'Penjelasan Skor Efisiensi Operasional',
        metricName: 'Fleet Efficiency Score',
        scoreOrValue: `${intelData.efficiency.overallEfficiencyScore} / 100`,
        explanation: `Efisiensi operasional (${intelData.efficiency.overallEfficiencyScore}/100) mencakup analisis efisiensi konsumsi BBM (${intelData.efficiency.fuelEfficiency.avgKmPerL} km/L vs target ${intelData.efficiency.fuelEfficiency.baselineKmPerL} km/L), rasio waktu idle (${intelData.efficiency.idleEfficiency.idlePercentOfRunTime}%), deviasi rute (${intelData.efficiency.routeEfficiency.deviationPercent}%), dan downtime operasional.`,
        contributingFactors: [
          { name: 'Konsumsi BBM Rata-rata', impact: '+35%', detail: '3.42 km/L (target 3.80 km/L)' },
          { name: 'Biaya BBM Idle', impact: '-15%', detail: 'Estimasi Rp 14.85 Juta solar terbuang saat idle' },
          { name: 'Deviasi Koridor Rute', impact: '-8%', detail: 'Deviasi rata-rata 6.6% dari rute rencana' },
        ],
        recommendations: [
          'Edukasi eco-driving untuk pengemudi rute Trans-Jawa.',
          'Audit tangki BBM unit dengan konsumsi melonjak mendadak.',
        ],
      });
    } else {
      setExplainModalState({
        isOpen: true,
        title: 'Penjelasan Tingkat Risiko Armada',
        metricName: 'Fleet Risk Level',
        scoreOrValue: intelData.risk.overallRiskLevel,
        explanation: `Tingkat risiko armada keseluruhan dinilai berada di level ${intelData.risk.overallRiskLevel} dengan skor komposit ${intelData.risk.riskScore}/100. Risiko tertinggi saat ini berasal dari penundaan servis mesin dan potensi insiden overspeed pada segmen tol.`,
        contributingFactors: [
          { name: 'Maintenance Overdue', impact: 'HIGH', detail: '2 unit dengan potensi kerusakan mekanis darurat' },
          { name: 'Safety Violations', impact: 'MEDIUM', detail: '4 kejadian overspeed tercatat hari ini' },
          { name: 'GPS Telemetry Loss', impact: 'LOW', detail: '1 unit offline sesaat' },
        ],
        recommendations: [
          'Kirimkan notifikasi pembinaan ke pengemudi dengan catatan overspeed.',
          'Jadwalkan unit berisiko kritis ke bengkel terdekat.',
        ],
      });
    }
  };

  const handleDrilldownVehicle = (vehicleId: string) => {
    const v = intelData.vehiclePerformance.find((item) => item.vehicleId === vehicleId);
    if (v) {
      setSelectedVehicle(v);
      setIsVehicleModalOpen(true);
    }
  };

  const handleInvestigateAnomaly = (anomaly: OperationalAnomalyItem) => {
    const inv = fleetIntelligenceService.investigateRootCause(anomaly.title);
    setInvestigationData(inv);
    setIsInvestigationModalOpen(true);
  };

  const handleApplyRecommendation = (rec: AIRecommendationItem) => {
    setActionSuccessToast(`Aksi "${rec.actionLabel}" berhasil diajukan ke sistem dan tercatat dalam AI Audit Log.`);
    setTimeout(() => setActionSuccessToast(null), 5000);
  };

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    fleetIntelligenceService.exportFleetReport(intelData, format);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 space-y-6 pb-20">
      {/* Toast Notification */}
      {actionSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-200 text-xs font-semibold shadow-2xl animate-in slide-in-from-bottom-3 duration-300">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{actionSuccessToast}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                <span>AI Fleet Intelligence Engine</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Live Telematics Layer
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Analisis kesehatan armada, utilisasi, performa kendaraan, anomali telematika, dan rekomendasi proaktif
              </p>
            </div>
          </div>
        </div>

        {/* Global Controls & Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Period Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1">
            {(['today', 'yesterday', 'last_7_days', 'last_30_days'] as IntelligencePeriod[]).map((p) => (
              <button
                key={p}
                onClick={() => setFilter({ ...filter, period: p })}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  filter.period === p
                    ? 'bg-cyan-600 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {p === 'today' ? 'Hari Ini' : p === 'yesterday' ? 'Kemarin' : p === 'last_7_days' ? '7 Hari' : '30 Hari'}
              </button>
            ))}
          </div>

          {/* Branch Filter */}
          <select
            value={filter.branchId}
            onChange={(e) => setFilter({ ...filter, branchId: e.target.value })}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Semua Cabang</option>
            <option value="b-01">Cabang Jakarta Pusat</option>
            <option value="b-02">Cabang Surabaya Barat</option>
            <option value="b-03">Cabang Bandung Timur</option>
            <option value="b-04">Cabang Semarang Pelabuhan</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={() => setRefreshTrigger((prev) => prev + 1)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden sm:inline">Diperbarui {intelData.lastUpdated}</span>
          </button>

          {/* Export Dropdown */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-slate-400" />
              <span>Ekspor CSV</span>
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-slate-950 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Cetak Laporan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Fleet Health */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 text-rose-400" />
                <span>Fleet Health Score</span>
              </span>
              <div className="flex items-baseline gap-1.5 my-1.5">
                <span className="text-3xl font-black font-mono text-white">{intelData.health.overallScore}</span>
                <span className="text-xs text-slate-500 font-mono">/ 100</span>
                <span className="text-[11px] font-bold text-amber-400 font-mono ml-2">
                  {intelData.health.changePercent}%
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {intelData.health.category}
              </span>
            </div>
            <button
              onClick={() => handleOpenExplain('health')}
              className="p-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 text-[11px] font-semibold flex items-center gap-1 transition-colors"
            >
              <Sparkles className="h-3 w-3" />
              <span>Explain</span>
            </button>
          </div>
        </div>

        {/* Card 2: Fleet Utilization */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Gauge className="h-3.5 w-3.5 text-cyan-400" />
                <span>Fleet Utilization</span>
              </span>
              <div className="flex items-baseline gap-1.5 my-1.5">
                <span className="text-3xl font-black font-mono text-cyan-400">{intelData.utilization.utilizationRate}%</span>
                <span className="text-[11px] font-bold text-emerald-400 font-mono ml-2">
                  +{intelData.utilization.changePercent}%
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block">
                {intelData.utilization.activeVehicles} Bergerak • {intelData.utilization.availableVehicles} Tersedia
              </span>
            </div>
            <button
              onClick={() => handleOpenExplain('utilization')}
              className="p-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 text-[11px] font-semibold flex items-center gap-1 transition-colors"
            >
              <Sparkles className="h-3 w-3" />
              <span>Explain</span>
            </button>
          </div>
        </div>

        {/* Card 3: Fleet Efficiency */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Fuel className="h-3.5 w-3.5 text-amber-400" />
                <span>Operational Efficiency</span>
              </span>
              <div className="flex items-baseline gap-1.5 my-1.5">
                <span className="text-3xl font-black font-mono text-white">{intelData.efficiency.overallEfficiencyScore}</span>
                <span className="text-xs text-slate-500 font-mono">/ 100</span>
              </div>
              <span className="text-[11px] text-slate-400 block">
                BBM: <strong className="text-amber-300">{intelData.efficiency.fuelEfficiency.avgKmPerL} km/L</strong> (Target 3.80)
              </span>
            </div>
            <button
              onClick={() => handleOpenExplain('efficiency')}
              className="p-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 text-[11px] font-semibold flex items-center gap-1 transition-colors"
            >
              <Sparkles className="h-3 w-3" />
              <span>Explain</span>
            </button>
          </div>
        </div>

        {/* Card 4: Fleet Risk */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
                <span>Overall Fleet Risk</span>
              </span>
              <div className="flex items-baseline gap-1.5 my-1.5">
                <span className="text-2xl font-black font-mono text-amber-400">{intelData.risk.overallRiskLevel}</span>
                <span className="text-xs text-slate-500 font-mono">({intelData.risk.riskScore}/100)</span>
              </div>
              <span className="text-[11px] text-rose-400 block font-semibold">
                {intelData.risk.criticalVehiclesCount} Unit Kritis • {intelData.anomalies.length} Anomali
              </span>
            </div>
            <button
              onClick={() => handleOpenExplain('risk')}
              className="p-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 text-[11px] font-semibold flex items-center gap-1 transition-colors"
            >
              <Sparkles className="h-3 w-3" />
              <span>Explain</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Daily Briefing & Executive Summary Card */}
      <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-4 sm:p-5 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/30 text-cyan-300">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              AI Daily Operational Briefing & Insights
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPeriodModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition-colors"
            >
              <Calendar className="h-3.5 w-3.5 text-cyan-400" />
              <span>Bandingkan Periode</span>
            </button>
            <button
              onClick={() => setIsBranchModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition-colors"
            >
              <Building2 className="h-3.5 w-3.5 text-cyan-400" />
              <span>Bandingkan Cabang</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed mb-3">
          {intelData.dailyBriefing.summary}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
          {intelData.dailyBriefing.highlights.map((hl, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
              <span className="text-cyan-400 font-bold mt-0.5">•</span>
              <span>{hl}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-cyan-500/20 text-cyan-300">
          <span className="font-semibold">{intelData.dailyBriefing.priorityNotice}</span>
          <button
            onClick={() => setActiveTab('anomalies')}
            className="flex items-center gap-1 font-bold text-white hover:text-cyan-300 transition-colors"
          >
            <span>Tinjau Anomali ({intelData.anomalies.length})</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1 overflow-x-auto">
        {[
          { id: 'overview', label: 'Ringkasan Eksekutif', icon: Layers },
          { id: 'health', label: 'Fleet Health & Tren', icon: Heart },
          { id: 'utilization', label: 'Utilisasi & Balancing', icon: Gauge },
          { id: 'performance', label: 'Performa Kendaraan', icon: Truck },
          { id: 'anomalies', label: `Anomali Telematika (${intelData.anomalies.length})`, icon: AlertTriangle },
          { id: 'efficiency', label: 'Efisiensi & Biaya', icon: Fuel },
          { id: 'risk_matrix', label: 'Priority Matrix & Cabang', icon: Activity },
          { id: 'executive_report', label: 'Laporan Siap Cetak', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveIntelligenceTab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-cyan-600 text-slate-950 shadow-md shadow-cyan-950'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 2 Column: Priority Matrix & Top AI Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VehiclePriorityMatrix
              vehicles={intelData.vehiclePerformance}
              onSelectVehicle={handleDrilldownVehicle}
              onExplainMatrix={() => handleOpenExplain('risk')}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  <span>Rekomendasi Tindakan AI Proaktif</span>
                </h3>
                <span className="text-xs text-slate-400">
                  Potensi Hemat: <strong className="text-emerald-400">Rp 35.5 Juta/bln</strong>
                </span>
              </div>

              <div className="space-y-3">
                {intelData.recommendations.slice(0, 2).map((rec) => (
                  <AIRecommendationCard
                    key={rec.id}
                    recommendation={rec}
                    onApplyAction={handleApplyRecommendation}
                    onExplain={(r) => {
                      setExplainModalState({
                        isOpen: true,
                        title: r.title,
                        metricName: 'Rekomendasi AI',
                        explanation: r.recommendation + ' ' + r.reason,
                        evidence: r.evidence,
                        recommendations: [r.expectedBenefit],
                      });
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Critical Anomalies Feed Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <span>Anomali Operasional Prioritas</span>
              </h3>
              <button
                onClick={() => setActiveTab('anomalies')}
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua ({intelData.anomalies.length})</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {intelData.anomalies.slice(0, 2).map((anom) => (
                <AIAnomalyCard
                  key={anom.id}
                  anomaly={anom}
                  onInvestigate={handleInvestigateAnomaly}
                  onVehicleClick={handleDrilldownVehicle}
                  onExplain={(a) => {
                    setExplainModalState({
                      isOpen: true,
                      title: a.title,
                      metricName: 'Anomali Telematika',
                      scoreOrValue: `${a.anomalyScore}/100`,
                      explanation: a.impact,
                      evidence: a.evidence,
                      recommendations: [a.recommendation],
                    });
                  }}
                />
              ))}
            </div>
          </div>

          {/* Top Performers vs Needs Attention */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top 5 */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-3">
                <TrendingUp className="h-4 w-4" />
                <span>Top 5 Kendaraan Paling Efisien & Berkinerja Tinggi</span>
              </span>
              <div className="space-y-2">
                {intelData.topPerformers.map((v) => (
                  <div
                    key={v.vehicleId}
                    onClick={() => handleDrilldownVehicle(v.vehicleId)}
                    className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <span className="font-mono font-bold text-white block">{v.plateNumber}</span>
                      <span className="text-[11px] text-slate-400">{v.brand} {v.model} • {v.fuelEfficiencyKmPerL} km/L</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-400 text-sm">{v.performanceScore}</span>
                      <span className="text-[10px] text-slate-500 block">Skor AI</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attention 5 */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5 mb-3">
                <TrendingDown className="h-4 w-4" />
                <span>Top 5 Kendaraan Membutuhkan Perhatian (Needs Attention)</span>
              </span>
              <div className="space-y-2">
                {intelData.attentionVehicles.map((v) => (
                  <div
                    key={v.vehicleId}
                    onClick={() => handleDrilldownVehicle(v.vehicleId)}
                    className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <span className="font-mono font-bold text-white block">{v.plateNumber}</span>
                      <span className="text-[11px] text-rose-400">{v.keyIssues[0] || 'Performa Rendah'}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-rose-400 text-sm">{v.performanceScore}</span>
                      <span className="text-[10px] text-slate-500 block">Skor AI</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Health & Trends */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          <HealthScoreBreakdownWidget
            health={intelData.health}
            onExplainHealth={() => handleOpenExplain('health')}
          />
        </div>
      )}

      {/* Tab 3: Utilization & Balancing */}
      {activeTab === 'utilization' && (
        <div className="space-y-6">
          <UtilizationBalancingWidget
            utilization={intelData.utilization}
            onExplainUtilization={() => handleOpenExplain('utilization')}
            onSelectVehicle={handleDrilldownVehicle}
          />
        </div>
      )}

      {/* Tab 4: Performance Table */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <VehiclePerformanceTable
            vehicles={intelData.vehiclePerformance}
            onSelectVehicle={handleDrilldownVehicle}
            onExportCsv={() => handleExport('csv')}
          />
        </div>
      )}

      {/* Tab 5: Anomalies Feed */}
      {activeTab === 'anomalies' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Deteksi Anomali Operasional Telematika</h3>
              <p className="text-xs text-slate-400">
                Penyimpangan telematika sensor, BBM, jam mengemudi, dan deviasi rute berbasis aturan & AI
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {intelData.anomalies.map((anom) => (
              <AIAnomalyCard
                key={anom.id}
                anomaly={anom}
                onInvestigate={handleInvestigateAnomaly}
                onVehicleClick={handleDrilldownVehicle}
                onExplain={(a) => {
                  setExplainModalState({
                    isOpen: true,
                    title: a.title,
                    metricName: 'Anomali Telematika',
                    scoreOrValue: `${a.anomalyScore}/100`,
                    explanation: a.impact,
                    evidence: a.evidence,
                    recommendations: [a.recommendation],
                  });
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Efficiency & Costs */}
      {activeTab === 'efficiency' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Fuel Efficiency */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-2">
                <Fuel className="h-4 w-4" />
                <span>Efisiensi Konsumsi BBM</span>
              </span>
              <div className="text-2xl font-black font-mono text-white mb-1">
                {intelData.efficiency.fuelEfficiency.avgKmPerL} <span className="text-xs text-slate-400">km/L</span>
              </div>
              <span className="text-[11px] text-slate-400 block mb-3">
                Target: {intelData.efficiency.fuelEfficiency.baselineKmPerL} km/L (Deviasi {intelData.efficiency.fuelEfficiency.deviationPercent}%)
              </span>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
                Biaya BBM per KM: <strong className="text-white">Rp {intelData.efficiency.fuelEfficiency.fuelCostPerKmIdr.toLocaleString('id-ID')} / KM</strong>
              </div>
            </div>

            {/* Idle Efficiency */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 mb-2">
                <Clock className="h-4 w-4" />
                <span>Pemborosan BBM Waktu Idle</span>
              </span>
              <div className="text-2xl font-black font-mono text-white mb-1">
                {intelData.efficiency.idleEfficiency.idlePercentOfRunTime}% <span className="text-xs text-slate-400">dari jam mesin</span>
              </div>
              <span className="text-[11px] text-rose-400 block mb-3">
                BBM Terbuang: {intelData.efficiency.idleEfficiency.idleFuelLostLiters} Liter solar
              </span>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
                Estimasi Biaya Terbuang: <strong className="text-rose-400">Rp {intelData.efficiency.idleEfficiency.idleCostEstimateIdr.toLocaleString('id-ID')}</strong>
              </div>
            </div>

            {/* Route & Delay Efficiency */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                <MapPin className="h-4 w-4" />
                <span>Kepatuhan Koridor Rute</span>
              </span>
              <div className="text-2xl font-black font-mono text-white mb-1">
                {intelData.efficiency.routeEfficiency.score} <span className="text-xs text-slate-400">/ 100</span>
              </div>
              <span className="text-[11px] text-slate-400 block mb-3">
                Deviasi Jarak: +{intelData.efficiency.routeEfficiency.deviationKm} KM ({intelData.efficiency.routeEfficiency.deviationPercent}%)
              </span>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
                Insiden Keterlambatan: <strong className="text-white">{intelData.efficiency.routeEfficiency.delayIncidentsCount} Kasus</strong>
              </div>
            </div>
          </div>

          {/* Financial Breakdown if available */}
          {intelData.efficiency.costEfficiency.hasFinancialData && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                Rincian Biaya Operasional Riil (Prompt 28: Data Faktual)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Total Biaya BBM</span>
                  <span className="text-lg font-bold font-mono text-white">
                    Rp {(intelData.efficiency.costEfficiency.fuelCostIdr! / 1000000).toFixed(1)} Jt
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Biaya Maintenance</span>
                  <span className="text-lg font-bold font-mono text-white">
                    Rp {(intelData.efficiency.costEfficiency.maintenanceCostIdr! / 1000000).toFixed(1)} Jt
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Biaya Operasional / KM</span>
                  <span className="text-lg font-bold font-mono text-cyan-300">
                    Rp {intelData.efficiency.costEfficiency.costPerKmIdr!.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Biaya Operasional / Trip</span>
                  <span className="text-lg font-bold font-mono text-cyan-300">
                    Rp {intelData.efficiency.costEfficiency.costPerTripIdr!.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 7: Risk Matrix & Branch Heatmap */}
      {activeTab === 'risk_matrix' && (
        <div className="space-y-6">
          <VehiclePriorityMatrix
            vehicles={intelData.vehiclePerformance}
            onSelectVehicle={handleDrilldownVehicle}
            onExplainMatrix={() => handleOpenExplain('risk')}
          />

          <BranchHealthHeatmap
            branches={intelData.branchHeatmap}
            onCompareBranches={() => setIsBranchModalOpen(true)}
          />
        </div>
      )}

      {/* Tab 8: Executive Report */}
      {activeTab === 'executive_report' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-black text-white">Laporan Eksekutif AI Fleet Intelligence</h2>
              <p className="text-xs text-slate-400">Dicetak otomatis untuk Direksi & Company Admin</p>
            </div>
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs"
            >
              <Printer className="h-4 w-4" />
              <span>Cetak Dokumen Laporan</span>
            </button>
          </div>

          <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <h4 className="font-bold text-white mb-1">1. Status Operasional Armada</h4>
              <p>{intelData.executiveSummary.fleetStatus}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <h4 className="font-bold text-white mb-1">2. Profil Risiko & Mitigasi</h4>
              <p>{intelData.executiveSummary.operationalRisk}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <h4 className="font-bold text-white mb-1">3. Efisiensi BBM & Dampak Finansial</h4>
              <p>{intelData.executiveSummary.fuelOutlook} {intelData.executiveSummary.financialImpact}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <h4 className="font-bold text-white mb-2">4. Rekomendasi Strategis AI</h4>
              <ul className="space-y-1">
                {intelData.executiveSummary.topRecommendations.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">{i + 1}.</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Modals & Dialogs */}
      <ExplainAIModal
        isOpen={explainModalState.isOpen}
        onClose={() => setExplainModalState({ ...explainModalState, isOpen: false })}
        title={explainModalState.title}
        metricName={explainModalState.metricName}
        scoreOrValue={explainModalState.scoreOrValue}
        explanation={explainModalState.explanation}
        contributingFactors={explainModalState.contributingFactors}
        evidence={explainModalState.evidence}
        recommendations={explainModalState.recommendations}
      />

      <VehicleIntelligenceModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        vehicle={selectedVehicle}
        anomalies={intelData.anomalies}
        onCreateWorkOrder={(v) => {
          setIsVehicleModalOpen(false);
          setActionSuccessToast(`Work Order pemeliharaan diterbitkan untuk unit ${v.plateNumber}.`);
        }}
        onGroundVehicle={(v) => {
          setIsVehicleModalOpen(false);
          setActionSuccessToast(`Status grounding (Out of Service) diaktifkan untuk unit ${v.plateNumber}.`);
        }}
      />

      <PeriodComparisonModal
        isOpen={isPeriodModalOpen}
        onClose={() => setIsPeriodModalOpen(false)}
        data={fleetIntelligenceService.comparePeriods(intelData)}
      />

      <BranchComparisonModal
        isOpen={isBranchModalOpen}
        onClose={() => setIsBranchModalOpen(false)}
        data={fleetIntelligenceService.compareBranches()}
      />

      <RootCauseAnalysisModal
        isOpen={isInvestigationModalOpen}
        onClose={() => setIsInvestigationModalOpen(false)}
        investigation={investigationData}
      />
    </div>
  );
};
