/**
 * Fleet Intelligence Smart AI - Vehicle Health Detail Modal
 * PROMPT 25 - Comprehensive 360-degree Vehicle Diagnostics & Telematics
 */

import React from 'react';
import {
  X,
  Activity,
  Truck,
  AlertTriangle,
  Zap,
  Gauge,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Fuel,
  DollarSign,
  Clock,
  Sparkles
} from 'lucide-react';
import { VehicleHealth } from '../../types';

interface VehicleHealthDetailModalProps {
  vehicle: VehicleHealth | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenWorkOrder?: (vehicleId: string) => void;
}

export const VehicleHealthDetailModal: React.FC<VehicleHealthDetailModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  onOpenWorkOrder
}) => {
  if (!isOpen || !vehicle) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-cyan-400">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{vehicle.vehiclePlate}</h2>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                  {vehicle.brand} {vehicle.model}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  vehicle.status === 'HEALTHY' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50' :
                  vehicle.status === 'GOOD' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/50' :
                  vehicle.status === 'ATTENTION' ? 'bg-amber-950 text-amber-300 border border-amber-800/50' :
                  'bg-rose-950 text-rose-300 border border-rose-800/50'
                }`}>
                  {vehicle.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Odometer: <strong>{vehicle.mileageKm.toLocaleString()} KM</strong> | Jam Operasi Mesin: <strong>{vehicle.engineHours} Jam</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Top Diagnostics Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Skor Kesehatan Mesin</span>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-black ${
                  vehicle.healthScore >= 80 ? 'text-emerald-400' :
                  vehicle.healthScore >= 60 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {vehicle.healthScore}
                </span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Kepatuhan Servis (SLA)</span>
              <div className="text-2xl font-bold text-cyan-300">
                {vehicle.serviceCompliancePct}%
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Total Downtime (90 Hari)</span>
              <div className="text-2xl font-bold text-amber-400">
                {vehicle.downtimeHours} Jam
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Biaya / KM Aktual</span>
              <div className="text-2xl font-bold text-emerald-400">
                Rp {vehicle.costPerKm?.toLocaleString('id-ID')}
              </div>
            </div>
          </div>

          {/* Telemetry Sensor Signals */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Sinyal Sensor Telematika & Diagnostik OBD-II
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Voltase Aki (Battery):</span>
                <strong className={`font-mono text-sm ${
                  (vehicle.telemetrySignals?.batteryVoltage || 24.8) < 24.5 ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {vehicle.telemetrySignals?.batteryVoltage || 24.8} V
                </strong>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Ketebalan Kampas Rem:</span>
                <strong className={`font-mono text-sm ${
                  (vehicle.telemetrySignals?.brakePadWearPct || 35) > 75 ? 'text-rose-400' : 'text-slate-200'
                }`}>
                  {vehicle.telemetrySignals?.brakePadWearPct || 35}% Keausan
                </strong>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">DTC Trouble Codes:</span>
                <strong className="font-mono text-sm text-cyan-300">
                  {vehicle.telemetrySignals?.engineFaultCodes && vehicle.telemetrySignals.engineFaultCodes.length > 0
                    ? vehicle.telemetrySignals.engineFaultCodes.join(', ')
                    : 'CLEAR (P0000)'}
                </strong>
              </div>
            </div>
          </div>

          {/* AI Predictive Recommendation for This Vehicle */}
          <div className="p-4 rounded-2xl border border-cyan-800/50 bg-gradient-to-r from-slate-950 via-slate-950 to-cyan-950/30 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase">
              <Sparkles className="h-4 w-4" />
              AI Maintenance Recommendation
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Armada <strong>{vehicle.vehiclePlate}</strong> memiliki pola frekuensi servis yang baik. Namun perhatikan riwayat pengereman tromol roda belakang untuk mencegah keausan ban tidak merata dan menghemat konsumsi solar.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-800 flex justify-between items-center bg-slate-900">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
          >
            Tutup
          </button>

          <button
            onClick={() => {
              onClose();
              if (onOpenWorkOrder) onOpenWorkOrder(vehicle.vehicleId);
            }}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-600/30"
          >
            <Wrench className="h-4 w-4" />
            <span>Terbitkan Work Order untuk Armada Ini</span>
          </button>
        </div>
      </div>
    </div>
  );
};
