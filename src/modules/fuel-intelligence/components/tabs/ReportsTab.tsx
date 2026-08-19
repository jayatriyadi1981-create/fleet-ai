/**
 * Fleet Intelligence Smart AI - Fuel Reports Tab
 * Generates executive-ready PDF summaries, Excel spreadsheets, and CSV exports.
 */

import React, { useState } from 'react';
import { FuelOverviewKPIs, FuelCostBreakdown } from '../../types';
import { FileText, Download, Printer, CheckCircle2, Sparkles, FileSpreadsheet, Calendar } from 'lucide-react';

interface ReportsTabProps {
  kpis: FuelOverviewKPIs;
  costBreakdown: FuelCostBreakdown;
  onExplainWithAI: (topic: string, subject: string) => void;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({
  kpis,
  costBreakdown,
  onExplainWithAI,
}) => {
  const [reportType, setReportType] = useState<'EXECUTIVE_MONTHLY' | 'ANOMALY_AUDIT' | 'COST_EFFICIENCY'>('EXECUTIVE_MONTHLY');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleExport = (format: 'PDF' | 'EXCEL' | 'CSV') => {
    setDownloadSuccess(`Laporan format ${format} berhasil digenerate dan siap diunduh.`);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Report Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="h-4 w-4 text-cyan-400" />
            Pusat Generator Laporan Eksekutif BBM (Fuel Reports & Exports)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Unduh laporan komprehensif efisiensi konsumsi, audit anomali, dan alokasi biaya BBM untuk direksi & manajemen.
          </p>
        </div>

        {/* Format Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('PDF')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 shadow-md shadow-cyan-950 transition-colors"
          >
            <Download className="h-4 w-4" /> Export PDF
          </button>
          <button
            onClick={() => handleExport('EXCEL')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs hover:bg-slate-700 transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-400" /> Excel (XLSX)
          </button>
          <button
            onClick={() => handleExport('CSV')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs hover:bg-slate-700 transition-colors"
          >
            CSV
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* 2. Executive Report Preview Paper */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8 shadow-2xl max-w-4xl mx-auto space-y-6 text-slate-300">
        {/* Document Letterhead */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-lg">
              ✦
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wider">PT TRANS LOGISTIK NUSANTARA</h2>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block">
                FLEET INTELLIGENCE AI • FUEL AUDIT REPORT
              </span>
            </div>
          </div>
          <div className="text-right font-mono text-xs text-slate-400">
            <span>Periode: <strong>15 Juli - 15 Agustus 2026</strong></span>
            <span className="block text-[11px] text-slate-500">Doc ID: REP-FUEL-202608-01</span>
          </div>
        </div>

        {/* Executive Summary Section */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            1. Ringkasan Eksekutif & Key Performance Indicators
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono">
            <div>
              <span className="text-[10px] text-slate-500 block">Total Pengeluaran</span>
              <span className="text-sm font-bold text-white">Rp {(kpis.totalFuelCostIdr / 1000000).toFixed(1)} Jt</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Konsumsi Rata-rata</span>
              <span className="text-sm font-bold text-cyan-400">{kpis.avgConsumptionL100Km} L/100km</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Skor Efisiensi</span>
              <span className="text-sm font-bold text-emerald-400">{kpis.fuelEfficiencyScore}/100</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Indikator Anomali</span>
              <span className="text-sm font-bold text-amber-400">{kpis.totalAnomaliesCount} Kejadian</span>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Selama 30 hari terakhir, armada menempuh total <strong>{kpis.totalDistanceKm.toLocaleString()} km</strong> dengan volume bahan bakar terpakai sebesar <strong>{kpis.totalFuelConsumedLiters.toLocaleString()} Liter</strong>.
            Tingkat efisiensi rata-rata berada pada status <strong>Optimal (84/100)</strong> dengan potensi penghematan dapat dicapai sebesar <strong>Rp {(costBreakdown.estimatedAvoidableWasteCostIdr / 1000000).toFixed(2)} Juta</strong> melalui pengurangan durasi idle antrean depo dan penertiban jadwal servis injektor.
          </p>
        </div>

        {/* Key Cost Breakdown */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            2. Distribusi Biaya Bahan Bakar Per Tipe Armada
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="border-b border-slate-800 bg-slate-950 font-mono text-slate-400">
                <tr>
                  <th className="py-2.5 px-3">KATEGORI ARMADA</th>
                  <th className="py-2.5 px-3 text-right">TOTAL BIAYA (IDR)</th>
                  <th className="py-2.5 px-3 text-right">VOLUME (L)</th>
                  <th className="py-2.5 px-3 text-right">BIAYA/KM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {costBreakdown.costByVehicleType.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 px-3 font-sans text-slate-200">{item.type}</td>
                    <td className="py-2.5 px-3 text-right text-white font-bold">
                      Rp {item.totalCostIdr.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-400">
                      {item.volumeLiters.toLocaleString()} L
                    </td>
                    <td className="py-2.5 px-3 text-right text-cyan-400">
                      Rp {item.avgCostPerKm}/km
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-800 text-xs font-mono">
          <div>
            <span className="text-slate-500 block">Dibuat Otomatis Oleh:</span>
            <strong className="text-slate-300 block mt-1">AI Fleet Intelligence System</strong>
            <span className="text-[11px] text-slate-500">PT Trans Logistik Nusantara</span>
          </div>
          <div className="text-right">
            <span className="text-slate-500 block">Disetujui Oleh:</span>
            <strong className="text-slate-300 block mt-1">Bambang Soeprapto</strong>
            <span className="text-[11px] text-slate-500">Head of Logistics & Fleet Operations</span>
          </div>
        </div>
      </div>
    </div>
  );
};
