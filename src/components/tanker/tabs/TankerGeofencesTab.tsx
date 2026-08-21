import React, { useState } from 'react';
import {
  ShieldAlert,
  MapPin,
  AlertTriangle,
  Plus,
  Search,
  CheckCircle2,
  Navigation,
  Ban
} from 'lucide-react';

interface GeofenceCorridor {
  id: string;
  name: string;
  type: 'APPROVED_CORRIDOR' | 'RED_ZONE_NO_STOP' | 'AUTHORIZED_DEPOT' | 'SPBU_STATION';
  cargoAllowed: string;
  speedLimitKmh: number;
  alertLevel: 'HIGH_RISK_ALARM' | 'STANDARD_LOG' | 'CRITICAL_POLICE';
  activeTankersCount: number;
}

const MOCK_GEOFENCES: GeofenceCorridor[] = [
  {
    id: 'geo-01',
    name: 'Koridor Tol Trans-Jawa (Jakarta - Cirebon - Semarang)',
    type: 'APPROVED_CORRIDOR',
    cargoAllowed: 'BBM, CPO, LPG, Chemical B3',
    speedLimitKmh: 70,
    alertLevel: 'STANDARD_LOG',
    activeTankersCount: 14
  },
  {
    id: 'geo-02',
    name: 'Zona Merah: Pangkalan Ilegal Liar Pantura KM 82-89',
    type: 'RED_ZONE_NO_STOP',
    cargoAllowed: 'DILARANG BERHENTI SEMUA TANGKI',
    speedLimitKmh: 0,
    alertLevel: 'HIGH_RISK_ALARM',
    activeTankersCount: 0
  },
  {
    id: 'geo-03',
    name: 'Integrated Terminal TBBM Plumpang & Pelabuhan Tanjung Priok',
    type: 'AUTHORIZED_DEPOT',
    cargoAllowed: 'BBM & Avtur',
    speedLimitKmh: 20,
    alertLevel: 'STANDARD_LOG',
    activeTankersCount: 8
  },
  {
    id: 'geo-04',
    name: 'Zona Rawan ' + 'Kencing BBM' + ' Cikampek Timur KM 65',
    type: 'RED_ZONE_NO_STOP',
    cargoAllowed: 'DILARANG BERHENTI > 3 MENIT',
    speedLimitKmh: 0,
    alertLevel: 'CRITICAL_POLICE',
    activeTankersCount: 0
  }
];

export const TankerGeofencesTab: React.FC = () => {
  const [geofences, setGeofences] = useState<GeofenceCorridor[]>(MOCK_GEOFENCES);
  const [search, setSearch] = useState('');

  const filtered = geofences.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div id="tanker-geofences-tab" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <span>Geofencing Koridor Khusus & Zona Larangan Berhenti (Red Zones)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Pengawasan rute resmi angkutan cairan berbahaya, batas kecepatan kurva sloshing, dan proteksi anti-pencurian (kencing cairan).
          </p>
        </div>

        <div className="relative flex-1 sm:w-64 max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari geofence/zona..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Geofence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((geo) => (
          <div
            key={geo.id}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 hover:border-amber-500/30 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                    geo.type === 'RED_ZONE_NO_STOP'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {geo.type.replace(/_/g, ' ')}
                </span>
                <h3 className="text-base font-bold text-slate-100 mt-1">{geo.name}</h3>
              </div>

              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-slate-200">
                {geo.activeTankersCount} Unit di Area
              </span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Muatan Diizinkan:</span>
                <span className="font-semibold text-slate-200">{geo.cargoAllowed}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Batas Kecepatan Koridor:</span>
                <span className="font-bold text-amber-400 font-mono">
                  {geo.speedLimitKmh > 0 ? `Maks ${geo.speedLimitKmh} km/h` : 'STOP DILARANG'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Tingkat Eskalasi Alarm:</span>
                <span
                  className={`font-bold font-mono text-[10px] ${
                    geo.alertLevel === 'CRITICAL_POLICE'
                      ? 'text-rose-400'
                      : geo.alertLevel === 'HIGH_RISK_ALARM'
                      ? 'text-amber-400'
                      : 'text-slate-300'
                  }`}
                >
                  {geo.alertLevel.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Radius Geofence Poligon Aktif</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">Auto Trigger SMS & Siren</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
