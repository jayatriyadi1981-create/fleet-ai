import React from 'react';
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Calendar,
  Layers,
  Car
} from 'lucide-react';

export const TaxiMaintenanceTab: React.FC = () => {
  return (
    <div id="taxi-maintenance-tab" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-amber-500" />
            <span>Perawatan Armada Taksi, Bengkel Pool & Sertifikasi Uji KIR/Tera</span>
          </h2>
          <p className="text-xs text-slate-400">Jadwal servis berkala 10.000 KM, tune-up mesin, penggantian oli, kampas rem, dan masa berlaku legalitas izin operasi</p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Kesiapan Armada (Ready Rate):</span>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
            96.8% Operasional
          </span>
        </div>
      </div>

      {/* Maintenance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">Servis 10.000 KM</span>
            <span className="text-xs text-slate-400">TX-101 (Transmover)</span>
          </div>
          <div className="text-sm font-semibold text-slate-200">Ganti Oli Mesin Full Sintetik 0W-20 & Filter Oli</div>
          <div className="text-xs text-slate-400">Odo: 64.230 KM | Sisa KM ke Servis: 770 KM</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '92%' }} />
          </div>
          <div className="text-xs text-amber-400 font-medium">Jadwal: 3 Hari Lagi di Bengkel Pool Kemayoran</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">Perbaikan Bengkel</span>
            <span className="text-xs text-slate-400">TX-105 (Transmover)</span>
          </div>
          <div className="text-sm font-semibold text-slate-200">Penggantian Set Kopling (Clutch Disc & Cover)</div>
          <div className="text-xs text-slate-400">Mulai: Hari ini 09:00 WIB | Estimasi: 16:30 WIB</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-rose-500 h-full rounded-full" style={{ width: '70%' }} />
          </div>
          <div className="text-xs text-rose-400 font-medium">Progress Mekanik: 70% (Finishing Alignment)</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">Kalibrasi Tera Argo</span>
            <span className="text-xs text-slate-400">Uji Metrologi Dishub</span>
          </div>
          <div className="text-sm font-semibold text-slate-200">Pemeriksaan Akurasi Pulsa Jarak & Penyegelan Kawat</div>
          <div className="text-xs text-slate-400">Sertifikat Tera Metrologi Aktif s/d 2027</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-cyan-500 h-full rounded-full" style={{ width: '100%' }} />
          </div>
          <div className="text-xs text-emerald-400 font-medium">100% Lulus Uji Standar Metrologi Legal</div>
        </div>
      </div>
    </div>
  );
};
