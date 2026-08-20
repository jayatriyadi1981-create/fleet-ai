import React, { useState } from 'react';
import { RentalCalendarEvent, RentalVehicle } from '../../modules/rent-car/types';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Car, 
  User, 
  Clock, 
  Filter, 
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface RentalCalendarTabProps {
  events: RentalCalendarEvent[];
  vehicles: RentalVehicle[];
  onSelectBooking?: (bookingId: string) => void;
}

export const RentalCalendarTab: React.FC<RentalCalendarTabProps> = ({ events, vehicles, onSelectBooking }) => {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(7); // August 2026
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const monthNames = [
    'Januari 2026', 'Februari 2026', 'Maret 2026', 'April 2026',
    'Mei 2026', 'Juni 2026', 'Juli 2026', 'Agustus 2026',
    'September 2026', 'Oktober 2026', 'November 2026', 'Desember 2026'
  ];

  // 31 days for August
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  const filteredVehicles = vehicles.filter((v) => {
    if (filterCategory === 'all') return true;
    return v.category === filterCategory;
  });

  return (
    <div className="space-y-4">
      {/* Calendar Control Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Rental Gantt Calendar Timeline
            </h2>
            <p className="text-xs text-slate-400">
              Jadwal ketersediaan armada, reservasi aktif, dan pengembalian unit secara visual.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setCurrentMonthIndex((prev) => Math.max(0, prev - 1))}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-cyan-400 font-mono">
              {monthNames[currentMonthIndex]}
            </span>
            <button
              onClick={() => setCurrentMonthIndex((prev) => Math.min(11, prev + 1))}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Semua Kategori</option>
            <option value="mpv">MPV Family</option>
            <option value="luxury">Luxury VIP</option>
            <option value="suv">SUV Tough</option>
            <option value="ev">Electric Vehicle</option>
          </select>
        </div>
      </div>

      {/* Legend Indicators */}
      <div className="flex flex-wrap items-center gap-4 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-emerald-500"></div>
          <span>Active Rental (On Road)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-cyan-500"></div>
          <span>Confirmed Booking</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-rose-500"></div>
          <span>Overdue Return</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-amber-500"></div>
          <span>Maintenance / Service</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-slate-800 border border-slate-700"></div>
          <span>Available (Ready)</span>
        </div>
      </div>

      {/* Gantt Timeline Grid */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[10px] text-slate-400 font-mono">
                <th className="p-3.5 sticky left-0 z-20 bg-slate-950 w-64 border-r border-slate-800">
                  Armada & Plat Nomor
                </th>
                {daysInMonth.map((day) => (
                  <th key={day} className={`p-2 text-center border-r border-slate-800/60 min-w-[36px] ${
                    day === 20 ? 'bg-cyan-500/20 text-cyan-400 font-bold' : ''
                  }`}>
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredVehicles.map((vehicle) => {
                const vehicleEvents = events.filter((e) => e.vehicleId === vehicle.id);

                return (
                  <tr key={vehicle.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5 sticky left-0 z-10 bg-slate-900 border-r border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 shrink-0">
                          <Car className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <span className="font-bold text-white block text-xs truncate">
                            {vehicle.brand} {vehicle.model}
                          </span>
                          <span className="font-mono text-[10px] text-cyan-400 font-bold">
                            {vehicle.plateNumber}
                          </span>
                        </div>
                      </div>
                    </td>

                    {daysInMonth.map((day) => {
                      // Mock active span for visualization
                      const isRentedDay = (vehicle.status === 'rented' && day >= 18 && day <= 21) ||
                                          (vehicle.status === 'overdue' && day >= 17 && day <= 20);
                      const isToday = day === 20;

                      return (
                        <td
                          key={day}
                          className={`p-1 text-center border-r border-slate-800/40 relative h-14 ${
                            isToday ? 'bg-cyan-500/5' : ''
                          }`}
                        >
                          {isRentedDay && (
                            <div
                              title={`${vehicle.plateNumber} sedang disewa`}
                              className={`w-full h-8 rounded flex items-center justify-center text-[10px] font-bold font-mono shadow-md ${
                                vehicle.status === 'overdue'
                                  ? 'bg-rose-500 text-white animate-pulse'
                                  : 'bg-emerald-500 text-slate-950'
                              }`}
                            >
                              {day === 18 ? 'RENT' : ''}
                            </div>
                          )}
                          {!isRentedDay && vehicle.status === 'maintenance' && day >= 19 && day <= 22 && (
                            <div className="w-full h-8 rounded bg-amber-500/30 border border-amber-500 text-amber-300 flex items-center justify-center text-[9px] font-bold">
                              SERV
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
