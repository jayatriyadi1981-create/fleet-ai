/**
 * Fleet Intelligence Smart AI - Cost Module Tab Navigation
 * PROMPT 37 - 15 Modular Navigation Tabs with Badge Indicators
 */

import React from 'react';
import {
  LayoutDashboard,
  Fuel,
  Wrench,
  Users,
  Gauge,
  Navigation,
  PieChart,
  Truck,
  Building2,
  GitFork,
  TrendingUp,
  Share2,
  Sparkles,
  Zap,
  FileCheck,
} from 'lucide-react';
import { useCost, CostTabKey } from '../context/CostContext';

interface TabItem {
  key: CostTabKey;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
}

export const CostTabBar: React.FC = () => {
  const { activeTab, setActiveTab, aiInsights, reconciliationItems } = useCost();

  const activeAnomalyCount = reconciliationItems.filter((r) => r.status === 'SUSPICIOUS_SPIKE' || r.status === 'FLAGGED').length;
  const highPriorityInsightsCount = aiInsights.filter((i) => i.severity === 'CRITICAL' || i.severity === 'HIGH').length;

  const tabs: TabItem[] = [
    { key: 'dashboard', label: 'Executive Dashboard', shortLabel: 'Dashboard', icon: LayoutDashboard },
    { key: 'fuel', label: 'Biaya BBM & Bahan Bakar', shortLabel: 'BBM', icon: Fuel },
    { key: 'maintenance', label: 'Biaya Pemeliharaan & Bengkel', shortLabel: 'Pemeliharaan', icon: Wrench },
    { key: 'driver', label: 'Biaya & Kompensasi Driver', shortLabel: 'Driver', icon: Users },
    { key: 'per_km', label: 'Biaya per KM (Cost / KM)', shortLabel: 'Cost / KM', icon: Gauge },
    { key: 'per_trip', label: 'Biaya per Trip', shortLabel: 'Cost / Trip', icon: Navigation },
    { key: 'operating', label: 'Total Biaya Operasional (TOC)', shortLabel: 'Total TOC', icon: PieChart },
    { key: 'vehicles', label: 'Biaya per Kendaraan (TCO)', shortLabel: 'Kendaraan', icon: Truck },
    { key: 'branches', label: 'Biaya per Cabang & Depo', shortLabel: 'Cabang', icon: Building2 },
    { key: 'routes', label: 'Biaya per Koridor Rute', shortLabel: 'Rute', icon: GitFork },
    { key: 'trends', label: 'Tren & Variansi Anggaran', shortLabel: 'Tren & Budget', icon: TrendingUp },
    { key: 'allocation', label: 'Alokasi Biaya', shortLabel: 'Alokasi', icon: Share2 },
    { key: 'forecast', label: 'Proyeksi & Prediksi Biaya', shortLabel: 'Forecast', icon: Sparkles },
    {
      key: 'ai_insights',
      label: 'AI Cost Intelligence & Rekomendasi',
      shortLabel: 'AI Insights',
      icon: Zap,
      badge: highPriorityInsightsCount > 0 ? highPriorityInsightsCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      key: 'reports',
      label: 'Buku Kas & Audit Rekonsiliasi',
      shortLabel: 'Audit & Kas',
      icon: FileCheck,
      badge: activeAnomalyCount > 0 ? `${activeAnomalyCount} audit` : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    },
  ];

  return (
    <div className="bg-slate-900/90 border-b border-slate-800 px-4 lg:px-6 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700">
      <nav className="flex space-x-1 min-w-max py-2" aria-label="Cost Analytics Tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{tab.shortLabel}</span>

              {tab.badge && (
                <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${tab.badgeColor || 'bg-slate-700 text-slate-200'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
