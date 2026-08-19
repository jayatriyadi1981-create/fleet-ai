/**
 * Accident Management Tab
 * PROMPT 22 Section 6 - 10
 */

import React, { useState } from 'react';
import { Accident, AccidentSeverity, AccidentStatus } from '../../types';
import { ShieldAlert, Search, Filter, Plus, FileText, Download, Eye, ExternalLink } from 'lucide-react';

interface AccidentsTabProps {
  accidents: Accident[];
  onOpenReportModal: () => void;
  onSelectAccident: (accident: Accident) => void;
}

export const AccidentsTab: React.FC<AccidentsTabProps> = ({ accidents, onOpenReportModal, onSelectAccident }) => {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredAccidents = accidents.filter((a) => {
    const matchSearch =
      a.incidentNumber.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase()) ||
      (a.driverName && a.driverName.toLowerCase().includes(search.toLowerCase())) ||
      (a.vehiclePlate && a.vehiclePlate.toLowerCase().includes(search.toLowerCase()));

    const matchSeverity = severityFilter === 'ALL' || a.severity === severityFilter;
    const matchStatus = statusFilter === 'ALL' || a.status === statusFilter;

    return matchSearch && matchSeverity && matchStatus;
  });

  const getSeverityBadge = (severity: AccidentSeverity) => {
    switch (severity) {
      case 'FATAL':
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/50';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/50';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/50';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Action Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari no. kasus, driver, nopol..."
              className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-9 pr-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="rounded-xl bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="ALL">Semua Keparahan</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
            <option value="FATAL">Fatal</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="ALL">Semua Status</option>
            <option value="REPORTED">REPORTED</option>
            <option value="UNDER_INVESTIGATION">UNDER INVESTIGATION</option>
            <option value="ACTION_REQUIRED">ACTION REQUIRED</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Exporting Accidents to CSV...')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 text-xs font-semibold"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shadow-md shadow-rose-950"
          >
            <Plus className="h-4 w-4" />
            <span>+ Laporkan Kecelakaan</span>
          </button>
        </div>
      </div>

      {/* Accidents Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase border-b border-slate-800">
            <tr>
              <th className="p-3.5">No. Kasus</th>
              <th className="p-3.5">Tipe & Keparahan</th>
              <th className="p-3.5">Waktu & Lokasi</th>
              <th className="p-3.5">Pengemudi & Armada</th>
              <th className="p-3.5">Kerugian (Est.)</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300 font-medium">
            {filteredAccidents.map((acc) => (
              <tr key={acc.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-3.5 font-mono font-bold text-cyan-400">
                  {acc.incidentNumber}
                  {acc.policeReportNumber && (
                    <p className="text-[10px] text-slate-500 font-sans">Pol: {acc.policeReportNumber}</p>
                  )}
                </td>
                <td className="p-3.5 space-y-1">
                  <p className="font-bold text-white">{acc.type.replace('_', ' ')}</p>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold border ${getSeverityBadge(acc.severity)}`}>
                    {acc.severity}
                  </span>
                </td>
                <td className="p-3.5">
                  <p className="text-white font-semibold">{acc.location}</p>
                  <p className="text-[11px] text-slate-400">{new Date(acc.dateTime).toLocaleString('id-ID')}</p>
                </td>
                <td className="p-3.5">
                  <p className="text-white font-bold">{acc.driverName || 'N/A'}</p>
                  <p className="text-[11px] text-slate-400">{acc.vehiclePlate || 'N/A'}</p>
                </td>
                <td className="p-3.5">
                  <p className="font-bold text-rose-300">Rp {acc.estimatedLossIdr.toLocaleString('id-ID')}</p>
                  <p className="text-[10px] text-slate-400">Injuries: {acc.injuries} | Fatal: {acc.fatalities}</p>
                </td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-800 text-cyan-300 border border-slate-700">
                    {acc.status}
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={() => onSelectAccident(acc)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-[11px] inline-flex items-center gap-1"
                  >
                    <Eye className="h-3.5 w-3.5" /> Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
