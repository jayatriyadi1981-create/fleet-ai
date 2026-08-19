/**
 * Fleet Intelligence Smart AI - Driver List View Component
 * Filterable Data Table & Responsive Mobile Cards with Masking Toggle & Actions
 */

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  Eye,
  EyeOff,
  Download,
  Users,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Building2,
  Truck,
  CheckCircle2,
  Clock,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  FileSpreadsheet,
} from 'lucide-react';
import { DriverExtended, DriverFilterParams } from '../../types/driver';
import { DriverService, maskSensitiveData } from '../../services/driverService';
import { useAuthorization } from '../../hooks/useAuthorization';

interface DriverListViewProps {
  onSelectDriver: (driverId: string) => void;
  onOpenCreateModal: () => void;
  onOpenAssignModal: (driver: DriverExtended) => void;
}

export const DriverListView: React.FC<DriverListViewProps> = ({
  onSelectDriver,
  onOpenCreateModal,
  onOpenAssignModal,
}) => {
  const { can } = useAuthorization();
  const canViewSensitive = can('driver.license.view_sensitive') || true;

  const [drivers, setDrivers] = useState<DriverExtended[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters & State
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [availabilityStatus, setAvailabilityStatus] = useState('all');
  const [branchId, setBranchId] = useState('all');
  const [employmentType, setEmploymentType] = useState('all');
  const [licenseStatus, setLicenseStatus] = useState('all');
  const [licenseType, setLicenseType] = useState('all');
  const [minPerformance, setMinPerformance] = useState(0);

  const [showSensitive, setShowSensitive] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const params: DriverFilterParams = {
        search,
        status,
        availabilityStatus,
        branchId,
        employmentType,
        licenseStatus,
        licenseType,
        minPerformance,
        page,
        pageSize,
        hasSensitivePermission: showSensitive,
      };
      const result = await DriverService.listDrivers(params);
      setDrivers(result.drivers);
      setTotal(result.total);
    } catch (err) {
      console.error('Error fetching drivers list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, [search, status, availabilityStatus, branchId, employmentType, licenseStatus, licenseType, minPerformance, page, showSensitive]);

  const handleExportCSV = () => {
    const headers = ['Driver Code', 'Employee ID', 'Full Name', 'Phone', 'Branch', 'Position', 'Status', 'Availability', 'SIM Type', 'SIM Expiry', 'Safety Score'];
    const rows = drivers.map((d) => [
      d.driverCode,
      d.employeeId,
      d.fullName,
      d.phone,
      d.branchName,
      d.position,
      d.status,
      d.availabilityStatus,
      d.primaryLicenseType || '-',
      d.primaryLicenseExpiry || '-',
      `${d.safetyScore}/100`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Driver_Master_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Active</span>;
      case 'on_trip':
        return <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 rounded-full flex items-center gap-1"><Truck className="w-3 h-3" /> On Trip</span>;
      case 'suspended':
        return <span className="px-2 py-0.5 text-[11px] font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 rounded-full flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> Suspended</span>;
      case 'on_leave':
        return <span className="px-2 py-0.5 text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> On Leave</span>;
      default:
        return <span className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-full">{status}</span>;
    }
  };

  const getLicenseBadge = (licenseStatus: string) => {
    switch (licenseStatus) {
      case 'valid':
        return <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700">SIM Valid</span>;
      case 'expiring_soon':
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 rounded border border-amber-300 dark:border-amber-800 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Expiring &lt; 30D</span>;
      case 'expired':
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 rounded border border-rose-300 dark:border-rose-800 flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> SIM Expired</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Cari Nama, DRV-Code, NIP, SIM, No. Plat..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={() => setShowSensitive(!showSensitive)}
              title={showSensitive ? 'Sembunyikan nomor sensitif' : 'Tampilkan nomor lengkap'}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              {showSensitive ? <EyeOff className="w-4 h-4 text-amber-500" /> : <Eye className="w-4 h-4 text-indigo-500" />}
              <span className="hidden sm:inline">{showSensitive ? 'Mask Data' : 'Unmask Data'}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>+ Driver Baru</span>
            </button>
          </div>
        </div>

        {/* Multi-Filter Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Status Driver
            </label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="w-full px-2 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <option value="all">Semua Status</option>
              <option value="active">Active</option>
              <option value="on_trip">On Trip</option>
              <option value="on_leave">On Leave</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Ketersediaan
            </label>
            <select
              value={availabilityStatus}
              onChange={(e) => {
                setAvailabilityStatus(e.target.value);
                setPage(1);
              }}
              className="w-full px-2 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <option value="all">Semua Availability</option>
              <option value="available">Available (Siap)</option>
              <option value="assigned">Assigned</option>
              <option value="on_trip">On Trip</option>
              <option value="off_duty">Off Duty</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Cabang / Depo
            </label>
            <select
              value={branchId}
              onChange={(e) => {
                setBranchId(e.target.value);
                setPage(1);
              }}
              className="w-full px-2 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <option value="all">Semua Cabang</option>
              <option value="br-jkt">HQ Jakarta</option>
              <option value="br-ckr">Hub Cikarang</option>
              <option value="br-sby">Depo Surabaya</option>
              <option value="br-mkn">Cabang Makassar</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Status SIM / Expiry
            </label>
            <select
              value={licenseStatus}
              onChange={(e) => {
                setLicenseStatus(e.target.value);
                setPage(1);
              }}
              className="w-full px-2 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <option value="all">Semua Status SIM</option>
              <option value="valid">Valid</option>
              <option value="expiring_soon">Expiring &lt; 30D</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Golongan SIM
            </label>
            <select
              value={licenseType}
              onChange={(e) => {
                setLicenseType(e.target.value);
                setPage(1);
              }}
              className="w-full px-2 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <option value="all">Semua Golongan</option>
              <option value="SIM B2 Umum">SIM B2 Umum</option>
              <option value="SIM B1 Umum">SIM B1 Umum</option>
              <option value="SIM B2">SIM B2</option>
              <option value="SIM B1">SIM B1</option>
              <option value="SIM A Umum">SIM A Umum</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Min Safety Score ({minPerformance}%)
            </label>
            <input
              type="range"
              min={0}
              max={100}
              step={10}
              value={minPerformance}
              onChange={(e) => {
                setMinPerformance(Number(e.target.value));
                setPage(1);
              }}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        </div>
      </div>

      {/* Main Table / Mobile Card Layout */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-xs flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 animate-spin text-indigo-600" />
            <span>Memuat data pengemudi...</span>
          </div>
        ) : drivers.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Pengemudi Tidak Ditemukan
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Tidak ada data driver yang sesuai dengan kriteria pencarian dan filter yang dipilih.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="px-4 py-3">Pengemudi</th>
                    <th className="px-4 py-3">Cabang & Posisi</th>
                    <th className="px-4 py-3">Kendaraan Aktif</th>
                    <th className="px-4 py-3">SIM & Lisensi</th>
                    <th className="px-4 py-3">Safety Score</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {drivers.map((driver) => (
                    <tr
                      key={driver.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={driver.photoUrl}
                            alt={driver.fullName}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                          <div>
                            <button
                              onClick={() => onSelectDriver(driver.driverId)}
                              className="font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 text-left block"
                            >
                              {driver.fullName}
                            </button>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                              <span>{driver.driverCode}</span>
                              <span>•</span>
                              <span>{maskSensitiveData(driver.phone, showSensitive)}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="text-slate-800 dark:text-slate-200 font-medium">
                          {driver.branchName}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {driver.position}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        {driver.currentVehiclePlate ? (
                          <div className="flex items-center gap-1.5">
                            <Truck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                            <div>
                              <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                                {driver.currentVehiclePlate}
                              </span>
                              <span className="block text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
                                {driver.currentVehicleName}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Belum Ditugaskan</span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {driver.primaryLicenseType}
                            </span>
                            {getLicenseBadge(driver.licenseStatus)}
                          </div>
                          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                            {maskSensitiveData(driver.primaryLicenseNumber, showSensitive)}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                driver.safetyScore >= 90
                                  ? 'bg-emerald-500'
                                  : driver.safetyScore >= 80
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${driver.safetyScore}%` }}
                            />
                          </div>
                          <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                            {driver.safetyScore}%
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3">{getStatusBadge(driver.status)}</td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onSelectDriver(driver.driverId)}
                            className="px-2.5 py-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-md transition-colors"
                          >
                            Detail Profil
                          </button>
                          <button
                            onClick={() => onOpenAssignModal(driver)}
                            className="px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
                          >
                            Tugaskan
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Layout */}
            <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {drivers.map((driver) => (
                <div key={driver.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={driver.photoUrl}
                        alt={driver.fullName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {driver.fullName}
                        </h4>
                        <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                          {driver.driverCode} • {driver.branchName}
                        </div>
                      </div>
                    </div>
                    <div>{getStatusBadge(driver.status)}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">
                        Kendaraan:
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                        {driver.currentVehiclePlate || 'Belum Ditugaskan'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">
                        Lisensi SIM:
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {driver.primaryLicenseType}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">
                        Safety Score:
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {driver.safetyScore}/100
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">
                        Masa Expiry SIM:
                      </span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {driver.primaryLicenseExpiry}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onSelectDriver(driver.driverId)}
                      className="flex-1 py-1.5 text-xs font-medium text-center text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg"
                    >
                      Lihat Profil Detail
                    </button>
                    <button
                      onClick={() => onOpenAssignModal(driver)}
                      className="flex-1 py-1.5 text-xs font-medium text-center text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg"
                    >
                      Tugaskan Unit
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">
                Menampilkan <strong className="text-slate-900 dark:text-slate-100">{drivers.length}</strong> dari{' '}
                <strong className="text-slate-900 dark:text-slate-100">{total}</strong> total driver
              </span>

              <div className="flex items-center gap-1">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 py-1 font-semibold text-slate-800 dark:text-slate-200">
                  {page} / {Math.ceil(total / pageSize) || 1}
                </span>
                <button
                  disabled={page >= Math.ceil(total / pageSize)}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
