/**
 * Fatigue Safety Tab
 * PROMPT 33 Architecture
 */

import React from 'react';
import { 
  Activity, 
  Sparkles, 
  Clock, 
  Moon, 
  AlertTriangle, 
  CheckCircle2, 
  Coffee, 
  TrendingUp,
  ShieldAlert,
  Battery
} from 'lucide-react';
import { SafetyPatternEngine } from '../../engines/SafetyPatternEngine';

export const FatigueSafetyTab: React.FC = () => {
  const timeDist = SafetyPatternEngine.getTimeBasedSafetyDistribution();

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400 shrink-0 mt-0.5">
            <Moon className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Fatigue Safety Intelligence & Circadian Risk
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-500/20 text-purple-300 font-mono">
                Index: 28/100 (Moderate)
              </span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
              Analisis korelasi waktu mengemudi kontinu, kepatuhan jeda istirahat (P23), dan puncak risiko ritme sirkadian (00:00 - 04:00). Tidak ada diagnosis medis yang diasumsikan tanpa data sensor biometrik.
            </p>
          </div>
        </div>
      </div>

      {/* 24-Hour Temporal Risk Distribution */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              Distribusi Risiko Keselamatan & Insiden Berdasarkan Jam Operasional (24 Jam)
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Puncak insiden telemetri teramati pada rentang jam 22:00 - 04:00 WIB (Shift Malam).
            </p>
          </div>
          <span className="text-xs font-mono text-purple-400">Peak Risk: 02:00 WIB (92%)</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {timeDist.map(item => (
            <div
              key={item.hour}
              className={`p-3 rounded-lg border text-center space-y-1.5 transition-all ${
                item.riskIndex >= 75
                  ? 'bg-purple-950/40 border-purple-500/50 shadow-xs'
                  : item.riskIndex >= 50
                  ? 'bg-slate-800/80 border-slate-700'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="text-xs font-bold font-mono text-slate-200">{item.label}</div>
              <div className={`text-base font-bold font-mono ${
                item.riskIndex >= 75 ? 'text-red-400' :
                item.riskIndex >= 50 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {item.riskIndex}%
              </div>
              <div className="text-[10px] text-slate-400 font-mono">{item.incidentRate} Insiden/100k</div>
            </div>
          ))}
        </div>
      </div>

      {/* Rest Stop Policy & Geofenced Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
            <Coffee className="w-4 h-4 text-amber-400" />
            Kepatuhan Jeda Istirahat Wajib (Rest Stop Compliance)
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Regulasi mewajibkan istirahat minimal <strong>30 menit setiap 4 jam mengemudi terus-menerus</strong>. Tingkat kepatuhan armada saat ini mencapai <strong>85.4%</strong>.
          </p>
          <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700 text-xs text-slate-300 flex items-center justify-between">
            <span>Rata-rata Durasi Kemudi Pra-Istirahat:</span>
            <span className="font-bold text-white font-mono">3 Jam 42 Menit</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Rekomendasi Penjadwalan Shift & Rest Stop AI
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Prioritaskan penugasan 2 driver (co-driver) untuk perjalanan Trans Jawa di atas 600 km.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Aktifkan audio reminder rest stop in-cab 20 menit sebelum batas waktu 4 jam tercapai.</span>
            </li>
          </ul>
        </div>
      </div>

    </div>
  );
};
