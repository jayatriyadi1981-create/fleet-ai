/**
 * Fleet Intelligence Smart AI - Vehicle List View Component
 * PROMPT 9 - Master Data Table, Bulk Actions, Search & Filters (/app/fleet/vehicles)
 */

import React, { useState, useEffect, useTransition } from 'react';
import { 
  VehicleExtended, 
  VehicleFilterParams, 
  VehicleGroup, 
  BranchExtended, 
  Department 
} from '../../types/vehicle';
import { vehicleService } from '../../services/vehicleService';
import { useFleet } from '../../context/FleetContext';
import { useToast } from '../ui/Toast';
import { ImportModal } from './ImportExportModal';
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Upload, 
  CheckSquare, 
  Square, 
  MoreVertical, 
  Truck, 
  MapPin, 
  User, 
  Radio, 
  Edit, 
  Eye, 
  Archive, 
  RotateCcw,
  Building2,
  FolderTree,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  AlertTriangle
} from 'lucide-react';

interface VehicleListViewProps {
  onSelectVehicle: (id: string) => void;
  onCreateVehicle: () => void;
  onEditVehicle: (id: string) => void;
}

export const VehicleListView: React.FC<VehicleListViewProps> = ({
  onSelectVehicle,
  onCreateVehicle,
  onEditVehicle,
}) => {
  const { addToast } = useToast();
  const [isPending, startTransition] = useTransition();

  // Master Data & Filtering State
  const [vehicles, setVehicles] = useState<VehicleExtended[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedGpsStatus, setSelectedGpsStatus] = useState('all');
  const [isArchived, setIsArchived] = useState(false);

  // Sorting & Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Dropdowns lists
  const [groups, setGroups] = useState<VehicleGroup[]>([]);
  const [branches, setBranches] = useState<BranchExtended[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  // Modals & Panels
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load Dropdown Options
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [grps, brs, depts] = await Promise.all([
          vehicleService.listGroups(),
          vehicleService.listBranches(),
          vehicleService.listDepartments(),
        ]);
        setGroups(grps);
        setBranches(brs);
        setDepartments(depts);
      } catch (err) {
        console.error('Failed to load master dropdown options', err);
      }
    };
    loadOptions();
  }, []);

  // Fetch Vehicles
  const fetchVehiclesList = async () => {
    try {
      setIsLoading(true);
      const res = await vehicleService.listVehicles({
        branchId: selectedBranch,
        departmentId: selectedDepartment,
        groupId: selectedGroup,
        status: selectedStatus,
        gpsStatus: selectedGpsStatus,
        type: selectedType,
        search: debouncedSearch,
        page,
        pageSize,
        sortBy,
        sortOrder,
        isArchived,
      });

      setVehicles(res.vehicles);
      setTotalCount(res.total);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      addToast({ type: 'error', title: 'Error', message: err.message || 'Gagal memuat kendaraan' });
    } fontally: {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehiclesList();
  }, [
    page,
    pageSize,
    sortBy,
    sortOrder,
    debouncedSearch,
    selectedBranch,
    selectedGroup,
    selectedDepartment,
    selectedStatus,
    selectedGpsStatus,
    selectedType,
    isArchived,
  ]);

  // Bulk Selection Handlers
  const handleSelectAll = () => {
    if (selectedIds.length === vehicles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(vehicles.map((v) => v.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Bulk Operations
  const handleBulkArchive = async () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Arsipkan ${selectedIds.length} kendaraan terpilih?`)) {
      try {
        const count = await vehicleService.bulkArchive(selectedIds);
        addToast({ type: 'success', title: 'Berhasil', message: `${count} kendaraan diarsipkan.` });
        setSelectedIds([]);
        fetchVehiclesList();
      } catch (err: any) {
        addToast({ type: 'error', title: 'Gagal', message: err.message || 'Gagal mengarsipkan' });
      }
    }
  };

  const handleExportCsv = () => {
    const csvData = vehicleService.exportVehiclesToCsv(vehicles);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Master_Kendaraan_Fleet_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast({ type: 'success', title: 'Export Berhasil', message: 'Data kendaraan berhasil diunduh dalam format CSV.' });
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Master CTAs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">Master Data Kendaraan & GPS Telematika</h1>
            <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-xs font-mono font-bold text-cyan-300 border border-cyan-500/30">
              {totalCount} Units
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Kelola inventarisasi armada, status operasional real-time, sensor IoT, dan alokasi cabang.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setIsImportOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
          >
            <Upload className="h-4 w-4 text-emerald-400" />
            Import CSV
          </button>
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
          >
            <Download className="h-4 w-4 text-cyan-400" />
            Export CSV
          </button>
          <button
            onClick={onCreateVehicle}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-950/50"
          >
            <Plus className="h-4 w-4" />
            Tambah Kendaraan Baru
          </button>
        </div>
      </div>

      {/* Search Bar & Quick Filter Chips */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3.5 sm:p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari Plat Nomor (e.g. B 9482 UTX), Nama, VIN, Rangka, Driver, Cabang..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition-colors ${
                isFilterPanelOpen
                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300'
                  : 'border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filter Lanjutan
            </button>

            <button
              onClick={() => setIsArchived(!isArchived)}
              className={`rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition-colors ${
                isArchived
                  ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {isArchived ? 'Terarsip' : 'Aktif'}
            </button>
          </div>
        </div>

        {/* Extended Filter Drawer/Panel */}
        {isFilterPanelOpen && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Cabang / Depo</label>
              <select
                value={selectedBranch}
                onChange={(e) => {
                  setSelectedBranch(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
              >
                <option value="all">Semua Cabang (All)</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Grup Armada</label>
              <select
                value={selectedGroup}
                onChange={(e) => {
                  setSelectedGroup(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
              >
                <option value="all">Semua Grup (All)</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Status Operasional</label>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
              >
                <option value="all">Semua Status</option>
                <option value="moving">Berjalan (Moving)</option>
                <option value="idle">Mesin Menyala (Idle)</option>
                <option value="under_maintenance">Pemeliharaan (Bengkel)</option>
                <option value="offline">GPS Offline</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Status GPS IoT</label>
              <select
                value={selectedGpsStatus}
                onChange={(e) => {
                  setSelectedGpsStatus(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
              >
                <option value="all">Semua Sensor GPS</option>
                <option value="online">Online & Terhubung</option>
                <option value="offline">Offline / Loss Signal</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-3 px-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-cyan-300">{selectedIds.length} kendaraan dipilih</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleBulkArchive}
              className="flex items-center gap-1.5 rounded-lg bg-rose-500/20 px-3 py-1.5 text-xs font-bold text-rose-300 border border-rose-500/30 hover:bg-rose-500/30"
            >
              <Archive className="h-3.5 w-3.5" />
              Arsipkan Terpilih
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="text-slate-400 hover:text-white"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden lg:block rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950/60 font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="p-3.5 text-center w-10">
                  <button onClick={handleSelectAll}>
                    {selectedIds.length === vehicles.length && vehicles.length > 0 ? (
                      <CheckSquare className="h-4 w-4 text-cyan-400" />
                    ) : (
                      <Square className="h-4 w-4 text-slate-600" />
                    )}
                  </button>
                </th>
                <th className="p-3.5">Plat Nomor / Kode</th>
                <th className="p-3.5">Nama Kendaraan & Spesifikasi</th>
                <th className="p-3.5">Cabang & Grup Armada</th>
                <th className="p-3.5">Pengemudi (Driver)</th>
                <th className="p-3.5 text-center">Status Operasional</th>
                <th className="p-3.5 text-center">Status GPS</th>
                <th className="p-3.5 text-right">Odometer</th>
                <th className="p-3.5 text-center w-12">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-slate-400">
                    <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
                    <p className="mt-2 text-xs">Memuat data kendaraan...</p>
                  </td>
                </tr>
              ) : vehicles.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-slate-400 space-y-2">
                    <Truck className="mx-auto h-8 w-8 text-slate-600" />
                    <p className="font-bold text-white">Tidak Ada Kendaraan Ditemukan</p>
                    <p className="text-xs text-slate-500">
                      Coba sesuaikan kata kunci pencarian atau reset filter tambahan.
                    </p>
                  </td>
                </tr>
              ) : (
                vehicles.map((v) => {
                  const isSelected = selectedIds.includes(v.id);
                  return (
                    <tr
                      key={v.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isSelected ? 'bg-cyan-950/10' : ''
                      }`}
                    >
                      <td className="p-3.5 text-center">
                        <button onClick={() => handleToggleSelect(v.id)}>
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-cyan-400" />
                          ) : (
                            <Square className="h-4 w-4 text-slate-600" />
                          )}
                        </button>
                      </td>

                      <td className="p-3.5">
                        <div className="space-y-0.5">
                          <button
                            onClick={() => onSelectVehicle(v.id)}
                            className="font-mono font-bold text-cyan-300 hover:underline block text-left"
                          >
                            {v.licensePlate}
                          </button>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            {v.vehicleCode}
                          </span>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div>
                          <p className="font-bold text-white">{v.name}</p>
                          <p className="text-[10px] text-slate-400">
                            {v.brand} {v.model} ({v.year}) • <span className="capitalize">{v.type.replace('_', ' ')}</span>
                          </p>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div>
                          <p className="font-semibold text-slate-200">{v.branchName}</p>
                          <p className="text-[10px] text-cyan-400">{v.groupName}</p>
                        </div>
                      </td>

                      <td className="p-3.5">
                        {v.primaryDriverName ? (
                          <div className="flex items-center gap-1.5 text-slate-200">
                            <User className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                            <span>{v.primaryDriverName}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px] italic">Belum Ditugaskan</span>
                        )}
                      </td>

                      <td className="p-3.5 text-center">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            v.status === 'moving'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : v.status === 'idle'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : v.status === 'under_maintenance'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          ● {v.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="p-3.5 text-center">
                        <span
                          className={`inline-flex items-center gap-1 font-mono text-[11px] font-semibold ${
                            v.gpsStatus === 'online' ? 'text-emerald-400' : 'text-slate-500'
                          }`}
                        >
                          <Radio className="h-3 w-3" />
                          {v.gpsStatus.toUpperCase()}
                        </span>
                      </td>

                      <td className="p-3.5 text-right font-mono font-semibold text-slate-200">
                        {v.odometerKm.toLocaleString('id-ID')} KM
                      </td>

                      <td className="p-3.5 text-center relative">
                        <button
                          onClick={() => onSelectVehicle(v.id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                          title="Lihat Detail Profil"
                        >
                          <Eye className="h-4 w-4 text-cyan-400" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card Layout */}
      <div className="lg:hidden space-y-3">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400">Memuat data...</div>
        ) : (
          vehicles.map((v) => (
            <div
              key={v.id}
              onClick={() => onSelectVehicle(v.id)}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-3 cursor-pointer hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-cyan-300 text-sm block">
                    {v.licensePlate}
                  </span>
                  <span className="text-[10px] text-slate-400">{v.vehicleCode}</span>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                    v.status === 'moving' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {v.status}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-white text-xs">{v.name}</h3>
                <p className="text-[11px] text-slate-400">{v.branchName} • {v.groupName}</p>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                <span className="text-slate-400">Driver: <strong className="text-white">{v.primaryDriverName || 'Belum Ada'}</strong></span>
                <span className="font-mono text-cyan-300">{v.odometerKm.toLocaleString()} KM</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <p className="text-xs text-slate-400">
          Menampilkan <strong className="text-white">{vehicles.length}</strong> dari{' '}
          <strong className="text-white">{totalCount}</strong> total armada
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-mono font-bold text-white px-2">
            Halaman {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Import Modal */}
      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onSuccess={fetchVehiclesList}
      />
    </div>
  );
};
