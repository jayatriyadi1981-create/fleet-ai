import React, { useState } from 'react';
import {
  Trash2,
  Truck,
  Activity,
  MapPin,
  Scale,
  FileCheck2,
  AlertTriangle,
  Flame,
  Droplets,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Search,
  Filter,
  Navigation,
  ThermometerSnowflake,
  Compass
} from 'lucide-react';
import { MOCK_WASTE_FLEETS, MOCK_COLLECTION_BINS } from '../../../modules/waste/services/wasteMockData';
import { WasteFleetVehicle } from '../../../modules/waste/types';

interface Props {
  onNavigateTab?: (tabId: string) => void;
}

export const WasteControlTowerTab: React.FC<Props> = ({ onNavigateTab }) => {
  const [fleets] = useState<WasteFleetVehicle[]>(MOCK_WASTE_FLEETS);
  const [selectedVehicle, setSelectedVehicle] = useState<WasteFleetVehicle>(fleets[0]);
  const [filterType, setFilterType] = useState('ALL');

  const filteredFleets = fleets.filter(
    (f) => filterType === 'ALL' || f.vehicleType === filterType
  );

  const totalPayloadCollected = fleets.reduce((acc, f) => acc + f.currentPayloadTons, 0);
  const totalOnRoute = fleets.filter((f) => f.currentStatus === 'ON_COLLECTION_ROUTE').length;
  const totalEnRouteTpa = fleets.filter((f) => f.currentStatus === 'EN_ROUTE_TO_TPA' || f.currentStatus === 'WEIGHBRIDGE_QUEUE').length;

  return (
    <div id="waste-control-tower-tab" className="space-y-6">
      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Total Tonase Terangkut Hari Ini</span>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {totalPayloadCollected.toFixed(1)} <span className="text-xs text-slate-400 font-normal">Ton</span>
            </div>
            <span className="text-[11px] text-slate-500">5 Unit Truk Beroperasi</span>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
            <Scale className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Rute Pengumpulan TPS Aktif</span>
            <div className="text-2xl font-black text-sky-400 font-mono">
              {totalOnRoute} <span className="text-xs text-slate-400 font-normal">Unit</span>
            </div>
            <span className="text-[11px] text-slate-500">12 TPS / Bin Terjadwal</span>
          </div>
          <div className="p-3 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-xl">
            <Trash2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Menuju TPA / Jembatan Timbang</span>
            <div className="text-2xl font-black text-amber-400 font-mono">
              {totalEnRouteTpa} <span className="text-xs text-slate-400 font-normal">Unit</span>
            </div>
            <span className="text-[11px] text-slate-500">TPST Bantargebang & PPLI</span>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Kepatuhan Festronik B3 & KLHK</span>
            <div className="text-2xl font-black text-emerald-400 font-mono">100%</div>
            <span className="text-[11px] text-slate-500">Zero-Spill & Katup Lindi Rapat</span>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
            <FileCheck2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Control Tower Radar / Map Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Radar Map & Telemetry Dashboard */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Compass className="w-5 h-5 text-emerald-400 animate-spin-slow" />
                <div>
                  <h3 className="text-base font-bold text-slate-100">
                    Live Telemetri & Tracking Armada Angkutan Sampah (GIS Map)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Memantau posisi GPS, status hidrolik compactor, tonase muatan, dan rute menuju TPA/TPST
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                >
                  <option value="ALL">Semua Tipe Truk</option>
                  <option value="COMPACTOR_TRUCK">Truk Compactor</option>
                  <option value="ARM_ROLL_TRUCK">Arm Roll Container</option>
                  <option value="MEDICAL_B3_COLD_BOX">Limbah Medis B3</option>
                  <option value="VACUUM_SLUDGE_TRUCK">Vacuum Sedot Tinja/IPAL</option>
                  <option value="HOOK_LIFT_TRUCK">Hook Lift Industri</option>
                </select>
              </div>
            </div>

            {/* Simulated Live GPS Map Radar Screen */}
            <div className="relative w-full h-80 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center p-4">
              {/* Map Grid Pattern */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage:
                    'radial-gradient(#10b981 1px, transparent 1px), radial-gradient(#059669 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                  backgroundPosition: '0 0, 12px 12px'
                }}
              />

              {/* TPA Landmark Radar Nodes */}
              <div className="absolute right-12 bottom-12 p-2.5 rounded-xl bg-slate-900/90 border border-emerald-500/40 text-emerald-400 text-xs font-mono shadow-2xl flex items-center space-x-2">
                <Scale className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="font-bold block">TPST BANTARGEBANG</span>
                  <span className="text-[10px] text-slate-400">Jembatan Timbang & Zona Tipping</span>
                </div>
              </div>

              <div className="absolute left-10 top-8 p-2.5 rounded-xl bg-slate-900/90 border border-sky-500/40 text-sky-400 text-xs font-mono shadow-2xl flex items-center space-x-2">
                <Trash2 className="w-4 h-4 text-sky-400" />
                <div>
                  <span className="font-bold block">KORIDOR SUDIRMAN - KUNINGAN</span>
                  <span className="text-[10px] text-slate-400">Pengumpulan TPS Mall & Komersial</span>
                </div>
              </div>

              {/* Vehicle Location Pins */}
              {filteredFleets.map((veh, idx) => {
                const isSelected = veh.id === selectedVehicle.id;
                // Position calculations for mockup visual display
                const topOffsets = ['35%', '65%', '22%', '75%', '50%'];
                const leftOffsets = ['40%', '70%', '28%', '52%', '60%'];

                return (
                  <button
                    key={veh.id}
                    onClick={() => setSelectedVehicle(veh)}
                    style={{ top: topOffsets[idx % 5], left: leftOffsets[idx % 5] }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-xl transition-all flex items-center space-x-2 z-10 ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/30 scale-110 ring-2 ring-emerald-300'
                        : 'bg-slate-900/90 border border-slate-700 text-slate-200 hover:border-emerald-500 hover:scale-105'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-mono">{veh.hullNumber}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Navigation Action Chips */}
            <div className="flex items-center justify-between pt-2 text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-300 font-medium">
                  Sistem Pemantauan GPS, Hidrolik & Katup Lindi (Leachate) Realtime Aktif
                </span>
              </div>

              {onNavigateTab && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onNavigateTab('routes')}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold text-xs transition-all"
                  >
                    Lihat Rute TPS →
                  </button>
                  <button
                    onClick={() => onNavigateTab('weighbridge')}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-xs transition-all"
                  >
                    Jembatan Timbang →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Selected Truck Detail Inspector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold border border-emerald-500/20">
                  {selectedVehicle.vehicleType.replace(/_/g, ' ')}
                </span>
                <h3 className="text-lg font-black text-slate-100 mt-1">{selectedVehicle.hullNumber}</h3>
                <span className="text-xs text-emerald-400 font-mono font-bold">{selectedVehicle.plateNumber}</span>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                  selectedVehicle.currentStatus === 'ON_COLLECTION_ROUTE'
                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                    : selectedVehicle.currentStatus === 'EN_ROUTE_TO_TPA'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    : selectedVehicle.currentStatus === 'WEIGHBRIDGE_QUEUE'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {selectedVehicle.currentStatus.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Payload & Compactor Progress Meter */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Tingkat Kepadatan / Muatan:</span>
                <span className="font-bold text-emerald-400 font-mono">
                  {selectedVehicle.currentPayloadTons} / {selectedVehicle.maxPayloadTons} Ton ({selectedVehicle.compactorFillRatePct}%)
                </span>
              </div>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all ${
                    selectedVehicle.compactorFillRatePct > 85
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${selectedVehicle.compactorFillRatePct}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-center pt-1 text-xs">
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Kapasitas Bak</span>
                  <span className="font-bold text-slate-200 font-mono">{selectedVehicle.capacityM3} m³</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Katup Air Lindi</span>
                  <span className="font-bold text-emerald-400 font-mono">SEALED (TIDAK BOCOR)</span>
                </div>
              </div>
            </div>

            {/* Cold Box temperature for medical */}
            {selectedVehicle.coldBoxTempC !== undefined && (
              <div className="bg-slate-950 p-3.5 rounded-xl border border-sky-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <ThermometerSnowflake className="w-4 h-4 text-sky-400" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Suhu Cold Box Biohazard</span>
                    <span className="font-bold text-sky-300 font-mono">{selectedVehicle.coldBoxTempC}°C (Target &lt;4°C)</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                  SUHU OPTIMAL
                </span>
              </div>
            )}

            {/* Assigned Details & Route */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 block">Lokasi GPS Terakhir</span>
                  <span className="text-slate-200 font-semibold">{selectedVehicle.gpsLocation.address}</span>
                  <span className="text-[10px] text-emerald-400 block font-mono">Kecepatan: {selectedVehicle.gpsLocation.speedKmh} km/h</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-900 flex justify-between">
                <span className="text-slate-400">Rute Aktif:</span>
                <span className="text-slate-200 font-semibold text-right">{selectedVehicle.activeRouteName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tujuan TPA:</span>
                <span className="text-amber-400 font-bold font-mono">{selectedVehicle.currentTpaDestination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Supir & Kru:</span>
                <span className="text-slate-200">{selectedVehicle.currentDriver} ({selectedVehicle.assignedCrewCount} Kru)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
