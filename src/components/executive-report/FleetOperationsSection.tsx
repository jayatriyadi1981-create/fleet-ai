/**
 * Fleet Intelligence Smart AI - Fleet Operations Section
 * PROMPT 52 — Operational Efficiencies, Downtime, SLA, and Logistics Intelligence
 */

import React from 'react';
import { Activity, Clock, PackageCheck, AlertTriangle, Truck, CheckCircle2, ChevronRight, Gauge } from 'lucide-react';
import { ExecutiveKPIs } from '../../types/executiveReport';
import { ExecutiveKPIService } from '../../services/executiveReport/executiveKPIService';

interface FleetOperationsSectionProps {
  kpis: ExecutiveKPIs;
  onWhyClick: (category: string, title: string) => void;
}

export const FleetOperationsSection: React.FC<FleetOperationsSectionProps> = ({ kpis, onWhyClick }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-700/60 text-cyan-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>Operasional & Produktivitas Armada</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300">
                Utilisasi {kpis.fleetUtilizationPercent}%
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Evaluasi ketersediaan unit, jam operasional, efisiensi idle, dan pemenuhan SLA pengiriman
            </p>
          </div>
        </div>
      </div>

      {/* 4 Key Operational Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Fleet Availability */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Kesiapan Armada (Availability)</span>
            <Gauge className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">{kpis.vehicleAvailabilityPercent}%</div>
          <div className="text-[11px] text-slate-400">
            {kpis.activeVehiclesCount} unit siap operasi dari total {kpis.totalFleetCount} armada.
          </div>
        </div>

        {/* 2. Total Mileage & Trips */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Jarak & Ritase</span>
            <Truck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">
            {kpis.totalDistanceKm.toLocaleString('id-ID')} <span className="text-xs font-normal text-slate-400">km</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Menyelesaikan {kpis.totalTripsCompleted.toLocaleString('id-ID')} trip kargo logistik.
          </div>
        </div>

        {/* 3. Downtime Hours */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Jam Downtime</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">
            {kpis.totalDowntimeHours} <span className="text-xs font-normal text-slate-400">jam</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Rata-rata 6,1 jam/unit per bulan (perbaikan & overhaul).
          </div>
        </div>

        {/* 4. Excess Idle Time */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Excess Idling Mesin</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400">
            {kpis.totalExcessIdleHours} <span className="text-xs font-normal text-slate-400">jam</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Estimasi kerugian BBM akibat idle: ~Rp 48,2 Juta.
          </div>
        </div>
      </div>

      {/* SLA & On-Time Delivery Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Logistics SLA Fulfillment */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <PackageCheck className="w-4 h-4 text-emerald-400" />
              Tingkat Pemenuhan SLA Pengiriman Kargo
            </h3>
            <span className="text-xs font-bold text-emerald-400">{kpis.onTimeDeliveryRatePercent}% On-Time</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Total Delivery Orders:</span>
              <span className="font-semibold text-slate-200">{kpis.totalDeliveries} order</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Terlambat (Delayed):</span>
              <span className="font-semibold text-amber-400">{kpis.delayedDeliveries} order (3,7%)</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Gagal Kirim (Failed):</span>
              <span className="font-semibold text-rose-400">{kpis.failedDeliveries} order (0,6%)</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800">
              <span>Digital Proof of Delivery (e-POD):</span>
              <span className="font-semibold text-cyan-400">{kpis.podCompletionRatePercent}% Selesai</span>
            </div>
          </div>
        </div>

        {/* Operational Bottlenecks & Recommendations */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Bottleneck & Hambatan Lapangan
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Koridor logistik Cikarang Dry Port ke Tanjung Priok mengalami waktu antre bongkar muat rata-rata 48 menit per trip. Pemindahan jadwal ritase ke jam non-sibuk (malam hari) berpotensi memotong waktu tempuh hingga 35%.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Rekomendasi AI: Time Slot Booking</span>
            <button
              onClick={() => onWhyClick('delivery', 'Evaluasi Bottleneck Rute Pelabuhan')}
              className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Pelajari Detail</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
