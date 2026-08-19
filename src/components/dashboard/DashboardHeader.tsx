/**
 * Fleet Intelligence Smart AI - Smart Dashboard Header
 * PROMPT 8 - Header with Greeting, Time Period, Fleet & Branch Filters, Refresh State
 */

import React from 'react';
import { 
  Calendar, 
  Filter, 
  RotateCw, 
  Building2, 
  Truck, 
  Clock, 
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';
import { DateRangeOption, DashboardFilterState } from '../../types/dashboard';
import { useFleet } from '../../context/FleetContext';
import { mockBranches } from '../../constants/mockData';

interface DashboardHeaderProps {
  filterState: DashboardFilterState;
  onFilterChange: (update: Partial<DashboardFilterState>) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdatedText: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  filterState,
  onFilterChange,
  onRefresh,
  isRefreshing,
  lastUpdatedText,
}) => {
  const { currentUser } = useFleet();

  // Dynamic Greeting based on current time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const dateOptions: { label: string; value: DateRangeOption }[] = [
    { label: 'Hari Ini', value: 'today' },
    { label: 'Kemarin', value: 'yesterday' },
    { label: '7 Hari Terakhir', value: 'last_7_days' },
    { label: '30 Hari Terakhir', value: 'last_30_days' },
    { label: 'Bulan Ini', value: 'this_month' },
    { label: 'Bulan Lalu', value: 'last_month' },
    { label: 'Rentang Kustom', value: 'custom' },
  ];

  const fleetGroups = [
    { id: 'all', label: 'Semua Armada' },
    { id: 'Armada Trans-Jawa', label: 'Armada Trans-Jawa' },
    { id: 'Armada Jabodetabek', label: 'Armada Jabodetabek' },
    { id: 'Tangki BBM', label: 'Armada Tangki BBM' },
    { id: 'Logistik Pendingin', label: 'Logistik Pendingin' },
  ];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-md shadow-xl">
      {/* Top Title & User Greeting */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">Dashboard Operasional</h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-400 border border-cyan-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Realtime AI Command Center
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            {getGreeting()}, <span className="font-semibold text-white">{currentUser?.name || 'Budi'}</span> 👋 Here's your fleet performance overview today.
          </p>
        </div>

        {/* Live Refresh Status & Timestamp */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
            <Clock className="h-3.5 w-3.5 text-cyan-400" />
            <span>Terakhir diperbarui: <span className="text-slate-200 font-medium">{lastUpdatedText}</span></span>
          </div>

          <button
            id="btn-refresh-dashboard"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-3.5 py-2 text-xs font-semibold text-white border border-slate-700 transition-all active:scale-95 disabled:opacity-50"
            title="Muat ulang data telemetry & KPI"
          >
            <RotateCw className={`h-3.5 w-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Memperbarui...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-slate-800/80">
        {/* Date Filter */}
        <div className="relative">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
            <Calendar className="h-3 w-3 text-cyan-400" /> Rentang Waktu
          </label>
          <select
            id="select-dashboard-date-range"
            value={filterState.dateRange}
            onChange={(e) => onFilterChange({ dateRange: e.target.value as DateRangeOption })}
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-medium text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            {dateOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Fleet Group Filter */}
        <div className="relative">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
            <Truck className="h-3 w-3 text-cyan-400" /> Kelompok Armada
          </label>
          <select
            id="select-dashboard-fleet-group"
            value={filterState.fleetGroup}
            onChange={(e) => onFilterChange({ fleetGroup: e.target.value })}
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-medium text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            {fleetGroups.map((grp) => (
              <option key={grp.id} value={grp.id} className="bg-slate-900 text-white">
                {grp.label}
              </option>
            ))}
          </select>
        </div>

        {/* Branch Filter */}
        <div className="relative">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
            <Building2 className="h-3 w-3 text-cyan-400" /> Cabang / Depo
          </label>
          <select
            id="select-dashboard-branch"
            value={filterState.branchId}
            onChange={(e) => onFilterChange({ branchId: e.target.value })}
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-medium text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="all" className="bg-slate-900 text-white">Semua Cabang (HQ & Regional)</option>
            {mockBranches.map((b) => (
              <option key={b.id} value={b.id} className="bg-slate-900 text-white">
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Filter Reset / Active Scope Status */}
        <div className="flex items-end">
          <div className="flex w-full items-center justify-between rounded-xl bg-slate-950/80 border border-slate-800 px-3 py-2 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <SlidersHorizontal className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
              <span className="truncate text-[11px]">
                {filterState.fleetGroup !== 'all' || filterState.branchId !== 'all' ? 'Filter Aktif' : 'Semua Scope'}
              </span>
            </div>
            {(filterState.fleetGroup !== 'all' || filterState.branchId !== 'all' || filterState.dateRange !== 'today') && (
              <button
                onClick={() => onFilterChange({ dateRange: 'today', fleetGroup: 'all', branchId: 'all' })}
                className="text-[10px] font-bold text-cyan-400 hover:underline shrink-0"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
