/**
 * Fleet Intelligence Smart AI - Trip Management Top Header & Filters
 * PROMPT 15 — Search, Date Presets, Status/Priority Filters & Create CTA
 */

import React from 'react';
import { TripFilterState, PlannedTripStatus, TripPriority } from '../../modules/trips/plannedTripTypes';
import { Vehicle, Driver } from '../../types';
import { Search, Plus, Download, Filter, Navigation, Calendar } from 'lucide-react';

interface TripManagementHeaderProps {
  filter: TripFilterState;
  onFilterChange: (newFilter: Partial<TripFilterState>) => void;
  onExport: () => void;
  onCreateTrip: () => void;
  vehicles: Vehicle[];
  drivers: Driver[];
}

export const TripManagementHeader: React.FC<TripManagementHeaderProps> = ({
  filter,
  onFilterChange,
  onExport,
  onCreateTrip,
  vehicles,
  drivers,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 p-4 sm:p-6 space-y-4 shadow-2xs">
      {/* Title & Main CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 text-white rounded-lg shadow-2xs">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                Trip Management & Dispatch Operasional
              </h1>
              <p className="text-xs text-gray-500">
                Perencanaan rute, penugasan armada & driver, kalkulasi ETA, waypoint & monitoring status operasional.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-2xs transition-all"
          >
            <Download className="w-4 h-4 text-gray-500" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={onCreateTrip}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Trip Baru</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-2">
        {/* Search */}
        <div className="lg:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari Trip #, No Ref, Pelanggan, Plat, Driver, Kota..."
            value={filter.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>

        {/* Date Preset */}
        <div>
          <select
            value={filter.datePreset}
            onChange={(e) => onFilterChange({ datePreset: e.target.value as any })}
            className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-800"
          >
            <option value="TODAY">Hari Ini</option>
            <option value="TOMORROW">Besok</option>
            <option value="THIS_WEEK">Minggu Ini</option>
            <option value="THIS_MONTH">Bulan Ini</option>
            <option value="ALL">Semua Tanggal</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={filter.status}
            onChange={(e) => onFilterChange({ status: e.target.value as any })}
            className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-800"
          >
            <option value="ALL">Semua Status</option>
            <option value="DRAFT">Draft (Konsep)</option>
            <option value="PLANNED">Planned (Terencana)</option>
            <option value="ASSIGNED">Assigned (Ditunjuk)</option>
            <option value="READY">Ready (Siap)</option>
            <option value="DISPATCHED">Dispatched</option>
            <option value="IN_TRANSIT">In Transit (Berjalan)</option>
            <option value="ARRIVED">Arrived (Tiba)</option>
            <option value="COMPLETED">Completed (Selesai)</option>
            <option value="DELAYED">Delayed (Terlambat)</option>
            <option value="CANCELLED">Cancelled (Batal)</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <select
            value={filter.priority}
            onChange={(e) => onFilterChange({ priority: e.target.value as any })}
            className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-800"
          >
            <option value="ALL">Semua Prioritas</option>
            <option value="URGENT">Urgent (Mendesak)</option>
            <option value="HIGH">Tinggi (High)</option>
            <option value="NORMAL">Normal</option>
            <option value="LOW">Rendah (Low)</option>
          </select>
        </div>

        {/* Vehicle Filter */}
        <div>
          <select
            value={filter.vehicleId}
            onChange={(e) => onFilterChange({ vehicleId: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-800"
          >
            <option value="ALL">Semua Kendaraan</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.plateNumber} - {(v as any).name || `${v.brand} ${v.model}`}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
