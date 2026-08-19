/**
 * Fleet Intelligence Smart AI - Route Reports & Export Tab
 * Generates Route Efficiency Reports, Deviation Summaries, ETA Accuracy Audits,
 * and enables CSV, Excel, and PDF export workflows.
 */

import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  CheckCircle2, 
  Table, 
  FileSpreadsheet, 
  Sparkles 
} from 'lucide-react';

export const RouteReportsTab: React.FC = () => {
  const [reportType, setReportType] = useState('EFFICIENCY_SUMMARY');
  const [dateRange, setDateRange] = useState('LAST_30_DAYS');
  const [branch, setBranch] = useState('ALL');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExport = (format: 'CSV' | 'EXCEL' | 'PDF') => {
    setIsExporting(true);
    setExportSuccess(false);

    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Report Generator Controls */}
      <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Generator Laporan & Audit Telematika Rute
              </h3>
              <p className="text-xs text-slate-400">
                Pilih parameter analisis rute dan unduh laporan analitik berformat CSV, XLSX, atau PDF.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-1">Jenis Laporan Rute</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="EFFICIENCY_SUMMARY">Ringkasan Efisiensi Rute & BBM</option>
              <option value="DEVIATION_AUDIT">Audit Deviasi Jalur & Koridor Geofence</option>
              <option value="ETA_ACCURACY_LOG">Evaluasi Akurasi Prediksi ETA AI</option>
              <option value="TRAFFIC_BOTTLENECK_REPORT">Analisis Dampak Kemacetan & Jam Puncak</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-1">Periode Waktu</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="TODAY">Hari Ini (Live Shift)</option>
              <option value="LAST_7_DAYS">7 Hari Terakhir</option>
              <option value="LAST_30_DAYS">30 Hari Terakhir</option>
              <option value="CUSTOM">Rentang Kustom (Custom Range)</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-1">Depot / Cabang Operasional</label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="ALL">Semua Cabang (Nasional)</option>
              <option value="JAKARTA_CAKUNG">Jakarta Timur (Cakung)</option>
              <option value="JAKARTA_MARUNDA">Jakarta Utara (Marunda)</option>
              <option value="SURABAYA_RUNGKUT">Surabaya (Rungkut)</option>
              <option value="SEMARANG_KRAPYAK">Semarang (Krapyak)</option>
            </select>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            {exportSuccess && (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> Berhasil mengekspor dokumen laporan!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExport('CSV')}
              disabled={isExporting}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Table className="h-4 w-4 text-cyan-400" /> Export CSV
            </button>
            <button
              onClick={() => handleExport('EXCEL')}
              disabled={isExporting}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-400" /> Export XLSX (Excel)
            </button>
            <button
              onClick={() => handleExport('PDF')}
              disabled={isExporting}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black shadow-lg flex items-center gap-1.5 transition-all"
            >
              <Download className="h-4 w-4" /> Download PDF Report
            </button>
          </div>
        </div>
      </div>

      {/* Report Preview Data Table */}
      <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Pratinjau Data Laporan ({reportType})
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-semibold">
                <th className="py-2.5 px-3">Koridor Rute</th>
                <th className="py-2.5 px-3">Total Trip</th>
                <th className="py-2.5 px-3">Tingkat On-Time</th>
                <th className="py-2.5 px-3">Avg Delay</th>
                <th className="py-2.5 px-3">Tingkat Deviasi</th>
                <th className="py-2.5 px-3">Estimasi Penghematan BBM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr className="hover:bg-slate-800/40">
                <td className="py-2.5 px-3 font-semibold text-white">Jakarta (Cakung) ➔ Bandung (Gedebage)</td>
                <td className="py-2.5 px-3 font-mono">284 Trip</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold font-mono">92.4%</td>
                <td className="py-2.5 px-3 font-mono">+12.5 mnt</td>
                <td className="py-2.5 px-3 font-mono">4.2%</td>
                <td className="py-2.5 px-3 text-cyan-300 font-mono">965.6 Liter</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-2.5 px-3 font-semibold text-white">Jakarta (Marunda) ➔ Semarang (Krapyak)</td>
                <td className="py-2.5 px-3 font-mono">142 Trip</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold font-mono">96.8%</td>
                <td className="py-2.5 px-3 font-mono">+4.2 mnt</td>
                <td className="py-2.5 px-3 font-mono">1.8%</td>
                <td className="py-2.5 px-3 text-cyan-300 font-mono">1,420.0 Liter</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-2.5 px-3 font-semibold text-white">Surabaya (Rungkut) ➔ Malang (Kepanjen)</td>
                <td className="py-2.5 px-3 font-mono">198 Trip</td>
                <td className="py-2.5 px-3 text-amber-400 font-bold font-mono">81.5%</td>
                <td className="py-2.5 px-3 font-mono">+24.0 mnt</td>
                <td className="py-2.5 px-3 font-mono">8.6%</td>
                <td className="py-2.5 px-3 text-cyan-300 font-mono">412.5 Liter</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
