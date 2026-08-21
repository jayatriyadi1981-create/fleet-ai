import React, { useState } from 'react';
import { BusTrip, BusSeat, BusTicket } from '../../../modules/bus/types';
import { 
  Bus, 
  Ticket, 
  CheckCircle, 
  User, 
  Phone, 
  CreditCard, 
  QrCode, 
  Sparkles, 
  Check, 
  X,
  Printer
} from 'lucide-react';

interface Props {
  trips: BusTrip[];
  tickets: BusTicket[];
  onBookTicket: (ticket: Partial<BusTicket>) => void;
}

export const BusTicketingSeatTab: React.FC<Props> = ({ trips, tickets, onBookTicket }) => {
  const [selectedTripId, setSelectedTripId] = useState<string>(trips[0]?.id || '');
  const [selectedSeat, setSelectedSeat] = useState<BusSeat | null>(null);
  const [activeDeckFilter, setActiveDeckFilter] = useState<'ALL' | 'LOWER' | 'UPPER'>('ALL');
  
  // Passenger Form
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [passengerIdNumber, setPassengerIdNumber] = useState('');
  const [passengerGender, setPassengerGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [paymentMethod, setPaymentMethod] = useState<'ONLINE_QRIS' | 'AGENT_CASH' | 'TRANSFER_VA'>('ONLINE_QRIS');
  const [successBooking, setSuccessBooking] = useState<BusTicket | null>(null);

  const currentTrip = trips.find(t => t.id === selectedTripId) || trips[0];

  const handleSeatClick = (seat: BusSeat) => {
    if (seat.status === 'OCCUPIED' || seat.status === 'BLOCKED_CREW') return;
    setSelectedSeat(seat);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSeat || !currentTrip) return;

    const newTicket: Partial<BusTicket> = {
      tripId: currentTrip.id,
      tripCode: currentTrip.tripCode,
      routeName: currentTrip.routeName,
      busClass: currentTrip.busClass,
      busPlateNumber: currentTrip.busPlateNumber,
      departureTime: `${currentTrip.departureDate} ${currentTrip.departureTime}`,
      seatNumber: selectedSeat.seatNumber,
      passengerName,
      passengerPhone,
      passengerIdNumber,
      passengerGender,
      boardingPoint: currentTrip.departureTerminal,
      dropPoint: currentTrip.arrivalTerminal,
      baseFare: currentTrip.ticketPrice,
      paymentMethod
    };

    onBookTicket(newTicket);
    setSuccessBooking(newTicket as BusTicket);
    setSelectedSeat(null);
    setPassengerName('');
    setPassengerPhone('');
    setPassengerIdNumber('');
  };

  const displayedSeats = currentTrip?.seatMap?.filter(seat => {
    if (activeDeckFilter === 'ALL') return true;
    return seat.deck === activeDeckFilter;
  }) || [];

  return (
    <div className="space-y-6">
      {/* Header & Trip Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Ticket className="w-5 h-5 text-blue-600" />
            Reservasi & Denah Kursi Interaktif (Bus Seat Map)
          </h3>
          <p className="text-xs text-slate-500">Pilih armada dan tentukan kursi penumpang secara visual</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Pilih Jadwal:</span>
          <select 
            value={selectedTripId}
            onChange={(e) => {
              setSelectedTripId(e.target.value);
              setSelectedSeat(null);
            }}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 focus:outline-none"
          >
            {trips.map(t => (
              <option key={t.id} value={t.id}>
                {t.tripCode} - {t.routeName} ({t.departureTime})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Seat Layout & Booking Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Seat Map Graphic */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="text-xs font-mono font-bold text-blue-600">{currentTrip?.tripCode}</div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{currentTrip?.routeName}</h4>
              <div className="text-xs text-slate-500 mt-0.5">
                {currentTrip?.busName} • <span className="font-bold text-slate-700 dark:text-slate-300">{currentTrip?.busClass.replace(/_/g, ' ')}</span> • Tarif: <strong className="text-emerald-600">Rp {currentTrip?.ticketPrice.toLocaleString()}</strong>
              </div>
            </div>

            {/* Deck Switcher if Double Decker */}
            {currentTrip?.busClass === 'FIRST_CLASS_DOUBLE_DECKER' && (
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setActiveDeckFilter('ALL')}
                  className={`px-3 py-1 rounded-lg ${activeDeckFilter === 'ALL' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600'}`}
                >
                  Semua Deck
                </button>
                <button
                  onClick={() => setActiveDeckFilter('LOWER')}
                  className={`px-3 py-1 rounded-lg ${activeDeckFilter === 'LOWER' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600'}`}
                >
                  Deck Bawah (Sleeper)
                </button>
                <button
                  onClick={() => setActiveDeckFilter('UPPER')}
                  className={`px-3 py-1 rounded-lg ${activeDeckFilter === 'UPPER' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600'}`}
                >
                  Deck Atas (Eksekutif)
                </button>
              </div>
            )}

            {/* Seat Legend */}
            <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-emerald-500" /> Tersedia
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-rose-500" /> Terisi
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-blue-600" /> Dipilih
              </div>
            </div>
          </div>

          {/* Realistic Bus Cockpit & Floor Container */}
          <div className="p-6 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center">
            {/* Bus Front Cap / Supir */}
            <div className="w-48 py-2 bg-slate-800 text-slate-300 rounded-t-3xl text-center text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 mb-6 shadow-inner">
              <Bus className="w-3.5 h-3.5" /> DEPAN / KABIN SUPIR
            </div>

            {/* Seat Grid Layout */}
            <div className="grid grid-cols-4 gap-3 max-w-sm w-full">
              {displayedSeats.map((seat) => {
                const isSelected = selectedSeat?.seatNumber === seat.seatNumber;
                const isOccupied = seat.status === 'OCCUPIED';

                return (
                  <button
                    key={seat.seatNumber}
                    onClick={() => handleSeatClick(seat)}
                    disabled={isOccupied}
                    className={`h-14 rounded-xl border flex flex-col items-center justify-center p-1 font-bold text-xs transition-all relative ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-105 ring-2 ring-blue-400'
                        : isOccupied
                        ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-600 cursor-not-allowed opacity-80'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-blue-500 hover:shadow-sm'
                    }`}
                  >
                    <span className="text-[11px] font-mono">{seat.seatNumber}</span>
                    <span className="text-[9px] font-normal opacity-75">
                      {seat.type === 'SLEEPER' ? 'Sleeper' : 'Seat'}
                    </span>
                    {seat.deck === 'UPPER' && (
                      <span className="absolute -top-1.5 -right-1 text-[8px] bg-indigo-600 text-white px-1 rounded-full">
                        Atas
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bus Back / Toilet & Smoking Area */}
            <div className="w-48 py-2 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-b-2xl text-center text-[10px] font-bold uppercase tracking-widest mt-6">
              TOILET & PINTU BELAKANG
            </div>
          </div>
        </div>

        {/* Right Col: Booking Form & Selected Seat Summary */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Detail Penumpang & Pembayaran</h4>
            <p className="text-xs text-slate-500">Pilih kursi di sebelah kiri untuk mengisi data tiket</p>
          </div>

          {selectedSeat ? (
            <form onSubmit={handleSubmitBooking} className="space-y-4 text-xs">
              <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Nomor Kursi Dipilih:</span>
                  <strong className="text-base text-blue-600 font-mono">{selectedSeat.seatNumber}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Tipe Kursi / Deck:</span>
                  <strong className="text-slate-700 dark:text-slate-200">{selectedSeat.type} ({selectedSeat.deck})</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Total Tarif:</span>
                  <strong className="text-emerald-600 text-sm font-bold">Rp {currentTrip.ticketPrice.toLocaleString()}</strong>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Nama Lengkap Penumpang (Sesuai KTP)</label>
                <input 
                  type="text" 
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  placeholder="e.g. Budi Santoso"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">No. WhatsApp</label>
                  <input 
                    type="text" 
                    value={passengerPhone}
                    onChange={(e) => setPassengerPhone(e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Jenis Kelamin</label>
                  <select 
                    value={passengerGender}
                    onChange={(e) => setPassengerGender(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="MALE">Laki-Laki</option>
                    <option value="FEMALE">Perempuan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">NIK KTP (Untuk Asuransi Jasa Raharja)</label>
                <input 
                  type="text" 
                  value={passengerIdNumber}
                  onChange={(e) => setPassengerIdNumber(e.target.value)}
                  placeholder="3174xxxxxxxxxxxx"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Metode Pembayaran</label>
                <select 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-800 dark:text-slate-200"
                >
                  <option value="ONLINE_QRIS">QRIS Dinamis (Instan)</option>
                  <option value="AGENT_CASH">Tunai di Loket Agen</option>
                  <option value="TRANSFER_VA">Virtual Account Bank</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> Terbitkan Tiket & Cetak E-Boarding
              </button>
            </form>
          ) : (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 space-y-2">
              <Ticket className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="font-bold text-xs text-slate-700 dark:text-slate-300">Belum Ada Kursi yang Dipilih</div>
              <p className="text-[11px] text-slate-400">Silakan klik salah satu kursi hijau pada denah bus di sebelah kiri</p>
            </div>
          )}

          {/* Success E-Ticket Card */}
          {successBooking && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Tiket Berhasil Diterbitkan!
              </div>
              <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900 text-xs space-y-1">
                <div className="font-mono font-bold text-emerald-600">{successBooking.ticketNumber || 'TKT-2026-991'}</div>
                <div className="font-bold text-slate-900 dark:text-white">{successBooking.passengerName} • Kursi {successBooking.seatNumber}</div>
                <div className="text-[11px] text-slate-500">{successBooking.routeName}</div>
                <div className="text-[10px] text-slate-400">Termasuk Asuransi Jasa Raharja & Kupon Makan RM</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
