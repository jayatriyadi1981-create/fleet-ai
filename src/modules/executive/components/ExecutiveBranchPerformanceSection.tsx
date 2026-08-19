/**
 * Fleet Intelligence Smart AI - Executive Branch Performance Section
 * PROMPT 38 - Multi-branch ranking, cost per KM benchmark, and operational KPI comparison
 */

import React from 'react';
import { useExecutive } from '../context/ExecutiveContext';
import {
  Building2,
  Trophy,
  TrendingUp,
  MapPin,
  Truck,
  CheckCircle2,
} from 'lucide-react';

export const ExecutiveBranchPerformanceSection: React.FC = () => {
  const { branchesPerformance } = useExecutive();

  const formatIdr = (val: number) => {
    return 'Rp ' + Math.round(val).toLocaleString('id-ID');
  };

  return (
    <div className="bg-white rounded-2xl p-5 lg:p-6 border border-slate-200/80 shadow-sm">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Branch & Depot Executive Benchmarking
            </h3>
            <p className="text-xs text-slate-500">
              Evaluasi kinerja komparatif antar cabang depo: utilisasi, efisiensi biaya, keselamatan, dan skor gabungan.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Top Performing: <strong className="text-slate-900">{branchesPerformance[0]?.branchName || 'Cabang Jakarta'}</strong></span>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <th className="py-3 px-3.5 font-bold text-center w-12">Rank</th>
              <th className="py-3 px-3 font-bold">Nama Cabang / Depo</th>
              <th className="py-3 px-3 font-bold text-center">Jumlah Unit</th>
              <th className="py-3 px-3 font-bold">Utilisasi Armada</th>
              <th className="py-3 px-3 font-bold">Cost / KM</th>
              <th className="py-3 px-3 font-bold text-center">Skor Safety</th>
              <th className="py-3 px-3 font-bold">Konsumsi BBM</th>
              <th className="py-3 px-3.5 font-bold text-center">Skor Eksekutif</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {branchesPerformance.map((b) => (
              <tr key={b.branchId} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-3.5 text-center">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black ${
                      b.rank === 1
                        ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-400'
                        : b.rank === 2
                        ? 'bg-slate-200 text-slate-800'
                        : b.rank === 3
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {b.rank}
                  </span>
                </td>
                <td className="py-3.5 px-3">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {b.branchName}
                  </div>
                </td>
                <td className="py-3.5 px-3 text-center font-semibold text-slate-700">
                  {b.fleetCount} unit
                </td>
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full"
                        style={{ width: `${b.utilizationPct}%` }}
                      ></div>
                    </div>
                    <span className="font-bold text-slate-800">{b.utilizationPct}%</span>
                  </div>
                </td>
                <td className="py-3.5 px-3 font-semibold text-slate-900">
                  {formatIdr(b.costPerKmIdr)}
                </td>
                <td className="py-3.5 px-3 text-center">
                  <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    {b.safetyScore}/100
                  </span>
                </td>
                <td className="py-3.5 px-3 font-medium text-amber-800">
                  {b.fuelEfficiencyKmL} KM/L
                </td>
                <td className="py-3.5 px-3.5 text-center">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-black ${
                      b.overallScore >= 90
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : b.overallScore >= 85
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {b.overallScore} / 100
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
