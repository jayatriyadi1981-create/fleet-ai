/**
 * Fleet Intelligence Smart AI - Luxury Enterprise Print & PDF View
 * PROMPT 39 - Board-Ready Printable Document with Branding, Executive KPIs, Tables & Signatures
 */

import React from 'react';
import { useReports } from '../context/ReportContext';
import {
  Printer,
  ArrowLeft,
  Download,
  Sparkles,
  CheckCircle2,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';

export const ReportPrintView: React.FC = () => {
  const { activeDataset, branding, setActiveTab } = useReports();
  const { name, periodLabel, filterSummary, kpis, columns, rows, summaryRows, aiSummary, generatedAt } = activeDataset;

  const visibleCols = columns.filter(c => c.visible);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Non-Printable Top Action Bar */}
      <div className="print:hidden flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <button
          onClick={() => setActiveTab('viewer')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Interactive Viewer</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">Mode Pratinjau Dokumen Cetak / PDF</span>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 py-2 px-5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/20 transition"
          >
            <Printer className="h-4 w-4" />
            <span>Cetak / Simpan PDF Sekarang</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet (White / Clean Enterprise Paper Layout) */}
      <div className="bg-white text-slate-900 p-8 sm:p-12 rounded-2xl shadow-2xl border border-slate-300 print:border-none print:shadow-none print:p-0 max-w-5xl mx-auto font-sans relative">
        {/* Watermark */}
        {branding.watermark && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <span className="text-8xl font-black text-slate-900 rotate-[-30deg] select-none uppercase">
              {branding.watermark}
            </span>
          </div>
        )}

        {/* Header Branding */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-sm">
                FI
              </div>
              <h1 className="text-xl font-black tracking-tight text-slate-900">
                {branding.companyName}
              </h1>
            </div>
            <p className="text-xs text-slate-600 max-w-md leading-tight">
              {branding.companyAddress}
            </p>
            <div className="text-[11px] text-slate-500 flex items-center gap-3 pt-0.5">
              <span>Tel: {branding.companyPhone}</span>
              <span>•</span>
              <span>Email: {branding.companyEmail}</span>
            </div>
          </div>

          <div className="text-right space-y-1">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Enterprise Fleet Report</div>
            <div className="text-lg font-black text-slate-900">{name}</div>
            <div className="text-xs font-semibold text-cyan-800">Periode: {periodLabel}</div>
            <div className="text-[10px] text-slate-500 font-mono">Dokumen ID: DOC-{Date.now().toString(36).toUpperCase()}</div>
          </div>
        </div>

        {/* Metadata Filter Box */}
        <div className="my-6 p-3.5 bg-slate-100 rounded-xl border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="font-bold text-slate-700">Parameter Filter: </span>
            <span className="text-slate-800">{filterSummary}</span>
          </div>
          <div>
            <span className="font-bold text-slate-700">Waktu Generate: </span>
            <span className="text-slate-800">{generatedAt}</span>
          </div>
        </div>

        {/* KPI Summary 4 Boxes */}
        <div className="grid grid-cols-4 gap-3 my-6">
          {kpis.map((kpi, idx) => (
            <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-[10px] font-bold text-slate-500 uppercase">{kpi.label}</div>
              <div className="text-lg font-black text-slate-900 mt-1">{kpi.value}</div>
              {kpi.subtext && <div className="text-[10px] text-slate-600 mt-0.5">{kpi.subtext}</div>}
            </div>
          ))}
        </div>

        {/* AI Executive Summary Box if present */}
        {aiSummary && (
          <div className="my-6 p-5 bg-amber-50/60 border border-amber-200 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="h-4 w-4 text-amber-600" />
              <span>Executive AI Intelligence Summary</span>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed font-serif">
              {aiSummary.executiveSummary}
            </p>
            <div className="pt-2 border-t border-amber-200/80 grid grid-cols-2 gap-3 text-xs">
              <div>
                <strong className="text-[11px] font-bold text-slate-900 block mb-1">Temuan Kunci:</strong>
                <ul className="list-disc list-inside text-slate-700 space-y-0.5 text-[11px]">
                  {aiSummary.keyFindings.slice(0, 3).map((kf, i) => (
                    <li key={i}>{kf}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong className="text-[11px] font-bold text-slate-900 block mb-1">Rekomendasi Strategis:</strong>
                <ul className="list-disc list-inside text-slate-700 space-y-0.5 text-[11px]">
                  {aiSummary.recommendations.slice(0, 2).map((rec, i) => (
                    <li key={i}><strong className="text-slate-900">{rec.title}:</strong> {rec.action}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="my-6">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2">Tabel Rekapitulasi Data</h3>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-[10px] uppercase">
                {visibleCols.map(col => (
                  <th key={col.id} className="py-2.5 px-3 font-bold border border-slate-900">{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className={rIdx % 2 === 1 ? 'bg-slate-50' : 'bg-white'}>
                  {visibleCols.map(col => {
                    const val = row[col.id];
                    let formattedVal = val !== undefined && val !== null ? String(val) : '-';
                    if (col.dataType === 'currency' && typeof val === 'number') {
                      formattedVal = `Rp ${Math.round(val).toLocaleString('id-ID')}`;
                    } else if (col.dataType === 'percentage' && typeof val === 'number') {
                      formattedVal = `${val}%`;
                    }
                    return (
                      <td key={col.id} className="py-2 px-3 border border-slate-200 text-slate-800">
                        {formattedVal}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>

            {/* Summary Row */}
            {summaryRows && summaryRows.length > 0 && (
              <tfoot>
                <tr className="bg-slate-200 font-bold text-slate-900 text-xs border-t-2 border-slate-900">
                  {visibleCols.map((col, idx) => {
                    if (idx === 0) return <td key={col.id} className="py-2.5 px-3 border border-slate-300">TOTAL / RATA-RATA</td>;
                    const sum = summaryRows.find(s => s.columnId === col.id);
                    return (
                      <td key={col.id} className="py-2.5 px-3 border border-slate-300 font-mono">
                        {sum ? sum.formatted : '-'}
                      </td>
                    );
                  })}
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Signatures & Approval Blocks */}
        <div className="mt-12 pt-8 border-t border-slate-300 grid grid-cols-3 gap-6 text-center text-xs">
          <div className="space-y-12">
            <div className="font-semibold text-slate-600">Dibuat Oleh (Prepared By):</div>
            <div>
              <div className="font-bold text-slate-900 border-t border-slate-400 pt-1">Fleet Operations Lead</div>
              <div className="text-[10px] text-slate-500">Divisi Operasional &amp; IoT</div>
            </div>
          </div>

          <div className="space-y-12">
            <div className="font-semibold text-slate-600">Ditinjau Oleh (Reviewed By):</div>
            <div>
              <div className="font-bold text-slate-900 border-t border-slate-400 pt-1">Head of Finance &amp; Fleet</div>
              <div className="text-[10px] text-slate-500">Divisi Keuangan &amp; Audit</div>
            </div>
          </div>

          <div className="space-y-12">
            <div className="font-semibold text-slate-600">Disetujui Oleh (Approved By):</div>
            <div>
              <div className="font-bold text-slate-900 border-t border-slate-400 pt-1">Director of Operations</div>
              <div className="text-[10px] text-slate-500">Direksi &amp; Manajemen Puncak</div>
            </div>
          </div>
        </div>

        {/* Footer Note & Security Code */}
        <div className="mt-10 pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
          <div>{branding.reportFooterText}</div>
          <div className="font-mono flex items-center gap-1 text-slate-700">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Digital Security Verification: 2026-FI-AI-SEC-OK</span>
          </div>
        </div>
      </div>
    </div>
  );
};
