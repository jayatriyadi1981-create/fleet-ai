import React, { useState } from 'react';
import {
  Wrench,
  Droplets,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Search,
  Plus
} from 'lucide-react';

export const WasteMaintenanceTab: React.FC = () => {
  return (
    <div id="waste-maintenance-tab" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-emerald-400" />
            <span>Perawatan Hidrolik, Pompa Vacuum & Disinfeksi Armada (Waste Fleet Maintenance)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Jadwal pemeliharaan silinder hidrolik compactor PTO, pompa vacuum sedot tinja, penggantian oli hidrolik, dan pencucian disinfeksi armada (Washing Bay).
          </p>
        </div>

        <button
          onClick={() => alert('Jadwal Servis Hidrolik & Cuci Armada Baru Berhasil Dibuat!')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Jadwalkan Servis / Cuci</span>
        </button>
      </div>

      {/* Maintenance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Disinfeksi & Cuci Bak (Washing Bay)</h3>
              <span className="text-xs text-emerald-400 font-bold">Pencucian Bersuhu Tinggi 80°C</span>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            Setiap kepulangan dari TPA/TPST, truk compactor dan arm roll wajib masuk ke Washing Bay untuk pembersihan kerak sampah, penyemprotan enzim peredam bau, dan pengurasan bak lindi.
          </p>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
            <span className="font-bold text-emerald-400 block font-mono">Status: 5/5 Truk Selesai Disinfeksi</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-xl">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Sistem Hidrolik & Silinder Compactor</h3>
              <span className="text-xs text-sky-400 font-bold">Tekanan Optimal 210 Bar</span>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            Inspeksi rutin seal hidrolik pendorong plat press, selang high-pressure hose, pompa PTO transmisi, dan pemeriksaan kebocoran fluida oli hidrolik ISO VG 46/68.
          </p>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
            <span className="font-bold text-sky-400 block font-mono">Status: Semua Silinder Hidrolik Normal</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Uji KIR & Kelaikan Jalan Dishub</h3>
              <span className="text-xs text-amber-400 font-bold">Sertifikasi Berkala Valid</span>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            Monitoring masa berlaku uji KIR Dishub, rem udara pneumatik, ketebalan ban, lampu isyarat rotator kuning, dan tanda bahaya pemantul cahaya 3M.
          </p>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
            <span className="font-bold text-amber-400 block font-mono">Peringatan: 0 Unit Mendekati Jatuh Tempo</span>
          </div>
        </div>
      </div>
    </div>
  );
};
