/**
 * Fleet Intelligence Smart AI - Fatigue Management & Driver Fatigue Intelligence
 * PROMPT 23 - Main Module Container & Routing Architecture
 */

import React, { useState } from 'react';
import { 
  Activity, 
  Users, 
  Clock, 
  BedDouble, 
  Calendar, 
  Moon, 
  Bell, 
  History, 
  BarChart3, 
  Sparkles, 
  Sliders,
  Filter,
  RefreshCw,
  HeartPulse,
  UserCheck
} from 'lucide-react';
import { useFleet } from '../../../context/FleetContext';
import { 
  DriverFatigueProfile, 
  FatigueAlert, 
  Shift, 
  FatigueRule, 
  FatigueOverviewKPIs,
  FatigueSelfReportLevel
} from '../types';
import { 
  mockFatigueProfiles, 
  mockFatigueAlerts, 
  mockShifts, 
  mockFatigueRules, 
  mockOverviewKPIs 
} from '../data/mockFatigueData';

import { OverviewTab } from './tabs/OverviewTab';
import { DriverFatigueTab } from './tabs/DriverFatigueTab';
import { DrivingHoursTab } from './tabs/DrivingHoursTab';
import { RestManagementTab } from './tabs/RestManagementTab';
import { ShiftManagementTab } from './tabs/ShiftManagementTab';
import { NightDrivingTab } from './tabs/NightDrivingTab';
import { FatigueAlertsTab } from './tabs/FatigueAlertsTab';
import { FatigueHistoryTab } from './tabs/FatigueHistoryTab';
import { FatigueAnalyticsTab } from './tabs/FatigueAnalyticsTab';
import { AIFatigueInsightsTab } from './tabs/AIFatigueInsightsTab';
import { FatigueRulesTab } from './tabs/FatigueRulesTab';

import { DriverFatigueDetailModal } from './modals/DriverFatigueDetailModal';
import { SelfReportModal } from './modals/SelfReportModal';
import { AcknowledgeAlertModal } from './modals/AcknowledgeAlertModal';
import { AddShiftModal } from './modals/AddShiftModal';
import { RuleEditModal } from './modals/RuleEditModal';
import { RestSessionModal } from './modals/RestSessionModal';

export type FatigueTabId =
  | 'overview'
  | 'drivers'
  | 'driving-hours'
  | 'rest'
  | 'shifts'
  | 'night-driving'
  | 'alerts'
  | 'history'
  | 'analytics'
  | 'ai-insights'
  | 'rules';

export const FatigueView: React.FC = () => {
  const { userRoleMode, branches } = useFleet();

  const [activeTab, setActiveTab] = useState<FatigueTabId>('overview');

  // Datasets
  const [profiles, setProfiles] = useState<DriverFatigueProfile[]>(mockFatigueProfiles);
  const [alerts, setAlerts] = useState<FatigueAlert[]>(mockFatigueAlerts);
  const [shifts, setShifts] = useState<Shift[]>(mockShifts);
  const [rules, setRules] = useState<FatigueRule[]>(mockFatigueRules);
  const [kpis] = useState<FatigueOverviewKPIs>(mockOverviewKPIs);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [selectedBranch, setSelectedBranch] = useState('all');

  // Modals State
  const [selectedDriverProfile, setSelectedDriverProfile] = useState<DriverFatigueProfile | null>(null);
  const [isDriverDetailModalOpen, setIsDriverDetailModalOpen] = useState(false);

  const [isSelfReportModalOpen, setIsSelfReportModalOpen] = useState(false);

  const [selectedAlertForAck, setSelectedAlertForAck] = useState<FatigueAlert | null>(null);
  const [isAcknowledgeModalOpen, setIsAcknowledgeModalOpen] = useState(false);

  const [isAddShiftModalOpen, setIsAddShiftModalOpen] = useState(false);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [isRestModalOpen, setIsRestModalOpen] = useState(false);

  // Modal handlers
  const handleOpenDriverModal = (profile: DriverFatigueProfile) => {
    setSelectedDriverProfile(profile);
    setIsDriverDetailModalOpen(true);
  };

  const handleOpenAcknowledgeAlert = (alert: FatigueAlert) => {
    setSelectedAlertForAck(alert);
    setIsAcknowledgeModalOpen(true);
  };

  const handleConfirmAcknowledge = (alertId: string, actionTaken: string, notes: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              acknowledged: true,
              acknowledgedBy: 'Current User (Supervisor)',
              acknowledgedAt: new Date().toISOString(),
              actionTaken: `${actionTaken} - ${notes}`,
            }
          : a
      )
    );
  };

  const handleSubmitSelfReport = (level: FatigueSelfReportLevel, note: string) => {
    if (level === 'Need Assistance') {
      const newAlert: FatigueAlert = {
        id: `fa-${Date.now()}`,
        tenantId: 'tenant-1',
        driverId: 'drv-001',
        driverName: 'Budi Santoso',
        vehiclePlate: 'B 9876 XYZ',
        severity: 'CRITICAL',
        ruleType: 'FATIGUE_CRITICAL',
        title: 'Laporan Self-Report Fatigue Kritis (Need Assistance)',
        message: `Driver melaporkan penurunan kondisi fisik & konsentrasi: "${note || 'Butuh bantuan/rehat langsung'}"`,
        drivingHours: 5.8,
        lastRestHours: 5.5,
        shiftName: 'Shift Malam',
        nightHours: 3.8,
        currentLocation: 'Rest Area Pejagan KM 228',
        triggeredAt: new Date().toISOString(),
        acknowledged: false,
        triggerExplanation: ['Laporan Mandiri Driver App memilih status "Need Assistance".'],
      };
      setAlerts((prev) => [newAlert, ...prev]);
    }
  };

  const handleSaveShift = (newShift: Partial<Shift>) => {
    if (newShift.id) {
      setShifts((prev) => [...prev, newShift as Shift]);
    }
  };

  const handleSaveRule = (updatedRule: FatigueRule) => {
    setRules((prev) => prev.map((r) => (r.id === updatedRule.id ? updatedRule : r)));
  };

  const handleSaveRestSession = (session: any) => {
    // Add rest session log
  };

  const navTabs: { id: FatigueTabId; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'drivers', label: 'Driver Fatigue', icon: Users },
    { id: 'driving-hours', label: 'Driving Hours', icon: Clock },
    { id: 'rest', label: 'Rest Management', icon: BedDouble },
    { id: 'shifts', label: 'Shift Management', icon: Calendar },
    { id: 'night-driving', label: 'Night Driving', icon: Moon },
    { id: 'alerts', label: 'Fatigue Alerts', icon: Bell },
    { id: 'history', label: 'Fatigue History', icon: History },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'ai-insights', label: 'AI Fatigue Insights', icon: Sparkles },
    { id: 'rules', label: 'Fatigue Rules', icon: Sliders },
  ];

  return (
    <div className="space-y-6">
      {/* Module Title Header & Global Filter */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white tracking-tight">FATIGUE MANAGEMENT</h1>
                <span className="px-2.5 py-0.5 text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full">
                  SMART AI RISK ENGINE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pemantauan risiko kelelahan pengemudi berdasarkan data operasional jam mengemudi, istirahat, shift, & telematika.
              </p>
            </div>
          </div>
        </div>

        {/* Global Filter Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cabang:</span>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none"
            >
              <option value="all">Semua Cabang (All)</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsSelfReportModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-rose-600/20"
          >
            <HeartPulse className="w-4 h-4" />
            Report Fatigue Risk
          </button>
        </div>
      </div>

      {/* Driver Mobile View Mode Switch Notification */}
      {userRoleMode === 'driver' && (
        <div className="p-4 bg-cyan-950/30 border border-cyan-800/50 rounded-2xl flex items-center justify-between text-xs text-cyan-300">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-cyan-400" />
            <span>Mode Tampilan Driver Aktif: Menampilkan statistik mandiri "My Fatigue Risk & Shifts".</span>
          </div>
          <button
            onClick={() => setIsSelfReportModalOpen(true)}
            className="px-3 py-1 bg-cyan-600 text-white rounded-lg font-bold"
          >
            Report Risk Sekarang
          </button>
        </div>
      )}

      {/* 11 Sub-Tab Navigation Bar */}
      <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl overflow-x-auto scrollbar-none">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab View Rendering */}
      <div>
        {activeTab === 'overview' && (
          <OverviewTab
            kpis={kpis}
            profiles={profiles}
            alerts={alerts}
            onOpenDriverModal={handleOpenDriverModal}
            onOpenSelfReport={() => setIsSelfReportModalOpen(true)}
            onOpenAcknowledgeAlert={handleOpenAcknowledgeAlert}
          />
        )}

        {activeTab === 'drivers' && (
          <DriverFatigueTab
            profiles={profiles}
            onSelectDriver={handleOpenDriverModal}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            riskFilter={riskFilter}
            setRiskFilter={setRiskFilter}
          />
        )}

        {activeTab === 'driving-hours' && (
          <DrivingHoursTab profiles={profiles} onOpenDriverModal={handleOpenDriverModal} />
        )}

        {activeTab === 'rest' && (
          <RestManagementTab
            profiles={profiles}
            onOpenRestModal={() => setIsRestModalOpen(true)}
            onOpenDriverModal={handleOpenDriverModal}
          />
        )}

        {activeTab === 'shifts' && (
          <ShiftManagementTab
            shifts={shifts}
            profiles={profiles}
            onOpenAddShiftModal={() => setIsAddShiftModalOpen(true)}
          />
        )}

        {activeTab === 'night-driving' && (
          <NightDrivingTab profiles={profiles} onOpenDriverModal={handleOpenDriverModal} />
        )}

        {activeTab === 'alerts' && (
          <FatigueAlertsTab alerts={alerts} onAcknowledgeAlert={handleOpenAcknowledgeAlert} />
        )}

        {activeTab === 'history' && <FatigueHistoryTab />}

        {activeTab === 'analytics' && <FatigueAnalyticsTab />}

        {activeTab === 'ai-insights' && (
          <AIFatigueInsightsTab
            profiles={profiles}
            alerts={alerts}
            onOpenDriverModal={handleOpenDriverModal}
          />
        )}

        {activeTab === 'rules' && (
          <FatigueRulesTab rules={rules} onOpenRuleModal={() => setIsRuleModalOpen(true)} />
        )}
      </div>

      {/* Modals Container */}
      <DriverFatigueDetailModal
        isOpen={isDriverDetailModalOpen}
        onClose={() => setIsDriverDetailModalOpen(false)}
        profile={selectedDriverProfile}
      />

      <SelfReportModal
        isOpen={isSelfReportModalOpen}
        onClose={() => setIsSelfReportModalOpen(false)}
        onSubmitReport={handleSubmitSelfReport}
      />

      <AcknowledgeAlertModal
        isOpen={isAcknowledgeModalOpen}
        onClose={() => setIsAcknowledgeModalOpen(false)}
        alert={selectedAlertForAck}
        onConfirmAcknowledge={handleConfirmAcknowledge}
      />

      <AddShiftModal
        isOpen={isAddShiftModalOpen}
        onClose={() => setIsAddShiftModalOpen(false)}
        onSaveShift={handleSaveShift}
      />

      <RuleEditModal
        isOpen={isRuleModalOpen}
        onClose={() => setIsRuleModalOpen(false)}
        rule={rules[0]}
        onSaveRule={handleSaveRule}
      />

      <RestSessionModal
        isOpen={isRestModalOpen}
        onClose={() => setIsRestModalOpen(false)}
        onSaveRest={handleSaveRestSession}
      />
    </div>
  );
};
