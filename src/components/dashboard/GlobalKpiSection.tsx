/**
 * Fleet Intelligence Smart AI - Global & Fleet KPI Section
 * PROMPT 8 - Premium KPI cards with mobile horizontal scroll support & accessibility
 */

import React from 'react';
import { 
  Truck, 
  Activity, 
  Play, 
  PauseCircle, 
  Square, 
  WifiOff, 
  Navigation2, 
  MapPin, 
  Gauge, 
  Percent,
  Clock,
  Zap
} from 'lucide-react';
import { FleetKPIs } from '../../types/dashboard';
import { formatNumberIdr } from '../../services/dashboardService';

interface GlobalKpiSectionProps {
  kpis: FleetKPIs | null;
  isLoading: boolean;
  onStatusClick?: (status: string) => void;
}

export const GlobalKpiSection: React.FC<GlobalKpiSectionProps> = ({
  kpis,
  isLoading,
  onStatusClick,
}) => {
  if (isLoading || !kpis) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-2">
            <div className="h-3 w-1/2 bg-slate-800 rounded" />
            <div className="h-6 w-3/4 bg-slate-800 rounded" />
            <div className="h-2 w-full bg-slate-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const statusCards = [
    {
      id: 'total',
      label: 'TOTAL VEHICLES',
      value: formatNumberIdr(kpis.totalVehicles),
      subtext: kpis.totalVehiclesTrend,
      icon: Truck,
      color: 'border-slate-800 bg-slate-900/80 text-white',
      iconColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      statusQuery: 'all',
    },
    {
      id: 'moving',
      label: 'MOVING (BERGERAK)',
      value: formatNumberIdr(kpis.movingVehicles),
      subtext: `${Math.round((kpis.movingVehicles / kpis.totalVehicles) * 100)}% dari total fleet`,
      icon: Play,
      color: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400',
      iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      statusQuery: 'moving',
    },
    {
      id: 'idle',
      label: 'IDLE (MESIN NYALA)',
      value: formatNumberIdr(kpis.idleVehicles),
      subtext: 'Menunggu / bongkar muat',
      icon: PauseCircle,
      color: 'border-amber-500/30 bg-amber-950/20 text-amber-400',
      iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      statusQuery: 'idle',
    },
    {
      id: 'stopped',
      label: 'STOPPED (PARKIR)',
      value: formatNumberIdr(kpis.stoppedVehicles),
      subtext: 'Mesin mati di depo/pool',
      icon: Square,
      color: 'border-sky-500/30 bg-sky-950/20 text-sky-400',
      iconColor: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
      statusQuery: 'parking',
    },
    {
      id: 'offline',
      label: 'OFFLINE / NO SIGNAL',
      value: formatNumberIdr(kpis.offlineVehicles),
      subtext: 'Sinyal GPS / daya mati',
      icon: WifiOff,
      color: 'border-slate-700 bg-slate-900/60 text-slate-400',
      iconColor: 'text-slate-400 bg-slate-800 border-slate-700',
      statusQuery: 'offline',
    },
    {
      id: 'utilization',
      label: 'UTILISASI FLEET',
      value: `${kpis.fleetUtilizationPercent}%`,
      subtext: `Ketersediaan: ${kpis.fleetAvailabilityPercent}%`,
      icon: Percent,
      color: 'border-cyan-500/30 bg-cyan-950/20 text-cyan-300',
      iconColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      statusQuery: 'all',
    },
  ];

  const secondaryKpis = [
    { label: 'Perjalanan Hari Ini', value: `${kpis.tripsToday} Trip`, icon: Navigation2, sub: '32 In Progress' },
    { label: 'Jarak Tempuh Total', value: `${formatNumberIdr(kpis.distanceTodayKm)} KM`, icon: MapPin, sub: 'Rata-rata 194 KM/unit' },
    { label: 'Kecepatan Rata-rata', value: `${kpis.averageSpeedKmH} KM/Jam`, icon: Gauge, sub: 'Batas aman < 80 KM/H' },
    { label: 'Total Jam Mengemudi', value: `${formatNumberIdr(kpis.drivingHours)} Jam`, icon: Clock, sub: `Idle: ${kpis.idleHours} Jam` },
  ];

  return (
    <div className="space-y-3">
      {/* Primary KPI Status Cards (Horizontal scroll on mobile, 6-col grid on desktop) */}
      <div className="relative">
        <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto pb-2 sm:pb-0 scrollbar-none snap-x snap-mandatory">
          {statusCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => onStatusClick && onStatusClick(card.statusQuery)}
                className={`snap-start shrink-0 w-[180px] sm:w-auto text-left rounded-2xl border p-3.5 transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-md ${card.color}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">
                    {card.label}
                  </span>
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg border ${card.iconColor}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black tracking-tight text-white mb-0.5">
                  {card.value}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {card.subtext}
                </div>
              </button>
            );
          })}
        </div>
        {/* Mobile Swipe Hint Indicator */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 sm:hidden mt-1">
          <Zap className="h-3 w-3 text-cyan-400 animate-pulse" />
          <span>Geser horizontal untuk status selengkapnya ← swipe →</span>
        </div>
      </div>

      {/* Secondary Operational Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {secondaryKpis.map((sec, idx) => {
          const Icon = sec.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-3.5 backdrop-blur-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-cyan-400 border border-slate-700">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">
                  {sec.label}
                </p>
                <p className="text-base font-bold text-white tracking-tight truncate">
                  {sec.value}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {sec.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
