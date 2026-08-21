import React, { useState, useEffect } from 'react';
import {
  Trash2,
  Truck,
  MapPin,
  FileCheck2,
  Scale,
  Radio,
  ThermometerSnowflake,
  Droplets,
  ShieldCheck,
  Users,
  Wrench,
  DollarSign,
  Sparkles,
  FileText,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { WasteControlTowerTab } from '../waste/tabs/WasteControlTowerTab';
import { WasteFleetsTab } from '../waste/tabs/WasteFleetsTab';
import { WasteRoutesTab } from '../waste/tabs/WasteRoutesTab';
import { WasteManifestFestronikTab } from '../waste/tabs/WasteManifestFestronikTab';
import { WasteWeighbridgeTab } from '../waste/tabs/WasteWeighbridgeTab';
import { WasteContainersTab } from '../waste/tabs/WasteContainersTab';
import { WasteMedicalBiohazardTab } from '../waste/tabs/WasteMedicalBiohazardTab';
import { WasteSludgeVacuumTab } from '../waste/tabs/WasteSludgeVacuumTab';
import { WasteSafetyComplianceTab } from '../waste/tabs/WasteSafetyComplianceTab';
import { WasteCrewsTab } from '../waste/tabs/WasteCrewsTab';
import { WasteMaintenanceTab } from '../waste/tabs/WasteMaintenanceTab';
import { WasteBillingTab } from '../waste/tabs/WasteBillingTab';
import { WasteAiCopilotTab } from '../waste/tabs/WasteAiCopilotTab';
import { WasteReportsTab } from '../waste/tabs/WasteReportsTab';

export type WasteTabId =
  | 'control_tower'
  | 'fleets'
  | 'routes'
  | 'manifest_festronik'
  | 'weighbridge'
  | 'containers'
  | 'medical_biohazard'
  | 'sludge_vacuum'
  | 'safety_compliance'
  | 'crews'
  | 'maintenance'
  | 'billing'
  | 'ai_copilot'
  | 'reports';

interface Props {
  initialTab?: WasteTabId;
}

export const WasteManagementView: React.FC<Props> = ({ initialTab = 'control_tower' }) => {
  const [activeTab, setActiveTab] = useState<WasteTabId>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const tabs: Array<{ id: WasteTabId; label: string; icon: React.FC<{ className?: string }> }> = [
    { id: 'control_tower', label: 'Menara Kendali', icon: Compass },
    { id: 'fleets', label: 'Master Armada Truk', icon: Truck },
    { id: 'routes', label: 'Jadwal & Rute TPS', icon: MapPin },
    { id: 'manifest_festronik', label: 'Festronik B3 KLHK', icon: FileCheck2 },
    { id: 'weighbridge', label: 'Jembatan Timbang TPA', icon: Scale },
    { id: 'containers', label: 'Sensor Smart Bin & RFID', icon: Radio },
    { id: 'medical_biohazard', label: 'Limbah Medis Cold Box', icon: ThermometerSnowflake },
    { id: 'sludge_vacuum', label: 'Sedot Tinja & IPAL', icon: Droplets },
    { id: 'safety_compliance', label: 'K3, APD & Spill Kit', icon: ShieldCheck },
    { id: 'crews', label: 'Kinerja Kru & Insentif', icon: Users },
    { id: 'maintenance', label: 'Perawatan & Cuci Armada', icon: Wrench },
    { id: 'billing', label: 'Tarif & Retribusi', icon: DollarSign },
    { id: 'ai_copilot', label: 'AI Waste Copilot', icon: Sparkles },
    { id: 'reports', label: 'Pusat Laporan KLHK', icon: FileText }
  ];

  return (
    <div id="waste-management-view" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/70 border border-emerald-500/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-emerald-500/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold flex items-center space-x-1.5">
                <Trash2 className="w-3.5 h-3.5" />
                <span>WASTE TRANSPORT FLEET MANAGEMENT SYSTEM</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold font-mono">
                AMDAL &amp; FESTRONIK KLHK READY
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              Manajemen Armada Angkutan Sampah, Limbah B3 &amp; Medis
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
              Sistem terpadu pengoperasian truk compactor, arm roll, hook lift, vacuum sludge, dan cold box limbah medis dengan integrasi jembatan timbang TPA, sensor smart bin, dan manifest Festronik KLHK.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <div className="bg-slate-950/80 border border-slate-800 px-4 py-2 rounded-2xl text-right">
              <span className="text-[10px] text-slate-500 block font-medium">Status Operasional</span>
              <div className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5 justify-end mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>ACTIVE &bull; 5 TRUK DISPATCHED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 overflow-x-auto pb-1 scrollbar-thin">
          <div className="flex items-center space-x-1.5 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 scale-[1.02]'
                      : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Render Active Tab */}
      <div className="transition-all duration-300">
        {activeTab === 'control_tower' && (
          <WasteControlTowerTab onNavigateTab={(tabId) => setActiveTab(tabId as WasteTabId)} />
        )}
        {activeTab === 'fleets' && <WasteFleetsTab />}
        {activeTab === 'routes' && <WasteRoutesTab />}
        {activeTab === 'manifest_festronik' && <WasteManifestFestronikTab />}
        {activeTab === 'weighbridge' && <WasteWeighbridgeTab />}
        {activeTab === 'containers' && <WasteContainersTab />}
        {activeTab === 'medical_biohazard' && <WasteMedicalBiohazardTab />}
        {activeTab === 'sludge_vacuum' && <WasteSludgeVacuumTab />}
        {activeTab === 'safety_compliance' && <WasteSafetyComplianceTab />}
        {activeTab === 'crews' && <WasteCrewsTab />}
        {activeTab === 'maintenance' && <WasteMaintenanceTab />}
        {activeTab === 'billing' && <WasteBillingTab />}
        {activeTab === 'ai_copilot' && <WasteAiCopilotTab />}
        {activeTab === 'reports' && <WasteReportsTab />}
      </div>
    </div>
  );
};
