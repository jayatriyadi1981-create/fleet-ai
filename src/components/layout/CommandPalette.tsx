/**
 * Fleet Intelligence Smart AI - Enterprise Command Palette & Global Search Overlay
 * Keyboard accessible (⌘K / Ctrl+K), RBAC permission-aware, debounced search across modules
 */

import React, { useState, useEffect } from 'react';
import { useFleet, ActiveView } from '../../context/FleetContext';
import { useAuthorization } from '../../hooks/useAuthorization';
import { NAVIGATION_CONFIG } from '../../config/navigationConfig';
import { 
  Search, 
  Truck, 
  Users, 
  Sparkles, 
  X, 
  MapPin, 
  Navigation, 
  FileText, 
  Settings, 
  ShieldCheck, 
  Bell, 
  Wrench, 
  Fuel, 
  BarChart3, 
  ArrowRight,
  Command,
  Keyboard
} from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    vehicles,
    drivers,
    trips,
    setSelectedVehicle,
    setActiveView,
    setIsAiDrawerOpen,
    setIsKeyboardShortcutsOpen
  } = useFleet();

  const { can } = useAuthorization();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Global Keyboard Listener for ⌘K / Ctrl+K and Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      } else if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      } else if (e.key === '?' && !isCommandPaletteOpen && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsKeyboardShortcutsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen, setIsKeyboardShortcutsOpen]);

  if (!isCommandPaletteOpen) return null;

  // Filter navigation commands by permission
  const navigationItems = NAVIGATION_CONFIG.flatMap((g) => g.items)
    .filter((item) => can(item.permission))
    .filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));

  // Filter vehicles by query & permission
  const filteredVehicles = can('vehicle.view')
    ? vehicles.filter(
        (v) =>
          v.plateNumber.toLowerCase().includes(query.toLowerCase()) ||
          v.brand.toLowerCase().includes(query.toLowerCase()) ||
          v.model.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  // Filter drivers by query & permission
  const filteredDrivers = can('driver.view')
    ? drivers.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  // Filter trips by query & permission
  const filteredTrips = can('trip.view')
    ? trips.filter(
        (t) =>
          t.tripNumber.toLowerCase().includes(query.toLowerCase()) ||
          t.origin.toLowerCase().includes(query.toLowerCase()) ||
          t.destination.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-3 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-cyan-950/50">
        {/* Search Header Input */}
        <div className="flex items-center border-b border-slate-800 px-4 py-3 bg-slate-950">
          <Search className="h-5 w-5 text-cyan-400 mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik perintah atau cari plat nomor, driver, SPJ, modul..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 outline-none"
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800"
            title="Tutup (Esc)"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {/* Quick AI & Navigation Actions */}
          {!query && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2">Aksi Cepat Enterprise</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {can('ai.view') && (
                  <button
                    onClick={() => {
                      setIsCommandPaletteOpen(false);
                      setIsAiDrawerOpen(true);
                    }}
                    className="flex items-center justify-between rounded-xl border border-cyan-500/30 bg-cyan-950/40 p-3 text-xs font-semibold text-cyan-300 hover:bg-cyan-900/50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
                      <span>Tanya Assistant Fleet AI</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-cyan-400" />
                  </button>
                )}

                {can('tracking.view') && (
                  <button
                    onClick={() => {
                      setIsCommandPaletteOpen(false);
                      setActiveView('live_tracking');
                    }}
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin className="h-4 w-4 text-emerald-400" />
                      <span>Buka Live GPS Telematics Map</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Navigation Items */}
          {navigationItems.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 mb-1.5">
                Modul Halaman Aplikasi ({navigationItems.length})
              </p>
              <div className="space-y-1">
                {navigationItems.map((nav) => {
                  const NavIcon = nav.icon;
                  return (
                    <button
                      key={nav.id}
                      onClick={() => {
                        setActiveView(nav.id);
                        setIsCommandPaletteOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-xl p-2.5 text-xs text-slate-200 hover:bg-slate-800 hover:text-cyan-300 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <NavIcon className="h-4 w-4 text-cyan-400" />
                        <span className="font-semibold text-white group-hover:text-cyan-300">{nav.label}</span>
                      </div>
                      <kbd className="text-[10px] text-slate-500 font-mono group-hover:text-cyan-400">Jump to →</kbd>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Vehicles Results */}
          {filteredVehicles.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 mb-1.5">
                Kendaraan Armada ({filteredVehicles.length})
              </p>
              <div className="space-y-1">
                {filteredVehicles.slice(0, 5).map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedVehicle(v);
                      setActiveView('live_tracking');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-xl p-2.5 text-xs text-slate-200 hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Truck className="h-4 w-4 text-cyan-400" />
                      <div>
                        <span className="font-bold text-white mr-2">{v.plateNumber}</span>
                        <span className="text-slate-400">{v.brand} {v.model}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-cyan-300">
                      {v.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Drivers Results */}
          {filteredDrivers.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 mb-1.5">
                Pengemudi Staf ({filteredDrivers.length})
              </p>
              <div className="space-y-1">
                {filteredDrivers.slice(0, 5).map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      setActiveView('drivers');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-xl p-2.5 text-xs text-slate-200 hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-emerald-400" />
                      <div>
                        <span className="font-bold text-white mr-2">{d.name}</span>
                        <span className="text-slate-400">{d.phone}</span>
                      </div>
                    </div>
                    <span className="text-emerald-400 font-bold font-mono">Score: {d.score.overallScore}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trips Results */}
          {filteredTrips.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 mb-1.5">
                Surat Perintah Jalan / Trips ({filteredTrips.length})
              </p>
              <div className="space-y-1">
                {filteredTrips.slice(0, 4).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActiveView('trips');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-xl p-2.5 text-xs text-slate-200 hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Navigation className="h-4 w-4 text-blue-400" />
                      <div>
                        <span className="font-bold text-white mr-2">{t.tripNumber}</span>
                        <span className="text-slate-400">{t.origin} → {t.destination}</span>
                      </div>
                    </div>
                    <span className="text-cyan-300 font-mono text-[10px]">{t.status}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {query && navigationItems.length === 0 && filteredVehicles.length === 0 && filteredDrivers.length === 0 && filteredTrips.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-500">
              Tidak ada hasil yang cocok dengan pencarian "{query}".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 bg-slate-950 px-4 py-2.5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <div className="flex items-center gap-3">
            <span>Navigasi <kbd className="bg-slate-800 px-1 py-0.5 rounded text-slate-300">↑↓</kbd></span>
            <span>Pilih <kbd className="bg-slate-800 px-1 py-0.5 rounded text-slate-300">Enter</kbd></span>
          </div>
          <button
            onClick={() => {
              setIsCommandPaletteOpen(false);
              setIsKeyboardShortcutsOpen(true);
            }}
            className="flex items-center gap-1 text-cyan-400 hover:underline"
          >
            <Keyboard className="h-3 w-3" />
            <span>Semua Keyboard Shortcuts (?)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
