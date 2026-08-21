import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  Clock, 
  MapPin, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Plus, 
  Search,
  Phone,
  Boxes
} from 'lucide-react';
import { PickupTask } from '../../../modules/logistics/types';

interface Props {
  pickups: PickupTask[];
}

export const LogisticsPickupsTab: React.FC<Props> = ({ pickups: initialPickups }) => {
  const [pickups, setPickups] = useState<PickupTask[]>(initialPickups);
  const [searchTerm, setSearchTerm] = useState('');

  const handleUpdateStatus = (id: string, newStatus: PickupTask['status']) => {
    setPickups((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  const filteredPickups = pickups.filter(
    (p) =>
      p.shipperName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.pickupCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.assignedDriverName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <ArrowUpRight className="w-6 h-6 text-indigo-600" />
            Pickup & First-Mile Dispatching
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Jadwal penjemputan paket dari gudang merchant/shipper, penugasan armada pickup, dan serah terima kargo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all">
            <Plus className="w-4 h-4" />
            + Jadwal Pickup Baru
          </button>
        </div>
      </div>

      {/* Pickup Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredPickups.map((pkp) => (
          <div 
            key={pkp.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">{pkp.pickupCode}</span>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{pkp.shipperName}</h4>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                pkp.status === 'TRANSFERRED_TO_HUB' || pkp.status === 'PICKED_UP'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                  : pkp.status === 'EN_ROUTE_PICKUP'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
              }`}>
                {pkp.status.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{pkp.shipperAddress}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{pkp.shipperPhone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Jadwal: {new Date(pkp.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} WIB</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-center justify-between text-xs">
              <div>
                <div className="text-[10px] text-slate-400">Driver & Kendaraan</div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">{pkp.assignedDriverName} ({pkp.vehiclePlate})</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400">Estimasi Muatan</div>
                <div className="font-bold text-slate-800 dark:text-slate-200">{pkp.estimatedPackages} Koli ({pkp.estimatedWeightKg} kg)</div>
              </div>
            </div>

            {pkp.notes && (
              <div className="text-[11px] text-slate-500 bg-amber-50 dark:bg-amber-900/20 p-2.5 rounded-lg border border-amber-200 dark:border-amber-800/40">
                <span className="font-bold text-amber-800 dark:text-amber-300">Instruksi:</span> {pkp.notes}
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-400">Update Status:</span>
              <div className="flex items-center gap-2">
                {pkp.status !== 'PICKED_UP' && pkp.status !== 'TRANSFERRED_TO_HUB' && (
                  <button 
                    onClick={() => handleUpdateStatus(pkp.id, 'PICKED_UP')}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
                  >
                    Konfirmasi Picked Up
                  </button>
                )}
                {pkp.status === 'PICKED_UP' && (
                  <button 
                    onClick={() => handleUpdateStatus(pkp.id, 'TRANSFERRED_TO_HUB')}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
                  >
                    Inbound ke Hub
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
