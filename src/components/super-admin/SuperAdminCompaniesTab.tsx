/**
 * Fleet Intelligence Smart AI - Super Admin Companies Tab (Prompt 42)
 * Comprehensive Multi-Tenant SaaS Company Management: List, Search, Filter,
 * Plan Upgrades, Trial Extension, Suspension with Audit, Quota Override, and Support Access Impersonation.
 */

import React, { useState } from 'react';
import { PlatformCompany, PlatformCompanyQuota } from '../../types/superAdmin';
import {
  Building2,
  Search,
  Filter,
  Plus,
  MoreVertical,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Calendar,
  AlertTriangle,
  Clock,
  Sparkles,
  Truck,
  Users,
  Radio,
  Eye,
  CheckCircle2,
  XCircle,
  Sliders,
  DollarSign,
  ArrowRight,
  HelpCircle,
  UserCheck,
} from 'lucide-react';

interface SuperAdminCompaniesTabProps {
  companies: PlatformCompany[];
  onImpersonate: (company: PlatformCompany) => void;
  onSuspend: (company: PlatformCompany) => void;
  onReactivate: (company: PlatformCompany) => void;
  onChangePlan: (company: PlatformCompany) => void;
  onExtendTrial: (company: PlatformCompany) => void;
  onOverrideQuotas: (company: PlatformCompany) => void;
  onCreateCompany: () => void;
  onViewDetails: (company: PlatformCompany) => void;
}

export const SuperAdminCompaniesTab: React.FC<SuperAdminCompaniesTabProps> = ({
  companies,
  onImpersonate,
  onSuspend,
  onReactivate,
  onChangePlan,
  onExtendTrial,
  onOverrideQuotas,
  onCreateCompany,
  onViewDetails,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');

  const filteredCompanies = companies.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (planFilter !== 'all' && c.planName.toLowerCase() !== planFilter.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.legalName.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.primaryContact.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: PlatformCompany['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/80 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Aktif
          </span>
        );
      case 'trial':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-950/80 px-2.5 py-0.5 text-[11px] font-bold text-blue-400 border border-blue-500/30">
            <Clock className="h-3 w-3" />
            Trial (Uji Coba)
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-950/80 px-2.5 py-0.5 text-[11px] font-bold text-rose-400 border border-rose-500/30">
            <XCircle className="h-3 w-3" />
            Suspended
          </span>
        );
      case 'past_due':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-950/80 px-2.5 py-0.5 text-[11px] font-bold text-amber-400 border border-amber-500/30">
            <AlertTriangle className="h-3 w-3" />
            Past Due
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-medium text-slate-400">
            Expired
          </span>
        );
    }
  };

  const getPlanBadge = (planName: string) => {
    switch (planName) {
      case 'Enterprise':
        return (
          <span className="rounded-md bg-cyan-950/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-300 border border-cyan-500/30">
            Enterprise
          </span>
        );
      case 'Professional':
        return (
          <span className="rounded-md bg-indigo-950/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-300 border border-indigo-500/30">
            Professional
          </span>
        );
      case 'Starter':
        return (
          <span className="rounded-md bg-emerald-950/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300 border border-emerald-500/30">
            Starter
          </span>
        );
      default:
        return (
          <span className="rounded-md bg-pink-950/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-pink-300 border border-pink-500/30">
            Custom
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Manajemen Perusahaan & Tenant SaaS</h2>
          <p className="text-xs text-slate-400">
            Kontrol penuh hak akses, kuota, paket berlangganan, pembekuan akun (suspension), dan impersonasi support.
          </p>
        </div>

        <button
          onClick={onCreateCompany}
          className="flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-4 py-2.5 text-xs font-bold text-slate-950 transition-all shadow-lg shadow-cyan-950 shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Tenant Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-3 shadow-md">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama perusahaan, kode tenant (TLN/ABCLOG), kota, atau email..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-300 outline-none focus:border-cyan-500"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="trial">Trial (Uji Coba)</option>
            <option value="suspended">Suspended</option>
            <option value="past_due">Past Due</option>
          </select>

          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-300 outline-none focus:border-cyan-500"
          >
            <option value="all">Semua Paket</option>
            <option value="enterprise">Enterprise</option>
            <option value="professional">Professional</option>
            <option value="starter">Starter</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>

      {/* Companies Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3.5">Perusahaan / Tenant</th>
                <th className="px-4 py-3.5">Paket & Billing</th>
                <th className="px-4 py-3.5">Utilisasi Kuota Armada</th>
                <th className="px-4 py-3.5">AI Credits</th>
                <th className="px-4 py-3.5">Status & Health</th>
                <th className="px-4 py-3.5 text-right">Aksi Super Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    Tidak ada perusahaan yang cocok dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((c) => {
                  const vehicleUsagePct = Math.round(
                    (c.quotas.currentVehicles / (c.quotas.maxVehicles || 1)) * 100
                  );
                  const isSuspended = c.status === 'suspended';

                  return (
                    <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Tenant Identity */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 text-cyan-400 font-bold shrink-0 shadow-sm">
                            <Building2 className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white tracking-tight">{c.name}</span>
                              <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-500/30">
                                {c.code}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {c.city} • Kontak: {c.primaryContact.name} ({c.primaryContact.email})
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Plan & MRR */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {getPlanBadge(c.planName)}
                            <span className="text-[11px] font-mono text-slate-400">({c.billingCycle})</span>
                          </div>
                          <p className="font-mono text-xs font-semibold text-emerald-400">
                            {c.status === 'trial' ? 'Masa Percobaan' : `Rp ${c.mrr.toLocaleString('id-ID')} / bln`}
                          </p>
                        </div>
                      </td>

                      {/* Vehicle Quota Usage */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-1 max-w-[140px]">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-400">Kendaraan:</span>
                            <span className="font-mono font-semibold text-white">
                              {c.quotas.currentVehicles}/{c.quotas.maxVehicles}
                            </span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                            <div
                              className={`h-full rounded-full transition-all ${
                                vehicleUsagePct > 90
                                  ? 'bg-rose-500'
                                  : vehicleUsagePct > 75
                                  ? 'bg-amber-400'
                                  : 'bg-cyan-400'
                              }`}
                              style={{ width: `${Math.min(100, vehicleUsagePct)}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-500 block">
                            {c.quotas.currentUsers} Users • {c.quotas.currentDevices} GPS Devices
                          </span>
                        </div>
                      </td>

                      {/* AI Credits */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-0.5 font-mono text-xs">
                          <span className="text-purple-300 font-bold">
                            {c.quotas.currentAiCredits.toLocaleString()}
                          </span>
                          <span className="text-slate-500 text-[11px]">
                            {' '}/ {c.quotas.aiCreditsMonthly.toLocaleString()}
                          </span>
                          <p className="text-[10px] text-slate-400 font-sans">
                            {c.telematicsDataRateMsgsSec > 0
                              ? `${c.telematicsDataRateMsgsSec} msgs/sec live`
                              : 'Tidak aktif'}
                          </p>
                        </div>
                      </td>

                      {/* Status & Health */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-1">
                          {getStatusBadge(c.status)}
                          <div className="flex items-center gap-1 text-[10px] text-slate-400">
                            <span>Health:</span>
                            <span
                              className={`font-bold font-mono ${
                                c.healthScore >= 90
                                  ? 'text-emerald-400'
                                  : c.healthScore >= 75
                                  ? 'text-amber-400'
                                  : 'text-rose-400'
                              }`}
                            >
                              {c.healthScore}%
                            </span>
                          </div>
                          {isSuspended && c.suspensionReason && (
                            <p className="text-[10px] text-rose-300/80 line-clamp-1" title={c.suspensionReason}>
                              Alasan: {c.suspensionReason}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Support Impersonation Button */}
                          <button
                            onClick={() => onImpersonate(c)}
                            title="Masuk ke Ruang Kerja Tenant (Support Access Mode)"
                            className="flex items-center gap-1 rounded-lg bg-amber-500/10 px-2.5 py-1.5 text-[11px] font-bold text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 transition-all shadow-sm"
                          >
                            <ShieldAlert className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Support Access</span>
                          </button>

                          {/* View Details Drawer */}
                          <button
                            onClick={() => onViewDetails(c)}
                            title="Lihat Detail Profil & Kuota Lengkap"
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          {/* Change Plan Button */}
                          <button
                            onClick={() => onChangePlan(c)}
                            title="Ubah Paket Berlangganan"
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-cyan-400 hover:bg-slate-700 transition-colors"
                          >
                            <DollarSign className="h-3.5 w-3.5" />
                          </button>

                          {/* Override Quota Button */}
                          <button
                            onClick={() => onOverrideQuotas(c)}
                            title="Override Kuota Custom"
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-purple-400 hover:bg-slate-700 transition-colors"
                          >
                            <Sliders className="h-3.5 w-3.5" />
                          </button>

                          {/* Suspend or Reactivate Button */}
                          {isSuspended ? (
                            <button
                              onClick={() => onReactivate(c)}
                              title="Reaktivasi Akun Perusahaan"
                              className="flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2 py-1 text-[11px] font-bold text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span className="hidden lg:inline">Aktifkan</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => onSuspend(c)}
                              title="Bekukan / Suspend Akun Perusahaan"
                              className="flex items-center gap-1 rounded-lg bg-rose-500/10 px-2 py-1 text-[11px] font-bold text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition-all"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              <span className="hidden lg:inline">Suspend</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
