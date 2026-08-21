import React, { useState, useEffect } from 'react';
import {
  Target,
  ArrowUpRight,
  PackageCheck,
  Zap,
  FileCheck2,
  Radio,
  Waypoints,
  AlertOctagon,
  DollarSign,
  Share2,
  Users,
  Tag,
  Sparkles,
  FileSpreadsheet,
  Package,
  Layers
} from 'lucide-react';

// Import Tabs
import { PudControlTowerTab } from '../pud/tabs/PudControlTowerTab';
import { PudPickupsTab } from '../pud/tabs/PudPickupsTab';
import { PudDeliveriesTab } from '../pud/tabs/PudDeliveriesTab';
import { PudDispatchTab } from '../pud/tabs/PudDispatchTab';
import { PudEpodTab } from '../pud/tabs/PudEpodTab';
import { PudLiveCouriersTab } from '../pud/tabs/PudLiveCouriersTab';
import { PudRouteOptimizerTab } from '../pud/tabs/PudRouteOptimizerTab';
import { PudFailedUndeliveredTab } from '../pud/tabs/PudFailedUndeliveredTab';
import { PudCodTab } from '../pud/tabs/PudCodTab';
import { PudTrackingLinkTab } from '../pud/tabs/PudTrackingLinkTab';
import { PudCouriersTab } from '../pud/tabs/PudCouriersTab';
import { PudTariffsTab } from '../pud/tabs/PudTariffsTab';
import { PudAiCopilotTab } from '../pud/tabs/PudAiCopilotTab';
import { PudReportsTab } from '../pud/tabs/PudReportsTab';

export type PudTabType = 
  | 'control_tower'
  | 'pickups'
  | 'deliveries'
  | 'dispatch'
  | 'epod'
  | 'live_couriers'
  | 'route_optimizer'
  | 'failed_undelivered'
  | 'cod'
  | 'tracking_link'
  | 'couriers'
  | 'tariffs'
  | 'ai_copilot'
  | 'reports';

interface PudManagementViewProps {
  initialTab?: PudTabType;
}

export const PudManagementView: React.FC<PudManagementViewProps> = ({
  initialTab = 'control_tower'
}) => {
  const [activeTab, setActiveTab] = useState<PudTabType>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const tabs: Array<{ id: PudTabType; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'control_tower', label: 'Menara Kendali (Control Tower)', icon: Target },
    { id: 'pickups', label: 'Permintaan Pickup (First-Mile)', icon: ArrowUpRight },
    { id: 'deliveries', label: 'Pengiriman Drop-off (Last-Mile)', icon: PackageCheck },
    { id: 'dispatch', label: 'Smart Dispatch & Alokasi Kurir', icon: Zap },
    { id: 'epod', label: 'Bukti Serah Terima (ePOD & ePOP)', icon: FileCheck2 },
    { id: 'live_couriers', label: 'Live Tracking Kurir & GPS Radar', icon: Radio },
    { id: 'route_optimizer', label: 'Optimasi Rute Multi-Stop (VRP)', icon: Waypoints },
    { id: 'failed_undelivered', label: 'Kendala & Gagal Antar (NDR)', icon: AlertOctagon },
    { id: 'cod', label: 'COD & Rekonsiliasi Kas Kurir', icon: DollarSign },
    { id: 'tracking_link', label: 'Tautan Pelacakan & Notifikasi', icon: Share2 },
    { id: 'couriers', label: 'Roster Kurir & Kinerja Insentif', icon: Users },
    { id: 'tariffs', label: 'Tarif Zona & Kalkulator Ongkir', icon: Tag },
    { id: 'ai_copilot', label: 'AI PUD Operations Copilot', icon: Sparkles },
    { id: 'reports', label: 'Pusat Laporan & KPI PUD', icon: FileSpreadsheet }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-6 lg:p-8 space-y-6" id="pud-management-view">
      {/* Module Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-1.5 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                id={`pud-nav-tab-${tab.id}`}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="transition-all duration-200">
        {activeTab === 'control_tower' && (
          <PudControlTowerTab onNavigateTab={(tab) => setActiveTab(tab as PudTabType)} />
        )}
        {activeTab === 'pickups' && <PudPickupsTab />}
        {activeTab === 'deliveries' && <PudDeliveriesTab />}
        {activeTab === 'dispatch' && <PudDispatchTab />}
        {activeTab === 'epod' && <PudEpodTab />}
        {activeTab === 'live_couriers' && <PudLiveCouriersTab />}
        {activeTab === 'route_optimizer' && <PudRouteOptimizerTab />}
        {activeTab === 'failed_undelivered' && <PudFailedUndeliveredTab />}
        {activeTab === 'cod' && <PudCodTab />}
        {activeTab === 'tracking_link' && <PudTrackingLinkTab />}
        {activeTab === 'couriers' && <PudCouriersTab />}
        {activeTab === 'tariffs' && <PudTariffsTab />}
        {activeTab === 'ai_copilot' && <PudAiCopilotTab />}
        {activeTab === 'reports' && <PudReportsTab />}
      </div>
    </div>
  );
};
