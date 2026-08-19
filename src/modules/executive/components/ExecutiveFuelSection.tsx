/**
 * Fleet Intelligence Smart AI - Executive Fuel Section
 * PROMPT 38 - Fuel Cost, Liters, KM/L, Cost/KM & Fuel Anomaly Detection
 */

import React from 'react';
import { useExecutive } from '../context/ExecutiveContext';
import {
  Fuel,
  TrendingUp,
  AlertTriangle,
  Flame,
  Droplet,
  ShieldAlert,
  Search,
  CheckCircle2,
} from 'lucide-react';

export const ExecutiveFuelSection: React.FC = () => {
  const { fuel } = useExecutive();

  const formatIdr = (val: number) => {
    return 'Rp ' + Math.round(val).toLocaleString('id-ID');
  };

  return (
    <div className="bg-white rounded-2xl p-5 lg:p-6 border border-slate-200/80 shadow-sm">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
            <Fuel className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Fuel Economy & Telematics Loss Prevention
            </h3>
            <p className="text-xs text-slate-500">
              Konsumsi bahan bakar armada, rasio efisiensi KM/L, dan sistem deteksi dini pencurian BBM (Drain).
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
          <span>Rata-rata Konsumsi:</span>
          <strong className="text-amber-700 font-bold text-sm">{fuel.avgKmLiter} KM/Liter</strong>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 my-5">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Total Biaya Solar (BBM)
          </span>
          <div className="text-xl lg:text-2xl font-black text-slate-900 mt-1">
            {formatIdr(fuel.totalFuelCost)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">39% dari total biaya operasi</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Volume Konsumsi Solar
          </span>
          <div className="text-xl lg:text-2xl font-black text-slate-900 mt-1">
            {fuel.totalLiters.toLocaleString('id-ID')}
            <span className="text-xs text-slate-400 font-normal ml-1">Liter</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Efisiensi +3.5% MoM</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Biaya BBM Per Kilometer
          </span>
          <div className="text-xl lg:text-2xl font-black text-slate-900 mt-1">
            {formatIdr(fuel.avgCostPerKm)}
            <span className="text-xs text-slate-400 font-normal ml-1">/KM</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Benchmark: Rp 1.300/KM</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Fuel Anomalies Detected
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl lg:text-2xl font-black text-amber-700">{fuel.fuelAnomaliesCount}</span>
            <span className="text-xs text-slate-400 font-normal">kasus</span>
          </div>
          <p className="text-[11px] text-rose-600 font-medium mt-1">
            {fuel.theftRiskCount} Dugaan Solar Drain
          </p>
        </div>
      </div>

      {/* Fuel Anomalies Detected List */}
      {fuel.anomaliesList.length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-3 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            Daftar Anomali Sensor Bahan Bakar Terpantau AI
          </span>

          <div className="space-y-2.5">
            {fuel.anomaliesList.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-amber-50/40 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <span className="p-2 bg-amber-100 text-amber-700 rounded-lg shrink-0 mt-0.5">
                    <Droplet className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{item.plateNumber}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-200/60 text-amber-800 font-bold">
                        {item.type}
                      </span>
                      <span className="text-[11px] text-slate-500">• {item.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-700 mt-1 font-medium">{item.label}</p>
                    <span className="text-[11px] text-rose-600 font-semibold mt-0.5 block">
                      Estimasi Dampak: {item.litersEstimated} Liter ({formatIdr(item.costEstimatedIdr)})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${
                    item.status === 'INVESTIGATING'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
