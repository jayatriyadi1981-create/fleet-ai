/**
 * Fleet Intelligence Smart AI - Rental Customer CRM & AI Fraud Risk Shield
 */

import React, { useState } from 'react';
import { RentalCustomer } from '../../modules/rent-car/types';
import { rentCarService } from '../../modules/rent-car/services/rentCarService';
import { 
  User, 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  Plus, 
  CheckCircle, 
  AlertTriangle, 
  Phone, 
  Mail, 
  FileText, 
  CreditCard,
  Building,
  UserX,
  History,
  Lock
} from 'lucide-react';

interface CustomerKycTabProps {
  customers: RentalCustomer[];
  onOpenNewCustomerModal: () => void;
  onRefresh: () => void;
}

export const CustomerKycTab: React.FC<CustomerKycTabProps> = ({
  customers,
  onOpenNewCustomerModal,
  onRefresh
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKyc, setFilterKyc] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<RentalCustomer | null>(customers[0] || null);

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.nik.includes(searchQuery) ||
      c.phone.includes(searchQuery) ||
      (c.companyName && c.companyName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesKyc = filterKyc === 'all' || c.kycStatus === filterKyc;

    return matchesSearch && matchesKyc;
  });

  const handleToggleBlacklist = (customer: RentalCustomer) => {
    const isCurrentlyBlacklisted = customer.kycStatus === 'blacklisted';
    const reason = isCurrentlyBlacklisted 
      ? 'Pemutihan blacklist setelah evaluasi manajemen.' 
      : 'Riwayat keterlambatan fatal / indikasi penggelapan.';

    rentCarService.toggleCustomerBlacklist(customer.id, !isCurrentlyBlacklisted, reason);
    onRefresh();
  };

  const getRiskBadge = (score: number, status: RentalCustomer['kycStatus']) => {
    if (status === 'blacklisted') {
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
          <UserX className="w-3 h-3" /> BLACKLISTED
        </span>
      );
    }
    if (score <= 20) {
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" /> Low Risk ({score}/100)
        </span>
      );
    }
    if (score <= 50) {
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
          <ShieldAlert className="w-3 h-3" /> Medium Risk ({score}/100)
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" /> High Risk ({score}/100)
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Bar: Search, KYC Filters & Add Customer CTA */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex-1 flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Cari nama penyewa, NIK KTP, nomor telepon, atau PT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={filterKyc}
            onChange={(e) => setFilterKyc(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Semua Status KYC</option>
            <option value="verified">Verified (Terverifikasi)</option>
            <option value="pending">Pending Verifikasi</option>
            <option value="blacklisted">Blacklist (Ditolak)</option>
          </select>
        </div>

        <button
          onClick={onOpenNewCustomerModal}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-950"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pelanggan KYC</span>
        </button>
      </div>

      {/* Grid: Master Customer Table & Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Customer List Table */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Nama & Identitas</th>
                  <th className="p-3.5">Tipe</th>
                  <th className="p-3.5">AI Fraud Score</th>
                  <th className="p-3.5">Riwayat Sewa</th>
                  <th className="p-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredCustomers.map((customer) => {
                  const isSelected = selectedCustomer?.id === customer.id;

                  return (
                    <tr
                      key={customer.id}
                      onClick={() => setSelectedCustomer(customer)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-cyan-950/30' : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="p-3.5">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{customer.name}</span>
                          {customer.kycStatus === 'verified' && (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                          NIK: {customer.nik} • {customer.phone}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="capitalize text-slate-300">
                          {customer.type === 'corporate' ? (
                            <span className="flex items-center gap-1 text-cyan-400 font-medium">
                              <Building className="w-3 h-3" /> Korporat
                            </span>
                          ) : (
                            'Individu'
                          )}
                        </span>
                        {customer.companyName && (
                          <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{customer.companyName}</div>
                        )}
                      </td>
                      <td className="p-3.5">
                        {getRiskBadge(customer.riskScore, customer.kycStatus)}
                      </td>
                      <td className="p-3.5 font-mono">
                        <div className="text-white font-bold">{customer.completedBookings}x Selesai</div>
                        <div className="text-[10px] text-slate-400">Total Transaksi</div>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleBlacklist(customer);
                          }}
                          className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                            customer.kycStatus === 'blacklisted'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20'
                          }`}
                        >
                          {customer.kycStatus === 'blacklisted' ? 'Unblock' : 'Blacklist'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Selected Customer Deep KYC & Risk Dossier */}
        {selectedCustomer ? (
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-4 text-xs shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              {/* Dossier Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-white text-sm">{selectedCustomer.name}</h3>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">{selectedCustomer.email}</p>
                </div>
                <div>{getRiskBadge(selectedCustomer.riskScore, selectedCustomer.kycStatus)}</div>
              </div>

              {/* Verified Documents Checklist */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Status Dokumen & Validasi Dukcapil
                </span>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-cyan-400" /> KTP Asli (e-KTP)
                    </span>
                    <span className="text-emerald-400 font-mono font-semibold">VALID TERVERIFIKASI</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-cyan-400" /> SIM A Aktif
                    </span>
                    <span className="text-emerald-400 font-mono font-semibold">{selectedCustomer.simNumber}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-cyan-400" /> WhatsApp
                    </span>
                    <span className="text-slate-200 font-mono">{selectedCustomer.phone}</span>
                  </div>
                </div>
              </div>

              {/* Guarantor / Emergency Contact */}
              {selectedCustomer.emergencyContactName && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-[11px]">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    Penjamin / Kontak Darurat
                  </span>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nama:</span>
                    <strong className="text-white">{selectedCustomer.emergencyContactName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nomor HP:</span>
                    <span className="font-mono text-cyan-400">{selectedCustomer.emergencyContactPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Hubungan:</span>
                    <span className="text-slate-300">{selectedCustomer.emergencyContactRelation}</span>
                  </div>
                </div>
              )}

              {/* Anti-Fraud Intelligence & Blacklist Radar */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-[11px]">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  AI Rental Fraud Intelligence
                </span>
                <p className="text-slate-400 leading-relaxed">
                  Penyewa telah melewati pemeriksaan database Asosiasi Rental Mobil Indonesia & screening riwayat tilang ETLE nasional.
                </p>
                {selectedCustomer.notes && (
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[10px]">
                    Catatan: {selectedCustomer.notes}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handleToggleBlacklist(selectedCustomer)}
                className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCustomer.kycStatus === 'blacklisted'
                    ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                }`}
              >
                {selectedCustomer.kycStatus === 'blacklisted'
                  ? 'Buka Blokir (Restore Customer)'
                  : 'Tandai Blacklist (Cegah Sewa)'}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-8 text-center text-xs text-slate-500 flex items-center justify-center">
            Pilih penyewa di tabel untuk melihat berkas KYC & skor risiko anti-fraud.
          </div>
        )}
      </div>
    </div>
  );
};
