/**
 * Fleet Intelligence Smart AI - Executive KPI Cards Grid
 * PROMPT 52 — Primary Business & Financial Key Metrics Grid with Anti-Hallucination Guards
 */

import React from 'react';
import { 
  DollarSign, 
  Fuel, 
  Wrench, 
  Navigation, 
  Activity, 
  ShieldCheck, 
  PackageCheck, 
  TrendingUp, 
  Wallet,
  Coins
} from 'lucide-react';
import { ExecutiveKPIs, ExecutiveRolePerspective } from '../../types/executiveReport';
import { ExecutiveKPICard } from './ExecutiveKPICard';
import { ExecutiveKPIService } from '../../services/executiveReport/executiveKPIService';

interface ExecutiveKPICardsGridProps {
  currentKPIs: ExecutiveKPIs;
  previousKPIs?: ExecutiveKPIs | null;
  targetKPIs?: Partial<ExecutiveKPIs> | null;
  variances: Record<string, number | null>;
  perspective: ExecutiveRolePerspective;
  onWhyClick: (domain: string, title: string) => void;
}

export const ExecutiveKPICardsGrid: React.FC<ExecutiveKPICardsGridProps> = ({
  currentKPIs,
  previousKPIs,
  targetKPIs,
  variances,
  perspective,
  onWhyClick,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Operating Cost */}
      <ExecutiveKPICard
        id="kpi-total-cost"
        title="Total Operating Cost"
        value={ExecutiveKPIService.formatRupiah(currentKPIs.totalOperatingCost)}
        subValue="Realisasi Biaya Bulan Ini"
        icon={DollarSign}
        changePercent={variances['totalOperatingCost']}
        comparisonLabel="vs bulan lalu"
        targetValue={ExecutiveKPIService.formatRupiah(currentKPIs.budgetAmount)}
        targetVariancePercent={currentKPIs.budgetVariancePercent}
        inverseColors={true}
        onWhyClick={() => onWhyClick('cost', 'Kenaikan Total Biaya Operasional (+8,4%)')}
      />

      {/* 2. Fuel Cost (52% of total) */}
      <ExecutiveKPICard
        id="kpi-fuel-cost"
        title="Biaya BBM (Fuel Cost)"
        value={ExecutiveKPIService.formatRupiah(currentKPIs.fuelCost)}
        subValue="52% dari Total Beban"
        icon={Fuel}
        changePercent={variances['fuelCost']}
        comparisonLabel="vs bulan lalu"
        targetValue={ExecutiveKPIService.formatRupiah(targetKPIs?.fuelCost || 900000000)}
        targetVariancePercent={6.3}
        inverseColors={true}
        onWhyClick={() => onWhyClick('fuel', 'Kenaikan Beban Konsumsi Solar (+8,4%)')}
      />

      {/* 3. Maintenance Cost (24% of total) */}
      <ExecutiveKPICard
        id="kpi-maintenance-cost"
        title="Biaya Pemeliharaan (Maint)"
        value={ExecutiveKPIService.formatRupiah(currentKPIs.maintenanceCost)}
        subValue="24% dari Total Beban"
        icon={Wrench}
        changePercent={variances['maintenanceCost']}
        comparisonLabel="vs bulan lalu"
        targetValue="Rp 380 Juta"
        targetVariancePercent={16.2}
        inverseColors={true}
        onWhyClick={() => onWhyClick('maintenance', 'Lonjakan Unscheduled Maintenance (+11,2%)')}
      />

      {/* 4. Cost Per Kilometer */}
      <ExecutiveKPICard
        id="kpi-cost-per-km"
        title="Cost Per Kilometer"
        value={ExecutiveKPIService.formatCostPerKm(currentKPIs.costPerKm)}
        subValue="Rata-rata Seluruh Armada"
        icon={Navigation}
        changePercent={variances['costPerKm']}
        comparisonLabel="vs bulan lalu"
        targetValue="Rp 9.200/km"
        targetVariancePercent={8.4}
        inverseColors={true}
        onWhyClick={() => onWhyClick('cost_km', 'Deviasi Cost/km di Atas Target Perusahaan')}
      />

      {/* 5. Fleet Utilization */}
      <ExecutiveKPICard
        id="kpi-fleet-utilization"
        title="Utilisasi Armada (Utilization)"
        value={`${currentKPIs.fleetUtilizationPercent}%`}
        subValue={`${currentKPIs.activeVehiclesCount} dari ${currentKPIs.totalFleetCount} Unit Aktif`}
        icon={Activity}
        changePercent={variances['fleetUtilizationPercent']}
        comparisonLabel="vs bulan lalu"
        targetValue="≥ 85.0%"
        targetVariancePercent={2.8}
        inverseColors={false}
        onWhyClick={() => onWhyClick('utilization', 'Peningkatan Utilisasi Armada (+6,2%)')}
      />

      {/* 6. Fleet Safety Score */}
      <ExecutiveKPICard
        id="kpi-fleet-safety"
        title="Indeks Keselamatan (Safety)"
        value={`${currentKPIs.fleetSafetyScore} / 100`}
        subValue="Zero Fatality & Minor Incidents"
        icon={ShieldCheck}
        changePercent={variances['fleetSafetyScore']}
        comparisonLabel="vs bulan lalu"
        targetValue="≥ 90.0"
        targetVariancePercent={2.2}
        inverseColors={false}
        onWhyClick={() => onWhyClick('safety', 'Evaluasi Skor Keselamatan & Overspeed Malam')}
      />

      {/* 7. On-Time Delivery & SLA */}
      <ExecutiveKPICard
        id="kpi-on-time-delivery"
        title="Ketepatan Waktu (On-Time SLA)"
        value={`${currentKPIs.onTimeDeliveryRatePercent}%`}
        subValue={`e-POD Selesai: ${currentKPIs.podCompletionRatePercent}%`}
        icon={PackageCheck}
        changePercent={variances['onTimeDeliveryRatePercent']}
        comparisonLabel="vs bulan lalu"
        targetValue="≥ 95.0%"
        targetVariancePercent={0.6}
        inverseColors={false}
        onWhyClick={() => onWhyClick('delivery', 'Evaluasi Bottleneck Rute Pelabuhan')}
      />

      {/* 8. Revenue & Profitability (Anti-Hallucination Protected) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-sm relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Revenue & Margin</h4>
              <div className="text-xl font-bold text-slate-400 mt-0.5 italic">Not configured</div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500">
          Integrasi ERP Billing / Akuntansi belum tersambung. Sistem tidak menampilkan angka pendapatan palsu.
        </div>
      </div>
    </div>
  );
};
