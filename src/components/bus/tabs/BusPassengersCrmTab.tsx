import React, { useState } from 'react';
import { BusPassenger } from '../../../modules/bus/types';
import { busService } from '../../../modules/bus/services/busService';
import { 
  Users, 
  Search, 
  Award, 
  Phone, 
  Mail, 
  History, 
  Shield, 
  Eye, 
  EyeOff, 
  UserCheck, 
  Star,
  X
} from 'lucide-react';

export const BusPassengersCrmTab: React.FC = () => {
  const [passengers] = useState<BusPassenger[]>(busService.getPassengers());
  const [search, setSearch] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [showMaskedData, setShowMaskedData] = useState(false);
  const [selectedPassenger, setSelectedPassenger] = useState<BusPassenger | null>(null);

  const filteredPassengers = passengers.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      p.email.toLowerCase().includes(search.toLowerCase());
    const matchTier = selectedTier === 'ALL' || p.membershipTier === selectedTier;
    return matchSearch && matchTier;
  });

  const maskIdCard = (idCard: string) => {
    if (showMaskedData) return idCard;
    if (idCard.length <= 8) return '********';
    return `${idCard.slice(0, 6)}******${idCard.slice(-4)}`;
  };

  const getTierBadge = (tier: BusPassenger['membershipTier']) => {
    switch (tier) {
      case 'VIP_EXECUTIVE':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1"><Star className="w-3 h-3 text-purple-400 fill-purple-400" /> VIP Executive</span>;
      case 'GOLD':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1"><Award className="w-3 h-3 text-amber-400" /> Gold Member</span>;
      case 'SILVER':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-400/20 text-slate-300 border border-slate-400/30">Silver Member</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400">Regular</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Manajemen Pelanggan & Penumpang Bus (Passenger CRM)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Database loyalitas penumpang PO Bus, riwayat perjalanan, poin member, dan proteksi privasi data NIK
          </p>
        </div>

        <button
          onClick={() => setShowMaskedData(!showMaskedData)}
          className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
        >
          {showMaskedData ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-cyan-400" />}
          {showMaskedData ? 'Sensorkan NIK (Masking On)' : 'Buka Masking NIK (RBAC)'}
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
        <div className="relative flex-1 sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari Nama, Nomor HP, Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <select
          value={selectedTier}
          onChange={(e) => setSelectedTier(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
        >
          <option value="ALL">Semua Tier Member</option>
          <option value="VIP_EXECUTIVE">VIP Executive</option>
          <option value="GOLD">Gold Member</option>
          <option value="SILVER">Silver Member</option>
          <option value="REGULAR">Regular</option>
        </select>
      </div>

      {/* Passengers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Nama Penumpang</th>
                <th className="py-3 px-4">Kontak & Email</th>
                <th className="py-3 px-4">NIK KTP (Proteksi Privasi)</th>
                <th className="py-3 px-4">Tier Keanggotaan</th>
                <th className="py-3 px-4">Total Trip & Poin</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPassengers.map((passenger) => (
                <tr key={passenger.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-medium">
                    <div className="font-bold text-white text-sm flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-purple-400" />
                      {passenger.name}
                    </div>
                    <div className="text-[11px] text-slate-500">{passenger.gender === 'MALE' ? 'Laki-laki' : 'Perempuan'}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-slate-200 font-mono flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {passenger.phone}
                    </div>
                    <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-slate-400" />
                      {passenger.email}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-mono text-cyan-300 bg-slate-950 px-2 py-1 rounded w-fit border border-slate-800 text-[11px] flex items-center gap-1">
                      <Shield className="w-3 h-3 text-emerald-400" />
                      {maskIdCard(passenger.idCardNumber)}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">{getTierBadge(passenger.membershipTier)}</td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{passenger.totalTripsCount} Perjalanan</div>
                    <div className="text-amber-400 font-bold text-[11px] mt-0.5">⭐ {passenger.loyaltyPoints} Poin PO</div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedPassenger(passenger)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg text-xs transition-all flex items-center gap-1 ml-auto"
                    >
                      <History className="w-3.5 h-3.5" />
                      Detail Profil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Passenger Profile Modal */}
      {selectedPassenger && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative my-8">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{selectedPassenger.name}</h3>
                  {getTierBadge(selectedPassenger.membershipTier)}
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedPassenger.phone} • {selectedPassenger.email}</p>
              </div>

              <button
                onClick={() => setSelectedPassenger(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Kontak Darurat:</span>
                <span className="font-medium text-white">{selectedPassenger.emergencyContact}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Poin Reward:</span>
                <span className="font-bold text-amber-400">{selectedPassenger.loyaltyPoints} Poin</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>NIK KTP:</span>
                <span className="font-mono text-cyan-300">{maskIdCard(selectedPassenger.idCardNumber)}</span>
              </div>
            </div>

            {/* Recent Trips History */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <History className="w-4 h-4 text-cyan-400" />
                Riwayat Perjalanan Terakhir
              </h4>
              <div className="space-y-2">
                {selectedPassenger.recentTrips.map((rt, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white">{rt.tripCode}</div>
                      <div className="text-slate-400 text-[11px]">{rt.route}</div>
                    </div>
                    <div className="text-right font-mono text-[11px]">
                      <div className="text-cyan-400">Kursi: {rt.seat}</div>
                      <div className="text-slate-500">{rt.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedPassenger(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
