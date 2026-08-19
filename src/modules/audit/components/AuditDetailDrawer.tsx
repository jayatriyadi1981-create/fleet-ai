/**
 * Fleet Intelligence Smart AI - Audit Event Detail Drawer
 * PROMPT 49 - Enterprise Security & Event Inspector with Before/After Diff & Trace Graph
 */

import React, { useState } from 'react';
import {
  X,
  Shield,
  Clock,
  User,
  Laptop,
  Network,
  GitCommit,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Activity,
  Layers,
  ArrowRight,
  Eye,
  Lock,
  Sparkles,
  Database,
  Share2,
} from 'lucide-react';
import { AuditEvent } from '../types/auditTypes';

interface Props {
  event: AuditEvent | null;
  onClose: () => void;
  onOpenTraceModal?: (correlationId: string) => void;
}

export const AuditDetailDrawer: React.FC<Props> = ({ event, onClose, onOpenTraceModal }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'diff' | 'security' | 'raw'>('overview');
  const [copySuccess, setCopySuccess] = useState(false);

  if (!event) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(event, null, 2));
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'LOW':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      default:
        return 'bg-slate-700/40 text-slate-300 border-slate-600/40';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'FAILED':
      case 'BLOCKED':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default:
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm transition-opacity flex justify-end">
      <div
        className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getStatusBadge(
                  event.status
                )}`}
              >
                {event.status}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getSeverityBadge(
                  event.severity
                )}`}
              >
                {event.severity}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Seq #{event.sequenceNumber} • {event.id}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              {event.actionLabel || event.action}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {onOpenTraceModal && (
              <button
                onClick={() => onOpenTraceModal(event.correlationId)}
                className="px-2.5 py-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-semibold hover:bg-cyan-900 transition flex items-center gap-1.5"
                title="Lihat End-to-End System Trace"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Trace</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 border-b border-slate-800 flex gap-4 bg-slate-950/30">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Ringkasan Event</span>
          </button>

          {(event.diff || event.before || event.after) && (
            <button
              onClick={() => setActiveTab('diff')}
              className={`py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'diff'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <GitCommit className="h-3.5 w-3.5" />
              <span>Perubahan Data (Before / After)</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('security')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'security'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Konteks & Keamanan</span>
          </button>

          <button
            onClick={() => setActiveTab('raw')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'raw'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Raw JSON & Hash</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Actor & Target Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Actor */}
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <User className="h-4 w-4 text-cyan-400" />
                    <span>PELAKU AKSI (ACTOR)</span>
                  </div>
                  <div className="text-sm font-bold text-white">{event.actor.name}</div>
                  <div className="text-xs text-slate-300 font-mono">
                    Peran: <span className="text-cyan-400 font-semibold">{event.actor.role}</span>
                  </div>
                  {event.actor.email && (
                    <div className="text-xs text-slate-400 font-mono">
                      Email: {event.actor.email}
                    </div>
                  )}
                  <div className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                    Tipe: {event.actor.type}
                  </div>
                </div>

                {/* Entity Target */}
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <Database className="h-4 w-4 text-emerald-400" />
                    <span>ENTITAS TARGET</span>
                  </div>
                  <div className="text-sm font-bold text-white">{event.entityName}</div>
                  <div className="text-xs text-slate-300">
                    Tipe: <span className="text-emerald-400 font-semibold">{event.entityType}</span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">ID: {event.entityId}</div>
                  <div className="text-xs text-slate-400">Modul: {event.module}</div>
                </div>
              </div>

              {/* Reason / Note if any */}
              {event.reason && (
                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 space-y-1.5">
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    <span>Alasan / Justifikasi Perubahan:</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed italic">
                    "{event.reason}"
                  </p>
                </div>
              )}

              {/* Metadata Highlights */}
              {event.metadata && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Metadata Aksi Tambahan
                  </h4>
                  <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 font-mono text-xs text-slate-300 space-y-1.5">
                    {Object.entries(event.metadata).map(([key, val]) => (
                      <div key={key} className="flex justify-between border-b border-slate-900 pb-1">
                        <span className="text-slate-400">{key}:</span>
                        <span className="text-cyan-300 font-medium">
                          {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cryptographic Chain Integrity Card */}
              <div className="p-4 rounded-xl border border-cyan-900/40 bg-cyan-950/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <Lock className="h-4 w-4 text-cyan-400" />
                    <span>Integritas Kriptografi Append-Only</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Tervalidasi Imutabel</span>
                  </span>
                </div>
                <div className="space-y-1 text-[11px] font-mono">
                  <div className="text-slate-400 truncate">
                    Event Hash: <span className="text-slate-200">{event.eventHash}</span>
                  </div>
                  <div className="text-slate-500 truncate">
                    Prev Hash : <span>{event.previousHash}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'diff' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400">
                Perbandingan nilai sebelum (Before) dan sesudah (After) perubahan data:
              </div>

              {event.diff && event.diff.length > 0 ? (
                <div className="space-y-3">
                  {event.diff.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 space-y-2"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                        <span className="text-xs font-bold text-cyan-300">
                          {item.fieldLabel || item.field}
                        </span>
                        {item.isSensitive && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                            Masked Secret
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                        <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-900/30 space-y-1">
                          <span className="text-[10px] font-bold text-red-400 uppercase">
                            SEBELUM (BEFORE)
                          </span>
                          <div className="text-red-200 whitespace-pre-wrap break-all">
                            {item.before !== undefined ? JSON.stringify(item.before) : '<null>'}
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-900/30 space-y-1">
                          <span className="text-[10px] font-bold text-emerald-400 uppercase">
                            SESUDAH (AFTER)
                          </span>
                          <div className="text-emerald-200 whitespace-pre-wrap break-all">
                            {item.after !== undefined ? JSON.stringify(item.after) : '<null>'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 text-xs rounded-xl border border-dashed border-slate-800">
                  Tidak ada rekaman field diff terperinci untuk aksi ini.
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Parameter Jaringan & Lingkungan Keamanan
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 space-y-1">
                  <span className="text-slate-400 text-[11px]">Alamat IP:</span>
                  <p className="text-white font-bold">{event.security.ipAddress}</p>
                </div>
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 space-y-1">
                  <span className="text-slate-400 text-[11px]">Lokasi / Geo:</span>
                  <p className="text-white font-bold">
                    {event.security.city}, {event.security.country}
                  </p>
                </div>
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 space-y-1">
                  <span className="text-slate-400 text-[11px]">Browser & OS:</span>
                  <p className="text-white font-bold">
                    {event.security.browser || 'N/A'} • {event.security.os || 'N/A'}
                  </p>
                </div>
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 space-y-1">
                  <span className="text-slate-400 text-[11px]">Risk Assessment Score:</span>
                  <p
                    className={`font-bold ${
                      (event.security.riskScore || 0) > 50
                        ? 'text-rose-400'
                        : (event.security.riskScore || 0) > 20
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {event.security.riskScore || 0} / 100
                  </p>
                </div>
              </div>

              {event.security.failureReason && (
                <div className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-950/30 text-xs text-rose-200">
                  <span className="font-bold block text-rose-300 mb-1">Penyebab Kegagalan:</span>
                  {event.security.failureReason}
                </div>
              )}

              <div className="space-y-1.5 pt-2">
                <span className="text-xs font-bold text-slate-400">User Agent Penuh:</span>
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/80 text-[11px] font-mono text-slate-300 break-all">
                  {event.security.userAgent}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono text-xs">
                <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 truncate">
                  <span className="text-slate-500">Request ID:</span> {event.requestId}
                </div>
                <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 truncate">
                  <span className="text-slate-500">Correlation ID:</span> {event.correlationId}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'raw' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Payload JSON Imutabel:</span>
                <button
                  onClick={handleCopyJson}
                  className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 transition"
                >
                  {copySuccess ? 'Tersalin!' : 'Salin JSON'}
                </button>
              </div>
              <pre className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-xs font-mono text-cyan-200 overflow-x-auto max-h-[450px]">
                {JSON.stringify(event, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            <span>{new Date(event.timestamp).toLocaleString('id-ID')}</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition"
          >
            Tutup Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
