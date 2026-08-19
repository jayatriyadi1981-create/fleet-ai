import React from 'react';
import { useFleet } from '../../context/FleetContext';
import { Users, ShieldCheck, Award, AlertTriangle, Phone, FileText } from 'lucide-react';

export const DriversView: React.FC = () => {
  const { drivers } = useFleet();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Manajemen & Scorecard Pengemudi (Drivers)</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Pemantauan perilaku mengemudi, skor keselamatan (safety score), SIM, dan riwayat perjalanan.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {drivers.map((drv) => {
          const score = drv.score.overallScore;
          const scoreColor =
            score >= 90 ? 'text-emerald-400 border-emerald-500/30' : score >= 80 ? 'text-amber-400 border-amber-500/30' : 'text-rose-400 border-rose-500/30';

          return (
            <div
              key={drv.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4"
            >
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-slate-200 border border-slate-700">
                    {drv.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{drv.name}</h3>
                    <p className="text-xs text-slate-400">{drv.simType} • Exp: {drv.simExpiry}</p>
                  </div>
                </div>
                <div className={`rounded-xl border bg-slate-950 p-2 text-center ${scoreColor}`}>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Skor Safety</p>
                  <p className="text-lg font-bold">{score}/100</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-slate-950/60 p-2.5 border border-slate-800">
                  <p className="text-[10px] text-slate-400">Total Jarak</p>
                  <p className="font-bold text-white">{drv.score.totalDistanceKm.toLocaleString()} KM</p>
                </div>
                <div className="rounded-xl bg-slate-950/60 p-2.5 border border-slate-800">
                  <p className="text-[10px] text-slate-400">Total Trip</p>
                  <p className="font-bold text-white">{drv.totalTripsCompleted} Trip Selesai</p>
                </div>
              </div>

              <div className="rounded-xl bg-slate-950/40 p-3 border border-slate-800/80 space-y-1.5 text-xs">
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Catatan Telematika Keselamatan:</p>
                <div className="flex justify-between text-slate-300">
                  <span>Kejadian Overspeed:</span>
                  <span className="font-bold text-amber-400">{drv.score.speedingCount}x</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Pengereman Mendadak:</span>
                  <span className="font-bold text-slate-200">{drv.score.harshBrakingCount}x</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-3">
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-cyan-400" />
                  {drv.phone}
                </span>
                <span className="capitalize font-semibold text-emerald-400">{drv.status.replace('_', ' ')}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
