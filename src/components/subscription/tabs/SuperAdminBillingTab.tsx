/**
 * Fleet Intelligence Smart AI - Super Admin SaaS & Billing Engine Management (Prompt 41)
 * MRR/ARR analytics, Plan Builder & Quotas Editor, Tenant Subscription Override, and Webhook Ingress Simulator
 */

import React, { useState } from 'react';
import { Plan, PlanFeatureFlags, Subscription } from '../../../types/subscription';
import { useSubscription } from '../../../context/SubscriptionContext';
import { useOrganization } from '../../../context/OrganizationContext';
import { useToast } from '../../../components/ui/Toast';
import {
  TrendingUp,
  DollarSign,
  Users,
  Activity,
  Plus,
  Edit2,
  Archive,
  Clock,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  RefreshCw,
  Send,
  Sliders,
  Layers,
} from 'lucide-react';

export const SuperAdminBillingTab: React.FC = () => {
  const {
    analytics,
    allPlansAdmin,
    createPlan,
    updatePlan,
    archivePlan,
    simulatePaymentWebhook,
    extendTrial,
    refreshSubscription,
  } = useSubscription();

  const { tenants } = useOrganization();
  const { addToast } = useToast();

  const [activeSubView, setActiveSubView] = useState<'ANALYTICS' | 'PLANS' | 'TENANTS' | 'WEBHOOK_SIM'>('ANALYTICS');

  // Plan Edit State
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planForm, setPlanForm] = useState<{
    name: string;
    code: string;
    description: string;
    priceMonthly: number;
    priceYearly: number;
    vehicleQuota: number;
    userQuota: number;
    deviceQuota: number;
    aiQuotaCredits: number;
    storageQuotaMb: number;
    apiQuotaMonthly: number;
    trialDurationDays: number;
  }>({
    name: '',
    code: '',
    description: '',
    priceMonthly: 1990000,
    priceYearly: 19000000,
    vehicleQuota: 50,
    userQuota: 10,
    deviceQuota: 50,
    aiQuotaCredits: 5000,
    storageQuotaMb: 1024,
    apiQuotaMonthly: 5000,
    trialDurationDays: 14,
  });

  // Webhook Simulator State
  const [webhookTenantId, setWebhookTenantId] = useState('tenant-tln-01');
  const [webhookAmount, setWebhookAmount] = useState(2490000);
  const [webhookStatus, setWebhookStatus] = useState<'PAID' | 'FAILED'>('PAID');
  const [webhookResponse, setWebhookResponse] = useState<string | null>(null);

  const handleOpenCreatePlan = () => {
    setEditingPlan(null);
    setPlanForm({
      name: '',
      code: '',
      description: '',
      priceMonthly: 1990000,
      priceYearly: 19000000,
      vehicleQuota: 50,
      userQuota: 10,
      deviceQuota: 50,
      aiQuotaCredits: 5000,
      storageQuotaMb: 1024,
      apiQuotaMonthly: 5000,
      trialDurationDays: 14,
    });
    setShowPlanModal(true);
  };

  const handleOpenEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name,
      code: plan.code,
      description: plan.description,
      priceMonthly: plan.priceMonthly,
      priceYearly: plan.priceYearly,
      vehicleQuota: plan.vehicleQuota,
      userQuota: plan.userQuota,
      deviceQuota: plan.deviceQuota,
      aiQuotaCredits: plan.aiQuotaCredits,
      storageQuotaMb: plan.storageQuotaMb,
      apiQuotaMonthly: plan.apiQuotaMonthly,
      trialDurationDays: plan.trialDurationDays,
    });
    setShowPlanModal(true);
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planForm.name || !planForm.code) {
      addToast({ title: 'Data Tidak Lengkap', message: 'Nama dan kode paket wajib diisi.', type: 'error' });
      return;
    }

    if (editingPlan) {
      await updatePlan(editingPlan.id, planForm);
    } else {
      await createPlan({
        ...planForm,
        currency: 'IDR',
        billingInterval: 'MONTHLY',
        featureFlags: {
          liveTracking: true,
          tripHistory: true,
          geofence: true,
          delivery: true,
          fuel: true,
          maintenance: true,
          safety: true,
          fatigue: true,
          analytics: true,
          aiAssistant: true,
          predictiveMaintenance: true,
          aiFuel: true,
          aiDriver: true,
          aiRoute: true,
          aiSafety: true,
          api: false,
          export: true,
          customBranding: false,
          automation: true,
        },
        status: 'ACTIVE',
      });
    }

    setShowPlanModal(false);
  };

  const handleSimulateWebhook = () => {
    const res = simulatePaymentWebhook({
      eventId: `evt-sim-${Date.now()}`,
      transactionId: `TRX-SIM-${Date.now()}`,
      idempotencyKey: `idemp-sim-${Date.now()}`,
      invoiceNumber: `INV-SIM-${Date.now()}`,
      tenantId: webhookTenantId,
      amount: webhookAmount,
      currency: 'IDR',
      paymentStatus: webhookStatus,
      paymentMethod: 'BCA_VA',
      signature: 'sha256_mock_valid_signature_hash',
      timestamp: new Date().toISOString(),
    });

    setWebhookResponse(JSON.stringify(res, null, 2));
    addToast({
      title: res.success ? 'Webhook Berhasil' : 'Webhook Gagal',
      message: res.message,
      type: res.success ? 'success' : 'error',
    });
  };

  return (
    <div className="space-y-6">
      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSubView('ANALYTICS')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeSubView === 'ANALYTICS'
              ? 'bg-cyan-600 text-white'
              : 'text-slate-600 hover:text-slate-900 bg-slate-100'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>SaaS Revenue & MRR</span>
        </button>

        <button
          onClick={() => setActiveSubView('PLANS')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeSubView === 'PLANS'
              ? 'bg-cyan-600 text-white'
              : 'text-slate-600 hover:text-slate-900 bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Katalog Paket & Quotas</span>
        </button>

        <button
          onClick={() => setActiveSubView('TENANTS')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeSubView === 'TENANTS'
              ? 'bg-cyan-600 text-white'
              : 'text-slate-600 hover:text-slate-900 bg-slate-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Tenant Subscriptions</span>
        </button>

        <button
          onClick={() => setActiveSubView('WEBHOOK_SIM')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeSubView === 'WEBHOOK_SIM'
              ? 'bg-cyan-600 text-white'
              : 'text-slate-600 hover:text-slate-900 bg-slate-100'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Payment Gateway Simulator</span>
        </button>
      </div>

      {/* VIEW 1: REVENUE ANALYTICS */}
      {activeSubView === 'ANALYTICS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Monthly Recurring Revenue (MRR)</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono mt-1">
                Rp {analytics.mrr.toLocaleString('id-ID')}
              </div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">
                +14.2% dari bulan lalu
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Annual Run Rate (ARR)</span>
                <TrendingUp className="w-4 h-4 text-cyan-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono mt-1">
                Rp {analytics.arr.toLocaleString('id-ID')}
              </div>
              <div className="text-[11px] text-cyan-700 font-medium mt-1">
                Target Q3: Rp 1.5 Milyar
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Pelanggan Aktif & Trial</span>
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono mt-1">
                {analytics.activeSubscriptionsCount}{' '}
                <span className="text-xs font-normal text-slate-500">Paid ({analytics.trialAccountsCount} Trial)</span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">
                Konversi Trial: <strong>{analytics.conversionRatePercent}%</strong>
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Churn Rate Bulanan</span>
                <Activity className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono mt-1">
                {analytics.churnRatePercent}%
              </div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">
                Kesehatan SaaS Sehat (&lt; 2%)
              </div>
            </div>
          </div>

          {/* Revenue Trend by Plan */}
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Tren Pendapatan Bulanan per Paket</h3>
            <div className="space-y-3">
              {analytics.monthlyRevenueTrend.map((row) => (
                <div key={row.month} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{row.month}</span>
                    <span className="font-mono text-slate-900">Rp {row.total.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex h-3 rounded-full overflow-hidden bg-slate-100">
                    <div
                      className="bg-emerald-500 h-full"
                      style={{ width: `${(row.starter / row.total) * 100}%` }}
                      title={`Starter: Rp ${row.starter.toLocaleString('id-ID')}`}
                    />
                    <div
                      className="bg-cyan-500 h-full"
                      style={{ width: `${(row.professional / row.total) * 100}%` }}
                      title={`Professional: Rp ${row.professional.toLocaleString('id-ID')}`}
                    />
                    <div
                      className="bg-blue-600 h-full"
                      style={{ width: `${(row.enterprise / row.total) * 100}%` }}
                      title={`Enterprise: Rp ${row.enterprise.toLocaleString('id-ID')}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-6 pt-3 text-xs text-slate-600 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>Starter (16%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-500" />
                <span>Professional (56%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600" />
                <span>Enterprise (28%)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: PLANS MANAGEMENT */}
      {activeSubView === 'PLANS' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900">Katalog Paket SaaS & Kuota</h3>
            <button
              onClick={handleOpenCreatePlan}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Paket Baru</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="py-3 px-4">Nama Paket & Kode</th>
                  <th className="py-3 px-4">Harga Bulanan</th>
                  <th className="py-3 px-4">Harga Tahunan</th>
                  <th className="py-3 px-4">Kuota Unit</th>
                  <th className="py-3 px-4">AI Credits</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allPlansAdmin.map((plan) => (
                  <tr key={plan.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {plan.name} <span className="text-[10px] font-mono text-slate-400 font-normal">({plan.code}) v{plan.version}</span>
                    </td>
                    <td className="py-3 px-4 font-mono">Rp {plan.priceMonthly.toLocaleString('id-ID')}</td>
                    <td className="py-3 px-4 font-mono">Rp {plan.priceYearly.toLocaleString('id-ID')}</td>
                    <td className="py-3 px-4 font-mono">{plan.vehicleQuota === -1 ? '∞' : plan.vehicleQuota} Unit</td>
                    <td className="py-3 px-4 font-mono">{plan.aiQuotaCredits.toLocaleString('id-ID')} cr</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          plan.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {plan.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => handleOpenEditPlan(plan)}
                        className="p-1 text-slate-500 hover:text-cyan-600 rounded-md hover:bg-slate-100"
                        title="Edit Paket"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => archivePlan(plan.id)}
                        className="p-1 text-slate-500 hover:text-rose-600 rounded-md hover:bg-slate-100"
                        title="Arsipkan Paket"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: TENANTS SUBSCRIPTIONS */}
      {activeSubView === 'TENANTS' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Daftar Langganan Tenant & Otorisasi</h3>
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="py-3 px-4">Perusahaan / Tenant</th>
                  <th className="py-3 px-4">Paket Aktif</th>
                  <th className="py-3 px-4">Masa Berlaku</th>
                  <th className="py-3 px-4">Auto-Renew</th>
                  <th className="py-3 px-4 text-right">Aksi Super Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tenants.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-bold text-slate-900">{t.name}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-cyan-100 text-cyan-800 rounded-md font-bold text-[10px]">
                        PROFESSIONAL
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      Hingga 15 Jan 2027
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-600">Aktif</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => extendTrial(7)}
                        className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold rounded-lg"
                      >
                        +7 Hari Trial
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 4: PAYMENT GATEWAY WEBHOOK SIMULATOR */}
      {activeSubView === 'WEBHOOK_SIM' && (
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-5 max-w-2xl">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Simulator Webhook Ingress (Midtrans / Xendit)</h3>
            <p className="text-xs text-slate-500">
              Uji coba payload webhook pembayaran asinkron dengan verifikasi signature dan idempotensi
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Tenant ID</label>
              <input
                type="text"
                value={webhookTenantId}
                onChange={(e) => setWebhookTenantId(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nominal Transaksi (IDR)</label>
                <input
                  type="number"
                  value={webhookAmount}
                  onChange={(e) => setWebhookAmount(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Status Webhook</label>
                <select
                  value={webhookStatus}
                  onChange={(e) => setWebhookStatus(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                >
                  <option value="PAID">PAID (Pembayaran Berhasil)</option>
                  <option value="FAILED">FAILED (Pembayaran Gagal)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleSimulateWebhook}
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl transition-colors shadow-xs"
            >
              Kirim Webhook Simulasi
            </button>

            {webhookResponse && (
              <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto">
                <pre>{webhookResponse}</pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Plan Create/Edit Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {editingPlan ? `Edit Paket ${editingPlan.name}` : 'Buat Paket SaaS Baru'}
            </h3>

            <form onSubmit={handleSavePlan} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Paket</label>
                  <input
                    type="text"
                    value={planForm.name}
                    onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                    placeholder="Contoh: Growth"
                    className="w-full p-2 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kode Paket (Uppercase)</label>
                  <input
                    type="text"
                    value={planForm.code}
                    onChange={(e) => setPlanForm({ ...planForm, code: e.target.value.toUpperCase() })}
                    placeholder="GROWTH"
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono uppercase"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi</label>
                <input
                  type="text"
                  value={planForm.description}
                  onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                  placeholder="Deskripsi singkat target armada..."
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Harga Bulanan (IDR)</label>
                  <input
                    type="number"
                    value={planForm.priceMonthly}
                    onChange={(e) => setPlanForm({ ...planForm, priceMonthly: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Harga Tahunan (IDR)</label>
                  <input
                    type="number"
                    value={planForm.priceYearly}
                    onChange={(e) => setPlanForm({ ...planForm, priceYearly: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kuota Unit</label>
                  <input
                    type="number"
                    value={planForm.vehicleQuota}
                    onChange={(e) => setPlanForm({ ...planForm, vehicleQuota: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kuota User</label>
                  <input
                    type="number"
                    value={planForm.userQuota}
                    onChange={(e) => setPlanForm({ ...planForm, userQuota: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">AI Credits</label>
                  <input
                    type="number"
                    value={planForm.aiQuotaCredits}
                    onChange={(e) => setPlanForm({ ...planForm, aiQuotaCredits: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPlanModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Simpan Paket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
