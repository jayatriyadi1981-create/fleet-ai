/**
 * Fleet Intelligence Smart AI - Cost Executive Dashboard View
 * PROMPT 37 - Holistic Fleet Cost Overview & Financial Intelligence
 */

import React from 'react';
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  Fuel,
  Wrench,
  Users,
  Gauge,
  Sparkles,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  Building2,
  Truck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  ComposedChart,
} from 'recharts';
import { useCost } from '../../context/CostContext';
import { CostCalculationEngine } from '../../engines/CostCalculationEngine';

export const CostDashboardView: React.FC = () => {
  const {
    totalOperatingCostSummary,
    fleetAverageCostPerKm,
    fleetAverageCostPerTrip,
    costPerKmMetrics,
    branchCostMetrics,
    budgetVariances,
    aiInsights,
    savingOpportunities,
    costRecords,
    setActiveTab,
    setIsSavingCalculatorModalOpen,
    setIsAddCostModalOpen,
    setIsApprovalModalOpen,
    setSelectedCostForApproval,
  } = useCost();

  // Category Distribution Data for Donut Chart
  const categoryChartData = [
    { name: 'Bahan Bakar (BBM)', value: 184500000, color: '#06b6d4' },
    { name: 'Gaji & Supir', value: 107500000, color: '#3b82f6' },
    { name: 'Pemeliharaan & Bengkel', value: 56400000, color: '#f59e0b' },
    { name: 'Tol & Parkir', value: 38200000, color: '#10b981' },
    { name: 'Ban & Vulkanisir', value: 22400000, color: '#f97316' },
    { name: 'Asuransi & Pajak', value: 14400000, color: '#8b5cf6' },
    { name: 'Telematika & IoT', value: 5100000, color: '#ec4899' },
  ];

  // Monthly Budget vs Actual Trend
  const monthlyTrendData = [
    { month: 'Mar', actual: 395, budget: 410, forecast: 400 },
    { month: 'Apr', actual: 412, budget: 410, forecast: 410 },
    { month: 'Mei', actual: 438, budget: 415, forecast: 425 },
    { month: 'Jun', actual: 405, budget: 415, forecast: 410 },
    { month: 'Jul', actual: 420, budget: 415, forecast: 418 },
    { month: 'Agu (Est)', actual: 428.5, budget: 415, forecast: 435 },
  ];

  // Top 5 Highest Cost vs Efficient Vehicles
  const sortedVehiclesByCostPerKm = [...costPerKmMetrics].sort((a, b) => b.totalCostPerKm - a.totalCostPerKm);
  const expensiveVehicles = sortedVehiclesByCostPerKm.slice(0, 3);
  const efficientVehicles = [...costPerKmMetrics].sort((a, b) => a.totalCostPerKm - b.totalCostPerKm).slice(0, 3);

  // Pending Approvals
  const pendingApprovals = costRecords.filter((r) => r.status === 'PENDING_APPROVAL');

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Pending Approvals Alert Banner */}
      {pendingApprovals.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">
                Terdapat {pendingApprovals.length} Pengajuan Biaya Menunggu Persetujuan
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Pengeluaran di atas ambang batas (Rp 5.000.000) atau kategori darurat memerlukan otorisasi manajer.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('reports')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-colors whitespace-nowrap shadow-md shadow-amber-500/10"
          >
            Review Persetujuan ({pendingApprovals.length})
          </button>
        </div>
      )}

      {/* Hero Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Cost Card */}
        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 hover:border-slate-600 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Biaya Operasional</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {CostCalculationEngine.formatIdr(totalOperatingCostSummary.totalIdr || 428500000)}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs">
            <span className="flex items-center text-emerald-400 font-semibold">
              <ArrowDownRight className="w-3.5 h-3.5" /> -2.4%
            </span>
            <span className="text-slate-400">vs bulan lalu (Rp 438,2 Jt)</span>
          </div>
        </div>

        {/* Cost Per KM Card */}
        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 hover:border-slate-600 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Rata-rata Biaya / KM</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            Rp {fleetAverageCostPerKm.toLocaleString('id-ID')}
            <span className="text-sm font-normal text-slate-400"> / km</span>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-slate-400">Target Efisiensi: Rp 7.200</span>
            <span className="text-amber-400 font-medium">+3.0% var</span>
          </div>
        </div>

        {/* Cost Per Trip Card */}
        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 hover:border-slate-600 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Rata-rata Biaya / Trip</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            Rp {fleetAverageCostPerTrip.toLocaleString('id-ID')}
            <span className="text-sm font-normal text-slate-400"> / trip</span>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-slate-400">840 trip selesai</span>
            <span className="text-emerald-400 font-medium">Rp 946rb / drop</span>
          </div>
        </div>

        {/* AI Potential Saving Card */}
        <div className="bg-gradient-to-br from-indigo-950/80 to-slate-800/80 rounded-2xl p-5 border border-indigo-500/30 hover:border-indigo-500/50 transition-all shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-15">
            <Sparkles className="w-16 h-16 text-indigo-400" />
          </div>
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-medium text-indigo-300">Potensi Hemat AI (Bulanan)</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              4 Peluang
            </span>
          </div>
          <div className="text-2xl font-bold text-indigo-200 mt-2 relative z-10">
            Rp 49.030.000
            <span className="text-xs font-normal text-indigo-300/80"> / bln</span>
          </div>
          <div className="mt-2 relative z-10">
            <button
              onClick={() => setActiveTab('ai_insights')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              <span>Optimasi Sekarang</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Charts Row: Category Donut & Spend Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cost Breakdown Donut (1 col) */}
        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Distribusi Biaya Operasional</h3>
              <button
                onClick={() => setActiveTab('operating')}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5"
              >
                <span>Rincian</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Komposisi pengeluaran bulan berjalan</p>

            <div className="h-60 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [
                      new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
                        Number(value)
                      ),
                      'Total Biaya',
                    ]}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-700/60 text-xs">
            {categoryChartData.slice(0, 4).map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <div className="truncate">
                  <div className="text-slate-400 text-[11px] truncate">{item.name}</div>
                  <div className="text-white font-semibold text-xs">{CostCalculationEngine.formatCompactIdr(item.value)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Spend & Budget Trend (2 cols) */}
        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 lg:col-span-2 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Tren Realisasi vs Anggaran Biaya (Juta IDR)</h3>
                <p className="text-xs text-slate-400 mt-0.5">Pemantauan variansi anggaran operasional 6 bulan terakhir</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-cyan-500" />
                  <span className="text-slate-300">Realisasi (Actual)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-amber-400" />
                  <span className="text-slate-300">Anggaran (Budget)</span>
                </div>
              </div>
            </div>

            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <Tooltip
                    formatter={(value: any) => [`Rp ${value} Jt`, '']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Bar dataKey="actual" fill="#06b6d4" radius={[6, 6, 0, 0]} name="Realisasi" barSize={32} />
                  <Line type="monotone" dataKey="budget" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} name="Budget" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-700/60 text-xs text-slate-400">
            <span>Variansi Realisasi Bulan Agustus: <strong className="text-amber-400">+3.3% (+Rp 13,5 Jt)</strong></span>
            <button onClick={() => setActiveTab('trends')} className="text-cyan-400 hover:text-cyan-300 font-medium">
              Lihat Analisis Variansi Lengkap →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Vehicle Cost Benchmark & AI Saving Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehicle Cost / KM Benchmark Cards */}
        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
            <div>
              <h3 className="text-sm font-semibold text-white">Benchmark Biaya per Kendaraan (Cost / KM)</h3>
              <p className="text-xs text-slate-400 mt-0.5">Identifikasi unit paling mahal vs paling hemat</p>
            </div>
            <button
              onClick={() => setActiveTab('per_km')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Semua Unit ({costPerKmMetrics.length})
            </button>
          </div>

          <div className="mt-4 space-y-3">
            <div className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">Unit Paling Boros (Biaya Tinggi)</div>
            {expensiveVehicles.map((v) => (
              <div
                key={v.vehicleId}
                className="bg-slate-900/60 rounded-xl p-3 border border-rose-500/20 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 font-bold text-xs">
                    #{v.rank}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{v.vehiclePlate}</div>
                    <div className="text-[11px] text-slate-400">{v.vehicleModel}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-rose-400">Rp {v.totalCostPerKm.toLocaleString('id-ID')} / km</div>
                  <div className="text-[10px] text-slate-400">+{v.varianceVsFleetAvgPercent}% vs armada</div>
                </div>
              </div>
            ))}

            <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider pt-2">Unit Paling Efisien (Best Practice)</div>
            {efficientVehicles.map((v) => (
              <div
                key={v.vehicleId}
                className="bg-slate-900/60 rounded-xl p-3 border border-emerald-500/20 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-xs">
                    #{v.rank}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{v.vehiclePlate}</div>
                    <div className="text-[11px] text-slate-400">{v.vehicleModel}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-400">Rp {v.totalCostPerKm.toLocaleString('id-ID')} / km</div>
                  <div className="text-[10px] text-slate-400">{v.varianceVsFleetAvgPercent}% vs armada</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations Action Cards */}
        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-sm font-semibold text-white">AI Rekomendasi Efisiensi Biaya</h3>
              </div>
              <button
                onClick={() => setActiveTab('ai_insights')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Lihat Semua ({aiInsights.length})
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {aiInsights.slice(0, 2).map((insight) => (
                <div
                  key={insight.id}
                  className="bg-slate-900/60 rounded-xl p-3.5 border border-indigo-500/20 hover:border-indigo-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{insight.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        insight.severity === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {insight.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{insight.headline}</p>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800 text-xs">
                    <span className="text-indigo-300 font-medium">
                      Potensi Hemat: Rp {(insight.recommendations[0]?.potentialSavingMonthlyIdr / 1000000).toFixed(1)} Jt/bln
                    </span>
                    <button
                      onClick={() => setActiveTab('ai_insights')}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-semibold transition-colors"
                    >
                      Terapkan Solusi
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-700/60 flex items-center justify-between">
            <span className="text-xs text-slate-400">Total Proyeksi Penghematan Tahunan: <strong className="text-indigo-300">Rp 588,3 Jt</strong></span>
            <button
              onClick={() => setIsSavingCalculatorModalOpen(true)}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              <span>Buka Kalkulator Simulasi</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
