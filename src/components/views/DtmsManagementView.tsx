import React, { useState, useEffect } from 'react';
import {
  Truck,
  Target,
  RotateCw,
  Scale,
  MapPin,
  Zap,
  Fuel,
  Disc,
  Radio,
  Users,
  ShieldCheck,
  Wrench,
  DollarSign,
  Sparkles,
  FileSpreadsheet,
  Layers,
  ChevronRight
} from 'lucide-react';
import { DtmsControlTowerTab } from '../dtms/tabs/DtmsControlTowerTab';
import { DtmsFleetsTab } from '../dtms/tabs/DtmsFleetsTab';
import { DtmsCyclesTab } from '../dtms/tabs/DtmsCyclesTab';
import { DtmsPayloadTab } from '../dtms/tabs/DtmsPayloadTab';
import { DtmsHaulRoadsTab } from '../dtms/tabs/DtmsHaulRoadsTab';
import { DtmsDispatchTab } from '../dtms/tabs/DtmsDispatchTab';
import { DtmsFuelTab } from '../dtms/tabs/DtmsFuelTab';
import { DtmsTiresTab } from '../dtms/tabs/DtmsTiresTab';
import { DtmsTelematicsTab } from '../dtms/tabs/DtmsTelematicsTab';
import { DtmsDriversTab } from '../dtms/tabs/DtmsDriversTab';
import { DtmsSafetyTab } from '../dtms/tabs/DtmsSafetyTab';
import { DtmsMaintenanceTab } from '../dtms/tabs/DtmsMaintenanceTab';
import { DtmsBillingTab } from '../dtms/tabs/DtmsBillingTab';
import { DtmsAiCopilotTab } from '../dtms/tabs/DtmsAiCopilotTab';
import { DtmsReportsTab } from '../dtms/tabs/DtmsReportsTab';
import { useFleet } from '../../context/FleetContext';

export type DtmsTabId =
  | 'control_tower'
  | 'fleets'
  | 'cycles'
  | 'payload'
  | 'haul_roads'
  | 'dispatch'
  | 'fuel'
  | 'tires'
  | 'telematics'
  | 'drivers'
  | 'safety'
  | 'maintenance'
  | 'billing'
  | 'ai_copilot'
  | 'reports';

interface Props {
  initialTab?: DtmsTabId;
}

export const DtmsManagementView: React.FC<Props> = ({ initialTab = 'control_tower' }) => {
  const [activeTab, setActiveTab] = useState<DtmsTabId>(initialTab);
  const { setActiveView: setAppActiveView } = useFleet();

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const tabs: Array<{ id: DtmsTabId; label: string; icon: React.ElementType; color?: string }> = [
    { id: 'control_tower', label: 'Control Tower DTMS', icon: Target, color: 'text-amber-400' },
    { id: 'fleets', label: 'Master Armada DT', icon: Truck, color: 'text-slate-200' },
    { id: 'cycles', label: 'Ritase & Cycle Time', icon: RotateCw, color: 'text-cyan-400' },
    { id: 'payload', label: 'Jembatan Timbang & Payload', icon: Scale, color: 'text-amber-500' },
    { id: 'haul_roads', label: 'Haul Road & Kecepatan', icon: MapPin, color: 'text-emerald-400' },
    { id: 'dispatch', label: 'Smart Dispatch & Match Factor', icon: Zap, color: 'text-emerald-400' },
    { id: 'fuel', label: 'Konsumsi Solar & Bowser', icon: Fuel, color: 'text-amber-400' },
    { id: 'tires', label: 'Ban OTR & TPMS Sensor', icon: Disc, color: 'text-purple-400' },
    { id: 'telematics', label: 'Hoist Hidrolik & PTO', icon: Radio, color: 'text-purple-400' },
    { id: 'drivers', label: 'Operator KIMPER & Fatigue DSS', icon: Users, color: 'text-emerald-400' },
    { id: 'safety', label: 'K3 Tambang & Anti-Rollover', icon: ShieldCheck, color: 'text-emerald-400' },
    { id: 'maintenance', label: 'Perawatan PM & P2H', icon: Wrench, color: 'text-amber-400' },
    { id: 'billing', label: 'Tarif Hauling & P&L', icon: DollarSign, color: 'text-emerald-400' },
    { id: 'ai_copilot', label: 'AI Operations Copilot', icon: Sparkles, color: 'text-amber-400' },
    { id: 'reports', label: 'Pusat Laporan LHT/LBT', icon: FileSpreadsheet, color: 'text-cyan-400' },
  ];

  const handleTabChange = (tabId: DtmsTabId) => {
    setActiveTab(tabId);
    // Keep FleetContext route in sync if desired
    setAppActiveView(`dtms_${tabId}` as any);
  };

  const handleNavigateFromTab = (targetTab: string) => {
    const cleanId = targetTab.replace('dtms_', '') as DtmsTabId;
    handleTabChange(cleanId);
  };

  return (
    <div id="dtms-management-view" className="space-y-6">
      {/* Header View */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 font-black">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-slate-100">DUMP TRUCK MANAGEMENT SYSTEM (DTMS)</h1>
                <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Off-Highway & Heavy Hauler
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Sistem Terpadu Manajemen Siklus Hauling, Match Factor Shovel-Truck, Jembatan Timbang, Telemetri Hoist Hidrolik & Efisiensi Solar
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation Scrollable Bar */}
        <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-700">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-2 shrink-0 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : tab.color || 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="transition-all duration-300">
        {activeTab === 'control_tower' && <DtmsControlTowerTab onNavigateTab={handleNavigateFromTab} />}
        {activeTab === 'fleets' && <DtmsFleetsTab />}
        {activeTab === 'cycles' && <DtmsCyclesTab />}
        {activeTab === 'payload' && <DtmsPayloadTab />}
        {activeTab === 'haul_roads' && <DtmsHaulRoadsTab />}
        {activeTab === 'dispatch' && <DtmsDispatchTab />}
        {activeTab === 'fuel' && <DtmsFuelTab />}
        {activeTab === 'tires' && <DtmsTiresTab />}
        {activeTab === 'telematics' && <DtmsTelematicsTab />}
        {activeTab === 'drivers' && <DtmsDriversTab />}
        {activeTab === 'safety' && <DtmsSafetyTab />}
        {activeTab === 'maintenance' && <DtmsMaintenanceTab />}
        {activeTab === 'billing' && <DtmsBillingTab />}
        {activeTab === 'ai_copilot' && <DtmsAiCopilotTab />}
        {activeTab === 'reports' && <DtmsReportsTab />}
      </div>
    </div>
  );
};
