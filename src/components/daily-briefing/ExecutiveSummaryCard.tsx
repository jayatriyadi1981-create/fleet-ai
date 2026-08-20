/**
 * Fleet Intelligence Smart AI - Executive Summary & Health Scorecard Card
 */

import React from 'react';
import { 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Gauge, 
  Fuel, 
  Wrench, 
  Navigation, 
  Zap,
  Info
} from 'lucide-react';
import { FleetDailyBriefing } from '../../types/dailyBriefing';

interface ExecutiveSummaryCardProps {
  briefing: FleetDailyBriefing;
  onNavigateToModule?: (moduleKey: string) => void;
}

export const ExecutiveSummaryCard: React.FC<ExecutiveSummaryCardProps> = ({ briefing }) => {
  const { fleetHealth, fleetRisk, scorecard } = briefing;

  const getHealthBadgeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'B': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'C': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'D': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'MODERATE': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'ELEVATED': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'HIGH': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'CRITICAL': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div id="executive-summary-section" className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all duration-200">
      {/* Top Highlight Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                AI Grounded Daily Summary
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Report ID: <span className="font-mono text-slate-300">{briefing.id}</span>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
              {briefing.executiveSummary}
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              {briefing.executiveNarrativeIndonesian}
            </p>
          </div>

          {/* Quick Health & Risk Gauges */}
          <div className="flex sm:flex-row flex-col items-stretch gap-4 shrink-0">
            {/* Health Score Gauge */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 flex items-center gap-4 min-w-[200px]">
              <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-slate-900/60 border border-white/20">
                <span className="text-2xl font-black text-emerald-400">
                  {fleetHealth.overallScore}
                </span>
              </div>
              <div>
                <div className="text-xs uppercase font-bold text-slate-300 tracking-wider">Health Score</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-md border ${getHealthBadgeColor(fleetHealth.grade)}`}>
                    Grade {fleetHealth.grade}
                  </span>
                  <span className="text-xs text-emerald-300 capitalize font-medium">
                    {fleetHealth.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Risk Index */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 flex items-center gap-4 min-w-[200px]">
              <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-slate-900/60 border border-white/20">
                <span className="text-2xl font-black text-amber-400">
                  {fleetRisk.riskScore}
                </span>
              </div>
              <div>
                <div className="text-xs uppercase font-bold text-slate-300 tracking-wider">Indeks Risiko</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-md border ${getRiskBadgeColor(fleetRisk.riskLevel)}`}>
                    {fleetRisk.riskLevel}
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    {fleetRisk.affectedVehiclesCount} Armada
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7 Dimensions Score Breakdown Grid */}
      <div className="p-6 bg-slate-50/50 border-b border-slate-200/60">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Gauge className="w-4 h-4 text-indigo-600" />
            7 Pilar Dimensi Kesehatan Armada
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Bobot Algoritmik Terdistribusi
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {Object.entries(fleetHealth.dimensions).map(([key, dim]) => {
            const isWarning = dim.status === 'warning' || dim.status === 'critical';
            return (
              <div 
                key={key} 
                className="bg-white p-3.5 rounded-xl border border-slate-200/90 hover:border-indigo-300 transition-colors shadow-2xs"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-600 font-medium truncate" title={dim.name}>
                    {dim.name}
                  </span>
                  <span className={`text-xs font-bold ${dim.score >= 85 ? 'text-emerald-600' : isWarning ? 'text-amber-600' : 'text-blue-600'}`}>
                    {dim.score}%
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      dim.score >= 85 ? 'bg-emerald-500' : isWarning ? 'bg-amber-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${dim.score}%` }}
                  />
                </div>
                
                <p className="mt-2 text-[11px] text-slate-500 line-clamp-1" title={dim.detail}>
                  {dim.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fleet Scorecard Strip */}
      <div className="p-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 text-center">
        <div className="p-2.5 rounded-lg bg-slate-50/80 border border-slate-100">
          <span className="text-xs text-slate-500 font-medium block">Fleet Health</span>
          <span className="text-lg font-bold text-slate-800">{scorecard.fleetHealth}%</span>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50/80 border border-slate-100">
          <span className="text-xs text-slate-500 font-medium block">Driver Safety</span>
          <span className="text-lg font-bold text-slate-800">{scorecard.safety}%</span>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50/80 border border-slate-100">
          <span className="text-xs text-slate-500 font-medium block">Fuel Efficiency</span>
          <span className="text-lg font-bold text-slate-800">{scorecard.fuelEfficiency}%</span>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50/80 border border-slate-100">
          <span className="text-xs text-slate-500 font-medium block">Maintenance Rate</span>
          <span className="text-lg font-bold text-slate-800">{scorecard.maintenance}%</span>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50/80 border border-slate-100">
          <span className="text-xs text-slate-500 font-medium block">Utilisasi Bergerak</span>
          <span className="text-lg font-bold text-slate-800">{scorecard.utilization}%</span>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50/80 border border-slate-100">
          <span className="text-xs text-slate-500 font-medium block">Driver Score</span>
          <span className="text-lg font-bold text-slate-800">{scorecard.driverPerformance}%</span>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50/80 border border-slate-100">
          <span className="text-xs text-slate-500 font-medium block">GPS Reliability</span>
          <span className="text-lg font-bold text-slate-800">{scorecard.gpsReliability}%</span>
        </div>
      </div>
    </div>
  );
};
