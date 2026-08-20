/**
 * Fleet Intelligence Smart AI - Comparative Trends & AI Insights Widget
 */

import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Sparkles, 
  Layers, 
  ShieldCheck,
  BarChart3
} from 'lucide-react';
import { BriefingComparisonTrend, FleetDailyBriefing } from '../../types/dailyBriefing';

interface ComparisonTrendsWidgetProps {
  comparisons: BriefingComparisonTrend[];
  aiInsights: FleetDailyBriefing['aiInsights'];
}

export const ComparisonTrendsWidget: React.FC<ComparisonTrendsWidgetProps> = ({
  comparisons,
  aiInsights,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Comparative 7-day vs 30-day Table */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Analisis Tren Komparatif (Kemarin vs Rerata 7-Hari vs 30-Hari)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">Multi-Horizon Benchmark</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="p-3.5">Metrik Operasional</th>
                <th className="p-3.5">Realisasi Kemarin</th>
                <th className="p-3.5">Rerata 7-Hari</th>
                <th className="p-3.5">Rerata 30-Hari</th>
                <th className="p-3.5 text-right">Varians %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparisons.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50/60">
                  <td className="p-3.5 font-bold text-slate-900">{c.metric}</td>
                  <td className="p-3.5 font-semibold text-slate-800">{c.yesterdayValue}</td>
                  <td className="p-3.5 text-slate-600">{c.sevenDayAvgValue}</td>
                  <td className="p-3.5 text-slate-500">{c.thirtyDayAvgValue}</td>
                  <td className="p-3.5 text-right">
                    <span className={`inline-flex items-center gap-0.5 font-bold px-2 py-0.5 rounded-md ${
                      c.isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {c.direction === 'up' ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : c.direction === 'down' ? (
                        <TrendingDown className="w-3 h-3" />
                      ) : (
                        <Minus className="w-3 h-3" />
                      )}
                      {c.changePercent > 0 ? `+${c.changePercent}%` : `${c.changePercent}%`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Grounded Cross-domain Insights */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Cross-Domain AI Insights
            </h3>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/20 font-semibold">
            Grounded Model
          </span>
        </div>

        <div className="space-y-3">
          {aiInsights.map(ins => (
            <div key={ins.id} className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5 hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-indigo-200">
                  {ins.title}
                </h4>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-400/20 text-indigo-300">
                  {ins.confidence} CONFIDENCE
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {ins.narrative}
              </p>
              <p className="text-[11px] text-slate-400 italic">
                Sumber Bukti: {ins.evidence}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
