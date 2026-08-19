/**
 * Fleet Intelligence Smart AI - AI Fleet Insights & Explainability Widget
 * PROMPT 8 - AI Anomaly Detection, Explainability, Recommendations & AI Quick Queries
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldAlert, 
  HelpCircle, 
  CheckCircle2, 
  MessageSquare, 
  Zap, 
  ChevronRight,
  TrendingDown,
  Info
} from 'lucide-react';
import { DashboardAIInsight } from '../../types/dashboard';

interface AIFleetInsightsWidgetProps {
  insights: DashboardAIInsight[] | null;
  isLoading: boolean;
  onExecuteAction: (route: string) => void;
  onOpenAiAssistant: (initialQuery?: string) => void;
}

export const AIFleetInsightsWidget: React.FC<AIFleetInsightsWidgetProps> = ({
  insights,
  isLoading,
  onExecuteAction,
  onOpenAiAssistant,
}) => {
  const [selectedInsightId, setSelectedInsightId] = useState<string | null>(insights?.[0]?.id || null);

  if (isLoading || !insights || insights.length === 0) {
    return (
      <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/80 p-5 space-y-4 animate-pulse h-80">
        <div className="h-4 w-1/3 bg-slate-800 rounded" />
        <div className="h-32 bg-slate-800 rounded-xl" />
        <div className="h-24 bg-slate-800 rounded-xl" />
      </div>
    );
  }

  const activeInsight = insights.find((ins) => ins.id === selectedInsightId) || insights[0];

  const quickQueries = [
    'Berapa kendaraan yang offline saat ini?',
    'Kenapa fuel cost naik minggu ini?',
    'Fleet mana paling efisien?',
    'Driver mana yang perlu perhatian?',
    'Kendaraan mana yang akan maintenance?',
    'Apa risiko operasional minggu ini?',
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-black text-rose-400 border border-rose-500/30">CRITICAL</span>;
      case 'HIGH':
        return <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-black text-amber-400 border border-amber-500/30">HIGH</span>;
      case 'MEDIUM':
        return <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px] font-black text-cyan-400 border border-cyan-500/30">MEDIUM</span>;
      case 'OPPORTUNITY':
        return <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black text-emerald-400 border border-emerald-500/30">OPPORTUNITY</span>;
      default:
        return <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-black text-slate-300">LOW</span>;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 p-5 shadow-2xl space-y-5">
      {/* Background Decorative Gradient Glow */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      {/* Widget Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/20">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-cyan-300">✦ AI Fleet Intelligence Insights</h2>
              <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-500/20">
                4 Rekomendasi Terdeteksi
              </span>
            </div>
            <p className="text-xs text-slate-400">Analisis prediktif, deteksi anomali BBM & rekomendasi tindakan otomatis</p>
          </div>
        </div>

        <button
          onClick={() => onOpenAiAssistant()}
          className="flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-4 py-2 text-xs font-bold text-slate-950 transition-all shadow-lg shadow-cyan-500/20 active:scale-95 shrink-0"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Tanya AI Assistant</span>
        </button>
      </div>

      {/* Main Two Column Section: Insight Selector & Explainability Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Insight Tabs / Selector List */}
        <div className="lg:col-span-5 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Daftar Rekomendasi AI</p>
          {insights.map((ins, idx) => (
            <button
              key={ins.id}
              onClick={() => setSelectedInsightId(ins.id)}
              className={`flex w-full flex-col gap-1.5 rounded-xl border p-3 text-left transition-all ${
                ins.id === activeInsight.id
                  ? 'border-cyan-500/60 bg-cyan-950/40 text-white shadow-lg shadow-cyan-500/10'
                  : 'border-slate-800/80 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400">0{idx + 1}.</span>
                  {ins.title}
                </span>
                {getPriorityBadge(ins.priority)}
              </div>
              <p className="text-[11px] text-slate-300 line-clamp-2">{ins.finding}</p>
            </button>
          ))}
        </div>

        {/* Active Insight Explainability & Action Detail Box */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-4">
          <div className="space-y-3">
            {/* Header / Finding */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-2">
                {getPriorityBadge(activeInsight.priority)}
                <h3 className="text-sm font-black text-white">{activeInsight.title}</h3>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                AI Confidence: {activeInsight.confidencePercent}%
              </span>
            </div>

            {/* Structured AI Explainability */}
            <div className="space-y-2.5 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                  <Info className="h-3 w-3 text-cyan-400" /> Finding (Temuan)
                </span>
                <p className="text-slate-200 font-medium bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                  {activeInsight.finding}
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                  <HelpCircle className="h-3 w-3 text-amber-400" /> Evidence (Bukti Telemetri)
                </span>
                <p className="text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                  {activeInsight.evidence}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                    <TrendingDown className="h-3 w-3 text-rose-400" /> Potential Impact
                  </span>
                  <div className="text-amber-300 font-bold bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                    {activeInsight.potentialImpactText}
                  </div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" /> Recommendation
                  </span>
                  <div className="text-slate-200 font-medium bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                    {activeInsight.recommendation}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTA Button */}
          <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-[10px] text-slate-400 italic">
              AI insights are recommendations and should be validated by fleet personnel.
            </span>
            <button
              onClick={() => onExecuteAction(activeInsight.actionRoute)}
              className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-4 py-2 text-xs font-bold text-slate-950 transition-all shadow-md shadow-cyan-500/20 active:scale-95 shrink-0"
            >
              <span>{activeInsight.actionLabel}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* AI Quick Query Shortcuts Bar */}
      <div className="pt-2 border-t border-slate-800/80 space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
          <Zap className="h-3 w-3 text-cyan-400" /> Pertanyaan Cepat AI (Dashboard Quick Query)
        </p>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {quickQueries.map((query, i) => (
            <button
              key={i}
              onClick={() => onOpenAiAssistant(query)}
              className="shrink-0 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 text-xs text-slate-300 font-medium transition-all hover:border-cyan-500/40 hover:text-white"
            >
              {query}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
