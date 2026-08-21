import React from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  Filter, 
  FileSpreadsheet,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { LogisticsOrder } from '../../../modules/logistics/types';

interface Props {
  orders: LogisticsOrder[];
}

export const LogisticsReportsTab: React.FC<Props> = ({ orders }) => {
  const reports = [
    {
      title: 'Laporan Rekonsiliasi Pengiriman Harian (Daily TMS Log)',
      desc: 'Rincian seluruh resi, status pengantaran, lead time OTD, dan nama penerima fisik.',
      type: 'Excel (.xlsx)',
      period: 'Bulan Berjalan',
      size: '2.4 MB'
    },
    {
      title: 'Laporan Settlement Uang Tunai COD & Remittance Merchant',
      desc: 'Rincian setoran kurir ke kasir hub dan daftar bukti transfer perbankan ke rekening toko.',
      type: 'PDF & CSV',
      period: 'Mingguan (W3)',
      size: '1.1 MB'
    },
    {
      title: 'Laporan Utilisasi Kapasitas Linehaul & Biaya BBM Koridor',
      desc: 'Analisis tonase kargo antar-hub, load factor CBM tronton, dan konsumsi solar telematika.',
      type: 'PDF Analytics',
      period: 'Bulan Lalu',
      size: '4.8 MB'
    },
    {
      title: 'Laporan Kepatuhan SLA & Garansi On-Time Delivery (OTD)',
      desc: 'Metrik performa layanan Sameday, Nextday, Regular beserta kalkulasi kompensasi klausul kontrak.',
      type: 'Excel (.xlsx)',
      period: 'Kuartal 1 (Q1)',
      size: '3.2 MB'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-blue-600" />
            Pusat Laporan & Ekspor Data Operasional Logistik
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Unduh laporan berkala performa pengiriman, audit kepatuhan segel, rekonsiliasi COD, dan histori armada.
          </p>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reports.map((rep, idx) => (
          <div 
            key={idx}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                  {rep.type}
                </span>
                <span className="text-xs text-slate-400 font-semibold">{rep.period}</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">{rep.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{rep.desc}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Ukuran file: {rep.size}</span>
              <button 
                onClick={() => alert(`Mengunduh ${rep.title}... File siap dalam hitungan detik.`)}
                className="px-4 py-2 bg-slate-100 hover:bg-blue-600 hover:text-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <Download className="w-4 h-4" /> Unduh Dokumen
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
