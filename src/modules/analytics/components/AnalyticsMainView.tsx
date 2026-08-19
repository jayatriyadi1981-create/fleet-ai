/**
 * Fleet Intelligence Smart AI - Main Analytics View Router
 * PROMPT 36 - Fleet Analytics & Performance Intelligence Module Entry Point
 */

import React from 'react';
import { AnalyticsProvider, useAnalytics } from '../context/AnalyticsContext';
import { AnalyticsHeader } from './AnalyticsHeader';
import { AnalyticsFilterDrawer } from './AnalyticsFilterDrawer';
import { AnalyticsDashboardView } from './views/AnalyticsDashboardView';
import { FleetUtilizationView } from './views/FleetUtilizationView';
import { FleetProductivityView } from './views/FleetProductivityView';
import { MileageAnalyticsView } from './views/MileageAnalyticsView';
import { TripAnalyticsView } from './views/TripAnalyticsView';
import { IdleAnalyticsView } from './views/IdleAnalyticsView';
import { DowntimeAnalyticsView } from './views/DowntimeAnalyticsView';
import { VehicleRankingView } from './views/VehicleRankingView';
import { DriverPerformanceView } from './views/DriverPerformanceView';
import { BranchAnalyticsView } from './views/BranchAnalyticsView';
import { TrendAnalysisView } from './views/TrendAnalysisView';
import { AIInsightsView } from './views/AIInsightsView';
import { AnalyticsReportsView } from './views/AnalyticsReportsView';
import { CustomKpiModal } from './modals/CustomKpiModal';
import { WhatIfSimulationModal } from './modals/WhatIfSimulationModal';
import { AutomationTriggerModal } from './modals/AutomationTriggerModal';
import { useAuthorization } from '../../../hooks/useAuthorization';
import { ShieldAlert } from 'lucide-react';

const AnalyticsContent: React.FC = () => {
  const { activeTab } = useAnalytics();
  const { hasPermission } = useAuthorization();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AnalyticsDashboardView />;
      case 'fleet':
      case 'utilization':
        return <FleetUtilizationView />;
      case 'productivity':
        return <FleetProductivityView />;
      case 'mileage':
        return <MileageAnalyticsView />;
      case 'trips':
        return <TripAnalyticsView />;
      case 'idle':
        return <IdleAnalyticsView />;
      case 'downtime':
        return <DowntimeAnalyticsView />;
      case 'vehicles':
        return <VehicleRankingView />;
      case 'drivers':
        if (!hasPermission('analytics.view_driver')) {
          return (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-8 text-center space-y-3">
              <ShieldAlert className="h-8 w-8 text-rose-400 mx-auto" />
              <h3 className="text-base font-bold text-white">Akses Dibatasi (RBAC)</h3>
              <p className="text-xs text-slate-300">
                Anda tidak memiliki izin <code className="text-rose-300">analytics.view_driver</code> untuk melihat performa spesifik pengemudi.
              </p>
            </div>
          );
        }
        return <DriverPerformanceView />;
      case 'branches':
        if (!hasPermission('analytics.view_branch')) {
          return (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-8 text-center space-y-3">
              <ShieldAlert className="h-8 w-8 text-rose-400 mx-auto" />
              <h3 className="text-base font-bold text-white">Akses Dibatasi (RBAC)</h3>
              <p className="text-xs text-slate-300">
                Anda tidak memiliki izin <code className="text-rose-300">analytics.view_branch</code> untuk melihat analitik lintas cabang.
              </p>
            </div>
          );
        }
        return <BranchAnalyticsView />;
      case 'trends':
        return <TrendAnalysisView />;
      case 'ai-insights':
        if (!hasPermission('analytics.view_ai')) {
          return (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-8 text-center space-y-3">
              <ShieldAlert className="h-8 w-8 text-rose-400 mx-auto" />
              <h3 className="text-base font-bold text-white">Akses Dibatasi (RBAC)</h3>
              <p className="text-xs text-slate-300">
                Anda tidak memiliki izin <code className="text-rose-300">analytics.view_ai</code> untuk melihat rekomendasi dan anomali AI.
              </p>
            </div>
          );
        }
        return <AIInsightsView />;
      case 'reports':
        return <AnalyticsReportsView />;
      default:
        return <AnalyticsDashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Module Header */}
      <AnalyticsHeader />

      {/* Main Content Body */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        {renderActiveView()}
      </main>

      {/* Global Filter Drawer */}
      <AnalyticsFilterDrawer />

      {/* Modals */}
      <CustomKpiModal />
      <WhatIfSimulationModal />
      <AutomationTriggerModal />
    </div>
  );
};

export const AnalyticsMainView: React.FC = () => {
  return (
    <AnalyticsProvider>
      <AnalyticsContent />
    </AnalyticsProvider>
  );
};
