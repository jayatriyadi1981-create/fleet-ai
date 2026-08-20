import React from 'react';
import { useFleet, ActiveView } from '../../context/FleetContext';
import { useAuthorization } from '../../hooks/useAuthorization';
import { NAVIGATION_CONFIG } from '../../config/navigationConfig';
import { Drawer } from '../ui/Drawer';
import { 
  LayoutDashboard, 
  MapPin, 
  Truck, 
  Sparkles, 
  Menu, 
  Bell, 
  ChevronRight, 
  Shield, 
  User,
  ShieldCheck
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    setIsAiDrawerOpen, 
    unreadAlertsCount,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    currentUser,
    currentTenant,
  } = useFleet();

  const { can, userRole, scope } = useAuthorization();

  interface PrimaryNavItem {
    id: ActiveView;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    permission: string;
    badge?: number;
  }

  const primaryItems: PrimaryNavItem[] = [
    { id: 'dashboard' as ActiveView, label: 'Home', icon: LayoutDashboard, permission: 'dashboard.view' },
    { id: 'vehicles' as ActiveView, label: 'Fleet', icon: Truck, permission: 'vehicle.view' },
    { id: 'live_tracking' as ActiveView, label: 'Map', icon: MapPin, permission: 'tracking.view' },
    { id: 'fleet_assistant' as ActiveView, label: 'AI', icon: Sparkles, permission: 'ai.view' },
  ].filter((i) => can(i.permission));

  const handleSelect = (id: ActiveView) => {
    setActiveView(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Bottom Navigation Bar (Max 5 items: Home, Fleet, Map, AI, More) */}
      <nav
        role="navigation"
        aria-label="Navigasi Mobile Utama"
        className="fixed bottom-0 left-0 right-0 z-40 flex h-16 w-full items-center justify-around border-t border-slate-800 bg-slate-950/95 px-1.5 pb-[max(env(safe-area-inset-bottom),0.35rem)] backdrop-blur-lg md:hidden shadow-2xl"
      >
        {primaryItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              aria-label={`Buka halaman ${item.label}`}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex min-h-[44px] min-w-[44px] flex-1 flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-xl text-[10px] font-semibold transition-all ${
                isActive
                  ? 'text-cyan-300 font-bold bg-cyan-500/10 border border-cyan-500/30 shadow-sm shadow-cyan-950/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive && item.id === 'fleet_assistant' ? 'text-cyan-300 animate-pulse' : ''}`} />
              <span className="truncate">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* More Menu Drawer Toggle */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Buka Menu Navigasi Lengkap"
          aria-expanded={isMobileMenuOpen}
          className={`relative flex min-h-[44px] min-w-[44px] flex-1 flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-xl text-[10px] font-semibold transition-all ${
            isMobileMenuOpen
              ? 'text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Menu className="h-5 w-5" />
          <span>More</span>
          {unreadAlertsCount > 0 && (
            <span className="absolute top-1 right-2 flex h-2 w-2 rounded-full bg-rose-500 ring-2 ring-slate-950 animate-pulse" />
          )}
        </button>
      </nav>

      {/* Reusable Mobile Drawer */}
      <Drawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        title="Fleet Operations Drawer"
        position="left"
        size="md"
      >
        <div className="flex flex-col h-full space-y-6 pb-12">
          {/* User Profile Card & Role Display */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/20 border border-cyan-500/40 font-bold text-cyan-300 text-sm">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{currentUser.name}</h4>
                <p className="text-xs text-slate-400">{currentTenant.name}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Role: <strong className="text-cyan-300 uppercase">{userRole}</strong></span>
              <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold">
                SCOPE: {scope}
              </span>
            </div>
          </div>

          {/* Quick AI Assistant Trigger */}
          {can('ai.view') && (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setActiveView('fleet_assistant');
              }}
              className="flex w-full items-center justify-between rounded-xl border border-cyan-500/30 bg-cyan-950/40 p-3.5 text-xs font-bold text-cyan-300 shadow-sm shadow-cyan-950/50 hover:bg-cyan-900/40 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
                <span>Buka AI Fleet Assistant</span>
              </div>
              <ChevronRight className="h-4 w-4 text-cyan-400" />
            </button>
          )}

          {/* Navigation Sections Filtered by RBAC */}
          <div className="space-y-5 overflow-y-auto pr-1">
            {NAVIGATION_CONFIG.map((group, idx) => {
              const visibleItems = group.items.filter((item) => can(item.permission));
              if (visibleItems.length === 0) return null;

              return (
                <div key={idx} className="space-y-1.5">
                  {group.title && (
                    <p className="px-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {group.title}
                    </p>
                  )}
                  <div className="space-y-1">
                    {visibleItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeView === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelect(item.id)}
                          className={`flex w-full items-center justify-between rounded-xl border p-3 text-xs font-semibold transition-all ${
                            isActive
                              ? 'border-cyan-500/40 bg-cyan-950/40 text-cyan-300 shadow-sm'
                              : 'border-slate-800/80 bg-slate-900/50 text-slate-300 hover:bg-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-4 w-4 text-cyan-400" />
                            <span>{item.label}</span>
                          </div>
                          <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* System Footer */}
          <div className="mt-auto border-t border-slate-800 pt-3 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Fleet RBAC Engine v2.4</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Protected
            </span>
          </div>
        </div>
      </Drawer>
    </>
  );
};
