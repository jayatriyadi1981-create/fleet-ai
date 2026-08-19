/**
 * Fleet Intelligence Smart AI - Expiry Calendar & Schedule Timeline View
 * PROMPT 48 - Visual Monthly Expiry Matrix, Date Drill-down & 6-Month Renewal Timeline
 */

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertTriangle,
  FileText,
  Eye,
  RefreshCw,
  Sparkles,
  Layers,
} from 'lucide-react';
import { DocumentItem } from '../types/documentTypes';

interface ExpiryCalendarViewProps {
  documents: DocumentItem[];
  onSelectDocument: (doc: DocumentItem) => void;
  onRenewDocument: (doc: DocumentItem) => void;
}

export const ExpiryCalendarView: React.FC<ExpiryCalendarViewProps> = ({
  documents,
  onSelectDocument,
  onRenewDocument,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1)); // August 2026 default
  const [selectedDateStr, setSelectedDateStr] = useState<string>(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'CALENDAR' | 'TIMELINE'>('CALENDAR');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Build calendar matrix
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday
  const totalDays = new Date(year, month + 1, 0).getDate();

  const daysArray: Array<{ dayNum: number; dateStr: string; items: DocumentItem[] }> = [];

  for (let i = 1; i <= totalDays; i++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const matchedDocs = documents.filter((d) => d.expiryDate === dStr && d.status !== 'ARCHIVED');
    daysArray.push({
      dayNum: i,
      dateStr: dStr,
      items: matchedDocs,
    });
  }

  // Selected date items
  const selectedDateDocs = documents.filter((d) => d.expiryDate === selectedDateStr && d.status !== 'ARCHIVED');

  // Sorted Timeline (next 180 days)
  const timelineDocs = [...documents]
    .filter((d) => d.daysRemaining >= 0 && d.status !== 'ARCHIVED')
    .sort((a, b) => a.daysRemaining - b.daysRemaining);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Kalender & Timeline Kedaluwarsa Dokumen</h2>
            <p className="text-xs text-slate-400">
              Visualisasi jadwal jatuh tempo STNK, KIR Dishub, Asuransi, dan SIM Pengemudi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 p-1">
          <button
            onClick={() => setViewMode('CALENDAR')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              viewMode === 'CALENDAR' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Matriks Kalender
          </button>
          <button
            onClick={() => setViewMode('TIMELINE')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              viewMode === 'TIMELINE' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Timeline 6 Bulan
          </button>
        </div>
      </div>

      {viewMode === 'CALENDAR' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Grid (2 cols) */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
            {/* Month Navigation */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                {monthNames[month]} {year}
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevMonth}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="rounded-lg border border-slate-800 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700"
                >
                  Bulan Ini
                </button>
                <button
                  onClick={handleNextMonth}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Days header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400 pb-1">
              <span>Min</span>
              <span>Sen</span>
              <span>Sel</span>
              <span>Rab</span>
              <span>Kam</span>
              <span>Jum</span>
              <span>Sab</span>
            </div>

            {/* Calendar Cells */}
            <div className="grid grid-cols-7 gap-1.5">
              {/* Empty leading padding */}
              {Array.from({ length: firstDayIndex }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-20 rounded-xl bg-slate-950/20 border border-slate-900" />
              ))}

              {daysArray.map((day) => {
                const isSelected = selectedDateStr === day.dateStr;
                const hasExpiring = day.items.length > 0;
                const hasCritical = day.items.some((d) => d.daysRemaining <= 7);

                return (
                  <div
                    key={day.dateStr}
                    onClick={() => setSelectedDateStr(day.dateStr)}
                    className={`h-20 cursor-pointer rounded-xl border p-1.5 transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-950/40'
                        : hasCritical
                        ? 'border-amber-500/40 bg-amber-500/5 hover:border-amber-500'
                        : hasExpiring
                        ? 'border-slate-700 bg-slate-950/60 hover:border-slate-600'
                        : 'border-slate-800/60 bg-slate-950/30 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-semibold ${
                          isSelected ? 'text-cyan-300 font-bold' : 'text-slate-300'
                        }`}
                      >
                        {day.dayNum}
                      </span>
                      {hasExpiring && (
                        <span
                          className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                            hasCritical ? 'bg-amber-500 text-slate-950' : 'bg-cyan-500/20 text-cyan-300'
                          }`}
                        >
                          {day.items.length}
                        </span>
                      )}
                    </div>

                    {hasExpiring ? (
                      <div className="space-y-1">
                        {day.items.slice(0, 2).map((item) => (
                          <div
                            key={item.id}
                            className={`truncate rounded px-1 text-[9px] font-medium ${
                              item.documentType === 'KIR'
                                ? 'bg-amber-500/20 text-amber-300'
                                : item.documentType === 'STNK'
                                ? 'bg-blue-500/20 text-blue-300'
                                : 'bg-purple-500/20 text-purple-300'
                            }`}
                          >
                            {item.documentType}: {item.entityName.split(' ')[0]}
                          </div>
                        ))}
                        {day.items.length > 2 && (
                          <span className="text-[8px] text-slate-500 font-mono">+{day.items.length - 2} lagi</span>
                        )}
                      </div>
                    ) : (
                      <div />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Drilldown Selected Date Sidebar (1 col) */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Jatuh Tempo: <span className="text-cyan-400 font-mono">{selectedDateStr}</span>
              </h3>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 font-bold">
                {selectedDateDocs.length} Dokumen
              </span>
            </div>

            {selectedDateDocs.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center text-center p-6 text-slate-500">
                <CalendarIcon className="h-8 w-8 mb-2 opacity-40 text-cyan-400" />
                <p className="text-xs">Tidak ada dokumen yang jatuh tempo pada tanggal ini.</p>
                <p className="text-[11px] text-slate-600 mt-1">Pilih tanggal lain yang memiliki penanda badge.</p>
              </div>
            ) : (
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {selectedDateDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-2 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{doc.documentType}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          doc.daysRemaining <= 7
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {doc.daysRemaining === 0 ? 'Hari Ini' : `${doc.daysRemaining} hari lagi`}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-slate-300">{doc.title}</p>
                    <p className="text-[11px] text-slate-400 font-mono">No: {doc.documentNumber}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                      <button
                        onClick={() => onSelectDocument(doc)}
                        className="flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:underline"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Lihat Berkas</span>
                      </button>
                      <button
                        onClick={() => onRenewDocument(doc)}
                        className="flex items-center gap-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 text-[10px] font-bold text-cyan-300 hover:bg-cyan-500/20"
                      >
                        <RefreshCw className="h-3 w-3" />
                        <span>Revisi / Perpanjang</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Timeline View */
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Jadwal Perpanjangan 6 Bulan Ke Depan</h3>
            <span className="text-xs text-slate-400">Total {timelineDocs.length} Dokumen Terjadwal</span>
          </div>

          <div className="space-y-3">
            {timelineDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold text-xs ${
                      doc.daysRemaining <= 7
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        : doc.daysRemaining <= 30
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    }`}
                  >
                    {doc.daysRemaining}d
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-white">{doc.title}</p>
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-mono text-slate-300">
                        {doc.documentType}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {doc.entityName} • Jatuh Tempo: <span className="text-white font-medium">{doc.expiryDate}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectDocument(doc)}
                    className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800"
                  >
                    Rincian
                  </button>
                  <button
                    onClick={() => onRenewDocument(doc)}
                    className="flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Perpanjang</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
