import React, { useState } from 'react';
import { BusTrip } from '../../../modules/bus/types';
import { 
  DollarSign, 
  Fuel, 
  CreditCard, 
  Utensils, 
  Search, 
  CheckCircle, 
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';

interface Props {
  trips: BusTrip[];
}

export const BusUjsTollFuelTab: React.FC<Props> = ({ trips }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const totalUjs = trips.reduce((acc, t) => acc + t.ujsAmount, 0);
  const totalFuelLiters = trips.reduce((acc, t) => acc + t.allocatedFuelLiters, 0);
  const totalToll = trips.reduce((acc, t) => acc + t.tollCardBalance, 0);

  const filteredTrips = trips.filter(t => 
    t.tripCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.primaryDriverName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-600" />
          Uang Jalan Supir (UJS), Alokasi Solar BBM & E-Toll Trans-Jawa
        </h3>
        <p className="text-xs text-slate-500">Kalkulasi biaya operasional ritase jalan, kuota liter solar bus, saldo kartu tol, dan jatah makan kru/penumpang</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold">Total UJS Dikeluarkan Hari Ini</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Rp {totalUjs.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Untuk {trips.length} ritase perjalanan</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold">Total Alokasi Solar Biosolar/Dex</span>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {totalFuelLiters.toLocaleString()} Liter
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Voucher SPBU Rekanan B2B</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold">Total Saldo E-Toll Terpasang</span>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            Rp {totalToll.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Tol Cipali, Batang, Semarang, Kertosono</p>
        </div>
      </div>

      {/* Trips UJS Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">Trip Code & Armada</th>
                <th className="py-3.5 px-4">Trayek Perjalanan</th>
                <th className="py-3.5 px-4">Driver Penerima UJS</th>
                <th className="py-3.5 px-4">Nominal UJS (Rp)</th>
                <th className="py-3.5 px-4">Solar (Liter)</th>
                <th className="py-3.5 px-4">E-Toll Trans-Jawa</th>
                <th className="py-3.5 px-4">Uang Makan Kru</th>
                <th className="py-3.5 px-4 text-right">Status Kas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredTrips.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-blue-600">{t.tripCode}</div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{t.busPlateNumber}</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    {t.routeName}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{t.primaryDriverName}</div>
                    <div className="text-[11px] text-slate-500">Kernet: {t.conductorName}</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    Rp {t.ujsAmount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-amber-600 flex items-center gap-1">
                      <Fuel className="w-3.5 h-3.5" /> {t.allocatedFuelLiters} L
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-blue-600 flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5" /> Rp {t.tollCardBalance.toLocaleString()}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Utensils className="w-3.5 h-3.5" /> Rp {t.estimatedMealAllowance.toLocaleString()}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                      ✓ UJS DICAIRKAN
                    </span>
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
