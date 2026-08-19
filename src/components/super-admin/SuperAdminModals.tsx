/**
 * Fleet Intelligence Smart AI - Super Admin Action Modals & Drawers (Prompt 42)
 * Interactive dialogs for: Support Impersonation, Tenant Suspension, Reactivation,
 * Plan Upgrades, Trial Extension, Quota Override, New Tenant Onboarding, and Details Drawer.
 */

import React, { useState } from 'react';
import { PlatformCompany, PlatformCompanyQuota } from '../../types/superAdmin';
import {
  ShieldAlert,
  Building2,
  X,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  DollarSign,
  Clock,
  Plus,
  Truck,
  Users,
  Radio,
  Sparkles,
  HardDrive,
  Cpu,
  Eye,
  Key,
} from 'lucide-react';

// --- 1. IMPERSONATION CONFIRM MODAL ---
export interface ImpersonateModalProps {
  company: PlatformCompany | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export const ImpersonateModal: React.FC<ImpersonateModalProps> = ({
  company,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [reason, setReason] = useState('Bantuan investigasi telematika dan verifikasi konfigurasi');

  if (!isOpen || !company) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-amber-500/40 bg-slate-900 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Konfirmasi Support Access Mode</h3>
              <p className="text-xs text-amber-300/80">Impersonasi Ruang Kerja Tenant</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40 text-amber-200 text-xs leading-relaxed space-y-1.5">
          <p className="font-semibold">
            ⚠️ Anda akan memasuki dashboard <strong>{company.name} ({company.code})</strong> dengan otoritas Super Admin.
          </p>
          <ul className="list-disc list-inside text-[11px] text-amber-300/90 space-y-0.5">
            <li>Sesi support ini dibatasi maksimal 60 menit.</li>
            <li>Seluruh aktivitas, perubahan data, dan eksekusi command akan dicatat permanen dalam Audit Trail Kepatuhan.</li>
          </ul>
        </div>

        <div className="space-y-1 text-xs">
          <label className="block font-semibold text-slate-300">Alasan Dukungan / Troubleshooting (Wajib Audit)</label>
          <input
            type="text"
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Contoh: Tiket #SUP-9941 Diagnosa GPS loss connection"
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => onConfirm(reason)}
            disabled={!reason.trim()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold shadow-lg shadow-amber-950 disabled:opacity-40"
          >
            Mulai Akses Support
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 2. SUSPEND TENANT MODAL ---
export interface SuspendModalProps {
  company: PlatformCompany | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export const SuspendModal: React.FC<SuspendModalProps> = ({
  company,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [reason, setReason] = useState('Tagihan langganan invoice overdue atau pelanggaran syarat ketentuan');

  if (!isOpen || !company) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-rose-500/40 bg-slate-900 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Bekukan Akun Tenant (Suspend)</h3>
              <p className="text-xs text-rose-300/80">{company.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Membekukan perusahaan akan menghentikan akses login seluruh user tenant dan menonaktifkan pemrosesan realtime stream GPS.
        </p>

        <div className="space-y-1 text-xs">
          <label className="block font-semibold text-slate-300">Alasan Suspensi</label>
          <textarea
            required
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white outline-none focus:border-rose-500 resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => onConfirm(reason)}
            disabled={!reason.trim()}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-950 disabled:opacity-40"
          >
            Konfirmasi Suspensi
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 3. REACTIVATE TENANT MODAL ---
export interface ReactivateModalProps {
  company: PlatformCompany | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export const ReactivateModal: React.FC<ReactivateModalProps> = ({
  company,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [reason, setReason] = useState('Pembayaran invoice telah diverifikasi dan status akun dipulihkan');

  if (!isOpen || !company) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-emerald-500/40 bg-slate-900 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Reaktivasi Akun Perusahaan</h3>
              <p className="text-xs text-emerald-300/80">{company.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Mengaktifkan kembali perusahaan akan memulihkan seluruh akses dashboard, user credentials, dan ingestion stream IoT.
        </p>

        <div className="space-y-1 text-xs">
          <label className="block font-semibold text-slate-300">Catatan Reaktivasi</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => onConfirm(reason)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950"
          >
            Pulihkan Akun Aktif
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 4. CHANGE PLAN MODAL ---
export interface ChangePlanModalProps {
  company: PlatformCompany | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (planName: 'Starter' | 'Professional' | 'Enterprise' | 'Custom', cycle: 'monthly' | 'yearly') => void;
}

export const ChangePlanModal: React.FC<ChangePlanModalProps> = ({
  company,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'Starter' | 'Professional' | 'Enterprise' | 'Custom'>('Enterprise');
  const [cycle, setCycle] = useState<'monthly' | 'yearly'>('yearly');

  if (!isOpen || !company) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-cyan-500/40 bg-slate-900 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Ubah Paket Berlangganan SaaS</h3>
              <p className="text-xs text-slate-400">{company.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          {(['Starter', 'Professional', 'Enterprise', 'Custom'] as const).map((p) => (
            <div
              key={p}
              onClick={() => setSelectedPlan(p)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                selectedPlan === p
                  ? 'border-cyan-500 bg-cyan-950/40 shadow-md'
                  : 'border-slate-800 bg-slate-950 hover:border-slate-700'
              }`}
            >
              <span className="font-bold text-white block">{p}</span>
              <span className="text-[11px] text-slate-400">
                {p === 'Starter' && 'Maks 25 unit • 5 Users'}
                {p === 'Professional' && 'Maks 100 unit • 25 Users'}
                {p === 'Enterprise' && 'Maks 300 unit • 60 Users'}
                {p === 'Custom' && 'Unlimited Kuota Khusus'}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-1 text-xs">
          <label className="block font-semibold text-slate-300">Siklus Penagihan</label>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
              <input
                type="radio"
                name="cycle"
                value="monthly"
                checked={cycle === 'monthly'}
                onChange={() => setCycle('monthly')}
                className="text-cyan-500"
              />
              Bulanan (Monthly)
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
              <input
                type="radio"
                name="cycle"
                value="yearly"
                checked={cycle === 'yearly'}
                onChange={() => setCycle('yearly')}
                className="text-cyan-500"
              />
              Tahunan (Yearly - Diskon 20%)
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => onConfirm(selectedPlan, cycle)}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold"
          >
            Simpan Perubahan Paket
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 5. EXTEND TRIAL MODAL ---
export interface ExtendTrialModalProps {
  company: PlatformCompany | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (days: number, reason: string) => void;
}

export const ExtendTrialModal: React.FC<ExtendTrialModalProps> = ({
  company,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [days, setDays] = useState(14);
  const [reason, setReason] = useState('Perpanjangan evaluasi POC integrasi perangkat GPS telematika');

  if (!isOpen || !company) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-blue-500/40 bg-slate-900 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Perpanjang Masa Percobaan (Trial)</h3>
              <p className="text-xs text-slate-400">{company.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Jumlah Hari Tambahan</label>
            <input
              type="number"
              min={1}
              max={90}
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value) || 14)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white font-mono outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Alasan Perpanjangan</label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => onConfirm(days, reason)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-950"
          >
            Perpanjang Masa Trial
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 6. OVERRIDE QUOTAS MODAL ---
export interface OverrideQuotasModalProps {
  company: PlatformCompany | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (quotas: Partial<PlatformCompanyQuota>, reason: string) => void;
}

export const OverrideQuotasModal: React.FC<OverrideQuotasModalProps> = ({
  company,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [maxVehicles, setMaxVehicles] = useState(company?.quotas.maxVehicles || 50);
  const [maxUsers, setMaxUsers] = useState(company?.quotas.maxUsers || 15);
  const [maxDevices, setMaxDevices] = useState(company?.quotas.maxDevices || 50);
  const [aiCreditsMonthly, setAiCreditsMonthly] = useState(company?.quotas.aiCreditsMonthly || 10000);
  const [apiMonthlyRequests, setApiMonthlyRequests] = useState(company?.quotas.apiMonthlyRequests || 50000);
  const [reason, setReason] = useState('Penyesuaian kuota khusus kesepakatan enterprise contract addendum');

  if (!isOpen || !company) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(
      {
        maxVehicles,
        maxUsers,
        maxDevices,
        aiCreditsMonthly,
        apiMonthlyRequests,
      },
      reason
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-purple-500/40 bg-slate-900 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Override Kuota Khusus (Custom Limits)</h3>
              <p className="text-xs text-slate-400">{company.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Maksimal Armada (Unit)</label>
              <input
                type="number"
                min={1}
                value={maxVehicles}
                onChange={(e) => setMaxVehicles(parseInt(e.target.value) || 0)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white font-mono outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Maksimal Pengguna (Users)</label>
              <input
                type="number"
                min={1}
                value={maxUsers}
                onChange={(e) => setMaxUsers(parseInt(e.target.value) || 0)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white font-mono outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Maksimal GPS Tracker</label>
              <input
                type="number"
                min={1}
                value={maxDevices}
                onChange={(e) => setMaxDevices(parseInt(e.target.value) || 0)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white font-mono outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">AI Tokens Bulanan</label>
              <input
                type="number"
                min={1000}
                step={5000}
                value={aiCreditsMonthly}
                onChange={(e) => setAiCreditsMonthly(parseInt(e.target.value) || 0)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white font-mono outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">API Monthly Requests Limit</label>
            <input
              type="number"
              min={1000}
              step={10000}
              value={apiMonthlyRequests}
              onChange={(e) => setApiMonthlyRequests(parseInt(e.target.value) || 0)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white font-mono outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Alasan Penyesuaian Kuota</label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-950"
            >
              Simpan Override Kuota
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- 7. CREATE NEW TENANT MODAL ---
export interface CreateTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: Partial<PlatformCompany>) => void;
}

export const CreateTenantModal: React.FC<CreateTenantModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [name, setName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [code, setCode] = useState('');
  const [industry, setIndustry] = useState('Logistik & Ekspedisi Kargo');
  const [city, setCity] = useState('Jakarta');
  const [planName, setPlanName] = useState<'Starter' | 'Professional' | 'Enterprise'>('Professional');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('+62 ');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      name: name.trim(),
      legalName: legalName.trim() || name.trim(),
      code: code.trim().toUpperCase() || 'CORP',
      industry,
      city,
      planName,
      planId: 'plan-' + planName.toLowerCase(),
      primaryContact: {
        name: contactName.trim() || 'Admin',
        email: contactEmail.trim(),
        phone: contactPhone.trim(),
        role: 'Company Admin',
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-cyan-500/40 bg-slate-900 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Onboard Perusahaan / Tenant Baru</h3>
              <p className="text-xs text-slate-400">Buat ruang kerja perusahaan baru di platform SaaS.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="block font-semibold text-slate-300 mb-1">Nama Perusahaan</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="PT Ekspedisi Maju Jaya"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Kode (3-6 huruf)</label>
              <input
                type="text"
                required
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="EMJ"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white font-mono uppercase outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Industri</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Kota Domisili</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Paket Awal (Trial 14 Hari)</label>
            <select
              value={planName}
              onChange={(e) => setPlanName(e.target.value as any)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-500"
            >
              <option value="Starter">Starter (Maks 25 unit)</option>
              <option value="Professional">Professional (Maks 100 unit)</option>
              <option value="Enterprise">Enterprise (Maks 300 unit)</option>
            </select>
          </div>

          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <span className="font-bold text-slate-300 block text-[11px] uppercase tracking-wider">
              Kontak Administrator Tenant:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 mb-0.5">Nama Kontak</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Budi Santoso"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-0.5">Email Akun Admin</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="admin@perusahaan.co.id"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-950"
            >
              Onboard Tenant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- 8. TENANT DETAILS DRAWER ---
export interface TenantDetailsDrawerProps {
  company: PlatformCompany | null;
  isOpen: boolean;
  onClose: () => void;
  onImpersonate: (company: PlatformCompany) => void;
}

export const TenantDetailsDrawer: React.FC<TenantDetailsDrawerProps> = ({
  company,
  isOpen,
  onClose,
  onImpersonate,
}) => {
  if (!isOpen || !company) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 p-6 overflow-y-auto shadow-2xl space-y-6 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/30">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{company.name}</h3>
              <p className="text-xs font-mono text-cyan-400">Tenant ID: {company.id} • {company.code}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onImpersonate(company)}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2.5 text-xs font-bold text-slate-950 transition-all shadow-lg shadow-amber-950"
        >
          <ShieldAlert className="h-4 w-4" />
          <span>Masuk Mode Support Access (Impersonasi)</span>
        </button>

        {/* Company Info */}
        <div className="space-y-3 text-xs">
          <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Informasi Perusahaan</h4>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Nama Legal</span>
              <span className="text-white font-medium text-right">{company.legalName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Industri</span>
              <span className="text-slate-200">{company.industry}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Alamat & Kota</span>
              <span className="text-slate-200 text-right">{company.city}, {company.province}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">NPWP Perusahaan</span>
              <span className="font-mono text-slate-300">{company.taxIdNpwp}</span>
            </div>
          </div>
        </div>

        {/* Quotas & Capacity */}
        <div className="space-y-3 text-xs">
          <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Utilisasi Kuota Kapasitas</h4>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Armada (Vehicles):</span>
                <span className="text-white font-bold">{company.quotas.currentVehicles} / {company.quotas.maxVehicles} unit</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${(company.quotas.currentVehicles / company.quotas.maxVehicles) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Pengguna (Users):</span>
                <span className="text-white font-bold">{company.quotas.currentUsers} / {company.quotas.maxUsers} akun</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-blue-400 rounded-full" style={{ width: `${(company.quotas.currentUsers / company.quotas.maxUsers) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>AI Credits Monthly:</span>
                <span className="text-purple-300 font-bold">{company.quotas.currentAiCredits} / {company.quotas.aiCreditsMonthly}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-purple-400 rounded-full" style={{ width: `${(company.quotas.currentAiCredits / company.quotas.aiCreditsMonthly) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 text-xs">
          <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Kontak Utama (Admin)</h4>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="font-bold text-white block">{company.primaryContact.name} ({company.primaryContact.role})</span>
            <span className="text-slate-400 font-mono block">{company.primaryContact.email}</span>
            <span className="text-slate-400 font-mono block">{company.primaryContact.phone}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
