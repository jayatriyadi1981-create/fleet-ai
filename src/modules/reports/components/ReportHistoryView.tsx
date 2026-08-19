/**
 * Fleet Intelligence Smart AI - Report History & Audit Logs View
 * PROMPT 39 - Comprehensive Activity Auditing, IP Tracking, Compliance & Security Trail
 */

import React, { useState } from 'react';
import { useReports } from '../context/ReportContext';
import {
  History,
  ShieldCheck,
  Search,
  Download,
  Eye,
  Share2,
  Trash2,
  Lock,
} from 'lucide-react';

export const ReportHistoryView: React.FC = () => {
  const { auditLogs } = useReports();
  const [search, setSearch] = useState('');

  const filtered = auditLogs.filter(a =>
    a.reportName.toLowerCase().includes(search.toLowerCase()) ||
    a.userName.toLowerCase().includes(search.toLowerCase()) ||
    a.action.toLowerCase().includes(search.toLowerCase()) ||
    a.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">Log Aktivitas &amp; Audit Trail Laporan ({auditLogs.length})</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Seluruh aktivitas pembukaan, ekspor, unduhan, dan perubahan konfigurasi tercatat secara tamper-proof
          </p>
        </div>

        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari audit log..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4">Pengguna</th>
                <th className="py-3 px-4">Aktivitas</th>
                <th className="py-3 px-4">Nama Laporan</th>
                <th className="py-3 px-4">Format</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Rincian Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/50 transition">
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {new Date(log.timestamp).toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{log.userName}</div>
                    <div className="text-[10px] text-slate-400">{log.userEmail}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.action === 'EXPORTED' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                      log.action === 'DOWNLOADED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      log.action === 'SHARED' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-white">{log.reportName}</td>
                  <td className="py-3 px-4 font-mono text-slate-300">{log.format || '-'}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{log.ipAddress}</td>
                  <td className="py-3 px-4 text-slate-300 max-w-xs truncate">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
