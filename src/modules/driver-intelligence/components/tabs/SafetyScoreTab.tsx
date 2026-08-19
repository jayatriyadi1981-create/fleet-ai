/**
 * Driver Intelligence - Safety Score Tab
 * Deep dive into weighted safety score math, score distribution, and formula explainability
 * PROMPT 21 Architecture
 */

import React, { useState } from 'react';
import { driverSafetyScoreService } from '../../services/driverSafetyScoreService';
import { behaviorStore } from '../../services/behaviorStore';
import { ScorePeriod } from '../../types';
import {
  ShieldCheck,
  PieChart,
  BarChart3,
  Sliders,
  Calendar,
  Layers,
  Award,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';

interface SafetyScoreTabProps {
  onOpenRulesModal: () => void;
}

export const SafetyScoreTab: React.FC<SafetyScoreTabProps> = ({ onOpenRulesModal }) => {
  const [period, setPeriod] = useState<ScorePeriod>('30_DAYS');
  const config = driverSafetyScoreService.getConfig();
  const summaries = behaviorStore.getSummaries();

  const excellentCount = summaries.filter((s) => s.score >= 90).length;
  const goodCount = summaries.filter((s) => s.score >= 80 && s.score < 90).length;
  const fairCount = summaries.filter((s) => s.score >= 70 && s.score < 80).length;
  const needsAttnCount = summaries.filter((s) => s.score >= 60 && s.score < 70).length;
  const highRiskCount = summaries.filter((s) => s.score < 60).length;

  return (
    <div className="space-y-6">
      {/* Header & Period Switcher */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white">Driver Safety Score Analytics & Formula</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Model kalkulasi skor keselamatan berkendara terbobot berbasis normalisasi jarak 100 km
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Period Selection */}
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs font-semibold text-slate-400">
            {[
              { id: 'TODAY', label: 'Hari Ini' },
              { id: '7_DAYS', label: '7 Hari' },
              { id: '30_DAYS', label: '30 Hari' },
              { id: '90_DAYS', label: '90 Hari' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  period === p.id ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenRulesModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800 text-xs font-bold transition-all"
          >
            <Sliders className="h-4 w-4 text-cyan-400" /> Atur Bobot Formula
          </button>
        </div>
      </div>

      {/* Score Distribution Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'EXCELLENT (90-100)', count: excellentCount, color: 'text-emerald-400', border: 'border-emerald-500/30' },
          { label: 'GOOD (80-89)', count: goodCount, color: 'text-cyan-400', border: 'border-cyan-500/30' },
          { label: 'FAIR (70-79)', count: fairCount, color: 'text-yellow-400', border: 'border-yellow-500/30' },
          { label: 'NEEDS ATTENTION (60-69)', count: needsAttnCount, color: 'text-amber-400', border: 'border-amber-500/30' },
          { label: 'HIGH RISK (< 60)', count: highRiskCount, color: 'text-rose-400', border: 'border-rose-500/30' },
        ].map((cat, idx) => (
          <div key={idx} className={`rounded-2xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md space-y-1 ${cat.border}`}>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{cat.label}</span>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-extrabold ${cat.color}`}>{cat.count}</span>
              <span className="text-xs text-slate-400 font-semibold">pengemudi</span>
            </div>
          </div>
        ))}
      </div>

      {/* Formula Transparency & Weights Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieChart className="h-4 w-4 text-cyan-400" /> Bobot Komponen Penilaian (Weights Matrix)
            </h3>
            <span className="text-[10px] font-mono text-cyan-400">100% EXPOSURE-NORMALIZED</span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Overspeed (Batas Kecepatan)', weight: config.weights.overspeed, color: 'bg-rose-500' },
              { label: 'Harsh Braking (Rem Mendadak)', weight: config.weights.harshBraking, color: 'bg-amber-500' },
              { label: 'Route Deviation (Deviasi Rute)', weight: config.weights.routeDeviation, color: 'bg-purple-500' },
              { label: 'Harsh Acceleration (Gas Mendadak)', weight: config.weights.harshAcceleration, color: 'bg-yellow-500' },
              { label: 'Sharp Turn (Belokan Tajam)', weight: config.weights.sharpTurn, color: 'bg-cyan-500' },
              { label: 'Excessive Idle (Mesin Stasioner)', weight: config.weights.excessiveIdle, color: 'bg-blue-500' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{item.label}</span>
                  <span className="text-cyan-400 font-mono font-bold">{Math.round(item.weight * 100)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div style={{ width: `${item.weight * 100}%` }} className={`h-full ${item.color} rounded-full`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Math & Normalization Explanation */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-cyan-400" /> Penjelasan Metodologi & Normalisasi
            </h3>
            <span className="text-[10px] font-mono text-slate-400">FAIR EXPOSURE STANDARD</span>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-white block">1. Normalisasi Per 100 KM (Events / 100 KM)</span>
              <p className="text-slate-400">
                Sistem tidak langsung mengurangi poin berdasarkan jumlah event absolut. Driver dengan jarak tempuh 10,000 km tidak diperlakukan sama dengan driver jarak 100 km. Jumlah event dihitung secara rasional per 100 km perjalanan.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-white block">2. Faktor Pengali Severity (Weighted Penalty)</span>
              <p className="text-slate-400">
                Insiden <strong className="text-rose-400">CRITICAL</strong> berbobot 3.0x, <strong className="text-amber-400">HIGH</strong> berbobot 2.0x, dan <strong className="text-yellow-400">MEDIUM</strong> berbobot 1.0x terhadap penalti poin.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-white block">3. Noise Filter & Persistence Window</span>
              <p className="text-slate-400">
                Deteksi overspeed mensyaratkan durasi minimum 5 detik kontinu untuk mencegah pembacaan palsu akibat lonjakan sinyal satelit GPS tunggal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
