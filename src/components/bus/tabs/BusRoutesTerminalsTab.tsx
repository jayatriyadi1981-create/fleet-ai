import React, { useState } from 'react';
import { BusTrip, BusStopLocation } from '../../../modules/bus/types';
import { 
  Waypoints, 
  MapPin, 
  Building2, 
  Utensils, 
  Clock, 
  Search, 
  Navigation,
  Compass
} from 'lucide-react';

interface Props {
  trips: BusTrip[];
}

export const BusRoutesTerminalsTab: React.FC<Props> = ({ trips }) => {
  const [selectedTrip, setSelectedTrip] = useState<BusTrip>(trips[0]);

  return (
    <div className="space-y-6">
      {/* Header & Route Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Waypoints className="w-5 h-5 text-blue-600" />
            Trayek, Titik Terminal & Rest Area Tol Trans-Jawa
          </h3>
          <p className="text-xs text-slate-500">Visualisasi rute perjalanan, titik naik turun agen, dan rumah makan prasmanan gratis</p>
        </div>

        <select 
          value={selectedTrip.id}
          onChange={(e) => {
            const found = trips.find(t => t.id === e.target.value);
            if (found) setSelectedTrip(found);
          }}
          className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 focus:outline-none"
        >
          {trips.map(t => (
            <option key={t.id} value={t.id}>
              {t.tripCode} - {t.routeName}
            </option>
          ))}
        </select>
      </div>

      {/* Main Grid: Route Details & Stops Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Route Overview Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900 space-y-2">
            <div className="text-xs font-mono font-bold text-blue-600">{selectedTrip.tripCode}</div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">{selectedTrip.routeName}</h4>
            <div className="text-xs text-slate-600 dark:text-slate-300">
              Layanan: <strong>{selectedTrip.serviceType}</strong> • Kelas: <strong>{selectedTrip.busClass.replace(/_/g, ' ')}</strong>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Terminal Asal:</span>
              <strong className="text-slate-800 dark:text-slate-200">{selectedTrip.departureTerminal}</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Terminal Tujuan:</span>
              <strong className="text-slate-800 dark:text-slate-200">{selectedTrip.arrivalTerminal}</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Jadwal Keberangkatan:</span>
              <strong className="text-blue-600">{selectedTrip.departureDate} {selectedTrip.departureTime} WIB</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Estimasi Waktu Tiba:</span>
              <strong className="text-emerald-600">{selectedTrip.estimatedArrivalTime} WIB</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Alokasi E-Toll Card:</span>
              <strong className="text-slate-800 dark:text-slate-200">Rp {selectedTrip.tollCardBalance.toLocaleString()}</strong>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900 text-[11px] text-emerald-800 dark:text-emerald-300">
            ✓ Jalur prioritas Tol Trans-Jawa Non-Stop dengan 1x service makan prasmanan gratis.
          </div>
        </div>

        {/* Right 2 Cols: Interactive Stop Timeline */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-600" />
            Urutan Titik Perhentian (Terminal, Agen & Rest Area)
          </h4>

          <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-500">
            {selectedTrip.stops.map((stop, idx) => (
              <div key={stop.id} className="relative group">
                <span className={`w-4 h-4 rounded-full absolute -left-[22px] top-1 border-2 border-white dark:border-slate-900 ${
                  stop.isRestAreaMeal ? 'bg-amber-500' : idx === 0 ? 'bg-blue-600' : idx === selectedTrip.stops.length - 1 ? 'bg-emerald-600' : 'bg-slate-400'
                }`} />

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{stop.name}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        stop.type === 'TERMINAL' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                          : stop.type === 'REST_AREA_RM'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {stop.type.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-blue-600">
                      <Clock className="w-3.5 h-3.5" /> {stop.scheduledTime} WIB
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {stop.address}, {stop.city} (GPS: {stop.coordinates.lat}, {stop.coordinates.lng})
                  </div>

                  {stop.isRestAreaMeal && (
                    <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-lg text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-amber-600" />
                      <strong>Service Makan Penumpang & Kru Bus:</strong> Istirahat 30 menit, prasmanan gratis untuk seluruh pemegang tiket.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
