import React, { useState } from 'react';
import {
  Wrench,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Car,
  FileCheck,
  Plus,
  Building,
  DollarSign
} from 'lucide-react';

export const CorpMaintenanceTab: React.FC = () => {
  const serviceJobs = [
    {
      id: 'srv-01',
      plate: 'B 2145 SHP',
      model: 'Toyota Innova Zenix',
      taskType: 'SERVIS_BERKALA_30000KM',
      workshop: 'Auto2000 Sudirman Jakarta',
      scheduledDate: '2026-08-25',
      estimatedCostIdr: 1850000,
      coveredByLease: true,
      description: 'Ganti oli mesin TMO Synthetic, filter oli, filter udara kabin, rotasi ban 4 roda.',
      status: 'SCHEDULED',
    },
    {
      id: 'srv-02',
      plate: 'B 1876 SZK',
      model: 'Hyundai Ioniq 5 (EV)',
      taskType: 'BATTERY_COOLANT_INSPECTION',
      workshop: 'Hyundai Simprug Authorized EV Center',
      scheduledDate: '2026-08-22',
      estimatedCostIdr: 850000,
      coveredByLease: false,
      description: 'Pemeriksaan State of Health (SOH) baterai traksi, update software BMS, inspeksi sistem pendingin baterai.',
      status: 'IN_PROGRESS',
    },
    {
      id: 'srv-03',
      plate: 'B 7088 SAA',
      model: 'Toyota HiAce Shuttle Bus',
      taskType: 'PENGGANTIAN_4_BAN_BARU',
      workshop: 'Bengkel Rekanan GA Kuningan',
      scheduledDate: '2026-08-20',
      estimatedCostIdr: 5600000,
      coveredByLease: false,
      description: 'Penggantian 4 pcs ban Bridgestone Duravis R624 195 R15C & spooring balancing.',
      status: 'COMPLETED',
    }
  ];

  return (
    <div id="corp-maintenance-tab" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs text-blue-400 font-mono font-bold uppercase tracking-wider">
            PREVENTIVE MAINTENANCE & AUTHORIZED WORKSHOP SERVICE
          </span>
          <h3 className="text-lg font-bold text-white mt-1">
            Jadwal Pemeliharaan Rutin, Bengkel Resmi & Penggantian Sparepart
          </h3>
          <p className="text-xs text-slate-400">
            Booking servis berkala 10.000 KM di dealer resmi (Auto2000, Hyundai, dsb), penggantian ban & aki, serta klaim free maintenance operating lease.
          </p>
        </div>

        <button
          onClick={() => alert('Buat Work Order Servis Kendaraan Kantor')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" /> Booking Jadwal Servis Bengkel
        </button>
      </div>

      {/* Maintenance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {serviceJobs.map(job => (
          <div key={job.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-blue-400 flex items-center justify-center font-bold text-xs">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm font-mono">{job.plate}</h4>
                  <p className="text-[11px] text-slate-500">{job.model}</p>
                </div>
              </div>

              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                job.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                job.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800 animate-pulse' :
                'bg-amber-100 text-amber-800'
              }`}>
                {job.status}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Jenis Pekerjaan:</span>
                <span className="font-bold text-slate-800">{job.taskType.replace(/_/g, ' ')}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-slate-700">
                {job.description}
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bengkel Pelaksana:</span>
                <span className="font-semibold text-slate-900">{job.workshop}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tanggal Target:</span>
                <span className="font-mono text-slate-800">{job.scheduledDate}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                <span className="text-slate-500">Biaya / Tanggungan:</span>
                <div className="text-right">
                  <span className="font-mono font-bold text-slate-900">Rp {job.estimatedCostIdr.toLocaleString('id-ID')}</span>
                  <p className="text-[10px] text-emerald-600 font-semibold">
                    {job.coveredByLease ? '✓ Ditanggung Vendor Lease' : '• Anggaran GA Perusahaan'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => alert(`Cetak Surat Pengantar Bengkel & Work Order untuk ${job.plate}`)}
                className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-blue-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 shadow"
              >
                <FileCheck className="w-3.5 h-3.5" /> Surat Pengantar Bengkel (SPB)
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
