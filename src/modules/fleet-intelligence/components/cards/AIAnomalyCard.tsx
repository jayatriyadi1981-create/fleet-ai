/**
 * Fleet Intelligence Smart AI - AI Anomaly Card Component (Prompt 28)
 */

import React from 'react';
import { AlertTriangle, Sparkles, ArrowRight, Activity, Gauge, MapPin, Fuel, ShieldAlert } from 'lucide-react';
import { OperationalAnomalyItem } from '../../types';

interface AIAnomalyCardProps {
  anomaly: OperationalAnomalyItem;
  onInvestigate?: (anomaly: OperationalAnomalyItem) => void;
  onExplain?: (anomaly: OperationalAnomalyItem) => void;
  onVehicleClick?: (vehicleId: string) => void;
}

export const AIAnomalyCard: React.FC<AIAnomalyCardProps> = ({
  anomaly,
  onInvestigate,
  onExplain,
  onVehicleClick,
}) => {
  const getSeverityBadge = () => {
    switch (anomaly.severity) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'MEDIUM':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  const getModuleIcon = () => {
    switch (anomaly.relatedModule) {
      case 'fuel':
        return <Fuel className="h-4 w-4 text-amber-400" />;
      case 'safety':
        return <ShieldAlert className="h-4 w-4 text-rose-400" />;
      case 'gps':
        return <MapPin className="h-4 w-4 text-cyan-400" />;
      case 'maintenance':
        return <Activity className="h-4 w-4 text-orange-400" />;
      default:
        return <Gauge className="h-4 w-4 text-blue-400" />;
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-all hover:border-slate-700">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 border border-slate-700 shrink-0">
            {getModuleIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getSeverityBadge()}`}>
                {anomaly.severity}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Skor: <strong className="text-white">{anomaly.anomalyScore}/100</strong> ({anomaly.scoreInterpretation})
              </span>
              <span className="text-[10px] text-slate-500">• {anomaly.detectedAt}</span>
            </div>
            <h4 className="text-sm font-bold text-white mt-1 leading-snug">{anomaly.title}</h4>
          </div>
        </div>

        {onExplain && (
          <button
            onClick={() => onExplain(anomaly)}
            className="flex items-center gap-1 px-2 py-1 rounded-md border border-cyan-500/30 bg-cyan-500/10 text-[10px] font-semibold text-cyan-300 hover:bg-cyan-500/20 shrink-0 transition-colors"
          >
            <Sparkles className="h-3 w-3" />
            <span>Explain</span>
          </button>
        )}
      </div>

      {/* Target Details */}
      <div className="flex items-center gap-3 py-1.5 px-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs mb-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">Kendaraan:</span>
          <button
            onClick={() => onVehicleClick?.(anomaly.vehicleId)}
            className="font-mono font-bold text-cyan-400 hover:underline"
          >
            {anomaly.plateNumber}
          </button>
          <span className="text-slate-400 text-[11px]">({anomaly.vehicleModel})</span>
        </div>
        {anomaly.driverName && (
          <div className="flex items-center gap-1">
            <span className="text-slate-500">Driver:</span>
            <span className="text-slate-300 font-medium">{anomaly.driverName}</span>
          </div>
        )}
      </div>

      {/* Deviation Comparison if available */}
      {anomaly.baselineValue && (
        <div className="grid grid-cols-3 gap-2 p-2 rounded-lg bg-slate-950/40 border border-slate-800/80 text-center mb-3">
          <div>
            <span className="text-[10px] text-slate-400 block">Baseline Normal</span>
            <span className="text-xs font-semibold text-slate-300">{anomaly.baselineValue}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Nilai Terdeteksi</span>
            <span className="text-xs font-bold text-rose-400">{anomaly.currentValue}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Deviasi</span>
            <span className="text-xs font-bold text-amber-400">+{anomaly.deviationPercent}%</span>
          </div>
        </div>
      )}

      {/* Evidence */}
      <div className="mb-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
          Bukti Deteksi ({anomaly.detectionMethod}):
        </span>
        <ul className="space-y-1">
          {anomaly.evidence.map((item, idx) => (
            <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
              <span className="text-amber-400 mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Impact & Recommendation */}
      <div className="space-y-1.5 text-xs mb-3.5">
        <p className="text-slate-300">
          <strong className="text-rose-400 font-semibold">Dampak Operasional: </strong>
          {anomaly.impact}
        </p>
        <p className="text-slate-300">
          <strong className="text-cyan-300 font-semibold">Rekomendasi AI: </strong>
          {anomaly.recommendation}
        </p>
      </div>

      {/* Action Footer */}
      {onInvestigate && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <span className="text-[11px] text-slate-500">Status: <strong className="text-amber-400 font-medium">{anomaly.status}</strong></span>
          <button
            onClick={() => onInvestigate(anomaly)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            <span>Investigasi Akar Masalah</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
};
