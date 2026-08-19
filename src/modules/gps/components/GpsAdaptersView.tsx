/**
 * Fleet Intelligence Smart AI - Provider Adapters & Protocol Parsers View
 */

import React from 'react';
import { 
  Network, 
  Cpu, 
  CheckCircle2, 
  ShieldCheck, 
  Radio, 
  DownloadCloud, 
  Settings, 
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { defaultDeviceIdentifiers, defaultDeviceSensors } from '../repositories/MockGpsRepository';

export const GpsAdaptersView: React.FC = () => {
  const adapters = [
    {
      id: 'teltonika',
      name: 'Teltonika Telematics Adapter',
      protocol: 'Teltonika Codec 8 / 8 Extended',
      transport: 'TCP / UDP',
      port: 5027,
      encoding: 'Binary / Hex',
      auth: 'IMEI Handshake',
      capabilities: ['Location', 'Ignition', 'CANBus', 'Immobilizer', 'Fuel', 'Temperature'],
      status: 'active',
    },
    {
      id: 'istartek',
      name: 'iStartek Telematics Adapter (VT900/VT600/VT200)',
      protocol: 'iStartek ASCII / HEX ($$ Protocol)',
      transport: 'TCP / UDP / HTTP',
      port: 5055,
      encoding: 'ASCII / Hex ($$ Frame)',
      auth: 'IMEI Handshake',
      capabilities: ['Realtime GPS', 'Relay / Cut-off', 'Fuel Sensor (RS232/Analog)', 'BLE iBeacon', 'RFID / Driver ID', 'CANBus/OBDII', 'SOS Alert', 'FOTA Remote Upgrade'],
      status: 'active',
    },
    {
      id: 'concox',
      name: 'Concox GT06 Adapter',
      protocol: 'GT06 / Concox Protocol',
      transport: 'TCP',
      port: 5023,
      encoding: 'Hex Frame',
      auth: 'IMEI Handshake',
      capabilities: ['Location', 'Ignition', 'Door', 'Battery'],
      status: 'active',
    },
    {
      id: 'queclink',
      name: 'Queclink Wireless Adapter',
      protocol: 'Queclink ASCII Protocol',
      transport: 'UDP / TCP',
      port: 5012,
      encoding: 'Text ASCII',
      auth: 'Device Serial Token',
      capabilities: ['Location', 'Ignition', 'Fuel Sensor', 'Camera'],
      status: 'active',
    },
    {
      id: 'generic_http',
      name: 'Generic IoT REST Webhook Adapter',
      protocol: 'JSON Telematics Schema',
      transport: 'HTTPS / Webhook',
      port: 443,
      encoding: 'JSON',
      auth: 'Bearer Token / HMAC',
      capabilities: ['Location', 'Ignition', 'Sensor Payload'],
      status: 'active',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Adapters List */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Network className="h-4 w-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Registered GPS Provider Adapters (Protocol Gateway)
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            {adapters.length} Protocol Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {adapters.map((adapter) => (
            <div
              key={adapter.id}
              className="rounded-xl bg-slate-950/80 p-4 border border-slate-800 hover:border-cyan-500/30 transition-all space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    {adapter.name}
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  </h4>
                  <p className="text-[11px] font-mono text-cyan-400 mt-0.5">{adapter.protocol}</p>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                  Port {adapter.port}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                <div>
                  <span className="text-slate-500 block">Transport:</span>
                  <span className="text-slate-200">{adapter.transport}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Encoding:</span>
                  <span className="text-slate-200">{adapter.encoding}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Auth Method:</span>
                  <span className="text-slate-200">{adapter.auth}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-mono block">Capabilities Supported:</span>
                <div className="flex flex-wrap gap-1">
                  {adapter.capabilities.map((cap) => (
                    <span
                      key={cap}
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Identifiers & Sensors Dual Column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Identity Mapping Registry */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Cpu className="h-4 w-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Device Identity Registry (IMEI &amp; Serial)
            </h3>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-[10px] uppercase text-slate-400">
                  <th className="p-2.5">Device ID</th>
                  <th className="p-2.5">Type</th>
                  <th className="p-2.5">Identifier Value</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-[11px]">
                {defaultDeviceIdentifiers.map((ident) => (
                  <tr key={ident.id} className="hover:bg-slate-900/60">
                    <td className="p-2.5 text-white font-bold">{ident.deviceId}</td>
                    <td className="p-2.5 text-cyan-400">{ident.identifierType}</td>
                    <td className="p-2.5 text-slate-300">{ident.identifierValue}</td>
                    <td className="p-2.5">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                        PRIMARY
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Telematics Sensors Registry */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Radio className="h-4 w-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Connected Sensor Registry (CAN &amp; Analog)
            </h3>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-[10px] uppercase text-slate-400">
                  <th className="p-2.5">Device ID</th>
                  <th className="p-2.5">Sensor Name</th>
                  <th className="p-2.5">Type</th>
                  <th className="p-2.5 text-right">Nilai Terakhir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-[11px]">
                {defaultDeviceSensors.map((sens) => (
                  <tr key={sens.id} className="hover:bg-slate-900/60">
                    <td className="p-2.5 text-white font-bold">{sens.deviceId}</td>
                    <td className="p-2.5 text-slate-300">{sens.name}</td>
                    <td className="p-2.5 text-cyan-400">{sens.sensorType}</td>
                    <td className="p-2.5 text-right text-emerald-400 font-bold">
                      {String(sens.currentValue)} {sens.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
