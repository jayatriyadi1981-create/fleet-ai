import React from 'react';
import { VehicleStatus, AlertSeverity } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'moving' | 'idle' | 'parking' | 'offline' | 'emergency' | 'maintenance' | 'critical' | 'warning' | 'info' | 'neutral' | 'success';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', size = 'sm' }) => {
  const getStyles = () => {
    switch (variant) {
      case 'moving':
      case 'success':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'idle':
      case 'warning':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'parking':
      case 'info':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'emergency':
      case 'critical':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'maintenance':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'offline':
      case 'neutral':
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border font-medium tracking-tight ${getStyles()} ${sizeStyles}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
      {children}
    </span>
  );
};

export const getVehicleStatusBadge = (status: VehicleStatus) => {
  const map: Record<VehicleStatus, { label: string; variant: any }> = {
    moving: { label: 'Moving (Bergerak)', variant: 'moving' },
    idle: { label: 'Idle (Mesin Nyala)', variant: 'idle' },
    parking: { label: 'Parkir (Mesin Mati)', variant: 'parking' },
    offline: { label: 'Offline (GPS Mati)', variant: 'offline' },
    emergency: { label: 'Emergency (SOS)', variant: 'emergency' },
    maintenance: { label: 'Maintenance (Bengkel)', variant: 'maintenance' },
    under_maintenance: { label: 'Perbaikan Bengkel', variant: 'maintenance' },
    archived: { label: 'Terarsip', variant: 'neutral' },
  };
  const item = map[status] || { label: status, variant: 'neutral' };
  return <Badge variant={item.variant}>{item.label}</Badge>;
};
