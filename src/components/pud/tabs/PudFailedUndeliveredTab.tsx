import React, { useState } from 'react';
import {
  AlertOctagon,
  Search,
  Filter,
  RotateCcw,
  Calendar,
  Phone,
  Camera,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Plus
} from 'lucide-react';
import { pudService } from '../../../modules/pud/services/pudService';
import { PudExceptionTicket, PudOrder } from '../../../modules/pud/types';

export const PudFailedUndeliveredTab: React.FC = () => {
  const [exceptions, setExceptions] = useState<PudExceptionTicket[]>(pudService.getExceptions());
  const [orders] = useState<PudOrder[]>(pudService.getOrders());
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [selectedOrderId, setSelectedOrderId] = useState(orders[0]?.id || '');
  const [exceptionType, setExceptionType] = useState<any>('RECIPIENT_NOT_HOME');
  const [notes, setNotes] = useState('');

  const filteredTickets = exceptions.filter(e => 
    e.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.courierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId) return;

    pudService.createExceptionTicket({
      orderId: selectedOrderId,
      exceptionType: exceptionType,
      notes: notes || 'Penerima tidak dapat dihubungi atau tidak ada di tempat'
    });

    setExceptions(pudService.getExceptions());
    setShowModal(false);
  };

  return (
    <div className="space-y-6" id="pud-failed-undelivered-tab">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-600" />
            Kendala & Pengiriman Gagal (NDR / RTO Hub)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Penanganan tiket insiden gagal antar (*Non-Delivery Report*), penjadwalan ulang (*Reschedule*), dan retur ke pengirim (*Return to Origin*).
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow transition"
        >
          <Plus className="w-4 h-4" />
          <span>Laporkan Kendala Antar (NDR)</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari no. resi, kendala..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
        </div>
        <span className="text-xs font-medium text-slate-500">
          {filteredTickets.length} Tiket Kendala Aktif
        </span>
      </div>

      {/* Exception Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTickets.map((ticket) => (
          <div key={ticket.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3 hover:border-rose-300 transition">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                {ticket.trackingNumber}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                ticket.status === 'RESCHEDULED'
                  ? 'bg-amber-100 text-amber-800'
                  : ticket.status === 'OPEN'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {ticket.status}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase text-rose-600">
                Penyebab: {ticket.exceptionType.replace(/_/g, ' ')}
              </span>
              <p className="text-xs text-slate-700 font-medium">{ticket.notes}</p>
            </div>

            {ticket.proofPhotoUrl && (
              <div className="w-full h-32 rounded-xl overflow-hidden bg-slate-100">
                <img
                  src={ticket.proofPhotoUrl}
                  alt="Bukti Gagal Antar"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 text-xs space-y-1 text-slate-500">
              <div className="flex justify-between">
                <span>Pelapor: <strong>{ticket.courierName}</strong></span>
                <span>Waktu: <strong>{ticket.createdAt}</strong></span>
              </div>
              {ticket.actionTaken && (
                <p className="text-emerald-700 font-bold mt-1 bg-emerald-50 p-2 rounded-lg">
                  Tindakan: {ticket.actionTaken}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Input Kendala */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-black text-slate-900 text-base mb-3 flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-rose-600" />
              Laporkan Kendala Gagal Antar (NDR)
            </h3>

            <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Pilih Paket Terkendala</label>
                <select
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  {orders.map(o => (
                    <option key={o.id} value={o.id}>
                      {o.trackingNumber} - {o.recipient.contactName} ({o.recipient.addressLine})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Alasan / Jenis Kendala</label>
                <select
                  value={exceptionType}
                  onChange={(e) => setExceptionType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="RECIPIENT_NOT_HOME">Penerima Tidak di Tempat / Rumah Kosong</option>
                  <option value="WRONG_ADDRESS">Alamat Tidak Ditemukan / Salah Alamat</option>
                  <option value="RECIPIENT_REJECTED">Penerima Menolak Paket</option>
                  <option value="COD_UNPAID">Penerima Tidak Mau Bayar Uang COD</option>
                  <option value="WEATHER_FLOOD_RAIN">Kendala Cuaca Ekstrem / Banjir</option>
                  <option value="VEHICLE_BREAKDOWN">Kendaraan Kurir Mogok / Rusak</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Deskripsi Detail & Tindak Lanjut</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Sudah coba telpon 3x tidak diangkat..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 text-white font-bold rounded-lg shadow"
                >
                  Simpan Tiket Kendala
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
