/**
 * Fleet Intelligence Smart AI - Maintenance Module Master View
 * PROMPT 25 - Comprehensive Enterprise Predictive Maintenance System
 */

import React, { useState } from 'react';
import {
  Wrench,
  Activity,
  Calendar as CalendarIcon,
  BookOpen,
  FileText,
  Package,
  ClipboardCheck,
  DollarSign,
  History,
  BarChart2,
  Sparkles,
  Sliders,
  Building,
  Download,
  Plus,
  Truck,
  AlertTriangle
} from 'lucide-react';
import { OverviewTab } from './tabs/OverviewTab';
import { VehicleHealthTab } from './tabs/VehicleHealthTab';
import { ScheduleTab } from './tabs/ScheduleTab';
import { ServiceTab } from './tabs/ServiceTab';
import { WorkOrdersTab } from './tabs/WorkOrdersTab';
import { RepairsTab } from './tabs/RepairsTab';
import { PartsTab } from './tabs/PartsTab';
import { InspectionsTab } from './tabs/InspectionsTab';
import { CostTab } from './tabs/CostTab';
import { HistoryTab } from './tabs/HistoryTab';
import { AnalyticsTab } from './tabs/AnalyticsTab';
import { AIMaintenanceTab } from './tabs/AIMaintenanceTab';
import { RulesTab } from './tabs/RulesTab';
import { VendorsTab } from './tabs/VendorsTab';

import { VehicleHealthDetailModal } from './modals/VehicleHealthDetailModal';
import { WorkOrderDetailModal } from './modals/WorkOrderDetailModal';
import { CreateWorkOrderModal } from './modals/CreateWorkOrderModal';
import { MobileInspectionModal } from './modals/MobileInspectionModal';

import { MOCK_VEHICLE_HEALTH, MOCK_WORK_ORDERS } from '../data/mockMaintenanceData';
import { VehicleHealth, WorkOrder, WorkOrderStatus } from '../types';

export type MaintenanceTabKey =
  | 'overview'
  | 'health'
  | 'schedule'
  | 'service'
  | 'work_orders'
  | 'repairs'
  | 'parts'
  | 'inspections'
  | 'cost'
  | 'history'
  | 'analytics'
  | 'ai'
  | 'rules'
  | 'vendors';

const TAB_CONFIG: { key: MaintenanceTabKey; label: string; icon: React.FC<any>; badge?: string }[] = [
  { key: 'overview', label: 'Overview', icon: Activity },
  { key: 'health', label: 'Vehicle Health', icon: Truck, badge: '2 Critical' },
  { key: 'schedule', label: 'Jadwal Servis', icon: CalendarIcon, badge: 'Due 18' },
  { key: 'service', label: 'Template SOP', icon: BookOpen },
  { key: 'work_orders', label: 'Work Orders', icon: FileText, badge: '8 Aktif' },
  { key: 'repairs', label: 'Repairs & Root Cause', icon: Wrench },
  { key: 'parts', label: 'Spare Parts & Stok', icon: Package, badge: '2 Low' },
  { key: 'inspections', label: 'Driver Inspeksi', icon: ClipboardCheck },
  { key: 'cost', label: 'Biaya & Anggaran', icon: DollarSign },
  { key: 'history', label: 'Histori & Timeline', icon: History },
  { key: 'analytics', label: 'Analitik & SLA', icon: BarChart2 },
  { key: 'ai', label: 'AI Predictive Hub', icon: Sparkles, badge: 'AI Alert' },
  { key: 'rules', label: 'Aturan Pemicu', icon: Sliders },
  { key: 'vendors', label: 'Bengkel Mitra', icon: Building },
];

export const MaintenanceModuleView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MaintenanceTabKey>('overview');

  // Modals state
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleHealth | null>(null);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);

  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [isWorkOrderModalOpen, setIsWorkOrderModalOpen] = useState(false);

  const [isCreateWoModalOpen, setIsCreateWoModalOpen] = useState(false);
  const [createWoDefaultVehicle, setCreateWoDefaultVehicle] = useState<string | undefined>(undefined);

  const [isMobileInspectionModalOpen, setIsMobileInspectionModalOpen] = useState(false);

  // Handlers
  const handleSelectVehicle = (vehicleId: string) => {
    const veh = MOCK_VEHICLE_HEALTH.find((v) => v.vehicleId === vehicleId);
    if (veh) {
      setSelectedVehicle(veh);
      setIsVehicleModalOpen(true);
    }
  };

  const handleSelectWorkOrder = (workOrderId: string) => {
    const wo = MOCK_WORK_ORDERS.find((w) => w.id === workOrderId || w.number === workOrderId);
    if (wo) {
      setSelectedWorkOrder(wo);
      setIsWorkOrderModalOpen(true);
    }
  };

  const handleCreateWoForVehicle = (vehicleId: string) => {
    setCreateWoDefaultVehicle(vehicleId);
    setIsCreateWoModalOpen(true);
  };

  const handleExportReport = () => {
    alert('Mengunduh Laporan Komprehensif Pemeliharaan Armada (PDF/Excel) Agustus 2026...');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-slate-900/90 border border-slate-800/80 p-6 rounded-3xl shadow-2xl backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Wrench className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white">
                  Maintenance & Asset Health Management
                </h1>
                <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono">
                  PROMPT 25 READY
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Sistem Cerdas Pemeliharaan Prediktif, Work Orders, Inspeksi Driver & Kontrol Biaya Operasional Berbasis AI.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsMobileInspectionModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <ClipboardCheck className="h-4 w-4 text-cyan-400" />
            <span>Driver Pre-Trip</span>
          </button>

          <button
            onClick={handleExportReport}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <Download className="h-4 w-4" />
            <span>Ekspor Laporan</span>
          </button>

          <button
            onClick={() => setIsCreateWoModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-600/30 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Buat Work Order</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar (14 Tabs) */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-1.5 shadow-xl overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 min-w-max">
          {TAB_CONFIG.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                      isActive
                        ? 'bg-slate-950 text-cyan-300'
                        : tab.badge.includes('Critical') || tab.badge.includes('Due')
                        ? 'bg-rose-950 text-rose-300 border border-rose-800/40'
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
      </div>

      {/* Active Tab Component Render */}
      <div className="animate-in fade-in duration-150">
        {activeTab === 'overview' && (
          <OverviewTab
            onSelectVehicle={handleSelectVehicle}
            onSelectWorkOrder={handleSelectWorkOrder}
            onNavigateTab={(tab) => setActiveTab(tab as MaintenanceTabKey)}
          />
        )}
        {activeTab === 'health' && (
          <VehicleHealthTab onSelectVehicle={handleSelectVehicle} />
        )}
        {activeTab === 'schedule' && (
          <ScheduleTab
            onSelectVehicle={handleSelectVehicle}
            onCreateSchedule={() => setIsCreateWoModalOpen(true)}
          />
        )}
        {activeTab === 'service' && <ServiceTab />}
        {activeTab === 'work_orders' && (
          <WorkOrdersTab
            onSelectWorkOrder={handleSelectWorkOrder}
            onCreateWorkOrder={() => setIsCreateWoModalOpen(true)}
          />
        )}
        {activeTab === 'repairs' && <RepairsTab />}
        {activeTab === 'parts' && <PartsTab />}
        {activeTab === 'inspections' && (
          <InspectionsTab onOpenMobileInspection={() => setIsMobileInspectionModalOpen(true)} />
        )}
        {activeTab === 'cost' && <CostTab />}
        {activeTab === 'history' && <HistoryTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'ai' && <AIMaintenanceTab />}
        {activeTab === 'rules' && <RulesTab />}
        {activeTab === 'vendors' && <VendorsTab />}
      </div>

      {/* Modals */}
      <VehicleHealthDetailModal
        vehicle={selectedVehicle}
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        onOpenWorkOrder={handleCreateWoForVehicle}
      />

      <WorkOrderDetailModal
        workOrder={selectedWorkOrder}
        isOpen={isWorkOrderModalOpen}
        onClose={() => setIsWorkOrderModalOpen(false)}
        onStatusChange={(id, newStatus) => {
          if (selectedWorkOrder) {
            setSelectedWorkOrder({ ...selectedWorkOrder, status: newStatus });
          }
        }}
      />

      <CreateWorkOrderModal
        isOpen={isCreateWoModalOpen}
        onClose={() => setIsCreateWoModalOpen(false)}
        defaultVehicleId={createWoDefaultVehicle}
        onSubmit={(newWo) => {
          alert(`Work Order ${newWo.number} berhasil diterbitkan untuk ${newWo.vehiclePlate}!`);
        }}
      />

      <MobileInspectionModal
        isOpen={isMobileInspectionModalOpen}
        onClose={() => setIsMobileInspectionModalOpen(false)}
        onInspectionSubmitted={(res) => {
          alert(`Inspeksi harian armada ${res.vehiclePlate} (${res.result}) berhasil dikirimkan ke server.`);
        }}
      />
    </div>
  );
};
export default MaintenanceModuleView;
