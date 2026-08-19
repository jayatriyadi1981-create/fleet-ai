/**
 * Driver Comparison Tab - Side-by-Side Multi-Driver Benchmarking
 * PROMPT 29 - Compare 2 to 4 drivers with peer group averages
 */

import React, { useState } from 'react';
import {
  Users,
  Award,
  AlertTriangle,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Sparkles,
  ChevronDown,
  Plus,
  X,
} from 'lucide-react';
import { driverIntelligenceService } from '../../engines/DriverIntelligenceService';
import { DriverIntelligencePeriod } from '../../types';

interface DriverComparisonTabProps {
  initialDriverIds?: string[];
  allDrivers: { id: string; name: string; vehiclePlate: string }[];
  period: DriverIntelligencePeriod;
  onSelectDriver: (driverId: string) => void;
  onOpenCoachingModal: (driverId: string) => void;
}

export const DriverComparisonTab: React.FC<DriverComparisonTabProps> = ({
  initialDriverIds = ['drv-01', 'drv-02', 'drv-03'],
  allDrivers,
  period,
  onSelectDriver,
  onOpenCoachingModal,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialDriverIds);

  const comparison = driverIntelligenceService.compareDrivers(
    selectedIds.length > 0 ? selectedIds : ['drv-01', 'drv-02'],
    period
  );

  const addDriver = (id: string) => {
    if (!selectedIds.includes(id) && selectedIds.length < 4) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const removeDriver = (id: string) => {
    if (selectedIds.length > 1) {
      setSelectedIds(selectedIds.filter((d) => d !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Driver Picker */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <h2 className="text-base font-bold text-white tracking-tight">
                Komparasi Head-to-Head Pengemudi ({selectedIds.length}/4)
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Analisis komparatif matriks keselamatan, agresivitas rem/gas, efisiensi bahan bakar, dan benchmark armada.
            </p>
          </div>

          {/* Add Driver Dropdown */}
          {selectedIds.length < 4 && (
            <div className="relative">
              <select
                onChange={(e) => {
                  if (e.target.value) addDriver(e.target.value);
                  e.target.value = '';
                }}
                className="pl-3 pr-8 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-cyan-300 font-semibold focus:outline-none focus:border-cyan-500/50 appearance-none cursor-pointer"
              >
                <option value="">+ Tambah Driver Komparasi</option>
                {allDrivers
                  .filter((d) => !selectedIds.includes(d.id))
                  .map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.vehiclePlate})
                    </option>
                  ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}
        </div>

        {/* Selected Driver Chips */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-800/80">
          {comparison.drivers.map((d) => (
            <div
              key={d.driverId}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs"
            >
              <span className="font-bold text-white">{d.driverName}</span>
              <span className="text-[10px] font-mono text-slate-400">({d.branchName})</span>
              {selectedIds.length > 2 && (
                <button
                  onClick={() => removeDriver(d.driverId)}
                  className="text-slate-500 hover:text-rose-400 ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* AI Comparative Executive Summary */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">Rangkuman Komparasi AI</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
          {comparison.comparisonNarrative}
        </p>
      </div>

      {/* Side-by-Side Comparison Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-[11px] font-mono text-slate-400">
                <th className="py-3 px-4 w-48">METRIK TELEMATIKA</th>
                {comparison.drivers.map((d) => (
                  <th key={d.driverId} className="py-3 px-4 text-center">
                    <div className="font-bold text-white">{d.driverName}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{d.vehicleType}</div>
                  </th>
                ))}
                <th className="py-3 px-4 text-center bg-cyan-950/20 text-cyan-400">
                  BENCHMARK ARMADA
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {/* Safety Score */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-sans font-semibold text-slate-200">
                  Safety Score (0-100)
                </td>
                {comparison.drivers.map((d) => (
                  <td key={d.driverId} className="py-3 px-4 text-center">
                    <span className="text-base font-bold text-emerald-400">{d.safetyScore}</span>
                  </td>
                ))}
                <td className="py-3 px-4 text-center text-cyan-300 font-bold bg-cyan-950/10">
                  {comparison.peerGroupAverages.safetyScore}
                </td>
              </tr>

              {/* Risk Score */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-sans font-semibold text-slate-200">
                  Risk Score (0-100)
                </td>
                {comparison.drivers.map((d) => (
                  <td key={d.driverId} className="py-3 px-4 text-center">
                    <span
                      className={`text-base font-bold ${
                        d.riskScore > 50 ? 'text-rose-400' : 'text-slate-300'
                      }`}
                    >
                      {d.riskScore}
                    </span>
                  </td>
                ))}
                <td className="py-3 px-4 text-center text-slate-400 font-bold bg-cyan-950/10">
                  {comparison.peerGroupAverages.riskScore}
                </td>
              </tr>

              {/* Performance Composite */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-sans font-semibold text-slate-200">
                  Performa Komposit 8-Faktor
                </td>
                {comparison.drivers.map((d) => (
                  <td key={d.driverId} className="py-3 px-4 text-center font-bold text-cyan-400">
                    {d.performanceScore}/100
                  </td>
                ))}
                <td className="py-3 px-4 text-center text-cyan-300 font-bold bg-cyan-950/10">
                  {comparison.peerGroupAverages.performanceScore}
                </td>
              </tr>

              {/* Overspeed */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-sans font-semibold text-slate-200">
                  Insiden Overspeed
                </td>
                {comparison.drivers.map((d) => (
                  <td key={d.driverId} className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        d.overspeedCount > 5
                          ? 'bg-rose-500/20 text-rose-300 font-bold'
                          : 'text-slate-300'
                      }`}
                    >
                      {d.overspeedCount}x
                    </span>
                  </td>
                ))}
                <td className="py-3 px-4 text-center text-slate-400 bg-cyan-950/10">
                  {comparison.peerGroupAverages.overspeedCount}x
                </td>
              </tr>

              {/* Harsh Braking */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-sans font-semibold text-slate-200">
                  Rem Mendadak (Harsh Braking)
                </td>
                {comparison.drivers.map((d) => (
                  <td key={d.driverId} className="py-3 px-4 text-center">
                    {d.harshBrakingCount}x
                  </td>
                ))}
                <td className="py-3 px-4 text-center text-slate-400 bg-cyan-950/10">
                  {comparison.peerGroupAverages.harshBrakingCount}x
                </td>
              </tr>

              {/* Harsh Accel */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-sans font-semibold text-slate-200">
                  Sentakan Gas (Harsh Accel)
                </td>
                {comparison.drivers.map((d) => (
                  <td key={d.driverId} className="py-3 px-4 text-center">
                    {d.harshAccelCount}x
                  </td>
                ))}
                <td className="py-3 px-4 text-center text-slate-400 bg-cyan-950/10">
                  {comparison.peerGroupAverages.harshAccelCount}x
                </td>
              </tr>

              {/* Sharp Turns */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-sans font-semibold text-slate-200">
                  Tikungan Tajam (Sharp Turn)
                </td>
                {comparison.drivers.map((d) => (
                  <td key={d.driverId} className="py-3 px-4 text-center">
                    {d.sharpTurnCount}x
                  </td>
                ))}
                <td className="py-3 px-4 text-center text-slate-400 bg-cyan-950/10">-</td>
              </tr>

              {/* Total Distance */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-sans font-semibold text-slate-200">
                  Jarak Tempuh Total
                </td>
                {comparison.drivers.map((d) => (
                  <td key={d.driverId} className="py-3 px-4 text-center text-slate-300">
                    {d.distanceKm.toLocaleString()} km
                  </td>
                ))}
                <td className="py-3 px-4 text-center text-slate-400 bg-cyan-950/10">
                  {comparison.peerGroupAverages.distanceKm.toLocaleString()} km
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
