/**
 * Fleet Intelligence Smart AI - Delivery KPI Dashboard Bar
 */

import React from 'react';
import { DeliveryKPIs } from '../deliveryTypes';
import {
  PackageCheck,
  Truck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  TrendingUp,
} from 'lucide-react';

interface DeliveryKpiBarProps {
  kpis: DeliveryKPIs;
  onFilterByStatus?: (status: string) => void;
}

export const DeliveryKpiBar: React.FC<DeliveryKpiBarProps> = ({ kpis, onFilterByStatus }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {/* Total Deliveries */}
      <div
        onClick={() => onFilterByStatus?.('ALL')}
        className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200">
            Total Deliveries
          </span>
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg group-hover:scale-105 transition-transform">
            <PackageCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold text-white">{kpis.totalDeliveries}</span>
          <span className="text-[10px] text-slate-400">Total Hari Ini</span>
        </div>
      </div>

      {/* In Transit */}
      <div
        onClick={() => onFilterByStatus?.('OUT_FOR_DELIVERY')}
        className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200">
            Dalam Perjalanan
          </span>
          <div className="p-2 bg-sky-500/10 text-sky-400 rounded-lg group-hover:scale-105 transition-transform">
            <Truck className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold text-sky-400">{kpis.inTransitCount}</span>
          <span className="text-[10px] text-sky-400/80">Active On Route</span>
        </div>
      </div>

      {/* Delivered Success */}
      <div
        onClick={() => onFilterByStatus?.('DELIVERED')}
        className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200">
            Selesai Terkirim
          </span>
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg group-hover:scale-105 transition-transform">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold text-emerald-400">{kpis.deliveredCount}</span>
          <span className="text-[10px] text-emerald-400/80">{kpis.successRatePercentage}% Success</span>
        </div>
      </div>

      {/* On-Time SLA */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400">On-Time SLA %</span>
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold text-amber-400">{kpis.onTimePercentage}%</span>
          <span className="flex items-center gap-0.5 text-[10px] text-emerald-400">
            <TrendingUp className="w-3 h-3" /> +1.2%
          </span>
        </div>
      </div>

      {/* Failed / At Risk */}
      <div
        onClick={() => onFilterByStatus?.('FAILED')}
        className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200">
            Gagal / Berisiko
          </span>
          <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg group-hover:scale-105 transition-transform">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold text-rose-400">{kpis.failedCount}</span>
          <span className="text-[10px] text-rose-400/80">Perlu Tindakan</span>
        </div>
      </div>

      {/* POD Completion % */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400">POD Kelengkapan</span>
          <div className="p-2 bg-teal-500/10 text-teal-400 rounded-lg">
            <FileCheck2 className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold text-teal-400">{kpis.podCompletionPercentage}%</span>
          <span className="text-[10px] text-slate-400">Digital POD</span>
        </div>
      </div>
    </div>
  );
};
