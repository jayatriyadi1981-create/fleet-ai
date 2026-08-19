/**
 * Fleet Intelligence Smart AI - Firmware Repository & OTA Updates View
 * PROMPT 10 - Enterprise Firmware Packages & Model Compatibility Matrix
 */

import React from 'react';
import { gpsDeviceService } from '../../services/gpsDeviceService';
import { DownloadCloud, ShieldCheck, CheckCircle2, Cpu } from 'lucide-react';

export const FirmwareManagementView: React.FC = () => {
  const firmwareList = gpsDeviceService.listFirmware();

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <DownloadCloud className="h-6 w-6 text-cyan-400" />
          GPS Firmware Repository & OTA Packages
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Katalog paket firmware Over-The-Air (OTA), verifikasi checksum SHA-256, dan matriks kompatibilitas vendor.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800 tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Vendor & Model</th>
                <th className="px-4 py-3.5">Versi Firmware</th>
                <th className="px-4 py-3.5">Tanggal Rilis</th>
                <th className="px-4 py-3.5">Release Notes</th>
                <th className="px-4 py-3.5">SHA-256 Checksum</th>
                <th className="px-4 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {firmwareList.map((fw) => (
                <tr key={fw.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-white">
                    {fw.manufacturer} {fw.model}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-cyan-300 font-bold">
                    {fw.version}
                  </td>
                  <td className="px-4 py-3.5 text-slate-400 font-mono">
                    {fw.releaseDate}
                  </td>
                  <td className="px-4 py-3.5 text-slate-300 max-w-md">
                    {fw.releaseNotes}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[10px] text-slate-500 truncate max-w-[120px]">
                    {fw.fileChecksum}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                      {fw.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
