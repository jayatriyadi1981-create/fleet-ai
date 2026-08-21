import React, { useState } from 'react';
import {
  Layers,
  Droplets,
  Thermometer,
  Gauge,
  AlertOctagon,
  CheckCircle,
  TrendingDown,
  RefreshCw,
  Search
} from 'lucide-react';
import { MOCK_TANKER_FLEETS } from '../../../modules/tanker/services/tankerMockData';

export const TankerCompartmentsTab: React.FC = () => {
  const [fleets] = useState(MOCK_TANKER_FLEETS);
  const [selectedHull, setSelectedHull] = useState(fleets[0].hullNumber);

  const currentTank = fleets.find((f) => f.hullNumber === selectedHull) || fleets[0];

  return (
    <div id="tanker-compartments-tab" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <span>Telemetri Sensor Kompartemen & Deteksi Susut / Losses</span>
          </h2>
          <p className="text-xs text-slate-400">
            Monitoring sensor level ultrasonik, ullage ruang kosong atas, massa jenis densitas @15°C, dan deteksi dini air dasar (water bottom).
          </p>
        </div>

        {/* Tank Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-semibold">Pilih Unit:</span>
          <select
            value={selectedHull}
            onChange={(e) => setSelectedHull(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-500"
          >
            {fleets.map((f) => (
              <option key={f.id} value={f.hullNumber}>
                {f.hullNumber} ({f.plateNumber})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Metrics of Selected Tanker */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block">Total Volume Aktual</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-amber-400 font-mono">
              {currentTank.compartments
                .reduce((a, b) => a + b.currentVolumeLiters, 0)
                .toLocaleString()}{' '}
              L
            </span>
            <span className="text-xs text-slate-400">/ {currentTank.totalCapacityLiters.toLocaleString()} L</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block">Rata-Rata Suhu Muatan</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-sky-400 font-mono">
              {(
                currentTank.compartments.reduce((a, b) => a + b.temperatureC, 0) /
                currentTank.compartments.length
              ).toFixed(1)}
              °C
            </span>
            <span className="text-xs text-slate-400">Normal Range</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block">Rasio Susut Transit (Losses)</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-emerald-400 font-mono">0.06%</span>
            <span className="text-xs text-emerald-300 font-semibold">(Toleransi &lt;0.15%)</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block">Deteksi Endapan Air (Water Bottom)</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-emerald-400 font-mono">0.0 mm</span>
            <span className="text-xs text-emerald-300 font-semibold">Bebas Air (Clean)</span>
          </div>
        </div>
      </div>

      {/* Compartment Detailed Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentTank.compartments.map((comp) => {
          const fillPercentage = Math.round((comp.currentVolumeLiters / comp.capacityLiters) * 100);
          return (
            <div
              key={comp.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-md">
                    #{comp.compartmentNo}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">
                      Kompartemen {comp.compartmentNo}
                    </h3>
                    <span className="text-[11px] text-amber-400 font-medium">
                      {comp.liquidType.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-slate-200">
                  {comp.capacityLiters.toLocaleString()} L
                </span>
              </div>

              {/* Cylindrical Liquid Tank Gauge Visual */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center space-x-1">
                    <Droplets className="w-3.5 h-3.5 text-amber-400" />
                    <span>Volume Terisi</span>
                  </span>
                  <span className="font-mono font-bold text-amber-400">
                    {comp.currentVolumeLiters.toLocaleString()} L ({fillPercentage}%)
                  </span>
                </div>

                <div className="relative w-full h-8 bg-slate-900 rounded-lg overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 flex items-center px-3 text-[10px] font-bold text-slate-950 transition-all duration-700"
                    style={{ width: `${fillPercentage}%` }}
                  >
                    {fillPercentage > 10 && `Tinggi: ${comp.levelMm} mm`}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                  <span>Level: {comp.levelMm} mm</span>
                  <span>Ullage: {comp.ullageMm} mm</span>
                </div>
              </div>

              {/* Sensor Telemetry Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Thermometer className="w-3 h-3 text-sky-400" />
                      <span>Suhu Cairan</span>
                    </span>
                    <span className="font-bold text-slate-200">{comp.temperatureC}°C</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Gauge className="w-3 h-3 text-amber-400" />
                      <span>Massa Jenis</span>
                    </span>
                    <span className="font-bold text-slate-200">{comp.densityKgM3} kg/m³</span>
                  </div>
                </div>
              </div>

              {/* Valve & Manhole Security Indicators */}
              <div className="pt-2 border-t border-slate-800 space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Status Manhole Atas:</span>
                  <span className="text-emerald-400 font-bold flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>{comp.manholeStatus.replace(/_/g, ' ')}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Katup Bongkar Bawah:</span>
                  <span className="text-slate-300 font-semibold">{comp.dischargeValveStatus.replace(/_/g, ' ')}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
