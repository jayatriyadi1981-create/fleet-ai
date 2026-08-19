/**
 * Fleet Intelligence Smart AI - Subscription & Billing Main View (Prompt 41)
 * Multi-Tenant SaaS Billing Engine, Real-Time Quota Enforcement & Feature Gating
 */

import React, { useState } from 'react';
import { Plan, BillingInterval } from '../../types/subscription';
import { useSubscription } from '../../context/SubscriptionContext';
import { useAuth } from '../../context/AuthContext';
import { OverviewTab } from './tabs/OverviewTab';
import { QuotasMeterTab } from './tabs/QuotasMeterTab';
import { PlanComparisonTab } from './tabs/PlanComparisonTab';
import { InvoicesHistoryTab } from './tabs/InvoicesHistoryTab';
import { PaymentSettingsTab } from './tabs/PaymentSettingsTab';
import { SuperAdminBillingTab } from './tabs/SuperAdminBillingTab';
import { SubscriptionEventsTab } from './tabs/SubscriptionEventsTab';
import { CheckoutPaymentModal } from './CheckoutPaymentModal';
import {
  CreditCard,
  Gauge,
  Layers,
  FileText,
  Settings,
  History,
  ShieldCheck,
  Sparkles,
  Crown,
} from 'lucide-react';

export const SubscriptionMainView: React.FC = () => {
  const { currentPlan, plans, isTrial, trialDaysRemaining } = useSubscription();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState<Plan | null>(null);
  const [selectedIntervalForUpgrade, setSelectedIntervalForUpgrade] = useState<BillingInterval>('YEARLY');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleOpenUpgrade = (planId?: string) => {
    const target = planId ? plans.find((p) => p.id === planId) : plans[1] || plans[0];
    if (target) {
      setSelectedPlanForUpgrade(target);
      setSelectedIntervalForUpgrade('YEARLY');
      setIsCheckoutOpen(true);
    }
  };

  const handleSelectPlanFromComparison = (plan: Plan, interval: BillingInterval) => {
    setSelectedPlanForUpgrade(plan);
    setSelectedIntervalForUpgrade(interval);
    setIsCheckoutOpen(true);
  };

  const isSuperAdmin = user?.role === 'super_admin' || user?.role === 'company_admin' || user?.role === 'admin';

  const tabs = [
    { id: 'overview', label: 'Ringkasan Langganan', icon: Sparkles },
    { id: 'quotas', label: 'Penggunaan Kuota', icon: Gauge },
    { id: 'comparison', label: 'Paket & Upgrade', icon: Layers },
    { id: 'invoices', label: 'Riwayat Invoice', icon: FileText },
    { id: 'settings', label: 'Pengaturan Billing', icon: Settings },
    { id: 'events', label: 'Audit Log Lifecycle', icon: History },
    ...(isSuperAdmin ? [{ id: 'superadmin', label: 'Admin SaaS & MRR', icon: Crown }] : []),
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-cyan-100 text-cyan-800 text-[10px] font-bold uppercase rounded-full tracking-wider">
              SaaS Engine & Billing
            </span>
            {isTrial && (
              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold uppercase rounded-full tracking-wider">
                Trial ({trialDaysRemaining} Hari)
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Paket Berlangganan & Penagihan</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola paket armada, batasan kuota kendaraan, AI credits, faktur resmi PPN 11%, dan integrasi payment gateway.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenUpgrade()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>Upgrade / Perpanjang Paket</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {tabs.map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-white border border-slate-200'
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'overview' && (
          <OverviewTab
            onNavigateTab={(t) => setActiveTab(t)}
            onOpenUpgradeModal={(pId) => handleOpenUpgrade(pId)}
          />
        )}
        {activeTab === 'quotas' && (
          <QuotasMeterTab onOpenUpgradeModal={() => handleOpenUpgrade()} />
        )}
        {activeTab === 'comparison' && (
          <PlanComparisonTab
            onSelectPlanToUpgrade={(plan, interval) =>
              handleSelectPlanFromComparison(plan, interval)
            }
          />
        )}
        {activeTab === 'invoices' && <InvoicesHistoryTab />}
        {activeTab === 'settings' && <PaymentSettingsTab />}
        {activeTab === 'events' && <SubscriptionEventsTab />}
        {activeTab === 'superadmin' && isSuperAdmin && <SuperAdminBillingTab />}
      </div>

      {/* Checkout Modal */}
      {selectedPlanForUpgrade && (
        <CheckoutPaymentModal
          plan={selectedPlanForUpgrade}
          billingInterval={selectedIntervalForUpgrade}
          isOpen={isCheckoutOpen}
          onClose={() => {
            setIsCheckoutOpen(false);
            setSelectedPlanForUpgrade(null);
          }}
          onSuccess={() => {
            setActiveTab('overview');
          }}
        />
      )}
    </div>
  );
};
