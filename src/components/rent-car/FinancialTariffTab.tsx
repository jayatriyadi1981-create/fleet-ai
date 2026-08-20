/**
 * Fleet Intelligence Smart AI - Rental Tariff Matrix & Deposit Escrow Financials
 */

import React, { useState } from 'react';
import { RentalVehicle, RentalFleetKPIs } from '../../modules/rent-car/types';
import { 
  DollarSign, 
  Lock, 
  ShieldCheck, 
  TrendingUp, 
  Percent, 
  Layers, 
  Car, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Tag 
} from 'lucide-react';

interface FinancialTariffTabProps {
  vehicles: RentalVehicle[];
  kpis: RentalFleetKPIs;
}

export const FinancialTariffTab: React.FC<FinancialTariffTabProps> = ({ vehicles, kpis }) => {
  return (
    <div className="space-y-5">
      {/* Top Financial Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Pendapatan Sewa Bulanan</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-bold font-mono text-emerald-400">
            Rp {kpis.totalMonthlyRevenueIdr.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Estimasi Gross Rental Billing</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Deposit Keamanan Escrow (Aktif)</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-bold font-mono text-amber-300">
            Rp {kpis.securityDepositsHeldIdr.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Ditahan di Rekening Escrow Penjamin</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">RevPAV (Per Available Vehicle)</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-bold font-mono text-purple-300">
            Rp {kpis.revPavIdr.toLocaleString('id-ID')} /unit
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Rata-rata Pendapatan per Armada</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Tingkat Utilisasi Armada</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-bold font-mono text-cyan-300">
            {kpis.fleetUtilizationRate}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{kpis.rentedFleet} dari {kpis.totalFleet} unit tersewa</div>
        </div>
      </div>

      {/* Tariff Rate Card Matrix */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Matriks Tarif Sewa & Ketentuan Deposit Armada
            </h3>
          </div>
          <span className="text-xs text-slate-400">Pembaruan Regulasi Tarif: 2026-Q1</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/70 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
              <tr>
                <th className="p-3.5">Kategori & Model Armada</th>
                <th className="p-3.5">Lepas Kunci (24 Jam)</th>
                <th className="p-3.5">+ Sopir Profesional (12 Jam)</th>
                <th className="p-3.5">Paket All-In (BBM+Tol)</th>
                <th className="p-3.5">Deposit Jaminan Escrow</th>
                <th className="p-3.5">Denda Overtime (Per Jam)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {vehicles.map((v) => (
                <tr key={v.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-white">{v.brand} {v.model}</div>
                    <div className="text-[11px] font-mono text-cyan-400">{v.plateNumber} • {v.category.toUpperCase()}</div>
                  </td>

                  <td className="p-3.5 font-mono">
                    <div className="font-bold text-emerald-400">Rp {v.pricing.dailyRate.toLocaleString('id-ID')}</div>
                    <div className="text-[10px] text-slate-400">/24 Jam</div>
                  </td>

                  <td className="p-3.5 font-mono">
                    <div className="font-bold text-cyan-400">Rp {v.pricing.withDriverDailyRate.toLocaleString('id-ID')}</div>
                    <div className="text-[10px] text-slate-400">/12 Jam Layanan</div>
                  </td>

                  <td className="p-3.5 font-mono">
                    <div className="font-bold text-purple-400">Rp {v.pricing.allInDailyRate.toLocaleString('id-ID')}</div>
                    <div className="text-[10px] text-slate-400">Driver + BBM + Tol</div>
                  </td>

                  <td className="p-3.5 font-mono">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold">
                      Rp {v.pricing.depositAmount.toLocaleString('id-ID')}
                    </span>
                  </td>

                  <td className="p-3.5 font-mono text-rose-400 font-semibold">
                    Rp {v.pricing.overtimeHourlyRate.toLocaleString('id-ID')} /jam
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
