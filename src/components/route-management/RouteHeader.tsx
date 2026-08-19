/**
 * Fleet Intelligence Smart AI - Route Management Header & Search Filters
 * PROMPT 16 — Dynamic Search, Multi-Level Filters & Creation Trigger
 */

import React from 'react';
import { RouteFilterState, RouteStatus, RouteType, RouteOptimizationStatus, RoutePriority } from '../../modules/routes/routeTypes';
import { Search, Plus, Download, Waypoints, Filter, AlertTriangle, Sparkles } from 'lucide-react';

interface RouteHeaderProps {
  filter: RouteFilterState;
  onFilterChange: (newFilter: Partial<RouteFilterState>) => void;
  onExport: () => void;
  onCreateRoute: () => void;
  onOptimizeAll?: () => void;
}

export const RouteHeader: React.FC<RouteHeaderProps> = ({
  filter,
  onFilterChange,
  onExport,
  onCreateRoute,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-2xs">
      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4">
        {/* Title & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xs">
              <Waypoints className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                Route Management & Master Routes
              </h1>
              <p className="text-xs text-gray-500">
                Pusat pengelolaan rute armada, optimasi multi-objective, pembatasan jalan, rute alternatif & versi rute master.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 shadow-2xs transition-colors"
            >
              <Download className="w-4 h-4 text-gray-500" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onCreateRoute}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Rute Master</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari kode rute (RT-...), nama rute, origin, destination..."
              value={filter.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder:text-gray-400 bg-gray-50/50"
            />
          </div>

          {/* Status Dropdown */}
          <div>
            <select
              value={filter.status}
              onChange={(e) => onFilterChange({ status: e.target.value as any })}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white"
            >
              <option value="ALL">Semua Status Rute</option>
              <option value="ACTIVE">ACTIVE (Aktif)</option>
              <option value="PLANNED">PLANNED (Direncanakan)</option>
              <option value="DRAFT">DRAFT (Konsep)</option>
              <option value="INACTIVE">INACTIVE (Nonaktif)</option>
              <option value="ARCHIVED">ARCHIVED (Diarsipkan)</option>
            </select>
          </div>

          {/* Route Type Dropdown */}
          <div>
            <select
              value={filter.routeType}
              onChange={(e) => onFilterChange({ routeType: e.target.value as any })}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white"
            >
              <option value="ALL">Semua Tipe Rute</option>
              <option value="ONE_WAY">ONE_WAY (Satu Arah)</option>
              <option value="ROUND_TRIP">ROUND_TRIP (Bolak-Balik)</option>
              <option value="MULTI_STOP">MULTI_STOP (Multi-Waypoint)</option>
              <option value="RECURRING">RECURRING (Rutin Harian)</option>
              <option value="CUSTOM">CUSTOM (Kustom)</option>
            </select>
          </div>

          {/* Optimization Status Dropdown */}
          <div>
            <select
              value={filter.optimizationStatus}
              onChange={(e) => onFilterChange({ optimizationStatus: e.target.value as any })}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white"
            >
              <option value="ALL">Semua Status Optimasi</option>
              <option value="OPTIMIZED">OPTIMIZED (Teroptimasi AI)</option>
              <option value="PARTIALLY_OPTIMIZED">PARTIALLY_OPTIMIZED</option>
              <option value="NOT_OPTIMIZED">NOT_OPTIMIZED (Standar)</option>
            </select>
          </div>
        </div>

        {/* Quick Checkbox Badges Filter */}
        <div className="flex items-center gap-4 text-xs font-medium text-gray-600 pt-1">
          <label className="flex items-center gap-2 cursor-pointer hover:text-gray-900">
            <input
              type="checkbox"
              checked={filter.hasDeviation}
              onChange={(e) => onFilterChange({ hasDeviation: e.target.checked })}
              className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
            />
            <span className="flex items-center gap-1.5 text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Tampilkan Hanya Rute Terdeteksi Deviasi
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};
