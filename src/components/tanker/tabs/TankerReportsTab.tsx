import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  FileCheck,
  CheckCircle,
  Truck,
  Layers,
  Search
} from 'lucide-react';

interface ReportRow {
  id: string;
  reportDate: string;
  hullNumber: string;
  plateNumber: string;
  cargoType: string;
  consignee: string;
  loadedVolumeLiters: number;
  unloadedVolumeLiters: number;
  lossLiters: number;
  lossPct: number;
  elockViolations: number;
  status: string;
}

const MOCK_REPORTS: ReportRow[] = [
  {
    id: 'rep-01',
    reportDate: '2026-08-21',
    hullNumber: 'TANK-BBM-2401',
    plateNumber: 'B 9142 TFU',
    cargoType: 'BBM Pertalite',
    consignee: 'SPBU 34.413.09 Karawang',
    loadedVolumeLiters: 24000,
    unloadedVolumeLiters: 23988,
    lossLiters: -12,
    lossPct: 0.05,
    elockViolations: 0,
    status: 'TOLERANSI_AMAN'
  },
  {
    id: 'rep-02',
    reportDate: '2026-08-21',
    hullNumber: 'CPO-TAN-3208',
    plateNumber: 'BK 8819 CP',
    cargoType: 'CPO Sawit',
    consignee: 'PT Wilmar Dumai Terminal',
    loadedVolumeLiters: 32000,
    unloadedVolumeLiters: 31975,
    lossLiters: -25,
    lossPct: 0.08,
    elockViolations: 0,
    status: 'TOLERANSI_AMAN'
  },
  {
    id: 'rep-03',
    reportDate: '2026-08-20',
    hullNumber: 'CHEM-ACID-1603',
    plateNumber: 'B 9031 UXZ',
    cargoType: 'Asam Sulfat B3',
    consignee: 'PT Chandra Asri Cilegon',
    loadedVolumeLiters: 16000,
    unloadedVolumeLiters: 15992,
    lossLiters: -8,
    lossPct: 0.05,
    elockViolations: 0,
    status: 'TOLERANSI_AMAN'
  }
];

export const TankerReportsTab: React.FC = () => {
  const [reports] = useState<ReportRow[]>(MOCK_REPORTS);
  const [dateRange, setDateRange] = useState('Bulan Ini (Agustus 2026)');

  const handleExport = (format: 'EXCEL' | 'PDF') => {
    alert(`Laporan Audit Operasional Tangki berhasil diekspor dalam format ${format}!`);
  };

  return (
    <div id="tanker-reports-tab" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-amber-400" />
            <span>Pusat Laporan Tangki, Audit Kepatuhan & Rekapitulasi Losses</span>
          </h2>
          <p className="text-xs text-slate-400">
            Laporan rekap ritase pengiriman cairan, analisis variansi susut muatan, log pembukaan segel elektronik, dan audit sertifikat uji KIR/Tera.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleExport('EXCEL')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center space-x-1.5 border border-slate-700"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ekspor Excel</span>
          </button>
          <button
            onClick={() => handleExport('PDF')}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all flex items-center space-x-1.5 shadow-lg"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor PDF</span>
          </button>
        </div>
      </div>

      {/* Reports Summary Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
            <FileCheck className="w-4 h-4 text-amber-400" />
            <span>Rekapitulasi Audit Pengiriman & Susut Muatan (Losses Variance)</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">{dateRange}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/50">
                <th className="py-2.5 px-3">Tanggal</th>
                <th className="py-2.5 px-3">Nomor Lambung & Plat</th>
                <th className="py-2.5 px-3">Muatan & Tujuan</th>
                <th className="py-2.5 px-3">Muat (Gross)</th>
                <th className="py-2.5 px-3">Bongkar (Net)</th>
                <th className="py-2.5 px-3">Susut (Losses)</th>
                <th className="py-2.5 px-3">Status Kepatuhan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {reports.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-mono">{r.reportDate}</td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-100">{r.hullNumber}</div>
                    <div className="text-[11px] text-amber-400 font-mono">{r.plateNumber}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-200">{r.cargoType}</div>
                    <div className="text-[10px] text-slate-400">{r.consignee}</div>
                  </td>
                  <td className="py-3 px-3 font-mono">{r.loadedVolumeLiters.toLocaleString()} L</td>
                  <td className="py-3 px-3 font-mono">{r.unloadedVolumeLiters.toLocaleString()} L</td>
                  <td className="py-3 px-3 font-mono text-emerald-400 font-bold">
                    {r.lossLiters} L ({r.lossPct}%)
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold inline-flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>{r.status.replace(/_/g, ' ')}</span>
                    </span>
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
