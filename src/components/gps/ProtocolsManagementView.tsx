/**
 * Fleet Intelligence Smart AI - Telematics Protocol Management View
 * PROMPT 10 - Enterprise Protocol Gateway Catalog, Ports & Adapters
 */

import React from 'react';
import { gpsDeviceService } from '../../services/gpsDeviceService';
import { Network, Server, HardDrive, CheckCircle2, ShieldCheck } from 'lucide-react';

export const ProtocolsManagementView: React.FC = () => {
  const protocols = gpsDeviceService.listProtocols();

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Network className="h-6 w-6 text-cyan-400" />
          Telematics Protocols & Gateway Adapters
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Katalog protokol komunikasi GPS tracker (GT06, Teltonika, Queclink, JT808, MQTT), port socket gateway, dan format enkoding payload.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {protocols.map((proto) => (
          <div
            key={proto.id}
            className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="space-y-0.5">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Server className="h-4 w-4 text-cyan-400" />
                  {proto.name}
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">Port Gateway: {proto.port}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                {proto.transport}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">{proto.description}</p>

            <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
              <div className="flex justify-between">
                <span className="text-slate-500">Enkoding Payload</span>
                <span className="font-mono text-cyan-300 font-bold">{proto.encoding}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Otentikasi Connection</span>
                <span className="text-slate-200">{proto.authenticationMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Parser Adapter</span>
                <span className="font-mono text-slate-400">{proto.parserAdapter}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
