/**
 * Safety Reports Tab
 * PROMPT 33 Architecture
 */

import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Sparkles, 
  Printer, 
  Share2, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { safetyIntelligenceService } from '../../engines/SafetyIntelligenceService';

export const SafetyReportsTab: React.FC = () => {
  const report = safetyIntelligenceService.generateFullSafetyReport('HSE Safety Lead');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleExport = (type: 'PDF' | 'EXCEL' | 'CSV') => {
    setDownloadSuccess(`Laporan format ${type} berhasil diexport dan diunduh.`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Top Header & Export Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            Laporan Intelijen Keselamatan Armada (Fleet Safety Intelligence Report)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            ID Dokumen: <span className="font-mono text-slate-300">{report.reportId}</span> • Periode: <span className="text-emerald-400">{report.dataPeriod}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('CSV')}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            CSV
          </button>
          <button
            onClick={() => handleExport('EXCEL')}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            Excel
          </button>
          <button
            onClick={() => handleExport('PDF')}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak PDF Resmi
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 rounded-lg bg-emerald-900/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {downloadSuccess}
        </div>
      )}

      {/* Report Document Paper Simulation */}
      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 space-y-6 shadow-xl">
        
        {/* Document Header */}
        <div className="border-b border-slate-800 pb-4 flex items-start justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-400 tracking-widest uppercase font-mono">
              PT FLEET LOGISTIK NUSANTARA — HSE DIVISION
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              LAPORAN KESELAMATAN & MANAJEMEN RISIKO ARMADA
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Dibuat Otomatis oleh AI Safety Intelligence Engine • Versi Model: {report.modelVersion}
            </p>
          </div>
          <div className="text-right text-xs text-slate-400 font-mono">
            <div>Tanggal: {new Date(report.generatedAt).toLocaleDateString('id-ID')}</div>
            <div>Penyusun: {report.generatedBy}</div>
            <div>Tenant: {report.tenantId}</div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            1. RINGKASAN EKSEKUTIF (EXECUTIVE SUMMARY)
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            {report.executiveSummary}
          </p>
        </div>

        {/* Key Safety Metrics Table */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            2. INDIKATOR KINERJA KESELAMATAN (SAFETY KPIS)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400">Skor Keselamatan Armada</span>
              <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">{report.safetyKPIs.overallSafetyScore} / 100</div>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400">Total Kecelakaan (Accident)</span>
              <div className="text-lg font-bold text-red-400 font-mono mt-0.5">{report.safetyKPIs.totalAccidents} Kasus</div>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400">Total Insiden Operasional</span>
              <div className="text-lg font-bold text-amber-400 font-mono mt-0.5">{report.safetyKPIs.totalIncidents} Kasus</div>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400">Penyelesaian CAPA</span>
              <div className="text-lg font-bold text-cyan-400 font-mono mt-0.5">{report.safetyKPIs.correctiveActionCompletionPct}%</div>
            </div>
          </div>
        </div>

        {/* Top Hotspots Summary */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            3. AREA RAWAN KESELAMATAN UTAMA (IDENTIFIED HOTSPOTS)
          </h4>
          <div className="space-y-2">
            {report.topHotspots.map(h => (
              <div key={h.id} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <strong className="text-white">{h.name}</strong>
                  <p className="text-[11px] text-slate-400">{h.primaryPattern}</p>
                </div>
                <span className="text-amber-400 font-mono">{h.incidentCount} Insiden ({h.riskLevel})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Actions */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            4. REKOMENDASI TINDAKAN KOREKTIF & PREVENTIF (ACTION ITEMS)
          </h4>
          <div className="space-y-2">
            {report.activeRecommendations.map(r => (
              <div key={r.id} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-white">{r.title}</strong>
                  <span className="text-emerald-400 font-mono text-[11px]">{r.ownerDepartment} (Batas: {r.suggestedDeadlineDays} Hari)</span>
                </div>
                <p className="text-[11px] text-slate-300">{r.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Official Regulatory & AI Disclaimer */}
        <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed space-y-1">
          <div className="font-bold text-slate-300 uppercase tracking-wider">Pernyataan Penyangkalan Resmi (Regulatory Disclaimer):</div>
          <p>{report.disclaimer}</p>
        </div>

      </div>

    </div>
  );
};
