/**
 * Fleet Intelligence Smart AI - Plan Comparison & Upgrade/Downgrade Matrix Tab (Prompt 41)
 * Interactive pricing cards, monthly/yearly toggle (20% discount), feature matrix, and safe downgrade validation
 */

import React, { useState } from 'react';
import { Plan, BillingInterval } from '../../../types/subscription';
import { useSubscription } from '../../../context/SubscriptionContext';
import {
  Check,
  X,
  Sparkles,
  Crown,
  Zap,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';

interface PlanComparisonTabProps {
  onSelectPlanToUpgrade: (plan: Plan, interval: BillingInterval) => void;
}

const FEATURE_CATEGORIES = [
  {
    name: 'Operasional & Telematika Armada',
    features: [
      { key: 'liveTracking', label: 'Live GPS Tracking Real-Time', starter: true, pro: true, ent: true },
      { key: 'tripHistory', label: 'Histori Perjalanan & Replay Rute', starter: true, pro: true, ent: true },
      { key: 'geofence', label: 'Geofence Virtual & Deteksi Overstay', starter: true, pro: true, ent: true },
      { key: 'delivery', label: 'Manajemen Delivery & Surat Jalan', starter: true, pro: true, ent: true },
      { key: 'fuel', label: 'Audit Konsumsi BBM & Struk SPBU', starter: true, pro: true, ent: true },
      { key: 'maintenance', label: 'Work Order Servis & Suku Cadang', starter: true, pro: true, ent: true },
      { key: 'safety', label: 'Safety Score & Peringatan Pelanggaran', starter: true, pro: true, ent: true },
    ],
  },
  {
    name: 'Kecerdasan Buatan (Smart AI Engine)',
    features: [
      { key: 'fatigue', label: 'AI Driver Fatigue & Microsleep Detection', starter: false, pro: true, ent: true },
      { key: 'analytics', label: 'Advanced Fleet Analytics & TCO', starter: false, pro: true, ent: true },
      { key: 'aiAssistant', label: 'Fleet AI Copilot Assistant Chat', starter: false, pro: true, ent: true },
      { key: 'predictiveMaintenance', label: 'AI Predictive Maintenance Engine', starter: false, pro: true, ent: true },
      { key: 'aiFuel', label: 'AI Fuel Theft & Anomaly Detection', starter: false, pro: true, ent: true },
      { key: 'aiDriver', label: 'AI Driver Risk Score & Coaching Plans', starter: false, pro: true, ent: true },
      { key: 'aiRoute', label: 'AI Dynamic Routing & Smart ETA', starter: false, pro: true, ent: true },
      { key: 'aiSafety', label: 'AI Safety Incident Classification', starter: false, pro: true, ent: true },
      { key: 'automation', label: 'AI Automation Workflow Engine', starter: false, pro: true, ent: true },
    ],
  },
  {
    name: 'Integrasi, Keamanan & Enterprise',
    features: [
      { key: 'export', label: 'Ekspor Dokumen PDF, Excel & CSV', starter: true, pro: true, ent: true },
      { key: 'api', label: 'REST API & Webhooks Access (SAP/ERP)', starter: false, pro: false, ent: true },
      { key: 'customBranding', label: 'White-Label Portal & Custom Branding', starter: false, pro: false, ent: true },
    ],
  },
];

export const PlanComparisonTab: React.FC<PlanComparisonTabProps> = ({ onSelectPlanToUpgrade }) => {
  const { plans, currentPlan, subscription, usage, downgradePlan } = useSubscription();

  const [interval, setInterval] = useState<BillingInterval>(subscription?.billingInterval || 'YEARLY');
  const [downgradeError, setDowngradeError] = useState<string | null>(null);

  const handlePlanAction = async (targetPlan: Plan) => {
    setDowngradeError(null);

    if (!subscription) return;

    // Check if same plan
    if (subscription.planId === targetPlan.id && subscription.billingInterval === interval) {
      return;
    }

    // Determine if it's an upgrade or downgrade based on monthly price
    const currentPrice = currentPlan ? currentPlan.priceMonthly : 0;
    const isUpgrade = targetPlan.priceMonthly >= currentPrice;

    if (isUpgrade) {
      onSelectPlanToUpgrade(targetPlan, interval);
    } else {
      // Downgrade flow with validation
      const res = await downgradePlan(targetPlan.id, interval);
      if (!res.success) {
        setDowngradeError(res.message);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Interval Billing Switcher */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold text-slate-900">Pilih Paket Sesuai Kebutuhan Armada Anda</h2>
        <p className="text-xs text-slate-500 max-w-lg mx-auto">
          Dapatkan efisiensi bahan bakar maksimal, prediksi kerusakan dini, dan kepatuhan keselamatan dengan teknologi Smart AI.
        </p>

        <div className="inline-flex items-center p-1 bg-slate-100 border border-slate-200 rounded-xl shadow-xs">
          <button
            type="button"
            onClick={() => setInterval('MONTHLY')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              interval === 'MONTHLY'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tagihan Bulanan
          </button>
          <button
            type="button"
            onClick={() => setInterval('YEARLY')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              interval === 'YEARLY'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Tagihan Tahunan</span>
            <span className="text-[10px] bg-amber-400 text-amber-950 font-bold px-1.5 py-0.2 rounded-full">
              Hemat 20%
            </span>
          </button>
        </div>
      </div>

      {downgradeError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800 text-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="whitespace-pre-line leading-relaxed">{downgradeError}</div>
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {plans.map((plan) => {
          const isCurrent = subscription?.planId === plan.id;
          const price = interval === 'YEARLY' ? plan.priceYearly : plan.priceMonthly;
          const monthlyEquivalent = interval === 'YEARLY' ? Math.round(plan.priceYearly / 12) : plan.priceMonthly;

          return (
            <div
              key={plan.id}
              className={`p-6 bg-white border rounded-2xl shadow-xs flex flex-col justify-between relative transition-all ${
                plan.isPopular
                  ? 'border-cyan-500 ring-2 ring-cyan-500/20 shadow-md'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Paling Populer
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">{plan.name}</h3>
                  {plan.code === 'ENTERPRISE' && <Crown className="w-4 h-4 text-amber-500" />}
                </div>
                <p className="text-xs text-slate-500 mt-1 min-h-[36px]">{plan.description}</p>

                {/* Price Display */}
                <div className="mt-5 pb-5 border-b border-slate-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs font-semibold text-slate-500">Rp</span>
                    <span className="text-2xl font-bold text-slate-900 font-mono">
                      {price.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {interval === 'YEARLY' ? (
                      <>
                        per tahun (<span className="text-cyan-700 font-medium">Rp {monthlyEquivalent.toLocaleString('id-ID')}/bln</span>)
                      </>
                    ) : (
                      'per bulan'
                    )}
                  </div>
                </div>

                {/* Core Quotas Checklist */}
                <div className="mt-5 space-y-2.5 text-xs text-slate-700">
                  <div className="font-semibold text-[11px] text-slate-500 uppercase tracking-wider">Kapasitas:</div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-600 shrink-0" />
                    <span>
                      Hingga <strong>{plan.vehicleQuota === -1 ? 'Tanpa Batas' : `${plan.vehicleQuota} Unit`}</strong> Armada
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-600 shrink-0" />
                    <span>
                      Maksimal <strong>{plan.userQuota === -1 ? 'Tanpa Batas' : `${plan.userQuota} User`}</strong> Staf Operasional
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-600 shrink-0" />
                    <span>
                      <strong>{plan.aiQuotaCredits === -1 ? 'Unlimited' : `${plan.aiQuotaCredits.toLocaleString('id-ID')} Credits`}</strong> AI/bln
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-600 shrink-0" />
                    <span>
                      Penyimpanan Dokumen <strong>{plan.storageQuotaMb >= 1024 ? `${plan.storageQuotaMb / 1024} GB` : `${plan.storageQuotaMb} MB`}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action CTA */}
              <div className="mt-8 pt-4 border-t border-slate-100">
                {isCurrent ? (
                  <div className="w-full py-2.5 text-center text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl">
                    ✓ Paket Aktif Saat Ini
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handlePlanAction(plan)}
                    className={`w-full py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs ${
                      plan.isPopular
                        ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>Pilih Paket {plan.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Comparison Matrix Table */}
      <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900">Matriks Perbandingan Fitur Komprehensif</h3>
          <p className="text-xs text-slate-500">Periksa detail modul dan kapabilitas yang didukung pada tiap paket</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-900 font-bold">
                <th className="py-3 px-4 w-1/3">Modul & Fitur Platform</th>
                <th className="py-3 px-4 text-center">Starter</th>
                <th className="py-3 px-4 text-center bg-cyan-50/50 text-cyan-900">Professional (Populer)</th>
                <th className="py-3 px-4 text-center">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {FEATURE_CATEGORIES.map((category) => (
                <React.Fragment key={category.name}>
                  <tr className="bg-slate-100/70">
                    <td colSpan={4} className="py-2 px-4 font-bold text-[11px] text-slate-700 uppercase tracking-wider">
                      {category.name}
                    </td>
                  </tr>
                  {category.features.map((f) => (
                    <tr key={f.key} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 px-4 font-medium text-slate-800">{f.label}</td>
                      <td className="py-2.5 px-4 text-center">
                        {f.starter ? (
                          <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-slate-300 mx-auto" />
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-center bg-cyan-50/30">
                        {f.pro ? (
                          <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-slate-300 mx-auto" />
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        {f.ent ? (
                          <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-slate-300 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
