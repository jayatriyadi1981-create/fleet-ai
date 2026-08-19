/**
 * Fleet Intelligence Smart AI - Centralized Reusable Breadcrumb Component
 * Driven by routeMetadata configuration and supports mobile compaction
 */

import React from 'react';
import { useFleet } from '../../context/FleetContext';
import { ROUTE_METADATA_MAP } from '../../config/routeMetadata';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb: React.FC = () => {
  const { activeView, setActiveView } = useFleet();
  const routeMeta = ROUTE_METADATA_MAP[activeView] || ROUTE_METADATA_MAP.dashboard;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs text-slate-400 font-medium py-1">
      {/* Desktop / Tablet Full Breadcrumb */}
      <ol className="hidden sm:flex items-center space-x-2">
        <li>
          <button
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors"
            title="Ke Dashboard Utama"
          >
            <Home className="h-3.5 w-3.5 text-slate-500" />
            <span>Home</span>
          </button>
        </li>

        {routeMeta.breadcrumb.map((crumb, index) => {
          const isLast = index === routeMeta.breadcrumb.length - 1;
          return (
            <li key={crumb} className="flex items-center space-x-2">
              <ChevronRight className="h-3.5 w-3.5 text-slate-600 shrink-0" />
              {isLast ? (
                <span className="font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-md">
                  {crumb}
                </span>
              ) : (
                <span className="text-slate-400">{crumb}</span>
              )}
            </li>
          );
        })}
      </ol>

      {/* Mobile Compact Breadcrumb */}
      <div className="flex sm:hidden items-center space-x-1.5 text-[11px]">
        <span className="text-slate-500 font-mono">/</span>
        <span className="font-bold text-cyan-300 truncate max-w-[180px]">
          {routeMeta.title}
        </span>
      </div>
    </nav>
  );
};
