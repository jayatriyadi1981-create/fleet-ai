import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  HeartPulse,
  CheckCircle2,
  FileCheck,
  Phone,
  Flame,
  Camera,
  Users,
  Search,
  Eye
} from 'lucide-react';
import { miningService } from '../../../modules/mining/services/miningService';
import { MiningSafetyIncident } from '../../../modules/mining/types';

export const MiningSafetySmkpTab: React.FC = () => {
  const [incidents, setIncidents] = useState<MiningSafetyIncident[]>(miningService.getSafetyIncidents());
  const operators = miningService.getOperators();

  return (
    <div className="space-y-6" id="mining-safety-smkp-container">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl font-bold text-slate-900">K3 Pertambangan (SMKP ESDM) & Driver Safety System (DSS)</h1>
          </div>
          <p className="text-xs text-slate-500">
            Sistem Manajemen Keselamatan Pertambangan (SMKP), investigasi insiden/near-miss, kepatuhan P2H pre-shift, dan radar deteksi kantuk (fatigue DSS AI).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20">
            <CheckCircle2 className="w-4 h-4" /> ZERO LTI (Hilang Hari Kerja: 0 Jam)
          </span>
        </div>
      </div>

      {/* Safety Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1">Manhours Kerja Selamat</div>
          <div className="text-2xl font-black text-slate-900">1,842,500 <span className="text-xs font-medium text-slate-500">Jam</span></div>
          <div className="text-xs text-emerald-600 font-bold mt-1">Tanpa Fatality / Kecelakaan Berat</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1">Kepatuhan P2H Harian</div>
          <div className="text-2xl font-black text-slate-900">100% <span className="text-xs font-medium text-emerald-600">Disiplin</span></div>
          <div className="text-xs text-slate-500 mt-1">Seluruh Unit Diinspeksi Sebelum Gerak</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1">Kamera Fatigue DSS Alert</div>
          <div className="text-2xl font-black text-slate-900">1 <span className="text-xs font-medium text-amber-500">Peringatan</span></div>
          <div className="text-xs text-slate-500 mt-1">Micro-sleep tertangani dengan istirahat</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1">Audit SMKP ESDM Compliance</div>
          <div className="text-2xl font-black text-slate-900">96.4% <span className="text-xs font-medium text-emerald-600">Grade A</span></div>
          <div className="text-xs text-slate-500 mt-1">Sesuai Permen ESDM No. 26/2018</div>
        </div>
      </div>

      {/* Operator Fatigue Radar Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-amber-500" />
              Live Radar Fatigue DSS & Tensi Operator (Shift Siang)
            </h2>
            <p className="text-xs text-slate-500">Sensor kamera AI dalam kabin mendeteksi frekuensi kedipan mata, kuap, & distraksi</p>
          </div>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            Kamera AI Aktif 100%
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {operators.map(op => (
            <div key={op.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-slate-900">{op.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                    op.fatigueScore < 30 ? 'bg-emerald-100 text-emerald-800' :
                    op.fatigueScore < 60 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {op.fatigueScore < 30 ? 'BUGAR' : 'WASPADA'}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <div>Unit: <strong className="text-slate-900 font-mono">{op.assignedEquipmentCode || 'Standby'}</strong></div>
                  <div>Jam Nyetir Hari Ini: <strong className="text-slate-900">{op.drivingHoursToday} Jam</strong></div>
                  <div>Tensi: <strong className="text-slate-800 font-mono">{op.bloodPressureMorning}</strong></div>
                  <div>DSS Alerts Hari Ini: <strong className={op.dssAlertsTodayCount > 0 ? 'text-amber-600' : 'text-emerald-600'}>{op.dssAlertsTodayCount} Alerts</strong></div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Safety Score:</span>
                <strong className="text-blue-600 font-bold">{op.safetyScore}%</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Incident & Near-Miss Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Laporan Investigasi Insiden & Near-Miss Tambang
          </h2>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {incidents.map(inc => (
            <div key={inc.id} className="p-5 hover:bg-slate-50/80 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {inc.incidentCode}
                  </span>
                  <span className="font-bold text-slate-800 text-sm">{inc.locationDetails}</span>
                  <span className="px-2 py-0.5 rounded-full font-bold uppercase text-[10px] bg-amber-100 text-amber-800">
                    {inc.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-500">{inc.date}</span>
                  <span className="px-2.5 py-0.5 rounded-full font-extrabold uppercase text-[10px] bg-emerald-100 text-emerald-800">
                    {inc.status}
                  </span>
                </div>
              </div>

              <p className="text-slate-700 text-xs mb-2 leading-relaxed">
                <strong>Deskripsi:</strong> {inc.description}
              </p>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-[11px] text-slate-600">
                <div><strong>Tindakan Langsung:</strong> {inc.immediateAction}</div>
                <div><strong>Akar Masalah (RCA):</strong> {inc.rootCauseAnalysis}</div>
                <div><strong>Investigator KTT:</strong> {inc.investigatorKtt}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
