import React, { useState } from 'react';
import { 
  Waypoints, 
  Route, 
  Truck, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  CheckCircle2,
  TrendingDown,
  Layers
} from 'lucide-react';
import { LogisticsOrder, LogisticsHub } from '../../../modules/logistics/types';

interface Props {
  orders: LogisticsOrder[];
  hubs: LogisticsHub[];
}

export const LogisticsRoutePlanningTab: React.FC<Props> = ({ orders, hubs }) => {
  const [selectedRoute, setSelectedRoute] = useState<'jkt-bdg' | 'jkt-sby' | 'last-mile-jkt'>('jkt-bdg');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedStatus, setOptimizedStatus] = useState(true);

  const handleReOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      setOptimizedStatus(true);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Waypoints className="w-6 h-6 text-indigo-600" />
            Perencanaan Rute & Optimasi Muatan (Load Planning)
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Algoritma VRP (Vehicle Routing Problem) untuk multi-drop last mile & efisiensi BBM linehaul antar kota.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleReOptimize}
            disabled={isOptimizing}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            {isOptimizing ? 'Mengoptimasi AI...' : 'Jalankan AI Route Optimizer'}
          </button>
        </div>
      </div>

      {/* 3 Routes Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          onClick={() => setSelectedRoute('jkt-bdg')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            selectedRoute === 'jkt-bdg' 
              ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 dark:border-indigo-500 shadow-md' 
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-sm text-slate-900 dark:text-white">Linehaul Koridor 1</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">CDD Wingbox</span>
          </div>
          <div className="text-xs text-slate-500">Jakarta Hub ➔ Bandung Regional Hub</div>
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">152 KM • 3.5 Jam</span>
            <span className="text-emerald-600 font-bold">Load 88.5%</span>
          </div>
        </div>

        <div 
          onClick={() => setSelectedRoute('jkt-sby')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            selectedRoute === 'jkt-sby' 
              ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 dark:border-indigo-500 shadow-md' 
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-sm text-slate-900 dark:text-white">Linehaul Koridor 2</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300">Reefer Cold Chain</span>
          </div>
          <div className="text-xs text-slate-500">Jakarta ➔ Semarang ➔ Surabaya</div>
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">785 KM • 14.0 Jam</span>
            <span className="text-emerald-600 font-bold">Load 92.0%</span>
          </div>
        </div>

        <div 
          onClick={() => setSelectedRoute('last-mile-jkt')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            selectedRoute === 'last-mile-jkt' 
              ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 dark:border-indigo-500 shadow-md' 
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-sm text-slate-900 dark:text-white">Multi-Drop Last Mile</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">Blind Van Courier</span>
          </div>
          <div className="text-xs text-slate-500">Zonasi Jakarta Barat & Cengkareng (12 Drops)</div>
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">48 KM • 4.8 Jam</span>
            <span className="text-emerald-600 font-bold">12 Drops Sequence</span>
          </div>
        </div>
      </div>

      {/* Route Waypoints Sequence */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Route className="w-5 h-5 text-indigo-600" />
            Urutan Titik Perjalanan (AI Sequence Optimization)
          </h3>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full">
            <TrendingDown className="w-3.5 h-3.5" /> Hemat BBM 18.4% vs Rute Acak
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
              1
            </div>
            <div className="flex-1 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="font-bold text-slate-900 dark:text-white text-sm">Origin: Jakarta Central Sorting Hub (Cakung)</span>
                <span className="text-slate-400">08:00 WIB</span>
              </div>
              <p className="text-slate-500">Loading dock B4 • Muat 148 Resi (3,840 kg) • Pemasangan Segel GPS SEAL-JKT-881920</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
              2
            </div>
            <div className="flex-1 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="font-bold text-slate-900 dark:text-white text-sm">Tol Jakarta - Cikampek KM 57 (Rest Area & Driver Check)</span>
                <span className="text-slate-400">09:15 WIB</span>
              </div>
              <p className="text-slate-500">Pemeriksaan tekanan ban telematika TPMS & pengecekan suhu box</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
              3
            </div>
            <div className="flex-1 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="font-bold text-slate-900 dark:text-white text-sm">Destination: Bandung Regional Logistics Hub</span>
                <span className="text-slate-400">11:30 WIB (ETA)</span>
              </div>
              <p className="text-slate-500">Unloading gate 2 • Pembukaan segel elektronik • Sorting conveyor line outbound</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
