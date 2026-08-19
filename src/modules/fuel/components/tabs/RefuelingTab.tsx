/**
 * Fleet Intelligence Smart AI - Refueling Management Tab
 * PROMPT 24 - SPBU Refueling History, OCR Matching & Fuel Card Reconciliation
 */

import React from 'react';
import { Fuel, CheckCircle2, AlertTriangle, Clock, FileText, PlusCircle } from 'lucide-react';
import { RefuelingEvent } from '../../types';

interface RefuelingTabProps {
  refuelings: RefuelingEvent[];
  onOpenRefuelingModal: () => void;
}

export const RefuelingTab: React.FC<RefuelingTabProps> = ({
  refuelings,
  onOpenRefuelingModal,
}) => {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Fuel className="h-4 w-4 text-cyan-400" /> Log Transaksi Pengisian BBM (SPBU & Depo)
            </h3>
            <p className="text-xs text-slate-400">
              Rekonsiliasi transaksi kartu BBM dengan data perubahan level sensor tangki telematika.
            </p>
          </div>
          <button
            onClick={onOpenRefuelingModal}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-600/30"
          >
            <PlusCircle className="h-4 w-4" /> Catat Pengisian Baru
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Waktu</th>
                <th className="p-4">Kendaraan</th>
                <th className="p-4">Pengemudi</th>
                <th className="p-4">SPBU / Stasiun</th>
                <th className="p-4">BBM</th>
                <th className="p-4">Volume (L)</th>
                <th className="p-4">Harga/L</th>
                <th className="p-4">Total Biaya</th>
                <th className="p-4">Rekonsiliasi AI</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {refuelings.map((ref) => (
                <tr key={ref.id} className="hover:bg-slate-800/40 transition-all">
                  <td className="p-4 text-slate-400">{new Date(ref.timestamp).toLocaleString('id-ID')}</td>
                  <td className="p-4 font-bold text-white">{ref.vehiclePlate}</td>
                  <td className="p-4 font-medium">{ref.driverName || 'N/A'}</td>
                  <td className="p-4 text-slate-300">{ref.stationName || 'SPBU Pertamina Rest Area'}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 text-[10px] font-bold">
                      {ref.fuelType}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-cyan-300">{ref.volume} Liter</td>
                  <td className="p-4">Rp {ref.pricePerLiter.toLocaleString('id-ID')}</td>
                  <td className="p-4 font-bold text-emerald-400">Rp {ref.totalCost.toLocaleString('id-ID')}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-bold flex items-center gap-1 w-fit">
                      <CheckCircle2 className="h-3 w-3 text-cyan-400" />
                      {ref.reconciliationStatus || 'MATCH'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        ref.status === 'VERIFIED'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {ref.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
