import React, { useState } from 'react';
import {
  Layers,
  LayoutDashboard,
  MapPin,
  Compass,
  Tag,
  Truck,
  Users,
  Clock,
  RotateCw,
  Scale,
  Fuel,
  ShieldCheck,
  Wrench,
  TrendingUp,
  Sparkles,
  FileText,
  Boxes
} from 'lucide-react';

import { MiningDashboardTab } from './tabs/MiningDashboardTab';
import { MiningSitesTab } from './tabs/MiningSitesTab';
import { MiningPitsTab } from './tabs/MiningPitsTab';
import { MiningBenchesTab } from './tabs/MiningBenchesTab';
import { MiningMaterialsTab } from './tabs/MiningMaterialsTab';
import { MiningEquipmentTab } from './tabs/MiningEquipmentTab';
import { MiningOperatorsTab } from './tabs/MiningOperatorsTab';
import { MiningShiftsTab } from './tabs/MiningShiftsTab';
import { MiningDispatchTab } from './tabs/MiningDispatchTab';
import { MiningHaulingWeighbridgeTab } from './tabs/MiningHaulingWeighbridgeTab';
import { MiningFuelBowserTab } from './tabs/MiningFuelBowserTab';
import { MiningSafetySmkpTab } from './tabs/MiningSafetySmkpTab';
import { MiningPlantMaintenanceTab } from './tabs/MiningPlantMaintenanceTab';
import { MiningProductivityPnlTab } from './tabs/MiningProductivityPnlTab';
import { MiningAiCopilotTab } from './tabs/MiningAiCopilotTab';
import { MiningReportsTab } from './tabs/MiningReportsTab';

export type MiningSubTab = 
  | 'dashboard'
  | 'sites'
  | 'pits'
  | 'benches'
  | 'materials'
  | 'equipment'
  | 'operators'
  | 'shifts'
  | 'dispatch'
  | 'weighbridge'
  | 'fuel'
  | 'safety'
  | 'maintenance'
  | 'productivity'
  | 'ai_copilot'
  | 'reports';

interface MiningManagementViewProps {
  initialTab?: MiningSubTab;
}

export const MiningManagementView: React.FC<MiningManagementViewProps> = ({ initialTab = 'dashboard' }) => {
  const [activeTab, setActiveTab] = useState<MiningSubTab>(initialTab);

  const tabs: { id: MiningSubTab; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard & KPI', icon: LayoutDashboard },
    { id: 'sites', label: 'Site Tambang', icon: MapPin },
    { id: 'pits', label: 'Pit & Geofence', icon: Compass },
    { id: 'benches', label: 'Jenjang (Bench)', icon: Layers },
    { id: 'materials', label: 'Material & Grade', icon: Tag },
    { id: 'equipment', label: 'Armada & Alat Berat', icon: Truck },
    { id: 'operators', label: 'Operator & KIMPER', icon: Users },
    { id: 'shifts', label: 'Shift Roster & P5M', icon: Clock },
    { id: 'dispatch', label: 'Dispatch & Siklus Hauling', icon: RotateCw, badge: 'Live' },
    { id: 'weighbridge', label: 'Jembatan Timbang', icon: Scale },
    { id: 'fuel', label: 'BBM & Fuel Bowser', icon: Fuel },
    { id: 'safety', label: 'K3 SMKP & Fatigue DSS', icon: ShieldCheck, badge: 'Zero LTI' },
    { id: 'maintenance', label: 'Plant & Ban OTR', icon: Wrench },
    { id: 'productivity', label: 'Produktivitas & P&L', icon: TrendingUp },
    { id: 'ai_copilot', label: 'AI Mining Copilot', icon: Sparkles, badge: 'AI' },
    { id: 'reports', label: 'Pusat Laporan LHT/LBT', icon: FileText }
  ];

  return (
    <div className="space-y-6" id="mining-management-main-view">
      {/* Category Navigation Bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                id={`mining-tab-${tab.id}`}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-black uppercase ${
                      tab.badge === 'AI'
                        ? 'bg-amber-400 text-slate-950'
                        : tab.badge === 'Live'
                        ? 'bg-emerald-500 text-white animate-pulse'
                        : 'bg-emerald-100 text-emerald-800'
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

      {/* Tab Content Rendering */}
      <div>
        {activeTab === 'dashboard' && <MiningDashboardTab onNavigateTab={(tab) => setActiveTab(tab as MiningSubTab)} />}
        {activeTab === 'sites' && <MiningSitesTab />}
        {activeTab === 'pits' && <MiningPitsTab />}
        {activeTab === 'benches' && <MiningBenchesTab />}
        {activeTab === 'materials' && <MiningMaterialsTab />}
        {activeTab === 'equipment' && <MiningEquipmentTab />}
        {activeTab === 'operators' && <MiningOperatorsTab />}
        {activeTab === 'shifts' && <MiningShiftsTab />}
        {activeTab === 'dispatch' && <MiningDispatchTab />}
        {activeTab === 'weighbridge' && <MiningHaulingWeighbridgeTab />}
        {activeTab === 'fuel' && <MiningFuelBowserTab />}
        {activeTab === 'safety' && <MiningSafetySmkpTab />}
        {activeTab === 'maintenance' && <MiningPlantMaintenanceTab />}
        {activeTab === 'productivity' && <MiningProductivityPnlTab />}
        {activeTab === 'ai_copilot' && <MiningAiCopilotTab />}
        {activeTab === 'reports' && <MiningReportsTab />}
      </div>
    </div>
  );
};
