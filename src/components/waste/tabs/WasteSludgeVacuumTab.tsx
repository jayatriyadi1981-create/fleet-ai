import React, { useState } from 'react';
import {
  Droplets,
  Activity,
  MapPin,
  CheckCircle,
  Truck,
  Building,
  Calendar,
  AlertTriangle,
  FileCheck2,
  ShieldCheck
} from 'lucide-react';

export const WasteSludgeVacuumTab: React.FC = () => {
  return (
    <div id="waste-sludge-vacuum-tab" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <Droplets className="w-5 h-5 text-sky-400" />
            <span>Armada Vacuum, Truk Sedot Tinja & Lumpur IPAL (Septic & Sludge Management)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Pengelolaan order sedot lumpur tinja (LLTT), pemantauan kapasitas tangki vacuum, flowmeter debit, dan pengawasan pembuangan resmi ke IPLT (Instalasi Pengolahan Lumpur Tinja).
          </p>
        </div>

        <button
          onClick={() => alert('Order Sedot Tinja / IPAL Baru Berhasil Dibuat!')}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg transition-all shrink-0"
        >
          <span>Buat Order Sedot Tinja / IPAL</span>
        </button>
      </div>

      {/* Grid of Sludge & Vacuum Trucks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-mono font-bold border border-sky-500/20">
                TRUK VACUUM SEDOT TINJA DOMESTIK
              </span>
              <h3 className="text-base font-bold text-slate-100 mt-1">VAC-SLUDGE-401 (B 9552 TJA)</h3>
              <span className="text-xs text-slate-400">Supir: Bambang Irawan | Tangki 5.000 Liter</span>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
              OPERASIONAL AKTIF
            </span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Level Isi Tangki Vacuum:</span>
              <span className="font-bold text-sky-400 font-mono">4.800 / 5.000 Liter (96%)</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-sky-500 rounded-full" style={{ width: '96%' }} />
            </div>
            <div className="flex justify-between pt-1 text-[11px]">
              <span className="text-slate-500">Tekanan Pompa Vacuum PTO:</span>
              <span className="font-bold text-emerald-400 font-mono">-0.85 Bar (Optimal)</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
            <div className="flex items-start space-x-2">
              <MapPin className="w-3.5 h-3.5 text-sky-400 mt-0.5 shrink-0" />
              <span className="text-slate-300">Menuju IPLT Duri Kosambi (Pembuangan Resmi)</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-900">
              <span className="text-slate-400">Geofence IPLT Anti-Dumping:</span>
              <span className="font-bold text-emerald-400 font-mono">TERKUNCI KE IPLT RESMI</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono font-bold border border-amber-500/20">
                SLUDGE IPAL PABRIK B3 (INDUSTRI)
              </span>
              <h3 className="text-base font-bold text-slate-100 mt-1">HOOK-IND-502 (B 9044 BGA)</h3>
              <span className="text-xs text-slate-400">Supir: Mulyadi Pratama | Bak Kedap 15 m³</span>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/30">
              ANTRIAN TIMBANG TPA
            </span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Berat Muatan Sludge IPAL:</span>
              <span className="font-bold text-amber-400 font-mono">8.9 Ton (Lumpur IPAL B351-1)</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '89%' }} />
            </div>
            <div className="flex justify-between pt-1 text-[11px]">
              <span className="text-slate-500">Tutup Terpal Kedap & Kunci Hidrolik:</span>
              <span className="font-bold text-emerald-400 font-mono">TERTUTUP SEMPURNA</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
            <div className="flex items-start space-x-2">
              <MapPin className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
              <span className="text-slate-300">TPA / Pemanfaat: PT Wastec International</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-900">
              <span className="text-slate-400">Nomor Manifest Festronik:</span>
              <span className="font-bold text-amber-300 font-mono">FES-KLHK-2026-IND-4421</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
