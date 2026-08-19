/**
 * Fleet Intelligence Smart AI - Cost Projection & What-If Simulation View
 * PROMPT 37 - Multi-Horizon Forecast, Confidence Bounds & Interactive Simulation Engine
 */

import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Sliders,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Percent,
  RefreshCw,
  Fuel,
  Wrench,
  Navigation,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { useCost } from '../../context/CostContext';
import { CostCalculationEngine } from '../../engines/CostCalculationEngine';
import { WhatIfCostSimulationInput } from '../../types';

export const CostForecastView: React.FC = () => {
  const { forecastResults, runWhatIfSimulation, whatIfResult } = useCost();

  // What-If Simulation State
  const [simulationInput, setSimulationInput] = useState<WhatIfCostSimulationInput>({
    scenarioName: 'Optimasi Konsumsi BBM & Idle Time',
    fuelPriceChangePercent: 0,
    idleReductionPercent: 15,
    preventiveMaintenanceIncreasePercent: 10,
    correctiveReductionPercent: 20,
    routeOptimizationEfficiencyPercent: 5,
    fleetSizeDelta: 0,
  });

  // Active Simulation Result (recomputed on slider change or on load)
  const currentSimulation = useMemo(() => {
    return runWhatIfSimulation(simulationInput);
  }, [simulationInput, runWhatIfSimulation]);

  // Forecast Chart Data (Historical + Projections)
  const forecastChartData = [
    { period: 'Bulan -2', actual: 405000000, lower: 405000000, forecast: 405000000, upper: 405000000 },
    { period: 'Bulan -1', actual: 420000000, lower: 420000000, forecast: 420000000, upper: 420000000 },
    { period: 'Bulan Ini', actual: 428500000, lower: 420000000, forecast: 428500000, upper: 435000000 },
    { period: '+7 Hari', actual: null, lower: 102000000, forecast: 107000000, upper: 112000000 },
    { period: '+30 Hari', actual: null, lower: 418000000, forecast: 432000000, upper: 446000000 },
    { period: '+3 Bulan', actual: null, lower: 1260000000, forecast: 1310000000, upper: 1360000000 },
    { period: '+12 Bulan', actual: null, lower: 5100000000, forecast: 5320000000, upper: 5540000000 },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Forecast Horizons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {forecastResults.map((fc, idx) => (
          <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold text-cyan-400">{fc.periodLabel}</span>
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-bold text-white">
              {CostCalculationEngine.formatCurrencyIdr(fc.forecastAmountIdr)}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800">
              <span>Akurasi Model:</span>
              <span className="text-emerald-400 font-semibold">{fc.confidencePercent}% Confidence</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Rentang: {CostCalculationEngine.formatCurrencyIdr(fc.lowerBoundIdr)} – {CostCalculationEngine.formatCurrencyIdr(fc.upperBoundIdr)}
            </div>
          </div>
        ))}
      </div>

      {/* Projection Trend with Confidence Band */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Proyeksi Beban Biaya & Rentang Estimasi (Confidence Interval)</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Model prediksi regresi musiman & ekstrapolasi telematika konsumsi bahan bakar
            </p>
          </div>
          <span className="px-2.5 py-1 text-xs rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
            AI Seasonal Regression Engine
          </span>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastChartData.slice(0, 5)} margin={{ top: 10, right: 15, left: 15, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickFormatter={(val) => `Rp ${(val / 1000000).toFixed(0)}M`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }}
                formatter={(val: number, name: string) => [
                  val ? CostCalculationEngine.formatCurrencyIdr(val) : '-',
                  name === 'forecast' ? 'Proyeksi Beban' : name === 'upper' ? 'Batas Atas' : 'Batas Bawah',
                ]}
              />
              <Area type="monotone" dataKey="upper" stroke="none" fill="#06b6d4" fillOpacity={0.15} />
              <Area type="monotone" dataKey="forecast" stroke="#06b6d4" strokeWidth={2} fill="none" />
              <Area type="monotone" dataKey="lower" stroke="none" fill="#0f172a" fillOpacity={0.8} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Interactive What-If Cost Simulator */}
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-5 lg:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-cyan-600/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Interactive What-If Cost Simulator</h3>
              <p className="text-xs text-slate-400">
                Uji skenario efisiensi BBM, reduksi idle time, dan preventive maintenance secara instan
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              setSimulationInput({
                scenarioName: 'Reset Default',
                fuelPriceChangePercent: 0,
                idleReductionPercent: 0,
                preventiveMaintenanceIncreasePercent: 0,
                correctiveReductionPercent: 0,
                routeOptimizationEfficiencyPercent: 0,
                fleetSizeDelta: 0,
              })
            }
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Slider</span>
          </button>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Slider 1: Idle Time Reduction */}
          <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <Fuel className="w-3.5 h-3.5 text-cyan-400" />
                Reduksi Idle Time Engine
              </span>
              <span className="font-bold font-mono text-cyan-400">
                {simulationInput.idleReductionPercent}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              step={5}
              value={simulationInput.idleReductionPercent}
              onChange={(e) =>
                setSimulationInput((prev) => ({
                  ...prev,
                  idleReductionPercent: Number(e.target.value),
                }))
              }
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <p className="text-[10px] text-slate-500">Memotong pemborosan solar saat mesin menyala diam</p>
          </div>

          {/* Slider 2: Route Optimization Efficiency */}
          <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-blue-400" />
                Efisiensi Rute & Multi-Drop
              </span>
              <span className="font-bold font-mono text-blue-400">
                {simulationInput.routeOptimizationEfficiencyPercent}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={25}
              step={1}
              value={simulationInput.routeOptimizationEfficiencyPercent}
              onChange={(e) =>
                setSimulationInput((prev) => ({
                  ...prev,
                  routeOptimizationEfficiencyPercent: Number(e.target.value),
                }))
              }
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <p className="text-[10px] text-slate-500">Pengurangan kilometer kosong & jalan memutar</p>
          </div>

          {/* Slider 3: Corrective Maintenance Reduction */}
          <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-amber-400" />
                Penurunan Servis Darurat (Breakdown)
              </span>
              <span className="font-bold font-mono text-amber-400">
                {simulationInput.correctiveReductionPercent}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              step={5}
              value={simulationInput.correctiveReductionPercent}
              onChange={(e) =>
                setSimulationInput((prev) => ({
                  ...prev,
                  correctiveReductionPercent: Number(e.target.value),
                }))
              }
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <p className="text-[10px] text-slate-500">Dihasilkan dari peningkatan kepatuhan servis berkala</p>
          </div>

          {/* Slider 4: Fuel Price Fluctuation */}
          <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                Fluktuasi Harga Solar Resmi
              </span>
              <span
                className={`font-bold font-mono ${
                  simulationInput.fuelPriceChangePercent > 0
                    ? 'text-rose-400'
                    : simulationInput.fuelPriceChangePercent < 0
                    ? 'text-emerald-400'
                    : 'text-slate-400'
                }`}
              >
                {simulationInput.fuelPriceChangePercent > 0 ? '+' : ''}
                {simulationInput.fuelPriceChangePercent}%
              </span>
            </div>
            <input
              type="range"
              min={-20}
              max={20}
              step={2}
              value={simulationInput.fuelPriceChangePercent}
              onChange={(e) =>
                setSimulationInput((prev) => ({
                  ...prev,
                  fuelPriceChangePercent: Number(e.target.value),
                }))
              }
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <p className="text-[10px] text-slate-500">Sensitivitas kenaikan/penurunan harga Pertamina</p>
          </div>

          {/* Slider 5: Fleet Size Delta */}
          <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-800 space-y-2 md:col-span-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-purple-400" />
                Ekspansi / Pengurangan Armada (Unit)
              </span>
              <span className="font-bold font-mono text-purple-400">
                {simulationInput.fleetSizeDelta > 0 ? '+' : ''}
                {simulationInput.fleetSizeDelta} Unit
              </span>
            </div>
            <input
              type="range"
              min={-5}
              max={10}
              step={1}
              value={simulationInput.fleetSizeDelta}
              onChange={(e) =>
                setSimulationInput((prev) => ({
                  ...prev,
                  fleetSizeDelta: Number(e.target.value),
                }))
              }
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <p className="text-[10px] text-slate-500">Dampak penambahan unit baru terhadap belanja total</p>
          </div>
        </div>

        {/* Realtime Simulation Outcome Banner */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs text-slate-400 block">Baseline Bulanan</span>
              <span className="text-lg font-bold text-slate-300 font-mono">
                {CostCalculationEngine.formatCurrencyIdr(currentSimulation.baselineTotalCostMonthlyIdr)}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Proyeksi Setelah Skenario</span>
              <span className="text-lg font-bold text-cyan-400 font-mono">
                {CostCalculationEngine.formatCurrencyIdr(currentSimulation.projectedTotalCostMonthlyIdr)}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Potensi Hemat / Bulan</span>
              <span className="text-xl font-bold text-emerald-400 font-mono">
                {CostCalculationEngine.formatCurrencyIdr(currentSimulation.totalMonthlySavingIdr)}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Potensi Hemat / Tahun (Annual)</span>
              <span className="text-xl font-bold text-emerald-300 font-mono">
                {CostCalculationEngine.formatCurrencyIdr(currentSimulation.totalAnnualSavingIdr)}
              </span>
            </div>
          </div>

          <div className="pt-4 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
            <p className="text-xs text-slate-300 leading-relaxed">
              <span className="font-semibold text-white">Analisis AI: </span>
              {currentSimulation.aiExplanation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
