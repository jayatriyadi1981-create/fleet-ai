/**
 * Fleet Intelligence Smart AI - Data Changes Tab (Field-Level Diffs)
 * PROMPT 49 - Visual Audit of Before vs After Modifications with PII Protection
 */

import React, { useState } from 'react';
import { GitCommit, Database, Eye, ArrowRight, User, Clock, AlertCircle } from 'lucide-react';
import { AuditEvent } from '../types/auditTypes';

interface Props {
  events: AuditEvent[];
  onSelectEvent: (event: AuditEvent) => void;
}

export const DataChangesTab: React.FC<Props> = ({ events, onSelectEvent }) => {
  const [selectedModule, setSelectedModule] = useState<string>('ALL');

  // Filter events that have diff or before/after changes
  const diffEvents = events.filter((e) => {
    const hasDiff = (e.diff && e.diff.length > 0) || e.before || e.after;
    if (selectedModule !== 'ALL') {
      return hasDiff && e.module.toLowerCase() === selectedModule.toLowerCase();
    }
    return hasDiff;
  });

  return (
    <div className="space-y-4">
      {/* Header & Filter */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <GitCommit className="h-4 w-4 text-cyan-400" />
            <span>Audit Perubahan Data (Field-Level Diff Inspector)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Mencatat setiap mutasi nilai atribut data master sebelum dan sesudah perubahan (zero-loss audit trail).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Pilih Modul:</span>
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-cyan-500"
          >
            <option value="ALL">Semua Modul</option>
            <option value="vehicles">Kendaraan (Vehicles)</option>
            <option value="drivers">Pengemudi (Drivers)</option>
            <option value="routes">Rute (Routes)</option>
            <option value="settings">Konfigurasi & Ambang Batas</option>
            <option value="roles_permissions">Role & Hak Akses</option>
          </select>
        </div>
      </div>

      {/* List of Changes */}
      <div className="space-y-4">
        {diffEvents.length > 0 ? (
          diffEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => onSelectEvent(event)}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-xl hover:border-slate-700 transition cursor-pointer group"
            >
              {/* Event Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 uppercase">
                      {event.module}
                    </span>
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition">
                      {event.actionLabel || event.action} • {event.entityName}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Diubah oleh <strong className="text-slate-300">{event.actor.name}</strong> ({event.actor.role})
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-mono text-slate-400">
                    {new Date(event.timestamp).toLocaleString('id-ID')}
                  </span>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Seq #{event.sequenceNumber}
                  </div>
                </div>
              </div>

              {/* Justification / Reason */}
              {event.reason && (
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 italic">
                  <span className="font-bold not-italic text-slate-400 mr-1.5">Alasan:</span>
                  "{event.reason}"
                </div>
              )}

              {/* Visual Diff Table */}
              {event.diff && event.diff.length > 0 && (
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
                    <span>Nama Field / Atribut</span>
                    <span>Nilai Sebelum (Before)</span>
                    <span>Nilai Sesudah (After)</span>
                  </div>

                  {event.diff.map((item, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs font-mono items-center"
                    >
                      <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                        {item.fieldLabel || item.field}
                      </span>

                      <div className="p-1.5 rounded bg-red-950/30 border border-red-900/30 text-red-300 break-all">
                        {item.before !== undefined ? JSON.stringify(item.before) : '<null>'}
                      </div>

                      <div className="p-1.5 rounded bg-emerald-950/30 border border-emerald-900/30 text-emerald-300 break-all">
                        {item.after !== undefined ? JSON.stringify(item.after) : '<null>'}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end pt-1">
                <span className="text-xs text-cyan-400 font-semibold flex items-center gap-1">
                  <span>Lihat Detail Lengkap & Signature Hash</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-slate-500 text-xs rounded-2xl border border-dashed border-slate-800">
            Tidak ada rekaman perubahan field data yang ditemukan pada filter modul ini.
          </div>
        )}
      </div>
    </div>
  );
};
