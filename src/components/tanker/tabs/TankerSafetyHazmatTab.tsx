import React, { useState } from 'react';
import {
  ShieldAlert,
  Flame,
  AlertTriangle,
  FileText,
  CheckCircle,
  HelpCircle,
  Activity,
  Droplet,
  Radio
} from 'lucide-react';

interface HazmatItem {
  unNumber: string;
  chemicalName: string;
  hazmatClass: string;
  placardCode: string;
  flashPointC: string;
  primaryRisk: string;
  emergencyAction: string;
  aparRequired: string;
}

const MOCK_HAZMAT: HazmatItem[] = [
  {
    unNumber: 'UN 1203',
    chemicalName: 'GASOLINE / BENSIN (PERTALITE & PERTAMAX)',
    hazmatClass: 'Class 3 (Flammable Liquid)',
    placardCode: '3YE / 33-1203',
    flashPointC: '< -40°C',
    primaryRisk: 'Uap mudah terbakar & meledak jika terpapar percikan/statis',
    emergencyAction: 'Gunakan Busa (Foam AFFF) / Dry Chemical Powder. Isolasi radius 300m.',
    aparRequired: 'APAR Dry Chemical 9kg (2 Unit) + APAR CO2 6kg'
  },
  {
    unNumber: 'UN 1202',
    chemicalName: 'DIESEL FUEL / BIOSOLAR B35/B40',
    hazmatClass: 'Class 3 (Flammable Liquid)',
    placardCode: '3Z / 30-1202',
    flashPointC: '> 55°C',
    primaryRisk: 'Cairan mudah terbakar pada suhu tinggi, polusi air tanah',
    emergencyAction: 'Timbun dengan pasir/absorben spill kit. Gunakan water spray pendingin tabung.',
    aparRequired: 'APAR Dry Chemical 9kg (2 Unit)'
  },
  {
    unNumber: 'UN 1830',
    chemicalName: 'SULFURIC ACID / ASAM SULFAT (H2SO4 >51%)',
    hazmatClass: 'Class 8 (Corrosive Substance)',
    placardCode: '2P / 80-1830',
    flashPointC: 'Non-Flammable',
    primaryRisk: 'Korosif sangat kuat, luka bakar jaringan tubuh parah, uap beracun',
    emergencyAction: 'DILARANG menyiram air langsung ke cairan asam pekat. Netralkan dengan soda abu/kapur.',
    aparRequired: 'Neutralizer Kit B3 + PPE Baju Kimia Level B'
  },
  {
    unNumber: 'UN 1075',
    chemicalName: 'PETROLEUM GASES, LIQUEFIED (LPG BULK)',
    hazmatClass: 'Class 2.1 (Flammable Gas)',
    placardCode: '2WE / 23-1075',
    flashPointC: '< -104°C',
    primaryRisk: 'Gas bertekanan tinggi, risiko ledakan BLEVE jika tangki terkena panas ekstrem',
    emergencyAction: 'Semprotkan tirai air masif untuk mendinginkan dinding tabung Skid Tank.',
    aparRequired: 'APAR Dry Chemical 9kg + Sistem Water Deluge Nozzle'
  }
];

export const TankerSafetyHazmatTab: React.FC = () => {
  const [hazmatList] = useState<HazmatItem[]>(MOCK_HAZMAT);

  return (
    <div id="tanker-safety-hazmat-tab" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <Flame className="w-5 h-5 text-rose-400" />
            <span>Keselamatan B3 (Hazmat ADR), MSDS & Pencegahan Rollover</span>
          </h2>
          <p className="text-xs text-slate-400">
            Kepatuhan regulasi Kementerian Lingkungan Hidup & Kehutanan (KLHK), rambu plakat UN Number, dan sistem proteksi anti-guling (Rollover Stability).
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold font-mono">
            K3 HAZMAT COMPLIANT
          </span>
        </div>
      </div>

      {/* Rollover & Sloshing Dynamics Radar Card */}
      <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Deteksi Dinamika Inersia Cairan (Sloshing Dynamics & Baffle Monitor)
              </h3>
              <p className="text-xs text-slate-400">
                Peringatan dini gaya dorong sentrifugal saat manuver tikungan tajam atau rem mendadak
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
            STATUS: STABIL (0.14 G)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block">Ambang Batas Rollover</span>
            <span className="text-lg font-black text-slate-100 font-mono">0.35 G Lateral</span>
            <span className="text-[10px] text-emerald-400 block">Nilai sensor saat ini 0.14 G (Safe)</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block">Inspeksi Sekat Baffle</span>
            <span className="text-lg font-black text-slate-100 font-mono">100% OK</span>
            <span className="text-[10px] text-slate-400 block">Peredam goncangan sekat utuh</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block">Sistem Rem Tangki</span>
            <span className="text-lg font-black text-sky-400 font-mono">ABS + EBS Retarder</span>
            <span className="text-[10px] text-slate-400 block">Anti-Lock Braking Siap Operasi</span>
          </div>
        </div>
      </div>

      {/* Hazmat & UN Number Directory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hazmatList.map((haz) => (
          <div
            key={haz.unNumber}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 hover:border-amber-500/30 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-rose-600 text-white font-black flex flex-col items-center justify-center border-2 border-slate-950 shadow-md">
                  <Flame className="w-4 h-4" />
                  <span className="text-[9px] font-mono leading-none">{haz.unNumber.split(' ')[1]}</span>
                </div>
                <div>
                  <span className="text-[10px] text-amber-400 font-mono font-bold block">{haz.hazmatClass}</span>
                  <h4 className="text-sm font-bold text-slate-100">{haz.chemicalName}</h4>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 font-mono font-bold text-xs">
                {haz.placardCode}
              </span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Risiko Utama Bahaya:</span>
                <span className="text-slate-200">{haz.primaryRisk}</span>
              </div>
              <div className="pt-1.5 border-t border-slate-900">
                <span className="text-slate-400 block text-[10px]">Prosedur Tanggap Darurat Tumpahan:</span>
                <span className="text-amber-300/90">{haz.emergencyAction}</span>
              </div>
              <div className="pt-1.5 border-t border-slate-900 flex justify-between">
                <span className="text-slate-400 text-[10px]">Peralatan APAR Standar:</span>
                <span className="text-slate-200 font-semibold text-[11px]">{haz.aparRequired}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={() => alert(`Lembar Data Keselamatan (MSDS) untuk ${haz.chemicalName} berhasil dibuka!`)}
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center space-x-1"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Unduh Lembar MSDS Lengkap</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
