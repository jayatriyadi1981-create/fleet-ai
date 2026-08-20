/**
 * Fleet Intelligence Smart AI - Executive Export Modal
 * PROMPT 52 — Board-Ready PDF, Excel, and WhatsApp / Email Executive Briefing Export
 */

import React, { useState } from 'react';
import { X, FileText, Download, Share2, Check, Copy, Printer, Mail, MessageSquare } from 'lucide-react';
import { ExecutiveReport } from '../../types/executiveReport';
import { ExecutiveReportExportService } from '../../services/executiveReport/executiveReportExportService';

interface ExecutiveExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ExecutiveReport;
}

export const ExecutiveExportModal: React.FC<ExecutiveExportModalProps> = ({
  isOpen,
  onClose,
  report,
}) => {
  const [copied, setCopied] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv' | 'json' | 'briefing'>('pdf');

  if (!isOpen) return null;

  const handleDownloadPDF = () => {
    ExecutiveReportExportService.exportToPrintablePDF(report);
  };

  const handleDownloadCSV = () => {
    ExecutiveReportExportService.exportToCSV(report);
  };

  const handleDownloadJSON = () => {
    ExecutiveReportExportService.exportToJSON(report);
  };

  const executiveBriefingText = ExecutiveReportExportService.generateExecutiveBriefingText(report);

  const handleCopyBriefing = () => {
    navigator.clipboard.writeText(executiveBriefingText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-950/80 border border-indigo-700/60 rounded-xl text-indigo-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Ekspor Laporan Eksekutif & Board Briefing</h3>
              <p className="text-xs text-slate-400">
                Pilih format keluaran untuk Direksi, Komisaris, atau Arsip Finansial
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Format selection */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => setExportFormat('pdf')}
              className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition-all ${
                exportFormat === 'pdf'
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Printer className="w-5 h-5" />
              <span className="text-xs font-bold">PDF / Print</span>
            </button>

            <button
              onClick={() => setExportFormat('csv')}
              className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition-all ${
                exportFormat === 'csv'
                  ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="text-xs font-bold">CSV / Excel</span>
            </button>

            <button
              onClick={() => setExportFormat('briefing')}
              className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition-all ${
                exportFormat === 'briefing'
                  ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="text-xs font-bold">Briefing WA</span>
            </button>

            <button
              onClick={() => setExportFormat('json')}
              className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition-all ${
                exportFormat === 'json'
                  ? 'bg-cyan-600/20 border-cyan-500 text-cyan-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Share2 className="w-5 h-5" />
              <span className="text-xs font-bold">JSON Audit</span>
            </button>
          </div>

          {/* Details based on active selection */}
          {exportFormat === 'pdf' && (
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">Board-Ready Executive PDF Presentation</span>
                <span className="text-emerald-400 font-mono text-[11px]">Siap Cetak / Save to PDF</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Menghasilkan tata letak laporan komprehensif formal dengan Header Perusahaan, Ringkasan Eksekutif AI, Kartu Skor 7 Pilar, Analisa Biaya, dan Rencana Aksi Direksi.
              </p>
              <button
                onClick={handleDownloadPDF}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Buka Layout Cetak / Simpan PDF</span>
              </button>
            </div>
          )}

          {exportFormat === 'csv' && (
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">Financial Ledger & KPI Spreadsheet</span>
                <span className="text-emerald-400 font-mono text-[11px]">Format CSV Kompatibel Excel</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Unduh rekapitulasi data mentah KPI, perincian biaya per kategori, data kendaraan biaya tertinggi, performa rute, dan komparasi cabang.
              </p>
              <button
                onClick={handleDownloadCSV}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Unduh File CSV ({report.periodLabel}.csv)</span>
              </button>
            </div>
          )}

          {exportFormat === 'briefing' && (
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">Format Pesan WhatsApp / Memo C-Level</span>
                <button
                  onClick={handleCopyBriefing}
                  className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Teks Memo'}</span>
                </button>
              </div>
              <div className="bg-slate-900 rounded-lg p-3 border border-slate-800 text-slate-300 font-mono text-[11px] max-h-40 overflow-y-auto whitespace-pre-wrap">
                {executiveBriefingText}
              </div>
            </div>
          )}

          {exportFormat === 'json' && (
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">Audit Trail JSON Data Schema</span>
                <span className="text-cyan-400 font-mono text-[11px]">ID Schema: v1.0-executive</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Struktur JSON lengkap termasuk metadata integritas data, evidence ID hash, dan signature validator untuk keperluan integrasi ERP eksternal.
              </p>
              <button
                onClick={handleDownloadJSON}
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Unduh JSON Data Audit</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
