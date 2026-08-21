import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Thermometer,
  Disc,
  Clock,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { dtmsService } from '../../../modules/dtms/services/dtmsService';
import { TireRecord } from '../../../modules/dtms/types';

export const DtmsTiresTab: React.FC = () => {
  const [tires] = useState<TireRecord[]>(dtmsService.getTires());

  return (
    <div id="dtms-tires-tab" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 flex items-center space-x-2">
            <Disc className="w-5 h-5 text-amber-500" />
            <span>Manajemen Ban OTR & Radial Dump Truck (TPMS & TKPH)</span>
          </h2>
          <p className="text-xs text-slate-400">Monitoring tekanan ban nirkabel (PSI), suhu rim (°C), sisa kedalaman tapak (mm), dan TKPH rating</p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Total Ban Aktif Terpasang:</span>
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">612 Ban Terpantau TPMS</span>
        </div>
      </div>

      {/* Tire Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tires.map((tire) => (
          <div key={tire.id} className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">{tire.truckHullNo}</span>
                <div className="text-xs font-semibold text-slate-200 mt-1">{tire.wheelPosition}</div>
                <div className="text-[11px] text-slate-400">{tire.brand} - {tire.size}</div>
              </div>
              {tire.status === 'LOW_PRESSURE' ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">Low PSI</span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Optimal</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-400">Tekanan Ban (TPMS)</span>
                <div className={`font-mono font-bold ${tire.currentPressurePsi < tire.recommendedPressurePsi * 0.9 ? 'text-rose-400' : 'text-slate-100'}`}>
                  {tire.currentPressurePsi} / {tire.recommendedPressurePsi} PSI
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Suhu Rim / Ban</span>
                <div className={`font-mono font-bold flex items-center space-x-1 ${tire.temperatureCelsius > 80 ? 'text-rose-400' : 'text-slate-100'}`}>
                  <Thermometer className="w-3 h-3 text-amber-400" />
                  <span>{tire.temperatureCelsius}°C</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Sisa Tapak (Tread)</span>
                <div className="font-bold text-cyan-400">{tire.currentTreadDepthMm} mm <span className="text-[10px] text-slate-500">/ {tire.initialTreadDepthMm}</span></div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">TKPH Rating</span>
                <div className="font-bold text-purple-400">{tire.estimatedTkph} TKPH</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <span className="font-mono">Jam Pakai: {tire.hoursRun} Jam</span>
              <span className="font-mono text-slate-500">SN: {tire.serialNumber}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
