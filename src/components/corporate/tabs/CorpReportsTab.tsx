import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  CheckCircle2,
  FileText,
  Car,
  TrendingDown,
  Zap,
  Building,
  DollarSign
} from 'lucide-react';

export const CorpReportsTab: React.FC = () => {
  const reportItems = [
    {
      id: 'rep-01',
      title: 'Laporan Utilisasi Bulanan & Booking Sharing Pool Kendaraan',
      category: 'UTILIZATION_OPERATIONS',
      frequency: 'Bulanan',
      metric: 'Utilisasi 76.4% • 182 Booking Selesai',
      status: 'AUDITED_READY',
    },
    {
      id: 'rep-02',
      title: 'Rekapitulasi Total Cost of Ownership (TCO) & Alokasi Cost Center',
      category: 'FINANCE_BUDGETING',
      frequency: 'Bulanan',
      metric: 'Total Biaya: Rp 101.400.000 / Bulan',
      status: 'VERIFIED_FINANCE',
    },
    {
      id: 'rep-03',
      title: 'Laporan Keberlanjutan & Reduksi Emisi Karbon Green Fleet (ESG Scope 1)',
      category: 'SUSTAINABILITY_ESG',
      frequency: 'Triwulan / Tahunan',
      metric: 'Reduksi -14.2 Ton CO2e (EV & Hybrid)',
      status: 'ESG_COMPLIANT',
    },
    {
      id: 'rep-04',
      title: 'Laporan Audit Kepatuhan Car Policy, Jam Kerja & Lembur Pengemudi',
      category: 'GENERAL_AFFAIRS_HR',
      frequency: 'Bulanan',
      metric: 'Tingkat Kepatuhan 98.5% (Zero Loss)',
      status: 'APPROVED_MANAGEMENT',
    }
  ];

  return (
    <div id="corp-reports-tab" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs text-blue-400 font-mono font-bold uppercase tracking-wider">
            EXECUTIVE AUDIT REPORTS, TCO & ESG GREEN FLEET
          </span>
          <h3 className="text-lg font-bold text-white mt-1">
            Pusat Laporan Eksekutif, Beban Operasional & Emisi Karbon ESG
          </h3>
          <p className="text-xs text-slate-400">
            Ekspor resmi berkas laporan operasional kendaraan dinas untuk Direksi, Finance Accounting, audit kepatuhan GA, dan Sustainability Reporting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Mengunduh Seluruh Laporan Komprehensif Format Excel / PDF...')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow"
          >
            <Download className="w-4 h-4" /> Download Laporan Bulanan (Excel)
          </button>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportItems.map(item => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-slate-900 text-blue-400 rounded-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 font-mono">{item.category}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500">Frekuensi:</span>
                <p className="font-bold text-slate-800 mt-0.5">{item.frequency}</p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500">Hasil & Metrik:</span>
                <p className="font-bold text-blue-700 mt-0.5">{item.metric}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                {item.status}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => alert(`Unduh PDF Resmi: ${item.title}`)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-blue-300 rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
                <button
                  onClick={() => alert(`Unduh Excel Rekonsiliasi: ${item.title}`)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> XLSX
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
