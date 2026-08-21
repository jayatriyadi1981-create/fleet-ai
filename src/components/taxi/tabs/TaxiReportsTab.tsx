import React from 'react';
import {
  FileText,
  Download,
  Printer,
  Table,
  CheckCircle2,
  Calendar,
  Layers,
  Car
} from 'lucide-react';
import { taxiService } from '../../../modules/taxi/services/taxiService';

export const TaxiReportsTab: React.FC = () => {
  const kpis = taxiService.getKpis();
  const vehicles = taxiService.getVehicles();

  const handleExport = (format: 'EXCEL' | 'PDF') => {
    alert(`Mengunduh Laporan Operasional Taksi (.${format.toLowerCase()})...`);
  };

  return (
    <div id="taxi-reports-tab" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <span>Pusat Laporan Operasional Harian Taksi (LOH) & Audit Utilisasi</span>
          </h2>
          <p className="text-xs text-slate-400">Rekapitulasi ritase harian, rasio Paid KM vs Empty Deadhead KM, setoran kasir pool, dan ekspor laporan resmi</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleExport('EXCEL')}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center space-x-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Excel (.XLSX)</span>
          </button>
          <button
            onClick={() => handleExport('PDF')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg transition-colors border border-slate-700 flex items-center space-x-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cetak PDF</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Audit Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 text-xs space-y-1">
          <span className="text-slate-400">Total KM Berpenumpang (Paid KM)</span>
          <div className="text-xl font-bold font-mono text-emerald-400">{kpis.totalPaidKm} KM</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 text-xs space-y-1">
          <span className="text-slate-400">Total KM Kosong (Deadhead)</span>
          <div className="text-xl font-bold font-mono text-amber-400">{kpis.totalEmptyKm} KM</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 text-xs space-y-1">
          <span className="text-slate-400">Rasio Efisiensi Muatan</span>
          <div className="text-xl font-bold font-mono text-cyan-400">{kpis.utilizationRatePct}%</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 text-xs space-y-1">
          <span className="text-slate-400">Total Pendapatan Terverifikasi</span>
          <div className="text-xl font-bold font-mono text-slate-100">Rp {kpis.totalGrossRevenueRp.toLocaleString()}</div>
        </div>
      </div>

      {/* Unit Productivity Table */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
          <Table className="w-4 h-4 text-cyan-400" />
          <span>Tabel Produktivitas Armada Taksi Harian</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">No. Lambung</th>
                <th className="p-3">Tipe / Model</th>
                <th className="p-3">Pengemudi</th>
                <th className="p-3">Ritase</th>
                <th className="p-3">Paid KM</th>
                <th className="p-3">Empty KM</th>
                <th className="p-3">Pendapatan</th>
                <th className="p-3">Utilisasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {vehicles.map((v) => {
                const total = v.paidKmToday + v.emptyKmToday;
                const util = total > 0 ? ((v.paidKmToday / total) * 100).toFixed(1) : '0';
                return (
                  <tr key={v.id} className="hover:bg-slate-800/30">
                    <td className="p-3 font-mono font-bold text-amber-400">{v.hullNumber}</td>
                    <td className="p-3 text-slate-200">{v.model}</td>
                    <td className="p-3 text-slate-300">{v.currentDriverName}</td>
                    <td className="p-3 font-mono font-bold text-slate-100">{v.tripsToday}</td>
                    <td className="p-3 font-mono text-emerald-400">{v.paidKmToday} KM</td>
                    <td className="p-3 font-mono text-slate-400">{v.emptyKmToday} KM</td>
                    <td className="p-3 font-mono font-bold text-slate-200">Rp {v.revenueTodayRp.toLocaleString()}</td>
                    <td className="p-3 font-mono font-bold text-cyan-400">{util}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
