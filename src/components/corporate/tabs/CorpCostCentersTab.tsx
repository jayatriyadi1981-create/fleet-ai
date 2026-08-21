import React, { useState } from 'react';
import {
  DollarSign,
  PieChart,
  BarChart3,
  Building,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';

export const CorpCostCentersTab: React.FC = () => {
  const costCenters = [
    {
      code: 'CC-BOD-001',
      division: 'Board of Directors (BOD & C-Level)',
      assignedFleetCount: 2,
      monthlyBudgetLimitIdr: 45000000,
      currentExpenseIdr: 38200000,
      breakdown: {
        leaseFee: 28500000,
        fuel: 4800000,
        toll: 1900000,
        driverOvertime: 3000000,
      },
      status: 'WITHIN_BUDGET',
    },
    {
      code: 'CC-SALES-102',
      division: 'Commercial & Corporate Sales',
      assignedFleetCount: 3,
      monthlyBudgetLimitIdr: 30000000,
      currentExpenseIdr: 26800000,
      breakdown: {
        leaseFee: 13600000,
        fuel: 7500000,
        toll: 3200000,
        driverOvertime: 2500000,
      },
      status: 'WITHIN_BUDGET',
    },
    {
      code: 'CC-IT-105',
      division: 'Enterprise IT & Infrastructure',
      assignedFleetCount: 1,
      monthlyBudgetLimitIdr: 18000000,
      currentExpenseIdr: 14200000,
      breakdown: {
        leaseFee: 11200000,
        fuel: 1800000,
        toll: 1200000,
        driverOvertime: 0,
      },
      status: 'WITHIN_BUDGET',
    },
    {
      code: 'CC-HR-501',
      division: 'Human Resources & General Affairs',
      assignedFleetCount: 2,
      monthlyBudgetLimitIdr: 25000000,
      currentExpenseIdr: 21500000,
      breakdown: {
        leaseFee: 0, // Owned HiAce & Pool
        fuel: 8500000,
        toll: 4200000,
        driverOvertime: 8800000,
      },
      status: 'WITHIN_BUDGET',
    }
  ];

  return (
    <div id="corp-cost-centers-tab" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs text-blue-400 font-mono font-bold uppercase tracking-wider">
            DIVISIONAL COST CENTER ALLOCATION & EXPENSE BUDGETING
          </span>
          <h3 className="text-lg font-bold text-white mt-1">
            Alokasi Beban Operasional Kendaraan per Cost Center Divisi
          </h3>
          <p className="text-xs text-slate-400">
            Pembebanan biaya sewa lease, konsumsi BBM, saldo e-Toll, dan lembur supir ke masing-masing akun anggaran divisi perusahaan.
          </p>
        </div>

        <button
          onClick={() => alert('Download Laporan Beban Kendaraan Format Excel untuk Jurnal Finance SAP/Oracle')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow"
        >
          <FileSpreadsheet className="w-4 h-4" /> Export Jurnal Beban (Excel)
        </button>
      </div>

      {/* Cost Center Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {costCenters.map(cc => {
          const usagePercent = Math.round((cc.currentExpenseIdr / cc.monthlyBudgetLimitIdr) * 100);
          return (
            <div key={cc.code} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">{cc.division}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono">{cc.code} • {cc.assignedFleetCount} Unit Armada</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-bold font-mono">
                  {usagePercent}% Terpakai
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Realisasi Beban Bulan Ini:</span>
                  <span className="font-bold font-mono text-slate-900">
                    Rp {cc.currentExpenseIdr.toLocaleString('id-ID')} / Rp {cc.monthlyBudgetLimitIdr.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${usagePercent > 90 ? 'bg-rose-500' : 'bg-blue-600'}`}
                    style={{ width: `${Math.min(usagePercent, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500">Biaya Sewa Unit:</span>
                  <p className="font-bold text-slate-800 font-mono mt-0.5">Rp {cc.breakdown.leaseFee.toLocaleString('id-ID')}</p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500">BBM & Listrik EV:</span>
                  <p className="font-bold text-slate-800 font-mono mt-0.5">Rp {cc.breakdown.fuel.toLocaleString('id-ID')}</p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500">Gerbang Tol:</span>
                  <p className="font-bold text-slate-800 font-mono mt-0.5">Rp {cc.breakdown.toll.toLocaleString('id-ID')}</p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500">Lembur Supir Pool:</span>
                  <p className="font-bold text-slate-800 font-mono mt-0.5">Rp {cc.breakdown.driverOvertime.toLocaleString('id-ID')}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
