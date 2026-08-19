/**
 * Fleet Intelligence Smart AI - Fuel Consumption Tab
 * PROMPT 24 - Vehicle Fuel Efficiency Analysis, km/L, L/100km, Variance & Efficiency Scores
 */

import React from 'react';
import { TrendingUp, AlertTriangle, CheckCircle2, Award, ArrowUpRight } from 'lucide-react';
import { FuelConsumption } from '../../types';

interface ConsumptionTabProps {
  consumptions: FuelConsumption[];
  onOpenVehicleModal: (vehicleId: string) => void;
}

export const ConsumptionTab: React.FC<ConsumptionTabProps> = ({
  consumptions,
  onOpenVehicleModal,
}) => {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" /> Analisis Efisiensi Konsumsi BBM (km/L & L/100km)
            </h3>
            <p className="text-xs text-slate-400">
              Evaluasi konsumsi BBM riil per kendaraan dibandingkan baseline efisiensi grup.
            </p>
          </div>
          <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-3 py-1 rounded-full">
            Toleransi Standar: ±15%
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Kendaraan</th>
                <th className="p-4">Pengemudi</th>
                <th className="p-4">Jarak (KM)</th>
                <th className="p-4">BBM Terpakai (L)</th>
                <th className="p-4">Efisiensi (KM/L)</th>
                <th className="p-4">Acuan L/100km</th>
                <th className="p-4">Biaya (IDR)</th>
                <th className="p-4">Cost / KM</th>
                <th className="p-4">Skor Efisiensi</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {consumptions.map((c) => {
                const isBoros = (c.variancePct || 0) < -15;
                return (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-all">
                    <td className="p-4 font-bold text-white">{c.vehiclePlate}</td>
                    <td className="p-4">{c.driverName || 'N/A'}</td>
                    <td className="p-4 font-medium">{c.distance.toLocaleString('id-ID')} KM</td>
                    <td className="p-4 font-bold text-cyan-300">{c.fuelConsumed} Liter</td>
                    <td className="p-4">
                      <span className={`font-bold ${isBoros ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {c.consumptionKmPerLiter} KM/L
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{c.consumptionLiterPer100Km} L/100km</td>
                    <td className="p-4 font-semibold text-white">Rp {c.fuelCost.toLocaleString('id-ID')}</td>
                    <td className="p-4 text-slate-300">Rp {c.costPerKm} / KM</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white">{c.efficiencyScore || 85}/100</span>
                        {isBoros ? (
                          <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => onOpenVehicleModal(c.vehicleId)}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px]"
                      >
                        Analisis
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
