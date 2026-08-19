/**
 * Fleet Intelligence Smart AI - GPS & IoT Telematics Security Tab
 * PROMPT 50 - Device Authentication, Telemetry Bounds Check & Quarantine Sandbox
 */

import React, { useState } from 'react';
import {
  Radio,
  ShieldCheck,
  ShieldAlert,
  Cpu,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { gpsSecurityService } from '../services/gpsSecurityService';
import { GpsDeviceSecurityProfile } from '../types/securityTypes';

export const GpsSecurityTab: React.FC = () => {
  const [devices, setDevices] = useState<GpsDeviceSecurityProfile[]>(() =>
    gpsSecurityService.getDeviceSecurityProfiles()
  );
  const [quarantineLogs, setQuarantineLogs] = useState(() =>
    gpsSecurityService.getQuarantineLogs()
  );

  const handleRefresh = () => {
    setDevices(gpsSecurityService.getDeviceSecurityProfiles());
    setQuarantineLogs(gpsSecurityService.getQuarantineLogs());
  };

  const handleReleaseQuarantine = (imei: string) => {
    gpsSecurityService.releaseDeviceFromQuarantine(imei);
    handleRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <div>
          <h3 className="font-semibold text-white text-lg">GPS Protocol Gateway Firewall & Hardware Auth</h3>
          <p className="text-sm text-slate-400 mt-0.5">
            Zero Trust hardware authentication for GT06, Teltonika, JT808, and Queclink GPS trackers.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition"
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
          Refresh Gateway State
        </button>
      </div>

      {/* Gateway Defense Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Lock className="w-4 h-4 text-emerald-400" />
            Device Secret Verification
          </div>
          <p className="text-sm text-slate-200 font-medium mt-2">HMAC & Token Handshake</p>
          <p className="text-xs text-slate-400 mt-1">Every TCP/UDP socket frame requires verified IMEI signature.</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            Telemetry Bounds Filter
          </div>
          <p className="text-sm text-slate-200 font-medium mt-2">Spoofing & Drift Rejection</p>
          <p className="text-xs text-slate-400 mt-1">Rejects coordinates outside -90..90/-180..180 and speed &gt; 220 km/h.</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            Quarantine Sandbox
          </div>
          <p className="text-sm text-slate-200 font-medium mt-2">Automated Packet Isolation</p>
          <p className="text-xs text-slate-400 mt-1">Unregistered tracker payloads are diverted from core database.</p>
        </div>
      </div>

      {/* Registered Hardware Registry */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-blue-400" />
          IoT Hardware Pool & Authenticated Gateway Profiles
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Vehicle & Hardware</th>
                <th className="pb-3 font-semibold">IMEI & Device ID</th>
                <th className="pb-3 font-semibold">Protocol</th>
                <th className="pb-3 font-semibold">Last IP Address</th>
                <th className="pb-3 font-semibold">Last Telemetry</th>
                <th className="pb-3 font-semibold">Gateway Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {devices.map((d) => (
                <tr key={d.imei} className="hover:bg-slate-950/40 transition">
                  <td className="py-3.5 pr-3">
                    <div className="font-medium text-white">{d.deviceName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">Tenant: {d.tenantId}</div>
                  </td>
                  <td className="py-3.5 pr-3 font-mono text-slate-300">
                    <div>{d.imei}</div>
                    <div className="text-[11px] text-slate-500">{d.deviceId}</div>
                  </td>
                  <td className="py-3.5 pr-3 font-mono text-purple-400">
                    {d.protocol}
                  </td>
                  <td className="py-3.5 pr-3 font-mono text-slate-400">
                    {d.lastIp}
                  </td>
                  <td className="py-3.5 pr-3 text-slate-400">
                    {new Date(d.lastSeenAt).toLocaleTimeString()}
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-medium text-[10px] ${
                        d.status === 'AUTHENTICATED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quarantine Investigation Log */}
      {quarantineLogs.length > 0 && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              Quarantine Intercept Log (Malformed & Unknown Payloads)
            </h4>
            <span className="text-xs text-amber-400 font-mono">{quarantineLogs.length} Events Intercepted</span>
          </div>

          <div className="space-y-3">
            {quarantineLogs.map((q) => (
              <div key={q.id} className="p-4 bg-slate-950 rounded-xl border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-300">IMEI: {q.imei}</span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-400">{new Date(q.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-xs text-slate-300">{q.reason}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReleaseQuarantine(q.imei)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition"
                  >
                    Release & Authorize
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
