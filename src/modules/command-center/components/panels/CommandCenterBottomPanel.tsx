/**
 * Fleet Intelligence Smart AI - Command Center Bottom Tactical Panel
 * AI Predictive Anomaly Cards & Live Operations Event Stream Timeline
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Activity, 
  ChevronUp, 
  ChevronDown, 
  Check, 
  ArrowRight, 
  Clock, 
  ShieldAlert, 
  Fuel, 
  Wrench, 
  Navigation, 
  X,
  AlertCircle
} from 'lucide-react';
import { commandCenterService } from '../../services/commandCenterService';
import { AIInsightCard, CommandCenterEvent } from '../../types/commandCenterTypes';

interface CommandCenterBottomPanelProps {
  onTriggerInsightAction: (insight: AIInsightCard) => void;
  onSelectVehicle: (vehicleId: string) => void;
}

export const CommandCenterBottomPanel: React.FC<CommandCenterBottomPanelProps> = ({
  onTriggerInsightAction,
  onSelectVehicle,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'AI_INSIGHTS' | 'EVENT_STREAM'>('AI_INSIGHTS');
  const [insights, setInsights] = useState<AIInsightCard[]>(commandCenterService.getAIInsights());
  const [events, setEvents] = useState<CommandCenterEvent[]>(commandCenterService.getEvents());

  useEffect(() => {
    const update = () => {
      setInsights(commandCenterService.getAIInsights());
      setEvents(commandCenterService.getEvents());
    };
    update();
    const unsubscribe = commandCenterService.subscribe(update);
    return unsubscribe;
  }, []);

  return (
    <div
      className={`bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-slate-100 transition-all duration-300 z-20 flex flex-col ${
        isExpanded ? 'h-72' : 'h-28 sm:h-32'
      }`}
    >
      {/* Header Bar */}
      <div className="px-4 py-1.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('AI_INSIGHTS')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-colors ${
                activeTab === 'AI_INSIGHTS'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>AI Insights ({insights.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('EVENT_STREAM')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-colors ${
                activeTab === 'EVENT_STREAM'
                  ? 'bg-slate-700 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Event Stream Live</span>
            </button>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition-colors"
        >
          <span>{isExpanded ? 'Kecilkan Panel' : 'Perluas Panel'}</span>
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-x-auto overflow-y-auto p-2.5 scrollbar-thin scrollbar-thumb-slate-700">
        {activeTab === 'AI_INSIGHTS' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 min-w-[700px]">
            {insights.map((ins) => (
              <div
                key={ins.id}
                className="p-3 rounded-xl bg-slate-850/80 border border-slate-700/70 shadow-lg text-slate-200 flex flex-col justify-between hover:border-blue-500/50 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ins.severity === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : ins.severity === 'WARNING'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {ins.category} • {ins.confidenceScore}% Akurasi
                    </span>
                    <button
                      onClick={() => commandCenterService.dismissAIInsight(ins.id)}
                      className="text-slate-400 hover:text-white p-0.5 rounded"
                      title="Sembunyikan Insight"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-xs font-bold text-white mt-1.5 leading-snug">
                    {ins.title}
                  </h3>
                  <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {ins.evidenceText}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold truncate max-w-[170px]">
                    {ins.estimatedImpact}
                  </span>
                  <button
                    onClick={() => onTriggerInsightAction(ins)}
                    className="flex items-center gap-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 px-2.5 py-1 rounded-lg shadow transition-colors"
                  >
                    <span>Tindak Lanjut</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* EVENT STREAM TIMELINE */
          <div className="space-y-1.5">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="px-3 py-2 rounded-lg bg-slate-850/60 border border-slate-800 flex items-center justify-between text-xs text-slate-300 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-slate-400">
                    {new Date(evt.timestamp).toLocaleTimeString('id-ID')}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      evt.category === 'EMERGENCY'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : evt.category === 'SAFETY'
                        ? 'bg-amber-500/20 text-amber-400'
                        : evt.category === 'FUEL'
                        ? 'bg-orange-500/20 text-orange-400'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {evt.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-white font-medium">{evt.title}:</strong>
                    <span className="text-slate-300">{evt.description}</span>
                  </div>
                </div>

                {evt.vehicleId && (
                  <button
                    onClick={() => {
                      if (evt.vehicleId) {
                        onSelectVehicle(evt.vehicleId);
                      }
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300 font-mono font-bold"
                  >
                    {evt.plateNumber} →
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
