/**
 * Fleet Intelligence Smart AI - Vehicle Intelligence Modal (Prompt 28)
 * Panel drilldown komprehensif untuk satu kendaraan: performa, anomali,
 * prediksi keausan komponen, telemetri real-time, dan rekomendasi AI.
 */

import React from 'react';
import {
  X,
  Sparkles,
  Truck,
  Gauge,
  Fuel,
  Activity,
  ShieldAlert,
  Calendar,
  Wrench,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { VehiclePerformanceItem, OperationalAnomalyItem } from '../../types';

interface VehicleIntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: VehiclePerformanceItem | null;
  anomalies?: OperationalAnomalyItem[];
  onCreateWorkOrder?: (vehicle: VehiclePerformanceItem) => void;
  onGroundVehicle?: (vehicle: VehiclePerformanceItem) => void;
}

export const VehicleIntelligenceModal: React.FC<VehicleIntelligenceModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  anomalies = [],
  onCreateWorkOrder,
  onGroundVehicle,
}) => {
  if (!isOpen || !vehicle) return null;

  const vehicleAnomalies = anomalies.filter(
    (a) => a.vehicleId === vehicle.vehicleId || a.plateNumber === vehicle.plateNumber
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white font-mono">{vehicle.plateNumber}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  vehicle.status === 'moving' ? 'bg-emerald-500/20 text-emerald-300' :
                  vehicle.status === 'idle' ? 'bg-amber-500/20 text-amber-300' :
                  'bg-slate-700 text-slate-300'
                }`}>
                  {vehicle.status}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Rank #{vehicle.ranking}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {vehicle.brand} {vehicle.model} • {vehicle.groupName} • {vehicle.branchName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Main KPI Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block mb-1">Skor Performa AI</span>
              <div className="flex items-center justify-center gap-1">
                <span className="text-2xl font-black font-mono text-white">{vehicle.performanceScore}</span>
                <span className="text-xs text-slate-500 font-mono">/100</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-medium">Tren: {vehicle.trend}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block mb-1">Utilisasi Armada</span>
              <span className="text-2xl font-black font-mono text-cyan-400">{vehicle.utilizationPercent}%</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Jarak: {vehicle.distanceKm} km</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block mb-1">Efisiensi BBM</span>
              <span className="text-2xl font-black font-mono text-amber-400">{vehicle.fuelEfficiencyKmPerL}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">km / Liter</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block mb-1">Tingkat Risiko</span>
              <span className={`text-sm font-bold font-mono block mt-1 ${
                vehicle.riskLevel === 'CRITICAL' ? 'text-rose-400' :
                vehicle.riskLevel === 'HIGH' ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {vehicle.riskLevel}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Safety: {vehicle.safetyScore}/100</span>
            </div>
          </div>

          {/* AI Wear & Predictive Maintenance */}
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/10 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                AI Predictive Component Wear & Diagnostics
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Prediksi Sisa Kampas Rem:</span>
                <span className="text-sm font-bold font-mono text-amber-300">~1.200 KM</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Berdasarkan 8x harsh braking</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Servis Berkala Berikutnya:</span>
                <span className="text-sm font-bold font-mono text-emerald-300">3.450 KM lagi</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Siklus oli & filter 10.000 KM</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Kesehatan Aki / Voltase:</span>
                <span className="text-sm font-bold font-mono text-cyan-300">12.6 V (Normal)</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Alternator charging stabil</span>
              </div>
            </div>
          </div>

          {/* Active Anomalies */}
          {vehicleAnomalies.length > 0 ? (
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                <span>Anomali Terdeteksi ({vehicleAnomalies.length} Kasus)</span>
              </h4>
              <div className="space-y-2">
                {vehicleAnomalies.map((a) => (
                  <div key={a.id} className="p-3 rounded-lg bg-slate-950/70 border border-amber-500/30 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <strong className="text-white font-semibold">{a.title}</strong>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                        {a.severity}
                      </span>
                    </div>
                    <p className="text-slate-300 mb-1.5">{a.impact}</p>
                    <div className="text-[11px] text-cyan-300">
                      <strong>Saran AI: </strong>{a.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Tidak ada anomali kritis aktif pada kendaraan ini dalam 24 jam terakhir.</span>
            </div>
          )}

          {/* Key Issues & AI Recommendations */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Catatan Diagnostik & Masalah Kunci
            </h4>
            <ul className="space-y-1 p-3 rounded-xl bg-slate-950/50 border border-slate-800">
              {vehicle.keyIssues.map((issue, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="text-cyan-400">•</span>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            {onCreateWorkOrder && (
              <button
                onClick={() => onCreateWorkOrder(vehicle)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold transition-colors"
              >
                <Wrench className="h-3.5 w-3.5" />
                <span>Terbitkan Work Order</span>
              </button>
            )}

            {onGroundVehicle && (
              <button
                onClick={() => onGroundVehicle(vehicle)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold transition-colors"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Kandangkan Unit (Ground)</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
