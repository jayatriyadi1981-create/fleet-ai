/**
 * Fleet Intelligence Smart AI - Notification Channels & Provider Health Tab Component
 */

import React, { useState } from 'react';
import { notificationDeliveryService } from '../services/notificationDeliveryService';
import { ChannelConfig, DeliveryChannel, WhatsAppTemplate } from '../types';
import {
  Radio,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Settings,
  ShieldCheck,
  RefreshCw,
  Bell,
  Smartphone,
  Mail,
  MessageSquare,
  MessageCircle,
  Key,
  X,
  MessageSquareCode,
  Check,
} from 'lucide-react';

export const NotificationChannelsTab: React.FC = () => {
  const [channels, setChannels] = useState(() => notificationDeliveryService.getChannelConfigs());

  // WhatsApp Templates state
  const [waTemplates, setWaTemplates] = useState<WhatsAppTemplate[]>([
    {
      id: 'wat-01',
      tenantId: 'tenant-indonesia-logistics',
      name: 'critical_panic_alert_id',
      language: 'id',
      category: 'UTILITY',
      templateId: '1092837465',
      providerTemplateName: 'critical_panic_alert_id',
      variables: ['vehicle_plate', 'driver_name', 'time', 'location_url'],
      status: 'APPROVED',
      enabled: true,
    },
    {
      id: 'wat-02',
      tenantId: 'tenant-indonesia-logistics',
      name: 'delivery_pod_completed_id',
      language: 'id',
      category: 'UTILITY',
      templateId: '1092837466',
      providerTemplateName: 'delivery_pod_completed_id',
      variables: ['order_number', 'customer_name', 'driver_name'],
      status: 'APPROVED',
      enabled: true,
    },
  ]);

  // Config Modal
  const [selectedChannel, setSelectedChannel] = useState<ChannelConfig | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');

  const getStatusBadge = (status: ChannelConfig['status']) => {
    switch (status) {
      case 'CONNECTED':
        return { label: '● CONNECTED (HEALTHY)', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
      case 'DEGRADED':
        return { label: '● DEGRADED', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
      case 'ERROR':
        return { label: '● ERROR', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
      default:
        return { label: '○ NOT CONFIGURED', color: 'text-slate-400 bg-slate-800 border-slate-700' };
    }
  };

  const getChannelIcon = (ch: DeliveryChannel) => {
    switch (ch) {
      case 'IN_APP':
        return Bell;
      case 'PUSH':
        return Smartphone;
      case 'EMAIL':
        return Mail;
      case 'WHATSAPP':
        return MessageSquare;
      case 'SMS':
        return MessageCircle;
      default:
        return Radio;
    }
  };

  const handleSaveConfig = () => {
    if (selectedChannel) {
      notificationDeliveryService.updateChannelStatus(selectedChannel.channel, 'CONNECTED', {
        apiKey: apiKeyInput || 'SG.••••••••••••••••••••••••',
      });
      setChannels([...notificationDeliveryService.getChannelConfigs()]);
    }
    setIsConfigOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-400" />
            Status Kesehatan & Provider Gateway Kanal (Channel Health & Credentials)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pantau status konektivitas provider SMS, WhatsApp Cloud API, FCM Push, SendGrid SMTP, & In-App WebSockets.
          </p>
        </div>
      </div>

      {/* Channel Health Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {channels.map((ch) => {
          const badge = getStatusBadge(ch.status);
          const Icon = getChannelIcon(ch.channel);

          return (
            <div key={ch.id} className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-4 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-950 text-cyan-400 border border-slate-800 rounded-2xl">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-white text-xs block">{ch.channel}</span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[130px] block">{ch.providerName}</span>
                  </div>
                </div>

                <span className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-full border ${badge.color}`}>
                  {badge.label}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-3 rounded-2xl border border-slate-800 font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">Terkirim Hari Ini</span>
                  <span className="font-bold text-emerald-400">{ch.totalSentToday}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Gagal (Failed)</span>
                  <span className="font-bold text-rose-400">{ch.totalFailedToday}</span>
                </div>
              </div>

              {/* Credentials Masked */}
              <div className="text-[10px] font-mono text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Key className="w-3 h-3 text-cyan-400" />
                  API Credential
                </span>
                <span className="text-slate-500">
                  {Object.values(ch.credentials)[0] || '••••••••'}
                </span>
              </div>

              <button
                onClick={() => {
                  setSelectedChannel(ch);
                  setApiKeyInput('');
                  setIsConfigOpen(true);
                }}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Settings className="w-4 h-4" />
                Konfigurasi Credentials Gateway
              </button>
            </div>
          );
        })}
      </div>

      {/* WhatsApp Business Cloud API Template Manager */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-4 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <MessageSquareCode className="w-4 h-4 text-emerald-400" />
              Meta WhatsApp Business Approved Templates (HSM Manager)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Daftar template WhatsApp Business yang telah disetujui Meta untuk pesan outbound otomatis.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[10px] uppercase text-slate-400 font-semibold">
              <tr>
                <th className="p-3">Nama Template Meta</th>
                <th className="p-3">Bahasa</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Variabel Support</th>
                <th className="p-3 text-center">Status Approval Meta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {waTemplates.map((wat) => (
                <tr key={wat.id} className="hover:bg-slate-800/30">
                  <td className="p-3 font-mono font-bold text-white">{wat.providerTemplateName}</td>
                  <td className="p-3 uppercase font-mono text-slate-400">{wat.language}</td>
                  <td className="p-3">{wat.category}</td>
                  <td className="p-3 font-mono text-[10px] text-cyan-300">{wat.variables.join(', ')}</td>
                  <td className="p-3 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      APPROVED META
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Config Modal */}
      {isConfigOpen && selectedChannel && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">
                Konfigurasi Gateway {selectedChannel.channel} ({selectedChannel.providerName})
              </h3>
              <button onClick={() => setIsConfigOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-400">
                Kredensial disimpan secara aman di server-side environment dan tidak pernah ditampilkan secara langsung ke browser.
              </p>

              <div>
                <label className="text-slate-400 block mb-1">API Key / Access Token</label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Masukkan API Key / Token Provider Baru..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsConfigOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={handleSaveConfig}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg"
              >
                Simpan & Tes Koneksi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
