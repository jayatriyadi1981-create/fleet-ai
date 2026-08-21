import React from 'react';
import {
  Radio,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  RotateCw,
  Zap,
  Activity,
  Compass,
  Gauge
} from 'lucide-react';
import { dtmsService } from '../../../modules/dtms/services/dtmsService';

export const DtmsTelematicsTab: React.FC = () => {
  const trucks = dtmsService.getTrucks();

  return (
    <div id="dtms-telematics-tab" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 flex items-center space-x-2">
            <Radio className="w-5 h-5 text-purple-400" />
            <span>Telemetri Sensor Hoist Hidrolik, PTO & CAN-Bus Dump Truck</span>
          </h2>
          <p className="text-xs text-slate-400">Monitoring sudut angkat bak (0-60°), status PTO aktif, dan pencegahan dumping di luar disposal resmi</p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Status Sensor PTO:</span>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">100% Online & Geofenced</span>
        </div>
      </div>

      {/* Telematics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trucks.map((t) => (
          <div key={t.id} className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">{t.hullNumber}</span>
                <div className="text-sm font-semibold text-slate-100 mt-1">{t.model}</div>
                <div className="text-xs text-slate-400">{t.location.zoneName}</div>
              </div>
              <div>
                {t.ptoActive ? (
                  <span className="px-2.5 py-1 rounded text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center space-x-1">
                    <Zap className="w-3.5 h-3.5 animate-pulse" />
                    <span>PTO ON</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                    PTO Off
                  </span>
                )}
              </div>
            </div>

            {/* Hoist Visualizer */}
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Sudut Angkat Bak (Body Hoist)</span>
                <span className={`font-mono font-bold ${t.bodyHoistAngleDeg > 0 ? 'text-purple-400' : 'text-slate-300'}`}>
                  {t.bodyHoistAngleDeg}°
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(t.bodyHoistAngleDeg / 60) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0° (Flat Transit)</span>
                <span>Max 60° (Full Tipping)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950/40 p-2 rounded border border-slate-800/60">
                <span className="text-[10px] text-slate-400">Kecepatan Unit</span>
                <div className="font-bold text-slate-200">{t.speedKmh} km/h</div>
              </div>
              <div className="bg-slate-950/40 p-2 rounded border border-slate-800/60">
                <span className="text-[10px] text-slate-400">Beban Muatan</span>
                <div className="font-bold text-emerald-400">{t.currentPayloadTons} Ton</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
