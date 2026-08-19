/**
 * Fleet Intelligence Smart AI - Centralized Reusable PageHeader Component
 * Integrates title, description, badge, breadcrumbs, and RBAC-guarded action buttons
 */

import React, { ReactNode } from 'react';
import { useFleet } from '../../context/FleetContext';
import { ROUTE_METADATA_MAP } from '../../config/routeMetadata';
import { Breadcrumb } from './Breadcrumb';
import { Building2, Sparkles } from 'lucide-react';

interface PageHeaderProps {
  customTitle?: string;
  customDescription?: string;
  badge?: string;
  actions?: ReactNode;
  children?: ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  customTitle,
  customDescription,
  badge,
  actions,
  children,
}) => {
  const { activeView, currentTenant } = useFleet();
  const routeMeta = ROUTE_METADATA_MAP[activeView] || ROUTE_METADATA_MAP.dashboard;

  const title = customTitle || routeMeta.title;
  const description = customDescription || routeMeta.description;

  return (
    <div className="space-y-3 border-b border-slate-800/80 pb-4 mb-6">
      {/* Top Breadcrumb & Tenant Indicator */}
      <div className="flex items-center justify-between gap-2">
        <Breadcrumb />
        <div className="hidden lg:flex items-center gap-1.5 text-[10px] font-mono font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
          <Building2 className="h-3 w-3 text-cyan-400" />
          <span>{currentTenant.name}</span>
          <span className="text-slate-600">•</span>
          <span className="text-cyan-300">{currentTenant.subscriptionPlan}</span>
        </div>
      </div>

      {/* Main Title Row & Actions */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              {title}
            </h1>
            {badge && (
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl">
            {description}
          </p>
        </div>

        {actions && (
          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
            {actions}
          </div>
        )}
      </div>

      {children}
    </div>
  );
};
