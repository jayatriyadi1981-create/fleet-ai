/**
 * Fleet Intelligence Smart AI - Analytics Reports & Export View
 * PROMPT 36 - Sections 57, 58, 59
 */

import React, { useState } from 'react';
import { FileText, Download, Printer, Calendar, Clock, CheckCircle2, Send, Sparkles } from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';
import { useAuthorization } from '../../../../hooks/useAuthorization';

interface ReportTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  frequency: string;
  metricsCovered: string[];
}

const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: 'daily_ops',
    title: 'Laporan Ringkasan Operasional Harian Armada',
    category: 'Operational',
    description: 'Statistik utilisasi harian, penyelesaian trip, jarak tempuh per depo, dan insiden kritis.',
    frequency: 'Harian (06:00 WIB)',
    metricsCovered: ['Utilisasi', 'Trip Selesai', 'Jarak Tempuh', 'Downtime'],
  },
  {
    id: 'weekly_utilization',
    title: 'Audit Utilisasi & Produktivitas Mingguan',
    category: 'Performance',
    description: 'Evaluasi unit underutilized vs overutilized, peringkat produktivitas kendaraan, dan kepatuhan jadwal.',
    frequency: 'Setiap Senin',
    metricsCovered: ['Ranking Unit', 'Underutilized Alert', 'Jam Operasi', 'Ketepatan ETA'],
  },
  {
    id: 'monthly_executive',
    title: 'Executive Fleet KPI & Financial Waste Review',
    category: 'Executive & Finance',
    description: 'Laporan komprehensif Dewan Direksi: estimasi pemborosan BBM idle, ketersediaan unit, biaya perbaikan MTTR.',
    frequency: 'Bulanan (Tgl 1)',
    metricsCovered: ['Estimasi Biaya Idle', 'MTTR / MTBF', 'Total Biaya Servis', 'Efisiensi BBM'],
  },
  {
    id: 'idle_sustainability',
    title: 'Green Fleet & Idle Carbon Emission Report',
    category: 'Sustainability',
    description: 'Analisis jejak karbon mesin menyala dan estimasi reduksi emisi CO2 dengan auto-shutdown.',
    frequency: 'Bulanan',
    metricsCovered: ['Emisi CO2 (Kg)', 'Konsumsi Solar Idling', 'Klasifikasi Idle'],
  },
];

export const AnalyticsReportsView: React.FC = () => {
  const { exportCurrentData } = useAnalytics();
  const { hasPermission } = useAuthorization();
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleExport = (format: 'CSV' | 'EXCEL' | 'PDF' | 'JSON', templateTitle: string) => {
    exportCurrentData(format);
    setDownloadSuccess(`Laporan "${templateTitle}" berhasil di-generate dalam format ${format}!`);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-2">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-cyan-400" />
          <span>Automated Analytics Reports & Multi-Format Data Export</span>
        </h2>
        <p className="text-xs text-slate-400">
          Unduh laporan analitik tervalidasi atau jadwalkan pengiriman otomatis ke manajemen via Email/Webhook.
        </p>
      </div>

      {downloadSuccess && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-bold text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Reports Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {REPORT_TEMPLATES.map((tpl) => (
          <div
            key={tpl.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-500/20">
                  {tpl.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-slate-500" />
                  <span>{tpl.frequency}</span>
                </span>
              </div>
              <h3 className="text-base font-bold text-white">{tpl.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{tpl.description}</p>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {tpl.metricsCovered.map((m, idx) => (
                  <span key={idx} className="rounded-lg bg-slate-950 px-2 py-0.5 text-[10px] text-slate-400 border border-slate-800">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                {hasPermission('analytics.export') && (
                  <>
                    <button
                      onClick={() => handleExport('PDF', tpl.title)}
                      className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all flex items-center gap-1"
                    >
                      <Printer className="h-3.5 w-3.5 text-rose-400" />
                      <span>PDF</span>
                    </button>
                    <button
                      onClick={() => handleExport('EXCEL', tpl.title)}
                      className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all flex items-center gap-1"
                    >
                      <Download className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Excel</span>
                    </button>
                    <button
                      onClick={() => handleExport('CSV', tpl.title)}
                      className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all flex items-center gap-1"
                    >
                      <Download className="h-3.5 w-3.5 text-cyan-400" />
                      <span>CSV</span>
                    </button>
                  </>
                )}
              </div>

              <span className="text-[11px] text-slate-400 font-medium">Ready to Export</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
