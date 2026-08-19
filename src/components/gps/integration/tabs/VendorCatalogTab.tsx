/**
 * Fleet Intelligence Smart AI - GPS Integration: Vendor Catalog & Capabilities Matrix Tab
 * PROMPT 43: GPS Hardware Profiles, Supported Protocols, Capability Matrix & Command Support
 */

import React, { useState } from 'react';
import {
  Cpu,
  Check,
  X,
  Radio,
  Terminal,
  Shield,
  Layers,
  Search,
  Filter,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { GPSDeviceProfile, GPSDeviceCapabilityMatrix } from '../../../../types/gpsIntegration';
import { GPS_DEVICE_PROFILES } from '../../../../constants/gpsIntegrationData';

export const VendorCatalogTab: React.FC = () => {
  const [profiles] = useState<GPSDeviceProfile[]>(GPS_DEVICE_PROFILES);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>('ALL');
  const [activeProfile, setActiveProfile] = useState<GPSDeviceProfile>(GPS_DEVICE_PROFILES[0]);

  const manufacturers = ['ALL', 'Teltonika', 'Queclink', 'Concox / Jimi', 'Meitrack', 'Generic / Custom IoT'];

  const filteredProfiles = profiles.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.protocol.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMfr = selectedManufacturer === 'ALL' || p.manufacturer.includes(selectedManufacturer);
    return matchesSearch && matchesMfr;
  });

  const capabilityLabels: { key: keyof GPSDeviceCapabilityMatrix; label: string; desc: string }[] = [
    { key: 'location', label: 'Realtime GNSS Location', desc: 'Latitude, longitude, altitude, and accuracy metrics' },
    { key: 'ignition', label: 'ACC / Ignition Status', desc: 'Digital ACC wire input or virtual voltage detection' },
    { key: 'speed', label: 'GPS Ground Speed', desc: 'True ground speed in km/h' },
    { key: 'heading', label: 'Compass Heading / Course', desc: '0 - 359 degrees true north orientation' },
    { key: 'fuel', label: 'Fuel Sensing (Ultrasonic / Float)', desc: 'Capacitive/ultrasonic level probe integration' },
    { key: 'temperature', label: 'BLE / 1-Wire Temperature', desc: 'Cold-chain refrigeration thermal monitoring' },
    { key: 'battery', label: 'Internal Backup Battery', desc: 'Device internal battery percentage & voltage' },
    { key: 'odometer', label: 'Calculated / CAN Odometer', desc: 'Trip and lifetime distance tracking in KM' },
    { key: 'engineHours', label: 'Engine Operating Hours', desc: 'Accumulated operating time telemetry' },
    { key: 'canBus', label: 'FMS / J1939 CAN Bus Decoding', desc: 'Native ECU engine parameters (RPM, fuel rate, torque)' },
    { key: 'digitalInput', label: 'Digital Inputs (DI 1-4)', desc: 'Door open/close, PTO switch, panic button' },
    { key: 'digitalOutput', label: 'Digital Output (Relay Cutoff)', desc: 'Engine immobilizer relay actuation output' },
    { key: 'panic', label: 'SOS Emergency Button', desc: 'Instant panic trigger packet priority' }
  ];

  return (
    <div className="space-y-6">
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 rounded-2xl border border-slate-800 p-5">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="h-5 w-5 text-cyan-400" /> GPS Vendor Catalog &amp; Device Capabilities Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Matriks kemampuan perangkat keras GPS tracker. UI aplikasi secara dinamis hanya menampilkan fitur yang didukung oleh model tracker yang terpasang.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px]">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari model atau protokol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <select
            value={selectedManufacturer}
            onChange={(e) => setSelectedManufacturer(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            {manufacturers.map((m, idx) => (
              <option key={idx} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Profiles List & Detailed Profile Capabilities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Profile Selector Cards */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-1">
            Daftar Profil Vendor ({filteredProfiles.length})
          </span>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredProfiles.map((p) => {
              const isSelected = activeProfile.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setActiveProfile(p)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-500/40 shadow-sm shadow-cyan-950'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{p.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{p.manufacturer} • Model: <span className="font-mono text-cyan-300 font-bold">{p.model}</span></div>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                      {p.transport}
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-800/60">
                    <span>Protocol: {p.protocol}</span>
                    <span className="text-cyan-400 font-bold flex items-center gap-1">
                      Detail <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Profile Capabilities Matrix & Commands */}
        <div className="lg:col-span-7 bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-6">
          <div className="flex items-start justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">{activeProfile.name}</h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {activeProfile.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{activeProfile.description}</p>
            </div>

            <div className="text-right text-[11px] font-mono">
              <span className="text-slate-500 block">Parser Adapter:</span>
              <span className="text-cyan-400 font-bold">{activeProfile.parser} ({activeProfile.protocolVersion})</span>
            </div>
          </div>

          {/* Capabilities Grid */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" /> Matriks Telemetri Hardware (Hardware Capability Matrix)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {capabilityLabels.map((cap) => {
                const isSupported = !!activeProfile.capabilities[cap.key];
                return (
                  <div
                    key={cap.key}
                    className={`p-2.5 rounded-xl border flex items-center justify-between ${
                      isSupported
                        ? 'bg-slate-950/70 border-emerald-500/20 text-slate-200'
                        : 'bg-slate-950/30 border-slate-800/40 text-slate-500'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold">{cap.label}</div>
                      <div className="text-[10px] text-slate-500">{cap.desc}</div>
                    </div>
                    <div
                      className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        isSupported ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-600'
                      }`}
                    >
                      {isSupported ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Supported Commands */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Terminal className="h-4 w-4 text-purple-400" /> Supported Remote Commands
            </h4>

            <div className="flex flex-wrap gap-2">
              {activeProfile.commandSupport.map((cmd, idx) => (
                <span
                  key={idx}
                  className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-950 text-purple-300 border border-purple-500/30 font-semibold"
                >
                  {cmd}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
