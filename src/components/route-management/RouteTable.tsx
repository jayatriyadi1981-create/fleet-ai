/**
 * Fleet Intelligence Smart AI - Route Master Data Table Component
 * PROMPT 16 — Enterprise Route Table with Quick Actions & Mobile Cards
 */

import React, { useState } from 'react';
import { Route } from '../../modules/routes/routeTypes';
import {
  Waypoints,
  MapPin,
  Clock,
  Sparkles,
  AlertTriangle,
  MoreVertical,
  Eye,
  Edit,
  Navigation,
  Trash2,
  Zap,
  CheckCircle2,
  FileText,
} from 'lucide-react';

interface RouteTableProps {
  routes: Route[];
  onSelectRoute: (routeId: string) => void;
  onEditRoute: (routeId: string) => void;
  onCreateTripFromRoute: (route: Route) => void;
  onOptimizeRoute: (routeId: string) => void;
  onDeleteRoute: (routeId: string) => void;
}

export const RouteTable: React.FC<RouteTableProps> = ({
  routes,
  onSelectRoute,
  onEditRoute,
  onCreateTripFromRoute,
  onOptimizeRoute,
  onDeleteRoute,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  if (routes.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-2xs space-y-3">
        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
          <Waypoints className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-gray-800">Tidak ada rute master yang ditemukan</h3>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          Coba sesuaikan kata kunci pencarian atau filter status untuk menemukan data rute armada.
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-2.5 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg">ACTIVE</span>;
      case 'PLANNED':
        return <span className="px-2.5 py-1 text-[11px] font-bold text-indigo-800 bg-indigo-50 border border-indigo-200 rounded-lg">PLANNED</span>;
      case 'DRAFT':
        return <span className="px-2.5 py-1 text-[11px] font-bold text-gray-700 bg-gray-100 border border-gray-300 rounded-lg">DRAFT</span>;
      case 'INACTIVE':
        return <span className="px-2.5 py-1 text-[11px] font-bold text-rose-800 bg-rose-50 border border-rose-200 rounded-lg">INACTIVE</span>;
      default:
        return <span className="px-2.5 py-1 text-[11px] font-bold text-gray-600 bg-gray-100 rounded-lg">{status}</span>;
    }
  };

  const getOptimizationBadge = (status: string) => {
    switch (status) {
      case 'OPTIMIZED':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-purple-700 bg-purple-50 border border-purple-200 rounded-md">
            <Sparkles className="w-3 h-3 text-purple-600" />
            Teroptimasi AI
          </span>
        );
      case 'PARTIALLY_OPTIMIZED':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-md">
            Parsial
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-[10px] font-medium text-gray-500 bg-gray-100 rounded-md">
            Standar
          </span>
        );
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours}j ` : ''}${mins}m`;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3.5 px-4">Kode & Nama Rute</th>
              <th className="py-3.5 px-4">Origin → Destination</th>
              <th className="py-3.5 px-4">Jarak & Durasi</th>
              <th className="py-3.5 px-4">Status Rute</th>
              <th className="py-3.5 px-4">Optimasi AI</th>
              <th className="py-3.5 px-4">Deviasi & Alert</th>
              <th className="py-3.5 px-4">Versi</th>
              <th className="py-3.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
            {routes.map((route) => {
              const hasDeviations = (route.deviationCount || 0) > 0;
              return (
                <tr
                  key={route.id}
                  className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                  onClick={() => onSelectRoute(route.id)}
                >
                  {/* Code & Name */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-blue-600 group-hover:underline flex items-center gap-1.5">
                      <Waypoints className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>{route.routeCode}</span>
                    </div>
                    <div className="font-semibold text-gray-900 line-clamp-1 mt-0.5">{route.name}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5 font-normal">
                      {route.routeType} • Priority: {route.priority}
                    </div>
                  </td>

                  {/* Origin -> Destination */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                        <span className="truncate max-w-[180px]">{route.origin.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-semibold text-rose-800">
                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                        <span className="truncate max-w-[180px]">{route.destination.name}</span>
                      </div>
                      {route.waypoints.length > 0 && (
                        <div className="text-[10px] text-indigo-600 font-medium pl-3">
                          + {route.waypoints.length} Waypoints Stop
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Distance & Duration */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-bold text-gray-900">{route.distanceKm} KM</div>
                    <div className="text-gray-500 text-[11px] flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-gray-400" />
                      {formatDuration(route.estimatedDurationMinutes)}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStatusBadge(route.status)}
                  </td>

                  {/* Optimization */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getOptimizationBadge(route.optimizationStatus)}
                  </td>

                  {/* Deviations */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {hasDeviations ? (
                      <span className="flex items-center gap-1.5 text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-[11px] font-bold">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        {route.deviationCount} Deviasi Active
                      </span>
                    ) : (
                      <span className="text-gray-400 text-[11px] font-normal">Normal (0)</span>
                    )}
                  </td>

                  {/* Version */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded text-[10px]">
                      v{route.currentVersion}
                    </span>
                  </td>

                  {/* Actions */}
                  <td
                    className="py-3.5 px-4 text-right whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onSelectRoute(route.id)}
                        title="Lihat Detail Rute"
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onCreateTripFromRoute(route)}
                        title="Buat Trip Dari Rute Ini"
                        className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <Navigation className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onOptimizeRoute(route.id)}
                        title="Optimasi Ulang AI"
                        className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        <Zap className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onEditRoute(route.id)}
                        title="Edit Master Rute"
                        className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Hapus rute master ${route.routeCode}?`)) {
                            onDeleteRoute(route.id);
                          }
                        }}
                        title="Hapus Rute"
                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Responsive View */}
      <div className="lg:hidden divide-y divide-gray-200">
        {routes.map((route) => (
          <div
            key={route.id}
            onClick={() => onSelectRoute(route.id)}
            className="p-4 space-y-3 hover:bg-gray-50/80 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-600 text-xs">{route.routeCode}</span>
              {getStatusBadge(route.status)}
            </div>

            <h4 className="font-bold text-gray-900 text-sm leading-snug">{route.name}</h4>

            <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold">Origin</span>
                <p className="font-semibold text-emerald-800 truncate">{route.origin.name}</p>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold">Destination</span>
                <p className="font-semibold text-rose-800 truncate">{route.destination.name}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-600 pt-1">
              <div className="font-bold text-gray-900">{route.distanceKm} KM ({formatDuration(route.estimatedDurationMinutes)})</div>
              {getOptimizationBadge(route.optimizationStatus)}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => onCreateTripFromRoute(route)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200"
              >
                <Navigation className="w-3.5 h-3.5" />
                Buat Trip
              </button>
              <button
                onClick={() => onSelectRoute(route.id)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 rounded-lg border border-blue-200"
              >
                <Eye className="w-3.5 h-3.5" />
                Detail
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
