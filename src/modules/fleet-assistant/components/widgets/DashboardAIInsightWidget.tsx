/**
 * Fleet Intelligence Smart AI - Dashboard AI Insight Widget (Prompt 34 - Section 73)
 * Prominently surfaces proactive insights on the Executive Dashboard and provides
 * one-click conversational jump to the full AI Fleet Assistant.
 */

import React from 'react';
import { Sparkles, ArrowRight, ShieldAlert, MessageSquare, ChevronRight, Zap, CheckCircle2 } from 'lucide-react';
import { useFleet, ActiveView } from '../../../../context/FleetContext';
import { FleetProactiveInsightEngine } from '../../engines/FleetProactiveInsightEngine';

interface DashboardAIInsightWidgetProps {
  onOpenAssistant?: (initialQuery?: string) => void;
}

export const DashboardAIInsightWidget: React.FC<DashboardAIInsightWidgetProps> = ({
  onOpenAssistant,
}) => {
  const { setActiveView, vehicles, alerts } = useFleet();
  const summary = FleetProactiveInsightEngine.getDashboardInsightSummary(vehicles, alerts);

  const handleOpenAI = (query?: string) => {
    if (onOpenAssistant) {
      onOpenAssistant(query);
    } else {
      setActiveView('fleet_assistant' as ActiveView);
    }
  };

  const quickPills = [
    'Berapa kendaraan yang offline?',
    'Kenapa konsumsi BBM naik?',
    'Kendaraan yang harus segera servis?',
    'Siapa driver paling berisiko?',
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-5 shadow-xl space-y-4">
      {/* Decorative Glow */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-md shadow-cyan-500/10">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100">AI Fleet Proactive Intelligence</h3>
              <span className="rounded-full bg-rose-500/20 px-2 py-0.2 text-[9px] font-extrabold text-rose-400 border border-rose-500/30">
                {summary.criticalCount} PRIORITAS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{summary.headline}</p>
          </div>
        </div>

        <button
          onClick={() => handleOpenAI()}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-cyan-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Buka AI Fleet Assistant</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Proactive Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {summary.items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2.5 rounded-xl border border-slate-800/80 bg-slate-950/50 p-3 hover:border-cyan-500/30 transition-colors"
          >
            <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-[10px] font-bold text-cyan-400">
              {idx + 1}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{item}</p>
          </div>
        ))}
      </div>

      {/* Footer Quick Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
          <Zap className="h-3.5 w-3.5 text-cyan-400" />
          Tanya Langsung:
        </span>
        {quickPills.map((pill, idx) => (
          <button
            key={idx}
            onClick={() => handleOpenAI(pill)}
            className="rounded-lg border border-slate-800 bg-slate-900/90 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:border-cyan-500 hover:text-cyan-300 transition-colors"
          >
            {pill}
          </button>
        ))}
      </div>
    </div>
  );
};
