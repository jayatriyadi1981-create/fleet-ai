import React, { useState } from 'react';
import {
  Wrench,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  Search,
  FileCheck,
  Zap,
  RotateCw
} from 'lucide-react';

export const SecuricorArmorMaintenanceTab: React.FC = () => {
  const maintenanceJobs = [
    {
      id: 'maint-01',
      hullNumber: 'ARMOR-CIT-01',
      plate: 'B 9110 SEC',
      taskType: 'BALLISTIC_GLASS_INSPECTION',
      description: 'Pemeriksaan delaminasi kaca balistik 39mm & uji ketahanan tembak kaca depan.',
      technician: 'Bengkel Khusus Lapis Baja Cilandak',
      scheduledDate: '2026-08-25',
      status: 'SCHEDULED',
      priority: 'MEDIUM',
    },
    {
      id: 'maint-02',
      hullNumber: 'ARMOR-CIT-02',
      plate: 'B 9245 SEC',
      taskType: 'RUNFLAT_TYRE_REPLACEMENT',
      description: 'Penggantian 4 pcs Hutchinson Run-Flat Ring & balancing velg beban 6 ton.',
      technician: 'PT Pindad Enjiniring Indonesia',
      scheduledDate: '2026-08-22',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
    },
    {
      id: 'maint-03',
      hullNumber: 'ARMOR-CIT-03',
      plate: 'B 9388 SEC',
      taskType: 'SOLENOID_INTERLOCK_SERVICE',
      description: 'Kalibrasi solenoid kunci pintu airlock & penggantian relay darurat brankas.',
      technician: 'Tim Elektronik Khusus Securicor',
      scheduledDate: '2026-08-20',
      status: 'COMPLETED',
      priority: 'LOW',
    }
  ];

  return (
    <div id="securicor-armor-maintenance-tab" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs text-amber-400 font-mono font-bold uppercase tracking-wider">BALLISTIC ARMORING & SECURITY HARDWARE MAINTENANCE</span>
          <h3 className="text-lg font-bold text-white mt-1">Pemeliharaan Proteksi Balistik, Kaca Anti-Peluru & Kunci Solenoid</h3>
          <p className="text-xs text-slate-400">Inspeksi komprehensif ketebalan baja armor plate, ban run-flat ring Hutchinson, solenoid pintu brankas, dan drop chute.</p>
        </div>

        <button
          onClick={() => alert('Jadwalkan Servis Rutin Kendaraan Lapis Baja')}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" /> Buat Work Order Servis Armor
        </button>
      </div>

      {/* Maintenance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {maintenanceJobs.map(job => (
          <div key={job.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-xs">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm font-mono">{job.hullNumber}</h4>
                  <p className="text-[11px] text-slate-500 font-mono">{job.plate}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                job.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                job.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800 animate-pulse' :
                'bg-amber-100 text-amber-800'
              }`}>
                {job.status}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Kategori Pekerjaan:</span>
                <span className="font-bold text-slate-800">{job.taskType.replace(/_/g, ' ')}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-700">
                {job.description}
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bengkel Pelaksana:</span>
                <span className="font-semibold text-slate-900 text-right">{job.technician}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tanggal Target Servis:</span>
                <span className="font-mono text-slate-800">{job.scheduledDate}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => alert(`Lembar Hasil Uji Balistik & Checklist Servis untuk ${job.hullNumber}`)}
                className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 shadow"
              >
                <FileCheck className="w-3.5 h-3.5" /> Hasil Inspeksi Balistik
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
