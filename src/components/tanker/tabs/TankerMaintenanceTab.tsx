import React, { useState } from 'react';
import {
  Wrench,
  FileCheck,
  ShieldAlert,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Plus
} from 'lucide-react';
import { MOCK_TANKER_FLEETS } from '../../../modules/tanker/services/tankerMockData';

export const TankerMaintenanceTab: React.FC = () => {
  const [fleets] = useState(MOCK_TANKER_FLEETS);

  return (
    <div id="tanker-maintenance-tab" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-amber-400" />
            <span>Perawatan Tangki, Uji Hidrostatis & Tera Metrologi Legal</span>
          </h2>
          <p className="text-xs text-slate-400">
            Jadwal kalibrasi bejana ukur metrologi legalitas (Tanda Tera T2/T3), uji ketebalan pelat tabung (NDT), dan servis katup darurat pneumatik.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold font-mono">
            SERTIFIKASI METROLOGI AKTIF
          </span>
        </div>
      </div>

      {/* Compliance Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
          <FileCheck className="w-4 h-4 text-emerald-400" />
          <span>Matriks Kalender Kepatuhan Hukum & Uji Teknis Tangki</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/50">
                <th className="py-2.5 px-3">Nomor Lambung</th>
                <th className="py-2.5 px-3">Plat Polisi</th>
                <th className="py-2.5 px-3">Tera Metrologi (T2)</th>
                <th className="py-2.5 px-3">Uji Hidrostatis Tabung</th>
                <th className="py-2.5 px-3">Uji KIR Dishub</th>
                <th className="py-2.5 px-3">Izin B3 KLHK</th>
                <th className="py-2.5 px-3">Status Kelaikan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {fleets.map((tank) => (
                <tr key={tank.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-bold text-slate-100">{tank.hullNumber}</td>
                  <td className="py-3 px-3 font-mono text-amber-400">{tank.plateNumber}</td>
                  <td className="py-3 px-3 font-mono">{tank.teraMetrologiExpiry}</td>
                  <td className="py-3 px-3 font-mono">{tank.hydrotestExpiry}</td>
                  <td className="py-3 px-3 font-mono">{tank.kirExpiry}</td>
                  <td className="py-3 px-3 font-mono">{tank.b3LicenseExpiry}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold inline-flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>LAIK JALAN</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
