/**
 * Fleet Intelligence Smart AI - Cross Intelligence Correlation Tab
 * Correlates Route Intelligence with:
 * 1. Fuel Intelligence (traffic congestion fuel penalties, uphill vs flat terrain)
 * 2. Driver Behavior (harsh braking on complex routes, speeding on open highways)
 * 3. Maintenance Intelligence (vehicle suitability, radiator/brake thermal stress on mountain routes)
 */

import React from 'react';
import { 
  Fuel, 
  UserCheck, 
  Wrench, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const CrossIntelligenceTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Korelasi Lintas Modul Fleet Intelligence Smart AI</h3>
            <p className="text-xs text-slate-400">
              Menghubungkan data telematika rute dengan konsumsi BBM, perilaku supir, dan kesiapan armada.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Route vs Fuel Intelligence */}
        <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Fuel className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Rute ➔ Fuel Intelligence</h4>
              <span className="text-[11px] text-slate-400">Dampak Kemacetan & Elevasi</span>
            </div>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Penalti BBM Kemacetan:</span>
              <strong className="text-rose-400 font-mono">+18.4% BBM</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Konsumsi Tol vs Arteri:</span>
              <strong className="text-emerald-400 font-mono">1:4.2 vs 1:3.4 km/L</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Efisiensi Rute Terpilih:</span>
              <strong className="text-cyan-300 font-mono">92.4% Optimal</strong>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            AI mendeteksi pengalihan rute Tol MBZ berhasil memangkas idling stop-and-go di ruas Cikunir, menghemat rata-rata 3.2 Liter solar per unit tronton.
          </p>
        </div>

        {/* Route vs Driver Behavior */}
        <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <UserCheck className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Rute ➔ Driver Behavior</h4>
              <span className="text-[11px] text-slate-400">Tingkat Kesulitan Medan Rute</span>
            </div>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Harsh Braking di Arteri:</span>
              <strong className="text-amber-400 font-mono">4.2x vs Jalan Tol</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Speeding di Trans Jawa:</span>
              <strong className="text-slate-200 font-mono">2 Insiden Terdeteksi</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Skor Safety Driver Koridor:</span>
              <strong className="text-emerald-400 font-mono">88.5/100</strong>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Pengemudi yang melintasi jalur alternatif Arteri Kalimalang mengalami peningkatan pengereman mendadak karena kondisi persimpangan jalan lokal yang padat.
          </p>
        </div>

        {/* Route vs Maintenance Intelligence */}
        <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Wrench className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Rute ➔ Maintenance Intelligence</h4>
              <span className="text-[11px] text-slate-400">Kesesuaian Armada & Beban Panas</span>
            </div>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Beban Pendingin Cipularang:</span>
              <strong className="text-rose-400 font-mono">+12°C Temp Coolant</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Unit Risiko Tinggi Terdeteksi:</span>
              <strong className="text-rose-400 font-mono">B 9012 GH (Radiator)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Rekomendasi Penugasan:</span>
              <strong className="text-amber-300 font-mono">Intra-Kota Only</strong>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Unit dengan skor Predictive Maintenance risiko tinggi dilarang ditugaskan ke rute menanjak tol Cipularang untuk mencegah mogok mendadak di jalan raya.
          </p>
        </div>
      </div>
    </div>
  );
};
