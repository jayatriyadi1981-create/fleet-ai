import React, { useState } from 'react';
import {
  CalendarCheck,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Car,
  User,
  MapPin,
  Calendar,
  Building,
  ArrowRight
} from 'lucide-react';
import { MOCK_CORP_BOOKINGS } from '../../../modules/corporate/mockData';

export const CorpBookingsTab: React.FC = () => {
  const [bookings, setBookings] = useState(MOCK_CORP_BOOKINGS);
  const [showModal, setShowModal] = useState(false);
  const [newRequestor, setNewRequestor] = useState('');
  const [newDivision, setNewDivision] = useState('Sales & Commercial');
  const [newPurpose, setNewPurpose] = useState('');
  const [newDestination, setNewDestination] = useState('');
  const [newPickupTime, setNewPickupTime] = useState('2026-08-22 09:00');
  const [newReturnTime, setNewReturnTime] = useState('2026-08-22 17:00');
  const [driverOption, setDriverOption] = useState<'WITH_POOL_DRIVER' | 'SELF_DRIVE'>('WITH_POOL_DRIVER');

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequestor || !newPurpose || !newDestination) {
      alert('Mohon lengkapi semua field permohonan booking kendaraan dinas.');
      return;
    }

    const newBooking = {
      id: `bkg-${Date.now()}`,
      bookingNumber: `REQ-CORP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      requestorName: newRequestor,
      requestorDivision: newDivision,
      requestorRole: 'Officer / Staff',
      purpose: newPurpose,
      destination: newDestination,
      pickupTime: newPickupTime,
      expectedReturnTime: newReturnTime,
      assignedVehicleAssetCode: 'CORP-POOL-01',
      assignedPlate: 'B 2145 SHP',
      driverOption,
      assignedDriverName: driverOption === 'WITH_POOL_DRIVER' ? 'Agus Sunarto (Driver Pool)' : undefined,
      status: 'PENDING_GA_APPROVAL' as const,
      approvedByGA: 'Menunggu Review GA Lead',
      estimatedCostCenter: 'CC-GEN-001'
    };

    setBookings([newBooking, ...bookings]);
    setShowModal(false);
    setNewRequestor('');
    setNewPurpose('');
    setNewDestination('');
    alert(`Permohonan booking ${newBooking.bookingNumber} berhasil diajukan untuk approval GA.`);
  };

  const handleApprove = (id: string) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: 'APPROVED_DISPATCHED', approvedByGA: 'Hendro Wijaya (GA Lead)' } : b));
    alert('Booking berhasil disetujui. Notifikasi WhatsApp & email otomatis dikirim ke pemohon dan driver.');
  };

  return (
    <div id="corp-bookings-tab" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs text-blue-400 font-mono font-bold uppercase tracking-wider">
            CORPORATE CAR POOL E-BOOKING & DISPATCH WORKFLOW
          </span>
          <h3 className="text-lg font-bold text-white mt-1">
            Pemesanan Mobil Dinas, Approval Bertingkat GA & Penugasan Driver
          </h3>
          <p className="text-xs text-slate-400">
            Sistem pengajuan reservasi kendaraan dinas karyawan, validasi tujuan perjalanan bisnis, alokasi supir pool, dan pencatatan nomor tiket reservasi.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" /> Buat Permohonan Booking Mobil
        </button>
      </div>

      {/* Bookings List Cards */}
      <div className="space-y-4">
        {bookings.map(b => (
          <div key={b.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-blue-400 flex items-center justify-center font-bold text-xs">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm font-mono">{b.bookingNumber}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 font-mono">
                      {b.estimatedCostCenter}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{b.requestorName} • {b.requestorDivision} ({b.requestorRole})</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                  b.status === 'ACTIVE_ON_GOING' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                  b.status === 'APPROVED_DISPATCHED' ? 'bg-emerald-100 text-emerald-800' :
                  b.status === 'PENDING_GA_APPROVAL' ? 'bg-blue-100 text-blue-800' :
                  'bg-slate-100 text-slate-800'
                }`}>
                  {b.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-3 text-xs">
              <div className="space-y-1">
                <span className="text-slate-500 font-medium">Tujuan & Agenda Perjalanan:</span>
                <p className="font-semibold text-slate-900">{b.purpose}</p>
                <div className="flex items-start gap-1 text-slate-600 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span>{b.destination}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 font-medium">Jadwal Pakai & Estimasi Kembali:</span>
                <p className="text-slate-800 font-mono">Ambil: <strong>{b.pickupTime}</strong></p>
                <p className="text-slate-800 font-mono">Kembali: <strong>{b.expectedReturnTime}</strong></p>
                <div className="text-[11px] text-slate-500">Approval GA: {b.approvedByGA}</div>
              </div>

              <div className="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-slate-500 font-medium">Armada & Penugasan Driver:</span>
                <p className="font-bold text-slate-900 font-mono">{b.assignedVehicleAssetCode} ({b.assignedPlate})</p>
                <p className="text-slate-700">
                  Driver: <strong className="text-blue-700">{b.assignedDriverName || 'Self-Drive (Bawa Sendiri)'}</strong>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs">
              <div className="text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span>Opsi: <strong>{b.driverOption === 'WITH_POOL_DRIVER' ? 'Dengan Supir Kantor' : 'Karyawan Menyetir Sendiri'}</strong></span>
              </div>

              <div className="flex gap-2">
                {b.status === 'PENDING_GA_APPROVAL' && (
                  <button
                    onClick={() => handleApprove(b.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center gap-1 shadow"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Setujui Permohonan (Approve)
                  </button>
                )}
                <button
                  onClick={() => alert(`Cetak Surat Tugas & Surat Izin Keluar Kendaraan Dinas untuk ${b.bookingNumber}`)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-blue-300 rounded-lg font-semibold flex items-center gap-1"
                >
                  Surat Izin Keluar (SIMK)
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Dialog Form Booking */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-blue-600" /> Formulir E-Booking Mobil Dinas
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nama Pemohon (Karyawan):</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Raden Satria"
                  value={newRequestor}
                  onChange={e => setNewRequestor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Divisi / Department:</label>
                  <select
                    value={newDivision}
                    onChange={e => setNewDivision(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="Sales & Commercial">Sales & Commercial</option>
                    <option value="Marketing & Brand">Marketing & Brand</option>
                    <option value="Enterprise IT & Tech">Enterprise IT & Tech</option>
                    <option value="Finance & Accounting">Finance & Accounting</option>
                    <option value="Human Resources (HR)">Human Resources (HR)</option>
                    <option value="Supply Chain & Procurement">Supply Chain & Procurement</option>
                    <option value="Corporate Legal & Secretary">Corporate Legal & Secretary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Opsi Pengemudi:</label>
                  <select
                    value={driverOption}
                    onChange={e => setDriverOption(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="WITH_POOL_DRIVER">Dengan Supir Pool Kantor</option>
                    <option value="SELF_DRIVE">Self-Drive (Bawa Sendiri)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Agenda / Keperluan Dinas:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kunjungan Meeting Klien Korporat & Penawaran Tender"
                  value={newPurpose}
                  onChange={e => setNewPurpose(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tujuan Lokasi / Alamat:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Menara Astra Lt. 28, Jl. Jend. Sudirman Jakarta"
                  value={newDestination}
                  onChange={e => setNewDestination(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Waktu Keberangkatan:</label>
                  <input
                    type="text"
                    value={newPickupTime}
                    onChange={e => setNewPickupTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Estimasi Selesai / Kembali:</label>
                  <input
                    type="text"
                    value={newReturnTime}
                    onChange={e => setNewReturnTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow"
                >
                  Kirim Pengajuan Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
