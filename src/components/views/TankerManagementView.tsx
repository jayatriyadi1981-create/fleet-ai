import React, { useState, useEffect } from 'react';
import {
  Truck,
  Activity,
  Layers,
  Lock,
  FileText,
  DownloadCloud,
  ShieldAlert,
  Flame,
  Sparkles,
  Users,
  Wrench,
  DollarSign,
  FileSpreadsheet
} from 'lucide-react';
import { TankerControlTowerTab } from '../tanker/tabs/TankerControlTowerTab';
import { TankerFleetsTab } from '../tanker/tabs/TankerFleetsTab';
import { TankerCompartmentsTab } from '../tanker/tabs/TankerCompartmentsTab';
import { TankerElocksTab } from '../tanker/tabs/TankerElocksTab';
import { TankerLoadingOrdersTab } from '../tanker/tabs/TankerLoadingOrdersTab';
import { TankerUnloadingTab } from '../tanker/tabs/TankerUnloadingTab';
import { TankerGeofencesTab } from '../tanker/tabs/TankerGeofencesTab';
import { TankerSafetyHazmatTab } from '../tanker/tabs/TankerSafetyHazmatTab';
import { TankerCleaningTab } from '../tanker/tabs/TankerCleaningTab';
import { TankerDriversTab } from '../tanker/tabs/TankerDriversTab';
import { TankerMaintenanceTab } from '../tanker/tabs/TankerMaintenanceTab';
import { TankerBillingTab } from '../tanker/tabs/TankerBillingTab';
import { TankerAiCopilotTab } from '../tanker/tabs/TankerAiCopilotTab';
import { TankerReportsTab } from '../tanker/tabs/TankerReportsTab';

export type TankerTabId =
  | 'control_tower'
  | 'fleets'
  | 'compartments'
  | 'elocks'
  | 'loading_orders'
  | 'unloading'
  | 'geofences'
  | 'safety_hazmat'
  | 'cleaning'
  | 'drivers'
  | 'maintenance'
  | 'billing'
  | 'ai_copilot'
  | 'reports';

interface Props {
  initialTab?: TankerTabId;
}

export const TankerManagementView: React.FC<Props> = ({ initialTab = 'control_tower' }) => {
  const [activeTab, setActiveTab] = useState<TankerTabId>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const menuItems = [
    { id: 'control_tower' as TankerTabId, label: 'Menara Kendali Live', icon: Activity, badge: 'Live' },
    { id: 'fleets' as TankerTabId, label: 'Master Armada Tangki', icon: Truck },
    { id: 'compartments' as TankerTabId, label: 'Sensor Kompartemen & Susut', icon: Layers },
    { id: 'elocks' as TankerTabId, label: 'Smart E-Lock & Segel', icon: Lock, badge: 'Security' },
    { id: 'loading_orders' as TankerTabId, label: 'Order DO & Gantry Loading', icon: FileText },
    { id: 'unloading' as TankerTabId, label: 'Bongkar Muatan & Flowmeter', icon: DownloadCloud },
    { id: 'geofences' as TankerTabId, label: 'Koridor Jalur & Red Zones', icon: ShieldAlert },
    { id: 'safety_hazmat' as TankerTabId, label: 'Keselamatan B3 & Rollover', icon: Flame },
    { id: 'cleaning' as TankerTabId, label: 'Pencucian Tangki & CIP', icon: Sparkles },
    { id: 'drivers' as TankerTabId, label: 'Pengemudi B3 & Roster', icon: Users },
    { id: 'maintenance' as TankerTabId, label: 'Perawatan & Tera Legal', icon: Wrench },
    { id: 'billing' as TankerTabId, label: 'Tarif Angkutan & Klaim Susut', icon: DollarSign },
    { id: 'ai_copilot' as TankerTabId, label: 'AI Tanker Copilot', icon: Sparkles, badge: 'AI' },
    { id: 'reports' as TankerTabId, label: 'Laporan Audit & Losses', icon: FileSpreadsheet },
  ];

  return (
    <div id="tanker-management-system-view" className="space-y-6">
      {/* Top Main Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-amber-500/5 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-slate-100 tracking-tight">
                  TANKER TRUCK MANAGEMENT SYSTEM (TTMS)
                </h1>
                <div className="flex items-center space-x-2 text-xs text-amber-400 font-medium">
                  <span>Armada Cairan Curah: BBM Pertamina • CPO Sawit • Petrokimia B3 • Gas LPG/LNG • Food Grade</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl pt-1">
              Platform telematika cerdas bejana tangki cairan: monitoring level ultrasonik kompartemen, pencegahan pencurian cairan (Smart E-Lock), kontrol gantry loading terminal, deteksi dinamika sloshing & rollover, serta kepatuhan keselamatan B3 KLHK.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <div className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">Status Sistem TTMS</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5 justify-end">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>ONLINE 24/7</span>
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Scrollable Bar */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 mt-6 border-t border-slate-800/80 pt-4 no-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center space-x-2 whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'bg-slate-950/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                      isActive
                        ? 'bg-slate-950 text-amber-400'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content View */}
      <div className="transition-all duration-200">
        {activeTab === 'control_tower' && (
          <TankerControlTowerTab onNavigateTab={(t) => setActiveTab(t as TankerTabId)} />
        )}
        {activeTab === 'fleets' && <TankerFleetsTab />}
        {activeTab === 'compartments' && <TankerCompartmentsTab />}
        {activeTab === 'elocks' && <TankerElocksTab />}
        {activeTab === 'loading_orders' && <TankerLoadingOrdersTab />}
        {activeTab === 'unloading' && <TankerUnloadingTab />}
        {activeTab === 'geofences' && <TankerGeofencesTab />}
        {activeTab === 'safety_hazmat' && <TankerSafetyHazmatTab />}
        {activeTab === 'cleaning' && <TankerCleaningTab />}
        {activeTab === 'drivers' && <TankerDriversTab />}
        {activeTab === 'maintenance' && <TankerMaintenanceTab />}
        {activeTab === 'billing' && <TankerBillingTab />}
        {activeTab === 'ai_copilot' && <TankerAiCopilotTab />}
        {activeTab === 'reports' && <TankerReportsTab />}
      </div>
    </div>
  );
};
