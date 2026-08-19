/**
 * Fleet Intelligence Smart AI - Component Health Tab
 * Granular breakdown of 12 critical vehicle mechanical & electrical systems
 * across the entire fleet with health scoring and telemetry thresholds.
 */

import React, { useState } from 'react';
import { VehicleMaintenanceProfile, ComponentCategory } from '../../types';
import { 
  Wrench, 
  Battery, 
  Thermometer, 
  Gauge, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

interface ComponentHealthTabProps {
  profiles: VehicleMaintenanceProfile[];
  onSelectVehicle: (profile: VehicleMaintenanceProfile) => void;
  onExplainAI: (profile: VehicleMaintenanceProfile) => void;
}

export const ComponentHealthTab: React.FC<ComponentHealthTabProps> = ({
  profiles,
  onSelectVehicle,
  onExplainAI,
}) => {
  const [search, setSearch] = useState('');
  const [selectedComponentFilter, setSelectedComponentFilter] = useState<string>('ALL');

  const componentCategories: { key: ComponentCategory | 'ALL'; label: string }[] = [
    { key: 'ALL', label: 'Semua 12 Sistem' },
    { key: 'ENGINE', label: 'Mesin (Engine)' },
    { key: 'BATTERY', label: 'Baterai & Kelistrikan' },
    { key: 'BRAKES', label: 'Sistem Pengereman' },
    { key: 'TIRES', label: 'Ban & Tekanan (TPMS)' },
    { key: 'COOLING_SYSTEM', label: 'Sistem Pendingin / Radiator' },
    { key: 'FUEL_SYSTEM', label: 'Sistem Bahan Bakar' },
    { key: 'GPS_DEVICE', label: 'Perangkat GPS & Telemetri' },
  ];

  const filteredVehicles = profiles.filter((p) => {
    return p.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.driverName.toLowerCase().includes(search.toLowerCase()) ||
      p.branch.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Wrench className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">12-System Component Health Matrix</h3>
            <p className="text-xs text-slate-400">
              Evaluasi mendalam per subsistem kendaraan dari sensor CAN-Bus, OBD-II, dan inspeksi mekanik
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari plat nomor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={selectedComponentFilter}
            onChange={(e) => setSelectedComponentFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            {componentCategories.map((cat) => (
              <option key={cat.key} value={cat.key}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Vehicle Component List */}
      <div className="space-y-3">
        {filteredVehicles.map((vehicle) => {
          const componentsToShow = selectedComponentFilter === 'ALL'
            ? vehicle.components
            : vehicle.components.filter(c => c.component === selectedComponentFilter);

          return (
            <div
              key={vehicle.vehicleId}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
            >
              {/* Vehicle Title Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold font-mono text-white">{vehicle.plateNumber}</span>
                      <span className="text-xs text-slate-400">• {vehicle.brandModel}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Supir: {vehicle.driverName} • Cabang: {vehicle.branch}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    vehicle.riskLevel === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                    vehicle.riskLevel === 'HIGH' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                    'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    Health: {vehicle.healthScore}/100
                  </span>
                  <button
                    onClick={() => onExplainAI(vehicle)}
                    className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
                    title="Explain AI"
                  >
                    <Sparkles className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onSelectVehicle(vehicle)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Subsystem Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-1">
                {componentsToShow.map((comp) => {
                  const isCrit = comp.status === 'CRITICAL';
                  const isWarn = comp.status === 'WARNING';

                  return (
                    <div
                      key={comp.component}
                      className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                        isCrit ? 'bg-rose-950/20 border-rose-500/40 text-rose-200' :
                        isWarn ? 'bg-amber-950/20 border-amber-500/30 text-amber-200' :
                        'bg-slate-950/70 border-slate-800/80 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold truncate text-white">{comp.name}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          isCrit ? 'bg-rose-500/30 text-rose-300' :
                          isWarn ? 'bg-amber-500/30 text-amber-300' :
                          'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {comp.status}
                        </span>
                      </div>

                      {comp.healthScore !== undefined && (
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>Health Score:</span>
                          <span className="font-mono font-bold text-white">{comp.healthScore}/100</span>
                        </div>
                      )}

                      <div className="text-[10px] text-slate-400 truncate">
                        {comp.indicators[0]?.text || 'Semua parameter normal'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
