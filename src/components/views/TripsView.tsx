import React from 'react';
import { useFleet } from '../../context/FleetContext';
import { Badge } from '../common/Badge';
import { Navigation, Plus, MapPin, Clock, Truck, User } from 'lucide-react';

export const TripsView: React.FC = () => {
  const { trips, vehicles, drivers } = useFleet();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Manajemen Perjalanan (Trips) & Dispatch</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Penjadwalan rute pengiriman, pemantauan status muatan, ETA, dan histori perjalanan armada.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-cyan-500 px-3.5 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20">
          <Plus className="h-4 w-4" />
          <span>Buat Dispatch Trip Baru</span>
        </button>
      </div>

      <div className="space-y-4">
        {trips.map((trp) => {
          const veh = vehicles.find((v) => v.id === trp.vehicleId);
          const drv = drivers.find((d) => d.id === trp.driverId);

          return (
            <div
              key={trp.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Navigation className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{trp.tripNumber}</h3>
                    <p className="text-xs text-slate-400">Muatan: {trp.cargoDescription} ({trp.cargoWeightKg.toLocaleString()} KG)</p>
                  </div>
                </div>
                <Badge variant="moving">SEDANG BERLANGSUNG</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2 rounded-xl bg-slate-950/60 p-3.5 border border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Rute Perjalanan:</p>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-slate-400 text-[10px]">Asal (Origin)</p>
                      <p className="font-semibold text-white">{trp.origin}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-slate-400 text-[10px]">Tujuan (Destination)</p>
                      <p className="font-semibold text-white">{trp.destination}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 rounded-xl bg-slate-950/60 p-3.5 border border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Detail Armada & Driver:</p>
                  <div className="flex justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Truck className="h-3.5 w-3.5 text-cyan-400" /> Kendaraan:
                    </span>
                    <span className="font-bold text-white">{veh?.plateNumber || 'B 9482 UTX'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-emerald-400" /> Pengemudi:
                    </span>
                    <span className="font-bold text-white">{drv?.name || 'Sutrisno Hartono'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-amber-400" /> Estimasi Tiba:
                    </span>
                    <span className="font-bold text-amber-300">
                      {new Date(trp.estimatedArrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} WIB
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
