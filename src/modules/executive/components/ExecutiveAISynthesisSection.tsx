/**
 * Fleet Intelligence Smart AI - Executive AI Synthesis & Savings Section
 * PROMPT 38 - C-Level AI Executive Summary, Evidence-Based Insights, Saving Opportunities & Decision Action Center
 */

import React, { useState } from 'react';
import { useExecutive } from '../context/ExecutiveContext';
import { useFleet } from '../../../context/FleetContext';
import {
  Sparkles,
  DollarSign,
  TrendingDown,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Info,
  Calendar,
  Layers,
  ChevronRight,
  FileCheck,
  CheckSquare,
  Clock,
  UserCheck,
} from 'lucide-react';
import { AIExecutiveInsight, ExecutiveSavingOpportunity, ExecutiveDecisionItem } from '../types';

export const ExecutiveAISynthesisSection: React.FC = () => {
  const {
    aiSummary,
    insights,
    savingOpportunities,
    decisionItems,
    setSelectedInsightForExplanation,
    setSelectedDecisionForAction,
    handleResolveDecision,
  } = useExecutive();

  const [activeTab, setActiveTab] = useState<'insights' | 'savings' | 'decisions'>('insights');

  const formatIdr = (num: number) => {
    return 'Rp ' + Math.round(num).toLocaleString('id-ID');
  };

  const totalSavingPotential = savingOpportunities.reduce((acc, s) => acc + s.estimatedMonthlySavingIdr, 0);

  return (
    <div className="space-y-6">
      {/* 1. Main AI Executive Summary Card */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white border border-indigo-500/30 shadow-xl relative overflow-hidden">
        {/* Glow effect in background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/20 border border-indigo-400/30 rounded-xl">
                <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  AI Executive Intelligence Brief
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                    Confidence: {aiSummary.confidenceScore}%
                  </span>
                </h3>
                <p className="text-xs text-indigo-200/70 mt-0.5">
                  Sintesis otomatis berbasis multi-domain telematika, akuntansi biaya armada, dan skor kepatuhan pengemudi.
                </p>
              </div>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Diperbarui: {new Date(aiSummary.generatedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</span>
            </div>
          </div>

          {/* Executive Headline & Business Impact */}
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="p-4 rounded-xl bg-indigo-900/40 border border-indigo-400/20">
                <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider block mb-1">
                  Executive Headline
                </span>
                <p className="text-base font-semibold text-slate-100 leading-relaxed">
                  {aiSummary.executiveHeadline}
                </p>
              </div>

              {/* Key Findings List */}
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
                  Temuan Kunci Operasional & Finansial (Key Findings)
                </span>
                <div className="space-y-2">
                  {aiSummary.keyFindings.map((finding, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 text-xs text-slate-200 bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/50"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="leading-normal">{finding}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Business Impact & Recommended Actions */}
            <div className="flex flex-col justify-between p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div>
                <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider block mb-2">
                  Dampak Bisnis & Proyeksi Finansial
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {aiSummary.businessImpactSummary}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-700/60">
                  <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider block mb-2">
                    Langkah Prioritas Direksi
                  </span>
                  <ul className="space-y-2">
                    {aiSummary.recommendedActions.slice(0, 3).map((act, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <ArrowRight className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Total Monthly Savings Highlight Banner */}
              <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-emerald-950 to-emerald-900 border border-emerald-500/40 flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-300 font-semibold block">Total Potensi Penghematan</span>
                  <span className="text-lg font-black text-white">{formatIdr(totalSavingPotential)} / bln</span>
                </div>
                <span className="px-2.5 py-1 text-xs font-bold bg-emerald-500 text-slate-950 rounded-md">
                  4 Inisiatif
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Tabbed Navigation: AI Insights, Saving Opportunities, Decision Action Center */}
      <div className="bg-white rounded-2xl p-5 lg:p-6 border border-slate-200/80 shadow-sm">
        {/* Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'insights'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              Prioritized Executive Insights ({insights.length})
            </button>
            <button
              onClick={() => setActiveTab('savings')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'savings'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              Cost Saving Opportunities ({savingOpportunities.length})
            </button>
            <button
              onClick={() => setActiveTab('decisions')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'decisions'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              Executive Decision Center ({decisionItems.filter((d) => d.status === 'OPEN').length} Open)
            </button>
          </div>
        </div>

        {/* Tab 1: AI Insights */}
        {activeTab === 'insights' && (
          <div className="mt-5 space-y-3.5">
            {insights.map((ins) => {
              const isCritical = ins.priority === 'CRITICAL';
              const isHigh = ins.priority === 'HIGH';

              return (
                <div
                  key={ins.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isCritical
                      ? 'bg-red-50/50 border-red-200 hover:border-red-300'
                      : isHigh
                      ? 'bg-amber-50/50 border-amber-200 hover:border-amber-300'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            isCritical
                              ? 'bg-red-100 text-red-700 border border-red-300'
                              : isHigh
                              ? 'bg-amber-100 text-amber-700 border border-amber-300'
                              : 'bg-blue-100 text-blue-700 border border-blue-300'
                          }`}
                        >
                          {ins.priority} PRIORITY
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200/80 text-slate-700">
                          {ins.category}
                        </span>
                        <span className="text-xs text-slate-500">
                          Confidence: <strong className="text-slate-800">{ins.confidencePct}%</strong>
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">
                        {ins.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {ins.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-slate-700 pt-1">
                        <div>
                          <span className="text-slate-500">Estimasi Dampak: </span>
                          <strong className="text-red-600">{formatIdr(ins.estimatedFinancialImpactIdr)}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500">Periode: </span>
                          <strong>{ins.period}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center lg:flex-col gap-2 justify-end">
                      <button
                        id={`explain-insight-${ins.id}`}
                        onClick={() => setSelectedInsightForExplanation(ins)}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <Info className="w-3.5 h-3.5 text-blue-600" />
                        <span>Lihat Bukti & Audit</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Saving Opportunities */}
        {activeTab === 'savings' && (
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {savingOpportunities.map((sav) => (
              <div
                key={sav.id}
                className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 flex flex-col justify-between hover:shadow-sm transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {sav.category.replace('_', ' ')}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        sav.difficulty === 'EASY'
                          ? 'bg-blue-100 text-blue-700'
                          : sav.difficulty === 'MODERATE'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      Implementasi: {sav.difficulty}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mb-1">
                    {sav.title}
                  </h4>
                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    {sav.description}
                  </p>

                  <div className="space-y-1 bg-white p-2.5 rounded-lg border border-emerald-100 text-xs text-slate-700 mb-3">
                    <span className="font-semibold text-slate-500 block mb-1">Asumsi Perhitungan:</span>
                    {sav.assumptions.map((asmp, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>{asmp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-emerald-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block">Proyeksi Penghematan:</span>
                    <span className="text-base font-black text-emerald-700">
                      {formatIdr(sav.estimatedMonthlySavingIdr)} <span className="text-xs font-medium text-slate-500">/ bulan</span>
                    </span>
                  </div>
                  <button
                    onClick={() => alert(`Inisiatif '${sav.title}' telah dimasukkan ke dalam Pipeline Program Efisiensi Armada 2026.`)}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm"
                  >
                    Terapkan SOP
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Executive Decision Center */}
        {activeTab === 'decisions' && (
          <div className="mt-5 space-y-3">
            {decisionItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${
                        item.priority === 'CRITICAL'
                          ? 'bg-red-100 text-red-700'
                          : item.priority === 'HIGH'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {item.priority}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      PIC: <strong className="text-slate-800">{item.assignedOwner}</strong>
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        item.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-700'
                          : item.status === 'IN_PROGRESS'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600">
                    <strong className="text-slate-700">Isu: </strong> {item.issue}
                  </p>
                  <p className="text-xs text-indigo-700 bg-indigo-50 p-2 rounded border border-indigo-100">
                    <strong className="text-indigo-900">Rekomendasi AI: </strong> {item.recommendation}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 justify-end flex-wrap">
                  {item.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleResolveDecision(item.id)}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Selesaikan</span>
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedDecisionForAction(item)}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all shadow-sm flex items-center gap-1"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Delegasikan Tugas</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
