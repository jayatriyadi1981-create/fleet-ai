/**
 * Fleet Intelligence Smart AI - Work Order Detail & Transition Modal
 * PROMPT 25 - Work Order Workflow, Checklist, Parts Usage & Signatures
 */

import React, { useState } from 'react';
import {
  X,
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Building,
  DollarSign,
  Camera,
  FileText,
  ShieldCheck,
  Play,
  CheckCheck,
  Pause
} from 'lucide-react';
import { WorkOrder, WorkOrderStatus } from '../../types';

interface WorkOrderDetailModalProps {
  workOrder: WorkOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (workOrderId: string, newStatus: WorkOrderStatus) => void;
}

export const WorkOrderDetailModal: React.FC<WorkOrderDetailModalProps> = ({
  workOrder,
  isOpen,
  onClose,
  onStatusChange
}) => {
  if (!isOpen || !workOrder) return null;

  const [currentStatus, setCurrentStatus] = useState<WorkOrderStatus>(workOrder.status);
  const [checklist, setChecklist] = useState(
    workOrder.checklist || [
      { item: 'Inspeksi Visual & Pembongkaran', completed: true },
      { item: 'Pembersihan & Penggantian Suku Cadang', completed: currentStatus === 'COMPLETED' || currentStatus === 'IN_PROGRESS' },
      { item: 'Penyetelan Presisi & Uji Fungsi', completed: currentStatus === 'COMPLETED' },
      { item: 'Quality Inspection & Final Test Drive', completed: currentStatus === 'COMPLETED' },
    ]
  );

  const toggleChecklist = (idx: number) => {
    setChecklist((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleUpdateStatus = (newStatus: WorkOrderStatus) => {
    setCurrentStatus(newStatus);
    if (onStatusChange) {
      onStatusChange(workOrder.id, newStatus);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-cyan-400">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{workOrder.number}</h2>
                <span className="text-xs font-bold text-cyan-300">({workOrder.vehiclePlate})</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {currentStatus.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{workOrder.title}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Status Workflow Action Bar */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Alur Status Pengerjaan</span>
              <p className="text-xs text-slate-300">
                Ubah status WO untuk mengupdate jadwal dan log bengkel secara real-time.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {currentStatus !== 'IN_PROGRESS' && currentStatus !== 'COMPLETED' && (
                <button
                  onClick={() => handleUpdateStatus('IN_PROGRESS')}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-600/20"
                >
                  <Play className="h-3.5 w-3.5 fill-slate-950" />
                  <span>Mulai Pengerjaan</span>
                </button>
              )}
              {currentStatus === 'IN_PROGRESS' && (
                <button
                  onClick={() => handleUpdateStatus('WAITING_PARTS')}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Pause className="h-3.5 w-3.5" />
                  <span>Tunggu Part</span>
                </button>
              )}
              {currentStatus !== 'COMPLETED' && (
                <button
                  onClick={() => handleUpdateStatus('COMPLETED')}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  <span>Selesaikan Servis</span>
                </button>
              )}
            </div>
          </div>

          {/* Details Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Bengkel Mitra</span>
              <strong className="text-white text-sm block mt-0.5">{workOrder.workshopName}</strong>
              <span className="text-[11px] text-slate-400">Teknisi: {workOrder.assignedTechnician || 'Agus Pratama'}</span>
            </div>

            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Jadwal & Target Selesai</span>
              <strong className="text-white text-sm block mt-0.5">{workOrder.scheduledStart}</strong>
              <span className="text-[11px] text-cyan-400">Target Selesai: {workOrder.scheduledEnd}</span>
            </div>

            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Total Biaya Perbaikan</span>
              <strong className="text-emerald-400 text-sm block mt-0.5">
                Rp {workOrder.estimatedCost.toLocaleString('id-ID')}
              </strong>
              <span className="text-[11px] text-slate-400">Termasuk Jasa & Part</span>
            </div>
          </div>

          {/* Reported Issue & Notes */}
          <div className="space-y-2 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Keluhan Pengemudi / Gejala Awal
            </h3>
            <p className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-slate-300 leading-relaxed">
              {workOrder.reportedIssue}
            </p>
          </div>

          {/* Technician Checklist */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Checklist Item Pengerjaan Teknisi
            </h3>
            <div className="space-y-2">
              {checklist.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleChecklist(idx)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    item.completed
                      ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-200'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                  }`}
                >
                  <span className="text-xs font-medium">{item.item}</span>
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleChecklist(idx)}
                    className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Parts Used */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Suku Cadang & Bahan Terpakai
            </h3>
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
              {workOrder.partsUsed && workOrder.partsUsed.length > 0 ? (
                workOrder.partsUsed.map((p, i) => (
                  <div key={i} className="flex justify-between items-center text-slate-300">
                    <span>{p.name} ({p.quantity} Unit)</span>
                    <strong className="text-emerald-400">Rp {p.totalCost.toLocaleString('id-ID')}</strong>
                  </div>
                ))
              ) : (
                <div className="flex justify-between items-center text-slate-300">
                  <span>Brake Shoe Set Heavy Duty (2 Set)</span>
                  <strong className="text-emerald-400">Rp 2.400.000</strong>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 flex justify-end items-center bg-slate-900">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
