import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Award,
  DollarSign,
  Package,
  Check
} from 'lucide-react';
import { pudService } from '../../../modules/pud/services/pudService';

export const PudReportsTab: React.FC = () => {
  const [kpis] = useState(pudService.getKpis());
  const [couriers] = useState(pudService.getCouriers());
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleExport = (reportName: string) => {
    setDownloadSuccess(`Laporan "${reportName}" berhasil di-generate dan siap diunduh.`);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  return (
    <div className="space-y-6" id="pud-reports-tab">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
            Pusat Laporan & Analitik KPI Pickup & Delivery (PUD)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Unduh rekapitulasi harian OTD (On-Time Delivery), First-Attempt Delivery Rate (FADR), buku kas COD, dan peringkat kurir.
          </p>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* KPI Performance Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-bold uppercase block">Tingkat On-Time Delivery</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">{kpis.onTimeDeliveryRatePct}%</span>
          <span className="text-[11px] text-slate-400">Standar SLA Operasi &gt;96%</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-bold uppercase block">First Attempt Rate (FADR)</span>
          <span className="text-2xl font-black text-indigo-600 mt-1 block">{kpis.firstAttemptDeliveryRatePct}%</span>
          <span className="text-[11px] text-slate-400">Terkirim pada percobaan pertama</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-bold uppercase block">Rata-rata Durasi Kirim</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{kpis.averageDeliveryDurationMins} Mins</span>
          <span className="text-[11px] text-slate-400">Instant & Same-Day combined</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-bold uppercase block">Total Setoran Kas COD</span>
          <span className="text-xl font-black text-slate-900 mt-1 block">Rp {(kpis.totalCodCollectedToday / 1000000).toFixed(2)} Jt</span>
          <span className="text-[11px] text-emerald-600 font-semibold">100% Rekonsiliasi akurat</span>
        </div>
      </div>

      {/* Reports Export Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3 flex flex-col justify-between">
          <div>
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl inline-block mb-2">
              <Package className="w-5 h-5" />
            </span>
            <h4 className="font-bold text-slate-900 text-sm">Laporan Log Ritase Pengiriman Harian</h4>
            <p className="text-xs text-slate-500 mt-1">
              Rekap seluruh nomor resi, merchant, alamat penerima, status serah terima, dan durasi antar.
            </p>
          </div>
          <button
            onClick={() => handleExport('Laporan Ritase Pengiriman Harian')}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Excel / CSV</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3 flex flex-col justify-between">
          <div>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl inline-block mb-2">
              <DollarSign className="w-5 h-5" />
            </span>
            <h4 className="font-bold text-slate-900 text-sm">Laporan Rekonsiliasi Kas COD & QRIS</h4>
            <p className="text-xs text-slate-500 mt-1">
              Rincian uang tunai tagihan COD yang disetor kurir ke kasir hub beserta mutasi transaksi QRIS digital.
            </p>
          </div>
          <button
            onClick={() => handleExport('Laporan Rekonsiliasi Kas COD')}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Unduh PDF Rekonsiliasi</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3 flex flex-col justify-between">
          <div>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-xl inline-block mb-2">
              <Award className="w-5 h-5" />
            </span>
            <h4 className="font-bold text-slate-900 text-sm">Peringkat & Insentif Kinerja Kurir</h4>
            <p className="text-xs text-slate-500 mt-1">
              Papan skor produktivitas kurir (total drop, rating CSAT, dan perhitungan bonus insentif).
            </p>
          </div>
          <button
            onClick={() => handleExport('Laporan Peringkat & Insentif Kurir')}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Rekap Insentif</span>
          </button>
        </div>
      </div>

      {/* Courier Leaderboard */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          Papan Peringkat Produktivitas Kurir Hari Ini
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5">Peringkat</th>
                <th className="px-4 py-2.5">Nama Kurir</th>
                <th className="px-4 py-2.5">Armada</th>
                <th className="px-4 py-2.5">Total Drop Sukses</th>
                <th className="px-4 py-2.5">Rating CSAT</th>
                <th className="px-4 py-2.5 text-right">Estimasi Insentif</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {couriers.map((c, idx) => (
                <tr key={c.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-2.5 font-bold text-slate-900">
                    <span className={`inline-block w-6 h-6 rounded-full text-center leading-6 text-xs font-black ${
                      idx === 0 ? 'bg-amber-100 text-amber-800' : idx === 1 ? 'bg-slate-200 text-slate-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      #{idx + 1}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-bold text-slate-900">{c.name}</td>
                  <td className="px-4 py-2.5 text-slate-500">{c.vehiclePlate} ({c.vehicleType})</td>
                  <td className="px-4 py-2.5 font-bold text-emerald-700">{c.todayCompletedDeliveries} Paket</td>
                  <td className="px-4 py-2.5 font-bold text-amber-600">⭐ {c.rating}</td>
                  <td className="px-4 py-2.5 text-right font-black text-slate-900">
                    Rp {c.totalIncentiveToday.toLocaleString()}
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
