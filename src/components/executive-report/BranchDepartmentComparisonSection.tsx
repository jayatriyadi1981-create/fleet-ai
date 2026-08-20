/**
 * Fleet Intelligence Smart AI - Branch & Department Comparison Section
 * PROMPT 52 — Multi-Branch and Departmental Performance Benchmark & Cost Allocation
 */

import React, { useState } from 'react';
import { Building2, Layers, TrendingUp, TrendingDown, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { ExecutiveBranchComparison, ExecutiveDepartmentComparison } from '../../types/executiveReport';
import { ExecutiveKPIService } from '../../services/executiveReport/executiveKPIService';

interface BranchDepartmentComparisonSectionProps {
  branches: ExecutiveBranchComparison[];
  departments: ExecutiveDepartmentComparison[];
}

export const BranchDepartmentComparisonSection: React.FC<BranchDepartmentComparisonSectionProps> = ({
  branches,
  departments,
}) => {
  const [activeTab, setActiveTab] = useState<'branch' | 'department'>('branch');

  const getStatusBadge = (status: 'optimal' | 'attention_needed' | 'high_cost') => {
    switch (status) {
      case 'optimal':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40';
      case 'attention_needed':
        return 'text-amber-400 bg-amber-950/60 border-amber-800/40';
      case 'high_cost':
        return 'text-rose-400 bg-rose-950/60 border-rose-800/40';
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-indigo-950/80 border border-indigo-700/60 text-indigo-400">
            {activeTab === 'branch' ? <Building2 className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>{activeTab === 'branch' ? 'Benchmark Kinerja Antar Cabang (Branch Comparison)' : 'Alokasi Biaya Departemen & Cost Center'}</span>
            </h2>
            <p className="text-xs text-slate-400">
              Perbandingan cost/km, utilisasi, dan efisiensi konsumsi antar hub operasional
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('branch')}
            className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'branch' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Antar Cabang ({branches.length})
          </button>
          <button
            onClick={() => setActiveTab('department')}
            className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'department' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cost Center ({departments.length})
          </button>
        </div>
      </div>

      {/* Branch Table */}
      {activeTab === 'branch' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Nama Cabang / Hub</th>
                <th className="py-3 px-3 text-center">Unit Armada</th>
                <th className="py-3 px-3 text-right">Total Biaya Realisasi</th>
                <th className="py-3 px-3 text-right">Cost/km</th>
                <th className="py-3 px-3 text-center">Utilisasi</th>
                <th className="py-3 px-3 text-center">Safety Score</th>
                <th className="py-3 px-3 text-center">Konsumsi BBM</th>
                <th className="py-3 px-3 text-right">Deviasi vs Rata2</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {branches.map(b => (
                <tr key={b.branchId} className="hover:bg-slate-800/40 transition-all">
                  <td className="py-3 px-3 font-semibold text-slate-100">
                    <div>{b.branchName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{b.branchId}</div>
                  </td>
                  <td className="py-3 px-3 text-center font-medium text-slate-200">
                    {b.totalVehicles} unit
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-100">
                    {ExecutiveKPIService.formatRupiah(b.totalCost)}
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-cyan-400">
                    {ExecutiveKPIService.formatCostPerKm(b.costPerKm)}
                  </td>
                  <td className="py-3 px-3 text-center font-medium text-emerald-400">
                    {b.utilizationPercent}%
                  </td>
                  <td className="py-3 px-3 text-center font-medium text-slate-200">
                    {b.safetyScore}/100
                  </td>
                  <td className="py-3 px-3 text-center text-slate-300">
                    {b.fuelEfficiencyKmPerL} km/L
                  </td>
                  <td className="py-3 px-3 text-right font-semibold">
                    <span className={b.varianceVsCompanyAvgPercent > 0 ? 'text-rose-400' : 'text-emerald-400'}>
                      {b.varianceVsCompanyAvgPercent > 0 ? `+${b.varianceVsCompanyAvgPercent}%` : `${b.varianceVsCompanyAvgPercent}%`}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getStatusBadge(b.status)}`}>
                      {b.status === 'optimal' ? 'Efisien' : b.status === 'attention_needed' ? 'Perlu Review' : 'High Cost'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Department Table */}
      {activeTab === 'department' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Departemen & Divisi</th>
                <th className="py-3 px-3">Cost Center Code</th>
                <th className="py-3 px-3 text-center">Alokasi Unit</th>
                <th className="py-3 px-3 text-right">Total Beban Operasional</th>
                <th className="py-3 px-3 text-right">Cost Per Km</th>
                <th className="py-3 px-3 text-center">Rasio Utilisasi</th>
                <th className="py-3 px-3 text-center">Safety Index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {departments.map(d => (
                <tr key={d.costCenterCode} className="hover:bg-slate-800/40 transition-all">
                  <td className="py-3 px-3 font-semibold text-slate-100">
                    {d.departmentName}
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-mono">{d.costCenterCode}</td>
                  <td className="py-3 px-3 text-center font-medium text-slate-200">
                    {d.vehicleCount} unit
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-100">
                    {ExecutiveKPIService.formatRupiah(d.totalCost)}
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-cyan-400">
                    {ExecutiveKPIService.formatCostPerKm(d.costPerKm)}
                  </td>
                  <td className="py-3 px-3 text-center font-medium text-emerald-400">
                    {d.utilizationPercent}%
                  </td>
                  <td className="py-3 px-3 text-center font-medium text-slate-200">
                    {d.safetyScore}/100
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
