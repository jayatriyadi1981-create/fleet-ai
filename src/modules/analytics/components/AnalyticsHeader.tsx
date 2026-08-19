/**
 * Fleet Intelligence Smart AI - Analytics Header & Navigation
 * PROMPT 36
 */

import React from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Truck,
  Activity,
  Navigation,
  Clock,
  AlertTriangle,
  Award,
  Users,
  Building2,
  Sparkles,
  FileText,
  Filter,
  Download,
  Plus,
  Calendar,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';
import { AnalyticsTab, DateRangePreset, IndustryProfileType } from '../types';
import { INDUSTRY_PROFILE_CONFIGS } from '../data/mockAnalyticsData';
import { useAuthorization } from '../../../hooks/useAuthorization';

interface TabItem {
  key: AnalyticsTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string;
}

const TABS: TabItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: BarChart3, permission: 'analytics.view' },
  { key: 'fleet', label: 'Fleet Performance', icon: Activity, permission: 'analytics.view' },
  { key: 'utilization', label: 'Utilisasi Armada', icon: PieChart, permission: 'analytics.view' },
  { key: 'productivity', label: 'Produktivitas', icon: Award, permission: 'analytics.view' },
  { key: 'mileage', label: 'Jarak & Rekonsiliasi', icon: Navigation, permission: 'analytics.view' },
  { key: 'trips', label: 'Analitik Trip', icon: Truck, permission: 'analytics.view' },
  { key: 'idle', label: 'Waktu Idle & BBM', icon: Clock, permission: 'analytics.view' },
  { key: 'downtime', label: 'Downtime & MTTR', icon: AlertTriangle, permission: 'analytics.view' },
  { key: 'vehicles', label: 'Ranking Kendaraan', icon: Truck, permission: 'analytics.view' },
  { key: 'drivers', label: 'Performa Driver', icon: Users, permission: 'analytics.view_driver' },
  { key: 'branches', label: 'Komparasi Cabang', icon: Building2, permission: 'analytics.view_branch' },
  { key: 'trends', label: 'Analisis Tren', icon: TrendingUp, permission: 'analytics.view' },
  { key: 'ai-insights', label: 'AI Intelligence', icon: Sparkles, permission: 'analytics.view_ai' },
  { key: 'reports', label: 'Laporan & Ekspor', icon: FileText, permission: 'analytics.view' },
];

export const AnalyticsHeader: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    filter,
    setFilter,
    industryProfile,
    setIndustryProfile,
    setIsFilterDrawerOpen,
    setIsCustomKpiModalOpen,
    exportCurrentData,
  } = useAnalytics();

  const { hasPermission } = useAuthorization();

  const datePresets: { key: DateRangePreset; label: string }[] = [
    { key: 'today', label: 'Hari Ini' },
    { key: 'yesterday', label: 'Kemarin' },
    { key: 'this_week', label: 'Minggu Ini' },
    { key: 'this_month', label: 'Bulan Ini' },
    { key: 'last_month', label: 'Bulan Lalu' },
  ];

  const activeFiltersCount =
    filter.branchIds.length +
    filter.vehicleGroupIds.length +
    filter.vehicleIds.length +
    filter.driverIds.length +
    (filter.datePreset === 'custom' ? 1 : 0);

  return (
    <header className="space-y-4 border-b border-slate-800 bg-slate-950 px-4 pt-4 sm:px-6 lg:px-8">
      {/* Top Banner */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 text-white shadow-lg shadow-cyan-500/20">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Fleet Analytics & Performance Intelligence
                </h1>
                <span className="inline-flex items-center rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-400 border border-cyan-500/20">
                  PROMPT 36
                </span>
              </div>
              <p className="text-xs text-slate-400 sm:text-sm">
                Pusat intelijen analitik utilisasi, produktivitas, rekonsiliasi jarak, idle, downtime, dan AI Insights armada.
              </p>
            </div>
          </div>
        </div>

        {/* Global Filter Bar Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Industry Profile Selector */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300">
            <Layers className="h-4 w-4 text-cyan-400" />
            <span className="text-slate-400">Profil Industri:</span>
            <select
              value={industryProfile}
              onChange={(e) => setIndustryProfile(e.target.value as IndustryProfileType)}
              className="bg-transparent font-medium text-white outline-none cursor-pointer"
            >
              {Object.entries(INDUSTRY_PROFILE_CONFIGS).map(([key, config]) => (
                <option key={key} value={key} className="bg-slate-900 text-white">
                  {config.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Date Range Pills */}
          <div className="hidden sm:flex items-center rounded-xl border border-slate-800 bg-slate-900 p-1">
            {datePresets.map((preset) => (
              <button
                key={preset.key}
                onClick={() => setFilter((prev) => ({ ...prev, datePreset: preset.key }))}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  filter.datePreset === preset.key
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Advanced Filter Drawer Button */}
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-200 hover:border-slate-700 hover:bg-slate-850 transition-all"
          >
            <Filter className="h-3.5 w-3.5 text-cyan-400" />
            <span>Filter</span>
            {activeFiltersCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-slate-950">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Custom KPI Button (RBAC protected) */}
          {hasPermission('analytics.create_kpi') && (
            <button
              onClick={() => setIsCustomKpiModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-xs font-medium text-indigo-300 hover:bg-indigo-500/20 transition-all"
            >
              <Plus className="h-3.5 w-3.5 text-indigo-400" />
              <span>Custom KPI</span>
            </button>
          )}

          {/* Export Button (RBAC protected) */}
          {hasPermission('analytics.export') && (
            <button
              onClick={() => exportCurrentData('CSV')}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-2 text-xs font-bold text-slate-950 hover:brightness-110 shadow-md shadow-cyan-500/10 transition-all"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Ekspor</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <nav className="no-scrollbar flex space-x-1 overflow-x-auto pb-2 pt-1 border-t border-slate-900/60">
        {TABS.map((tab) => {
          if (tab.permission && !hasPermission(tab.permission)) {
            return null;
          }
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
