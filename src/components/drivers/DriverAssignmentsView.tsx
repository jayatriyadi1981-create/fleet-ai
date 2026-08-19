/**
 * Fleet Intelligence Smart AI - Vehicle Assignment Management View
 * Handles Driver-to-Vehicle allocation, GPS device linkage, replacement workflow, and conflict detection
 */

import React, { useState, useEffect } from 'react';
import {
  Truck,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowRightLeft,
  XCircle,
  Cpu,
  Radio,
  Search,
  Check,
  Filter,
} from 'lucide-react';
import { DriverExtended, DriverAssignment } from '../../types/driver';
import { DriverService } from '../../services/driverService';

interface DriverAssignmentsViewProps {
  onSelectDriver: (driverId: string) => void;
}

export const DriverAssignmentsView: React.FC<DriverAssignmentsViewProps> = ({ onSelectDriver }) => {
  const [drivers, setDrivers] = useState<DriverExtended[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedDriver, setSelectedDriver] = useState<DriverExtended | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState('veh-01');
  const [selectedVehiclePlate, setSelectedVehiclePlate] = useState('B 9821 UTX');
  const [selectedVehicleName, setSelectedVehicleName] = useState('Isuzu Giga FVR 34 P');
  const [assignReason, setAssignReason] = useState('');
  const [assignError, setAssignError] = useState<string | null>(null);
  const [assignWarnings, setAssignWarnings] = useState<string[]>([]);

  const mockVehiclesList = [
    { id: 'veh-01', plate: 'B 9821 UTX', name: 'Isuzu Giga FVR 34 P (Box Trailer)', gps: 'dev-01' },
    { id: 'veh-02', plate: 'B 9410 UYY', name: 'Hino Ranger FL 235 JW (Container)', gps: 'dev-02' },
    { id: 'veh-03', plate: 'L 8122 UZ', name: 'Mitsubishi Fuso Canter FE 74 HD', gps: 'dev-03' },
    { id: 'veh-04', plate: 'B 9011 KIX', name: 'Hino Dutro 130 HD Cargo', gps: 'dev-04' },
    { id: 'veh-05', plate: 'DD 8710 XX', name: 'Scania P360 Heavy Duty', gps: 'dev-05' },
  ];

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const result = await DriverService.listDrivers({ page: 1, pageSize: 50 });
      setDrivers(result.drivers);
    } catch (err) {
      console.error('Error fetching drivers for assignment:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const openAssignModal = (driver: DriverExtended) => {
    setSelectedDriver(driver);
    setAssignError(null);
    setAssignWarnings([]);
    setAssignReason('');

    // Pre-validate
    const val = DriverService.validateVehicleAssignment(driver, selectedVehicleId, selectedVehiclePlate);
    setAssignWarnings(val.warnings);
    setIsModalOpen(true);
  };

  const handleAssignVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDriver) return;

    try {
      await DriverService.assignVehicle(
        selectedDriver.driverId,
        selectedVehicleId,
        selectedVehiclePlate,
        selectedVehicleName,
        'dev-01',
        'Fleet Manager',
        assignReason
      );

      setIsModalOpen(false);
      fetchDrivers();
    } catch (err: any) {
      setAssignError(err.message || 'Gagal menugaskan kendaraan.');
    }
  };

  const handleUnassign = async (driverId: string) => {
    if (confirm('Apakah Anda yakin ingin melepas penugasan kendaraan untuk driver ini?')) {
      await DriverService.unassignVehicle(driverId, 'Fleet Manager');
      fetchDrivers();
    }
  };

  const assignedDrivers = drivers.filter((d) => d.currentVehiclePlate);
  const unassignedDrivers = drivers.filter((d) => !d.currentVehiclePlate && d.status === 'active');

  return (
    <div className="space-y-6">
      {/* Header Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Driver Teralokasi (Assigned)
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1 block">
              {assignedDrivers.length} <span className="text-xs font-normal text-slate-500">Unit</span>
            </span>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Driver Siap Tugas (Available)
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1 block">
              {unassignedDrivers.length} <span className="text-xs font-normal text-slate-500">Orang</span>
            </span>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-xl text-blue-600 dark:text-blue-400">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Suspended / Lisensi Kedaluwarsa
            </span>
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1 block">
              {drivers.filter((d) => d.status === 'suspended' || d.licenseStatus === 'expired').length}
            </span>
          </div>
          <div className="p-3 bg-rose-50 dark:bg-rose-950/50 rounded-xl text-rose-600 dark:text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Unassigned Drivers Notice Banner */}
      {unassignedDrivers.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                {unassignedDrivers.length} Pengemudi Aktif Belum Memiliki Kendaraan
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                Pengemudi berikut berkualifikasi aktif dan siap ditugaskan ke armada kendaraan master.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {unassignedDrivers.map((drv) => (
                  <button
                    key={drv.id}
                    onClick={() => openAssignModal(drv)}
                    className="px-2.5 py-1 text-xs font-medium bg-white dark:bg-amber-900/60 border border-amber-300 dark:border-amber-700 rounded-lg text-amber-900 dark:text-amber-100 hover:bg-amber-100 dark:hover:bg-amber-900 flex items-center gap-1.5 transition-colors"
                  >
                    <span>{drv.fullName} ({drv.primaryLicenseType})</span>
                    <Truck className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Assignments Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Truck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Tabel Alokasi Kendaraan & Telematika GPS
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Integrasi antara Master Pengemudi, Plat Kendaraan, dan Perangkat GPS Telematika
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="px-4 py-3">Pengemudi</th>
                <th className="px-4 py-3">Kendaraan Terpasang</th>
                <th className="px-4 py-3">Perangkat GPS IoT</th>
                <th className="px-4 py-3">SIM & Kualifikasi</th>
                <th className="px-4 py-3">Status Rute</th>
                <th className="px-4 py-3 text-right">Aksi Penugasan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {drivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
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
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          {driver.driverCode}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    {driver.currentVehiclePlate ? (
                      <div>
                        <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                          {driver.currentVehiclePlate}
                        </span>
                        <span className="block text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
                          {driver.currentVehicleName}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Belum Ditugaskan</span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {driver.currentGpsDeviceId ? (
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <div>
                          <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {driver.currentGpsDeviceId}
                          </span>
                          <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <Radio className="w-3 h-3 animate-pulse" /> Live Connected
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">No GPS Linked</span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                      {driver.primaryLicenseType}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      Exp: {driver.primaryLicenseExpiry}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {driver.availabilityStatus === 'on_trip' ? (
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded-full">
                        {driver.currentTripNumber || 'On Trip'}
                      </span>
                    ) : driver.currentVehiclePlate ? (
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full">
                        Assigned
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 rounded-full">
                        Standby
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openAssignModal(driver)}
                        className="px-2.5 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 rounded-md transition-colors flex items-center gap-1"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        <span>{driver.currentVehiclePlate ? 'Ganti Unit' : 'Tugaskan'}</span>
                      </button>

                      {driver.currentVehiclePlate && (
                        <button
                          onClick={() => handleUnassign(driver.driverId)}
                          className="px-2.5 py-1 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 rounded-md transition-colors"
                        >
                          Lepas Unit
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vehicle Assignment Modal */}
      {isModalOpen && selectedDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Penugasan Kendaraan - {selectedDriver.fullName}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignVehicleSubmit} className="p-6 space-y-4">
              {/* Warnings */}
              {assignWarnings.length > 0 && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-lg text-xs text-amber-800 dark:text-amber-300 space-y-1">
                  <strong>Peringatan Validasi Penugasan:</strong>
                  {assignWarnings.map((w, idx) => (
                    <p key={idx}>• {w}</p>
                  ))}
                </div>
              )}

              {assignError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 rounded-lg text-xs text-rose-700 dark:text-rose-300">
                  {assignError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pilih Unit Kendaraan Master *
                </label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => {
                    const v = mockVehiclesList.find((item) => item.id === e.target.value);
                    if (v) {
                      setSelectedVehicleId(v.id);
                      setSelectedVehiclePlate(v.plate);
                      setSelectedVehicleName(v.name);
                    }
                  }}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                >
                  {mockVehiclesList.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.plate} — {v.name} (GPS: {v.gps})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Alasan & Catatan Penugasan
                </label>
                <textarea
                  rows={2}
                  value={assignReason}
                  onChange={(e) => setAssignReason(e.target.value)}
                  placeholder="e.g. Rotasi mingguan koridor Trans-Jawa..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  Konfirmasi Penugasan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
