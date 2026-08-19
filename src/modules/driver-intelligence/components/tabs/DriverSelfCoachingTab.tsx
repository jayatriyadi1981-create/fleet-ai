/**
 * Driver Self-Coaching & Personal Goals Tab
 * PROMPT 29 - Driver Role Empowerment & Self-Improvement Goals
 */

import React from 'react';
import {
  Target,
  Award,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Flame,
  Clock,
  Gauge,
} from 'lucide-react';
import { DriverIntelligenceFullProfile } from '../../engines/DriverIntelligenceService';

interface DriverSelfCoachingTabProps {
  profile: DriverIntelligenceFullProfile;
  onSelectDriverId: (id: string) => void;
}

export const DriverSelfCoachingTab: React.FC<DriverSelfCoachingTabProps> = ({
  profile,
}) => {
  const goals = profile.goals;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-slate-900/90 p-5 rounded-2xl border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                Self-Coaching Portal
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {profile.driverName} • {profile.assignedVehiclePlate}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight mt-1">
              Target Keselamatan & Pengembangan Mandiri
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Pantau target keselamatan harian, raih lencana penghargaan Safety Champion, dan perbaiki kebiasaan mengemudi.
            </p>
          </div>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center shrink-0">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">SAFETY SCORE SAAT INI</span>
          <span className="text-2xl font-black font-mono text-emerald-400">
            {profile.safetyScore.score}/100
          </span>
        </div>
      </div>

      {/* 4 Active Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const isAchieved = goal.status === 'ACHIEVED';
          return (
            <div
              key={goal.id}
              className={`p-5 rounded-2xl border transition-all ${
                isAchieved
                  ? 'bg-emerald-950/20 border-emerald-500/40'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              } space-y-4 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                      isAchieved
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    }`}
                  >
                    {isAchieved ? 'Tercapai 🏆' : 'Sedang Berjalan'}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Deadline: {goal.deadline}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white">{goal.title}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{goal.description}</p>

                {/* Progress Numbers */}
                <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 my-3 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 block">AWAL</span>
                    <span className="font-bold text-slate-300">
                      {goal.baselineValue} {goal.unit}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">TARGET</span>
                    <span className="font-bold text-cyan-400">
                      {goal.targetValue} {goal.unit}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">SEKARANG</span>
                    <span
                      className={`font-bold ${
                        isAchieved ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {goal.currentValue} {goal.unit}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Kemajuan Target</span>
                    <span className="text-emerald-400 font-bold">{goal.progressPercentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, goal.progressPercentage)}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        isAchieved ? 'bg-emerald-400' : 'bg-cyan-400'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Daily Driving Tips */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">
            Tips Keselamatan AI Khusus untuk {profile.driverName}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
            <Gauge className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="text-slate-300 leading-relaxed">
              Jaga kecepatan stabil 70-75 km/jam di jalur kiri Tol Trans Jawa saat kondisi hujan untuk menghindari hydroplaning.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
            <Flame className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-slate-300 leading-relaxed">
              Gunakan teknik engine brake (deselerasi bertahap) sebelum memasuki gerbang tol untuk menghemat kampas rem dan mencegah rem panas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
