/**
 * Fleet Intelligence Smart AI - Alert History & Historical Logs Tab Component
 */

import React, { useState } from 'react';
import { Alert } from '../types';
import {
  Search,
  Filter,
  Download,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ThumbsDown,
  ShieldAlert,
} from 'lucide-react';

interface AlertHistoryTabProps {
  alerts: Alert[];
  onOpenDetail: (alert: Alert) => void;
  onMarkFalsePositive: (alertId: string, reason: string) => void;
}

export const AlertHistoryTab: React.FC<AlertHistoryTabProps> = ({
  alerts,
  onOpenDetail,
  onMarkFalsePositive,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');

  // False Positive Modal State
  const [fpModalAlert, setFpModalAlert] = useState<Alert | null>(null);
  const [fpReason, setFpReason] = useState('');

  const filteredHistory = alerts.filter((a) => {
    if (selectedStatus !== 'ALL' && a.status !== selectedStatus) return false;
    if (selectedSeverity !== 'ALL' && a.severity !== selectedSeverity) return false;
    if (selectedType !== 'ALL' && a.type !== selectedType) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchPlate = a.vehiclePlate.toLowerCase().includes(q);
      const matchDriver = (a.driverName || '').toLowerCase().includes(q);
      const matchTitle = a.title.toLowerCase().includes(q);
      const matchLocation = (a.locationName || '').toLowerCase().includes(q);
      return matchPlate || matchDriver || matchTitle || matchLocation;
    }

    return true;
  });

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Waktu Trigger',
      'Plat Nomor',
      'Driver',
      'Jenis Alert',
      'Severity',
      'Status',
      'Lokasi',
      'Resolution Code',
      'Catatan',
    ];

    const rows = filteredHistory.map((a) => [
      a.id,
      new Date(a.triggeredAt).toLocaleString('id-ID'),
      a.vehiclePlate,
      a.driverName || 'N/A',
      a.type,
      a.severity,
      a.status,
      `"${a.locationName || ''}"`,
      a.resolutionCode || '',
      `"${a.resolutionNote || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Alert_History_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmFalsePositive = () => {
    if (fpModalAlert) {
      onMarkFalsePositive(fpModalAlert.id, fpReason);
      setFpModalAlert(null);
      setFpReason('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Export Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-slate-900/80 p-4 border border-slate-800 rounded-2xl backdrop-blur-md">
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari histori berdasarkan plat nomor, driver, atau lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 flex-1 sm:flex-initial"
            >
              <option value="ALL">Semua Status</option>
              <option value="ACTIVE">Active</option>
              <option value="ACKNOWLEDGED">Acknowledged</option>
              <option value="ESCALATED">Escalated</option>
              <option value="RESOLVED">Resolved</option>
              <option value="DISMISSED">Dismissed</option>
            </select>

            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 flex-1 sm:flex-initial"
            >
              <option value="ALL">Semua Severity</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export Laporan CSV
        </button>
      </div>

      {/* History Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[10px] uppercase text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Waktu Event</th>
                <th className="p-3.5">Armada & Driver</th>
                <th className="p-3.5">Jenis Alert</th>
                <th className="p-3.5">Severity</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Resolution Code</th>
                <th className="p-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredHistory.map((alt) => (
                <tr key={alt.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 whitespace-nowrap font-mono text-[11px] text-slate-400">
                    {new Date(alt.triggeredAt).toLocaleString('id-ID')}
                  </td>

                  <td className="p-3.5">
                    <div className="font-bold text-white font-mono">{alt.vehiclePlate}</div>
                    <div className="text-[11px] text-slate-400">{alt.driverName || 'N/A'}</div>
                  </td>

                  <td className="p-3.5 font-medium text-slate-200">{alt.type}</td>

                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-extrabold rounded uppercase ${
                        alt.severity === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : alt.severity === 'HIGH'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-indigo-500/20 text-indigo-400'
                      }`}
                    >
                      {alt.severity}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                        alt.status === 'RESOLVED'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : alt.status === 'ACTIVE'
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-indigo-500/20 text-indigo-400'
                      }`}
                    >
                      {alt.status}
                    </span>
                  </td>

                  <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                    {alt.resolutionCode || '-'}
                    {alt.isFalsePositive && (
                      <span className="ml-1 text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded">
                        False Positive
                      </span>
                    )}
                  </td>

                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => onOpenDetail(alt)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold rounded-lg transition-all"
                    >
                      Detail
                    </button>

                    {!alt.isFalsePositive && (
                      <button
                        onClick={() => setFpModalAlert(alt)}
                        title="Tandai sebagai False Positive"
                        className="p-1 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 rounded-lg transition-all"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredHistory.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-xs">
              Tidak ada data histori alert yang sesuai dengan filter pencarian.
            </div>
          )}
        </div>
      </div>

      {/* False Positive Feedback Modal */}
      {fpModalAlert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ThumbsDown className="w-5 h-5 text-rose-400" />
              Tandai False Positive (Feedback AI Engine)
            </h3>

            <p className="text-xs text-slate-300">
              Beri masukan untuk alert <strong className="text-white">{fpModalAlert.title}</strong> pada armada {fpModalAlert.vehiclePlate}. Feedback ini akan melatih AI untuk memperbaiki toleransi aturan.
            </p>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold text-xs">
                Alasan False Positive
              </label>
              <textarea
                rows={3}
                value={fpReason}
                onChange={(e) => setFpReason(e.target.value)}
                placeholder="Contoh: Prosedur bongkar muat resmi di gudang, sensor GPS sempat error kilat..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setFpModalAlert(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmFalsePositive}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/20"
              >
                Kirim Feedback AI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
