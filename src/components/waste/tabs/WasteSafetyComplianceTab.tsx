import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  Droplets,
  HardHat,
  Eye,
  CheckCircle2,
  Activity
} from 'lucide-react';

export const WasteSafetyComplianceTab: React.FC = () => {
  return (
    <div id="waste-safety-compliance-tab" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Kepatuhan K3 Lingkungan, APD Kru & Spill Kit Tanggap Darurat</span>
          </h2>
          <p className="text-xs text-slate-400">
            Standar kepatuhan keselamatan kerja (K3), inspeksi APD loader, pencegahan tetesan air lindi (leachate spill prevention), dan perlengkapan tanggap darurat B3.
          </p>
        </div>

        <button
          onClick={() => alert('Inspeksi Pra-Operasional APD Kru Berhasil Diverifikasi!')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg transition-all shrink-0"
        >
          <HardHat className="w-4 h-4" />
          <span>Audit APD Kru Harian</span>
        </button>
      </div>

      {/* Safety Compliance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Pencegahan Air Lindi (Leachate)</h3>
              <span className="text-xs text-emerald-400 font-bold">100% Bebas Ceceran di Jalan</span>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            Semua truk compactor dilengkapi bak penampung lindi stainless steel ganda dengan katup pengunci bertekanan pneumatik. Dilarang membuka katup selama perjalanan.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-xl">
              <HardHat className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Kepatuhan APD Petugas / Loader</h3>
              <span className="text-xs text-sky-400 font-bold">100% Sesuai Standar K3 DLH</span>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            Kru wajib menggunakan helm safety pelindung benturan, sarung tangan anti-tusuk, sepatu boots sol baja (steel toe), dan masker respirator anti-debu & bau.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Spill Kit & APAR Pemadam</h3>
              <span className="text-xs text-amber-400 font-bold">Siaga 24/7 di Tiap Kabin</span>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            Tersedia serbuk absorben pasir/serbuk gergaji penyerap cairan kimia, klorin disinfektan, sekop non-sparking, dan APAR Dry Chemical Powder 6 Kg.
          </p>
        </div>
      </div>
    </div>
  );
};
