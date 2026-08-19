/**
 * Fleet Intelligence Smart AI - Fuel Data Quality & Sensor Health Tab
 * Evaluates telemetry frequency, calibration status, missing sensor warnings, and data reliability.
 */

import React from 'react';
import { FuelDataQualityMetrics } from '../../types';
import { Activity, Cpu, CheckCircle2, AlertTriangle, Radio, ShieldCheck, Wrench, Sparkles } from 'lucide-react';

interface DataQualityTabProps {
  dataQuality: FuelDataQualityMetrics;
  onExplainWithAI: (topic: string, subject: string) => void;
}

export const DataQualityTab: React.FC<DataQualityTabProps> = ({
  dataQuality,
  onExplainWithAI,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Overall Score Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col items-center justify-center text-center shadow-lg">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Indeks Kualitas Data & Sensor
          </span>
          <div className="mt-4 relative flex items-center justify-center">
            <div className="h-32 w-32 rounded-full border-4 border-slate-800 flex items-center justify-center bg-slate-950/80 shadow-inner">
              <div>
                <span className="text-4xl font-bold font-mono text-cyan-400 block">
                  {dataQuality.overallQualityScore}
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase">/ 100 Skala</span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Integritas Data: Tinggi (High)
            </span>
          </div>
        </div>

        <div className="md:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between shadow-lg space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-cyan-400">
              <Activity className="h-4 w-4" />
              <h4 className="text-sm font-bold text-white">Status Kesehatan Jaringan Sensor Telematika</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Sebanyak <strong>{dataQuality.calibratedSensorsCount} unit sensor tangki</strong> terpasang dan terkalibrasi normal dengan transmisi data setiap <strong>10 detik</strong>. Terdapat <strong>{dataQuality.uncalibratedSensorsCount} unit probe ultrasonik</strong> yang mendekati siklus kalibrasi ulang (180 hari).
            </p>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs text-center">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Sensor Coverage</span>
              <span className="font-bold text-white text-sm">{dataQuality.sensorCoveragePercentage}%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">GPS Availability</span>
              <span className="font-bold text-emerald-400 text-sm">{dataQuality.gpsAvailabilityPercentage}%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Missing Values</span>
              <span className="font-bold text-cyan-400 text-sm">{dataQuality.missingValuesPercentage}%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Struk Match</span>
              <span className="font-bold text-emerald-400 text-sm">{dataQuality.transactionCompletenessPercentage}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sensor Warnings & Calibration Alerts */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-lg space-y-3">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          Peringatan Perangkat & Rekalibrasi Sensor
        </h4>
        <div className="space-y-2">
          {dataQuality.warnings.map((warn, idx) => (
            <div key={idx} className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
              <Wrench className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{warn}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
