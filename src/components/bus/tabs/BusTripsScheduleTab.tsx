import React, { useState } from 'react';
import { BusTrip, BusClass, BusServiceType } from '../../../modules/bus/types';
import { 
  Bus, 
  Calendar, 
  Clock, 
  MapPin, 
  UserCheck, 
  Plus, 
  Search, 
  Filter, 
  DollarSign,
  Fuel,
  CreditCard,
  Utensils
} from 'lucide-react';

interface Props {
  trips: BusTrip[];
  onSelectTrip: (trip: BusTrip) => void;
  onCreateTrip: (trip: Partial<BusTrip>) => void;
}

export const BusTripsScheduleTab: React.FC<Props> = ({ trips, onSelectTrip, onCreateTrip }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [routeName, setRouteName] = useState('Jakarta (Pulo Gebang) ➔ Solo (Tirtonadi)');
  const [busClass, setBusClass] = useState<BusClass>('SLEEPER_SUITES');
  const [busPlateNumber, setBusPlateNumber] = useState('B 7890 SGA');
  const [busName, setBusName] = useState('Avante H8 Grand Captain #09');
  const [departureTime, setDepartureTime] = useState('18:30');
  const [ticketPrice, setTicketPrice] = useState(450000);
  const [primaryDriverName, setPrimaryDriverName] = useState('Suhartono (Kapt. Tono)');
  const [conductorName, setConductorName] = useState('Bambang Irawan');

  const filteredTrips = trips.filter(t => {
    const matchSearch = t.tripCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        t.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        t.busPlateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        t.primaryDriverName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = selectedServiceType === 'ALL' || t.serviceType === selectedServiceType;
    return matchSearch && matchType;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateTrip({
      tripCode: `PO-${Math.floor(100 + Math.random() * 900)}-TRIP`,
      routeName,
      busClass,
      busPlateNumber,
      busName,
      departureTime,
      ticketPrice,
      totalSeats: busClass === 'SLEEPER_SUITES' ? 22 : busClass === 'FIRST_CLASS_DOUBLE_DECKER' ? 36 : 32,
      bookedSeats: 0,
      primaryDriverName,
      conductorName,
      serviceType: 'AKAP',
      status: 'PLANNED'
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Jadwal & Penugasan Armada (Timetable Dispatch)</h3>
          <p className="text-xs text-slate-500">Kelola jadwal keberangkatan trayek AKAP, AKDP, dan penugasan supir & kru bus</p>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Tambah Jadwal Keberangkatan
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari nomor trip, trayek, plat bus, atau nama supir..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedServiceType}
            onChange={(e) => setSelectedServiceType(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none"
          >
            <option value="ALL">Semua Jenis Layanan</option>
            <option value="AKAP">AKAP (Antar Kota Antar Provinsi)</option>
            <option value="AKDP">AKDP (Antar Kota Dalam Provinsi)</option>
            <option value="PARIWISATA">Pariwisata & Charter</option>
            <option value="BRT_CITY_BUS">BRT / City Bus</option>
          </select>
        </div>
      </div>

      {/* Trips Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">Trip Code & Kelas</th>
                <th className="py-3.5 px-4">Trayek & Terminal</th>
                <th className="py-3.5 px-4">Armada & Body</th>
                <th className="py-3.5 px-4">Kru (Supir & Kondektur)</th>
                <th className="py-3.5 px-4">Uang Jalan & BBM</th>
                <th className="py-3.5 px-4">Keterisian Kursi</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredTrips.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-blue-600 dark:text-blue-400 text-xs">
                      {t.tripCode}
                    </div>
                    <span className="inline-block mt-0.5 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded text-[10px] font-bold">
                      {t.busClass.replace(/_/g, ' ')}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-semibold">
                      Rp {t.ticketPrice.toLocaleString()}/kursi
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{t.routeName}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400" /> Jam: <strong>{t.departureTime} WIB</strong>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[200px]">
                      {t.departureTerminal}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-200">{t.busPlateNumber}</div>
                    <div className="text-[11px] text-slate-500">{t.busName}</div>
                    <div className="text-[10px] text-slate-400">{t.chassisType}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <UserCheck className="w-3 h-3 text-emerald-600" /> {t.primaryDriverName}
                    </div>
                    <div className="text-[11px] text-slate-500">Cad: {t.secondaryDriverName}</div>
                    <div className="text-[10px] text-slate-400">Kernet: {t.conductorName}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      UJS: Rp {t.ujsAmount.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Fuel className="w-3 h-3 text-amber-500" /> Solar: {t.allocatedFuelLiters} L
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <CreditCard className="w-3 h-3 text-blue-500" /> E-Toll: Rp {t.tollCardBalance.toLocaleString()}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {t.bookedSeats} / {t.totalSeats} Kursi
                    </div>
                    <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-1 overflow-hidden">
                      <div 
                        className="bg-blue-600 h-full rounded-full"
                        style={{ width: `${(t.bookedSeats / t.totalSeats) * 100}%` }}
                      />
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      t.status === 'IN_TRANSIT'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                        : t.status === 'BOARDING'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {t.status.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button 
                      onClick={() => onSelectTrip(t)}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold transition-all"
                    >
                      Detail & Manifest
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Bus className="w-5 h-5 text-blue-600" />
                Tambah Jadwal Keberangkatan Bus
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Trayek / Rute Keberangkatan</label>
                <input 
                  type="text"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Kelas Bus</label>
                  <select 
                    value={busClass}
                    onChange={(e) => setBusClass(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="SLEEPER_SUITES">Sleeper Suites Class (22 Seat)</option>
                    <option value="FIRST_CLASS_DOUBLE_DECKER">Double Decker Tingkat (36 Seat)</option>
                    <option value="SUPER_EXECUTIVE">Super Executive (28 Seat)</option>
                    <option value="EXECUTIVE">Executive (32 Seat)</option>
                    <option value="VIP">VIP Class (36 Seat)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Jam Berangkat</label>
                  <input 
                    type="time"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Nomor Plat Polisi</label>
                  <input 
                    type="text"
                    value={busPlateNumber}
                    onChange={(e) => setBusPlateNumber(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Nama Body & No Pintu</label>
                  <input 
                    type="text"
                    value={busName}
                    onChange={(e) => setBusName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Tarif Tiket (Rp)</label>
                  <input 
                    type="number"
                    value={ticketPrice}
                    onChange={(e) => setTicketPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Supir Utama (Driver 1)</label>
                  <input 
                    type="text"
                    value={primaryDriverName}
                    onChange={(e) => setPrimaryDriverName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-md"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
