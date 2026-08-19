/**
 * Safety Score Engine & Breakdown Tab
 * PROMPT 22 Section 54 - 62
 */

import React, { useState } from 'react';
import { SafetyScoreConfig, DEFAULT_SAFETY_SCORE_CONFIG } from '../../types';
import { ShieldCheck, Sliders, TrendingUp, Cpu, Award, AlertTriangle } from 'lucide-react';

interface SafetyScoreTabProps {
  scoreMetrics: any;
}

export const SafetyScoreTab: React.FC<SafetyScoreTabProps> = ({ scoreMetrics }) => {
  const [config, setConfig] = useState<SafetyScoreConfig>(DEFAULT_SAFETY_SCORE_CONFIG);

  const handleSliderChange = (key: keyof SafetyScoreConfig, val: number) => {
    setConfig((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <div className="space-y-6">
      {/* Main Score Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-emerald-500/40 bg-slate-900/90 p-6 backdrop-blur-md space-y-3 shadow-xl md:col-span-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fleet Safety Score Normalized</p>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-extrabold text-emerald-400">{scoreMetrics.score}</span>
            <span className="text-lg font-bold text-slate-400">/ 100</span>
          </div>
          <p className="text-xs text-emerald-300 font-semibold flex items-center gap-1">
            <TrendingUp className="h-4 w-4" /> +4.2% dibanding periode lalu (82.8)
          </p>
          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            Diterapkan ter-normalisasi jarak: <strong className="text-white">{(scoreMetrics.totalDistanceKm / 1000).toFixed(0)}k KM</strong> total perjalanan
          </p>
        </div>

        {/* Configurable Weight Sliders Panel */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 backdrop-blur-md space-y-4 shadow-xl md:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="h-5 w-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Konfigurasi Pembobotan Safety Score Engine</h3>
            </div>
            <button
              onClick={() => setConfig(DEFAULT_SAFETY_SCORE_CONFIG)}
              className="text-xs text-cyan-400 hover:underline font-semibold"
            >
              Reset Default
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-slate-300 mb-1">
                <span>Accident Weight (Bobot Kecelakaan)</span>
                <span className="text-rose-400 font-bold">{config.accidentWeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={config.accidentWeight}
                onChange={(e) => handleSliderChange('accidentWeight', parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-rose-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-300 mb-1">
                <span>Incident Weight (Bobot Insiden)</span>
                <span className="text-amber-400 font-bold">{config.incidentWeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                value={config.incidentWeight}
                onChange={(e) => handleSliderChange('incidentWeight', parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-300 mb-1">
                <span>Near Miss Weight</span>
                <span className="text-cyan-400 font-bold">{config.nearMissWeight}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                value={config.nearMissWeight}
                onChange={(e) => handleSliderChange('nearMissWeight', parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-cyan-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-300 mb-1">
                <span>Driver Behavior Weight</span>
                <span className="text-emerald-400 font-bold">{config.driverBehaviorWeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="35"
                value={config.driverBehaviorWeight}
                onChange={(e) => handleSliderChange('driverBehaviorWeight', parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Score Breakdown by Branch & Vehicle */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-400" /> Perbandingan Safety Score per Cabang & Hub Depo
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Cabang Utama Jakarta</span>
              <span className="font-bold text-emerald-400 text-sm">88 / 100</span>
            </div>
            <p className="text-[11px] text-slate-400">Accident: 1 | Incident: 1 | Near Miss: 2</p>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: '88%' }}></div>
            </div>
          </div>

          <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Hub Cikarang</span>
              <span className="font-bold text-amber-400 text-sm">82 / 100</span>
            </div>
            <p className="text-[11px] text-slate-400">Accident: 1 | Incident: 1 | Near Miss: 1</p>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500" style={{ width: '82%' }}></div>
            </div>
          </div>

          <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Hub Palembang</span>
              <span className="font-bold text-emerald-400 text-sm">91 / 100</span>
            </div>
            <p className="text-[11px] text-slate-400">Accident: 0 | Incident: 0 | Near Miss: 1</p>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: '91%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
