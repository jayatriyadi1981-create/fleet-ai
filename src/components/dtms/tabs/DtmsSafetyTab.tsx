import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Compass,
  Eye,
  Activity,
  CheckCircle2,
  HardHat,
  Volume2
} from 'lucide-react';

export const DtmsSafetyTab: React.FC = () => {
  return (
    <div id="dtms-safety-tab" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>K3 Tambang, Anti-Rollover Incline Sensor & Blindspot Proximity</span>
          </h2>
          <p className="text-xs text-slate-400">Sistem keselamatan dumping kestabilan lateral, sensor anti-tabrakan shovel/unit lain & kepatuhan SMKP ESDM</p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">Zero LTI & Fatalities (324 Hari)</span>
        </div>
      </div>

      {/* Safety Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-100">Anti-Rollover Incline Warning</h3>
          <p className="text-xs text-slate-400">
            Sensor kemiringan lateral mendeteksi sudut tanah sebelum bak dump dinaikkan di disposal pad. Batas aman: &lt; 5° kemiringan lateral.
          </p>
          <div className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Interlock Hoist Aktif (Auto-Lock jika tanah miring &gt;7°)</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-100">Proximity Blindspot Radar (CAS)</h3>
          <p className="text-xs text-slate-400">
            Collision Avoidance System berbasis gelombang mikro & V2X mendeteksi LV (Light Vehicle), Shovel, Dozer, dan manusia di radius blindspot 360°.
          </p>
          <div className="text-xs text-cyan-400 font-semibold flex items-center space-x-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Alarm Kabin & Visual Radar 360° Aktif</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Volume2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-100">Engine Retarder & Downhill Control</h3>
          <p className="text-xs text-slate-400">
            Monitoring suhu oli retarder saat melintasi turunan curam grade 8-10% di jalur Pit Exit ke Disposal untuk mencegah rem blong (brake fade).
          </p>
          <div className="text-xs text-purple-400 font-semibold flex items-center space-x-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Max Downhill Speed Enforced (20 km/h)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
