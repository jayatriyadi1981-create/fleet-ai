import React, { useState } from 'react';
import {
  ShieldCheck,
  User,
  Award,
  HeartPulse,
  AlertTriangle,
  Clock,
  Search,
  Phone,
  FileCheck,
  CheckCircle2
} from 'lucide-react';
import { miningService } from '../../../modules/mining/services/miningService';
import { MiningOperatorProfile } from '../../../modules/mining/types';

export const MiningOperatorsTab: React.FC = () => {
  const [operators, setOperators] = useState<MiningOperatorProfile[]>(miningService.getOperators());
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOperators = operators.filter(op => 
    op.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    op.badgeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    op.kimperNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (op.assignedEquipmentCode && op.assignedEquipmentCode.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6" id="mining-operators-container">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl font-bold text-slate-900">Manajemen Operator Tambang & KIMPER (Mining Drivers)</h1>
          </div>
          <p className="text-xs text-slate-500">
            Sertifikasi SIO Kelas 1 ESDM/Kemenaker, Kartu Izin Mengemudi Perusahaan (KIMPER), rekam jejak jam terbang, dan monitoring skor fatigue DSS.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold font-mono">
            {operators.length} Operator Terdaftar
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari nama operator, nomor Badge ID, nomor KIMPER, atau unit alat berat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Operators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredOperators.map(op => (
          <div key={op.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
            <div>
              {/* Header Profile */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 font-bold text-base flex items-center justify-center border border-slate-800 shadow-sm">
                    {op.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">{op.name}</h2>
                    <div className="text-xs text-slate-500 font-mono">
                      Badge: <strong>{op.badgeNumber}</strong> | NIK: {op.nik}
                    </div>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  op.status === 'ACTIVE_WORKING' ? 'bg-emerald-100 text-emerald-800' :
                  op.status === 'ON_BREAK' ? 'bg-blue-100 text-blue-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {op.status.replace('_', ' ')}
                </span>
              </div>

              {/* SIO & KIMPER Cards */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Sertifikasi SIO:</span>
                  <strong className="text-slate-900 block truncate">{op.certificationType}</strong>
                  <span className="text-[10px] text-slate-500 font-mono">{op.certificationNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Nomor KIMPER:</span>
                  <strong className="text-slate-900 font-mono block">{op.kimperNumber}</strong>
                  <span className="text-[10px] text-emerald-600 font-semibold">Berlaku s/d: {op.kimperExpiryDate}</span>
                </div>
              </div>

              {/* Fatigue & Safety Scores */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Fatigue Score</span>
                  <div className={`text-base font-extrabold mt-0.5 ${
                    op.fatigueScore < 30 ? 'text-emerald-600' :
                    op.fatigueScore < 60 ? 'text-amber-600' : 'text-rose-600'
                  }`}>
                    {op.fatigueScore} / 100
                  </div>
                  <span className="text-[9px] text-slate-400">
                    {op.fatigueScore < 30 ? 'Kondisi Bugar' : 'Perlu Pantau'}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Safety Score</span>
                  <div className="text-base font-extrabold text-blue-600 mt-0.5">
                    {op.safetyScore}%
                  </div>
                  <span className="text-[9px] text-slate-400">Kepatuhan K3</span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">DSS Camera</span>
                  <div className={`text-base font-extrabold mt-0.5 ${
                    op.dssAlertsTodayCount === 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {op.dssAlertsTodayCount} Alerts
                  </div>
                  <span className="text-[9px] text-slate-400">Micro-sleep/Distraksi</span>
                </div>
              </div>

              {/* Operating Stats & Medical Check */}
              <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Unit Ditugaskan:</span>
                  <strong className="text-slate-900 font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                    {op.assignedEquipmentCode || 'Standby'}
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Pengalaman & Jam Terbang:</span>
                  <strong className="text-slate-800">{op.experienceYears} Tahun ({op.totalOperatingHoursHM.toLocaleString()} HM Total)</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Pemeriksaan Tensi Pagi:</span>
                  <strong className="text-slate-800 font-mono">{op.bloodPressureMorning}</strong>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3 -mx-6 -mb-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" /> {op.phone}
              </span>
              <span className="font-semibold text-slate-700">Skill Level: {op.skillLevel}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
