/**
 * Fleet Intelligence Smart AI - Service Due & Prediction Tab
 * Predictive maintenance scheduling based on vehicle utilization run-rates,
 * mileage intervals, and dynamic countdowns for periodic oil & filter replacements.
 */

import React, { useState } from 'react';
import { ServiceDueItem, ServiceDueStatus } from '../../types';
import { 
  CalendarClock, 
  Search, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  Wrench,
  Sparkles
} from 'lucide-react';

interface ServicePredictionTabProps {
  services: ServiceDueItem[];
  onRequestWorkOrder?: (vehicleId: string) => void;
}

export const ServicePredictionTab: React.FC<ServicePredictionTabProps> = ({
  services,
  onRequestWorkOrder,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filtered = services.filter((s) => {
    const matchesSearch = s.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.serviceType.toLowerCase().includes(search.toLowerCase()) ||
      s.branch.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <CalendarClock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Service Due Tracking & Utilization Prediction</h3>
            <p className="text-xs text-slate-400">
              Proyeksi tanggal servis berkala berdasarkan kecepatan akumulasi kilometer (run-rate) harian
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari plat nomor atau tipe servis..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">Semua Status</option>
            <option value="CRITICAL_OVERDUE">Kritis Terlewat (&gt;2.000 KM)</option>
            <option value="OVERDUE">Terlewat (Overdue)</option>
            <option value="DUE_SOON">Due Soon (&lt;1.000 KM)</option>
            <option value="NORMAL">Normal / Sesuai Jadwal</option>
          </select>
        </div>
      </div>

      {/* Services Table */}
      <div className="overflow-x-auto rounded-2xl bg-slate-900 border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4 font-semibold">Kendaraan</th>
              <th className="py-3 px-4 font-semibold">Jenis Servis Berkala</th>
              <th className="py-3 px-4 font-semibold">Status Servis</th>
              <th className="py-3 px-4 font-semibold">Odometer / Target</th>
              <th className="py-3 px-4 font-semibold">Sisa Jarak / Waktu</th>
              <th className="py-3 px-4 font-semibold">Prediksi Tanggal Servis</th>
              <th className="py-3 px-4 font-semibold">Estimasi Biaya</th>
              <th className="py-3 px-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map((srv) => {
              const isOverdue = srv.status === 'OVERDUE' || srv.status === 'CRITICAL_OVERDUE';
              const isSoon = srv.status === 'DUE_SOON' || srv.status === 'DUE';

              return (
                <tr key={srv.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-white text-xs">{srv.plateNumber}</div>
                    <div className="text-[11px] text-slate-400">{srv.branch}</div>
                  </td>

                  <td className="py-3 px-4 max-w-xs">
                    <div className="text-slate-200 font-semibold">{srv.serviceType}</div>
                    <div className="text-[11px] text-slate-400">
                      Tipe Interval: {srv.intervalType}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      srv.status === 'CRITICAL_OVERDUE' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      srv.status === 'OVERDUE' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                      srv.status === 'DUE_SOON' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {srv.status}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-mono text-white font-semibold">
                      {srv.currentMileage.toLocaleString()} KM
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Target: {srv.nextServiceMileage.toLocaleString()} KM
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className={`font-mono font-bold ${isOverdue ? 'text-rose-400' : 'text-slate-200'}`}>
                      {srv.remainingMileage < 0
                        ? `Terlewat ${Math.abs(srv.remainingMileage).toLocaleString()} KM`
                        : `${srv.remainingMileage.toLocaleString()} KM lagi`}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Jatuh Tempo: {srv.nextServiceDueDate}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 text-cyan-300 font-mono font-semibold">
                      <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                      {srv.predictedServiceDate}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Prediksi: {srv.predictedServiceMileage.toLocaleString()} KM
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-mono text-white font-semibold">
                      Rp {srv.estimatedCost.toLocaleString('id-ID')}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    {onRequestWorkOrder && (
                      <button
                        onClick={() => onRequestWorkOrder(srv.vehicleId)}
                        className="px-3 py-1 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-colors"
                      >
                        Jadwalkan Servis
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
