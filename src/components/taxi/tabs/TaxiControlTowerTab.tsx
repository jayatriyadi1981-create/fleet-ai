import React from 'react';
import {
  Car,
  Navigation,
  DollarSign,
  TrendingUp,
  Clock,
  BatteryCharging,
  Zap,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Users,
  Compass,
  Layers,
  ArrowRight
} from 'lucide-react';
import { taxiService } from '../../../modules/taxi/services/taxiService';

interface Props {
  onNavigateTab: (tabId: string) => void;
}

export const TaxiControlTowerTab: React.FC<Props> = ({ onNavigateTab }) => {
  const kpis = taxiService.getKpis();
  const vehicles = taxiService.getVehicles();
  const orders = taxiService.getOrders();
  const stations = taxiService.getStations();

  return (
    <div id="taxi-control-tower-tab" className="space-y-6">
      {/* Top Banner Quick Summary */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-lg font-bold text-slate-100">Menara Kendali Operasional Taksi (Live Control Tower)</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Monitoring armada taksi live status, utilisasi jarak berpenumpang (Paid KM), antrean pangkalan bandara/stasiun, dan pendapatan real-time
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigateTab('orders')}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center space-x-1.5 shadow-sm"
          >
            <Navigation className="w-4 h-4" />
            <span>Smart Dispatching</span>
          </button>
          <button
            onClick={() => onNavigateTab('ai_copilot')}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg transition-colors border border-slate-700 flex items-center space-x-1.5"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>AI Demand Heatmap</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Armada Beroperasi</span>
            <Car className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-slate-100">{kpis.totalActiveFleet} Unit</div>
          <div className="text-xs text-emerald-400 font-medium">
            {kpis.totalHiredOnTrip} Hired | {kpis.totalVacantAvailable} Kosong | {kpis.totalEvFleet} EV
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Utilisasi Jarak (Paid KM)</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{kpis.utilizationRatePct}%</div>
          <div className="text-xs text-slate-400">
            {kpis.totalPaidKm} KM Muat vs {kpis.totalEmptyKm} KM Kosong
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Pendapatan Bruto Hari Ini</span>
            <DollarSign className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">Rp {kpis.totalGrossRevenueRp.toLocaleString()}</div>
          <div className="text-xs text-slate-400">
            {kpis.totalCompletedTripsToday} Trips | Avg Rp {kpis.avgTripFareRp.toLocaleString()}/Trip
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Rating Penumpang</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400">★ {kpis.avgPassengerRating} / 5.0</div>
          <div className="text-xs text-emerald-400 font-medium">Zero Safety Panic Alert</div>
        </div>
      </div>

      {/* Live Fleet Status & Staging Pangkalan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Taxi List (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Car className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-slate-100">Live Status Armada Taksi (GPS Telemetri)</h3>
            </div>
            <button
              onClick={() => onNavigateTab('fleets')}
              className="text-xs text-amber-400 hover:underline flex items-center space-x-1"
            >
              <span>Lihat Semua Armada</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-800/80 overflow-hidden">
            {vehicles.map((v) => (
              <div key={v.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center font-mono font-bold text-slate-200">
                    {v.hullNumber}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-200">{v.plateNumber}</span>
                      <span className="text-slate-400">({v.model})</span>
                      {v.category === 'ELECTRIC_EV' && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                          EV Green
                        </span>
                      )}
                      {v.category === 'EXECUTIVE_PREMIUM' && (
                        <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-bold">
                          Executive
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 flex items-center space-x-2">
                      <span>Driver: {v.currentDriverName}</span>
                      <span>•</span>
                      <span>Lokasi: {v.currentLocationName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 sm:text-right">
                  <div>
                    <div className="font-mono font-bold text-slate-200">Rp {v.revenueTodayRp.toLocaleString()}</div>
                    <div className="text-[11px] text-slate-400">{v.tripsToday} Ritase | {v.paidKmToday} Paid KM</div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded text-[11px] font-bold border whitespace-nowrap ${
                      v.status === 'ON_TRIP_HIRED'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : v.status === 'AVAILABLE_VACANT'
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                        : v.status === 'STANDBY_QUEUE_POOL'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : v.status === 'CHARGING_REFUELING'
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {v.status === 'ON_TRIP_HIRED' && '● HIRED (Muat)'}
                    {v.status === 'AVAILABLE_VACANT' && '○ VACANT (Kosong)'}
                    {v.status === 'STANDBY_QUEUE_POOL' && '▲ QUEUE POOL'}
                    {v.status === 'CHARGING_REFUELING' && '⚡ CHARGING'}
                    {v.status === 'BREAKDOWN_OFFLINE' && '✕ BENGKEL'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Taxi Stations & Airport Queues (1 col) */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-100">Antrean Pangkalan & Staging</h3>
            </div>
            <button
              onClick={() => onNavigateTab('pools')}
              className="text-xs text-cyan-400 hover:underline"
            >
              Kelola
            </button>
          </div>

          <div className="space-y-3">
            {stations.map((st) => (
              <div key={st.id} className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">{st.name}</span>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    Slot {st.capacitySlots}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">{st.address}</div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px]">
                  <div className="flex items-center space-x-3">
                    <span className="text-emerald-400 font-bold">{st.currentAvailableTaxis} Taksi Ready</span>
                    <span className="text-amber-400">{st.currentQueueLength} Antre</span>
                  </div>
                  <span className="text-slate-400 font-mono">Wait: ~{st.avgWaitTimeMins} mnt</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
