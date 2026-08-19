/**
 * Fleet Intelligence Smart AI - GPS Integration: Dead Letter Queue (DLQ) Tab
 * PROMPT 43: Failed Packet Ingestion Quarantine, Error Diagnostics, Reprocess & Discard
 */

import React, { useState } from 'react';
import {
  AlertTriangle,
  RotateCcw,
  Trash2,
  CheckCircle2,
  Search,
  Filter,
  Code,
  Check,
  X,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { DeadLetterMessage } from '../../../../types/gpsIntegration';
import { gpsIntegrationService } from '../../../../services/gps/gpsIntegrationService';

export const DeadLetterQueueTab: React.FC = () => {
  const [dlqMessages, setDlqMessages] = useState<DeadLetterMessage[]>(gpsIntegrationService.getDLQMessages());
  const [selectedMessage, setSelectedMessage] = useState<DeadLetterMessage | null>(
    gpsIntegrationService.getDLQMessages()[0] || null
  );
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notification, setNotification] = useState<string | null>(null);

  const filtered = dlqMessages.filter((m) => {
    const matchesSearch =
      m.deviceIdentifier.includes(searchQuery) ||
      m.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.rawPayload.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategory === 'ALL' || m.errorCategory === filterCategory;
    return matchesSearch && matchesCat;
  });

  const handleReprocess = (id: string) => {
    const res = gpsIntegrationService.reprocessDLQ(id, 'Admin Operasional');
    if (res.success) {
      setDlqMessages(gpsIntegrationService.getDLQMessages());
      setNotification(`Pesan DLQ #${id} berhasil diproses ulang.`);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleDiscard = (id: string) => {
    gpsIntegrationService.discardDLQ(id, 'Admin Operasional');
    setDlqMessages(gpsIntegrationService.getDLQMessages());
    setNotification(`Pesan DLQ #${id} dibuang (discarded).`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleBatchReprocess = () => {
    const pending = dlqMessages.filter((m) => m.status === 'PENDING');
    pending.forEach((m) => gpsIntegrationService.reprocessDLQ(m.id, 'Admin Operasional'));
    setDlqMessages(gpsIntegrationService.getDLQMessages());
    setNotification(`${pending.length} pesan DLQ berhasil diproses ulang secara massal.`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header & Batch Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 rounded-2xl border border-slate-800 p-5">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-400" /> Dead Letter Queue (DLQ) &amp; Quarantine
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Karantina paket GPS yang gagal diproses (Checksum korup, IMEI belum terdaftar, format tidak dikenali). Tidak ada data yang hilang tanpa jejak.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleBatchReprocess}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white transition-all shadow-sm"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Proses Ulang Semua Pending</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Messages List & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Failed Packets List */}
        <div className="lg:col-span-7 bg-slate-900/80 rounded-2xl border border-slate-800 p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div className="relative flex-1">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari IMEI / alasan kegagalan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="ALL">Semua Kategori</option>
              <option value="CANNOT_PARSE">CANNOT_PARSE</option>
              <option value="UNKNOWN_DEVICE">UNKNOWN_DEVICE</option>
              <option value="INVALID_PAYLOAD">INVALID_PAYLOAD</option>
            </select>
          </div>

          <div className="space-y-2.5 max-h-[550px] overflow-y-auto pr-1 text-xs">
            {filtered.map((msg) => {
              const isSelected = selectedMessage?.id === msg.id;
              return (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/40 shadow-sm'
                      : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-300">{msg.deviceIdentifier}</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-900 text-slate-300 border border-slate-800">
                          {msg.transport} • {msg.protocol}
                        </span>
                      </div>
                      <p className="text-[11px] text-rose-300 mt-1 font-medium leading-relaxed">{msg.reason}</p>
                    </div>

                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        msg.status === 'PENDING'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : msg.status === 'REPROCESSED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {msg.status}
                    </span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>Received: {new Date(msg.receivedAt).toLocaleTimeString()}</span>
                    <span>Retries: {msg.retryCount}x</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Deep Payload & Audit Viewer */}
        <div className="lg:col-span-5 bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <Code className="h-4 w-4 text-amber-400" /> DLQ Raw Hex &amp; Payload Inspector
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Diagnostic Tool</span>
          </div>

          {selectedMessage ? (
            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>DLQ Message ID:</span>
                  <span className="text-white font-bold">{selectedMessage.id}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Error Category:</span>
                  <span className="text-amber-400 font-bold">{selectedMessage.errorCategory}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Device Identifier:</span>
                  <span className="text-cyan-300 font-bold">{selectedMessage.deviceIdentifier}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block mb-1">
                  Raw Ingested Payload:
                </span>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 max-h-[160px] overflow-y-auto font-mono text-[11px] text-amber-300 break-all leading-relaxed">
                  {selectedMessage.rawPayload}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block mb-1">
                  Audit Log &amp; Processing Trail:
                </span>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-mono text-[10px] text-slate-400">
                  {selectedMessage.auditLog.map((log, lIdx) => (
                    <div key={lIdx}>• {log}</div>
                  ))}
                </div>
              </div>

              {selectedMessage.status === 'PENDING' && (
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => handleReprocess(selectedMessage.id)}
                    className="flex-1 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Proses Ulang Paket</span>
                  </button>
                  <button
                    onClick={() => handleDiscard(selectedMessage.id)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Discard</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500 text-xs">Pilih paket untuk melihat detail error.</div>
          )}
        </div>
      </div>
    </div>
  );
};
