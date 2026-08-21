import React, { useState } from 'react';
import { BusTrip } from '../../../modules/bus/types';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Fuel, 
  CreditCard, 
  Users, 
  Coins, 
  FileSpreadsheet, 
  Sparkles
} from 'lucide-react';

interface Props {
  trips: BusTrip[];
}

export const BusProfitabilityCostTab: React.FC<Props> = ({ trips }) => {
  const [selectedRouteFilter, setSelectedRouteFilter] = useState<string>('ALL');

  // Calculate high-level financial metrics from BusTrip properties
  const totalRevenue = trips.reduce((acc, t) => acc + (t.ticketPrice * t.bookedSeats), 0);
  const totalFuelCost = trips.reduce((acc, t) => acc + (t.allocatedFuelLiters * 13500), 0);
  const totalTollCost = trips.reduce((acc, t) => acc + Math.round(t.ujsAmount * 0.35), 0);
  const totalCrewAllowance = trips.reduce((acc, t) => acc + t.estimatedMealAllowance, 0);
  const totalCargoRevenue = trips.reduce((acc, t) => acc + Math.round(t.ticketPrice * 2.2), 0);
  const totalCost = totalFuelCost + totalTollCost + totalCrewAllowance;
  const netProfit = totalRevenue + totalCargoRevenue - totalCost;
  const marginPct = totalRevenue > 0 ? ((netProfit / (totalRevenue + totalCargoRevenue)) * 100).toFixed(1) : '0';

  const filteredTrips = trips.filter(t => 
    selectedRouteFilter === 'ALL' || t.routeName.includes(selectedRouteFilter)
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            Analitik Profitabilitas, Biaya Operasional (UJS/BBM) & RASK PO Bus
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Kalkulasi pendapatan tiket, paket kargo, biaya solar, e-toll Trans-Jawa, uang jalan kru & margin per ritase
          </p>
        </div>

        <button
          onClick={() => alert('Laporan Finansial P&L Operasional PO Bus berhasil diexport ke format XLSX/PDF.')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-950/30"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Export Laporan Keuangan P&L
        </button>
      </div>

      {/* KPI Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1.5 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Omzet Pendapatan</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-white font-mono">
            Rp {(totalRevenue + totalCargoRevenue).toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-emerald-400 font-medium">Tiket Rp {totalRevenue.toLocaleString('id-ID')} + Kargo Rp {totalCargoRevenue.toLocaleString('id-ID')}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1.5 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Biaya Operasional (UJS)</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-rose-400 font-mono">
            Rp {totalCost.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-slate-400">BBM + Tol Trans-Jawa + Premi Supir</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1.5 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Laba Bersih (Net Profit)</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-cyan-300 font-mono">
            Rp {netProfit.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-cyan-400 font-medium">Margin Operasional: {marginPct}%</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1.5 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Rata-Rata RASK / KM</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-white font-mono">
            Rp 1.150 / Kursi-KM
          </div>
          <p className="text-[11px] text-slate-400">CASK Operasional: Rp 640 / KM</p>
        </div>
      </div>

      {/* Cost Breakdown Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Fuel className="w-4 h-4 text-amber-400" />
            Struktur Biaya Solar BBM
          </h3>
          <div className="text-lg font-black text-amber-400 font-mono">
            Rp {totalFuelCost.toLocaleString('id-ID')}
          </div>
          <p className="text-xs text-slate-400">
            Mencakup ~42% dari total pengeluaran UJS ritase. Rata-rata konsumsi armada 1 Liter : 3.8 KM.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-cyan-400" />
            Struktur Biaya E-Toll Trans-Jawa
          </h3>
          <div className="text-lg font-black text-cyan-400 font-mono">
            Rp {totalTollCost.toLocaleString('id-ID')}
          </div>
          <p className="text-xs text-slate-400">
            Mencakup ~33% dari pengeluaran UJS (Golongan 2 Bus Tol Cikampek - Brebes - Semarang - Surabaya).
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-purple-400" />
            Premi Supir & Uang Makan Kru
          </h3>
          <div className="text-lg font-black text-purple-400 font-mono">
            Rp {totalCrewAllowance.toLocaleString('id-ID')}
          </div>
          <p className="text-xs text-slate-400">
            Mencakup ~25% (Uang makan supir 1, supir 2, kondektur, dan hostess layanan kabin).
          </p>
        </div>
      </div>

      {/* Trips Profitability Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Tabel Profit & Biaya per Ritase Bus ({filteredTrips.length} Trip)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Trip & Rute</th>
                <th className="py-3 px-4">Bus & Kelas</th>
                <th className="py-3 px-4">Pendapatan Tiket + Kargo</th>
                <th className="py-3 px-4">Pengeluaran UJS (BBM/Tol)</th>
                <th className="py-3 px-4">Profit Bersih</th>
                <th className="py-3 px-4 text-right">Margin %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTrips.map((t) => {
                const tripTicketRev = t.ticketPrice * t.bookedSeats;
                const tripCargoRev = Math.round(t.ticketPrice * 2.2);
                const tripRev = tripTicketRev + tripCargoRev;
                const tripFuel = t.allocatedFuelLiters * 13500;
                const tripToll = Math.round(t.ujsAmount * 0.35);
                const tripCrew = t.estimatedMealAllowance;
                const tripCost = tripFuel + tripToll + tripCrew;
                const tripProfit = tripRev - tripCost;
                const tripMargin = tripRev > 0 ? ((tripProfit / tripRev) * 100).toFixed(1) : '0';

                return (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-medium">
                      <div className="font-bold text-white text-sm">{t.tripCode}</div>
                      <div className="text-slate-400 text-[11px]">{t.routeName}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-cyan-300">{t.busPlateNumber}</div>
                      <div className="text-slate-400 text-[11px]">{t.busClass.replace(/_/g, ' ')}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-emerald-400">Rp {tripRev.toLocaleString('id-ID')}</div>
                      <div className="text-[10px] text-slate-500">Kargo: Rp {tripCargoRev.toLocaleString('id-ID')}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-rose-400">Rp {tripCost.toLocaleString('id-ID')}</div>
                      <div className="text-[10px] text-slate-500">Solar: Rp {tripFuel.toLocaleString('id-ID')} • Tol: Rp {tripToll.toLocaleString('id-ID')}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-cyan-300 text-sm">Rp {tripProfit.toLocaleString('id-ID')}</div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {tripMargin}%
                      </span>
                    </td>
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
