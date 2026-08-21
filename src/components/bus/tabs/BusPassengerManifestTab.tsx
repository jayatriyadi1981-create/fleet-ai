import React, { useState } from 'react';
import { BusTrip, BusTicket } from '../../../modules/bus/types';
import { 
  Users, 
  QrCode, 
  CheckCircle, 
  Search, 
  Printer, 
  Luggage, 
  Utensils, 
  Phone, 
  FileText,
  AlertCircle
} from 'lucide-react';

interface Props {
  trips: BusTrip[];
  tickets: BusTicket[];
}

export const BusPassengerManifestTab: React.FC<Props> = ({ trips, tickets }) => {
  const [selectedTripId, setSelectedTripId] = useState<string>(trips[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [ticketList, setTicketList] = useState<BusTicket[]>(tickets);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  const currentTrip = trips.find(t => t.id === selectedTripId) || trips[0];

  const filteredTickets = ticketList.filter(t => {
    const matchTrip = t.tripId === selectedTripId || !t.tripId;
    const matchSearch = t.passengerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        t.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        t.seatNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchTrip && matchSearch;
  });

  const handleToggleBoarding = (ticketId: string) => {
    setTicketList(prev => prev.map(t => {
      if (t.id === ticketId) {
        const nextStatus = t.status === 'BOARDED' ? 'PAID' : 'BOARDED';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const handleSimulateQrScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      const target = filteredTickets[0];
      if (target) {
        handleToggleBoarding(target.id);
        setScanResult(`QR Boarding Terverifikasi: ${target.passengerName} (Kursi ${target.seatNumber}) - Boarding Sukses!`);
      }
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header & Trip Picker */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Manifest Penumpang & E-Boarding Terminal
          </h3>
          <p className="text-xs text-slate-500">Daftar resmi penumpang (Kemenhub), verifikasi boarding pass, dan label bagasi</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select 
            value={selectedTripId}
            onChange={(e) => setSelectedTripId(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 focus:outline-none"
          >
            {trips.map(t => (
              <option key={t.id} value={t.id}>
                {t.tripCode} - {t.routeName} ({t.busPlateNumber})
              </option>
            ))}
          </select>

          <button 
            onClick={handleSimulateQrScan}
            disabled={scanning}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all shadow-sm"
          >
            <QrCode className="w-4 h-4" /> {scanning ? 'Memindai...' : 'Scan QR Boarding'}
          </button>
        </div>
      </div>

      {scanResult && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            {scanResult}
          </div>
          <button onClick={() => setScanResult(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
        </div>
      )}

      {/* Manifest Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-slate-400 text-[10px] uppercase font-bold">Total Penumpang Terdaftar</span>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {filteredTickets.length} / {currentTrip.totalSeats} Orang
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-slate-400 text-[10px] uppercase font-bold">Sudah Boarding di Bus</span>
          <div className="text-xl font-bold text-emerald-600 mt-1">
            {filteredTickets.filter(t => t.status === 'BOARDED').length} Orang
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-slate-400 text-[10px] uppercase font-bold">Total Berat Bagasi Bawah</span>
          <div className="text-xl font-bold text-blue-600 mt-1">
            {filteredTickets.reduce((acc, t) => acc + (t.baggageWeightKg || 0), 0)} Kg
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-slate-400 text-[10px] uppercase font-bold">Kupon Makan RM Service</span>
          <div className="text-xl font-bold text-amber-600 mt-1">
            {filteredTickets.filter(t => t.mealCouponClaimed).length} Terklaim
          </div>
        </div>
      </div>

      {/* Search Bar & Action */}
      <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari nama penumpang, nomor tiket, atau nomor kursi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
          />
        </div>

        <button 
          onClick={() => window.print()}
          className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
        >
          <Printer className="w-4 h-4" /> Cetak Manifest Kemenhub
        </button>
      </div>

      {/* Manifest Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Kursi</th>
                <th className="py-3 px-4">No. Tiket & NIK</th>
                <th className="py-3 px-4">Nama Penumpang</th>
                <th className="py-3 px-4">Naik / Turun</th>
                <th className="py-3 px-4">Bagasi (Kg) & Tag</th>
                <th className="py-3 px-4">Kupon Makan</th>
                <th className="py-3 px-4">Status Boarding</th>
                <th className="py-3 px-4 text-right">Verifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredTickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-mono font-bold text-sm text-blue-600">
                    {t.seatNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-slate-800 dark:text-slate-200">{t.ticketNumber}</div>
                    <div className="text-[10px] text-slate-400 font-mono">NIK: {t.passengerIdNumber}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      {t.passengerName}
                      <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded">
                        {t.passengerGender === 'MALE' ? 'L' : 'P'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" /> {t.passengerPhone}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      Naik: <span className="text-blue-600">{t.boardingPoint}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Turun: <span className="text-rose-600">{t.dropPoint}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <Luggage className="w-3 h-3 text-blue-500" /> {t.baggageWeightKg} Kg
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">{t.baggageTagNumber || '-'}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    {t.mealCouponClaimed ? (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md flex items-center gap-1 w-fit">
                        <Utensils className="w-3 h-3" /> Diklaim
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Belum Diklaim</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      t.status === 'BOARDED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                    }`}>
                      {t.status === 'BOARDED' ? '✓ Telah Naik Bus' : '⏳ Belum Boarding'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button 
                      onClick={() => handleToggleBoarding(t.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        t.status === 'BOARDED'
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                      }`}
                    >
                      {t.status === 'BOARDED' ? 'Batalkan Boarding' : 'Boarding Penumpang'}
                    </button>
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
