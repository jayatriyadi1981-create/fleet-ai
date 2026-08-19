/**
 * Fleet Intelligence Smart AI - Component Risk Matrix Tab
 * Cross-tabulation heatmap matrix showing system risk severity across all fleet branches and vehicle units.
 */

import React from 'react';
import { VehicleMaintenanceProfile, ComponentCategory } from '../../types';
import { Layers, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ComponentRiskMatrixTabProps {
  profiles: VehicleMaintenanceProfile[];
  onSelectVehicle: (profile: VehicleMaintenanceProfile) => void;
}

export const ComponentRiskMatrixTab: React.FC<ComponentRiskMatrixTabProps> = ({
  profiles,
  onSelectVehicle,
}) => {
  const componentCols: { key: ComponentCategory; label: string }[] = [
    { key: 'ENGINE', label: 'Engine' },
    { key: 'BATTERY', label: 'Baterai' },
    { key: 'BRAKES', label: 'Rem' },
    { key: 'TIRES', label: 'Ban/TPMS' },
    { key: 'COOLING_SYSTEM', label: 'Radiator' },
    { key: 'ELECTRICAL_SYSTEM', label: 'Kelistrikan' },
    { key: 'SUSPENSION', label: 'Suspensi' },
    { key: 'FUEL_SYSTEM', label: 'BBM' },
    { key: 'AIR_CONDITIONING', label: 'AC' },
    { key: 'GPS_DEVICE', label: 'GPS' },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Component Risk Heatmap Matrix</h3>
            <p className="text-xs text-slate-400">
              Matriks visual status kesehatan 10 subsistem utama untuk seluruh unit kendaraan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            <span className="h-2 w-2 rounded-full bg-emerald-400" /> Healthy
          </span>
          <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
            <span className="h-2 w-2 rounded-full bg-amber-400" /> Warning
          </span>
          <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
            <span className="h-2 w-2 rounded-full bg-rose-400" /> Critical
          </span>
        </div>
      </div>

      {/* Heatmap Matrix Table */}
      <div className="overflow-x-auto rounded-2xl bg-slate-900 border border-slate-800">
        <table className="w-full text-center text-xs">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4 text-left font-semibold">Kendaraan</th>
              <th className="py-3 px-2 text-left font-semibold">Cabang</th>
              {componentCols.map(col => (
                <th key={col.key} className="py-3 px-2 font-semibold">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {profiles.map((profile) => (
              <tr key={profile.vehicleId} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 text-left font-mono font-bold text-white">
                  <button
                    onClick={() => onSelectVehicle(profile)}
                    className="hover:text-cyan-400 transition-colors"
                  >
                    {profile.plateNumber}
                  </button>
                </td>

                <td className="py-3 px-2 text-left text-slate-400 text-[11px]">
                  {profile.branch.split(' ')[0]}
                </td>

                {componentCols.map(col => {
                  const comp = profile.components.find(c => c.component === col.key);
                  const isCrit = comp?.status === 'CRITICAL';
                  const isWarn = comp?.status === 'WARNING';

                  return (
                    <td key={col.key} className="py-3 px-2">
                      <div className={`mx-auto h-7 w-7 rounded-lg flex items-center justify-center font-mono font-bold text-[10px] ${
                        isCrit ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50 shadow-sm shadow-rose-950' :
                        isWarn ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40' :
                        'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {comp?.healthScore !== undefined ? comp.healthScore : isCrit ? '✕' : isWarn ? '!' : '✓'}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
