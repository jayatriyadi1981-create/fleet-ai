/**
 * Fleet Intelligence Smart AI - Construction & Heavy Equipment Management Suite
 * Enterprise-grade Heavy Equipment, Mining Fleet & Construction Projects
 */

import React, { useState } from 'react';
import { HeavyEquipmentTabId } from '../../modules/heavy-equipment/types';
import { heavyEquipmentService } from '../../modules/heavy-equipment/services/heavyEquipmentService';

// Tab components
import { HeavyControlTowerTab } from '../heavy-equipment/tabs/HeavyControlTowerTab';
import { HeavyAssetsTab } from '../heavy-equipment/tabs/HeavyAssetsTab';
import { HeavyProjectsTab } from '../heavy-equipment/tabs/HeavyProjectsTab';
import { HeavyAssignmentsTab } from '../heavy-equipment/tabs/HeavyAssignmentsTab';
import { HeavyTimesheetsTab } from '../heavy-equipment/tabs/HeavyTimesheetsTab';
import { HeavyP2hInspectionTab } from '../heavy-equipment/tabs/HeavyP2hInspectionTab';
import { HeavyFuelBowserTab } from '../heavy-equipment/tabs/HeavyFuelBowserTab';
import { HeavyMaintenancePsTab } from '../heavy-equipment/tabs/HeavyMaintenancePsTab';
import { HeavyBreakdownsTab } from '../heavy-equipment/tabs/HeavyBreakdownsTab';
import { HeavySafetySioTab } from '../heavy-equipment/tabs/HeavySafetySioTab';
import { HeavyRentalBillingTab } from '../heavy-equipment/tabs/HeavyRentalBillingTab';
import { HeavyTransportTab } from '../heavy-equipment/tabs/HeavyTransportTab';
import { HeavyProductivityCostTab } from '../heavy-equipment/tabs/HeavyProductivityCostTab';
import { HeavyAiCopilotTab } from '../heavy-equipment/tabs/HeavyAiCopilotTab';
import { HeavyMobileOperatorTab } from '../heavy-equipment/tabs/HeavyMobileOperatorTab';
import { HeavyReportsTab } from '../heavy-equipment/tabs/HeavyReportsTab';

import { 
  Target, 
  Truck, 
  Layers, 
  Briefcase,
  Clock, 
  ShieldCheck, 
  Fuel, 
  Wrench, 
  AlertTriangle,
  HardHat, 
  DollarSign, 
  Navigation,
  TrendingUp,
  Sparkles, 
  Smartphone,
  FileSpreadsheet 
} from 'lucide-react';

interface Props {
  initialTab?: HeavyEquipmentTabId;
}

export const HeavyEquipmentManagementView: React.FC<Props> = ({ initialTab = 'control-tower' }) => {
  const [activeTab, setActiveTab] = useState<HeavyEquipmentTabId>(initialTab);
  const [equipments, setEquipments] = useState(heavyEquipmentService.getEquipments());
  const [projects, setProjects] = useState(heavyEquipmentService.getProjects());
  const [sites, setSites] = useState(heavyEquipmentService.getSites());
  const [assignments, setAssignments] = useState(heavyEquipmentService.getAssignments());
  const [timesheets, setTimesheets] = useState(heavyEquipmentService.getTimesheets());
  const [p2hList, setP2hList] = useState(heavyEquipmentService.getP2HInspections());
  const [fuelLogs, setFuelLogs] = useState(heavyEquipmentService.getFuelLogs());
  const [schedules, setSchedules] = useState(heavyEquipmentService.getMaintenanceSchedules());
  const [breakdowns, setBreakdowns] = useState(heavyEquipmentService.getBreakdowns());
  const [operators, setOperators] = useState(heavyEquipmentService.getOperators());
  const [billings, setBillings] = useState(heavyEquipmentService.getRentalBillings());
  const [transports, setTransports] = useState(heavyEquipmentService.getTransportRequests());
  const [productivityMetrics, setProductivityMetrics] = useState(heavyEquipmentService.getProductivityMetrics());

  const refreshAllState = () => {
    setEquipments(heavyEquipmentService.getEquipments());
    setProjects(heavyEquipmentService.getProjects());
    setSites(heavyEquipmentService.getSites());
    setAssignments(heavyEquipmentService.getAssignments());
    setTimesheets(heavyEquipmentService.getTimesheets());
    setP2hList(heavyEquipmentService.getP2HInspections());
    setFuelLogs(heavyEquipmentService.getFuelLogs());
    setSchedules(heavyEquipmentService.getMaintenanceSchedules());
    setBreakdowns(heavyEquipmentService.getBreakdowns());
    setOperators(heavyEquipmentService.getOperators());
    setBillings(heavyEquipmentService.getRentalBillings());
    setTransports(heavyEquipmentService.getTransportRequests());
    setProductivityMetrics(heavyEquipmentService.getProductivityMetrics());
  };

  const handleAddEquipment = (eqData: any) => {
    heavyEquipmentService.addEquipment(eqData);
    refreshAllState();
  };

  const handleAssignEquipment = (asgData: any) => {
    const res = heavyEquipmentService.assignEquipment(asgData);
    refreshAllState();
    return res;
  };

  const handleSubmitTimesheet = (tsData: any) => {
    const res = heavyEquipmentService.submitTimesheet(tsData);
    refreshAllState();
    return res;
  };

  const handleSubmitP2H = (p2hData: any) => {
    const res = heavyEquipmentService.submitP2H(p2hData);
    refreshAllState();
    return res;
  };

  const handleAddFuelLog = (flData: any) => {
    const res = heavyEquipmentService.addFuelLog(flData);
    refreshAllState();
    return res;
  };

  const handleReportBreakdown = (bdData: any) => {
    const res = heavyEquipmentService.reportBreakdown(bdData);
    refreshAllState();
    return res;
  };

  const handleUpdateBreakdownStatus = (id: string, status: any, testPassed?: boolean) => {
    const res = heavyEquipmentService.updateBreakdownStatus(id, status, testPassed);
    refreshAllState();
    return res;
  };

  const handleRequestTransport = (trData: any) => {
    const res = heavyEquipmentService.requestTransport(trData);
    refreshAllState();
    return res;
  };

  const navTabs = [
    { id: 'control-tower', label: 'Menara Kendali', icon: Target },
    { id: 'equipment-assets', label: 'Master Alat & SILO', icon: Truck },
    { id: 'projects-sites', label: 'Job Sites & Proyek', icon: Layers },
    { id: 'assignments', label: 'Alokasi Penugasan', icon: Briefcase },
    { id: 'timesheets-hm', label: 'Timesheet & HM', icon: Clock },
    { id: 'p2h-inspection', label: 'P2H K3 Harian', icon: ShieldCheck },
    { id: 'fuel-bowser', label: 'BBM Fuel Bowser', icon: Fuel },
    { id: 'maintenance-ps', label: 'Servis PS & WO', icon: Wrench },
    { id: 'breakdowns', label: 'Alur Breakdown', icon: AlertTriangle },
    { id: 'safety-sio', label: 'K3 & SIO Operator', icon: HardHat },
    { id: 'rental-billing', label: 'Faktur Rental', icon: DollarSign },
    { id: 'transport-lowbed', label: 'Mobilisasi Lowbed', icon: Navigation },
    { id: 'productivity-cost', label: 'Produktivitas & P&L', icon: TrendingUp },
    { id: 'ai-copilot', label: 'AI Heavy Copilot', icon: Sparkles },
    { id: 'mobile-operator', label: 'Simulator Mobile App', icon: Smartphone },
    { id: 'reports', label: 'Pusat Laporan', icon: FileSpreadsheet },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-500 text-slate-950 shadow-md">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Sistem Manajemen Konstruksi & Alat Berat
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Heavy Equipment & Mining Fleet Operations • Telematika Mesin • HM & Timesheet • BBM Bowser • K3 Tambang
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800/60 text-amber-900 dark:text-amber-300 text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            {equipments.filter(e => e.status === 'WORKING' || e.status === 'OPERATING').length} Alat Bekerja Aktif
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800 text-xs">
        {navTabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as HeavyEquipmentTabId)}
              className={`px-3.5 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-500'}`} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Active Tab Body */}
      <div className="pt-2">
        {activeTab === 'control-tower' && (
          <HeavyControlTowerTab
            equipments={equipments}
            projects={projects}
            timesheets={timesheets}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'equipment-assets' && (
          <HeavyAssetsTab
            equipments={equipments}
            onAddEquipment={handleAddEquipment}
          />
        )}

        {activeTab === 'projects-sites' && (
          <HeavyProjectsTab
            projects={projects}
          />
        )}

        {activeTab === 'assignments' && (
          <HeavyAssignmentsTab
            assignments={assignments}
            equipments={equipments}
            projects={projects}
            sites={sites}
            operators={operators}
            onAssign={handleAssignEquipment}
          />
        )}

        {activeTab === 'timesheets-hm' && (
          <HeavyTimesheetsTab
            timesheets={timesheets}
            equipments={equipments}
            projects={projects}
            onSubmitTimesheet={handleSubmitTimesheet}
          />
        )}

        {activeTab === 'p2h-inspection' && (
          <HeavyP2hInspectionTab
            p2hList={p2hList}
            equipments={equipments}
            onSubmitP2h={handleSubmitP2H}
          />
        )}

        {activeTab === 'fuel-bowser' && (
          <HeavyFuelBowserTab
            fuelLogs={fuelLogs}
            equipments={equipments}
            projects={projects}
            onAddFuelLog={handleAddFuelLog}
          />
        )}

        {activeTab === 'maintenance-ps' && (
          <HeavyMaintenancePsTab
            schedules={schedules}
            equipments={equipments}
          />
        )}

        {activeTab === 'breakdowns' && (
          <HeavyBreakdownsTab
            breakdowns={breakdowns}
            equipments={equipments}
            projects={projects}
            operators={operators}
            onReportBreakdown={handleReportBreakdown}
            onUpdateStatus={handleUpdateBreakdownStatus}
          />
        )}

        {activeTab === 'safety-sio' && (
          <HeavySafetySioTab
            operators={operators}
            equipments={equipments}
          />
        )}

        {activeTab === 'rental-billing' && (
          <HeavyRentalBillingTab
            billings={billings}
          />
        )}

        {activeTab === 'transport-lowbed' && (
          <HeavyTransportTab
            transportRequests={transports}
            equipments={equipments}
            sites={sites}
            onRequestTransport={handleRequestTransport}
          />
        )}

        {activeTab === 'productivity-cost' && (
          <HeavyProductivityCostTab
            productivityMetrics={productivityMetrics}
            equipments={equipments}
            projects={projects}
            rentalBillings={billings}
          />
        )}

        {activeTab === 'ai-copilot' && (
          <HeavyAiCopilotTab />
        )}

        {activeTab === 'mobile-operator' && (
          <HeavyMobileOperatorTab
            equipments={equipments}
            operators={operators}
            projects={projects}
            onSubmitP2H={handleSubmitP2H}
            onSubmitTimesheet={handleSubmitTimesheet}
            onAddFuelLog={handleAddFuelLog}
            onReportBreakdown={handleReportBreakdown}
          />
        )}

        {activeTab === 'reports' && (
          <HeavyReportsTab
            equipments={equipments}
            projects={projects}
            timesheets={timesheets}
          />
        )}
      </div>
    </div>
  );
};
