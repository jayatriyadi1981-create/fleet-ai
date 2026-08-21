import React, { useState } from 'react';
import { BusTrip, BusTicket } from '../../../modules/bus/types';
import { busService } from '../../../modules/bus/services/busService';
import { 
  Smartphone, 
  Play, 
  Square, 
  QrCode, 
  Users, 
  MapPin, 
  ShieldAlert, 
  Fuel, 
  Coffee, 
  Clock, 
  CheckCircle2, 
  AlertOctagon, 
  Check, 
  Navigation,
  ArrowRight
} from 'lucide-react';

interface Props {
  trips: BusTrip[];
}

export const BusMobileDriverModeTab: React.FC<Props> = ({ trips }) => {
  const [selectedTrip, setSelectedTrip] = useState<BusTrip>(trips[0] || {} as BusTrip);
  const [tripStatus, setTripStatus] = useState<BusTrip['status']>(selectedTrip.status || 'IN_TRANSIT');
  const [tickets, setTickets] = useState<BusTicket[]>(busService.getTickets().filter(t => t.tripId === selectedTrip.id));
  const [activeMobileView, setActiveMobileView] = useState<'HOME' | 'SCANNER' | 'MANIFEST' | 'EXPENSE'>('HOME');
  const [ticketInput, setTicketInput] = useState('');
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const handleStartTrip = () => {
    setTripStatus('IN_TRANSIT');
    busService.startTrip(selectedTrip.id);
  };

  const handleCompleteTrip = () => {
    setTripStatus('COMPLETED');
    busService.completeTrip(selectedTrip.id);
  };

  const handleBoardTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketInput.trim()) return;

    const res = busService.validateAndBoardTicket(ticketInput, selectedTrip.id, selectedTrip.primaryDriverName);
    setScanMessage(res.message);
    if (res.success) {
      setTickets(busService.getTickets().filter(t => t.tripId === selectedTrip.id));
      setTicketInput('');
    }
  };

  const boardedCount = tickets.filter(t => t.status === 'BOARDED').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            Aplikasi Kru Lapangan (Mobile Driver & Conductor Mode)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tampilan mobile responsif untuk supir & kondektur di kabin bus: scan tiket, checklist manifest, catat solar & panic alert
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Pilih Ritase:</span>
          <select
            value={selectedTrip.id}
            onChange={(e) => {
              const match = trips.find(t => t.id === e.target.value);
              if (match) {
                setSelectedTrip(match);
                setTripStatus(match.status);
                setTickets(busService.getTickets().filter(t => t.tripId === match.id));
              }
            }}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-cyan-300 font-bold focus:outline-none focus:border-emerald-500"
          >
            {trips.map(t => (
              <option key={t.id} value={t.id}>{t.tripCode} - {t.busPlateNumber}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Simulated Smartphone Shell Canvas */}
      <div className="max-w-md mx-auto bg-slate-950 border-4 border-slate-800 rounded-[40px] p-4 shadow-2xl space-y-4 relative">
        {/* Mobile Speaker & Notch */}
        <div className="w-32 h-4 bg-slate-800 rounded-full mx-auto mb-2 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-slate-950 mr-2"></div>
          <div className="w-10 h-1 bg-slate-900 rounded-full"></div>
        </div>

        {/* Mobile Top App Bar */}
        <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
          <div>
            <span className="text-[10px] text-emerald-400 font-mono font-bold block">LOGGED IN AS DRIVER</span>
            <div className="font-bold text-white text-sm">{selectedTrip.primaryDriverName}</div>
            <div className="text-[11px] text-slate-400">{selectedTrip.busPlateNumber} • {selectedTrip.tripCode}</div>
          </div>
          <div className="text-right">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {tripStatus}
            </span>
          </div>
        </div>

        {/* Bottom Tab Bar in Mobile */}
        <div className="grid grid-cols-4 gap-1 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-[10px] font-bold text-center">
          <button
            onClick={() => setActiveMobileView('HOME')}
            className={`py-2 rounded-xl transition-all ${
              activeMobileView === 'HOME' ? 'bg-emerald-600 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveMobileView('SCANNER')}
            className={`py-2 rounded-xl transition-all ${
              activeMobileView === 'SCANNER' ? 'bg-emerald-600 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Scan QR
          </button>
          <button
            onClick={() => setActiveMobileView('MANIFEST')}
            className={`py-2 rounded-xl transition-all ${
              activeMobileView === 'MANIFEST' ? 'bg-emerald-600 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Manifest
          </button>
          <button
            onClick={() => setActiveMobileView('EXPENSE')}
            className={`py-2 rounded-xl transition-all ${
              activeMobileView === 'EXPENSE' ? 'bg-emerald-600 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Solar/UJS
          </button>
        </div>

        {/* Dynamic Mobile View Screen */}
        {activeMobileView === 'HOME' && (
          <div className="space-y-3.5 animate-fadeIn text-xs">
            {/* Action Buttons: Start Trip / End Trip */}
            <div className="grid grid-cols-2 gap-2">
              {tripStatus !== 'IN_TRANSIT' ? (
                <button
                  onClick={handleStartTrip}
                  className="p-3.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-2xl flex flex-col items-center justify-center gap-1 shadow-lg shadow-emerald-950/40"
                >
                  <Play className="w-5 h-5 fill-slate-950" />
                  <span>MULAI RITASE</span>
                </button>
              ) : (
                <button
                  onClick={handleCompleteTrip}
                  className="p-3.5 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-2xl flex flex-col items-center justify-center gap-1 shadow-lg shadow-rose-950/40"
                >
                  <Square className="w-5 h-5 fill-white" />
                  <span>SELESAIKAN RITASE</span>
                </button>
              )}

              <button
                onClick={() => {
                  busService.triggerEmergencyAlert({
                    busId: selectedTrip.busId,
                    busPlateNumber: selectedTrip.busPlateNumber,
                    tripId: selectedTrip.id,
                    tripCode: selectedTrip.tripCode,
                    driverName: selectedTrip.primaryDriverName,
                    driverPhone: selectedTrip.primaryDriverPhone,
                    locationName: selectedTrip.currentLocationName || 'Tol Trans-Jawa',
                    coordinates: selectedTrip.currentCoordinates || { lat: -6.82, lng: 108.79 },
                    currentSpeedKmH: selectedTrip.currentSpeedKmH || 80,
                    passengerCount: selectedTrip.bookedSeats || 20,
                    panicType: 'MANUAL_PANIC_BUTTON'
                  });
                  alert('ALARM DARURAT TERKIRIM KE PUSAT KONTROL TOWER!');
                }}
                className="p-3.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 font-black rounded-2xl flex flex-col items-center justify-center gap-1"
              >
                <AlertOctagon className="w-5 h-5 text-rose-400 animate-bounce" />
                <span>PANIC BUTTON</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Penumpang Naik:</span>
                <span className="font-bold text-cyan-400">{boardedCount} / {selectedTrip.bookedSeats} Jiwa</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Rute Operasional:</span>
                <span className="font-bold text-white text-right">{selectedTrip.routeName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Jadwal Berangkat:</span>
                <span className="font-mono text-emerald-400">{selectedTrip.departureTime} WIB</span>
              </div>
            </div>

            {/* Rest Area Logger Button */}
            <button
              onClick={() => alert('Check-in Rest Area berhasil dicatat di sistem GPS fleet.')}
              className="w-full p-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all"
            >
              <Coffee className="w-4 h-4 text-amber-400" />
              Check-in Istirahat Rest Area
            </button>
          </div>
        )}

        {/* View: QR Scanner Mode */}
        {activeMobileView === 'SCANNER' && (
          <div className="space-y-4 animate-fadeIn text-xs">
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-center space-y-3">
              <div className="w-16 h-16 bg-slate-950 border border-cyan-500/40 rounded-2xl mx-auto flex items-center justify-center">
                <QrCode className="w-8 h-8 text-cyan-400 animate-pulse" />
              </div>
              <h4 className="font-bold text-white">Scan Tiket Penumpang</h4>
              <p className="text-[11px] text-slate-400">Arahkan kamera ke QR tiket penumpang atau masukkan kode tiket</p>
            </div>

            <form onSubmit={handleBoardTicket} className="space-y-2">
              <input
                type="text"
                placeholder="Kode Tiket (misal: TKT-20260820-9921)"
                value={ticketInput}
                onChange={(e) => setTicketInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-emerald-500 font-bold"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-xl text-xs transition-all"
              >
                Boarding Penumpang
              </button>
            </form>

            {scanMessage && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold text-center">
                {scanMessage}
              </div>
            )}
          </div>
        )}

        {/* View: Manifest Checklist */}
        {activeMobileView === 'MANIFEST' && (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-xs animate-fadeIn">
            {tickets.map(t => (
              <div key={t.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-black text-cyan-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-[10px]">
                      {t.seatNumber}
                    </span>
                    <strong className="text-white text-xs">{t.passengerName}</strong>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{t.boardingPoint} ➔ {t.dropPoint}</div>
                </div>

                <div>
                  {t.status === 'BOARDED' ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Boarded
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        busService.validateAndBoardTicket(t.ticketNumber, selectedTrip.id, selectedTrip.primaryDriverName);
                        setTickets(busService.getTickets().filter(tk => tk.tripId === selectedTrip.id));
                      }}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold"
                    >
                      Centang
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View: Solar / Toll Expenses */}
        {activeMobileView === 'EXPENSE' && (
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs animate-fadeIn">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Fuel className="w-4 h-4 text-amber-400" />
              Catat Pengeluaran Solar / E-Toll Ritase
            </h4>

            <div>
              <label className="text-slate-400 block mb-1">Nominal Pengeluaran (Rp)</label>
              <input
                type="number"
                placeholder="500000"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Jenis Pengeluaran</label>
              <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500">
                <option>Pengisian Solar SPBU Rest Area</option>
                <option>Top Up E-Toll Trans-Jawa</option>
                <option>Retribusi Terminal / Cuci Bus</option>
                <option>Tambal Ban / Tambah Angin</option>
              </select>
            </div>

            <button
              onClick={() => alert('Nota pengeluaran UJS berhasil dikirim ke bagian Keuangan PO!')}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-amber-950/30"
            >
              Kirim Laporan Pengeluaran
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
