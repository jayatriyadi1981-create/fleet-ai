import React, { useState } from 'react';
import {
  Car,
  Activity,
  DollarSign,
  Navigation,
  Percent,
  MapPin,
  Fuel,
  Users,
  ShieldCheck,
  Wrench,
  PackageSearch,
  CreditCard,
  Sparkles,
  FileText,
  Radio,
  Clock,
  Layers
} from 'lucide-react';
import { TaxiControlTowerTab } from './tabs/TaxiControlTowerTab';
import { TaxiFleetsTab } from './tabs/TaxiFleetsTab';
import { TaxiTaximeterTab } from './tabs/TaxiTaximeterTab';
import { TaxiOrdersDispatchTab } from './tabs/TaxiOrdersDispatchTab';
import { TaxiRevenueSharingTab } from './tabs/TaxiRevenueSharingTab';
import { TaxiPoolsStationsTab } from './tabs/TaxiPoolsStationsTab';
import { TaxiEnergyFuelTab } from './tabs/TaxiEnergyFuelTab';
import { TaxiDriversTab } from './tabs/TaxiDriversTab';
import { TaxiSafetyMdvrTab } from './tabs/TaxiSafetyMdvrTab';
import { TaxiMaintenanceTab } from './tabs/TaxiMaintenanceTab';
import { TaxiLostFoundTab } from './tabs/TaxiLostFoundTab';
import { TaxiCashlessPaymentTab } from './tabs/TaxiCashlessPaymentTab';
import { TaxiAiCopilotTab } from './tabs/TaxiAiCopilotTab';
import { TaxiReportsTab } from './tabs/TaxiReportsTab';

export const TaxiManagementView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('control_tower');

  const menuItems = [
    { id: 'control_tower', label: 'Menara Kendali Live', icon: Activity, badge: 'Live' },
    { id: 'fleets', label: 'Master Armada Taksi', icon: Car },
    { id: 'taximeter', label: 'Argometer & Tarif', icon: DollarSign },
    { id: 'orders', label: 'Smart Dispatching', icon: Navigation, badge: 'Auto' },
    { id: 'revenue', label: 'Setoran & Bagi Hasil', icon: Percent },
    { id: 'pools', label: 'Pool & Pangkalan FIFO', icon: MapPin },
    { id: 'energy', label: 'BBM, SPBG & SPKLU EV', icon: Fuel },
    { id: 'drivers', label: 'Pengemudi & KTA/Shift', icon: Users },
    { id: 'safety', label: 'Kamera MDVR & Panic SOS', icon: ShieldCheck },
    { id: 'maintenance', label: 'Perawatan & Uji KIR/Tera', icon: Wrench },
    { id: 'lost_found', label: 'Lost & Found Penumpang', icon: PackageSearch },
    { id: 'cashless', label: 'Pembayaran Non-Tunai QRIS', icon: CreditCard },
    { id: 'ai_copilot', label: 'AI Demand Copilot', icon: Sparkles, badge: 'AI' },
    { id: 'reports', label: 'Laporan LOH & Audit', icon: FileText },
  ];

  return (
    <div id="taxi-management-system-view" className="space-y-6">
      {/* Top Main Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-amber-500/5 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-slate-100 tracking-tight">
                  TAXI MANAGEMENT SYSTEM (TMS)
                </h1>
                <div className="flex items-center space-x-2 text-xs text-amber-400 font-medium">
                  <span>Armada Sedan • MPV • Electric EV Green Taxi • Silver Bird Executive</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl pt-1">
              Platform komprehensif telematika taksi pintar: monitoring utilisasi jarak muatan (Paid KM vs Deadhead), argometer digital tera resmi metrologi, auto-dispatching pangkalan bandara/stasiun, setoran kasir pool, dan integrasi keselamatan MDVR.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <div className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">Status Sistem</span>
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
        {activeTab === 'control_tower' && <TaxiControlTowerTab onNavigateTab={(t) => setActiveTab(t)} />}
        {activeTab === 'fleets' && <TaxiFleetsTab />}
        {activeTab === 'taximeter' && <TaxiTaximeterTab />}
        {activeTab === 'orders' && <TaxiOrdersDispatchTab />}
        {activeTab === 'revenue' && <TaxiRevenueSharingTab />}
        {activeTab === 'pools' && <TaxiPoolsStationsTab />}
        {activeTab === 'energy' && <TaxiEnergyFuelTab />}
        {activeTab === 'drivers' && <TaxiDriversTab />}
        {activeTab === 'safety' && <TaxiSafetyMdvrTab />}
        {activeTab === 'maintenance' && <TaxiMaintenanceTab />}
        {activeTab === 'lost_found' && <TaxiLostFoundTab />}
        {activeTab === 'cashless' && <TaxiCashlessPaymentTab />}
        {activeTab === 'ai_copilot' && <TaxiAiCopilotTab />}
        {activeTab === 'reports' && <TaxiReportsTab />}
      </div>
    </div>
  );
};
