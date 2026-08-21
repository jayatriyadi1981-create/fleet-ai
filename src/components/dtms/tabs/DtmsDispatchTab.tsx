import React, { useState } from 'react';
import {
  Zap,
  TrendingUp,
  RotateCw,
  Plus,
  Minus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { dtmsService } from '../../../modules/dtms/services/dtmsService';
import { MatchFactorExcavator } from '../../../modules/dtms/types';

export const DtmsDispatchTab: React.FC = () => {
  const [matchFactors, setMatchFactors] = useState<MatchFactorExcavator[]>(dtmsService.getMatchFactors());

  const handleAdjustTrucks = (id: string, delta: number) => {
    dtmsService.rebalanceDispatch(id, delta);
    setMatchFactors([...dtmsService.getMatchFactors()]);
  };

  const getStatusBadge = (status: MatchFactorExcavator['status'], mf: number) => {
    if (status === 'BALANCED') {
      return (
        <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Balanced (MF: {mf})</span>
        </span>
      );
    }
    if (status === 'EXCAVATOR_WAITING') {
      return (
        <span className="px-2.5 py-1 rounded text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center space-x-1">
          <Clock className="w-3.5 h-3.5" />
          <span>Shovel Idle / Butuh DT Tambahan (MF: {mf})</span>
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center space-x-1">
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>Antrean Dump Truck Padat (MF: {mf})</span>
      </span>
    );
  };

  return (
    <div id="dtms-dispatch-tab" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-emerald-400" />
            <span>Smart Dispatching & Match Factor Shovel-Truck</span>
          </h2>
          <p className="text-xs text-slate-400">Formula Keseimbangan: MF = (N_truck × t_loading) ÷ (N_excavator × t_cycle)</p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-medium">Optimal Range MF:</span>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">0.95 - 1.05</span>
        </div>
      </div>

      {/* Excavator Match Factor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {matchFactors.map((mf) => (
          <div key={mf.id} className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">{mf.excavatorCode}</span>
                <h3 className="text-sm font-bold text-slate-100 mt-1">{mf.model}</h3>
                <div className="text-xs text-slate-400 mt-0.5">{mf.loadingPoint}</div>
              </div>
            </div>

            <div>
              {getStatusBadge(mf.status, mf.calculatedMatchFactor)}
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-400">Loading Time</span>
                <div className="font-bold text-slate-200">{mf.avgLoadingTimeMins} Menit</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Avg Cycle Time</span>
                <div className="font-bold text-cyan-400">{mf.avgTruckCycleTimeMins} Menit</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Target BCM/Jam</span>
                <div className="font-bold text-slate-300">{mf.hourlyTargetBcm} BCM</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Aktual BCM/Jam</span>
                <div className={`font-bold ${mf.actualHourlyBcm >= mf.hourlyTargetBcm ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {mf.actualHourlyBcm} BCM
                </div>
              </div>
            </div>

            {/* Adjust Dump Trucks Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div>
                <div className="text-[10px] text-slate-400">Armada DT Dialokasikan</div>
                <div className="text-base font-extrabold text-slate-100">{mf.assignedTruckCount} Unit Dump Truck</div>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => handleAdjustTrucks(mf.id, -1)}
                  disabled={mf.assignedTruckCount <= 1}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 flex items-center justify-center border border-slate-700 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleAdjustTrucks(mf.id, 1)}
                  className="w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
