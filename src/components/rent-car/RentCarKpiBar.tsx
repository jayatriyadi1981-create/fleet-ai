/**
 * Fleet Intelligence Smart AI - Rent Car KPI Metric Bar
 */

import React from 'react';
import { RentalFleetKPIs } from '../../modules/rent-car/types';
import { 
  Car, 
  KeyRound, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  DollarSign, 
  Lock, 
  TrendingUp 
} from 'lucide-react';

interface RentCarKpiBarProps {
  kpis: RentalFleetKPIs;
  onFilterStatus?: (status: string) => void;
}

export const RentCarKpiBar: React.FC<RentCarKpiBarProps> = ({ kpis, onFilterStatus }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* 1. Total Fleet */}
      <div 
        onClick={() => onFilterStatus && onFilterStatus('all')}
        className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-400">Total Unit Rental</span>
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
            <Car className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-xl font-bold text-white tracking-tight">{kpis.totalFleet}</span>
          <span className="text-[10px] text-slate-400 font-mono">Unit</span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400"></span>
          <span>{kpis.reservedFleet} Unit Dipesan</span>
        </div>
      </div>

      {/* 2. Available / Ready */}
      <div 
        onClick={() => onFilterStatus && onFilterStatus('available')}
        className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 hover:border-emerald-500/40 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-emerald-400">Siap Sewa (Ready)</span>
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-xl font-bold text-emerald-400 tracking-tight">{kpis.availableFleet}</span>
          <span className="text-[10px] text-slate-400 font-mono">Ready di Pool</span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
          <span className="text-emerald-400 font-medium">{Math.round((kpis.availableFleet / Math.max(1, kpis.totalFleet)) * 100)}%</span>
          <span>Kapasitas Pool</span>
        </div>
      </div>

      {/* 3. Active Rented (On-Road) */}
      <div 
        onClick={() => onFilterStatus && onFilterStatus('rented')}
        className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 hover:border-cyan-500/40 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-cyan-400">Sedang Jalan (Rented)</span>
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
            <KeyRound className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-xl font-bold text-cyan-400 tracking-tight">{kpis.rentedFleet}</span>
          <span className="text-[10px] text-slate-400 font-mono">In-Transit</span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
          <span className="text-cyan-400 font-medium">{kpis.fleetUtilizationRate}%</span>
          <span>Utilisasi Armada</span>
        </div>
      </div>

      {/* 4. Overdue Return */}
      <div 
        onClick={() => onFilterStatus && onFilterStatus('overdue')}
        className={`bg-slate-900/80 border rounded-xl p-3.5 transition-all cursor-pointer group ${
          kpis.overdueReturns > 0 
            ? 'border-rose-500/40 bg-rose-950/10 hover:border-rose-500' 
            : 'border-slate-800 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className={`text-[11px] font-medium ${kpis.overdueReturns > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
            Telat Kembali (Overdue)
          </span>
          <div className={`p-1.5 rounded-lg ${kpis.overdueReturns > 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-400'} group-hover:scale-110 transition-transform`}>
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className={`text-xl font-bold tracking-tight ${kpis.overdueReturns > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
            {kpis.overdueReturns}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Unit</span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
          <span className={kpis.overdueReturns > 0 ? 'text-rose-400 font-semibold' : 'text-slate-400'}>
            {kpis.overdueReturns > 0 ? 'Perlu Follow Up' : 'Semua Tepat Waktu'}
          </span>
        </div>
      </div>

      {/* 5. Security Deposits Escrow Held */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 hover:border-amber-500/40 transition-all group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-amber-400">Deposit Ditahan (Escrow)</span>
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
            <Lock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-base font-bold text-amber-300 tracking-tight">
            Rp {(kpis.securityDepositsHeldIdr / 1000000).toFixed(1)} jt
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
          <span className="text-amber-400 font-medium">Jaminan Risiko</span>
          <span>Pelanggan</span>
        </div>
      </div>

      {/* 6. Active Revenue / RevPAV */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 hover:border-purple-500/40 transition-all group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-purple-400">Pendapatan Rental</span>
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-base font-bold text-purple-300 tracking-tight">
            Rp {(kpis.totalMonthlyRevenueIdr / 1000000).toFixed(1)} jt
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
          <span className="text-purple-400 font-medium">RevPAV:</span>
          <span>Rp {(kpis.revPavIdr / 1000).toFixed(0)}k/unit</span>
        </div>
      </div>
    </div>
  );
};
