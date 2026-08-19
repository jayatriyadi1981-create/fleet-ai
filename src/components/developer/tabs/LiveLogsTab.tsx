import React, { useState } from 'react';
import {
  Activity,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  Globe,
  Radio,
  Copy,
  Check,
} from 'lucide-react';
import { ApiUsageRecord } from '../../../types/externalApi';

interface LiveLogsTabProps {
  logs: ApiUsageRecord[];
}

export const LiveLogsTab: React.FC<LiveLogsTabProps> = ({ logs }) => {
  const [filterStatus, setFilterStatus] = useState<'ALL' | '2XX' | '4XX' | '5XX'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectLog, setInspectLog] = useState<ApiUsageRecord | null>(null);
  const [copiedReqId, setCopiedReqId] = useState(false);

  const filteredLogs = logs.filter(l => {
    const matchesStatus =
      filterStatus === 'ALL'
        ? true
        : filterStatus === '2XX'
        ? l.statusCode >= 200 && l.statusCode < 300
        : filterStatus === '4XX'
        ? l.statusCode >= 400 && l.statusCode < 500
        : l.statusCode >= 500;

    const matchesSearch =
      l.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.requestId.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const handleCopyReqId = () => {
    if (!inspectLog) return;
    navigator.clipboard.writeText(inspectLog.requestId);
    setCopiedReqId(true);
    setTimeout(() => setCopiedReqId(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            <span>Live Traffic Request Logs</span>
          </h3>
          <p className="text-slate-400 text-xs">
            Aliran live request masuk ke API Gateway dengan penelusuran X-Request-ID.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            {(['ALL', '2XX', '4XX', '5XX'] as const).map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  filterStatus === st
                    ? 'bg-cyan-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari Request ID, Path, atau Method..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>
          <span className="text-xs text-slate-400">
            Total <strong className="text-white">{filteredLogs.length}</strong> logs tercatat
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Method & Path</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Latency</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-sans">
                    Tidak ada log request yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.slice(0, 25).map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                            log.method === 'GET'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : log.method === 'POST'
                              ? 'bg-cyan-500/20 text-cyan-400'
                              : log.method === 'PATCH'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {log.method}
                        </span>
                        <span className="text-slate-200 truncate max-w-xs">{log.path}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.statusCode >= 200 && log.statusCode < 300
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : log.statusCode === 429
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {log.statusCode}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-300">{log.durationMs}ms</td>

                    <td className="py-3 px-4 text-slate-400">{log.ip}</td>

                    <td className="py-3 px-4 text-slate-400 truncate max-w-[120px]">
                      {log.requestId}
                    </td>

                    <td className="py-3 px-4 text-slate-400">
                      {new Date(log.timestamp).toLocaleTimeString('id-ID')}
                    </td>

                    <td className="py-3 px-4 text-right font-sans">
                      <button
                        onClick={() => setInspectLog(log)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                      >
                        <Eye className="w-3 h-3 text-cyan-400" />
                        <span>Detail</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INSPECT LOG MODAL */}
      {inspectLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-sans">
              <div>
                <h3 className="text-base font-bold text-white">HTTP Request Trace</h3>
                <p className="text-xs text-cyan-400 font-mono">{inspectLog.method} {inspectLog.path}</p>
              </div>
              <button onClick={() => setInspectLog(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-2 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Request ID:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-cyan-300">{inspectLog.requestId}</span>
                  <button onClick={handleCopyReqId} className="text-slate-400 hover:text-white">
                    {copiedReqId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">HTTP Status:</span>
                <span className={inspectLog.statusCode === 200 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {inspectLog.statusCode}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Duration:</span>
                <span className="text-white">{inspectLog.durationMs} ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Client IP:</span>
                <span className="text-white">{inspectLog.ip}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">User Agent:</span>
                <span className="text-slate-300 truncate max-w-xs">{inspectLog.userAgent}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Environment:</span>
                <span className="text-amber-400">{inspectLog.environment}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2 font-sans">
              <button
                onClick={() => setInspectLog(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
