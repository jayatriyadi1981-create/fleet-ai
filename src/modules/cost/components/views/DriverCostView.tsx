/**
 * Fleet Intelligence Smart AI - Driver Cost Intelligence View
 * PROMPT 37 - Driver Compensation Breakdown, Privacy & Cost-per-KM/Hour Analytics
 */

import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  DollarSign,
  Clock,
  Gauge,
  Navigation,
  Shield,
  ShieldAlert,
  Download,
  AlertTriangle,
  Award,
  ChevronDown,
  ChevronUp,
  Info,
  Building2,
  TrendingUp,
  Eye,
  EyeOff,
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
  Legend,
} from 'recharts';
import { useCost } from '../../context/CostContext';
import { CostCalculationEngine } from '../../engines/CostCalculationEngine';
import { DriverCostMetric } from '../../types';

export const DriverCostView: React.FC = () => {
  const { driverCostMetrics, canViewDriverSensitiveCost, branchCostMetrics } = useCost();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');
  const [selectedModel, setSelectedModel] = useState<string>('ALL');
  const [expandedDriverId, setExpandedDriverId] = useState<string | null>(null);
  const [showMaskToggle, setShowMaskToggle] = useState<boolean>(!canViewDriverSensitiveCost);

  // Filtered driver list
  const filteredDrivers = useMemo(() => {
    return driverCostMetrics.filter((driver) => {
      const matchSearch =
        driver.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchBranch = selectedBranch === 'ALL' || driver.branchName === selectedBranch;
      const matchModel = selectedModel === 'ALL' || driver.compensationModel === selectedModel;
      return matchSearch && matchBranch && matchModel;
    });
  }, [driverCostMetrics, searchTerm, selectedBranch, selectedModel]);

  // Aggregated totals with safety checks
  const totals = useMemo(() => {
    const totalCost = filteredDrivers.reduce((acc, d) => acc + d.totalDriverCostIdr, 0);
    const totalBaseSalary = filteredDrivers.reduce((acc, d) => acc + d.baseSalaryIdr, 0);
    const totalOvertime = filteredDrivers.reduce((acc, d) => acc + d.overtimeIdr, 0);
    const totalAllowance = filteredDrivers.reduce((acc, d) => acc + d.allowanceIdr + d.tripAllowanceIdr + d.mealAllowanceIdr, 0);
    const totalBonus = filteredDrivers.reduce((acc, d) => acc + d.bonusIdr, 0);
    const totalKm = filteredDrivers.reduce((acc, d) => acc + d.totalDistanceKm, 0);
    const totalHours = filteredDrivers.reduce((acc, d) => acc + d.drivingHours, 0);
    const totalTrips = filteredDrivers.reduce((acc, d) => acc + d.completedTrips, 0);

    const avgCostPerKm = totalKm > 0 ? totalCost / totalKm : 0;
    const avgCostPerHour = totalHours > 0 ? totalCost / totalHours : 0;
    const avgCostPerTrip = totalTrips > 0 ? totalCost / totalTrips : 0;

    return {
      totalCost,
      totalBaseSalary,
      totalOvertime,
      totalAllowance,
      totalBonus,
      totalKm,
      totalHours,
      totalTrips,
      avgCostPerKm,
      avgCostPerHour,
      avgCostPerTrip,
      driverCount: filteredDrivers.length,
    };
  }, [filteredDrivers]);

  // Compensation breakdown donut data
  const compensationDonutData = [
    { name: 'Gaji Pokok', value: totals.totalBaseSalary, color: '#3b82f6' },
    { name: 'Uang Jalan & Tunjangan', value: totals.totalAllowance, color: '#06b6d4' },
    { name: 'Upah Lembur', value: totals.totalOvertime, color: '#f59e0b' },
    { name: 'Bonus & Insentif', value: totals.totalBonus, color: '#10b981' },
  ];

  // Top Cost per KM Drivers
  const driverCostChartData = filteredDrivers.slice(0, 8).map((d) => ({
    name: d.driverName.split(' ')[0],
    costPerKm: d.costPerKmIdr,
    costPerHour: d.costPerHourIdr,
    totalCostJuta: Math.round(d.totalDriverCostIdr / 100000) / 10,
  }));

  // Unique branches for filter
  const branchList = useMemo(() => {
    return Array.from(new Set(driverCostMetrics.map((d) => d.branchName)));
  }, [driverCostMetrics]);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Privacy Notice Banner if masked */}
      {!canViewDriverSensitiveCost && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Driver Privacy Protection Active (RBAC Gated)</h4>
              <p className="text-xs text-slate-400">
                Detail gaji pokok dan rekening driver disamarkan sesuai kebijakan privasi internal. Anda memiliki akses metrik produktivitas agregat.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30">
            Protected Role
          </span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Driver Cost */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Biaya Driver</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-white">
            {canViewDriverSensitiveCost
              ? CostCalculationEngine.formatCurrencyIdr(totals.totalCost)
              : 'Rp •••••••••'}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
            <span className="text-cyan-400 font-semibold">{totals.driverCount} Drivers</span>
            <span>• {totals.totalTrips} Total Trips</span>
          </div>
        </div>

        {/* Avg Cost per KM */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Rata-rata Biaya Driver / KM</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-white">
            {canViewDriverSensitiveCost
              ? CostCalculationEngine.formatCurrencyIdr(totals.avgCostPerKm)
              : 'Rp ••••• / KM'}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
            <span>Total Jarak: </span>
            <span className="text-slate-200 font-semibold">{totals.totalKm.toLocaleString()} KM</span>
          </div>
        </div>

        {/* Avg Cost per Operating Hour */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Biaya Driver / Jam Kerja</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-white">
            {canViewDriverSensitiveCost
              ? CostCalculationEngine.formatCurrencyIdr(totals.avgCostPerHour)
              : 'Rp ••••• / Jam'}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
            <span>Total Jam Mengemudi: </span>
            <span className="text-slate-200 font-semibold">{totals.totalHours.toLocaleString()} Jam</span>
          </div>
        </div>

        {/* Overtime & Incentive Proportion */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Rasio Lembur & Insentif</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-emerald-400">
            {totals.totalCost > 0
              ? `${Math.round(((totals.totalOvertime + totals.totalBonus) / totals.totalCost) * 100)}%`
              : '0%'}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
            <span>Lembur: </span>
            <span className="text-amber-400 font-medium">
              {canViewDriverSensitiveCost
                ? CostCalculationEngine.formatCurrencyIdr(totals.totalOvertime)
                : 'Rp •••••'}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cost per KM by Driver Chart */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Efisiensi Biaya per KM per Pengemudi</h3>
              <p className="text-xs text-slate-400 mt-0.5">Membandingkan tarif driver per kilometer tempuh aktual</p>
            </div>
            <span className="text-xs text-slate-400">Top 8 Drivers</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={driverCostChartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickFormatter={(val) => `Rp ${val.toLocaleString()}`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }}
                  formatter={(val: number) => [`Rp ${val.toLocaleString()}`, 'Biaya / KM']}
                />
                <Bar dataKey="costPerKm" fill="#06b6d4" radius={[6, 6, 0, 0]}>
                  {driverCostChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.costPerKm > totals.avgCostPerKm * 1.2 ? '#f59e0b' : '#06b6d4'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Structure Donut */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Struktur Kompensasi Driver</h3>
            <p className="text-xs text-slate-400 mt-0.5">Proporsi gaji, uang jalan, lembur & insentif</p>
          </div>

          <div className="h-52 my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={compensationDonutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {compensationDonutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }}
                  formatter={(val: number) => [
                    canViewDriverSensitiveCost ? CostCalculationEngine.formatCurrencyIdr(val) : 'Rp •••••',
                    'Total',
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            {compensationDonutData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="text-slate-400 font-mono">
                  {totals.totalCost > 0 ? `${Math.round((item.value / totals.totalCost) * 100)}%` : '0%'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Driver List & Drill-down Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari driver atau NIK..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Branch Filter */}
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">Semua Cabang</option>
              {branchList.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>

            {/* Model Filter */}
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">Semua Model Kompensasi</option>
              <option value="MONTHLY_SALARY">Gaji Bulanan</option>
              <option value="PER_TRIP">Per Trip</option>
              <option value="PER_KM">Per KM</option>
            </select>
          </div>

          <div className="text-xs text-slate-400">
            Menampilkan <span className="text-white font-semibold">{filteredDrivers.length}</span> dari {driverCostMetrics.length} Driver
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Pengemudi & NIK</th>
                <th className="py-3 px-4">Cabang</th>
                <th className="py-3 px-4">Skema Gaji</th>
                <th className="py-3 px-4 text-right">Jarak Tempuh</th>
                <th className="py-3 px-4 text-right">Jam Kerja</th>
                <th className="py-3 px-4 text-right">Biaya / KM</th>
                <th className="py-3 px-4 text-right">Biaya / Trip</th>
                <th className="py-3 px-4 text-right">Total Biaya</th>
                <th className="py-3 px-4 text-center">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredDrivers.map((driver) => {
                const isExpanded = expandedDriverId === driver.driverId;
                return (
                  <React.Fragment key={driver.driverId}>
                    <tr
                      className={`hover:bg-slate-800/40 transition-colors cursor-pointer ${
                        isExpanded ? 'bg-slate-800/50' : ''
                      }`}
                      onClick={() => setExpandedDriverId(isExpanded ? null : driver.driverId)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 text-[11px]">
                            {driver.driverName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-medium text-white block">{driver.driverName}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{driver.employeeId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-400">{driver.branchName}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                          {driver.compensationModel === 'MONTHLY_SALARY' && 'Bulanan + Trip'}
                          {driver.compensationModel === 'PER_TRIP' && 'Per Trip Saja'}
                          {driver.compensationModel === 'PER_KM' && 'Tarif / KM'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-200">
                        {driver.totalDistanceKm.toLocaleString()} KM
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-300">
                        {driver.drivingHours} Jam
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-cyan-400 font-medium">
                        {CostCalculationEngine.formatCurrencyIdr(driver.costPerKmIdr)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-300">
                        {CostCalculationEngine.formatCurrencyIdr(driver.costPerTripIdr)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-white">
                        {canViewDriverSensitiveCost
                          ? CostCalculationEngine.formatCurrencyIdr(driver.totalDriverCostIdr)
                          : 'Rp ••••••••'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedDriverId(isExpanded ? null : driver.driverId);
                          }}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Detail Panel */}
                    {isExpanded && (
                      <tr className="bg-slate-950/60">
                        <td colSpan={9} className="p-4 border-b border-slate-800">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                                Komponen Gaji Pokok & Lembur
                              </span>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Gaji Pokok:</span>
                                  <span className="font-mono text-white">
                                    {canViewDriverSensitiveCost
                                      ? CostCalculationEngine.formatCurrencyIdr(driver.baseSalaryIdr)
                                      : 'Rp •••••••'}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Upah Lembur:</span>
                                  <span className="font-mono text-amber-400">
                                    {canViewDriverSensitiveCost
                                      ? CostCalculationEngine.formatCurrencyIdr(driver.overtimeIdr)
                                      : 'Rp •••••••'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                                Uang Saku & Tunjangan Jalan
                              </span>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Uang Jalan / Trip:</span>
                                  <span className="font-mono text-cyan-400">
                                    {CostCalculationEngine.formatCurrencyIdr(driver.tripAllowanceIdr)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Uang Makan / Harian:</span>
                                  <span className="font-mono text-slate-200">
                                    {CostCalculationEngine.formatCurrencyIdr(driver.mealAllowanceIdr)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                                Insentif & Potongan
                              </span>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Bonus Efisiensi:</span>
                                  <span className="font-mono text-emerald-400">
                                    +{CostCalculationEngine.formatCurrencyIdr(driver.bonusIdr)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Denda / Pelanggaran:</span>
                                  <span className="font-mono text-rose-400">
                                    -{CostCalculationEngine.formatCurrencyIdr(driver.penaltyIdr)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                                Produktivitas & Rate
                              </span>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Trips Diselesaikan:</span>
                                  <span className="font-semibold text-white">{driver.completedTrips} Trip</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Tarif / Jam Nyata:</span>
                                  <span className="font-mono text-slate-200">
                                    {CostCalculationEngine.formatCurrencyIdr(driver.costPerHourIdr)} / Jam
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
