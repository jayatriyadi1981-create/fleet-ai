/**
 * Risk Prediction Tab
 * PROMPT 33 Architecture
 */

import React from 'react';
import { 
  ShieldAlert, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  User, 
  Truck, 
  Navigation,
  Activity,
  Flame,
  Radio
} from 'lucide-react';
import { SafetyRiskPredictionEngine } from '../../engines/SafetyRiskPredictionEngine';

export const RiskPredictionTab: React.FC = () => {
  const activeTrips = SafetyRiskPredictionEngine.getActiveTripSafetyRisks();

  return (
    <div className="space-y-6">
      
      {/* Top Early Warning Alerts */}
      <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4 animate-pulse" />
          Sinyal Peringatan Dini Risiko Keselamatan (Live Safety Risk Early Warnings)
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-red-400">Armada B 9811 ULM (Rudi Hartono)</span>
              <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-red-500/20 text-red-400 font-mono">RISK SCORE: 84</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-snug">
              Terdeteksi 3 kejadian overspeed berturut-turut di jalan tol dengan kondisi keausan ban mendekati limit toleransi servis.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400">Rute Tol Cipularang KM 90-93</span>
              <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-amber-500/20 text-amber-400 font-mono">RISK SCORE: 78</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-snug">
              Hujan intensitas tinggi dengan penurunan jarak pandang terdeteksi di segmen turunan tajam dengan 2 armada aktif melintas.
            </p>
          </div>
        </div>
      </div>

      {/* Active Trips Safety Risk Evaluation */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              Evaluasi Risiko Keselamatan Perjalanan Aktif (Live Trip Safety Risk Engine)
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Kombinasi telemetri Driver, Kondisi Armada, Koridor Rute, Kelelahan, Cuaca, dan Kepadatan Lalu Lintas.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400">{activeTrips.length} Perjalanan Aktif</span>
        </div>

        <div className="space-y-3">
          {activeTrips.map(trip => (
            <div
              key={trip.tripId}
              className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white">{trip.tripNumber}</span>
                    <span className="text-slate-400 text-xs">•</span>
                    <span className="font-bold text-xs text-slate-200">{trip.origin} → {trip.destination}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Pengemudi: <strong className="text-white">{trip.driverName}</strong> | Kendaraan: <strong className="text-white">{trip.vehiclePlate}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">Total Trip Risk</div>
                    <div className={`text-base font-bold font-mono ${
                      trip.riskLevel === 'CRITICAL' ? 'text-red-400' :
                      trip.riskLevel === 'HIGH' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {trip.overallTripRiskScore} / 100
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${
                    trip.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    trip.riskLevel === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {trip.riskLevel}
                  </span>
                </div>
              </div>

              {/* Breakdown Bar Gauges */}
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2 border-t border-slate-700/50">
                <div className="bg-slate-900/80 p-2 rounded text-center">
                  <div className="text-[10px] text-slate-400">Driver</div>
                  <div className="text-xs font-bold text-white font-mono">{trip.riskFactorBreakdown.driverRiskFactor}%</div>
                </div>
                <div className="bg-slate-900/80 p-2 rounded text-center">
                  <div className="text-[10px] text-slate-400">Armada</div>
                  <div className="text-xs font-bold text-white font-mono">{trip.riskFactorBreakdown.vehicleRiskFactor}%</div>
                </div>
                <div className="bg-slate-900/80 p-2 rounded text-center">
                  <div className="text-[10px] text-slate-400">Rute</div>
                  <div className="text-xs font-bold text-white font-mono">{trip.riskFactorBreakdown.routeRiskFactor}%</div>
                </div>
                <div className="bg-slate-900/80 p-2 rounded text-center">
                  <div className="text-[10px] text-slate-400">Fatigue</div>
                  <div className="text-xs font-bold text-white font-mono">{trip.riskFactorBreakdown.fatigueRiskFactor}%</div>
                </div>
                <div className="bg-slate-900/80 p-2 rounded text-center">
                  <div className="text-[10px] text-slate-400">Cuaca</div>
                  <div className="text-xs font-bold text-white font-mono">{trip.riskFactorBreakdown.weatherRiskFactor}%</div>
                </div>
                <div className="bg-slate-900/80 p-2 rounded text-center">
                  <div className="text-[10px] text-slate-400">Lalin</div>
                  <div className="text-xs font-bold text-white font-mono">{trip.riskFactorBreakdown.trafficRiskFactor}%</div>
                </div>
              </div>

              {/* Advisory */}
              <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>AI Safety Advisory:</strong> {trip.mitigationAdvisory}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
