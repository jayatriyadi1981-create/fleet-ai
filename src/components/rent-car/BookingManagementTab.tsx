/**
 * Fleet Intelligence Smart AI - Rental Bookings Pipeline & Reservations Tab
 */

import React, { useState } from 'react';
import { RentalBooking } from '../../modules/rent-car/types';
import { 
  KeyRound, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  User, 
  Car, 
  Calendar, 
  Search, 
  Filter, 
  Plus, 
  ArrowRight,
  ClipboardCheck,
  XCircle,
  FileText
} from 'lucide-react';

interface BookingManagementTabProps {
  bookings: RentalBooking[];
  onOpenCreateModal: () => void;
  onOpenHandoverModal: (booking: RentalBooking, type: 'check_out' | 'check_in') => void;
  onSelectBooking: (booking: RentalBooking) => void;
}

export const BookingManagementTab: React.FC<BookingManagementTabProps> = ({
  bookings,
  onOpenCreateModal,
  onOpenHandoverModal,
  onSelectBooking
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.vehicleBrand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.vehicleModel.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: RentalBooking['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Siap Check-Out
          </span>
        );
      case 'active':
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
            <KeyRound className="w-3 h-3" /> Sedang Disewa
          </span>
        );
      case 'overdue':
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Overdue Terlambat
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Selesai (Closed)
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-slate-800 text-slate-400">
            Dibatalkan
          </span>
        );
      default:
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-slate-800 text-slate-400">{status}</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Actions Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex-1 flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Cari kode reservasi (RC-BK-...), nama penyewa, plat mobil..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Semua Status Reservasi</option>
            <option value="confirmed">Siap Check-Out (Confirmed)</option>
            <option value="active">Sedang Berjalan (Active)</option>
            <option value="overdue">Terlambat (Overdue)</option>
            <option value="completed">Selesai (Completed)</option>
            <option value="cancelled">Dibatalkan (Cancelled)</option>
          </select>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-950"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Reservasi Baru</span>
        </button>
      </div>

      {/* Bookings Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
              <tr>
                <th className="p-3.5">No. Booking & Pelanggan</th>
                <th className="p-3.5">Unit Kendaraan</th>
                <th className="p-3.5">Paket & Driver</th>
                <th className="p-3.5">Jadwal Sewa</th>
                <th className="p-3.5">Keuangan & Deposit</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Aksi Operasional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredBookings.map((booking) => {
                const canCheckOut = booking.status === 'confirmed' || booking.status === 'draft';
                const canCheckIn = booking.status === 'active' || booking.status === 'overdue';

                return (
                  <tr key={booking.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Booking & Customer */}
                    <td className="p-3.5">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{booking.customerName}</span>
                      </div>
                      <div className="text-[11px] font-mono text-cyan-400 mt-0.5">
                        {booking.bookingNumber}
                      </div>
                    </td>

                    {/* Vehicle */}
                    <td className="p-3.5">
                      <div className="font-semibold text-white">
                        {booking.vehicleBrand} {booking.vehicleModel}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {booking.vehiclePlate}
                      </div>
                    </td>

                    {/* Package */}
                    <td className="p-3.5">
                      <span className="capitalize font-medium text-slate-300">
                        {booking.packageType === 'self_drive' ? 'Lepas Kunci' : booking.packageType === 'with_driver' ? 'Dengan Sopir' : 'All-In Paket'}
                      </span>
                      {booking.driverName && (
                        <div className="text-[10px] text-cyan-400 font-medium truncate max-w-[130px]">
                          Driver: {booking.driverName}
                        </div>
                      )}
                    </td>

                    {/* Schedule */}
                    <td className="p-3.5 font-mono text-[11px]">
                      <div>{new Date(booking.startDateTime).toLocaleDateString('id-ID')} - {new Date(booking.endDateTime).toLocaleDateString('id-ID')}</div>
                      <div className="text-slate-400 font-sans text-[10px]">{booking.durationDays} Hari Sewa</div>
                    </td>

                    {/* Financials */}
                    <td className="p-3.5 font-mono">
                      <div className="font-bold text-emerald-400">
                        Rp {booking.financials.grandTotal.toLocaleString('id-ID')}
                      </div>
                      <div className="text-[10px] text-amber-400">
                        Deposit: Rp {booking.financials.securityDepositAmount.toLocaleString('id-ID')}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-3.5">
                      {getStatusBadge(booking.status)}
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right space-x-2">
                      {canCheckOut && (
                        <button
                          onClick={() => onOpenHandoverModal(booking, 'check_out')}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all flex-inline items-center gap-1 shadow-md shadow-cyan-950"
                        >
                          <ClipboardCheck className="w-3.5 h-3.5 inline mr-1" />
                          <span>Serah Terima</span>
                        </button>
                      )}

                      {canCheckIn && (
                        <button
                          onClick={() => onOpenHandoverModal(booking, 'check_in')}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all flex-inline items-center gap-1 shadow-md shadow-amber-950"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" />
                          <span>Tutup Sewa & Deposit</span>
                        </button>
                      )}

                      <button
                        onClick={() => onSelectBooking(booking)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                      >
                        Detail
                      </button>
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
