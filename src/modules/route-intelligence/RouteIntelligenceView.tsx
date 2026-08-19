/**
 * Fleet Intelligence Smart AI - Main Route Intelligence Module View
 * Unifies all 10 intelligence tabs, Live Telematics Map, AI Advisor,
 * Corridor Deviation Detection, Multi-Stop Optimization, and Cross-Module Insights.
 */

import React, { useState } from 'react';
import { 
  RouteIntelligenceTabKey, 
  ActiveTripRouteItem, 
  AIRouteRecommendation, 
  RouteFilterState,
  RouteDeviationEvent
} from './types';
import { routeIntelligenceService } from './engines/RouteIntelligenceService';

// Tabs
import { OverviewTab } from './components/tabs/OverviewTab';
import { ActiveTripsETATab } from './components/tabs/ActiveTripsETATab';
import { RouteOptimizationTab } from './components/tabs/RouteOptimizationTab';
import { TrafficIntelligenceTab } from './components/tabs/TrafficIntelligenceTab';
import { RouteDeviationTab } from './components/tabs/RouteDeviationTab';
import { HistoricalPerformanceTab } from './components/tabs/HistoricalPerformanceTab';
import { DeliveryRouteTab } from './components/tabs/DeliveryRouteTab';
import { CrossIntelligenceTab } from './components/tabs/CrossIntelligenceTab';
import { AIRouteAdvisorTab } from './components/tabs/AIRouteAdvisorTab';
import { RouteReportsTab } from './components/tabs/RouteReportsTab';

// Modals
import { ExplainRouteAIModal } from './components/modals/ExplainRouteAIModal';
import { RouteDetailModal } from './components/modals/RouteDetailModal';

// Icons
import { 
  Navigation, 
  MapPin, 
  Sparkles, 
  Activity, 
  AlertTriangle, 
  History, 
  PackageCheck, 
  Layers, 
  Bot, 
  FileText, 
  Clock, 
  ShieldAlert
} from 'lucide-react';

export const RouteIntelligenceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<RouteIntelligenceTabKey>('OVERVIEW');
  const [filter, setFilter] = useState<RouteFilterState>({
    search: '',
    branch: 'ALL',
    vehicleType: 'ALL',
    routeStatus: 'ALL',
    trafficStatus: 'ALL',
    etaRisk: 'ALL',
    deviationStatus: 'ALL',
    dateRange: 'TODAY',
  });

  // Modal States
  const [selectedTrip, setSelectedTrip] = useState<ActiveTripRouteItem | null>(null);
  const [selectedAIRecommendation, setSelectedAIRecommendation] = useState<AIRouteRecommendation | null>(null);

  // Service Data
  const kpis = routeIntelligenceService.getKPIs(filter);
  const activeTrips = routeIntelligenceService.getActiveTrips(filter);
  const trafficSegments = routeIntelligenceService.getTrafficSegments();
  const recommendations = routeIntelligenceService.getRecommendations();

  const navTabs: Array<{ key: RouteIntelligenceTabKey; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number | string }> = [
    { key: 'OVERVIEW', label: 'Ringkasan Eksekutif', icon: Navigation },
    { key: 'ACTIVE_TRIPS', label: 'Trip Aktif & ETA Live', icon: Clock, badge: activeTrips.length },
    { key: 'OPTIMIZATION', label: 'Optimasi Rute Multi-Objective', icon: Sparkles },
    { key: 'TRAFFIC', label: 'Traffic & Bottleneck', icon: Activity },
    { key: 'DEVIATIONS', label: 'Deteksi Deviasi Rute', icon: AlertTriangle, badge: kpis.activeDeviationsCount },
    { key: 'HISTORICAL', label: 'Kinerja Historis & Skor', icon: History },
    { key: 'DELIVERY_ROUTE', label: 'Rute Pengiriman Multi-Stop', icon: PackageCheck },
    { key: 'CROSS_INTELLIGENCE', label: 'Korelasi Lintas Modul', icon: Layers },
    { key: 'AI_ADVISOR', label: 'AI Route Advisor', icon: Bot, badge: 'AI' },
    { key: 'REPORTS', label: 'Laporan & Ekspor', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Module Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg">
            <Navigation className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Route Intelligence & Live ETA
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase tracking-wider">
                Engine v2.4 AI
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Optimasi rute armada cerdas, prediksi ETA dinamis, deteksi deviasi koridor, dan mitigasi kemacetan.
            </p>
          </div>
        </div>

        {/* Quick Summary Pill on Header */}
        <div className="flex items-center gap-2 bg-slate-900/90 px-4 py-2 rounded-2xl border border-slate-800 text-xs">
          <div className="flex items-center gap-2 pr-3 border-r border-slate-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-300 font-semibold">{kpis.activeTripsCount} Trip Terpantau</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Akurasi ETA:</span>
            <span className="text-emerald-400 font-mono font-bold">{kpis.averageEtaAccuracy}%</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation Pill Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800/80 no-scrollbar">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-black'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? 'bg-slate-950 text-cyan-300'
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

      {/* Active Tab Content Render */}
      <div className="transition-all duration-200">
        {activeTab === 'OVERVIEW' && (
          <OverviewTab
            kpis={kpis}
            activeTrips={activeTrips}
            trafficSegments={trafficSegments}
            recommendations={recommendations}
            onSelectTrip={(trip) => setSelectedTrip(trip)}
            onExplainAI={(rec) => setSelectedAIRecommendation(rec)}
            onNavigateTab={(tabKey) => setActiveTab(tabKey)}
          />
        )}

        {activeTab === 'ACTIVE_TRIPS' && (
          <ActiveTripsETATab
            trips={activeTrips}
            onSelectTrip={(trip) => setSelectedTrip(trip)}
          />
        )}

        {activeTab === 'OPTIMIZATION' && <RouteOptimizationTab />}

        {activeTab === 'TRAFFIC' && <TrafficIntelligenceTab />}

        {activeTab === 'DEVIATIONS' && <RouteDeviationTab />}

        {activeTab === 'HISTORICAL' && <HistoricalPerformanceTab />}

        {activeTab === 'DELIVERY_ROUTE' && <DeliveryRouteTab />}

        {activeTab === 'CROSS_INTELLIGENCE' && <CrossIntelligenceTab />}

        {activeTab === 'AI_ADVISOR' && (
          <AIRouteAdvisorTab
            onExplainAI={(rec) => setSelectedAIRecommendation(rec)}
          />
        )}

        {activeTab === 'REPORTS' && <RouteReportsTab />}
      </div>

      {/* Modals */}
      <RouteDetailModal
        trip={selectedTrip}
        onClose={() => setSelectedTrip(null)}
      />

      <ExplainRouteAIModal
        recommendation={selectedAIRecommendation}
        onClose={() => setSelectedAIRecommendation(null)}
        onApprove={(id) => {
          routeIntelligenceService.getRecommendations().find((r) => r.id === id)!.status = 'APPROVED';
        }}
      />
    </div>
  );
};
