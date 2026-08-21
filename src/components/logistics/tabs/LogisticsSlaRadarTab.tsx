import React from 'react';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Target,
  Zap,
  Award
} from 'lucide-react';
import { LogisticsOrder } from '../../../modules/logistics/types';

interface Props {
  orders: LogisticsOrder[];
}

export const LogisticsSlaRadarTab: React.FC<Props> = ({ orders }) => {
  const total = orders.length || 1;
  const breachedCount = orders.filter(o => o.isSlaBreached).length;
  const onTimeCount = total - breachedCount;
  const onTimePct = ((onTimeCount / total) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Target className="w-6 h-6 text-emerald-600" />
            Radar SLA & On-Time Delivery Performance (OTD)
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Pemantauan kepatuhan Service Level Agreement pengiriman instan, sameday, nextday, dan kargo darat.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-full text-xs font-bold flex items-center gap-1.5">
            <Award className="w-4 h-4" /> SLA Target: &gt; 98.0%
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Tingkat On-Time Delivery (OTD)</span>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{onTimePct}%</div>
          <p className="text-[11px] text-slate-400">{onTimeCount} dari {total} paket tepat waktu</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Pelanggaran SLA (Breached)</span>
          <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">{breachedCount} Resi</div>
          <p className="text-[11px] text-slate-400">Pemicu kompensasi garansi ongkir</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Rata-rata Lead Time Pengiriman</span>
          <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">18.4 Jam</div>
          <p className="text-[11px] text-slate-400">Lebih cepat 3.2 jam dibanding standar</p>
        </div>
      </div>

      {/* SLA by Service Matrix */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          Kinerja SLA Berdasarkan Jenis Layanan
        </h3>

        <div className="space-y-4 text-xs">
          {[
            { service: 'SAMEDAY (Maks 8 Jam)', pct: 99.4, count: 48, status: 'OPTIMAL' },
            { service: 'NEXTDAY (Maks 24 Jam)', pct: 98.8, count: 120, status: 'OPTIMAL' },
            { service: 'REGULAR (2-3 Hari Antar Kota)', pct: 97.5, count: 310, status: 'PERHATIAN' },
            { service: 'COLD CHAIN REEFER (Vaksin & Fresh Food)', pct: 100.0, count: 18, status: 'SEMPURNA' },
            { service: 'CARGO FTL TRUCKING (Jawa - Bali)', pct: 96.2, count: 24, status: 'PERHATIAN' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 dark:text-white">{item.service}</span>
                <span className="font-extrabold text-sm text-blue-600 dark:text-blue-400">{item.pct}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${item.pct}%` }} />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>{item.count} Pengiriman</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Status: {item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
