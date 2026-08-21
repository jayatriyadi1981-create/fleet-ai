import React, { useState } from 'react';
import { BusTrip, BusVehicle, BusCrew } from '../../../modules/bus/types';
import { busService } from '../../../modules/bus/services/busService';
import { 
  CalendarClock, 
  Bus, 
  UserCheck, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  ArrowRight, 
  Clock, 
  ShieldAlert, 
  Sparkles,
  Search,
  Filter,
  Check,
  X
} from 'lucide-react';

interface Props {
  trips: BusTrip[];
  onSelectTrip?: (trip: BusTrip) => void;
}

export const BusDispatchSchedulerTab: React.FC<Props> = ({ trips: initialTrips }) => {
  const [trips, setTrips] = useState<BusTrip[]>(initialTrips);
  const [buses] = useState<BusVehicle[]>(busService.getBuses());
  const [crews] = useState<BusCrew[]>(busService.getCrews());
  const [selectedTrip, setSelectedTrip] = useState<BusTrip | null>(null);
  
  // Dispatch Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedBusId, setSelectedBusId] = useState<string>('');
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');
  const [collisionWarning, setCollisionWarning] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const availableBuses = buses.filter(b => b.status === 'AVAILABLE' || b.status === 'SCHEDULED' || b.id === selectedTrip?.busId);
  const activeDrivers = crews.filter(c => c.role === 'PRIMARY_DRIVER' || c.role === 'SECONDARY_DRIVER');

  const handleOpenAssignModal = (trip: BusTrip) => {
    setSelectedTrip(trip);
    setSelectedBusId(trip.busId || buses[0]?.id || '');
    setSelectedDriverId(trip.primaryDriverId || activeDrivers[0]?.id || '');
    setCollisionWarning(null);
    setIsAssignModalOpen(true);
  };

  const handleValidateAndSaveAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrip) return;

    // Collision check via busService
    const validation = busService.validateBusAndDriverAssignment(
      selectedBusId,
      selectedDriverId,
      selectedTrip.departureDate,
      selectedTrip.departureTime,
      selectedTrip.id
    );

    if (!validation.valid) {
      setCollisionWarning(validation.conflictReason || 'Terdeteksi konflik penugasan!');
      return;
    }

    const assignedBus = buses.find(b => b.id === selectedBusId);
    const assignedDriver = crews.find(c => c.id === selectedDriverId);

    const updatedTrips = trips.map(t => {
      if (t.id === selectedTrip.id) {
        return {
          ...t,
          busId: assignedBus?.id || t.busId,
          busPlateNumber: assignedBus?.plateNumber || t.busPlateNumber,
          busName: assignedBus?.name || t.busName,
          primaryDriverId: assignedDriver?.id || t.primaryDriverId,
          primaryDriverName: assignedDriver?.name || t.primaryDriverName,
          primaryDriverPhone: assignedDriver?.phone || t.primaryDriverPhone,
          status: 'ASSIGNED' as const
        };
      }
      return t;
    });

    setTrips(updatedTrips);
    setIsAssignModalOpen(false);
    setSuccessMessage(`Berhasil menugaskan Bus ${assignedBus?.plateNumber} & Supir ${assignedDriver?.name} untuk Trip ${selectedTrip.tripCode}!`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-indigo-400" />
            Manajemen Dispatch & Penugasan Armada / Kru Supir
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Engine alokasi cerdas dengan pencegahan tabrakan jadwal (*collision check*) dan validasi batas lelah (*fatigue rule*)
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Dispatcher Active: Auto-Sync On
        </div>
      </div>

      {successMessage && (
        <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          {successMessage}
        </div>
      )}

      {/* Main Trips Schedule Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Daftar Ritase Terjadwal ({trips.length} Trip)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Kode & Rute Trip</th>
                <th className="py-3 px-4">Jadwal Keberangkatan</th>
                <th className="py-3 px-4">Armada Ditugaskan</th>
                <th className="py-3 px-4">Kru Supir Utama</th>
                <th className="py-3 px-4">Okupansi Penumpang</th>
                <th className="py-3 px-4">Status Ritase</th>
                <th className="py-3 px-4 text-right">Aksi Dispatch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {trips.map((trip) => (
                <tr key={trip.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-medium">
                    <div className="font-bold text-white text-sm">{trip.tripCode}</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">{trip.routeName}</div>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950 text-cyan-400 border border-slate-800">
                      {trip.busClass.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-200">{trip.departureDate}</div>
                    <div className="text-cyan-400 font-mono text-[11px] flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {trip.departureTime} WIB
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-cyan-300">{trip.busPlateNumber}</div>
                    <div className="text-slate-400 text-[11px] truncate max-w-[140px]">{trip.busName}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                      {trip.primaryDriverName}
                    </div>
                    <div className="text-slate-400 text-[11px] font-mono mt-0.5">{trip.primaryDriverPhone}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">
                      {trip.bookedSeats} / {trip.totalSeats} Kursi
                    </div>
                    <div className="w-24 bg-slate-950 h-1.5 rounded-full overflow-hidden mt-1 border border-slate-800">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, Math.round((trip.bookedSeats / trip.totalSeats) * 100))}%` }}
                      ></div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-950 text-slate-300 border border-slate-800">
                      {trip.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleOpenAssignModal(trip)}
                      className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg text-xs font-bold transition-all border border-indigo-500/30"
                    >
                      Tugaskan / Ganti
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Assign Bus & Driver */}
      {isAssignModalOpen && selectedTrip && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative my-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CalendarClock className="w-5 h-5 text-indigo-400" />
                  Alokasi Dispatch Trip: {selectedTrip.tripCode}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedTrip.routeName}</p>
              </div>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {collisionWarning && (
              <div className="p-3.5 bg-rose-500/20 border border-rose-500/40 text-rose-300 rounded-xl text-xs font-bold flex items-start gap-2 animate-shake">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <div>
                  <div className="font-black text-rose-200">PERINGATAN KONFLIK DISPATCH:</div>
                  <div className="font-normal text-rose-300 mt-0.5">{collisionWarning}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleValidateAndSaveAssignment} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-bold">Pilih Unit Bus Armada</label>
                <select
                  value={selectedBusId}
                  onChange={(e) => {
                    setSelectedBusId(e.target.value);
                    setCollisionWarning(null);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-medium"
                >
                  {availableBuses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.plateNumber} • {b.name} ({b.seatCapacity} Seats - {b.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">Pilih Supir Utama (Primary Driver)</label>
                <select
                  value={selectedDriverId}
                  onChange={(e) => {
                    setSelectedDriverId(e.target.value);
                    setCollisionWarning(null);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-medium"
                >
                  {activeDrivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} • {d.simType} (Fatigue: {d.fatigueScore}/100 - Status: {d.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-[11px] text-slate-400">
                <div className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Validasi Otomatis Dispatch Engine:
                </div>
                <p>✓ Bus tidak boleh overlapping pada jadwal perjalanan aktif lain.</p>
                <p>✓ Supir harus memiliki waktu istirahat minimal sebelum shift berikutnya (Fatigue &lt; 70).</p>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-900/30"
                >
                  Validasi & Simpan Penugasan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
