import React, { useState } from 'react';
import { BusVehicle, BusTypeCategory, BusClass, BusVehicleStatus } from '../../../modules/bus/types';
import { 
  Bus, 
  Plus, 
  Search, 
  Filter, 
  ShieldCheck, 
  Wifi, 
  BatteryCharging, 
  Tv, 
  Video, 
  Radio, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Wrench, 
  FileText, 
  Eye, 
  MapPin, 
  Users, 
  Calendar,
  X,
  Clock
} from 'lucide-react';

interface Props {
  buses: BusVehicle[];
  onSelectBus?: (bus: BusVehicle) => void;
}

export const BusFleetVehiclesTab: React.FC<Props> = ({ buses: initialBuses }) => {
  const [buses, setBuses] = useState<BusVehicle[]>(initialBuses);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedBusModal, setSelectedBusModal] = useState<BusVehicle | null>(null);
  const [isAddBusModalOpen, setIsAddBusModalOpen] = useState(false);

  // Filtered list
  const filteredBuses = buses.filter(b => {
    const matchSearch = b.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.busNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.brand.toLowerCase().includes(search.toLowerCase());
    const matchType = selectedType === 'ALL' || b.busType === selectedType;
    const matchStatus = selectedStatus === 'ALL' || b.status === selectedStatus;
    return matchSearch && matchType && matchStatus;
  });

  const getStatusBadge = (status: BusVehicleStatus) => {
    switch (status) {
      case 'ON_TRIP':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> On Trip</span>;
      case 'BOARDING':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">Boarding</span>;
      case 'SCHEDULED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">Scheduled</span>;
      case 'AVAILABLE':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Available</span>;
      case 'MAINTENANCE':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">Maintenance</span>;
      case 'INSPECTION':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">Inspection</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-400">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Filter Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari Plat, No. Bus, Karoseri..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">Semua Jenis Bus</option>
            <option value="INTERCITY_BUS">Intercity Bus (AKAP)</option>
            <option value="DOUBLE_DECKER">Double Decker (Bus Tingkat)</option>
            <option value="TOUR_BUS">Tour Bus (Pariwisata)</option>
            <option value="CITY_BUS">City Bus (BRT Perkotaan)</option>
            <option value="SHUTTLE">Shuttle & Travel</option>
            <option value="MINIBUS">Minibus / Microbus</option>
            <option value="MIDIBUS">Midibus 3/4</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">Semua Status</option>
            <option value="ON_TRIP">On Trip (Di Jalan)</option>
            <option value="BOARDING">Boarding (Gate)</option>
            <option value="AVAILABLE">Available (Siap Jalan)</option>
            <option value="MAINTENANCE">Maintenance (Bengkel)</option>
          </select>
        </div>

        <button
          onClick={() => setIsAddBusModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-900/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Registrasi Unit Bus Baru
        </button>
      </div>

      {/* Bus Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBuses.map((bus) => (
          <div
            key={bus.id}
            className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-sm space-y-4 relative overflow-hidden group"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-sm text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
                    {bus.plateNumber}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{bus.busNumber}</span>
                </div>
                <h3 className="font-bold text-base text-white mt-1 group-hover:text-blue-400 transition-colors">
                  {bus.name}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {bus.brand} {bus.model} • {bus.manufacturingYear}
                </p>
              </div>

              <div>{getStatusBadge(bus.status)}</div>
            </div>

            {/* Chassis & Body Info */}
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Karoseri Body:</span>
                <span className="font-medium text-slate-200">{bus.bodyMaker}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Kapasitas Kursi:</span>
                <span className="font-bold text-white">
                  {bus.seatCapacity} Kursi {bus.standingCapacity > 0 ? `+ ${bus.standingCapacity} Berdiri` : ''} ({bus.busClass.replace(/_/g, ' ')})
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Odometer:</span>
                <span className="font-mono text-cyan-300">{bus.odometerKm.toLocaleString()} KM</span>
              </div>
            </div>

            {/* Amenities Badges */}
            <div className="flex items-center gap-2 flex-wrap text-slate-400 text-xs">
              {bus.hasAC && <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 flex items-center gap-1">❄️ AC</span>}
              {bus.hasToilet && <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 flex items-center gap-1">🚻 Toilet</span>}
              {bus.hasWiFi && <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 flex items-center gap-1"><Wifi className="w-3 h-3 text-cyan-400" /> WiFi</span>}
              {bus.hasUsbCharger && <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 flex items-center gap-1"><BatteryCharging className="w-3 h-3 text-amber-400" /> USB</span>}
              {bus.hasEntertainment && <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 flex items-center gap-1"><Tv className="w-3 h-3 text-purple-400" /> Audio/VOD</span>}
              {bus.hasCCTV && <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 flex items-center gap-1"><Video className="w-3 h-3 text-emerald-400" /> CCTV</span>}
              {bus.hasGPS && <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 flex items-center gap-1"><Radio className="w-3 h-3 text-blue-400" /> GPS</span>}
            </div>

            {/* Current Active Trip / Driver */}
            {bus.status === 'ON_TRIP' && (
              <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-2.5 text-xs text-emerald-300 space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span>Trip: {bus.currentTripCode}</span>
                  <span>{bus.currentSpeedKmH} km/jam</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400/80">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{bus.currentLocationName}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Supir: <strong className="text-white">{bus.currentDriverName}</strong>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                KPS: Aktif
              </div>
              <button
                onClick={() => setSelectedBusModal(bus)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
                Detail & Profil Bus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Bus Profile Detail */}
      {selectedBusModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 space-y-6 shadow-2xl relative my-8">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold">
                    {selectedBusModal.plateNumber}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{selectedBusModal.busNumber}</span>
                  {getStatusBadge(selectedBusModal.status)}
                </div>
                <h2 className="text-xl font-black text-white mt-1">{selectedBusModal.name}</h2>
                <p className="text-xs text-slate-400 font-mono">
                  {selectedBusModal.brand} • {selectedBusModal.model} • Karoseri {selectedBusModal.bodyMaker} ({selectedBusModal.manufacturingYear})
                </p>
              </div>

              <button
                onClick={() => setSelectedBusModal(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Specifications Tabs / Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-slate-500">Kelas Layanan</span>
                <div className="font-bold text-white mt-1">{selectedBusModal.busClass.replace(/_/g, ' ')}</div>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-slate-500">Kapasitas Kursi</span>
                <div className="font-bold text-cyan-400 mt-1">{selectedBusModal.seatCapacity} Seats</div>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-slate-500">BBM Tangki Solar</span>
                <div className="font-bold text-amber-400 mt-1">{selectedBusModal.fuelLevelPct}% Full</div>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-slate-500">Odometer KM</span>
                <div className="font-bold text-white mt-1">{selectedBusModal.odometerKm.toLocaleString()} KM</div>
              </div>
            </div>

            {/* Legal Documents & Kemenhub Inspection */}
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-400" />
                Legalitas & Kartu Pengawasan (Kemenhub & Dishub)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-slate-400">Masa Berlaku Uji KIR:</div>
                  <div className="font-bold text-emerald-400 mt-0.5">{selectedBusModal.kirExpiry} (Aktif)</div>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-slate-400">Izin Trayek (KPS):</div>
                  <div className="font-bold text-emerald-400 mt-0.5">{selectedBusModal.kpsExpiry} (Aktif)</div>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-slate-400">Pajak STNK & TNKB:</div>
                  <div className="font-bold text-slate-200 mt-0.5">{selectedBusModal.stnkExpiry}</div>
                </div>
              </div>
            </div>

            {/* Maintenance & Service Status */}
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-amber-400" />
                Jadwal Servis Berkala & Ramp Check
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Servis Terakhir:</span>
                  <span className="font-medium text-white">{selectedBusModal.lastServiceDate}</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Servis Berikutnya:</span>
                  <span className="font-bold text-amber-400">{selectedBusModal.nextServiceKm.toLocaleString()} KM</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Ramp Check Terakhir:</span>
                  <span className="font-bold text-emerald-400">{selectedBusModal.lastInspectionDate} (LULUS)</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Ramp Check Jatuh Tempo:</span>
                  <span className="font-medium text-slate-300">{selectedBusModal.nextInspectionDue}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedBusModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Bus */}
      {isAddBusModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative my-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Bus className="w-5 h-5 text-blue-500" />
                Registrasi Unit Bus Baru ke Sistem
              </h3>
              <button
                onClick={() => setIsAddBusModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newBus: BusVehicle = {
                  id: `bus-${Date.now()}`,
                  plateNumber: formData.get('plateNumber') as string || 'B 7999 TGA',
                  busNumber: formData.get('busNumber') as string || 'BUS-999',
                  name: formData.get('name') as string || 'New Fleet Executive',
                  busType: (formData.get('busType') as BusTypeCategory) || 'INTERCITY_BUS',
                  busClass: (formData.get('busClass') as BusClass) || 'EXECUTIVE',
                  serviceType: 'AKAP',
                  brand: formData.get('brand') as string || 'Mercedes-Benz',
                  model: formData.get('model') as string || 'OH 1626',
                  chassisType: 'Air Suspension',
                  bodyMaker: formData.get('bodyMaker') as string || 'Adiputro Karoseri',
                  manufacturingYear: Number(formData.get('manufacturingYear')) || 2024,
                  seatCapacity: Number(formData.get('seatCapacity')) || 32,
                  standingCapacity: 0,
                  totalPassengerCapacity: Number(formData.get('seatCapacity')) || 32,
                  doorCount: 2,
                  hasAC: true,
                  hasToilet: true,
                  hasWiFi: true,
                  hasUsbCharger: true,
                  hasEntertainment: true,
                  hasCCTV: true,
                  hasGPS: true,
                  hasEmergencyEquipment: true,
                  hasWheelchairAccessibility: false,
                  status: 'AVAILABLE',
                  odometerKm: 0,
                  fuelLevelPct: 100,
                  lastInspectionDate: new Date().toISOString().split('T')[0],
                  nextInspectionDue: '2026-09-20',
                  lastServiceDate: new Date().toISOString().split('T')[0],
                  nextServiceKm: 10000,
                  stnkExpiry: '2029-01-01',
                  kirExpiry: '2027-01-01',
                  kpsExpiry: '2028-01-01'
                };
                setBuses([newBus, ...buses]);
                setIsAddBusModalOpen(false);
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Nomor Polisi (Plat Bus)</label>
                  <input
                    name="plateNumber"
                    required
                    placeholder="Contoh: B 7788 TGA"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Nomor Lambung / Kode Unit</label>
                  <input
                    name="busNumber"
                    required
                    placeholder="Contoh: BUS-058"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Nama Unit / Julukan Bus</label>
                <input
                  name="name"
                  required
                  placeholder="Contoh: Jetbus 5 Dream Coach #58"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Merk Chassis</label>
                  <select
                    name="brand"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Mercedes-Benz">Mercedes-Benz</option>
                    <option value="Scania">Scania</option>
                    <option value="Hino">Hino</option>
                    <option value="Volvo">Volvo</option>
                    <option value="Isuzu">Isuzu</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Tipe Model</label>
                  <input
                    name="model"
                    placeholder="OH 1626 / K410IB / RM 280"
                    defaultValue="OH 1626"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Karoseri Bodybuilder</label>
                  <input
                    name="bodyMaker"
                    placeholder="Adiputro / Laksana / Tentrem"
                    defaultValue="Adiputro Jetbus 5"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Kategori Tipe Bus</label>
                  <select
                    name="busType"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="INTERCITY_BUS">Intercity Bus (AKAP)</option>
                    <option value="DOUBLE_DECKER">Double Decker (Bus Tingkat)</option>
                    <option value="TOUR_BUS">Tour Bus (Pariwisata)</option>
                    <option value="CITY_BUS">City Bus (BRT)</option>
                    <option value="SHUTTLE">Shuttle & Travel</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Kelas Layanan</label>
                  <select
                    name="busClass"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="SLEEPER_SUITES">Sleeper Suites Pod</option>
                    <option value="FIRST_CLASS_DOUBLE_DECKER">First Class Double Decker</option>
                    <option value="SUPER_EXECUTIVE">Super Executive</option>
                    <option value="EXECUTIVE">Executive Class</option>
                    <option value="VIP">VIP Class</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Kapasitas Kursi</label>
                  <input
                    type="number"
                    name="seatCapacity"
                    defaultValue={32}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddBusModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-900/30"
                >
                  Simpan Registrasi Bus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
