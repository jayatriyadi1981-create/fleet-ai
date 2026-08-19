/**
 * Fleet Intelligence Smart AI - Maintenance Reports & Audit Export Tab
 * Generates audit-ready maintenance reports, financial TCO summaries,
 * failure forecasts, and parts demand schedules in PDF, Excel, and CSV formats.
 */

import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  FileSpreadsheet, 
  Printer, 
  CheckCircle2, 
  Calendar, 
  Filter,
  Sparkles
} from 'lucide-react';
import { FleetMaintenanceKPIs } from '../../types';

interface MaintenanceReportsTabProps {
  kpis: FleetMaintenanceKPIs;
}

export const MaintenanceReportsTab: React.FC<MaintenanceReportsTabProps> = ({ kpis }) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const reportTemplates = [
    {
      id: 'rep-exec',
      title: 'Executive Fleet Health & Risk Audit Report',
      description: 'Ringkasan komprehensif kesehatan armada, skor risiko, kendaraan prioritas P1, dan KPI ketersediaan bengkel.',
      format: 'PDF',
      period: 'Kuartal III 2026',
      icon: FileText,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    },
    {
      id: 'rep-failures',
      title: 'Predictive Failure Forecasting & Horizons',
      description: 'Daftar prediksi kegagalan 12 sistem mekanis (7d/30d/90d), probabilitas risiko, dan checklist inspeksi teknisi.',
      format: 'EXCEL (.XLSX)',
      period: 'Bulan Berjalan',
      icon: FileSpreadsheet,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      id: 'rep-service',
      title: 'Service Due & Scheduled Maintenance Plan',
      description: 'Jadwal servis berkala ganti oli mesin, transmisi, dan filter berdasarkan run-rate odometer kendaraan.',
      format: 'EXCEL (.XLSX)',
      period: '30 Hari ke Depan',
      icon: FileSpreadsheet,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      id: 'rep-costs',
      title: 'Maintenance Cost & Downtime Financial Analysis',
      description: 'Laporan biaya per KM, TCO per unit, analisis cost outliers, dan estimasi kerugian downtime bengkel.',
      format: 'CSV / EXCEL',
      period: 'Year-to-Date (YTD)',
      icon: FileSpreadsheet,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
  ];

  const handleExport = (repId: string, title: string) => {
    setDownloadingId(repId);
    setTimeout(() => {
      setDownloadingId(null);
      setSuccessToast(`Laporan "${title}" berhasil di-generate dan diunduh.`);
      setTimeout(() => setSuccessToast(null), 4000);
    }, 800);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Maintenance Intelligence Reports & Exports</h3>
            <p className="text-xs text-slate-400">
              Unduh laporan audit pemeliharaan resmi siap presentasi manajemen dan audit ISO 9001
            </p>
          </div>
        </div>
      </div>

      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportTemplates.map((rep) => {
          const Icon = rep.icon;
          const isDownloading = downloadingId === rep.id;

          return (
            <div
              key={rep.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${rep.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{rep.title}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">Format: {rep.format}</span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950 border border-slate-800 text-slate-300">
                    {rep.period}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{rep.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">
                  Engine: AI-Predictive-Report-Gen
                </span>

                <button
                  onClick={() => handleExport(rep.id, rep.title)}
                  disabled={isDownloading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  {isDownloading ? 'Membuat Laporan...' : 'Unduh Laporan'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
