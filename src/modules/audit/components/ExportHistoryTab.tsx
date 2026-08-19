/**
 * Fleet Intelligence Smart AI - Export History & Download Audits Tab
 * PROMPT 49 - Data Governance, Export File Hashes, Exfiltration Prevention
 */

import React from 'react';
import { FileSpreadsheet, Download, User, Clock, FileText, CheckCircle2, Shield } from 'lucide-react';
import { AuditEvent } from '../types/auditTypes';

interface Props {
  events: AuditEvent[];
  onSelectEvent: (event: AuditEvent) => void;
}

export const ExportHistoryTab: React.FC<Props> = ({ events, onSelectEvent }) => {
  const exportEvents = events.filter(
    (e) => e.actionCategory === 'EXPORT' || e.action.includes('EXPORT')
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-cyan-400" />
            <span>Audit Riwayat Ekspor & Unduhan Laporan</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Mencegah kebocoran data (Data Loss Prevention / DLP) dengan mencatat pengunduh, format, jumlah baris data, dan SHA-256 checksum file.
          </p>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Total Ekspor: <strong className="text-white">{exportEvents.length} berkas</strong>
        </div>
      </div>

      {/* Export Cards */}
      <div className="space-y-3">
        {exportEvents.length > 0 ? (
          exportEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => onSelectEvent(event)}
              className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 hover:border-cyan-500/40 transition cursor-pointer space-y-3 shadow-lg group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 uppercase">
                      {event.action}
                    </span>
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition">
                      {event.entityName}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Diekspor oleh <strong className="text-white">{event.actor.name}</strong> ({event.actor.role})
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-mono text-slate-400">
                    {new Date(event.timestamp).toLocaleString('id-ID')}
                  </span>
                  <div className="text-[10px] text-slate-500 font-mono">
                    IP: {event.security.ipAddress}
                  </div>
                </div>
              </div>

              {event.metadata && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <span className="text-slate-500 text-[10px] block">Format:</span>
                    <span className="text-cyan-400 font-bold">{event.metadata.format || 'XLSX'}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <span className="text-slate-500 text-[10px] block">Jumlah Baris:</span>
                    <span className="text-slate-200 font-bold">
                      {event.metadata.recordsCount || event.metadata.recordCount || 0} Baris
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 sm:col-span-2">
                    <span className="text-slate-500 text-[10px] block">Filter Diterapkan:</span>
                    <span className="text-slate-300 truncate block">
                      {event.metadata.filtersApplied || 'Semua Data Aktif'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-slate-500 text-xs rounded-2xl border border-dashed border-slate-800">
            Tidak ada rekaman aktivitas ekspor.
          </div>
        )}
      </div>
    </div>
  );
};
