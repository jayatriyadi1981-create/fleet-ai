/**
 * Fleet Intelligence Smart AI - AI Cost Intelligence & Saving Opportunities View
 * PROMPT 37 - Anomaly Detection, Root Cause Trees, Actionable Recommendations & ROI
 */

import React, { useState } from 'react';
import {
  Zap,
  Sparkles,
  DollarSign,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Sliders,
  ChevronDown,
  ChevronUp,
  Layers,
  Fuel,
  Wrench,
  Navigation,
  Calculator,
} from 'lucide-react';
import { useCost } from '../../context/CostContext';
import { CostCalculationEngine } from '../../engines/CostCalculationEngine';

export const AICostIntelligenceView: React.FC = () => {
  const {
    aiInsights,
    savingOpportunities,
    setIsSavingCalculatorModalOpen,
  } = useCost();

  const [expandedInsightId, setExpandedInsightId] = useState<string | null>(
    aiInsights[0]?.id || null
  );

  // Total potential annual savings
  const totalAnnualSavings = savingOpportunities.reduce(
    (sum, op) => sum + op.annualSavingIdr,
    0
  );

  const totalMonthlySavings = savingOpportunities.reduce(
    (sum, op) => sum + op.monthlySavingIdr,
    0
  );

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Top Banner: Total AI Savings Potential */}
      <div className="bg-gradient-to-r from-emerald-500/15 via-cyan-500/15 to-transparent border border-emerald-500/30 rounded-2xl p-5 lg:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20 shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  AI Autonomous Cost Intelligence & Optimization Engine
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {savingOpportunities.length} Peluang Terdeteksi
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Algoritma telematika mendeteksi pemborosan bahan bakar, anomali tagihan bengkel, dan ketidakefisienan rute dengan rekomendasi tindakan nyata.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right pr-4 border-r border-slate-800">
              <span className="text-[11px] text-slate-400 block">Total Potensi Hemat / Tahun</span>
              <span className="text-xl font-extrabold text-emerald-400 font-mono">
                {CostCalculationEngine.formatCurrencyIdr(totalAnnualSavings)}
              </span>
            </div>
            <button
              onClick={() => setIsSavingCalculatorModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all"
            >
              <Calculator className="w-4 h-4" />
              <span>Kalkulator ROI Hemat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Saving Opportunities Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Peluang Penghematan Biaya Teridentifikasi</h3>
          <span className="text-xs text-slate-400">
            Estimasi total bulanan: <span className="text-emerald-400 font-bold">{CostCalculationEngine.formatCurrencyIdr(totalMonthlySavings)}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savingOpportunities.map((op) => (
            <div
              key={op.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {op.categoryLabel}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      op.priority === 'HIGH'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    Priority {op.priority}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white">{op.title}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{op.assumptions.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Potensi Hemat Bulanan:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {CostCalculationEngine.formatCurrencyIdr(op.monthlySavingIdr)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Potensi Hemat Tahunan:</span>
                  <span className="font-mono font-semibold text-white">
                    {CostCalculationEngine.formatCurrencyIdr(op.annualSavingIdr)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
                  <span>Tingkat Kesulitan: </span>
                  <span className="font-medium text-slate-300">{op.difficulty}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deep-Dive AI Anomaly Insights List */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Temuan Anomali & Rekomendasi Eksekutif</h3>
            <p className="text-xs text-slate-400">Analisis multi-faktor penyebab lonjakan biaya dan mitigasi langsung</p>
          </div>
          <span className="text-xs text-slate-400">{aiInsights.length} Temuan Aktif</span>
        </div>

        <div className="divide-y divide-slate-800">
          {aiInsights.map((insight) => {
            const isExpanded = expandedInsightId === insight.id;
            return (
              <div key={insight.id} className="p-4 hover:bg-slate-800/30 transition-colors">
                <div
                  className="flex items-start justify-between gap-4 cursor-pointer"
                  onClick={() => setExpandedInsightId(isExpanded ? null : insight.id)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        insight.severity === 'CRITICAL'
                          ? 'bg-rose-500/15 text-rose-400'
                          : insight.severity === 'HIGH'
                          ? 'bg-amber-500/15 text-amber-400'
                          : 'bg-blue-500/15 text-blue-400'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                            insight.severity === 'CRITICAL'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {insight.severity}
                        </span>
                        <h4 className="text-sm font-semibold text-white">{insight.title}</h4>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{insight.headline}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-slate-500 font-mono">{insight.createdAt}</span>
                    <button className="text-slate-400 hover:text-white p-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Insight Detail & Actionable Steps */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-4">
                    {/* Contributors & Root Causes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Contributors */}
                      <div className="bg-slate-800/40 rounded-xl p-3.5 border border-slate-800">
                        <h5 className="text-xs font-semibold text-slate-300 mb-2">Faktor Kontributor Biaya:</h5>
                        <div className="space-y-2">
                          {insight.mainContributors.map((c, idx) => (
                            <div key={idx} className="text-xs">
                              <div className="flex justify-between text-slate-300 mb-0.5">
                                <span>{c.factor}</span>
                                <span className="font-mono text-cyan-400">{c.percentageContribution}% ({CostCalculationEngine.formatCurrencyIdr(c.amountIdr)})</span>
                              </div>
                              <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className="bg-cyan-500 h-full rounded-full"
                                  style={{ width: `${c.percentageContribution}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Root causes */}
                      <div className="bg-slate-800/40 rounded-xl p-3.5 border border-slate-800">
                        <h5 className="text-xs font-semibold text-slate-300 mb-2">Akar Masalah (Root Causes):</h5>
                        <ul className="space-y-1.5 text-xs text-slate-400 list-disc list-inside">
                          {insight.rootCauses.map((rc, idx) => (
                            <li key={idx} className="leading-relaxed">
                              <span className="text-slate-300">{rc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Actionable Recommendations */}
                    <div className="bg-slate-950/60 rounded-xl p-4 border border-cyan-500/20">
                      <h5 className="text-xs font-semibold text-cyan-400 mb-3 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        Rekomendasi Tindakan Korektif:
                      </h5>

                      <div className="space-y-2.5">
                        {insight.recommendations.map((rec) => (
                          <div
                            key={rec.id}
                            className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400">
                                  Priority {rec.priority}
                                </span>
                                <span className="text-xs font-semibold text-white">{rec.action}</span>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-1">{rec.calculationBasis}</p>
                            </div>

                            <div className="flex items-center gap-4 shrink-0">
                              <div className="text-right">
                                <span className="text-[10px] text-slate-400 block">Potensi Hemat</span>
                                <span className="text-xs font-bold text-emerald-400 font-mono">
                                  {CostCalculationEngine.formatCurrencyIdr(rec.potentialSavingMonthlyIdr)} / Bulan
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
