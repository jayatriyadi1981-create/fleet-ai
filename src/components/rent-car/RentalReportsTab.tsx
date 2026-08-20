import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  Filter, 
  Table, 
  FileSpreadsheet, 
  CheckCircle2, 
  Car, 
  DollarSign, 
  ShieldCheck 
} from 'lucide-react';

export const RentalReportsTab: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('revenue');
  const [dateRange, setDateRange] = useState('this_month');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  const reportTypes = [
    { id: 'booking', name: 'Laporan Booking & Reservasi', desc: 'Rekapitulasi seluruh reservasi, status konfirmasi, dan lead time sewa.' },
    { id: 'rental', name: 'Laporan Transaksi Sewa Aktif', desc: 'Monitoring durasi sewa berjalan, serah terima, dan jadwal pengembalian.' },
    { id: 'customer', name: 'Laporan Customer & KYC Risk Audit', desc: 'Daftar penyewa terverifikasi, skor risiko fraud, dan catatan insiden.' },
    { id: 'vehicle', name: 'Laporan Utilisasi & Riwayat Armada', desc: 'Persentase utilisasi tiap kendaraan, odometer perjalanan, dan jam sewa.' },
    { id: 'driver', name: 'Laporan Penugasan Pengemudi Rental', desc: 'Jam kerja driver, tip sewa, rating kepuasan pelanggan, dan shift kerja.' },
    { id: 'revenue', name: 'Laporan Omset & Pendapatan Sewa', desc: 'Rincian pendapatan kotor, PPN 11%, diskon, dan pendapatan per kategori.' },
    { id: 'payment', name: 'Laporan Pembayaran & Status Piutang', desc: 'Status pembayaran faktur, pelunasan via VA/QRIS, dan saldo piutang TOP.' },
    { id: 'deposit', name: 'Laporan Rekonsiliasi Jaminan Deposit', desc: 'Saldo deposit escrow yang ditahan, pemotongan klaim, dan pengembalian.' },
    { id: 'damage', name: 'Laporan Klaim Kerusakan & Perbaikan', desc: 'Daftar kerusakan bodi, estimasi bengkel, dan beban tanggung jawab klaim.' },
    { id: 'maintenance', name: 'Laporan Biaya Servis & Pemeliharaan', desc: 'Biaya servis berkala, ganti oli, ban, dan dampaknya pada biaya sewa.' },
    { id: 'profitability', name: 'Laporan Laba Rugi Unit (P&L Fleet)', desc: 'Net profit per unit setelah dikurangi biaya BBM, servis, asuransi, dan depresiasi.' },
    { id: 'telematics', name: 'Laporan Audit Telematika & Geofence', desc: 'Rekap alarm pelanggaran batas wilayah, speed overspeed, dan starter kill.' }
  ];

  const handleExport = (format: 'PDF' | 'EXCEL' | 'CSV') => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(`Laporan ${selectedReport.toUpperCase()} berhasil diekspor dalam format ${format}!`);
      setTimeout(() => setExportSuccess(null), 4000);
    }, 800);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Report Categories List */}
      <div className="lg:col-span-5 space-y-3">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Rental Report Center
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Pilih dari 12 modul laporan terstruktur untuk audit operasional dan eksekutif.
          </p>
        </div>

        <div className="space-y-2 max-h-[650px] overflow-y-auto pr-1">
          {reportTypes.map((rep) => {
            const isSelected = selectedReport === rep.id;
            return (
              <div
                key={rep.id}
                onClick={() => setSelectedReport(rep.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500 shadow-lg shadow-cyan-950/20'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white">{rep.name}</h3>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{rep.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Report Configuration & Export Generator */}
      <div className="lg:col-span-7 space-y-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {reportTypes.find((r) => r.id === selectedReport)?.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Konfigurasi filter periode waktu dan format berkas unduhan.
              </p>
            </div>
          </div>

          {/* Success Banner */}
          {exportSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{exportSuccess}</span>
            </div>
          )}

          {/* Filter Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Periode Waktu
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="today">Hari Ini (Real-time)</option>
                <option value="this_week">Minggu Ini</option>
                <option value="this_month">Bulan Ini (Agustus 2026)</option>
                <option value="last_month">Bulan Lalu (Juli 2026)</option>
                <option value="year_to_date">Year-to-Date (YTD 2026)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Cakupan Cabang / Tenant
              </label>
              <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500">
                <option value="all">Semua Cabang (Konsolidasi)</option>
                <option value="jkt_south">Pool HQ Jakarta Selatan</option>
                <option value="jkt_airport">Depo Bandara Soekarno-Hatta</option>
                <option value="bdg">Cabang Bandung Pasteur</option>
                <option value="sub">Cabang Surabaya Juanda</option>
              </select>
            </div>
          </div>

          {/* Report Preview Summary Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
              Ringkasan Struktur Data yang Digenerate
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Total Baris Data</span>
                <strong className="text-white font-mono">148 Records</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Integritas Data</span>
                <strong className="text-emerald-400 font-mono">100% Validated</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Tanda Tangan Digital</span>
                <strong className="text-cyan-400">Included</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Audit RBAC Log</span>
                <strong className="text-white">Timestamped</strong>
              </div>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-slate-300 block">Unduh / Ekspor Laporan:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                disabled={isExporting}
                onClick={() => handleExport('PDF')}
                className="py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span>Format Dokumen PDF</span>
              </button>

              <button
                disabled={isExporting}
                onClick={() => handleExport('EXCEL')}
                className="py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Format Microsoft Excel</span>
              </button>

              <button
                disabled={isExporting}
                onClick={() => handleExport('CSV')}
                className="py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Table className="w-4 h-4" />
                <span>Format Data CSV</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
