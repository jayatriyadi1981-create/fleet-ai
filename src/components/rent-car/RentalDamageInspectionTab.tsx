import React, { useState } from 'react';
import { RentalDamageRecord } from '../../modules/rent-car/types';
import { rentCarService } from '../../modules/rent-car/services/rentCarService';
import { 
  ShieldAlert, 
  Wrench, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  FileText, 
  AlertTriangle, 
  Car, 
  Camera, 
  Search, 
  Plus, 
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';

interface RentalDamageInspectionTabProps {
  damages: RentalDamageRecord[];
  onRefresh: () => void;
}

export const RentalDamageInspectionTab: React.FC<RentalDamageInspectionTabProps> = ({ damages, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDamage, setSelectedDamage] = useState<RentalDamageRecord | null>(damages[0] || null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredDamages = damages.filter((d) => {
    const matchesSearch = 
      d.damageNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.partName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || d.approvalStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (status: RentalDamageRecord['approvalStatus'], chargeToDeposit: boolean) => {
    if (!selectedDamage) return;
    rentCarService.updateDamageStatus(selectedDamage.id, status, chargeToDeposit);
    onRefresh();
    const updated = rentCarService.getDamages().find((d) => d.id === selectedDamage.id);
    if (updated) setSelectedDamage(updated);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* List of Damage Reports */}
      <div className="lg:col-span-5 space-y-3">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Klaim & Kerusakan Armada
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
              {filteredDamages.length} Rekam Kerusakan
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari plat, nomor klaim, bagian..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-2.5 py-2 focus:outline-none focus:border-rose-500"
            >
              <option value="all">Semua Status</option>
              <option value="reported">Reported</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="charged">Charged to Deposit</option>
              <option value="repaired">Repaired</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
          {filteredDamages.map((dmg) => {
            const isSelected = selectedDamage?.id === dmg.id;
            return (
              <div
                key={dmg.id}
                onClick={() => setSelectedDamage(dmg)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-rose-500 shadow-lg shadow-rose-950/20'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-rose-400">
                        {dmg.damageNumber}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        dmg.severity === 'severe'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : dmg.severity === 'moderate'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {dmg.severity}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-white mt-1">
                      {dmg.partName} ({dmg.damageType.replace('_', ' ')})
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-rose-400 font-mono">
                      Rp {dmg.estimatedRepairCostIdr.toLocaleString('id-ID')}
                    </span>
                    <span className={`text-[10px] block mt-0.5 font-bold uppercase ${
                      dmg.chargedToDeposit ? 'text-emerald-400' : 'text-slate-400'
                    }`}>
                      {dmg.chargedToDeposit ? 'Potong Deposit' : 'Pending Charge'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5 truncate">
                    <Car className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono text-slate-200">{dmg.vehiclePlate}</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-end">
                    <span className="text-slate-300 font-semibold">{dmg.customerName}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Damage Detail View & Settle to Deposit */}
      <div className="lg:col-span-7">
        {selectedDamage ? (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Rincian Kerusakan & Estimasi Perbaikan
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 uppercase">
                    Status: {selectedDamage.approvalStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Nomor Klaim: {selectedDamage.damageNumber} | Tanggal Lapor: {new Date(selectedDamage.reportedAt).toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            {/* Vehicle & Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Armada</span>
                <p className="text-xs font-bold text-white">{selectedDamage.vehicleModel}</p>
                <p className="text-xs font-mono text-cyan-400 font-semibold">{selectedDamage.vehiclePlate}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Penyewa Bertanggung Jawab</span>
                <p className="text-xs font-bold text-white">{selectedDamage.customerName}</p>
                <p className="text-xs text-slate-400">Inspeksi: {selectedDamage.inspectionType.replace('_', ' ').toUpperCase()}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Beban Tanggungan</span>
                <p className="text-xs font-bold text-rose-400 uppercase">{selectedDamage.responsibility}</p>
                <p className="text-xs font-mono text-white font-bold">
                  Rp {selectedDamage.estimatedRepairCostIdr.toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            {/* Damage Description & Evidence */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Deskripsi & Bukti Foto Lapangan
              </h4>
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="font-bold text-slate-400">Bagian:</span>
                  <span className="text-white font-semibold">{selectedDamage.partName}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  "{selectedDamage.description}"
                </p>

                {/* Photo Gallery */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                  {selectedDamage.photoUrls.map((url, i) => (
                    <div key={i} className="relative rounded-lg overflow-hidden border border-slate-800 group aspect-video">
                      <img
                        src={url}
                        alt="Bukti Kerusakan"
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent flex items-end p-2">
                        <span className="text-[10px] font-mono text-white flex items-center gap-1">
                          <Camera className="w-3 h-3 text-cyan-400" /> Foto #{i + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons for Deposit Settlement */}
            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                {selectedDamage.chargedToDeposit ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Biaya perbaikan telah dipotong langsung dari Jaminan Deposit Escrow.
                  </span>
                ) : (
                  <span className="text-amber-400 flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> Belum direkonsiliasi dengan deposit escrow penyewa.
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {selectedDamage.approvalStatus !== 'charged' && (
                  <button
                    onClick={() => handleUpdateStatus('charged', true)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-500 text-white hover:bg-rose-400 transition-all flex items-center gap-1.5 shadow-lg shadow-rose-950"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Setujui & Potong Deposit Escrow</span>
                  </button>
                )}

                {selectedDamage.approvalStatus === 'charged' && (
                  <button
                    onClick={() => handleUpdateStatus('closed', true)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all flex items-center gap-1.5 shadow-lg"
                  >
                    <Check className="w-4 h-4" />
                    <span>Tutup Klaim (Perbaikan Selesai)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-slate-400">
            <ShieldAlert className="w-12 h-12 mx-auto text-slate-600 mb-3" />
            <p className="text-sm font-semibold">Pilih salah satu rekam klaim untuk melihat detail kerusakan & foto.</p>
          </div>
        )}
      </div>
    </div>
  );
};
