/**
 * Fleet Intelligence Smart AI - Geofence Header & Control Toolbar
 * Multi-criteria Filter Bar & Action CTAs
 */

import React from 'react';
import { GeofenceFilterState, GeofenceCategory, GeofenceType, GeofencePriority, GeofenceStatus } from '../geofenceTypes';
import {
  Search,
  Plus,
  Download,
  Filter,
  Layers,
  ShieldAlert,
  MapPin,
  RefreshCw
} from 'lucide-react';

interface GeofenceHeaderProps {
  filter: GeofenceFilterState;
  onFilterChange: (newFilter: Partial<GeofenceFilterState>) => void;
  onCreateGeofence: () => void;
  onExportGeoJSON: () => void;
  onRefreshData?: () => void;
}

export const GeofenceHeader: React.FC<GeofenceHeaderProps> = ({
  filter,
  onFilterChange,
  onCreateGeofence,
  onExportGeoJSON,
  onRefreshData
}) => {
  return (
    <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-4 space-y-4">
      {/* Title & Top Action CTAs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight">Geofencing Management</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Pusat pengawasan perimeter geografis, otomatisasi event ENTER/EXIT/DWELL, & integrasi telematika
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {onRefreshData && (
            <button
              onClick={onRefreshData}
              title="Refresh Data"
              className="p-2.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl transition-all"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onExportGeoJSON}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-200 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export GeoJSON</span>
          </button>

          <button
            onClick={onCreateGeofence}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-md shadow-blue-950"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Geofence Baru</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={filter.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="Cari nama, kode GEO, alamat..."
            className="w-full bg-slate-950 border border-slate-800 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <select
            value={filter.category}
            onChange={(e) => onFilterChange({ category: e.target.value as any })}
            className="w-full bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="ALL">Semua Kategori (Category)</option>
            <option value="DEPOT">Depo Armada (Depot)</option>
            <option value="WAREHOUSE">Gudang & Logistics Hub</option>
            <option value="PORT">Pelabuhan (Port)</option>
            <option value="CUSTOMER">Lokasi Pelanggan</option>
            <option value="PROJECT_SITE">Lokasi Proyek Site</option>
            <option value="PARKING">Area Parkir & Rest Area</option>
            <option value="FUEL_STATION">SPBU / Stasiun BBM</option>
            <option value="RESTRICTED_AREA">Zona Terbatas (Restricted)</option>
            <option value="OFFICE">Kantor Cabang</option>
            <option value="CUSTOM">Lainnya (Custom)</option>
          </select>
        </div>

        {/* Type Dropdown */}
        <div>
          <select
            value={filter.type}
            onChange={(e) => onFilterChange({ type: e.target.value as any })}
            className="w-full bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="ALL">Semua Tipe Geometri</option>
            <option value="CIRCLE">Lingkaran (Circle Geofence)</option>
            <option value="POLYGON">Banyak Sisi (Polygon Geofence)</option>
          </select>
        </div>

        {/* Priority Dropdown */}
        <div>
          <select
            value={filter.priority}
            onChange={(e) => onFilterChange({ priority: e.target.value as any })}
            className="w-full bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="ALL">Semua Tingkat Prioritas</option>
            <option value="LOW">Low Priority</option>
            <option value="NORMAL">Normal Priority</option>
            <option value="HIGH">High Priority</option>
            <option value="CRITICAL">Critical Priority</option>
          </select>
        </div>

        {/* Status Dropdown */}
        <div>
          <select
            value={filter.status}
            onChange={(e) => onFilterChange({ status: e.target.value as any })}
            className="w-full bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="ALL">Semua Status Monitor</option>
            <option value="ACTIVE">Aktif (Monitoring)</option>
            <option value="INACTIVE">Non-Aktif (Disabled)</option>
            <option value="ARCHIVED">Diarsip (Archived)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
