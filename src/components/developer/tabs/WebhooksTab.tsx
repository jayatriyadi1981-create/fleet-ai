import React, { useState } from 'react';
import {
  Webhook,
  Plus,
  Play,
  RotateCw,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Radio,
  Copy,
  Check,
  Send,
  Eye,
} from 'lucide-react';
import {
  WebhookSubscription,
  WebhookEventType,
  WebhookDeliveryLog,
  WEBHOOK_EVENT_DEFINITIONS,
} from '../../../types/externalApi';
import { webhookService } from '../../../services/api/webhookService';
import { useFleet } from '../../../context/FleetContext';

interface WebhooksTabProps {
  webhooks: WebhookSubscription[];
  deliveryLogs: WebhookDeliveryLog[];
  onRefresh: () => void;
}

export const WebhooksTab: React.FC<WebhooksTabProps> = ({ webhooks, deliveryLogs, onRefresh }) => {
  const { currentTenant } = useFleet();

  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [targetUrl, setTargetUrl] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<WebhookEventType[]>([
    'trip.completed',
    'alert.created',
    'fuel.anomaly',
  ]);

  // Test Dispatch Modal State
  const [testModal, setTestModal] = useState<{
    webhook: WebhookSubscription;
    event: WebhookEventType;
  } | null>(null);

  const [testDispatching, setTestDispatching] = useState(false);
  const [lastTestResult, setLastTestResult] = useState<WebhookDeliveryLog | null>(null);

  // Payload Inspector Modal
  const [inspectPayloadLog, setInspectPayloadLog] = useState<WebhookDeliveryLog | null>(null);

  // Copied secret state
  const [copiedSecretId, setCopiedSecretId] = useState<string | null>(null);

  const handleToggleEvent = (evt: WebhookEventType) => {
    setSelectedEvents(prev =>
      prev.includes(evt) ? prev.filter(e => e !== evt) : [...prev, evt]
    );
  };

  const handleCreateWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl.trim() || selectedEvents.length === 0) return;

    webhookService.createSubscription({
      tenantId: currentTenant.id,
      url: targetUrl.trim(),
      events: selectedEvents,
      description: description.trim() || undefined,
    });

    setIsCreateModalOpen(false);
    setTargetUrl('');
    setDescription('');
    onRefresh();
  };

  const handleRotateSecret = (id: string) => {
    webhookService.rotateSecret(id);
    onRefresh();
  };

  const handleToggleStatus = (id: string, currentStatus: 'ACTIVE' | 'PAUSED' | 'FAILED') => {
    webhookService.updateSubscription(id, {
      status: currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE',
    });
    onRefresh();
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus langganan webhook ini?')) {
      webhookService.deleteSubscription(id);
      onRefresh();
    }
  };

  const handleExecuteTestPing = async () => {
    if (!testModal) return;
    setTestDispatching(true);

    const log = await webhookService.dispatchTestEvent(
      testModal.webhook.id,
      testModal.event,
      {
        simulated: true,
        dispatchedAt: new Date().toISOString(),
        tenant: currentTenant.name,
      }
    );

    setTestDispatching(false);
    setLastTestResult(log);
    onRefresh();
  };

  const handleCopySecret = (webhook: WebhookSubscription) => {
    navigator.clipboard.writeText(webhook.secretKey || webhook.secret);
    setCopiedSecretId(webhook.id);
    setTimeout(() => setCopiedSecretId(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Webhook className="w-5 h-5 text-cyan-400" />
            <span>Webhooks & Real-time Event Streams</span>
          </h3>
          <p className="text-slate-400 text-xs">
            Dapatkan push notification seketika ke URL server Anda dengan verifikasi HMAC SHA-256.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Daftarkan Webhook Baru</span>
        </button>
      </div>

      {/* Subscriptions Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Langganan Webhook Aktif ({webhooks.length})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Target Endpoint URL</th>
                <th className="py-3.5 px-4">Event Langganan</th>
                <th className="py-3.5 px-4">Signing Secret (HMAC)</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Kegagalan</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {webhooks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Belum ada webhook endpoint yang terdaftar.
                  </td>
                </tr>
              ) : (
                webhooks.map(wh => (
                  <tr key={wh.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-cyan-300">
                      <div>{wh.url}</div>
                      {wh.description && (
                        <div className="text-[11px] text-slate-400 font-sans mt-0.5">{wh.description}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {wh.events.map(ev => (
                          <span key={ev} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-emerald-400 font-mono">
                            {ev}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">
                          {(wh.secretKey || wh.secret || '').substring(0, 10)}••••••••••
                        </span>
                        <button
                          onClick={() => handleCopySecret(wh)}
                          title="Salin Secret"
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                        >
                          {copiedSecretId === wh.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStatus(wh.id, wh.status)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          wh.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {wh.status === 'ACTIVE' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span>{wh.status}</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={wh.failureCount > 0 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                        {wh.failureCount} / 5
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setTestModal({ webhook: wh, event: wh.events[0] || 'trip.completed' })}
                          title="Trigger Test Event"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-all"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleRotateSecret(wh.id)}
                          title="Rotate Secret"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 transition-all"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(wh.id)}
                          title="Hapus Webhook"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-rose-400 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Webhook Delivery Logs Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Histori Pengiriman Webhook (Delivery Logs)
          </span>
          <span className="text-xs text-slate-400">{deliveryLogs.length} pengiriman tercatat</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">HTTP Status</th>
                <th className="py-3 px-4">Percobaan</th>
                <th className="py-3 px-4">Latency</th>
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4 text-right">Inspect Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {deliveryLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-500">
                    Belum ada log pengiriman webhook.
                  </td>
                </tr>
              ) : (
                deliveryLogs.slice(0, 15).map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-mono text-cyan-300">{log.event}</td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          log.statusCode === 200
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {log.statusCode || 'FAIL'} {log.statusCode === 200 ? 'OK' : 'ERR'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-400">Attempt {log.attempt}</td>

                    <td className="py-3 px-4 font-mono text-slate-400">{log.latencyMs || log.durationMs || 0}ms</td>

                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {new Date(log.deliveredAt || log.timestamp || Date.now()).toLocaleTimeString('id-ID')}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setInspectPayloadLog(log)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                      >
                        <Eye className="w-3 h-3 text-cyan-400" />
                        <span>Detail Payload</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE WEBHOOK MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Webhook className="w-5 h-5 text-cyan-400" />
                <span>Daftarkan Webhook Baru</span>
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateWebhook} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  HTTPS Endpoint URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://your-server.com/api/webhooks/fleet"
                  value={targetUrl}
                  onChange={e => setTargetUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Deskripsi / Keterangan
                </label>
                <input
                  type="text"
                  placeholder="Sync trip & fuel alert ke TMS Odoo"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Pilih Event yang Dilanggani *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 rounded-xl bg-slate-950 border border-slate-800">
                  {WEBHOOK_EVENT_DEFINITIONS.map(ev => {
                    const isChecked = selectedEvents.includes(ev.event);
                    return (
                      <label
                        key={ev.event}
                        className={`flex items-start gap-2 p-2 rounded-lg border cursor-pointer text-xs transition-all ${
                          isChecked
                            ? 'bg-cyan-500/10 border-cyan-500/40 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleEvent(ev.event)}
                          className="mt-0.5 accent-cyan-500"
                        />
                        <div>
                          <div className="font-semibold">{ev.label}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{ev.event}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20"
                >
                  Daftarkan Webhook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TEST DISPATCH MODAL */}
      {testModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-cyan-400" />
                <span>Kirim Test Webhook Dispatch</span>
              </h3>
              <button onClick={() => setTestModal(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Target Endpoint URL</label>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-cyan-300">
                  {testModal.webhook.url}
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Pilih Event Simulasi</label>
                <select
                  value={testModal.event}
                  onChange={e => setTestModal({ ...testModal, event: e.target.value as WebhookEventType })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                >
                  {testModal.webhook.events.map(e => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>

              {lastTestResult && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Hasil Pengiriman:</span>
                    <span className="text-emerald-400 font-bold font-mono">
                      HTTP {lastTestResult.statusCode} OK ({lastTestResult.latencyMs || lastTestResult.durationMs || 0}ms)
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">
                    Signature: {lastTestResult.signature}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => { setTestModal(null); setLastTestResult(null); }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Tutup
              </button>
              <button
                onClick={handleExecuteTestPing}
                disabled={testDispatching}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold disabled:opacity-50 flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{testDispatching ? 'Mengirim...' : 'Kirim Sekarang'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INSPECT PAYLOAD MODAL */}
      {inspectPayloadLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Webhook Payload Details</h3>
                <p className="text-xs font-mono text-cyan-400">{inspectPayloadLog.event}</p>
              </div>
              <button onClick={() => setInspectPayloadLog(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 space-y-1">
                <div><strong className="text-slate-200">Header:</strong> X-Fleet-Event: {inspectPayloadLog.event}</div>
                <div><strong className="text-slate-200">Header:</strong> X-Fleet-Delivery: {inspectPayloadLog.id}</div>
                <div className="break-all"><strong className="text-slate-200">Header:</strong> X-Fleet-Signature: {inspectPayloadLog.signature}</div>
              </div>

              <div className="relative rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
                <pre className="p-4 text-emerald-400 overflow-x-auto max-h-72 leading-relaxed">
                  <code>{JSON.stringify(inspectPayloadLog.payload, null, 2)}</code>
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectPayloadLog(null)}
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
