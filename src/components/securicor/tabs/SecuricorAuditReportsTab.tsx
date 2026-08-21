import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  FileText,
  Shield,
  Building,
  DollarSign
} from 'lucide-react';

export const SecuricorAuditReportsTab: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('2026-08');

  const reportItems = [
    {
      id: 'rep-01',
      title: 'Laporan Rekonsiliasi Pengangkutan Kas Bank Indonesia (CIT Clearing)',
      category: 'BANK_INDONESIA_REGULATORY',
      frequency: 'Bulanan',
      totalValuables: 'Rp 450 Miliar',
      tripsLogged: 48,
      status: 'AUDITED_PASSED',
    },
    {
      id: 'rep-02',
      title: 'Log Rekam Jejak Otorisasi Dual-Key & Pembukaan Pintu Brankas Khazanah',
      category: 'SECURITY_ACCESS_LOG',
      frequency: 'Harian / Real-Time',
      totalValuables: 'Rp 1.2 Triliun',
      tripsLogged: 340,
      status: 'VERIFIED_100%',
    },
    {
      id: 'rep-03',
      title: 'Kepatuhan Uji Balistik Kendaraan & Sertifikasi IKH Senjata Api POLRI',
      category: 'POLICE_COMPLIANCE',
      frequency: 'Triwulan',
      totalValuables: '12 Personil / 5 Unit Armada',
      tripsLogged: 12,
      status: 'COMPLIANT',
    },
    {
      id: 'rep-04',
      title: 'Rekapitulasi Klaim Asuransi Kerugian Kas & Nilai Premi Lloyd’s',
      category: 'INSURANCE_CLAIMS',
      frequency: 'Bulanan',
      totalValuables: 'Klaim: Rp 0 (Zero Loss)',
      tripsLogged: 340,
      status: 'ZERO_INCIDENT',
    }
  ];

  return (
    <div id="securicor-audit-reports-tab" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs text-amber-400 font-mono font-bold uppercase tracking-wider">BANK INDONESIA REGULATORY AUDIT & CIT REPORTS</span>
          <h3 className="text-lg font-bold text-white mt-1">Pusat Laporan Audit, Chain-of-Custody & Rekonsiliasi Kas</h3>
          <p className="text-xs text-slate-400">Ekspor resmi berkas audit kepatuhan regulasi PBI (Peraturan Bank Indonesia) tentang Penyelenggaraan Jasa Pengolahan Uang Rupiah (PUPR).</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Mengunduh Seluruh Laporan Audit Format Excel/PDF...')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow"
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
                <div className="p-2.5 bg-slate-900 text-amber-400 rounded-lg">
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
                <span className="text-slate-500">Nilai / Volume:</span>
                <p className="font-bold text-amber-600 mt-0.5">{item.totalValuables}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                {item.status}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => alert(`Unduh PDF Resmi: ${item.title}`)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-lg text-xs font-semibold flex items-center gap-1"
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
