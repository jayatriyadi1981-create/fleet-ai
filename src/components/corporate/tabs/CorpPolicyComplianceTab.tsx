import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  Car,
  Bell,
  FileWarning,
  Eye,
  Sliders
} from 'lucide-react';

export const CorpPolicyComplianceTab: React.FC = () => {
  const policyRules = [
    {
      id: 'pol-01',
      name: 'Batasan Jam Operasional Pool (Work-Hours Window)',
      description: 'Kendaraan pool kantor hanya boleh beroperasi Senin - Jumat pukul 07:00 - 19:00 WIB. Penggunaan di luar jam memerlukan izin lembur GA.',
      threshold: '19:00 - 06:00 WIB',
      enforcement: 'AUTO_ALARM_TO_GA',
      status: 'ACTIVE_ENFORCED',
    },
    {
      id: 'pol-02',
      name: 'Radius Batas Wilayah Dinas (Jabodetabek Geofence)',
      description: 'Kendaraan dilarang keluar dari radius Jabodetabek (Tol Cikampek KM 72 / Tol Merak KM 35 / Tol Jagorawi Ciawi) tanpa Surat Perintah Perjalanan Dinas (SPPD).',
      threshold: 'Jabodetabek Border Limit',
      enforcement: 'GEOFENCE_BREACH_ALERT',
      status: 'ACTIVE_ENFORCED',
    },
    {
      id: 'pol-03',
      name: 'Batas Kecepatan Maksimum Tol & Jalan Arteri',
      description: 'Maksimum kecepatan mobil dinas adalah 100 km/jam di jalan tol dan 60 km/jam di jalan perkotaan.',
      threshold: 'Max 100 km/jam',
      enforcement: 'SPEED_BUZZER_SMS',
      status: 'ACTIVE_ENFORCED',
    },
    {
      id: 'pol-04',
      name: 'Larangan Parkir Inap Tanpa Izin (Unauthorized Overnight)',
      description: 'Mobil pool wajib dikembalikan ke basement parkir Head Office setiap sore sebelum pukul 21:00 WIB kecuali ada penugasan luar kota.',
      threshold: 'Max Parkir Luar 21:00 WIB',
      enforcement: 'OVERNIGHT_FLAG',
      status: 'ACTIVE_ENFORCED',
    }
  ];

  const recentIncidents = [
    {
      id: 'inc-01',
      plate: 'B 2990 TZQ (Toyota Avanza)',
      driver: 'Agus Sunarto (Driver)',
      violationType: 'AFTER_HOURS_MOVEMENT',
      time: '2026-08-19 21:45 WIB',
      location: 'Rest Area Cibubur KM 10',
      status: 'RESOLVED_JUSTIFIED',
      note: 'Driver mengantar tim marketing lembur event pameran (Surat lembur GA valid).',
    },
    {
      id: 'inc-02',
      plate: 'B 2145 SHP (Innova Zenix)',
      driver: 'Reza Pratama (IT Staff)',
      violationType: 'SPEEDING_TOL_115KMH',
      time: '2026-08-18 14:12 WIB',
      location: 'Tol Jakarta - Cikampek KM 28',
      status: 'WARNING_ISSUED',
      note: 'Peringatan tertulis pertama ke pengemudi via portal employee.',
    }
  ];

  return (
    <div id="corp-policy-compliance-tab" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs text-blue-400 font-mono font-bold uppercase tracking-wider">
            CORPORATE CAR POLICY & GEOFENCE COMPLIANCE
          </span>
          <h3 className="text-lg font-bold text-white mt-1">
            Penegakan Kebijakan Kendaraan Perusahaan, Jam Malam & Geofence
          </h3>
          <p className="text-xs text-slate-400">
            Monitoring pelanggaran penggunaan kendaraan dinas di luar jam kantor (*After-Hours Usage*), perjalanan luar kota tanpa SPPD, dan batas kecepatan.
          </p>
        </div>

        <button
          onClick={() => alert('Konfigurasi Parameter Aturan & Kebijakan Mobil Dinas')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow"
        >
          <Sliders className="w-4 h-4" /> Atur Kebijakan Car Policy
        </button>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {policyRules.map(rule => (
          <div key={rule.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-blue-600" /> {rule.name}
              </h4>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                {rule.status}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{rule.description}</p>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
              <span className="text-slate-500">Batas Toleransi: <strong className="text-slate-800 font-mono">{rule.threshold}</strong></span>
              <span className="text-blue-700 font-mono font-semibold">{rule.enforcement}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Incidents Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm space-y-3 p-5">
        <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <FileWarning className="w-4 h-4 text-amber-500" /> Catatan Insiden & Pelanggaran Kebijakan Terbaru
        </h4>

        <div className="divide-y divide-slate-100">
          {recentIncidents.map(inc => (
            <div key={inc.id} className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 font-mono">{inc.plate}</span>
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">
                    {inc.violationType.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-slate-600">Pengemudi: <strong className="text-slate-800">{inc.driver}</strong></p>
                <div className="text-slate-500 flex items-center gap-2">
                  <span>Waktu: <strong className="font-mono">{inc.time}</strong></span> •
                  <span>Lokasi: {inc.location}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100 text-slate-700 mt-1">
                  Catatan GA: {inc.note}
                </div>
              </div>

              <div>
                <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                  inc.status === 'RESOLVED_JUSTIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {inc.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
