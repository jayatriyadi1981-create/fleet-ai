import React, { useState } from 'react';
import { RentalContract } from '../../modules/rent-car/types';
import { rentCarService } from '../../modules/rent-car/services/rentCarService';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileCheck, 
  Download, 
  Printer, 
  ShieldCheck, 
  User, 
  Car, 
  Calendar, 
  DollarSign, 
  PenTool,
  Search,
  Check
} from 'lucide-react';

interface RentalContractTabProps {
  contracts: RentalContract[];
  onRefresh: () => void;
}

export const RentalContractTab: React.FC<RentalContractTabProps> = ({ contracts, onRefresh }) => {
  const [selectedContract, setSelectedContract] = useState<RentalContract | null>(contracts[0] || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isSigning, setIsSigning] = useState(false);

  const filteredContracts = contracts.filter((c) => {
    const matchesSearch = 
      c.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSign = (type: 'customer' | 'staff') => {
    if (!selectedContract) return;
    setIsSigning(true);
    setTimeout(() => {
      rentCarService.signContract(selectedContract.id, type, 'Staff Rental Officer');
      onRefresh();
      const updated = rentCarService.getContractById(selectedContract.id);
      if (updated) setSelectedContract(updated);
      setIsSigning(false);
    }, 600);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Contract List */}
      <div className="lg:col-span-5 space-y-3">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Daftar Kontrak Digital
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
              {filteredContracts.length} Kontrak
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nomor kontrak, penyewa, plat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-2.5 py-2 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">Semua Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="closed">Closed</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
          {filteredContracts.map((c) => {
            const isSelected = selectedContract?.id === c.id;
            return (
              <div
                key={c.id}
                onClick={() => setSelectedContract(c)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500 shadow-lg shadow-cyan-950/20'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        {c.contractNumber}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        c.status === 'active' 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {c.status}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-white mt-1">
                      {c.customerName}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-cyan-400 font-mono">
                      Rp {c.baseAmount.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {c.totalDays} Hari Sewa
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5 truncate">
                    <Car className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono text-slate-200">{c.vehiclePlate}</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-end">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{new Date(c.startDate).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contract Viewer & E-Signature Pad */}
      <div className="lg:col-span-7">
        {selectedContract ? (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            {/* Header Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Perjanjian Sewa Menyewa Kendaraan Bermotor
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    E-LEGAL VALIDATED
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Nomor Kontrak: {selectedContract.contractNumber} | Booking Ref: {selectedContract.bookingNumber}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak PDF</span>
                </button>
              </div>
            </div>

            {/* Parties Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                  PIHAK PERTAMA (Pemberi Sewa)
                </span>
                <p className="text-xs font-bold text-white">PT FLEET INTELLIGENCE INDONESIA</p>
                <p className="text-[11px] text-slate-400">HQ Pool Depo Jakarta Selatan</p>
                <p className="text-[11px] text-slate-400">Petugas: {selectedContract.staffName || 'Staff Otorisasi'}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                  PIHAK KEDUA (Penyewa)
                </span>
                <p className="text-xs font-bold text-white">{selectedContract.customerName}</p>
                <p className="text-[11px] text-slate-400">Paket Sewa: {selectedContract.packageType.replace('_', ' ').toUpperCase()}</p>
                <p className="text-[11px] text-slate-400">Durasi: {selectedContract.totalDays} Hari Kalender</p>
              </div>
            </div>

            {/* Vehicle & Tariff Specification */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Spesifikasi Objek Sewa & Deposit
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Unit Kendaraan</span>
                  <strong className="text-white">{selectedContract.vehicleModel}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Nomor Polisi</span>
                  <strong className="text-cyan-400 font-mono">{selectedContract.vehiclePlate}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Nilai Sewa Pokok</span>
                  <strong className="text-emerald-400 font-mono">Rp {selectedContract.baseAmount.toLocaleString('id-ID')}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Jaminan Deposit Escrow</span>
                  <strong className="text-amber-400 font-mono">Rp {selectedContract.depositAmount.toLocaleString('id-ID')}</strong>
                </div>
              </div>
            </div>

            {/* Terms and Conditions Accordion / Box */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Klausul & Syarat Ketentuan Utama
              </h4>
              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2 text-xs text-slate-300">
                {selectedContract.termsAndConditions.map((term, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold font-mono">{i + 1}.</span>
                    <span>{term}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Digital Signatures Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Customer E-Sign */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Tanda Tangan Elektronik Penyewa
                </span>
                {selectedContract.customerSignedAt ? (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 space-y-1">
                    <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-400" />
                    <p className="text-xs font-bold font-mono">TERTANDATANGANI SECARA DIGITAL</p>
                    <p className="text-[10px] text-slate-400">
                      {new Date(selectedContract.customerSignedAt).toLocaleString('id-ID')}
                    </p>
                  </div>
                ) : (
                  <button
                    disabled={isSigning}
                    onClick={() => handleSign('customer')}
                    className="w-full py-3 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-950"
                  >
                    <PenTool className="w-4 h-4" />
                    <span>Bubuhkan E-Signature Penyewa</span>
                  </button>
                )}
              </div>

              {/* Staff Authorized E-Sign */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Otorisasi Petugas Rental
                </span>
                {selectedContract.staffSignedAt ? (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 space-y-1">
                    <ShieldCheck className="w-6 h-6 mx-auto text-emerald-400" />
                    <p className="text-xs font-bold font-mono">TEROTORISASI OLEH PETUGAS</p>
                    <p className="text-[10px] text-slate-400">
                      {new Date(selectedContract.staffSignedAt).toLocaleString('id-ID')}
                    </p>
                  </div>
                ) : (
                  <button
                    disabled={isSigning}
                    onClick={() => handleSign('staff')}
                    className="w-full py-3 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700 hover:text-white transition-all flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Otorisasi & Sahkan Kontrak</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-slate-400">
            <FileText className="w-12 h-12 mx-auto text-slate-600 mb-3" />
            <p className="text-sm font-semibold">Pilih salah satu kontrak untuk melihat dokumen legal digital.</p>
          </div>
        )}
      </div>
    </div>
  );
};
