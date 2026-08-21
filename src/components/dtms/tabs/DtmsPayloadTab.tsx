import React, { useState } from 'react';
import {
  Scale,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Printer,
  FileSpreadsheet,
  QrCode,
  Truck,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { dtmsService } from '../../../modules/dtms/services/dtmsService';
import { WeighbridgeRecord, PayloadStatus } from '../../../modules/dtms/types';

export const DtmsPayloadTab: React.FC = () => {
  const [tickets, setTickets] = useState<WeighbridgeRecord[]>(dtmsService.getWeighbridgeTickets());
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [formTruck, setFormTruck] = useState('DT-101');
  const [formDriver, setFormDriver] = useState('Bambang Sugianto');
  const [formMaterial, setFormMaterial] = useState<any>('OVERBURDEN_OB');
  const [formGross, setFormGross] = useState(162.5);
  const [formTare, setFormTare] = useState(72.0);
  const [formRated, setFormRated] = useState(91.0);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const net = formGross - formTare;
    const isOverload = net > formRated * 1.05;
    const classification: PayloadStatus = isOverload ? 'OVERLOAD_WARNING' : 'OPTIMAL';

    const newTicket = dtmsService.recordWeighbridgeTicket({
      truckHullNo: formTruck,
      driverName: formDriver,
      material: formMaterial,
      firstWeightTon: formGross,
      secondWeightTon: formTare,
      ratedCapacityTon: formRated,
      payloadClassification: classification
    });

    setTickets([...dtmsService.getWeighbridgeTickets()]);
    setShowModal(false);
  };

  return (
    <div id="dtms-payload-tab" className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 flex items-center space-x-2">
            <Scale className="w-5 h-5 text-amber-500" />
            <span>Jembatan Timbang & Manajemen Payload (Weighbridge)</span>
          </h2>
          <p className="text-xs text-slate-400">Verifikasi muatan tonase bruto/tara, pencegahan overload & perlindungan sasis/suspensi</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowModal(true)}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Cetak Tiket Timbang Baru</span>
          </button>
        </div>
      </div>

      {/* Weighbridge Overview KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Akurasi Rata-rata Payload</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-2">97.8%</div>
          <div className="text-xs text-emerald-400 mt-1">Dalam batas toleransi 95% - 105%</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Overload Flag (&gt;105%)</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400 mt-2">2 Insiden</div>
          <div className="text-xs text-slate-400 mt-1">Total denda/penalti overload: Rp 0 (Mitigasi)</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Tonase Terverifikasi</span>
            <Scale className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-2">3.995 Ton</div>
          <div className="text-xs text-amber-400 mt-1">Shift 1 Siang (82 Tiket Cetak)</div>
        </div>
      </div>

      {/* Ticket List Table */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-200">Daftar Tiket Jembatan Timbang Hari Ini</span>
          <button className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs border border-slate-700 flex items-center space-x-1">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Excel</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
                <th className="py-3 px-3">No. Tiket</th>
                <th className="py-3 px-3">Unit & Driver</th>
                <th className="py-3 px-3">Material & Asal Pit</th>
                <th className="py-3 px-3">Bruto (Ton)</th>
                <th className="py-3 px-3">Tara (Ton)</th>
                <th className="py-3 px-3">Netto (Ton)</th>
                <th className="py-3 px-3">Rated vs Selisih</th>
                <th className="py-3 px-3">Status Payload</th>
                <th className="py-3 px-3">Waktu & Petugas</th>
                <th className="py-3 px-3 text-right">Cetak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-amber-400 flex items-center space-x-1.5">
                    <QrCode className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.ticketNo}</span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-100">{t.truckHullNo}</div>
                    <div className="text-[11px] text-slate-400">{t.driverName}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-slate-200">{t.material.replace('_', ' ')}</div>
                    <div className="text-[11px] text-slate-400">{t.sourcePit} &rarr; {t.destination}</div>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-200 font-medium">
                    {t.firstWeightTon.toFixed(1)} Ton
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-400">
                    {t.secondWeightTon.toFixed(1)} Ton
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                    {t.netWeightTon.toFixed(1)} Ton
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-slate-300 font-mono">{t.ratedCapacityTon} T</span>
                    <span className={`ml-1.5 font-bold ${t.discrepancyTon > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      ({t.discrepancyTon > 0 ? `+${t.discrepancyTon.toFixed(1)}` : t.discrepancyTon.toFixed(1)} T)
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {t.payloadClassification === 'OVERLOAD_WARNING' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center w-fit space-x-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>OVERLOAD</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center w-fit space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>OPTIMAL</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    <div>{t.timestamp}</div>
                    <div className="text-[10px] text-slate-500">{t.operatorName}</div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => alert(`Mencetak Tiket Timbang: ${t.ticketNo}`)}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs border border-slate-700 transition-colors inline-flex items-center space-x-1"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Print</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Buat Tiket Timbang */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <Scale className="w-5 h-5 text-amber-500" />
                <span>Input Tiket Jembatan Timbang</span>
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-200 text-sm">✕</button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Unit Dump Truck</label>
                <select
                  value={formTruck}
                  onChange={(e) => {
                    setFormTruck(e.target.value);
                    if (e.target.value === 'DT-101' || e.target.value === 'DT-102') {
                      setFormGross(160.5);
                      setFormTare(72.0);
                      setFormRated(91.0);
                    } else if (e.target.value === 'DT-201') {
                      setFormGross(64.7);
                      setFormTare(18.5);
                      setFormRated(48.0);
                    }
                  }}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200"
                >
                  <option value="DT-101">DT-101 (Komatsu HD785 - Rated 91 Ton)</option>
                  <option value="DT-102">DT-102 (Komatsu HD785 - Rated 91 Ton)</option>
                  <option value="DT-201">DT-201 (Scania P460 - Rated 48 Ton)</option>
                  <option value="DT-301">DT-301 (Volvo A40G ADT - Rated 39 Ton)</option>
                  <option value="DT-401">DT-401 (Hino FM260JD - Rated 26 Ton)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Nama Driver</label>
                <input
                  type="text"
                  value={formDriver}
                  onChange={(e) => setFormDriver(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Tipe Material</label>
                <select
                  value={formMaterial}
                  onChange={(e) => setFormMaterial(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200"
                >
                  <option value="OVERBURDEN_OB">Overburden (OB)</option>
                  <option value="COAL_BATUBARA">Batubara (Coal)</option>
                  <option value="NICKEL_ORE">Nickel Ore</option>
                  <option value="TOPSOIL">Topsoil</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Berat Bruto (Ton)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formGross}
                    onChange={(e) => setFormGross(Number(e.target.value))}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Berat Tara Kosong (Ton)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formTare}
                    onChange={(e) => setFormTare(Number(e.target.value))}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">Hasil Netto Payload</div>
                  <div className="text-base font-bold text-emerald-400">{(formGross - formTare).toFixed(1)} Ton</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-slate-400">Kapasitas Rated</div>
                  <div className="text-sm font-semibold text-slate-300">{formRated} Ton</div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded"
                >
                  Simpan & Verifikasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
