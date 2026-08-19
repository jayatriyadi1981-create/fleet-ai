/**
 * Fleet Intelligence Smart AI - Fuel Gauge Widget
 * PROMPT 24 - Visual Fuel Gauge Component with Normal / Low / Critical Indicators
 */

import React from 'react';
import { Fuel, AlertTriangle } from 'lucide-react';

interface FuelGaugeProps {
  percentage: number;
  liters: number;
  capacity?: number;
  vehiclePlate?: string;
  source?: string;
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
  size?: 'sm' | 'md' | 'lg';
}

export const FuelGauge: React.FC<FuelGaugeProps> = ({
  percentage,
  liters,
  capacity = 300,
  vehiclePlate,
  source = 'SENSOR',
  confidence = 'HIGH',
  size = 'md',
}) => {
  const isCritical = percentage <= 10;
  const isLow = percentage > 10 && percentage <= 20;

  const barColor = isCritical
    ? 'bg-rose-500 shadow-rose-500/50'
    : isLow
    ? 'bg-amber-500 shadow-amber-500/50'
    : 'bg-emerald-500 shadow-emerald-500/50';

  const badgeBg = isCritical
    ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
    : isLow
    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 backdrop-blur-md space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${badgeBg} border`}>
            {isCritical || isLow ? (
              <AlertTriangle className="h-4 w-4" />
            ) : (
              <Fuel className="h-4 w-4" />
            )}
          </div>
          {vehiclePlate && (
            <span className="font-bold text-sm text-white">{vehiclePlate}</span>
          )}
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${badgeBg}`}>
          {isCritical ? 'CRITICAL' : isLow ? 'LOW FUEL' : 'NORMAL'}
        </span>
      </div>

      <div className="flex items-baseline justify-between pt-1">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-extrabold text-white">{percentage}%</span>
          <span className="text-xs text-slate-400">({liters} / {capacity} L)</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 block">Src: {source}</span>
          <span className="text-[10px] font-semibold text-cyan-400 block">
            Conf: {confidence}
          </span>
        </div>
      </div>

      <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>
    </div>
  );
};
