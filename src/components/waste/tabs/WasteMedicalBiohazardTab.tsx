import React, { useState } from 'react';
import {
  ThermometerSnowflake,
  ShieldAlert,
  Activity,
  FileCheck,
  Building2,
  Lock,
  Truck,
  CheckCircle,
  AlertTriangle,
  QrCode
} from 'lucide-react';

export const WasteMedicalBiohazardTab: React.FC = () => {
  return (
    <div id="waste-medical-biohazard-tab" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <ThermometerSnowflake className="w-5 h-5 text-sky-400" />
            <span>Limbah Medis, Biohazard & Cold Chain Transport (Permen LHK No. P.56/2015)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Standar operasional ketat pengangkutan limbah infeksius rumah sakit: pendingin cold box &lt;4°C, segel biohazard, disinfeksi armada, dan manifest Festronik A337-1.
          </p>
        </div>

        <button
          onClick={() => alert('Checklist Dekontaminasi & Disinfeksi Cold Box berhasil diverifikasi!')}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg transition-all shrink-0"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Audit Kepatuhan Biohazard</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Suhu Rata-rata Cold Box Truk</span>
          <div className="text-2xl font-black text-sky-400 font-mono mt-1">
            +3.2°C <span className="text-xs text-emerald-400 font-normal">(Standar Aman &lt; 4°C)</span>
          </div>
          <span className="text-[11px] text-slate-500">Penyimpanan &gt;24 Jam Wajib Refrigerated</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Faskes / Rumah Sakit Terlayani</span>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            18 RS <span className="text-xs text-slate-400 font-normal">/ Hari Ini</span>
          </div>
          <span className="text-[11px] text-slate-500">RSCM, RS Fatmawati, RSPI Sulianti Saroso, dll.</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Status Dekontaminasi & Disinfeksi</span>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">100% STERIL</div>
          <span className="text-[11px] text-slate-500">Penyemprotan Klorin / Disinfektan Tiap Siklus</span>
        </div>
      </div>

      {/* Protocol Matrix */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <span>Matriks Protokol Pengangkutan Limbah Medis & Sitotoksik</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-amber-400 block font-mono">1. Pengemasan Simbol Biohazard & Safety Box</span>
            <p className="text-slate-300">
              Limbah benda tajam (jarum suntik/bisturi) wajib menggunakan Safety Box anti-tembus dan anti-bocor. Kantong plastik kuning dengan simbol biohazard terstandar KLHK.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-sky-400 block font-mono">2. Telemetri Suhu Cold Box Real-Time</span>
            <p className="text-slate-300">
              Sensor suhu IoT mencatat log suhu setiap 1 menit. Jika suhu kabin melebihi 5°C, alarm otomatis dikirim ke Command Center dan pengemudi.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-emerald-400 block font-mono">3. Jalur Langsung Menuju Insinerator / Autoclave Berizin</span>
            <p className="text-slate-300">
              Truk limbah medis dilarang berhenti sembarangan (Geofence transit corridor). Muatan diantar langsung ke fasilitas insinerator suhu tinggi 1200°C PT PPLI / Wastec.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-purple-400 block font-mono">4. Pelindung Diri Kru & Spill Kit Biohazard</span>
            <p className="text-slate-300">
              Kru dilengkapi Hazmat suit level B3/C, sarung tangan nitril tebal, kacamata goggle, respirator N95/FFP3, serta spill kit absorben klorin dalam kabin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
