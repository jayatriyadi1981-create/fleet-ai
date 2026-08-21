import React, { useState } from 'react';
import {
  Activity,
  Truck,
  Layers,
  Lock,
  AlertTriangle,
  MapPin,
  CheckCircle2,
  Navigation,
  RefreshCw,
  Droplets,
  Search
} from 'lucide-react';
import { MOCK_TANKER_FLEETS } from '../../../modules/tanker/services/tankerMockData';
import { TankerVehicle } from '../../../modules/tanker/types';

interface Props {
  onNavigateTab?: (tabId: string) => void;
}

export const TankerControlTowerTab: React.FC<Props> = ({ onNavigateTab }) => {
  const [fleets, setFleets] = useState<TankerVehicle[]>(MOCK_TANKER_FLEETS);
  const [selectedFleet, setSelectedFleet] = useState<TankerVehicle>(fleets[0]);
  const [filterCargo, setFilterCargo] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFleets = fleets.filter((f) => {
    const matchSearch =
      f.hullNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.driverName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCargo = filterCargo === 'ALL' || f.dedicatedCargo.includes(filterCargo);
    return matchSearch && matchCargo;
  });

  const totalCapacitySum = fleets.reduce((acc, f) => acc + f.totalCapacityLiters, 0);
  const totalLoadedSum = fleets.reduce(
    (acc, f) => acc + f.compartments.reduce((cAcc, c) => cAcc + c.currentVolumeLiters, 0),
    0
  );
  const activeEnRouteCount = fleets.filter((f) => f.currentStatus === 'EN_ROUTE_LOADED').length;
  const dischargingCount = fleets.filter((f) => f.currentStatus === 'UNLOADING_DISCHARGE').length;
  const alertCount = fleets.filter(
    (f) => f.isRolloverWarning || f.isRedZoneStopAlert || f.unauthorizedDrainAlert
  ).length;

  return (
    <div id="tanker-control-tower-tab" className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-900/90 border border-amber-500/20 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Total Armada Aktif</span>
            <Truck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-100">{fleets.length}</span>
            <span className="text-xs text-emerald-400 font-bold">100% Terhubung</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">BBM, CPO, Kimia, Gas & Aspal</span>
        </div>

        <div className="bg-slate-900/90 border border-sky-500/20 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Total Muatan Cairan Transit</span>
            <Droplets className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-sky-300">
              {(totalLoadedSum / 1000).toFixed(1)}k
            </span>
            <span className="text-xs text-slate-400">/ {(totalCapacitySum / 1000).toFixed(0)}k Liter</span>
          </div>
          <span className="text-[11px] text-sky-400/80 block mt-1">
            Utilisasi Kapasitas: {((totalLoadedSum / totalCapacitySum) * 100).toFixed(1)}%
          </span>
        </div>

        <div className="bg-slate-900/90 border border-emerald-500/20 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Dalam Perjalanan (Loaded)</span>
            <Navigation className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-emerald-300">{activeEnRouteCount} Unit</span>
            <span className="text-xs text-emerald-400 font-medium">On-Time</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">Koridor Geofence Aman</span>
        </div>

        <div className="bg-slate-900/90 border border-indigo-500/20 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Sedang Bongkar / Gantry</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-indigo-300">{dischargingCount + 1} Unit</span>
            <span className="text-xs text-indigo-400">Proses</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">SPBU & Plant Industri</span>
        </div>

        <div className="bg-slate-900/90 border border-rose-500/20 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Status Keamanan E-Lock</span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-emerald-400">100%</span>
            <span className="text-xs text-emerald-300 font-semibold">Terkunci Aman</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">{alertCount} Pelanggaran Segel</span>
        </div>
      </div>

      {/* Main Split Layout: Left Telemetry Table, Right Live Compartment X-Ray */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Fleet List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-100">Live Status Armada Truk Tangki</h2>
                  <p className="text-xs text-slate-400">Telematika sensor ketinggian cairan, status segel e-lock & geofence</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setFleets([...MOCK_TANKER_FLEETS])}
                  className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all text-xs flex items-center space-x-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari No. Lambung, Plat, Pengemudi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto">
                {['ALL', 'BBM', 'CPO', 'CHEMICAL', 'LPG'].map((cargo) => (
                  <button
                    key={cargo}
                    onClick={() => setFilterCargo(cargo)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      filterCargo === cargo
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {cargo}
                  </button>
                ))}
              </div>
            </div>

            {/* Table of Tankers */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950/50">
                    <th className="py-2.5 px-3">Armada / No. Lambung</th>
                    <th className="py-2.5 px-3">Muatan & Kapasitas</th>
                    <th className="py-2.5 px-3">Status Operasi</th>
                    <th className="py-2.5 px-3">Lokasi & Kecepatan</th>
                    <th className="py-2.5 px-3 text-center">Segel E-Lock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredFleets.map((tank) => {
                    const isSelected = selectedFleet.id === tank.id;
                    const loadedVol = tank.compartments.reduce((a, b) => a + b.currentVolumeLiters, 0);

                    return (
                      <tr
                        key={tank.id}
                        onClick={() => setSelectedFleet(tank)}
                        className={`cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-amber-500/10 border-l-4 border-l-amber-500'
                            : 'hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-100">{tank.hullNumber}</div>
                          <div className="text-[11px] text-amber-400/90 font-mono">{tank.plateNumber}</div>
                          <div className="text-[10px] text-slate-400">{tank.driverName}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-200">{tank.dedicatedCargo.replace(/_/g, ' ')}</div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {loadedVol.toLocaleString()} / {tank.totalCapacityLiters.toLocaleString()} L
                          </div>
                          <div className="w-20 bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                            <div
                              className="bg-amber-400 h-full rounded-full"
                              style={{ width: `${(loadedVol / tank.totalCapacityLiters) * 100}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center space-x-1 ${
                              tank.currentStatus === 'EN_ROUTE_LOADED'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : tank.currentStatus === 'UNLOADING_DISCHARGE'
                                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                                : tank.currentStatus === 'LOADING_GANTRY'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                            <span>{tank.currentStatus.replace(/_/g, ' ')}</span>
                          </span>
                          <div className="text-[10px] text-slate-400 mt-1">{tank.numberOfCompartments} Kompartemen</div>
                        </td>
                        <td className="py-3 px-3 max-w-[180px]">
                          <div className="text-[11px] text-slate-300 truncate">{tank.currentLocationName}</div>
                          <div className="text-[10px] text-amber-400 flex items-center space-x-1">
                            <Navigation className="w-2.5 h-2.5" />
                            <span>{tank.speedKmh} km/h (Maks {tank.maxCorridorSpeedKmh})</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          {tank.elockMasterStatus === 'LOCKED_SECURE' ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                              LOCKED
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                              AUTHORIZED
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Compartment X-Ray & Live Telemetry Inspector */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block font-mono">
                  KOMPARTEMEN X-RAY TELEMETRY
                </span>
                <h3 className="text-base font-black text-slate-100 flex items-center space-x-2">
                  <span>{selectedFleet.hullNumber}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-mono font-normal">
                    {selectedFleet.plateNumber}
                  </span>
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold font-mono">
                {selectedFleet.totalCapacityLiters.toLocaleString()} Liter
              </span>
            </div>

            {/* Tanker Specifications Grid */}
            <div className="grid grid-cols-2 gap-2 my-3 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">Material Tabung Tangki</span>
                <span className="font-bold text-slate-200">{selectedFleet.tankMaterial.replace(/_/g, ' ')}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">Stabilitas Inersia Cairan</span>
                <span className="font-bold text-emerald-400">{selectedFleet.sloshLateralGForce} G (Aman &lt;0.35G)</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">Masa Berlaku Tera Legal</span>
                <span className="font-bold text-slate-200">{selectedFleet.teraMetrologiExpiry}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">Uji Hidrostatis Tabung</span>
                <span className="font-bold text-slate-200">{selectedFleet.hydrotestExpiry}</span>
              </div>
            </div>

            {/* Compartment Cross-Section Visualizer */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center space-x-1.5">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Kondisi Kompartemen Fisik</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Sensor Ultrasonik + Magnetostrictive</span>
              </div>

              <div className="space-y-3">
                {selectedFleet.compartments.map((comp) => {
                  const pct = Math.round((comp.currentVolumeLiters / comp.capacityLiters) * 100);
                  return (
                    <div
                      key={comp.id}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 hover:border-amber-500/40 transition-all"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-[10px]">
                            {comp.compartmentNo}
                          </span>
                          <span className="font-bold text-slate-200">
                            Kompartemen #{comp.compartmentNo} ({comp.liquidType.replace(/_/g, ' ')})
                          </span>
                        </div>
                        <span className="font-mono font-bold text-amber-400">
                          {comp.currentVolumeLiters.toLocaleString()} L ({pct}%)
                        </span>
                      </div>

                      {/* Visual Fluid Tank Bar */}
                      <div className="relative w-full h-7 bg-slate-900 rounded-lg overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 transition-all duration-500 flex items-center px-2 text-[10px] font-bold text-slate-950"
                          style={{ width: `${pct}%` }}
                        >
                          {pct > 15 && `Level: ${comp.levelMm} mm`}
                        </div>
                        <span className="absolute right-2 top-1 text-[10px] text-slate-400 font-mono">
                          Ullage: {comp.ullageMm} mm
                        </span>
                      </div>

                      {/* Micro Sensors Details */}
                      <div className="grid grid-cols-4 gap-1.5 text-[10px] pt-1 text-slate-400">
                        <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800 text-center">
                          <span className="block text-[9px] text-slate-500">Suhu</span>
                          <span className="font-bold text-slate-200">{comp.temperatureC}°C</span>
                        </div>
                        <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800 text-center">
                          <span className="block text-[9px] text-slate-500">Densitas</span>
                          <span className="font-bold text-slate-200">{comp.densityKgM3} kg/m³</span>
                        </div>
                        <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800 text-center">
                          <span className="block text-[9px] text-slate-500">Endapan Air</span>
                          <span className="font-bold text-emerald-400">{comp.waterBottomMm} mm</span>
                        </div>
                        <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800 text-center">
                          <span className="block text-[9px] text-slate-500">Katup Bawah</span>
                          <span className="font-bold text-slate-200">{comp.dischargeValveStatus.split('_')[0]}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => onNavigateTab && onNavigateTab('elocks')}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all text-center flex items-center justify-center space-x-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Kendali E-Lock</span>
              </button>
              <button
                onClick={() => onNavigateTab && onNavigateTab('compartments')}
                className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all text-center flex items-center justify-center space-x-1.5 shadow-md"
              >
                <Droplets className="w-3.5 h-3.5" />
                <span>Analisis Susut Cairan</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
