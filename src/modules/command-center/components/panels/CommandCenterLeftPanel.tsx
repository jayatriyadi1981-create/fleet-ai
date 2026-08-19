/**
 * Fleet Intelligence Smart AI - Command Center Left Tactical Panel
 * Multi-Tab Fleet Telemetry List, Driver Risk Rankings & Vehicle Risk Matrix
 */

import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  UserX, 
  AlertTriangle, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Fuel, 
  Gauge, 
  ShieldAlert, 
  Wrench, 
  WifiOff, 
  BatteryWarning, 
  PhoneCall, 
  SlidersHorizontal 
} from 'lucide-react';
import { commandCenterService } from '../../services/commandCenterService';
import { liveTrackingService } from '../../../maps/services/liveTrackingService';
import { MapVehicle } from '../../../maps/types';
import { DriverRiskItem, VehicleRiskItem } from '../../types/commandCenterTypes';

interface CommandCenterLeftPanelProps {
  onSelectVehicle: (vehicleId: string) => void;
  onCallDriver?: (phone: string, name: string) => void;
}

export const CommandCenterLeftPanel: React.FC<CommandCenterLeftPanelProps> = ({
  onSelectVehicle,
  onCallDriver,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'FLEET' | 'DRIVER_RISK' | 'VEHICLE_RISK'>('FLEET');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const [vehicles, setVehicles] = useState<MapVehicle[]>(liveTrackingService.getAllVehicles());
  const [driverRisks, setDriverRisks] = useState<DriverRiskItem[]>(commandCenterService.getDriverRisks());
  const [vehicleRisks, setVehicleRisks] = useState<VehicleRiskItem[]>(commandCenterService.getVehicleRisks());
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(commandCenterService.getSelectedVehicleId());

  useEffect(() => {
    const update = () => {
      setVehicles(liveTrackingService.getAllVehicles());
      setDriverRisks(commandCenterService.getDriverRisks());
      setVehicleRisks(commandCenterService.getVehicleRisks());
      setSelectedVehicleId(commandCenterService.getSelectedVehicleId());
    };
    update();
    const unsubscribe = commandCenterService.subscribe(update);
    return unsubscribe;
  }, []);

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.driverName && v.driverName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || v.status.toUpperCase() === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  const filteredDrivers = driverRisks.filter((d) =>
    d.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.plateNumber && d.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredVehicleRisks = vehicleRisks.filter((vr) =>
    vr.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vr.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside
      className={`relative bg-slate-900/95 backdrop-blur-md border-r border-slate-800 text-slate-100 flex flex-col transition-all duration-300 z-20 ${
        isCollapsed ? 'w-12' : 'w-80 lg:w-96'
      }`}
    >
      {/* Collapse / Expand Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3.5 top-12 w-7 h-7 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center shadow-lg z-30 transition-colors"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {isCollapsed ? (
        <div className="flex flex-col items-center gap-4 py-4">
          <button
            onClick={() => {
              setIsCollapsed(false);
              setActiveTab('FLEET');
            }}
            className={`p-2 rounded-lg ${activeTab === 'FLEET' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
            title="Armada Live"
          >
            <Truck className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setIsCollapsed(false);
              setActiveTab('DRIVER_RISK');
            }}
            className={`p-2 rounded-lg ${activeTab === 'DRIVER_RISK' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
            title="Risiko Pengemudi"
          >
            <UserX className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setIsCollapsed(false);
              setActiveTab('VEHICLE_RISK');
            }}
            className={`p-2 rounded-lg ${activeTab === 'VEHICLE_RISK' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
            title="Risiko Kendaraan"
          >
            <AlertTriangle className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <>
          {/* Tabs Header */}
          <div className="p-3 border-b border-slate-800">
            <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('FLEET')}
                className={`py-1.5 px-2 rounded-md font-semibold text-center transition-colors ${
                  activeTab === 'FLEET'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Armada ({vehicles.length})
              </button>
              <button
                onClick={() => setActiveTab('DRIVER_RISK')}
                className={`py-1.5 px-2 rounded-md font-semibold text-center transition-colors ${
                  activeTab === 'DRIVER_RISK'
                    ? 'bg-amber-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Risiko Driver
              </button>
              <button
                onClick={() => setActiveTab('VEHICLE_RISK')}
                className={`py-1.5 px-2 rounded-md font-semibold text-center transition-colors ${
                  activeTab === 'VEHICLE_RISK'
                    ? 'bg-rose-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Risiko Unit ({vehicleRisks.length})
              </button>
            </div>

            {/* Search and Filters */}
            <div className="mt-2.5 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari plat nomor, model, driver..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              {activeTab === 'FLEET' && (
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-700/80 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="ALL">Semua</option>
                  <option value="MOVING">Moving</option>
                  <option value="IDLE">Idle</option>
                  <option value="STOPPED">Stopped</option>
                  <option value="OFFLINE">Offline</option>
                </select>
              )}
            </div>
          </div>

          {/* Tab Content List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700">
            {/* TAB 1: FLEET LIST */}
            {activeTab === 'FLEET' && (
              <>
                {filteredVehicles.map((v) => {
                  const isSelected = selectedVehicleId === v.vehicleId;
                  return (
                    <div
                      key={v.vehicleId}
                      onClick={() => {
                        setSelectedVehicleId(v.vehicleId);
                        commandCenterService.setSelectedVehicleId(v.vehicleId);
                        onSelectVehicle(v.vehicleId);
                      }}
                      className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-950/60 border-blue-500 ring-1 ring-blue-500 text-white'
                          : 'bg-slate-850/60 border-slate-800 hover:border-slate-700 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-amber-400">
                            {v.vehiclePlate}
                          </span>
                          <span className="text-xs text-slate-400 truncate max-w-[120px]">
                            {v.vehicleName}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            v.status === 'Moving'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : v.status === 'Idle'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              : v.status === 'Stopped'
                              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {v.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                        <div className="flex items-center gap-1">
                          <Gauge className="w-3 h-3 text-blue-400" />
                          <span className="font-mono text-slate-200">{v.speed} km/h</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Fuel className="w-3 h-3 text-amber-400" />
                          <span className="font-mono text-slate-200">{v.fuelLevelPercent}%</span>
                        </div>
                        <div className="flex items-center gap-1 truncate">
                          <span className="text-slate-300 font-medium truncate">{v.driverName || 'Driver'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {/* TAB 2: DRIVER RISK RANKING */}
            {activeTab === 'DRIVER_RISK' && (
              <>
                <div className="p-2 mb-2 bg-amber-950/30 border border-amber-500/30 rounded-lg text-xs text-amber-300">
                  ⚠️ AI Driver Risk Scoring: Mengidentifikasi pengemudi dengan pelanggaran kecepatan, kelelahan, dan pengereman agresif.
                </div>
                {filteredDrivers.map((driver, index) => (
                  <div
                    key={driver.driverId}
                    className="p-2.5 rounded-lg bg-slate-850/60 border border-slate-800 hover:border-slate-700 text-slate-200 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-slate-800 text-[11px] font-bold flex items-center justify-center text-slate-400">
                            #{index + 1}
                          </span>
                          <span className="font-semibold text-sm text-white">{driver.driverName}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Unit: {driver.plateNumber || 'Belum ditugaskan'} • {driver.phone}
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                            driver.riskLevel === 'HIGH'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                              : driver.riskLevel === 'MEDIUM'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}
                        >
                          Risk: {driver.riskScore}/100
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1">
                      {driver.primaryRisks.map((risk, rIdx) => (
                        <span
                          key={rIdx}
                          className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded"
                        >
                          {risk}
                        </span>
                      ))}
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">
                        Durasi Jalan: <strong className="text-white">{driver.activeTripDurationHours} jam</strong>
                      </span>
                      {onCallDriver && (
                        <button
                          onClick={() => onCallDriver(driver.phone, driver.driverName)}
                          className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold"
                        >
                          <PhoneCall className="w-3 h-3" /> Hubungi
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* TAB 3: VEHICLE RISK MATRIX */}
            {activeTab === 'VEHICLE_RISK' && (
              <>
                <div className="p-2 mb-2 bg-rose-950/30 border border-rose-500/30 rounded-lg text-xs text-rose-300">
                  🚨 Matriks Kerentanan Unit: Mendeteksi indikasi aki drop, servis tertunda, kehilangan sinyal, dan bahan bakar kritis.
                </div>
                {filteredVehicleRisks.map((vr) => (
                  <div
                    key={vr.vehicleId}
                    onClick={() => {
                      commandCenterService.setSelectedVehicleId(vr.vehicleId);
                      onSelectVehicle(vr.vehicleId);
                    }}
                    className="p-2.5 rounded-lg bg-slate-850/60 border border-slate-800 hover:border-rose-500/50 text-slate-200 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-amber-400">
                            {vr.plateNumber}
                          </span>
                          <span className="text-[10px] text-slate-400">{vr.branchName}</span>
                        </div>
                        <div className="text-xs font-semibold text-slate-200 mt-1 flex items-center gap-1.5">
                          {vr.issueType === 'GPS_LOST' && <WifiOff className="w-3.5 h-3.5 text-slate-400" />}
                          {vr.issueType === 'MAINTENANCE_OVERDUE' && <Wrench className="w-3.5 h-3.5 text-rose-400" />}
                          {vr.issueType === 'BATTERY_LOW' && <BatteryWarning className="w-3.5 h-3.5 text-amber-400" />}
                          {vr.issueType === 'FUEL_ANOMALY' && <Fuel className="w-3.5 h-3.5 text-rose-400" />}
                          <span>{vr.title}</span>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          vr.riskCategory === 'CRITICAL'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            : vr.riskCategory === 'HIGH'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}
                      >
                        {vr.riskCategory}
                      </span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Status: <strong className="text-amber-300">{vr.metricValue}</strong></span>
                      <span>Terakhir: {vr.lastSeen}</span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </>
      )}
    </aside>
  );
};
