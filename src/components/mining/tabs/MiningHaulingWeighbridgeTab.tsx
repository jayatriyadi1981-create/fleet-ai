import React, { useState } from 'react';
import {
  Scale,
  Plus,
  Truck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Printer,
  Search,
  ArrowDownToLine,
  QrCode
} from 'lucide-react';
import { miningService } from '../../../modules/mining/services/miningService';
import { MiningWeighbridgeTicket } from '../../../modules/mining/types';

export const MiningHaulingWeighbridgeTab: React.FC = () => {
  const [tickets, setTickets] = useState<MiningWeighbridgeTicket[]>(miningService.getWeighbridgeTickets());
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<MiningWeighbridgeTicket | null>(null);

  const [formData, setFormData] = useState<Partial<MiningWeighbridgeTicket>>({
    dumpTruckCode: 'DT-785-01',
    operatorName: 'Agus Salim',
    pitOrigin: 'Pit Hatari South Main Pit',
    destinationStockpile: 'ROM Stockpile Sangatta Port A',
    materialName: 'Thermal Coal Seam Pinang',
    grossWeightTon: 162.0,
    tareWeightTon: 72.0,
    targetCapacityTon: 91.0
  });

  const handleRecordTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const newTkt = miningService.recordWeighbridge(formData);
    setTickets(miningService.getWeighbridgeTickets());
    setShowAddModal(false);
    setSelectedTicket(newTkt);
  };

  const filteredTickets = tickets.filter(t => 
    t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.dumpTruckCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.operatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.materialName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6" id="mining-weighbridge-container">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Scale className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl font-bold text-slate-900">Jembatan Timbang & Tiket Ritase (Weighbridge Scale & Payload)</h1>
          </div>
          <p className="text-xs text-slate-500">
            Penimbangan digital RFID/ANPR: Gross (Kotor), Tare (Kosong), & Netto (Muatan Bersih). Deteksi otomatis muatan berlebih (overload) / kurang muatan (underload).
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md shadow-amber-500/20"
          id="btn-add-weighbridge-ticket"
        >
          <Plus className="w-4 h-4" />
          Timbang Truk Baru (RFID)
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari nomor tiket timbang, kode dump truck (misal DT-785), nama supir, atau material..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">No. Tiket Timbang</th>
                <th className="py-3.5 px-4">Waktu (In - Out)</th>
                <th className="py-3.5 px-4">Unit Truk & Supir</th>
                <th className="py-3.5 px-4">Asal Pit & Tujuan</th>
                <th className="py-3.5 px-4">Material</th>
                <th className="py-3.5 px-4 text-right">Gross (Ton)</th>
                <th className="py-3.5 px-4 text-right">Tare (Ton)</th>
                <th className="py-3.5 px-4 text-right">Netto (Ton)</th>
                <th className="py-3.5 px-4 text-center">Status Muatan</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTickets.map(ticket => (
                <tr key={ticket.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {ticket.ticketNumber}
                  </td>
                  <td className="py-3 px-4 text-[11px] text-slate-500">
                    <div>{ticket.date}</div>
                    <div className="font-mono text-slate-700">{ticket.timeIn}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{ticket.dumpTruckCode}</span>
                    <span className="text-[11px] text-slate-500">{ticket.operatorName}</span>
                  </td>
                  <td className="py-3 px-4 text-[11px]">
                    <div className="font-medium text-slate-800">{ticket.pitOrigin}</div>
                    <div className="text-slate-400">&rarr; {ticket.destinationStockpile}</div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {ticket.materialName}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-700">
                    {ticket.grossWeightTon.toFixed(1)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-500">
                    {ticket.tareWeightTon.toFixed(1)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                    {ticket.netPayloadTon.toFixed(1)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      ticket.complianceStatus === 'OPTIMAL' ? 'bg-emerald-100 text-emerald-800' :
                      ticket.complianceStatus === 'OVERLOAD' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {ticket.complianceStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setSelectedTicket(ticket)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                      title="Lihat Struk Digital"
                    >
                      <Printer className="w-4 h-4 text-slate-700" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Print Slip Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 font-mono text-xs">
            <div className="text-center border-b border-dashed border-slate-300 pb-3 mb-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase">TIKET TIMBANG DIGITAL (WEIGHBRIDGE)</h2>
              <div className="text-[10px] text-slate-500">{selectedTicket.siteName}</div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">Scale ID: {selectedTicket.weighbridgeScaleId}</div>
            </div>

            <div className="space-y-1.5 mb-3 text-slate-700">
              <div className="flex justify-between">
                <span>No. Tiket:</span>
                <strong className="text-slate-900">{selectedTicket.ticketNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span>Tanggal & Jam:</span>
                <span>{selectedTicket.date} {selectedTicket.timeIn}</span>
              </div>
              <div className="flex justify-between">
                <span>Kode Unit Hauler:</span>
                <strong className="text-slate-900">{selectedTicket.dumpTruckCode}</strong>
              </div>
              <div className="flex justify-between">
                <span>Nama Operator:</span>
                <span>{selectedTicket.operatorName}</span>
              </div>
              <div className="flex justify-between">
                <span>Material:</span>
                <strong className="text-slate-900">{selectedTicket.materialName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Asal Pit / Tujuan:</span>
                <span>{selectedTicket.pitOrigin} &rarr; {selectedTicket.destinationStockpile}</span>
              </div>
            </div>

            <div className="border-t border-b border-dashed border-slate-300 py-2.5 my-3 space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>BERAT KOTOR (GROSS):</span>
                <span>{selectedTicket.grossWeightTon.toFixed(2)} TON</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>BERAT KOSONG (TARE):</span>
                <span>{selectedTicket.tareWeightTon.toFixed(2)} TON</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold text-sm pt-1 border-t border-slate-200">
                <span>BERAT BERSIH (NETTO):</span>
                <span>{selectedTicket.netPayloadTon.toFixed(2)} TON</span>
              </div>
            </div>

            <div className="text-center text-[10px] text-slate-400 mb-4">
              Status Kepatuhan Muatan: <strong>{selectedTicket.complianceStatus}</strong> (Target {selectedTicket.targetCapacityTon} Ton)
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl w-full"
              >
                Tutup Struk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Ticket Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Catat Penimbangan Baru (Weighbridge Scale)</h2>

            <form onSubmit={handleRecordTicket} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kode Truk (Hauler)</label>
                  <input
                    type="text"
                    required
                    value={formData.dumpTruckCode}
                    onChange={(e) => setFormData({ ...formData, dumpTruckCode: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama Supir / Operator</label>
                  <input
                    type="text"
                    required
                    value={formData.operatorName}
                    onChange={(e) => setFormData({ ...formData, operatorName: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Asal Pit</label>
                  <input
                    type="text"
                    value={formData.pitOrigin}
                    onChange={(e) => setFormData({ ...formData, pitOrigin: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tujuan Stockpile</label>
                  <input
                    type="text"
                    value={formData.destinationStockpile}
                    onChange={(e) => setFormData({ ...formData, destinationStockpile: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Gross (Ton)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.grossWeightTon}
                    onChange={(e) => setFormData({ ...formData, grossWeightTon: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tare (Ton)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.tareWeightTon}
                    onChange={(e) => setFormData({ ...formData, tareWeightTon: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Kapasitas</label>
                  <input
                    type="number"
                    value={formData.targetCapacityTon}
                    onChange={(e) => setFormData({ ...formData, targetCapacityTon: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl"
                >
                  Simpan & Terbitkan Tiket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
