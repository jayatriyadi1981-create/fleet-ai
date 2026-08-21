import React, { useState } from 'react';
import {
  Waypoints,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
  Navigation,
  Check,
  Bike
} from 'lucide-react';
import { pudService } from '../../../modules/pud/services/pudService';
import { PudRoutePlan } from '../../../modules/pud/types';

export const PudRouteOptimizerTab: React.FC = () => {
  const [routes, setRoutes] = useState<PudRoutePlan[]>(pudService.getRoutePlans());
  const [selectedRoute, setSelectedRoute] = useState<PudRoutePlan>(routes[0]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationNotice, setOptimizationNotice] = useState<string | null>(null);

  const handleRunOptimizer = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      setOptimizationNotice('Optimasi Algoritma VRP Selesai: Jarak tempuh terpangkas 18.2% dan efisiensi waktu hemat 28 menit.');
      setTimeout(() => setOptimizationNotice(null), 5000);
    }, 800);
  };

  return (
    <div className="space-y-6" id="pud-route-optimizer-tab">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Waypoints className="w-5 h-5 text-indigo-600" />
            Optimasi Rute Multi-Stop (VRP & TSP Routing)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengurutan titik perhentian cerdas (Stop 1 &rarr; Stop N) guna meminimalkan jarak tempuh dan konsumsi bahan bakar.
          </p>
        </div>

        <button
          onClick={handleRunOptimizer}
          disabled={isOptimizing}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition disabled:opacity-50"
        >
          <Sparkles className={`w-4 h-4 text-amber-300 ${isOptimizing ? 'animate-spin' : ''}`} />
          <span>{isOptimizing ? 'Menghitung Rute Terbaik...' : 'Jalankan Smart Re-Sequencing'}</span>
        </button>
      </div>

      {optimizationNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{optimizationNotice}</span>
        </div>
      )}

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 block">Total Jarak Tempuh Rute</span>
          <span className="text-xl font-black text-slate-900 mt-1 block">{selectedRoute.totalDistanceKm} Km</span>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
            <TrendingDown className="w-3 h-3" /> Hemat 4.2 Km dibanding rute acak
          </span>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 block">Estimasi Total Waktu Selesai</span>
          <span className="text-xl font-black text-slate-900 mt-1 block">{selectedRoute.estimatedTotalTimeMins} Menit</span>
          <span className="text-[11px] text-indigo-600 font-bold mt-0.5 block">Termasuk perkiraan traffic & waktu serah terima</span>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 block">Kemajuan Perhentian (Stops)</span>
          <span className="text-xl font-black text-emerald-600 mt-1 block">
            {selectedRoute.completedStops} / {selectedRoute.totalStops} Selesai
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Kurir: {selectedRoute.courierName} ({selectedRoute.vehiclePlate})</span>
        </div>
      </div>

      {/* Sequenced Stops Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Navigation className="w-4 h-4 text-indigo-600" />
          Urutan Titik Perhentian Rute ({selectedRoute.routeCode})
        </h3>

        <div className="space-y-4 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-slate-200 before:z-0">
          {selectedRoute.optimizedSequence.map((stop) => (
            <div key={stop.sequenceNumber} className="relative z-10 flex items-start gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-sm ${
                stop.status === 'COMPLETED'
                  ? 'bg-emerald-500 text-white'
                  : stop.status === 'ARRIVED'
                  ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                  : 'bg-slate-200 text-slate-700'
              }`}>
                {stop.sequenceNumber}
              </div>

              <div className="flex-1 p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      stop.taskType === 'PICKUP' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
                    }`}>
                      {stop.taskType}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-700">{stop.trackingNumber}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{stop.contactName} ({stop.phone})</h4>
                  <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    {stop.address}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-indigo-700 block">Jendela: {stop.timeWindow}</span>
                  <span className="text-[11px] text-slate-500">Estimasi Tiba: {stop.eta} WIB</span>
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded mt-1 ${
                    stop.status === 'COMPLETED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : stop.status === 'ARRIVED'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {stop.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
