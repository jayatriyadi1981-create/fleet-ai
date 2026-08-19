/**
 * Fleet Intelligence Smart AI - Fuel Cost Intelligence View
 * PROMPT 37 - Liters, Efficiency (KM/L), Fuel Index, Idle Waste & Sensor Telematics
 */

import React, { useState } from 'react';
import {
  Fuel,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Flame,
  Clock,
  Gauge,
  CheckCircle2,
  DollarSign,
  Search,
  Filter,
  Download,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { useCost } from '../../context/CostContext';
import { CostCalculationEngine } from '../../engines/CostCalculationEngine';

export const FuelCostView: React.FC = () => {
  const { fuelCostMetrics, fuelPriceHistory, setIsSavingCalculatorModalOpen, exportCurrentData } = useCost();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMetrics = fuelCostMetrics.filter(
    (m) =>
      m.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.vehicleModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.driverName && m.driverName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalFuelCost = fuelCostMetrics.reduce((sum, m) => sum + m.fuelCostIdr, 0);
  const totalLiters = fuelCostMetrics.reduce((sum, m) => sum + m.totalLiters, 0);
  const avgEfficiency = (
    fuelCostMetrics.reduce((sum, m) => sum + m.fuelEfficiencyKmPerL, 0) / (fuelCostMetrics.length || 1)
  ).toFixed(2);

  // Price trend chart data
  const priceTrendData = [
    { date: '1 Jul', bioSolar: 13200, dexlite: 14200, pertaminaDex: 15300 },
    { date: '15 Jul', bioSolar: 13200, dexlite: 14350, pertaminaDex: 15450 },
    { date: '1 Agu', bioSolar: 13500, dexlite: 14550, pertaminaDex: 15650 },
    { date: '15 Agu', bioSolar: 13500, dexlite: 14550, pertaminaDex: 15650 },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Biaya Bahan Bakar (BBM)</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <Fuel className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2">{CostCalculationEngine.formatIdr(totalFuelCost)}</div>
          <div className="text-xs text-slate-400 mt-2">
            Porsi terhadap TOC: <strong className="text-cyan-400">43.0%</strong>
          </div>
        </div>

        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Konsumsi Liter</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {totalLiters.toLocaleString('id-ID')}
            <span className="text-sm font-normal text-slate-400"> Liter</span>
          </div>
          <div className="text-xs text-slate-400 mt-2">Bio Solar: 100% armada diesel</div>
        </div>

        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Efisiensi Rata-rata BBM</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">
            {avgEfficiency} <span className="text-sm font-normal text-slate-300">KM / Liter</span>
          </div>
          <div className="text-xs text-slate-400 mt-2">Setara 30.2 L / 100 KM</div>
        </div>

        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Kerugian Idling BBM Terdeteksi</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-400 mt-2">Rp 34.200.000</div>
          <div className="text-xs text-slate-400 mt-2 flex items-center justify-between">
            <span>412 jam idling mesin</span>
            <button
              onClick={() => setIsSavingCalculatorModalOpen(true)}
              className="text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Simulasi Reduksi →
            </button>
          </div>
        </div>
      </div>

      {/* Chart Row: Fuel Price Index vs Vehicle Fuel Efficiency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SPBU Price History */}
        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Indeks Harga BBM Resmi (Pertamina)</h3>
              <p className="text-xs text-slate-400 mt-0.5">Pemantauan fluktuasi harga per liter BBM subsidi & nonsubsidi</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Update: 15 Agu 2026
            </span>
          </div>

          <div className="h-56 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} domain={[12000, 17000]} />
                <Tooltip
                  formatter={(value: any) => [`Rp ${Number(value).toLocaleString('id-ID')} / L`, '']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="bioSolar" name="Bio Solar" stroke="#06b6d4" strokeWidth={2.5} />
                <Line type="monotone" dataKey="dexlite" name="Dexlite" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="pertaminaDex" name="Pertamina Dex" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fuel Consumption by Vehicle */}
        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 shadow-lg">
          <div>
            <h3 className="text-sm font-semibold text-white">Konsumsi BBM per 100 KM per Unit</h3>
            <p className="text-xs text-slate-400 mt-0.5">Benchmark konsumsi aktual telematika CAN-bus vs standar pabrikan</p>
          </div>

          <div className="h-56 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={fuelCostMetrics.map((m) => ({
                  plate: m.vehiclePlate,
                  actual: m.fuelConsumptionLPer100Km,
                  benchmark: 28.0,
                }))}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="plate" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`${val} Liter / 100 KM`, '']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="actual" name="Aktual (L/100km)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="benchmark" name="Benchmark (L/100km)" fill="#475569" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Fuel Cost Breakdown Table */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-lg overflow-hidden">
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/60">
          <div>
            <h3 className="text-sm font-semibold text-white">Rincian Biaya & Konsumsi BBM per Kendaraan</h3>
            <p className="text-xs text-slate-400 mt-0.5">Perhitungan biaya BBM aktual terintegrasi sensor telematika dan resi</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari plat / driver / tipe..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-60"
              />
            </div>
            <button
              onClick={() => exportCurrentData('CSV')}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
              title="Ekspor CSV"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700/60">
              <tr>
                <th className="py-3 px-4">Kendaraan</th>
                <th className="py-3 px-4">Pengemudi / Cabang</th>
                <th className="py-3 px-4">Total Liter</th>
                <th className="py-3 px-4">Total Biaya BBM</th>
                <th className="py-3 px-4">Jarak (KM)</th>
                <th className="py-3 px-4">Efisiensi (KM/L)</th>
                <th className="py-3 px-4">Biaya / KM</th>
                <th className="py-3 px-4">Biaya / Trip</th>
                <th className="py-3 px-4 text-center">Status Telematika</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {filteredMetrics.map((m) => (
                <tr key={m.vehicleId} className="hover:bg-slate-700/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{m.vehiclePlate}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[180px]">{m.vehicleModel}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-white font-medium">{m.driverName || '-'}</div>
                    <div className="text-[11px] text-slate-400">{m.branchName}</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-cyan-400">{m.totalLiters.toLocaleString('id-ID')} L</td>
                  <td className="py-3.5 px-4 font-bold text-white">{CostCalculationEngine.formatIdr(m.fuelCostIdr)}</td>
                  <td className="py-3.5 px-4 text-slate-300">{m.mileageKm.toLocaleString('id-ID')} km</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-semibold ${
                        m.fuelEfficiencyKmPerL >= 3.5
                          ? 'text-emerald-400'
                          : m.fuelEfficiencyKmPerL >= 3.2
                          ? 'text-cyan-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {m.fuelEfficiencyKmPerL.toFixed(2)} KM/L
                    </span>
                    <span className="text-[10px] text-slate-400 block">{m.fuelConsumptionLPer100Km.toFixed(1)} L/100km</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-indigo-300">
                    Rp {m.fuelCostPerKmIdr.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">Rp {m.fuelCostPerTripIdr.toLocaleString('id-ID')}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" /> CAN-bus Sensor
                    </span>
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
