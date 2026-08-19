/**
 * Fleet Intelligence Smart AI - What-If Scenario Simulation Sandbox Modal
 * PROMPT 36 - Sections 50, 51 & AI Scenario Planning Engine
 */

import React, { useState } from 'react';
import { X, Sparkles, Play, TrendingUp, TrendingDown, ArrowRight, RotateCcw, ShieldCheck } from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';
import { WhatIfInputScenario, WhatIfSimulationResult } from '../../types';

export const WhatIfSimulationModal: React.FC = () => {
  const { isWhatIfModalOpen, setIsWhatIfModalOpen, runWhatIf } = useAnalytics();

  const [fleetSizeDelta, setFleetSizeDelta] = useState(0);
  const [shiftHoursDelta, setShiftHoursDelta] = useState(0);
  const [idleReductionPercent, setIdleReductionPercent] = useState(25);
  const [demandSurgePercent, setDemandSurgePercent] = useState(15);
  const [scenarioName, setScenarioName] = useState('Optimasi Shift Malam & Pemangkasan Idle 25%');

  const [result, setResult] = useState<WhatIfSimulationResult | null>(null);

  if (!isWhatIfModalOpen) return null;

  const handleSimulate = () => {
    const scenario: WhatIfInputScenario = {
      scenarioName,
      fleetSizeDelta,
      shiftHoursDelta,
      idleReductionPercent,
      demandSurgePercent,
    };
    const res = runWhatIf(scenario);
    if (res) {
      setResult(res);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-5 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-cyan-500/10 p-2 text-cyan-400 border border-cyan-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">AI Fleet "What-If" Scenario Simulator</h3>
              <p className="text-xs text-slate-400">
                Simulasikan dampak penambahan armada, pengurangan idle, atau lonjakan pesanan terhadap utilisasi & ROI
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsWhatIfModalOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Input Parameters Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl bg-slate-950 p-4 border border-slate-800 text-xs">
          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold text-slate-300">
              <span>Perubahan Jumlah Armada (Delta Unit):</span>
              <span className="font-bold text-cyan-400">{fleetSizeDelta > 0 ? `+${fleetSizeDelta}` : fleetSizeDelta} Unit</span>
            </div>
            <input
              type="range"
              min="-15"
              max="25"
              step="1"
              value={fleetSizeDelta}
              onChange={(e) => setFleetSizeDelta(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
            <span className="text-[10px] text-slate-500 block">Geser untuk mensimulasikan penambahan/pengurangan truk</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold text-slate-300">
              <span>Perubahan Jam Shift Operasi:</span>
              <span className="font-bold text-cyan-400">{shiftHoursDelta > 0 ? `+${shiftHoursDelta}` : shiftHoursDelta} Jam/Hari</span>
            </div>
            <input
              type="range"
              min="-3"
              max="4"
              step="0.5"
              value={shiftHoursDelta}
              onChange={(e) => setShiftHoursDelta(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
            <span className="text-[10px] text-slate-500 block">Penyesuaian jam kerja armada per hari</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold text-slate-300">
              <span>Target Pengurangan Waktu Idle:</span>
              <span className="font-bold text-amber-400">-{idleReductionPercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              step="5"
              value={idleReductionPercent}
              onChange={(e) => setIdleReductionPercent(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
            <span className="text-[10px] text-slate-500 block">Simulasi efisiensi auto-shutdown engine & rest area</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold text-slate-300">
              <span>Proyeksi Lonjakan Demand / Trip:</span>
              <span className="font-bold text-emerald-400">+{demandSurgePercent}%</span>
            </div>
            <input
              type="range"
              min="-20"
              max="60"
              step="5"
              value={demandSurgePercent}
              onChange={(e) => setDemandSurgePercent(Number(e.target.value))}
              className="w-full accent-emerald-400"
            />
            <span className="text-[10px] text-slate-500 block">Estimasi peningkatan order logistik / peak season</span>
          </div>
        </div>

        {/* Run Simulation Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSimulate}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-xs font-extrabold text-slate-950 hover:brightness-110 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Play className="h-4 w-4 fill-current" />
            <span>Kalkulasi Prediksi AI (Run Simulation)</span>
          </button>
        </div>

        {/* Results Area */}
        {result && (
          <div className="space-y-4 rounded-xl border border-cyan-500/30 bg-slate-950/80 p-5 backdrop-blur-md">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              <span>Hasil Proyeksi Skenario Simulasi:</span>
            </h4>

            {/* Before vs After Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-xl bg-slate-900 p-3 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Utilisasi Armada</span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-slate-400 line-through">78.4%</span>
                  <ArrowRight className="h-3 w-3 text-slate-500" />
                  <span className="text-base font-extrabold text-cyan-400">{result.predictedUtilizationRate}%</span>
                </div>
              </div>

              <div className="rounded-xl bg-slate-900 p-3 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Skor Produktivitas</span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-slate-400 line-through">86.2</span>
                  <ArrowRight className="h-3 w-3 text-slate-500" />
                  <span className="text-base font-extrabold text-emerald-400">{result.predictedProductivityScore}</span>
                </div>
              </div>

              <div className="rounded-xl bg-slate-900 p-3 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Estimasi Hemat BBM</span>
                <div className="mt-1">
                  <span className="text-base font-extrabold text-emerald-400">
                    Rp {Math.abs(result.estimatedMonthlyFuelCostDeltaIdr / 1000000).toFixed(1)} Jt/Bln
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-slate-900 p-3 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Dampak Revenue</span>
                <div className="mt-1">
                  <span className="text-base font-extrabold text-teal-400">
                    +Rp {(result.estimatedRevenueImpactIdr / 1000000).toFixed(1)} Jt/Bln
                  </span>
                </div>
              </div>
            </div>

            {/* AI Advice */}
            <div className="space-y-1 rounded-xl bg-cyan-950/30 p-3.5 border border-cyan-500/20 text-xs">
              <span className="font-bold text-cyan-300 block">Rekomendasi AI Terkait Skenario Ini:</span>
              <ul className="list-disc pl-4 space-y-1 text-slate-300">
                {Array.isArray(result.aiAdvice) ? (
                  result.aiAdvice.map((adv, idx) => (
                    <li key={idx}>{adv}</li>
                  ))
                ) : (
                  <li>{result.aiAdvice || 'Optimalkan jadwal shift dan redistribusi rute armada.'}</li>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-800 pt-3">
          <button
            onClick={() => setIsWhatIfModalOpen(false)}
            className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
          >
            Tutup Simulator
          </button>
        </div>
      </div>
    </div>
  );
};
