import React, { useState } from 'react';
import { BusSeat, BusClass } from '../../../modules/bus/types';
import { busService } from '../../../modules/bus/services/busService';
import { 
  Armchair, 
  Layers, 
  Settings2, 
  User, 
  Check, 
  Ban, 
  Sparkles, 
  HelpCircle,
  Save,
  RotateCcw,
  Plus,
  Trash2
} from 'lucide-react';

export const BusSeatLayoutDesignerTab: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<BusClass>('SLEEPER_SUITES');
  const [totalSeats, setTotalSeats] = useState<number>(22);
  const [activeDeck, setActiveDeck] = useState<'SINGLE' | 'LOWER' | 'UPPER'>('LOWER');
  const [seatMap, setSeatMap] = useState<BusSeat[]>(() => busService.generateSeatMap('SLEEPER_SUITES', 22));
  const [selectedSeat, setSelectedSeat] = useState<BusSeat | null>(null);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState(false);

  const handleClassChange = (newClass: BusClass) => {
    setSelectedClass(newClass);
    let seatsCount = 32;
    if (newClass === 'SLEEPER_SUITES') {
      seatsCount = 22;
      setActiveDeck('LOWER');
    } else if (newClass === 'FIRST_CLASS_DOUBLE_DECKER') {
      seatsCount = 36;
      setActiveDeck('LOWER');
    } else if (newClass === 'SUPER_EXECUTIVE') {
      seatsCount = 28;
      setActiveDeck('SINGLE');
    } else {
      seatsCount = 36;
      setActiveDeck('SINGLE');
    }
    setTotalSeats(seatsCount);
    const newSeats = busService.generateSeatMap(newClass, seatsCount);
    setSeatMap(newSeats);
    setSelectedSeat(null);
  };

  const handleSeatClick = (seat: BusSeat) => {
    setSelectedSeat(seat);
  };

  const handleUpdateSeatStatus = (status: BusSeat['status']) => {
    if (!selectedSeat) return;
    const updated = seatMap.map(s => s.seatNumber === selectedSeat.seatNumber ? { ...s, status } : s);
    setSeatMap(updated);
    setSelectedSeat({ ...selectedSeat, status });
  };

  const handleUpdateSeatType = (type: BusSeat['type']) => {
    if (!selectedSeat) return;
    const updated = seatMap.map(s => s.seatNumber === selectedSeat.seatNumber ? { ...s, type } : s);
    setSeatMap(updated);
    setSelectedSeat({ ...selectedSeat, type });
  };

  const handleSaveLayout = () => {
    setSaveSuccessMessage(true);
    setTimeout(() => setSaveSuccessMessage(false), 3000);
  };

  const visibleSeats = seatMap.filter(s => {
    if (selectedClass === 'SLEEPER_SUITES') {
      return s.deck === activeDeck;
    }
    if (selectedClass === 'FIRST_CLASS_DOUBLE_DECKER') {
      return s.deck === activeDeck;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Armchair className="w-5 h-5 text-cyan-400" />
            Konfigurator Denah Kursi Bus (Seat Layout Studio)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Rancang formasi kursi 1-1 Sleeper, 2-1 Super Eksekutif, 2-2 Eksekutif, dan Bus Tingkat Double Decker
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleClassChange(selectedClass)}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Layout
          </button>
          <button
            onClick={handleSaveLayout}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-cyan-950/40"
          >
            <Save className="w-3.5 h-3.5" />
            Simpan Template Layout
          </button>
        </div>
      </div>

      {saveSuccessMessage && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4" />
          Template denah kursi berhasil disimpan dan disinkronkan ke master armada bus!
        </div>
      )}

      {/* Main Studio Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 Cols: Configuration Controls */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Settings2 className="w-4 h-4 text-cyan-400" />
              Pengaturan Kelas & Formasi
            </h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Tipe Kelas Bus</label>
              <select
                value={selectedClass}
                onChange={(e) => handleClassChange(e.target.value as BusClass)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
              >
                <option value="SLEEPER_SUITES">Sleeper Suites (1-1 Capsule Pods, 22 Seats)</option>
                <option value="FIRST_CLASS_DOUBLE_DECKER">First Class Double Decker (Tingkat, 36 Seats)</option>
                <option value="SUPER_EXECUTIVE">Super Executive (2-1 Leg Rest, 28 Seats)</option>
                <option value="EXECUTIVE">Executive Class (2-2 Foot Rest, 32 Seats)</option>
                <option value="VIP">VIP Class (2-2 Reclining, 36 Seats)</option>
              </select>
            </div>

            {/* Deck Switcher for Sleeper or Double Decker */}
            {(selectedClass === 'SLEEPER_SUITES' || selectedClass === 'FIRST_CLASS_DOUBLE_DECKER') && (
              <div>
                <label className="text-xs text-slate-400 block mb-1.5">Pilih Dek / Lantai</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveDeck('LOWER')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                      activeDeck === 'LOWER'
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    Dek Bawah (Lower Deck)
                  </button>
                  <button
                    onClick={() => setActiveDeck('UPPER')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                      activeDeck === 'UPPER'
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    Dek Atas (Upper Deck)
                  </button>
                </div>
              </div>
            )}

            {/* Summary Counters */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Total Kapasitas Kursi:</span>
                <span className="font-bold text-white">{totalSeats} Kursi</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Kursi Terisi / Booked:</span>
                <span className="font-bold text-cyan-400">{seatMap.filter(s => s.status === 'OCCUPIED' || s.status === 'BOARDED').length}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Kursi Tersedia (Available):</span>
                <span className="font-bold text-emerald-400">{seatMap.filter(s => s.status === 'AVAILABLE').length}</span>
              </div>
            </div>
          </div>

          {/* Seat Inspector / Editor */}
          {selectedSeat ? (
            <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-5 space-y-4 shadow-lg shadow-cyan-950/20">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                  <Armchair className="w-4 h-4 text-cyan-400" />
                  Edit Kursi: {selectedSeat.seatNumber}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  Deck {selectedSeat.deck}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Status Kursi</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => handleUpdateSeatStatus('AVAILABLE')}
                      className={`py-1.5 px-2 rounded-lg font-bold border text-[11px] ${
                        selectedSeat.status === 'AVAILABLE'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      Available
                    </button>
                    <button
                      onClick={() => handleUpdateSeatStatus('OCCUPIED')}
                      className={`py-1.5 px-2 rounded-lg font-bold border text-[11px] ${
                        selectedSeat.status === 'OCCUPIED'
                          ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      Occupied
                    </button>
                    <button
                      onClick={() => handleUpdateSeatStatus('BLOCKED_CREW')}
                      className={`py-1.5 px-2 rounded-lg font-bold border text-[11px] ${
                        selectedSeat.status === 'BLOCKED_CREW'
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      Blocked (Kru)
                    </button>
                    <button
                      onClick={() => handleUpdateSeatStatus('RESERVED_AGENT')}
                      className={`py-1.5 px-2 rounded-lg font-bold border text-[11px] ${
                        selectedSeat.status === 'RESERVED_AGENT'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      Reserved Agen
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Tipe Kursi & Fitur</label>
                  <select
                    value={selectedSeat.type}
                    onChange={(e) => handleUpdateSeatType(e.target.value as BusSeat['type'])}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="STANDARD">Standard Reclining</option>
                    <option value="SLEEPER">Sleeper Capsule Pod</option>
                    <option value="RECLINING_MASSAGE">Reclining Massage</option>
                    <option value="LEG_REST">Leg Rest VIP</option>
                    <option value="WHEELCHAIR_ACCESSIBLE">Akses Kursi Roda (Difabel)</option>
                  </select>
                </div>

                {selectedSeat.passengerName && (
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-500">Penumpang Terdaftar:</span>
                    <div className="font-bold text-white text-xs mt-0.5">{selectedSeat.passengerName}</div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center space-y-2">
              <Armchair className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">
                Klik kursi mana saja pada denah kabin bus di samping untuk mengedit status, tipe kursi, atau reservasi.
              </p>
            </div>
          )}
        </div>

        {/* Right 8 Cols: Interactive Visual Bus Layout Frame */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">Kabin Depan Bus (Front Windshield)</span>
              <h4 className="text-sm font-bold text-white">
                {selectedClass.replace(/_/g, ' ')} • {activeDeck} Deck
              </h4>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-[11px] flex-wrap">
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500 inline-block"></span> Tersedia
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-3 h-3 rounded bg-cyan-500/40 border border-cyan-400 inline-block"></span> Terisi (Booked)
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-3 h-3 rounded bg-rose-500/40 border border-rose-400 inline-block"></span> Blocked (Kru)
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-3 h-3 rounded bg-amber-500/40 border border-amber-400 inline-block"></span> Reserved
              </span>
            </div>
          </div>

          {/* Cabin Layout Canvas */}
          <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800/80 max-w-xl mx-auto shadow-inner relative">
            {/* Front Driver Area Indicator */}
            <div className="mb-6 flex justify-between items-center px-4 py-2 bg-slate-900 rounded-xl border border-slate-800 text-[11px]">
              <span className="text-slate-400 font-mono">Pintu Depan (Jalur Naik)</span>
              <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-bold border border-blue-800">
                Area Kemudi Supir
              </span>
            </div>

            {/* Seats Grid */}
            <div className="space-y-3">
              {visibleSeats.map((seat) => {
                const isSelected = selectedSeat?.seatNumber === seat.seatNumber;
                let bgClass = 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20';
                if (seat.status === 'OCCUPIED' || seat.status === 'BOARDED') {
                  bgClass = 'bg-cyan-950/60 border-cyan-500/60 text-cyan-300 hover:bg-cyan-500/20';
                } else if (seat.status === 'BLOCKED_CREW') {
                  bgClass = 'bg-rose-950/60 border-rose-500/60 text-rose-300';
                } else if (seat.status === 'RESERVED_AGENT') {
                  bgClass = 'bg-amber-950/60 border-amber-500/60 text-amber-300';
                }

                return (
                  <button
                    key={seat.seatNumber}
                    onClick={() => handleSeatClick(seat)}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between w-full ${bgClass} ${
                      isSelected ? 'ring-2 ring-cyan-400 shadow-lg shadow-cyan-950/60 scale-[1.02]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-center font-mono font-black text-xs">
                        {seat.seatNumber}
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-white">{seat.type.replace(/_/g, ' ')}</div>
                        <div className="text-[10px] text-slate-400">
                          {seat.position} • {seat.passengerName || 'Belum Terisi'}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                        {seat.status}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Rear Area Toilet / Emergency Door Indicator */}
            <div className="mt-6 flex justify-between items-center px-4 py-2 bg-slate-900 rounded-xl border border-slate-800 text-[11px]">
              <span className="text-slate-400 font-mono">Toilet Kabin Belakang</span>
              <span className="text-rose-400 font-bold">Pintu Darurat Belakang</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
