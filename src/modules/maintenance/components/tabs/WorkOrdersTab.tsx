/**
 * Fleet Intelligence Smart AI - Work Orders Tab
 * PROMPT 25 - Complete Work Order Lifecycle Management
 */

import React, { useState } from 'react';
import {
  Wrench,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  User,
  Building,
  DollarSign,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { MOCK_WORK_ORDERS } from '../../data/mockMaintenanceData';
import { WorkOrder, WorkOrderStatus, WorkOrderPriority } from '../../types';

interface WorkOrdersTabProps {
  onSelectWorkOrder: (workOrderId: string) => void;
  onCreateWorkOrder: () => void;
}

export const WorkOrdersTab: React.FC<WorkOrdersTabProps> = ({
  onSelectWorkOrder,
  onCreateWorkOrder
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  const filteredOrders = MOCK_WORK_ORDERS.filter((wo) => {
    const matchSearch =
      wo.number.toLowerCase().includes(search.toLowerCase()) ||
      wo.vehiclePlate.toLowerCase().includes(search.toLowerCase()) ||
      wo.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || wo.status === statusFilter;
    const matchPriority = priorityFilter === 'ALL' || wo.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const getStatusBadge = (status: WorkOrderStatus) => {
    switch (status) {
      case 'IN_PROGRESS':
        return <span className="bg-cyan-950 text-cyan-300 border border-cyan-800/50 px-2.5 py-0.5 rounded-full text-xs font-bold animate-pulse">IN PROGRESS</span>;
      case 'APPROVED':
        return <span className="bg-blue-950 text-blue-300 border border-blue-800/50 px-2.5 py-0.5 rounded-full text-xs font-bold">APPROVED</span>;
      case 'WAITING_PARTS':
        return <span className="bg-amber-950 text-amber-300 border border-amber-800/50 px-2.5 py-0.5 rounded-full text-xs font-bold">WAITING PARTS</span>;
      case 'COMPLETED':
        return <span className="bg-emerald-950 text-emerald-300 border border-emerald-800/50 px-2.5 py-0.5 rounded-full text-xs font-bold">COMPLETED</span>;
      case 'CLOSED':
        return <span className="bg-slate-800 text-slate-400 px-2.5 py-0.5 rounded-full text-xs font-semibold">CLOSED</span>;
      default:
        return <span className="bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  const getPriorityBadge = (priority: WorkOrderPriority) => {
    switch (priority) {
      case 'CRITICAL':
        return <span className="bg-rose-950 text-rose-300 border border-rose-800/50 px-2 py-0.5 rounded text-[10px] font-bold">CRITICAL</span>;
      case 'HIGH':
        return <span className="bg-orange-950 text-orange-300 border border-orange-800/50 px-2 py-0.5 rounded text-[10px] font-bold">HIGH</span>;
      case 'MEDIUM':
        return <span className="bg-amber-950 text-amber-300 border border-amber-800/50 px-2 py-0.5 rounded text-[10px] font-bold">MEDIUM</span>;
      default:
        return <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-[10px] font-medium">LOW</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Wrench className="h-5 w-5 text-cyan-400" />
            Manajemen Surat Perintah Kerja (Work Orders)
          </h2>
          <p className="text-xs text-slate-400">
            Siklus alur kerja WO: Permohonan → Persetujuan → Jadwal → Pengerjaan → Pengecekan Kualitas → Selesai & Tutup.
          </p>
        </div>

        <button
          onClick={onCreateWorkOrder}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-600/30 shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Buat Work Order Baru</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Cari No WO / Plat / Kerusakan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">Semua Status</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="APPROVED">Approved</option>
            <option value="WAITING_PARTS">Waiting Parts</option>
            <option value="COMPLETED">Completed</option>
            <option value="CLOSED">Closed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">Semua Prioritas</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Work Orders List */}
      <div className="space-y-3">
        {filteredOrders.map((wo) => (
          <div
            key={wo.id}
            onClick={() => onSelectWorkOrder(wo.id)}
            className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 hover:bg-slate-900 transition-all cursor-pointer shadow-xl space-y-4 hover:border-slate-700"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white">{wo.number}</span>
                    <span className="text-xs font-bold text-cyan-300">({wo.vehiclePlate})</span>
                    {getPriorityBadge(wo.priority)}
                  </div>
                  <h3 className="text-xs font-bold text-slate-200 mt-0.5">{wo.title}</h3>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {getStatusBadge(wo.status)}
              </div>
            </div>

            {/* Work Order Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-500 block">Bengkel Pelaksana</span>
                <span className="font-semibold text-slate-200 block truncate">{wo.workshopName}</span>
              </div>
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-500 block">Teknisi Bertugas</span>
                <span className="font-semibold text-slate-200 block truncate">{wo.assignedTechnician || 'Belum ditugaskan'}</span>
              </div>
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-500 block">Jadwal Pelaksanaan</span>
                <span className="font-semibold text-slate-200 block">{wo.scheduledStart}</span>
              </div>
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-500 block">Estimasi Biaya</span>
                <span className="font-bold text-emerald-400 block">
                  Rp {wo.estimatedCost.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Reported Issue & Diagnosis Snippet */}
            <div className="text-xs bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <p className="text-slate-400 truncate max-w-xl">
                <strong className="text-slate-300">Gejala:</strong> {wo.reportedIssue}
              </p>
              <div className="flex items-center gap-1 text-cyan-400 text-xs font-bold shrink-0">
                <span>Buka Rincian WO & Checklist</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
