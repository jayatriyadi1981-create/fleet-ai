import React, { useState } from 'react';
import { BusCrew } from '../../../modules/bus/types';
import { 
  Users, 
  Search, 
  ShieldAlert, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Phone, 
  Award,
  Activity
} from 'lucide-react';

interface Props {
  crews: BusCrew[];
}

export const BusCrewRosterTab: React.FC<Props> = ({ crews }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCrews = crews.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.crewNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Manajemen Kru Bus, Roster & Fatigue Radar Supir
        </h3>
        <p className="text-xs text-slate-500">Pemantauan jam kerja supir (aturan maksimal 4 jam kemudi berturut-turut), supir cadangan, dan lisensi SIM B2 Umum</p>
      </div>

      {/* Warning Alert if Driver Approaching Limit */}
      <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-800 dark:text-amber-300 space-y-1">
          <strong className="text-sm font-bold">Kepatuhan Keselamatan Transportasi Darat (Kemenhub RI):</strong>
          <p>
            Supir <strong>Budi Santoso (DRV-205)</strong> telah mengemudi selama <strong>3.8 Jam</strong> di rute Tangerang - Solo. Wajib melakukan pergantian kemudi dengan Driver Cadangan di Rest Area Cipali KM 102 dalam 12 menit ke depan.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari nama kru supir, nomor registrasi, atau jabatan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* Crew Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredCrews.map((c) => {
          const isFatigued = c.fatigueScore > 50;
          const isDriving = c.status === 'ACTIVE_DRIVING';

          return (
            <div key={c.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[10px] font-bold text-blue-600 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 rounded">
                    {c.crewNumber}
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-1">{c.name}</h4>
                  <div className="text-[11px] text-slate-500 font-semibold">{c.role.replace(/_/g, ' ')}</div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isDriving 
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                  {isDriving ? '● Sedang Kemudi' : 'Istirahat'}
                </span>
              </div>

              {/* Driving Hours & Fatigue Bar */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Jam Kemudi Berjalan:</span>
                  <strong className={`font-bold ${c.totalContinuousDrivingHours >= 3.5 ? 'text-rose-600' : 'text-slate-800 dark:text-slate-200'}`}>
                    {c.totalContinuousDrivingHours} / 4.0 Jam
                  </strong>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      c.totalContinuousDrivingHours >= 3.5 ? 'bg-rose-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min((c.totalContinuousDrivingHours / 4) * 100, 100)}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">Fatigue Index (Kelelahan):</span>
                  <span className={`font-bold ${isFatigued ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {c.fatigueScore} / 100 {isFatigued ? '(Waspada)' : '(Aman)'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] space-y-1 text-slate-500">
                <div>Trip Aktif: <strong className="text-slate-800 dark:text-slate-200">{c.currentAssignedTrip || 'Standby Pool'}</strong></div>
                <div>Lisensi: <strong className="text-slate-800 dark:text-slate-200">{c.simType.replace(/_/g, ' ')}</strong> (Exp: {c.simExpiryDate})</div>
                <div>Kontak: <strong className="text-slate-800 dark:text-slate-200">{c.phone}</strong></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
