/**
 * Fleet Intelligence Smart AI - Enterprise Sidebar Component
 * Implements expanded (~260px), collapsed (~72px), group toggling, and RBAC filtering
 */

import React, { useState } from 'react';
import { useFleet } from '../../context/FleetContext';
import { useAuthorization } from '../../hooks/useAuthorization';
import { NAVIGATION_CONFIG } from '../../config/navigationConfig';
import { Tooltip } from '../ui/Tooltip';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  Building2, 
  User, 
  Sparkles,
  ShieldCheck,
  Radio
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    unreadAlertsCount, 
    vehicles, 
    maintenanceOrders,
    isSidebarCollapsed,
    toggleSidebar,
    currentTenant,
    currentUser
  } = useFleet();

  const { can, userRole, scope } = useAuthorization();

  // Collapsible groups state
  const [collapsedGroups, setCollapsedGroups] = useState<Record<number, boolean>>({});

  const toggleGroup = (idx: number) => {
    setCollapsedGroups((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const movingCount = vehicles.filter((v) => v.status === 'moving').length;
  const overdueMaintenanceCount = maintenanceOrders.filter((m) => m.status === 'scheduled').length;

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-slate-800 bg-slate-950 py-4 text-slate-300 select-none transition-all duration-300 z-20 ${
        isSidebarCollapsed ? 'w-20 px-2' : 'w-64 px-3'
      }`}
      style={{ width: isSidebarCollapsed ? '72px' : '260px' }}
    >
      {/* Sidebar Header Toggle & App Brand */}
      <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-slate-800/80 px-2">
        {!isSidebarCollapsed && (
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm shadow-md shadow-cyan-950">
              ✦
            </div>
            <div>
              <span className="text-xs font-bold text-white tracking-wider block leading-tight">FLEET INTEL</span>
              <span className="text-[9px] font-mono font-semibold text-cyan-400 uppercase tracking-widest block">
                SMART AI SAAS
              </span>
            </div>
          </div>
        )}

        {isSidebarCollapsed && (
          <div className="mx-auto text-cyan-400 font-bold text-lg" title="Fleet Intelligence">
            ✦
          </div>
        )}

        <button
          onClick={toggleSidebar}
          title={isSidebarCollapsed ? 'Perluas Sidebar (⌘\)' : 'Ciutkan Sidebar'}
          className={`flex h-7 w-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors ${
            isSidebarCollapsed ? 'mt-2 mx-auto' : ''
          }`}
        >
          {isSidebarCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Nav Groups Filtered by RBAC */}
      <div className="flex-1 space-y-5 overflow-y-auto pr-1">
        {NAVIGATION_CONFIG.map((group, gIdx) => {
          const visibleItems = group.items.filter((item) => can(item.permission));
          if (visibleItems.length === 0) return null;

          const isGroupCollapsed = !!collapsedGroups[gIdx];

          return (
            <div key={gIdx} className="space-y-1">
              {group.title && !isSidebarCollapsed && (
                <button
                  onClick={() => toggleGroup(gIdx)}
                  className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <span>{group.title}</span>
                  <ChevronDown className={`h-3 w-3 transition-transform ${isGroupCollapsed ? '-rotate-90' : ''}`} />
                </button>
              )}

              {(!isGroupCollapsed || isSidebarCollapsed) && (
                <div className="space-y-0.5">
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;

                    let badgeText: string | number | undefined;
                    let badgeVariant: 'danger' | 'warning' | 'info' = 'info';

                    if (item.badgeType === 'moving' && movingCount > 0) {
                      badgeText = `${movingCount}`;
                      badgeVariant = 'info';
                    } else if (item.badgeType === 'overdue_maintenance' && overdueMaintenanceCount > 0) {
                      badgeText = overdueMaintenanceCount;
                      badgeVariant = 'warning';
                    } else if (item.badgeType === 'unread_alerts' && unreadAlertsCount > 0) {
                      badgeText = unreadAlertsCount;
                      badgeVariant = 'danger';
                    }

                    const navButton = (
                      <button
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
                        className={`group relative flex w-full items-center ${
                          isSidebarCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
                        } rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-950'
                            : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-200'
                        }`}
                      >
                        {/* Left Active Bar Indicator */}
                        {isActive && (
                          <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-cyan-400" />
                        )}

                        <div className="flex items-center gap-2.5">
                          <Icon className={`h-4 w-4 shrink-0 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                          {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                        </div>

                        {!isSidebarCollapsed && badgeText !== undefined && (
                          <span
                            className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                              badgeVariant === 'danger'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : badgeVariant === 'warning'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            }`}
                          >
                            {badgeText}
                          </span>
                        )}

                        {isSidebarCollapsed && badgeText !== undefined && (
                          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                        )}
                      </button>
                    );

                    if (isSidebarCollapsed) {
                      return (
                        <Tooltip key={item.id} content={item.label} position="right">
                          {navButton}
                        </Tooltip>
                      );
                    }

                    return navButton;
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sidebar Footer: Tenant & User Profile Card */}
      <div className="mt-auto border-t border-slate-800/80 pt-3 px-1 space-y-2">
        {!isSidebarCollapsed ? (
          <div
            onClick={() => setActiveView('profile')}
            className="rounded-xl bg-slate-900/80 p-2.5 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors space-y-2"
            title="Buka Profil Pengguna"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold text-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate leading-none">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{currentTenant.name}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] font-mono">
              <span className="text-cyan-400 font-bold uppercase">{userRole.replace('_', ' ')}</span>
              <span className="text-slate-400">SCOPE: {scope}</span>
            </div>
          </div>
        ) : (
          <div
            onClick={() => setActiveView('profile')}
            className="flex justify-center cursor-pointer py-1"
            title={`${currentUser.name} (${userRole})`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold text-xs">
              {currentUser.name.charAt(0)}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
