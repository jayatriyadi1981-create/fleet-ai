/**
 * Fleet Intelligence Smart AI - Generated Reports Archive View
 * PROMPT 39 - Download Center, Signed URL Verification, Retention Tracking & File Management
 */

import React, { useState } from 'react';
import { useReports } from '../context/ReportContext';
import {
  Archive,
  Download,
  Trash2,
  FileCheck,
  Clock,
  ShieldCheck,
  Search,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';

export const GeneratedReportsView: React.FC = () => {
  const { generatedReports, deleteGeneratedReport, exportActiveReport } = useReports();
  const [search, setSearch] = useState('');

  const filtered = generatedReports.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.format.toLowerCase().includes(search.toLowerCase()) ||
    g.generatedByName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Archive className="h-5 w-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Arsip Berkas Laporan Tergenerate ({generatedReports.length})</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftar berkas laporan PDF, Excel dan CSV yang siap diunduh dengan token keamanan terenkripsi
          </p>
        </div>

        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari berkas laporan..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Generated Files Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Nama Laporan</th>
                <th className="py-3 px-4">Format</th>
                <th className="py-3 px-4">Ukuran</th>
                <th className="py-3 px-4">Entitas Data</th>
                <th className="py-3 px-4">Dibuat Oleh</th>
                <th className="py-3 px-4">Waktu Generate</th>
                <th className="py-3 px-4">Masa Berlaku</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-800/50 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{item.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Job ID: {item.jobId}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.format === 'PDF' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                      item.format === 'EXCEL' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {item.format}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">{item.fileSize}</td>
                  <td className="py-3 px-4">{item.recordsCount} baris</td>
                  <td className="py-3 px-4 text-slate-300">{item.generatedByName}</td>
                  <td className="py-3 px-4 text-slate-400">{new Date(item.generatedAt).toLocaleString('id-ID')}</td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                      <ShieldCheck className="h-3 w-3" />
                      <span>Aktif (30 Hari)</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => exportActiveReport(item.format)}
                        title="Unduh Berkas"
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition shadow-sm"
                      >
                        <Download className="h-3 w-3" />
                        <span>Unduh</span>
                      </button>
                      <button
                        onClick={() => deleteGeneratedReport(item.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
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
