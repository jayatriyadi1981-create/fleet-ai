import React from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Zap,
  Radio,
  Server,
  Layers,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { NotificationAnalyticsSummary, NotificationProviderConfig } from '../../../modules/notifications/types/notificationEngineTypes';
import { providerRegistry } from '../../../modules/notifications/core/ProviderRegistry';

interface OverviewHealthTabProps {
  summary: NotificationAnalyticsSummary;
  onRefresh: () => void;
  onNavigateTab: (tabKey: any) => void;
}

export const OverviewHealthTab: React.FC<OverviewHealthTabProps> = ({
  summary,
  onRefresh,
  onNavigateTab,
}) => {
  const providerConfigs = providerRegistry.getAllConfigs();

  return (
    <div className="space-y-6">
      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Dispatched</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {summary.totalNotifications.toLocaleString('id-ID')}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% peningkatan volume bulan ini</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Delivery Success Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            {summary.overallDeliveryRate.toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-400">
            {summary.totalFailed} failed / {summary.queueDepth} di antrean retry
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Estimated Monthly Cost</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            Rp {summary.totalEstimatedCost.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-cyan-400">
            WhatsApp & SMS Official BSP Cost
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Providers</span>
            <Server className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {providerConfigs.filter(p => p.isEnabled).length} / {providerConfigs.length} Active
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>High-Availability Fallback Ready</span>
          </div>
        </div>
      </div>

      {/* Provider Health Grid */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              <span>Status Konektivitas & Latensi Provider (Multi-Channel)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Monitoring real-time API health, success rate, dan latency failover switch.
            </p>
          </div>
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Health</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {providerConfigs.slice(0, 8).map(p => (
            <div
              key={p.id}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold bg-slate-900 text-cyan-300 border border-slate-800">
                  {p.channel}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    p.healthStatus === 'HEALTHY'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  {p.healthStatus}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white truncate">{p.displayName}</h4>
                <p className="text-[11px] text-slate-400 truncate">{p.description}</p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-900 pt-2 font-mono">
                <span>Success: <strong className="text-emerald-400">{p.successRate}%</strong></span>
                <span>RTT: <strong className="text-slate-200">{p.avgLatencyMs}ms</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Channel Volume Distribution & Top Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel Breakdown */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Distribusi Volume per Channel</span>
          </h3>

          <div className="space-y-3">
            {Object.values(summary.channels).map(ch => (
              <div key={ch.channel} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-white">{ch.channel}</span>
                  <span className="text-slate-400 font-mono">
                    {ch.totalSent.toLocaleString('id-ID')} msgs ({ch.deliveryRatePercent}% Sukses)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      ch.channel === 'WHATSAPP'
                        ? 'bg-emerald-500'
                        : ch.channel === 'PUSH'
                        ? 'bg-cyan-500'
                        : ch.channel === 'EMAIL'
                        ? 'bg-purple-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(15, (ch.totalSent / summary.totalNotifications) * 300))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Simulator CTA Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-cyan-950/40 border border-cyan-500/20 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-bold">
              <Zap className="w-3.5 h-3.5" />
              <span>Interactive Telematics Simulator</span>
            </div>
            <h3 className="text-base font-bold text-white">
              Uji Coba Notifikasi Real-time & Fallback
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Simulasikan insiden telematika (Overspeed, Panic SOS Darurat, Fuel Anomaly, Jadwal Servis, dan Rekomendasi AI) untuk menguji pengiriman live ke WhatsApp, SMS, Push, dan Email secara bersamaan.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateTab('SIMULATOR')}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>Buka Test Simulator</span>
            </button>
            <button
              onClick={() => onNavigateTab('PROVIDERS')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
            >
              Kelola Provider
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
