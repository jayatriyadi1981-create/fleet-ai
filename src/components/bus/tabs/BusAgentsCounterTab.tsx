import React, { useState } from 'react';
import { BusAgentCounter } from '../../../modules/bus/types';
import { 
  Store, 
  Search, 
  DollarSign, 
  CheckCircle, 
  Building2, 
  Phone, 
  MapPin, 
  CreditCard,
  Percent
} from 'lucide-react';

interface Props {
  agents: BusAgentCounter[];
}

export const BusAgentsCounterTab: React.FC<Props> = ({ agents: initialAgents }) => {
  const [agents, setAgents] = useState<BusAgentCounter[]>(initialAgents);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSettle = (agentId: string) => {
    setAgents(prev => prev.map(a => {
      if (a.id === agentId) {
        return {
          ...a,
          cashDepositStatus: 'SETTLED'
        };
      }
      return a;
    }));
  };

  const filteredAgents = agents.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.agentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalTurnover = agents.reduce((acc, a) => acc + a.dailyTurnoverAmount, 0);
  const totalTickets = agents.reduce((acc, a) => acc + a.dailyTicketSalesCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <Store className="w-5 h-5 text-blue-600" />
          Manajemen Loket Agen & Terminal Ticketing POS
        </h3>
        <p className="text-xs text-slate-500">Kelola jaringan agen resmi penjualan tiket, setoran kasir, dan komisi agen</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold">Total Omzet Penjualan Tiket Agen</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Rp {totalTurnover.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Hari Ini dari seluruh perwakilan</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold">Total Lembar Tiket Terjual</span>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {totalTickets} Lembar
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Via POS loket & online agen</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold">Status Setoran Kasir</span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            92% Selesai
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Rekonsiliasi bank otomatis</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari kode agen, nama loket, kota, atau PIC agen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* Agents Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">Kode & Nama Agen</th>
                <th className="py-3.5 px-4">Lokasi & Kota</th>
                <th className="py-3.5 px-4">Kontak PIC</th>
                <th className="py-3.5 px-4">Penjualan Hari Ini</th>
                <th className="py-3.5 px-4">Komisi (%)</th>
                <th className="py-3.5 px-4">Plafon Deposit</th>
                <th className="py-3.5 px-4">Status Setoran</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredAgents.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-blue-600">{a.agentCode}</div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{a.name}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{a.city}</div>
                    <div className="text-[11px] text-slate-500">{a.locationName}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{a.contactPerson}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" /> {a.phone}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">
                      Rp {a.dailyTurnoverAmount.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-slate-500">{a.dailyTicketSalesCount} Tiket Terjual</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-bold rounded text-xs">
                      {a.commissionPercentage}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    Rp {a.depositBalance.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      a.cashDepositStatus === 'SETTLED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                    }`}>
                      {a.cashDepositStatus === 'SETTLED' ? '✓ Setoran Selesai' : '⏳ Menunggu Setoran'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {a.cashDepositStatus !== 'SETTLED' ? (
                      <button 
                        onClick={() => handleSettle(a.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
                      >
                        Verifikasi Setoran
                      </button>
                    ) : (
                      <span className="text-emerald-600 text-xs font-bold">✓ Klir</span>
                    )}
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
