import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  Calendar,
  FileCheck,
  Search,
  Plus,
  UserCheck,
  Target,
  AlertCircle
} from 'lucide-react';

export const SecuricorArmedOfficersTab: React.FC = () => {
  const [searchOfficer, setSearchOfficer] = useState('');

  const officers = [
    {
      id: 'off-01',
      name: 'Kapten (Purn) Hendra Kurniawan',
      nrp: 'CIT-OFF-9901',
      unitType: 'CHIEF_ESCORT_LEAD',
      policeBadge: 'KTA POLRI: 782910-PMJ',
      senpiLicense: 'IKH-SENPI-2026/V/POLDA',
      senpiType: 'Pindad G2 Combat 9mm (Serial: G2-88219)',
      shootingScore: '98 / 100 (Master Marksmanship)',
      validUntil: '2027-11-30',
      activeMission: 'ARMOR-CIT-01 (BCA Sudirman)',
      status: 'ON_DUTY_ESCORT',
    },
    {
      id: 'off-02',
      name: 'Mayor (Purn) Teguh Wicaksono',
      nrp: 'CIT-OFF-9902',
      unitType: 'SPECIAL_TACTICAL_COMMANDER',
      policeBadge: 'KTA POLRI: 663911-BRIMOB',
      senpiLicense: 'IKH-SENPI-2026/VIII/POLDA',
      senpiType: 'Pindad SS2-V5 Tactical 5.56mm',
      shootingScore: '100 / 100 (Expert Sniper/Tactical)',
      validUntil: '2027-08-15',
      activeMission: 'ARMOR-CIT-02 (Bank Indonesia)',
      status: 'ON_DUTY_ESCORT',
    },
    {
      id: 'off-03',
      name: 'Lettu (Purn) Rudi Hartono',
      nrp: 'CIT-OFF-9903',
      unitType: 'AIRPORT_BULLION_ESCORT',
      policeBadge: 'KTA POLRI: 910283-SOETTA',
      senpiLicense: 'IKH-SENPI-2026/I/POLDA',
      senpiType: 'HS-9 9mm & Pindad Sabhara',
      shootingScore: '95 / 100 (Expert Marksmanship)',
      validUntil: '2028-01-10',
      activeMission: 'ARMOR-CIT-04 (BNI Bandara)',
      status: 'ON_DUTY_ESCORT',
    }
  ];

  return (
    <div id="securicor-armed-officers-tab" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs text-amber-400 font-mono font-bold uppercase tracking-wider">ARMED ESCORT & WEAPONS COMPLIANCE REGISTRY</span>
          <h3 className="text-lg font-bold text-white mt-1">Registrasi Petugas Pengawal Bersenjata & Izin Senpi Khusus (IKH)</h3>
          <p className="text-xs text-slate-400">Database kualifikasi menembak, validasi izin kepemilikan senjata api khusus dinas POLRI, dan penugasan armada lapis baja.</p>
        </div>

        <button
          onClick={() => alert('Formulir Perpanjangan Izin IKH Senpi & Uji Psikotes Mabes Polri')}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" /> Registrasi Personil & Izin Senpi
        </button>
      </div>

      {/* Officers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {officers.map(off => (
          <div key={off.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{off.name}</h4>
                  <p className="text-[11px] text-slate-500 font-mono">{off.nrp}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                {off.status}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">KTA / NRP Polri:</span>
                <span className="font-mono font-bold text-slate-800">{off.policeBadge}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Izin Senpi (IKH):</span>
                <span className="font-mono text-slate-700">{off.senpiLicense}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Jenis Senjata Dinas:</span>
                <span className="font-semibold text-slate-900 text-right">{off.senpiType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Skor Uji Menembak:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <Target className="w-3.5 h-3.5" /> {off.shootingScore}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Berlaku Sampai:</span>
                <span className="font-bold text-amber-600">{off.validUntil}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 mt-2">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Misi Aktif Hari Ini:</span>
                <p className="font-bold text-slate-900 text-xs mt-0.5">{off.activeMission}</p>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => alert(`Lihat Sertifikat Izin Khusus Senpi & KTA untuk ${off.name}`)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1"
              >
                <FileCheck className="w-3.5 h-3.5" /> Dokumen IKH
              </button>
              <button
                onClick={() => alert(`Roster Jadwal Tugas Pengawalan ${off.name}`)}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-lg text-xs font-semibold"
              >
                Roster Tugas
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
