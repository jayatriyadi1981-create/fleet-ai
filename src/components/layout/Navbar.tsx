/**
 * Fleet Intelligence Smart AI - Enterprise Header / Navbar Component
 * Integrates Breadcrumb, Organization Switcher, Branch Selector, Global Search,
 * Help Center, Notification Center, and User Profile Dropdown
 */

import React, { useState, useRef, useEffect } from 'react';
import { useFleet } from '../../context/FleetContext';
import { useAuth } from '../../context/AuthContext';
import { useAuthorization } from '../../hooks/useAuthorization';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { SubscriptionBadge } from '../subscription/SubscriptionBadge';
import { 
  Building2, 
  Search, 
  Sparkles, 
  Radio, 
  Menu,
  HelpCircle,
  User,
  Settings,
  CreditCard,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Keyboard,
  FileText,
  MessageSquare,
  Globe
} from 'lucide-react';

interface NavbarProps {
  onNavigateLanding?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateLanding }) => {
  const {
    currentTenant,
    branches,
    selectedBranchId,
    setSelectedBranchId,
    currentUser,
    setIsAiDrawerOpen,
    setIsCommandPaletteOpen,
    setIsOrganizationModalOpen,
    setIsKeyboardShortcutsOpen,
    isGpsSimRunning,
    toggleGpsSimulator,
    setActiveView,
    setIsMobileMenuOpen
  } = useFleet();

  const { logout } = useAuth();
  const { userRole, scope } = useAuthorization();

  // Profile Dropdown state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Help Dropdown state
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const helpRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) {
        setIsHelpOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-14 sm:h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/95 px-3 sm:px-6 backdrop-blur-md">
      {/* Left Section: Mobile Drawer Trigger, Tenant Organization Switcher, Branch Selector */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
          title="Buka Menu Navigasi Operations"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Organization / Tenant Switcher Trigger Button */}
        <button
          onClick={() => setIsOrganizationModalOpen(true)}
          className="flex items-center gap-2 rounded-xl border border-slate-800/80 bg-slate-900/80 px-2.5 py-1.5 hover:border-slate-700 hover:bg-slate-900 transition-colors group"
          title="Klik untuk Ganti Perusahaan / Organization"
        >
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md shadow-cyan-950 shrink-0">
            <Building2 className="h-4 w-4" />
          </div>
          <div className="hidden sm:block text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white tracking-tight leading-none group-hover:text-cyan-300 transition-colors truncate max-w-[150px]">
                {currentTenant.name}
              </span>
              <ChevronDown className="h-3 w-3 text-slate-500 group-hover:text-cyan-400" />
            </div>
            <p className="mt-0.5 text-[9px] text-slate-400 font-mono">
              {currentTenant.subscriptionPlan}
            </p>
          </div>
        </button>

        {/* Branch Selector */}
        <div className="relative">
          <select
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
            className="h-8 max-w-[110px] sm:max-w-xs rounded-xl border border-slate-800 bg-slate-900 px-2.5 py-1 text-[11px] sm:text-xs font-medium text-slate-200 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 truncate cursor-pointer"
          >
            <option value="all">Semua Cabang (Global)</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.city})
              </option>
            ))}
          </select>
        </div>

        {/* Subscription Status Badge */}
        <div className="hidden sm:block">
          <SubscriptionBadge />
        </div>
      </div>

      {/* Center Search / Command Palette Trigger (Desktop) */}
      <button
        onClick={() => setIsCommandPaletteOpen(true)}
        className="hidden md:flex items-center gap-2.5 rounded-xl border border-slate-800/90 bg-slate-900/80 px-3.5 py-2 text-xs text-slate-400 hover:border-slate-700 hover:text-slate-200 transition-all w-52 lg:w-80 shadow-inner"
      >
        <Search className="h-3.5 w-3.5 text-slate-400" />
        <span className="flex-1 text-left truncate">Cari armada, driver, lokasi, SPJ...</span>
        <kbd className="rounded-md border border-slate-700 bg-slate-950 px-1.5 py-0.5 text-[10px] font-mono font-bold text-cyan-400 shadow-sm">
          ⌘K
        </kbd>
      </button>

      {/* Right Section: Mobile Search, Realtime Telemetry, AI Assistant, Help, Notifications, User Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Mobile Search Icon */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="md:hidden flex h-8 w-8 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300"
          title="Cari"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Realtime Telemetry Pulse Indicator */}
        <button
          onClick={toggleGpsSimulator}
          title={isGpsSimRunning ? "Telemetri Live Aktif (Klik untuk pause)" : "Telemetri Live Di-pause"}
          className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] sm:text-xs font-semibold transition-all ${
            isGpsSimRunning
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
              : 'border-slate-700 bg-slate-800 text-slate-400'
          }`}
        >
          <Radio className={`h-3 w-3 ${isGpsSimRunning ? 'animate-pulse text-emerald-400' : ''}`} />
          <span className="hidden lg:inline font-mono">{isGpsSimRunning ? 'GPS LIVE' : 'GPS PAUSED'}</span>
        </button>

        {/* AI Assistant Trigger Button */}
        <button
          onClick={() => setIsAiDrawerOpen(true)}
          className="relative flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-950/40 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-900/50 hover:border-cyan-400 transition-all shadow-sm shadow-cyan-950"
        >
          <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
          <span className="hidden sm:inline">AI Assistant</span>
        </button>

        {/* Notification Center Popover */}
        <NotificationCenter />

        {/* Help Center Popover Dropdown */}
        <div className="relative" ref={helpRef}>
          <button
            onClick={() => setIsHelpOpen(!isHelpOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
            title="Pusat Bantuan & Shortcuts"
          >
            <HelpCircle className="h-4 w-4" />
          </button>

          {isHelpOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-800 bg-slate-900 p-2 shadow-2xl backdrop-blur-xl z-50 text-xs space-y-1 animate-fadeIn">
              <button
                onClick={() => {
                  setIsHelpOpen(false);
                  setIsKeyboardShortcutsOpen(true);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-cyan-300 transition-colors text-left"
              >
                <Keyboard className="h-4 w-4 text-cyan-400" />
                <span>Keyboard Shortcuts (?)</span>
              </button>

              <button
                onClick={() => {
                  setIsHelpOpen(false);
                  setActiveView('reports');
                }}
                className="flex w-full items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-cyan-300 transition-colors text-left"
              >
                <FileText className="h-4 w-4 text-cyan-400" />
                <span>Dokumentasi Manual SaaS</span>
              </button>

              <a
                href="mailto:support@fleet-intelligence.id"
                onClick={() => setIsHelpOpen(false)}
                className="flex w-full items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-cyan-300 transition-colors text-left"
              >
                <MessageSquare className="h-4 w-4 text-cyan-400" />
                <span>Hubungi Tim Support</span>
              </a>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Dropdown */}
        <div className="relative border-l border-slate-800/80 pl-2 sm:pl-3" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 rounded-xl hover:bg-slate-900 p-1 transition-colors"
            title="Menu Akun Pengguna"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300 font-bold text-xs border border-cyan-500/30 shadow-sm">
              {currentUser.name.charAt(0)}
            </div>
            <div className="hidden lg:block text-left pr-1">
              <p className="text-xs font-bold text-slate-200 leading-none truncate max-w-[120px]">{currentUser.name}</p>
              <p className="mt-0.5 text-[10px] text-slate-400 uppercase font-mono">{userRole.replace('_', ' ')}</p>
            </div>
            <ChevronDown className="hidden lg:block h-3 w-3 text-slate-500" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-800 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-xl z-50 text-xs space-y-2 animate-fadeIn">
              {/* Profile Header Card */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <p className="font-bold text-white text-sm">{currentUser.name}</p>
                <p className="text-slate-400 text-[11px] truncate">{currentUser.email}</p>
                <div className="pt-1.5 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-cyan-400 font-bold uppercase">{userRole}</span>
                  <span className="text-slate-500">{scope}</span>
                </div>
              </div>

              {/* Menu Links */}
              <div className="space-y-0.5">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setActiveView('profile');
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-left font-semibold"
                >
                  <User className="h-4 w-4 text-cyan-400" />
                  <span>Profil Personal & Sesi</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setActiveView('roles_permissions');
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-left font-semibold"
                >
                  <ShieldCheck className="h-4 w-4 text-cyan-400" />
                  <span>Hak Akses RBAC Saya</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setActiveView('subscription');
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-left font-semibold"
                >
                  <CreditCard className="h-4 w-4 text-cyan-400" />
                  <span>Langganan & Billing</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setActiveView('settings');
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-left font-semibold"
                >
                  <Settings className="h-4 w-4 text-cyan-400" />
                  <span>Pengaturan Perusahaan</span>
                </button>

                {onNavigateLanding && (
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      onNavigateLanding();
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-left font-semibold"
                  >
                    <Globe className="h-4 w-4 text-cyan-400" />
                    <span>Halaman Depan (Landing)</span>
                  </button>
                )}
              </div>

              {/* Sign Out */}
              <div className="pt-1 border-t border-slate-800">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors text-left font-bold"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Keluar Sistem (Sign Out)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
