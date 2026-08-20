import React from 'react';
import { VehicleTripRecord } from '../../../types/vehicle';
import { MapPin, Navigation, Clock, Gauge, Fuel, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

interface TripsTabProps {
  trips: VehicleTripRecord[];
  onTrackTrip?: (tripId: string) => void;
}

export const TripsTab: React.FC<TripsTabProps> = ({ trips }) => {
  const totalKm = trips.reduce((acc, t) => acc + (t.distanceKm || 0), 0);
  const totalFuel = trips.reduce((acc, t) => acc + (t.fuelConsumedLiters || 0), 0);
  const avgEfficiency = totalFuel > 0 ? (totalKm / totalFuel).toFixed(1) : '3.8';

  return (
    <div className="space-y-6">
      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Perjalanan</p>
          <p className="text-xl font-mono font-bold text-white">{trips.length} Rute</p>
          <p className="text-[10px] text-cyan-400">Riwayat Terarsip</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Jarak Tempuh</p>
          <p className="text-xl font-mono font-bold text-cyan-300">{totalKm.toLocaleString('id-ID')} KM</p>
          <p className="text-[10px] text-slate-400">Akumulasi Dispatch</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Konsumsi BBM</p>
          <p className="text-xl font-mono font-bold text-emerald-400">{totalFuel.toLocaleString('id-ID')} L</p>
          <p className="text-[10px] text-slate-400">Rata-rata: {avgEfficiency} KM/L</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status In-Transit</p>
          <p className="text-xl font-mono font-bold text-purple-400">
            {trips.filter((t) => t.status === 'in_progress').length} Aktif
          </p>
          <p className="text-[10px] text-emerald-400">Operasional Lancar</p>
        </div>
      </div>

      {/* Trips List */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <MapPin className="h-4 w-4 text-cyan-400" />
            Daftar Manifest & Riwayat Perjalanan
          </h3>
          <span className="text-xs text-slate-400">Menampilkan {trips.length} perjalanan</span>
        </div>

        {trips.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center space-y-2">
            <MapPin className="mx-auto h-8 w-8 text-slate-600" />
            <p className="text-xs text-slate-400">Belum ada data perjalanan untuk unit armada ini.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 text-xs font-mono font-bold text-cyan-300">
                      {trip.tripNumber}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        trip.status === 'in_progress'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse'
                          : trip.status === 'completed'
                          ? 'bg-slate-800 text-slate-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      ● {trip.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-slate-500" />
                    <span>{new Date(trip.departureTime).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                {/* Route Points */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 ring-2 ring-cyan-400/20" />
                      <span>{trip.originName}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-500 mx-1 shrink-0" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/20" />
                      <span>{trip.destinationName}</span>
                    </div>

                    <p className="text-[11px] text-slate-400 pl-4.5">
                      Driver: <strong className="text-slate-200">{trip.driverName}</strong> • Muatan:{' '}
                      <span className="text-cyan-300">{trip.cargoDescription}</span> ({trip.cargoWeightKg.toLocaleString('id-ID')} KG)
                    </p>
                  </div>

                  {/* Trip Stats Badges */}
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <div className="rounded-lg bg-slate-900 px-3 py-1.5 border border-slate-800 text-center">
                      <p className="text-[10px] text-slate-400 font-bold">JARAK</p>
                      <p className="font-mono font-bold text-white">{trip.distanceKm} KM</p>
                    </div>

                    <div className="rounded-lg bg-slate-900 px-3 py-1.5 border border-slate-800 text-center">
                      <p className="text-[10px] text-slate-400 font-bold">DURASI</p>
                      <p className="font-mono font-bold text-white">{Math.floor(trip.durationMinutes / 60)}j {trip.durationMinutes % 60}m</p>
                    </div>

                    <div className="rounded-lg bg-slate-900 px-3 py-1.5 border border-slate-800 text-center">
                      <p className="text-[10px] text-slate-400 font-bold">BBM</p>
                      <p className="font-mono font-bold text-emerald-400">{trip.fuelConsumedLiters} L</p>
                    </div>

                    <div className="rounded-lg bg-slate-900 px-3 py-1.5 border border-slate-800 text-center">
                      <p className="text-[10px] text-slate-400 font-bold">AVG SPEED</p>
                      <p className="font-mono font-bold text-cyan-300">{trip.avgSpeedKm} KM/H</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
