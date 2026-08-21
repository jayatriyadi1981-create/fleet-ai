import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Search,
  Plus,
  RefreshCw,
  Clock,
  Shield,
  Layers,
  FileCheck
} from 'lucide-react';
import { MOCK_ATM_CASSETTES } from '../../../modules/securicor/services/securicorMockData';

export const SecuricorAtmReplenishmentTab: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'BCA' | 'MANDIRI' | 'BNI'>('ALL');
  const [searchAtm, setSearchAtm] = useState('');

  const atmJobs = [
    {
      id: 'atm-job-01',
      atmId: 'ATM-BCA-GI-01',
      bankName: 'BCA',
      location: 'Grand Indonesia East Mall Lt. LG (Galeri ATM)',
      targetReplenishmentIdr: 500000000,
      cassettesLoaded: 4,
      flmStatus: 'NORMAL_OPERATIONAL',
      technician: 'Rudi Hartawan (FLM Level 2)',
      escortLead: 'Kapten (Purn) Hendra Kurniawan',
      assignedHull: 'ARMOR-CIT-01',
      lastReplenished: '2026-08-21 10:15 WIB',
      progress: 'COMPLETED',
    },
    {
      id: 'atm-job-02',
      atmId: 'ATM-MDR-PP-02',
      bankName: 'MANDIRI',
      location: 'Pacific Place Mall SCBD Lobby Barat',
      targetReplenishmentIdr: 500000000,
      cassettesLoaded: 4,
      flmStatus: 'CARD_READER_CLEANED',
      technician: 'Bambang Irawan (FLM Level 2)',
      escortLead: 'Agus Setiawan',
      assignedHull: 'ARMOR-CIT-03',
      lastReplenished: 'Dalam Proses Pengisian',
      progress: 'IN_PROGRESS',
    },
    {
      id: 'atm-job-03',
      atmId: 'ATM-BNI-SEN-01',
      bankName: 'BNI',
      location: 'Senayan City Lt. 1 Galeri Perbankan',
      targetReplenishmentIdr: 750000000,
      cassettesLoaded: 6,
      flmStatus: 'RECEIPT_PRINTER_SERVICED',
      technician: 'Fajar Nugroho (FLM Level 1)',
      escortLead: 'Lettu (Purn) Rudi Hartono',
      assignedHull: 'ARMOR-CIT-04',
      lastReplenished: 'Jadwal 13:00 WIB',
      progress: 'SCHEDULED',
    }
  ];

  return (
    <div id="securicor-atm-replenishment-tab" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs text-amber-400 font-mono font-bold uppercase tracking-wider">ATM FIRST LINE MAINTENANCE (FLM) & CASH RELOAD</span>
          <h3 className="text-lg font-bold text-white mt-1">Sistem Pengisian Kas ATM / CRM & Pemeliharaan Mesin</h3>
          <p className="text-xs text-slate-400">Pengawasan pengisian uang tunai kaset, audit sisa uang (purge/reject tray), dan FLM hardware cleaning.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Jadwal pengisian kas ATM telah disinkronkan dengan Core Banking switch ATM.')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Sinkronisasi Status ATM
          </button>
        </div>
      </div>

      {/* ATM Work Orders List */}
      <div className="space-y-4">
        {atmJobs.map(job => (
          <div key={job.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-mono font-bold text-sm">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm font-mono">{job.atmId}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                      Bank {job.bankName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{job.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  job.progress === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                  job.progress === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800 animate-pulse' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {job.progress}
                </span>
              </div>
            </div>

            {/* Grid Detail */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 text-xs">
              <div>
                <span className="text-slate-500">Nilai Kas Pengisian:</span>
                <p className="font-bold text-amber-600 font-mono mt-0.5">Rp {(job.targetReplenishmentIdr / 1000000).toLocaleString('id-ID')} Juta</p>
                <p className="text-[11px] text-slate-400">({job.cassettesLoaded} Smart Cassettes)</p>
              </div>

              <div>
                <span className="text-slate-500">Pemeliharaan FLM:</span>
                <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                  <Wrench className="w-3.5 h-3.5 text-slate-500" /> {job.flmStatus}
                </p>
                <p className="text-[11px] text-slate-400">Teknisi: {job.technician.split(' ')[0]}</p>
              </div>

              <div>
                <span className="text-slate-500">Armada & Escort:</span>
                <p className="font-mono font-bold text-slate-800 mt-0.5">{job.assignedHull}</p>
                <p className="text-[11px] text-slate-400">Escort: {job.escortLead.split(' ')[0]}</p>
              </div>

              <div>
                <span className="text-slate-500">Waktu Servis:</span>
                <p className="font-medium text-slate-800 mt-0.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> {job.lastReplenished}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 mt-3">
              <button
                onClick={() => alert(`Berita Acara Cash Replenishment & FLM Checklist untuk ${job.atmId}`)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <FileCheck className="w-3.5 h-3.5" /> Berita Acara FLM
              </button>
              <button
                onClick={() => alert(`Verifikasi OTP Purge Tray Counter & Cassette Swap untuk ${job.atmId}`)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-lg text-xs font-semibold"
              >
                Audit Kaset & Reject Tray
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
