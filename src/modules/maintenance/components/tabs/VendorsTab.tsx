/**
 * Fleet Intelligence Smart AI - Workshops & Vendors Directory Tab
 * PROMPT 25 - Workshop Network, Vendor Ratings & SLA Management
 */

import React from 'react';
import {
  Building,
  Star,
  MapPin,
  Phone,
  User,
  Wrench,
  Clock,
  DollarSign,
  Plus
} from 'lucide-react';
import { MOCK_VENDORS } from '../../data/mockMaintenanceData';

export const VendorsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Building className="h-5 w-5 text-cyan-400" />
            Direktori Bengkel Mitra & Manajemen Vendor (Workshops)
          </h2>
          <p className="text-xs text-slate-400">
            Jaringan bengkel internal dan rekanan resmi (OEM & Third Party), spesialisasi teknis, evaluasi rating kualitas, dan riwayat performa SLA perbaikan.
          </p>
        </div>

        <button className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-600/30 shrink-0">
          <Plus className="h-4 w-4" />
          <span>Daftarkan Bengkel Baru</span>
        </button>
      </div>

      {/* Workshop Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {MOCK_VENDORS.map((ws) => (
          <div
            key={ws.id}
            className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-white">{ws.name}</h3>
                  <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase">Mitra Terverifikasi</span>
                </div>
                <div className="flex items-center gap-1 bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-lg border border-amber-500/30 text-xs font-bold">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  <span>{ws.rating}</span>
                </div>
              </div>

              {/* Contact info */}
              <div className="space-y-1.5 text-xs text-slate-400 border-t border-slate-800/80 pt-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{ws.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                  <span>PIC: <strong className="text-slate-300">{ws.contact}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                  <span className="font-mono text-slate-300">{ws.phone}</span>
                </div>
              </div>

              {/* Specialties */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] uppercase font-bold text-slate-500">Spesialisasi Teknis:</span>
                <div className="flex flex-wrap gap-1">
                  {ws.specialization.map((spec, i) => (
                    <span key={i} className="text-[10px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Footer */}
            <div className="pt-3 border-t border-slate-800/80 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Rata-rata Waktu Kerja:</span>
                <strong className="text-cyan-300">{ws.avgRepairTimeHours} Jam / Unit</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Servis Selesai:</span>
                <strong className="text-white">{ws.serviceHistoryCount} WO</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
