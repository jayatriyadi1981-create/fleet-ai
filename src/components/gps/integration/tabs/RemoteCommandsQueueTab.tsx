/**
 * Fleet Intelligence Smart AI - GPS Integration: Remote Commands & Queue Tab
 * PROMPT 43: Device Command Abstraction, 2-Step Safety Confirmation & Live Command Queue
 */

import React, { useState } from 'react';
import {
  Terminal,
  Send,
  Lock,
  Unlock,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Search,
  Activity,
  History,
  X
} from 'lucide-react';
import { GPSCommandType, CommandQueueItem, GPSDeviceConfiguration } from '../../../../types/gpsIntegration';
import { gpsIntegrationService } from '../../../../services/gps/gpsIntegrationService';

export const RemoteCommandsQueueTab: React.FC = () => {
  const [devices] = useState<GPSDeviceConfiguration[]>(gpsIntegrationService.getDevices());
  const [commandQueue, setCommandQueue] = useState<CommandQueueItem[]>(gpsIntegrationService.getCommandQueue());
  const [selectedDevice, setSelectedDevice] = useState<string>(devices[0]?.id || '');
  const [commandType, setCommandType] = useState<GPSCommandType>('REQUEST_LOCATION');
  const [intervalSec, setIntervalSec] = useState<number>(10);
  const [relayIndex, setRelayIndex] = useState<number>(1);
  const [customParam, setCustomParam] = useState<string>('');

  // 2-Step Safety Confirmation Modal state
  const [showSafetyModal, setShowSafetyModal] = useState<boolean>(false);
  const [safetyAuthCode, setSafetyAuthCode] = useState<string>('');
  const [safetyError, setSafetyError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const handleSendCommand = (e: React.FormEvent) => {
    e.preventDefault();

    // Critical commands require 2-step safety confirmation
    if (commandType === 'LOCK_ENGINE' || commandType === 'RESTART_DEVICE') {
      setShowSafetyModal(true);
      return;
    }

    dispatchCommandDirect();
  };

  const dispatchCommandDirect = () => {
    let params: Record<string, any> = {};
    if (commandType === 'SET_INTERVAL') params = { intervalSec };
    if (commandType === 'LOCK_ENGINE' || commandType === 'UNLOCK_ENGINE' || commandType === 'SET_OUTPUT') {
      params = { relayIndex, speedSafetyLimit: 10 };
    }
    if (customParam) params.custom = customParam;

    const res = gpsIntegrationService.sendCommand({
      commandType,
      deviceId: selectedDevice,
      parameters: params,
      requestedBy: {
        userId: 'usr-admin-1',
        userName: 'Admin Operasional',
        role: 'SUPER_ADMIN'
      },
      requiresSafetyConfirmation: commandType === 'LOCK_ENGINE' || commandType === 'RESTART_DEVICE'
    });

    if (res.success) {
      setCommandQueue(gpsIntegrationService.getCommandQueue());
      setNotification(`Perintah ${commandType} berhasil dikirim ke gateway.`);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const confirmSafetyAction = () => {
    if (safetyAuthCode.trim() !== 'CONFIRM') {
      setSafetyError('Ketik "CONFIRM" dengan huruf kapital untuk menyetujui eksekusi.');
      return;
    }
    setShowSafetyModal(false);
    setSafetyAuthCode('');
    setSafetyError(null);
    dispatchCommandDirect();
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

      {/* Main Grid: Command Dispatcher Form & Live Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Command Dispatcher */}
        <div className="lg:col-span-5 bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="h-4 w-4 text-cyan-400" /> Remote Command Dispatcher
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800 font-bold">
              Gateway v2.0
            </span>
          </div>

          <form onSubmit={handleSendCommand} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target GPS Tracker *</label>
              <select
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-cyan-500 focus:outline-none"
              >
                {devices.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.model} — IMEI: {d.imei} ({d.manufacturer})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Jenis Perintah (Command Type) *</label>
              <select
                value={commandType}
                onChange={(e) => setCommandType(e.target.value as GPSCommandType)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-cyan-500 focus:outline-none"
              >
                <option value="REQUEST_LOCATION">REQUEST_LOCATION (Ping Lokasi Instan)</option>
                <option value="SET_INTERVAL">SET_INTERVAL (Ubah Interval Kirim Paket)</option>
                <option value="REQUEST_STATUS">REQUEST_STATUS (Cek Status Baterai &amp; Sinyal)</option>
                <option value="SET_OUTPUT">SET_OUTPUT (Kontrol Digital Output / Relay)</option>
                <option value="LOCK_ENGINE">⚠️ LOCK_ENGINE (Putus Aliran Mesin / Immobilizer)</option>
                <option value="UNLOCK_ENGINE">UNLOCK_ENGINE (Buka Kunci Mesin / Restore Relay)</option>
                <option value="RESTART_DEVICE">⚠️ RESTART_DEVICE (Reboot Perangkat Keras)</option>
                <option value="CLEAR_BUFFER">CLEAR_BUFFER (Bersihkan Offline Flash Buffer)</option>
              </select>
            </div>

            {/* Dynamic Parameter Fields */}
            {commandType === 'SET_INTERVAL' && (
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Interval Laporan (Detik) *</label>
                <input
                  type="number"
                  min={5}
                  max={3600}
                  value={intervalSec}
                  onChange={(e) => setIntervalSec(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>
            )}

            {(commandType === 'LOCK_ENGINE' || commandType === 'UNLOCK_ENGINE' || commandType === 'SET_OUTPUT') && (
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-400">
                  <AlertTriangle className="h-4 w-4" /> Safety Interlock Protocol
                </div>
                <p className="text-[11px] leading-relaxed">
                  Perintah pemutus mesin hanya akan aktif secara aman saat kecepatan kendaraan di bawah 10 km/h untuk mencegah bahaya kecelakaan di jalan raya.
                </p>
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Parameter Tambahan (Opsional)</label>
              <input
                type="text"
                placeholder="e.g. param1=val;param2=val"
                value={customParam}
                onChange={(e) => setCustomParam(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-sm transition-all ${
                commandType === 'LOCK_ENGINE' || commandType === 'RESTART_DEVICE'
                  ? 'bg-rose-600 hover:bg-rose-500'
                  : 'bg-cyan-600 hover:bg-cyan-500'
              }`}
            >
              <Send className="h-4 w-4" />
              <span>Kirim Perintah ke Gateway</span>
            </button>
          </form>
        </div>

        {/* Right Side: Command Execution Queue & Audit Logs */}
        <div className="lg:col-span-7 bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="h-4 w-4 text-purple-400" /> Antrean &amp; Audit Trail Perintah (Command Queue)
            </h3>
            <span className="text-xs font-mono text-slate-400 font-bold">{commandQueue.length} Perintah Tercatat</span>
          </div>

          <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
            {commandQueue.map((item) => (
              <div
                key={item.command.id}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white">{item.command.type}</span>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800">
                        IMEI: {item.command.deviceImei}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                      Diminta oleh: <span className="text-slate-300 font-semibold">{item.command.requestedBy.userName}</span> • {new Date(item.command.createdAt).toLocaleTimeString()}
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      item.result.status === 'SUCCESS'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : item.result.status === 'ACKNOWLEDGED' || item.result.status === 'SENT'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {item.result.status}
                  </span>
                </div>

                {item.result.responsePayload && (
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 font-mono text-[11px] text-emerald-300">
                    {item.result.responsePayload}
                  </div>
                )}

                {/* Audit Trail Steps */}
                <div className="pt-2 border-t border-slate-800/60 space-y-1 text-[10px] font-mono text-slate-500">
                  {item.auditTrail.map((trail, tIdx) => (
                    <div key={tIdx} className="flex items-center gap-2">
                      <span className="text-slate-400">• {new Date(trail.timestamp).toLocaleTimeString()}</span>
                      <span className="text-cyan-400 font-bold">[{trail.action}]</span>
                      <span className="text-slate-300">{trail.details}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL: 2-Step Safety Confirmation for Critical Commands */}
      {showSafetyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> Konfirmasi Keselamatan Kritis (2-Step Safety)
              </h3>
              <button onClick={() => setShowSafetyModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Anda akan mengeksekusi perintah berisiko tinggi <strong className="text-rose-400 font-mono font-bold">{commandType}</strong>. Perintah ini dapat memutus daya mesin fisik kendaraan secara langsung.
            </p>

            {safetyError && (
              <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs">
                {safetyError}
              </div>
            )}

            <div className="space-y-1.5 text-xs">
              <label className="block text-slate-400 font-semibold">
                Ketik <span className="text-white font-mono font-bold">CONFIRM</span> untuk menyetujui:
              </label>
              <input
                type="text"
                value={safetyAuthCode}
                onChange={(e) => setSafetyAuthCode(e.target.value)}
                placeholder="CONFIRM"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowSafetyModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmSafetyAction}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
              >
                Eksekusi Perintah
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
