import React, { useState } from 'react';
import { BusRampCheck } from '../../../modules/bus/types';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  FileCheck, 
  Plus, 
  Wrench,
  Calendar
} from 'lucide-react';

interface Props {
  rampChecks: BusRampCheck[];
}

export const BusRampCheckTab: React.FC<Props> = ({ rampChecks }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChecks = rampChecks.filter(r => 
    r.busPlateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.inspectorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.poolLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            Inspeksi Ramp Check Kemenhub & Keselamatan Bus
          </h3>
          <p className="text-xs text-slate-500">Standar pengujian kelaikan jalan armada bus sebelum diberangkatkan dari pool/terminal</p>
        </div>

        <button 
          onClick={() => alert('Formulir Inspeksi Ramp Check Digital dibuka untuk pengawas pool.')}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Input Hasil Ramp Check Baru
        </button>
      </div>

      {/* Checklist Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredChecks.map((rc) => (
          <div key={rc.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-sm font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                  {rc.busPlateNumber}
                </span>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Tanggal: <strong>{rc.checkDate}</strong>
                </div>
                <div className="text-xs text-slate-500">Penguji: <strong>{rc.inspectorName}</strong></div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                rc.overallStatus === 'PASSED_READY'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {rc.overallStatus === 'PASSED_READY' ? '✓ LAIK JALAN RESMI' : 'PERINGATAN'}
              </span>
            </div>

            {/* Checklist items grid */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Sistem Rem Angin (Full Air Brake)</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Kondisi Ban (Alur & Tekanan)</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Wiper & Lampu Sorot LED</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Palu Darurat ({rc.emergencyHammerCount} Pcs Terpasang)</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>APAR Tabung Pemadam Api</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Kartu KPS & Uji KIR Aktif</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-300">
              <strong>Catatan Tim Kemenhub / Pool:</strong> {rc.notes}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
