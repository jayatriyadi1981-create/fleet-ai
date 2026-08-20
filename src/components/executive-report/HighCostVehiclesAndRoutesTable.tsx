/**
 * Fleet Intelligence Smart AI - High Cost Vehicles & Routes Table
 * PROMPT 52 — Detailed Asset & Route Level Cost Transparency
 */

import React, { useState } from 'react';
import { Truck, Route, AlertTriangle, FileText, ChevronRight, ArrowUpRight, Search } from 'lucide-react';
import { HighCostVehicle, HighCostRoute } from '../../types/executiveReport';
import { ExecutiveKPIService } from '../../services/executiveReport/executiveKPIService';

interface HighCostVehiclesAndRoutesTableProps {
  vehicles: HighCostVehicle[];
  routes: HighCostRoute[];
  onViewEvidence: (evidenceIds: string[], title: string) => void;
}

export const HighCostVehiclesAndRoutesTable: React.FC<HighCostVehiclesAndRoutesTableProps> = ({
  vehicles,
  routes,
  onViewEvidence,
}) => {
  const [activeTab, setActiveTab] = useState<'vehicles' | 'routes'>('vehicles');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVehicles = vehicles.filter(v => 
    v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.brandModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.branchName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRoutes = routes.filter(r =>
    r.routeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-700/60 text-cyan-400">
            {activeTab === 'vehicles' ? <Truck className="w-5 h-5" /> : <Route className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>{activeTab === 'vehicles' ? 'Kendaraan dengan Biaya Tertinggi (Top Cost Vehicles)' : 'Koridor Rute Berbiaya Tinggi (High-Cost Routes)'}</span>
            </h2>
            <p className="text-xs text-slate-400">
              Identifikasi unit dan koridor pengiriman yang membutuhkan intervensi efisiensi
            </p>
          </div>
        </div>

        {/* Tab switcher and search */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab('vehicles')}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'vehicles'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Kendaraan ({vehicles.length})
            </button>
            <button
              onClick={() => setActiveTab('routes')}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'routes'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Rute ({routes.length})
            </button>
          </div>
        </div>
      </div>

      {/* Vehicles Table */}
      {activeTab === 'vehicles' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Kendaraan</th>
                <th className="py-3 px-3">Cabang & Grup</th>
                <th className="py-3 px-3 text-right">Total Biaya</th>
                <th className="py-3 px-3 text-right">Jarak Tempuh</th>
                <th className="py-3 px-3 text-right">Cost/km</th>
                <th className="py-3 px-3 text-right">BBM vs Maint</th>
                <th className="py-3 px-3 text-center">Utilisasi</th>
                <th className="py-3 px-4">Analisis AI & Penyebab</th>
                <th className="py-3 px-3 text-center">Bukti</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredVehicles.map(v => (
                <tr key={v.vehicleId} className="hover:bg-slate-800/40 transition-all">
                  <td className="py-3 px-3 font-semibold text-slate-100 whitespace-nowrap">
                    <div>{v.plateNumber}</div>
                    <div className="text-[11px] font-normal text-slate-400">{v.brandModel}</div>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div>{v.branchName}</div>
                    <div className="text-[11px] text-cyan-400 font-medium">{v.groupName}</div>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-100 whitespace-nowrap">
                    {ExecutiveKPIService.formatRupiah(v.totalCost)}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300 whitespace-nowrap">
                    {v.mileageKm.toLocaleString('id-ID')} km
                  </td>
                  <td className="py-3 px-3 text-right font-semibold whitespace-nowrap">
                    <span className={v.costPerKm > v.fleetAvgCostPerKm ? 'text-rose-400' : 'text-slate-300'}>
                      {ExecutiveKPIService.formatCostPerKm(v.costPerKm)}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-[11px] text-slate-400 whitespace-nowrap">
                    <div>BBM: {ExecutiveKPIService.formatRupiah(v.fuelCost)}</div>
                    <div>Maint: {ExecutiveKPIService.formatRupiah(v.maintenanceCost)}</div>
                  </td>
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span className="font-semibold text-emerald-400">{v.utilizationPercent}%</span>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-300 max-w-xs leading-relaxed">
                    {v.aiExplanation}
                  </td>
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <button
                      onClick={() => onViewEvidence(v.evidenceIds, `Bukti Analisis Unit ${v.plateNumber}`)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-all border border-slate-700"
                      title="Lihat bukti data"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Routes Table */}
      {activeTab === 'routes' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Nama Rute</th>
                <th className="py-3 px-3 text-right">Jarak Rute</th>
                <th className="py-3 px-3 text-right">Ritase Trip</th>
                <th className="py-3 px-3 text-right">Total Biaya</th>
                <th className="py-3 px-3 text-right">Cost/km</th>
                <th className="py-3 px-3 text-center">On-Time SLA</th>
                <th className="py-3 px-3 text-right">Rata Keterlambatan</th>
                <th className="py-3 px-4">Analisis Efisiensi AI</th>
                <th className="py-3 px-3 text-center">Bukti</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredRoutes.map(r => (
                <tr key={r.routeId} className="hover:bg-slate-800/40 transition-all">
                  <td className="py-3 px-3 font-semibold text-slate-100">
                    <div>{r.routeName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{r.routeId}</div>
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300 whitespace-nowrap">
                    {r.distanceKm} km
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-slate-200 whitespace-nowrap">
                    {r.tripCount} trip
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-100 whitespace-nowrap">
                    {ExecutiveKPIService.formatRupiah(r.totalCost)}
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-cyan-400 whitespace-nowrap">
                    {ExecutiveKPIService.formatCostPerKm(r.costPerKm)}
                  </td>
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span className="font-semibold text-emerald-400">{r.onTimePercent}%</span>
                  </td>
                  <td className="py-3 px-3 text-right text-amber-400 font-medium whitespace-nowrap">
                    +{r.delayMinutes} menit
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-300 max-w-xs leading-relaxed">
                    {r.aiInsight}
                  </td>
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <button
                      onClick={() => onViewEvidence(r.evidenceIds, `Bukti Efisiensi Rute ${r.routeName}`)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-all border border-slate-700"
                      title="Lihat data bukti"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
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
