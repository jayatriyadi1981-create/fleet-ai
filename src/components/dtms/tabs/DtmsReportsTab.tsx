import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  FileText,
  Printer,
  Layers,
  Truck
} from 'lucide-react';
import { dtmsService } from '../../../modules/dtms/services/dtmsService';

export const DtmsReportsTab: React.FC = () => {
  const [reportType, setReportType] = useState('LHT_DAILY_RITASE');
  const [startDate, setStartDate] = useState('2026-08-21');
  const [endDate, setEndDate] = useState('2026-08-21');
  const [shiftFilter, setShiftFilter] = useState('ALL');

  const handleExport = (format: 'EXCEL' | 'PDF') => {
    alert(`Mengekspor Laporan [${reportType}] Format ${format} periode ${startDate} s/d ${endDate} (Shift: ${shiftFilter})`);
  };

  return (
    <div id="dtms-reports-tab" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <span>Pusat Laporan & Ekspor Analitik Dump Truck (LHT & LBT)</span>
          </h2>
          <p className="text-xs text-slate-400">Generate Laporan Harian Tambang (LHT), Laporan Bulanan Tambang (LBT), audit solar, dan evaluasi driver</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleExport('EXCEL')}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export Excel (.XLSX)</span>
          </button>
          <button
            onClick={() => handleExport('PDF')}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center space-x-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print PDF Official</span>
          </button>
        </div>
      </div>

      {/* Filter Matrix Card */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span>Parameter Kustomisasi Laporan</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Tipe Laporan</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200"
            >
              <option value="LHT_DAILY_RITASE">LHT - Rekap Ritase & Tonase Harian</option>
              <option value="LBT_MONTHLY_PRODUCTION">LBT - Produksi Bulanan (BCM & Tonnage)</option>
              <option value="WEIGHBRIDGE_PAYLOAD_AUDIT">Audit Jembatan Timbang & Overload</option>
              <option value="FUEL_BURN_EFFICIENCY">Efisiensi Konsumsi Solar (Liter/Ton)</option>
              <option value="TIRE_WEAR_TKPH_LIFECYCLE">Umur Pakai Ban OTR & TKPH Rating</option>
              <option value="DRIVER_PERFORMANCE_FATIGUE">Kinerja Operator DT & Evaluasi K3</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Tanggal Mulai</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Tanggal Selesai</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Filter Shift</label>
            <select
              value={shiftFilter}
              onChange={(e) => setShiftFilter(e.target.value)}
              className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200"
            >
              <option value="ALL">Semua Shift (Shift 1 & Shift 2)</option>
              <option value="SHIFT_1">Shift 1 (Siang 07:00 - 19:00)</option>
              <option value="SHIFT_2">Shift 2 (Malam 19:00 - 07:00)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Available Preset Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
            <FileText className="w-4 h-4" />
            <span>LHT Produksi Batubara & OB</span>
          </div>
          <p className="text-xs text-slate-400">Ringkasan ritase per pit, bucket loading pass, dan volume BCM terverifikasi surveyor.</p>
          <button onClick={() => handleExport('EXCEL')} className="text-xs text-emerald-400 hover:underline pt-1 inline-flex items-center space-x-1">
            <span>Download Template LHT</span>
          </button>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs">
            <FileText className="w-4 h-4" />
            <span>Rekapitulasi Solar & Bowser</span>
          </div>
          <p className="text-xs text-slate-400">Pencatatan volume dispenser mobile bowser, rasio L/Ton, dan rekonsiliasi fuel flowmeter.</p>
          <button onClick={() => handleExport('EXCEL')} className="text-xs text-cyan-400 hover:underline pt-1 inline-flex items-center space-x-1">
            <span>Download Rekap Solar</span>
          </button>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
            <FileText className="w-4 h-4" />
            <span>Audit Ban & Scrap Replacement</span>
          </div>
          <p className="text-xs text-slate-400">Laporan keausan mm tapak ban OTR, evaluasi panas TKPH, dan riwayat rotasi posisi roda.</p>
          <button onClick={() => handleExport('EXCEL')} className="text-xs text-amber-400 hover:underline pt-1 inline-flex items-center space-x-1">
            <span>Download Audit Ban</span>
          </button>
        </div>
      </div>
    </div>
  );
};
