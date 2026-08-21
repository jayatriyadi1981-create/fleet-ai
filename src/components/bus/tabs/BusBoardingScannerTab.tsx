import React, { useState } from 'react';
import { BusTrip, BusTicket } from '../../../modules/bus/types';
import { busService } from '../../../modules/bus/services/busService';
import { 
  QrCode, 
  Scan, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Armchair, 
  Search, 
  Clock, 
  ShieldCheck, 
  FileSpreadsheet,
  X,
  Check,
  Ban
} from 'lucide-react';

interface Props {
  trips: BusTrip[];
  tickets: BusTicket[];
  onNavigateManifest?: () => void;
}

export const BusBoardingScannerTab: React.FC<Props> = ({ trips, tickets: initialTickets, onNavigateManifest }) => {
  const [selectedTripId, setSelectedTripId] = useState<string>(trips[0]?.id || 'trip-01');
  const [tickets, setTickets] = useState<BusTicket[]>(initialTickets);
  const [scannedInput, setScannedInput] = useState('');
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; ticket?: BusTicket; seatNumber?: string } | null>(null);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'BOARDED' | 'NOT_BOARDED'>('ALL');

  const selectedTrip = trips.find(t => t.id === selectedTripId) || trips[0];
  const tripTickets = tickets.filter(t => t.tripId === selectedTripId);

  const boardedCount = tripTickets.filter(t => t.status === 'BOARDED').length;
  const totalBooked = tripTickets.length;

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedInput.trim()) return;

    const result = busService.validateAndBoardTicket(scannedInput, selectedTripId, 'Dimas Aditya (Kondektur)');
    setScanResult(result);

    if (result.success) {
      setTickets(busService.getTickets());
      setScannedInput('');
    }
  };

  const handleQuickBoardTicket = (ticketNumber: string) => {
    const result = busService.validateAndBoardTicket(ticketNumber, selectedTripId, 'Dimas Aditya (Kondektur)');
    setScanResult(result);
    if (result.success) {
      setTickets(busService.getTickets());
    }
  };

  const filteredTickets = tripTickets.filter(t => {
    if (filterStatus === 'BOARDED') return t.status === 'BOARDED';
    if (filterStatus === 'NOT_BOARDED') return t.status !== 'BOARDED';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Trip Selector */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <QrCode className="w-5 h-5 text-cyan-400" />
            E-Boarding & Pemindaian Tiket QR Bus (Gate Control)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Validasi tiket digital, verifikasi nomor kursi, cegah tiket dobel & manifest Kemenhub real-time
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedTripId}
            onChange={(e) => {
              setSelectedTripId(e.target.value);
              setScanResult(null);
            }}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-cyan-300 font-bold focus:outline-none focus:border-cyan-500 w-full md:w-auto"
          >
            {trips.map((trip) => (
              <option key={trip.id} value={trip.id}>
                {trip.tripCode} • {trip.routeName} ({trip.departureTime} WIB)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Scanner Box on Left & Manifest List on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: QR Code Scanner Simulation */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Scan className="w-4 h-4 text-cyan-400" />
              Pemindai Tiket / QR Scanner Bus
            </h3>

            {/* Scanner Input Form */}
            <form onSubmit={handleScanSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  Pindai QR Code atau Masukkan Nomor Tiket
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Contoh: TKT-20260820-9921 atau Scan QR..."
                    value={scannedInput}
                    onChange={(e) => setScannedInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-24 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono font-bold"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xs rounded-lg transition-all flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Boarding
                  </button>
                </div>
              </div>
            </form>

            {/* Quick Demo Scan Buttons */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 block">Simulasi Scan Cepat Tiket:</span>
              <div className="flex flex-wrap gap-1.5">
                {tripTickets.slice(0, 3).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleQuickBoardTicket(t.ticketNumber)}
                    className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[11px] font-mono text-cyan-300 border border-slate-800 transition-all"
                  >
                    Scan {t.seatNumber} ({t.ticketNumber.slice(-4)})
                  </button>
                ))}
              </div>
            </div>

            {/* Scan Result Feedback Box */}
            {scanResult && (
              <div
                className={`p-4 rounded-2xl border transition-all animate-fadeIn space-y-2 ${
                  scanResult.success
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs">
                  {scanResult.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-400" />
                  )}
                  {scanResult.success ? 'VERIFIKASI BOARDING VALID' : 'GAGAL BOARDING'}
                </div>
                <p className="text-xs">{scanResult.message}</p>

                {scanResult.ticket && (
                  <div className="mt-2 pt-2 border-t border-emerald-500/20 text-[11px] grid grid-cols-2 gap-2 text-slate-300">
                    <div>
                      <span>Penumpang:</span> <strong className="text-white block">{scanResult.ticket.passengerName}</strong>
                    </div>
                    <div>
                      <span>Nomor Kursi:</span> <strong className="text-cyan-300 font-mono text-xs block">{scanResult.seatNumber}</strong>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Progress Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Progres Naik Penumpang</span>
              <span className="text-cyan-400 font-mono">{boardedCount} / {totalBooked} Boarded</span>
            </h4>
            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${totalBooked > 0 ? (boardedCount / totalBooked) * 100 : 0}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Sisa Belum Naik: <strong className="text-amber-400">{totalBooked - boardedCount} Orang</strong></span>
              <span>Total Kapasitas: {selectedTrip?.totalSeats} Kursi</span>
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Real-Time Boarding Manifest Table */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Manifest E-Boarding: {selectedTrip?.tripCode}
              </h3>
              <p className="text-[11px] text-slate-500">{selectedTrip?.routeName} • Supir: {selectedTrip?.primaryDriverName}</p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setFilterStatus('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  filterStatus === 'ALL' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-950 text-slate-400'
                }`}
              >
                Semua ({totalBooked})
              </button>
              <button
                onClick={() => setFilterStatus('BOARDED')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  filterStatus === 'BOARDED' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-400'
                }`}
              >
                Sudah Naik ({boardedCount})
              </button>
              <button
                onClick={() => setFilterStatus('NOT_BOARDED')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  filterStatus === 'NOT_BOARDED' ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-400'
                }`}
              >
                Belum ({totalBooked - boardedCount})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Kursi</th>
                  <th className="py-3 px-4">Nama Penumpang</th>
                  <th className="py-3 px-4">No. Tiket</th>
                  <th className="py-3 px-4">Titik Naik & Turun</th>
                  <th className="py-3 px-4">Status Boarding</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <span className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono font-black text-xs flex items-center justify-center">
                          {ticket.seatNumber}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{ticket.passengerName}</div>
                        <div className="text-slate-400 text-[11px]">{ticket.passengerPhone}</div>
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-slate-300">
                        {ticket.ticketNumber}
                      </td>

                      <td className="py-3 px-4 text-[11px]">
                        <div className="text-emerald-400">Naik: {ticket.boardingPoint}</div>
                        <div className="text-slate-400">Turun: {ticket.dropPoint}</div>
                      </td>

                      <td className="py-3 px-4">
                        {ticket.status === 'BOARDED' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-fit">
                            <Check className="w-3 h-3" /> Boarded ({ticket.boardedAt || 'OK'})
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 w-fit">
                            Belum Naik
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        {ticket.status !== 'BOARDED' && (
                          <button
                            onClick={() => handleQuickBoardTicket(ticket.ticketNumber)}
                            className="px-2.5 py-1 bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-slate-950 font-bold rounded text-[11px] transition-all border border-cyan-500/30"
                          >
                            Mark Boarded
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                      Tidak ada data tiket sesuai filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
