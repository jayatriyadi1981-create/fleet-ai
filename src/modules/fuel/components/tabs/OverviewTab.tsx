/**
 * Fleet Intelligence Smart AI - Fuel Overview Tab
 * PROMPT 24 - Executive Dashboard KPI Summary, Consumption Chart, Fuel Gauges & Suspected Drain Cards
 */

import React from 'react';
import { Fuel, TrendingUp, AlertTriangle, Droplet, DollarSign, Activity, Sparkles, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { FuelOverviewKPIs, FuelReading, FuelAnomaly, RefuelingEvent } from '../../types';
import { FuelGauge } from '../widgets/FuelGauge';

interface OverviewTabProps {
  kpis: FuelOverviewKPIs;
  readings: FuelReading[];
  anomalies: FuelAnomaly[];
  refuelings: RefuelingEvent[];
  onOpenVehicleModal: (vehicleId: string) => void;
  onOpenEventModal: (anomaly: FuelAnomaly) => void;
  onOpenRefuelingModal: () => void;
}

const chartData = [
  { day: 'Tgl 1', consumption: 3100, cost: 21080000, drainVolume: 0 },
  { day: 'Tgl 3', consumption: 3450, cost: 23460000, drainVolume: 0 },
  { day: 'Tgl 5', consumption: 3800, cost: 25840000, drainVolume: 12 },
  { day: 'Tgl 7', consumption: 3200, cost: 21760000, drainVolume: 0 },
  { day: 'Tgl 9', consumption: 3900, cost: 26520000, drainVolume: 0 },
  { day: 'Tgl 11', consumption: 4100, cost: 27880000, drainVolume: 28 },
  { day: 'Tgl 13', consumption: 3600, cost: 24480000, drainVolume: 0 },
  { day: 'Tgl 15', consumption: 3750, cost: 25500000, drainVolume: 0 },
];

export const OverviewTab: React.FC<OverviewTabProps> = ({
  kpis,
  readings,
  anomalies,
  refuelings,
  onOpenVehicleModal,
  onOpenEventModal,
  onOpenRefuelingModal,
}) => {
  const suspectedDrains = anomalies.filter((a) => a.type === 'SUSPECTED_DRAIN');

  return (
    <div className="space-y-6">
      {/* Top Executive KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Konsumsi BBM (L)</span>
            <div className="p-2 bg-cyan-950/60 text-cyan-400 rounded-xl border border-cyan-800/40">
              <Droplet className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2">
            {kpis.totalFuelConsumedLiters.toLocaleString('id-ID')} <span className="text-xs font-normal text-slate-400">Liter</span>
          </p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-1">
            <ArrowDownRight className="h-3.5 w-3.5" />
            <span>-3.8% vs bulan lalu (Efisiensi membaik)</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Rata-rata Konsumsi Armada</span>
            <div className="p-2 bg-emerald-950/60 text-emerald-400 rounded-xl border border-emerald-800/40">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-400 mt-2">
            {kpis.avgConsumptionKmPerLiter} <span className="text-xs font-normal text-slate-400">KM / Liter</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Standard B35: {kpis.avgConsumptionLiterPer100Km} L/100km
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Biaya Pembelian BBM</span>
            <div className="p-2 bg-amber-950/60 text-amber-400 rounded-xl border border-amber-800/40">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2">
            Rp {(kpis.totalFuelCostIdr / 1000000).toFixed(1)} jt
          </p>
          <p className="text-[11px] text-cyan-400 mt-1">
            Biaya Rata-rata: Rp {kpis.avgCostPerKmIdr} / KM
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Anomali & Indikasi Drain</span>
            <div className="p-2 bg-rose-950/60 text-rose-400 rounded-xl border border-rose-800/40">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-400 mt-2">
            {kpis.totalAnomaliesCount} <span className="text-xs font-normal text-slate-400">Anomali</span>
          </p>
          <p className="text-[11px] text-rose-300 mt-1 font-semibold">
            {kpis.suspectedDrainEventsCount} Indikasi Suspected Drain
          </p>
        </div>
      </div>

      {/* Main Chart + Quick Action Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Tren Konsumsi BBM & Biaya Operasional (Agustus 2026)</h3>
              <p className="text-xs text-slate-400">Integrasi real-time telemetry sensor tangki dan klaim SPBU.</p>
            </div>
            <button
              onClick={onOpenRefuelingModal}
              className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-600/30"
            >
              <Fuel className="h-3.5 w-3.5" /> + Catat Struk BBM
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="fuelColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="consumption" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#fuelColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight Box */}
        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-cyan-300">Rangkuman AI Fuel Intelligence</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Sistem AI mengamati konsumsi BBM armada berada dalam batas normal efisiensi (3.82 KM/L). Namun, terdeteksi penurunan tidak wajar sebesar <strong className="text-rose-400">28 Liters</strong> pada Unit <strong className="text-white">B 1234 ABC</strong> di Rest Area Batang KM 375 saat mesin mati.
            </p>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-1">
            <span className="text-slate-400 block text-[10px]">Rekomendasi Tindakan Ops</span>
            <p className="text-cyan-300 font-semibold">Lakukan konfirmasi fisik tutup tangki & struk SPBU terdekat.</p>
          </div>
        </div>
      </div>

      {/* Live Tank Fuel Gauge Grid for Top Vehicles */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Activity className="h-4 w-4 text-cyan-400" /> Status Level Tangki BBM Kendaraan Real-Time
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {readings.slice(0, 3).map((r) => (
            <div key={r.id} onClick={() => onOpenVehicleModal(r.vehicleId)} className="cursor-pointer">
              <FuelGauge
                percentage={r.fuelPercentage}
                liters={r.fuelLevel}
                vehiclePlate={r.vehiclePlate}
                source={r.source}
                confidence={r.confidence}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Suspected Fuel Drains Summary */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-400" /> Indikasi Fuel Drain Terbaru
          </h3>
          <span className="text-xs text-rose-400 font-semibold">Perlu Penanganan Ops</span>
        </div>

        <div className="space-y-2">
          {suspectedDrains.map((drain) => (
            <div
              key={drain.id}
              onClick={() => onOpenEventModal(drain)}
              className="cursor-pointer p-3 rounded-xl border border-slate-800 bg-slate-950/80 hover:border-cyan-500/50 transition-all flex items-center justify-between text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{drain.vehiclePlate}</span>
                  <span className="text-rose-400 font-bold">Penurunan: {drain.variance} Liter</span>
                  <span className="text-[10px] text-slate-400">({new Date(drain.timestamp).toLocaleTimeString('id-ID')})</span>
                </div>
                <p className="text-slate-400">{drain.evidence.description}</p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-rose-950 border border-rose-800 text-rose-300 font-bold text-[11px]">
                Investigasi
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
