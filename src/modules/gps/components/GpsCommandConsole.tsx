/**
 * Fleet Intelligence Smart AI - Device Command Remote Console
 */

import React, { useState } from 'react';
import { GpsCommandEngine } from '../services/GpsCommandEngine';
import { GpsCommand, GpsCommandType } from '../types/gpsArchitecture';
import { 
  Send, 
  Terminal, 
  Lock, 
  Unlock, 
  RotateCcw, 
  MapPin, 
  Activity, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';

export const GpsCommandConsole: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<string>('GPS-DEV-001');
  const [commandLog, setCommandLog] = useState<GpsCommand[]>(GpsCommandEngine.getCommandHistory());
  const [isSending, setIsSending] = useState<boolean>(false);
  const [lastResponse, setLastResponse] = useState<string | null>(null);

  const handleExecute = async (type: GpsCommandType, params: Record<string, any> = {}) => {
    if (type === 'LOCK_ENGINE') {
      const confirmLock = window.confirm(`⚠️ KRITIS: Kirim perintah PEMUTUS MESIN (Immobilizer) ke ${selectedDevice}?`);
      if (!confirmLock) return;
    }

    setIsSending(true);
    setLastResponse('Mengirim sinyal IoT...');

    try {
      const result = await GpsCommandEngine.executeCommand(selectedDevice, type, params, 'Admin Operator');
      setCommandLog(GpsCommandEngine.getCommandHistory());
      setLastResponse(`✓ [ACK Diterima]: ${result.response}`);
    } catch (err: any) {
      setLastResponse(`❌ Gagal: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Command Control Box */}
        <div className="lg:col-span-1 rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">IoT Command Console</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              RBAC PROTECTED
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-slate-400 font-mono block mb-1">Pilih Perangkat Target</label>
              <select
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="GPS-DEV-001">GPS-DEV-001 (Teltonika FMB920 - Truk Wingbox B 9876 XYZ)</option>
                <option value="GPS-DEV-002">GPS-DEV-002 (Concox GT06 - Hino Ranger B 1234 ABC)</option>
                <option value="GPS-DEV-003">GPS-DEV-003 (Generic REST - Isuzu Traga B 4567 DEF)</option>
              </select>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-400 font-mono block">Daftar Perintah Instan:</span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleExecute('REQUEST_LOCATION')}
                  disabled={isSending}
                  className="flex items-center justify-center gap-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-200 text-xs font-mono p-2 rounded-xl transition-all"
                >
                  <MapPin className="h-3.5 w-3.5 text-cyan-400" /> Ping Lokasi
                </button>

                <button
                  onClick={() => handleExecute('REQUEST_STATUS')}
                  disabled={isSending}
                  className="flex items-center justify-center gap-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-200 text-xs font-mono p-2 rounded-xl transition-all"
                >
                  <Activity className="h-3.5 w-3.5 text-emerald-400" /> Cek Status
                </button>

                <button
                  onClick={() => handleExecute('RESTART_DEVICE')}
                  disabled={isSending}
                  className="flex items-center justify-center gap-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-slate-200 text-xs font-mono p-2 rounded-xl transition-all"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-amber-400" /> Reboot GPS
                </button>

                <button
                  onClick={() => handleExecute('UNLOCK_ENGINE')}
                  disabled={isSending}
                  className="flex items-center justify-center gap-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-emerald-300 text-xs font-mono p-2 rounded-xl transition-all"
                >
                  <Unlock className="h-3.5 w-3.5 text-emerald-400" /> Unlock Mesin
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleExecute('LOCK_ENGINE')}
                  disabled={isSending}
                  className="w-full flex items-center justify-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold p-2.5 rounded-xl transition-all shadow-md shadow-rose-950/20"
                >
                  <Lock className="h-4 w-4 text-rose-400" /> Kunci / Cut-Off Mesin (High Risk)
                </button>
              </div>
            </div>
          </div>

          {lastResponse && (
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300">
              {lastResponse}
            </div>
          )}
        </div>

        {/* Command Audit Log */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Log Audit Perintah IoT (Command History Audit Trail)
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {commandLog.length} Perintah
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 max-h-[320px]">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-[10px] uppercase text-slate-400 sticky top-0">
                  <th className="p-2.5">Command ID</th>
                  <th className="p-2.5">Device Target</th>
                  <th className="p-2.5">Perintah</th>
                  <th className="p-2.5">Waktu Kirim</th>
                  <th className="p-2.5">Operator</th>
                  <th className="p-2.5 text-right">Status ACK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-[11px]">
                {commandLog.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-500 italic">
                      Belum ada perintah dikirimkan.
                    </td>
                  </tr>
                ) : (
                  commandLog.map((cmd) => (
                    <tr key={cmd.id} className="hover:bg-slate-900/60">
                      <td className="p-2.5 text-cyan-400 font-bold">{cmd.id}</td>
                      <td className="p-2.5 text-white">{cmd.deviceId}</td>
                      <td className="p-2.5 font-bold text-slate-200">{cmd.commandType}</td>
                      <td className="p-2.5 text-slate-400">{new Date(cmd.requestedAt).toLocaleTimeString()}</td>
                      <td className="p-2.5 text-slate-300">{cmd.requestedBy}</td>
                      <td className="p-2.5 text-right">
                        <span className="text-emerald-400 font-bold text-[10px] inline-flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> {cmd.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
