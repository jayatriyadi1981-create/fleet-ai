/**
 * Fleet Intelligence Smart AI - Quotas & Usage Meter Tab (Prompt 41)
 * Real-time gauge meters, resource breakdowns, AI token usage ledger, and threshold warnings
 */

import React, { useState } from 'react';
import { useSubscription } from '../../../context/SubscriptionContext';
import {
  Truck,
  Smartphone,
  Users,
  Bot,
  HardDrive,
  Code2,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowUpRight,
  Filter,
} from 'lucide-react';

interface QuotasMeterTabProps {
  onOpenUpgradeModal: () => void;
}

export const QuotasMeterTab: React.FC<QuotasMeterTabProps> = ({ onOpenUpgradeModal }) => {
  const { usage, effectiveQuotas, currentPlan, aiUsageHistory, hasQuotaWarning } = useSubscription();

  const [aiFilter, setAiFilter] = useState<string>('ALL');

  const quotas = [
    {
      id: 'vehicles',
      name: 'Armada Kendaraan',
      icon: Truck,
      current: usage.vehicles,
      max: effectiveQuotas.vehicleQuota,
      unit: 'unit',
      desc: 'Batas total unit truk, bus, van, dan alat berat aktif.',
      color: 'cyan',
    },
    {
      id: 'devices',
      name: 'GPS Telematics IoT',
      icon: Smartphone,
      current: usage.devices,
      max: effectiveQuotas.deviceQuota,
      unit: 'perangkat',
      desc: 'Perangkat GPS Concox, Teltonika, Meitrack terhubung.',
      color: 'blue',
    },
    {
      id: 'users',
      name: 'Pengguna & Staf',
      icon: Users,
      current: usage.users,
      max: effectiveQuotas.userQuota,
      unit: 'user',
      desc: 'Akun dispatcher, supervisor, manajer bengkel, & admin.',
      color: 'indigo',
    },
    {
      id: 'ai',
      name: 'AI Intelligence Credits',
      icon: Bot,
      current: usage.aiCredits,
      max: effectiveQuotas.aiQuotaCredits,
      unit: 'kredit',
      desc: 'Konsumsi model AI Copilot, Predictive Maintenance, AI Fuel, & Route.',
      color: 'purple',
    },
    {
      id: 'storage',
      name: 'Penyimpanan Dokumen & Foto',
      icon: HardDrive,
      current: usage.storageMb,
      max: effectiveQuotas.storageQuotaMb,
      unit: 'MB',
      desc: 'Arsip foto pre-trip inspeksi, STNK, KIR, dan nota BBM.',
      color: 'emerald',
    },
    {
      id: 'api',
      name: 'REST API & Webhook Ingress',
      icon: Code2,
      current: usage.apiRequests,
      max: effectiveQuotas.apiQuotaMonthly,
      unit: 'req/bln',
      desc: 'Sinkronisasi data telematika dengan ERP & sistem pihak ketiga.',
      color: 'amber',
    },
  ];

  const filteredAiUsage = aiUsageHistory.filter((item) => {
    if (aiFilter === 'ALL') return true;
    return item.feature === aiFilter;
  });

  return (
    <div className="space-y-6">
      {/* Warning banner if high usage */}
      {hasQuotaWarning && (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-orange-900">Beberapa Kuota Mencapai Ambang Batas</h4>
              <p className="text-xs text-orange-700 mt-0.5">
                Penggunaan armada atau AI telah melebihi 85%. Disarankan untuk upgrade ke paket lebih tinggi agar operasional tidak terhambat.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenUpgradeModal}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0 shadow-xs"
          >
            Upgrade Kuota
          </button>
        </div>
      )}

      {/* Quota Gauges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {quotas.map((q) => {
          const isUnlimited = q.max === -1;
          const pct = isUnlimited ? 0 : Math.round((q.current / q.max) * 100);
          const isExceeded = !isUnlimited && q.current > q.max;
          const isCritical = !isUnlimited && pct >= 90;
          const isWarning = !isUnlimited && pct >= 70;

          const IconComponent = q.icon;

          return (
            <div
              key={q.id}
              className={`p-5 bg-white border rounded-2xl shadow-xs transition-all ${
                isExceeded
                  ? 'border-rose-300 ring-2 ring-rose-500/20'
                  : isCritical
                  ? 'border-orange-300 ring-2 ring-orange-500/20'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{q.name}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{q.desc}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                    isExceeded
                      ? 'bg-rose-100 text-rose-800'
                      : isCritical
                      ? 'bg-orange-100 text-orange-800'
                      : isWarning
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {isUnlimited ? 'UNLIMITED' : `${pct}%`}
                </span>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <div className="text-2xl font-bold text-slate-900 font-mono">
                  {q.current.toLocaleString('id-ID')}
                </div>
                <div className="text-xs font-medium text-slate-500">
                  dari {isUnlimited ? 'Tanpa Batas' : `${q.max.toLocaleString('id-ID')} ${q.unit}`}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
                <div
                  className={`h-full transition-all ${
                    isExceeded
                      ? 'bg-rose-600'
                      : isCritical
                      ? 'bg-orange-500'
                      : isWarning
                      ? 'bg-amber-500'
                      : 'bg-cyan-500'
                  }`}
                  style={{ width: `${isUnlimited ? 5 : Math.min(100, pct)}%` }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                <span>
                  Sisa Kuota:{' '}
                  <strong className="text-slate-700 font-mono">
                    {isUnlimited ? '∞' : Math.max(0, q.max - q.current).toLocaleString('id-ID')} {q.unit}
                  </strong>
                </span>
                {pct >= 85 && (
                  <button
                    onClick={onOpenUpgradeModal}
                    className="text-cyan-600 font-semibold hover:underline inline-flex items-center gap-0.5"
                  >
                    <span>Upgrade</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Token & Credits Usage Ledger */}
      <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Histori & Audit Konsumsi AI Model</h3>
              <p className="text-xs text-slate-500">Log pemakaian token Gemini AI per fitur dan staf operasional</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={aiFilter}
              onChange={(e) => setAiFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 bg-slate-50"
            >
              <option value="ALL">Semua Modul AI</option>
              <option value="ai_fleet_intelligence">AI Fleet Intelligence</option>
              <option value="ai_route_intelligence">AI Route Intelligence</option>
              <option value="ai_predictive_maintenance">AI Predictive Maintenance</option>
              <option value="ai_fleet_assistant">Fleet AI Copilot</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold">
                <th className="py-2.5 px-3">Waktu Eksekusi</th>
                <th className="py-2.5 px-3">Modul AI</th>
                <th className="py-2.5 px-3">Pengguna</th>
                <th className="py-2.5 px-3">Input Tokens</th>
                <th className="py-2.5 px-3">Output Tokens</th>
                <th className="py-2.5 px-3 text-right">Credits Terpakai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredAiUsage.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400">
                    Belum ada log penggunaan AI pada filter ini.
                  </td>
                </tr>
              ) : (
                filteredAiUsage.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-slate-500">
                      {new Date(record.timestamp).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 bg-purple-50 text-purple-700 font-medium rounded-md border border-purple-100">
                        {record.feature.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">{record.userName || record.userId}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{record.inputTokens.toLocaleString('id-ID')}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{record.outputTokens.toLocaleString('id-ID')}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-purple-700 text-right">
                      {record.creditsUsed} cr
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
