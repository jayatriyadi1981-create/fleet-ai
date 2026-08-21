import React from 'react';
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Calendar,
  Layers,
  FileSpreadsheet
} from 'lucide-react';

export const DtmsMaintenanceTab: React.FC = () => {
  return (
    <div id="dtms-maintenance-tab" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-amber-500" />
            <span>Perawatan & Service Berkala Dump Truck (PM & P2H)</span>
          </h2>
          <p className="text-xs text-slate-400">Jadwal PM Service 250, 500, 1000, 2000 Jam, kesehatan suspensi strut gas/oil, dan checklist P2H harian</p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Physical Availability (PA):</span>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">92.5% Ready</span>
        </div>
      </div>

      {/* Maintenance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">PM 500 Jam</span>
            <span className="text-xs text-slate-400">DT-102 (Komatsu HD785)</span>
          </div>
          <div className="text-sm font-semibold text-slate-200">Ganti Filter Oli Mesin, Fuel Filter & Greasing Suspensi</div>
          <div className="text-xs text-slate-400">HM Saat Ini: 4.980 Jam | Sisa HM ke Servis: 20 Jam</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '96%' }} />
          </div>
          <div className="text-xs text-amber-400 font-medium">Jadwal Servis: Besok Pagi 08:00 WIB (Bay 2)</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">Unscheduled BD</span>
            <span className="text-xs text-slate-400">DT-402 (Hino FM260JD)</span>
          </div>
          <div className="text-sm font-semibold text-slate-200">Kebocoran Silinder Hidrolik Hoist (Seal Kit Leak)</div>
          <div className="text-xs text-slate-400">Mulai Perbaikan: 08:30 WIB | Estimasi Selesai: 11:30 WIB</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-rose-500 h-full rounded-full" style={{ width: '60%' }} />
          </div>
          <div className="text-xs text-rose-400 font-medium">Progress Mekanik: 60% (Penggantian Seal Kit)</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">P2H Harian Digital</span>
            <span className="text-xs text-slate-400">Shift 1 Siang</span>
          </div>
          <div className="text-sm font-semibold text-slate-200">Kepatuhan Checklist Pra-Operasi Driver</div>
          <div className="text-xs text-slate-400">102 / 102 Driver telah submit form P2H via Mobile App</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }} />
          </div>
          <div className="text-xs text-emerald-400 font-medium">100% Lulus Verifikasi Kelayakan Teknis</div>
        </div>
      </div>
    </div>
  );
};
