/**
 * Fleet Intelligence Smart AI - Master Route Management Main View
 * PROMPT 16 — Master Route Planning, Optimization, Deviation Engine, Alternatives & Performance Analytics
 */

import React, { useState, useEffect } from 'react';
import { Route, RouteFilterState, RouteDeviation, AlternativeRoute } from '../../modules/routes/routeTypes';
import { routeManagementService } from '../../modules/routes/services/routeManagementService';
import { routePerformanceService } from '../../modules/routes/services/routePerformanceService';
import { routeAIService, AIRouteIntelligenceResult } from '../../modules/routes/services/routeAIService';
import { routeDeviationService } from '../../modules/routes/services/routeDeviationService';
import { routeVersionService } from '../../modules/routes/services/routeVersionService';
import { RouteHeader } from '../route-management/RouteHeader';
import { RouteKpiBar } from '../route-management/RouteKpiBar';
import { RouteTable } from '../route-management/RouteTable';
import { RouteMapComponent } from '../route-management/RouteMapComponent';
import { CreateRouteWizardModal } from '../route-management/CreateRouteWizardModal';
import { useFleet } from '../../context/FleetContext';

import {
  Waypoints,
  MapPin,
  Clock,
  Sparkles,
  AlertTriangle,
  Layers,
  BarChart3,
  ShieldAlert,
  History,
  Navigation,
  CheckCircle2,
  TrendingUp,
  Sliders,
  Plus,
  Zap,
  RefreshCw,
  FileText,
  AlertCircle,
  Truck,
  FileCheck
} from 'lucide-react';

export const RouteManagementView: React.FC = () => {
  const { setActiveView } = useFleet();

  // Local Filter State
  const [filter, setFilter] = useState<RouteFilterState>({
    searchQuery: '',
    status: 'ALL',
    routeType: 'ALL',
    optimizationStatus: 'ALL',
    priority: 'ALL',
    hasDeviation: false,
  });

  // Data State
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'detail' | 'performance' | 'restrictions'>('list');

  // Modal State
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [routeToEdit, setRouteToEdit] = useState<Route | null>(null);

  // Detail View State
  const [selectedAlternativeId, setSelectedAlternativeId] = useState<string | undefined>();
  const [activeDeviation, setActiveDeviation] = useState<RouteDeviation | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);

  // Load routes on mount and filter changes
  useEffect(() => {
    refreshRouteData();
  }, [filter]);

  const refreshRouteData = () => {
    const data = routeManagementService.getRoutes(filter);
    setRoutes(data);
    if (!selectedRoute && data.length > 0) {
      setSelectedRoute(data[0]);
    } else if (selectedRoute) {
      const refreshedSelected = data.find((r) => r.id === selectedRoute.id);
      if (refreshedSelected) setSelectedRoute(refreshedSelected);
    }
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleFilterChange = (newFilter: Partial<RouteFilterState>) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
  };

  const handleCreateNewRoute = () => {
    setRouteToEdit(null);
    setIsWizardOpen(true);
  };

  const handleEditRoute = (routeId: string) => {
    const route = routeManagementService.getRouteById(routeId);
    if (route) {
      setRouteToEdit(route);
      setIsWizardOpen(true);
    }
  };

  const handleSelectRoute = (routeId: string) => {
    const route = routeManagementService.getRouteById(routeId);
    if (route) {
      setSelectedRoute(route);
      setSelectedAlternativeId(undefined);
      setActiveDeviation(null);
      setActiveTab('detail');
    }
  };

  const handleDeleteRoute = (routeId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus rute master ini? Action ini tidak dapat dibatalkan.')) {
      const success = routeManagementService.deleteRoute(routeId);
      if (success) {
        showToast('Rute master berhasil dihapus.', 'info');
        refreshRouteData();
      }
    }
  };

  const handleOptimizeRoute = async (routeId: string) => {
    showToast('Prosedur optimasi AI sedang memproses waypoint...', 'info');
    const updated = await routeManagementService.optimizeExistingRoute(routeId, 'Balanced');
    if (updated) {
      showToast(`Rute ${updated.routeCode} berhasil dioptimasi oleh AI Engine!`, 'success');
      refreshRouteData();
    }
  };

  const handleSaveRouteFromWizard = (newRoute: Route) => {
    showToast(`Rute master ${newRoute.routeCode} berhasil disimpan.`, 'success');
    refreshRouteData();
    setSelectedRoute(newRoute);
    setActiveTab('detail');
  };

  const handleExport = () => {
    routeManagementService.exportRoutes(routes);
    showToast('Export data rute ke format CSV berhasil diunduh.', 'success');
  };

  const handleCreateTripFromRoute = (route: Route) => {
    showToast(`Menyiapkan penugasan trip dari rute ${route.routeCode}...`, 'info');
    // Navigate user to trip planning view
    setActiveView('planned_trips');
  };

  // Async AI Assessment state
  const [routeAI, setRouteAI] = useState<AIRouteIntelligenceResult | null>(null);

  useEffect(() => {
    if (selectedRoute) {
      routeAIService.analyzeRouteIntelligence(selectedRoute).then((res) => setRouteAI(res));
    } else {
      setRouteAI(null);
    }
  }, [selectedRoute]);

  // Performance analytics summary for selected route
  const routePerf = selectedRoute
    ? routePerformanceService.getRoutePerformance(
        selectedRoute.id,
        selectedRoute.distanceKm,
        selectedRoute.estimatedDurationMinutes
      )
    : null;

  const routeDeviations = routeDeviationService.getActiveDeviations();
  const routeVersions = selectedRoute ? routeVersionService.getRouteVersions(selectedRoute.id) : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-xs font-bold border ${
            notification.type === 'success'
              ? 'bg-emerald-950 text-emerald-200 border-emerald-700'
              : notification.type === 'error'
              ? 'bg-rose-950 text-rose-200 border-rose-700'
              : 'bg-blue-950 text-blue-200 border-blue-700'
          }`}
        >
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header Bar */}
      <RouteHeader
        filter={filter}
        onFilterChange={handleFilterChange}
        onExport={handleExport}
        onCreateRoute={handleCreateNewRoute}
      />

      <div className="px-4 sm:px-6 lg:px-8 space-y-6 max-w-[1600px] w-full mx-auto flex-1">
        {/* KPI Metrics */}
        <RouteKpiBar
          routes={routes}
          onSelectStatusFilter={(status) => handleFilterChange({ status: status as any })}
        />

        {/* View Tabs Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveTab('list')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'list'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Daftar Master Rute ({routes.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('detail')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'detail'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Detail & Peta Visualisasi</span>
              {selectedRoute && (
                <span className="px-2 py-0.5 text-[10px] bg-blue-500/20 text-blue-300 rounded-md border border-blue-400/30">
                  {selectedRoute.routeCode}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('performance')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'performance'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analisis Performa Rute</span>
            </button>

            <button
              onClick={() => setActiveTab('restrictions')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'restrictions'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Pembatasan Jalan & Safety Rules</span>
            </button>
          </div>

          {selectedRoute && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => handleOptimizeRoute(selectedRoute.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-purple-300 bg-purple-950/70 border border-purple-700/50 rounded-lg hover:bg-purple-900/50 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Optimasi AI Rute Ini</span>
              </button>

              <button
                onClick={() => handleCreateTripFromRoute(selectedRoute)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-700/50 rounded-lg hover:bg-emerald-900/50 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tugaskan Trip Baru</span>
              </button>
            </div>
          )}
        </div>

        {/* TAB 1: MASTER ROUTE TABLE LIST */}
        {activeTab === 'list' && (
          <div className="space-y-4">
            <RouteTable
              routes={routes}
              onSelectRoute={handleSelectRoute}
              onEditRoute={handleEditRoute}
              onCreateTripFromRoute={handleCreateTripFromRoute}
              onOptimizeRoute={handleOptimizeRoute}
              onDeleteRoute={handleDeleteRoute}
            />
          </div>
        )}

        {/* TAB 2: INTERACTIVE DETAIL & MAP VISUALIZER */}
        {activeTab === 'detail' && selectedRoute && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Map Column (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Waypoints className="w-5 h-5 text-blue-400" />
                    <h3 className="text-sm font-bold text-white">Visualisasi Peta Master Rute</h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-blue-400 font-semibold">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                      Rute Utama ({selectedRoute.distanceKm} km)
                    </span>
                    {selectedRoute.alternativeRoutes.length > 0 && (
                      <span className="flex items-center gap-1 text-purple-400 font-semibold">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span>
                        Rute Alternatif ({selectedRoute.alternativeRoutes.length})
                      </span>
                    )}
                  </div>
                </div>

                {/* Leaflet Map Component */}
                <RouteMapComponent
                  route={selectedRoute}
                  selectedAlternativeId={selectedAlternativeId}
                  activeDeviation={activeDeviation}
                  className="h-[460px] w-full rounded-xl overflow-hidden shadow-inner border border-slate-800"
                />

                {/* Map Legend Footer */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-slate-400 border-t border-slate-800/80">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-300"></span> Origin
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-rose-500 border border-rose-300"></span> Destination
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-300"></span> Waypoints ({selectedRoute.waypoints.length})
                    </span>
                  </div>
                  <span className="text-slate-500 italic">Klik marker di peta untuk detail koordinat</span>
                </div>
              </div>

              {/* Waypoints Sequence Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center justify-between">
                  <span>Urutan Waypoints & Titik Singgah</span>
                  <span className="text-xs font-semibold text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded-lg border border-blue-800">
                    {selectedRoute.waypoints.length + 2} Total Perhentian
                  </span>
                </h4>

                <div className="relative pl-6 space-y-4 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                  {/* Origin */}
                  <div className="relative flex items-start justify-between bg-slate-950/60 p-3 rounded-xl border border-emerald-900/40">
                    <span className="absolute -left-6 top-3 w-6 h-6 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                      A
                    </span>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-emerald-400 tracking-wider">TITI ASAL (ORIGIN)</span>
                      <h5 className="text-xs font-bold text-white">{selectedRoute.origin.name}</h5>
                      <p className="text-[11px] text-slate-400">{selectedRoute.origin.address}</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">0.0 KM</span>
                  </div>

                  {/* Waypoints */}
                  {selectedRoute.waypoints.map((wp, idx) => (
                    <div key={wp.id} className="relative flex items-start justify-between bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                      <span className="absolute -left-6 top-3 w-6 h-6 rounded-full bg-amber-500/20 border-2 border-amber-500 text-amber-400 flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase text-amber-400 tracking-wider">
                            WAYPOINT #{wp.sequence} ({wp.type})
                          </span>
                          {wp.stopDurationMinutes && (
                            <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                              Istirahat {wp.stopDurationMinutes} Mnt
                            </span>
                          )}
                        </div>
                        <h5 className="text-xs font-bold text-white">{wp.name}</h5>
                        <p className="text-[11px] text-slate-400">{wp.address}</p>
                        {wp.notes && <p className="text-[10px] text-amber-300/80 mt-1 italic">Catatan: {wp.notes}</p>}
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">Est. Singgah</span>
                    </div>
                  ))}

                  {/* Destination */}
                  <div className="relative flex items-start justify-between bg-slate-950/60 p-3 rounded-xl border border-rose-900/40">
                    <span className="absolute -left-6 top-3 w-6 h-6 rounded-full bg-rose-500/20 border-2 border-rose-500 text-rose-400 flex items-center justify-center text-[10px] font-bold">
                      B
                    </span>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-rose-400 tracking-wider">TITIK TUJUAN (DESTINATION)</span>
                      <h5 className="text-xs font-bold text-white">{selectedRoute.destination.name}</h5>
                      <p className="text-[11px] text-slate-400">{selectedRoute.destination.address}</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{selectedRoute.distanceKm} KM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Column (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Route Summary Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800">
                      {selectedRoute.routeCode}
                    </span>
                    <h2 className="text-base font-bold text-white mt-1.5">{selectedRoute.name}</h2>
                    <p className="text-xs text-slate-400 mt-1">{selectedRoute.description || 'Tidak ada deskripsi rute.'}</p>
                  </div>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Total Jarak</span>
                    <div className="text-lg font-extrabold text-blue-400">{selectedRoute.distanceKm} KM</div>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Est. Durasi</span>
                    <div className="text-lg font-extrabold text-emerald-400">
                      {Math.floor(selectedRoute.estimatedDurationMinutes / 60)}j {selectedRoute.estimatedDurationMinutes % 60}m
                    </div>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Tipe Rute</span>
                    <div className="text-xs font-bold text-white mt-1">{selectedRoute.routeType}</div>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Versi Terbit</span>
                    <div className="text-xs font-bold text-indigo-400 mt-1">v{selectedRoute.currentVersion}.0 Master</div>
                  </div>
                </div>
              </div>

              {/* AI Route Intelligence Card */}
              {routeAI && (
                <div className="bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-900 border border-purple-800/50 rounded-2xl p-5 shadow-lg space-y-3">
                  <div className="flex items-center justify-between border-b border-purple-900/50 pb-3">
                    <div className="flex items-center gap-2 text-purple-300">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                      <h4 className="text-sm font-bold">AI Route Intelligence Assessment</h4>
                    </div>
                    <span className="px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-300 bg-emerald-950 border border-emerald-700 rounded-lg">
                      Kepercayaan AI: {routeAI.confidencePercent}%
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Tingkat Risiko Koridor:</span>
                      <span className={`font-bold ${routeAI.riskAssessment === 'LOW' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {routeAI.riskAssessment} RISK
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Prediksi Keterlambatan ETA:</span>
                      <span className="font-bold text-amber-400">+{routeAI.predictedEtaDelayMinutes} Menit</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-purple-900/40 space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase text-purple-400 tracking-wider">Faktor Risiko & Rekomendasi AI:</span>
                    <ul className="space-y-1 text-[11px] text-slate-300">
                      {routeAI.keyRiskFactors.map((factor, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="p-2.5 bg-purple-950/50 rounded-lg border border-purple-800/50 text-[11px] text-purple-200 mt-2">
                      <span className="font-bold">Saran AI: </span>
                      {routeAI.recommendation}
                    </div>
                  </div>
                </div>
              )}

              {/* Alternative Routes Card */}
              {selectedRoute.alternativeRoutes.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                  <h4 className="text-sm font-bold text-white flex items-center justify-between">
                    <span>Opsi Rute Alternatif</span>
                    <span className="text-xs text-slate-400">{selectedRoute.alternativeRoutes.length} Alternatif</span>
                  </h4>

                  <div className="space-y-2">
                    {selectedRoute.alternativeRoutes.map((alt) => (
                      <div
                        key={alt.id}
                        onClick={() => setSelectedAlternativeId(alt.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          selectedAlternativeId === alt.id
                            ? 'bg-purple-950/60 border-purple-500'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-white">{alt.name}</h5>
                          <span className="text-[10px] font-bold text-purple-400">Skor: {alt.score}/100</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">{alt.keyDiff}</p>
                        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500 mt-2">
                          <span>{alt.distanceKm} KM</span>
                          <span>•</span>
                          <span>{alt.estimatedDurationMinutes} Mnt</span>
                          <span>•</span>
                          <span>Biaya Tol: Rp {alt.tollCostIdr.toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Route Version History */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-indigo-400" />
                  <span>Riwayat Versi Master Rute ({routeVersions.length})</span>
                </h4>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                  {routeVersions.map((ver) => (
                    <div key={ver.id} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-indigo-400">v{ver.version}.0</span>
                          <span className="text-[10px] text-slate-500">{new Date(ver.createdAt).toLocaleDateString('id-ID')}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">{ver.notes}</p>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500">{ver.createdBy}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PERFORMANCE ANALYTICS */}
        {activeTab === 'performance' && selectedRoute && routePerf && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md">
                <span className="text-xs text-slate-400 font-semibold uppercase">Efisiensi Jarak Rute</span>
                <div className="text-2xl font-extrabold text-blue-400 mt-1">{routePerf.distanceVarianceKm >= 0 ? '+' : ''}{routePerf.distanceVarianceKm} KM</div>
                <p className="text-[11px] text-slate-500 mt-1">Variansi aktual vs standar perencanaan</p>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md">
                <span className="text-xs text-slate-400 font-semibold uppercase">Variansi Durasi Operasional</span>
                <div className="text-2xl font-extrabold text-amber-400 mt-1">{routePerf.durationVarianceMinutes >= 0 ? '+' : ''}{routePerf.durationVarianceMinutes} Mnt</div>
                <p className="text-[11px] text-slate-500 mt-1">Estimasi deviasi waktu tempuh</p>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md">
                <span className="text-xs text-slate-400 font-semibold uppercase">Skor Efisiensi Rute AI</span>
                <div className="text-2xl font-extrabold text-emerald-400 mt-1">{routePerf.routeEfficiencyScore}%</div>
                <p className="text-[11px] text-emerald-500 mt-1">Target ketepatan waktu & minim deviasi</p>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md">
                <span className="text-xs text-slate-400 font-semibold uppercase">Estimasi Konsumsi BBM</span>
                <div className="text-2xl font-extrabold text-indigo-400 mt-1">{routePerf.fuelConsumedLiters} Liter</div>
                <p className="text-[11px] text-slate-500 mt-1">Solar B35 per satu kali perjalanan</p>
              </div>
            </div>

            {/* AI Optimization Insight */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span>Rekomendasi Peningkatan Performa Perjalanan</span>
              </h3>
              <p className="text-xs text-slate-400">
                Berdasarkan histori telematika GPS dan kondisi lalu lintas real-time pada rute {selectedRoute.name}:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-blue-400 mb-1">Optimasi Jam Keberangkatan</h4>
                  <p className="text-slate-400 text-[11px]">
                    Keberangkatan pada pukul 05:30 WIB mengurangi risiko kemacetan di tol sebesar 22%.
                  </p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-emerald-400 mb-1">Penghematan BBM Solar</h4>
                  <p className="text-slate-400 text-[11px]">
                    Menjaga rpm di kisaran 1.500-1.800 pada rute ini menghemat hingga 8.5 liter per trip.
                  </p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-purple-400 mb-1">Mitigasi Deviasi Rute</h4>
                  <p className="text-slate-400 text-[11px]">
                    Rest area KM 57 direkomendasikan sebagai titik penalti deviasi terukur untuk supir.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: RESTRICTIONS & SAFETY RULES */}
        {activeTab === 'restrictions' && selectedRoute && (
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                  <span>Pembatasan Jalan & Spesifikasi Armada ({selectedRoute.routeCode})</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Aturan larangan tonase, tinggi jembatan, waktu melintas, dan spesifikasi armada yang diizinkan.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vehicle Specs Limits */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-400" />
                  <span>Batas Spesifikasi Kendaraan</span>
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                    <span>Maksimal Berat Tonase (MST):</span>
                    <span className="font-bold text-white">{selectedRoute.vehicleRestrictions?.maxWeightTon || 24} Ton</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                    <span>Maksimal Tinggi Kendaraan:</span>
                    <span className="font-bold text-white">{selectedRoute.vehicleRestrictions?.maxHeightMeters || 4.2} Meter</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                    <span>Maksimal Lebar Kendaraan:</span>
                    <span className="font-bold text-white">{selectedRoute.vehicleRestrictions?.maxWidthMeters || 2.5} Meter</span>
                  </div>
                  <div className="flex justify-between py-1 text-slate-300">
                    <span>Akses Jalan Tol & Expressway:</span>
                    <span className="font-bold text-emerald-400">Diizinkan (Toll Access Granted)</span>
                  </div>
                </div>
              </div>

              {/* Specific Route Restrictions List */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center justify-between">
                  <span>Daftar Pembatasan Spesifik</span>
                  <span className="text-xs text-rose-400 font-semibold">{selectedRoute.restrictions.length} Aturan</span>
                </h4>

                {selectedRoute.restrictions.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">Tidak ada pembatasan khusus pada rute ini.</p>
                ) : (
                  <div className="space-y-2 text-xs">
                    {selectedRoute.restrictions.map((res) => (
                      <div key={res.id} className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-rose-300">{res.name}</span>
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-950 text-rose-400 rounded border border-rose-800">
                            {res.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">{res.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 8-Step Create / Edit Route Wizard Modal */}
      <CreateRouteWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSaveRoute={handleSaveRouteFromWizard}
        initialRouteToEdit={routeToEdit}
      />
    </div>
  );
};
