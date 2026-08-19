/**
 * Fleet Intelligence Smart AI - Cost Allocation Wizard Modal
 * PROMPT 37 - Proportional Cost Allocation Setup & Distribution Wizard
 */

import React, { useState, useMemo } from 'react';
import { X, Share2, Layers, DollarSign, Check, Sliders, Truck, Building2, Navigation } from 'lucide-react';
import { useCost } from '../../context/CostContext';
import { CostCalculationEngine } from '../../engines/CostCalculationEngine';
import { AllocationMethod } from '../../types';
import { AllocationTarget } from '../../engines/CostAllocationEngine';

export const AllocationModal: React.FC = () => {
  const {
    isAllocationModalOpen,
    setIsAllocationModalOpen,
    costRecords,
    allocateCostRecord,
    branchCostMetrics,
  } = useCost();

  const [selectedRecordId, setSelectedRecordId] = useState<string>('');
  const [allocationMethod, setAllocationMethod] = useState<AllocationMethod>('BY_MILEAGE');

  // Candidate cost records eligible for allocation (e.g. overhead or unallocated records)
  const candidateRecords = useMemo(() => {
    return costRecords.filter(
      (r) => r.allocationStatus === 'UNALLOCATED' || r.allocationStatus === 'DIRECTLY_ALLOCATED'
    );
  }, [costRecords]);

  // Selected record object
  const selectedRecord = useMemo(() => {
    return costRecords.find((r) => r.id === selectedRecordId) || candidateRecords[0];
  }, [costRecords, selectedRecordId, candidateRecords]);

  if (!isAllocationModalOpen) return null;

  const handleRunAllocation = () => {
    if (!selectedRecord) return;

    // Target vehicles for proportional allocation
    const targetVehicles = [
      { id: 'v-01', plate: 'B 9123 TXR (Hino 500)', mileage: 3840, trips: 28, hours: 140 },
      { id: 'v-02', plate: 'B 9456 UYT (Isuzu Giga)', mileage: 4120, trips: 31, hours: 155 },
      { id: 'v-03', plate: 'D 8821 KL (Mitsubishi Fuso)', mileage: 2980, trips: 22, hours: 110 },
      { id: 'v-04', plate: 'L 9012 AB (Mercedes Axor)', mileage: 4650, trips: 35, hours: 175 },
    ];

    const targets: AllocationTarget[] = targetVehicles.map((v) => {
      let weight = v.mileage;
      if (allocationMethod === 'BY_TRIP') weight = v.trips;
      else if (allocationMethod === 'BY_OPERATING_HOURS') weight = v.hours;
      else if (allocationMethod === 'BY_PERCENTAGE') weight = 25;

      return {
        id: v.id,
        label: v.plate,
        weightMetric: weight,
      };
    });

    allocateCostRecord(selectedRecord.id, allocationMethod, targets);
    setIsAllocationModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Wizard Alokasi Biaya Gabungan</h3>
              <p className="text-[11px] text-slate-400">Distribusikan biaya pool/overhead ke unit armada secara proporsional</p>
            </div>
          </div>
          <button
            onClick={() => setIsAllocationModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Select Source Record */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Pilih Transaksi Biaya Induk (Parent Record)
            </label>
            <select
              value={selectedRecord?.id || ''}
              onChange={(e) => setSelectedRecordId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {candidateRecords.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.date} - {r.category} ({CostCalculationEngine.formatCurrencyIdr(r.amount)}) - {r.notes || r.branchName}
                </option>
              ))}
            </select>
          </div>

          {/* Allocation Method Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Metode Distribusi Proporsional
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'BY_MILEAGE', label: 'Proporsi Jarak (KM Odometer)' },
                { key: 'BY_TRIP', label: 'Proporsi Frekuensi Ritase' },
                { key: 'BY_OPERATING_HOURS', label: 'Proporsi Jam Operasi Mesin' },
                { key: 'BY_PERCENTAGE', label: 'Bagi Rata Persentase' },
              ].map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setAllocationMethod(m.key as AllocationMethod)}
                  className={`p-2.5 rounded-xl border text-xs text-left transition-all ${
                    allocationMethod === m.key
                      ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400 font-semibold'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Target Entities Preview */}
          <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-slate-300 block">
              Pratinjau Distribusi ke Unit Target:
            </span>
            <div className="space-y-2 text-xs">
              {[
                { plate: 'B 9123 TXR (Hino 500)', pct: 24.6, amount: (selectedRecord?.amount || 10000000) * 0.246 },
                { plate: 'B 9456 UYT (Isuzu Giga)', pct: 26.4, amount: (selectedRecord?.amount || 10000000) * 0.264 },
                { plate: 'D 8821 KL (Mitsubishi Fuso)', pct: 19.1, amount: (selectedRecord?.amount || 10000000) * 0.191 },
                { plate: 'L 9012 AB (Mercedes Axor)', pct: 29.9, amount: (selectedRecord?.amount || 10000000) * 0.299 },
              ].map((t, idx) => (
                <div key={idx} className="flex justify-between items-center bg-slate-900/60 p-2 rounded-lg">
                  <span className="text-slate-300 font-medium">{t.plate}</span>
                  <div className="text-right">
                    <span className="font-mono text-cyan-400 font-bold">
                      {CostCalculationEngine.formatCurrencyIdr(t.amount)}
                    </span>
                    <span className="text-[10px] text-slate-500 ml-1.5 font-mono">({t.pct}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            * Transaksi induk akan ditandai <span className="text-cyan-400 font-semibold">SPLIT_ALLOCATED</span> sehingga tidak dihitung ganda dalam Total Operating Cost (TOC).
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setIsAllocationModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleRunAllocation}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/20 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Eksekusi Alokasi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
