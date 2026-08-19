import React from 'react';
import { Wrench, AlertCircle, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';
import { landingContent } from '../../config/landingContent';

interface MaintenanceSectionProps {
  onNavigateLogin: () => void;
}

export const MaintenanceSection: React.FC<MaintenanceSectionProps> = ({
  onNavigateLogin,
}) => {
  const sample = landingContent.predictiveMaintenanceSample;

  return (
    <section className="py-16 sm:py-24 bg-slate-900/40 border-b border-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Sample Card */}
          <div className="rounded-2xl border border-rose-500/30 bg-slate-950 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Wrench className="h-4 w-4 text-rose-400" />
                PREDICTIVE MAINTENANCE ALERT
              </span>
              <span className="rounded bg-rose-500/20 px-2.5 py-0.5 text-xs font-bold text-rose-400 border border-rose-500/30">
                Risk: {sample.riskLevel}
              </span>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-white">{sample.vehiclePlate}</span>
                <span className="text-xs text-slate-400">{sample.vehicleModel}</span>
              </div>
              <p className="text-xs text-rose-300 font-medium leading-relaxed">
                {sample.issue}
              </p>
            </div>

            <div className="rounded-xl bg-slate-900/80 p-3.5 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400">Rekomendasi Aksi AI:</p>
                <p className="text-xs font-bold text-cyan-300">{sample.action}</p>
              </div>
              <Calendar className="h-5 w-5 text-cyan-400" />
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-950/40 px-3.5 py-1 text-xs font-bold text-rose-300">
              <Wrench className="h-3.5 w-3.5 text-rose-400" />
              <span>Smart Maintenance System</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Jangan Tunggu Kendaraan Rusak.
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Gunakan data telematika jam kerja mesin dan jarak tempuh untuk membantu memprediksi kebutuhan maintenance dan mengurangi waktu mogok (downtime).
            </p>

            <div className="space-y-3 pt-2">
              {[
                'Pengingat servis berdasarkan Odometer kilometer asli & Hour Meter (HM)',
                'Manajemen Work Order (WO) bengkel internal & eksternal',
                'Riwayat penggantian suku cadang, oli, dan komponen rem',
                'Pencegahan kerusakan fatal di tengah jalan saat membawa muatan',
              ].map((pt, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs font-medium text-slate-200">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/20 text-rose-400 shrink-0">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <span>{pt}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={onNavigateLogin}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
              >
                <span>Lihat Predictive Maintenance</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
