/**
 * Fleet Intelligence Smart AI - Fuel Reports Tab
 * PROMPT 24 - Scheduled Export Reports, PDF/Excel Generation Simulation
 */

import React from 'react';
import { FileText, Download, Printer, Calendar } from 'lucide-react';

export const ReportsTab: React.FC = () => {
  const reportsList = [
    { title: 'Laporan Audit Konsumsi BBM Bulanan (Agustus 2026)', type: 'PDF', size: '2.4 MB', date: '15 Aug 2026' },
    { title: 'Rekap Rekonsiliasi Struk SPBU & Kartu BBM', type: 'XLSX', size: '1.8 MB', date: '14 Aug 2026' },
    { title: 'Log Kejadian Penurunan BBM Tak Wajar (Fuel Drain)', type: 'PDF', size: '920 KB', date: '12 Aug 2026' },
    { title: 'Analisis Cost per KM Per Rute & Cabang', type: 'XLSX', size: '3.1 MB', date: '10 Aug 2026' },
  ];

  const handleDownload = (title: string) => {
    alert(`Mengunduh file berkas laporan: ${title}`);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-cyan-400" /> Berkas Laporan Otomatis Telematika BBM
            </h3>
            <p className="text-xs text-slate-400">Unduh berkas laporan konsumsi, audit struk, dan log anomali.</p>
          </div>
          <button className="px-3 py-1.5 rounded-xl bg-cyan-600 text-white font-bold text-xs flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" /> Atur Penjadwalan Email
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportsList.map((rep, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">{rep.title}</span>
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold text-[10px]">
                  {rep.type}
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-400">
                <span>Ukuran Berkas: {rep.size}</span>
                <span>Diperbarui: {rep.date}</span>
              </div>
              <div className="flex gap-2 pt-1 border-t border-slate-800">
                <button
                  onClick={() => handleDownload(rep.title)}
                  className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-1"
                >
                  <Download className="h-3.5 w-3.5" /> Unduh Berkas
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
