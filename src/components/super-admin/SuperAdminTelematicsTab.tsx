/**
 * Fleet Intelligence Smart AI - Super Admin Telematics & IoT Device Pool Tab (Prompt 42)
 * Global IoT Telematics Hardware Monitoring, Protocol Parsers, SIM Card Lifecycle,
 * Packet Drop Rates, and Batch OTA Firmware Dispatcher.
 */

import React, { useState } from 'react';
import { PlatformDeviceItem } from '../../types/superAdmin';
import {
  Radio,
  Search,
  Filter,
  Cpu,
  Wifi,
  Battery,
  Building2,
  Truck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UploadCloud,
  Layers,
  Sparkles,
  Signal,
} from 'lucide-react';

interface SuperAdminTelematicsTabProps {
  devices: PlatformDeviceItem[];
  onDispatchOta: (deviceIds: string[], firmwareVersion: string) => void;
}

export const SuperAdminTelematicsTab: React.FC<SuperAdminTelematicsTabProps> = ({
  devices,
  onDispatchOta,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [protocolFilter, setProtocolFilter] = useState('all');
  const [providerFilter, setProviderFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>([]);
  const [otaFirmwareInput, setOtaFirmwareInput] = useState('03.28.06.Rev.01');
  const [isOtaModalOpen, setIsOtaModalOpen] = useState(false);

  const filteredDevices = devices.filter((d) => {
    if (protocolFilter !== 'all' && d.protocol !== protocolFilter) return false;
    if (providerFilter !== 'all' && d.simProvider !== providerFilter) return false;
    if (statusFilter !== 'all' && d.connectionStatus !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        d.imei.includes(q) ||
        d.hardwareModel.toLowerCase().includes(q) ||
        d.tenantName.toLowerCase().includes(q) ||
        d.simNumber.includes(q) ||
        (d.vehiclePlate && d.vehiclePlate.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const toggleSelectAll = () => {
    if (selectedDeviceIds.length === filteredDevices.length) {
      setSelectedDeviceIds([]);
    } else {
      setSelectedDeviceIds(filteredDevices.map((d) => d.id));
    }
  };

  const toggleSelectDevice = (id: string) => {
    if (selectedDeviceIds.includes(id)) {
      setSelectedDeviceIds(selectedDeviceIds.filter((d) => d !== id));
    } else {
      setSelectedDeviceIds([...selectedDeviceIds, id]);
    }
  };

  const handleDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDeviceIds.length === 0 || !otaFirmwareInput.trim()) return;
    onDispatchOta(selectedDeviceIds, otaFirmwareInput.trim());
    setIsOtaModalOpen(false);
    setSelectedDeviceIds([]);
  };

  const getStatusBadge = (status: PlatformDeviceItem['connectionStatus']) => {
    switch (status) {
      case 'online':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Online
          </span>
        );
      case 'offline':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
            Offline
          </span>
        );
      case 'unassigned':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            Stock Pool
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400">
            Degraded
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Pool Perangkat GPS & IoT Telematika</h2>
          <p className="text-xs text-slate-400">
            Monitoring telemetri hardware, kartu SIM M2M, protokol biner parser, dan distribusi update firmware massal (OTA).
          </p>
        </div>

        <button
          onClick={() => setIsOtaModalOpen(true)}
          disabled={selectedDeviceIds.length === 0}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-950 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          <UploadCloud className="h-4 w-4" />
          <span>Batch OTA Update ({selectedDeviceIds.length})</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-3 shadow-md">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari IMEI GPS, Model Hardware, Plat Nomor, SIM Number, atau Tenant..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={protocolFilter}
            onChange={(e) => setProtocolFilter(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-300 outline-none focus:border-cyan-500"
          >
            <option value="all">Semua Protokol</option>
            <option value="TELTONIKA">TELTONIKA</option>
            <option value="QUECLINK">QUECLINK</option>
            <option value="CONCOX">CONCOX</option>
            <option value="RUPTELA">RUPTELA</option>
            <option value="SUNTECH">SUNTECH</option>
          </select>

          <select
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-300 outline-none focus:border-cyan-500"
          >
            <option value="all">Semua SIM Provider</option>
            <option value="Telkomsel IoT">Telkomsel IoT</option>
            <option value="Indosat Ooredoo">Indosat Ooredoo</option>
            <option value="XL Axiata">XL Axiata</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-300 outline-none focus:border-cyan-500"
          >
            <option value="all">Semua Status</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="unassigned">Stock Pool</option>
          </select>
        </div>
      </div>

      {/* Devices Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="w-10 px-4 py-3.5">
                  <input
                    type="checkbox"
                    checked={selectedDeviceIds.length === filteredDevices.length && filteredDevices.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3.5">Hardware & IMEI</th>
                <th className="px-4 py-3.5">Tenant & Armada</th>
                <th className="px-4 py-3.5">SIM Card & Provider</th>
                <th className="px-4 py-3.5">Telemetri & Sinyal</th>
                <th className="px-4 py-3.5">Firmware</th>
                <th className="px-4 py-3.5 text-right">Status Koneksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredDevices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    Tidak ada perangkat IoT ditemukan.
                  </td>
                </tr>
              ) : (
                filteredDevices.map((d) => {
                  const isSelected = selectedDeviceIds.includes(d.id);

                  return (
                    <tr key={d.id} className={`hover:bg-slate-800/40 transition-colors ${isSelected ? 'bg-cyan-950/20' : ''}`}>
                      <td className="px-4 py-3.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectDevice(d.id)}
                          className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-0 cursor-pointer"
                        />
                      </td>

                      {/* Hardware */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-cyan-400 shrink-0">
                            <Radio className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="font-bold text-white block">{d.hardwareModel}</span>
                            <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                              <span>IMEI: {d.imei}</span>
                              <span className="rounded bg-slate-800 px-1 py-0.2 text-[9px] text-slate-300 font-bold">
                                {d.protocol}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Tenant & Vehicle */}
                      <td className="px-4 py-3.5">
                        <div>
                          <span className="text-slate-200 font-medium block truncate max-w-[180px]">
                            {d.tenantName}
                          </span>
                          {d.vehiclePlate ? (
                            <span className="text-[11px] font-mono text-cyan-300 font-bold">
                              {d.vehiclePlate} ({d.vehicleModel})
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500 italic">Belum terpasang di unit</span>
                          )}
                        </div>
                      </td>

                      {/* SIM */}
                      <td className="px-4 py-3.5">
                        <div className="font-mono text-[11px]">
                          <span className="text-slate-300 block">{d.simNumber}</span>
                          <span className="text-[10px] text-slate-400">{d.simProvider}</span>
                        </div>
                      </td>

                      {/* Telemetry metrics */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-1 text-[11px]">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 flex items-center gap-1">
                              <Signal className="h-3 w-3 text-emerald-400" /> {d.signalStrength}%
                            </span>
                            <span className="text-slate-400 flex items-center gap-1 font-mono">
                              <Battery className="h-3 w-3 text-cyan-400" /> {d.batteryVoltage}V
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 block font-mono">
                            Drop rate: {d.packetDropRate}%
                          </span>
                        </div>
                      </td>

                      {/* Firmware */}
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                          {d.firmwareVersion}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 text-right">{getStatusBadge(d.connectionStatus)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Batch OTA Modal */}
      {isOtaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
                <UploadCloud className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Batch OTA Firmware Dispatch</h3>
                <p className="text-xs text-slate-400">Distribusikan pembaruan firmware ke perangkat terpilih.</p>
              </div>
            </div>

            <form onSubmit={handleDispatchSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Perangkat Terpilih ({selectedDeviceIds.length} Unit)
                </label>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 max-h-24 overflow-y-auto font-mono text-[11px]">
                  {selectedDeviceIds.map((id) => {
                    const dev = devices.find((d) => d.id === id);
                    return <div key={id}>• {dev?.hardwareModel} ({dev?.imei}) - {dev?.tenantName}</div>;
                  })}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Target Firmware Version</label>
                <input
                  type="text"
                  required
                  value={otaFirmwareInput}
                  onChange={(e) => setOtaFirmwareInput(e.target.value)}
                  placeholder="Contoh: 03.28.06.Rev.01"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-mono text-white outline-none focus:border-purple-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-purple-200 text-[11px] leading-relaxed">
                ℹ️ Protokol OTA akan mengirimkan paket biner melalui jalur data telematika secara bertahap (batch queue) guna mencegah overload bandwidth kartu SIM.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOtaModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-950"
                >
                  Kirim Pembaruan OTA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
