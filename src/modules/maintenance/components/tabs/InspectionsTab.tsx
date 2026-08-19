/**
 * Fleet Intelligence Smart AI - Inspections Management Tab
 * PROMPT 25 - Driver Pre-Trip / Post-Trip Inspection & Failure-to-WO Triggers
 */

import React, { useState } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Smartphone,
  Camera,
  Signature,
  ChevronRight,
  Plus
} from 'lucide-react';
import { MOCK_INSPECTIONS } from '../../data/mockMaintenanceData';
import { Inspection } from '../../types';

interface InspectionsTabProps {
  onOpenMobileInspection?: () => void;
}

export const InspectionsTab: React.FC<InspectionsTabProps> = ({
  onOpenMobileInspection
}) => {
  const [selectedInspection, setSelectedInspection] = useState<Inspection>(MOCK_INSPECTIONS[0]);

  const getResultBadge = (res: string) => {
    switch (res) {
      case 'PASS':
        return <span className="bg-emerald-950 text-emerald-300 border border-emerald-800/50 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> PASS (LOLOS)</span>;
      case 'FAIL':
        return <span className="bg-rose-950 text-rose-300 border border-rose-800/50 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 animate-pulse"><XCircle className="h-3.5 w-3.5" /> FAIL (DITOLAK)</span>;
      default:
        return <span className="bg-amber-950 text-amber-300 border border-amber-800/50 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" /> ATTENTION</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-cyan-400" />
            Inspeksi Harian Pengemudi (Driver Pre-Trip & Post-Trip)
          </h2>
          <p className="text-xs text-slate-400">
            Pemeriksaan fisik kendaraan sebelum dan sesudah trip melalui aplikasi mobile. Hasil FAILED akan otomatis memicu Work Order perbaikan.
          </p>
        </div>

        <button
          onClick={onOpenMobileInspection}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-600/30 shrink-0"
        >
          <Smartphone className="h-4 w-4" />
          <span>Buka Mode Mobile Driver Inspection</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inspection List */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Log Inspeksi Masuk Terbaru
          </span>
          {MOCK_INSPECTIONS.map((insp) => (
            <div
              key={insp.id}
              onClick={() => setSelectedInspection(insp)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                selectedInspection.id === insp.id
                  ? 'bg-cyan-950/30 border-cyan-500/50 shadow-lg shadow-cyan-950'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-white">{insp.vehiclePlate}</h3>
                  <p className="text-xs text-slate-400">Driver: {insp.driverName}</p>
                </div>
                {getResultBadge(insp.result)}
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1 border-t border-slate-800/80">
                <span>Tipe: <strong>{insp.type}</strong></span>
                <span>Odometer: {insp.odometer.toLocaleString()} KM</span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Inspection Detail View */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase">
                Hasil Lengkap Form Inspeksi
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                {selectedInspection.vehiclePlate} - {selectedInspection.type}
              </h3>
              <p className="text-xs text-slate-400">
                Dilakukan oleh <strong>{selectedInspection.driverName}</strong> pada {selectedInspection.timestamp}
              </p>
            </div>
            <div>{getResultBadge(selectedInspection.result)}</div>
          </div>

          {/* Checklist Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Pemeriksaan Item Komponen
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {selectedInspection.checklist.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                    item.status === 'FAIL'
                      ? 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                      : item.status === 'ATTENTION'
                      ? 'bg-amber-950/40 border-amber-800/60 text-amber-200'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-200'
                  }`}
                >
                  <span className="font-medium">{item.item}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.status === 'FAIL'
                      ? 'bg-rose-900 text-rose-200'
                      : item.status === 'ATTENTION'
                      ? 'bg-amber-900 text-amber-200'
                      : 'bg-emerald-950 text-emerald-300'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Driver Notes & Photo Proof */}
          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Catatan & Bukti Foto Pengemudi
            </h4>
            <p className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 italic">
              "{selectedInspection.notes || 'Tidak ada catatan khusus.'}"
            </p>

            {selectedInspection.photoUrls && selectedInspection.photoUrls.length > 0 && (
              <div className="pt-2 flex items-center gap-3">
                <span className="text-slate-400 text-xs font-semibold flex items-center gap-1.5">
                  <Camera className="h-4 w-4 text-cyan-400" /> Foto Terlampir:
                </span>
                <div className="flex gap-2">
                  {selectedInspection.photoUrls.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt="Inspection Proof"
                      className="h-14 w-20 object-cover rounded-lg border border-slate-700"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
