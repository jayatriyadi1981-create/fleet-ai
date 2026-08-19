/**
 * Fleet Intelligence Smart AI - Command Center KPI Ribbon
 * Real-time operational metrics cards with 1-click map filtering
 */

import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  PlayCircle, 
  StopCircle, 
  Clock, 
  WifiOff, 
  Wrench, 
  ShieldAlert 
} from 'lucide-react';
import { commandCenterService } from '../services/commandCenterService';
import { CommandCenterFleetKPIs, CommandCenterSavedFilter } from '../types/commandCenterTypes';

interface FleetKpiRibbonProps {
  onFilterSelect?: (filter: CommandCenterSavedFilter) => void;
}

export const FleetKpiRibbon: React.FC<FleetKpiRibbonProps> = ({ onFilterSelect }) => {
  const [kpis, setKpis] = useState<CommandCenterFleetKPIs>(commandCenterService.getKPIs());
  const [activeFilter, setActiveFilter] = useState<CommandCenterSavedFilter>(commandCenterService.getActiveFilter());

  useEffect(() => {
    const update = () => {
      setKpis(commandCenterService.getKPIs());
      setActiveFilter(commandCenterService.getActiveFilter());
    };
    update();
    const unsubscribe = commandCenterService.subscribe(update);
    return unsubscribe;
  }, []);

  const handleFilterClick = (filter: CommandCenterSavedFilter) => {
    const nextFilter = activeFilter === filter ? 'ALL' : filter;
    setActiveFilter(nextFilter);
    commandCenterService.setActiveFilter(nextFilter);
    if (onFilterSelect) {
      onFilterSelect(nextFilter);
    }
  };

  const cards = [
    {
      id: 'ALL' as CommandCenterSavedFilter,
      label: 'Total Armada',
      count: kpis.total,
      icon: Truck,
      color: 'border-slate-700 bg-slate-900/90 text-slate-100',
      activeColor: 'border-blue-500 bg-blue-950/50 text-white ring-1 ring-blue-500',
      iconColor: 'text-blue-400',
      subtext: 'Seluruh Unit Aktif',
    },
    {
      id: 'MOVING_ONLY' as CommandCenterSavedFilter,
      label: 'Bergerak (Moving)',
      count: kpis.moving,
      icon: PlayCircle,
      color: 'border-slate-700 bg-slate-900/90 text-slate-100',
      activeColor: 'border-emerald-500 bg-emerald-950/50 text-white ring-1 ring-emerald-500',
      iconColor: 'text-emerald-400',
      subtext: `${((kpis.moving / (kpis.total || 1)) * 100).toFixed(0)}% Utilisasi Jalan`,
      pulsing: true,
    },
    {
      id: 'ALL' as CommandCenterSavedFilter, // stopped filter
      label: 'Parkir (Stopped)',
      count: kpis.stopped,
      icon: StopCircle,
      color: 'border-slate-700 bg-slate-900/90 text-slate-100',
      activeColor: 'border-sky-500 bg-sky-950/50 text-white ring-1 ring-sky-500',
      iconColor: 'text-sky-400',
      subtext: 'Mesin Padam',
    },
    {
      id: 'ALL' as CommandCenterSavedFilter, // idle filter
      label: 'Idle / Standby',
      count: kpis.idle,
      icon: Clock,
      color: 'border-slate-700 bg-slate-900/90 text-slate-100',
      activeColor: 'border-amber-500 bg-amber-950/50 text-white ring-1 ring-amber-500',
      iconColor: 'text-amber-400',
      subtext: 'Mesin Hidup Diam',
    },
    {
      id: 'OFFLINE_ONLY' as CommandCenterSavedFilter,
      label: 'Offline (No Signal)',
      count: kpis.offline,
      icon: WifiOff,
      color: 'border-slate-700 bg-slate-900/90 text-slate-100',
      activeColor: 'border-slate-400 bg-slate-800 text-white ring-1 ring-slate-400',
      iconColor: 'text-slate-400',
      subtext: 'JT808 Timeout',
    },
    {
      id: 'CRITICAL_RISK' as CommandCenterSavedFilter,
      label: 'Maintenance / Bengkel',
      count: kpis.maintenance,
      icon: Wrench,
      color: 'border-slate-700 bg-slate-900/90 text-slate-100',
      activeColor: 'border-purple-500 bg-purple-950/50 text-white ring-1 ring-purple-500',
      iconColor: 'text-purple-400',
      subtext: 'Work Order Servis',
    },
    {
      id: 'EMERGENCY_ONLY' as CommandCenterSavedFilter,
      label: 'Emergency / SOS',
      count: kpis.emergency,
      icon: ShieldAlert,
      color: 'border-slate-700 bg-slate-900/90 text-slate-100',
      activeColor: 'border-rose-500 bg-rose-950/50 text-white ring-2 ring-rose-500',
      iconColor: 'text-rose-400',
      subtext: kpis.emergency > 0 ? 'Tindakan Segera!' : 'Kondisi Aman',
      alertBlink: kpis.emergency > 0,
    },
  ];

  return (
    <div className="bg-slate-950/90 border-b border-slate-800/80 px-3 py-2 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 z-20">
      <div className="flex items-center gap-2 min-w-max">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          const isSelected = activeFilter === card.id;

          return (
            <button
              key={`${card.label}-${idx}`}
              onClick={() => handleFilterClick(card.id)}
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border text-left transition-all duration-200 cursor-pointer ${
                isSelected ? card.activeColor : card.color
              } hover:border-slate-500`}
            >
              <div className={`p-1.5 rounded-md bg-slate-800/80 ${card.iconColor} ${card.alertBlink ? 'animate-bounce text-rose-500' : ''}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-bold font-mono tracking-tight text-white">
                    {card.count}
                  </span>
                  <span className="text-[11px] font-medium text-slate-300">
                    {card.label}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium -mt-0.5">
                  {card.subtext}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
