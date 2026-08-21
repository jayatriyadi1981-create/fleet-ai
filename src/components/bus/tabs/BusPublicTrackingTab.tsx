import React, { useState } from 'react';
import { BusTrip } from '../../../modules/bus/types';
import { 
  Compass, 
  Search, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Wifi, 
  BatteryCharging, 
  Coffee, 
  Armchair, 
  Share2, 
  CheckCircle2, 
  Radio
} from 'lucide-react';

interface Props {
  trips: BusTrip[];
}

export const BusPublicTrackingTab: React.FC<Props> = ({ trips }) => {
  const [ticketSearch, setTicketSearch] = useState('TKT-20260820-9921');
  const [foundTrip, setFoundTrip] = useState<BusTrip | null>(trips[0] || null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate finding matching trip for passenger
    const match = trips.find(t => t.id === 'trip-01') || trips[0];
    setFoundTrip(match);
  };

  const handleShareLink = () => {
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950/50 via-slate-900 to-cyan-950/40 border border-blue-500/30 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              Portal Lacak Publik Penumpang
            </span>
            <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
              <Compass className="w-6 h-6 text-cyan-400" />
              Live Bus Tracking & Estimasi Tiba (ETA)
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Lacak posisi armada bus secara langsung, waktu istirahat Rest Area, dan estimasi waktu sampai di terminal tujuan.
            </p>
          </div>

          <button
            onClick={handleShareLink}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-cyan-950/40 shrink-0"
          >
            <Share2 className="w-3.5 h-3.5" />
            {copySuccess ? 'Link Terdistribusi!' : 'Bagikan Link Lacak ke Keluarga'}
          </button>
        </div>

        {/* Tracking Code Search Box */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Masukkan Nomor Tiket / Kode Booking (Contoh: TKT-20260820-9921)..."
              value={ticketSearch}
              onChange={(e) => setTicketSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono font-bold"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-blue-900/30"
          >
            Lacak Bus
          </button>
        </form>
      </div>

      {foundTrip && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Bus Live Radar Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                    {foundTrip.tripCode}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <Radio className="w-3 h-3 animate-pulse" /> Bus Sedang Berjalan
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1.5">{foundTrip.routeName}</h3>
                <p className="text-xs text-slate-400">Unit Bus: {foundTrip.busName} ({foundTrip.busClass.replace(/_/g, ' ')})</p>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-400">Estimasi Tiba (ETA):</span>
                <div className="text-lg font-black text-cyan-400 font-mono">{foundTrip.estimatedArrivalTime} WIB</div>
              </div>
            </div>

            {/* Current Real-time GPS Position Banner */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  Posisi Terkini Saat Ini:
                </span>
                <span className="text-emerald-400 font-mono font-bold">
                  Kecepatan: {foundTrip.currentSpeedKmH} KM/JAM
                </span>
              </div>
              <p className="text-base font-bold text-white">{foundTrip.currentLocationName}</p>
            </div>

            {/* Route Stepper Timeline */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Titik Pemberhentian & Rest Area Perjalanan
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 font-mono text-[10px]">KEBERANGKATAN (SELESAI)</span>
                  <div className="font-bold text-white">Terminal Pulo Gebang, JKT</div>
                  <div className="text-emerald-400 text-[11px]">Berangkat 07:00 WIB (Tepat Waktu)</div>
                </div>

                <div className="p-3.5 bg-cyan-950/30 rounded-xl border border-cyan-500/30 space-y-1">
                  <span className="text-cyan-400 font-mono text-[10px] font-bold flex items-center gap-1">
                    <Coffee className="w-3 h-3" /> REST AREA BERIKUTNYA
                  </span>
                  <div className="font-bold text-cyan-200">Rest Area KM 207A Tol Palimanan</div>
                  <div className="text-slate-400 text-[11px]">Istirahat Makan & Ibadah (30 Menit)</div>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 font-mono text-[10px]">TUJUAN AKHIR</span>
                  <div className="font-bold text-white">Terminal Bungurasih, Surabaya</div>
                  <div className="text-cyan-400 text-[11px]">Estimasi 17:30 WIB</div>
                </div>
              </div>
            </div>

            {/* Passenger Amenities on Board */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Fasilitas Kabin Bus Tersedia:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1 bg-slate-900 rounded-lg text-slate-300 border border-slate-800 flex items-center gap-1.5">
                  ❄️ AC Sejuk Selama Perjalanan
                </span>
                <span className="px-3 py-1 bg-slate-900 rounded-lg text-slate-300 border border-slate-800 flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-cyan-400" /> Free WiFi On-Board
                </span>
                <span className="px-3 py-1 bg-slate-900 rounded-lg text-slate-300 border border-slate-800 flex items-center gap-1.5">
                  <BatteryCharging className="w-3.5 h-3.5 text-amber-400" /> Port Charger USB di Setiap Kursi
                </span>
                <span className="px-3 py-1 bg-slate-900 rounded-lg text-slate-300 border border-slate-800 flex items-center gap-1.5">
                  🚻 Toilet Kabin Belakang
                </span>
                <span className="px-3 py-1 bg-slate-900 rounded-lg text-slate-300 border border-slate-800 flex items-center gap-1.5">
                  🍱 1x Makan Rest Area Gratis
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
