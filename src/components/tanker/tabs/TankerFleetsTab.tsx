import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Search,
  CheckCircle2,
  FileCheck,
  Shield,
  Layers,
  Wrench,
  Fuel,
  Info
} from 'lucide-react';
import { MOCK_TANKER_FLEETS } from '../../../modules/tanker/services/tankerMockData';
import { TankerVehicle, TankMaterial, TankerLiquidType } from '../../../modules/tanker/types';

export const TankerFleetsTab: React.FC = () => {
  const [fleets, setFleets] = useState<TankerVehicle[]>(MOCK_TANKER_FLEETS);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New fleet form state
  const [newHull, setNewHull] = useState('');
  const [newPlate, setNewPlate] = useState('');
  const [newCapacity, setNewCapacity] = useState(24000);
  const [newComps, setNewComps] = useState(3);
  const [newMaterial, setNewMaterial] = useState<TankMaterial>('ALUMINIUM_ALLOY_5182');
  const [newCargo, setNewCargo] = useState<TankerLiquidType>('BBM_PERTALITE');

  const filtered = fleets.filter(
    (f) =>
      f.hullNumber.toLowerCase().includes(search.toLowerCase()) ||
      f.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
      f.driverName.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddFleet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHull || !newPlate) return;

    const newVehicle: TankerVehicle = {
      id: `tank-${Date.now()}`,
      hullNumber: newHull,
      plateNumber: newPlate,
      truckType: newCapacity >= 32000 ? 'SEMITRAILER_TANKER' : 'RIGID_TANKER',
      tankMaterial: newMaterial,
      totalCapacityLiters: newCapacity,
      numberOfCompartments: newComps,
      dedicatedCargo: newCargo,
      currentStatus: 'STANDBY_READY',
      driverName: 'Belum Ditugaskan',
      driverPhone: '-',
      currentLocationName: 'Pool Utama',
      destinationName: '-',
      assignedDepot: 'TBBM Plumpang',
      speedKmh: 0,
      maxCorridorSpeedKmh: 70,
      sloshLateralGForce: 0,
      isRolloverWarning: false,
      isRedZoneStopAlert: false,
      elockMasterStatus: 'LOCKED_SECURE',
      unauthorizedDrainAlert: false,
      teraMetrologiExpiry: '2027-08-01',
      hydrotestExpiry: '2028-01-15',
      kirExpiry: '2027-02-10',
      b3LicenseExpiry: '2027-06-30',
      fuelLevelPct: 100,
      loadedWeightTon: 0,
      grossVehicleWeightTon: 12.0,
      compartments: Array.from({ length: newComps }).map((_, i) => ({
        id: `comp-${Date.now()}-${i + 1}`,
        compartmentNo: i + 1,
        capacityLiters: newCapacity / newComps,
        currentVolumeLiters: 0,
        liquidType: newCargo,
        levelMm: 0,
        ullageMm: 1800,
        temperatureC: 28,
        densityKgM3: 750,
        waterBottomMm: 0,
        manholeStatus: 'CLOSED_LOCKED',
        dischargeValveStatus: 'CLOSED_LOCKED',
        bottomLoadingValveStatus: 'CLOSED'
      }))
    };

    setFleets([newVehicle, ...fleets]);
    setShowAddModal(false);
    setNewHull('');
    setNewPlate('');
  };

  return (
    <div id="tanker-fleets-tab" className="space-y-6">
      {/* Header with Search and Action Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <Truck className="w-5 h-5 text-amber-400" />
            <span>Master Armada Tangki & Kompartemen</span>
          </h2>
          <p className="text-xs text-slate-400">
            Database sertifikasi material tabung, uji tera metrologi, kapasitas kompartemen, dan status kelaikan jalan.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari armada..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Tangki</span>
          </button>
        </div>
      </div>

      {/* Fleets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tank) => (
          <div
            key={tank.id}
            className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 shadow-xl transition-all space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono font-bold border border-amber-500/20">
                  {tank.truckType.replace(/_/g, ' ')}
                </span>
                <h3 className="text-base font-black text-slate-100 mt-1">{tank.hullNumber}</h3>
                <span className="text-xs font-mono text-slate-400">{tank.plateNumber}</span>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-950 text-amber-300 font-black text-sm font-mono border border-slate-800">
                {tank.totalCapacityLiters.toLocaleString()} L
              </span>
            </div>

            {/* Cargo and Material Badges */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center space-x-1">
                  <Fuel className="w-3.5 h-3.5 text-amber-400" />
                  <span>Jenis Muatan</span>
                </span>
                <span className="font-bold text-slate-200">{tank.dedicatedCargo.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center space-x-1">
                  <Shield className="w-3.5 h-3.5 text-sky-400" />
                  <span>Material Tabung</span>
                </span>
                <span className="font-semibold text-slate-300 text-[11px]">
                  {tank.tankMaterial.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center space-x-1">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Kompartemen</span>
                </span>
                <span className="font-bold text-emerald-400">{tank.numberOfCompartments} Sekat Terpisah</span>
              </div>
            </div>

            {/* Compliance Expiry Dates */}
            <div className="space-y-1.5 text-[11px] pt-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center space-x-1">
                  <FileCheck className="w-3 h-3 text-amber-400" />
                  <span>Tera Metrologi (T2/T3)</span>
                </span>
                <span className="font-mono text-slate-200 font-semibold">{tank.teraMetrologiExpiry}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center space-x-1">
                  <Wrench className="w-3 h-3 text-sky-400" />
                  <span>Uji Hidrostatis</span>
                </span>
                <span className="font-mono text-slate-200 font-semibold">{tank.hydrotestExpiry}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Uji KIR Dishub</span>
                </span>
                <span className="font-mono text-slate-200 font-semibold">{tank.kirExpiry}</span>
              </div>
            </div>

            {/* Footer Assigned Driver & Base */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="text-slate-400">
                <span className="text-[10px] block text-slate-500">Pengemudi Ditugaskan</span>
                <span className="font-semibold text-slate-200">{tank.driverName}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] block text-slate-500">Pangkalan Pool</span>
                <span className="font-semibold text-amber-400">{tank.assignedDepot}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Tanker */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <Truck className="w-5 h-5 text-amber-400" />
                <span>Registrasi Tangki Baru</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFleet} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Nomor Lambung Tangki</label>
                  <input
                    type="text"
                    required
                    placeholder="misal TANK-BBM-2410"
                    value={newHull}
                    onChange={(e) => setNewHull(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Nomor Plat Polisi</label>
                  <input
                    type="text"
                    required
                    placeholder="misal B 9912 TFU"
                    value={newPlate}
                    onChange={(e) => setNewPlate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Total Kapasitas (Liter)</label>
                  <select
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value={16000}>16.000 Liter (Rigid)</option>
                    <option value={24000}>24.000 Liter (Rigid/Semi)</option>
                    <option value={32000}>32.000 Liter (Semitrailer)</option>
                    <option value={40000}>40.000 Liter (ISO Tank)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Jumlah Kompartemen</label>
                  <select
                    value={newComps}
                    onChange={(e) => setNewComps(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value={1}>1 Sekat (Single)</option>
                    <option value={2}>2 Sekat</option>
                    <option value={3}>3 Sekat</option>
                    <option value={4}>4 Sekat</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Material Tabung Tangki</label>
                <select
                  value={newMaterial}
                  onChange={(e) => setNewMaterial(e.target.value as TankMaterial)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="ALUMINIUM_ALLOY_5182">Aluminium Alloy 5182 (Ringan & BBM)</option>
                  <option value="STAINLESS_STEEL_SS304">Stainless Steel SS304 (CPO / Food Grade)</option>
                  <option value="STAINLESS_STEEL_SS316L">Stainless Steel SS316L (Asam Kimia Korosif)</option>
                  <option value="CARBON_STEEL_Q235B">Carbon Steel Q235B (LPG / Tekanan)</option>
                  <option value="EPOXY_LINED_STEEL">Epoxy Lined Steel (Air Industri)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Peruntukan Muatan Cairan Utama</label>
                <select
                  value={newCargo}
                  onChange={(e) => setNewCargo(e.target.value as TankerLiquidType)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="BBM_PERTALITE">BBM Pertalite / Bensin RON 90</option>
                  <option value="BBM_PERTAMAX">BBM Pertamax / RON 92-98</option>
                  <option value="BBM_BIOSOLAR">BBM Biosolar B35 / B40</option>
                  <option value="CPO_CRUDE_PALM_OIL">CPO (Crude Palm Oil)</option>
                  <option value="CHEMICAL_ACID">Chemical B3 / Asam Sulfat / HCl</option>
                  <option value="LPG_BULK">LPG Skid Tank</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg"
                >
                  Simpan Armada
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
