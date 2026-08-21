import React from 'react';
import { BusTrip, BusFleetKPIs } from '../../../modules/bus/types';
import { 
  Bus, 
  Clock, 
  Users, 
  MapPin, 
  AlertTriangle, 
  ShieldCheck, 
  TrendingUp, 
  DollarSign, 
  Gauge, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface Props {
  kpis: BusFleetKPIs;
  trips: BusTrip[];
  onSelectTrip: (trip: BusTrip) => void;
  onNavigateTab: (tabId: string) => void;
}

export const BusControlTowerTab: React.FC<Props> = ({ kpis, trips, onSelectTrip, onNavigateTab }) => {
  return (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Armada Bus Aktif</span>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600">
              <Bus className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">{kpis.totalActiveBuses} <span className="text-xs font-normal text-slate-500">Unit</span></div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">● {kpis.busesEnRoute} Di Jalan • {kpis.busesInPool} Di Pool</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Load Factor (Okupansi)</span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-emerald-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{kpis.averageOccupancyRatePct}%</div>
          <div className="text-[11px] text-slate-500 font-semibold mt-1">{kpis.dailyPassengersCarried} Penumpang Hari Ini</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Ketepatan Waktu (OTP)</span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-2">{kpis.onTimePerformancePct}%</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Trans-Jawa On-Schedule</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Pendapatan Tiket Hari Ini</span>
            <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-xl text-amber-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            Rp {(kpis.totalDailyTicketRevenue / 1000000).toFixed(1)}M
          </div>
          <div className="text-[11px] text-slate-400 mt-1">+ Rp {(kpis.totalDailyCargoRevenue / 1000000).toFixed(1)}M Kargo Bus</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Efisiensi Solar BBM</span>
            <div className="p-2 bg-sky-50 dark:bg-sky-900/30 rounded-xl text-sky-600">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-sky-600 mt-2">{kpis.averageFuelConsumptionKmPerLiter} <span className="text-xs font-normal text-slate-500">km/L</span></div>
          <div className="text-[11px] text-slate-400 mt-1">Standar OH 1626 / Scania</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Ramp Check Dishub</span>
            <div className="p-2 bg-teal-50 dark:bg-teal-900/30 rounded-xl text-teal-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-teal-600 mt-2">100%</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Laik Jalan & KPS Aktif</div>
        </div>
      </div>

      {/* Main Grid: Live Departure Board & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Trips Board */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Bus className="w-5 h-5 text-blue-600" />
                Papan Keberangkatan & Perjalanan Aktif (Live Departure Board)
              </h3>
              <p className="text-xs text-slate-500">Pemantauan posisi bus, supir, kelas armada, dan keterisian kursi</p>
            </div>
            <button 
              onClick={() => onNavigateTab('trips-schedule')}
              className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1"
            >
              Lihat Semua Jadwal <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {trips.map((t) => {
              const occupancyPct = Math.round((t.bookedSeats / t.totalSeats) * 100);
              return (
                <div 
                  key={t.id}
                  onClick={() => onSelectTrip(t)}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all cursor-pointer space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-xs font-mono font-bold">
                        {t.tripCode}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          {t.routeName}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="font-semibold text-blue-600">{t.busPlateNumber}</span>
                          <span>•</span>
                          <span>{t.busName}</span>
                          <span>•</span>
                          <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-bold text-slate-700 dark:text-slate-300">
                            {t.busClass.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        t.status === 'IN_TRANSIT' 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : t.status === 'BOARDING'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {t.status === 'IN_TRANSIT' ? '● Di Perjalanan' : t.status === 'BOARDING' ? '⏳ Boarding Terminal' : t.status}
                      </span>
                    </div>
                  </div>

                  {/* Sub-info bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs">
                    <div>
                      <div className="text-slate-400 text-[10px]">LOKASI REAL-TIME</div>
                      <div className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                        {t.currentLocationName || t.departureTerminal}
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-400 text-[10px]">KRU KEMUDI & KONDEKTUR</div>
                      <div className="font-semibold text-slate-700 dark:text-slate-200">
                        {t.primaryDriverName} • {t.conductorName}
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-400 text-[10px]">OKUPANSI KURSI ({t.bookedSeats}/{t.totalSeats})</div>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${occupancyPct >= 90 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                            style={{ width: `${occupancyPct}%` }}
                          />
                        </div>
                        <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{occupancyPct}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Smart Dispatcher & Operational Alerts */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h4 className="font-bold text-sm">AI PO Bus Smart Copilot</h4>
              </div>
              <span className="px-2 py-0.5 bg-indigo-500/30 text-indigo-200 text-[10px] font-bold rounded-full border border-indigo-400/30">
                ACTIVE
              </span>
            </div>

            <p className="text-xs text-indigo-100 leading-relaxed">
              Prediksi okupansi rute <strong>Jakarta - Surabaya</strong> akhir pekan ini melonjak <strong>+28%</strong>. Direkomendasikan menambah 2 bus bantuan (Sleeper & Executive) dari Pool Cakung.
            </p>

            <div className="p-3 bg-indigo-950/60 rounded-xl border border-indigo-800/50 space-y-2 text-xs">
              <div className="flex justify-between text-indigo-300">
                <span>Rekomendasi Armada Ekstra:</span>
                <strong className="text-white">B 7990 KGA (Jetbus 5)</strong>
              </div>
              <div className="flex justify-between text-indigo-300">
                <span>Estimasi Tambahan Omzet:</span>
                <strong className="text-emerald-400">+Rp 15.360.000</strong>
              </div>
            </div>

            <button 
              onClick={() => onNavigateTab('ai-dispatcher')}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all"
            >
              Buka Radar Prediksi Penumpang
            </button>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Aksi Cepat Operasional PO Bus</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button 
                onClick={() => onNavigateTab('ticketing-seat')}
                className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl font-semibold text-slate-800 dark:text-slate-200 text-left transition-all border border-slate-200/60 dark:border-slate-700/60"
              >
                🎟️ Reservasi Kursi
              </button>
              <button 
                onClick={() => onNavigateTab('passenger-manifest')}
                className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl font-semibold text-slate-800 dark:text-slate-200 text-left transition-all border border-slate-200/60 dark:border-slate-700/60"
              >
                📋 Scan E-Boarding
              </button>
              <button 
                onClick={() => onNavigateTab('cargo-express')}
                className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl font-semibold text-slate-800 dark:text-slate-200 text-left transition-all border border-slate-200/60 dark:border-slate-700/60"
              >
                📦 Kargo Paket Bus
              </button>
              <button 
                onClick={() => onNavigateTab('ramp-check')}
                className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl font-semibold text-slate-800 dark:text-slate-200 text-left transition-all border border-slate-200/60 dark:border-slate-700/60"
              >
                🛡️ Ramp Check Dishub
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
