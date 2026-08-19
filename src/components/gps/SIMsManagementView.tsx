/**
 * Fleet Intelligence Smart AI - SIM Cards & Cellular M2M Management View
 * PROMPT 10 - Enterprise SIM Inventory, APN Configuration & Assignment History
 */

import React, { useState } from 'react';
import { gpsDeviceService } from '../../services/gpsDeviceService';
import { SIMCard } from '../../types/gps';
import {
  CreditCard,
  Plus,
  Radio,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  HardDrive
} from 'lucide-react';

export const SIMsManagementView: React.FC = () => {
  const [sims] = useState<SIMCard[]>(gpsDeviceService.listSIMs());
  const [search, setSearch] = useState<string>('');
  const [providerFilter, setProviderFilter] = useState<string>('all');

  const filteredSims = sims.filter((sim) => {
    const q = search.toLowerCase();
    const matchSearch =
      sim.phoneNumber.toLowerCase().includes(q) ||
      sim.iccid.toLowerCase().includes(q) ||
      sim.provider.toLowerCase().includes(q) ||
      (sim.currentDeviceCode && sim.currentDeviceCode.toLowerCase().includes(q));

    const matchProvider = providerFilter === 'all' || sim.provider === providerFilter;
    return matchSearch && matchProvider;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-cyan-400" />
            SIM Cards & M2M Cellular Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Pengelolaan kartu SIM M2M seluler, nomor ICCID, profil APN, paket data kuota, dan status keterikatan perangkat GPS.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-2xl border border-slate-800 bg-slate-900/60">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari No SIM, ICCID, Provider, Device..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-800 bg-slate-950 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>
        <select
          value={providerFilter}
          onChange={(e) => setProviderFilter(e.target.value)}
          className="py-2 px-3 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none"
        >
          <option value="all">Provider: Semua</option>
          <option value="Telkomsel">Telkomsel IoT</option>
          <option value="XL">XL Axiata</option>
          <option value="Indosat">Indosat Ooredoo</option>
        </select>
      </div>

      {/* SIM Cards Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800 tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Nomor SIM</th>
                <th className="px-4 py-3.5">ICCID</th>
                <th className="px-4 py-3.5">Provider & APN</th>
                <th className="px-4 py-3.5">Device Terikat</th>
                <th className="px-4 py-3.5">Penggunaan Data</th>
                <th className="px-4 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredSims.map((sim) => (
                <tr key={sim.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3.5 font-bold font-mono text-white">
                    {sim.phoneNumber}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-300">
                    {sim.iccid}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-cyan-300">{sim.provider} ({sim.network})</div>
                    <div className="text-[10px] text-slate-500 font-mono">APN: {sim.apn}</div>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-amber-300 font-semibold">
                    {sim.currentDeviceCode || 'Unassigned'}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="space-y-1">
                      <div className="text-[10px] font-mono text-slate-400">
                        {sim.dataUsedMb} MB / {sim.monthlyDataLimitMb} MB
                      </div>
                      <div className="w-24 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-cyan-400"
                          style={{ width: `${Math.min(100, (sim.dataUsedMb / sim.monthlyDataLimitMb) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        sim.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {sim.status.toUpperCase()}
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
