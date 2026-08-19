import React, { useState } from 'react';
import {
  ListFilter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
  Search,
  ExternalLink,
  ChevronRight,
  Shield,
  Download,
  Info,
  DollarSign,
  Radio,
} from 'lucide-react';
import { NotificationDeliveryLog, NotificationChannel, ChannelDeliveryStatus } from '../../../modules/notifications/types/notificationEngineTypes';
import { notificationAnalyticsService } from '../../../modules/notifications/services/notificationAnalyticsService';

interface LiveLogsAuditTabProps {
  onRefresh: () => void;
}

export const LiveLogsAuditTab: React.FC<LiveLogsAuditTabProps> = ({ onRefresh }) => {
  const [channelFilter, setChannelFilter] = useState<NotificationChannel | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<ChannelDeliveryStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState<NotificationDeliveryLog | null>(null);

  const logs = notificationAnalyticsService.getLogs();

  const filteredLogs = logs.filter(log => {
    if (channelFilter !== 'ALL' && log.channel !== channelFilter) return false;
    if (statusFilter !== 'ALL' && log.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        log.recipient.toLowerCase().includes(q) ||
        log.title.toLowerCase().includes(q) ||
        (log.recipientName && log.recipientName.toLowerCase().includes(q)) ||
        log.eventType.toLowerCase().includes(q) ||
        log.provider.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filters & Actions Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari penerima, judul, event, provider..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={channelFilter}
            onChange={e => setChannelFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none"
          >
            <option value="ALL">Semua Channel</option>
            <option value="WHATSAPP">WhatsApp</option>
            <option value="PUSH">Push</option>
            <option value="EMAIL">Email</option>
            <option value="SMS">SMS</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none"
          >
            <option value="ALL">Semua Status</option>
            <option value="DELIVERED">Delivered</option>
            <option value="READ">Read</option>
            <option value="SENT">Sent</option>
            <option value="FAILED">Failed</option>
            <option value="RETRYING">Retrying</option>
          </select>

          <button
            onClick={onRefresh}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Refresh Logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Logs Table & Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table (8 or 12 Cols) */}
        <div className={`${selectedLog ? 'lg:col-span-7' : 'lg:col-span-12'} p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4`}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              <span>Live Delivery Stream ({filteredLogs.length} Records)</span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Waktu</th>
                  <th className="py-3 px-3">Channel</th>
                  <th className="py-3 px-3">Penerima & Judul</th>
                  <th className="py-3 px-3">Provider</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-2 text-right">Biaya</th>
                  <th className="py-3 px-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {filteredLogs.map(log => {
                  const isSelected = selectedLog?.id === log.id;

                  return (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className={`cursor-pointer transition ${
                        isSelected ? 'bg-cyan-500/10' : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                        {new Date(log.sentAt).toLocaleTimeString('id-ID')}
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-1.5 py-0.5 rounded font-bold uppercase text-[10px] bg-slate-950 text-cyan-300 border border-slate-800">
                          {log.channel}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-sans">
                        <div className="font-bold text-white truncate max-w-[200px]">
                          {log.recipientName || log.recipient}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                          {log.title}
                        </div>
                      </td>

                      <td className="py-3 px-3 text-slate-400 font-sans truncate max-w-[130px]">
                        {log.provider}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            log.status === 'DELIVERED' || log.status === 'READ'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : log.status === 'FAILED'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>

                      <td className="py-3 px-2 text-right text-slate-300 font-mono">
                        {log.costEstimated ? `Rp ${log.costEstimated}` : 'Free'}
                      </td>

                      <td className="py-3 px-2 text-right">
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Details Drawer (5 Cols) */}
        {selectedLog && (
          <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>Rincian Notifikasi Delivery</span>
              </h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Tutup
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Notification ID:</span>
                  <span className="text-white">{selectedLog.notificationId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Provider Message ID:</span>
                  <span className="text-cyan-300 truncate max-w-[180px]">{selectedLog.providerMessageId || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Latency Round-trip:</span>
                  <span className="text-emerald-400">{selectedLog.latencyMs} ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Retry Count:</span>
                  <span className="text-slate-300">{selectedLog.retryCount} / {selectedLog.maxRetries}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 text-[11px] font-semibold">Judul Notifikasi:</label>
                <div className="p-2.5 rounded-xl bg-slate-950 text-white font-bold border border-slate-800">
                  {selectedLog.title}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 text-[11px] font-semibold">Isi Pesan Lengkap:</label>
                <div className="p-3 rounded-xl bg-slate-950 text-slate-200 border border-slate-800 whitespace-pre-wrap leading-relaxed">
                  {selectedLog.body}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Estimasi Biaya Gateway:</span>
                <strong className="text-amber-400 font-mono">
                  {selectedLog.costEstimated ? `Rp ${selectedLog.costEstimated} (Official Meta/Telkomsel)` : 'Rp 0 (Push / Self-hosted)'}
                </strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
