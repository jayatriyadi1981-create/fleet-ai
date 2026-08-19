/**
 * Fleet Intelligence Smart AI - Vehicle Specific Fuel Intelligence Modal
 * Provides full deep-dive intelligence view for a single vehicle (PROMPT 30 drilldown).
 */

import React from 'react';
import { VehicleFuelBaseline, FuelAnomalyItem, FuelTheftIndicator, FuelEfficiencyPredictionResult } from '../../types';
import { Truck, X, Fuel, Gauge, ShieldAlert, Cpu, Sparkles, CheckCircle2, TrendingUp } from 'lucide-react';

interface VehicleDrilldownModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: VehicleFuelBaseline | null;
  anomalies: FuelAnomalyItem[];
  theftIndicators: FuelTheftIndicator[];
  prediction?: FuelEfficiencyPredictionResult;
  onExplainWithAI: (topic: string, subject: string) => void;
}

export const VehicleDrilldownModal: React.FC<VehicleDrilldownModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  anomalies,
  theftIndicators,
  prediction,
  onExplainWithAI,
}) => {
  if (!isOpen || !vehicle) return null;

  const vehicleAnomalies = anomalies.filter((a) => a.vehicleId === vehicle.vehicleId);
  const vehicleThefts = theftIndicators.filter((t) => t.vehicleId === vehicle.vehicleId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden text-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{vehicle.plateNumber}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {vehicle.fuelType}
                </span>
              </div>
              <p className="text-xs text-slate-400">{vehicle.vehicleType} • ID: {vehicle.vehicleId}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Konsumsi Aktual</span>
              <span className="text-sm font-bold text-white">{vehicle.currentConsumptionL100Km} L/100km</span>
              <span className="text-[10px] text-slate-400">({(100 / vehicle.currentConsumptionL100Km).toFixed(1)} km/L)</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Baseline Normal</span>
              <span className="text-sm font-bold text-cyan-400">{vehicle.normalConsumptionL100Km} L/100km</span>
              <span className="text-[10px] text-slate-400">(Rentang: {vehicle.normalRangeMinL100Km}-{vehicle.normalRangeMaxL100Km}L)</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Skor Efisiensi</span>
              <span className="text-sm font-bold text-emerald-400">{vehicle.efficiencyScore}/100</span>
              <span className="text-[10px] text-emerald-500">Deviasi: {vehicle.deviationPercentage}%</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Total Jarak Tempuh</span>
              <span className="text-sm font-bold text-white">{vehicle.totalDistanceKm.toLocaleString()} km</span>
              <span className="text-[10px] text-slate-400">({vehicle.totalTrips} Perjalanan)</span>
            </div>
          </div>

          {/* AI Predictive Forecast Box */}
          {prediction && (
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5 uppercase">
                  <Cpu className="h-3.5 w-3.5" /> AI Future Forecast
                </span>
                <span className="text-[10px] font-mono text-cyan-400">
                  Tren: {prediction.forecastTrend}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{prediction.modelRationale}</p>
            </div>
          )}

          {/* Anomalies List */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">
              Riwayat Anomali Bahan Bakar ({vehicleAnomalies.length})
            </h4>
            {vehicleAnomalies.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3 rounded-xl bg-slate-950 border border-slate-800">
                Tidak ada riwayat anomali tercatat pada unit ini.
              </p>
            ) : (
              vehicleAnomalies.map((anom) => (
                <div key={anom.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{anom.anomalyType}</span>
                    <span className="text-[11px] text-slate-400">{anom.locationName} • {new Date(anom.timestamp).toLocaleString('id-ID')}</span>
                  </div>
                  <span className="font-mono font-bold text-rose-400">{anom.fuelDifferenceLiters} L</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-t border-slate-800">
          <button
            onClick={() => onExplainWithAI('CONSUMPTION', `Profil Lengkap BBM ${vehicle.plateNumber}`)}
            className="px-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5" /> Konsultasi AI Copilot
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
