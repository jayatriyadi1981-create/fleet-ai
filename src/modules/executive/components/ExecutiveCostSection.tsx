/**
 * Fleet Intelligence Smart AI - Executive Cost Section
 * PROMPT 38 - Total Operating Cost (TOC), Cost/KM, Cost Breakdown & Budget Variance Analysis
 */

import React from 'react';
import { useExecutive } from '../context/ExecutiveContext';
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  PiggyBank,
  Fuel,
  Wrench,
  Users,
  CreditCard,
  Shield,
  FileCheck,
  Radio,
  ArrowRight,
} from 'lucide-react';

export const ExecutiveCostSection: React.FC = () => {
  const { cost } = useExecutive();

  const formatIdr = (val: number) => {
    return 'Rp ' + Math.round(val).toLocaleString('id-ID');
  };

  const b = cost.costBreakdown;
  const total = cost.totalOperatingCost || 1;

  const categories = [
    { label: 'BBM (Fuel)', amount: b.fuel, pct: Math.round((b.fuel / total) * 100), color: 'bg-amber-500', icon: Fuel },
    { label: 'Maintenance & Spareparts', amount: b.maintenance, pct: Math.round((b.maintenance / total) * 100), color: 'bg-rose-500', icon: Wrench },
    { label: 'Uang Jalan & Driver Allowance', amount: b.driver, pct: Math.round((b.driver / total) * 100), color: 'bg-blue-500', icon: Users },
    { label: 'Tol & Parkir Operasional', amount: b.toll, pct: Math.round((b.toll / total) * 100), color: 'bg-indigo-500', icon: CreditCard },
    { label: 'Asuransi Kendaraan & Kargo', amount: b.insurance, pct: Math.round((b.insurance / total) * 100), color: 'bg-emerald-500', icon: Shield },
    { label: 'Pajak STNK & KIR Legalitas', amount: b.tax, pct: Math.round((b.tax / total) * 100), color: 'bg-purple-500', icon: FileCheck },
    { label: 'Telematika GPS & IoT SIM', amount: b.gps, pct: Math.round((b.gps / total) * 100), color: 'bg-cyan-500', icon: Radio },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 lg:p-6 border border-slate-200/80 shadow-sm">
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Total Operating Cost (TOC / TCO)
            </h3>
            <p className="text-xs text-slate-500">
              Analisis struktur biaya pengoperasian armada, efisiensi unit ritase, dan kepatuhan anggaran.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
          <span>Cost / KM Nasional:</span>
          <strong className="text-emerald-700 font-bold text-sm">{formatIdr(cost.costPerKm)}</strong>
        </div>
      </div>

      {/* Cost Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 my-5">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Total Biaya Operasional
          </span>
          <div className="text-xl lg:text-2xl font-black text-slate-900 mt-1">
            {formatIdr(cost.totalOperatingCost)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>-4.2% vs periode lalu</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Cost Per Kilometer (KM)
          </span>
          <div className="text-xl lg:text-2xl font-black text-slate-900 mt-1">
            {formatIdr(cost.costPerKm)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Rata-rata armada kargo</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Cost Per Trip (Ritase)
          </span>
          <div className="text-xl lg:text-2xl font-black text-slate-900 mt-1">
            {formatIdr(cost.costPerTrip)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Total 485 trip selesai</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Cost Per Vehicle (Unit)
          </span>
          <div className="text-xl lg:text-2xl font-black text-slate-900 mt-1">
            {formatIdr(cost.costPerVehicle)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Alokasi rata-rata per bulan</p>
        </div>
      </div>

      {/* Cost Breakdown Multi-Bar & Category List */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2.5">
          Struktur Distribusi Biaya Operasional (TOC Breakdown)
        </span>

        {/* Stacked Percentage Bar */}
        <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100 mb-4 shadow-inner">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className={`${cat.color} transition-all`}
              style={{ width: `${cat.pct}%` }}
              title={`${cat.label}: ${cat.pct}% (${formatIdr(cat.amount)})`}
            ></div>
          ))}
        </div>

        {/* Categories Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50/60 border border-slate-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`}></span>
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block line-clamp-1">
                      {cat.label}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {formatIdr(cat.amount)}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {cat.pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cost Alerts Banner */}
      {cost.costAlerts && cost.costAlerts.length > 0 && (
        <div className="mt-5 p-4 rounded-xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-amber-900 block">
                Executive Cost Alert & Deviasi Anggaran
              </span>
              <ul className="text-xs text-amber-800 mt-1 space-y-0.5 list-disc list-inside">
                {cost.costAlerts.map((alert, idx) => (
                  <li key={idx}>{alert}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
