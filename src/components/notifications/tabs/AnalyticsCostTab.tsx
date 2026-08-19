import React from 'react';
import {
  DollarSign,
  TrendingUp,
  PieChart,
  BarChart3,
  Layers,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { NotificationAnalyticsSummary } from '../../../modules/notifications/types/notificationEngineTypes';

interface AnalyticsCostTabProps {
  summary: NotificationAnalyticsSummary;
}

export const AnalyticsCostTab: React.FC<AnalyticsCostTabProps> = ({ summary }) => {
  return (
    <div className="space-y-6">
      {/* Cost Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Biaya Gateway (Bulan Ini)</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            Rp {summary.totalEstimatedCost.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>-12.5% lebih efisien dibanding SMS konvensional</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">WhatsApp Cloud API Volume</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            {summary.channels.WHATSAPP.totalSent.toLocaleString('id-ID')} msgs
          </div>
          <div className="text-[11px] text-slate-400">
            Estimasi: Rp {summary.channels.WHATSAPP.estimatedCostTotal.toLocaleString('id-ID')} (Rp ~385/msg)
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">SMS OTP & Emergency</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono">
            {summary.channels.SMS.totalSent.toLocaleString('id-ID')} msgs
          </div>
          <div className="text-[11px] text-slate-400">
            Telkomsel SMPP: Rp {summary.channels.SMS.estimatedCostTotal.toLocaleString('id-ID')}
          </div>
        </div>
      </div>

      {/* Breakdown per Channel Table */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <span>Analisis Efisiensi & Delivery Rate per Channel</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-mono">
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-3 text-right">Total Sent</th>
                <th className="py-3 px-3 text-right">Delivered</th>
                <th className="py-3 px-3 text-right">Delivery Rate</th>
                <th className="py-3 px-3 text-right">Avg RTT Latency</th>
                <th className="py-3 px-4 text-right">Estimasi Biaya</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {Object.values(summary.channels).map(ch => (
                <tr key={ch.channel} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2 font-sans">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        ch.channel === 'WHATSAPP'
                          ? 'bg-emerald-500'
                          : ch.channel === 'PUSH'
                          ? 'bg-cyan-500'
                          : ch.channel === 'EMAIL'
                          ? 'bg-purple-500'
                          : 'bg-amber-500'
                      }`}
                    />
                    <span>{ch.channel}</span>
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300">
                    {ch.totalSent.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-400 font-bold">
                    {ch.totalDelivered.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-bold">
                      {ch.deliveryRatePercent}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300">{ch.avgLatencyMs} ms</td>
                  <td className="py-3 px-4 text-right text-amber-400 font-bold">
                    {ch.estimatedCostTotal > 0 ? `Rp ${ch.estimatedCostTotal.toLocaleString('id-ID')}` : 'Gratis / Push'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
