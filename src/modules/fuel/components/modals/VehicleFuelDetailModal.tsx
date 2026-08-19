/**
 * Fleet Intelligence Smart AI - Vehicle Fuel Detail Modal
 * PROMPT 24 - Comprehensive Fuel Profile for Selected Vehicle (/app/fuel/vehicles/:vehicleId)
 */

import React from 'react';
import { X, Fuel, Activity, TrendingUp, AlertTriangle, ShieldCheck, Cpu } from 'lucide-react';
import { FuelReading, FuelConsumption, FuelAnomaly, VehicleFuelConfig } from '../../types';
import { FuelGauge } from '../widgets/FuelGauge';

interface VehicleFuelDetailModalProps {
  vehicleId: string;
  isOpen: boolean;
  onClose: () => void;
  readings: FuelReading[];
  consumptions: FuelConsumption[];
  anomalies: FuelAnomaly[];
  configs: VehicleFuelConfig[];
}

export const VehicleFuelDetailModal: React.FC<VehicleFuelDetailModalProps> = ({
  vehicleId,
  isOpen,
  onClose,
  readings,
  consumptions,
  anomalies,
  configs,
}) => {
  if (!isOpen) return null;

  const config = configs.find((c) => c.vehicleId === vehicleId) || {
    vehicleId,
    vehiclePlate: 'B 9876 XYZ',
    fuelType: 'BIODIESEL',
    tankCapacityLiters: 300,
    fuelSensorType: 'ULTRASONIC',
    sensorOffsetPct: 2.0,
    expectedKmPerLiter: 3.8,
    expectedLiterPer100Km: 26.3,
    tolerancePct: 15,
  };

  const latestReading = readings.find((r) => r.vehicleId === vehicleId) || {
    fuelLevel: 216,
    fuelPercentage: 72,
    source: 'FUEL_SENSOR' as const,
    confidence: 'HIGH' as const,
  };

  const vehConsumptions = consumptions.filter((c) => c.vehicleId === vehicleId);
  const vehAnomalies = anomalies.filter((a) => a.vehicleId === vehicleId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 text-slate-100 p-6 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-950 border border-cyan-800/50 text-cyan-400 rounded-xl">
              <Fuel className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Profil Telematika BBM: {config.vehiclePlate}</h2>
              <p className="text-xs text-slate-400">
                Konfigurasi tangki, kalibrasi sensor, riwayat konsumsi, dan log anomali kendaraan.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FuelGauge
            percentage={latestReading.fuelPercentage}
            liters={latestReading.fuelLevel}
            capacity={config.tankCapacityLiters}
            vehiclePlate={config.vehiclePlate}
            source={latestReading.source}
            confidence={latestReading.confidence}
          />

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Cpu className="h-4 w-4 text-cyan-400" /> Spesifikasi Tangki & Sensor
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Kapasitas Tangki Utama:</span>
                <span className="font-bold text-white">{config.tankCapacityLiters} Liter</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tipe Sensor BBM:</span>
                <span className="font-semibold text-cyan-300">{config.fuelSensorType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Jenis Bahan Bakar:</span>
                <span className="font-semibold text-emerald-400">{config.fuelType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Target Efisiensi:</span>
                <span className="font-semibold text-amber-400">{config.expectedKmPerLiter} KM/L</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> Kalibrasi & Toleransi
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Sensor Offset:</span>
                <span className="font-semibold text-white">+{config.sensorOffsetPct}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Batas Toleransi Anomali:</span>
                <span className="font-semibold text-white">±{config.tolerancePct}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Anomali Terdeteksi:</span>
                <span className="font-bold text-rose-400">{vehAnomalies.length} Kejadian</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" /> Anomali BBM Terkait Kendaraan Ini
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {vehAnomalies.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">Tidak ada anomali BBM tercatat untuk kendaraan ini.</p>
            ) : (
              vehAnomalies.map((anom) => (
                <div
                  key={anom.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-xs flex justify-between items-center"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-rose-400">{anom.type}</span>
                      <span className="text-[10px] text-slate-400">{new Date(anom.timestamp).toLocaleString('id-ID')}</span>
                    </div>
                    <p className="text-slate-300">{anom.evidence.description}</p>
                  </div>
                  <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 font-medium">
                    {anom.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
          >
            Tutup Profil Kendaraan
          </button>
        </div>
      </div>
    </div>
  );
};
