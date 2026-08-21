import React, { useState } from 'react';
import {
  Sparkles,
  Droplets,
  CheckCircle,
  AlertTriangle,
  FileCheck,
  Wind,
  Plus,
  Search
} from 'lucide-react';
import { MOCK_CLEANING_LOGS } from '../../../modules/tanker/services/tankerMockData';
import { TankerCleaningLog } from '../../../modules/tanker/types';

export const TankerCleaningTab: React.FC = () => {
  const [logs] = useState<TankerCleaningLog[]>(MOCK_CLEANING_LOGS);

  return (
    <div id="tanker-cleaning-tab" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Pencucian Tangki (Tank Cleaning, Degassing & Vapor Recovery)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Fasilitas pencucian uap panas (Steam Wash), Caustic Wash, degassing gas berbahaya, dan penerbitan Clean Tank Certificate (Mencegah Kontaminasi Silang).
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
            CIP BAY #1 & #2 ONLINE
          </span>
        </div>
      </div>

      {/* Cargo Compatibility Guide Matrix Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
          <Droplets className="w-4 h-4 text-amber-400" />
          <span>Matriks Kompatibilitas Pergantian Muatan (Previous Cargo Matrix)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/50">
                <th className="py-2.5 px-3">Muatan Sebelumnya (Previous)</th>
                <th className="py-2.5 px-3">Muatan Baru yang Direncanakan</th>
                <th className="py-2.5 px-3">SOP Pencucian Wajib</th>
                <th className="py-2.5 px-3">Batas Gas VOC (PPM)</th>
                <th className="py-2.5 px-3">Status Izin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-3 px-3 font-semibold text-rose-300">Biosolar B35 / B40</td>
                <td className="py-3 px-3 font-semibold text-emerald-300">Pertalite / Pertamax</td>
                <td className="py-3 px-3 text-slate-400">Steam Degassing + Hot Water Flush 85°C</td>
                <td className="py-3 px-3 font-mono text-emerald-400">0 PPM</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                    DISETUJUI
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-amber-300">CPO (Crude Palm Oil)</td>
                <td className="py-3 px-3 font-semibold text-emerald-300">Minyak Goreng (RPO / Olein)</td>
                <td className="py-3 px-3 text-slate-400">Food Grade Caustic 2% + Steam Wash + N2 Purge</td>
                <td className="py-3 px-3 font-mono text-emerald-400">0 PPM</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                    DISETUJUI
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-rose-300">Chemical B3 (H2SO4)</td>
                <td className="py-3 px-3 font-semibold text-rose-400">Food Grade / Minyak Goreng</td>
                <td className="py-3 px-3 text-slate-400">DILARANG KERAS (Cross Contamination Ban)</td>
                <td className="py-3 px-3 font-mono text-rose-400">-</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-bold">
                    DILARANG
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Cleaning History Logs */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
          <FileCheck className="w-4 h-4 text-emerald-400" />
          <span>Riwayat Sertifikat Pencucian Tangki (Clean Tank Certificates)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {logs.map((log) => (
            <div
              key={log.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 hover:border-amber-500/30 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono font-bold border border-amber-500/20">
                    {log.cleanCertificateNumber}
                  </span>
                  <h4 className="text-base font-bold text-slate-100 mt-1">{log.tankerHull}</h4>
                  <span className="text-xs text-slate-400">{log.cleaningBay}</span>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center space-x-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>CLEAN CERTIFIED</span>
                </span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Muatan Sebelumnya:</span>
                  <span className="text-slate-200 font-semibold">{log.previousCargo.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Muatan Berikutnya:</span>
                  <span className="text-emerald-400 font-bold">{log.nextCargoPlanned.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Metode Pencucian:</span>
                  <span className="text-slate-200">{log.cleaningMethod.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-900">
                  <span className="text-slate-400">Kadar Gas Sisa (VOC):</span>
                  <span className="text-emerald-400 font-bold font-mono">{log.gasFreeMeterPpm} PPM (Gas-Free Safe)</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Inspektur QC: <strong className="text-slate-200">{log.inspectorName}</strong></span>
                <span className="font-mono">{log.cleaningDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
