import React from 'react';
import {
  Fuel,
  BatteryCharging,
  Zap,
  DollarSign,
  TrendingDown,
  Activity,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { taxiService } from '../../../modules/taxi/services/taxiService';

export const TaxiEnergyFuelTab: React.FC = () => {
  const vehicles = taxiService.getVehicles();
  const evVehicles = vehicles.filter((v) => v.fuelType === 'ELECTRIC_EV');
  const iceVehicles = vehicles.filter((v) => v.fuelType !== 'ELECTRIC_EV');

  return (
    <div id="taxi-energy-fuel-tab" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 flex items-center space-x-2">
            <Fuel className="w-5 h-5 text-amber-400" />
            <span>Manajemen Energi, BBM Bensin, SPBG Gas & SPKLU EV Charging</span>
          </h2>
          <p className="text-xs text-slate-400">Monitoring konsumsi energi per KM, status baterai SOC taksi listrik (BYD & Ioniq), dan rasio penghematan</p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
            Efisiensi EV: Hemat 65% Biaya Operasional
          </span>
        </div>
      </div>

      {/* Energy Comparison Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
            <BatteryCharging className="w-4 h-4" />
            <span>Taksi Listrik (EV Green Taxi)</span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">Rp 340 / KM</div>
          <p className="text-xs text-slate-400">
            Konsumsi daya rata-rata 0.14 kWh/KM menggunakan SPKLU Fast Charging Pool (Tarif PLN Rp 2.466/kWh).
          </p>
          <div className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Zero Emisi Karbon (ESG Score A)</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-3">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs">
            <Zap className="w-4 h-4" />
            <span>Gas Bumi CNG (SPBG LSP)</span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">Rp 520 / KM</div>
          <p className="text-xs text-slate-400">
            Armada berbahan bakar gas bumi converter kit diisi di SPBG Kemayoran & Rawamangun (Rp 4.500/LSP).
          </p>
          <div className="text-xs text-cyan-400 font-semibold flex items-center space-x-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Hemat 48% dibanding Bensin Murni</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-3">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
            <Fuel className="w-4 h-4" />
            <span>BBM Bensin (Pertalite / Revvo)</span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">Rp 980 / KM</div>
          <p className="text-xs text-slate-400">
            Konsumsi bensin rata-rata 10.2 KM/Liter pada kondisi lalu lintas padat stop-and-go Jakarta.
          </p>
          <div className="text-xs text-slate-400">
            Baseline armada Transmover 1.5L
          </div>
        </div>
      </div>

      {/* EV Live Charging Status Table */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
          <BatteryCharging className="w-4 h-4 text-emerald-400" />
          <span>Status Baterai & Pengisian Taksi Listrik (EV Telematics)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {evVehicles.map((ev) => (
            <div key={ev.id} className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-amber-400 text-sm">{ev.hullNumber}</span>
                  <span className="font-semibold text-slate-200">{ev.model}</span>
                </div>
                <span className="text-emerald-400 font-bold font-mono text-sm">{ev.batterySocPct}% SOC</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    (ev.batterySocPct || 0) > 40 ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${ev.batterySocPct || 0}%` }}
                />
              </div>

              <div className="flex justify-between text-slate-400 text-[11px] pt-1">
                <span>Driver: {ev.currentDriverName}</span>
                <span>Lokasi: {ev.currentLocationName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
