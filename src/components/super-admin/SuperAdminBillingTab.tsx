/**
 * Fleet Intelligence Smart AI - Super Admin Global Billing & Revenue Tab (Prompt 42)
 * SaaS Financial Analytics: MRR, ARR, ARPU, Churn Rate, NRR, Payment Gateways Distribution,
 * and Subscription Plan Catalog Management.
 */

import React from 'react';
import { PlatformRevenueMetrics, PlatformCompany } from '../../types/superAdmin';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Building2,
  PieChart as PieIcon,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface SuperAdminBillingTabProps {
  revenueMetrics: PlatformRevenueMetrics;
  companies: PlatformCompany[];
}

export const SuperAdminBillingTab: React.FC<SuperAdminBillingTabProps> = ({
  revenueMetrics,
  companies,
}) => {
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight">Analitik Finansial & Pendapatan SaaS Global</h2>
        <p className="text-xs text-slate-400">
          Metrik Recurring Revenue (MRR/ARR), Net Revenue Retention (NRR), Gateway Pembayaran (Midtrans/Xendit/DOKU), dan performa paket.
        </p>
      </div>

      {/* Financial High-Level Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-md">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total MRR (Monthly)</span>
          <div className="mt-2 text-2xl font-black text-white tracking-tight truncate">
            {formatRupiah(revenueMetrics.mrrTotal)}
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" /> +{revenueMetrics.growthMoMPercent}% MoM Growth
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-md">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total ARR (Annualized)</span>
          <div className="mt-2 text-2xl font-black text-cyan-400 tracking-tight truncate">
            {formatRupiah(revenueMetrics.arrTotal)}
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            {revenueMetrics.totalSubscribers} Tenant Pelanggan Aktif
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-md">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Revenue Per Tenant (ARPU)</span>
          <div className="mt-2 text-2xl font-black text-white tracking-tight truncate">
            {formatRupiah(revenueMetrics.arpu)}
          </div>
          <div className="mt-2 text-[11px] text-purple-300">
            NRR: {revenueMetrics.netRevenueRetentionPercent}% (High Retention)
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-md">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Platform Churn Rate</span>
          <div className="mt-2 text-2xl font-black text-emerald-400 tracking-tight">
            {revenueMetrics.churnRatePercent}%
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Ekspansi MRR: {formatRupiah(revenueMetrics.expansionMrr)}
          </div>
        </div>
      </div>

      {/* Breakdown Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Monthly Revenue Breakdown */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Komposisi Pendapatan Bulanan (MRR Breakdown)</h3>
            <span className="text-xs text-slate-400">12 Bulan Terakhir</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueMetrics.monthlyRevenueTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(val: number) => [`Rp ${val.toLocaleString('id-ID')}`, '']}
                />
                <Bar dataKey="mrr" fill="#06b6d4" radius={[4, 4, 0, 0]} name="MRR Total" />
                <Bar dataKey="expansionMrr" fill="#a855f7" radius={[4, 4, 0, 0]} name="Ekspansi" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Payment Gateway Distribution */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Distribusi Gateway Pembayaran</h3>
              <span className="text-xs text-emerald-400 font-bold">99.4% Settlement Rate</span>
            </div>

            <div className="space-y-3 mt-4">
              {revenueMetrics.gatewayDistribution.map((gw) => (
                <div key={gw.gateway} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-cyan-400 font-bold">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-bold text-white block">{gw.gateway}</span>
                      <span className="text-[11px] text-slate-400">
                        {gw.transactionsCount} Transaksi Selesai
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-white block">
                      {formatRupiah(gw.volume)}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold">
                      {gw.successRate}% Sukses
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-cyan-200 text-xs flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0" />
            <span>Semua webhook pembayaran diverifikasi otomatis melalui tanda tangan kriptografis SHA-512.</span>
          </div>
        </div>
      </div>

      {/* Tenant Billing Overview Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white">Status Penagihan & Langganan Lintas Tenant</h3>
          <span className="text-xs text-slate-400">Perusahaan dengan status penagihan aktif</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3">Tenant</th>
                <th className="px-4 py-3">Paket</th>
                <th className="px-4 py-3">Siklus</th>
                <th className="px-4 py-3">MRR (Nilai Kontrak)</th>
                <th className="px-4 py-3">Masa Berlaku Hingga</th>
                <th className="px-4 py-3 text-right">Status Penagihan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {companies.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-semibold text-white">{c.name}</td>
                  <td className="px-4 py-3 font-mono text-cyan-300">{c.planName}</td>
                  <td className="px-4 py-3 capitalize text-slate-400">{c.billingCycle}</td>
                  <td className="px-4 py-3 font-mono font-bold text-emerald-400">
                    {c.status === 'trial' ? 'Masa Trial (Rp 0)' : formatRupiah(c.mrr)}
                  </td>
                  <td className="px-4 py-3 text-slate-400 font-mono">
                    {new Date(c.subscriptionExpiresAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        c.status === 'active'
                          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30'
                          : c.status === 'trial'
                          ? 'bg-blue-950/80 text-blue-400 border-blue-500/30'
                          : 'bg-rose-950/80 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {c.status}
                    </span>
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
