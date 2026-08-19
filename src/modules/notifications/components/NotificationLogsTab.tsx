/**
 * Fleet Intelligence Smart AI - Notification Logs & Analytics Tab Component
 */

import React, { useState } from 'react';
import { notificationDeliveryService } from '../services/notificationDeliveryService';
import { notificationQueueService } from '../services/notificationQueueService';
import { notificationAnalyticsService } from '../services/notificationAnalyticsService';
import { NotificationDelivery } from '../types';
import {
  History,
  RotateCcw,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Send,
  BarChart3,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';

export const NotificationLogsTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'DELIVERY_LOGS' | 'DEAD_LETTER_QUEUE' | 'FAILURE_ANALYTICS'>('DELIVERY_LOGS');
  const [logs, setLogs] = useState(() => notificationDeliveryService.getDeliveryLogs());
  const [dlqJobs, setDlqJobs] = useState(() => notificationQueueService.getDeadLetterQueue());
  const [search, setSearch] = useState('');

  const stats = notificationAnalyticsService.getChannelPerformance();
  const providerFailures = notificationAnalyticsService.getProviderFailures();

  const filteredLogs = logs.filter((l) => {
    return (
      l.notificationId.toLowerCase().includes(search.toLowerCase()) ||
      l.recipient.toLowerCase().includes(search.toLowerCase()) ||
      l.channel.toLowerCase().includes(search.toLowerCase()) ||
      l.provider.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleRetryDlq = (jobId: string) => {
    notificationQueueService.retryDeadLetterJob(jobId);
    setDlqJobs([...notificationQueueService.getDeadLetterQueue()]);
    setLogs([...notificationDeliveryService.getDeliveryLogs()]);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            Audit Log Pengiriman & Dead Letter Queue (DLQ)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Rekam jejak komprehensif pengiriman multi-channel, penanganan retry backoff, serta analitik kegagalan provider.
          </p>
        </div>
      </div>

      {/* Analytics Summary Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.slice(0, 4).map((s) => (
          <div key={s.channel} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-md space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>{s.channel}</span>
              <span className="text-emerald-400 font-bold">{s.successRatePct}% Success</span>
            </div>
            <div className="text-lg font-bold font-mono text-white">{s.sentCount} Msg</div>
            <div className="text-[10px] text-slate-500 font-mono">Avg Latency: {s.avgLatencyMs}ms</div>
          </div>
        ))}
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex border-b border-slate-800 overflow-x-auto no-scrollbar gap-2 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('DELIVERY_LOGS')}
          className={`pb-3 px-3 border-b-2 transition-all whitespace-nowrap ${
            activeSubTab === 'DELIVERY_LOGS'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Delivery Audit Logs ({logs.length})
        </button>

        <button
          onClick={() => setActiveSubTab('DEAD_LETTER_QUEUE')}
          className={`pb-3 px-3 border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeSubTab === 'DEAD_LETTER_QUEUE'
              ? 'border-rose-500 text-rose-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <XCircle className="w-4 h-4 text-rose-400" />
          Dead Letter Queue / DLQ ({dlqJobs.length})
        </button>

        <button
          onClick={() => setActiveSubTab('FAILURE_ANALYTICS')}
          className={`pb-3 px-3 border-b-2 transition-all whitespace-nowrap ${
            activeSubTab === 'FAILURE_ANALYTICS'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Analitik Kegagalan Provider Gateway
        </button>
      </div>

      {/* Search Toolbar */}
      {activeSubTab === 'DELIVERY_LOGS' && (
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari ID Notifikasi, Penerima, Provider..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      )}

      {/* 1. Delivery Logs Table */}
      {activeSubTab === 'DELIVERY_LOGS' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[10px] uppercase text-slate-400 font-semibold">
              <tr>
                <th className="p-3">Waktu Log</th>
                <th className="p-3">ID Notifikasi</th>
                <th className="p-3">Kanal</th>
                <th className="p-3">Penerima</th>
                <th className="p-3">Provider Gateway</th>
                <th className="p-3 text-center">Percobaan</th>
                <th className="p-3 text-center">Status Delivery</th>
                <th className="p-3">Provider Message ID / Error</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30">
                  <td className="p-3 text-[11px] text-slate-400">{new Date(log.sentAt || Date.now()).toLocaleTimeString('id-ID')}</td>
                  <td className="p-3 font-bold text-white">{log.notificationId}</td>
                  <td className="p-3 text-cyan-300 font-bold">{log.channel}</td>
                  <td className="p-3 text-slate-300">{log.recipient}</td>
                  <td className="p-3 text-slate-400 text-[11px]">{log.provider}</td>
                  <td className="p-3 text-center font-bold">{log.attempts}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        log.status === 'DELIVERED' || log.status === 'READ'
                          ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                          : log.status === 'FAILED'
                          ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                          : 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="p-3 text-[11px]">
                    {log.providerMessageId ? (
                      <span className="text-emerald-400">{log.providerMessageId}</span>
                    ) : (
                      <span className="text-rose-400">{log.errorMessage || 'N/A'}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 2. Dead Letter Queue Table */}
      {activeSubTab === 'DEAD_LETTER_QUEUE' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-rose-400 text-sm flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Dead Letter Queue / Exceeded Retry Jobs
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Daftar pekerjaan pengiriman yang gagal setelah melewati batas retries (3x).
              </p>
            </div>
          </div>

          {dlqJobs.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              ✨ Dead Letter Queue bersih! Tidak ada pekerjaan pengiriman yang tersangkut.
            </div>
          ) : (
            <div className="space-y-3">
              {dlqJobs.map((job) => (
                <div key={job.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div className="space-y-1 font-mono">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-rose-400">JOB #{job.id}</span>
                      <span className="text-slate-400">Channel: {job.channel}</span>
                      <span className="text-slate-500">Notif ID: {job.notificationId}</span>
                    </div>
                    <p className="text-rose-300 text-[11px]">Reason: {job.lastError}</p>
                  </div>

                  <button
                    onClick={() => handleRetryDlq(job.id)}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Retry Job Ini Manual
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Failure Analytics */}
      {activeSubTab === 'FAILURE_ANALYTICS' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md space-y-4">
          <h3 className="font-bold text-white text-sm">Analitik Kegagalan Provider Gateway</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-[10px] uppercase text-slate-400 font-semibold">
                <tr>
                  <th className="p-3">Nama Provider Gateway</th>
                  <th className="p-3 text-center">Total Failures</th>
                  <th className="p-3 text-center">Failure Rate (%)</th>
                  <th className="p-3">Waktu Insiden Terakhir</th>
                  <th className="p-3">Penyebab Utama / Top Error Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {providerFailures.map((pf) => (
                  <tr key={pf.provider} className="hover:bg-slate-800/30">
                    <td className="p-3 font-bold text-white">{pf.provider}</td>
                    <td className="p-3 text-center text-rose-400 font-bold">{pf.failures}</td>
                    <td className="p-3 text-center text-amber-400 font-bold">{pf.failureRatePct}%</td>
                    <td className="p-3 text-slate-400 text-[11px]">{pf.lastFailureTime}</td>
                    <td className="p-3 text-rose-300 text-[11px]">{pf.topError}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
