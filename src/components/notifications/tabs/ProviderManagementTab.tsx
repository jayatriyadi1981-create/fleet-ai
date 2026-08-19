import React, { useState } from 'react';
import {
  Server,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Zap,
  Shield,
  Key,
  Sliders,
  ExternalLink,
  Lock,
  Play,
  Settings2,
} from 'lucide-react';
import { NotificationChannel, NotificationProviderConfig } from '../../../modules/notifications/types/notificationEngineTypes';
import { providerRegistry } from '../../../modules/notifications/core/ProviderRegistry';

interface ProviderManagementTabProps {
  onRefresh: () => void;
}

export const ProviderManagementTab: React.FC<ProviderManagementTabProps> = ({ onRefresh }) => {
  const [selectedChannel, setSelectedChannel] = useState<NotificationChannel | 'ALL'>('ALL');
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; success: boolean; latency: number; error?: string } | null>(null);
  const [rotationModal, setRotationModal] = useState<NotificationProviderConfig | null>(null);
  const [newKeyInput, setNewKeyInput] = useState('');

  const configs = providerRegistry.getAllConfigs();
  const filtered = selectedChannel === 'ALL'
    ? configs
    : configs.filter(c => c.channel === selectedChannel);

  const handleTestProvider = async (providerId: string) => {
    setTestingId(providerId);
    setTestResult(null);
    try {
      const res = await providerRegistry.testProvider(providerId);
      setTestResult({
        id: providerId,
        success: res.success,
        latency: res.latencyMs,
        error: res.error,
      });
      onRefresh();
    } finally {
      setTestingId(null);
    }
  };

  const handleSetPrimary = (channel: NotificationChannel, providerId: string) => {
    providerRegistry.setPrimaryProvider(channel, providerId);
    onRefresh();
  };

  const handleSetFallback = (channel: NotificationChannel, providerId: string) => {
    providerRegistry.setFallbackProvider(channel, providerId);
    onRefresh();
  };

  const handleToggleEnabled = (providerId: string, enabled: boolean) => {
    providerRegistry.toggleProviderEnabled(providerId, enabled);
    onRefresh();
  };

  const handleRotateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rotationModal) return;
    const preview = newKeyInput.trim().slice(-4) || '9921';
    providerRegistry.rotateCredentials(rotationModal.id, preview);
    setRotationModal(null);
    setNewKeyInput('');
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter by Channel */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-cyan-400" />
            <span>Multi-Provider Abstraction Architecture</span>
          </h2>
          <p className="text-xs text-slate-400">
            Konfigurasikan Primary & Fallback Provider per channel (Email, WhatsApp, Push, SMS) tanpa mengubah business logic aplikasi.
          </p>
        </div>

        {/* Channel Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {(['ALL', 'WHATSAPP', 'EMAIL', 'PUSH', 'SMS'] as const).map(ch => (
            <button
              key={ch}
              onClick={() => setSelectedChannel(ch)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                selectedChannel === ch
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {ch}
            </button>
          ))}
        </div>
      </div>

      {/* Provider Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(provider => {
          const isTesting = testingId === provider.id;
          const currentTest = testResult?.id === provider.id ? testResult : null;

          return (
            <div
              key={provider.id}
              className={`p-6 rounded-2xl bg-slate-900/90 border transition-all space-y-4 ${
                provider.isPrimary
                  ? 'border-cyan-500/40 shadow-lg shadow-cyan-500/5 ring-1 ring-cyan-500/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-slate-950 text-cyan-300 border border-slate-800">
                      {provider.channel}
                    </span>
                    {provider.isPrimary && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-cyan-400" />
                        PRIMARY PROVIDER
                      </span>
                    )}
                    {provider.isFallback && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                        <Shield className="w-3 h-3 text-purple-400" />
                        FALLBACK FAILOVER
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white">{provider.displayName}</h3>
                  <p className="text-xs text-slate-400">{provider.description}</p>
                </div>

                {/* Health Badge */}
                <div className="text-right flex flex-col items-end">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      provider.healthStatus === 'HEALTHY'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {provider.healthStatus}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono mt-1">
                    RTT: {provider.avgLatencyMs}ms
                  </span>
                </div>
              </div>

              {/* Masked Credentials & Options */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-400 border-b border-slate-900 pb-1.5">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Credentials (Masked)</span>
                  </span>
                  <button
                    onClick={() => setRotationModal(provider)}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-sans"
                  >
                    <RotateCw className="w-3 h-3" />
                    <span>Rotate Key</span>
                  </button>
                </div>

                <div className="space-y-1 text-slate-300">
                  {Object.entries(provider.credentialsMasked).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-slate-500">{key}:</span>
                      <span className="text-cyan-200">{val}</span>
                    </div>
                  ))}
                  {Object.entries(provider.configOptions).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-slate-500">{key}:</span>
                      <span className="text-slate-300">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Supported Features Tags */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {provider.supportedFeatures.templates && (
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                    ✓ Templates API
                  </span>
                )}
                {provider.supportedFeatures.deliveryReceipts && (
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                    ✓ Delivery Webhooks
                  </span>
                )}
                {provider.supportedFeatures.mediaMessages && (
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                    ✓ Media Messages
                  </span>
                )}
                {provider.supportedFeatures.html && (
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                    ✓ Rich HTML
                  </span>
                )}
              </div>

              {/* Test Result Message if available */}
              {currentTest && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    currentTest.success
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                  }`}
                >
                  {currentTest.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span>
                    {currentTest.success
                      ? `Koneksi berhasil! Latensi: ${currentTest.latency}ms (Status: HEALTHY)`
                      : `Gagal: ${currentTest.error || 'Connection failed'}`}
                  </span>
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    disabled={isTesting}
                    onClick={() => handleTestProvider(provider.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Play className="w-3 h-3 text-cyan-400" />
                    <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {!provider.isPrimary && (
                    <button
                      onClick={() => handleSetPrimary(provider.channel, provider.id)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition"
                    >
                      Set Primary
                    </button>
                  )}
                  {!provider.isFallback && !provider.isPrimary && (
                    <button
                      onClick={() => handleSetFallback(provider.channel, provider.id)}
                      className="px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold transition"
                    >
                      Set Fallback
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rotate Key Modal */}
      {rotationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <RotateCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Rotasi Kredensial Provider</h3>
                <p className="text-xs text-slate-400">{rotationModal.displayName}</p>
              </div>
            </div>

            <form onSubmit={handleRotateKey} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">API Key / Access Token Baru:</label>
                <input
                  type="password"
                  required
                  placeholder="Masukkan API key / secret token baru..."
                  value={newKeyInput}
                  onChange={e => setNewKeyInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                />
                <p className="text-[11px] text-slate-500">
                  Kredensial lama akan diarsipkan dan kunci baru langsung aktif tanpa downtime aplikasi.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRotationModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  Simpan & Terapkan Rotasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
