import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Calendar, 
  Filter, 
  FileText, 
  Printer, 
  CheckCircle,
  Bus,
  DollarSign
} from 'lucide-react';

export const BusReportsTab: React.FC = () => {
  const [reportType, setReportType] = useState('TICKETS');
  const [dateRange, setDateRange] = useState('TODAY');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            Pusat Laporan & Ekspor Dokumen PO Bus
          </h3>
          <p className="text-xs text-slate-500">Unduh rekapitulasi penjualan tiket, manifest Kemenhub, pembukuan uang jalan supir (UJS), dan kelaikan ramp check</p>
        </div>

        <button 
          onClick={() => alert('Mengunduh Laporan PO Bus dalam format Excel XLSX & PDF...')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Download className="w-4 h-4" /> Ekspor Excel & PDF
        </button>
      </div>

      {/* Filter Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Jenis Laporan PO Bus</label>
          <select 
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
          >
            <option value="TICKETS">Rekap Penjualan Tiket Penumpang</option>
            <option value="MANIFEST">Manifest Resmi Penumpang (Format Kemenhub)</option>
            <option value="CARGO">Laporan Paket Kargo Bus Kilat</option>
            <option value="UJS">Buku Kas Uang Jalan Supir (UJS) & E-Toll</option>
            <option value="RAMP_CHECK">Rekapitulasi Uji Kelaikan Ramp Check Dishub</option>
            <option value="CHARTER">Laporan Sewa Bus Pariwisata & SPJ</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Periode Tanggal</label>
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
          >
            <option value="TODAY">Hari Ini (20 Agustus 2026)</option>
            <option value="THIS_WEEK">Minggu Ini</option>
            <option value="THIS_MONTH">Bulan Ini (Agustus 2026)</option>
            <option value="CUSTOM">Rentang Kustom</option>
          </select>
        </div>

        <div className="flex items-end">
          <button 
            onClick={() => window.print()}
            className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <Printer className="w-4 h-4" /> Cetak Lembar Kerja
          </button>
        </div>
      </div>

      {/* Reports Template Preview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl w-fit">
            <FileText className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Laporan Manifest Penumpang Kemenhub</h4>
          <p className="text-xs text-slate-500">Dokumen legalitas trayek berisi nama penumpang, NIK KTP untuk asuransi Jasa Raharja, dan nomor kursi bus.</p>
          <button 
            onClick={() => alert('Mencetak Dokumen Manifest Kemenhub...')}
            className="text-xs text-blue-600 font-bold hover:underline"
          >
            Unduh Format PDF →
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-xl w-fit">
            <DollarSign className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Buku Kas UJS & Konsumsi BBM Solar</h4>
          <p className="text-xs text-slate-500">Rincian pengeluaran uang jalan supir, konsumsi solar per km, dan struk tol Trans-Jawa.</p>
          <button 
            onClick={() => alert('Mencetak Laporan UJS & BBM...')}
            className="text-xs text-emerald-600 font-bold hover:underline"
          >
            Unduh Format Excel →
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-xl w-fit">
            <Bus className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Rekapitulasi Omzet Agen Loket</h4>
          <p className="text-xs text-slate-500">Laporan komisi per agen loket terminal, setoran harian kasir, dan sisa plafon deposit.</p>
          <button 
            onClick={() => alert('Mencetak Laporan Omzet Agen...')}
            className="text-xs text-amber-600 font-bold hover:underline"
          >
            Unduh Format CSV →
          </button>
        </div>
      </div>
    </div>
  );
};
