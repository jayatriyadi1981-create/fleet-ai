/**
 * Fleet Intelligence Smart AI - Smart Dashboard Master Page
 * PROMPT 8 - Central Operational Command & AI Operations Center
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useFleet } from '../../context/FleetContext';
import { useAuthorization } from '../../hooks/useAuthorization';
import { dashboardService } from '../../services/dashboardService';
import { DashboardFilterState, FleetKPIs, VehicleStatusSummary, MapPreviewVehicle, AlertKPISummary, DashboardAlertItem, DriverScoreSummary, FuelSummary, MaintenanceHealthSummary, TripSummary, DashboardAIInsight } from '../../types/dashboard';

import { DashboardHeader } from './DashboardHeader';
import { GlobalKpiSection } from './GlobalKpiSection';
import { VehicleStatusWidget } from './VehicleStatusWidget';
import { LiveMapWidget } from './LiveMapWidget';
import { AlertCenterWidget } from './AlertCenterWidget';
import { DriverSafetyWidget } from './DriverSafetyWidget';
import { FuelPerformanceWidget } from './FuelPerformanceWidget';
import { MaintenanceHealthWidget } from './MaintenanceHealthWidget';
import { TripPerformanceWidget } from './TripPerformanceWidget';
import { AIFleetInsightsWidget } from './AIFleetInsightsWidget';
import { FleetDailyBriefingBanner } from '../../modules/ai/components/FleetDailyBriefingBanner';
import { aiService } from '../../services/ai/AIService';
import { DailyBriefing } from '../../types/ai';
import { Alert } from '../ui/Alert';
import { AlertTriangle, RefreshCw, Sparkles, Navigation } from 'lucide-react';

export const SmartDashboardView: React.FC = () => {
  const { 
    setActiveView, 
    setStatusFilter, 
    setSelectedVehicle, 
    vehicles, 
    selectedBranchId,
    setIsAiDrawerOpen,
    currentUser
  } = useFleet();

  const { can, userRole } = useAuthorization();

  // Filter State
  const [filterState, setFilterState] = useState<DashboardFilterState>({
    dateRange: 'today',
    fleetGroup: 'all',
    branchId: selectedBranchId || 'all',
    tenantId: currentUser?.tenantId || 'tenant-tln-01',
  });

  // Keep branch filter in sync if global header branch selector changes
  useEffect(() => {
    if (selectedBranchId) {
      setFilterState((prev) => ({ ...prev, branchId: selectedBranchId }));
    }
  }, [selectedBranchId]);

  // Data States
  const [kpis, setKpis] = useState<FleetKPIs | null>(null);
  const [vehicleStatus, setVehicleStatus] = useState<VehicleStatusSummary | null>(null);
  const [mapVehicles, setMapVehicles] = useState<MapPreviewVehicle[]>([]);
  const [alertsData, setAlertsData] = useState<{ kpi: AlertKPISummary; recentAlerts: DashboardAlertItem[] } | null>(null);
  const [driverScores, setDriverScores] = useState<DriverScoreSummary | null>(null);
  const [fuelData, setFuelData] = useState<FuelSummary | null>(null);
  const [maintenanceData, setMaintenanceData] = useState<MaintenanceHealthSummary | null>(null);
  const [tripData, setTripData] = useState<TripSummary | null>(null);
  const [aiInsights, setAiInsights] = useState<DashboardAIInsight[] | null>(null);
  const [dailyBriefing, setDailyBriefing] = useState<DailyBriefing | null>(null);

  // Loading & Error States
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Data Loading Function
  const loadDashboardData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const [
        kpiRes,
        statusRes,
        mapRes,
        alertsRes,
        driverRes,
        fuelRes,
        maintRes,
        tripRes,
        aiRes
      ] = await Promise.all([
        dashboardService.getFleetKPIs(filterState),
        dashboardService.getVehicleStatusSummary(filterState),
        dashboardService.getLiveMapPreview(filterState),
        dashboardService.getAlertsSummary(filterState),
        dashboardService.getDriverScores(filterState),
        dashboardService.getFuelSummary(filterState),
        dashboardService.getMaintenanceSummary(filterState),
        dashboardService.getTripSummary(filterState),
        dashboardService.getAIInsights(filterState),
      ]);

      setKpis(kpiRes);
      setVehicleStatus(statusRes);
      setMapVehicles(mapRes);
      setAlertsData(alertsRes);
      setDriverScores(driverRes);
      setFuelData(fuelRes);
      setMaintenanceData(maintRes);
      setTripData(tripRes);
      setAiInsights(aiRes);
      setDailyBriefing(aiService.summarize({ vehicles, alerts: alertsRes?.recentAlerts }));
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError('Gagal memuat data dashboard operasional. Silakan periksa koneksi atau coba lagi.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [filterState]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Filter Handler
  const handleFilterChange = (update: Partial<DashboardFilterState>) => {
    setFilterState((prev) => ({ ...prev, ...update }));
  };

  // Drill Down Handlers
  const handleStatusDrillDown = (status: string) => {
    setStatusFilter(status);
    setActiveView('vehicles');
  };

  const handleOpenAlerts = (severityFilter?: string) => {
    setActiveView('alerts');
  };

  const handleOpenDrivers = () => {
    setActiveView('drivers');
  };

  const handleOpenDriverProfile = (driverId: string) => {
    setActiveView('drivers');
  };

  const handleOpenFuel = () => {
    setActiveView('fuel');
  };

  const handleOpenMaintenance = () => {
    setActiveView('maintenance');
  };

  const handleOpenTrips = () => {
    setActiveView('trips');
  };

  const handleOpenLiveMap = () => {
    setActiveView('live_tracking');
  };

  const handleOpenAiAssistant = (query?: string) => {
    setIsAiDrawerOpen(true);
  };

  const handleExecuteAiAction = (route: string) => {
    if (route.startsWith('/app/fuel')) setActiveView('fuel');
    else if (route.startsWith('/app/drivers')) setActiveView('drivers');
    else if (route.startsWith('/app/maintenance')) setActiveView('maintenance');
    else if (route.startsWith('/app/settings')) setActiveView('settings');
    else setActiveView('dashboard');
  };

  // Permission Checks for Role-Aware Visibility
  const canViewVehicles = can('vehicle.view');
  const canViewDrivers = can('driver.view');
  const canViewTrips = can('trip.view');
  const canViewFuel = can('fuel.view');
  const canViewMaintenance = can('maintenance.view');
  const canViewSafety = can('safety.view');
  const canViewAlerts = can('alert.view');
  const canViewAI = can('ai.view');

  const formatLastUpdatedText = () => {
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(lastUpdated);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header with Greeting, Time Period & Filters */}
      <DashboardHeader
        filterState={filterState}
        onFilterChange={handleFilterChange}
        onRefresh={() => loadDashboardData(true)}
        isRefreshing={isRefreshing}
        lastUpdatedText={formatLastUpdatedText()}
      />

      {/* Global Error Banner */}
      {error && (
        <Alert type="danger" title="Kesalahan Data Dashboard">
          <div className="flex items-center justify-between gap-4 mt-1">
            <span>{error}</span>
            <button
              onClick={() => loadDashboardData()}
              className="flex items-center gap-1 rounded bg-rose-500 px-3 py-1 font-bold text-slate-950 hover:bg-rose-400 transition-colors shrink-0"
            >
              <RefreshCw className="h-3 w-3" /> Retry
            </button>
          </div>
        </Alert>
      )}

      {/* AI Daily Briefing Banner (Situational Awareness & Priority Action Queue) */}
      {canViewAI && dailyBriefing && (
        <FleetDailyBriefingBanner
          briefing={dailyBriefing}
          onActionClick={(priority) => {
            if (priority.module === 'SAFETY' || priority.module === 'DRIVER') {
              setActiveView('safety');
            } else if (priority.module === 'MAINTENANCE' || priority.module === 'INSPECTION') {
              setActiveView('maintenance');
            } else if (priority.module === 'FUEL') {
              setActiveView('fuel');
            } else {
              setIsAiDrawerOpen(true);
            }
          }}
        />
      )}

      {/* 2. Global & Fleet KPIs Row */}
      {canViewVehicles && (
        <GlobalKpiSection
          kpis={kpis}
          isLoading={isLoading}
          onStatusClick={handleStatusDrillDown}
        />
      )}

      {/* 3. Live Map & Vehicle Status Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live Map Preview (7 cols on desktop) */}
        {canViewVehicles && (
          <div className="lg:col-span-7">
            <LiveMapWidget
              vehicles={mapVehicles}
              isLoading={isLoading}
              onOpenFullMap={handleOpenLiveMap}
              onSelectVehicle={(id) => {
                const found = vehicles.find((v) => v.id === id);
                if (found) setSelectedVehicle(found);
              }}
            />
          </div>
        )}

        {/* Vehicle Status Distribution (5 cols on desktop) */}
        {canViewVehicles && (
          <div className="lg:col-span-5">
            <VehicleStatusWidget
              summary={vehicleStatus}
              isLoading={isLoading}
              onStatusSelect={handleStatusDrillDown}
            />
          </div>
        )}
      </div>

      {/* 4. Active Alert Center & Driver Safety Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {canViewAlerts && (
          <div className="lg:col-span-6">
            <AlertCenterWidget
              summary={alertsData}
              isLoading={isLoading}
              onOpenAlerts={handleOpenAlerts}
            />
          </div>
        )}

        {canViewSafety && (
          <div className="lg:col-span-6">
            <DriverSafetyWidget
              summary={driverScores}
              isLoading={isLoading}
              onOpenDriverProfile={handleOpenDriverProfile}
              onOpenDriversList={handleOpenDrivers}
            />
          </div>
        )}
      </div>

      {/* 5. Fuel Performance & Maintenance Health Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {canViewFuel && (
          <div className="lg:col-span-6">
            <FuelPerformanceWidget
              summary={fuelData}
              isLoading={isLoading}
              onOpenFuelPage={handleOpenFuel}
              onInvestigateAnomaly={(vehId) => {
                setActiveView('fuel');
              }}
            />
          </div>
        )}

        {canViewMaintenance && (
          <div className="lg:col-span-6">
            <MaintenanceHealthWidget
              summary={maintenanceData}
              isLoading={isLoading}
              onOpenMaintenancePage={handleOpenMaintenance}
            />
          </div>
        )}
      </div>

      {/* 6. AI Fleet Intelligence & Explainability Banner */}
      {canViewAI && (
        <AIFleetInsightsWidget
          insights={aiInsights}
          isLoading={isLoading}
          onExecuteAction={handleExecuteAiAction}
          onOpenAiAssistant={handleOpenAiAssistant}
        />
      )}

      {/* 7. Trip & Operational Performance Row */}
      {canViewTrips && (
        <TripPerformanceWidget
          summary={tripData}
          isLoading={isLoading}
          onOpenTripsPage={handleOpenTrips}
        />
      )}
    </div>
  );
};
