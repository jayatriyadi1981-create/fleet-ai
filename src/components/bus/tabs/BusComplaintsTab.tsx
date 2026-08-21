import React, { useState } from 'react';
import { BusPassengerComplaint } from '../../../modules/bus/types';
import { busService } from '../../../modules/bus/services/busService';
import { 
  MessageSquareWarning, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  X,
  Send,
  User,
  Bus
} from 'lucide-react';

export const BusComplaintsTab: React.FC = () => {
  const [complaints, setComplaints] = useState<BusPassengerComplaint[]>(busService.getComplaints());
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<BusPassengerComplaint | null>(null);
  const [resolutionText, setResolutionText] = useState('');

  const filteredComplaints = complaints.filter(c => {
    const matchSearch = c.passengerName.toLowerCase().includes(search.toLowerCase()) ||
      c.complaintNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.tripCode.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'ALL' || c.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint || !resolutionText.trim()) return;

    const resolved = busService.resolveComplaint(selectedComplaint.id, resolutionText);
    if (resolved) {
      setComplaints(busService.getComplaints());
      setSelectedComplaint(null);
      setResolutionText('');
    }
  };

  const getSeverityBadge = (sev: BusPassengerComplaint['severity']) => {
    switch (sev) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/40">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">HIGH</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">NORMAL</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageSquareWarning className="w-5 h-5 text-amber-400" />
            Pusat Layanan & Keluhan Penumpang (Customer Feedback & Complaints)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitoring keluhan supir ugal-ugalan, AC, kebersihan armada, keterlambatan, dan tiket
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-amber-950/30"
        >
          <Plus className="w-4 h-4" />
          Input Tiket Keluhan Baru
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
        <div className="relative flex-1 sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari No. Tiket, Nama Penumpang, Trip..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
        >
          <option value="ALL">Semua Kategori</option>
          <option value="DRIVER">Perilaku Supir (Driver)</option>
          <option value="BUS">Kondisi Fisik Bus & Fasilitas</option>
          <option value="AC">Sistem AC / Suhu</option>
          <option value="DELAY">Keterlambatan (Delay)</option>
          <option value="CLEANLINESS">Kebersihan Kabin / Toilet</option>
          <option value="SAFETY">Keselamatan (Safety)</option>
          <option value="SERVICE">Pelayanan Kru / Hostess</option>
        </select>
      </div>

      {/* Complaints List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredComplaints.map((complaint) => (
          <div
            key={complaint.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-all shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-400">{complaint.complaintNumber}</span>
                  {getSeverityBadge(complaint.severity)}
                </div>
                <h4 className="font-bold text-white text-sm mt-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {complaint.passengerName}
                </h4>
                <div className="text-slate-400 text-xs font-mono">{complaint.passengerPhone}</div>
              </div>

              <div>
                {complaint.status === 'RESOLVED' ? (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Selesai Ditangani
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Menunggu Tindakan
                  </span>
                )}
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs text-slate-300">
              <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px] mb-1">
                <span>Trip: <strong className="text-cyan-300">{complaint.tripCode}</strong></span>
                <span>•</span>
                <span>Bus: <strong className="text-white">{complaint.busPlateNumber}</strong></span>
              </div>
              <p className="mt-1 leading-relaxed text-slate-200">"{complaint.description}"</p>
            </div>

            {complaint.resolutionNotes && (
              <div className="p-2.5 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-xs text-emerald-300">
                <span className="font-bold block text-[11px] text-emerald-400">Tindakan Resolusi:</span>
                <p className="mt-0.5">{complaint.resolutionNotes}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-500">
              <span>Dilaporkan: {complaint.createdAt}</span>
              {complaint.status !== 'RESOLVED' && (
                <button
                  onClick={() => setSelectedComplaint(complaint)}
                  className="px-3 py-1 bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-slate-950 font-bold rounded-lg transition-all border border-amber-500/30"
                >
                  Tindak Lanjuti & Tutup Tiket
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Resolve Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative my-8">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Selesaikan Keluhan: {selectedComplaint.complaintNumber}
              </h3>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleResolve} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-bold">Catatan Tindakan Korektif & Resolusi</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Jelaskan tindakan yang telah diambil terhadap supir/kru/mekanik, atau kompensasi tiket yang diberikan..."
                  value={resolutionText}
                  onChange={(e) => setResolutionText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-950/30"
                >
                  Tandai Selesai & Tutup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Complaint Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative my-8">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquareWarning className="w-5 h-5 text-amber-400" />
                Input Keluhan Penumpang Baru
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                busService.createComplaint({
                  passengerName: formData.get('passengerName') as string,
                  passengerPhone: formData.get('passengerPhone') as string,
                  category: formData.get('category') as any,
                  tripCode: formData.get('tripCode') as string,
                  busPlateNumber: formData.get('busPlateNumber') as string,
                  description: formData.get('description') as string,
                  severity: formData.get('severity') as any
                });
                setComplaints(busService.getComplaints());
                setIsAddModalOpen(false);
              }}
              className="space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Nama Penumpang</label>
                  <input
                    name="passengerName"
                    required
                    placeholder="Nama Pelanggan"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Nomor HP</label>
                  <input
                    name="passengerPhone"
                    required
                    placeholder="0812xxxx"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Kode Trip</label>
                  <input
                    name="tripCode"
                    defaultValue="SJ-702-TRANS-JAWA"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Plat Bus</label>
                  <input
                    name="busPlateNumber"
                    defaultValue="B 7102 SGA"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Kategori Masalah</label>
                  <select
                    name="category"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="DRIVER">Perilaku Supir</option>
                    <option value="AC">AC / Suhu Kabin</option>
                    <option value="DELAY">Keterlambatan (Delay)</option>
                    <option value="CLEANLINESS">Kebersihan Bus</option>
                    <option value="SAFETY">Keselamatan</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Tingkat Urgensi</label>
                  <select
                    name="severity"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="LOW">Normal (Rendah)</option>
                    <option value="MEDIUM">Sedang</option>
                    <option value="HIGH">Tinggi</option>
                    <option value="CRITICAL">Kritis</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Isi Keluhan</label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  placeholder="Detail keluhan dari penumpang..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-950/30"
                >
                  Simpan Keluhan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
