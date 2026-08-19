/**
 * Fleet Intelligence Smart AI - Driver Shift Management View
 * Master Shift Templates, Driver Shift Roster, Check-In Badges, & Rest Time Conflict Alerts
 */

import React, { useState, useEffect } from 'react';
import {
  Clock,
  Calendar,
  UserCheck,
  AlertCircle,
  Plus,
  CheckCircle2,
  XCircle,
  Building2,
  User,
  Check,
  ShieldAlert,
} from 'lucide-react';
import { DriverExtended, DriverShift, ShiftMaster } from '../../types/driver';
import { DriverService } from '../../services/driverService';

interface DriverShiftsViewProps {
  onSelectDriver: (driverId: string) => void;
}

export const DriverShiftsView: React.FC<DriverShiftsViewProps> = ({ onSelectDriver }) => {
  const [shiftMasters, setShiftMasters] = useState<ShiftMaster[]>([]);
  const [driverShifts, setDriverShifts] = useState<DriverShift[]>([]);
  const [drivers, setDrivers] = useState<DriverExtended[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [selectedShiftId, setSelectedShiftId] = useState('');
  const [shiftDate, setShiftDate] = useState(new Date().toISOString().split('T')[0]);
  const [assignNotice, setAssignNotice] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const masters = await DriverService.listShiftMasters();
      const shifts = await DriverService.getDriverShifts();
      const drvs = await DriverService.listDrivers({ page: 1, pageSize: 50 });

      setShiftMasters(masters);
      setDriverShifts(shifts);
      setDrivers(drvs.drivers);

      if (drvs.drivers.length > 0) setSelectedDriverId(drvs.drivers[0].driverId);
      if (masters.length > 0) setSelectedShiftId(masters[0].id);
    } catch (err) {
      console.error('Error loading shifts data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignShift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDriverId || !selectedShiftId) return;

    try {
      await DriverService.assignShift(selectedDriverId, selectedShiftId, shiftDate, 'Dispatcher');
      setAssignNotice('Shift berhasil dijadwalkan!');
      fetchData();
      setTimeout(() => setAssignNotice(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Gagal menjadwalkan shift.');
    }
  };

  const getShiftStatusBadge = (status: DriverShift['status']) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Active Duty</span>;
      case 'scheduled':
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> Scheduled</span>;
      case 'completed':
        return <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-full">Completed</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-700 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Shift Master Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {shiftMasters.map((master) => (
          <div
            key={master.id}
            className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between"
          >
            <div>
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                Master Shift Template
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {master.name}
              </h4>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{master.startTime} - {master.endTime} WIB</span>
              </div>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Shift Assignment Form */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          Penjadwalan Shift Pengemudi (Shift Roster)
        </h3>

        {assignNotice && (
          <div className="p-3 mb-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 rounded-lg flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{assignNotice}</span>
          </div>
        )}

        <form onSubmit={handleAssignShift} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Pilih Pengemudi
            </label>
            <select
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              {drivers.map((drv) => (
                <option key={drv.driverId} value={drv.driverId}>
                  {drv.fullName} ({drv.driverCode})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Template Shift
            </label>
            <select
              value={selectedShiftId}
              onChange={(e) => setSelectedShiftId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              {shiftMasters.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Tanggal Shift
            </label>
            <input
              type="date"
              value={shiftDate}
              onChange={(e) => setShiftDate(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Jadwalkan Shift</span>
          </button>
        </form>
      </div>

      {/* Driver Shifts Timeline Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Jadwal Shift & Status Presensi Driver
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="px-4 py-3">Pengemudi</th>
                <th className="px-4 py-3">Nama Shift</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Waktu Mulai - Selesai</th>
                <th className="px-4 py-3">Status Duty</th>
                <th className="px-4 py-3">Penjadwal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {driverShifts.map((shift) => (
                <tr key={shift.driverShiftId} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onSelectDriver(shift.driverId)}
                      className="font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      {shift.driverName}
                    </button>
                  </td>

                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                    {shift.shiftName}
                  </td>

                  <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400">
                    {shift.date}
                  </td>

                  <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400">
                    {shift.startAt.split('T')[1]?.substring(0, 5)} - {shift.endAt.split('T')[1]?.substring(0, 5)} WIB
                  </td>

                  <td className="px-4 py-3">{getShiftStatusBadge(shift.status)}</td>

                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {shift.assignedBy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
