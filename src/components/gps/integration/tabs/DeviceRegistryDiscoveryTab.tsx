/**
 * Fleet Intelligence Smart AI - GPS Integration: Device Registry & Auto-Discovery Tab
 * PROMPT 43: Device Catalog, Masked IMEI Security, Auto-Discovery Queue, Device Replacement & Transfer
 */

import React, { useState } from 'react';
import {
  Cpu,
  Radio,
  Search,
  Plus,
  Shield,
  Eye,
  EyeOff,
  RefreshCw,
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Sliders,
  Check,
  X
} from 'lucide-react';
import { GPSDeviceConfiguration, DiscoveryPendingDevice } from '../../../../types/gpsIntegration';
import { gpsIntegrationService } from '../../../../services/gps/gpsIntegrationService';

export const DeviceRegistryDiscoveryTab: React.FC = () => {
  const [devices, setDevices] = useState<GPSDeviceConfiguration[]>(gpsIntegrationService.getDevices());
  const [discoveryList, setDiscoveryList] = useState<DiscoveryPendingDevice[]>(gpsIntegrationService.getPendingDiscovery());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [unmaskIMEI, setUnmaskIMEI] = useState<boolean>(false);

  // Modals state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showReplaceModal, setShowReplaceModal] = useState<boolean>(false);
  const [selectedDeviceForReplace, setSelectedDeviceForReplace] = useState<GPSDeviceConfiguration | null>(null);

  // New device form
  const [newImei, setNewImei] = useState<string>('');
  const [newSerial, setNewSerial] = useState<string>('');
  const [newManufacturer, setNewManufacturer] = useState<string>('Teltonika');
  const [newModel, setNewModel] = useState<string>('FMB920');
  const [newProtocol, setNewProtocol] = useState<string>('Teltonika Codec 8');
  const [newSim, setNewSim] = useState<string>('+6281198765499');
  const [newSimProvider, setNewSimProvider] = useState<string>('Telkomsel M2M');
  const [newApn, setNewApn] = useState<string>('internet');

  // Replace form
  const [replaceImei, setReplaceImei] = useState<string>('');
  const [replaceSerial, setReplaceSerial] = useState<string>('');
  const [replaceReason, setReplaceReason] = useState<string>('Perangkat lama mengalami kerusakan modul GSM/GPS');

  const [formError, setFormError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const filteredDevices = devices.filter(
    (d) =>
      d.imei.includes(searchQuery) ||
      d.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.simNumber.includes(searchQuery)
  );

  const handleRegisterDevice = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const res = gpsIntegrationService.registerDevice({
      imei: newImei,
      serialNumber: newSerial || `SN-${newManufacturer.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`,
      manufacturer: newManufacturer,
      model: newModel,
      protocol: newProtocol,
      protocolVersion: 'v1.0',
      serverHost: 'gateway.fleetintelligence.id',
      serverPort: newManufacturer === 'Queclink' ? 5003 : newManufacturer === 'Concox / Jimi' ? 5002 : 5001,
      apn: newApn,
      simNumber: newSim,
      simProvider: newSimProvider,
      authenticationMethod: 'IMEI_Handshake',
      firmware: 'FW_STABLE_2026',
      timezone: 'Asia/Jakarta',
      status: 'active',
      offlineThresholdMinutes: 15
    });

    if (res.success && res.device) {
      setDevices(gpsIntegrationService.getDevices());
      setDiscoveryList(gpsIntegrationService.getPendingDiscovery());
      setShowAddModal(false);
      setNewImei('');
      setNotification(`Perangkat ${res.device.model} (${res.device.imei}) berhasil didaftarkan.`);
      setTimeout(() => setNotification(null), 4000);
    } else {
      setFormError(res.error || 'Gagal mendaftarkan perangkat');
    }
  };

  const handleReplaceDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeviceForReplace) return;
    setFormError(null);

    const res = gpsIntegrationService.replaceDevice({
      oldDeviceId: selectedDeviceForReplace.id,
      newImei: replaceImei,
      newSerialNumber: replaceSerial || `SN-REP-${Date.now().toString().slice(-6)}`,
      newModel: selectedDeviceForReplace.model,
      newManufacturer: selectedDeviceForReplace.manufacturer,
      newProtocol: selectedDeviceForReplace.protocol,
      reason: replaceReason,
      replacedBy: 'Admin Operasional'
    });

    if (res.success && res.newDevice) {
      setDevices(gpsIntegrationService.getDevices());
      setShowReplaceModal(false);
      setSelectedDeviceForReplace(null);
      setReplaceImei('');
      setNotification(`Pergantian perangkat berhasil! Riwayat kendaraan & trip tetap aman terjaga.`);
      setTimeout(() => setNotification(null), 5000);
    } else {
      setFormError(res.error || 'Gagal mengganti perangkat');
    }
  };

  const handleApproveDiscovery = (disc: DiscoveryPendingDevice) => {
    const res = gpsIntegrationService.approveDiscovery(disc.id, disc.suggestedModel || 'FMB920', disc.suggestedManufacturer || 'Teltonika');
    if (res.success) {
      setDevices(gpsIntegrationService.getDevices());
      setDiscoveryList(gpsIntegrationService.getPendingDiscovery());
      setNotification(`Device IMEI ${disc.imei} disetujui & didaftarkan ke katalog.`);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleRejectDiscovery = (discId: string) => {
    gpsIntegrationService.rejectDiscovery(discId);
    setDiscoveryList(gpsIntegrationService.getPendingDiscovery());
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Auto-Discovery Queue (Unknown IMEIs) */}
      {discoveryList.length > 0 && (
        <div className="bg-amber-950/30 rounded-2xl border border-amber-500/30 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              <div>
                <h3 className="text-sm font-bold text-white">Auto-Discovery: Perangkat Baru Terdeteksi (Unknown IMEIs)</h3>
                <p className="text-[11px] text-amber-200/80">
                  Perangkat mengirim data ke gateway tetapi IMEI belum terdaftar di tenant catalog. Setujui untuk mendaftarkan instan.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
              {discoveryList.length} Pending
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            {discoveryList.map((disc) => (
              <div key={disc.id} className="p-3.5 rounded-xl bg-slate-950 border border-amber-800/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-400">{disc.imei}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-300 border border-slate-800">
                      {disc.transport}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Detected: <span className="text-white font-semibold">{disc.detectedProtocol}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    IP: {disc.remoteIp} • Pings: {disc.pingsCount}x
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleApproveDiscovery(disc)}
                    className="flex-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-[11px] font-bold text-white flex items-center justify-center gap-1 transition-all"
                  >
                    <Check className="h-3 w-3" /> Approve &amp; Register
                  </button>
                  <button
                    onClick={() => handleRejectDiscovery(disc.id)}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-[11px] text-slate-300 hover:text-rose-300 transition-all"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Device Registry Catalog Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 rounded-2xl border border-slate-800 p-5">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="h-5 w-5 text-cyan-400" /> GPS Device Catalog &amp; Hardware Configurations
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Konfigurasi perangkat fisik, SIM Card, APN, server host, dan manajemen keamanan IMEI.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px]">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari IMEI / SIM / Model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <button
            onClick={() => setUnmaskIMEI(!unmaskIMEI)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 border border-slate-700 transition-all"
          >
            {unmaskIMEI ? <EyeOff className="h-3.5 w-3.5 text-amber-400" /> : <Eye className="h-3.5 w-3.5 text-slate-400" />}
            <span>{unmaskIMEI ? 'Mask IMEI' : 'Unmask IMEI'}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white shadow-sm transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah Perangkat</span>
          </button>
        </div>
      </div>

      {/* Devices Table */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-mono border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 font-semibold">Device &amp; Model</th>
                <th className="px-4 py-3 font-semibold">IMEI (Hardware ID)</th>
                <th className="px-4 py-3 font-semibold">Protocol &amp; Port</th>
                <th className="px-4 py-3 font-semibold">SIM Card &amp; APN</th>
                <th className="px-4 py-3 font-semibold">Firmware &amp; TZ</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredDevices.map((dev) => (
                <tr key={dev.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3.5 font-sans">
                    <div className="font-bold text-white">{dev.model}</div>
                    <div className="text-[11px] text-slate-400">{dev.manufacturer} • {dev.serialNumber}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-bold text-cyan-300">
                      {gpsIntegrationService.maskIMEI(dev.imei, unmaskIMEI)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="text-slate-200">{dev.protocol}</div>
                    <div className="text-[10px] text-slate-500">Port {dev.serverPort} • {dev.serverHost}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="text-slate-200">{dev.simNumber}</div>
                    <div className="text-[10px] text-slate-400">{dev.simProvider} • APN: {dev.apn}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="text-slate-300">{dev.firmware}</div>
                    <div className="text-[10px] text-slate-500">{dev.timezone}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        dev.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {dev.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-sans">
                    <button
                      onClick={() => {
                        setSelectedDeviceForReplace(dev);
                        setShowReplaceModal(true);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 border border-slate-700 transition-all"
                    >
                      Ganti Perangkat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Register New Device */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-cyan-400" /> Registrasi Perangkat GPS Baru
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleRegisterDevice} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">IMEI Perangkat (15 Digit) *</label>
                <input
                  type="text"
                  required
                  maxLength={15}
                  placeholder="e.g. 867492041234567"
                  value={newImei}
                  onChange={(e) => setNewImei(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Manufaktur *</label>
                  <select
                    value={newManufacturer}
                    onChange={(e) => {
                      setNewManufacturer(e.target.value);
                      if (e.target.value === 'Teltonika') {
                        setNewModel('FMB920');
                        setNewProtocol('Teltonika Codec 8');
                      } else if (e.target.value === 'Concox / Jimi') {
                        setNewModel('GT06N');
                        setNewProtocol('Concox GT06 Binary');
                      } else if (e.target.value === 'Queclink') {
                        setNewModel('GV300');
                        setNewProtocol('Queclink @Track');
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Teltonika">Teltonika</option>
                    <option value="Concox / Jimi">Concox / Jimi</option>
                    <option value="Queclink">Queclink</option>
                    <option value="Meitrack">Meitrack</option>
                    <option value="Generic">Generic / IoT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Model Tracker *</label>
                  <input
                    type="text"
                    required
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nomor SIM Card *</label>
                  <input
                    type="text"
                    required
                    value={newSim}
                    onChange={(e) => setNewSim(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">APN Operator</label>
                  <input
                    type="text"
                    value={newApn}
                    onChange={(e) => setNewApn(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                >
                  Simpan Perangkat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Device Replacement Wizard (Preserve Vehicle History) */}
      {showReplaceModal && selectedDeviceForReplace && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ArrowRightLeft className="h-4 w-4 text-amber-400" /> Wizard Pergantian Perangkat (Device Replacement)
              </h3>
              <button onClick={() => setShowReplaceModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-cyan-200 text-xs">
              <strong>Riwayat Aman:</strong> Seluruh riwayat perjalanan (trip), koordinat log, dan metrik analitik kendaraan akan tetap utuh dan ditautkan mulus ke perangkat baru.
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleReplaceDevice} className="space-y-3.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Perangkat Lama (Akan Dinonaktifkan):</span>
                <div className="font-mono text-slate-200 mt-1 font-bold">
                  {selectedDeviceForReplace.model} • IMEI: {selectedDeviceForReplace.imei}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">IMEI Perangkat Pengganti Baru (15 Digit) *</label>
                <input
                  type="text"
                  required
                  maxLength={15}
                  placeholder="e.g. 869910401928374"
                  value={replaceImei}
                  onChange={(e) => setReplaceImei(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Alasan Pergantian Perangkat *</label>
                <textarea
                  rows={2}
                  value={replaceReason}
                  onChange={(e) => setReplaceReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReplaceModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold"
                >
                  Eksekusi Pergantian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
