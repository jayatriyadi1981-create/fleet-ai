import React, { useState } from 'react';
import {
  MapPin,
  Shield,
  Navigation,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Compass,
  CornerUpRight,
  Layers
} from 'lucide-react';

export const SecuricorGeofenceCorridorsTab: React.FC = () => {
  const corridors = [
    {
      id: 'cor-01',
      code: 'COR-SUD-THAMRIN',
      name: 'Koridor Hijau VVIP Sudirman - Thamrin',
      securityLevel: 'MAXIMUM_HIGH_SECURITY',
      maxSpeedKmh: 60,
      minSpeedKmh: 20,
      noStopZoneEnabled: true,
      allowedDeviationMeters: 50,
      activeUnits: 2,
      status: 'ACTIVE_CLEARED',
    },
    {
      id: 'cor-02',
      code: 'COR-SCBD-GATSU',
      name: 'Koridor Finansial SCBD - Gatot Subroto',
      securityLevel: 'HIGH_SECURITY',
      maxSpeedKmh: 50,
      minSpeedKmh: 15,
      noStopZoneEnabled: true,
      allowedDeviationMeters: 75,
      activeUnits: 1,
      status: 'ACTIVE_CLEARED',
    },
    {
      id: 'cor-03',
      code: 'COR-TOLL-SOETTA',
      name: 'Koridor Transit Bandara Soekarno-Hatta Bullion',
      securityLevel: 'HIGH_SECURITY_HIGHWAY',
      maxSpeedKmh: 90,
      minSpeedKmh: 50,
      noStopZoneEnabled: true,
      allowedDeviationMeters: 100,
      activeUnits: 1,
      status: 'ACTIVE_CLEARED',
    }
  ];

  return (
    <div id="securicor-geofence-corridors-tab" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs text-amber-400 font-mono font-bold uppercase tracking-wider">SECURE GEOFENCED TRANSIT CORRIDORS & ROUTE LOCK</span>
          <h3 className="text-lg font-bold text-white mt-1">Koridor Rute Pengawalan Khusus & Zona Larangan Berhenti (No-Stop Zone)</h3>
          <p className="text-xs text-slate-400">Pemberitahuan otomatis jika konvoi keluar rute lebih dari 50 meter atau berhenti lebih dari 90 detik di luar titik singgah terotorisasi.</p>
        </div>

        <button
          onClick={() => alert('Buat Koridor Hijau Pengawalan Baru pada Peta Geofence')}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" /> Buat Koridor Geofence Baru
        </button>
      </div>

      {/* Corridors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {corridors.map(c => (
          <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-xs">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{c.name}</h4>
                  <p className="text-[11px] text-slate-500 font-mono">{c.code}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                {c.status}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Tingkat Keamanan:</span>
                <span className="font-bold text-slate-800">{c.securityLevel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Zona Dilarang Berhenti:</span>
                <span className="font-bold text-rose-600 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> No-Stop &lt;90 Detik
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Toleransi Deviasi Rute:</span>
                <span className="font-mono text-slate-800 font-semibold">{c.allowedDeviationMeters} Meter</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Batas Kecepatan Koridor:</span>
                <span className="font-mono text-slate-800">{c.minSpeedKmh} - {c.maxSpeedKmh} km/jam</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Armada Dalam Koridor:</span>
                <span className="font-bold text-emerald-600">{c.activeUnits} Unit Mobil Lapis Baja</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => alert(`Visualisasi Peta Koridor Geofence & Titik Red-Zone untuk ${c.name}`)}
                className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 shadow"
              >
                <Layers className="w-3.5 h-3.5" /> Plotting Koridor
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
