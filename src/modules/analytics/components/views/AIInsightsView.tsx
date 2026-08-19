/**
 * Fleet Intelligence Smart AI - AI Analytics Intelligence & Anomaly Engine View
 * PROMPT 36 - Sections 45, 46, 47, 48, 49, 50, 51 & AI Automation Bridges
 */

import React, { useState } from 'react';
import {
  Sparkles,
  AlertTriangle,
  Zap,
  TrendingDown,
  ArrowRight,
  ShieldAlert,
  Play,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';
import { AnalyticsInsight, InsightSeverity } from '../../types';

export const AIInsightsView: React.FC = () => {
  const { insights, setIsWhatIfModalOpen, setSelectedInsightForAutomation, setIsAutomationModalOpen } = useAnalytics();
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  const filteredInsights = insights.filter((ins) => {
    if (severityFilter === 'ALL') return true;
    return ins.severity === severityFilter;
  });

  const criticalCount = insights.filter((i) => i.severity === 'CRITICAL').length;
  const warningCount = insights.filter((i) => i.severity === 'WARNING').length;
  const oppCount = insights.filter((i) => i.severity === 'OPPORTUNITY').length;

  const handleTriggerAutomation = (insight: AnalyticsInsight) => {
    setSelectedInsightForAutomation(insight);
    setIsAutomationModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Trigger */}
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 p-5 backdrop-blur-md space-y-4 shadow-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-cyan-500/20 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-400" />
              <span>AI Fleet Intelligence, Anomaly Center & Decision Recommendations</span>
            </h2>
            <p className="text-xs text-slate-300">
              Deteksi anomali operasional otomatis, diagnosa akar masalah (Root Cause), dan eksekusi otomasi cerdas (PROMPT 35).
            </p>
          </div>

          <button
            onClick={() => setIsWhatIfModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20 self-start lg:self-auto"
          >
            <Play className="h-4 w-4 fill-current" />
            <span>Buka Simulasi What-If</span>
          </button>
        </div>

        {/* Severity Badges & Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Status Anomali:</span>
            <span className="rounded-lg bg-rose-500/10 px-2.5 py-1 font-bold text-rose-400 border border-rose-500/20">
              {criticalCount} Kritis (Critical)
            </span>
            <span className="rounded-lg bg-amber-500/10 px-2.5 py-1 font-bold text-amber-400 border border-amber-500/20">
              {warningCount} Peringatan (Warning)
            </span>
            <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 font-bold text-emerald-400 border border-emerald-500/20">
              {oppCount} Peluang Efisiensi
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="ALL">Semua Tingkat Keparahan</option>
              <option value="CRITICAL">Hanya Kritis (Critical)</option>
              <option value="WARNING">Hanya Peringatan (Warning)</option>
              <option value="OPPORTUNITY">Hanya Peluang (Opportunity)</option>
              <option value="INFO">Hanya Informasi (Info)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Anomaly Insight Cards */}
      <div className="space-y-4">
        {filteredInsights.map((insight) => {
          let cardBorder = 'border-slate-800 bg-slate-900/80';
          let badgeClass = 'bg-slate-800 text-slate-300';
          let icon = AlertTriangle;

          if (insight.severity === 'CRITICAL') {
            cardBorder = 'border-rose-500/30 bg-gradient-to-r from-slate-900 to-rose-950/20';
            badgeClass = 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
          } else if (insight.severity === 'WARNING') {
            cardBorder = 'border-amber-500/30 bg-gradient-to-r from-slate-900 to-amber-950/20';
            badgeClass = 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
          } else if (insight.severity === 'OPPORTUNITY') {
            cardBorder = 'border-emerald-500/30 bg-gradient-to-r from-slate-900 to-emerald-950/20';
            badgeClass = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
            icon = Sparkles;
          }

          const IconComponent = icon;

          return (
            <div
              key={insight.id}
              className={`rounded-2xl border p-5 backdrop-blur-md space-y-4 shadow-xl transition-all ${cardBorder}`}
            >
              {/* Card Header */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-xl p-2 bg-slate-950 border border-slate-800">
                    <IconComponent className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Kategori: {insight.category} • Confidence: {Math.round(insight.confidenceScore * 100)}%
                    </span>
                    <h3 className="text-base font-bold text-white">{insight.title}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${badgeClass}`}>
                    {insight.severity}
                  </span>
                </div>
              </div>

              {/* Description & Root Cause */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 text-xs">
                <div className="lg:col-span-2 space-y-2">
                  <div>
                    <span className="text-slate-400 font-semibold block mb-0.5">Uraian Temuan:</span>
                    <p className="text-slate-200 leading-relaxed">{insight.description}</p>
                  </div>

                  {insight.rootCause && (
                    <div className="rounded-xl bg-slate-950/70 p-3 border border-slate-800 space-y-1">
                      <span className="font-bold text-cyan-400 block">Diagnosa Akar Masalah (Root Cause):</span>
                      <p className="text-slate-300 leading-relaxed">{insight.rootCause}</p>
                    </div>
                  )}
                </div>

                {/* Evidence Metrics & Target */}
                <div className="rounded-xl bg-slate-950/70 p-3 border border-slate-800 space-y-2">
                  <span className="font-bold text-slate-300 block">Metrik Terdeteksi:</span>
                  <div className="space-y-1 text-slate-300">
                    {insight.detectedMetric && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Terukur:</span>
                        <span className="font-bold text-white">{insight.detectedMetric.value} {insight.detectedMetric.unit}</span>
                      </div>
                    )}
                    {insight.detectedMetric?.baseline && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Standar / Baseline:</span>
                        <span className="text-slate-300">{insight.detectedMetric.baseline} {insight.detectedMetric.unit}</span>
                      </div>
                    )}
                    {insight.financialImpactEstimate && (
                      <div className="flex justify-between border-t border-slate-800 pt-1 text-rose-400 font-semibold">
                        <span>Dampak Finansial:</span>
                        <span>{insight.financialImpactEstimate}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recommended Action & Trigger Button */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-slate-950/90 p-3 border border-cyan-500/20 text-xs">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-400 flex-shrink-0" />
                  <span className="text-slate-200">
                    <strong className="text-cyan-400">Rekomendasi AI:</strong> {insight.actionRecommendation}
                  </span>
                </div>

                <button
                  onClick={() => handleTriggerAutomation(insight)}
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-3.5 py-1.5 font-bold text-slate-950 hover:brightness-110 shadow-sm transition-all whitespace-nowrap"
                >
                  <Zap className="h-3.5 w-3.5 fill-current" />
                  <span>Jalankan Otomasi Smart AI</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
