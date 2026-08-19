/**
 * Fleet Intelligence Smart AI - Tenants (Perusahaan SaaS) Management Tab
 * Manages SaaS tenant enterprises, subscription plans, usage quotas, and localization
 */

import React, { useState } from 'react';
import { useOrganization } from '../../../context/OrganizationContext';
import { TenantCompanyDetailed, TenantPlan, TenantStatus, IndonesianTimezone } from '../../../types/organization';
import { 
  Building2, 
  Plus, 
  Search, 
  Check, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  Activity, 
  Cpu, 
  HardDrive, 
  Users, 
  Truck, 
  DollarSign, 
  Sparkles, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Globe,
  MapPin,
  FileText
} from 'lucide-react';

export const TenantsManagementTab: React.FC = () => {
  const {
    tenants,
    currentTenant,
    switchTenant,
    createTenant,
    updateTenant,
    deleteTenant,
    isLoading
  } = useOrganization();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<TenantCompanyDetailed | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<{
    name: string;
    legalName: string;
    code: string;
    industry: string;
    businessType: 'CORPORATION' | 'FREIGHT_FORWARDER' | 'RENTAL' | 'DISTRIBUTOR' | 'PUBLIC_AGENCY';
    taxIdNpwp: string;
    subscriptionPlan: TenantPlan;
    billingCycle: 'monthly' | 'yearly';
    address: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;
    phone: string;
    email: string;
    website: string;
    timezone: IndonesianTimezone;
    currency: 'IDR' | 'USD';
    locale: 'id-ID' | 'en-US';
    dateFormat: 'DD/MM/YYYY' | 'YYYY-MM-DD';
    status: TenantStatus;
    maxVehicles: number;
    maxUsers: number;
    featureAi: boolean;
    featureFuel: boolean;
    featureMaintenance: boolean;
    featureSafety: boolean;
    featureFatigue: boolean;
    featureDelivery: boolean;
    featureReports: boolean;
    featurePredictiveMaintenance: boolean;
    featureCustomBranding: boolean;
    featureAdvancedAutomation: boolean;
    featureApiAccess: boolean;
  }>({
    name: '',
    legalName: '',
    code: '',
    industry: 'Logistics & Supply Chain',
    businessType: 'CORPORATION',
    taxIdNpwp: '',
    subscriptionPlan: 'Business',
    billingCycle: 'yearly',
    address: '',
    city: 'Jakarta',
    province: 'DKI Jakarta',
    country: 'Indonesia',
    postalCode: '10110',
    phone: '+62 21 ',
    email: '',
    website: '',
    timezone: 'Asia/Jakarta',
    currency: 'IDR',
    locale: 'id-ID',
    dateFormat: 'DD/MM/YYYY',
    status: 'active',
    maxVehicles: 100,
    maxUsers: 50,
    featureAi: true,
    featureFuel: true,
    featureMaintenance: true,
    featureSafety: true,
    featureFatigue: true,
    featureDelivery: true,
    featureReports: true,
    featurePredictiveMaintenance: true,
    featureCustomBranding: false,
    featureAdvancedAutomation: true,
    featureApiAccess: true,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      legalName: '',
      code: '',
      industry: 'Logistics & Supply Chain',
      businessType: 'CORPORATION',
      taxIdNpwp: '',
      subscriptionPlan: 'Business',
      billingCycle: 'yearly',
      address: '',
      city: 'Jakarta',
      province: 'DKI Jakarta',
      country: 'Indonesia',
      postalCode: '10110',
      phone: '+62 21 ',
      email: '',
      website: '',
      timezone: 'Asia/Jakarta',
      currency: 'IDR',
      locale: 'id-ID',
      dateFormat: 'DD/MM/YYYY',
      status: 'active',
      maxVehicles: 100,
      maxUsers: 50,
      featureAi: true,
      featureFuel: true,
      featureMaintenance: true,
      featureSafety: true,
      featureFatigue: true,
      featureDelivery: true,
      featureReports: true,
      featurePredictiveMaintenance: true,
      featureCustomBranding: false,
      featureAdvancedAutomation: true,
      featureApiAccess: true,
    });
  };

  const handleOpenEdit = (t: TenantCompanyDetailed) => {
    setEditingTenant(t);
    setFormData({
      name: t.name,
      legalName: t.legalName || t.name,
      code: t.code,
      industry: t.industry || 'Logistics & Supply Chain',
      businessType: t.businessType || 'CORPORATION',
      taxIdNpwp: t.taxIdNpwp || '',
      subscriptionPlan: t.subscriptionPlan,
      billingCycle: t.billingCycle,
      address: t.address || '',
      city: t.city || 'Jakarta',
      province: t.province || 'DKI Jakarta',
      country: t.country || 'Indonesia',
      postalCode: t.postalCode || '',
      phone: t.phone || '',
      email: t.email || '',
      website: t.website || '',
      timezone: t.timezone || 'Asia/Jakarta',
      currency: t.currency || 'IDR',
      locale: t.locale || 'id-ID',
      dateFormat: t.dateFormat || 'DD/MM/YYYY',
      status: t.status,
      maxVehicles: t.limits?.maxVehicles || 100,
      maxUsers: t.limits?.maxUsers || 50,
      featureAi: t.features?.featureAi ?? true,
      featureFuel: t.features?.featureFuel ?? true,
      featureMaintenance: t.features?.featureMaintenance ?? true,
      featureSafety: t.features?.featureSafety ?? true,
      featureFatigue: t.features?.featureFatigue ?? true,
      featureDelivery: t.features?.featureDelivery ?? true,
      featureReports: t.features?.featureReports ?? true,
      featurePredictiveMaintenance: t.features?.featurePredictiveMaintenance ?? true,
      featureCustomBranding: t.features?.featureCustomBranding ?? false,
      featureAdvancedAutomation: t.features?.featureAdvancedAutomation ?? true,
      featureApiAccess: t.features?.featureApiAccess ?? true,
    });
    setIsAddModalOpen(true);
  };

  const handleSaveTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    if (editingTenant) {
      await updateTenant(editingTenant.id, {
        name: formData.name,
        legalName: formData.legalName,
        code: formData.code.toUpperCase(),
        industry: formData.industry,
        businessType: formData.businessType,
        taxIdNpwp: formData.taxIdNpwp,
        subscriptionPlan: formData.subscriptionPlan,
        billingCycle: formData.billingCycle,
        address: formData.address,
        city: formData.city,
        province: formData.province,
        postalCode: formData.postalCode,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        timezone: formData.timezone,
        status: formData.status,
        features: {
          featureAi: formData.featureAi,
          featureFuel: formData.featureFuel,
          featureMaintenance: formData.featureMaintenance,
          featureSafety: formData.featureSafety,
          featureFatigue: formData.featureFatigue,
          featureDelivery: formData.featureDelivery,
          featureReports: formData.featureReports,
          featurePredictiveMaintenance: formData.featurePredictiveMaintenance,
          featureCustomBranding: formData.featureCustomBranding,
          featureAdvancedAutomation: formData.featureAdvancedAutomation,
          featureApiAccess: formData.featureApiAccess,
        },
        limits: {
          ...editingTenant.limits,
          maxVehicles: Number(formData.maxVehicles),
          maxUsers: Number(formData.maxUsers),
        },
      });
    } else {
      await createTenant({
        name: formData.name,
        legalName: formData.legalName || `${formData.name} Tbk`,
        code: formData.code.toUpperCase(),
        industry: formData.industry,
        businessType: formData.businessType,
        taxIdNpwp: formData.taxIdNpwp || '01.000.000.0-000.000',
        subscriptionPlan: formData.subscriptionPlan,
        billingCycle: formData.billingCycle,
        address: formData.address || 'Jakarta, Indonesia',
        city: formData.city,
        province: formData.province,
        country: 'Indonesia',
        postalCode: formData.postalCode,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        timezone: formData.timezone,
        currency: 'IDR',
        locale: 'id-ID',
        dateFormat: 'DD/MM/YYYY',
        status: formData.status,
        features: {
          featureAi: formData.featureAi,
          featureFuel: formData.featureFuel,
          featureMaintenance: formData.featureMaintenance,
          featureSafety: formData.featureSafety,
          featureFatigue: formData.featureFatigue,
          featureDelivery: formData.featureDelivery,
          featureReports: formData.featureReports,
          featurePredictiveMaintenance: formData.featurePredictiveMaintenance,
          featureCustomBranding: formData.featureCustomBranding,
          featureAdvancedAutomation: formData.featureAdvancedAutomation,
          featureApiAccess: formData.featureApiAccess,
        },
        limits: {
          maxVehicles: Number(formData.maxVehicles),
          currentVehicles: 0,
          maxUsers: Number(formData.maxUsers),
          currentUsers: 1,
          maxBranches: 5,
          currentBranches: 1,
          maxDevices: Number(formData.maxVehicles),
          currentDevices: 0,
          maxReportsPerMonth: 500,
          currentReportsThisMonth: 0,
          aiMonthlyQuotaCalls: 25000,
          currentAiCallsThisMonth: 0,
          storageQuotaMb: 51200,
          currentStorageMb: 120,
          apiMonthlyQuotaRequests: 500000,
          currentApiRequestsThisMonth: 0,
        },
      });
    }

    setIsAddModalOpen(false);
    setEditingTenant(null);
    resetForm();
  };

  const filteredTenants = tenants.filter((t) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        t.name.toLowerCase().includes(q) ||
        t.code.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.city.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (planFilter !== 'all' && t.subscriptionPlan !== planFilter) return false;
    return true;
  });

  const getPlanBadge = (plan: TenantPlan) => {
    switch (plan) {
      case 'Enterprise':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Professional':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'Business':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Starter':
      default:
        return 'bg-slate-700/40 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & Add Tenant Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
        <div className="flex items-center gap-3 flex-1 flex-wrap">
          {/* Search */}
          <div className="relative min-w-[240px] flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Cari nama tenant, kode, atau kota..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Plan Filter */}
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none cursor-pointer"
          >
            <option value="all">Semua Paket SaaS</option>
            <option value="Enterprise">Enterprise</option>
            <option value="Professional">Professional</option>
            <option value="Business">Business</option>
            <option value="Starter">Starter</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="active">Active</option>
            <option value="trial">Trial</option>
            <option value="suspended">Suspended</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <button
          onClick={() => {
            setEditingTenant(null);
            resetForm();
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-950 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Tenant Baru</span>
        </button>
      </div>

      {/* Tenants Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredTenants.map((t) => {
          const isCurrent = currentTenant.id === t.id;
          const vehiclePercent = Math.round(((t.limits?.currentVehicles || 0) / (t.limits?.maxVehicles || 100)) * 100);
          const aiPercent = Math.round(((t.limits?.currentAiCallsThisMonth || 0) / (t.limits?.aiMonthlyQuotaCalls || 50000)) * 100);

          return (
            <div
              key={t.id}
              className={`rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                isCurrent
                  ? 'border-cyan-500/80 bg-slate-900 shadow-xl shadow-cyan-950/30'
                  : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
              }`}
            >
              {/* Header Ribbon */}
              {isCurrent && (
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-1 text-[10px] font-bold text-slate-950 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 uppercase tracking-wider">
                    <CheckCircle2 className="h-3 w-3" />
                    Tenant Aktif Sesi Ini
                  </span>
                  <span className="font-mono">{t.code}</span>
                </div>
              )}

              <div className="p-5 space-y-4 flex-1">
                {/* Logo & Company Title */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-cyan-300 font-bold text-base shadow-sm">
                      {t.name.charAt(3) || 'P'}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white hover:text-cyan-300 transition-colors">
                        {t.name}
                      </h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-slate-500" />
                        {t.city}, {t.country}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border ${getPlanBadge(t.subscriptionPlan)}`}>
                    {t.subscriptionPlan.toUpperCase()}
                  </span>
                </div>

                {/* Meta details */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-2.5">
                    <span className="block text-[10px] text-slate-500 font-medium">NPWP / TAX ID</span>
                    <span className="font-mono text-slate-300 text-[11px] truncate block mt-0.5">
                      {t.taxIdNpwp || '-'}
                    </span>
                  </div>
                  <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-2.5">
                    <span className="block text-[10px] text-slate-500 font-medium">TIMEZONE & CURR</span>
                    <span className="font-mono text-cyan-400 text-[11px] block mt-0.5">
                      {t.timezone.replace('Asia/', '')} • {t.currency}
                    </span>
                  </div>
                </div>

                {/* Quota Progress Bars */}
                <div className="space-y-3 pt-1 border-t border-slate-800/80">
                  {/* Vehicles Quota */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Truck className="h-3.5 w-3.5 text-cyan-400" />
                        Alokasi Unit Armada
                      </span>
                      <span className="font-mono font-bold text-slate-200">
                        {t.vehiclesCount || t.limits?.currentVehicles || 0} / {t.limits?.maxVehicles || 100}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-950 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          vehiclePercent > 90 ? 'bg-rose-500' : 'bg-cyan-500'
                        }`}
                        style={{ width: `${Math.min(vehiclePercent, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* AI Quota */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                        AI Copilot Monthly Quota
                      </span>
                      <span className="font-mono font-bold text-slate-200">
                        {t.limits?.currentAiCallsThisMonth?.toLocaleString('id-ID') || 0} / {(t.limits?.aiMonthlyQuotaCalls || 50000).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-950 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-purple-500 transition-all"
                        style={{ width: `${Math.min(aiPercent, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Email & Branches */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>{t.branchesCount || 1} Cabang Depo</span>
                  <span className="font-mono text-slate-500 truncate max-w-[160px]">{t.email}</span>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(t)}
                    className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Edit Profil & Kuota Tenant"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => deleteTenant(t.id)}
                    className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
                    title="Arsipkan Tenant"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {isCurrent ? (
                  <span className="px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-300 text-xs font-bold border border-cyan-500/30 flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5" />
                    Sedang Digunakan
                  </span>
                ) : (
                  <button
                    onClick={() => switchTenant(t.id)}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 text-xs font-bold transition-all"
                  >
                    <span>Switch Tenant</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Tenant Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingTenant ? 'Edit Profil Tenant Perusahaan' : 'Tambah Tenant Perusahaan Baru'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Konfigurasi entitas multi-tenant, kuota sumber daya, dan fitur SaaS aktif.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTenant} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nama Perusahaan (Display) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: PT Nusantara Logistik"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Kode Unik Tenant (3-6 Karakter) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={8}
                    placeholder="Contoh: NTL"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono uppercase text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nama Legal Lengkap (Akta)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: PT Nusantara Logistik Jaya Tbk"
                    value={formData.legalName}
                    onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    NPWP Perusahaan (16 Digit)
                  </label>
                  <input
                    type="text"
                    placeholder="01.234.567.8-012.000"
                    value={formData.taxIdNpwp}
                    onChange={(e) => setFormData({ ...formData, taxIdNpwp: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Paket Langganan SaaS
                  </label>
                  <select
                    value={formData.subscriptionPlan}
                    onChange={(e) => setFormData({ ...formData, subscriptionPlan: e.target.value as TenantPlan })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Enterprise">Enterprise Tier (Unlimited AI & Custom Features)</option>
                    <option value="Professional">Professional Tier (Advanced Telematics)</option>
                    <option value="Business">Business Tier (Standard Operations)</option>
                    <option value="Starter">Starter Tier</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Billing Cycle
                  </label>
                  <select
                    value={formData.billingCycle}
                    onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="yearly">Tahunan (Yearly - Diskon 20%)</option>
                    <option value="monthly">Bulanan (Monthly)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Zona Waktu Operasional
                  </label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value as IndonesianTimezone })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Asia/Jakarta">WIB - Asia/Jakarta (UTC+7)</option>
                    <option value="Asia/Makassar">WITA - Asia/Makassar (UTC+8)</option>
                    <option value="Asia/Jayapura">WIT - Asia/Jayapura (UTC+9)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Status Tenant
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as TenantStatus })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="active">Active (Operasional Normal)</option>
                    <option value="trial">Trial (Uji Coba 14 Hari)</option>
                    <option value="suspended">Suspended (Tangguhkan Akses)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Kota Kantor Pusat
                  </label>
                  <input
                    type="text"
                    placeholder="Jakarta / Surabaya / Medan"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Kontak Billing / Admin
                  </label>
                  <input
                    type="email"
                    placeholder="ops@perusahaan.co.id"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Batas Maksimal Unit Armada
                  </label>
                  <input
                    type="number"
                    value={formData.maxVehicles}
                    onChange={(e) => setFormData({ ...formData, maxVehicles: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Batas Maksimal Pengguna / Staff
                  </label>
                  <input
                    type="number"
                    value={formData.maxUsers}
                    onChange={(e) => setFormData({ ...formData, maxUsers: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Feature Toggles */}
              <div className="pt-3 border-t border-slate-800">
                <span className="block text-xs font-bold text-slate-300 mb-2">
                  Fitur Modul SaaS Aktif
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featureAi}
                      onChange={(e) => setFormData({ ...formData, featureAi: e.target.checked })}
                      className="rounded accent-cyan-500"
                    />
                    <span className="text-slate-300">AI Assistant</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featureFuel}
                      onChange={(e) => setFormData({ ...formData, featureFuel: e.target.checked })}
                      className="rounded accent-cyan-500"
                    />
                    <span className="text-slate-300">Monitoring BBM</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featureMaintenance}
                      onChange={(e) => setFormData({ ...formData, featureMaintenance: e.target.checked })}
                      className="rounded accent-cyan-500"
                    />
                    <span className="text-slate-300">Maintenance & WO</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featureSafety}
                      onChange={(e) => setFormData({ ...formData, featureSafety: e.target.checked })}
                      className="rounded accent-cyan-500"
                    />
                    <span className="text-slate-300">Safety & ADAS</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featureAdvancedAutomation}
                      onChange={(e) => setFormData({ ...formData, featureAdvancedAutomation: e.target.checked })}
                      className="rounded accent-cyan-500"
                    />
                    <span className="text-slate-300">Automation Engine</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featureApiAccess}
                      onChange={(e) => setFormData({ ...formData, featureApiAccess: e.target.checked })}
                      className="rounded accent-cyan-500"
                    />
                    <span className="text-slate-300">Open API Key</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-950"
                >
                  {editingTenant ? 'Simpan Perubahan' : 'Buat Tenant Baru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
