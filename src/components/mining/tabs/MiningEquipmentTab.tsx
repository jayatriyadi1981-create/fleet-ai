import React, { useState } from 'react';
import {
  Truck,
  Activity,
  Fuel,
  Gauge,
  MapPin,
  Clock,
  Search,
  Filter,
  Shield,
  Zap,
  Wrench,
  AlertTriangle,
  RotateCw
} from 'lucide-react';
import { miningService } from '../../../modules/mining/services/miningService';
import { MiningEquipmentAsset, MiningEquipmentStatus, MiningEquipmentType } from '../../../modules/mining/types';

export const MiningEquipmentTab: React.FC = () => {
  const [equipments, setEquipments] = useState<MiningEquipmentAsset[]>(miningService.getEquipments());
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedEquipment, setSelectedEquipment] = useState<MiningEquipmentAsset | null>(null);

  const handleStatusChange = (eqId: string, newStatus: MiningEquipmentStatus) => {
    miningService.updateEquipmentStatus(eqId, newStatus);
    setEquipments(miningService.getEquipments());
    if (selectedEquipment && selectedEquipment.id === eqId) {
      setSelectedEquipment({ ...selectedEquipment, status: newStatus });
    }
  };

  const filteredEquipments = equipments.filter(eq => {
    const matchesSearch = 
      eq.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (eq.currentOperatorName && eq.currentOperatorName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = categoryFilter === 'ALL' || eq.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || eq.status === statusFilter;

    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="space-y-6" id="mining-equipment-container">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl font-bold text-slate-900">Armada & Alat Berat Tambang (Mining Fleet Assets)</h1>
          </div>
          <p className="text-xs text-slate-500">
            Monitoring telematika mesin, kapasitas bucket/payload, sensor bahan bakar, jam operasi (HM), SILO Disnaker, & status penugasan real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold font-mono">
            {equipments.length} Total Unit
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari CN Unit (misal: EX-1201, DT-785, CAT 777), nama operator, atau model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium"
          >
            <option value="ALL">Semua Kategori Alat</option>
            <option value="HYDRAULIC_EXCAVATOR">Excavator / Shovel</option>
            <option value="HAUL_TRUCK">Haul / Dump Truck</option>
            <option value="BULLDOZER">Bulldozer</option>
            <option value="MOTOR_GRADER">Motor Grader</option>
            <option value="WATER_TRUCK">Water Truck</option>
            <option value="FUEL_TRUCK">Fuel Bowser</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium"
          >
            <option value="ALL">Semua Status Operasi</option>
            <option value="WORKING">WORKING</option>
            <option value="LOADING">LOADING</option>
            <option value="HAULING">HAULING</option>
            <option value="DUMPING">DUMPING</option>
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="STANDBY">STANDBY</option>
            <option value="MAINTENANCE">MAINTENANCE</option>
            <option value="BREAKDOWN">BREAKDOWN</option>
          </select>
        </div>
      </div>

      {/* Equipment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipments.map(eq => (
          <div key={eq.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="p-5">
              {/* Header: Code & Status */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-black font-mono bg-slate-900 text-amber-400">
                      {eq.code}
                    </span>
                    <span className="text-xs font-bold text-slate-500">{eq.brand} {eq.model}</span>
                  </div>
                  <h2 className="text-sm font-bold text-slate-900 mt-1">{eq.name}</h2>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    eq.status === 'LOADING' ? 'bg-amber-500 text-slate-950' :
                    eq.status === 'HAULING' ? 'bg-blue-600 text-white' :
                    eq.status === 'WORKING' ? 'bg-emerald-600 text-white' :
                    eq.status === 'MAINTENANCE' ? 'bg-purple-600 text-white' :
                    eq.status === 'BREAKDOWN' ? 'bg-rose-600 text-white' :
                    'bg-slate-700 text-white'
                  }`}>
                    {eq.status}
                  </span>
                </div>
              </div>

              {/* Specs & Metrics */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 my-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Kapasitas:</span>
                  <strong className="text-slate-900">{eq.payloadCapacityTon > 0 ? `${eq.payloadCapacityTon} Ton` : `${eq.capacityM3} m³`}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Hour Meter (HM):</span>
                  <strong className="text-slate-900 font-mono">{eq.hourMeter.toLocaleString()} HM</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">BBM (Fuel Level):</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Fuel className="w-3.5 h-3.5 text-amber-500" />
                    <span className="font-bold text-slate-900">{eq.fuelLevelPct}%</span>
                    <span className="text-[10px] text-slate-500 font-mono">({eq.fuelBurnRatePerHour} L/HM)</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Availability (PA/UA):</span>
                  <strong className="text-slate-900 font-mono">{eq.availabilityStats.physicalAvailabilityPct}% / {eq.availabilityStats.utilizationAvailabilityPct}%</strong>
                </div>
              </div>

              {/* Live Telematics Snapshot */}
              <div className="bg-slate-900 text-slate-200 p-3 rounded-xl mb-3 text-[11px]">
                <div className="flex items-center justify-between text-slate-400 mb-1.5 font-semibold">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" /> Sensor Telematika
                  </span>
                  <span className="text-[10px] text-emerald-400">Mesin Menyala</span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-center font-mono">
                  <div className="bg-slate-800 p-1 rounded">
                    <span className="text-[9px] text-slate-400 block">RPM</span>
                    <strong className="text-white">{eq.telemetry.engineRpm}</strong>
                  </div>
                  <div className="bg-slate-800 p-1 rounded">
                    <span className="text-[9px] text-slate-400 block">Oli</span>
                    <strong className="text-white">{eq.telemetry.oilPressureKpa} kPa</strong>
                  </div>
                  <div className="bg-slate-800 p-1 rounded">
                    <span className="text-[9px] text-slate-400 block">Coolant</span>
                    <strong className="text-white">{eq.telemetry.coolantTempC}°C</strong>
                  </div>
                </div>
              </div>

              {/* Location & Operator */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{eq.currentPitName || eq.currentSiteName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Operator Bertugas:</span>
                  <strong className="text-slate-800">{eq.currentOperatorName || 'Belum Ditugaskan'}</strong>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">SILO Disnaker:</span>
                  <span className="font-mono text-slate-700">{eq.siloCertificateNumber}</span>
                </div>
              </div>
            </div>

            {/* Quick Status Updater */}
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-slate-500">Ubah Status:</span>
              <div className="flex items-center gap-1">
                {(['AVAILABLE', 'WORKING', 'STANDBY', 'MAINTENANCE'] as MiningEquipmentStatus[]).map(st => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(eq.id, st)}
                    className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                      eq.status === st
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {st === 'AVAILABLE' ? 'Ready' : st === 'WORKING' ? 'Work' : st === 'STANDBY' ? 'Stby' : 'Maint'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
