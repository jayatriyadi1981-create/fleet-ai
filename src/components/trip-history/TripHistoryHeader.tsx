/**
 * Fleet Intelligence Smart AI - Trip History Header
 * PROMPT 14 — Search, Presets, Filters & Export Bar
 */

import React from 'react';
import { Search, Calendar, Filter, Download, Route, RefreshCw, ChevronDown } from 'lucide-react';
import { TripFilterState, TripStatus } from '../../modules/trips/types';
import { Vehicle, Driver, Branch } from '../../types';

interface TripHistoryHeaderProps {
  filter: TripFilterState;
  onFilterChange: (newFilter: Partial<TripFilterState>) => void;
  onExport: (format: 'CSV' | 'EXCEL' | 'PDF') => void;
  vehicles: Vehicle[];
  drivers: Driver[];
  branches: Branch[];
  totalTripsCount: number;
}

export const TripHistoryHeader: React.FC<TripHistoryHeaderProps> = ({
  filter,
  onFilterChange,
  onExport,
  vehicles,
  drivers,
  branches,
  totalTripsCount,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title & Badge */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 shadow-2xs">
            <Route className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Riwayat Perjalanan & Route Playback</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                {totalTripsCount} Perjalanan
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Analisis telemetry histori, pemutaran rute animasi, dan deteksi anomali perjalanan armada
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Export Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-2xs">
              <Download className="w-4 h-4 text-gray-500" />
              <span>Ekspor Data</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>
            <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg hidden group-hover:block z-50 py-1">
              <button
                onClick={() => onExport('CSV')}
                className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors"
              >
                Format CSV (.csv)
              </button>
              <button
                onClick={() => onExport('EXCEL')}
                className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors"
              >
                Format Excel (.xlsx)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={filter.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="Cari nopol, no trip, driver, alamat..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden bg-gray-50/50"
          />
        </div>

        {/* Date Presets */}
        <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200 text-xs font-medium">
          {(['TODAY', 'YESTERDAY', 'LAST_7_DAYS', 'LAST_30_DAYS'] as const).map((preset) => {
            const labels: Record<string, string> = {
              TODAY: 'Hari Ini',
              YESTERDAY: 'Kemarin',
              LAST_7_DAYS: '7 Hari',
              LAST_30_DAYS: '30 Hari',
            };
            const active = filter.datePreset === preset;
            return (
              <button
                key={preset}
                onClick={() => onFilterChange({ datePreset: preset })}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  active
                    ? 'bg-white text-blue-600 shadow-2xs font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {labels[preset]}
              </button>
            );
          })}
        </div>

        {/* Vehicle Filter */}
        <select
          value={filter.vehicleId}
          onChange={(e) => onFilterChange({ vehicleId: e.target.value })}
          className="px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 outline-hidden"
        >
          <option value="ALL">Semua Kendaraan</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.plateNumber} - {v.model}
            </option>
          ))}
        </select>

        {/* Driver Filter */}
        <select
          value={filter.driverId}
          onChange={(e) => onFilterChange({ driverId: e.target.value })}
          className="px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 outline-hidden"
        >
          <option value="ALL">Semua Pengemudi</option>
          {drivers.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={filter.status}
          onChange={(e) => onFilterChange({ status: e.target.value as any })}
          className="px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 outline-hidden"
        >
          <option value="ALL">Semua Status</option>
          <option value="ACTIVE">Aktif (Sedang Jalan)</option>
          <option value="COMPLETED">Selesai</option>
          <option value="INCOMPLETE">Tidak Lengkap</option>
          <option value="CANCELLED">Dibatalkan</option>
        </select>

        {/* Reset Filter Button */}
        <button
          onClick={() =>
            onFilterChange({
              searchQuery: '',
              datePreset: 'TODAY',
              vehicleId: 'ALL',
              driverId: 'ALL',
              branchId: 'ALL',
              status: 'ALL',
            })
          }
          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Reset Filter"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
