import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Users, 
  HardHat, 
  Calendar, 
  Clock, 
  AlertOctagon 
} from 'lucide-react';
import { HeavyOperatorProfile, HeavyEquipmentAsset } from '../../../modules/heavy-equipment/types';

interface Props {
  operators: HeavyOperatorProfile[];
  equipments: HeavyEquipmentAsset[];
}

export const HeavySafetySioTab: React.FC<Props> = ({ operators, equipments }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-500" />
          K3 Pertambangan / Konstruksi, Lisensi SIO Operator & Sertifikasi SILO
        </h3>
        <p className="text-xs text-slate-500">
          Tracking masa berlaku Surat Izin Operator (SIO Kelas 1/2/3 Kemenaker), Surat Izin Layak Operasi (SILO) Alat Berat, dan Safety KPI.
        </p>
      </div>

      {/* Safety Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: SIO Operator License Monitoring */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <HardHat className="w-4 h-4 text-blue-500" />
              Status Masa Berlaku SIO Operator ({operators.length})
            </h4>
            <span className="text-xs text-slate-500 font-mono">Regulasi Kemenaker RI</span>
          </div>

          <div className="space-y-3">
            {operators.map((op) => (
              <div 
                key={op.id}
                className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">{op.name}</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    op.sioStatus === 'VALID'
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                      : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 animate-pulse'
                  }`}>
                    {op.sioStatus === 'VALID' ? 'SIO AKTIF' : 'HABIS 25 HARI'}
                  </span>
                </div>
                <div className="text-slate-500 text-[11px] font-mono">
                  No. SIO: {op.sioLicenseNumber} ({op.sioClass.replace('_', ' ')})
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-700/40">
                  <span>Alat: <strong className="font-mono text-amber-600">{op.assignedEquipmentCode || '-'}</strong></span>
                  <span>Expired: <strong>{op.sioExpiryDate}</strong></span>
                  <span className="font-bold text-emerald-600">Safety: {op.safetyScore}/100</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: SILO Equipment Certification Monitoring */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" />
              Sertifikasi Kelayakan Alat (SILO Disnaker)
            </h4>
            <span className="text-xs text-slate-500 font-mono">Uji Riksa Berkala</span>
          </div>

          <div className="space-y-3">
            {equipments.map((eq) => (
              <div 
                key={eq.id}
                className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{eq.code}</span>
                    <span className="text-slate-700 dark:text-slate-300 font-bold">{eq.name}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold text-[10px]">
                    SILO VALID
                  </span>
                </div>
                <div className="text-slate-500 text-[11px] font-mono">
                  Sertifikat: {eq.siloCertificateNumber}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-700/40">
                  <span>Site: {eq.currentSiteName.split('(')[0]}</span>
                  <span>Masa Berlaku s/d: <strong className="text-slate-800 dark:text-slate-200">{eq.siloExpiryDate}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
