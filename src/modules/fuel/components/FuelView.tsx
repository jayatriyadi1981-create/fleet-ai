/**
 * Fleet Intelligence Smart AI - Fuel Management Main View Container
 * PROMPT 24 - Comprehensive Fuel Management & Smart AI Fuel Intelligence Module
 */

import React, { useState } from 'react';
import {
  Fuel,
  Activity,
  TrendingUp,
  ShieldAlert,
  AlertTriangle,
  DollarSign,
  BarChart3,
  FileText,
  Sparkles,
  Settings,
  Filter,
  PlusCircle,
  MapPin,
  RefreshCw,
} from 'lucide-react';

import {
  mockFuelOverviewKPIs,
  mockFuelReadings,
  mockFuelConsumptions,
  mockRefuelingEvents,
  mockFuelDrainEvents,
  mockFuelAnomalies,
  mockFuelStations,
  mockFuelRules,
  mockFuelBudgets,
  mockVehicleFuelConfigs,
} from '../data/mockFuelData';

import { FuelAnomaly, RefuelingEvent, FuelRule, FuelStation } from '../types';

import { OverviewTab } from './tabs/OverviewTab';
import { LiveFuelTab } from './tabs/LiveFuelTab';
import { ConsumptionTab } from './tabs/ConsumptionTab';
import { RefuelingTab } from './tabs/RefuelingTab';
import { FuelDrainTab } from './tabs/FuelDrainTab';
import { AnomaliesTab } from './tabs/AnomaliesTab';
import { FuelCostTab } from './tabs/FuelCostTab';
import { AnalyticsTab } from './tabs/AnalyticsTab';
import { ReportsTab } from './tabs/ReportsTab';
import { AIFuelInsightsTab } from './tabs/AIFuelInsightsTab';
import { RulesTab } from './tabs/RulesTab';

import { VehicleFuelDetailModal } from './modals/VehicleFuelDetailModal';
import { FuelEventDetailModal } from './modals/FuelEventDetailModal';
import { ManualRefuelingModal } from './modals/ManualRefuelingModal';
import { AddStationModal } from './modals/AddStationModal';
import { PriceConfigModal } from './modals/PriceConfigModal';
import { RuleEditModal } from './modals/RuleEditModal';
import { ConcoxAt4SetupModal } from '../../../components/modals/ConcoxAt4SetupModal';

type FuelSubTab =
  | 'overview'
  | 'live'
  | 'consumption'
  | 'refueling'
  | 'drain'
  | 'anomalies'
  | 'cost'
  | 'analytics'
  | 'reports'
  | 'ai-insights'
  | 'rules';

export const FuelView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FuelSubTab>('overview');

  // State
  const [kpis, setKpis] = useState(mockFuelOverviewKPIs);
  const [readings, setReadings] = useState(mockFuelReadings);
  const [consumptions, setConsumptions] = useState(mockFuelConsumptions);
  const [refuelings, setRefuelings] = useState(mockRefuelingEvents);
  const [drains, setDrains] = useState(mockFuelDrainEvents);
  const [anomalies, setAnomalies] = useState(mockFuelAnomalies);
  const [stations, setStations] = useState(mockFuelStations);
  const [rules, setRules] = useState(mockFuelRules);
  const [budgets, setBudgets] = useState(mockFuelBudgets);

  // Filters
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [selectedFuelType, setSelectedFuelType] = useState('ALL');

  // Modals state
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedAnomaly, setSelectedAnomaly] = useState<FuelAnomaly | null>(null);
  const [isRefuelingModalOpen, setIsRefuelingModalOpen] = useState(false);
  const [isStationModalOpen, setIsStationModalOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isConcoxModalOpen, setIsConcoxModalOpen] = useState(false);
  const [selectedRuleToEdit, setSelectedRuleToEdit] = useState<FuelRule | null>(null);

  // Handlers
  const handleAddRefueling = (newRef: Partial<RefuelingEvent>) => {
    const created: RefuelingEvent = {
      id: `ref-${Date.now()}`,
      tenantId: 'tenant-1',
      vehicleId: 'veh-001',
      vehiclePlate: newRef.vehiclePlate || 'B 9876 XYZ',
      driverName: newRef.driverName || 'Budi Santoso',
      timestamp: newRef.timestamp || new Date().toISOString(),
      fuelType: newRef.fuelType || 'BIODIESEL',
      volume: newRef.volume || 180,
      pricePerLiter: newRef.pricePerLiter || 6800,
      totalCost: newRef.totalCost || 1224000,
      fuelLevelBefore: 36,
      fuelLevelAfter: 216,
      odometer: newRef.odometer || 142610,
      stationName: newRef.stationName || 'SPBU Pertamina',
      latitude: -6.2,
      longitude: 106.8,
      paymentMethod: 'FUEL_CARD',
      receiptNumber: newRef.receiptNumber || 'INV/2026/999',
      source: 'MANUAL_ENTRY',
      verified: true,
      status: 'VERIFIED',
      reconciliationStatus: 'MATCH',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRefuelings([created, ...refuelings]);
    setKpis((prev) => ({
      ...prev,
      totalFuelPurchasedLiters: prev.totalFuelPurchasedLiters + created.volume,
      totalFuelCostIdr: prev.totalFuelCostIdr + created.totalCost,
      refuelingEventsCount: prev.refuelingEventsCount + 1,
    }));
  };

  const handleUpdateAnomalyStatus = (
    id: string,
    newStatus: 'VERIFIED' | 'FALSE_POSITIVE' | 'RESOLVED',
    notes: string
  ) => {
    setAnomalies(
      anomalies.map((a) => (a.id === id ? { ...a, status: newStatus, resolutionNotes: notes } : a))
    );
  };

  const handleSaveRule = (updatedRule: FuelRule) => {
    setRules(rules.map((r) => (r.id === updatedRule.id ? updatedRule : r)));
  };

  const tabsConfig = [
    { id: 'overview', label: 'Ringkasan Utama', icon: Fuel },
    { id: 'live', label: 'Telematika Live', icon: Activity },
    { id: 'consumption', label: 'Konsumsi (km/L)', icon: TrendingUp },
    { id: 'refueling', label: 'Pengisian SPBU', icon: Fuel },
    { id: 'drain', label: 'Fuel Drain', icon: ShieldAlert, badge: drains.length },
    { id: 'anomalies', label: 'Daftar Anomali', icon: AlertTriangle, badge: anomalies.length },
    { id: 'cost', label: 'Biaya & Budget', icon: DollarSign },
    { id: 'analytics', label: 'Analitik & KPI', icon: BarChart3 },
    { id: 'reports', label: 'Laporan', icon: FileText },
    { id: 'ai-insights', label: 'AI Intelligence', icon: Sparkles },
    { id: 'rules', label: 'Aturan System', icon: Settings },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-cyan-950 border border-cyan-800/50 text-cyan-400 rounded-xl">
              <Fuel className="h-6 w-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Manajemen BBM & Smart AI Fuel Intelligence
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Monitoring sensor tangki BBM real-time, deteksi kebocoran/fuel drain, rekonsiliasi SPBU OCR, & AI Copilot.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsConcoxModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <Settings className="h-4 w-4" /> Panduan Concox AT4
          </button>
          <button
            onClick={() => setIsRefuelingModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-600/30"
          >
            <PlusCircle className="h-4 w-4" /> + Catat Transaksi BBM
          </button>
        </div>
      </div>

      {/* Global Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-cyan-400" />
          <span className="font-semibold text-slate-300">Global Filter BBM:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">Semua Cabang (Jakarta & Surabaya)</option>
              <option value="HQ">Cabang Utama Jakarta</option>
              <option value="SUB">Cabang Depot Surabaya</option>
            </select>
          </div>

          <div>
            <select
              value={selectedFuelType}
              onChange={(e) => setSelectedFuelType(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">Semua Jenis Bahan Bakar</option>
              <option value="BIODIESEL">Biosolar B35</option>
              <option value="SOLAR">Solar Pertamina</option>
              <option value="PERTALITE">Pertalite</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sub-Tabs Navigation (11 Tabs) */}
      <div className="border-b border-slate-800 overflow-x-auto">
        <nav className="flex space-x-1 py-1" aria-label="Tabs">
          {tabsConfig.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as FuelSubTab)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                      isActive ? 'bg-white text-cyan-900' : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Active Tab View Rendering */}
      <div>
        {activeTab === 'overview' && (
          <OverviewTab
            kpis={kpis}
            readings={readings}
            anomalies={anomalies}
            refuelings={refuelings}
            onOpenVehicleModal={(vehId) => setSelectedVehicleId(vehId)}
            onOpenEventModal={(anom) => setSelectedAnomaly(anom)}
            onOpenRefuelingModal={() => setIsRefuelingModalOpen(true)}
          />
        )}

        {activeTab === 'live' && (
          <LiveFuelTab
            readings={readings}
            onOpenVehicleModal={(vehId) => setSelectedVehicleId(vehId)}
          />
        )}

        {activeTab === 'consumption' && (
          <ConsumptionTab
            consumptions={consumptions}
            onOpenVehicleModal={(vehId) => setSelectedVehicleId(vehId)}
          />
        )}

        {activeTab === 'refueling' && (
          <RefuelingTab
            refuelings={refuelings}
            onOpenRefuelingModal={() => setIsRefuelingModalOpen(true)}
          />
        )}

        {activeTab === 'drain' && (
          <FuelDrainTab
            drains={drains}
            onOpenEventModal={(anom) => setSelectedAnomaly(anom)}
          />
        )}

        {activeTab === 'anomalies' && (
          <AnomaliesTab
            anomalies={anomalies}
            onOpenEventModal={(anom) => setSelectedAnomaly(anom)}
          />
        )}

        {activeTab === 'cost' && (
          <FuelCostTab
            kpis={kpis}
            budgets={budgets}
            onOpenPriceModal={() => setIsPriceModalOpen(true)}
          />
        )}

        {activeTab === 'analytics' && <AnalyticsTab />}

        {activeTab === 'reports' && <ReportsTab />}

        {activeTab === 'ai-insights' && (
          <AIFuelInsightsTab
            anomalies={anomalies}
            refuelings={refuelings}
            consumptions={consumptions}
          />
        )}

        {activeTab === 'rules' && (
          <RulesTab
            rules={rules}
            onOpenEditRuleModal={(r) => setSelectedRuleToEdit(r)}
          />
        )}
      </div>

      {/* Modals Rendering */}
      <VehicleFuelDetailModal
        vehicleId={selectedVehicleId || ''}
        isOpen={!!selectedVehicleId}
        onClose={() => setSelectedVehicleId(null)}
        readings={readings}
        consumptions={consumptions}
        anomalies={anomalies}
        configs={mockVehicleFuelConfigs}
      />

      <FuelEventDetailModal
        anomaly={selectedAnomaly}
        isOpen={!!selectedAnomaly}
        onClose={() => setSelectedAnomaly(null)}
        onUpdateStatus={handleUpdateAnomalyStatus}
      />

      <ManualRefuelingModal
        isOpen={isRefuelingModalOpen}
        onClose={() => setIsRefuelingModalOpen(false)}
        onSubmit={handleAddRefueling}
      />

      <AddStationModal
        isOpen={isStationModalOpen}
        onClose={() => setIsStationModalOpen(false)}
        onSubmit={(st) => setStations([...stations, st as any])}
      />

      <PriceConfigModal
        isOpen={isPriceModalOpen}
        onClose={() => setIsPriceModalOpen(false)}
        onUpdatePrice={(type, price) => {
          alert(`Harga acuan BBM ${type} diperbarui menjadi Rp ${price.toLocaleString('id-ID')}/Liter`);
        }}
      />

      {selectedRuleToEdit && (
        <RuleEditModal
          rule={selectedRuleToEdit}
          isOpen={!!selectedRuleToEdit}
          onClose={() => setSelectedRuleToEdit(null)}
          onSave={handleSaveRule}
        />
      )}

      <ConcoxAt4SetupModal
        isOpen={isConcoxModalOpen}
        onClose={() => setIsConcoxModalOpen(false)}
      />
    </div>
  );
};
