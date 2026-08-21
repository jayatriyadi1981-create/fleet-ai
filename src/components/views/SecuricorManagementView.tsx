import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Shield,
  FileText,
  Lock,
  CreditCard,
  Video,
  Radio,
  UserCheck,
  Navigation,
  Wrench,
  DollarSign,
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';
import { SecuricorControlTowerTab } from '../securicor/tabs/SecuricorControlTowerTab';
import { SecuricorArmoredFleetsTab } from '../securicor/tabs/SecuricorArmoredFleetsTab';
import { SecuricorCitMissionsTab } from '../securicor/tabs/SecuricorCitMissionsTab';
import { SecuricorSmartVaultTab } from '../securicor/tabs/SecuricorSmartVaultTab';
import { SecuricorAtmReplenishmentTab } from '../securicor/tabs/SecuricorAtmReplenishmentTab';
import { SecuricorPatrolGuardsTab } from '../securicor/tabs/SecuricorPatrolGuardsTab';
import { SecuricorDuressEmergencyTab } from '../securicor/tabs/SecuricorDuressEmergencyTab';
import { SecuricorArmedOfficersTab } from '../securicor/tabs/SecuricorArmedOfficersTab';
import { SecuricorGeofenceCorridorsTab } from '../securicor/tabs/SecuricorGeofenceCorridorsTab';
import { SecuricorArmorMaintenanceTab } from '../securicor/tabs/SecuricorArmorMaintenanceTab';
import { SecuricorInsuranceBillingTab } from '../securicor/tabs/SecuricorInsuranceBillingTab';
import { SecuricorAiCopilotTab } from '../securicor/tabs/SecuricorAiCopilotTab';
import { SecuricorAuditReportsTab } from '../securicor/tabs/SecuricorAuditReportsTab';

export type SecuricorTabType =
  | 'control_tower'
  | 'armored_fleets'
  | 'cit_missions'
  | 'smart_vault'
  | 'atm_replenishment'
  | 'patrol_guards'
  | 'duress_emergency'
  | 'armed_officers'
  | 'geofence_corridors'
  | 'armor_maintenance'
  | 'insurance_billing'
  | 'ai_copilot'
  | 'reports';

interface SecuricorManagementViewProps {
  initialTab?: SecuricorTabType;
}

export const SecuricorManagementView: React.FC<SecuricorManagementViewProps> = ({
  initialTab = 'control_tower'
}) => {
  const [activeTab, setActiveTab] = useState<SecuricorTabType>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const tabs: { id: SecuricorTabType; label: string; icon: React.ElementType }[] = [
    { id: 'control_tower', label: 'Menara Kendali Lapis Baja', icon: ShieldAlert },
    { id: 'armored_fleets', label: 'Master Armada Lapis Baja', icon: Shield },
    { id: 'cit_missions', label: 'Manifest Misi CIT', icon: FileText },
    { id: 'smart_vault', label: 'Khazanah Brankas & Kaset', icon: Lock },
    { id: 'atm_replenishment', label: 'Pengisian Kas ATM / FLM', icon: CreditCard },
    { id: 'patrol_guards', label: 'Patroli & Bodycam', icon: Video },
    { id: 'duress_emergency', label: 'Alarm Duress & SOS POLRI', icon: Radio },
    { id: 'armed_officers', label: 'Pengawal Bersenjata & Izin Senpi', icon: UserCheck },
    { id: 'geofence_corridors', label: 'Koridor Rute & No-Stop Zone', icon: Navigation },
    { id: 'armor_maintenance', label: 'Perawatan Balistik & Solenoid', icon: Wrench },
    { id: 'insurance_billing', label: 'Asuransi CIT & Billing Bank', icon: DollarSign },
    { id: 'ai_copilot', label: 'AI Tactical Copilot', icon: Sparkles },
    { id: 'reports', label: 'Pusat Laporan Audit BI (PUPR)', icon: FileSpreadsheet },
  ];

  return (
    <div id="securicor-management-view" className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Sub Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-900 text-amber-400 rounded-lg shadow-sm">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                SECURICOR & CASH-IN-TRANSIT (CIT) FLEET SYSTEM
              </h1>
              <p className="text-xs text-slate-500">
                Sistem Terpadu Manajemen Armada Lapis Baja, Pengangkutan Uang Khazanah Bank Indonesia, Dual-Key Vault & Pengawalan Taktis Bersenjata
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-slate-900 text-amber-400 rounded-lg text-xs font-mono font-bold flex items-center gap-2 border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            POLDA METRO DIRECT LINK : ACTIVE
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
                  ? 'bg-slate-900 text-amber-400 shadow-sm border border-slate-800'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      <div className="min-h-[500px]">
        {activeTab === 'control_tower' && <SecuricorControlTowerTab />}
        {activeTab === 'armored_fleets' && <SecuricorArmoredFleetsTab />}
        {activeTab === 'cit_missions' && <SecuricorCitMissionsTab />}
        {activeTab === 'smart_vault' && <SecuricorSmartVaultTab />}
        {activeTab === 'atm_replenishment' && <SecuricorAtmReplenishmentTab />}
        {activeTab === 'patrol_guards' && <SecuricorPatrolGuardsTab />}
        {activeTab === 'duress_emergency' && <SecuricorDuressEmergencyTab />}
        {activeTab === 'armed_officers' && <SecuricorArmedOfficersTab />}
        {activeTab === 'geofence_corridors' && <SecuricorGeofenceCorridorsTab />}
        {activeTab === 'armor_maintenance' && <SecuricorArmorMaintenanceTab />}
        {activeTab === 'insurance_billing' && <SecuricorInsuranceBillingTab />}
        {activeTab === 'ai_copilot' && <SecuricorAiCopilotTab />}
        {activeTab === 'reports' && <SecuricorAuditReportsTab />}
      </div>
    </div>
  );
};
