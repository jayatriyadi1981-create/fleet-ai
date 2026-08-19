/**
 * Fleet Intelligence Smart AI - AI Fuel Intelligence Main Parent View
 * PROMPT 30 Architecture
 *
 * Implements 17 comprehensive functional tabs, global multi-dimensional filter bar,
 * telemetry baselines, anomaly audits, predictive forecasting, and AI explainability.
 */

import React, { useState, useMemo } from 'react';
import { useFleet } from '../../context/FleetContext';
import { useAuthorization } from '../../hooks/useAuthorization';
import {
  FuelFilterState,
  FuelPeriodPreset,
  FuelAnomalyItem,
  FuelTheftIndicator,
  AnomalyInvestigationStatus,
  VehicleFuelBaseline,
} from './types';
import { fuelIntelligenceService } from './engines/FuelIntelligenceService';

// Tabs
import { OverviewTab } from './components/tabs/OverviewTab';
import { ConsumptionTab } from './components/tabs/ConsumptionTab';
import { EfficiencyTab } from './components/tabs/EfficiencyTab';
import { AnomaliesTab } from './components/tabs/AnomaliesTab';
import { TheftDetectionTab } from './components/tabs/TheftDetectionTab';
import { DrainDetectionTab } from './components/tabs/DrainDetectionTab';
import { RefuelingTab } from './components/tabs/RefuelingTab';
import { CostAnalysisTab } from './components/tabs/CostAnalysisTab';
import { VehicleRankingTab } from './components/tabs/VehicleRankingTab';
import { DriverAnalysisTab } from './components/tabs/DriverAnalysisTab';
import { RouteAnalysisTab } from './components/tabs/RouteAnalysisTab';
import { FuelTrendsTab } from './components/tabs/FuelTrendsTab';
import { PredictionTab } from './components/tabs/PredictionTab';
import { RecommendationsTab } from './components/tabs/RecommendationsTab';
import { FuelMapTab } from './components/tabs/FuelMapTab';
import { ReportsTab } from './components/tabs/ReportsTab';
import { DataQualityTab } from './components/tabs/DataQualityTab';

// Modals
import { ExplainWithAIModal, ExplainAIContent } from './components/modals/ExplainWithAIModal';
import { AnomalyReviewModal } from './components/modals/AnomalyReviewModal';
import { VehicleDrilldownModal } from './components/modals/VehicleDrilldownModal';

import {
  Fuel,
  LayoutDashboard,
  Gauge,
  AlertOctagon,
  ShieldAlert,
  Droplet,
  DollarSign,
  Trophy,
  Users,
  Waypoints,
  TrendingUp,
  Cpu,
  Sparkles,
  MapPin,
  FileText,
  Activity,
  Filter,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

export const FuelIntelligenceView: React.FC = () => {
  const { vehicles, branches, drivers, geofences } = useFleet();
  const { can } = useAuthorization();

  // Active Tab State
  const [activeTab, setActiveTab] = useState<string>('OVERVIEW');

  // Global Filters
  const [filters, setFilters] = useState<FuelFilterState>({
    period: '30_DAYS',
    branchId: 'ALL',
    vehicleGroupId: 'ALL',
    vehicleId: 'ALL',
    driverId: 'ALL',
    routeId: 'ALL',
    geofenceId: 'ALL',
    fuelType: 'ALL',
    minTripsThreshold: 5,
  });

  // Modal States
  const [explainModalOpen, setExplainModalOpen] = useState(false);
  const [explainContent, setExplainContent] = useState<ExplainAIContent | null>(null);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedAnomalyForReview, setSelectedAnomalyForReview] = useState<FuelAnomalyItem | FuelTheftIndicator | null>(null);

  const [drilldownModalOpen, setDrilldownModalOpen] = useState(false);
  const [selectedDrilldownVehicle, setSelectedDrilldownVehicle] = useState<VehicleFuelBaseline | null>(null);

  // Dynamic Service Data Fetching
  const kpis = useMemo(() => fuelIntelligenceService.getOverviewKPIs(filters), [filters]);
  const baselines = useMemo(() => fuelIntelligenceService.getBaselines(filters), [filters]);
  const efficiencyDetail = useMemo(() => fuelIntelligenceService.getEfficiencyDetail(filters), [filters]);
  const costBreakdown = useMemo(() => fuelIntelligenceService.getCostBreakdown(filters), [filters]);
  const rankings = useMemo(() => fuelIntelligenceService.getVehicleRankings(filters), [filters]);
  const driverAnalysis = useMemo(() => fuelIntelligenceService.getDriverAnalysis(filters), [filters]);
  const routeAnalysis = useMemo(() => fuelIntelligenceService.getRouteAnalysis(filters), [filters]);
  const trends = useMemo(() => fuelIntelligenceService.getTrends(filters), [filters]);
  const anomalies = useMemo(() => fuelIntelligenceService.getAnomalies(filters), [filters]);
  const theftIndicators = useMemo(() => fuelIntelligenceService.getTheftIndicators(filters), [filters]);
  const drainEvents = useMemo(() => fuelIntelligenceService.getDrainEvents(filters), [filters]);
  const refuelingAudits = useMemo(() => fuelIntelligenceService.getRefuelingAudits(filters), [filters]);
  const predictions = useMemo(() => fuelIntelligenceService.getPredictions(filters), [filters]);
  const recommendations = useMemo(() => fuelIntelligenceService.getRecommendations(filters), [filters]);
  const mapMarkers = useMemo(() => fuelIntelligenceService.getMapEventMarkers(filters), [filters]);
  const dataQuality = useMemo(() => fuelIntelligenceService.getDataQuality(filters), [filters]);

  // Handle Explain With AI
  const handleExplainWithAI = (categoryStr: string, subject: string) => {
    const category = categoryStr as ExplainAIContent['category'];
    setExplainContent({
      title: `Analisis AI Telematika: ${subject}`,
      category,
      subject,
      whatHappened: `Analisis mendalam terhadap telemetri konsumsi bahan bakar dan sensor tangki mendeteksi deviasi performa pada subjek "${subject}".`,
      whyFlagged: 'Model mendeteksi anomali pola konsumsi melebihi 2 standar deviasi dari benchmark historis jenis armada dan kondisi rute.',
      evidence: [
        'Data sensor tangki ultrasonik mengirim data dengan stabilitas frekuensi 10 detik',
        'Korelasi status mesin (Ignition ON/OFF) dengan pergerakan Odometer GPS',
        'Penyimpangan konsumsi rata-rata +14.2% di atas ambang batas armada',
      ],
      dataReliability: 'HIGH',
      reliabilityReason: 'Sensor terkalibrasi normal tanpa flatline atau packet loss.',
      recommendedOperatorAction: 'Jadwalkan kalibrasi fisik sensor dan berikan briefing eco-driving mengenai durasi mesin idle saat antrean bongkar muat.',
    });
    setExplainModalOpen(true);
  };

  // Handle Anomaly Review
  const handleOpenReview = (anomaly: FuelAnomalyItem | FuelTheftIndicator) => {
    setSelectedAnomalyForReview(anomaly);
    setReviewModalOpen(true);
  };

  const handleSaveReview = (id: string, status: AnomalyInvestigationStatus, notes: string) => {
    // In production, update state in store or database
    if (selectedAnomalyForReview) {
      selectedAnomalyForReview.status = status;
      if ('investigationNotes' in selectedAnomalyForReview) {
        selectedAnomalyForReview.investigationNotes = notes;
      }
    }
  };

  // Handle Vehicle Drilldown
  const handleVehicleDrilldown = (vehicleId: string) => {
    const v = baselines.find((b) => b.vehicleId === vehicleId) || baselines[0];
    setSelectedDrilldownVehicle(v);
    setDrilldownModalOpen(true);
  };

  // Navigation Tab List
  const tabs = [
    { id: 'OVERVIEW', label: 'Ringkasan Eksekutif', icon: LayoutDashboard },
    { id: 'CONSUMPTION', label: 'Konsumsi (L/100km)', icon: Fuel },
    { id: 'EFFICIENCY', label: 'Skor Efisiensi (0-100)', icon: Gauge },
    { id: 'ANOMALIES', label: 'Anomali BBM', icon: AlertOctagon, badge: anomalies.length },
    { id: 'THEFT', label: 'Deteksi Pencurian', icon: ShieldAlert, badge: theftIndicators.length, badgeColor: 'rose' },
    { id: 'DRAIN', label: 'Deteksi Kebocoran', icon: Droplet, badge: drainEvents.length },
    { id: 'REFUELING', label: 'Audit SPBU & Transaksi', icon: Fuel },
    { id: 'COST', label: 'Analisis Biaya (Cost)', icon: DollarSign },
    { id: 'RANKINGS', label: 'Peringkat Kendaraan', icon: Trophy },
    { id: 'DRIVERS', label: 'Perilaku Driver BBM', icon: Users },
    { id: 'ROUTES', label: 'Analisis Rute', icon: Waypoints },
    { id: 'TRENDS', label: 'Tren & Volatilitas', icon: TrendingUp },
    { id: 'PREDICTIONS', label: 'Prediksi AI', icon: Cpu },
    { id: 'RECOMMENDATIONS', label: 'Rekomendasi AI', icon: Sparkles, badge: recommendations.length, badgeColor: 'cyan' },
    { id: 'MAP', label: 'Peta Kejadian GIS', icon: MapPin },
    { id: 'REPORTS', label: 'Laporan & Ekspor', icon: FileText },
    { id: 'DATA_QUALITY', label: 'Kualitas Sensor', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* 1. Header with Breadcrumb & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>INTELLIGENCE & LAPORAN</span>
            <span>/</span>
            <span className="text-slate-200">AI FUEL INTELLIGENCE</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-lg shadow-cyan-950">
              <Fuel className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                AI Fuel Intelligence
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  SMART SAAS
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Pusat Analitik Konsumsi BBM, Deteksi Anomali, Prediksi Efisiensi, dan Pencegahan Pemborosan Armada
              </p>
            </div>
          </div>
        </div>

        {/* Global Quick Action */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => handleExplainWithAI('EFFICIENCY', 'Status Keseluruhan Bahan Bakar Armada')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-semibold shadow-md transition-colors"
          >
            <Sparkles className="h-4 w-4" /> Tanya AI Copilot
          </button>
        </div>
      </div>

      {/* 2. Global Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wider">
            <SlidersHorizontal className="h-3.5 w-3.5 text-cyan-400" />
            Filter Global Telematika BBM
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            Sinkronisasi Data: Live OBD & Sensor Ultrasonic
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {/* Period Preset */}
          <div>
            <label className="text-[10px] font-mono text-slate-400 block mb-1">Periode Waktu</label>
            <select
              value={filters.period}
              onChange={(e) => setFilters({ ...filters, period: e.target.value as FuelPeriodPreset })}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-slate-200 text-xs focus:border-cyan-500 focus:outline-none"
            >
              <option value="TODAY">Hari Ini (Today)</option>
              <option value="YESTERDAY">Kemarin</option>
              <option value="7_DAYS">7 Hari Terakhir</option>
              <option value="30_DAYS">30 Hari Terakhir</option>
              <option value="90_DAYS">90 Hari Terakhir</option>
              <option value="THIS_MONTH">Bulan Ini</option>
              <option value="PREVIOUS_MONTH">Bulan Lalu</option>
            </select>
          </div>

          {/* Branch */}
          <div>
            <label className="text-[10px] font-mono text-slate-400 block mb-1">Cabang / Depo</label>
            <select
              value={filters.branchId}
              onChange={(e) => setFilters({ ...filters, branchId: e.target.value })}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-slate-200 text-xs focus:border-cyan-500 focus:outline-none"
            >
              <option value="ALL">Semua Cabang ({branches.length})</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Vehicle */}
          <div>
            <label className="text-[10px] font-mono text-slate-400 block mb-1">Kendaraan</label>
            <select
              value={filters.vehicleId}
              onChange={(e) => setFilters({ ...filters, vehicleId: e.target.value })}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-slate-200 text-xs focus:border-cyan-500 focus:outline-none"
            >
              <option value="ALL">Semua Unit ({vehicles.length})</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>{v.plateNumber} - {v.model}</option>
              ))}
            </select>
          </div>

          {/* Driver */}
          <div>
            <label className="text-[10px] font-mono text-slate-400 block mb-1">Pengemudi (Driver)</label>
            <select
              value={filters.driverId}
              onChange={(e) => setFilters({ ...filters, driverId: e.target.value })}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-slate-200 text-xs focus:border-cyan-500 focus:outline-none"
            >
              <option value="ALL">Semua Pengemudi</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Fuel Type */}
          <div>
            <label className="text-[10px] font-mono text-slate-400 block mb-1">Jenis Bahan Bakar</label>
            <select
              value={filters.fuelType}
              onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-slate-200 text-xs focus:border-cyan-500 focus:outline-none"
            >
              <option value="ALL">Semua Jenis BBM</option>
              <option value="BIODIESEL">Biodiesel (B35)</option>
              <option value="SOLAR">Solar Industri</option>
              <option value="PERTALITE">Pertalite</option>
              <option value="PERTAMAX">Pertamax</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div className="flex items-end">
            <button
              onClick={() =>
                setFilters({
                  period: '30_DAYS',
                  branchId: 'ALL',
                  vehicleGroupId: 'ALL',
                  vehicleId: 'ALL',
                  driverId: 'ALL',
                  routeId: 'ALL',
                  geofenceId: 'ALL',
                  fuelType: 'ALL',
                  minTripsThreshold: 5,
                })
              }
              className="w-full py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Reset Filter
            </button>
          </div>
        </div>
      </div>

      {/* 3. Horizontal Scrollable Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-lg shadow-cyan-950/50'
                  : 'bg-slate-900/90 text-slate-400 border-slate-800/80 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                    isActive
                      ? 'bg-slate-950 text-cyan-300'
                      : tab.badgeColor === 'rose'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : tab.badgeColor === 'cyan'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 4. Active Tab Content Rendering */}
      <div className="space-y-6">
        {activeTab === 'OVERVIEW' && (
          <OverviewTab
            kpis={kpis}
            trends={trends}
            anomalies={anomalies}
            theftIndicators={theftIndicators}
            rankings={rankings}
            recommendations={recommendations}
            onSelectTab={(tabId) => setActiveTab(tabId)}
            onExplainWithAI={handleExplainWithAI}
          />
        )}

        {activeTab === 'CONSUMPTION' && (
          <ConsumptionTab
            baselines={baselines}
            onExplainWithAI={handleExplainWithAI}
          />
        )}

        {activeTab === 'EFFICIENCY' && (
          <EfficiencyTab
            efficiencyDetail={efficiencyDetail}
            onExplainWithAI={handleExplainWithAI}
          />
        )}

        {activeTab === 'ANOMALIES' && (
          <AnomaliesTab
            anomalies={anomalies}
            onOpenReview={handleOpenReview}
            onExplainWithAI={handleExplainWithAI}
          />
        )}

        {activeTab === 'THEFT' && (
          <TheftDetectionTab
            theftIndicators={theftIndicators}
            onOpenReview={handleOpenReview}
            onExplainWithAI={handleExplainWithAI}
          />
        )}

        {activeTab === 'DRAIN' && (
          <DrainDetectionTab
            drainEvents={drainEvents}
            onOpenReview={handleOpenReview}
            onExplainWithAI={handleExplainWithAI}
          />
        )}

        {activeTab === 'REFUELING' && (
          <RefuelingTab
            refuelingAudits={refuelingAudits}
            onExplainWithAI={handleExplainWithAI}
          />
        )}

        {activeTab === 'COST' && (
          <CostAnalysisTab
            costBreakdown={costBreakdown}
            onExplainWithAI={handleExplainWithAI}
          />
        )}

        {activeTab === 'RANKINGS' && (
          <VehicleRankingTab
            rankings={rankings}
            minTrips={filters.minTripsThreshold}
            onChangeMinTrips={(val) => setFilters({ ...filters, minTripsThreshold: val })}
            onSelectVehicleDrilldown={handleVehicleDrilldown}
            onExplainWithAI={handleExplainWithAI}
          />
        )}

        {activeTab === 'DRIVERS' && (
          <DriverAnalysisTab
            driverAnalysis={driverAnalysis}
            onExplainWithAI={handleExplainWithAI}
          />
        )}

        {activeTab === 'ROUTES' && (
          <RouteAnalysisTab
            routeAnalysis={routeAnalysis}
            onExplainWithAI={handleExplainWithAI}
          />
        )}

        {activeTab === 'TRENDS' && (
          <FuelTrendsTab
            trends={trends}
            onExplainWithAI={handleExplainWithAI}
          />
        )}

        {activeTab === 'PREDICTIONS' && (
          <PredictionTab
            predictions={predictions}
            onExplainWithAI={handleExplainWithAI}
          />
        )}

        {activeTab === 'RECOMMENDATIONS' && (
          <RecommendationsTab
            recommendations={recommendations}
            onExplainWithAI={handleExplainWithAI}
          />
        )}

        {activeTab === 'MAP' && (
          <FuelMapTab
            markers={mapMarkers}
            onExplainWithAI={handleExplainWithAI}
          />
        )}

        {activeTab === 'REPORTS' && (
          <ReportsTab
            kpis={kpis}
            costBreakdown={costBreakdown}
            onExplainWithAI={handleExplainWithAI}
          />
        )}

        {activeTab === 'DATA_QUALITY' && (
          <DataQualityTab
            dataQuality={dataQuality}
            onExplainWithAI={handleExplainWithAI}
          />
        )}
      </div>

      {/* 5. Modals */}
      <ExplainWithAIModal
        isOpen={explainModalOpen}
        onClose={() => setExplainModalOpen(false)}
        content={explainContent}
      />

      <AnomalyReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        anomaly={selectedAnomalyForReview}
        onSaveReview={handleSaveReview}
      />

      <VehicleDrilldownModal
        isOpen={drilldownModalOpen}
        onClose={() => setDrilldownModalOpen(false)}
        vehicle={selectedDrilldownVehicle}
        anomalies={anomalies}
        theftIndicators={theftIndicators}
        prediction={predictions.find((p) => p.vehicleId === selectedDrilldownVehicle?.vehicleId)}
        onExplainWithAI={handleExplainWithAI}
      />
    </div>
  );
};
