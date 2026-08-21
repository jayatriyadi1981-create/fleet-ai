import React, { useState, useEffect } from 'react';
import {
  Building2,
  Car,
  CalendarCheck,
  Key,
  ClipboardCheck,
  Users,
  Fuel,
  ShieldAlert,
  FileCheck,
  Wrench,
  DollarSign,
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';
import { CorpControlTowerTab } from '../corporate/tabs/CorpControlTowerTab';
import { CorpVehiclesTab } from '../corporate/tabs/CorpVehiclesTab';
import { CorpBookingsTab } from '../corporate/tabs/CorpBookingsTab';
import { CorpKeyboxTab } from '../corporate/tabs/CorpKeyboxTab';
import { CorpInspectionsTab } from '../corporate/tabs/CorpInspectionsTab';
import { CorpDriversTab } from '../corporate/tabs/CorpDriversTab';
import { CorpFuelTollTab } from '../corporate/tabs/CorpFuelTollTab';
import { CorpPolicyComplianceTab } from '../corporate/tabs/CorpPolicyComplianceTab';
import { CorpComplianceLeaseTab } from '../corporate/tabs/CorpComplianceLeaseTab';
import { CorpMaintenanceTab } from '../corporate/tabs/CorpMaintenanceTab';
import { CorpCostCentersTab } from '../corporate/tabs/CorpCostCentersTab';
import { CorpAiCopilotTab } from '../corporate/tabs/CorpAiCopilotTab';
import { CorpReportsTab } from '../corporate/tabs/CorpReportsTab';

export type CorporateTabType =
  | 'control_tower'
  | 'corp_vehicles'
  | 'corp_bookings'
  | 'corp_keybox'
  | 'corp_inspections'
  | 'corp_drivers'
  | 'corp_fuel_toll'
  | 'corp_policy_compliance'
  | 'corp_compliance_lease'
  | 'corp_maintenance'
  | 'corp_cost_centers'
  | 'corp_ai_copilot'
  | 'corp_reports';

interface CorporateManagementViewProps {
  initialTab?: CorporateTabType;
}

export const CorporateManagementView: React.FC<CorporateManagementViewProps> = ({
  initialTab = 'control_tower'
}) => {
  const [activeTab, setActiveTab] = useState<CorporateTabType>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const tabs: { id: CorporateTabType; label: string; icon: React.ElementType }[] = [
    { id: 'control_tower', label: 'Menara Kendali Pool Mobil', icon: Building2 },
    { id: 'corp_vehicles', label: 'Master Kendaraan & Aset', icon: Car },
    { id: 'corp_bookings', label: 'Pemesanan E-Booking Dinas', icon: CalendarCheck },
    { id: 'corp_keybox', label: 'Smart Keybox Locker B1', icon: Key },
    { id: 'corp_inspections', label: 'Inspeksi & Checklist Baret', icon: ClipboardCheck },
    { id: 'corp_drivers', label: 'Supir Pool & Chauffeur VIP', icon: Users },
    { id: 'corp_fuel_toll', label: 'Kartu BBM & Saldo E-Toll', icon: Fuel },
    { id: 'corp_policy_compliance', label: 'Car Policy & Jam Malam', icon: ShieldAlert },
    { id: 'corp_compliance_lease', label: 'Kontrak Sewa Vendor & STNK', icon: FileCheck },
    { id: 'corp_maintenance', label: 'Servis Berkala & Bengkel', icon: Wrench },
    { id: 'corp_cost_centers', label: 'Alokasi Cost Center Divisi', icon: DollarSign },
    { id: 'corp_ai_copilot', label: 'AI Fleet Optimizer Copilot', icon: Sparkles },
    { id: 'corp_reports', label: 'Laporan Eksekutif & ESG Green', icon: FileSpreadsheet },
  ];

  return (
    <div id="corporate-management-view" className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Sub Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 text-white rounded-lg shadow-sm">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                CORPORATE COMPANY VEHICLE MANAGEMENT SYSTEM
              </h1>
              <p className="text-xs text-slate-500">
                Sistem Terpadu Pengelolaan Mobil Dinas, Sharing Pool Karyawan, Mobil Jabatan Direksi, Smart Key Locker, dan Kontrak Sewa Leasing Korporat
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-slate-900 text-blue-300 rounded-lg text-xs font-mono font-bold flex items-center gap-2 border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            GENERAL AFFAIRS HEADQUARTERS : ACTIVE
          </span>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin border-b border-slate-200">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      <div className="min-h-[500px]">
        {activeTab === 'control_tower' && <CorpControlTowerTab />}
        {activeTab === 'corp_vehicles' && <CorpVehiclesTab />}
        {activeTab === 'corp_bookings' && <CorpBookingsTab />}
        {activeTab === 'corp_keybox' && <CorpKeyboxTab />}
        {activeTab === 'corp_inspections' && <CorpInspectionsTab />}
        {activeTab === 'corp_drivers' && <CorpDriversTab />}
        {activeTab === 'corp_fuel_toll' && <CorpFuelTollTab />}
        {activeTab === 'corp_policy_compliance' && <CorpPolicyComplianceTab />}
        {activeTab === 'corp_compliance_lease' && <CorpComplianceLeaseTab />}
        {activeTab === 'corp_maintenance' && <CorpMaintenanceTab />}
        {activeTab === 'corp_cost_centers' && <CorpCostCentersTab />}
        {activeTab === 'corp_ai_copilot' && <CorpAiCopilotTab />}
        {activeTab === 'corp_reports' && <CorpReportsTab />}
      </div>
    </div>
  );
};
