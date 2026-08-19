/**
 * Fleet Intelligence Smart AI - Route KPI Summary Metrics Bar
 * PROMPT 16 — Total, Active, Optimized, Deviations, Delays & Efficiency Metrics
 */

import React from 'react';
import { Route } from '../../modules/routes/routeTypes';
import { Waypoints, CheckCircle2, Sparkles, AlertTriangle, Clock, Gauge, Route as RouteIcon, ShieldAlert } from 'lucide-react';

interface RouteKpiBarProps {
  routes: Route[];
  onSelectStatusFilter?: (status: string) => void;
}

export const RouteKpiBar: React.FC<RouteKpiBarProps> = ({ routes, onSelectStatusFilter }) => {
  const totalRoutes = routes.length;
  const activeRoutes = routes.filter((r) => r.status === 'ACTIVE').length;
  const plannedRoutes = routes.filter((r) => r.status === 'PLANNED').length;
  const optimizedRoutes = routes.filter((r) => r.optimizationStatus === 'OPTIMIZED').length;
  const deviationsCount = routes.reduce((sum, r) => sum + (r.deviationCount || 0), 0);
  const alertRoutes = routes.filter((r) => r.restrictions.length > 0 || (r.deviationCount || 0) > 0).length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {/* 1. Total Routes */}
      <div
        onClick={() => onSelectStatusFilter && onSelectStatusFilter('ALL')}
        className="bg-white p-3 rounded-xl border border-gray-200 shadow-2xs hover:border-blue-400 cursor-pointer transition-all"
      >
        <div className="flex items-center justify-between text-gray-500 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider">Total Routes</span>
          <Waypoints className="w-4 h-4 text-blue-600" />
        </div>
        <div className="text-xl font-extrabold text-gray-900">{totalRoutes}</div>
        <div className="text-[10px] text-gray-500 mt-0.5">Master Rute</div>
      </div>

      {/* 2. Active Routes */}
      <div
        onClick={() => onSelectStatusFilter && onSelectStatusFilter('ACTIVE')}
        className="bg-white p-3 rounded-xl border border-gray-200 shadow-2xs hover:border-emerald-400 cursor-pointer transition-all"
      >
        <div className="flex items-center justify-between text-gray-500 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider">Active</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="text-xl font-extrabold text-emerald-700">{activeRoutes}</div>
        <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Sedang Berjalan</div>
      </div>

      {/* 3. Planned Routes */}
      <div
        onClick={() => onSelectStatusFilter && onSelectStatusFilter('PLANNED')}
        className="bg-white p-3 rounded-xl border border-gray-200 shadow-2xs hover:border-indigo-400 cursor-pointer transition-all"
      >
        <div className="flex items-center justify-between text-gray-500 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider">Planned</span>
          <RouteIcon className="w-4 h-4 text-indigo-600" />
        </div>
        <div className="text-xl font-extrabold text-indigo-700">{plannedRoutes}</div>
        <div className="text-[10px] text-indigo-600 font-semibold mt-0.5">Terjadwal</div>
      </div>

      {/* 4. Optimized Routes */}
      <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-2xs hover:border-purple-400 transition-all">
        <div className="flex items-center justify-between text-gray-500 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider">Optimized</span>
          <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
        </div>
        <div className="text-xl font-extrabold text-purple-700">{optimizedRoutes}</div>
        <div className="text-[10px] text-purple-600 font-semibold mt-0.5">Teroptimasi AI</div>
      </div>

      {/* 5. Route Deviations */}
      <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-2xs hover:border-amber-400 transition-all">
        <div className="flex items-center justify-between text-gray-500 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider">Deviations</span>
          <AlertTriangle className="w-4 h-4 text-amber-600" />
        </div>
        <div className="text-xl font-extrabold text-amber-700">{deviationsCount}</div>
        <div className="text-[10px] text-amber-600 font-semibold mt-0.5">Deviasi Rute</div>
      </div>

      {/* 6. Routes with Alerts */}
      <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-2xs hover:border-rose-400 transition-all">
        <div className="flex items-center justify-between text-gray-500 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider">Alerts</span>
          <ShieldAlert className="w-4 h-4 text-rose-600" />
        </div>
        <div className="text-xl font-extrabold text-rose-700">{alertRoutes}</div>
        <div className="text-[10px] text-rose-600 font-semibold mt-0.5">Pembatasan/Alert</div>
      </div>

      {/* 7. Average Delay */}
      <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-2xs">
        <div className="flex items-center justify-between text-gray-500 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider">Avg Delay</span>
          <Clock className="w-4 h-4 text-blue-500" />
        </div>
        <div className="text-xl font-extrabold text-blue-900">+14 mnt</div>
        <div className="text-[10px] text-gray-500 mt-0.5">Keterlambatan Rata2</div>
      </div>

      {/* 8. Average Route Efficiency */}
      <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-2xs">
        <div className="flex items-center justify-between text-gray-500 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider">Efficiency</span>
          <Gauge className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="text-xl font-extrabold text-emerald-700">89.4%</div>
        <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Efisiensi Rute AI</div>
      </div>
    </div>
  );
};
