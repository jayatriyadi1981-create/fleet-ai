/**
 * Fleet Intelligence Smart AI - Vehicle Cost Profile & TCO Intelligence View
 * PROMPT 37 - Total Cost of Ownership (TCO), Depreciation & Efficiency Scorecard
 */

import React, { useState, useMemo } from 'react';
import {
  Truck,
  DollarSign,
  Gauge,
  Wrench,
  Fuel,
  Award,
  Search,
  Calendar,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Shield,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { useCost } from '../../context/CostContext';
import { CostCalculationEngine } from '../../engines/CostCalculationEngine';
import { VehicleCostProfile } from '../../types';

export const VehicleCostTCOView: React.FC = () => {
  const { vehicleCostProfiles, fleetAverageCostPerKm } = useCost();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(
    vehicleCostProfiles[0]?.vehicleId || ''
  );
  const [searchTerm, setSearchTerm] = useState('');

  // Selected vehicle profile
  const selectedVehicle = useMemo(() => {
    return (
      vehicleCostProfiles.find((v) => v.vehicleId === selectedVehicleId) ||
      vehicleCostProfiles[0]
    );
  }, [vehicleCostProfiles, selectedVehicleId]);

  // Filtered list for sidebar selector
  const filteredVehicles = useMemo(() => {
    return vehicleCostProfiles.filter(
      (v) =>
        v.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.branchName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [vehicleCostProfiles, searchTerm]);

  // Vehicle cost breakdown donut
  const costBreakdownData = useMemo(() => {
    if (!selectedVehicle) return [];
    return [
      { name: 'BBM Solar', value: selectedVehicle.fuelCostIdr, color: '#06b6d4' },
      { name: 'Bengkel & Servis', value: selectedVehicle.maintenanceCostIdr, color: '#f59e0b' },
      { name: 'Gaji & Driver', value: selectedVehicle.driverCostIdr, color: '#3b82f6' },
      { name: 'Tol & Parkir', value: selectedVehicle.tollCostIdr, color: '#10b981' },
      { name: 'Asuransi & STNK', value: selectedVehicle.insuranceCostIdr + selectedVehicle.taxCostIdr, color: '#8b5cf6' },
      { name: 'IoT Telematics & Lainnya', value: selectedVehicle.gpsCostIdr + selectedVehicle.otherCostIdr, color: '#ec4899' },
    ];
  }, [selectedVehicle]);

  // TCO Waterfall / Bar Data
  const tcoData = useMemo(() => {
    if (!selectedVehicle?.tcoMetrics) return [];
    const t = selectedVehicle.tcoMetrics;
    return [
      { name: 'Harga Beli (Capex)', value: t.purchasePriceIdr, color: '#3b82f6' },
      { name: 'Akumulasi Biaya Opex', value: t.totalOperatingCostToDateIdr, color: '#06b6d4' },
      { name: 'Penyusutan (Depresiasi)', value: t.accumulatedDepreciationIdr, color: '#f59e0b' },
      { name: 'Nilai Buku Saat Ini', value: t.currentBookValueIdr, color: '#10b981' },
      { name: 'Estimasi Jual Kembali', value: t.estimatedResaleValueIdr, color: '#8b5cf6' },
    ];
  }, [selectedVehicle]);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Top Split Layout: Vehicle Selector Sidebar + Main Profile Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Vehicle List */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col h-[750px]">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-white">Daftar Kendaraan & TCO</h3>
            <p className="text-xs text-slate-400 mt-0.5">Pilih unit untuk melihat profil TCO & scorecard</p>
            <div className="relative mt-3">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari plat nomor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-700">
            {filteredVehicles.map((v) => {
              const isSelected = v.vehicleId === selectedVehicleId;
              return (
                <div
                  key={v.vehicleId}
                  onClick={() => setSelectedVehicleId(v.vehicleId)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-white shadow-sm'
                      : 'bg-slate-800/40 border-slate-800/80 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{v.vehiclePlate}</span>
                    <span
                      className={`text-[10px] px-2 py-0.2 rounded font-semibold ${
                        v.status === 'NORMAL'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : v.status === 'WARNING'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {v.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">{v.vehicleModel} • {v.branchName}</div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700/50 text-[11px]">
                    <span className="text-slate-400">Total Belanja:</span>
                    <span className="font-mono font-semibold text-cyan-400">
                      {CostCalculationEngine.formatCurrencyIdr(v.totalCostIdr)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] mt-0.5">
                    <span className="text-slate-400">Cost / KM:</span>
                    <span className="font-mono text-white">
                      {CostCalculationEngine.formatCurrencyIdr(v.costPerKmIdr)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Vehicle TCO & Scorecard */}
        {selectedVehicle && (
          <div className="lg:col-span-8 space-y-6">
            {/* Header Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white">{selectedVehicle.vehiclePlate}</h2>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {selectedVehicle.vehicleType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {selectedVehicle.vehicleModel} • Cabang {selectedVehicle.branchName} • Driver:{' '}
                      <span className="text-slate-200">{selectedVehicle.assignedDriverName || 'Rotasi Driver'}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Total Biaya Operasional</span>
                  <span className="text-xl font-bold text-cyan-400">
                    {CostCalculationEngine.formatCurrencyIdr(selectedVehicle.totalCostIdr)}
                  </span>
                </div>
              </div>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800">
                <div className="bg-slate-800/40 rounded-xl p-2.5 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Total Jarak Tempuh</span>
                  <span className="text-sm font-bold text-white font-mono">
                    {selectedVehicle.totalMileageKm.toLocaleString()} KM
                  </span>
                </div>
                <div className="bg-slate-800/40 rounded-xl p-2.5 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Total Ritase Trip</span>
                  <span className="text-sm font-bold text-white font-mono">{selectedVehicle.totalTrips} Trips</span>
                </div>
                <div className="bg-slate-800/40 rounded-xl p-2.5 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Biaya per Kilometer</span>
                  <span className="text-sm font-bold text-cyan-400 font-mono">
                    {CostCalculationEngine.formatCurrencyIdr(selectedVehicle.costPerKmIdr)}
                  </span>
                </div>
                <div className="bg-slate-800/40 rounded-xl p-2.5 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Biaya per Trip</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">
                    {CostCalculationEngine.formatCurrencyIdr(selectedVehicle.costPerTripIdr)}
                  </span>
                </div>
              </div>
            </div>

            {/* TCO Capex & Opex Lifetime Analytics */}
            {selectedVehicle.tcoMetrics && (
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Total Cost of Ownership (TCO) & Depresiasi Aset
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Evaluasi Capex awal, akumulasi Opex, nilai buku saat ini, dan estimasi nilai jual kembali
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Nilai Buku: {CostCalculationEngine.formatCurrencyIdr(selectedVehicle.tcoMetrics.currentBookValueIdr)}
                  </span>
                </div>

                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={tcoData} margin={{ top: 10, right: 10, left: 15, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={11}
                        tickFormatter={(val) => `Rp ${(val / 1000000).toFixed(0)}M`}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }}
                        formatter={(val: number) => [CostCalculationEngine.formatCurrencyIdr(val), 'Nominal']}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {tcoData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Scorecard & Cost Composition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Efficiency Scorecard */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Efficiency Scorecard</h3>
                  <span className="text-xs font-bold text-cyan-400">
                    Skor Total: {selectedVehicle.scorecard.totalCostEfficiencyScore}/100
                  </span>
                </div>

                <div className="space-y-2.5 pt-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Efisiensi Konsumsi BBM</span>
                      <span className="text-white font-semibold">{selectedVehicle.scorecard.fuelEfficiencyScore}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-cyan-500 h-full rounded-full"
                        style={{ width: `${selectedVehicle.scorecard.fuelEfficiencyScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Ketepatan Biaya Servis & Bengkel</span>
                      <span className="text-white font-semibold">
                        {selectedVehicle.scorecard.maintenanceEfficiencyScore}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full"
                        style={{ width: `${selectedVehicle.scorecard.maintenanceEfficiencyScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Performa Produktivitas Supir</span>
                      <span className="text-white font-semibold">
                        {selectedVehicle.scorecard.driverEfficiencyScore}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full"
                        style={{ width: `${selectedVehicle.scorecard.driverEfficiencyScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Kontrol Idle Time Engine</span>
                      <span className="text-white font-semibold">{selectedVehicle.scorecard.idleEfficiencyScore}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${selectedVehicle.scorecard.idleEfficiencyScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Cost Donut */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Komposisi Biaya Unit Ini</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Porsi pengeluaran selama periode aktif</p>
                </div>

                <div className="h-44 my-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={costBreakdownData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={65}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {costBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }}
                        formatter={(val: number) => [CostCalculationEngine.formatCurrencyIdr(val), 'Total']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-800 text-[11px]">
                  {costBreakdownData.slice(0, 4).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-400 truncate">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
