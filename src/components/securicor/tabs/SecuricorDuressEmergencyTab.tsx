import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Radio,
  Lock,
  Flame,
  PhoneCall,
  CheckCircle2,
  BellRing,
  WifiOff,
  Zap,
  MapPin,
  Volume2
} from 'lucide-react';
import { MOCK_ARMORED_FLEETS } from '../../../modules/securicor/services/securicorMockData';

export const SecuricorDuressEmergencyTab: React.FC = () => {
  const [activeAlerts, setActiveAlerts] = useState<any[]>([
    {
      id: 'al-01',
      type: 'SILENT_DURESS_TRIGGERED',
      vehicle: 'ARMOR-CIT-01',
      location: 'Jl. Jend. Sudirman Kav. 1 (Menara Astra)',
      timestamp: '2 Menit yang lalu',
      severity: 'HIGH_PRIORITY_TEST',
      status: 'MONITORED_CLEAR',
    }
  ]);

  const [sirenTestActive, setSirenTestActive] = useState(false);

  return (
    <div id="securicor-duress-emergency-tab" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/60 to-slate-900 border border-rose-900/60 rounded-xl p-5 text-white flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-rose-400">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider">COMMAND CENTER DURESS & ANTI-HIJACK EMERGENCY</span>
          </div>
          <h3 className="text-lg font-bold text-white">Protokol Darurat Pembajakan, Tombol Panik & Interlock Mesin</h3>
          <p className="text-xs text-slate-300">Respon cepat siaga darurat ke SPKT Polda Metro Jaya, Brimob, dan penguncian tangki/brankas lapis baja.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSirenTestActive(!sirenTestActive)}
            className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all flex items-center gap-1.5 ${
              sirenTestActive
                ? 'bg-rose-600 border-rose-500 text-white animate-bounce'
                : 'bg-slate-900 border-slate-700 text-rose-300 hover:bg-slate-800'
            }`}
          >
            <BellRing className="w-4 h-4" />
            {sirenTestActive ? 'SIRENE ALARM TEST AKTIF' : 'Uji Tombol Panik / Duress'}
          </button>
        </div>
      </div>

      {/* 4 Emergency Protocol Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">1. Silent Foot Panic Button</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs text-slate-600">Tombol pedal tersembunyi tanpa suara di bawah kursi pengemudi dan co-pilot.</p>
          <div className="text-[11px] font-mono text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Sensor Siaga 100%
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">2. Remote Engine Kill</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs text-slate-600">Pemutus arus injektor BBM dari server pusat via satelit ganda untuk menghentikan pelarian.</p>
          <div className="text-[11px] font-mono text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Relay Terhubung
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">3. Smoke & Dye Activation</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs text-slate-600">Peletupan asap kabin pengacau pandangan dan noda tinta permanen pada seluruh uang kertas.</p>
          <div className="text-[11px] font-mono text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Detonator Siap
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">4. POLRI Direct Dispatch</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs text-slate-600">Integrasi hotline darurat 110 & kanal koordinasi Tactical Radio Komando Polda Metro.</p>
          <div className="text-[11px] font-mono text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Radio Enkripsi AES
          </div>
        </div>
      </div>

      {/* Emergency Logs Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Radio className="w-4 h-4 text-rose-600" />
            Log Aktivitas Alarm & Sinyal Duress Real-Time
          </h3>
          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded font-mono">
            Zero Unresolved Incidents
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {activeAlerts.map(a => (
            <div key={a.id} className="p-4 flex flex-wrap items-center justify-between gap-3 hover:bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm font-mono">{a.type}</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 font-semibold">{a.vehicle}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {a.location} • <span>{a.timestamp}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
                  {a.status}
                </span>
                <button
                  onClick={() => alert(`Detail Investigasi Sinyal Duress untuk ${a.vehicle}`)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-lg text-xs font-semibold"
                >
                  Detail Log
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
