/**
 * Fleet Intelligence Smart AI - Cost Analytics & Financial Intelligence Main Module
 * PROMPT 37 - Comprehensive Cost Analytics, TOC/TCO, Allocation, AI Forecast & Audit
 */

import React from 'react';
import { CostProvider, useCost } from './context/CostContext';
import { CostHeader } from './components/CostHeader';
import { CostTabBar } from './components/CostTabBar';

// Views
import { CostDashboardView } from './components/views/CostDashboardView';
import { FuelCostView } from './components/views/FuelCostView';
import { MaintenanceCostView } from './components/views/MaintenanceCostView';
import { DriverCostView } from './components/views/DriverCostView';
import { CostPerKmView } from './components/views/CostPerKmView';
import { CostPerTripView } from './components/views/CostPerTripView';
import { OperatingCostTOCView } from './components/views/OperatingCostTOCView';
import { VehicleCostTCOView } from './components/views/VehicleCostTCOView';
import { BranchCostView } from './components/views/BranchCostView';
import { RouteCostView } from './components/views/RouteCostView';
import { CostTrendsBudgetView } from './components/views/CostTrendsBudgetView';
import { CostAllocationView } from './components/views/CostAllocationView';
import { CostForecastView } from './components/views/CostForecastView';
import { AICostIntelligenceView } from './components/views/AICostIntelligenceView';
import { CostAuditReconciliationView } from './components/views/CostAuditReconciliationView';

// Modals
import { AddCostModal } from './components/modals/AddCostModal';
import { ApprovalModal } from './components/modals/ApprovalModal';
import { CostFilterDrawer } from './components/modals/CostFilterDrawer';
import { SavingCalculatorModal } from './components/modals/SavingCalculatorModal';
import { ReconciliationModal } from './components/modals/ReconciliationModal';
import { AllocationModal } from './components/modals/AllocationModal';

const CostModuleContent: React.FC = () => {
  const { activeTab } = useCost();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <CostDashboardView />;
      case 'fuel':
        return <FuelCostView />;
      case 'maintenance':
        return <MaintenanceCostView />;
      case 'driver':
        return <DriverCostView />;
      case 'per_km':
        return <CostPerKmView />;
      case 'per_trip':
        return <CostPerTripView />;
      case 'operating':
        return <OperatingCostTOCView />;
      case 'vehicles':
        return <VehicleCostTCOView />;
      case 'branches':
        return <BranchCostView />;
      case 'routes':
        return <RouteCostView />;
      case 'trends':
        return <CostTrendsBudgetView />;
      case 'allocation':
        return <CostAllocationView />;
      case 'forecast':
        return <CostForecastView />;
      case 'ai_insights':
        return <AICostIntelligenceView />;
      case 'reports':
        return <CostAuditReconciliationView />;
      default:
        return <CostDashboardView />;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* Module Header */}
      <CostHeader />

      {/* 15 Sub-tab Horizontal Scroll Bar */}
      <CostTabBar />

      {/* Active Tab View */}
      <main className="flex-1 pb-16">
        {renderActiveView()}
      </main>

      {/* Global Modals & Drawers */}
      <AddCostModal />
      <ApprovalModal />
      <CostFilterDrawer />
      <SavingCalculatorModal />
      <ReconciliationModal />
      <AllocationModal />
    </div>
  );
};

export const CostModule: React.FC = () => {
  return (
    <CostProvider>
      <CostModuleContent />
    </CostProvider>
  );
};

export default CostModule;
