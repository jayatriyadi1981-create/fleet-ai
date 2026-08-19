/**
 * Fleet Intelligence Smart AI - Feature Guard & Premium Entitlement Fallback (Prompt 41)
 * Displays a clean, non-intrusive upgrade card if a feature is not entitled in the tenant's current plan
 */

import React from 'react';
import { PlanFeatureKey } from '../../types/subscription';
import { useSubscription } from '../../context/SubscriptionContext';
import { useFleet } from '../../context/FleetContext';
import { Sparkles, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

interface FeatureGuardProps {
  feature: PlanFeatureKey;
  children: React.ReactNode;
  title?: string;
  description?: string;
  fallback?: React.ReactNode;
}

const FEATURE_NAMES_MAP: Record<PlanFeatureKey, { title: string; desc: string; plan: string }> = {
  liveTracking: { title: 'Live GPS Tracking', desc: 'Pemantauan lokasi kendaraan real-time dengan update interval tinggi.', plan: 'Starter' },
  tripHistory: { title: 'Histori Perjalanan & Replay', desc: 'Pemutaran ulang rute historis armada.', plan: 'Starter' },
  geofence: { title: 'Geofencing & POI', desc: 'Zona pembatasan virtual dan deteksi overstay.', plan: 'Starter' },
  delivery: { title: 'Manajemen Delivery', desc: 'Manifest pengiriman dan bukti serah terima.', plan: 'Starter' },
  fuel: { title: 'Audit Konsumsi BBM', desc: 'Pencatatan resi dan grafik efisiensi BBM.', plan: 'Starter' },
  maintenance: { title: 'Work Order Pemeliharaan', desc: 'Jadwal servis berkala dan log suku cadang bengkel.', plan: 'Starter' },
  safety: { title: 'Safety Score & Pelanggaran', desc: 'Monitoring kecepatan dan pengereman mendadak.', plan: 'Starter' },
  fatigue: { title: 'AI Driver Fatigue Monitoring', desc: 'Deteksi kelelahan dan microsleep pengemudi berbasis telematika sensor.', plan: 'Professional' },
  analytics: { title: 'Advanced Fleet Analytics', desc: 'Dashboard analitik mendalam utilitas dan cost per km.', plan: 'Professional' },
  aiAssistant: { title: 'Fleet AI Copilot Assistant', desc: 'Tanya jawab interaktif dan asisten operasional cerdas dengan pemrosesan bahasa alami.', plan: 'Professional' },
  predictiveMaintenance: { title: 'AI Predictive Maintenance', desc: 'Deteksi dini degradasi mesin dan estimasi sisa umur pakai komponen.', plan: 'Professional' },
  aiFuel: { title: 'AI Fuel Intelligence & Theft Detection', desc: 'Deteksi kebocoran dan anomali pengisian BBM secara otomatis.', plan: 'Professional' },
  aiDriver: { title: 'AI Driver Intelligence & Coaching', desc: 'Analisis perilaku dan rencana coaching personal berbasis AI.', plan: 'Professional' },
  aiRoute: { title: 'AI Route & ETA Dynamic Optimization', desc: 'Rekomendasi rute tercepat dan prediksi waktu tiba cerdas.', plan: 'Professional' },
  aiSafety: { title: 'AI Safety Risk Intelligence', desc: 'Klasifikasi risiko berkendara dan mitigasi proaktif.', plan: 'Professional' },
  api: { title: 'REST API & Webhook Gateway', desc: 'Akses API integrasi penuh ke ERP (SAP, Oracle, Odoo) dan sistem internal.', plan: 'Enterprise' },
  export: { title: 'Ekspor Dokumen & Laporan Eksekutif', desc: 'Mendownload laporan analitik dalam format PDF/Excel/CSV.', plan: 'Starter' },
  customBranding: { title: 'Custom White-Label Branding', desc: 'Kustomisasi logo perusahaan, portal domain khusus, dan identitas tenant.', plan: 'Enterprise' },
  automation: { title: 'AI Automation & Event Triggers', desc: 'Alur kerja otomasi otomatis jika terjadi insiden atau anomali armada.', plan: 'Professional' },
};

export const FeatureGuard: React.FC<FeatureGuardProps> = ({
  feature,
  children,
  title,
  description,
  fallback,
}) => {
  const { canUseFeature, currentPlan } = useSubscription();
  const { setActiveView } = useFleet();

  const isAllowed = canUseFeature(feature);

  if (isAllowed) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  const meta = FEATURE_NAMES_MAP[feature] || {
    title: 'Fitur Premium',
    desc: 'Fitur ini memerlukan paket langganan yang lebih tinggi.',
    plan: 'Professional',
  };

  const featureTitle = title || meta.title;
  const featureDesc = description || meta.desc;

  return (
    <div className="p-8 max-w-2xl mx-auto my-8 bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200 rounded-2xl text-center shadow-xs">
      <div className="w-14 h-14 bg-cyan-100 text-cyan-700 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-cyan-200 shadow-xs">
        <Lock className="w-7 h-7" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-semibold rounded-full mb-3">
        <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
        Tersedia di Paket {meta.plan}
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-2">{featureTitle}</h3>
      <p className="text-sm text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
        {featureDesc} Paket Anda saat ini (<strong className="text-slate-800">{currentPlan?.name || 'Starter'}</strong>) belum mencakup modul ini.
      </p>

      <div className="bg-white p-4 rounded-xl border border-slate-200 text-left max-w-md mx-auto mb-6 space-y-2">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Keuntungan Upgrade:</div>
        <div className="flex items-center gap-2 text-xs text-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Akses penuh tanpa batasan fitur {featureTitle}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Kuota armada dan AI credits bulanan yang lebih tinggi</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Dukungan teknis prioritas dan SLA response time</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setActiveView('subscription' as any)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
        >
          <span>Upgrade Paket Sekarang</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
