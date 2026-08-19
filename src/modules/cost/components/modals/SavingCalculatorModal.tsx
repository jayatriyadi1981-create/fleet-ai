/**
 * Fleet Intelligence Smart AI - AI Cost Saving ROI Calculator Modal
 * PROMPT 37 - Interactive Fleet Optimization & Financial Return on Investment Calculator
 */

import React, { useState, useMemo } from 'react';
import { X, Calculator, DollarSign, Sparkles, Fuel, TrendingDown, Check, Zap } from 'lucide-react';
import { useCost } from '../../context/CostContext';
import { CostCalculationEngine } from '../../engines/CostCalculationEngine';

export const SavingCalculatorModal: React.FC = () => {
  const { isSavingCalculatorModalOpen, setIsSavingCalculatorModalOpen } = useCost();

  // Calculator Parameters
  const [activeVehicles, setActiveVehicles] = useState<number>(24);
  const [currentIdleHoursPerDay, setCurrentIdleHoursPerDay] = useState<number>(2.5);
  const [targetIdleReductionPct, setTargetIdleReductionPct] = useState<number>(30);
  const [fuelPricePerLiter, setFuelPricePerLiter] = useState<number>(6800); // Biosolar
  const [routeOptimizationPct, setRouteOptimizationPct] = useState<number>(5);

  if (!isSavingCalculatorModalOpen) return null;

  // Real-time calculation math
  const calculations = useMemo(() => {
    // 1 hour of truck idle consumes ~2.2 liters of diesel
    const idleLitersPerHour = 2.2;
    const workingDaysPerMonth = 26;

    const currentMonthlyIdleLitersPerVehicle = currentIdleHoursPerDay * idleLitersPerHour * workingDaysPerMonth;
    const totalFleetIdleLitersMonthly = currentMonthlyIdleLitersPerVehicle * activeVehicles;

    const savedIdleLitersMonthly = totalFleetIdleLitersMonthly * (targetIdleReductionPct / 100);
    const savedIdleCostMonthly = savedIdleLitersMonthly * fuelPricePerLiter;

    // Route optimization savings (baseline monthly fleet fuel: ~184.5M IDR)
    const baselineMonthlyFuelIdr = 184500000;
    const routeSavedFuelMonthly = baselineMonthlyFuelIdr * (routeOptimizationPct / 100);

    const totalMonthlySavingIdr = savedIdleCostMonthly + routeSavedFuelMonthly;
    const totalAnnualSavingIdr = totalMonthlySavingIdr * 12;

    // CO2 reduction (1 liter diesel = ~2.68 kg CO2)
    const co2SavedKgMonthly = (savedIdleLitersMonthly + routeSavedFuelMonthly / fuelPricePerLiter) * 2.68;

    return {
      savedIdleLitersMonthly: Math.round(savedIdleLitersMonthly),
      savedIdleCostMonthly,
      routeSavedFuelMonthly,
      totalMonthlySavingIdr,
      totalAnnualSavingIdr,
      co2SavedKgMonthly: Math.round(co2SavedKgMonthly),
    };
  }, [activeVehicles, currentIdleHoursPerDay, targetIdleReductionPct, fuelPricePerLiter, routeOptimizationPct]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Kalkulator Penghematan Operasional AI</h3>
              <p className="text-[11px] text-slate-400">Simulasi potensi return on investment dan efisiensi belanja</p>
            </div>
          </div>
          <button
            onClick={() => setIsSavingCalculatorModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Calculator Body */}
        <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Input Controls */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Jumlah Armada Beroperasi
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={activeVehicles}
                onChange={(e) => setActiveVehicles(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Harga Solar Resmi (Rp / Liter)
              </label>
              <input
                type="number"
                min="1000"
                step="100"
                value={fuelPricePerLiter}
                onChange={(e) => setFuelPricePerLiter(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Rata-rata Idle Time (Jam / Hari)
              </label>
              <input
                type="number"
                min="0.5"
                max="10"
                step="0.5"
                value={currentIdleHoursPerDay}
                onChange={(e) => setCurrentIdleHoursPerDay(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Reduksi Idle (%)
              </label>
              <input
                type="number"
                min="5"
                max="80"
                step="5"
                value={targetIdleReductionPct}
                onChange={(e) => setTargetIdleReductionPct(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono text-cyan-400 font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-300">Efisiensi Rute & Pemotongan KM Kosong (%)</span>
              <span className="font-mono text-emerald-400 font-bold">{routeOptimizationPct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={routeOptimizationPct}
              onChange={(e) => setRouteOptimizationPct(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Real-time Calculation Result Box */}
          <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              <span>Hasil Estimasi Penghematan Finansial</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Penghematan / Bulan</span>
                <span className="text-lg font-bold text-emerald-400 font-mono">
                  {CostCalculationEngine.formatCurrencyIdr(calculations.totalMonthlySavingIdr)}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  ({calculations.savedIdleLitersMonthly.toLocaleString()} Liter Solar / bln)
                </span>
              </div>

              <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Penghematan / Tahun (Annual)</span>
                <span className="text-lg font-bold text-emerald-300 font-mono">
                  {CostCalculationEngine.formatCurrencyIdr(calculations.totalAnnualSavingIdr)}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Reduksi Emisi: {calculations.co2SavedKgMonthly.toLocaleString()} Kg CO2
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end gap-3">
          <button
            onClick={() => setIsSavingCalculatorModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
