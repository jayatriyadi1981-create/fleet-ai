/**
 * Fleet Intelligence Smart AI - Executive Maintenance Section
 * PROMPT 38 - Maintenance Costs, Overdue Servicing, Breakdowns, and Health Classification
 */

import React from 'react';
import { useExecutive } from '../context/ExecutiveContext';
import {
  Wrench,
  Clock,
  AlertTriangle,
  AlertOctagon,
  ShieldCheck,
  TrendingDown,
  Hammer,
  RotateCcw,
} from 'lucide-react';

export const ExecutiveMaintenanceSection: React.FC = () => {
  const { maintenance } = useExecutive();

  const formatIdr = (val: number) => {
    return 'Rp ' + Math.round(val).toLocaleString('id-ID');
  };

  const cost = maintenance.costBreakdown;
  const totalCost = maintenance.totalMaintenanceCost || 1;

  const prevPct = Math.round((cost.preventive / totalCost) * 100);
  const corrPct = Math.round((cost.corrective / totalCost) * 100);
  const emergPct = Math.round((cost.emergency / totalCost) * 100);

  return (
    <div className="bg-white rounded-2xl p-5 lg:p-6 border border-slate-200/80 shadow-sm">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Maintenance Health & Workshop Cost Allocation
            </h3>
            <p className="text-xs text-slate-500">
              Rasio servis preventif vs darurat, status kelaikan jalan unit armada, dan downtime bengkel.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
          <span>Rasio Servis Preventif:</span>
          <strong className="text-emerald-700 font-bold text-sm">{prevPct}%</strong>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 my-5">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Total Biaya Bengkel
          </span>
          <div className="text-xl font-black text-slate-900 mt-1">
            {formatIdr(maintenance.totalMaintenanceCost)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Suku cadang & jasa</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Servis Due Soon
          </span>
          <div className="text-xl font-black text-blue-700 mt-1">
            {maintenance.vehiclesDueSoonCount}
            <span className="text-xs text-slate-400 font-normal ml-1">unit</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">&lt;500 KM jadwal servis</p>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/70">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
            Servis Overdue
          </span>
          <div className="text-xl font-black text-amber-700 mt-1">
            {maintenance.vehiclesOverdueCount}
            <span className="text-xs text-slate-400 font-normal ml-1">unit</span>
          </div>
          <p className="text-[11px] text-amber-700 font-medium mt-1">Perlu slot bengkel</p>
        </div>

        <div className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-200/70">
          <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block">
            Breakdowns (Mogok)
          </span>
          <div className="text-xl font-black text-rose-700 mt-1">
            {maintenance.breakdownsCount}
            <span className="text-xs text-slate-400 font-normal ml-1">kejadian</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">-50% vs rata-rata</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Total Downtime
          </span>
          <div className="text-xl font-black text-slate-900 mt-1">
            {maintenance.downtimeHours}
            <span className="text-xs text-slate-400 font-normal ml-1">Jam</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Rata-rata 1.2 jam/unit</p>
        </div>
      </div>

      {/* Maintenance Split by Category Bar */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2.5">
          Komposisi Pengeluaran Pemeliharaan (Preventif vs Korektif vs Darurat)
        </span>

        <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100 mb-3 shadow-inner">
          <div
            className="bg-emerald-500 transition-all"
            style={{ width: `${prevPct}%` }}
            title={`Preventif: ${prevPct}% (${formatIdr(cost.preventive)})`}
          ></div>
          <div
            className="bg-amber-500 transition-all"
            style={{ width: `${corrPct}%` }}
            title={`Korektif: ${corrPct}% (${formatIdr(cost.corrective)})`}
          ></div>
          <div
            className="bg-rose-500 transition-all"
            style={{ width: `${emergPct}%` }}
            title={`Darurat: ${emergPct}% (${formatIdr(cost.emergency)})`}
          ></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-900 block">Preventive Maintenance</span>
              <span className="text-xs text-emerald-700">{formatIdr(cost.preventive)}</span>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
              {prevPct}%
            </span>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-900 block">Corrective Maintenance</span>
              <span className="text-xs text-amber-700">{formatIdr(cost.corrective)}</span>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-white px-2 py-0.5 rounded border border-amber-200">
              {corrPct}%
            </span>
          </div>

          <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-rose-900 block">Emergency Repair & Towing</span>
              <span className="text-xs text-rose-700">{formatIdr(cost.emergency)}</span>
            </div>
            <span className="text-xs font-bold text-rose-800 bg-white px-2 py-0.5 rounded border border-rose-200">
              {emergPct}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
