/**
 * Fleet Intelligence Smart AI - Driver Fuel Analysis Tab
 * Integrates Driver Behavior telemetry (PROMPT 29) to correlate fuel consumption
 * with harsh acceleration, speeding, and excessive idling durations.
 */

import React from 'react';
import { DriverFuelAnalysisItem } from '../../types';
import { Users, UserCheck, Activity, Flame, Clock, Sparkles, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface DriverAnalysisTabProps {
  driverAnalysis: DriverFuelAnalysisItem[];
  onExplainWithAI: (topic: string, subject: string) => void;
}

export const DriverAnalysisTab: React.FC<DriverAnalysisTabProps> = ({
  driverAnalysis,
  onExplainWithAI,
}) => {
  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-cyan-400" />
            Korelasi Perilaku Mengemudi Terhadap Efisiensi BBM (Driver Fuel Analytics)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Menghubungkan kebiasaan gas mendadak, durasi mesin idle, dan kecepatan berkendara dengan konsumsi bahan bakar.
          </p>
        </div>
      </div>

      {/* Driver Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {driverAnalysis.map((drv) => {
          const isEfficient = drv.peerComparisonPercentage <= 0;

          return (
            <div
              key={drv.driverId}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-lg"
            >
              {/* Top Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold text-sm">
                    {drv.driverName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{drv.driverName}</h4>
                    <span className="text-xs text-slate-400 font-mono">
                      {drv.assignedPlate} • {drv.branchName}
                    </span>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-400 block">Skor Efisiensi</span>
                  <span
                    className={`text-sm font-bold ${
                      drv.fuelEfficiencyScore >= 80
                        ? 'text-emerald-400'
                        : drv.fuelEfficiencyScore >= 65
                        ? 'text-cyan-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {drv.fuelEfficiencyScore}/100
                  </span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800 font-mono text-xs text-center">
                <div>
                  <span className="text-[10px] text-slate-500 block">Konsumsi Rata-rata</span>
                  <span className="font-bold text-white text-xs">{drv.avgConsumptionL100Km} L/100km</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Vs Rekan Rute</span>
                  <span className={`font-bold text-xs ${isEfficient ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {drv.peerComparisonPercentage > 0 ? '+' : ''}{drv.peerComparisonPercentage}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Pemborosan Idle</span>
                  <span className="font-bold text-amber-400 text-xs">{drv.idleFuelWasteLiters} Liter</span>
                </div>
              </div>

              {/* Contributing Factors */}
              <div className="space-y-1.5 text-xs text-slate-300">
                <span className="font-mono font-bold text-slate-400 text-[11px] block uppercase">
                  Faktor Telemetri Dominan:
                </span>
                <ul className="space-y-1">
                  {drv.associatedFactors.map((factor, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span className="leading-snug">{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-[11px] font-mono text-slate-400">
                  {drv.totalTrips} Perjalanan ({drv.totalDistanceKm.toLocaleString()} km)
                </span>
                <button
                  onClick={() => onExplainWithAI('EFFICIENCY', `Analisis Pengemudi ${drv.driverName}`)}
                  className="px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 text-xs font-semibold flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" /> AI Coaching Plan
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
