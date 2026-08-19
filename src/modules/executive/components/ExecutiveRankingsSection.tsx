/**
 * Fleet Intelligence Smart AI - Executive Rankings & Top 10 Analytics Section
 * PROMPT 38 - Composite Risk Vehicle Rankings, Cost Outliers, Driver Risk Profiles & Top Efficient Assets
 */

import React, { useState } from 'react';
import { useExecutive } from '../context/ExecutiveContext';
import {
  AlertTriangle,
  DollarSign,
  UserX,
  Award,
  Zap,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Layers,
} from 'lucide-react';

export const ExecutiveRankingsSection: React.FC = () => {
  const {
    highRiskVehicles,
    topCostVehicles,
    topRiskDrivers,
    topEfficientVehicles,
    topProductiveVehicles,
  } = useExecutive();

  const [activeTab, setActiveTab] = useState<'RISK' | 'COST' | 'DRIVERS' | 'EFFICIENT' | 'PRODUCTIVE'>('RISK');

  const formatIdr = (val: number) => {
    return 'Rp ' + Math.round(val).toLocaleString('id-ID');
  };

  return (
    <div className="bg-white rounded-2xl p-5 lg:p-6 border border-slate-200/80 shadow-sm">
      {/* Section Title & Tabs Navigation */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            Executive Asset & Driver Rankings
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Peringkat anomali biaya, risiko operasional tertinggi, serta unit dengan performa terbaik.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto">
          <button
            onClick={() => setActiveTab('RISK')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'RISK'
                ? 'bg-white text-rose-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kendaraan Berisiko ({highRiskVehicles.length})
          </button>
          <button
            onClick={() => setActiveTab('COST')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'COST'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Top Biaya Tertinggi
          </button>
          <button
            onClick={() => setActiveTab('DRIVERS')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'DRIVERS'
                ? 'bg-white text-amber-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Driver Berisiko
          </button>
          <button
            onClick={() => setActiveTab('EFFICIENT')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'EFFICIENT'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Top Paling Efisien
          </button>
          <button
            onClick={() => setActiveTab('PRODUCTIVE')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'PRODUCTIVE'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Top Paling Produktif
          </button>
        </div>
      </div>

      {/* Tab 1: High Risk Vehicles Table */}
      {activeTab === 'RISK' && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="py-3 px-3.5 font-bold">No. Polisi & Unit</th>
                <th className="py-3 px-3 font-bold">Cabang</th>
                <th className="py-3 px-3 font-bold text-center">Skor Risiko</th>
                <th className="py-3 px-3 font-bold">Cost / KM</th>
                <th className="py-3 px-3 font-bold">Downtime</th>
                <th className="py-3 px-3 font-bold">Alasan Masalah</th>
                <th className="py-3 px-3.5 font-bold">Rekomendasi Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {highRiskVehicles.map((v) => (
                <tr key={v.vehicleId} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3.5">
                    <div className="font-bold text-slate-900">{v.plateNumber}</div>
                    <div className="text-[11px] text-slate-500">{v.model}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-medium">{v.branchName}</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        v.compositeRiskScore >= 80
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {v.compositeRiskScore} / 100
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-rose-700">{formatIdr(v.costPerKm)}</td>
                  <td className="py-3 px-3 text-slate-600">{v.downtimeHours} Jam</td>
                  <td className="py-3 px-3 text-slate-700 max-w-xs">{v.reason}</td>
                  <td className="py-3 px-3.5">
                    <span className="text-[11px] text-indigo-700 font-medium bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100 block">
                      {v.recommendedAction}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Top Cost Vehicles Table */}
      {activeTab === 'COST' && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="py-3 px-3.5 font-bold">No. Polisi & Unit</th>
                <th className="py-3 px-3 font-bold">Cabang</th>
                <th className="py-3 px-3 font-bold">Total Biaya Operasi</th>
                <th className="py-3 px-3 font-bold">Cost / KM</th>
                <th className="py-3 px-3 font-bold">Biaya BBM</th>
                <th className="py-3 px-3 font-bold">Biaya Bengkel</th>
                <th className="py-3 px-3.5 font-bold">Jarak Tempuh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topCostVehicles.map((v) => (
                <tr key={v.vehicleId} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3.5 font-bold text-slate-900">
                    <div>{v.plateNumber}</div>
                    <div className="text-[11px] text-slate-500 font-normal">{v.model}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-700">{v.branchName}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{formatIdr(v.totalCostIdr)}</td>
                  <td className="py-3 px-3 font-semibold text-rose-700">{formatIdr(v.costPerKmIdr)}</td>
                  <td className="py-3 px-3 text-amber-700">{formatIdr(v.fuelCostIdr)}</td>
                  <td className="py-3 px-3 text-rose-700">{formatIdr(v.maintenanceCostIdr)}</td>
                  <td className="py-3 px-3.5 text-slate-600">{v.distanceKm.toLocaleString('id-ID')} KM</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Driver Risk Profiles */}
      {activeTab === 'DRIVERS' && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="py-3 px-3.5 font-bold">Nama Driver</th>
                <th className="py-3 px-3 font-bold">Cabang</th>
                <th className="py-3 px-3 font-bold text-center">Skor Safety</th>
                <th className="py-3 px-3 font-bold text-center">Overspeed</th>
                <th className="py-3 px-3 font-bold text-center">Harsh Events</th>
                <th className="py-3 px-3 font-bold text-center">Fatigue Risk</th>
                <th className="py-3 px-3.5 font-bold">Rekomendasi Coaching</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topRiskDrivers.map((d) => (
                <tr key={d.driverId} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3.5 font-bold text-slate-900">{d.name}</td>
                  <td className="py-3 px-3 text-slate-700">{d.branchName}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      {d.safetyScore}/100
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-semibold text-slate-800">{d.violationsCount}x</td>
                  <td className="py-3 px-3 text-center text-slate-700">{d.harshEventsCount}x</td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-rose-700 font-bold">{d.fatigueCount}x alert</span>
                  </td>
                  <td className="py-3 px-3.5">
                    <span className="text-[11px] text-amber-900 bg-amber-50 px-2 py-1 rounded-md border border-amber-200 block">
                      {d.recommendedCoaching}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 4: Top Efficient Vehicles */}
      {activeTab === 'EFFICIENT' && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="py-3 px-3.5 font-bold">No. Polisi & Unit</th>
                <th className="py-3 px-3 font-bold">Cabang</th>
                <th className="py-3 px-3 font-bold">Konsumsi BBM</th>
                <th className="py-3 px-3 font-bold">Cost / KM</th>
                <th className="py-3 px-3 font-bold">Utilisasi</th>
                <th className="py-3 px-3.5 font-bold text-center">Rating Efisiensi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topEfficientVehicles.map((v) => (
                <tr key={v.vehicleId} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3.5 font-bold text-slate-900">
                    <div>{v.plateNumber}</div>
                    <div className="text-[11px] text-slate-500 font-normal">{v.model}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-700">{v.branchName}</td>
                  <td className="py-3 px-3 font-bold text-emerald-700">{v.kmPerLiter} KM/L</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{formatIdr(v.costPerKmIdr)}</td>
                  <td className="py-3 px-3 text-slate-700">{v.utilizationPct}%</td>
                  <td className="py-3 px-3.5 text-center">
                    <span className="font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {v.efficiencyRating} / 100
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 5: Top Productive Vehicles */}
      {activeTab === 'PRODUCTIVE' && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="py-3 px-3.5 font-bold">No. Polisi & Unit</th>
                <th className="py-3 px-3 font-bold">Cabang</th>
                <th className="py-3 px-3 font-bold text-center">Total Ritase Selesai</th>
                <th className="py-3 px-3 font-bold text-center">Drop Point Selesai</th>
                <th className="py-3 px-3 font-bold">Jarak Tempuh</th>
                <th className="py-3 px-3 font-bold">Jam Kerja Aktif</th>
                <th className="py-3 px-3.5 font-bold text-center">Skor Produktivitas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topProductiveVehicles.map((v) => (
                <tr key={v.vehicleId} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3.5 font-bold text-slate-900">
                    <div>{v.plateNumber}</div>
                    <div className="text-[11px] text-slate-500 font-normal">{v.model}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-700">{v.branchName}</td>
                  <td className="py-3 px-3 text-center font-bold text-purple-800">{v.tripsCount} Rit</td>
                  <td className="py-3 px-3 text-center font-semibold text-slate-800">{v.deliveriesCount} Drops</td>
                  <td className="py-3 px-3 text-slate-700">{v.distanceKm.toLocaleString('id-ID')} KM</td>
                  <td className="py-3 px-3 text-slate-700">{v.activeHours} Jam</td>
                  <td className="py-3 px-3.5 text-center">
                    <span className="font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200">
                      {v.productivityScore}
                    </span>
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
